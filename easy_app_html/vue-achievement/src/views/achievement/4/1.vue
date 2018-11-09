<template>
  <div class="chart-4-1">
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
          <el-select v-model="form.classId" placeholder="请选择班级" style="width: 160px;" @change="">
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
        <el-table
          :data="table"
          border>
         <el-table-column
          label=""
          label-class-name="table-class"
          width="110"
          fixed>
          <template scope="scope">
            <span v-if="scope.$index === 0">
              上线人数
            </span>
            <span v-if="scope.$index === 2">
              临界人数
            </span>
          </template>
        </el-table-column>
          <el-table-column
            prop="className"
            fixed
            min-width="80px"
            show-overflow-tooltip
            v-if="!loading">
            <template scope="scope">
              {{ scope.row.className }}
            </template>
          </el-table-column>
          <el-table-column
            :label="'一档(优秀' + baseData.gradeOneScore + '以上)'"
            align="center">
            <el-table-column
              label="人数"
              min-width="60">
              <template scope="scope">
               <span @click="showStudent(scope.row, 1)" v-if="(scope.row.one) > 0" style="color: #51B5EE;cursor:pointer;">
                  {{ scope.row.one}}
               </span>
               <span v-else>
                  {{ scope.row.one}}
               </span>
              </template>
            </el-table-column>
            <el-table-column
              label="占年级比例"
              min-width="120">
              <template scope="scope">
                {{ (scope.row.oneProportion * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'二档(良好' + baseData.gradeOneScore + '-' + baseData.gradeTwoScore + ')'"
            align="center">
            <el-table-column
              label="人数"
              min-width="60">
               <template scope="scope">
                  <span @click="showStudent(scope.row, 2)" v-if="(scope.row.two) > 0" style="color: #51B5EE;cursor:pointer;">
                      {{ scope.row.two}}
                  </span>
                  <span v-else>
                      {{ scope.row.two}}
                  </span>
               </template>
            </el-table-column>
            <el-table-column
              label="占年级比例"
              min-width="120">
              <template scope="scope">
                {{ (scope.row.twoProportion * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="'三档(合格' + baseData.gradeTwoScore + '-' + baseData.gradeThreeScore + ')'"
            align="center">
            <el-table-column
              label="人数"
               min-width="60">
               <template scope="scope">
                  <span @click="showStudent(scope.row, 3)" v-if="(scope.row.three) > 0" style="color: #51B5EE;cursor:pointer;">
                      {{ scope.row.three}}
                  </span>
                  <span v-else>
                      {{ scope.row.three}}
                  </span>
               </template>
            </el-table-column>
            <el-table-column
              label="占年级比例"
              min-width="120">
              <template scope="scope">
                {{ (scope.row.threeProportion * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
    </div>
    <el-dialog title="学生列表" :visible.sync="dialog">
      <el-table :data="studentData" border max-height="300">
        <el-table-column property="examNo" label="考号" v-if="needExamNo"></el-table-column>
        <el-table-column property="name" label="姓名"></el-table-column>
        <el-table-column property="score" label="成绩">
          <template scope="scope">
            {{ scope.row.score.toFixed(1) }}
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
      dialog: false,
      studentData: [],
      examList: [],
      schoolList: [],
      gradeList: [],
      classList: [],
      state: false,
      form: {
        examId: '',
        schoolId: '',
        classId: ''
      },
      baseData: {},
      loading: false,
      table: [],
      needExamNo: ''
    }
  },

  methods: {

    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisClass/classOnLinePeopleNumDistributionExport?` +
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

    async showStudent (row, grade) {
      let type
      let showType
      this.dialog = true
      this.studentData = []
      if (row.type === '上线人数') type = 1
      else type = 2
      if (row.className === '全校年级') showType = 2
      else showType = 1
      const { data: student } = await this.$https.get(`/analysisClass/classOnLinePeopleNumDistributionDetailedQuery` +
                                `?grade=${grade}` +
                                `&examId=${this.form.examId}` +
                                `&schoolId=${this.form.schoolId}` +
                                `&type=${type}` +
                                `&classId=${this.form.classId}` +
                                `&showType=${showType}`)
      if (student.code === 1) {
        this.studentData = [...student.result]
        this.needExamNo = this.studentData.every(item => item.examNo)
      }
    },

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    async getData () {
      this.loading = true
      const { data: subject } = await this.$https.get(`/analysisClass/classOnLinePeopleNumDistributionQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}` +
                                      `&classId=${this.form.classId}`)
      if (subject.code !== 1) notice(this, subject.message, 2000)
      else {
        let className = this.classList.find(item => item.id === this.form.classId).name
        this.table[0] = {
          type: '上线人数',
          className,
          one: subject.result.classGradeOne,
          oneProportion: subject.result.classGradeRatioOne,
          two: subject.result.classGradeTwo,
          twoProportion: subject.result.classGradeRatioTwo,
          three: subject.result.classGradeThree,
          threeProportion: subject.result.classGradeRatioThree
        }
        this.table[1] = {
          type: '上线人数',
          className: '全校年级',
          one: subject.result.schoolGradeOne,
          oneProportion: subject.result.schoolGradeRatioOne,
          two: subject.result.schoolGradeTwo,
          twoProportion: subject.result.schoolGradeRatioTwo,
          three: subject.result.schoolGradeThree,
          threeProportion: subject.result.schoolGradeRatioThree
        }
        this.table[2] = {
          type: '临界人数',
          className,
          one: subject.result.classLowerOne,
          oneProportion: subject.result.classLowerRatioOne,
          two: subject.result.classLowerTwo,
          twoProportion: subject.result.classLowerRatioTwo,
          three: subject.result.classLowerThree,
          threeProportion: subject.result.classLowerRatioThree
        }
        this.table[3] = {
          type: '临界人数',
          className: '全校年级',
          one: subject.result.schoolLowerOne,
          oneProportion: subject.result.schoolLowerRatioOne,
          two: subject.result.schoolLowerTwo,
          twoProportion: subject.result.schoolLowerRatioTwo,
          three: subject.result.schoolLowerThree,
          threeProportion: subject.result.schoolLowerRatioThree
        }
        if (subject.result.achievementRankRule) {
          this.baseData = {
            gradeOneScore: subject.result.achievementRankRule.gradeOne,
            gradeTwoScore: subject.result.achievementRankRule.gradeTwo,
            gradeThreeScore: subject.result.achievementRankRule.gradeThree
          }
        } else {
          this.baseData = {
            gradeOneScore: 0,
            gradeTwoScore: 0,
            gradeThreeScore: 0
          }
        }
      }
      this.loading = false
    },

    async getSchool () {
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      const { data } = await this.$https.get(`/common/achievementSchoolList?examId=${this.form.examId}`)
      if (data.code === 1) {
        this.schoolList = [...data.result || []]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
        this.baseData = {
          gradeOneScore: 0,
          gradeTwoScore: 0,
          gradeThreeScore: 0
        }
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
      // await this.getSchool()
      // await this.getClass()
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
.chart-4-1 {
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
      tbody{
        >tr:first-child,tr:nth-child(3){
          >td:first-child{
            border-bottom: 0;
            span{
              position: absolute;
              background: #fff;
              z-index: 1001;
              top: 0;
              left: 0;
              right: 0;
              bottom: -40px;
              padding: 30px 20px;
            }
            :hover{
              background: #fff;  
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
