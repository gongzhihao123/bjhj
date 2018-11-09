<template>
  <div class="chart-1-1">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 200px;">
        <el-option
          v-for="item in examList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <span style="margin-left: 40px">分数段</span>
      <el-input-number v-model="num"  :min="5"></el-input-number>
      <el-button type="primary" @click="getData">查询</el-button>
    </div>

    <div class="content" v-loading="loading">
        <chart :options="lineChart" class="echart"></chart>
        <p style="color: #CBD1D8;">从曲线图中可观察总分分布状态及其他分布偏态，观察人数分布最集中的分数区间；判断高分段与低分段学生集中度的相对差异。</p >
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="sectionName"
            label="分数">
          </el-table-column>
          <el-table-column
            label="人数">
            <template scope="scope">
              <el-button @click="showStudent(scope.row)" type="text" :disabled="scope.row.section[0].number === 0">
                {{ scope.row.section[0].number }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="比率">
            <template scope="scope">
              {{ (scope.row.section[0].ratio * 100).toFixed(2) + '%' }}
            </template>
          </el-table-column>
          <el-table-column
            label="累计人数">
            <template scope="scope">
              {{ scope.row.section[0].cumulativeNumber }}
            </template>
          </el-table-column>
          <el-table-column
            label="累计比率">
            <template scope="scope">
              {{ scope.row.section[0].cumulativeRatio != 'NaN' ? (scope.row.section[0].cumulativeRatio * 100).toFixed(2) + '%' : 0 }}
            </template>
          </el-table-column>
        </el-table>
        <p style="color: #CBD1D8;">从表数据具体表达了各个分数段的人数分布，点击人数可查看在该分数段内学生的详细信息。</p >
    </div>
    <el-dialog title="学生列表" :visible.sync="dialog">
      <el-table :data="studentData" border max-height="300">
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
      num: 10,
      lineChart: {
        color: ['#35a9eb'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          name: '分数',
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
          type: 'value',
          name: '人数'
        },
        series: [
          {
            name: '人数',
            type: 'line',
            stack: '人数',
            smooth: true,
            data: []
          }
        ]
      }
    }
  },

  methods: {

    exportButton () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisResearch/totalScoreDistributionAnalysisExport?` +
                                  `examId=${this.examId}` +
                                  `&scoreSegment=${this.num}`
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      this.loading = true
      const { data: total } = await this.$https.get(`/analysisResearch/totalScoreDistributionAnalysisQuery` +
                                      `?examId=${this.examId}&scoreSegment=${this.num}`)
      if (total.code !== 1) notice(this, total.message, 2000)
      else {
        this.table = [...total.result]
        this.lineChart.xAxis.data = total.result
                                    .map(item => item.sectionName.split('~')[0])
                                    .reverse()
        this.lineChart.series[0].data = total.result.map(item => item.section[0].number).reverse()
      }
      this.loading = false
    },
    async showStudent (row) {
      this.dialog = true
      this.studentData = []
      const { data: student } = await this.$https.get(`/analysisResearch/totalScoreDistributionAnalysisQueryDetail` +
                                `?sectionName=${row.sectionName}` +
                                `&examId=${this.examId}`)
      if (student.code === 1) {
        if (student.result) {
          this.studentData = [...student.result || []]
          return
        }
        this.studentData = []
      } else {
        notice(this, student.message || '加载失败', 2000)
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
.chart-1-1 {
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
