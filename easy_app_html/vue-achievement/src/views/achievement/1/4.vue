<template>
  <div class="chart-1-4">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 300px;" >
        <el-option
          v-for="item in examList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getData">查询</el-button>
    </div>

    <div class="content" v-loading="loading">
      <div class="pie">
        <h3>各等级人数</h3>
        <chart :options="pieChart" class="echart"></chart>
        <p style="color: #CBD1D8;">此图直观表达了各等级学生人数的分布。</P>
      </div>
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
            :label="'一档(' + ((!table[0] || !table[0].gradeOneScore) ? 0 : table[0].gradeOneScore) + '以上)'"
            align="center">
            <el-table-column
              label="人数"
              width="80">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 1)" type="text" :disabled="scope.row.gradeOneNum === 0 || scope.row.schoolName == '全区年级'">
                  {{ scope.row.gradeOneNum}}
                </el-button>
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
            :label="'二档(' + ((!table[0] || !table[0].gradeOneScore) ? 0 : table[0].gradeOneScore) + '-' + ((!table[0] || !table[0].gradeTwoScore) ? 0 : table[0].gradeTwoScore) + ')'"
            align="center">
            <el-table-column
              label="人数"
              width="80">
               <template scope="scope">
                  <el-button @click="showStudent(scope.row, 2)" type="text" :disabled="scope.row.gradeTwoNum === 0 || scope.row.schoolName == '全区年级'">
                    {{ scope.row.gradeTwoNum}}
                  </el-button>
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
            :label="'三档(' + ((!table[0] || !table[0].gradeTwoScore) ? 0 : table[0].gradeTwoScore) + '-' + ((!table[0] || !table[0].gradeThreeScore) ? 0 : table[0].gradeThreeScore) + ')'"
            align="center">
            <el-table-column
              label="人数"
               width="80">
               <template scope="scope">
                  <el-button @click="showStudent(scope.row, 3)" type="text" :disabled="scope.row.gradeThreeNum === 0 || scope.row.schoolName == '全区年级'">
                    {{ scope.row.gradeThreeNum}}
                  </el-button>
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
            :label="'其他(' + ((!table[0] || !table[0].gradeThreeScore) ? 0 : table[0].gradeThreeScore) + '以下)'"
            align="center">
            <el-table-column
              label="人数"
               width="80">
               <template scope="scope">
                  <el-button @click="showStudent(scope.row, 4)" type="text" :disabled="scope.row.otherNum === 0 || scope.row.schoolName == '全区年级'">
                    {{ scope.row.otherNum }}
                  </el-button>
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
        </el-table>
        <p style="color: #CBD1D8;">一档（x）表示一档分数线是x分，点击人数可查看学生详细信息。</P>
        <chart :options="barChart" class="echart"></chart>
        <p style="color: #CBD1D8;">此图直观表格了各学校各等级人数的分布结构。</P>
    </div>
    <el-dialog title="学生列表" :visible.sync="dialog">
      <el-table :data="studentData" border max-height="300">
        <el-table-column property="examNo" label="考号" width="150" v-if="needExamNo"></el-table-column>
        <el-table-column property="studentName" label="姓名" width="100"></el-table-column>
        <el-table-column property="allScore" label="成绩">
          <template scope="scope">
            {{ scope.row.allScore.toFixed(1) }}
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
      num: 5,
      barChart: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['一档', '二档', '三档', '其他']
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
            name: '一档',
            type: 'bar',
            stack: '人数总量',
            label: {
              normal: {
                show: true,
                position: 'insideLeft'
              }
            },
            data: []
          },
          {
            name: '二档',
            type: 'bar',
            stack: '人数总量',
            label: {
              normal: {
                show: true,
                position: 'insideLeft'
              }
            },
            data: []
          },
          {
            name: '三档',
            type: 'bar',
            stack: '人数总量',
            label: {
              normal: {
                show: true,
                position: 'insideLeft'
              }
            },
            data: []
          },
          {
            name: '其他',
            type: 'bar',
            stack: '人数总量',
            label: {
              normal: {
                show: true,
                position: 'insideLeft'
              }
            },
            data: []
          }
        ]
      },
      pieChart: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'top',
          data: ['一档', '二档', '三档', '其他']
        },
        calculable: true,
        series: [
          {
            name: '人数',
            type: 'pie',
            radius: [20, 130],
            center: ['50%', '50%'],
            roseType: 'area',
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
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisResearch/totalScoreGradeDistributionExport?` +
                                  `examId=${this.examId}`
    },

    async showStudent (row, grade) {
      this.dialog = true
      this.studentData = []
      const { data: student } = await this.$https.get(`/analysisResearch/totalScoreGradeDistributionQueryDetail` +
                                `?gradeOne=${row.gradeOne}` +
                                `&gradeTwo=${row.gradeTwo}` +
                                `&gradeThree=${row.gradeThree}` +
                                `&schoolId=${row.schoolId}` +
                                `&grade=${grade}` +
                                `&examId=${this.examId}`)
      if (student.code === 1) {
        if (student.result) {
          this.studentData = [...student.result || []]
          this.needExamNo = this.studentData.every(item => item.examNo)
          return
        }
        this.studentData = []
        this.needExamNo = false
      } else {
        notice(this, student.message || '加载失败', 2000)
      }
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      this.loading = true
      const { data } = await this.$https.get(`/analysisResearch/totalScoreGradeDistributionQuery` +
                                      `?examId=${this.examId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.table = [...data.result || []]
        data.result = (data.result || []).filter(item => item.schoolId)
        this.barChart.yAxis.data = (data.result || []).map(item => item.schoolName)
        this.barChart.series[0].data = (data.result || []).map(item => item.gradeOneNum)
        this.barChart.series[1].data = (data.result || []).map(item => item.gradeTwoNum)
        this.barChart.series[2].data = (data.result || []).map(item => item.gradeThreeNum)
        this.barChart.series[3].data = (data.result || []).map(item => item.otherNum)
        this.pieChart.series[0].data = [
          {
            name: '一档',
            value: (data.result || [])
                    .map(item => item.gradeOneNum).length > 0 ? (data.result || [])
                    .map(item => item.gradeOneNum)
                    .reduce((pre, cur) => pre + cur) : 0
          },
          {
            name: '二档',
            value: (data.result || [])
                    .map(item => item.gradeTwoNum).length > 0 ? (data.result || [])
                    .map(item => item.gradeTwoNum)
                    .reduce((pre, cur) => pre + cur) : 0
          },
          {
            name: '三档',
            value: (data.result || [])
                    .map(item => item.gradeThreeNum).length > 0 ? (data.result || [])
                    .map(item => item.gradeThreeNum)
                    .reduce((pre, cur) => pre + cur) : 0
          },
          {
            name: '其他',
            value: (data.result || [])
                    .map(item => item.otherNum).length > 0 ? (data.result || [])
                    .map(item => item.otherNum)
                    .reduce((pre, cur) => pre + cur) : 0
          }
        ]
      }
      this.loading = false
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
.chart-1-4 {
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

    >.pie {
      margin-top: $width;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
