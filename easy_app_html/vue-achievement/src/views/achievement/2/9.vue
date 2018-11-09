<template>
  <div class="chart-2-9">
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
        <el-table
          :data="table"
          border
          max-height="500">
           <el-table-column
            label="学校"
            min-width="70">
            <template scope="scope">
              {{ scope.row.schoolName ? scope.row.schoolName : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="className"
            label="班级"
            min-width="70">
          </el-table-column>
          <el-table-column 
          label="总分平均分"
          prop="avgAllScore">
            <template scope="scope">
              {{ scope.row.avgAllScore && scope.row.avgAllScore != 'NaN'
                                    ? scope.row.avgAllScore.toFixed(1)
                                    : 0 }}
            </template>
          </el-table-column>
          <el-table-column
          v-for="(list, index) in subject"
          :key="list"
          :label="list + '平均分'">
          <template scope="scope">
            {{ scope.row.subject.length === 0 ? 0 : (scope.row.subject[index].avgScore % 1 > 0) ? scope.row.subject[index].avgScore.toFixed(1) : scope.row.subject[index].avgScore }}
          </template>
          </el-table-column>
        </el-table>
        <p style="margin-bottom: 3%;color: #CBD1D8;">分析提示：总分平均分以参加所有学科考试的学生为准，各学科平均分以参加该学科考试的学生为准。</p>
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
      schoolName: '',
      loading: false,
      table: [],
      subject: [],
      barChart: {},
      form: {
        examId: '',
        schoolId: ''
      },
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
            name: '班级',
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
            name: '平均分',
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
          window.location.href = `${path}/analysisCourse/schoolSubjectAverageAnalysisExport?` +
                                      `examId=${this.form.examId}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&examName=${this.examList.filter(item => item.id === this.form.examId)[0].name}` +
                                      `&gradeId=${this.examList.filter(item => item.id === this.form.examId)[0].gradeId}` +
                                      `&schoolName=${this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''}`
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
      this.schoolName = this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''
      const { data } = await this.$https.get(`/analysisCourse/schoolSubjectAverageAnalysisQuery` +
                                      `?schoolId=${this.form.schoolId}&examId=${this.form.examId}`)
      if (data.code !== 1 || !data.result) {
        notice(this, data.message, 2000)
        this.table = []
        this.barChart = {}
      } else {
        this.table = data.result.filter(item => !!item.classScore)
                                  .map(item => {
                                    const subject = data.result
                                                    .filter(n => {
                                                      return n.courseScore && n.courseScore.className === item.classScore.className
                                                    })
                                                    .map(m => {
                                                      return { ...m.courseScore }
                                                    })
                                    return {...item.classScore, subject}
                                  })
        this.subject = this.table[0].subject.map(item => item.courseName)

        this.commonChart.xAxis[0].data = this.table.map(item => item.className)
        this.barChart = deepClone(this.commonChart)
        this.barChart.series[0].data = this.table.map(item => item.avgAllScore)
        this.barChart.series[0].markLine.data[0].yAxis = this.table[this.table.length - 1].avgAllScore
        this.barChart.title.text = '总分 班级平均分与全区年级平均分对比'
        this.table = this.table.map(item => ({
          ...item,
          schoolName: this.schoolName
        }))
        this.table[this.table.length - 1].schoolName = '全区年级'
        this.$nextTick(() => {
          const doms = this.$refs.chart
          if (!doms) return
          doms.forEach((item, index) => {
            item.options = deepClone(this.commonChart)
            item.options.title.text = `${this.subject[index]} 班级平均分与全区年级平均分对比`
            item.options.series[0].name = this.subject[index]
            item.options.series[0].data = this.table.map(item => item.subject.length === 0 ? 0 : item.subject[index].avgScore)
            item.options.series[0].markLine.data[0].yAxis = this.table[this.table.length - 1].subject[index].avgScore
          })
        })
      }
      this.loading = false
    },

    async getschoolList () {
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
.chart-2-9 {
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
