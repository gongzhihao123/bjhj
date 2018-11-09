<template>
  <div class="chart-1-12">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 300px;" @change="getcourseList">
        <el-option
          v-for="item in examList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <span style="margin-left: 40px;">学科</span>
      <el-select v-model="courseId" placeholder="请选择学科" style="width: 300px;">
        <el-option
          v-for="item in courseList"
          :key="item.id"
          :label="item.courseName"
          :value="item.courseId">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getData">查询</el-button>
    </div>

    <div class="content" v-loading="loading">
      <el-table
        :data="table"
        border>
        <el-table-column
          prop="schoolName"
          label="学校名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="avgScorePercent"
          label="平均得分率">
          <template scope="scope">
            {{ (scope.row.avgScorePercent * 100).toFixed(2) + '%'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          label="学业水平能级">
        </el-table-column>
      </el-table>
      <chart :options="lineChart" class="echart"></chart>
    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'

export default {
  data () {
    return {
      examList: [],
      examId: '',
      courseList: [],
      courseId: '',
      loading: false,
      table: [],
      lineChart: {
        color: ['#35a9eb'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          // top: '3%',
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          name: '学校',
          type: 'category',
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
          name: '学业水平能级',
          type: 'value'
        },
        series: [
          {
            name: '学业水平能级',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: []
          }
        ]
      }
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
      window.location.href = `${path}/analysisResearch/totalSubjectLevelDevelopmentChangeExport?` +
                                  `examId=${this.examId}` +
                                  `&courseId=${this.courseId}` +
                                  `&examName=${this.examList.filter(item => item.id === this.examId)[0].name}` +
                                  `&courseName=${this.courseList.filter(item => item.courseId === this.courseId)[0].courseName}` +
                                  `&gradeId=${this.examList.filter(item => item.id === this.examId)[0].gradeId}`
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
      const { data: develop } = await this.$https.get(`/analysisResearch/totalSubjectLevelDevelopmentChangeQuery` +
                                      `?examId=${this.examId}&courseId=${this.courseId}`)
      if (develop.code !== 1) notice(this, develop.message, 2000)
      else {
        this.table = [...develop.result || []]
        this.lineChart.xAxis.data = (develop.result || []).filter(item => item.schoolId !== 0).map(item => item.schoolName)
        this.lineChart.series[0].data = (develop.result || []).filter(item => item.schoolId !== 0).map(item => item.level)
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

<style scoped lang="scss">
@import '../../../assets/scss/variable.scss';
.chart-1-12 {
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
