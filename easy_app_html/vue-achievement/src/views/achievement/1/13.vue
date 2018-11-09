<template>
  <div class="chart-1-13">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      

      <div class="course">
        <span style="margin-left: 40px;">学科</span>
        <el-select v-model="courseId" placeholder="请选择学科" style="width: 300px;" @change="getExam">
          <el-option
            v-for="item in courseList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="grade">
          <span style="margin-left: 40px;">年级</span>
          <el-select v-model="gradeListId" placeholder="请选择年级" style="width: 300px;" @change="getExam">
            <el-option
              v-for="item in gradeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-button type="primary" @click="getData">查询</el-button>
      </div>
      <div class="exam">
        <span>考试</span>
        <el-checkbox-group 
          v-model="checkedList"
          :min="1">
          <el-checkbox v-for="exam in examList" :label="exam" :key="exam.id">
          {{ exam.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>

    <div class="content" v-loading="loading">
      <el-table
        :data="table"
        border
        v-if="!loading">  
        <el-table-column
          prop="schoolName"
          label="学校名称"
          show-overflow-tooltip
          fixed
          min-width="200px">
        </el-table-column>
        <el-table-column
            align="center"
            v-for="(list, n) in headList"
            :label="list.name"
            :key="n"
            >
            <el-table-column
              label="平均得分率"
              show-overflow-tooltip
              min-width="200px">
                <template scope="scope">
                  {{ ((scope.row.incrementAnlysisMap[list.id] && (scope.row.incrementAnlysisMap[list.id].avgScorePercent !== 'NaN') ? scope.row.incrementAnlysisMap[list.id].avgScorePercent : 0) * 100).toFixed(2) + '%' }}
                </template>
            </el-table-column>
              <el-table-column
              label="学业水平能级"
              show-overflow-tooltip
              min-width="200px">
                <template scope="scope">
                  {{ scope.row.incrementAnlysisMap[list.id] && (scope.row.incrementAnlysisMap[list.id].level != 'NaN') ? scope.row.incrementAnlysisMap[list.id].level : 0 }}
                </template></el-table-column>
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
      gradeList: [],
      examId: '',
      gradeListId: '',
      gradeId: '',
      checkedList: [],
      courseList: [],
      courseId: '',
      loading: false,
      table: [],
      headList: [],
      lineChart: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '50%',
          bottom: '8%',
          containLabel: true
        },
        legend: {
          data: []
        },
        xAxis: {
          type: 'category',
          data: [],
          triggerEvent: true,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            rotate: 10
          },
          textStyle: {
            fontSize: 10,
            align: 'center'
          }
        },
        yAxis: {
          name: '学业水平能级',
          triggerEvent: true,
          type: 'value'
        },
        series: []
      }
    }
  },

  methods: {
    exportButton () {
      if (!this.checkedList[0]) {
        notice(this, '请选择考试', 2000)
        return
      }
      let arr = this.courseList.filter(item => item.id === this.courseId)
      let courseName = arr.length > 0 ? arr[0].name : ''
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisResearch/schoolTeachIncrementAnalysisExport?` +
                                  `examIds=${this.checkedList.map(item => item.id).join(',')}` +
                                  `&examNames=${this.checkedList.map(item => item.name).join(',')}` +
                                  `&courseId=${this.courseId}` +
                                  `&courseName=${courseName}` +
                                  `&gradeId=${this.gradeId}`
    },

    async getData () {
      // this.loading = true
      // this.lineChart.series = []
      // this.table = []
      if (!this.checkedList[0]) {
        notice(this, '请选择考试', 2000)
        return
      }
      if (!this.courseId) return
      const { data: develop } = await this.$https.get(`/analysisResearch/schoolTeachIncrementAnalysisQuery` +
                                      `?examIds=${this.checkedList.map(item => item.id).join(',')}&courseId=${this.courseId}`)
      if (develop.code !== 1) notice(this, develop.message, 2000)
      else {
        if (!develop.result || develop.result.length === 0) {
          this.loading = false
          this.lineChart.series = []
          this.table = []
          return
        }
        // this.lineChart.series = []
        this.table = [...develop.result]
        this.headList = [...this.checkedList]
        // this.lineChart.legend.data = develop.result.map(item => item.schoolName)
        // this.lineChart.xAxis.data = this.headList.map(item => item.name)
        const ids = this.headList.map(item => item.id)

        // 每个学校一个新的series
        let series = []
        develop.result.forEach((item, index) => {
          const data = ids.map(n => item.incrementAnlysisMap[n] ? item.incrementAnlysisMap[n].level : 0)
          const obj = {
            name: item.schoolName,
            type: 'line',
            data
          }
          series.push(obj)
        })
        this.lineChart = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: develop.result.map(item => item.schoolName)
          },
          grid: {
            left: '5%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            data: this.headList.map(item => item.name)
          },
          yAxis: {
            type: 'value',
            name: '学业水平能级'
          },
          series
        }
      }
      this.loading = false
    },
    filterNum (obj) {
      let arr = this.checkedList.map(item => item.id)
      arr.forEach(item => {
        obj[item] = obj[item] ? obj[item] : {avgScorePercent: 0, level: 0}
      })
      return obj
    },

    async getcourseList (e) {
      // 年级
      const { data } = await this.$https.get(`/common/subjectList`)
      if (data.code === 1 && data.result) {
        data.result ? this.courseList = data.result : this.courseList = []
        this.courseList.forEach(item => {
          item.name = item.sectionName + item.name
        })
      } else if (data.code === -2) {
        error()
      } else {
        notice(this, data.message, 2000)
      }
      this.courseId = this.courseList.length === 0 ? '' : this.courseList[0].id
    },

    async getgradeList (e) {
      // 年级
      const { data } = await this.$https.get(`/common/allGradeList`)
      if (data.code === 1) {
        data.result ? this.gradeList = data.result : this.gradeList = []
      } else if (data.code === -2) {
        error()
      } else {
        notice(this, data.message, 2000)
      }
      this.gradeListId = this.gradeList.length === 0 ? '' : this.gradeList[0].id
    },

    async getExam () {
      this.checkedList = []
      if (!this.gradeListId || !this.courseId) {
        return
      }
      const { data: examList } = await this.$https.get('/common/examList' +
                              `?gradeId=${this.gradeListId}&subjectId=${this.courseId}`)
      if (examList.code === 1) {
        examList.result.length !== 0 ? this.gradeId = examList.result[0].gradeId : this.gradeId = ''
        if (examList.result.length !== 0) {
          this.examList = [...examList.result.map(item => ({ id: item.id, name: item.name, scoreRuleId: item.scoreRuleId }))]
          this.checkedList[0] = this.examList[0]
        } else {
          this.examList = []
          this.checkedList[0] = ''
        }
      } else if (examList.code === -2) {
        error()
      } else {
        notice(this, examList.message, 2000)
      }
    }
  },

  async created () {
    await this.getcourseList()
    await this.getgradeList()
    this.getExam()
    this.getData()
    // const { data: examList } = await this.$https.get('/common/examList' +
    //                           `?gradeId=${this.gradeId}&subjectId=${this.courseId}`)
    // if (examList.code === 1) {
    //   if (examList.result.length !== 0) this.gradeId = examList.result[0].gradeId
    //   this.examList = [...examList.result.map(item => ({ id: item.id, name: item.name, scoreRuleId: item.scoreRuleId }))]
    //   this.checkedList[0] = this.examList[0]
    //   await this.getcourseList()
    //   await this.getgradeList()
    //   this.getData()
    // }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/variable.scss';
.chart-1-13 {
  position: relative;
  >.el-button {
    position: absolute;
    right: 0;
    top: -66px;
  }
  
  >.select {
    display: flex;

    >.exam {
      margin-left: 10px;
      display: flex;      
      // width: 300px;
      padding-top: 6px;

      >.el-checkbox-group {
        margin-left: 20px;

        >.el-checkbox {
          display: block;
          margin: 0 0 10px 0;
        }
      }

      &:first-child {
        max-width: 450px;
        overflow: hidden;
        >span {
          display: inline-block !important;
          width: 50px !important;
        }
        >div {
          margin-left: 0;
        }
      }
    }

    .el-select {
      margin-left: $width;
    }

    .el-button {
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
