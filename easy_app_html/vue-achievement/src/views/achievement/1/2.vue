<template>
  <div class="chart-1-2">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 300px;" @change="getFlag">
        <el-option
          v-for="item in examList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

        <el-radio-group v-model="type" style="margin-left: 80px;">
          <el-radio :label="0">标准显示</el-radio>
          <el-radio :label="1" :disabled="rankFlag != 1">学校分布显示</el-radio>
        </el-radio-group>
      <el-button type="primary" @click="getData">查询</el-button>
    </div>

    <div class="content" v-loading="loading">
        <el-table
          :data="table"
          border
          v-if="!state">
          <el-table-column
            prop="examNo"
            min-width="80px"
            label="考号"
            show-overflow-tooltip
            v-if="needExamNo">
          </el-table-column>
          <el-table-column
            prop="studentName"
            min-width="80"
            label="姓名"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="allScore"
            min-width="80"
            label="总分"
            show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.allScore ? scope.row.allScore.toFixed(1) : 0 }}
            </template>
          </el-table-column>
          <el-table-column 
          label="学校"
          min-width="80"
          prop="schoolName"
          show-overflow-tooltip></el-table-column>
          <el-table-column 
            v-for="(item, index) in subjectList" 
            :key="index" 
            :label="item.courseName"
            min-width="80">
            <template scope="scope">
              {{ scope.row.listObjectScore[index] ? ((scope.row.listObjectScore[index].courseScore || scope.row.listObjectScore[index].courseScore == 0) ? (scope.row.listObjectScore[index].courseScore % 1 > 0) ? scope.row.listObjectScore[index].courseScore.toFixed(1) : scope.row.listObjectScore[index].courseScore : '') : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="rankRegion"
            min-width="80"
            label="年级排名"
            show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.rankRegion }}
            </template>
          </el-table-column>
          <el-table-column
            prop="rankSchool"
            min-width="80"
            label="学校排名"
            show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.rankSchool }}
            </template>
          </el-table-column>
        </el-table>

        <div class="school-table"
            v-if="state">
          <el-table
            v-for="child in studentData"
            :data="child.students"
            border
            :key="child.schoolId">
            <el-table-column 
            :label="child.schoolName"
            align="center">
              <el-table-column 
              label="考号"
              min-width="80"
              prop="examNo"
              show-overflow-tooltip></el-table-column>
              <el-table-column 
              label="姓名"
              prop="studentName"
              min-width="80"
              show-overflow-tooltip></el-table-column>
              <el-table-column 
              label="总分"
              min-width="80"
              prop="allScore"
              show-overflow-tooltip>
                <template scope="scope">
                  {{ scope.row.allScore ? scope.row.allScore.toFixed(1) : '' }}
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
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
      num: 5,
      rankFlag: 1,
      type: 0,
      subject: [],
      studentData: [],
      school: [],
      state: false,
      subjectList: [],
      needExamNo: true
    }
  },

  methods: {
    exportButton () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisResearch/studentTotalScoreInquiryExport?` +
                                  `examId=${this.examId}` +
                                  `&type=${this.type}`
    },
    async getSubjectList () {
      await this.$https.get(`/analysisResearch/ruleScoreCourseList?examId=${this.examId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subjectList = (res.data.result || []).filter(item => item)
          // console.log(res.data.result)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      this.loading = true
      await this.getSubjectList()
      const { data: student } = await this.$https.get(`/analysisResearch/studentTotalScoreInquiryQuery` +
                                      `?examId=${this.examId}&type=${this.type}`)
      if (student.code !== 1 || !student.result) {
        notice(this, student.message, 2000)
        this.table = []
        this.studentData = []
      } else {
        if (this.type === 0) {
          this.state = false
          this.table = student.result || []
          this.needExamNo = this.table.every(item => item.examNo)
          this.subject = student.result.length === 0
                        ? []
                        : [ ...student.result[0].listObjectScore ]
          // this.table = this.table.map(item => ())
          this.table = this.table.map(item => ({
            ...item,
            listObjectScore: this.filterSub(item.listObjectScore || [])
          }))
        } else {
          this.state = true
          student.result = student.result || []
          const ids = [...new Set(student.result.map(item => item.schoolId))]
          const school = ids.map(item => {
            const schoolName = student.result.filter(n => n.schoolId === item)[0].schoolName
            return { schoolId: item, schoolName }
          })
          this.studentData = school.map(item => {
            const students = student.result.map(n => {
              if (n.schoolId === item.schoolId) {
                return n
              } else {
                return {
                  examNo: '',
                  schoolName: '',
                  studentName: '',
                  allScore: '',
                  className: ''
                }
              }
            })
            return { ...item, students }
          })
        }
      }
      this.loading = false
    },
    filterSub (arr) {
      let obj = [ ...this.subjectList ].map(item => ({...item, courseScore: null}))
      obj.forEach(item => {
        arr.forEach(items => {
          if (items.courseName === item.courseName) {
            item.courseScore = items.courseScore
          }
        })
      })
      return obj
    },
    async getFlag () {
      this.type = 0
      this.rankFlag = this.examList.find(item => item.id === this.examId).rankFlag
    }
  },

  async created () {
    // 考试列表
    const { data: examList } = await this.$https.get('/common/examList')
    if (examList.code === 1) {
      this.examList = [...examList.result || []]
      if (sessionStorage.PARAMS_EXAMID > 0) this.examId = Number(sessionStorage.PARAMS_EXAMID)
      else this.examId = this.examList.length > 0 ? this.examList[0].id : ''
      // await this.getSubjectList()
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
.chart-1-2 {
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
      max-width: 100%;
    }

    .school-table {
      margin-top: $width;
      display: flex;

      >.el-table {
        min-width: 240px;
      }
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
