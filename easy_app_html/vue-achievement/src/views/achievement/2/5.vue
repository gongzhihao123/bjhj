<template>
  <div class="chart-2-5">
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
            min-width="120px"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            :label="'一档(' + (baseData.gradeOneScore || 0) + '以上)'"
            align="center">
            <el-table-column
              label="人数"
              min-width="40">
              <template scope="scope">
                <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 1)" type="text"  :disabled="scope.row.gradeOneNum === 0">
                  {{ scope.row.gradeOneNum}}
                </el-button>
                <span v-if="!scope.row.schoolId">
                  {{ scope.row.gradeOneNum}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              prop="gradeOnePercent">
              <template scope="scope">
                {{ (scope.row.gradeOnePercent * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'二档(' + (baseData.gradeOneScore || 0) + '-' + (baseData.gradeTwoScore || 0) + ')'"
            align="center">
            <el-table-column
              label="人数"
              min-width="40">
               <template scope="scope">
                  <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 2)" type="text"  :disabled="scope.row.gradeTwoNum === 0">
                    {{ scope.row.gradeTwoNum}}
                  </el-button>
                  <span v-if="!scope.row.schoolId">
                    {{ scope.row.gradeTwoNum}}
                  </span>
               </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              prop="gradeTwoPercent">
              <template scope="scope">
                {{ (scope.row.gradeTwoPercent * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'三档(' + (baseData.gradeTwoScore || 0) + '-' + (baseData.gradeThreeScore || 0) + ')'"
            align="center">
            <el-table-column
              label="人数"
               min-width="40">
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
              prop="gradeThreePercent">
              <template scope="scope">
                {{ (scope.row.gradeThreePercent * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'其他（' + (baseData.gradeThreeScore || 0) + '以下)'"
            align="center">
            <el-table-column
              label="人数"
               min-width="40">
               <template scope="scope">
                  <el-button v-if="scope.row.schoolId" @click="showStudent(scope.row, 4)" type="text" :disabled="scope.row.otherNum === 0">
                    {{ scope.row.otherNum}}
                  </el-button>
                  <span v-if="!scope.row.schoolId">
                    {{ scope.row.otherNum}}
                  </span>
               </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              prop="otherNumPercent">
              <template scope="scope">
                {{ (scope.row.otherNumPercent * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      <div class="lever1 lever">
        <p>一档学校学科上线人数图</p>
        <chart :options="barChart1" class="echart"></chart>
      </div>

      <div class="lever2 lever">
        <p>二档学校学科上线人数图</p>
        <chart :options="barChart2" class="echart"></chart>
      </div>

      <div class="lever3 lever">
        <p>三档学校学科上线人数图</p>
        <chart :options="barChart3" class="echart"></chart>
      </div>

      <div class="lever4 lever">
        <p>其他学校学科上线人数图</p>
        <chart :options="barChart4" class="echart"></chart>
      </div>
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
import { deepClone } from '../../../utils/deepClone'

export default {
  data () {
    return {
      dialog: false,
      examList: [],
      examId: '',
      courseList: [],
      courseId: '',
      loading: false,
      table: [],
      studentData: [],
      num: 5,
      barChart4: {},
      barChart3: {},
      barChart2: {},
      barChart1: {},
      form: {},
      baseData: {},
      commonChart: {
        color: ['#31a6e8'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '6%',
          left: '3%',
          right: '4%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          textStyle: {
            fontSize: 10,
            align: 'center'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  fontSize: 14
                }
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
      window.location.href = `${path}/analysisCourse/subjectOnLinePeopleNumDistributionExport?` +
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
      const { data: subject } = await this.$https.get(`/analysisCourse/subjectOnLinePeopleNumDistributionQuery` +
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
          subject.result.list = (subject.result.list || []).filter(item => item.schoolId !== null)
          this.commonChart.xAxis.data = subject.result.list.map(item => item.schoolName)
          this.barChart1 = deepClone(this.commonChart)
          this.barChart2 = deepClone(this.commonChart)
          this.barChart3 = deepClone(this.commonChart)
          this.barChart4 = deepClone(this.commonChart)
          this.barChart1.series[0].data = subject.result.list.map(item => item.gradeOneNum)
          this.barChart2.series[0].data = subject.result.list.map(item => item.gradeTwoNum)
          this.barChart3.series[0].data = subject.result.list.map(item => item.gradeThreeNum)
          this.barChart4.series[0].data = subject.result.list.map(item => item.otherNum)
        } else {
          this.table = []
          this.baseData = {
            gradeOneScore: 0,
            gradeTwoScore: 0,
            gradeThreeScore: 0
          }
          this.commonChart.xAxis.data = []
          this.barChart1 = deepClone(this.commonChart)
          this.barChart2 = deepClone(this.commonChart)
          this.barChart3 = deepClone(this.commonChart)
          this.barChart4 = deepClone(this.commonChart)
          this.barChart1.series[0].data = []
          this.barChart2.series[0].data = []
          this.barChart3.series[0].data = []
          this.barChart4.series[0].data = []
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
.chart-2-5 {
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
