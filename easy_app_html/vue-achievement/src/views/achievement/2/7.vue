<template>
  <div class="chart-2-7">
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
            :label="'优秀(' + (baseData.gradeOneScore || 0) + '以上)'"
            align="center">
            <el-table-column
              label="人数"
              width="80">
              <template scope="scope">
                <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 1)" type="text" :disabled="scope.row.gradeOneNum === 0">
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
                {{ (scope.row.gradeOnePercent * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'良好(' + (baseData.gradeOneScore || 0) + '-' + (baseData.gradeTwoScore || 0) + ')'"
            align="center">
            <el-table-column
              label="人数"
              width="80">
               <template scope="scope">
                  <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 2)" type="text" :disabled="scope.row.gradeTwoNum === 0">
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
                {{ (scope.row.gradeTwoPercent * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'及格(' + (baseData.gradeTwoScore || 0) + '-' + (baseData.gradeThreeScore || 0) + ')'"
            align="center">
            <el-table-column
              label="人数"
               width="80">
               <template scope="scope">
                  <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 3)" type="text" :disabled="scope.row.gradeThreeNum === 0">
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
                {{ (scope.row.gradeThreePercent * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'不及格(' + (baseData.gradeThreeScore || 0) + '以下)'"
            align="center">
            <el-table-column
              label="人数"
               width="80">
               <template scope="scope">
                  <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 4)" type="text" :disabled="scope.row.otherNum === 0">
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
                {{ (scope.row.otherNumPercent * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="rangeRatio"
            label="极差率"
            width="120px"
            show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.rangeRatio ? scope.row.rangeRatio : 0 }}
            </template>
          </el-table-column>
        </el-table>
        <chart :options="barChart" class="echart"></chart>
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
      barChart: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: '优良等级分析图',
          left: 'left'
        },
        legend: {
          data: ['优秀', '良好', '及格', '不及格']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          name: '人数',
          type: 'value'
        },
        yAxis: {
          name: '学校',
          type: 'category',
          data: []
        },
        series: [
          {
            name: '优秀',
            type: 'bar',
            stack: '人数总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: []
          },
          {
            name: '良好',
            type: 'bar',
            stack: '人数总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: []
          },
          {
            name: '及格',
            type: 'bar',
            stack: '人数总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: []
          },
          {
            name: '不及格',
            type: 'bar',
            stack: '人数总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: []
          }
        ]
      },
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
      window.location.href = `${path}/analysisCourse/subjectRankSchoolDistributionExport?` +
                                  `examId=${this.examId}` +
                                  `&subjectId=${this.courseId}` +
                                  `&examName=${this.examList.filter(item => item.id === this.examId)[0].name}` +
                                  `&subjectName=${this.courseList.filter(item => item.courseId === this.courseId)[0].courseName}` +
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
      const { data } = await this.$https.get(`/analysisCourse/subjectRankSchoolDistributionQuery` +
                                      `?examId=${this.examId}&subjectId=${this.courseId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        if (data.result) {
          this.table = [...data.result.list]
          this.baseData = {
            gradeOneScore: data.result.gradeOneScore,
            gradeTwoScore: data.result.gradeTwoScore,
            gradeThreeScore: data.result.gradeThreeScore
          }
          data.result.list = data.result.list.filter(item => item.schoolId !== 0)
          this.barChart.yAxis.data = data.result.list.map(item => item.schoolName)
          this.barChart.series[0].data = data.result.list.map(item => item.gradeOneNum)
          this.barChart.series[1].data = data.result.list.map(item => item.gradeTwoNum)
          this.barChart.series[2].data = data.result.list.map(item => item.gradeThreeNum)
          this.barChart.series[3].data = data.result.list.map(item => item.otherNum)
        } else {
          this.table = []
          this.baseData = {
            gradeOneScore: 0,
            gradeTwoScore: 0,
            gradeThreeScore: 0
          }
          this.barChart.yAxis.data = []
          this.barChart.series[0].data = []
          this.barChart.series[1].data = []
          this.barChart.series[2].data = []
          this.barChart.series[3].data = []
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

  watch: {
    courseId () {
      this.barChart.title.text = this.courseList.filter(item => item.courseId === this.courseId)[0].courseName + '优良等级分析图'
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
.chart-2-7 {
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
