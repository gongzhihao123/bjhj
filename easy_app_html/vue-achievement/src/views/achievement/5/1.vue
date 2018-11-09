<template>
  <div class="chart-5-1">
    <el-button type="primary"  @click="exportButton('form')">导出</el-button>
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
            min-width="50"
            align="center">
          </el-table-column>
          <el-table-column
            prop="score"
            label="满分"
            min-width="50"
            align="center">
          </el-table-column>
          <el-table-column
            prop="avgScore"
            label="全区年级平均分"
            min-width="80"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.avgScore ? scope.row.avgScore.toFixed(1) : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalScore"
            label="个人得分"
            min-width="80"
            align="center">
            <template scope="scope">
              <span>{{ (scope.row.totalScore % 1 > 0) ? scope.row.totalScore.toFixed(1) : scope.row.totalScore }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="个人得分率"
            min-width="80"
            align="center">
            <template scope="scope">
              <span>{{((scope.row.averScore || 0) * 100).toFixed(2) + '%'}}</span>
            </template>
          </el-table-column>  
          <el-table-column
            prop="level"
            label="学业水平能级"
            min-width="80"
            align="center">
          </el-table-column> 
          <el-table-column
            label="百分位数"
            min-width="80"
            align="center">
            <template scope="scope">
              {{((scope.row.percentile || 0) * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>                                    
        </el-table>
        <!--饼状图-->
      <chart :options="option" class="echart" style="margin-top: 20px; width: 50%; float: left;"></chart>
      <chart :options="squareChart" class="echart" style="margin-top: 20px; width:50%; float: left;"></chart>
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
      form: {
        examId: '',
        schoolId: '',
        classId: '',
        studentId: ''
      },
      loading: false,
      table: [],
      option: {
        color: ['#2F7ED8', '#0D233A', '#8BBC21', '#910000', '#1AADCE', '#492970'],
        title: {
          text: '各科分数',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['西凉', '益州', '兖州', '荆州', '幽州']
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                borderWidth: 3,
                borderColor: '#fff'
              },
              label: {
                normal: {
                  textStyle: {
                    fontSize: 18,
                    color: '#000'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: '#000'
                  }
                }
              }
            }
          }
        ]
      },
      squareChart: {
        title: {
          text: '各科学业水平能级',
          left: 'center'
        },
        color: ['#008000'],
        legend: {
          data: ['学业水平能级'],
          right: '10%',
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
          window.location.href = `${path}/analysisStudent/totalScoreAndSubjectBalanceDistributionExport?` +
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

    async getSchool () {
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      this.$refs.students.resetField()
      const { data } = await this.$https.get(`/common/achievementSchoolList?examId=${this.form.examId}`)
      if (data.code === 1) {
        this.schoolList = [...data.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      } else {
        notice(this, data.message, 2000)
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
        if (data.result) {
          this.classList = data.result.map(item => ({ name: `${item.gradeName}${item.className}`, id: item.id }))
          this.form.classId = this.classList.length === 0 ? '' : this.classList[0].id
        } else {
          this.classList = []
          this.form.classId = ''
        }
      } else {
        notice(this, data.message, 2000)
      }
    },

    async getStudent () {
      const { data } = await this.$https.get(`/common/getstudentList` +
                              `?examId=${this.form.examId}` +
                              `&classId=${this.form.classId}` +
                              `&schoolId=${this.form.schoolId}`)
      // const { data } = await this.$https.get(`/common/getstudentList` +
      //                         `?examId=${4}` +
      //                         `&classId=${343}` +
      //                         `&schoolId=${100001}`)
      if (data.code === 1) {
        data.result ? this.studentList = data.result : this.studentList = []
        this.form.studentId = this.studentList.length === 0 ? '' : this.studentList[0].id
      } else {
        notice(this, data.message, 3000)
      }
    },

    async getData () {
      this.option.series[0].data = []
      // const { data } = await this.$https.get(`/analysisStudent/totalScoreAndSubjectBalanceDistributionQuery?examId=${4}&studentId=${this.form.studentId}&classId=${343}&schoolId=${100003}`)
      const { data } = await this.$https.get(`/analysisStudent/totalScoreAndSubjectBalanceDistributionQuery?examId=${this.form.examId}&studentId=${this.form.studentId}&classId=${this.form.classId}&schoolId=${this.form.schoolId}`)
      if (data.code === 1) {
        this.table = [...data.result || []]
        this.squareChart.xAxis[0].data = this.table.map(item => item.courseName)
        this.squareChart.series[0].data = this.table.map(item => item.level)
        let sum = 0
        this.table.forEach(item => {
          sum = sum + item.totalScore
        })
        let para = {}
        this.table.forEach(item => {
          para.value = Number(item.totalScore / sum)
          para.name = item.courseName
          this.option.series[0].data.push({name: item.courseName, value: Number((item.totalScore / sum).toFixed(2))})
        })
      } else {
        notice(this, data.message, 2000)
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
.chart-5-1 {
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
    >.chart {
      width: 50% !important;
      >div {
        width: 50% !important;
      }
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
