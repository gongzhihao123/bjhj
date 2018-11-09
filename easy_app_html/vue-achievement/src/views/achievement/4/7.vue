<template>
  <div class="chart-4-7">
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
          <el-select v-model="form.classId" placeholder="请选择班级" style="width: 160px;" @change="getcourseList">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学科"
          prop="courseId"
          ref="subject"
          :rules="[
            { required: true, message: '请选择学科', trigger: 'change' }
          ]">
          <el-select v-model="form.courseId" placeholder="请选择学科" style="width: 160px;">
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

    <div class="content" v-loading="loading">
      <div class="title">
        <strong>{{schoolName}}{{className}}{{courseName}}诊断意见及教学建议</strong>
      </div>
      <p class="table-title">1.0&nbsp;&nbsp;
        <strong>{{className}}{{courseName}}</strong>
         学科的平均分
         <strong>{{
          baseData.schoolScoreDto ? baseData.schoolScoreDto.courseAvg : 0
        }}</strong>
        平均得分率为 
        <strong>{{
          ((baseData.schoolScoreDto ? baseData.schoolScoreDto.courseAvgRate : 0) * 100).toFixed(2) + '%'
        }}</strong>
        处于
        <strong>{{
          baseData.schoolScoreDto ? baseData.schoolScoreDto.sortReason : '平均'
        }}</strong>
        水平。
        学科成绩优良等级的分部情况如下
      </p>
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="name"
            min-width="80px"
            label="优良等级"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="one"
            min-width="80"
            label="优秀"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="two"
            min-width="80"
            label="良好"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="three"
            min-width="80"
            label="合格"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="four"
            min-width="80"
            label="不合格"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>

      <p class="table-title">2.0&nbsp;&nbsp;
        从本班学科成绩的分布看，最高分为
        <strong>
          {{baseData.tableTwoList? baseData.tableTwoList[0].maxScore : 0}}
        </strong>
        最低分为
        <strong>
          {{baseData.tableTwoList? baseData.tableTwoList[0].minScore : 0}}
        </strong>
        极差率为
        <strong>
          {{baseData.tableTwoList? baseData.tableTwoList[0].rangeRatio : 0}}
        </strong>
        按成绩序列将全区学生按人数均分为5组，本班学生分布在各组中的人数如下表所示。从中可以看到，本班学生的考试成绩分布在
        <strong>{{ levelList[levelInd] }}</strong>相对比较集中。
      </p>
        <el-table
          :data="tableTwoList"
          border>
          <el-table-column
            prop="name"
            min-width="80px"
            label="优良等级"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="one"
            min-width="80"
            label="第一组（高端组）"
            show-overflow-tooltip>
            <template scope="scope">
              {{ (scope.row.one % 1 > 0) ? ((scope.row.one * 100).toFixed(2) + '%') : scope.row.one }}
            </template>
          </el-table-column>
          <el-table-column
            prop="two"
            min-width="80"
            label="第二组"
            show-overflow-tooltip>
            <template scope="scope">
              {{ (scope.row.two % 1 > 0) ? ((scope.row.two * 100).toFixed(2) + '%') : scope.row.two }}
            </template>
          </el-table-column>
          <el-table-column
            prop="three"
            min-width="80"
            label="第三组"
            show-overflow-tooltip>
            <template scope="scope">
              {{ (scope.row.three % 1 > 0) ? ((scope.row.three * 100).toFixed(2) + '%') : scope.row.three }}
            </template>
          </el-table-column>
          <el-table-column
            prop="four"
            min-width="80"
            label="第四组"
            show-overflow-tooltip>
            <template scope="scope">
              {{ (scope.row.four % 1 > 0) ? ((scope.row.four * 100).toFixed(2) + '%') : scope.row.four }}
            </template>
          </el-table-column>
          <el-table-column
            prop="five"
            min-width="80"
            label="第五组（低端组）"
            show-overflow-tooltip>
            <template scope="scope">
              {{ (scope.row.five % 1 > 0) ? ((scope.row.five * 100).toFixed(2) + '%') : scope.row.five }}
            </template>
          </el-table-column>
        </el-table>

        <p class="table-title">3.0&nbsp;&nbsp;
          学科知识结构组块的表现：
        </p>
        <p class="table-title">3.1&nbsp;&nbsp;
          就学科各个组块的平均水平而言，表现较好的知识组块有
          <strong>
            {{ baseData.goodknowlageAvg
                ? baseData.goodknowlageAvg.map(item => item.name).join(',')
                : ''
            }}
          </strong>，
          其学业水平能级分别为
          <strong>
            {{ baseData.goodknowlageAvg
                ? baseData.goodknowlageAvg.map(item => item.levelPower).join(',')
                : ''
            }}
          </strong>，
          平均得分率分别为
          <strong>
            {{ baseData.goodknowlageAvg
                ? baseData.goodknowlageAvg.map(item => {
                  return ((item.avgRate || 0) * 100).toFixed(2) + '%' 
                }).join(',')
                : ''
            }}
          </strong>;
          表现较弱的知识组块有
          <strong>
            {{ baseData.badknowlageAvg
                ? baseData.badknowlageAvg.map(item => item.name).join(',')
                : ''
            }}
          </strong>，
          其学业水平能级分别为
          <strong>
            {{ baseData.badknowlageAvg
                ? baseData.badknowlageAvg.map(item => item.levelPower).join(',')
                : ''
            }}
          </strong>
          平均得分率分别为
          <strong>
            {{ baseData.badknowlageAvg
                ? baseData.badknowlageAvg.map(item => {
                  return ((item.avgRate || 0) * 100).toFixed(2) + '%'
                }).join(',')
                : ''
            }}
          </strong>;
        </p>
        <p class="table-title">3.2&nbsp;&nbsp;
          就学科各个知识组块平均水平相对于自身学科的平均水平比较而言，有的组块表现来的更好，体现班级学科教学的相对优势；
          有的组块表现来的差一些，体现班级学科教学的相对弱点。
          表现比较突出的知识组模块，如下表所示：
        </p>
        <el-table
        :data="knowledgeData"
        border
        class="head-data">
        <el-table-column
          label=""
          label-class-name="table-class"
          width="110">
          <template scope="scope">
            <span v-if="scope.$index === 0">
              表现较好的模块
            </span>
            <span v-if="scope.$index === 2">
              变现欠缺的模块
            </span>
          </template>
        </el-table-column>
        <el-table-column 
        label="知识组块"
        prop="name"></el-table-column>
        <el-table-column
        label="班级组块均分与班级学科均分之差（组块差值）"
        prop="threeScore"
        min-width="260"></el-table-column>
        <el-table-column
        label="班级组块差值与全区组块差值之间的差"
        prop="fourScore"
        min-width="260"></el-table-column>
      </el-table>


        <p class="table-title">4.0&nbsp;&nbsp;
          学科能力结构组块的表现：
        </p>

        <p class="table-title">4.1&nbsp;&nbsp;
          针对本学校学科标签的一般水平而言，表现更为较好的能力组块有
          <strong>
            {{ baseData.selectGoodPower
                ? baseData.selectGoodPower.map(item => item.name).join(',')
                : ''
            }}
          </strong>，
          其学业水平能级分别为
          <strong>
            {{ baseData.selectGoodPower
                ? baseData.selectGoodPower.map(item => item.levelPower).join(',')
                : ''
            }}
          </strong>，
          平均得分率分别为
          <strong>
            {{ baseData.selectGoodPower
                ? baseData.selectGoodPower.map(item => {
                  return ((item.avgRate || 0) * 100).toFixed(2) + '%'
                }).join(',')
                : ''
            }}
          </strong>;
          表现较弱的能力组块有
          <strong>
            {{ baseData.selectBadPower
                ? baseData.selectBadPower.map(item => item.name).join(',')
                : ''
            }}
          </strong>，
          其学业水平能级分别为
          <strong>
            {{ baseData.selectBadPower
                ? baseData.selectBadPower.map(item => item.levelPower).join(',')
                : ''
            }}
          </strong>
          平均得分率分别为
          <strong>
            {{ baseData.selectBadPower
                ? baseData.selectBadPower.map(item => {
                  return ((item.avgRate || 0) * 100).toFixed(2) + '%'
                }).join(',')
                : ''
            }}
          </strong>;
        </p>
        <p class="table-title">4.2&nbsp;&nbsp;
          就学科各个能力组块平均水平相对于自身学科的平均水平比较而言，表现比较突出的能力组块情况，如下表所示：
        </p>
        <el-table
        :data="selectData"
        border
        class="head-data">
        <el-table-column
          label=""
          label-class-name="table-class"
          width="110">
          <template scope="scope">
            <span v-if="scope.$index === 0">
              表现较好的模块
            </span>
            <span v-if="scope.$index === 2">
              变现欠缺的模块
            </span>
          </template>
        </el-table-column>
        <el-table-column 
        label="认知组块"
        prop="name"></el-table-column>
        <el-table-column
        label="班级组块均分与班级学科均分之差（组块差值）"
        prop="threeScore"
        min-width="260"></el-table-column>
        <el-table-column
        label="班级组块差值与全区组块差值之间的差"
        prop="fourScore"
        min-width="260"></el-table-column>
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
      schoolList: [],
      classList: [],
      courseList: [],
      state: false,
      subject: [],
      form: {
        examId: '',
        schoolId: '',
        classId: '',
        courseId: ''
      },
      levelList: ['高端', '中上端', '中端', '中下端', '低端'],
      levelInd: 0,
      baseData: {},
      loading: false,
      table: [],
      tableTwoList: [],
      knowledgeData: [],
      selectData: []
    }
  },

  computed: {
    // schoolName () {
    //   return this.schoolList.find(item => item.schoolId === this.form.schoolId)
    //           ? this.schoolList.find(item => item.schoolId === this.form.schoolId).schoolName : ''
    // },

    // className () {
    //   return this.classList.find(item => item.id === this.form.classId)
    //           ? this.classList.find(item => item.id === this.form.classId).name : ''
    // },

    // courseName () {
    //   return this.courseList.find(item => item.courseId === this.form.courseId)
    //           ? this.courseList.find(item => item.courseId === this.form.courseId).courseName : ''
    // }
  },

  methods: {

    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/analysisClass/classExamDiagnosisAnalysisKeyPointExport?` +
                                  `examId=${this.form.examId}` +
                                  `&schoolId=${this.form.schoolId}` +
                                  `&schoolName=${this.schoolList.filter(item => item.schoolId === this.form.schoolId)[0].schoolName}` +
                                  `&classId=${this.form.classId}` +
                                  `&className=${this.classList.filter(item => item.id === this.form.classId)[0].name}` +
                                  `&courseId=${this.form.courseId}` +
                                  `&courseName=${this.courseList.filter(item => item.courseId === this.form.courseId)[0].courseName}`
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

    async getData () {
      this.loading = true
      this.schoolName = this.schoolList.find(item => item.schoolId === this.form.schoolId)
              ? this.schoolList.find(item => item.schoolId === this.form.schoolId).schoolName : ''

      this.className = this.classList.find(item => item.id === this.form.classId)
                ? this.classList.find(item => item.id === this.form.classId).name : ''

      this.courseName = this.courseList.find(item => item.courseId === this.form.courseId)
              ? this.courseList.find(item => item.courseId === this.form.courseId).courseName : ''
      const { data } = await this.$https.get(`/analysisClass/classExamDiagnosisAnalysisKeyPointQuery`, {
        params: { ...this.form }
      })
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.baseData = { ...data.result }
        this.$set(this.table, [0], {
          name: '班级人数',
          one: data.result.gradeOneCount || 0,
          two: data.result.gradeTwoCount || 0,
          three: data.result.gradeThreeCount || 0,
          four: data.result.gradeFourCount || 0
        })
        this.$set(this.table, [1], {
          name: '学校比率',
          one: ((data.result.gradeOneSchoolRate || 0) * 100).toFixed(2) + '%',
          two: ((data.result.gradeTwoSchoolRate || 0) * 100).toFixed(2) + '%',
          three: ((data.result.gradeThreeSchoolRate || 0) * 100).toFixed(2) + '%',
          four: ((data.result.gradeFourSchoolRate || 0) * 100).toFixed(2) + '%'
        })
        this.$set(this.table, [2], {
          name: '全区比率',
          one: ((data.result.gradeOneAreaRate || 0) * 100).toFixed(2) + '%',
          two: ((data.result.gradeTwoAreaRate || 0) * 100).toFixed(2) + '%',
          three: (((data.result.gradeThreeAreaRate || 0)) * 100).toFixed(2) + '%',
          four: ((data.result.gradeFourAreaRate || 0) * 100).toFixed(2) + '%'
        })
        let max = 0
        data.result.tableTwoList = (data.result.tableTwoList || [])
        data.result.tableTwoList.forEach((item, i) => {
          if (max < item.studentCount) {
            max = item.studentCount
            this.levelInd = i
          }
        })
        this.$set(this.tableTwoList, 0, {
          name: '班级人数',
          one: (data.result.tableTwoList && data.result.tableTwoList[0]) ? data.result.tableTwoList[0].studentCount : 0,
          two: (data.result.tableTwoList && data.result.tableTwoList[1]) ? data.result.tableTwoList[1].studentCount : 0,
          three: (data.result.tableTwoList && data.result.tableTwoList[2]) ? data.result.tableTwoList[2].studentCount : 0,
          four: (data.result.tableTwoList && data.result.tableTwoList[3]) ? data.result.tableTwoList[3].studentCount : 0,
          five: (data.result.tableTwoList && data.result.tableTwoList[4]) ? data.result.tableTwoList[4].studentCount : 0
        })
        this.$set(this.tableTwoList, 1, {
          name: '学校比率',
          one: (data.result.tableTwoList && data.result.tableTwoList[0]) ? data.result.tableTwoList[0].studentCountRate : 0,
          two: (data.result.tableTwoList && data.result.tableTwoList[1]) ? data.result.tableTwoList[1].studentCountRate : 0,
          three: (data.result.tableTwoList && data.result.tableTwoList[2]) ? data.result.tableTwoList[2].studentCountRate : 0,
          four: (data.result.tableTwoList && data.result.tableTwoList[3]) ? data.result.tableTwoList[3].studentCountRate : 0,
          five: (data.result.tableTwoList && data.result.tableTwoList[4]) ? data.result.tableTwoList[4].studentCountRate : 0
        })
        this.$set(this.tableTwoList, 2, {
          name: '全区比率',
          one: (data.result.tableTwoList && data.result.tableTwoList[0]) ? data.result.tableTwoList[0].studentAreaCountRate : 0,
          two: (data.result.tableTwoList && data.result.tableTwoList[1]) ? data.result.tableTwoList[1].studentAreaCountRate : 0,
          three: (data.result.tableTwoList && data.result.tableTwoList[2]) ? data.result.tableTwoList[2].studentAreaCountRate : 0,
          four: (data.result.tableTwoList && data.result.tableTwoList[3]) ? data.result.tableTwoList[3].studentAreaCountRate : 0,
          five: (data.result.tableTwoList && data.result.tableTwoList[4]) ? data.result.tableTwoList[4].studentAreaCountRate : 0
        })

        this.knowledgeData = [ ...data.result.goodknowlageAvg || [], ...data.result.badknowlageAvg || [] ]

        this.selectData = [ ...data.result.selectGoodPower || [], ...data.result.selectBadPower || [] ]
      }
      this.loading = false
    },

    async getSchool () {
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      this.$refs.subject.resetField()
      const { data } = await this.$https.get(`/common/achievementSchoolList?examId=${this.form.examId}`)
      if (data.code === 1) {
        this.schoolList = [...data.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
        // this.getcourseList()
      }
    },

    async getClass (e) {
      this.$refs.classes.resetField()
      this.$refs.subject.resetField()
      const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
      const { data } = await this.$https.get(`/common/gradeClassList` +
                              `?semesterId=${nowList.semesterId}` +
                              `&sectionId=${nowList.sectionId}` +
                              `&gradeId=${nowList.gradeId}` +
                              `&schoolId=${this.form.schoolId}`)
      if (data.code === 1) {
        this.classList = (data.result || []).map(item => ({ name: `${item.gradeName}${item.className}`, id: item.id }))
        this.form.classId = this.classList.length === 0 ? '' : this.classList[0].id
      }
    },

    async getcourseList () {
      // 学期
      this.$refs.subject.resetField()
      const scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        return
      }
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.form.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result || []]
        this.form.courseId = this.courseList.length === 0 ? '' : this.courseList[0].courseId
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

<style lang="scss">
@import '../../../assets/scss/variable.scss';

strong {
  font-weight: bold;
}
.chart-4-7 {
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

    >.title {
      text-align: center;
      font-size: 18px;
    } 

    >.table-title {
      margin: 20px 0;
    }

    >.el-table.head-data {
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
