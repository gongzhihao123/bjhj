<template>
  <div class="chart-3-7">
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
        style="width: 100%">
        <el-table-column
          label="学校"
          min-width="150">
          <template scope="scope">
            {{ schoolName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="gradeOneNum"
          label="一档"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="gradeTwoNum"
          label="二档"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="gradeThreeNum"
          label="三档"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="otherNum"
          label="其他"
          min-width="150">
        </el-table-column>
      </el-table>
    <chart style="margin-top: 20px;" :options="barChart" class="echart"></chart>
    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'
// import { deepClone } from '../../../utils/deepClone'

export default {
  data () {
    return {
      examList: [],
      examId: '',
      schoolList: [],
      schoolId: '',
      schoolName: '',
      loading: false,
      table: [],
      subject: [],
      form: {
        examId: '',
        schoolId: ''
      },
      barChart: {
        title: {
          text: '学校上线人数发展变化'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
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
            type: 'value',
            name: '人数'
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            data: []
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
          window.location.href = `${path}/analysisSchool/schoolOnLinePeopleNumDevelopmentChangeExport?` +
                                  `schoolId=${this.form.schoolId}` +
                                  `&examId=${this.form.examId}` +
                                  `&schoolName=${this.schoolName}`
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
      const { data } = await this.$https.get(`/analysisSchool/schoolOnLinePeopleNumDevelopmentChangeQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        if (data.result) {
          this.barChart.series[0].data = [
            data.result.gradeOneNum,
            data.result.gradeTwoNum,
            data.result.gradeThreeNum,
            data.result.otherNum
          ]
          this.table = []
          this.table = this.table.concat(data.result)
        } else {
          this.table = []
          this.barChart.series[0].data = []
        }
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

<style lang="scss">
@import '../../../assets/scss/variable.scss';
.chart-3-7 {
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

    >.el-table.three-one {
      margin: $width auto;

      tbody{
        >tr:first-child,tr:nth-child(3){
          >td:first-child{
            border-bottom: 0;
            span{
              position: absolute;
              background: #fff;
              z-index: 1001;
              top: 0;
              left: 0;
              right: 0;
              bottom: -40px;
              padding: 30px 20px;
            }
            :hover{
              background: #fff;  
            }
          }
        }
      }
    }
    
    .table-class{
      border-right: 0;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
