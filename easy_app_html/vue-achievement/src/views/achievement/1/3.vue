<template>
  <div class="chart-1-3">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 200px;">
        <el-option
          v-for="item in examList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <span style="margin-left: 40px">分数段</span>
      <el-input-number v-model="num"  :min="5"></el-input-number>
      <el-button type="primary" @click="getData">查询</el-button>
    </div>

    <div class="content" v-loading="loading">
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="sectionName"
            label="分数">
          </el-table-column>
          <el-table-column
          v-for="(item, i) in list"
          :key="item.schoolId"
          :label="item.schoolName">
          <template scope="scope">
            <el-button type="text" :disabled="scope.row.section[0].school[i].schoolCount === 0" @click="showStudent(scope.row, scope.row.section[0].school[i])">
                {{scope.row.section[0].school[i].schoolCount}}
            </el-button>
          </template>
        </el-table-column>
          <el-table-column
            label="人数小计">
            <template scope="scope">
              <el-button type="text" :disabled="scope.row.section[0].number === 0" @click="showStudent(scope.row)">
                  {{ scope.row.section[0].number }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="比率">
            <template scope="scope">
              {{ (scope.row.section[0].ratio * 100).toFixed(2) + '%' }}
            </template>
          </el-table-column>
          <el-table-column
            label="累计人数">
            <template scope="scope">
              {{ scope.row.section[0].cumulativeNumber }}
            </template>
          </el-table-column>
          <el-table-column
            label="累计比率">
            <template scope="scope">
              {{ (scope.row.section[0].cumulativeRatio * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>
        </el-table>
    </div>
    <el-dialog title="学生列表" :visible.sync="dialog">
      <el-table :data="studentData" border max-height="300">
        <el-table-column property="examNo" label="考号" width="150" v-if="needExamNo"></el-table-column>
        <el-table-column property="studentName" label="姓名" width="100"></el-table-column>
        <el-table-column property="allScore" label="成绩">
          <template scope="scope">
            {{ scope.row.allScore.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column property="schoolName" label="学校"></el-table-column>
      </el-table>
    </el-dialog>
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
      num: 10,
      list: [],
      dialog: false,
      studentData: [],
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
      window.location.href = `${path}/analysisResearch/totalScoreNumberDistributionExport?` +
                                  `examId=${this.examId}` +
                                  `&scoreSegment=${this.num}`
    },
    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      this.loading = true
      const { data: total } = await this.$https.get(`/analysisResearch/totalScoreNumberDistributionQuery` +
                                      `?examId=${this.examId}&scoreSegment=${this.num}`)
      if (total.code !== 1) notice(this, total.message, 2000)
      else {
        total.result ? this.table = [...total.result] : this.table = []
        if (this.table.length > 0) {
          this.list = this.table[0].section[0].school
        }
      }
      this.loading = false
    },
    async showStudent (row, item) {
      // console.log(row.sectionName.substring(6, 11))
      // console.log(row)
      this.dialog = true
      const { data } = await this.$https.get(`/analysisResearch/totalScoreNumberDistributionQueryDetail?` +
                                            `segmentUp=${row.sectionName.split('~')[0]}` +
                                            `&schoolId=${!item ? '' : item.schoolId}` +
                                            `&examId=${this.examId}` +
                                            `&segmentDown=${row.sectionName.split('~')[1]}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        data.result ? this.studentData = [...data.result] : this.studentData = []
        this.needExamNo = this.studentData.every(item => item.examNo)
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
.chart-1-3 {
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
