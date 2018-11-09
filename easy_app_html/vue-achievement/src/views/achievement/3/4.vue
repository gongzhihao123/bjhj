<template>
  <div class="chart-3-4">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 300px;">
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

    <div class="content" v-loading="loading">
      <el-table
        :data="table"
        border
        style="width: 100%">
        <el-table-column
          prop="schoolName"
          label="学校"
          min-width="50">
        </el-table-column>
        <el-table-column
          label="总分平均分"
          min-width="50">
          <template scope="scope">
            <span v-if="scope.row.totalScore">
              {{ scope.row.totalScore.toFixed(1) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(list, index) in subject"
          :key="list"
          :label="list + '平均分'">
          <template scope="scope">
            {{ scope.row.courseList.length === 0 ? 0 : (scope.row.courseList[index] ? scope.row.courseList[index].score.toFixed(1) : 0) }}
          </template>
        </el-table-column>
      </el-table>
      <p style="color: #CBD1D8;">分析提示：总分平均分以参加所有学科考试的学生为准，各学科平均分以参加该学科考试的学生为准。</P>
      <chart :options="barChart" class="echart"></chart>

      <div v-for="(list, index) in subject" :key="index">
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
        examId: '',
        gradeId: '',
        examName: ''
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
            name: '平均分',
            type: 'value'
          }
        ],
        series: [
          {
            name: '总分',
            type: 'bar',
            data: [],
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
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
          window.location.href = `${path}/analysisSchool/schoolSubjectLevelAnalysisExport?` +
                                      `examName=${this.form.examName}` +
                                      `&examId=${this.form.examId}` +
                                      `&gradeId=${this.form.gradeId}`
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

    async getData () {
      this.loading = true
      const { data } = await this.$https.get(`/analysisSchool/schoolSubjectLevelAnalysisQuery?examId=${this.form.examId}`)
      if (data.code !== 1) {
        notice(this, data.message, 2000)
        this.table = []
        this.subject = []
        this.commonChart.xAxis[0].data = []
        this.barChart = {}
      } else {
        if (data.result && data.result.length > 0) {
          let table = []
          data.result.forEach((item) => {
            if (item.courseList.length > 0) {
              table.push(item)
            }
          })
          if (table.length > 0) {
            this.table = table.map(item => ({
              ...item,
              totalScore: item.totalScore ? Number(item.totalScore.toFixed(1)) : 0,
              courseList: (item.courseList || []).map(items => ({
                ...items,
                score: items.score ? Number(items.score.toFixed(1)) : 0
              }))
            }))
            this.subject = this.table[0].courseList.map(item => item.courseName)
            this.commonChart.xAxis[0].data = this.table.map(item => item.schoolName)
            this.barChart = deepClone(this.commonChart)
            this.barChart.series[0].data = this.table.map(item => item.totalScore ? item.totalScore.toFixed(1) : 0)
            this.barChart.series[0].markLine.data[0].yAxis = this.table[this.table.length - 1].totalScore
            this.barChart.title.text = '总分 学校平均分与全区年级平均分对比'
            this.$nextTick(() => {
              const doms = this.$refs.chart
              doms.forEach((item, index) => {
                item.options = deepClone(this.commonChart)
                item.options.title.text = `${this.subject[index]} 学校平均分与全区年级平均分对比`
                item.options.series[0].name = this.subject[index]
                item.options.series[0].data = this.table.map(item => {
                  return item.courseList[index] ? item.courseList[index].score.toFixed(1) : 0
                })
                item.options.series[0].markLine.data[0].yAxis = this.table[this.table.length - 1].courseList[index].score
              })
            })
          } else {
            this.table = []
            this.subject = []
            this.commonChart.xAxis[0].data = []
            this.barChart = deepClone(this.commonChart)
            this.barChart.series[0].data = []
            this.barChart.title.text = '总分 学校平均分与全区年级平均分对比'
            this.$nextTick(() => {
              const doms = this.$refs.chart
              doms.forEach((item, index) => {
                item.options = deepClone(this.commonChart)
                item.options.title.text = ``
                item.options.series[0].name = ''
                item.options.series[0].data = this.table.map(item => {
                  return 0
                })
              })
            })
          }
        }
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
      this.examList.forEach((item, i) => {
        if (item.id === this.form.examId) {
          this.form.examName = this.examList[i].name
          this.form.gradeId = this.examList[i].gradeId
        }
      })
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
.chart-3-4 {
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
