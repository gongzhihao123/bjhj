<template>
  <div class="chart-1-5">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 300px;">
        <el-option
          v-for="item in examList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      
      <el-button type="primary" @click="getData">查询</el-button>
    </div>

    <div class="content" v-loading="loading" v-if="tableData.length > 0">
      <!-- 小题 -->
        <h3 class="title">总分及学科一档上线人数分布</h3>
        <el-table
          :data="tableData"
          border
          max-height="500">
          <el-table-column
            prop="schoolName"
            label="学校"
            min-width="80"
            fixed>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :key="index"
            :label="list">
            <el-table-column
              label="人数"
              min-width="80">
              <template scope="scope">
                <span v-if="scope.row.subjects[index]">
                  {{ scope.row.subjects[index].gradeOneNum }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              min-width="120">
              <template scope="scope">
                <span v-if="scope.row.subjects[index]">
                 {{ (scope.row.subjects[index].gradeOnePercent * 100).toFixed(2) + '%' }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
         </el-table>

        <h3 class="title">总分及学科二档上线人数分布</h3>
        <el-table
          :data="tableData"
          border
          max-height="500">
          <el-table-column
            prop="schoolName"
            label="学校"
            min-width="80"
            fixed>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :key="index"
            :label="list">
            <el-table-column
              label="人数"
              min-width="80">
              <template scope="scope">
                <span v-if="scope.row.subjects[index]">
                  {{ scope.row.subjects[index].gradeTwoNum }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              min-width="120">
              <template scope="scope">
                <span v-if="scope.row.subjects[index]">
                  {{ (scope.row.subjects[index].gradeTwoPercent * 100).toFixed(2) + '%' }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
         </el-table>

        <h3 class="title">总分及学科三档上线人数分布</h3>
        <el-table
          :data="tableData"
          border
          max-height="500">
          <el-table-column
            prop="schoolName"
            label="学校"
            min-width="80"
            fixed>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :key="index"
            :label="list">
            <el-table-column
              label="人数"
              min-width="80">
              <template scope="scope">
                <span v-if="scope.row.subjects[index]">
                  {{ scope.row.subjects[index].gradeThreeNum }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              min-width="120">
              <template scope="scope">
                <span v-if="scope.row.subjects[index]">
                  {{ (scope.row.subjects[index].gradeThreePercent * 100).toFixed(2) + '%' }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
         </el-table>

        <h3 class="title">总分及学科其他上线人数分布</h3>
        <el-table
          :data="tableData"
          border
          max-height="500">
          <el-table-column
            prop="schoolName"
            label="学校"
            min-width="80"
            fixed>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :key="index"
            :label="list">
            <el-table-column
              label="人数"
              min-width="80">
              <template scope="scope">
                <span v-if="scope.row.subjects[index]">
                  {{ scope.row.subjects[index].otherNum }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="占所在学校总人数比率"
              min-width="120">
              <template scope="scope">
                <span v-if="scope.row.subjects[index]">
                  {{ (scope.row.subjects[index].otherNumPercent * 100).toFixed(2) + '%' }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
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
      tableData: [],
      subject: []
    }
  },

  methods: {
    exportButton () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisResearch/onLinePeopleNumSubjectDistributionExport?` +
                                  `examId=${this.examId}`
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      this.loading = true
      this.tableData = []
      this.subject = []
      const { data } = await this.$https.get(`/analysisResearch/onLinePeopleNumSubjectDistributionQuery` +
                                      `?examId=${this.examId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        const ids = [...new Set((data.result || []).map(item => item.schoolId))]
        const school = ids.map(item => {
          const schoolName = (data.result || []).filter(n => n.schoolId === item)[0].schoolName
          return { schoolId: item, schoolName }
        })
        this.subject = (data.result || [])
                      .filter(item => item.schoolId === ids[0])
                      .map(item => item.subjectName || '总分')
        this.tableData = [...school.map(item => {
          const subjects = (data.result || []).filter(n => n.schoolId === item.schoolId)
          return {...item, subjects}
        })]
      }
      this.loading = false
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
.chart-1-5 {
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
    margin-top: $width;

    >.el-table {
      margin: $width auto;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
