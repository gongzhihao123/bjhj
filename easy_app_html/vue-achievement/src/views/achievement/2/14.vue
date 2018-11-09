<template>
  <div class="chart-2-14">
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
              v-for="(item, index) in examList"
              :key="index"
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
              v-for="(item, index) in courseList"
              :key="index"
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
      <!--主观-->
        <p>主客观题组块 各学校平均得分率与全区年级平均得分率</p>
        <table> 
            <tr>
              <th colspan="2"></th>
              <th>得分率</th>
            </tr>
            <tr v-for="(item, index) in questionModelList" :key="index" v-if="questionModelList.length > 0">
              <td>{{item.name}}</td>
              <td>
                <ul>
                  <li v-for="(names, index) in item.avgScoreRateList" :key="index">{{names.schoolName}}</li>
                </ul>
              </td>
              <td>
                <ul>
                  <li v-for="(rates, index) in item.avgScoreRateList" :key="index">
                    <span v-if="rates.avgScoreRate" :class="{ red: rates.avgScoreRate > item.areaRate, green: rates.avgScoreRate < item.areaRate}">{{((rates.avgScoreRate || 0) * 100).toFixed(2) + '%'}}</span>
                    <span v-if="rates.avgScoreRate === null">-</span>
                  </li>
                </ul>
              </td>
            </tr>
        </table>
        <p v-if="questionModelList.length === 0">暂无数据</p>
        <chart :options="item" class="echart" v-for="(item, index) in barTable" :key="index"></chart>
        <!--知识-->
        <p>知识结构 各学校平均得分率与全区年级平均得分率</p>
        <table> 
            <tr>
              <th colspan="2"></th>
              <th>得分率</th>
            </tr>
            <tr v-for="(item, index) in knowledgeList" v-if="knowledgeList.length > 0" :key="index">
              <td>{{item.name}}</td>
              <td>
                <ul>
                  <li v-for="(names, index) in item.avgScoreRateList" :key="index">{{names.schoolName}}</li>
                </ul>
              </td>
              <td>
                <ul>
                  <li v-for="(rates, index) in item.avgScoreRateList" :key="index">
                    <span v-if="rates.avgScoreRate" :class="{ red: rates.avgScoreRate > item.areaRate, green: rates.avgScoreRate < item.areaRate}">{{((rates.avgScoreRate || 0) * 100).toFixed(2) + '%'}}</span>
                    <span v-if="rates.avgScoreRate === null">-</span>
                  </li>
                </ul>
              </td>
            </tr>
        </table>
        <p v-if="knowledgeList.length === 0">暂无数据</p>
        <chart :options="item" class="echart" v-for="(item, index) in lineTable" :key="index"></chart>
        <!--认知-->
        <p>认知结构 各学校平均得分率与全区年级平均得分率</p>
        <table> 
            <tr>
              <th colspan="2"></th>
              <th>得分率</th>
            </tr>
            <tr v-for="(item, index) in masteryList" :key="index" v-if="masteryList.length > 0">
              <td>{{item.name}}</td>
              <td>
                <ul>
                  <li v-for="(names, index) in item.avgScoreRateList" :key="index">{{names.schoolName}}</li>
                </ul>
              </td>
              <td>
                <ul>
                  <li v-for="(rates, index) in item.avgScoreRateList" :key="index">
                    <span v-if="rates.avgScoreRate" :class="{ red: rates.avgScoreRate > item.areaRate, green: rates.avgScoreRate < item.areaRate}">{{((rates.avgScoreRate || 0) * 100).toFixed(2)  + '%'}}</span>
                    <span v-if="rates.avgScoreRate === null">-</span>
                  </li>
                </ul>
              </td>
            </tr>
        </table>
        <p v-if="masteryList.length === 0">暂无数据</p>
        <chart :options="item" class="echart" v-for="(item, index) in kenTable" :key="index"></chart>        
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
      loading: false,
      table: [],
      form: {
        examId: '',
        courseId: ''
      },
      num: 5,
      barTable: [],
      lineTable: [],
      kenTable: []
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
          const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
          window.location.href = `${path}/analysisCourse/schoolSubjectInnerStructLevelDevelopmentChangeExport?` +
                                      `examId=${this.form.examId}` +
                                      `&courseId=${this.form.courseId}` +
                                      `&examName=${this.examList.filter(item => item.id === this.form.examId)[0].name}` +
                                      `&courseName=${this.courseList.filter(item => item.courseId === this.form.courseId)[0].courseName}` +
                                      `&gradeId=${nowList.gradeId}`
        } else {
          return false
        }
      })
    },

    async getData () {
      this.barTable = []
      this.lineTable = []
      this.kenTable = []
      this.loading = true
      const { data } = await this.$https.get(`/analysisCourse/schoolSubjectInnerStructLevelDevelopmentChangeQuery?examId=${this.form.examId}&subjectId=${this.form.courseId}`)
      if (data.code === 1) {
        if (!data.result) {
          this.loading = false
          this.knowledgeAcademicLevelList = []
          this.knowledgeList = []
          this.masteryAcademicLevelList = []
          this.masteryList = []
          this.questionModelList = []
          this.questionModelAcademicLevelList = []
          return
        }
        if (data.result.knowledgeAcademicLevelList !== null) {
          // 知识结构水平能级信息列表
          this.knowledgeAcademicLevelList = data.result.knowledgeAcademicLevelList
        } else {
          this.knowledgeAcademicLevelList = []
        }
        // 知识结构得分率信息列表
        if (data.result.knowledgeList !== null) {
          this.knowledgeList = data.result.knowledgeList.map(item => ({...item, areaRate: ''}))
          this.knowledgeList.forEach(item => {
            item.avgScoreRateList.forEach(avg => {
              if (avg.schoolId === 0) {
                item.areaRate = avg.avgScoreRate
              }
            })
          })
        } else {
          this.knowledgeList = []
        }
        if (data.result.masteryAcademicLevelList !== null) {
          // 认知结构（能力等级）水平能级信息列表
          this.masteryAcademicLevelList = data.result.masteryAcademicLevelList
        } else {
          this.masteryAcademicLevelList = []
        }
        // 认知结构（能力等级）得分率信息列表
        if (data.result.masteryList !== null) {
          this.masteryList = data.result.masteryList.map(item => ({...item, areaRate: ''}))
          this.masteryList.forEach(item => {
            item.avgScoreRateList.forEach(avg => {
              if (avg.schoolId === 0) {
                item.areaRate = avg.avgScoreRate
              }
            })
          })
        } else {
          this.masteryList = []
        }
        if (data.result.questionModelAcademicLevelList !== null) {
          // 主客观题水平能级信息列表
          this.questionModelAcademicLevelList = data.result.questionModelAcademicLevelList
        } else {
          this.questionModelAcademicLevelList = []
        }
        //  主客观题得分率信息列表
        if (data.result.questionModelList !== null) {
          this.questionModelList = data.result.questionModelList.map(item => ({...item, areaRate: ''}))
          this.questionModelList.forEach(item => {
            item.avgScoreRateList.forEach(avg => {
              if (avg.schoolId === 0) {
                item.areaRate = avg.avgScoreRate
              }
            })
          })
        } else {
          this.questionModelList = []
        }
        // 主观题
        if (this.questionModelAcademicLevelList.length > 0) {
          this.questionModelAcademicLevelList.forEach(item => {
            // this.barChart.legend.data.push(item.name + '各学校平均得分率与全区年级平均得分率')
            // this.barChart.xAxis.data = item.academicLevelList.map(para => para.schoolName)
            // this.barChart.series[0].data = item.academicLevelList.map(para => para.academicLevel)
            // this.barChart.title.text = item.academicLevelList.map(para => para.schoolName)
            this.barTable.push({
              legend: {
                data: item.name + '各学校平均得分率与全区年级平均得分率'
              },
              title: {
                text: item.name + '组块 学校学业水平能级',
                left: 'center'
              },
              color: ['#35a9eb'],
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                name: '学校',
                axisLabel: {
                  formatter: '{value}'
                },
                data: item.academicLevelList.map(para => para.schoolName)
              },
              yAxis: {
                type: 'value',
                name: '',

                axisLine: {onZero: false},
                axisLabel: {
                  formatter: '{value}'
                },
                splitLine: {
                  show: true
                },
                boundaryGap: false,
                data: []
              },
              series: [
                {
                  // name: '主观题组块 各学校平均得分率与全区年级平均得分率',
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                    normal: {
                      width: 3,
                      color: '#2F7FDA',
                      shadowColor: 'rgba(0,0,0,0.4)',
                      shadowBlur: 10,
                      shadowOffsetY: 10
                    }
                  },
                  data: item.academicLevelList.map(para => para.academicLevel)
                }
              ]
            })
          })
        }
        // 知识结构
        if (this.knowledgeAcademicLevelList.length > 0) {
          this.knowledgeAcademicLevelList.forEach(item => {
          // {
          //   this.lineChart.legend.data.push(item.name + '学校学业水平能级')
          //   this.lineChart.xAxis.data = item.academicLevelList.map(para => para.schoolName)
          //   this.lineChart.series[0].data = item.academicLevelList.map(para => para.academicLevel)
          //   this.lineChart.title.text = item.academicLevelList.map(para => para.schoolName)
          // }
            // console.log(item)
            this.lineTable.push({
              legend: {
                data: item.name + '学校学业水平能级'
              },
              title: {
                text: item.name + '组块 学校学业水平能级',
                left: 'center'
              },
              color: ['#35a9eb'],
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                name: '学校',
                axisLabel: {
                  formatter: '{value}'
                },
                data: item.academicLevelList.map(para => para.schoolName)
              },
              yAxis: {
                type: 'value',
                name: '',

                axisLine: {onZero: false},
                axisLabel: {
                  formatter: '{value}'
                },
                splitLine: {
                  show: true
                },
                boundaryGap: false,
                data: []
              },
              series: [
                {
                  // name: '主观题组块 各学校平均得分率与全区年级平均得分率',
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                    normal: {
                      width: 3,
                      color: '#2F7FDA',
                      shadowColor: 'rgba(0,0,0,0.4)',
                      shadowBlur: 10,
                      shadowOffsetY: 10
                    }
                  },
                  data: item.academicLevelList.map(para => para.academicLevel)
                }
              ]
            })
          })
        }

        // 认识结构
        if (this.masteryAcademicLevelList.length > 0) {
          this.masteryAcademicLevelList.forEach(item => {
            // this.kenChart.legend.data.push(item.name + '学校学业水平能级')
            // this.kenChart.xAxis.data = item.academicLevelList.map(para => para.schoolName)
            // this.kenChart.series[0].data = item.academicLevelList.map(para => para.academicLevel)
            // this.kenChart.title.text = item.academicLevelList.map(para => para.schoolName)
            // console.log(this.kenChart)
            this.kenTable.push({
              legend: {
                data: item.name + '学校学业水平能级'
              },
              title: {
                text: item.name + '组块 学校学业水平能级',
                left: 'center'
              },
              color: ['#35a9eb'],
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                name: '学校',
                axisLabel: {
                  formatter: '{value}'
                },
                data: item.academicLevelList.map(para => para.schoolName)
              },
              yAxis: {
                type: 'value',
                name: '',

                axisLine: {onZero: false},
                axisLabel: {
                  formatter: '{value}'
                },
                splitLine: {
                  show: true
                },
                boundaryGap: false,
                data: []
              },
              series: [
                {
                  // name: '主观题组块 各学校平均得分率与全区年级平均得分率',
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                    normal: {
                      width: 3,
                      color: '#2F7FDA',
                      shadowColor: 'rgba(0,0,0,0.4)',
                      shadowBlur: 10,
                      shadowOffsetY: 10
                    }
                  },
                  data: item.academicLevelList.map(para => para.academicLevel)
                }
              ]
            })
          })
        }
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
.chart-2-14 {
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
      margin-bottom: 20px;
    }
    >table {
      width: 92%;
      margin: $width auto;
      tr {
        border: 1px solid #dfe6ec;
        th {
          text-align: center;
          line-height: 30px;
          background: #EEF1F6;
          color: #363D4A;

          &:last-child {
            border-left: 1px solid #dfe6ec;
          }
        }
        td {
          width: 30%;
          border: 1px solid  #dfe6ec;
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
