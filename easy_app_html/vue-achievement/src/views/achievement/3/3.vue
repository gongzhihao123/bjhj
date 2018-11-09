<template>
  <div class="chart-3-3">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 200px;" @change="change">
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
          prop="schoolId"
          :rules="[
            { required: true, type: 'number', message: '请选择学校', trigger: 'change' }
          ]">
          <el-select v-model="form.schoolId" placeholder="请选择学校" style="width: 200px;">
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学科"
          prop="courseId"
          :rules="[
            { required: true, type: 'string', message: '请选择学科', trigger: 'change' }
          ]">
          <el-select v-model="form.courseId" placeholder="请选择学科" style="width: 200px;">
            <el-option
              v-for="item in courseList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">查询</el-button>
        </el-form-item>

      </el-form>
      
    </div>
    <div class="content" v-loading="loading">

        <el-table
          :data="table"
          border
          style="width: 100%">
          <el-table-column
            prop="examNo"
            label="考号"
            v-if="needExamNo"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="studentName"
            label="姓名"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="score"
            min-width="150"
            label="分数">
            <template scope="scope">
              {{ (scope.row.score % 1 > 0) ? scope.row.score.toFixed(1) : scope.row.score }}
            </template>
          </el-table-column>
        </el-table>

    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'
// import { deepClone } from '../../../utils/deepClone'

export default {
  data () {
    return {
      examList: [],
      examId: '',
      schoolList: [],
      schoolId: '',
      courseList: '',
      schoolName: '',
      loading: false,
      table: [],
      subject: [],
      form: {
        examId: '',
        schoolId: '',
        courseId: ''
      },
      needExamNo: ''
    }
  },

  methods: {
    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisSchool/schoolStudentSubjectTotalScoreExport?` +
                                      `courseId=${this.form.courseId}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&examId=${this.form.examId}` +
                                      `&schoolName=${this.schoolName}`
        } else {
          return false
        }
      })
    },

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getData()
        } else {
          return false
        }
      })
    },

    change () {
      this.getschoolList()
      this.getcourseList()
    },

    async getData () {
      this.loading = true
      this.schoolName = this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''
      const { data } = await this.$https.get(`/analysisSchool/schoolStudentSubjectTotalScoreQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}` +
                                      `&courseId=${this.form.courseId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.table = data.result || []
        this.needExamNo = this.table.every(item => item.examNo)
      }
      this.loading = false
    },

    async getschoolList () {
      // 学校
      const { data: school } = await this.$https.get(`/common/achievementSchoolList` +
                                      `?examId=${this.form.examId}`)
      if (school.code !== 1) notice(this, school.message, 2000)
      else {
        this.schoolList = [...school.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      }
    },

    async getcourseList () {
      // 学科
      const scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        this.courseList = []
        return
      }
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.form.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result || []]
        this.form.courseId = this.courseList.length === 0 ? '' : this.courseList[0].courseId
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
      await this.getschoolList()
      await this.getcourseList()
      this.schoolName = this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''
      this.getData()
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
.chart-3-3 {
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
