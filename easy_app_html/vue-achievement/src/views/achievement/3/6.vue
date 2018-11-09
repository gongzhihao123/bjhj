<template>
  <div class="chart-3-6">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 300px;" @change="getschoolList">
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
          prop="schoolId"
          :rules="[
            { required: true, type: 'number', message: '请选择学校', trigger: 'change' }
          ]">
          <el-select v-model="form.schoolId" placeholder="请选择学校" style="width: 300px;">
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">查询</el-button>
        </el-form-item>

      </el-form>                                                       
    </div>

    <div class="content" v-loading="loading">
        <table>
          <tr>
            <th colspan="2"></th>
            <th>总分</th>
            <th v-for="item in courseList">{{item.courseName}}</th>
          </tr>
          <!--一档-->
          <tr>
            <!--标题-->
            <td>
              <span>一档({{table.gradeOneScore}}以上)</span>
              <span>临界线({{table.gradeOneLowerScore}} - {{table.gradeOneUpperScore}})</span>
            </td>
            <!--临界-->
            <td>
              <ul>
                <li>临界生平均分</li>
                <li v-for="stu in OneStudent">{{stu.studentName}}</li>
              </ul>
            </td>
            <!--总分-->
            <td>
              <ul>
                <li>{{(oneall === 'NaN' || !oneall) ? '' : oneall.toFixed(1)}}</li>
                <li v-for="stu in OneStudent">{{stu.studentScore?stu.studentScore.toFixed(1):0}}</li>
              </ul>
            </td>
            <!--各学科-->
            <td v-for="item in courseList">
              <ul>
                <li><span v-if="item.courseId === child.courseId" v-for="(child, n) in table.gradeOneCourseScore" :key="n">{{child.score?child.score.toFixed(1):0}}</span></li>
                <li v-for="stu in OneStudent"><span v-if="scu.courseId === item.courseId" v-for="(scu, i) in stu.courses" :key="i">{{scu.score?scu.score.toFixed(1):0}}</span></li>
              </ul>
            </td>
          </tr>
          <!--二挡-->
          <tr>
            <!--标题-->
            <td>
              <span>二档({{table.gradeOneScore}}-{{table.gradeTwoScore}})</span>
              <span>临界线({{table.gradeTwoLowerScore}} - {{table.gradeTwoUpperScore}})</span>
            </td>
            <!--临界-->
            <td>
              <ul>
                <li>临界生平均分</li>
                <li v-for="stu in TwoStudent">{{stu.studentName}}</li>
              </ul>
            </td>
            <!--总分-->
            <td>
              <ul>
                <li>{{(twoall === 'NaN' || !twoall) ? '' : twoall.toFixed(1)}}</li>
                <li v-for="stu in TwoStudent">{{stu.studentScore?stu.studentScore.toFixed(1):0}}</li>
              </ul>
            </td>
            <!--各学科-->
            <td v-for="item in courseList">
              <ul>
                <li><span v-if="item.courseId === child.courseId" v-for="(child, n) in table.gradeTwoCourseScore" :key="n">{{child.score?child.score.toFixed(1):0}}</span></li>
                <li v-for="stu in TwoStudent"><span v-if="scu.courseId === item.courseId" v-for="(scu, i) in stu.courses" :key="i">{{scu.score?scu.score.toFixed(1):0}}</span></li>
              </ul>
            </td>
          </tr>
          <!--三挡-->
          <tr>
            <!--标题-->
            <td>
              <span>三档({{table.gradeTwoScore}}-{{table.gradeThreeScore}})</span>
              <span>临界线({{table.gradeThreeLowerScore}} - {{table.gradeThreeUpperScore}})</span>
            </td>
            <!--临界-->
            <td>
              <ul>
                <li>临界生平均分</li>
                <li v-for="stu in ThreeStudent">{{stu.studentName}}</li>
              </ul>
            </td>
            <!--总分-->
            <td>
              <ul>
                <li>{{(threeall === 'NaN' || !threeall) ? '' : threeall.toFixed(1)}}</li>
                <li v-for="stu in ThreeStudent">{{stu.studentScore ? stu.studentScore.toFixed(1) : ''}}</li>
              </ul>
            </td>
            <!--各学科-->
            <td v-for="item in courseList">
              <ul>
                <li><span v-if="item.courseId === child.courseId" v-for="(child, n) in table.gradeThreeCourseScore" :key="n">{{child.score ? child.score.toFixed(1) : ''}}</span></li>
                <li v-for="stu in ThreeStudent"><span v-if="scu.courseId === item.courseId" v-for="(scu, i) in stu.courses" :key="i">{{scu.score ? scu.score.toFixed(1) : ''}}</span></li>
              </ul>
            </td>
          </tr>
        </table>      
    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'

