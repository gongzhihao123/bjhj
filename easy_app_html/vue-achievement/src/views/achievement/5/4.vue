<template>
  <div class="chart-5-4">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 250px;" @change="getSchool">
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
          ref="school"
          :rules="[
            { required: true, type: 'number', message: '请选择学校', trigger: 'change' }
          ]">
          <el-select v-model="form.schoolId" placeholder="请选择学校" style="width: 160px;" @change="getClass">
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="班级"
          prop="classId"
          ref="classes"
          :rules="[
            { required: true, type: 'number', message: '请选择班级', trigger: 'change' }
          ]">
          <el-select v-model="form.classId" placeholder="请选择班级" style="width: 160px;" @change="getcourseList">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学科"
          ref="subject"
          prop="courseId"
          :rules="[
            { required: true, type: 'string', message: '请选择学科', trigger: 'change' }
          ]">
          <el-select v-model="form.courseId" placeholder="请选择学科" style="width: 160px;" @change="getStudent">
            <el-option
              v-for="item in courseList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId">
            </el-option>
          </el-select>
        </el-form-item>        

        <el-form-item 
          label="学生"
          ref="student"
          prop="studentId"
          :rules="[
            { required: true, type: 'number', message: '请选择学生', trigger: 'change' }
          ]">
          <el-select v-model="form.studentId" placeholder="请选择学生" style="width: 160px;">
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.studentName"
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
      <h3>主客观题组块</h3>    
        <el-table
          :data="subjectivelist"
          border>
          <el-table-column
            label="结构"
            align="center">
            <template scope="scope">
              <!-- <span v-if="scope.row.questionNo === '1'">主观题组块</span>
              <span v-if="scope.row.questionNo === '2'">客观题组块</span> -->
              {{ scope.row.questionNo }}组块
            </template>
          </el-table-column>
          <el-table-column
            label="学业水平能级"
            align="center"
            prop="level">
          </el-table-column>
          <el-table-column
            label="百分比"
            align="center">
            <template scope="scope">
              {{((scope.row.percentile || 0) * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>
        </el-table>  
        <chart :options="barChart" class="echart"></chart>   

        <h3>知识结构</h3>         
        <el-table
          :data="knowledgelist"
          border>
          <el-table-column
            label="结构"
            align="center"
            prop="questionNo">
          </el-table-column>
          <el-table-column
            label="学业水平能级"
            align="center"
            prop="level">
          </el-table-column>
          <el-table-column
            label="百分比"
            align="center">
            <template scope="scope">
              {{((scope.row.percentile || 0) * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>
        </el-table>  
        <chart :options="carChart" class="echart"></chart> 

        <h3>认知结构</h3>         
        <el-table
          :data="cognitionlist"
          border>
          <el-table-column
            label="结构"
            align="center"
            prop="questionNo">
          </el-table-column>
          <el-table-column
            label="学业水平能级"
            align="center"
            prop="level">
          </el-table-column>
          <el-table-column
            label="百分比"
            align="center">
            <template scope="scope">
              {{((scope.row.percentile || 0) * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>
        </el-table>  
        <chart :options="darChart" class="echart"></chart>                
    </div>
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
      schoolList: [],
      classList: [],
      studentList: [],
      courseList: [],
      cognitionlist: [],
      subjectivelist: [],
      knowledgelist: [],
      loading: false,
      table: [],
      form: {
        examId: '',
        courseId: '',
        schoolId: '',
        classId: '',
        studentId: ''
      },
      num: 5,
      barChart: {
        legend: {
          data: []
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
          name: '学科结构',
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
            name: '学业水平能级',
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
      },
      carChart: {
        legend: {
          data: []
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
          name: '标号',
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
            name: '学业水平能级',
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
      },
      darChart: {
        legend: {
          data: []
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
          name: '名称',
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
            name: '学业水平能级',
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
      },
      firstState: true
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
          window.location.href = `${path}/analysisStudent/subjectBalanceDevelopmentChangeExport?` +
                                      `examId=${this.form.examId}` +
                                      `&subjectId=${this.form.courseId}` +
                                      `&examName=${this.examList.filter(item => item.id === this.form.examId)[0].name}` +
                                      `&subjectName=${this.courseList.filter(item => item.courseId === this.form.courseId)[0].courseName}` +
                                      `&gradeId=${nowList.gradeId}` +
                                      `&studentId=${this.form.studentId}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&classId=${this.form.classId}`
        } else {
          return false
        }
      })
    },

    async getData () {
      this.loading = true
      const { data } = await this.$https.get(`/analysisStudent/subjectBalanceDevelopmentChangeQuery?examId=${this.form.examId}&subjectId=${this.form.courseId}&classId=${this.form.classId}&schoolId=${this.form.schoolId}&studentId=${this.form.studentId}`)
      if (data.code === 1) {
        if (data.result !== null && data.result.cognitionlist !== null) {
          this.cognitionlist = (data.result.cognitionlist || []).map(item => ({
            ...item,
            level: item.level === 'NaN' ? 0 : item.level,
            percentile: item.percentile === 'NaN' ? 0 : item.percentile
          }))
          this.darChart.xAxis.data = this.cognitionlist.map(item => item.questionNo)
          this.darChart.series[0].data = this.cognitionlist.map(item => item.level)
        }
        if (data.result !== null && data.result.knowledgelist !== null) {
          this.knowledgelist = data.result.knowledgelist
          // console.log(this.knowledgelist)
          this.carChart.xAxis.data = this.knowledgelist.map(item => item.questionNo)
          this.carChart.series[0].data = this.knowledgelist.map(item => item.level)
        }
        if (data.result !== null && data.result.subjectivelist !== null) {
          this.subjectivelist = data.result.subjectivelist
          this.barChart.xAxis.data = this.subjectivelist.map(item => item.questionNo)
          this.barChart.series[0].data = this.subjectivelist.map(item => item.level)
        }
      } else {
        notice(this, data.message, 3000)
      }
      this.loading = false
    },

    async getcourseList () {
      // 学期
      this.$refs.subject.resetField()
      this.$refs.student.resetField()
      const scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        return
      }
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.form.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result || []]
        this.form.courseId = this.courseList.length === 0 ? '' : this.courseList[0].courseId
      }
    },

    async getSchool () {
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      this.$refs.subject.resetField()
      this.$refs.student.resetField()
      const { data } = await this.$https.get(`/common/achievementSchoolList?examId=${this.form.examId}`)
      if (data.code === 1) {
        this.schoolList = [...data.result || []]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      }
    },

    async getClass (e) {
      this.$refs.classes.resetField()
      this.$refs.subject.resetField()
      this.$refs.student.resetField()
      const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
      const { data } = await this.$https.get(`/common/gradeClassList` +
                              `?semesterId=${nowList.semesterId}` +
                              `&sectionId=${nowList.sectionId}` +
                              `&gradeId=${nowList.gradeId}` +
                              `&schoolId=${this.form.schoolId}`)
      if (data.code === 1) {
        data.result ? this.classList = data.result : this.classList = []
        if (data.result) {
          this.classList = data.result.map(item => ({ name: `${item.gradeName}${item.className}`, id: item.id }))
        } else {
          this.classList = []
        }
        this.form.classId = this.classList.length === 0 ? '' : this.classList[0].id
      }
    },

    async getStudent () {
      this.$refs.student.resetField()
      const { data } = await this.$https.get(`/common/getstudentList` +
                              `?examId=${this.form.examId}` +
                              `&classId=${this.form.classId}` +
                              `&schoolId=${this.form.schoolId}` +
                              `&subjectId=${this.form.courseId}`)
      if (data.code === 1) {
        this.studentList = data.result || []
        this.form.studentId = this.studentList.length === 0 ? '' : this.studentList[0].id
        if (this.firstState) {
          this.firstState = false
          this.getData()
        }
      } else {
        notice(this, data.message, 3000)
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
      // await this.getSchool()
      // await this.getClass()
      // await this.getStudent()
      // await this.getcourseList()
      // this.getData()
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
.chart-5-4 {
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
      margin-top: 20px;
      margin-bottom: 20px;
    }
    >.el-table {
      margin: $width auto;
    }
    >table {
      width: 92%;
      margin: $width auto;
      tr {
        border: 1px solid #dfe6ec;
        th {
          text-align: center;
          line-height: 30px;
          background: #EEF1F6;
          color: #363D4A;
        }
        td {
          width: 30%;
          border: 1px solid  #dfe6ec;
          ul {
            li {
              width: 100%;
              list-style-type: none;
              line-height: 35px;
              border-bottom: 1px solid  #dfe6ec;
              height: 35px;
              color: #363D4A;
              &:last-child {
                border-bottom: none;
              }
            }
            .green {
              color: #2B952B;
            }
            .red {
              color: #FF1313;
            }
          }
        }
      }
      text-align: center;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
