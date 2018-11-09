<template>
  <div class="big-score">
    <header class="exam-head">
      <el-button type="primary" class="more-upload" v-if="menu.buttons && menu.buttons.scoreBatchUpload == 1" @click="leadClick">批量上传</el-button>
      <el-button type="primary" class="more-download" v-if="menu.buttons && menu.buttons.scoreBatchDownload == 1" @click="downloadScore">批量下载</el-button>
      <el-button type="primary" class="more-submit" v-if="menu.buttons && menu.buttons.scoreBatchCommit == 1" @click="commit">提交</el-button>
      
      <el-input
        placeholder="输入学生姓名搜索"
        icon="search"
        v-model="searchStudent"
        @keyup.enter.native="handleIconClick"
        :on-icon-click="handleIconClick">
      </el-input>
      <el-button type="success" class="more-enter" @click="route('/exam/smallScore')">录入小题成绩</el-button>
    </header>




    <section class="table" v-loading="loading" 
      element-loading-text="数据加载中,请稍后..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <table>
        <tr>
          <th v-for="item in tableHead" :key="item.name">{{ item.name }}</th>
          <th v-for="item in structure" :key="item.id">{{ item.partsName }}</th>
        </tr>
        <tr v-for="(item, i) in tableList" :key="item.name">
          <td>{{ i + 1 }}</td>
          <td class="td-len" :title="item.studentNo">{{ item.studentNo }}
            <!-- <el-input v-model="item.studentNo"></el-input> -->
          </td>
          <td>{{ item.gradeName }}</td>
          <td>{{ item.className }}</td>
          <td>{{ item.studentName }}</td>
          <td>{{ item.studentCode }}</td>
          <td>{{ item.courseName }}</td>
          <td>
            <el-radio class="radio" v-model="item.lackFlag" :label="1" @change.native="saveScore(item, null, 0)">是</el-radio>
            <el-radio class="radio" v-model="item.lackFlag" :label="0" @change.native="saveScore(item, null, 0)">否</el-radio>
          </td>
          <td>{{ item.comprehensiveScore || 0 }}</td>
          <!-- <td class="test-input">
            <el-input v-model="item.totalScore" @blur="saveScore(item)"></el-input>
          </td> -->
          <td class="test-input" v-for="(items, ind) in structure" :key="ind">
            <el-input v-model="item.scoreStructureList[ind].structureScore" @blur="saveScore(item, items, item.scoreStructureList[ind].structureScore)"></el-input>
            <!-- <el-input :v-model="calc(item.scoreStructureList, items.structureId)" @blur="saveScore(item, items)"></el-input> -->
          </td>
        </tr>
        <tr v-if="tableList.length == 0">
          <td :colspan="tableHead.length + structure.length">暂无数据</td>
        </tr>
      </table>


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
      loadingImport: false,
      loading: false,
      uploadShow: false,
      searchStudent: '',
      tableHead: [
        { name: '序号' },
        { name: '考号' },
        { name: '年级' },
        { name: '班级' },
        { name: '学生姓名' },
        { name: '学籍号' },
        { name: '学科' },
        { name: '是否缺考' },
        { name: '综合成绩' }
      ],
      tableList: [
      ],
      subjectList: [
        { name: '物理', checked: '' },
        { name: '化学', checked: '' },
        { name: '生物', checked: '' },
        { name: '政治', checked: '' },
        { name: '地理', checked: '' },
        { name: '历史', checked: '' }
      ],
      res: -5,
      phase: {
        gradeId: '',
        sectionId: '',
        semesterId: '',
        companyId: ''
      },
      pageNo: 1,
      pageSize: 50,
      totalCount: 0,
      structure: []
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
  async created () {
    this.phase = JSON.parse(sessionStorage.EXAMINFO)
    this.phase.courseId = this.$route.query.courseId
    this.phase.courseName = this.$route.query.courseName
    this.phase.classId = this.$route.query.classId
    // if (this.phase.parent === 1) {
    await this.getStructure()
    this.getScoreList()
    // }
  },
  methods: {
    handleIconClick () {
      this.tableList = []
      this.pageNo = 1
      this.getScoreList()
    },
    route (r) {
      this.$router.push({path: r, query: {phase: JSON.stringify(this.phase)}})
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
        notice(this, res.message, 2000)
        this.loadingImport = false
        this.pageNo = 1
        this.searchStudent = ''
        this.tableList = []
        this.$emit('from-child-msg', this.loadingImport)
        this.getScoreList()
      }
    },
    getScoreList () {
      // if (!this.phase.examId) {
      //   notice(this, '请选择学科  ', 2000)
      //   return
      // }
      this.loading = true
      this.$https.get(`/examScoreEnter/studentScoreListPage?type=0` +
                      `&examId=${this.phase.examId}` +
                      `&classId=${this.phase.classId}` +
                      `&courseId=${this.phase.courseId}` +
                      `&courseName=${this.phase.courseName}` +
                      `&keyword=${this.searchStudent}` +
                      `&pageNo=${this.pageNo}` +
                      `&pageSize=${this.pageSize}` +
                      `&gradeId=${this.phase.gradeId}`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          // console.log(res.data.result)
          let result = (res.data.result.list || []).map(item => ({
            ...item,
            scoreStructureList: this.structure.map(items => {
              let res = item.scoreStructureList.find(str => str.structureId === items.id)
              return res ? {...res} : {examScoreId: item.id, structureId: items.id, structureScore: 0}
            })
          }))
          this.tableList = this.tableList.concat(result)
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
      this.searchStudent = ''
      this.tableList = []
      this.pageNo = 1
      this.getScoreList()
    },
    downloadTem () {
      if (!this.phase.examId) {
        notice(this, '请选择学科', 2000)
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
        notice(this, '请选择学科', 2000)
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
    commit () {
      // this.$https.get(`/examScoreEnter/studentScoreCommit?examId=${this.phase.examId}&courseId=${this.phase.courseId}`)
      this.$https.post(`/examScoreEnter/studentScoreCommit`, querystring.stringify({
        examId: this.phase.examId,
        courseId: this.phase.courseId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message || '提交成功', 2000)
          // console.log(res.data.result)
        } else {
          notice(this, res.data.result, 2000)
        }
      })
    },
    // 单个保存成绩录入信息
    saveScore (item, items, score) {
      if (!score && score !== 0) return
      let structureScoreDetail = JSON.stringify(item.scoreStructureList)
      this.$https.post('/examScoreEnter/studentScoreSave', querystring.stringify({
        type: 0,
        scoreId: item.id,
        examId: this.phase.examId,
        courseId: this.phase.courseId,
        courseName: this.phase.courseName,
        examStudentId: item.examStudentId,
        paperId: this.phase.paperId,
        totalScore: item.totalScore,
        lackFlag: item.lackFlag,
        scoreDetail: '',
        structureScoreDetail
      }))
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
          item.comprehensiveScore = res.data.result || 0
        } else {
          this.tableList = []
          this.getScoreList()
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取成绩结构信息
    async getStructure () {
      await this.$https.get(`/examScoreEnter/structure?examId=${this.phase.examId}&courseId=${this.phase.courseId}`)
      .then(res => {
        if (res.data.code === 1) {
          console.log(res.data.result)
          this.structure = res.data.result || []
        } else notice(this, res.data.message, 2000)
      })
    },
    calc (arr, structureId) {
      return arr.find(item => item.structureId === structureId) ? arr.find(item => item.structureId === structureId).structureScore : 0
    }
  },
  mounted () {
    document.querySelector('.exam-table').onscroll = _.throttle(() => {
      console.log(document.querySelector('.exam-table').scrollTop)
      if (this.totalCount === this.tableList.length) return
      if (document.querySelector('.exam-table').scrollTop + document.querySelector('.exam-table').clientHeight >= (document.querySelector('.exam-table').scrollHeight - 1)) {
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
    .table {
      table {
        width: 100%;
      }
    }
    .el-loading-spinner {
      bottom: 0 !important;
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

