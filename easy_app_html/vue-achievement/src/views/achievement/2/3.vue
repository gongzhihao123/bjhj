<template>
  <div class="chart-2-3">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 200px;" @change="getcourseList">
        <el-option
          v-for="item in examList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <span style="margin-left: 40px;">学科</span>
      <el-select v-model="courseId" placeholder="请选择学科" style="width: 200px;">
        <el-option
          v-for="item in courseList"
          :key="item.id"
          :label="item.courseName"
          :value="item.courseId">
        </el-option>
      </el-select>

      <span style="margin-left: 40px">分数段</span>
      <el-input-number v-model="num"  :min="5"></el-input-number>
      <el-button type="primary" @click="getData">查询</el-button>
    </div>

    <div class="content" v-loading="loading">
        <chart :options="lineChart" class="echart"></chart>
        <p style="margin-left: 3%;color: #CBD1D8;">分析提示：请注意观察总分分布状态及其分布偏态，观察人数分布最集中的分数区间；判断高分段与低分段学生集中度的相对差异。</p>
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="scoreDistribution"
            label="分数">
          </el-table-column>
          <el-table-column
            prop="num"
            label="人数">
            <template scope="scope">
              <span @click="lookDetail(scope.row, scope.$index)" :class="{'color': scope.row.num > 0}">{{ scope.row.num }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="numPercent"
            label="比率">
            <template scope="scope">
              {{ (scope.row.numPercent * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sumNum"
            label="累计人数">
          </el-table-column>
          <el-table-column
            prop="sumNumPercent"
            label="累计比率">
            <template scope="scope">
              {{ (scope.row.sumNumPercent * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>
        </el-table>
        <p style="margin-left: 3%;color: #CBD1D8;">分析提示：此表数据具体表达了各个分数段的人数分布，可以查阅各个等第的具体人数比率分布。</p>
    </div>

    <el-dialog
      title="学生明细"
      :visible.sync="dialogVisible"
      size="tiny">
      <el-table
          :data="detailList"
          class="detail-class"
          border>
          <el-table-column
            prop="examNo"
            label="考号"
            v-if="needExamNo"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="name"
            label="学生姓名"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="score"
            label="分数"
            min-width="150">
            <template scope="scope">
              {{ scope.row.score.toFixed(1) }}
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

export default {
  data () {
    return {
      dialogVisible: false,
      detailList: [],
      examList: [],
      examId: '',
      courseList: [],
      courseId: '',
      loading: false,
      table: [],
      num: 5,
      lineChart: {
        color: ['#35a9eb'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          name: '分数',
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
        },
        yAxis: {
          type: 'value',
          name: '人数'
        },
        series: [
          {
            name: '人数',
            type: 'line',
            stack: '人数',
            smooth: true,
            data: []
          }
        ]
      },
      needExamNo: ''
    }
  },

  methods: {
    exportButton () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      if (!this.courseId) {
        notice(this, '请选择学科', 2000)
        return
      }
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisCourse/subjectTotalScoreDistributionExport?` +
                                  `examId=${this.examId}` +
                                  `&subjectId=${this.courseId}` +
                                  `&distribution=${this.num}` +
                                  `&examName=${this.examList.filter(item => item.id === this.examId)[0].name}` +
                                  `&gradeId=${this.examList.filter(item => item.id === this.examId)[0].gradeId}`
    },

    async lookDetail (item, index) {
      if (item.num > 0) {
        this.dialogVisible = true
        let first
        if (index > 0) first = false
        else first = true
        const { data } = await this.$https.get(`/analysisCourse/studentSubjectTotalScoreDetailQuery` +
                          `?examId=${this.examId}&scoreDistribution=${item.scoreDistribution}` +
                          `&subjectName=${this.courseList.filter(item => item.courseId === this.courseId)[0].courseName}` +
                          `&first=${first}&subjectId=${this.courseId}`)
        this.detailList = data.result
        this.needExamNo = this.detailList.every(item => item.examNo)
      }
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      if (!this.courseId) {
        notice(this, '请选择学科', 2000)
        return
      }
      this.loading = true
      const { data: total } = await this.$https.get(`/analysisCourse/subjectTotalScoreDistributionQuery` +
                                      `?examId=${this.examId}&subjectId=${this.courseId}&distribution=${this.num}`)
      if (total.code !== 1) notice(this, total.message, 2000)
      else {
        if (total.result) {
          this.table = [...total.result]
          this.lineChart.xAxis.data = (total.result || [])
                                      .map(item => item.scoreDistribution.split('到')[0])
                                      .reverse()
          this.lineChart.series[0].data = (total.result || []).map(item => item.num).reverse()
        } else {
          this.table = []
          this.lineChart.xAxis.data = []
          this.lineChart.series[0].data = []
        }
      }
      this.loading = false
    },

    async getcourseList () {
      // 学期
      const scoreRuleId = this.examList.filter(item => item.id === this.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        return
      }
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result]
        this.courseId = this.courseList.length === 0 ? '' : this.courseList[0].courseId
      }
    }
  },

  async created () {
    // 考试列表
    const { data: examList } = await this.$https.get('/common/examList')
    if (examList.code === 1) {
      this.examList = [...examList.result || []]
      if (sessionStorage.PARAMS_EXAMID > 0) this.examId = Number(sessionStorage.PARAMS_EXAMID)
      else this.examId = this.examList.length > 0 ? this.examList[0].id : ''
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
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

<style lang="scss">
@import '../../../assets/scss/variable.scss';
.chart-2-3 {
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
      .color{
        color: #7BC6F1;
        cursor: pointer; 
      }
    }
  }

  .echarts {
    width: 100%;
  }

  .el-dialog{
    width: 700px !important;
  }
}
</style>
