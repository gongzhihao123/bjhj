<template>
  <div class="chart-1-11">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 300px;">
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
      <div class="lever1 lever">
        <p>一档人数</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            prop="gradeOneNum"
            label="一档人数">
          </el-table-column>
        </el-table>
        <chart :options="barChart1" class="echart"></chart>
      </div>

      <div class="lever2 lever">
        <p>二档人数</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            prop="gradeTwoNum"
            label="二档人数">
          </el-table-column>
        </el-table>
        <chart :options="barChart2" class="echart"></chart>
      </div>

      <div class="lever3 lever">
        <p>三档人数</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            prop="gradeThreeNum"
            label="三档人数">
          </el-table-column>
        </el-table>
        <chart :options="barChart3" class="echart"></chart>
      </div>

      <div class="lever4 lever">
        <p>其他档人数</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            prop="otherNum"
            label="其他档人数">
          </el-table-column>
        </el-table>
        <chart :options="barChart4" class="echart"></chart>
      </div>
    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'
import { deepClone } from '../../../utils/deepClone'
export default {
  data () {
    return {
      examList: [],
      examId: '',
      loading: false,
      courseList: [],
      tableLever: [],
      barChart4: {},
      barChart3: {},
      barChart2: {},
      barChart1: {},
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
          name: '人数',
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
      window.location.href = `${path}/analysisResearch/totalScoreRankNumDistributionDevelopmentChangeExport?` +
                                  `examId=${this.examId}` +
                                  `&examName=${this.examList.filter(item => item.id === this.examId)[0].name}` +
                                  `&gradeId=${this.examList.filter(item => item.id === this.examId)[0].gradeId}`
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      this.loading = true
      const { data: list } = await this.$https.get(`/analysisResearch/totalScoreRankNumDistributionDevelopmentChangeQuery?examId=${this.examId}`)
                            .catch(() => { this.loading = false })
      if (list.code !== 1) notice(this, list.message, 2000)
      else {
        this.tableLever = [...list.result]
        this.commonChart.xAxis.data = list.result.map(item => item.schoolName)
        this.barChart1 = deepClone(this.commonChart)
        this.barChart2 = deepClone(this.commonChart)
        this.barChart3 = deepClone(this.commonChart)
        this.barChart4 = deepClone(this.commonChart)
        this.barChart1.series[0].data = list.result.map(item => item.gradeOneNum)
        this.barChart2.series[0].data = list.result.map(item => item.gradeTwoNum)
        this.barChart3.series[0].data = list.result.map(item => item.gradeThreeNum)
        this.barChart4.series[0].data = list.result.map(item => item.otherNum)
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
    } else if (examList.code === -2) {
      error()
    } else {
      notice(this, examList.message, 2000)
    }

    this.getData()
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/variable.scss';
.chart-1-11 {
  position: relative;
  >.el-button {
    position: absolute;
    right: 0;
    top: -66px;
  }

  .select {

    >.el-select {
      margin-left: $width;
    }

    .el-button {
      margin-left: $width;
    }
  }

  .lever {
    margin-top: $width;
  
    p {
      font-size: 16px;
    }

    >.el-table {
      width: 90%;
      margin: $width auto;
    }
  }

  .echarts {
    width: 100%;
  }
}

</style>
