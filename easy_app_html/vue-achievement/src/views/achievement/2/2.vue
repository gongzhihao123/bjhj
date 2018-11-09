<template>
  <div class="chart-2-2">
    <el-button type="primary"  @click="exportButton">导出</el-button>
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
      examList: [],
      examId: '',
      courseList: [],
      courseId: '',
      loading: false,
      questionDetailList: [],
      masteryList: [],
      knowledgeList: [],
      questionModelList: []
    }
  },

  methods: {
    exportButton () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      if (!this.courseId) {
        notice(this, '请选择学科', 2000)
        return
      }
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisCourse/subjectQuestionStructAnalysisTargetDetailsExport?` +
                                  `examId=${this.examId}&subjectId=${this.courseId}`
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      if (!this.courseId) {
        notice(this, '请选择学科', 2000)
        return
      }
      this.loading = true
      const { data } = await this.$https.get(`/analysisCourse/subjectQuestionStructAnalysisTargetDetailsQuery` +
                                      `?examId=${this.examId}&subjectId=${this.courseId}`)
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
      const scoreRuleId = this.examList.filter(item => item.id === this.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        return
      }
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result]
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

<style scoped lang="scss">
@import '../../../assets/scss/variable.scss';
.chart-2-2 {
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
