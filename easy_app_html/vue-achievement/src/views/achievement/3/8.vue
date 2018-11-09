<template>
  <div class="chart-3-8">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 200px;" @change="change">
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
          <el-select v-model="form.schoolId" placeholder="请选择学校" style="width: 200px;">
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学科"
          prop="courseId"
          :rules="[
            { required: true, type: 'string', message: '请选择学科', trigger: 'change' }
          ]">
          <el-select v-model="form.courseId" placeholder="请选择学科" style="width: 200px;">
            <el-option
              v-for="item in courseList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">查询</el-button>
        </el-form-item>

      </el-form>
      
    </div>
    <div class="content three-eight" v-loading="loading">

      <h3 style="text-align: center;margin-bottom: 20px;"> {{ title }} </h3>

      <!-- 表一 -->
      <p v-html="tableOneTitle"> </p>
      <el-table
        :data="tableOne"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="优良等级"
          min-width="150">
          
        </el-table-column>
        <el-table-column
          prop="excellent"
          label="优秀"
          min-width="150">
          <template scope="scope">
            {{ (scope.row.excellent % 1 > 0) ? ((scope.row.excellent * 100).toFixed(2) + '%') : scope.row.excellent }}
          </template>
        </el-table-column>
        <el-table-column
          prop="good"
          min-width="150"
          label="良好">
          <template scope="scope">
            {{ (scope.row.good % 1 > 0) ? ((scope.row.good * 100).toFixed(2) + '%') : scope.row.good }}
          </template>
        </el-table-column>
        <el-table-column
          prop="qualified"
          min-width="150"
          label="合格">
          <template scope="scope">
            {{ (scope.row.qualified % 1 > 0) ? ((scope.row.qualified * 100).toFixed(2) + '%') : scope.row.qualified }}
          </template>
        </el-table-column>
        <el-table-column
          prop="unqualified"
          min-width="150"
          label="不合格">
          <template scope="scope">
            {{ (scope.row.unqualified % 1 > 0) ? ((scope.row.unqualified * 100).toFixed(2) + '%') : scope.row.unqualified }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 表二 -->
      <p> 2.0 从本校学科成绩的分布看，最高分为 <b>{{ tableTwoTitle.maxScore }}</b>，最低分为 <b>{{ tableTwoTitle.minScore }}</b>。按成绩序列将
        全区学生按人数分为5组，本校学生分布在各组中的人数如下表所示，从中可以看到，本校学生的考试成绩分布在 <b>{{ levelList[levelInd] }}</b> 相对比较集中。 </p>
      <el-table
        :data="tableTwo"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="组别"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="one"
          label="第一组（高端组）"
          min-width="150">
          <template scope="scope">
            {{ (scope.row.one % 1 > 0) ? ((scope.row.one * 100).toFixed(2) + '%') : scope.row.one }}
          </template>
        </el-table-column>
        <el-table-column
          prop="two"
          min-width="150"
          label="第二组">
          <template scope="scope">
            {{ (scope.row.two % 1 > 0) ? ((scope.row.two * 100).toFixed(2) + '%') : scope.row.two }}
          </template>
        </el-table-column>
        <el-table-column
          prop="three"
          min-width="150"
          label="第三组">
          <template scope="scope">
            {{ (scope.row.three % 1 > 0) ? ((scope.row.three * 100).toFixed(2) + '%') : scope.row.three }}
          </template>
        </el-table-column>
        <el-table-column
          prop="four"
          min-width="150"
          label="第四组">
          <template scope="scope">
            {{ (scope.row.four % 1 > 0) ? ((scope.row.four * 100).toFixed(2) + '%') : scope.row.four }}
          </template>
        </el-table-column>
        <el-table-column
          prop="five"
          min-width="150"
          label="第五组（低端组）">
          <template scope="scope">
            {{ (scope.row.five % 1 > 0) ? ((scope.row.five * 100).toFixed(2) + '%') : scope.row.five }}
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 表三 -->
      <p>3.0 学科知识结构组块的表现</p>
      <p>3.1 就学科各个组块的平均水平而言，表现较好的知识组块有 <b>{{ knowledgeList[0].groupName }}</b>，其学业水平能级分别为 <b>
        {{ knowledgeList[0].children[0]
                          ? knowledgeList[0].children[0].levelPower
                          : '' }}、
        {{ knowledgeList[0].children[1]
                          ? knowledgeList[0].children[1].levelPower
                          : '' }}
        </b>，平均得分率分别为
        <b>
          {{ knowledgeList[0].children[0]
                    ? (knowledgeList[0].children[0].avgRate
                              ? (knowledgeList[0].children[0].avgRate * 100).toFixed(2) + '%'
                              : '')
                    : '' }}、
          {{ knowledgeList[0].children[1]
                    ? (knowledgeList[0].children[1].avgRate
                              ? (knowledgeList[0].children[1].avgRate * 100).toFixed(2) + '%'
                              : '')
                    :'' }}
        </b>，表现较弱的知识组块有 <b>{{ knowledgeList[1].groupName }}</b>，其学业水平能级为 <b>
          {{ knowledgeList[1].children[0]
                    ? knowledgeList[1].children[0].levelPower
                    : '' }}、
          {{ knowledgeList[1].children[1]
                    ? knowledgeList[1].children[1].levelPower
                    :'' }}
        </b>，平均得分率分别为 <b>
          {{ knowledgeList[1].children[0]
                    ? (knowledgeList[1].children[0].avgRate
                              ? (knowledgeList[1].children[0].avgRate * 100).toFixed(2) + '%'
                              : '')
                    : '' }}、
          {{ knowledgeList[1].children[1]
                    ? (knowledgeList[1].children[1].avgRate
                              ? (knowledgeList[1].children[1].avgRate * 100).toFixed(2) + '%'
                              : '')
                    :'' }}
        </b>。
      </p>
      <p>3.2 就学科各个知识组块平均水平相对于自身学科的平均水平比较而言，有的组块表现来的更好，体现学校学科教学的相对优势，有的组块表现来得差一些，
        体现学校学科教学的相对弱点，表现比较突出的知识组块情况，如下表所示：</p>
      <!-- <el-table
        :data="tableTwo"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="one"
          label="知识组块"
          min-width="150">
          <template scope="scope">
            {{ (scope.row.one % 1 > 0) ? ((scope.row.one * 100).toFixed(2) + '%') : scope.row.one }}
          </template>
        </el-table-column>
        <el-table-column
          prop="two"
          min-width="150"
          label="学校组块平均分与学校学科平均分之差（组块差值）">
          <template scope="scope">
            {{ (scope.row.two % 1 > 0) ? ((scope.row.two * 100).toFixed(2) + '%') : scope.row.two }}
          </template>
        </el-table-column>
        <el-table-column
          prop="three"
          min-width="150"
          label="学校组块差值与全区组块差值之间的差">
          <template scope="scope">
            {{ (scope.row.three % 1 > 0) ? ((scope.row.three * 100).toFixed(2) + '%') : scope.row.three }}
          </template>
        </el-table-column>
      </el-table> -->
      <table class="qhlcp">
        <thead>
          <th v-for="(item, i) in tableHead" :key="i">{{ item }}</th>
        </thead>
        <tbody v-for="(item, i) in knowledgeList" :key="i">
          <tr v-for="(items, ind) in item.children" :key="ind">
            <td :rowspan="item.children.length" v-show="ind == 0">{{ item.name }}</td>
            <td>{{ items.name }}</td>
            <td>{{ items.threeScore }}</td>
            <td>{{ items.fourScore }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 表四 -->
      <p>4.0 学科能力结构组块的表现</p>
      <p>4.1 针对本学校学科表现的一般水平而言，表现更为较好的能力组块有 <b>{{ ability[0].groupName }}</b>，其学业水平能级分别为 <b>
        {{ ability[0].children[0]
                  ? ability[0].children[0].levelPower
                  : '' }}、
        {{ ability[0].children[1]
                  ? ability[0].children[1].levelPower
                  :'' }}
      </b>，平均得分率分别为 <b>
        {{ ability[0].children[0]
                  ? (ability[0].children[0].avgRate
                          ? (ability[0].children[0].avgRate * 100).toFixed(2) + '%'
                          : '')
                  : '' }}、
        {{ ability[0].children[1]
                  ? (ability[0].children[1].avgRate
                          ? (ability[0].children[1].avgRate * 100).toFixed(2) + '%'
                          : '')
                  :'' }}
      </b>；表现较弱的能力组块有 <b>{{ ability[1].groupName }}</b>，其学业水平能级分别为 <b>
        {{ ability[1].children[0]
                  ? ability[1].children[0].levelPower
                  : '' }}、
        {{ ability[1].children[1]
                  ? ability[1].children[1].levelPower
                  :'' }}
      </b>， 平均得分率分别为 <b>
        {{ ability[1].children[0]
                  ? (ability[1].children[0].avgRate
                          ? (ability[1].children[0].avgRate * 100).toFixed(2) + '%'
                          : '')
                  : '' }}、
        {{ ability[1].children[1]
                  ? (ability[1].children[1].avgRate
                          ? (ability[1].children[1].avgRate * 100).toFixed(2) + '%'
                          : '')
                  :'' }}</b>。
      </p>
      <p>4.2 就学科各个能力组块平均水平相对于自身学科的平均水平比较而言，表现比较突出的能力组块情况，如下表所示：</p>
      <!-- <el-table
        :data="tableTwo"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="one"
          label="知识组块"
          min-width="150">
          <template scope="scope">
            {{ (scope.row.one % 1 > 0) ? ((scope.row.one * 100).toFixed(2) + '%') : scope.row.one }}
          </template>
        </el-table-column>
        <el-table-column
          prop="two"
          min-width="150"
          label="学校组块平均分与学校学科平均分之差（组块差值）">
          <template scope="scope">
            {{ (scope.row.two % 1 > 0) ? ((scope.row.two * 100).toFixed(2) + '%') : scope.row.two }}
          </template>
        </el-table-column>
        <el-table-column
          prop="three"
          min-width="150"
          label="学校组块差值与全区组块差值之间的差">
          <template scope="scope">
            {{ (scope.row.three % 1 > 0) ? ((scope.row.three * 100).toFixed(2) + '%') : scope.row.three }}
          </template>
        </el-table-column>
      </el-table> -->
      <table class="qhlcp">
        <thead>
          <th v-for="(item, i) in tableHead" :key="i">{{ item }}</th>
        </thead>
        <tbody v-for="(item, i) in ability" :key="i">
          <tr v-for="(items, ind) in item.children" :key="ind">
            <td :rowspan="item.children.length" v-show="ind == 0">{{ item.name }}</td>
            <td>{{ items.name }}</td>
            <td>{{ items.threeScore }}</td>
            <td>{{ items.fourScore }}</td>
          </tr>
        </tbody>
      </table>
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
      courseList: '',
      loading: false,
      subject: [],
      form: {
        examId: '',
        schoolId: '',
        courseId: ''
      },
      title: '',
      tableOneTitle: '',
      tableOne: [],
      tableTwoTitle: '',
      tableTwo: [],
      tableThreeTitle: '',
      tableThree: [],
      tableFourTitle: '',
      tableFour: [],
      levelList: ['高端', '中上端', '中端', '中下端', '低端'],
      levelInd: 0,
      knowledgeList: [
        { name: '表现较好的组块', children: [], groupName: '' },
        { name: '表现欠缺的组块', children: [], groupName: '' }
      ],
      ability: [
        { name: '表现较好的组块', children: [], groupName: '' },
        { name: '表现欠缺的组块', children: [], groupName: '' }
      ],
      tableHead: [
        '', '知识组块', '学校组块平均分与学校学科平均分之差（组块差值）', '学校组块差值与全区组块差值之间的差'
      ]
    }
  },

  methods: {
    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisSchool/schoolExamDiagnosisAnalysisKeyPointExport?` +
                                      `courseId=${this.form.courseId}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&examId=${this.form.examId}` +
                                      `&schoolName=${this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''}` +
                                      `&courseName=${this.courseList.filter(item => item.courseId === this.form.courseId)[0].courseName}`
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

    change () {
      this.getschoolList()
      this.getcourseList()
    },

    async getData () {
      // this.loading = true
      let schoolName = this.schoolList.filter(item => item.schoolId === this.form.schoolId).length > 0 ? this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName : ''
      let courseName = this.courseList.filter(item => item.courseId === this.form.courseId)[0].courseName
      const { data } = await this.$https.get(`/analysisSchool/schoolExamDiagnosisAnalysisKeyPointQuery` +
                                      `?examId=${this.form.examId}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&subjectId=${this.form.courseId}`)
      if (data.code !== 1 || !data.result) {
        notice(this, data.message, 2000)
        this.knowledgeList = []
        this.ability[0].children = []
        this.ability[1].children = []
        this.tableOne[0].children = []
        this.tableOne[1].children = []
      } else {
        this.title = `${schoolName}${courseName}学科诊断意见及教学建议`
        this.tableOneTitle = `1.0 <b>${schoolName} ${courseName} </b>学科考试平均分为<b>${data.result.schoolScoreDto.courseAvg}</b>，平均得分率为<b>${((data.result.schoolScoreDto.courseAvgRate || 0) * 100).toFixed(2) + '%'}</b>，在全区中，` +
                              `处于<b>${data.result.schoolScoreDto.sortReason}</b>水平，学科成绩优良等级的分布情况如下：`
        this.tableOne = [
          {name: '学校人数', excellent: data.result.gradeOneCount, good: data.result.gradeTwoCount, qualified: data.result.gradeThreeCount, unqualified: data.result.gradeFourCount},
          {name: '学校比率', excellent: data.result.gradeOneSchoolRate, good: data.result.gradeTwoSchoolRate, qualified: data.result.gradeThreeSchoolRate, unqualified: data.result.gradeFourSchoolRate},
          {name: '全区比率', excellent: data.result.gradeOneAreaRate, good: data.result.gradeTwoAreaRate, qualified: data.result.gradeThreeAreaRate, unqualified: data.result.gradeFourAreaRate}
        ]

        this.tableTwoTitle = data.result.tableTwoList[0]
        let max = 0
        data.result.tableTwoList.forEach((item, i) => {
          if (max < item.studentCount) {
            max = item.studentCount
            this.levelInd = i
          }
        })
        this.tableTwo = [
          {name: '学校人数', one: data.result.tableTwoList[0].studentCount, two: data.result.tableTwoList[1].studentCount, three: data.result.tableTwoList[2].studentCount, four: data.result.tableTwoList[3].studentCount, five: data.result.tableTwoList[4].studentCount},
          {name: '学校比率', one: data.result.tableTwoList[0].studentCountRate, two: data.result.tableTwoList[1].studentCountRate, three: data.result.tableTwoList[2].studentCountRate, four: data.result.tableTwoList[3].studentCountRate, five: data.result.tableTwoList[4].studentCountRate},
          {name: '全区比率', one: data.result.tableTwoList[0].studentAreaCountRate, two: data.result.tableTwoList[1].studentAreaCountRate, three: data.result.tableTwoList[2].studentAreaCountRate, four: data.result.tableTwoList[3].studentAreaCountRate, five: data.result.tableTwoList[4].studentAreaCountRate}
        ]

        this.knowledgeList[0].children = [ ...data.result.goodknowlageAvg ] || []
        this.knowledgeList[1].children = [ ...data.result.badknowlageAvg ] || []
        this.knowledgeList[0].groupName = this.knowledgeList[0].children.map(item => item.name).join('、')
        this.knowledgeList[1].groupName = this.knowledgeList[1].children.map(item => item.name).join('、')

        this.ability[0].children = [ ...data.result.selectGoodPower ] || []
        this.ability[1].children = [ ...data.result.selectBadPower ] || []
        this.ability[0].groupName = this.ability[0].children.map(item => item.name).join('、')
        this.ability[1].groupName = this.ability[1].children.map(item => item.name).join('、')

        this.tableThreeTitle = ''
        this.tableThree = data.result.goodknowlageAvg.concat(data.result.badknowlageAvg)

        this.tableFourTitle = ''
        this.tableFour = data.result.selectGoodPower.concat(data.result.selectBadPower)
      }
      this.loading = false
    },

    async getschoolList () {
      // 学校
      const { data: school } = await this.$https.get(`/common/achievementSchoolList` +
                                      `?examId=${this.form.examId}`)
      if (school.code !== 1) notice(this, school.message, 2000)
      else {
        this.schoolList = [...school.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      }
    },

    async getcourseList () {
      // 学科
      const scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.form.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result]
        this.form.courseId = this.courseList.length === 0 ? '' : this.courseList[0].courseId
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
.chart-3-8 {
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

  .three-eight{
    p{
      margin-top: 10px;

    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
