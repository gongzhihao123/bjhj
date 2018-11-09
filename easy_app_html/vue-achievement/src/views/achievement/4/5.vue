<template>
  <div class="chart-4-5">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 160px;" @change="getSchool">
            <el-option
              v-for="item in examList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学校"
          ref="school"
          prop="schoolId"
          :rules="[
            { required: true, type: 'number', message: '请选择学校', trigger: 'change' }
          ]">
          <el-select v-model="form.schoolId" placeholder="请选择学校" style="width: 160px;" @change="getClass">
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="班级"
          ref="classes"
          prop="classId"
          :rules="[
            { required: true, type: 'number', message: '请选择班级', trigger: 'change' }
          ]">
          <el-select v-model="form.classId" placeholder="请选择班级" style="width: 160px;">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">查询</el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="content" v-loading="loading">

      <!-- 一档 -->
      <div class="oneGrade table">
        <div class="left head">
          <span class="bg"></span>
          <div>
            <p>一档({{ baseData.gradeOne }}以上)</p>
            <p>临界线{{ baseData.lowerScore }}-{{baseData.upperScore}}</p>
          </div>
        </div>
        <el-table
          :data="table">
          <el-table-column
            prop="studentName"
            show-overflow-tooltip
            fixed>
          </el-table-column>
          <el-table-column
            prop="allScore"
            label="总分"
            >
            <template scope="scope">
              {{ scope.row.allScore ? scope.row.allScore.toFixed(1) : 0 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subjectList"
            :label="list.courseName"
            :key="list.courseId">
            <template scope="scope">
              {{ scope.row.listObjectScore[index] ? (scope.row.listObjectScore[index].courseScore ? scope.row.listObjectScore[index].courseScore.toFixed(1) : '') : 0 }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 二档 -->
      <div class="twoGrade table">
        <div class="left">
          <div>
            <p>二档({{baseData.gradeOne}}-{{ baseData.gradeTwo }})</p>
            <p>临界线{{ baseData.lowerScoreTwo }}-{{baseData.upperScoreTwo}}</p>
          </div>
        </div>
        <el-table
          :data="twTable"
          :show-header="false">
          <el-table-column
            prop="studentName"
            show-overflow-tooltip
            fixed>
          </el-table-column>
          <el-table-column
            prop="allScore"
            label="总分"
            >
            <template scope="scope">
              {{ scope.row.allScore ? scope.row.allScore.toFixed(1) : 0 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subjectList"
            :label="list.courseName"
            :key="list.courseId">
            <template scope="scope">
              {{ scope.row.listObjectScore[index] ? (scope.row.listObjectScore[index].courseScore ? scope.row.listObjectScore[index].courseScore.toFixed(1) : '') : 0 }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 三档 -->
      <div class="threeGrade table">
        <div class="left">
          <div>
            <p>三档({{ baseData.gradeTwo }}-{{ baseData.gradeThree }})</p>
            <p>临界线{{ baseData.lowerScoreThree }}-{{baseData.upperScoreThree}}</p>
          </div>
        </div>
        <el-table
          :data="trTable"
          :show-header="false">
          <el-table-column
            prop="studentName"
            show-overflow-tooltip
            fixed>
          </el-table-column>
          <el-table-column
            prop="allScore"
            label="总分">
            <template scope="scope">
              {{ scope.row.allScore ? scope.row.allScore.toFixed(1) : 0 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subjectList"
            :label="list.courseName"
            :key="list.courseId">
            <template scope="scope">
              {{ scope.row.listObjectScore[index] ? (scope.row.listObjectScore[index].courseScore ? scope.row.listObjectScore[index].courseScore.toFixed(1) : '') : 0 }}
            </template>
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
      schoolList: [],
      classList: [],
      courseList: [],
      state: false,
      subjectList: [],
      form: {
        examId: '',
        schoolId: '',
        classId: ''
      },
      baseData: {},
      loading: false,
      table: [],
      twTable: [],
      trTable: []
    }
  },

  methods: {

    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisClass/classKeyGroupsAnalysisExport?` +
                                  `examId=${this.form.examId}` +
                                  `&schoolId=${this.form.schoolId}` +
                                  `&schoolName=${this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName}` +
                                  `&classId=${this.form.classId}` +
                                  `&className=${this.classList.filter(item => item.id === this.form.classId)[0].name}`
        } else {
          console.log('error submit!!')
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
    filterSub (arr) {
      let obj = [ ...this.subjectList ].map(item => ({...item, courseScore: ''}))
      obj.forEach(item => {
        arr.forEach(items => {
          if (items.courseName === item.courseName) {
            item.courseScore = items.courseScore
          }
        })
      })
      return obj
    },
    async getData () {
      this.loading = true
      const { data } = await this.$https.get(`/analysisClass/classKeyGroupsAnalysisQuery`, {
        params: { ...this.form }
      })
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        // if (data.result.threeGradeCount.length === 0 || data.result.oneGradeCount.length === 0 || data.result.twoGradeCount.length === 0) {
        //   this.loading = false
        //   return
        // }
        this.subjectList = (data.result.courseList || []).filter(item => item)
        this.baseData = { ...data.result.achievementRankRule }
        this.table = [ ...data.result.oneGradeCount ].map(item => ({
          ...item,
          listObjectScore: this.filterSub(item.listObjectScore)
        }))
        this.twTable = [ ...data.result.twoGradeCount ].map(item => ({
          ...item,
          listObjectScore: this.filterSub(item.listObjectScore)
        }))
        this.trTable = [ ...data.result.threeGradeCount ].map(item => ({
          ...item,
          listObjectScore: this.filterSub(item.listObjectScore)
        }))
        // console.log(this.table)
        // this.trTable.push({
        //   studentName: '临界生平均分',
        //   allScore: (~~data.result.threeGradeCount.reduce((pre, next) => pre.allScore + next.allScore)) / data.result.threeGradeCount.length,
        //   listObjectScore: this.subjectList.map((item, n) => {
        //     let scope = []
        //     data.result.threeGradeCount.forEach(m => {
        //       scope.push(m.listObjectScore[n].courseScore || 0)
        //     })
        //     return { courseName: item, courseScore: scope.reduce((pre, next) => (pre + next) / data.result.threeGradeCount.length) }
        //   })
        // })
        // this.table.push({
        //   studentName: '临界生平均分',
        //   allScore: (~~data.result.oneGradeCount.reduce((pre, next) => pre.allScore + next.allScore)) / data.result.oneGradeCount.length,
        //   listObjectScore: this.subjectList.map((item, n) => {
        //     let scope = []
        //     data.result.oneGradeCount.forEach(m => {
        //       scope.push(m.listObjectScore[n].courseScore || 0)
        //     })
        //     return { courseName: item, courseScore: scope.reduce((pre, next) => (pre + next) / data.result.oneGradeCount.length) || 0 }
        //   })
        // })
        // this.twTable.push({
        //   studentName: '临界生平均分',
        //   allScore: (~~data.result.twoGradeCount.reduce((pre, next) => pre.allScore + next.allScore)) / data.result.twoGradeCount.length,
        //   listObjectScore: this.subjectList.map((item, n) => {
        //     let scope = []
        //     data.result.twoGradeCount.forEach(m => {
        //       scope.push(m.listObjectScore[n].courseScore || 0)
        //     })
        //     return { courseName: item, courseScore: scope.reduce((pre, next) => (pre + next) / data.result.twoGradeCount.length) || 0 }
        //   })
        // })
      }
      this.loading = false
    },

    async getSchool () {
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      const { data } = await this.$https.get(`/common/achievementSchoolList?examId=${this.form.examId}`)
      if (data.code === 1) {
        this.schoolList = [...data.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      }
    },

    async getClass (e) {
      const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
      const { data } = await this.$https.get(`/common/gradeClassList` +
                              `?semesterId=${nowList.semesterId}` +
                              `&sectionId=${nowList.sectionId}` +
                              `&gradeId=${nowList.gradeId}` +
                              `&schoolId=${this.form.schoolId}`)
      if (data.code === 1) {
        this.classList = data.result.map(item => ({ name: `${item.gradeName}${item.className}`, id: item.id }))
        this.form.classId = this.classList.length === 0 ? '' : this.classList[0].id
      }
      if (this.state === false) {
        this.state = true
        this.getData()
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
      // this.getcourseList()
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

.chart-4-5 {
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

    >.table {
      display: flex;

      >.left {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        text-align: center;

        &.head {
          padding-top: 40px;
        }

        >.bg {
          position: absolute;
          top: 0;
          width: 100%;
          height: 40px;
          background: #eef1f6;
          border-bottom: 1px solid #dfe6ec;
        }
      }
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
