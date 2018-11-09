<template>
  <div class="chart-2-13">
<el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 250px;" @change="getcourseList">
            <el-option
              v-for="item in examList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学科"
          prop="courseId"
          :rules="[
            { required: true, type: 'string', message: '请选择学科', trigger: 'change' }
          ]">
          <el-select v-model="form.courseId" placeholder="请选择学科" style="width: 200px;">
            <el-option
              v-for="item in courseList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId">
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
          border>
          <el-table-column
            prop="schoolName"
            label="学校"
            align="center">
          </el-table-column>
          <el-table-column
            label="平均得分率"
            align="center"
            prop="avgScorePercent">
            <template scope="scope">
                {{ ((scope.row.avgScorePercent || 0) * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>
          <el-table-column
            label="学业水平能级"
            align="center"
            prop="level">
          </el-table-column>
        </el-table>
        <chart :options="barChart" class="echart"></chart>
    </div>
    <el-dialog title="学生列表" :visible.sync="dialog">
      <el-table :data="studentData" border max-height="300">
        <el-table-column property="examNo" label="考号" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="100"></el-table-column>
        <el-table-column property="score" label="成绩"></el-table-column>
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
      form: {
        examId: '',
        courseId: ''
      },
      table: [],
      num: 5,
      barChart: {
        legend: {
          data: ['学校专业水平能级']
        },
        color: ['#35a9eb'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          name: '学校',
          axisLabel: {
            formatter: '{value}'
          },
          data: []
        },
        yAxis: {
          type: 'value',
          name: '学业水平能级',

          axisLine: {onZero: false},
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: true
          },
          boundaryGap: false,
          data: []
        },
        series: [
          {
            name: '学校专业水平能级',
            type: 'line',
            smooth: true,
            lineStyle: {
              normal: {
                width: 3,
                color: '#2F7FDA',
                shadowColor: 'rgba(0,0,0,0.4)',
                shadowBlur: 10,
                shadowOffsetY: 10
              }
            },
            data: []
          }
        ]
      }
    }
  },

  methods: {

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getData()
        } else {
          return false
        }
      })
    },
    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
          window.location.href = `${path}/analysisCourse/schoolSubjectLevelDevelopmentChangeExport?` +
                                      `examId=${this.form.examId}` +
                                      `&courseId=${this.form.courseId}` +
                                      `&examName=${this.examList.filter(item => item.id === this.form.examId)[0].name}` +
                                      `&courseName=${this.courseList.filter(item => item.courseId === this.form.courseId)[0].courseName}` +
                                      `&gradeId=${nowList.gradeId}`
        } else {
          return false
        }
      })
    },

    async getData () {
      this.loading = true
      const { data } = await this.$https.get(`/analysisCourse/schoolSubjectLevelDevelopmentChangeQuery?examId=${this.form.examId}&subjectId=${this.form.courseId}`)
      if (data.code === 1) {
        this.table = data.result || []
        this.barChart.xAxis.data = this.table.filter(item => item.schoolId !== 0).map(item => item.schoolName)
        this.barChart.series[0].data = this.table.filter(item => item.schoolId !== 0).map(item => item.level)
      } else {
        notice(this, data.message, 3000)
      }
      this.loading = false
    },

    async getcourseList () {
      // 学期
      const scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        return
      }
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.form.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result]
        this.form.courseId = this.courseList.length === 0 ? '' : this.courseList[0].courseId
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
.chart-2-13 {
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

    >p {
      text-align: center;
    }
    >.el-table {
      margin: $width auto;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
