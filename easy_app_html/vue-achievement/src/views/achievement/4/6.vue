<template>
  <div class="chart-4-6">
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
          <el-select v-model="form.classId" placeholder="请选择班级" style="width: 160px;" @change="">
            <el-option
              v-for="item in classList"
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
          border>
          <el-table-column
            prop="className"
            show-overflow-tooltip
            label="班级">
            <template scope="scope">
              {{ scope.row.className }}
            </template>
          </el-table-column>
          <el-table-column
            label="一档"
            prop="gradeOne">
          </el-table-column>
          <el-table-column
            label="二档"
            prop="gradeTwo">

          </el-table-column>
          <el-table-column
            label="三档"
            prop="gradeThree"
            >
          </el-table-column>
          <el-table-column
            label="其他"
            prop="gradeOther"
            >
          </el-table-column>
        </el-table>
        <chart :options="barChart" class="echart"></chart>
    </div>
  </div>
</template>

<script>

import { notice, error } from '../../../api/index'

export default {
  data () {
    return {
      examList: [],
      schoolList: [],
      gradeList: [],
      classList: [],
      state: false,
      form: {
        examId: '',
        schoolId: '',
        classId: ''
      },
      loading: false,
      table: [],
      barChart: {
        color: ['#31a6e8'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['一档', '二档', '三档', '其他'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '人数',
            type: 'value'
          }
        ],
        series: [
          {
            name: '人数',
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
          window.location.href = `${path}/analysisClass/classOnLinePeopleNumDevelopmentChangeExport?` +
                                  `examId=${this.form.examId}` +
                                  `&schoolId=${this.form.schoolId}` +
                                  `&schoolName=${this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName}` +
                                  `&classId=${this.form.classId}` +
                                  `&className=${this.classList.filter(item => item.id === this.form.classId)[0].name}`
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
      this.table = []
      const { data } = await this.$https.get(`/analysisClass/classOnLinePeopleNumDevelopmentChangeQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}` +
                                      `&classId=${this.form.classId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        let className = this.classList.find(item => item.id === this.form.classId).name
        let { gradeOne, gradeTwo, gradeThree, gradeOther } = data.result
        const arr = { className, ...data.result }
        this.table.push(arr)
        this.barChart.series[0].data = [ gradeOne, gradeTwo, gradeThree, gradeOther ]
      }
      this.loading = false
    },

    async getSchool () {
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
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
        this.classList = data.result.map(item => ({ name: `${item.gradeName}${item.className}`, id: item.id }))
        this.form.classId = this.classList.length === 0 ? '' : this.classList[0].id
      }
      if (this.state === false) {
        this.state = true
        this.getData()
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
.chart-4-6 {
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
