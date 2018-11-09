<template>
  <div class="chart-1-9">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 300px;" >
        <el-option
          v-for="item in examList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getData">查询</el-button>
    </div>

    <div class="content" v-loading="loading">
        <el-table
          :data="table"
          border>
          <el-table-column
            prop="schoolName"
            label="学校"
            fixed
            min-width="120px"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            :label="`一档线临界人数${baseData.good || 0}`"
            align="center">
            <el-table-column
              :label="`${baseData.good || 0}到${baseData.upperScore || 0}`"
              min-width="40"
              prop="goodUpper">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 1, baseData.good, baseData.upperScore, baseData.good)" type="text"  :disabled="scope.row.goodUpper == 0 || scope.row.canMod">
                  {{ scope.row.goodUpper}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              :label="`${baseData.lowerScore || 0}到${baseData.good || 0}`"
              min-width="40"
              prop="goodLower">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 2, baseData.good, baseData.good, baseData.lowerScore)" type="text"  :disabled="scope.row.goodLower == 0 || scope.row.canMod">
                  {{ scope.row.goodLower}}
                </el-button>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="`二档临界人数${baseData.fine || 0}`"
            align="center">
            <el-table-column
              :label="`${baseData.fine || 0}到${baseData.upperScoreTwo || 0}`"
              min-width="40"
              prop="fineUpper">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 1, baseData.fine, baseData.upperScoreTwo, baseData.fine)" type="text"  :disabled="scope.row.fineUpper == 0 || scope.row.canMod">
                  {{ scope.row.fineUpper}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              :label="`${baseData.lowerScoreTwo || 0}到${baseData.fine || 0}`"
              min-width="40"
              prop="fineLower">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 2, baseData.fine, baseData.fine, baseData.lowerScoreTwo)" type="text"  :disabled="scope.row.fineLower == 0 || scope.row.canMod">
                  {{ scope.row.fineLower}}
                </el-button>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="`三档临界人数${baseData.qualified || 0}`"
            align="center">
            <el-table-column
              :label="`${baseData.qualified || 0}到${baseData.upperScoreThree || 0}`"
              min-width="40"
              prop="qualifiedUpper">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 1, baseData.qualified, baseData.upperScoreThree, baseData.qualified)" type="text"  :disabled="scope.row.qualifiedUpper == 0 || scope.row.canMod">
                  {{ scope.row.qualifiedUpper}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              :label="`${baseData.lowerScoreThree || 0}到${baseData.qualified || 0}`"
              min-width="40"
              prop="qualifiedLower">
              <template scope="scope">
                <el-button @click="showStudent(scope.row, 2, baseData.qualified, baseData.qualified, baseData.lowerScoreThree)" type="text"  :disabled="scope.row.qualifiedLower == 0 || scope.row.canMod">
                  {{ scope.row.qualifiedLower}}
                </el-button>
              </template>
            </el-table-column>
          </el-table-column>
          
        </el-table>
      <div class="lever1 lever">
        <chart :options="commonChart" class="echart"></chart>
      </div>
    </div>

    <el-dialog title="学生列表" :visible.sync="dialog" custom-class="detail">
      <el-table :data="studentData" border max-height="300">
        <el-table-column property="examNo" label="考号" width="150" show-overflow-tooltip v-if="needExamNo"></el-table-column>
        <el-table-column property="studentName" label="姓名" width="100" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column property="className" label="班级" show-overflow-tooltip ></el-table-column> -->
        <!-- <el-table-column property="courseName" label="学科" show-overflow-tooltip v-if="courseId"></el-table-column> -->
        <el-table-column property="courseScore" label="分数" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.allScore.toFixed(1) }}
          </template>
        </el-table-column>
        <!-- <el-table-column property="name" label="等级" show-overflow-tooltip>
          <template scope="scope">
            {{
               grade === 1
               ? '优秀'
               : grade === 2
                ? '良好'
                : grade === 3
                  ? '合格'
                  : '不合格'
            }}
            
          </template>
        </el-table-column> -->
        <el-table-column property="schoolName" label="学校" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column label="排名" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'
// import { deepClone } from '../../../utils/deepClone'

export default {
  data () {
    return {
      examList: [],
      baseData: {},
      examId: '',
      loading: false,
      table: [],
      commonChart: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['线下人数', '线上人数']
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['一档临界人数', '二档临界人数', '三档临界人数']
          }
        ],
        yAxis: [
          {
            name: '人数',
            type: 'value'
          }
        ],
        series: [
          {
            name: '线下人数',
            type: 'bar',
            data: []
          },
          {
            name: '线上人数',
            type: 'bar',
            data: []
          }
        ]
      },
      studentData: [],
      dialog: false,
      examNo: false
    }
  },

  methods: {

    exportButton () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisResearch/keyGroupsAnalysisExport?` +
                                  `examId=${this.examId}`
    },

    total (name) {
      return this.table[this.table.length - 1][name]
              // .map(item => item[name])
              // .reduce((pre, next) => pre + next)
    },

    async showStudent (row, type, score, upperScore, lowerScore) {
      this.dialog = true
      this.studentData = []
      const { data: student } = await this.$https.get(`/analysisResearch/keyGroupsAnalysisQueryDetail` +
                                `?schoolId=${row.schoolId}` +
                                `&type=${type}` +
                                `&examId=${this.examId}` +
                                `&score=${score}` +
                                `&upperScore=${upperScore}` +
                                `&lowerScore=${lowerScore}`)
      if (student.code === 1) {
        this.studentData = [...student.result || []]
        this.needExamNo = this.studentData.every(item => item.examNo)
      }
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      this.loading = true
      const { data } = await this.$https.get(`/analysisResearch/keyGroupsAnalysisQuery` +
                                      `?examId=${this.examId}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.baseData = {...data.result[0]}
        this.table = [...data.result]
        const oneLo = this.total('goodLower')
        const oneUp = this.total('goodUpper')
        const twoLo = this.total('fineLower')
        const twoUp = this.total('fineUpper')
        const threeLo = this.total('qualifiedLower')
        const threeUp = this.total('qualifiedUpper')
        this.commonChart.series[0].data = [oneLo, twoLo, threeLo]
        this.commonChart.series[1].data = [oneUp, twoUp, threeUp]
        // console.log([oneLo, twoLo, threeLo])
        // console.log([oneUp, twoUp, threeUp])
        let obj = {...this.table[this.table.length - 1]}
        obj.schoolName = '比率'
        obj.goodUpper = obj.allStudent !== 0 ? (obj.goodUpper / obj.allStudent * 100).toFixed(2) + '%' : 0
        obj.goodLower = obj.allStudent !== 0 ? (obj.goodLower / obj.allStudent * 100).toFixed(2) + '%' : 0
        obj.fineUpper = obj.allStudent !== 0 ? (obj.fineUpper / obj.allStudent * 100).toFixed(2) + '%' : 0
        obj.fineLower = obj.allStudent !== 0 ? (obj.fineLower / obj.allStudent * 100).toFixed(2) + '%' : 0
        obj.qualifiedUpper = obj.allStudent !== 0 ? (obj.qualifiedUpper / obj.allStudent * 100).toFixed(2) + '%' : 0
        obj.qualifiedLower = obj.allStudent !== 0 ? (obj.qualifiedLower / obj.allStudent * 100).toFixed(2) + '%' : 0
        this.table.push(obj)
        this.table[this.table.length - 1].canMod = true
        this.table[this.table.length - 2].canMod = true
      }
      this.loading = false
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
.chart-1-9 {
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

  .echarts {
    width: 100%;
  }
  .detail {
    width: 1000px !important;
  }
  
}
</style>
