<template>
  <div class="infoEnter">
    <!-- 学生信息录入 -->

    <!-- <section class="common-css"> -->

      <!-- 左侧菜单 -->
      <!-- <section class="left-menu">
        <el-tree :data="treeMenu"
                :highlight-current="true"
                :props="defaultProps"
                @node-click="nodeClick">
        </el-tree>
      </section> -->


      <!-- 右侧内容 -->
    <section class="right-contents"
      v-loading="loadingImport"
      element-loading-text="正在导入,请稍后..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">

      <p class="top">
        <span class="to-list" @click="route('/exam')">返回考试列表</span>
        {{ examInfo.name }}> 学生录入
      </p>

      <div class="exam-table">
        <header class="exam-head">
          <el-select v-model="schoolInd" placeholder="请选择学校" @change="schoolChange">
            <el-option
              v-for="(item, i) in treeMenu"
              :key="i"
              :label="item.name"
              :value="i">
            </el-option>
          </el-select>

          <el-select v-model="classInd"
                    placeholder="请选择班级"
                    @change="classChange"
                    v-if="treeMenu[schoolInd] && treeMenu[schoolInd].child && treeMenu[schoolInd].child[0] && treeMenu[schoolInd].child[0].children">
            <el-option :value="-1" label="全部班级"></el-option>
            <el-option
              v-for="(item, i) in treeMenu[schoolInd].child[0].children"
              :key="i"
              :label="item.classFullName"
              :value="i">
            </el-option>
          </el-select>
          <el-button type="primary" class="more-upload" @click="leadClick" v-if="menu.buttons && menu.buttons.studentBatchUpload == 1" :disabled="examInfo.enterState == 2">批量上传</el-button>
          <el-button type="primary" class="more-download" @click="download" v-if="menu.buttons && menu.buttons.studentBatchDownload == 1">批量下载</el-button>
          <!-- <el-button type="success" class="more-submit" @click="submit" v-show="isGrade" :disabled="examInfo.enterState == 2">提交</el-button> -->
          <el-button type="success" class="more-submit" @click="submit" v-show="classInd != -1 && menu.buttons && menu.buttons.studentClassCommit == 1" :disabled="examInfo.enterState == 2">提交</el-button>
          <el-input
            placeholder="输入学生姓名搜索"
            icon="search"
            v-model="searchStudent"
            @keyup.enter.native="getStudentList"
            :on-icon-click="getStudentList">
          </el-input>
        </header>

        <section class="table" v-loading="loading">
          <p>总人数：{{ num.total }}  参加考试人数： {{ num.has }}</p>

          <table style="background: rgba(255, 255, 255, 0.6);">
            <tr>
              <th>序号</th>
              <th v-show="examInfo.examnoFlag">考号</th>
              <th>学生姓名</th>
              <th>学籍号</th>
              <th v-if="subjectList.length != 0">选科</th>
              <th>是否参加考试</th>
            </tr>
            <tr v-for="(item, i) in tableList" :key="item.name">
              <td>{{ i + 1 }}</td>
              <td v-if="examInfo.examnoFlag">
                {{ phase.schoolNo }}{{ phase.gradeNo }} <el-input v-model="item.examNo" @blur="saveStudent(item, phase.schoolNo, phase.gradeNo)" :maxlength="examInfo.studentNoLen" :disabled="examInfo.enterState == 2"></el-input>
              </td>
              <td>{{ item.studentName }}</td>
              <td>{{ item.studentCode }}</td>
              <td v-if="subjectList.length != 0">
                <el-checkbox v-for="items in item.subjectList" :key="items.name" v-model="items.checked" @change.native="saveStudent(item, phase.schoolNo, phase.gradeNo)" :disabled="examInfo.enterState == 2">{{ items.name }}</el-checkbox>
              </td>
              <td>
                <el-radio class="radio" v-model="item.examFlag" :label="1" @change.native="saveStudent(item, phase.schoolNo, phase.gradeNo)" :disabled="examInfo.enterState == 2">是</el-radio>
                <el-radio class="radio" v-model="item.examFlag" :label="0" @change.native="saveStudent(item, phase.schoolNo, phase.gradeNo)" :disabled="examInfo.enterState == 2">否</el-radio>
              </td>
            </tr>
            <tr v-show="tableList.length == 0">
              <td :colspan="6">暂无数据</td>
            </tr>
          </table>
        </section>
      </div>
    </section>

    <!-- </section> -->

    <!-- 批量上传 -->
    <el-dialog
      title="批量上传"
      :visible.sync="uploadShow"
      :show-close="false">
      
      <i class="el-icon-close close" @click="uploadShow = false"></i>
      <h4>提示:</h4>
      <p>1.点击下载<span class="download" @click="downloadTempalte">学生信息导入模板.xls</span></p>
      <p>2.为保证导入数据有效性，导入Excel前，敬请您先下载模板，根据模板要求按需填写，请勿修改格式；</p>
      <p>3.批量导入只允许xls、xlsx格式文档，其他格式均无法导入。</p>
      <section>
        <h3>学生成绩录入：</h3>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="upload"
          :on-progress="progress"
          :data="{ examId: examInfo.id, schoolId: phase.companyId, examNoPrefix: phase.schoolNo+phase.gradeNo }"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        </el-upload>
      </section>
      
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="leadTo">确定导入</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notice, success } from '../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'infoEnter',
  data () {
    return {
      loadingImport: false,
      loading: false,
      treeMenu: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      examInfo: {
        name: '',
        examnoFlag: false,
        id: '',
        semesterId: '',
        enterState: 1
      },
      uploadShow: false,
      searchStudent: '',
      semester: '',
      semesterList: [],
      genre: '',
      genreList: [],
      tableHead: [
        { name: '序号' },
        { name: '考号' },
        { name: '学生姓名' },
        { name: '学籍号' },
        { name: '选科' },
        { name: '是否参加考试' }
      ],
      tableList: [],
      subjectList: [],
      res: -5,
      phase: {
        sectionId: '',
        scoreRuleId: '',
        semesterId: '',
        companyId: '',
        gradeId: '',
        gradeNo: '',
        schoolNo: '',
        gradeName: '',
        classId: '',
        className: '',
        schoolList: []
      },
      isGrade: false,
      requireNum: 3,
      schoolInd: 0,
      classInd: -1,
      num: {
        total: 0,
        has: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'menu'
    ]),
    upload () {
      let path = document.querySelector('#contextPath').value
      return `${path}/examStudentEnter/studentUpload`
    }
  },
  created () {
    // let obj = JSON.parse(this.$route.query.obj)
    let obj = JSON.parse(sessionStorage.EXAMINFO)
    this.examInfo.id = obj.id
    this.examInfo.name = obj.name
    this.phase.gradeId = obj.gradeId
    this.phase.sectionId = obj.sectionId
    this.phase.scoreRuleId = obj.scoreRuleId
    this.phase.semesterId = obj.semesterId
    this.phase.companyId = obj.companyId
  },
  async mounted () {
    await this.getDetail()
    await this.getCompanyList()
    await this.getTestInfo()
    await this.getSubjectList()
    this.getStudentList()
    this.getClassNum()
  },
  methods: {
    handleIconClick () {},
    route (r) {
      this.$router.push(r)
    },
    // 获取考试详情
    async getDetail () {
      // await this.$https.get(`/examStudentEnter/examDetail?examId=${this.examInfo.id}`)
      // .then(res => {
      //   console.log(res.data.result)
      // })
    },
    schoolChange (val) {
      this.phase.companyId = this.treeMenu[this.schoolInd].companyId
      this.phase.schoolNo = this.treeMenu[this.schoolInd].schoolNo
      if (this.classInd < 0) {
        this.getClassNum()
      }
      if (this.classInd < 0) this.getStudentList()
      else this.classInd = -1
    },
    classChange (val) {
      if (val < 0) {
        this.phase.classId = ''
        this.phase.className = ''
      } else {
        this.phase.classId = this.treeMenu[this.schoolInd].child[0].children[val].id
        this.phase.className = this.treeMenu[this.schoolInd].child[0].children[val].className
      }
      this.getClassNum()
      this.getStudentList()
    },
    getClassNum () {
      this.$https.get(`/examStudentEnter/studentNum?examId=${this.examInfo.id}&schoolId=${this.phase.companyId}&classId=${this.phase.classId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.num.total = res.data.result.totalNum
          this.num.has = res.data.result.examNum
        }
      })
    },
    async nodeClick (data) {
      this.phase.companyId = data.companyId
      this.isGrade = false
      if (data.parent === 1) {
        this.phase.schoolNo = data.schoolNo || ''
        this.phase.gradeNo = data.children[0] ? data.children[0].gradeNo : ''
        this.phase.gradeId = data.children[0] ? data.children[0].gradeId : ''
        this.phase.gradeName = data.children[0] ? data.children[0].gradeName : ''
        this.getStudentList()
        return
      }
      if (data.ind || data.ind === 0) {
        this.isGrade = true
        this.phase.gradeId = data.gradeId
        this.phase.gradeNo = data.gradeNo || ''
        this.phase.schoolNo = data.schoolNo || ''
        this.phase.gradeName = data.gradeName
        this.phase.classId = ''
        this.phase.className = ''
        this.phase.companyId = data.companyId
        this.getClassList(data.index, data.ind, data.companyId)
        this.getStudentList()
      }
      if (data.parent === 2) return
      this.isGrade = false
      // console.log(data)
      this.phase.gradeId = data.gradeId
      this.phase.gradeNo = data.gradeNo || ''
      this.phase.schoolNo = data.schoolNo || ''
      this.phase.gradeName = data.gradeName
      this.phase.classId = data.id
      this.phase.className = data.name
      this.phase.companyId = data.companyId
      this.getStudentList()
    },
    leadTo () {
      var arrs = document.getElementsByClassName('el-upload-list__item-name')
      if (arrs && arrs.length > 0) {
        this.loadingImport = true
        this.$refs.upload.submit()
      } else {
        notice(this, '请选择文件', 2000)
      }
    },
    beforeUpload (file) {
      this.uploadFileName = ''
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'xls' || arr[arr.length - 1] === 'xlsx') {
          resolve()
        } else {
          notice(this, '请上传正确格式文件', 2000)
          reject()
        }
      })
    },
    leadClick () {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.uploadShow = true
    },
    async handleSuccess (res, file, fileList) {
      // this.uploadFileName = file.name
      this.res = res.code
      // this.res.message = res.message
      this.uploadShow = false
      if (this.res === -5) {
        notice(this, '请选择文件', 2000)
      }
      if (this.res === 1) {
        this.loadingImport = false
        await this.getStudentList()
        success(this, res.message, 2000)
        if (!this.tableList.length) return
        let a = 0
        let table = this.tableList.filter(item => item.examFlag === 1)
        for (let i = 0; i < table.length; i++) {
          if (table[i].subjectList.filter(item => item.checked).length !== this.requireNum) {
            a++
          }
        }
        if (this.examInfo.examnoFlag) {
          if (this.subjectList.length > 0 && !this.tableList.filter(item => item.examFlag === 1).every(item => (item.examNo && item.examNo.length === this.examInfo.studentNoLen)) && a > 0) {
            notice(this, `考号长度限制为${this.examInfo.studentNoLen}位且选择科目为${this.requireNum}科`, 2000)
          } else if (this.subjectList.length > 0 && a > 0) {
            notice(this, `选择科目为${this.requireNum}科`, 2000)
          } else if (!this.tableList.filter(item => item.examFlag === 1).every(item => (item.examNo && item.examNo.length === this.examInfo.studentNoLen))) {
            notice(this, `考号长度限制为${this.examInfo.studentNoLen}位`, 2000)
          }
        } else {
          if (this.subjectList.length > 0 && a > 0) {
            notice(this, `选择科目为${this.requireNum}科`, 2000)
          }
        }
      } else {
        notice(this, res.message, 2000)
      }
    },
    progress (event, file, fileList) {
      console.log(file)
    },
    async getTestInfo () { // 获取考试信息，判断考号是否显示
      await this.$https.get(`/examStudentEnter/examnoDetail?examId=${this.examInfo.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let obj = res.data.result
          // this.examInfo.name = obj.examName
          this.examInfo.examnoFlag = obj.examnoFlag
          this.examInfo.semesterId = obj.semesterId
          this.examInfo.sectionName = obj.sectionName
          this.examInfo.enterState = obj.enterState
          this.phase.sectionName = obj.sectionName
          this.examInfo.studentNoLen = obj.studentNoLen
          this.requireNum = obj.requireNum
          this.phase.gradeId = obj.listGrade ? obj.listGrade[0].gradeId : ''
          this.phase.gradeName = obj.listGrade ? obj.listGrade[0].gradeName : ''
          this.phase.gradeNo = obj.listGrade ? obj.listGrade[0].gradeNo : ''
          this.phase.schoolNo = this.treeMenu[this.schoolInd || 0].schoolNo
          let gradeList = (obj.listGrade || []).map(item => ({
            ...item,
            parent: 2,
            children: [{name: '请稍后...', parent: 2}]
          }))
          this.treeMenu.forEach((item, i) => {
            this.$set(item, 'children', (gradeList || []).map((items, ind) => ({...items, id: items.gradeId, name: items.gradeName, sectionId: items.sectionId, sectionName: items.sectionName, companyName: item.name, companyId: item.id, index: i, ind: ind, schoolNo: item.schoolNo})))
          })
          this.treeMenu.forEach((item, index) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach(async (items, ind) => {
                await this.getClassList(index, ind, item.schoolId)
              })
              item.child = item.child.concat(item.children)
            }
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async getStudentList () { // phase.schoolNo, phase.gradeNo
      this.loading = true
      await this.$https.get(`/examStudentEnter/studentList?examId=${this.examInfo.id}` +
                      `&keyword=${this.searchStudent}` +
                      `&sectionId=${this.phase.sectionId}` +
                      `&sectionName=${this.phase.sectionName}` +
                      `&gradeId=${this.phase.gradeId}` +
                      `&gradeName=${this.phase.gradeName}` +
                      `&classId=${this.phase.classId}` +
                      `&companyId=${this.phase.companyId}` +
                      `&examNo=${this.phase.schoolNo ? this.phase.schoolNo : ''}${this.phase.gradeNo ? this.phase.gradeNo : ''}` +
                      // `&examNo=${this.treeMenu[this.schoolInd].schoolNo}${this.treeMenu[this.schoolInd].child[0].children[this.classInd].gradeNo}` +
                      `&className=${this.phase.className}`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          //   console.log(res.data.result)
          this.tableList = (res.data.result || []).map(item => ({
            ...item,
            examNo: item.examNo,
            check: 1,
            subjectList: (this.subjectList || []).map(sub => ({
              ...sub,
              examFlag: false,
              name: sub.courseName,
              id: sub.courseId,
              checked: false
            }))
          }))
          this.tableList.forEach(item => {
            let subs = item.courseIds ? item.courseIds.split(',') : []
            item.subjectList.forEach((sub, i) => {
              subs.forEach(items => {
                if (sub.courseId === items) {
                  this.$set(item.subjectList[i], 'checked', true)
                }
              })
            })
          })
        } else {
          this.tableList = []
          notice(this, res.data.message || res.data.result, 2000)
        }
      })
      .catch(_ => console.log(_))
    },
    // 获取下属单位
    getChildCompany () {
      this.$https.get(`/common/childCompanyList`)
      .then(res => {
        if (res.data.code === 1) {
          this.treeMenu = (res.data.result || []).map(item => ({...item, children: [ { name: '请稍后...', parent: 1 } ], parent: 1}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async getSubjectList () {
      await this.$https.get(`/examStudentEnter/ruleScoreCourseList?examId=${this.examInfo.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subjectList = (res.data.result || []).filter(item => item.requireFlag === 2)
          // console.log(res.data.result)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    saveStudent (item, a, b) { // 单个保存学生录入信息
      this.$https.post('/examStudentEnter/studentSave', querystring.stringify({
        studentId: item.id,
        examNoRule: String(a || '') + String(b || ''),
        examNo: item.examNo,
        examFlag: item.examFlag,
        companyId: this.phase.companyId,
        courseIds: (item.subjectList || []).filter(item => item.checked).map(item => item.id).join(',')
      }))
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
        } else {
          this.getStudentList()
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 学生录入信息导入模板下载
    downloadTempalte () {
      if (!this.phase.gradeName) {
        notice(this, '请选择年级', 2000)
        return
      }
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/examStudentEnter/studentTemplateDownload?` +
                      `examId=${this.examInfo.id}` +
                      `&sectionId=${this.phase.sectionId}` +
                      `&sectionName=${this.phase.sectionName}` +
                      `&gradeId=${this.phase.gradeId}` +
                      `&gradeName=${this.phase.gradeName}` +
                      `&classId=${this.phase.classId}` +
                      `&schoolId=${this.phase.companyId}` +
                      `&className=${this.phase.className}` +
                      `&examNoPrefix=${this.phase.schoolNo ? this.phase.schoolNo : ''}${this.phase.gradeNo ? this.phase.gradeNo : ''}`
    },
    // 批量下载
    download () {
      if (!this.phase.gradeName) {
        notice(this, '请选择年级', 2000)
        return
      }
      // if (!this.phase.classId) {
      //   notice(this, '请选择班级', 2000)
      //   return
      // }
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/examStudentEnter/studentDownload?classId=${this.phase.classId}&gradeId=${this.phase.gradeId}&examId=${this.examInfo.id}&schoolId=${this.phase.companyId}&examNoPrefix=${this.phase.schoolNo ? this.phase.schoolNo : ''}${this.phase.gradeNo ? this.phase.gradeNo : ''}`
    },
    // 提交
    submit () {
      if (!this.tableList.length) return
      if (this.examInfo.examnoFlag) {
        if (!this.tableList.filter(item => item.examFlag === 1).every(item => item.examNo && (item.examNo.length === this.examInfo.studentNoLen))) {
          notice(this, `考号长度限制为${this.examInfo.studentNoLen}位`, 2000)
          return
        }
      }
      let a = 0
      let table = this.tableList.filter(item => item.examFlag === 1)
      for (let i = 0; i < table.length; i++) {
        if (table[i].subjectList.filter(item => item.checked).length !== this.requireNum) {
          a++
        }
      }
      if (this.subjectList.length > 0 && a > 0) {
        notice(this, `选择科目为${this.requireNum}科`, 2000)
        return
      }
      this.$https.post('/examStudentEnter/studentClassCommit', querystring.stringify({
        examId: this.examInfo.id,
        schoolId: this.phase.companyId,
        classId: this.phase.classId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 根据年级获取班级
    async getClassList (i, ind, id) {
      // if (!this.phase.schoolList.length) return
      // let schoolList = (this.phase.schoolList || []).map(item => item.schoolId)[0]
      await this.$https.get(`/common/gradeClassList?semesterId=${this.phase.semesterId}` +
                      `&gradeId=${this.phase.gradeId}` +
                      `&schoolId=${id}` +
                      `&sectionId=${this.phase.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          let classesResult = res.data.result || []
          if (classesResult.length === 1) {
            this.classInd = 0
          } else {
            this.classInd = -1
          }
          this.treeMenu[i].children[ind].children = classesResult.map(classes => ({
            ...classes,
            gradeId: classes.gradeId,
            gradeName: classes.gradeName,
            name: classes.gradeName + classes.className,
            companyId: this.treeMenu[i].id,
            schoolNo: this.treeMenu[i].schoolNo,
            gradeNo: this.treeMenu[i].children[ind].gradeNo,
            id: classes.id
          }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取考试学校列表
    async getCompanyList () {
      await this.$https.get(`/common/achievementSchoolList?examId=${this.examInfo.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.phase.schoolList = res.data.result
          if (this.phase.schoolList.length > 0) {
            this.phase.companyId = this.phase.schoolList[0].schoolId
          }
          this.treeMenu = (res.data.result || []).map((item, i) => ({...item, children: [ { name: '请稍后...', parent: 2 } ], parent: 1, name: item.schoolName, id: item.id || item.schoolId, index: i, companyId: item.id || item.schoolId, child: []}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
  .infoEnter {
    height: calc(100% - 20px);
    color: #435a6c;

    .right-contents {
      // padding: 0 40px 40px;
      // height: calc(100% - 20px);

      p.content-head {
        height: 66px;
        line-height: 70px;
        font-weight: bold;

        .el-button {
          float: right;
          margin-top: 10px;
          line-height: 20px;
          font-weight: normal;

          i {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid $white;
            transform: translateX(-2px) scale(1.1);
            text-align: center;
          }
        }
      }

      .exam-table {
        // background: $white;
        // padding: 30px;
        height: calc(100% - 126px);

        .upload-demo {
          display: inline-block;
          margin-right: 10px;
        }

        .exam-head {
          margin-bottom: 20px;

          .more-upload, .more-download, .more-submit {
            background: url(../../assets/icons/upload.png) no-repeat 4px center;
            background-color: $head-bg;
            padding-left: 34px;
            border: none;
            &:active {
              opacity: 0.8;
            }

            &.more-submit {
              background: url(../../assets/icons/submit.png) no-repeat 4px center;
              background-color: $theme;
            }

            &.more-download {
              background-image: url(../../assets/icons/download.png);
            }
          }

          .el-input {
            width: 200px;
          }
        }

        .table {
          height: calc(100% - 30px);
          // overflow: auto;

          table {
            width: 100%;
            // min-width: 1100px;

            .info-manage {

              i {
                display: inline-block;
                vertical-align: middle;
                width: 32px;
                height: 32px;
                cursor: pointer;
                background: url(../../assets/icons/edit.png) no-repeat 4px center;

                &:nth-child(2) {
                  background: url(../../assets/icons/delete.png) no-repeat 4px center;
                }
              }
            }

            tr {
              td, th {
                height: 40px;
                line-height: 40px;
                border: 1px solid $border-color;
                text-align: center;

                .el-input {
                  display: inline-block;
                  width: 80px;

                  input {
                    border: 1px solid #ccc;
                    text-align: left;

                    &:focus {
                      border: 1px solid $theme;
                    }
                  }
                }
              }

              th {
                background: #eef2f5;
              }
            }
          }
        }
      }
    }

    .el-dialog {
      .download {
        color: $theme;
        text-decoration: underline;
        cursor: pointer;
      }

      p {
        line-height: 34px;
      }
      
      section {
        margin-top: 20px;

        h3 {
          display: inline;
        }

        .upload-demo {
          display: inline;

          .el-upload {
            float: right;
            margin-left: 20px;
          }

          ul {
            float: right;
            width: 250px;
            height: 40px;
            transform: translateY(-9px);
            border: 1px solid $border-color;
            border-radius: 6px;
            overflow: hidden;
            // margin-right: 20px;
          }

          .el-upload-list__item-status-label, .el-icon-close {
            display: none;
          }
        }
      }
    }
  }
</style>
