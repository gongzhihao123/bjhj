<template>
  <div class="chart-2-1">
    <!-- 
      <el-button type="primary">导出</el-button>
    -->
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
      <chart :options="barChart" class="echart"></chart>
      <p style="margin-left: 3%;color: #CBD1D8;">分析提示：此图横坐标为学生本次考试几门学科总分，纵坐标为难度（得分率）。曲线表达了不同总分的学生的本学科平均得分率情况。</p>
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
      barChart: {
        color: ['#31a6e8'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          // top: '6%',
          left: '3%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          name: '分数',
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 10,
            rotate: 30
          },
          textStyle: {
            fontSize: 10,
            align: 'center'
          }
        },
        yAxis: {
          name: '难度',
          type: 'value'
        },
        series: [
          {
            name: '难度',
            type: 'line',
            barWidth: '60%',
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  fontSize: 14
                }
              }
            },
            data: []
          }
        ]
      }
    }
  },

  methods: {
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
      const { data: difficult } = await this.$https.get(`/analysisCourse/subjectDifficultyGraphQuery` +
                                      `?examId=${this.examId}&subjectId=${this.courseId}`)
      if (difficult.code !== 1) notice(this, difficult.message, 2000)
      else {
        this.barChart.xAxis.data = (difficult.result || []).map(item => item.score)
        this.barChart.series[0].data = (difficult.result || []).map(item => item.subjectScorePercent.toFixed(2))
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
        this.courseList = [...courseList.result || []]
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
.chart-2-1 {
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
