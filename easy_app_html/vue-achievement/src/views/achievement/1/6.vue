<template>
  <div class="chart-1-6">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 160px;" @change="">
            <el-option
              v-for="item in examList"
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

    <div class="content" v-loading="loading" v-if="table.length > 0">
        <el-table
          :data="table"
          border
          max-height="500">
          <el-table-column
            prop="school"
            label="学校"
            min-width="80"
            fixed>
          </el-table-column>
          <el-table-column 
          label="总分">
            <el-table-column
              label="平均分"
              min-width="80"
              prop="avg">
              <template scope="scope">
                {{ scope.row.avg && scope.row.avg != 'NaN'
                                ? scope.row.avg.toFixed(1)
                                : 0 }}
              </template>
            </el-table-column>
            <el-table-column
              label="平均得分率"
              min-width="120"
              prop="avgRatio">
            </el-table-column>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :key="list"
            :label="list">
            <el-table-column
              label="平均分"
              min-width="80">
              <template scope="scope">
                {{ scope.row.subject[index] && scope.row.subject[index].avg && scope.row.subject[index].avg != "NaN"
                      ? scope.row.subject[index].avg.toFixed(1)
                      : 0 }}
              </template>
            </el-table-column>
            <el-table-column
              label="平均得分率"
              min-width="120">
              <template scope="scope">
                {{ scope.row.subject[index]
                ? (scope.row.subject[index].avgRatio == "NaN%" ? 0 : scope.row.subject[index].avgRatio)
                : 0 }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <!-- <section>
          <table>
            <thead>
              <tr>
                <td rowspan="2">学校</td>
                <td colspan="2">总分</td>
                <td colspan="2" v-for="(item, i) in subject" :key="i">{{ item }}</td>
              </tr>
              <tr>
                <td>平均分</td>
                <td>平均得分率</td>
              </tr>
            </thead>
          </table>
        </section> -->
        <p style="color: #CBD1D8;">分析提示：总分平均分以参加所有学科考试的学生为准，各学科平均分以参加该学科考试的学生为准。</P>
      <chart :options="barChart" class="echart"></chart>

      <div v-for="(list, index) in subject" :key="list">
        <chart :options="commonChart" class="echart" ref="chart"></chart>  
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
      schoolList: [],
      state: false,
      subject: [],
      form: {
        examId: ''
      },
      loading: false,
      table: [],
      barChart: {},
      commonChart: {
        color: ['#31a6e8'],
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        xAxis: [
          {
            name: '学校',
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
          }
        ],
        yAxis: [
          {
            name: '百分比',
            type: 'value'
          }
        ],
        series: [
          {
            name: '得分率',
            type: 'bar',
            data: [],
            markLine: {
              data: [
                { type: 'average', name: '平均值', yAxis: 1 }
              ]
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  fontSize: 14
                }
              }
            }
          }
        ]
      }
    }
  },

  methods: {

    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisResearch/schoolSubjectLevelAnalysisExport?` +
                                  `examId=${this.form.examId}`
        } else {
          console.log('error submit!!')
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

    async getData () {
      this.loading = true
      this.table = []
      this.subject = []
      const { data } = await this.$https.get(`/analysisResearch/schoolSubjectLevelAnalysisQuery`, {
        params: { ...this.form }
      })
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        data.result = data.result || []
        this.table = data.result.filter(item => !!item.totalScore)
                                  .map(item => {
                                    const subject = data.result
                                                    .filter(n => {
                                                      return n.school && n.school.schoolName === item.totalScore.school
                                                    })
                                                    .map(m => {
                                                      return {...m.school.course, schoolName: m.school.schoolName}
                                                    })
                                    return {...item.totalScore, subject}
                                  })
        this.subject = (this.table[0].subject || []).map(item => item.courseName)

        this.commonChart.xAxis[0].data = this.table.map(item => item.school)
        this.barChart = deepClone(this.commonChart)
        this.barChart.series[0].data = this.table.map(item => item.avgRatio.split('%')[0])
        this.barChart.series[0].markLine.data[0].yAxis = this.table[this.table.length - 1].avgRatio.split('%')[0]
        this.barChart.title.text = '总分 学校平均得分率与全区年级平均得分率对比图'
        this.$nextTick(() => {
          const doms = this.$refs.chart
          if (!doms) return
          doms.forEach((item, index) => {
            item.options = deepClone(this.commonChart)
            item.options.title.text = `${this.subject[index]} 学校平均得分率与全区年级平均得分率对比图`
            item.options.series[0].name = this.subject[index]
            item.options.series[0].data = this.table.map(item => item.subject[index].avgRatio.split('%')[0])
            item.options.series[0].markLine.data[0].yAxis = this.table[this.table.length - 1].subject[index].avg
          })
        })
      }
      this.loading = false
    }
  },

  async mounted () {
    // 考试列表
    const { data: examList } = await this.$https.get('/common/examList')
    if (examList.code === 1) {
      this.examList = [...examList.result || []]
      if (sessionStorage.PARAMS_EXAMID > 0) this.form.examId = Number(sessionStorage.PARAMS_EXAMID)
      else this.form.examId = this.examList.length > 0 ? this.examList[0].id : ''
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
.chart-1-6 {
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
