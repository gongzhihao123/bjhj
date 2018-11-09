<template>
  <div class="chart-3-2">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 300px;" @change="getschoolList">
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
          <el-select v-model="form.schoolId" placeholder="请选择学校" style="width: 300px;">
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">查询</el-button>
        </el-form-item>

      </el-form>
      
    </div>
    <div class="content" v-loading="loading">
      <template>
        <el-table
          :data="table"
          border
          style="width: 100%">
          <el-table-column
            prop="examNo"
            label="考号"
            v-if="needExamNo"
            width="180">
          </el-table-column>
          <el-table-column
            prop="studentName"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="totalScore"
            label="总分">
            <template scope="scope">
              <span v-if="scope.row.totalScore"> {{ scope.row.totalScore.toFixed(1) }} </span>
              <span v-else> 0</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in courseList"
            :key="index"
            :label="item.courseName">
            <template scope="scope">
              <span v-if="scope.row.courseList.length !== 0">
                <span v-if="item.courseId === child.courseId" v-for="(child, i) in scope.row.courseList" :key="i">
                  {{ (child.score % 1 > 0) ? child.score.toFixed(1) : child.score }}
                </span>
                <!-- <span v-else> -- </span> -->
              </span>
              <span v-else> 0 </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
      schoolName: '',
      courseList: [],
      loading: false,
      table: [],
      subject: [],
      form: {
        examId: '',
        schoolId: ''
      },
      needExamNo: ''
    }
  },

  methods: {
    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisSchool/schoolTotalScoreDistributionExport?` +
                                      `schoolId=${this.form.schoolId}` +
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
          this.getCourseList()
          this.getData()
        } else {
          return false
        }
      })
    },

    async getData () {
      this.loading = true
      this.schoolName = this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''
      const { data } = await this.$https.get(`/analysisSchool/schoolTotalScoreDistributionQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.table = data.result || []
        this.needExamNo = this.table.every(item => item.examNo)
      }
      this.loading = false
    },

    async getCourseList () {
      // 获取考试科目信息
      let scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        this.courseList = []
        return
      }
      const { data } = await this.$https.get(`/common/courseList` +
                                            `?examId=${this.form.examId}` +
                                            `&scoreRuleId=${scoreRuleId}`)
      this.courseList = data.result || []
    },

    async getschoolList () {
      // 学校列表
      const { data: school } = await this.$https.get(`/common/achievementSchoolList` +
                                      `?examId=${this.form.examId}`)
      if (school.code !== 1) notice(this, school.message, 2000)
      else {
        this.schoolList = [...school.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
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
      this.schoolName = this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''
      this.getCourseList()
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
.chart-3-2 {
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

