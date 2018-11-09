<template>
  <div id="lesson">
    <!--头部筛选-->
    <header>

      <!--学期-->
      <div class="semester">
        <span>学期：</span>
        <el-select v-model="semesterValue" @change="semesterSelect">
          <el-option
            v-for="item in semesterList"
            :key="item.semesterId"
            :label="item.semesterName"
            :value="item.semesterId">
          </el-option>
        </el-select>
      </div>

      <transition name="slide-down" mode="out-in">
        <div class="grade">
          <i>年级：</i>
          <span  v-for="(item, index) in gradeList" :key="index" @click="gradeSelect(item, index)" v-bind:class="{active: gradeActive===index}">
            {{ item.gradeName }}
          </span>
        </div>
      </transition>

      <!--学科-->
      <transition name="slide-down" mode="out-in">
        <div class="course" v-if="courseList.length !== 0">
          <i>学科：</i>
          <div>
            <span  v-for="(item, index) in courseList" :key="index" @click="courseSelect(item, index)" v-bind:class="{active: courseActive===index}">
              {{ item.curriculumName }}
            </span>
          </div>
          
        </div>
      </transition>

      <!--分类-->
      <div class="category">
        <i>分类：</i>
        <span  v-for="(item, index) in categoryList" :key="index" @click="categorySelect(item, index)" v-bind:class="{active: categoryActive===index}">
          {{ item.name }}
        </span>
      </div>

      <!--搜索-->
      <p class="search">
        <i>搜索：</i>
        <transition-group name="slide-left" mode="out-in">
          <span  v-for="(item, index) in searchList" :key="index">
            {{ item.name }}
            <span @click="delSearList(item, index)">X</span>
          </span>
        </transition-group>
        <b v-if="searchList.length !== 0" @click="clearSearch">清空筛选</b>
      </p>
      <div class="recevied-num" v-if="receviedNum !== 0">{{ receviedNum }}</div>
    </header>

    <!--主体部分-->
    <main>
      <div class="main-left">
        <p>
          {{ navGradeName }}<span v-if="navCourseName">-{{ navCourseName }}</span>
        </p>
        <div class="main-left-body">
          <el-tree
            class="filter-tree"
            :data="classTree"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :highlight-current="true"
            :render-content="renderContent"
            >
          </el-tree>
        </div>
      </div>
      <div class="main-right">
        
        <el-row class="operation-button">
          <el-col :span="15">
            <el-button @click="addLessonPlan" @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true">
              新增教案
              <img v-if="borderOne" src="../../../assets/images/border.png">
            </el-button>
            
            <el-button @click="addStudyCase" @mouseenter.native="borderTwo = false" @mouseleave.native="borderTwo = true">
              新增学案
              <img v-if="borderTwo" src="../../../assets/images/border.png">
            </el-button>
            
            <el-button @click="batchDelete" @mouseenter.native="borderThree = false" @mouseleave.native="borderThree = true">
              批量删除
              <img v-if="borderThree" src="../../../assets/images/border.png">
            </el-button>
          </el-col>
          <el-col :span="9">
            <el-input placeholder="输入关键字检索" :maxlength="50" @keyup.enter.native="handleIconClick" :on-icon-click="handleIconClick" v-model="title"  icon="search"></el-input>
          </el-col>
        </el-row>

        <p style="text-align: center;margin-top: 20px;color: #636C7F;" class="no-result" v-if="list.length === 0">暂无数据</p>
        
        <el-row class="main-right-body" v-for="(item, index) in list" :key="index">
          <el-col :span="1">
            <el-checkbox @change="addDelete(item)" v-model="item.checked"></el-checkbox>
          </el-col>

          <el-col :span="23">
            <el-row @click.native="lookDetails(item)" style="cursor: pointer;">
              <span v-if="item.title.length > 25">
                {{ '《' + item.title.slice(0, 25) + '...' + '》' }}
              </span>
              <span v-else>
                {{ '《' + item.title + '》' }}
              </span>
              <img v-if="item.type === 1" src="../../../assets/images/jiao.png">
              <img v-if="item.type === 2" src="../../../assets/images/xue.png">
            </el-row>

            <el-row>
              <span>学科：{{ item.courseName }}</span>
              <span>年级：{{ item.gradeName }}</span>
              <span>作者：{{ item.createdUserName }}</span>
              <span>发表时间：{{ item.createdTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</span>
              <img v-if="item.type === 1 && item.auth === 0" src="../../../assets/images/public.png">
              <img v-if="item.type === 1 && item.auth === 1" src="../../../assets/images/private.png">
            </el-row>

            <el-row>
              <div>
                <span>
                  <img src="../../../assets/images/comment.png">评论：{{ item.commentNum ? item.commentNum : 0 }}
                </span>
                <span>
                  <img src="../../../assets/images/collect.png">收藏：{{ item.collectionNum ? item.collectionNum : 0 }}
                </span>
                <span>
                  <img src="../../../assets/images/score.png">评分：{{ item.score ? item.score : 0 }}
                </span>
              </div>
              <div>
                <el-button class="create-learn-case" @click="creatStudy(item)" v-if="item.type === 1">生成学案</el-button>
                <el-button class="update" @click="edit(item)">编辑</el-button>
                <el-button class="delete" @click="del(item)">删除</el-button>
                <el-button class="prepare-lesson" @click="prepareLesson(item)" v-if="item.type === 1">协同备课</el-button>
              </div>
            </el-row>
            
          </el-col>
        </el-row>

        <!--分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </main>
    <!--删除弹出框-->
    <el-dialog
      title="删除提示"
      v-model="deleteDialogVisible"
      :show-close="false"
      class="delete-dialog"
      size="tiny">
      <img src="../../../assets/images/delete-warning.png"><span>您确定要删除这
        <span v-if="deleteGroup === 1">1</span>
        <span v-if="deleteGroup === 2">{{ deleteList.length }}</span>
        项？</span>
      <p>
        删除后将无法还原
      </p>
      <i @click="deleteDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delConfirm">确 定</el-button>
        <el-button type="primary" @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--正在删除弹出框-->
    <el-dialog
      class="deleting"
      v-model="deletingDialogVisible"
      :show-close="false"
      size="tiny">
      <span>
        <vue-loading v-if="!deleteSuccess" type="spiningDubbles" color="#ffffff" :size="{ width: '20px', height: '20px' }"></vue-loading>
        <img v-if="deleteSuccess" style="margin-top: 2px;" src="../../../assets/images/success.png">  
        <span v-if="!deleteSuccess">正在删除</span>
        <span v-if="deleteSuccess" class="delete-success">删除成功</span>
      </span>
    </el-dialog>

    <!--协同备课弹出框-->
    <el-dialog
      title="协同备课"
      v-model="prepareLessonDialogVisible"
      :show-close="false"
      class="prepare-lesson-dialog delete-dialog"
      size="tiny">
      <p>
        <span>
          截止时间：
        </span>
        <el-date-picker
          v-model="dateValue"
          type="date"
          placeholder="请选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </p>
      <p>
        <span>
          受邀教师：
        </span>
        <span class="invited-teacher" @click="teacherBowShow">
          <span style="color: #97A8BE;" v-if="selectedTeacherList.length === 0">请选择受邀老师</span>
          <span v-for="(item, index) in selectedTeacherList" :key="index">
            {{ item.name }}
            <b style="font-weight: normal;" v-if="index + 1 !== selectedTeacherList.length">、</b>
          </span>
          <i>
          </i>
          <!-- <img src=""> -->
        </span>
      </p>
      <transition name="slide-left" mode="out-in">
        <div class="teacher" v-if="teacherShow">
          <div class="teacher-left">
            <el-tree
              class="filter-tree"
              show-checkbox
              :data="tree"
              :props="defaultProps"
              node-key="userId"
              ref="tree"
              @check-change="changeTeacher"
              >
            </el-tree>
          </div>
          <div class="teacher-right">
            <p class="has-selected-teacher" v-for="(item, index) in selectedTeacherList" :key="index">
              {{ item.name }}
              <img @click="deleteUser(item, index)" src="../../../assets/images/name-close.png">
            </p>
          </div>
          <span class="select-teacher-button">
            <el-button @click="teacherShow = false">确定</el-button>
            <el-button @click="teacherShow = false">取消</el-button>
          </span>
        </div>
      </transition>
      
      <i @click="prepareLessonDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="prepareLessonConfirm">确 定</el-button>
        <el-button type="primary" @click="prepareLessonDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    
    <!--新增教案弹出框-->
    <el-dialog
      :title="lessonOrStudy"
      v-model="addLessonPlanDialogVisible"
      :show-close="false"
      class="delete-dialog add-lesson-plan"
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
      <i @click="addLessonPlanDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addLessonPlanConfirm('ruleForm')">确 定</el-button>
        <el-button type="primary" @click="addLessonPlanDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>
<script>
import vueLoading from 'vue-loading-template'
import { success, notice, error } from '../../../api/index.js'
import querystring from 'querystring'
import { mapActions, mapGetters } from 'vuex'
import { TreeMenu } from '../../../api/tree'
import { dateFormatT } from '../../../filters/index.js'
export default {
  name: 'lesson',
  components: {
    vueLoading
  },
  data () {
    return {
      navGradeName: '',
      navCourseName: '',
      selectedTeacherList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      receviedNum: 0,
      teacherShow: false,
      dateValue: '',
      deleteSuccess: false,
      deletingDialogVisible: false,
      addLessonPlanDialogVisible: false,
      addStudyCaseDialogVisible: false,
      prepareLessonDialogVisible: false,
      deleteDialogVisible: false,
      borderOne: true,
      borderTwo: true,
      type: '',
      sectionId: '',
      gradeId: '',
      courseId: '',
      parentId: '',
      textbookId: '',
      textbookList: '',
      title: '',
      week: '',
      hour: '',
      pageNo: 1,
      pageCount: 10,
      borderThree: true,
      semesterValue: '',
      sectionActive: '',
      gradeActive: '',
      courseActive: '',
      categoryActive: '',
      lessonOrStudy: '',
      ruleForm: {
        semesterValue: '',
        gradeValue: '',
        textbookValue: '',
        courseValue: '',
        lessonValue: '',
        weekValue: '',
        classValue: ''
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
      list: [],
      semesterList: [],
      sectionList: [],
      gradeList: [],
      courseList: [],
      classHourList: [],
      dialogGradeList: [],
      dialogCourseList: [],
      dialogSemesterList: [],
      dialogWeekList: [],
      dialogClassList: [],
      bookList: [],
      deleteList: [],
      categoryList: [
        {id: '', name: '全部'},
        {id: '1', name: '教案'},
        {id: '2', name: '学案'}
      ],
      searchList: [],
      semesterId: '',
      deleteId: '',
      deleteIdList: '',
      deleteGroup: '',
      totalCount: 0,
      userId: '',
      sectionName: '',
      teacherList: [],
      tree: [],
      treeType: '',
      classTree: [],
      arrs: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    ...mapActions([
      'my',
      'detail',
      'board',
      'judge'
    ]),
    renderContent (h, { node, data, store }) {
      const pop = (
        <el-popover
          placement="top"
          width="100"
          trigger="hover">
          <p tyle="color: #808080">{ data.name }</p>
          <span slot="reference">{ data.name.slice(0, 12) + '...' }</span>
        </el-popover>
      )
      return (
        <span>
          { data.name.length >= 12 ? pop : data.name }
        </span>
      )
    },
    handleNodeClick (val) {
      if (this.treeType === 1) {
        this.week = val.week
        if (val.hour) {
          this.hour = val.hour
        } else {
          this.hour = ''
        }
        this.getLessonPlanList()
      } else if (this.treeType === 2) {
        if (val.textbookId) {
          this.parentId = ''
          this.textbookId = val.textbookId
        } else {
          this.parentId = val.id
          this.textbookId = 0
        }
        this.getLessonPlanList()
      }
    },
    teacherBowShow () {
      this.teacherShow = !this.teacherShow
      setTimeout(() => {
        this.$refs.tree.setCheckedNodes(this.selectedTeacherList)
      }, 200)
    },
    deleteUser (item, index) {
      this.selectedTeacherList.splice(index, 1)
      this.$refs.tree.setCheckedNodes(this.selectedTeacherList)
    },
    changeTeacher (a, b) {
      if (a.deptId) {
        if (b === true) {
          if ((this.selectedTeacherList.filter(item => item.userId === a.userId)).length === 0) {
            this.selectedTeacherList.push(a)
          }
        } else {
          var list = []
          this.selectedTeacherList.forEach((m, index) => {
            if (m.userId !== a.userId) {
              list.push(m)
            }
          })
          this.selectedTeacherList = list
        }
      }
    },
    // 生成学案
    creatStudy (item) {
      this.$https.post(`/mine/lessonPlanSave`, querystring.stringify({
        semesterId: this.semesterValue,
        sectionId: this.sectionId,
        sectionName: this.sectionName,
        gradeId: item.gradeId,
        gradeName: item.gradeName,
        courseId: item.courseId,
        courseName: item.courseName,
        textbookCatalogId: item.textbookCatalogId,
        week: item.week,
        hour: item.hour,
        type: 2,
        title: '',
        filePath: ''
      }))
      .then(res => {
        var id = res.data.result
        this.my(item)
        this.board('1')
        this.$router.push({path: `/my/addStudy`, query: {createdId: id}})
      })
    },
    // 查看详情
    lookDetails (item) {
      this.detail(item)
      this.$router.push({path: '/my/lessonView', query: {pageNo: this.pageNo}})
    },
    // 搜索
    handleIconClick () {
      this.getLessonPlanList()
    },
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
            type: this.type,
            title: '',
            filePath: ''
          }))
          .then(res => {
            if (res.data.code === 1) {
              parameter.planId = res.data.result
              this.addLessonPlanDialogVisible = false
              if (this.type === 1) {
                this.my(parameter)
                this.board('1')
                this.judge('1')
                sessionStorage.title = ''
                sessionStorage.auth = 1
                sessionStorage.mark = '/my/lesson'
                this.$router.push('/my/addLessonPlan')
              } else if (this.type === 2) {
                this.my(parameter)
                this.board('1')
                this.judge('1')
                this.$router.push(`/my/addStudy`)
              }
            } else {
              notice(this, res.data.message, 2000)
            }
          })
        } else {
          return false
        }
      })
    },
    // 新增教案选择学期
    dialogSelectSemester () {
      this.getGradeAndCourseData()
      this.getWeekList()
      this.ruleForm.gradeValue = ''
      this.ruleForm.courseValue = ''
      this.ruleForm.lessonValue = ''
      this.ruleForm.weekValue = ''
      this.ruleForm.classValue = ''
      this.ruleForm.textbookValue = ''
    },
    // 新增教案选择年级
    dialogSelectGrade () {
      if (this.ruleForm.gradeValue) {
        this.$https.get(`/mine/lessonPlanCourseList?semesterId=${this.ruleForm.semesterValue}&sectionId=${this.sectionId}&gradeId=${this.ruleForm.gradeValue}`)
        .then(res => {
          if (res.data.code === 1) {
            this.dialogCourseList = res.data.result
            if (res.data.result.length !== 0) {
              this.ruleForm.courseValue = res.data.result[0].curriculumChooiceId
            }
          }
        })
      }
      this.ruleForm.courseValue = ''
      this.ruleForm.lessonValue = ''
      this.ruleForm.classValue = ''
      this.ruleForm.textbookValue = ''
    },
    // 新增教案选择科目
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
      this.arrs = []
      this.ruleForm.lessonValue = ''
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
    // 新增教案
    addLessonPlan () {
      this.lessonOrStudy = '新增教案'
      this.type = 1
      this.addLessonPlanDialogVisible = true
      this.ruleForm = {
        semesterValue: '',
        gradeValue: '',
        courseValue: '',
        lessonValue: '',
        weekValue: '',
        classValue: '',
        textbookValue: ''
      }
      this.getSemesterList()
    },
    // 新增学案
    addStudyCase () {
      this.lessonOrStudy = '新增学案'
      this.type = 2
      this.addLessonPlanDialogVisible = true
      this.ruleForm = {
        semesterValue: '',
        gradeValue: '',
        courseValue: '',
        lessonValue: '',
        weekValue: '',
        classValue: '',
        textbookValue: ''
      }
      this.getSemesterList()
    },
    pickerOptions () {
    },
    // 编辑
    edit (item) {
      if (item.type === 1) {
        this.my(item)
        this.board('1')
        this.judge('1')
        sessionStorage.mark = '/my/lesson'
        sessionStorage.auth = item.auth
        this.$router.push({path: `/my/addLessonPlan`, query: {pageNo: this.pageNo}})
      } else if (item.type === 2) {
        this.my(item)
        this.board('1')
        this.$router.push({path: `/my/addStudy`, query: {pageNo: this.pageNo}})
      }
    },
    // 协同备课按钮
    prepareLesson (item) {
      this.prepareLessonDialogVisible = true
      this.planId = item.id
      this.dateValue = ''
      this.selectedTeacherList = []
      this.getDeptList()
    },
    // 协同备课确定
    prepareLessonConfirm () {
      if (this.dateValue !== '') {
        if (this.selectedTeacherList.length !== 0) {
          this.endTime = dateFormatT(this.dateValue.getTime() + 86400000, 'yyyy-MM-dd hh:mm:ss')
          let json = []
          this.selectedTeacherList.forEach((item, index) => {
            json.push({id: item.userId, name: item.name})
          })
          this.$https.get(`/mine/synergyUpdate?planId=${this.planId}&json=${JSON.stringify(json)}&endTime=${this.endTime}`)
          .then(res => {
            if (res.data.code === 1) {
              this.prepareLessonDialogVisible = false
              success(this, '协同备课成功', 1000)
              this.$router.push('/my/collaborate')
              this.my('11')
              this.getReceviedNum()
            } else if (res.data.code === -2) {
              notice(this, res.data.message, 2000)
            }
          })
        } else {
          notice(this, '请选择受邀老师', 2000)
        }
      } else {
        notice(this, '请选择截止时间', 2000)
      }
    },
    // 批量删除
    batchDelete () {
      if ((this.list.filter(item => item.checked).length === 0)) {
        notice(this, '您还没有选中要删除的对象', 2000)
      } else {
        this.deleteDialogVisible = true
        this.deleteGroup = 2
      }
    },
    addDelete (item, index) {
      this.deleteIdList = this.list.filter(item => item.checked).map(n => n.id).join(',')
      this.deleteList = this.list.filter(item => item.checked)
    },
    // 删除按钮
    del (item) {
      this.deleteDialogVisible = true
      this.deleteId = item.id
      this.deleteGroup = 1
    },
    // 删除确定
    delConfirm () {
      if (this.deleteGroup === 1) {
        this.$https.get(`/mine/lessonPlanDelete?planId=${this.deleteId}`)
        .then(res => {
          if (res.data.code === 1) {
            this.deleteDialogVisible = false
            this.deletingDialogVisible = true
            this.getReceviedNum()
          } else if (res.data.code === -2) {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.deleteGroup === 2) {
        this.$https.get(`/mine/lessonPlanDeleteBatch?ids=${this.deleteIdList}`)
        .then(res => {
          if (res.data.code === 1) {
            this.deleteDialogVisible = false
            this.deletingDialogVisible = true
            this.getReceviedNum()
          }
        })
      }
    },
    handleSizeChange (val) {
      this.pageCount = val
      this.getLessonPlanList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getLessonPlanList()
    },
    // 清空搜索列表
    clearSearch () {
      this.searchList = []
      this.gradeId = ''
      this.courseId = ''
      this.type = ''
      this.parentId = ''
      this.week = ''
      this.hour = ''
      this.getLessonPlanList()
    },
    // 删除搜索列表
    delSearList (item, index) {
      this.searchList.splice(index, 1)
      if (item.type === 'grade') this.gradeId = ''
      if (item.type === 'course') this.courseId = ''
      if (item.type === 'category') this.type = ''
      if (item.type === 'grade' || item.type === 'course') {
        this.parentId = ''
        this.week = ''
        this.hour = ''
      }
      this.getLessonPlanList()
    },
    // 选择学期
    semesterSelect () {
      this.getGradeAndCourseData()
      this.searchList = []
      this.courseList = []
      this.courseId = ''
      this.gradeId = ''
      this.type = ''
      this.getLessonPlanList()
    },
    // 选择年级
    gradeSelect (item, index) {
      this.gradeActive = index
      this.gradeId = item.gradeId
      let n = 0
      n = (this.searchList.filter(item => item.type === 'grade')).length
      if (n === 0) {
        this.searchList.push({id: item.gradeId, name: item.gradeName, type: 'grade'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'grade') {
            if (item.gradeId === val.id) {
              this.searchList.splice(index, 1)
              this.gradeId = ''
              this.courseId = ''
              return
            }
            this.searchList.splice(index, 1, {id: item.gradeId, name: item.gradeName, type: 'grade'})
          }
        })
      }
      this.courseList = (this.gradeList || []).filter(child => child.gradeId === item.gradeId)[0].courseList
      this.getLessonPlanList()
      this.searchList.forEach((item, index) => {
        if (item.type === 'course') this.searchList.splice(index, 1)
      })
    },
    // 选择学科
    courseSelect (item, index) {
      this.courseActive = index
      this.courseId = item.curriculumChooiceId
      let n = 0
      n = (this.searchList.filter(item => item.type === 'course')).length
      if (n === 0) {
        this.searchList.push({id: item.curriculumChooiceId, name: item.curriculumName, type: 'course'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'course') {
            if (item.curriculumChooiceId === val.id) {
              this.searchList.splice(index, 1)
              this.courseId = ''
              return
            }
            this.searchList.splice(index, 1, {id: item.curriculumChooiceId, name: item.curriculumName, type: 'course'})
          }
        })
      }
      this.getLessonPlanList()
      this.getLessonPlanParentTree()
    },
    // 选择分类
    categorySelect (item, index) {
      this.categoryActive = index
      this.type = item.id
      let n = 0
      n = (this.searchList.filter(item => item.type === 'category')).length
      if (n === 0) {
        this.searchList.push({id: item.id, name: item.name, type: 'category'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'category') {
            if (item.id === val.id) {
              this.searchList.splice(index, 1)
              this.type = ''
              return
            }
            this.searchList.splice(index, 1, {id: item.id, name: item.name, type: 'category'})
          }
        })
      }
      this.getLessonPlanList()
    },
    // 获取学期信息
    getSemesterList () {
      this.$https.get(`/common/selectSemesterList`)
      .then(res => {
        if (res.data.code === 1) {
          if (this.addLessonPlanDialogVisible) {
            this.dialogSemesterList = res.data.result
            this.ruleForm.semesterValue = (res.data.result || []).filter(item => item.state === 1)[0].semesterId
          } else {
            this.semesterList = res.data.result
            if (this.semesterList.length !== 0) {
              this.semesterValue = (res.data.result || []).filter(item => item.state === 1)[0].semesterId
              this.getGradeAndCourseData()
              this.getReceviedNum()
            }
          }
        } else if (res.data.code === -2) {
          error(this)
        } else {
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
          if (this.dialogClassList.length !== 0) {
            this.ruleForm.classValue = this.dialogClassList[0].id
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
          if (this.dialogWeekList !== 0) {
            this.ruleForm.weekValue = this.dialogWeekList[0].id
          }
          this.ruleForm.weekValue = parseInt((new Date().getTime() - new Date(res.data.result.startDate).getTime()) / 604800000)
          if (this.ruleForm.weekValue + 2 < 22) {
            this.ruleForm.weekValue = this.ruleForm.weekValue + 2
          }
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
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
    // 获取部门
    getDeptList () {
      this.$https.get(`/common/selectDeptList?semesterId=${this.semesterValue}`)
      .then(res => {
        this.teacherList = res.data.result
        if (res.data.code === 1) {
          if (res.data.result.length === 0) return
          res.data.result.forEach((item, index) => {
            this.$https.get(`/common/selectDeptUserList?deptId=${item.id}&keyword=${''}`)
            .then(res => {
              res.data.result.forEach((item, index) => {
                if (item.userId === this.userId) {
                  res.data.result.splice(index, 1)
                }
              })
              this.teacherList = this.teacherList.concat(res.data.result.map(item => ({...item, parentId: item.deptId})))
              this.tree = new TreeMenu(this.teacherList).init(0)
            })
          })
        }
      })
    },
    // 获取我的教案列表
    getLessonPlanList () {
      this.$https.get(`/mine/lessonPlanList?type=${this.type}&semesterId=${this.semesterValue}&sectionId=${this.sectionId}&gradeId=${this.gradeId}&courseId=${this.courseId}&title=${this.title}&parentId=${this.parentId}&week=${this.week}&hour=${this.hour}&pageNo=${this.pageNo}&pageSize=${this.pageCount}&textbookId=${this.textbookId}`)
      .then(res => {
        if (res.data.code === 1) {
          let a = 0
          res.data.result.list = res.data.result.list.map(item => ({...item, checked: false}))
          res.data.result.list.forEach((item, index) => {
            if (!item.title) {
              this.$https.get(`/mine/lessonPlanDelete?planId=${item.id}`)
              .then(response => {
                a++
                res.data.result.list.splice(index, 1)
              })
            }
          })
          this.list = res.data.result.list
          this.totalCount = res.data.result.totalCount - a
        } else if (res.data.code === -2) {
          // notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取教案列表树
    getLessonPlanParentTree () {
      this.$https.get(`/mine/lessonPlanParentTree?semesterId=${this.semesterValue}&sectionId=${this.sectionId}&gradeId=${this.gradeId}&courseId=${this.courseId}`)
      .then(res => {
        if (res.data.code === 1) {
          if (this.treeType === 1) {
            res.data.result.dataList.forEach((item) => {
              item.children = item.childs
            })
            let obj = [
              {
                name: '课时',
                id: '',
                week: '',
                hour: '',
                children: []
              }
            ]
            obj[0].children = res.data.result.dataList
            this.classTree = obj
          } else if (this.treeType === 2) {
            if (res.data.result.dataList.length !== 0) {
              let obj = [
                {
                  name: '教材编目',
                  id: '',
                  children: [],
                  parentId: ''
                }
              ]
              res.data.result.dataList.forEach((item, index) => {
                item.children = item.textbookCatalog
                item.name = item.textbookName
                item.id = item.textbookId
                item.children = new TreeMenu(item.children).init(1)
              })
              obj[0].children = res.data.result.dataList
              this.classTree = obj
            }
          }
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取教师对应的信息
    getGradeAndCourseData () {
      let semesterValue
      if (this.addLessonPlanDialogVisible) {
        semesterValue = this.ruleForm.semesterValue
      } else {
        semesterValue = this.semesterValue
      }
      this.$https.get(`/common/selectGradeSimpleCourse?teacherId=${this.userId}&semesterId=${semesterValue}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result.length !== 0) {
            this.sectionId = res.data.result[0].courseList[0].sectionId
            this.sectionName = res.data.result[0].courseList[0].sectionName
            if (this.addLessonPlanDialogVisible) {
              this.dialogGradeList = res.data.result
              if (res.data.result.length !== 0) {
                this.ruleForm.gradeValue = res.data.result[0].gradeId
              }
            } else {
              this.gradeList = res.data.result
            }
          } else {
            this.sectionId = ''
            this.gradeList = []
            this.dialogGradeList = []
          }
        }
      })
    },
    // 获取我收到的协同
    getReceviedNum () {
      this.$https.get(`/mine/synergyList?semesterId=${this.semesterList.filter(item => item.state === 1)[0].semesterId}&gradeId=${''}&courseId=${''}&type=${2}&title=${''}&sort=${''}&pageNo=${1}&pageSize=${2000}`)
      .then(res => {
        if (res.data.code === 1) {
          let nowTime = new Date().getTime()
          if (res.data.result.plans.list.length === 0) {
            this.receviedNum = 0
          } else {
            this.receviedNum = res.data.result.plans.list.filter(item => item.checkState === 0 && item.endTime > nowTime).length
          }
          sessionStorage.receviedNum = this.receviedNum
        } else if (res.data.code === -2) {
          // notice(this, res.data.message, 2000)
        }
      })
    }
  },
  watch: {
    deletingDialogVisible () {
      if (this.deletingDialogVisible === true) {
        setTimeout(() => {
          this.getLessonPlanList()
          this.deleteSuccess = true
        }, 1000)
      } else {
        this.deleteSuccess = false
      }
    },
    deleteSuccess () {
      if (this.deleteSuccess === true) {
        setTimeout(() => {
          this.deletingDialogVisible = false
        }, 300)
      }
    },
    searchList () {
      if (this.searchList.filter(item => item.type === 'grade').length === 0) {
        this.gradeActive = ''
        this.navGradeName = ''
      }
      if (this.searchList.filter(item => item.type === 'course').length === 0) {
        this.courseActive = ''
        this.navCourseName = ''
      }
      if (this.searchList.filter(item => item.type === 'category').length === 0) this.categoryActive = ''
      this.getLessonPlanList()
      this.searchList.forEach((item, index) => {
        if (item.type === 'grade') this.navGradeName = item.name
        if (item.type === 'course') this.navCourseName = item.name
      })
      if (this.semesterValue && this.gradeId && this.courseId) {
        this.getLessonPlanParentTree()
      } else {
        this.classTree = []
      }
    }
  },
  created () {
    // this.receviedNum = sessionStorage.receviedNum
    // if (!this.receviedNum) {
    //   this.receviedNum = 0
    // }
    this.userId = this.user.user.loginUser.id
    this.getSemesterList()
    // this.getLessonPlanParentTree()
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
      // this.getLessonPlanList()
    }, 200)
    if (this.$route.query.pageNo) {
      this.pageNo = Number(this.$route.query.pageNo)
    }
  }
}
</script>
<style lang="scss">
@import '../../../assets/scss/main.scss';
#lesson {
  // 头部筛选
  header {
    position: relative;
    padding-left: 66px;
    padding-bottom: $width;
    border-bottom: 1px solid #E8EDF4;
    &>div {
      margin-top: $width;
    }
    // 学期
    .semester {
      &>span {
        color: #6B7482;
        margin-right: $width;
      }
    }
    // 学段
    .section {
      &>span {
        display: inline-block;
        color: #6B7482;
        margin: 0 $width/2;
        padding:1px  15px;
        border-radius: 13px;
        border: 1px solid transparent;
        cursor: pointer;
        &:hover {
          border: 1px solid #408EE6;
        }
      }
      .active {
        background: #408EE6;
        color: $white;
      }
      span:first-child {
        margin: 0;
        padding: 0;
        &:hover{
          border-color: transparent;
          cursor: auto;
        }
      }
    }
    // 年级--学科
    .grade,.course,.category {
      &.course {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        i {
          min-width: 50px;
        }
        div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          & > span {
            padding: 0;
            margin: 0;
            margin: 0 $width/2;
            padding:1px  15px;
            border-radius: 13px;
            border: 1px solid transparent;
            cursor: pointer;
          }
        }
      }
      i {
        min-width: 50px;
      }
      div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        & > span {
          padding: 0;
          margin: 0;
          margin: 0 $width/2;
          padding:1px  15px;
          border-radius: 13px;
          border: 1px solid transparent;
          cursor: pointer;
        }
      }
       &>span{
        display: inline-block;
        color: #6B7482;
        margin: 0 $width/2;
        padding:1px  15px;
        border-radius: 13px;
        border: 1px solid transparent;
        cursor: pointer;
        &:hover {
          border: 1px solid #408EE6;
        }
      }
      .active {
        background: #408EE6;
        color: $white;
      }
      i {
        font-style: normal;
        color: #6B7482;
      }
    }
    // 搜索
    .search {
      margin-top: 20px;
      i {
        font-style: normal;
        color: #6B7482;
      }
      &>span>span {
        display: inline-block;
        color: #6B7482;
        margin: 0 $width/2;
        padding:1px  15px;
        padding-right: 10px;
        border-radius: 13px;
        border: 1px solid #C6CED9;
        line-height: 23px;
        span {
          margin-left: 5px;
          line-height: 15px;
          display: inline-block;
          width: 14px;
          height: 14px;
          cursor: pointer;
          border-radius: 50%;
          font-size: 8px;
          text-align: center;
          &:hover{
            background: #FF6C60;
            color: #fff;
          }
        }
      }
      b {
        font-weight: normal;
        color: #4792E7;
        cursor: pointer;
      }
    }
    .recevied-num {
      position: absolute;
      top: -75px;
      left: 225px;
      display: inline-block;
      width: 16px;
      height: 16px;
      background: #FF6C60;
      border-radius: 50px;
      line-height: 16px;
      text-align: center;
      color: #fff;
    }
  }
  // 主体部分
  main {
    border-radius: 3px;
    margin: $width*2 $width*3;
    border: 1px solid #B7C2D0;
    display: flex;
    // 左侧导航
    .main-left {
      min-width:260px;
      border-right: 1px solid #E2E6EC;
      &>p {
        background: #DDE6EF;
        color: #636C7B;
        padding: $width/2 15px;
        border-bottom: 1px solid #E2E6EC;
        height: 19px;
        margin: 0;
      }
      .main-left-body {
        padding: $width/2 $width 0 $width;
        .el-tree {
          border: 0;
          span {
            color: #636C7F;
          }
        }
      }
    }
    // 右侧主要内容
    .main-right {
      width: 100%;
      padding: 0 $width;
      padding-bottom: 80px;
      position: relative;
      // 按钮操作部分
      .operation-button {
        padding: 20px 36px;
        border-bottom: 1px dashed #DAE2ED;
        .el-col:first-child {
          .el-button {
            padding: 6px 15px;
            border-color: #408EE6;
            color: #408EE6;
            margin-left: 8px;
            &:hover {
              background: #408EE6;
              color: $white;
            }
          }
          img {
            position: absolute;
            top: 19px;
          }
        }
        .el-input__inner {
          height: 28px;
        }
      }
      .main-right-body {
        border-bottom: 1px dashed #DAE2ED;
        padding: $width/2 0;
        &>.el-col:nth-child(1) {
          padding-top: 10px;
        }
        &>.el-col:nth-child(2) {
          padding:0 $width/2;
          padding-right:0;
          .el-row:first-child {
            font-size: 16px;
            color: #636C7B;
          }
          .el-row:nth-child(2) {
            color: #A2AAB8;
            padding: 8px 0 15px 0;
            span {
              margin-right: $width/2;
            }
            &>img {
              position: absolute;
              left: 480px;
              top: -20px;
            }
          }
          .el-row:nth-child(3) {
            div:nth-child(1) {
              display: inline-block;
              padding-top:2px; 
              span {
                color: #636C7B;
                margin-right: $width/2;
                font-size: 12px;
                img {
                  margin-right: $width/4;
                  vertical-align: middle;
                  width: 20px;
                  height: 20px;
                }
              }
            }
            div:nth-child(2) {
              float: right;
              width: 290px;
              .el-button {
                font-size: 12px;
                padding: 5px 10px;
                border-color: #A2AECD;
                color: #A9B4D0;
              }
              .create-learn-case:hover {
                background: #408EE6;
                color: $white;
                border-color: #408EE6;
              }
              .update:hover {
                background: #9FD35D;
                color: $white;
                border-color: #9FD35D;
              }
              .delete:hover {
                background: #FF6C60;
                color: $white;
                border-color: #FF6C60;
              }
              .prepare-lesson:hover {
                background: #FCB323;
                color: $white;
                border-color: #FCB323;
              }
            }
          }
        }
      }
      .el-pagination {
        position: absolute;
        bottom: 10px;
        right:10px;
      }
    }
  }
  // 删除弹出框
  .delete-dialog {
    .el-dialog {
      width: 407px;
      // height: 256px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      .el-dialog__header {
        text-align: center;
        padding:0;
        background: #3281F8;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        span {
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
      .el-dialog__body {
        border-top: 1px solid #ddd;
        text-align: center;
        padding: 46px 0;
        margin: 0 46px;
        img {
          vertical-align: middle;
          margin-right: 10px;
        }
        &>span {
          font-size: 15px;
          color: #636C7B;
        }
        p {
          font-size: 12px;
          color: #BCC6D3;
          margin-top: 10px;
        }
        &>sup {
          position: absolute;
          top: 0;
          left: 20px;
          width: 35px;
          height: 5px;
          background: #9FD35D;
        }
        &>i {
          cursor: pointer;
          width: 22px;
          height: 22px;
          position: absolute;
          background: url(../../../assets/images/dialog-close.png) no-repeat;
          top: 15px;
          right: 10px;
          &:hover {
            background: url(../../../assets/images/dialog-close-hover.png) no-repeat;
          }
        }
      }
      .el-dialog__footer {
        .el-button {
          padding: 8px 28px;
        }
        .el-button:nth-child(1) {
          border: 1px solid #408EE6;
          color: #408EE6;
          &:hover{
            background: #408EE6;
            color: $white;
          }
        }
        .el-button:nth-child(2) {
          border: 1px solid #FF6C60;
          color: #FF6C60;
          background: #fff;
          margin-right: 65px;
          &:hover {
            background: #FF6C60;
            color: $white;
          }
        }
      }
    }
  }
  // 正在删除弹出框
  .deleting {
    background: rgba(204,204,204,0.2);
    .el-dialog {
      width: 140px;
      height: 30px;
      background: #7A7A7A;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
        color: $white;
        &>span {
          position: absolute;
          top: 0;
          left: 20px;
          line-height: 45px;
          img {
            position: absolute;
            top: 4px;
            right:-20px;
          }
          span {
            position: absolute;
            width:130px;
            top: -5px;
            right:-150px;
          }
          .packaging {
            background: #7A7A7A;
            position: absolute;
            width:130px;
            line-height: 32px;
            top:0;
            right:-150px;
          }
          .delete-success {
            position: absolute;
            width:130px;
            top: -5px;
            right:-170px;
          }
        }
      }
    }
  }
  // 协同备课弹出框
  .prepare-lesson-dialog {
    .el-dialog {
      width: 588px;
      .el-dialog__body {
        text-align: left;
        padding-top: 30px;
        padding-bottom:50px;
        &>p {
          margin-bottom: 20px;
          font-size: 14px;
          color: #636C7B;
          &>span:first-child {
            margin-right: 20px;
            margin-left: 30px;
          }
          .el-input {
            width: 354px;
            .el-input__inner {
              height: 30px;
              width: 354px;
            }
            .el-input__icon {
              width: 32px;
              background: #A2AECD;
              color: #fff;
              cursor: pointer;
              font-size: 19px;
              border-top-right-radius: 5px;
              border-bottom-right-radius: 5px;
              &:hover {
                background: #408EE6;
              }
            }
          }
          .invited-teacher {
            padding-left: 10px;
            display: inline-block;
            width: 326px;
            height: 30px;
            border: 1px solid #BFCBD9;
            border-radius: 5px;
            vertical-align: middle;
            box-sizing: border-box;
            overflow-x: hidden;
            cursor: pointer;
            span {
              display: inline-block;
              margin-top: 4px;
            }
            i {
              display: inline-block;
              width: 30px;
              height: 30px;
              background: url(../../../assets/images/selected-teacher.png);
              top: 152px;
              position: absolute;
              right: 66px;
              &:hover {
                background: url(../../../assets/images/teacher-blue.png);
              }
            }
          }
        }
        &>.teacher {
          position: absolute;
          box-shadow: 2px 0px 5px #DDE6EF;
          background: #fff;
          border-radius: 5px;
          left: 170px;
          width: 350px;
          top: 185px;
          height: 300px;
          border: 1px solid #BFCBD9;
          .teacher-left {
            float: left;
            width:200px;
            height: 250px;
            overflow-x: hidden;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 5px;
            box-sizing: border-box;
            .el-tree {
              border: 0;
            }
          }
          .teacher-right {
            float: right;
            overflow-x: hidden;
            width: 150px;
            height: 249px;
            border-bottom: 1px solid #ddd;
            p {
              padding: 2px 20px;
              font-size: 15px;
              color: #7AB1FB;
              img {
                float: right;
                cursor: pointer;
              }
            }
          }
          .select-teacher-button {
            clear: both;
            display: block;
            padding-top: 10px;
            text-align: center;
            .el-button {
              padding: 8px 28px;
            }
            .el-button:nth-child(1) {
              border: 1px solid #408EE6;
              color: #4390E6;
              &:hover {
                background: #408EE6;
                color: $white;
              }
            }
            .el-button:nth-child(2) {
              border: 1px solid #FF6C60;
              color: #FF6C60;
              background: #fff;
              &:hover {
                background: #FF6C60;
                color: $white;
              }
            }
          }
        }
      }
      .el-dialog__footer {
        text-align: center;
        .el-button:first-child {
          margin-left: 90px;
        }
      }
    }
  }
  // 新增教案弹出框
  .add-lesson-plan {
    .el-dialog {
      width: 488px;
      .el-dialog__body {
        text-align: left;
        padding-top: 30px;
        .el-form-item {
          img {
            position: absolute;
            top: 10px;
            right: -20px;
          }
        }
        .el-form-item__label::before {
          display: none;
        }
        .el-select {
          width: 300px;
        }
        .el-form-item__error {
          left: 62px !important;
        }
      }
      .el-dialog__footer {
        .el-button:last-child {
          margin-right: 90px;
        }
      }
    }
  }
}
</style>
