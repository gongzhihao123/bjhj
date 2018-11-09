<template>
  <div class="chart-2-10">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 250px;" @change="courseListChange">
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
          <el-select v-model="form.courseId" placeholder="请选择学科" style="width: 200px;" @change="knowledgeList">
            <el-option
              v-for="item in courseList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="知识点"
          prop="knowledgePointId"
          :rules="[
            { required: true, type: 'number', message: '请选择知识点', trigger: 'change' }
          ]">
          <el-select v-model="form.knowledgePointId" placeholder="请选择知识点" style="width: 200px;">
            <el-option
              v-for="item in knowledgePointList"
              :key="item.pointId"
              :label="item.pointName"
              :value="item.pointId">
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
            prop="pointScore"
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
               <span @click="lookDetail(scope.row, '7')" style="color: #51B5EE;cursor:pointer;" v-if="scope.row.totalStudentNum > 0"> 
                {{ scope.row.totalStudentNum }}
               </span>
               <span v-else>
                 {{ scope.row.totalStudentNum }}
               </span>
             </template>
          </el-table-column>
          <el-table-column
            prop="pointScoreRate"
            label="比例"
             min-width="90">
             <template scope="scope">
                 <span v-if="scope.row.pointScore !== '合计'">
                   {{ ((scope.row.pointScoreRate || 0) * 100).toFixed(2) + '%'}}
                </span>
                <span v-if="scope.row.pointScore === '合计'">
                  1
                </span>
            </template>
          </el-table-column>
        </el-table>
    </div>

    <el-dialog
      title="学生明细"
      :visible.sync="dialogVisible"
      size="tiny">
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
            prop="pointScore"
            label="分值"
            min-width="150">
            <template scope="scope">
              {{ (scope.row.pointScore % 1 > 0) ? scope.row.pointScore.toFixed(1) : scope.row.pointScore }}
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
</template>

<script>
import { notice, error } from '../../../api/index'
// import { deepClone } from '../../../utils/deepClone'

export default {
  data () {
    return {
      detailList: [],
      dialogVisible: false,
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
      schoolList: [],
      schoolName: '',
      courseList: [],
      knowledgePointList: [],
      form: {
        examId: '',
        courseId: '',
        knowledgePointId: ''
      },
      loading: false,
      table: [],
      lineChart: {
        legend: {
          data: ['结构难度曲线图']
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
          data: [0, 0.2, 0.4, 0.6, 0.8, 1]
        },
        series: [
          {
            name: '结构难度曲线图',
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
    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisCourse/subjectTotalStructAnalysisExport?` +
                                      `examId=${this.form.examId}` +
                                      `&subjectId=${this.form.courseId}` +
                                      `&knowledgePointId=${this.form.knowledgePointId}` +
                                      `&gradeId=${this.examList.filter(item => item.id === this.form.examId)[0].gradeId}` +
                                      `&examName=${this.examList.filter(item => item.id === this.form.examId)[0].name}` +
                                      `&subjectName=${this.courseList.filter(item => item.courseId === this.form.courseId)[0].courseName}`
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

    async lookDetail (item, index) {
      this.dialogVisible = true
      let type = ''
      let groupNum = ''
      let pointScore = ''
      if (item.pointScore === '合计') {
        pointScore = '-1'
        type = 3
        if (index <= 6) groupNum = index + 1
        else groupNum = 0
      } else {
        pointScore = item.pointScore
        if (index <= 6) {
          type = 1
          groupNum = index + 1
        } else {
          type = 2
          groupNum = 0
        }
      }
      const { data } = await this.$https.get(`/analysisCourse/subjectTotalStructAnalysisStudentDetailQuery` +
                                              `?examId=${this.form.examId}` +
                                              `&subjectId=${this.form.courseId}` +
                                              `&knowledgePointId=${this.form.knowledgePointId}` +
                                              `&pointScore=${pointScore}` +
                                              `&groupNum=${groupNum}` +
                                              `&type=${type}`
                                              )
      this.detailList = data.result
      this.needExamNo = this.detailList.every(item => item.examNo)
    },

    courseListChange () {
      this.getcourseList()
    },

    async getData () {
      this.loading = true
      const { data } = await this.$https.get(`/analysisCourse/subjectTotalStructAnalysisQuery` +
                                      `?knowledgePointId=${this.form.knowledgePointId}&subjectId=${this.form.courseId}&examId=${this.form.examId}`)
      if (data.code !== 1) {
        notice(this, data.message, 2000)
      } else {
        if (data.result) {
          this.table = data.result.questionGroupList
          if (this.table) {
            this.table[this.table.length - 1].pointScore = '合计'
          }
          this.lineChart.xAxis.data = (data.result.graphList || []).map(item => item.totalScore)
          this.lineChart.series[0].data = (data.result.graphList || []).map(item => item.scoreRate)
        }
      }
      this.loading = false
    },

    async knowledgeList () {
      // 知识点列表
      const { data: knowledgePoint } = await this.$https.get(`/common/knowledgePointList` +
                                      `?examId=${this.form.examId}&subjectId=${this.form.courseId}`)
      if (knowledgePoint.code !== 1) notice(this, knowledgePoint.message, 2000)
      else {
        this.knowledgePointList = knowledgePoint.result
        this.form.knowledgePointId = this.knowledgePointList ? this.knowledgePointList[0].pointId : ''
      }
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
      await this.knowledgeList()
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
.chart-2-10 {
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

  .el-dialog{
    width: 1000px !important;
  }
}
</style>

