<template>
  <div class="chart-2-4">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 300px;" @change="getcourseList">
        <el-option
          v-for="item in examList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <span style="margin-left: 40px;">学科</span>
      <el-select v-model="courseId" placeholder="请选择学科" style="width: 300px;">
        <el-option
          v-for="item in courseList"
          :key="item.id"
          :label="item.courseName"
          :value="item.courseId">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getData">查询</el-button>
    </div>

    <div class="content" v-loading="loading">
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="examNo"
            v-if="needExamNo"
            label="考号">
          </el-table-column>
          <el-table-column
            prop="studentName"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="totalScore"
            label="分数">
            <template scope="scope">
              {{ scope.row.totalScore.toFixed(1) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="schoolName"
            label="所在学校">
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
      examId: '',
      courseList: [],
      courseId: '',
      loading: false,
      table: [],
      num: 5,
      needExamNo: ''
    }
  },

  methods: {
    exportButton () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      if (!this.courseId) {
        notice(this, '请选择学科', 2000)
        return
      }
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisCourse/studentSubjectTotalScoreExport?` +
                                  `examId=${this.examId}` +
                                  `&gradeId=${this.examList.filter(item => item.id === this.examId)[0].gradeId}` +
                                  `&subjectId=${this.courseId}` +
                                  `&examName=${this.examList.filter(item => item.id === this.examId)[0].name}` +
                                  `&subjectName=${this.courseList.filter(item => item.courseId === this.courseId)[0].courseName}`
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      if (!this.courseId) {
        notice(this, '请选择学科', 2000)
        return
      }
      this.loading = true
      const { data: student } = await this.$https.get(`/analysisCourse/studentSubjectTotalScoreQuery` +
                                      `?examId=${this.examId}&subjectId=${this.courseId}`)
      if (student.code !== 1) notice(this, student.message, 2000)
      else {
        this.table = student.result || []
        this.needExamNo = this.table.every(item => item.examNo)
      }
      this.loading = false
    },

    async getcourseList () {
      // 学期
      const scoreRuleId = this.examList.filter(item => item.id === this.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        return
      }
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result]
        this.courseId = this.courseList.length === 0 ? '' : this.courseList[0].courseId
      }
    }
  },

  async created () {
    // 考试列表
    const { data: examList } = await this.$https.get('/common/examList')
    if (examList.code === 1) {
      this.examList = [...examList.result || []]
      if (sessionStorage.PARAMS_EXAMID > 0) this.examId = Number(sessionStorage.PARAMS_EXAMID)
      else this.examId = this.examList.length > 0 ? this.examList[0].id : ''
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      await this.getcourseList()
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
.chart-2-4 {
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
