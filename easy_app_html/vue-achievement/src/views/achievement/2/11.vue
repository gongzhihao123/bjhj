<template>
  <div class="chart-2-11">
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
            <el-select v-model="form.courseId" placeholder="请选择学科" style="width: 200px;" @change="getquestionNoList">
              <el-option
                v-for="item in courseList"
                :key="item.courseId"
                :label="item.courseName"
                :value="item.courseId">
              </el-option>
            </el-select>
          </el-form-item> 

            <el-form-item 
              label="题号"
              prop="queId"
              :rules="[
                { required: true, type: 'string', message: '请选择题号', trigger: 'change' }
              ]">
              <el-select v-model="form.queId" placeholder="请选择题号" style="width: 200px;">
                <el-option
                  v-for="item in questionNoList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">查询</el-button>
            </el-form-item>  

      </el-form>                                                       
    </div>

    <div class="content" v-loading="loading">
        <chart :options="lineChart" class="echart" style="margin-top: 20px;"></chart>
        <h3>试题分组分析表</h3>
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="questionScore"
            label="分数"
            min-width="80">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in list"
            :key="index"
            :label="item.name"
             min-width="80">
             <template scope="scope">
               <span @click="lookDetail(scope.row, index)" v-if="(scope.row.groupStudentNumMap)[`${index + 1}`] > 0" style="color: #51B5EE;cursor:pointer;">
                {{ (scope.row.groupStudentNumMap)[`${index + 1}`] }}
               </span>
               <span v-else>
                 {{ (scope.row.groupStudentNumMap)[`${index + 1}`] }}
               </span>
             </template>
          </el-table-column>
          <el-table-column
            label="总人数"
             min-width="90">
             <template scope="scope">
               <span @click="lookDetail(scope.row, scope.$index, 2)" style="color: #51B5EE;cursor:pointer;" v-if="scope.row.totalStudentNum > 0"> 
                {{ scope.row.totalStudentNum }}
               </span>
               <span v-else>
                 {{ scope.row.totalStudentNum }}
               </span>
             </template>
          </el-table-column>
          <el-table-column
            prop="questionScoreRate"
            label="比例"
             min-width="90">
             <template scope="scope">
                <span v-if="scope.row.questionScore !== '合计'">
                   {{ ((scope.row.questionScoreRate || 0) * 100).toFixed(2) + '%'}}
                </span>
                <span v-if="scope.row.questionScore === '合计'">
                  1
                </span>
            </template>
          </el-table-column>
        </el-table>

      <el-dialog
        title="学生明细"
        :visible.sync="dialogVisible"
        custom-class="detail">
        <el-table
            :data="detailList"
            border>
            <el-table-column
              prop="examNo"
              label="考号"
              v-if="needExamNo"
              min-width="150">
            </el-table-column>
            <el-table-column
              prop="studentName"
              label="学生姓名"
              min-width="150">
            </el-table-column>
            <el-table-column
              prop="questionScore"
              label="分数"
              min-width="150">
              <template scope="scope">
                {{ (scope.row.questionScore % 1 > 0) ? scope.row.questionScore.toFixed(1) : scope.row.questionScore }}
              </template>
            </el-table-column>
            <el-table-column
              prop="schoolName"
              label="所在学校"
              min-width="150">
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
        courseId: '',
        queId: ''
      },
      list: [
        {name: '1组'},
        {name: '2组'},
        {name: '3组'},
        {name: '4组'},
        {name: '5组'},
        {name: '6组'},
        {name: '7组'}
      ],
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
        legend: {
          data: ['试题难度曲线图']
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
          name: '分数',
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '难度',
          axisLine: {onZero: false},
          axisLabel: {
            formatter: '{value}'
          },
          boundaryGap: false,
          data: [0, 0.25, 0.5, 0.75, 1]
        },
        series: [
          {
            name: '试题难度曲线图',
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      },
      needExamNo: ''
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
          window.location.href = `${path}/analysisCourse/subjectQuestionAnalysisExport?` +
                                      `examId=${this.form.examId}` +
                                      `&subjectId=${this.form.courseId}` +
                                      `&questionNo=${this.form.queId}` +
                                      `&gradeId=${nowList.gradeId}` +
                                      `&examName=${this.examList.filter(item => item.id === this.form.examId)[0].name}` +
                                      `&subjectName=${this.courseList.filter(item => item.courseId === this.form.courseId)[0].courseName}`
        } else {
          return false
        }
      })
    },

    async lookDetail (row, index, num) {
      this.dialogVisible = true
      if (num) {
        // 查询类型--总人数
        // 组数
        this.type = 2
        this.groupNum = 0
      } else {
        if (row.questionScore === '合计') {
          // 合计数
          this.type = 3
        } else {
          // 组
          this.type = 1
        }
        this.groupNum = index + 1
      }
      const { data: detailList } = await this.$https.get(`/analysisCourse/subjectQuestionAnalysisStudentDetailQuery` +
                                                      `?examId=${this.form.examId}&subjectId=${this.form.courseId}&questionNo=${this.form.queId}&questionScore=${row.questionScore}&groupNum=${this.groupNum}&type=${this.type}`)
      if (detailList.code !== 1) notice(this, detailList.message, 2000)
      else {
        this.detailList = detailList.result
        this.needExamNo = this.detailList.every(item => item.examNo)
      }
    },

    async getData () {
      this.loading = true
      const { data: total } = await this.$https.get(`/analysisCourse/subjectQuestionAnalysisQuery` +
                                      `?examId=${this.form.examId}&subjectId=${this.form.courseId}&questionNo=${this.form.queId}`)
      if (total.code !== 1) notice(this, total.message, 2000)
      else {
        if (total.result) {
        // 表格数据
          this.table = total.result.questionGroupList
          if (this.table.length > 1) {
            this.table[this.table.length - 1].questionScore = '合计'
          }
          this.lineChart.xAxis.data = total.result.graphList.map(item => item.totalScore)
          this.lineChart.series[0].data = total.result.graphList.map(item => item.scoreRate)
        } else {
          this.table = []
          this.lineChart.xAxis.data = []
          this.lineChart.series[0].data = []
        }
      }
      this.loading = false
    },

    async getcourseList () {
      // 学科
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
    },
    async getquestionNoList () {
      // 题号
      const { data: questionNoList } = await this.$https.get(`/common/questionNoList?examId=${this.form.examId}&subjectId=${this.form.courseId}`)
      if (questionNoList.code === 1) {
        this.questionNoList = [...questionNoList.result || []]
        this.form.queId = this.questionNoList.length === 0 ? '' : this.questionNoList[0]
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
      await this.getquestionNoList()
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
.chart-2-11 {
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
  }

  .echarts {
    width: 100%;
  }
  .el-dialog {
    width: 1000px !important;
  }
}
</style>
