<template>
  <div class="big-score">
    <header class="exam-head">
      <el-button type="primary" class="more-upload" v-if="menu.buttons && menu.buttons.scoreBatchUpload == 1" @click="leadClick">批量上传</el-button>
      <el-button type="primary" class="more-download" v-if="menu.buttons && menu.buttons.scoreBatchDownload == 1" @click="downloadScore">批量下载</el-button>
      
      <el-input
        placeholder="输入学生姓名搜索"
        icon="search"
        v-model="searchStudent"
        @keyup.enter.native="handleIconClick"
        :on-icon-click="handleIconClick">
      </el-input>
      <el-button type="success" class="more-enter" @click="route('/exam/bigScore')">退出录入</el-button>
    </header>




    <section class="table" v-loading="loading"
      element-loading-text="数据加载中,请稍后..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <section>
        <section>
          <table>
            <tr>
              <th v-for="item in tableHead" :key="item.name">{{ item.name }}</th>
            </tr>
            <tr v-for="(item, i) in tableList" :key="i">
              <td>{{ i + 1 }}</td>
              <td class="td-len" :title="item.studentNo">{{ item.studentNo }}</td>
              <td>{{ item.studentName }}</td>
              <td>{{ item.totalScore }}</td>
            </tr>
          </table>
        </section>
        

        <section>
          <table>
            <tr v-if="tableList.length > 0">
              <th v-for="(item, i) in tableList[0].listDetail" :key="i">{{ item.questionNo }}</th>
            </tr>
            <tr v-for="(item, i) in tableList" :key="item.name">
              <td v-for="(items, ind) in item.listDetail" :key="ind">
                <el-input v-model="items.questionScore" type="number" @blur="calcTotal(i, item)"></el-input>
              </td>
            </tr>
          </table>
        </section>
      </section>

    </section>

    <!-- 批量上传 -->
    <el-dialog
      title="批量上传"
      :visible.sync="uploadShow"
      :show-close="false">
      <i class="el-icon-close close" @click="uploadShow = false"></i>
      <h4>提示:</h4>
      <p>1.点击下载<span class="download" @click="downloadTem">成绩导入模板.xls</span></p>
      <p>2.为保证导入数据有效性，导入Excel前，敬请您先下载模板，根据模板要求按需填写，请勿修改格式；</p>
      <p>3.批量导入只允许xls、xlsx格式文档，其他格式均无法导入。</p>
      <section>
        <h3>学生成绩录入：</h3>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="upload"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :data="{ examId: phase.examId, paperId: phase.paperId, courseId: phase.courseId, classId: phase.classId  }"
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
import { notice, success, error } from '../../../api/index.js'
import querystring from 'querystring'
import _ from 'lodash'
export default {
  name: 'big-score',
  data () {
    return {
      loading: false,
      searchStudent: '',
      uploadShow: false,
      tableHead: [
        { name: '序号' },
        { name: '考号' },
        { name: '学生姓名' },
        { name: '笔试成绩' }
      ],
      testList: [],
      examInfo: {
        name: '2016-2017第一学期期中考试'
      },
      tableList: [
      ],
      subjectList: [
      ],
      res: -5,
      phase: {
        gradeId: '',
        sectionId: '',
        semesterId: '',
        companyId: '',
        courseId: ''
      },
      data: {},
      pageNo: 1,
      pageSize: 50,
      totalCount: 0
    }
  },
  computed: {
    upload () {
      let path = document.querySelector('#contextPath').value
      return `${path}/examScoreEnter/studentScoreUpload`
    },
    menu () {
      return this.$store.state.menu
    }
  },
  created () {
    this.phase = JSON.parse(this.$route.query.phase)
    // this.data = { ...this.phase }
    // this.data.parent = 1
    // this.getScoreList()
    // this.phase = JSON.parse(sessionStorage.EXAMINFO)
    // this.phase.courseId = this.$route.query.courseId
    // this.phase.courseName = this.$route.query.courseName
    // this.phase.classId = this.$route.query.classId
    this.data = {...this.phase}
    this.getScoreList()
  },
  methods: {
    handleIconClick () {
      this.tableList = []
      this.pageNo = 1
      this.getScoreList()
    },
    route (r) {
      this.$router.push({path: r, query: {courseId: this.phase.courseId, courseName: this.phase.courseName, classId: this.phase.classId}})
    },
    leadTo () {
      var arrs = document.getElementsByClassName('el-upload-list__item-name')
      if (arrs && arrs.length > 0) {
        this.loadingImport = true
        this.$emit('from-child-msg', this.loadingImport)
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
    handleSuccess (res, file, fileList) {
      // this.uploadFileName = file.name
      this.res = res.code
      // this.res.message = res.message
      this.uploadShow = false
      if (this.res === -5) {
        notice(this, '请选择文件', 2000)
      }
      if (this.res === 1) {
        this.loadingImport = false
        this.$emit('from-child-msg', this.loadingImport)
        this.pageNo = 1
        this.searchStudent = ''
        this.tableList = []
        this.getScoreList()
        success(this, res.message, 2000)
      } else {
        this.loadingImport = false
        this.pageNo = 1
        this.searchStudent = ''
        this.tableList = []
        this.$emit('from-child-msg', this.loadingImport)
        notice(this, res.message, 2000)
        this.getScoreList()
      }
    },
    getScoreList () {
      if (!this.phase.examId) {
        notice(this, '请选择科目', 2000)
        this.tableList = []
        return
      }
      this.loading = true
      this.$https.get(`/examScoreEnter/studentScoreListPage?type=1` +
                      `&examId=${this.phase.examId}` +
                      `&courseId=${this.phase.courseId}` +
                      `&classId=${this.phase.classId}` +
                      `&courseName=${this.phase.courseName}` +
                      `&keyword=${this.searchStudent}` +
                      `&pageNo=${this.pageNo}` +
                      `&pageSize=${this.pageSize}` +
                      `&gradeId=${this.phase.gradeId}`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          // this.tableList = res.data.result || []
          this.tableList = this.tableList.concat(res.data.result.list || [])
          this.totalCount = res.data.result.totalCount
        } else if (res.data.code === -2) {
          error()
        } else {
          this.tableList = []
          notice(this, res.data.message, 2000)
        }
      })
    },
    creat (data) {
      this.phase = data
      this.data = { ...data }
      this.data.parent = 1
      this.pageNo = 1
      this.searchStudent = ''
      this.tableList = []
      this.getScoreList()
    },
    calcTotal (i, item) {
      if (this.tableList.length === 0) return
      this.tableList[i].totalScore = 0
      this.tableList[i].listDetail.forEach(item => {
        this.tableList[i].totalScore += Number(item.questionScore)
      })
      let scoreDetail = JSON.stringify(item.listDetail)
      this.$https.post('/examScoreEnter/studentScoreSave', querystring.stringify({
        type: 1,
        scoreId: item.id,
        examId: this.phase.examId,
        courseId: this.phase.courseId,
        courseName: this.phase.courseName,
        examStudentId: item.examStudentId,
        paperId: this.phase.paperId,
        totalScore: '',
        scoreDetail
      }))
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
        } else {
          this.pageNo = 1
          this.tableList = []
          this.getScoreList()
          notice(this, res.data.message, 2000)
        }
      })
    },
    downloadTem () {
      if (!this.phase.examId) {
        notice(this, '请选择科目', 2000)
        return
      }
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/examScoreEnter/studentScoreTemplateDownload?` +
                      `examId=${this.phase.examId}` +
                      `&classId=${this.phase.classId}` +
                      `&courseId=${this.phase.courseId}` +
                      `&paperId=${this.phase.paperId}` +
                      `&gradeId=${this.phase.gradeId}`
    },
    downloadScore () {
      if (!this.phase.examId) {
        notice(this, '请选择科目', 2000)
        return
      }
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/examScoreEnter/studentScoreDownload?` +
                      `examId=${this.phase.examId}` +
                      `&classId=${this.phase.classId}` +
                      `&courseId=${this.phase.courseId}` +
                      `&paperId=${this.phase.paperId}` +
                      `&gradeId=${this.phase.gradeId}`
    },
    // 获取题目和题目满分信息
    getQuestionList () {
      this.$https.get(`/examScoreEnter/questionList?examId=${this.phase.examId}&courseId=${this.phase.courseId}&paperId=${this.phase.paperId}`)
      .then(res => {
        if (res.data.code === 1) {
          console.log(res.data.result)
        }
      })
    },
    // 单个保存成绩录入信息
    saveScore (item) {
      this.$https.post('/examScoreEnter/studentScoreSave', querystring.stringify({
        type: 1,
        scoreId: item.id,
        examId: this.phase.examId,
        courseId: this.phase.courseId,
        courseName: this.phase.courseName,
        examStudentId: item.examStudentId,
        paperId: this.phase.paperId,
        totalScore: '',
        scoreDetail: ''
      }))
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  mounted () {
    document.querySelector('.exam-table').onscroll = _.throttle(() => {
      // console.log(document.querySelector('.exam-table').scrollTop)
      if (this.totalCount === this.tableList.length) return
      if (document.querySelector('.exam-table').scrollTop + document.querySelector('.exam-table').clientHeight >= document.querySelector('.exam-table').scrollHeight) {
        console.log('到底了')
        this.pageNo++
        this.getScoreList()
      }
    }, 400)
  }
}
</script>

<style lang="scss" scoped>
  .big-score {
    .table > section {
      width: 100%;
      display: flex;

      > section {
        td {
          min-width: 60px;
          height: 40px;
        }

        &:first-child {
          min-width: 300px !important;
          table {
            width: 100%;
          }
        }

        &:nth-child(2) {
          flex-grow: 1;
          overflow: auto;

          
        }
       

        table {
          width: 100%;
        }
      }
    }
  }
  .td-len {
    min-width: 60px;
    height: 40px;
    max-width: 120px;
    text-overflow: ellipsis; /* for IE */  
    -moz-text-overflow: ellipsis; /* for Firefox,mozilla */  
    overflow: hidden;  
    white-space: nowrap; 
  }
</style>

