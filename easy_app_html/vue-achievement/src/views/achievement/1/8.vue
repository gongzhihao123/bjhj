<template>
  <div class="chart">
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

    <div class="content">
      <div v-for="(item, index) in table" :key="index"  v-loading="loading">
        <chart style="margin-top: 50px;" :options="item.barChart" class="echart"></chart>
        <el-table
          :data="item.tableData"
          border>
          <el-table-column
            prop="schoolName"
            label="学校"
            fixed
            width="120px"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="优秀"
            prop="goodStudent"
            min-width="80">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 1)" type="text"  :disabled="scope.row.goodStudent === 0">
                  {{ scope.row.goodStudent}}
                </el-button>
              </template>
            </el-table-column>
          <el-table-column
            label="累计比率"
            prop="goodRatio"
            min-width="80">
            <template scope="scope">
              {{ (scope.row.goodRatio * 100).toFixed(2) + '%' }}
            </template>
          </el-table-column>
          <el-table-column
            label="良好"
            prop="fineStudent"
            min-width="80">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 2)" type="text"  :disabled="scope.row.fineStudent === 0">
                  {{ scope.row.fineStudent}}
                </el-button>
              </template>
            </el-table-column>
          <el-table-column
            label="累计比率"
            prop="fineRatio"
            min-width="80">
            <template scope="scope">
              {{ (scope.row.fineRatio * 100).toFixed(2) + '%' }}
            </template>
          </el-table-column>
          <el-table-column
            label="合格"
            prop="qualifiedStudent"
            min-width="80">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 3)" type="text"  :disabled="scope.row.qualifiedStudent === 0">
                  {{ scope.row.qualifiedStudent}}
                </el-button>
              </template>
            </el-table-column>
          <el-table-column
            label="累计比率"
            prop="qualifiedRatio"
            min-width="80">
            <template scope="scope">
              {{ (scope.row.qualifiedRatio * 100).toFixed(2) + '%' }}
            </template>
          </el-table-column>
          <el-table-column
            label="不合格"
            prop="unqualifiedStudent"
            min-width="80">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 4)" type="text"  :disabled="scope.row.unqualifiedStudent === 0">
                  {{ scope.row.unqualifiedStudent}}
                </el-button>
              </template>
            </el-table-column>
          <el-table-column
            label="累计比率"
            prop="unqualifiedRatio"
            min-width="80">
            <template scope="scope">
              {{ (scope.row.unqualifiedRatio * 100).toFixed(2) + '%' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="学生列表" :visible.sync="dialog" custom-class="detail">
      <el-table :data="studentData" border max-height="300">
        <el-table-column property="examNo" label="考号" width="150" show-overflow-tooltip v-if="needExamNo"></el-table-column>
        <el-table-column property="studentName" label="姓名" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column property="className" label="班级" show-overflow-tooltip ></el-table-column>
        <el-table-column property="courseName" label="学科" show-overflow-tooltip v-if="courseId"></el-table-column>
        <el-table-column property="courseScore" label="分数" show-overflow-tooltip v-if="courseId">
          <template scope="scope">
            {{ scope.row.courseScore.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column property="courseScore" label="成绩" show-overflow-tooltip v-else>
          <template scope="scope">
            {{ scope.row.courseScore.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column property="name" label="等级" show-overflow-tooltip>
          <template scope="scope">
            {{
               grade === 1
               ? '优秀'
               : grade === 2
                ? '良好'
                : grade === 3
                  ? '合格'
                  : '不合格'
            }}
            
          </template>
        </el-table-column>
        <el-table-column property="schoolName" label="学校" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column label="排名" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->
      </el-table>
    </el-dialog>
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
      examId: '',
      courseList: [],
      courseId: '',
      loading: false,
      table: [],
      num: 5,
      grade: '',
      needExamNo: ''
    }
  },

  methods: {

    exportButton () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisResearch/subjectRankDistributionExport?` +
                                  `examId=${this.examId}` +
                                  `&courseId=${this.courseId}` +
                                  `&courseName=${this.courseList.filter(item => item.courseId === this.courseId)[0].courseName}`
    },

    async showStudent (row, grade) {
      this.dialog = true
      this.grade = grade
      this.studentData = []
      const { data: student } = await this.$https.get(`/analysisResearch/subjectRankDistributionQueryDetail` +
                                `?schoolId=${row.schoolId}` +
                                `&type=${grade}` +
                                `&examId=${this.examId}` +
                                `&fine=${row.fine}` +
                                `&good=${row.good}` +
                                `&qualified=${row.qualifiad}` +
                                `&courseId=${row.courseId}`)
      if (student.code === 1) {
        this.studentData = [...student.result.listSubjectScore] || [...student.result.listAllScore]
        this.needExamNo = this.studentData.every(item => item.examNo)
      }
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      this.loading = true
      const { data } = await this.$https.get(`/analysisResearch/subjectRankDistributionQuery` +
                                      `?examId=${this.examId}&courseId=${this.courseId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        let newArr = Array.from(new Set((data.result || []).map(item => item.courseId)))
        let table = []
        newArr.forEach((child) => {
          table.push({ tableData: (data.result || []).filter(item => item.courseId === child) })
        })
        this.table = table
        this.table.forEach((item) => {
          item.barChart = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            title: {
              text: `${item.tableData[0].courseName || this.courseList.filter(item => item.courseId === this.courseId)[0].courseName}优良等级人数`
            },
            legend: {
              data: ['优秀', '良好', '合格', '不合格']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              name: '人数',
              type: 'value'
            },
            yAxis: {
              name: '学校',
              type: 'category',
              data: item.tableData.map(item => item.schoolName)
            },
            series: [
              {
                name: '优秀',
                type: 'bar',
                stack: '人数总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: item.tableData.map(item => item.goodStudent)
              },
              {
                name: '良好',
                type: 'bar',
                stack: '人数总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: item.tableData.map(item => item.fineStudent)
              },
              {
                name: '合格',
                type: 'bar',
                stack: '人数总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: item.tableData.map(item => item.qualifiedStudent)
              },
              {
                name: '不合格',
                type: 'bar',
                stack: '人数总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: item.tableData.map(item => item.unqualifiedStudent)
              }
            ]
          }
        })
      }
      this.loading = false
    },

    async getcourseList () {
      // 学期
      const scoreRuleId = this.examList.filter(item => item.id === this.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        this.courseList = []
        return
      }
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result || []]
        this.courseList = [{ courseId: '', courseName: '全部' }].concat(this.courseList)
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
.chart {
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

  .detail {
    width: 1000px !important;
  }
}
</style>
