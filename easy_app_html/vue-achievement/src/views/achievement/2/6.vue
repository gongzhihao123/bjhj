<template>
  <div class="chart-2-6">
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
            prop="schoolName"
            label="学校"
            fixed
            width="120px"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            :label="'一档(' + (baseData.gradeOneScore || 0) + '以上)'"
            align="center">
            <el-table-column
              label="人数"
              width="60">
              <template scope="scope">
                <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 1)" type="text"  :disabled="scope.row.gradeOneNum === 0 || scope.row.schoolId === 0 ">
                  {{ scope.row.gradeOneNum}}
                </el-button>
                <span v-if="!scope.row.schoolId">
                  {{ scope.row.gradeOneNum}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              prop="gradeOnePercent"
              min-width="120">
              <template scope="scope">
                {{ ((scope.row.gradeOnePercent || 0) * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
            <el-table-column
              label="平均分"
              prop="gradeOneAvg"
              width="80">
              <template scope="scope">
                {{ (scope.row.gradeOneAvg || 0).toFixed(2)}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'二档(' + (baseData.gradeOneScore || 0) + '-' + (baseData.gradeTwoScore || 0) + ')'"
            align="center">
            <el-table-column
              label="人数"
              width="60">
               <template scope="scope">
                  <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 2)" type="text" :disabled="scope.row.gradeTwoNum === 0 || scope.row.schoolId === 0">
                    {{ scope.row.gradeTwoNum}}
                  </el-button>
                  <span v-if="!scope.row.schoolId">
                    {{ scope.row.gradeTwoNum}}
                  </span>
               </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              prop="gradeTwoPercent"
              min-width="120">
              <template scope="scope">
                {{ ((scope.row.gradeTwoPercent || 0) * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
            <el-table-column
              label="平均分"
              prop="gradeTwoAvg"
              width="80">
              <template scope="scope">
                {{ (scope.row.gradeTwoAvg || 0).toFixed(2)}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'三档(' + (baseData.gradeTwoScore || 0) + '-' + (baseData.gradeThreeScore || 0) + ')'"
            align="center">
            <el-table-column
              label="人数"
               width="60">
               <template scope="scope">
                  <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 3)" type="text" :disabled="scope.row.gradeThreeNum === 0 || scope.row.schoolId === 0">
                    {{ scope.row.gradeThreeNum}}
                  </el-button>
                  <span v-if="!scope.row.schoolId">
                    {{ scope.row.gradeThreeNum}}
                  </span>
               </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              prop="gradeThreePercent"
              min-width="120">
              <template scope="scope">
                {{ ((scope.row.gradeThreePercent || 0) * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
            <el-table-column
              label="平均分"
              prop="gradeThreeAvg"
              width="80">
              <template scope="scope">
                {{ (scope.row.gradeThreeAvg || 0).toFixed(2)}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'其他(' + (baseData.gradeThreeScore || 0) + '以下)'"
            align="center">
            <el-table-column
              label="人数"
               width="60">
               <template scope="scope">
                  <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 4)" type="text" :disabled="scope.row.otherNum === 0 || scope.row.schoolId === 0">
                    {{ scope.row.otherNum }}
                  </el-button>
                  <span v-if="!scope.row.schoolId">
                    {{ scope.row.otherNum}}
                  </span>
               </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              prop="otherNumPercent"
              min-width="120">
              <template scope="scope">
                {{ ((scope.row.otherNumPercent || 0) * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
            <el-table-column
              label="平均分"
              prop="otherAvg"
              width="80">
              <template scope="scope">
                {{ (scope.row.otherAvg || 0).toFixed(2)}}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
    </div>
    <el-dialog title="学生列表" :visible.sync="dialog">
      <el-table :data="studentData" border max-height="300">
        <el-table-column property="examNo" label="考号" width="150" v-if="needExamNo"></el-table-column>
        <el-table-column property="name" label="姓名" width="100"></el-table-column>
        <el-table-column property="score" label="成绩">
          <template scope="scope">
            {{ scope.row.score.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column property="schoolName" label="学校"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'

export default {
  data () {
    return {
      dialog: false,
      studentData: [],
      examList: [],
      examId: '',
      courseList: [],
      courseId: '',
      loading: false,
      table: [],
      baseData: {},
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
      window.location.href = `${path}/analysisCourse/subjectOnLineGroupSchoolLevelDistributionExport?` +
                                  `examId=${this.examId}` +
                                  `&subjectId=${this.courseId}` +
                                  `&examName=${this.examList.filter(item => item.id === this.examId)[0].name}` +
                                  `&gradeId=${this.examList.filter(item => item.id === this.examId)[0].gradeId}`
    },

    async showStudent (row, grade) {
      this.dialog = true
      this.studentData = []
      const { data: student } = await this.$https.get(`/analysisCourse/subjectOnLinePeopleNumDistributionDetailQuery` +
                                `?gradeOne=${row.gradeOne}` +
                                `&gradeTwo=${row.gradeTwo}` +
                                `&gradeThree=${row.gradeThree}` +
                                `&schoolId=${row.schoolId}` +
                                `&schoolName=${row.schoolName}` +
                                `&grade=${grade}` +
                                `&examId=${this.examId}` +
                                `&subjectId=${this.courseId}` +
                                `&subjectName=${this.courseList.filter(item => item.courseId === this.courseId)[0].courseName}`)
      if (student.code === 1) {
        this.studentData = [...student.result]
        this.needExamNo = this.studentData.every(item => item.examNo)
      }
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
      const { data: subject } = await this.$https.get(`/analysisCourse/subjectOnLineGroupSchoolLevelDistributionQuery` +
                                      `?examId=${this.examId}&subjectId=${this.courseId}`)
      if (subject.code !== 1) notice(this, subject.message, 2000)
      else {
        if (subject.result) {
          this.table = [...subject.result.list]
          this.baseData = {
            gradeOneScore: subject.result.gradeOneScore,
            gradeTwoScore: subject.result.gradeTwoScore,
            gradeThreeScore: subject.result.gradeThreeScore
          }
        } else {
          this.table = []
          this.baseData = {
            gradeOneScore: 0,
            gradeTwoScore: 0,
            gradeThreeScore: 0
          }
        }
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
.chart-2-6 {
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
