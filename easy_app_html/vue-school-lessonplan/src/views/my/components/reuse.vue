<template>
  <div id="add-lesson-plan">
    <!--顶部导航-->
    <header>
      <p>复用
        <span @click="goBack">
          返回上一层
        </span>
      </p>
    </header>
    <!--主体部分-->
    <main>
      <vue-loading v-if="loading" type="spiningDubbles" color="#5AC1DD" :size="{ width: '50px', height: '50px' }"></vue-loading>
      <p class="title">
        <span>
          <i v-if="reuseAll.type === 1">教案标题：</i>
          <i v-if="reuseAll.type === 2">学案标题：</i>
          <img v-if="auth === 1  && reuseAll.type === 1" src="../../../assets/images/private.png">
          <img v-if="auth === 0  && reuseAll.type === 1" src="../../../assets/images/public.png">
        </span>
        <el-input v-model="title" :maxlength="50"></el-input>
      </p>
      <div class="main-body">
        <p class="operation-button-group">
          <el-button v-if="reuseAll.type === 1" @click="reference" @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true">
            引用模板
            <img v-if="borderOne" src="../../../assets/images/border.png">
          </el-button>
          
          <el-upload
            class="upload"
            :action="actionimport"
            :show-file-list="false"
            name="file"
            :on-success="successImport"
            :before-upload="handlePreview">
            <el-button  @mouseenter.native="borderTwo = false" @mouseleave.native="borderTwo = true">
              本地导入
              <img v-if="borderTwo" src="../../../assets/images/border.png">
            </el-button>
          </el-upload>
          
          <el-button @click="upload" @mouseenter.native="borderThree = false" @mouseleave.native="borderThree = true">
            <span v-if="reuseAll.type === 1">上传课件</span>
            <span v-if="reuseAll.type === 2">上传附件</span>
            <img v-if="borderThree" src="../../../assets/images/border.png">
          </el-button>
          
          <el-button @mouseenter.native="borderFour = false" @click="modelDownload" @mouseleave.native="borderFour = true">
            <span v-if="reuseAll.type === 1">教案导出</span>
            <span v-if="reuseAll.type === 2">学案导出</span>
            <img v-if="borderFour" src="../../../assets/images/border.png">
          </el-button>
          
          <el-button  v-if="reuseAll.type === 1" @click="setCommonLessonPlan" @mouseenter.native="borderSix = false" @mouseleave.native="borderSix = true">
            设为<span v-if="auth === 1">公</span><span v-if="auth === 0">私</span>有教案
            <img v-if="borderSix" src="../../../assets/images/border.png">
          </el-button>
        </p>
        <Ueditor @ready="editorReady" v-model="content" class="ueditor"></Ueditor>
        <div class="main-body-footer">
          <p>
            课件：
          </p>
          <el-row>
            <el-col :span="6" v-for="(item, index) in attenchmentList" :key="index">
               <el-popover
                placement="top"
                width="200"
                trigger="hover"
                v-if="item.fileName.length > 7"
                :content="item.fileName">
                <i slot="reference" @dblclick="dblDownloadAttenchment(item)" @click="downloadAttenchment(item)">{{item.fileName.slice(0, 7) + '...'}}</i>
              </el-popover>
              <i v-if="item.fileName.length <= 7" @dblclick="dblDownloadAttenchment(item)" @click="downloadAttenchment(item)">{{item.fileName}}</i>
              <span class="detele" @click="deteleAttachment(item)">
                删除
              </span>
            </el-col>
          </el-row>
          <div class="after-lesson">
            <el-row>
              <el-col :span="12">
                <span>课 后 小 结</span>
              </el-col>
              <el-col :span="12">
                <span @click="afterLessonSummary = false">
                  编辑
                </span>
                <!--<span>
                  删除
                </span>-->
              </el-col>
            </el-row>
            <div class="after-lesson-content" v-if="afterLessonSummary">
              {{summaryContent}}
            </div>
            <el-input type="textarea" :autofocus="true" v-model="summaryContent" :rows="4" v-else></el-input>
          </div>
          <div class="footer-button">
            <el-button @click="lessonPlanSave">
              保存
            </el-button>
            <el-button @click="goBack">
              取消
            </el-button>
          </div>
        </div>
      </div>
    </main>
    <!--上传课件弹出框-->
    <el-dialog
      title="上传附件"
      v-model="uploadDialogVisible"
      :show-close="false"
      class="upload-dialog"
      size="tiny">
      <div>
        <img src="../../../assets/images/upload.png">
        <el-upload
          ref="upload"
          name="file"
          :data="{'planId': planId}"
          class="upload-demo"
          :on-success="success"
          :before-upload="beforeAvatarUpload"
          :action="action"
          :auto-upload="false"
          multiple>
          <el-button v-if="uploadButtonShow" size="middle" type="primary" @mouseenter.native="uploadBorder = false" @mouseleave.native="uploadBorder = true">选择本地文件
            <img src="../../../assets/images/border.png" v-if="uploadBorder">
          </el-button>
          <!-- <p style="margin-top: 5px;" v-if="!uploadButtonShow" v-for="(item, index) in successName" :key="index">{{item.name}}</p> -->
        </el-upload>
        <p>上传须知：</p>
        <p>
          默认上传文件大小限制：OFFICE文件：20M，PDF文件：10M，纯文本：1M，FLASH文件：1024M，音频文件：2048M，图片文件：5M，电子书文件：200M
        </p>
      </div>
      <i @click="uploadDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadConfirm">确 定</el-button>
        <el-button type="primary" @click="uploadCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--复用弹出框-->
    <el-dialog
      title="复用"
      v-model="addLessonPlanDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      class="upload-dialog add-lesson-plan"
      size="tiny">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" v-if="addLessonPlanDialogVisible">
        <el-form-item label="学期：" prop="semesterValue">
          <el-select v-model="ruleForm.semesterValue" placeholder="请选择学期" @change="dialogSelectSemester">
            <el-option
              v-for="item in dialogSemesterList"
              :key="item.semesterId"
              :label="item.semesterName"
              :value="item.semesterId">
          </el-option>
          </el-select>
          <img src="../../../assets/images/small-star.png">
        </el-form-item>
        <el-form-item label="年级：" prop="gradeValue">
          <el-select v-model="ruleForm.gradeValue" placeholder="请选择年级" @change="dialogSelectGrade">
            <el-option
              v-for="item in dialogGradeList"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId">
            </el-option>
          </el-select>
          <img src="../../../assets/images/small-star.png">
        </el-form-item>
        <el-form-item label="学科：" prop="courseValue">
          <el-select v-model="ruleForm.courseValue" placeholder="请选择学科" @change="dialogSelectCourse">
            <el-option
              v-for="item in dialogCourseList"
              :key="item.curriculumChooiceId"
              :label="item.curriculumName"
              :value="item.curriculumChooiceId">
            </el-option>
          </el-select>
          <img src="../../../assets/images/small-star.png">
        </el-form-item>
        <el-form-item v-if="treeType === 1" label="周次：" prop="weekValue">
          <el-select v-model="ruleForm.weekValue" placeholder="请选择">
            <el-option
              v-for="item in dialogWeekList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <img src="../../../assets/images/small-star.png">
        </el-form-item>
        <el-form-item v-if="treeType === 1" label="课时：" prop="classValue">
          <el-select v-model="ruleForm.classValue" placeholder="请选择">
            <el-option
              v-for="item in dialogClassList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <img src="../../../assets/images/small-star.png">
        </el-form-item>
        <el-form-item label="教材：" prop="textbookValue">
          <el-select v-model="ruleForm.textbookValue" placeholder="请选择教材" @change="dialogSelectTextbook">
            <el-option
              v-for="item in textbookList"
              :key="item.textbookId"
              :label="item.textbookName"
              :value="item.textbookId">
            </el-option>
          </el-select>
          <img v-if="treeType === 2" src="../../../assets/images/small-star.png">
        </el-form-item>
        <el-form-item label="编目：" prop="lessonValue">
          <el-select v-model="ruleForm.lessonValue" placeholder="请选择教材编目">
            <el-option
              v-for="item in bookList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <img v-if="treeType === 2" src="../../../assets/images/small-star.png">
        </el-form-item>
      </el-form>
      <i @click="goBack"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addLessonPlanConfirm('ruleForm')">确 定</el-button>
        <el-button type="primary" @click="goBack">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Ueditor from '../../../components/Ueditor'
