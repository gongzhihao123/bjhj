<template>
  <div class="chart-3-1">
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

      <el-table
        class="three-one"
        :data="table"
        border
        style="width: 100%">
        <el-table-column
          label=""
          label-class-name="table-class"
          width="110">
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
          prop="date"
          label=""
          min-width="150">
          <template scope="scope">
            <span v-if="scope.$index%2 !== 0">全区年级</span>
            <span v-if="scope.$index%2 === 0">{{ schoolName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="stepScore.one">
          <el-table-column
            prop="schoolAboveLineOne"
            label="人数"
            min-width="60">
          </el-table-column>
          <el-table-column
            label="占年级比例"
            min-width="120">
            <template scope="scope">
              {{ scope.row.totalNum === 0 ? 0 : ((scope.row.schoolAboveLineOne / scope.row.totalNum) * 100).toFixed(2) }}%
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="stepScore.two">
          <el-table-column
            prop="schoolAboveLineTwo"
            label="人数"
            min-width="60">
          </el-table-column>
          <el-table-column
            label="占年级比例"
            min-width="120">
            <template scope="scope">
              {{ scope.row.totalNum === 0 ? 0 : ((scope.row.schoolAboveLineTwo / scope.row.totalNum) * 100).toFixed(2) }}%
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="stepScore.three">
          <el-table-column
            prop="schoolAboveLineThree"
            label="人数"
            min-width="60">
          </el-table-column>
          <el-table-column
            prop="name"
            label="占年级比例"
            min-width="120">
            <template scope="scope">
              {{ scope.row.totalNum === 0 ? 0 : ((scope.row.schoolAboveLineThree / scope.row.totalNum) * 100).toFixed(2) }}%
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'
// import { deepClone } from '../../../utils/deepClone'

export default {
  data () {
    return {
      examList: [],
      examId: '',
      schoolList: [],
      schoolId: '',
      schoolName: '',
      loading: false,
      table: [],
      subject: [],
      form: {
        examId: '',
        schoolId: ''
      },
      stepScore: {
        one: '',
        two: '',
        three: ''
      }
    }
  },

  methods: {
    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisSchool/schoolOnLinePeopleNumDistributionExport?` +
                                  `schoolId=${this.form.schoolId}` +
                                  `&examId=${this.form.examId}`
        } else {
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

    async getData () {
      this.table = []
      this.loading = true
      this.schoolName = this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''
      const { data } = await this.$https.get(`/analysisSchool/schoolOnLinePeopleNumDistributionQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}`)
      this.stepScore = {
        one: '一档(优秀' + data.result[0].gradeOneScore + '以上)',
        two: '二档(良好' + data.result[0].gradeOneScore + '-' + data.result[0].gradeTwoScore + ')',
        three: '三档(合格' + data.result[0].gradeTwoScore + '-' + data.result[0].gradeThreeScore + ')'
      }
      data.result.forEach((item, index) => {
        this.table.push(
          {
            totalNum: item.totalNum,
            schoolAboveLineOne: item.schoolAboveLineOne,
            schoolAboveLineTwo: item.schoolAboveLineTwo,
            schoolAboveLineThree: item.schoolAboveLineThree
          }
        )
      })
      data.result.forEach((item, index) => {
        this.table.push(
          {
            totalNum: item.totalNum,
            schoolAboveLineOne: item.schoolCriticalOne,
            schoolAboveLineTwo: item.schoolCriticalTwo,
            schoolAboveLineThree: item.schoolCriticalThree
          }
        )
      })
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
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
      this.schoolName = this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.getData()
        } else {
          return false
        }
      })
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
.chart-3-1 {
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

    >.el-table.three-one {
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
    
    .table-class{
      border-right: 0;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
