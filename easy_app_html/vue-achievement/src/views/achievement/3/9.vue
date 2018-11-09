<template>
  <div class="chart-3-9">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 250px;" @change="getcourseList">
            <el-option
              v-for="item in examList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学科"
          ref="subject"
          prop="courseId"
          :rules="[
            { required: true, type: 'string', message: '请选择学科', trigger: 'change' }
          ]">
          <el-select v-model="form.courseId" placeholder="请选择学科" style="width: 160px;" @change="getSchool">
            <el-option
              v-for="item in courseList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId">
            </el-option>
          </el-select>
        </el-form-item> 

        <el-form-item 
          label="学校"
          prop="schoolId"
          ref="school"
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
          prop="classId"
          ref="classes"
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
      <!-- 小题 -->
        <h3 class="title">试卷</h3>
        <el-table
          :data="questionDetailList"
          border>
          <el-table-column
            prop="name"
            label="题号"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreAll"
            label="满分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreMin"
            label="最小分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreMax"
            label="最大分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreAvg"
            label="平均分"
            min-width="80">
            <template scope="scope">
              {{ scope.row.scoreAvg.toFixed(1) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="baseDex"
            label="标准差"
            min-width="80">  
          </el-table-column>
          <el-table-column
            prop="dexSize"
            label="差异系数"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="difficult"
            label="难度"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="discrimination"
            label="区分度"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="disscriminationIndex"
            label="鉴别指数"
            min-width="80">
          </el-table-column>
        </el-table>

        <!-- 主客观 -->
        <h3 class="title">主客观题</h3>
        <el-table
          :data="questionModelList"
          border>
          <el-table-column
            prop="name"
            label="结构"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreAll"
            label="满分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreMin"
            label="最小分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreMax"
            label="最大分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreAvg"
            label="平均分"
            min-width="80">
            <template scope="scope">
              {{ scope.row.scoreAvg.toFixed(1) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="baseDex"
            label="标准差"
            min-width="80">  
          </el-table-column>
          <el-table-column
            prop="dexSize"
            label="差异系数"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="difficult"
            label="难度"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="discrimination"
            label="区分度"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="disscriminationIndex"
            label="鉴别指数"
            min-width="80">
          </el-table-column>
        </el-table>

        <!-- 知识点 -->
        <h3 class="title">知识结构</h3>
        <el-table
          :data="knowledgeList"
          border>
          <el-table-column
            prop="name"
            label="结构"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreAll"
            label="满分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreMin"
            label="最小分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreMax"
            label="最大分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreAvg"
            label="平均分"
            min-width="80">
            <template scope="scope">
              {{ scope.row.scoreAvg.toFixed(1) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="baseDex"
            label="标准差"
            min-width="80">  
          </el-table-column>
          <el-table-column
            prop="dexSize"
            label="差异系数"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="difficult"
            label="难度"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="discrimination"
            label="区分度"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="disscriminationIndex"
            label="鉴别指数"
            min-width="80">
          </el-table-column>
        </el-table>

        <!-- 认知结构 -->
        <h3 class="title">认知结构</h3>
        <el-table
          :data="masteryList"
          border>
          <el-table-column
            prop="name"
            label="结构"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreAll"
            label="满分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreMin"
            label="最小分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreMax"
            label="最大分"
             min-width="80">
          </el-table-column>
          <el-table-column
            prop="scoreAvg"
            label="平均分"
            min-width="80">
            <template scope="scope">
              {{ scope.row.scoreAvg.toFixed(1) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="baseDex"
            label="标准差"
            min-width="80">  
          </el-table-column>
          <el-table-column
            prop="dexSize"
            label="差异系数"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="difficult"
            label="难度"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="discrimination"
            label="区分度"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="disscriminationIndex"
            label="鉴别指数"
            min-width="80">
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
      dialog: false,
      examList: [],
      schoolList: [],
      classList: [],
      courseList: [],
      loading: false,
      form: {
        examId: '',
        courseId: '',
        schoolId: '',
        classId: ''
      },
      questionDetailList: [],
      masteryList: [],
      knowledgeList: [],
      questionModelList: []
    }
  },

  methods: {

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
          window.location.href = `${path}/analysisSchool/schoolSubjectQuestionStructAnalysisTargetDetailsExport?` +
                                      `examId=${this.form.examId}` +
                                      `&subjectId=${this.form.courseId}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&classId=${this.form.classId === -1 ? '' : this.form.classId}`
        } else {
          return false
        }
      })
    },

    async getData () {
      this.loading = true
      const { data } = await this.$https.get(`/analysisSchool/schoolSubjectQuestionStructAnalysisTargetDetailsQuery` +
                                      `?examId=${this.form.examId}` +
                                      `&subjectId=${this.form.courseId}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&classId=${this.form.classId === -1 ? '' : this.form.classId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        if (data.result) {
          this.questionDetailList = [ ...data.result.questionDetailList || [] ] // 小题
          this.masteryList = [...data.result.masteryList || []] // 能力
          this.knowledgeList = [...data.result.knowledgeList || []] // 知识点
          this.questionModelList = [ ...data.result.questionModelList || [] ] // 主客观题
        } else {
          this.questionDetailList = [] // 小题
          this.masteryList = [] // 能力
          this.knowledgeList = [] // 知识点
          this.questionModelList = []
        }
      }
      this.loading = false
    },

    async getcourseList () {
      // 学期
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      this.$refs.subject.resetField()
      const scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.form.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result]
        this.form.courseId = (!this.courseList || this.courseList.length === 0) ? '' : this.courseList[0].courseId
      }
    },

    async getSchool () {
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      const { data } = await this.$https.get(`/common/achievementSchoolList?examId=${this.form.examId}`)
      if (data.code === 1) {
        this.schoolList = [...data.result]
        this.form.schoolId = !this.schoolList || this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      }
    },

    async getClass (e) {
      this.$refs.classes.resetField()
      const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
      const { data } = await this.$https.get(`/common/gradeClassList` +
                              `?semesterId=${nowList.semesterId}` +
                              `&sectionId=${nowList.sectionId}` +
                              `&gradeId=${nowList.gradeId}` +
                              `&schoolId=${this.form.schoolId}`)
      if (data.code === 1) {
        this.classList = data.result || []
        if (this.classList.length !== 0) {
          this.classList = data.result.map(item => ({ name: `${item.gradeName}${item.className}`, id: item.id }))
          this.classList.splice(0, 0, {name: '全部', id: -1})
        } else {
          this.classList = []
        }
        this.form.classId = !this.classList || this.classList.length === 0 ? '' : this.classList[0].id
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
      await this.getSchool()
      await this.getClass()
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
.chart-3-9 {
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

}
</style>