import vueLoading from 'vue-loading-template'
import querystring from 'querystring'
import { success, notice } from '../../../api/index.js'
import { mapGetters } from 'vuex'
import { TreeMenu } from '../../../api/tree'
export default {
  name: 'addStudy',
  components: {
    Ueditor,
    vueLoading
  },
  data () {
    return {
      dialogGradeList: [],
      dialogCourseList: [],
      dialogSemesterList: [],
      dialogWeekList: [],
      dialogClassList: [],
      textbookList: [],
      bookList: [],
      ruleForm: {
        semesterValue: '',
        gradeValue: '',
        courseValue: '',
        lessonValue: '',
        weekValue: '',
        classValue: '',
        textbookValue: ''
      },
      rules: {
        semesterValue: [
          {type: 'number', required: true, message: '请选择学期', trigger: 'change'}
        ],
        courseValue: [
          {type: 'number', required: true, message: '请选择学科', trigger: 'change'}
        ],
        gradeValue: [
          {type: 'number', required: true, message: '请选择年级', trigger: 'change'}
        ],
        lessonValue: [
          {message: '请选择教材编目', required: true, trigger: 'change'}
        ],
        weekValue: [
          {type: 'number', required: true, message: '请选择周次', trigger: 'change'}
        ],
        classValue: [
          {type: 'number', required: true, message: '请选择课时', trigger: 'change'}
        ],
        textbookValue: [
          {message: '请选择教材', required: true, trigger: 'change'}
        ]
      },
      canDbl: true,
      successName: [],
      uploadButtonShow: true,
      title: '',
      uploadDialogVisible: false,
      addLessonPlanDialogVisible: false,
      borderOne: true,
      borderTwo: true,
      borderThree: true,
      borderFour: true,
      borderFive: true,
      borderSix: true,
      uploadBorder: true,
      content: '',
      afterLessonSummary: true,
      parameter: '',
      filePath: '',
      summaryContent: '',
      auth: 1,
      planId: '',
      attenchmentList: [],
      reuseAll: '',
      editorContent: '',
      isSave: false,
      loading: false,
      userId: '',
      arrs: [],
      treeType: '',
      sectionId: '',
      successNum: 0
    }
  },
  methods: {
    addLessonPlanConfirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let parameter = {}
          parameter.semesterId = this.ruleForm.semesterValue
          this.dialogSemesterList.forEach((item, index) => {
            if (item.semesterId === this.ruleForm.semesterValue) {
              parameter.semesterName = item.semesterName
            }
          })
          parameter.gradeId = this.ruleForm.gradeValue
          this.dialogGradeList.forEach((item, index) => {
            if (item.gradeId === this.ruleForm.gradeValue) {
              parameter.gradeName = item.gradeName
            }
          })
          parameter.courseId = this.ruleForm.courseValue
          this.dialogCourseList.forEach((item, index) => {
            if (item.curriculumChooiceId === this.ruleForm.courseValue) {
              parameter.courseName = item.curriculumName
            }
          })
          this.$https.post(`/mine/lessonPlanSave`, querystring.stringify({
            semesterId: parameter.semesterId,
            sectionId: this.sectionId,
            sectionName: this.sectionName,
            gradeId: parameter.gradeId,
            gradeName: parameter.gradeName,
            courseId: parameter.courseId,
            courseName: parameter.courseName,
            textbookCatalogId: this.ruleForm.lessonValue,
            week: this.ruleForm.weekValue,
            hour: this.ruleForm.classValue,
            type: this.reuseAll.type,
            title: '',
            filePath: ''
          }))
          .then(res => {
            if (res.data.code === 1) {
              sessionStorage.planId = res.data.result
              sessionStorage.addLessonPlanDialogVisible = '1'
              this.addLessonPlanDialogVisible = false
            } else {
              notice(this, res.data.message, 2000)
            }
          })
        } else {
          return false
        }
      })
    },
    // 下载课件
    downloadAttenchment (item) {
      this.timer = setTimeout(() => {
        if (this.canDbl) {
          const path = document.querySelector('#contextPath').value
          window.location.href = `${path}/square/lessonPlanCourseWareDownload?attachmentId=${item.id}`
        }
        this.canDbl = true
      }, 700)
    },
    // 在线预览
    dblDownloadAttenchment (item) {
      clearTimeout(this.timer)
      this.canDbl = false
      const path = document.querySelector('#contextPath').value
      if ((item.fileName.indexOf('docx') !== -1) || (item.fileName.indexOf('ppt') !== -1) || (item.fileName.indexOf('word') !== -1) || (item.fileName.indexOf('pdf') !== -1) || (item.fileName.indexOf('xlsx') !== -1) || (item.fileName.indexOf('xls') !== -1)) {
        window.location.href = `${this.previewUrl}${path}/square/lessonPlanOfficePreview?attachmentId=${item.id}`
      } else {
        notice(this, '该课件不支持在线预览', 2000)
      }
    },
    // 教案导出
    modelDownload () {
      if (this.isSave) {
        if (this.content) {
          const path = document.querySelector('#contextPath').value
          window.location.href = `${path}/square/lessonPlanDownload?planId=${sessionStorage.planId}`
        } else {
          notice(this, '该文件没有具体内容，请勿导出！', 2000)
        }
      } else {
        notice(this, '请先保存！', 2000)
      }
    },
    handlePreview (file) {
      const isFile = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword'
      if (!isFile) {
        this.$message.error('文件只能是doc或者是docx格式')
        return false
      }
      this.loading = true
    },
    // 本地导入
    successImport (res) {
      if (res.code === 1) {
        this.content = res.result
        this.content = this.content.replace('<div style="width:595.0pt;margin-bottom:72.0pt;margin-top:72.0pt;margin-left:90.0pt;margin-right:90.0pt;">', '')
        this.htmlStr = this.htmlStr.replace('<div style="width:595.0pt;margin-bottom:36.0pt;margin-top:36.0pt;margin-left:36.0pt;margin-right:36.0pt;">', '')
        this.editorContent.setContent(this.content)
        this.isSave = false
        this.loading = false
        success(this, '导入成功', 1000)
      }
    },
    // 上传课件
    upload () {
      this.planId = sessionStorage.planId
      this.uploadDialogVisible = true
      this.uploadButtonShow = true
      this.successName = []
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },
    // 删除课件
    deteleAttachment (item) {
      this.$https.get(`/mine/lessonPlanCourseWareDelete?attachmentId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          success(this, '删除课件成功', 1000)
          this.getAttenchments()
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    uploadConfirm () {
      this.$refs.upload.submit()
      this.uploadDialogVisible = false
      this.loading = true
    },
    uploadCancel () {
      this.uploadDialogVisible = false
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },
    success (res, file, fileList) {
      if (res.code === 1) {
        this.successNum++
        if (this.successNum === fileList.length) {
          this.loading = false
          this.successNum = 0
        }
        this.uploadButtonShow = false
        this.getAttenchments()
      } else {
        notice(this, res.message, 2000)
      }
    },
    // 查询详情
    getDetails () {
      this.$https.get(`/square/lessonPlanDetail?planId=${this.reuseAll.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.parameter = res.data.result.plan
          this.title = this.parameter.title
          this.summaryContent = this.parameter.summarize
          this.$https.get(`/mine/lessonPlanHtmlRead?filepath=${this.parameter.filePath}`)
          .then(res => {
            this.content = res.data.result
            if (this.board.id) {
              sessionStorage.board = JSON.stringify(this.board)
            }
            if (sessionStorage.judge === '2') {
              this.content = JSON.parse(sessionStorage.board).html
              this.isSave = false
            }
          })
        }
      })
    },
    // 查询附件
    getAttenchments () {
      this.$https.get(`/square/lessonPlanDetail?planId=${sessionStorage.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.attenchmentList = res.data.result.attenchments
        }
      })
    },
    // 上传之前
    beforeAvatarUpload (file) {
      if (file.type.indexOf('image') !== -1 && file.type.size > 5242880) {
        this.$message.error('请上传5M以内的图片')
      }
      if (file.type.indexOf('audio') !== -1 && file.type.size > 2147483648) {
        this.$message.error('请上传2048M以内的音频')
      }
    },
    reference () {
      sessionStorage.templatePath = '/my/reuse'
      this.$router.push(`/my/referenceTemplate`)
    },
    // 返回上一层
    goBack () {
      this.editorContent.setHide()
      this.$router.push(sessionStorage.path)
    },
    // 富文本
    editorReady (instance) {
      setTimeout(() => {
        this.content = this.content.replace(/【\d{1}】/g, '')
        this.content = this.content.replace(/【\d{2}】/g, '')
        instance.setContent(this.content)
        this.editorContent = instance
        instance.addListener('contentChange', () => {
          this.content = instance.getContent()
          this.isSave = false
        })
      }, 200)
    },
    // 设置公有教案
    setCommonLessonPlan () {
      if (this.auth === 0) {
        this.auth = 1
        success(this, '设为私有教案成功', 1000)
      } else if (this.auth === 1) {
        this.auth = 0
        success(this, '设为公有教案成功', 1000)
      }
      sessionStorage.auth = this.auth
    },
    // 保存教案
    lessonPlanSave () {
      if (!(/^\s*$/g).test(this.title)) {
        this.$https.post(`/mine/lessonPlanHtmlSave`, querystring.stringify({
          planId: sessionStorage.planId,
          html: this.content
        }))
        .then(res => {
          this.filePath = res.data.result
          this.$https.post(`/mine/lessonPlanUpdate`, querystring.stringify({
            id: sessionStorage.planId,
            title: this.title,
            filePath: this.filePath,
            auth: this.auth,
            summarize: this.summaryContent
          }))
          .then(res => {
            if (res.data.code === 1) {
              success(this, '保存成功', 1000)
              this.isSave = true
              sessionStorage.judge = '0'
            } else if (res.data.code === -2) {
              notice(this, res.data.message, 2000)
            }
          })
        })
      } else {
        notice(this, '请输入标题', 2000)
      }
    },
    // 选择学期
    dialogSelectSemester () {
      this.getGradeAndCourseData()
      this.getWeekList()
      this.ruleForm.gradeValue = ''
      this.ruleForm.courseValue = ''
      this.ruleForm.lessonValue = ''
      this.ruleForm.textbookValue = ''
      this.ruleForm.weekValue = ''
      this.ruleForm.classValue = ''
    },
    // 选择年级
    dialogSelectGrade () {
      if (this.ruleForm.gradeValue) {
        this.$https.get(`/mine/lessonPlanCourseList?semesterId=${this.ruleForm.semesterValue}&sectionId=${this.sectionId}&gradeId=${this.ruleForm.gradeValue}`)
        .then(res => {
          if (res.data.code === 1) {
            this.dialogCourseList = res.data.result
          }
        })
      }
      this.ruleForm.courseValue = ''
      this.ruleForm.lessonValue = ''
      this.ruleForm.textbookValue = ''
      this.ruleForm.classValue = ''
    },
    // 选择科目
    dialogSelectCourse () {
      this.ruleForm.lessonValue = ''
      this.ruleForm.textbookValue = ''
      this.ruleForm.classValue = ''
      if (this.ruleForm.semesterValue && this.ruleForm.gradeValue && this.ruleForm.courseValue) {
        this.getBookList()
        this.getClassList()
      }
    },
    // 新增教案选择教材
    dialogSelectTextbook () {
      this.ruleForm.lessonValue = ''
      this.arrs = []
      this.$https.get(`/mine/lessonPlanTextbook?semesterId=${this.ruleForm.semesterValue}&sectionId=${this.sectionId}&gradeId=${this.ruleForm.gradeValue}&courseId=${this.ruleForm.courseValue}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result.length !== 0) {
            this.bookList = (res.data.result || []).filter(item => item.textbookId === Number(this.ruleForm.textbookValue))[0].textbookCatalog
            this.bookList.forEach((item) => {
              item.id = String(item.id)
            })
            this.bookList = new TreeMenu(this.bookList).init(1)
            this.sortData(this.bookList)
            this.bookList = this.arrs
          }
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学期信息
    getSemesterList () {
      this.$https.get(`/common/selectSemesterList`)
      .then(res => {
        if (res.data.code === 1) {
          this.dialogSemesterList = res.data.result
        } else if (res.data.code === -2) {
          // error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取教师对应的信息
    getGradeAndCourseData () {
      this.$https.get(`/common/selectGradeSimpleCourse?teacherId=${this.userId}&semesterId=${this.ruleForm.semesterValue}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result.length !== 0) {
            this.sectionId = res.data.result[0].courseList[0].sectionId
            this.sectionName = res.data.result[0].courseList[0].sectionName
            this.dialogGradeList = res.data.result
          } else {
            this.sectionId = ''
            this.dialogGradeList = []
          }
        }
      })
    },
    // 排列教材
    sortData (arr) {
      arr.forEach(item => {
        this.arrs.push({...item})
        if (item.children) {
          this.sortData(item.children)
        }
      })
    },
    // 获取教材列表
    getBookList () {
      this.$https.get(`/mine/lessonPlanTextbook?semesterId=${this.ruleForm.semesterValue}&sectionId=${this.sectionId}&gradeId=${this.ruleForm.gradeValue}&courseId=${this.ruleForm.courseValue}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result.length !== 0) {
            res.data.result.forEach((item) => {
              item.textbookId = String(item.textbookId)
            })
            this.textbookList = res.data.result
          }
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取课时信息
    getClassList () {
      this.$https.get(`/common/selectClassHourList?courseId=${this.ruleForm.courseValue}&gradeId=${this.ruleForm.gradeValue}&sectionId=${this.sectionId}&semesterId=${this.ruleForm.semesterValue}`)
      .then(res => {
        if (res.data.code === 1) {
          this.dialogClassList = []
          for (let i = 1; i < res.data.result + 1; i++) {
            this.dialogClassList.push({id: i, name: `第${i}课时`})
          }
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取周次
    getWeekList () {
      this.$https.get(`/common/selectSemesterDetail?semesterId=${this.ruleForm.semesterValue}&sectionId=${this.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.dialogWeekList = []
          for (let i = 1; i < res.data.result.weekNum + 1; i++) {
            this.dialogWeekList.push({id: i, name: `第${i}周`})
          }
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'my',
      'board',
      'judge',
      'previewUrl'
    ]),
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/mine/lessonPlanCourseWareUpload`
    },
    // 本地导入
    actionimport () {
      const path = document.querySelector('#contextPath').value
      return `${path}/mine/lessonPlanTemplateImport`
    }
  },
  created () {
    this.userId = this.user.user.loginUser.id
    if (this.my.id) {
      sessionStorage.reuse = JSON.stringify(this.my)
      this.reuseAll = this.my
    } else {
      this.reuseAll = JSON.parse(sessionStorage.reuse)
    }
    if (this.judge[0] === '1' || this.judge[0] === '2') {
      sessionStorage.judge = this.judge[0]
    }
    if (sessionStorage.judge === '1') {
      // this.addId()
    }
    this.getDetails()
    this.getSemesterList()
    this.$https.get(`/mine/lessonPlanSetting`)
    .then(res => {
      if (res.data.code === 1) {
        this.treeType = res.data.result.treetype
        if (this.treeType === 1) {
          this.rules.lessonValue[0].required = false
          this.rules.textbookValue[0].required = false
        }
      }
    })
    setTimeout(() => {
      if (sessionStorage.addLessonPlanDialogVisible === '1') {
        this.addLessonPlanDialogVisible = false
      } else {
        this.addLessonPlanDialogVisible = true
      }
    }, 600)
  }
}
</script>
<style lang="scss">
@import '../../../assets/scss/main.scss';
#add-lesson-plan{
  // 顶部导航
  header{
    height: 42px;
    background: #DDE6EF;
    box-sizing: border-box;
    padding:10px 20px;
    p{
      margin: 0;
      color: #78818E;
      cursor: pointer;
      span{
        height: 25px;
        line-height: 25px;
        float: right;
        padding-left: 30px;
        background: url(../../../assets/images/back.png) no-repeat;
        &:hover{
          color: #408EE6;
          background: url(../../../assets/images/back-active.png) no-repeat;
        }
      }
    }
  }
  // 主体
  main{
    position: relative;
    .vue-loading{
      position: absolute;
      left: 45%;
      top: 250px;
      z-index: 1000001;
    }
    .title{
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #ddd;
      span{
        font-size: 18px;
        margin-right: 20px;
        color: #666666;
        font-weight: bold;
        position: relative;
        i{
          font-style: normal;
        }
        img{
          position: absolute;
          right: -420px;
          z-index: 101;
          vertical-align: middle;
        }
      }
      .el-input{
        width: 400px;
      }
    }
    .main-body{
      width: 900px;
      margin: 20px auto;
      // 操作按钮组
      .operation-button-group{
        .upload{
          display: inline-block;
        }
        .el-button{
          position: relative;
          padding: 6px 15px;
          border-color: #408EE6;
          color: #408EE6;
          margin-right: 10px;
          &:hover{
            background: #408EE6;
            color: $white;
          }
          img{
            position: absolute;
            top: -2px;
          }
        }
      }
      // 富文本编辑器
      .ueditor {
        margin: 20px 0;
        width: 900px !important;
        #edui1{
          width: 900px !important;
        }
        div {
          div {
            .edui-editor-iframeholder {
              min-height: 600px;
            }
          }
        }
      }
      .main-body-footer{
        &>p{
          &>span{
            display: inline-block;
            margin-left: 20px;
            margin-top: 5px;
          }
        }
        &>.el-row{
          .el-col{
            padding-left: 30px;
            line-height: 36px;
          }
          i{
            margin-top: 5px;
            color: #408EE6;
            cursor: pointer;
            text-decoration: underline;
            font-style: normal;
          }
          span.detele{
            margin-left: 20px;
            cursor: pointer;
            display: inline-block;
            width: 30px;
            height: 26px;
            padding-left: 30px;
            color: #A2AECD;
            background: url(../../../assets/images/delete-icon.png) no-repeat;
            margin-left: 10px;
            line-height: 26px;
            &:hover{
              background: url(../../../assets/images/delete-icon-active.png) no-repeat;
              color: #FF6C60;
            }
          }
        }
        // 课后小结
        .after-lesson{
          margin-top: 20px;
          .el-row{
            .el-col:nth-child(1){
              span{
                display: inline-block;
                width: 153px;
                height: 38px;
                background: url(../../../assets/images/lan.png);
                color: #fff;
                text-align: center;
                line-height: 38px;
              }
            }
            .el-col:nth-child(2){
              padding-top: 5px;
              text-align: right;
              span{
                cursor: pointer;
                display: inline-block;
                width: 30px;
                height: 26px;
                line-height: 26px;
                margin-right: 10px;
                padding-left: 30px;
                background: url(../../../assets/images/delete-icon.png) no-repeat;
                color: #666666;
                &:hover{
                  background: url(../../../assets/images/delete-icon-active.png) no-repeat;
                  color: #FF6C60;
                }
              }
              span:nth-child(1){
                background: url(../../../assets/images/edit-icon.png) no-repeat;
                &:hover{
                  background: url(../../../assets/images/edit-icon-active.png) no-repeat;
                  color: #408EE6;
                }
              }
            }
          }
          .after-lesson-content{
            box-sizing: border-box;
            margin-top: -2px;
            border: 1px solid #C4C9D0;
            border-radius: 5px;
            height: 110px;
            padding: 20px;
            color: #707885;
          }
          .el-textarea{
            margin-top: -2px;
            textarea{
              resize: none;
            }
          }
        }
        // 底部按钮
        .footer-button{
          margin-top: 20px;
          text-align: center;
          .el-button{
            padding:8px 30px;
          }
          .el-button:first-child{
            border: 1px solid #408EE6;
            color: #408EE6;
            &:hover{
              background: #408EE6;
              color: $white;
            }
          }
          .el-button:nth-child(2){
            border: 1px solid #FF6C60;
            color: #FF6C60;
            &:hover{
              background: #FF6C60;
              color: $white;
            }
          }
        }
      }
    }
  }
  // 上传附件弹出框
  .upload-dialog{
    .el-dialog{
      width: 489px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      .el-dialog__header{
        text-align: center;
        padding:0;
        background: #3281F8;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        span{
          display: inline-block;
          width:100%;
          box-sizing: border-box;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          margin-top: 5px;
          padding: 20px;
          background: #fff;
          color: #408EE6;
          font-weight: normal;
        }
      }
      .el-dialog__body{
        border-top: 1px solid #ddd;
        text-align: center;
        padding: 46px 0;
        margin: 0 46px;
        &>div{
          padding-top: 20px;
          width: 360px;
          height: 280px;
          overflow-x: hidden;
          border: 1px solid #ddd;
          margin: 0 auto;
          .el-upload{
            margin-top: 20px;
            .el-button{
              position: relative;
              padding: 8px 40px;
              background: $white;
              color: #408EE6;
              &:hover{
                background: #408EE6;
                color: $white;
              }
              img{
                position: absolute;
                top:-2px;
                right: 5px;
              }
            }
          }
          &>p:nth-child(3){
            color: #FF6C60;
            text-align: left;
            padding-left: 10px;
            margin-top: 20px;
          }
          &>p:nth-child(4){
            text-align: left;
            padding: 10px;
            color: #B7C2D0;
          }
        }
        &>sup{
          position: absolute;
          top: 0;
          left: 20px;
          width: 35px;
          height: 5px;
          background: #9FD35D;
        }
        &>i{
          cursor: pointer;
          width: 22px;
          height: 22px;
          position: absolute;
          background: url(../../../assets/images/dialog-close.png) no-repeat;
          top: 15px;
          right: 10px;
          &:hover{
            background: url(../../../assets/images/dialog-close-hover.png) no-repeat;
          }
        }
      }
      .el-dialog__footer{
        .el-button{
          padding: 8px 28px;
        }
        .el-button:nth-child(1){
          border: 1px solid #408EE6;
          color: #408EE6;
          &:hover{
            background: #408EE6;
            color: $white;
          }
        }
        .el-button:nth-child(2){
          border: 1px solid #FF6C60;
          color: #FF6C60;
          background: #fff;
          margin-right: 95px;
          &:hover{
            background: #FF6C60;
            color: $white;
          }
        }
      }
    }
  }
  // 新增教案弹出框
  .add-lesson-plan{
    .el-dialog{
      width: 488px;
      .el-dialog__body{
        text-align: left;
        padding-top: 30px;
        .el-form-item{
          img{
            position: absolute;
            top: 10px;
            right: -20px;
          }
        }
        .el-form-item__label::before{
          display: none;
        }
        .el-select{
          width: 300px;
        }
        .el-form-item__error{
          left: 62px !important;
        }
      }
      .el-dialog__footer{
        .el-button:last-child{
          margin-right: 90px;
        }
      }
    }
  }
  span.mark-disabled{
    display: none !important;
  }
}
</style>
