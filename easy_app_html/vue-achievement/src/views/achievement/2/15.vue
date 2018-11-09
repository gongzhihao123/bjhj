<template>
  <div class="chart-2-15">
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

    <div class="content" v-loading="loading">
      <h3>{{title}}</h3>
      <h3>全区{{courseName}}学科诊断意见及教学建议</h3>

      <p>1.0 全区参加本学科本次考试的学生总数为<span>{{Info.areaExamStudentTotalNum}}</span>人。从学生学业成绩的分布特征看，学科成绩最高分为<span>{{Info.areaExamStudentMaxScore}}</span>，最低分为<span>{{Info.areaExamStudentMinScore}}</span>，它们之间分数的离差有<span>{{Info.areaExamStudentMaxScore - Info.areaExamStudentMinScore}}</span>分。全区平均分为<span>{{Info.areaExamStudentAvgScore}}</span>，平均得分率为<span>{{Info.areaAvgPercentage}}</span>。中位数为<span>{{Info.areaExamStudentMiddleSocre}}</span>分。本次考试的学科成绩分布状态，基本上表现为<span>{{Info.areaExamStudentScoreCharacteristics}}</span>的分布特点。标准差为<span>{{Info.areaExamStudentScoreBaseDex}}</span>,标准差异系数为<span>{{Info.areaExamStudentScoreDexSize}}</span>。</p>
      <p>2.0 本次考试的成绩，达到优秀的人数有<span>{{Info.gradeOneNum}}</span>人，占全体考生比率为<span>{{Info.gradeOnePercentage}}</span>;成绩达到良好的有<span>{{Info.gradeTwoNum}}</span>人，所占比率为<span>{{Info.gradeTwoPercentage}}</span>;成绩处于合格水平的有<span>{{Info.gradeThreeNum}}</span>人，所占比率为<span>{{Info.gradeThreePercentage}}</span>；成绩不及格的有<span>{{Info.otherNum}}</span>人，占全体考生的比率为<span>{{Info.otherPercentage}}</span>。</p>
      <p>3.0 学科知识结构组块的水平表现存在一定的差异:</p>
      <p>3.1 表现最好的知识组块是<span>{{Info.pointAvgScoreMaxName}}</span>，平均得分率为<span>{{Info.pointAvgScoreMaxPercentage}}</span>;表现最弱的知识组块是<span>{{Info.pointAvgScoreMinName}}</span>,平均得分率为<span>{{Info.pointAvgScoreMinPercentage}}</span></p>
      <p>3.2 学生水平差异来得较小的知识组块是<span>{{Info.pointLevelDifferenceMinName}}</span>,学生水平差异来得最大的知识组块是<span>{{Info.pointLevelDifferenceMaxName}}</span></p>
      <p>4.0 学科能力要求不同的组块之间，其水平表现也存在一定的差异</p>
      <p>4.1 表现最好的能力组块是<span>{{Info.masteryAvgScoreMaxName}}</span>,平均得分率为<span>{{Info.masteryAvgScoreMaxPercentage}}</span>,表现最弱的能力组块是<span>{{Info.masteryAvgScoreMinName}}</span>，平均得分率为<span>{{Info.masteryAvgScoreMinPercentage}}</span>。</p>
      <p>4.2 学生水平差异来得较小的知识组块是<span>{{Info.masteryLevelDifferenceMinName}}</span>,学生水平差异来得最大的知识组块是<span>{{Info.masteryLevelDifferenceMaxName}}</span>。</p>
      <p>5.0 从试题的难度分布看，试卷的编制遵循有一定的试题难度分布结构。</p>
      <table>
        <tr>
          <th>难度系数</th>
          <th>0.8以上</th>
          <th>0.6-0.8</th>
          <th>0.4-0.8</th>
          <th>0.2-0.4</th>
          <th>0.2以下</th>
        </tr>
        <tr>
          <td>题号</td>
          <td>{{Info.difficultSize8UperQuestionNo ? Info.difficultSize8UperQuestionNo : ''}}</td>
          <td>{{Info.difficultSize6To8QuestionNo ? Info.difficultSize6To8QuestionNo : ''}}</td>
          <td>{{Info.difficultSize4To6QuestionNo ? Info.difficultSize4To6QuestionNo : ''}}</td>
          <td>{{Info.difficultSize2To4QuestionNo ? Info.difficultSize2To4QuestionNo : ''}}</td>
          <td>{{Info.difficultSize8UnderQuestionNo ? Info.difficultSize8UnderQuestionNo : ''}}</td>
        </tr>
        <tr>
          <td>赋分</td>
          <td>{{Info.difficultSize8UperSumSocre}}</td>
          <td>{{Info.difficultSize6To8SumSocre}}</td>
          <td>{{Info.difficultSize4To6SumSocre}}</td>
          <td>{{Info.difficultSize2To4SumSocre}}</td>
          <td>{{Info.difficultSize8UnderSumSocre}}</td>
        </tr>
      </table>

      <p>5.1 最难的试题有<span>{{Info.dissficultSizeMaxQuestionNo ? Info.dissficultSizeMaxQuestionNo : '　'}}</span>题，它们的难度系数分别达到<span>{{Info.dissficultSizeMaxQuestionSize ? Info.dissficultSizeMaxQuestionSize : '　'}}</span>。</p>
      <p>5.2 试题难度较小的试题有<span>{{Info.dissficultSizeMinQuestionNo ? Info.dissficultSizeMinQuestionNo : '　'}}</span>题，他们的试题难度都在<span>{{Info.dissficultSizeMinQuestionSize ? Info.dissficultSizeMinQuestionSize : '　'}}</span>以上。</p>
      <p>6.0 试题总是有一定的区分功能，各个试题有自己具体的区分作用。</p>
      <p>6.1 客观题中，区分能力较大的试题为<span>{{Info.keGuanDistinguishMaxQuestionNo}}</span>，区分能力较小的试题为<span>{{Info.keGuanDistinguishMinQuestionNo}}</span></p>
      <p v-show="Info.zhuGuanDistinguishMaxQuestionNo">6.2 主观题中，区分能力较大的试题为<span>{{Info.zhuGuanDistinguishMaxQuestionNo}}</span>，区分能力较小的试题为<span>{{Info.zhuGuanDistinguishMinQuestionNo}}</span></p>
      <p>7.0 从各个学校在本学科的表现看， 平均得分率各不相同。表现较好和相对较弱的学校见下表：</p>
      <table>
        <tr>
          <th>表现状态</th>
          <th>学校</th>
          <th>平均得分率</th>
        </tr>
        <tr>
          <td>表现好的学校</td>
          <td>
            <ul>
              <li v-for="item in Info.avgScorePercentageHighList">{{item.schoolName}}</li>
            </ul>
          </td>
          <td>
              <ul>
                <li v-for="item in Info.avgScorePercentageHighList">{{item.scorePercentage}}</li>
              </ul>
            </td>          
        </tr>
        <tr>
            <td>表现不足的学校</td>
            <td>
                <ul>
                  <li v-for="item in Info.avgScorePercentageLowList">{{item.schoolName}}</li>
                </ul>
              </td>            
            <td>
              <ul>
                <li v-for="item in Info.avgScorePercentageLowList">{{item.scorePercentage}}</li>
              </ul>
            </td>
          </tr>        
      </table>

      <p>8.0 学科的优良等级分布结构上看，各个学校的优良等级分布结构各有差异。</p>
      <p>8.1 优秀率较高的学校有</p>
      <table>
        <tr>
          <th>学校</th>
          <th>优秀率</th>
        </tr>
        <tr v-for="item in Info.levelRankPercentageHighList">
          <td>{{item.schoolName}}</td>
          <td>{{item.scorePercentage}}</td>
        </tr>
      </table>
      <p>8.2 不及格率较高的学校有</p>
      <table>
          <tr>
            <th>学校</th>
            <th>不及格率</th>
          </tr>
          <tr v-for="item in Info.levelRankPercentageLowList">
            <td>{{item.schoolName}}</td>
            <td>{{item.scorePercentage}}</td>
          </tr>
        </table>
      <p>9.0 学生成绩的高低，来源于学科内的结构组块的具体表现。从学科内在结构表现看，各个学校的表现存在有差异。</p>
      <p>9.1 就学科各个组块的平均水平而言，与全区的平均水平比较，有的学校表现得更好，有学校表现来得差一些。各组块表现比较突出的学校情况，如下表所示：</p>
      <table>
        <tr>
          <th>学科组块</th>
          <th>平均水平较高的学校</th>
          <th>平均水平较低的学校</th>
        </tr>
        <tr v-for="item in Info.pointThanAreaAvgList">
          <td>{{item.pointName}}</td>
          <td>{{item.avgHighSchoolName}}</td>
          <td>{{item.avgLowSchoolNmae}}</td>
        </tr>
      </table>
      <p>9.2各个学校的学科各个组块平均水平，相对于自身学科的平均水平比较而言，有的组块表现来得更好,体现该学校学科教学的相对优势；有组块表现来得差一些，体现出学校学科教学的相对弱段。各组块表现比较突出的学校情况，如下表所示：</p>
      <table>
        <tr>
          <th>学科组块</th>
          <th>相对于自身水平，表现较好的学校</th>
          <th>相对于自身水平，表现较差的学校</th>
        </tr>
        <tr v-for="item in Info.pointThanHimselfAvgList">
          <td>{{item.pointName}}</td>
          <td>{{item.avgHighSchoolName}}</td>
          <td>{{item.avgLowSchoolNmae}}</td>
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
      dialog: false,
      studentData: [],
      examList: [],
      examId: '',
      courseList: [],
      questionModelList: [],
      knowledgeList: [],
      masteryList: [],
      questionModelAcademicLevelList: [],
      knowledgeAcademicLevelList: [],
      masteryAcademicLevelList: [],
      courseId: '',
      courseName: '',
      loading: false,
      table: [],
      form: {
        examId: '',
        courseId: ''
      },
      num: 5,
      title: '',
      Info: {}
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
          // const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
          window.location.href = `${path}/analysisCourse/schoolExamDiagnosisAnalysisKeyPointExport?` +
                                      `examId=${this.form.examId}` +
                                      `&courseId=${this.form.courseId}` +
                                      `&examName=${this.examList.filter(item => item.id === this.form.examId)[0].name}`
        } else {
          return false
        }
      })
    },

    async getData () {
      this.loading = true
      this.courseName = this.courseList.filter(item => item.courseId === this.form.courseId).length > 0 ? this.courseList.filter(item => item.courseId === this.form.courseId)[0].courseName : ''
      this.title = this.examList.filter(item => item.id === this.form.examId)[0].name + '、' + this.courseName
      const { data } = await this.$https.get(`/analysisCourse/schoolExamDiagnosisAnalysisKeyPointQuery?examId=${this.form.examId}&subjectId=${this.form.courseId}`)
      if (data.code === 1) {
        data.result ? this.Info = data.result : this.Info = {}
      } else {
        notice(this, data.message, 3000)
      }
      this.loading = false
    },

    async getcourseList () {
      // 学期
      const scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      if (!scoreRuleId) {
        notice(this, '该考试未设置规则', 2000)
        return
      }
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
.chart-2-15 {
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
    &>h3 {
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      line-height: 25px;
      margin-bottom: 15px;
      span {
        font-weight: bold;
      }
    }
    >table {
      width: 100%;
      margin: $width auto;
      tr {
        border: 1px solid #dfe6ec;
        th {
          text-align: center;
          line-height: 30px;
          background: #EEF1F6;
          color: #363D4A;

          &:last-child, &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5) {
            border-left: 1px solid #dfe6ec;
          }
        }
        td {
          /* width: 30%; */
          border: 1px solid  #dfe6ec;
          line-height: 30px;

          ul {
            li {
              width: 100%;
              list-style-type: none;
              line-height: 35px;
              border-bottom: 1px solid  #dfe6ec;
              height: 35px;
              color: #363D4A;
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
      text-align: center;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
