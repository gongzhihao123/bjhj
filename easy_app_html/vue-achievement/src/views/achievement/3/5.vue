<template>
  <div class="chart-3-5">
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
          border>
          <el-table-column
            prop="courseName"
            label="学科"
            min-width="80"
            align="center">
          </el-table-column>
          <el-table-column
            label="优秀"
            min-width="80"
            align="center">
            <template scope="scope">
              <span :class="{ 'blue': scope.row.excelentNum > 0 }" @click="lookDetail(scope.row.excelentNum, 1, scope.row.courseId)" style="cursor: pointer;">{{scope.row.excelentNum}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="累计比率"
             min-width="90"
             align="center">
             <template scope="scope">
               <span v-if="scope.row.excelentRate !== null">{{(Number(scope.row.excelentRate) * 100).toFixed(2) + '%'}}</span>
               <span v-if="scope.row.excelentRate === null">-</span>
             </template>
          </el-table-column>
          <el-table-column
            label="良好"
             min-width="90"
             align="center">
            <template scope="scope">
              <span :class="{ 'blue': scope.row.goodNum > 0 }" @click="lookDetail(scope.row.goodNum, 2, scope.row.courseId)" style="cursor: pointer;">{{scope.row.goodNum}}</span>
            </template>             
          </el-table-column>
          <el-table-column
            label="累计比率"
             min-width="90"
             align="center">
             <template scope="scope">
               <span v-if="scope.row.goodRate !== null">{{(Number(scope.row.goodRate) * 100).toFixed(2) + '%'}}</span>
               <span v-if="scope.row.goodRate === null">-</span>
             </template>             
          </el-table-column>
          <el-table-column
            label="合格"
             min-width="90"
             align="center">
            <template scope="scope">
              <span :class="{ 'blue': scope.row.passedNum > 0 }" @click="lookDetail(scope.row.passedNum, 3, scope.row.courseId)" style="cursor: pointer;">{{scope.row.passedNum}}</span>
            </template>            
          </el-table-column>
          <el-table-column
            label="累计比率"
             min-width="90"
             align="center">
             <template scope="scope">
               <span v-if="scope.row.passedRate !== null">{{(Number(scope.row.passedRate) * 100).toFixed(2) + '%'}}</span>
               <span v-if="scope.row.passedRate === null">-</span>
             </template>              
          </el-table-column>
          <el-table-column
            label="不合格"
             min-width="90"
             align="center">
            <template scope="scope">
              <span :class="{ 'blue': scope.row.failedNum > 0 }" @click="lookDetail(scope.row.failedNum, 4, scope.row.courseId)" style="cursor: pointer;">{{scope.row.failedNum}}</span>
            </template>             
          </el-table-column>
          <el-table-column
            label="累计比率"
             min-width="90"
             align="center">
             <template scope="scope">
               <span v-if="scope.row.failedRate !== null">{{(Number(scope.row.failedRate) * 100).toFixed(2) + '%'}}</span>
               <span v-if="scope.row.failedRate === null">-</span>
             </template>             
          </el-table-column>                                               
        </el-table>
        <chart :options="lineChart" class="echart" style="margin-top: 20px;"></chart>
    <el-dialog
      title="学生明细"
      :visible.sync="dialogVisible"
      custom-class="detail"
      size="big">
      <el-table
          :data="detailList"
          border>
          <el-table-column
            prop="examNo"
            label="考号"
            v-if="needExamNo"
            min-width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="学生姓名"
            min-width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="className"
            label="班级"
            min-width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="courseName"
            label="学科"
            min-width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="score"
            label="分数"
            min-width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="rankName"
            label="等级"
            min-width="100"
            align="center">
          </el-table-column> 
          <el-table-column
            prop="schoolName"
            label="所在学校"
            min-width="100"
            align="center">
          </el-table-column>     
          <el-table-column
            prop="scoreFlag"
            label="全区年级学科排名"
            v-if="rankFlag == 1"
            min-width="100"
            align="center">
          </el-table-column>                                   
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>        
    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'

export default {
  data () {
    return {
      detailList: [],
      dialogVisible: false,
      form: {
        examId: '',
        schoolId: ''
      },
      examList: [],
      flag: false,
      examId: '',
      schoolList: [],
      schoolId: '',
      schoolName: '',
      courseList: [],
      questionNoList: [],
      type: '',
      groupNum: '',
      queId: '',
      courseId: '',
      knowledgePointList: [],
      knowledgePointId: '',
      loading: false,
      table: [],
      lineChart: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['合格', '良好', '优秀', '优秀', '不及格']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '人数'
        },
        yAxis: {
          type: 'category',
          data: [],
          name: '学科'
        },
        series: [
          {
            name: '合格',
            type: 'bar',
            stack: '总量',
            color: ['#910000'],
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: []
          },
          {
            name: '良好',
            type: 'bar',
            stack: '总量',
            color: ['#8BBC21'],
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: []
          },
          {
            name: '优秀',
            type: 'bar',
            stack: '总量',
            color: ['#0D233A'],
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: []
          },
          {
            name: '不及格',
            type: 'bar',
            stack: '总量',
            color: ['#2F7ED8'],
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: []
          }
        ]
      },
      needExamNo: '',
      rankFlag: 0
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
          // const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
          window.location.href = `${path}/analysisSchool/schoolSubjectRankAnalysisExport?` +
                                      `examId=${this.form.examId}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&schoolName=${this.schoolName}`
        } else {
          return false
        }
      })
    },

    async lookDetail (row, s, courseId) {
      if (row === 0) {
        return
      }
      this.dialogVisible = true
      // if (row) {
      //   // 查询类型--总人数
      //   // 组数
      //   this.type = 2
      //   this.groupNum = 0
      // } else {
      //   if (row.questionScore === '合计') {
      //     // 合计数
      //     this.type = 3
      //   } else {
      //     // 组
      //     this.type = 1
      //   }
      //   this.groupNum = index + 1
      // }
      const { data: detailList } = await this.$https.get(`/analysisSchool/schoolSubjectRankAnalysisDetailQuery?examId=${this.form.examId}` +
                      `&courseId=${courseId}` +
                      `&schoolId=${this.form.schoolId}` +
                      `&rank=${s}`)
      if (detailList.code !== 1) notice(this, detailList.message, 2000)
      else {
        this.detailList = detailList.result || []
        this.needExamNo = this.detailList.every(item => item.examNo)
      }
    },

    async getData () {
      this.loading = true
      const { data: total } = await this.$https.get(`/analysisSchool/schoolSubjectRankAnalysisQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}`)
      if (total.code !== 1) notice(this, total.message, 2000)
      else {
        this.table = [...total.result]
        this.lineChart.yAxis.data = this.table.map(item => item.courseName)
        this.lineChart.series[0].data = this.table.map(item => item.passedNum)
        this.lineChart.series[1].data = this.table.map(item => item.goodNum)
        this.lineChart.series[2].data = this.table.map(item => item.excelentNum)
        this.lineChart.series[3].data = this.table.map(item => item.failedNum)
      }
      this.loading = false
    },

    async getschoolList () {
      this.getFlag()
      const { data: school } = await this.$https.get(`/common/achievementSchoolList` +
                                      `?examId=${this.form.examId}`)
      if (school.code !== 1) notice(this, school.message, 2000)
      else {
        this.schoolList = [...school.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      }
    },
    async getFlag () {
      this.rankFlag = this.examList.find(item => item.id === this.form.examId).rankFlag
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
.chart-3-5 {
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
      color: #4C6A86;
    }
    >.el-table {
      margin: $width auto;
    }
    .blue {
      color: blue;
    }
  }

  .echarts {
    width: 100%;
  }
  .detail {
    width: 1000px !important;
  }
}
</style>
