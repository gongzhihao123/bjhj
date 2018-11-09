<template>
  <div class="chart-5-3">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 160px;" @change="getSchool">
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
          ref="school"
          prop="schoolId"
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
          ref="classes"
          prop="classId"
          :rules="[
            { required: true, type: 'number', message: '请选择班级', trigger: 'change' }
          ]">
          <el-select v-model="form.classId" placeholder="请选择班级" style="width: 160px;" @change="getStudent">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学生"
          ref="students"
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
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="courseName"
            label="科目"
            min-width="80"
            align="center">
          </el-table-column>
          <el-table-column
            label="学业水平能级"
            min-width="80"
            align="center">
            <template scope="scope">
              <span  v-if="scope.row.level !== null">{{scope.row.level}}</span>
              <span v-if="scope.row.level === null">-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="百分位数"
            min-width="80"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.percentile !== null">{{((scope.row.percentile || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.percentile === null">-</span>
            </template>            
          </el-table-column>          
        </el-table>
      <chart :options="squareChart" class="echart" style="margin-top: 20px;"></chart>
      <chart :options="squChart" class="echart" style="margin-top: 20px;"></chart>        
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
      gradeList: [],
      classList: [],
      studentList: [],
      state: false,
      form: {
        examId: '',
        schoolId: '',
        classId: '',
        studentId: ''
      },
      loading: false,
      table: [],
      squareChart: {
        title: {
          text: '学科发展期情况百分位柱状图',
          left: 'center'
        },
        color: ['#008000'],
        legend: {
          data: ['百分位数'],
          right: '25%',
          top: '2%'
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: [
          {
            name: '学科',
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            name: '百分位数',
            type: 'value',
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '百分位数',
            type: 'bar',
            data: [],
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  fontSize: 14
                }
              }
            },
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            }
          }
        ]
      },
      squChart: {
        title: {
          text: '各学科学业水平能级',
          left: 'center'
        },
        color: ['#008000'],
        legend: {
          data: ['学业水平能级'],
          right: '25%',
          top: '2%'
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: [
          {
            name: '学科',
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            name: '学业水平能级',
            type: 'value'
          }
        ],
        series: [
          {
            name: '学业水平能级',
            type: 'bar',
            data: [],
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  fontSize: 14
                }
              }
            },
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
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
          const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
          window.location.href = `${path}/analysisStudent/subjectInnerStructLevelAnalysisExport?` +
                                      `examId=${this.form.examId}` +
                                      `&studentId=${this.form.studentId}` +
                                      `&classId=${this.form.classId}` +
                                      `&gradeId=${nowList.gradeId}` +
                                      `&examName=${this.examList.filter(item => item.id === this.form.examId)[0].name}` +
                                      `&schoolId=${this.form.schoolId}`
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
          console.log('error submit!!')
          return false
        }
      })
    },

    async getData () {
      this.loading = true
      const { data: subject } = await this.$https.get(`/analysisStudent/subjectInnerStructLevelAnalysisQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}` +
                                      `&classId=${this.form.classId}&studentId=${this.form.studentId}`)
      if (subject.code !== 1) notice(this, subject.message, 2000)
      else {
        this.table = [...subject.result || []]
        this.squareChart.xAxis[0].data = this.table.map(item => item.courseName)
        this.squareChart.series[0].data = this.table.map(item => ((item.percentile || 0) * 100).toFixed(2))
        this.squChart.xAxis[0].data = this.table.map(item => item.courseName)
        this.squChart.series[0].data = this.table.map(item => item.level)
      }
      this.loading = false
    },

    async getSchool () {
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      this.$refs.students.resetField()
      const { data } = await this.$https.get(`/common/achievementSchoolList?examId=${this.form.examId}`)
      if (data.code === 1) {
        this.schoolList = [...data.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      }
    },

    async getClass (e) {
      const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
      const { data } = await this.$https.get(`/common/gradeClassList` +
                              `?semesterId=${nowList.semesterId}` +
                              `&sectionId=${nowList.sectionId}` +
                              `&gradeId=${nowList.gradeId}` +
                              `&schoolId=${this.form.schoolId}`)
      if (data.code === 1) {
        this.classList = (data.result || []).map(item => ({ name: `${item.gradeName}${item.className}`, id: item.id }))
        this.form.classId = this.classList.length === 0 ? '' : this.classList[0].id
      }
    },

    async getStudent () {
      const { data } = await this.$https.get(`/common/getstudentList` +
                              `?examId=${this.form.examId}` +
                              `&classId=${this.form.classId}` +
                              `&schoolId=${this.form.schoolId}`)
      if (data.code === 1) {
        this.studentList = data.result
        this.form.studentId = this.studentList.length === 0 ? '' : this.studentList[0].id
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
      await this.getSchool()
      await this.getClass()
      await this.getStudent()
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
.chart-5-3 {
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

    display: block;
    clear: both;
    overflow: hidden;

    >.el-table {
      margin: $width auto;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