export default {
  data () {
    return {
      detailList: [],
      dialogVisible: false,
      form: {
        examId: '',
        schoolId: ''
      },
      examList: [],
      flag: false,
      examId: '',
      schoolList: [],
      schoolId: '',
      schoolName: '',
      courseList: [],
      questionNoList: [],
      OneStudent: [],
      TwoStudent: [],
      ThreeStudent: [],
      oneall: '',
      twoall: '',
      threeall: '',
      type: '',
      groupNum: '',
      queId: '',
      courseId: '',
      knowledgePointList: [],
      knowledgePointId: '',
      loading: false,
      table: {}
    }
  },

  methods: {

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getCourseList()
          this.getData()
        } else {
          return false
        }
      })
    },
    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          // const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
          window.location.href = `${path}/analysisSchool/schoolKeyGroupsAnalysisExport?` +
                                      `examId=${this.form.examId}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&scoreRuleId=${this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId}` +
                                      `&schoolName=${this.schoolName}`
        } else {
          return false
        }
      })
    },

    async getCourseList () {
      // 获取考试科目信息
      const scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        this.courseList = []
        return
      }
      const { data } = await this.$https.get(`/common/courseList` +
                                            `?examId=${this.form.examId}` +
                                            `&scoreRuleId=${scoreRuleId}`)
      this.courseList = data.result || []
    },
    async getData () {
      this.loading = true
      const { data: total } = await this.$https.get(`/analysisSchool/schoolKeyGroupsAnalysisQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}`)
      if (total.code !== 1) notice(this, total.message, 2000)
      else {
        if (total.result) {
          this.table = total.result || []
          this.OneStudent = this.table.studentCourseScore.filter(item => item.gradeLevel === 1)
          this.TwoStudent = this.table.studentCourseScore.filter(item => item.gradeLevel === 2)
          this.ThreeStudent = this.table.studentCourseScore.filter(item => item.gradeLevel === 3)
          this.oneall = this.table.gradeOneCourseScore[this.table.gradeOneCourseScore.length - 1].score
          this.twoall = this.table.gradeTwoCourseScore[this.table.gradeTwoCourseScore.length - 1].score
          this.threeall = this.table.gradeThreeCourseScore[this.table.gradeThreeCourseScore.length - 1].score
        } else {
          this.table = []
          this.OneStudent = []
          this.TwoStudent = []
          this.ThreeStudent = []
          this.oneall = ''
          this.twoall = ''
          this.threeall = ''
        }
      }
      this.loading = false
    },

    async getschoolList () {
      const { data: school } = await this.$https.get(`/common/achievementSchoolList` +
                                      `?examId=${this.form.examId}`)
      if (school.code !== 1) notice(this, school.message, 2000)
      else {
        this.schoolList = [...school.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
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
      await this.getschoolList()
      this.getCourseList()
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
.chart-3-6 {
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

    >p {
      text-align: center;
      margin-top: 20px;
      color: #4C6A86;
    }

    >table {
      width: 92%;
      overflow: auto;
      display: block;
      margin: $width auto;
      tr {
        border: 1px solid #dfe6ec;
        th {
          text-align: center;
          line-height: 30px;
          background: #EEF1F6;
          color: #363D4A;
          border-left: 1px solid #dfe6ec;
          &:nth-child(1) {
            min-width: 260px;
          }
          min-width: 130px;
        }

        td {
          width: 20% !important;
          border: 1px solid  #dfe6ec;
          &:nth-child(1), &:nth-child(2) {
            width: 30% !important;
          }

          span {
            display: block;
            text-align: center;
            line-height: 25px;
            min-width: 130px;
          }

          ul {
            li {
              width: 100%;
              list-style-type: none;
              line-height: 35px;
              border-bottom: 1px solid  #dfe6ec;
              height: 35px;
              color: #363D4A;
              text-align: center;
              &:last-child {
                border-bottom: none;
              }
            }
            .green {
              color: #2B952B;
            }
            .red {
              color: #FF1313;
            }
          }

        }
      }
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
