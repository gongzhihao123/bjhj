<template>
  <div class="chart-4-2">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 160px;" @change="getSchool">
            <el-option
              v-for="item in examList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学校"
          ref="school"
          prop="schoolId"
          :rules="[
            { required: true, type: 'number', message: '请选择学校', trigger: 'change' }
          ]">
          <el-select v-model="form.schoolId" placeholder="请选择学校" style="width: 160px;" @change="getClass">
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="班级"
          prop="classId"
          ref="classes"
          :rules="[
            { required: true, type: 'number', message: '请选择班级', trigger: 'change' }
          ]">
          <el-select v-model="form.classId" placeholder="请选择班级" style="width: 160px;">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">查询</el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="content" v-loading="loading" v-if="table.length != 0">
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="examNo"
            min-width="80px"
            label="考号"
            :class="{td: true}"
            v-if="needExamNo"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="studentName"
            min-width="80"
            label="姓名"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="allScore"
            min-width="80"
            label="总分"
            show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.allScore.toFixed(1) }}
            </template>
          </el-table-column>
          <el-table-column 
            v-for="(item, index) in subject" 
            :key="index" 
            :label="item.courseName"
            min-width="80">
            <template scope="scope">
              {{ (scope.row.listObjectScore[index].courseScore % 1 > 0) ? scope.row.listObjectScore[index].courseScore.toFixed(1) : scope.row.listObjectScore[index].courseScore }}
            </template>
          </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'

export default {
  data () {
    return {
      examList: [],
      schoolList: [],
      gradeList: [],
      classList: [],
      state: false,
      subject: [],
      form: {
        examId: '',
        schoolId: '',
        classId: ''
      },
      loading: false,
      table: [],
      needExamNo: false
    }
  },

  methods: {

    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisClass/classTotalScoreDistributionExport?` +
                                  `examId=${this.form.examId}` +
                                  `&schoolId=${this.form.schoolId}` +
                                  `&schoolName=${this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName}` +
                                  `&classId=${this.form.classId}` +
                                  `&className=${this.classList.filter(item => item.id === this.form.classId)[0].name}`
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    submitForm (formName) {
      this.needExamNo = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    async getData () {
      this.loading = true
      this.table = []
      this.needExamNo = []
      this.subject = []
      const { data: subject } = await this.$https.get(`/analysisClass/classTotalScoreDistributionQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}` +
                                      `&classId=${this.form.classId}`)
      if (subject.code !== 1) notice(this, subject.message, 2000)
      else {
        this.table = [...subject.result]
        this.needExamNo = this.table.every(item => item.examNo)
        this.subject = subject.result.length === 0
                      ? []
                      : [...subject.result[0].listObjectScore]
      }
      this.loading = false
    },

    async getSchool () {
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      const { data } = await this.$https.get(`/common/achievementSchoolList?examId=${this.form.examId}`)
      if (data.code === 1) {
        this.schoolList = [...data.result || []]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      }
    },

    async getClass (e) {
      this.$refs.classes.resetField()
      const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
      const { data } = await this.$https.get(`/common/gradeClassList` +
                              `?semesterId=${nowList.semesterId}` +
                              `&sectionId=${nowList.sectionId}` +
                              `&gradeId=${nowList.gradeId}` +
                              `&schoolId=${this.form.schoolId}`)
      if (data.code === 1) {
        this.classList = data.result.map(item => ({ name: `${item.gradeName}${item.className}`, id: item.id }))
        this.form.classId = this.classList.length === 0 ? '' : this.classList[0].id
      }
      if (this.state === false) {
        this.state = true
        this.getData()
      }
    }
  },

  async created () {
    // 考试列表
    const { data: examList } = await this.$https.get('/common/examList')
    if (examList.code === 1) {
      this.examList = [...examList.result || []]
      if (sessionStorage.PARAMS_EXAMID > 0) this.form.examId = Number(sessionStorage.PARAMS_EXAMID)
      else this.form.examId = this.examList.length > 0 ? this.examList[0].id : ''
    } else if (examList.code === -2) {
      error()
    } else {
      notice(this, examList.message, 2000)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/variable.scss';
.chart-4-2 {
  position: relative;
  >.el-button {
    position: absolute;
    right: 0;
    top: -66px;
  }
  
  >.select {

    >.el-select {
      margin-left: $width;
    }

    >.el-button {
      margin-left: $width;
    }
  }

  >.content {

    >.el-table {
      margin: $width auto;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
