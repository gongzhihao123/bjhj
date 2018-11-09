<template>
  <div class="chart-1-10">
    <el-button type="primary" @click="exportButton">导出</el-button>
    <div class="select">
      <span>考试</span>
      <el-select v-model="examId" placeholder="请选择考试" style="width: 300px;">
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
      <div class="lever">
        <p>一档临界生各科目平均分</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            label="分档上线人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].gradeOne }}
            </template>
          </el-table-column>
          <el-table-column
            label="总分临界人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].goodOne }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :label="list + '平均分'"
            :key="list">
              <template scope="scope">
                {{ scope.row.schoolScore[(index * 3) + 1].courseAvg.toFixed(1) }}
              </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="lever">
        <p>一档学科分档线学校上线人数</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            label="分档上线人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].gradeOne }}
            </template>
          </el-table-column>
          <el-table-column
            label="总分临界人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].goodOne }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :label="list + '人数'"
            :key="list">
              <template scope="scope">
                {{ tableData[scope.$index].subjects[index] ? tableData[scope.$index].subjects[index].goodStudent : 0 }}
              </template>
            </el-table-column>
        </el-table>
      </div>

      <div class="lever">
        <p>二档临界生各科目平均分</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            label="分档上线人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].gradeTwo }}
            </template>
          </el-table-column>
          <el-table-column
            label="总分临界人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].goodTwo }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :label="list + '平均分'"
            :key="list">
              <template scope="scope">
                {{ scope.row.schoolScore[(index * 3) + 2 ].courseAvg.toFixed(1) }}
              </template>
            </el-table-column>
        </el-table>
      </div>

      <div class="lever">
        <p>二档学科分档线学校上线人数</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            label="分档上线人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].gradeTwo }}
            </template>
          </el-table-column>
          <el-table-column
            label="总分临界人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].goodTwo }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :label="list + '人数'"
            :key="list">
              <template scope="scope">
                {{ tableData[scope.$index].subjects[index] ? tableData[scope.$index].subjects[index].fineStudent : 0 }}
              </template>
            </el-table-column>
        </el-table>
      </div>

      <div class="lever">
        <p>三档临界生各科目平均分</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            label="分档上线人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].gradeThree }}
            </template>
          </el-table-column>
          <el-table-column
            label="总分临界人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].goodThree }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :label="list + '平均分'"
            :key="list">
              <template scope="scope">
                {{ scope.row.schoolScore[(index + 1) * 3].courseAvg.toFixed(1) }}
              </template>
            </el-table-column>
        </el-table>
      </div>

      <div class="lever">
        <p>三档学科分档线学校上线人数</p>
        <el-table
          :data="tableLever"
          border>
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            label="分档上线人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].gradeThree }}
            </template>
          </el-table-column>
          <el-table-column
            label="总分临界人数">
            <template scope="scope">
              {{ scope.row.schoolScore[0].goodThree }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(list, index) in subject"
            :label="list + '人数'"
            :key="list">
              <template scope="scope">
                {{ tableData[scope.$index].subjects[index] ? tableData[scope.$index].subjects[index].qualifiedStudent : 0 }}
              </template>
            </el-table-column>
        </el-table>
      </div>
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
      loading: false,
      courseList: [],
      tableLever: [],
      subject: [],
      tableData: []
    }
  },

  methods: {

    exportButton () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/analysisResearch/keyGroupsSubjectLevelSchoolDistributionExport?` +
                                  `examId=${this.examId}`
    },

    async getData () {
      if (!this.examId) {
        notice(this, '请选择考试', 2000)
        return
      }
      this.loading = true
      const { data: list } = await this.$https.get(`/analysisResearch/keyGroupsSubjectLevelSchoolDistributionQuery?examId=${this.examId}`)
                            .catch(() => { this.loading = false })
      if (list.code !== 1) notice(this, list.message, 2000)
      else {
        const ids = [...new Set(list.result.subjectCount.map(item => item.schoolId))]
        const school = ids.map(item => {
          const schoolName = list.result.subjectCount.filter(n => n.schoolId === item)[0].schoolName
          return { schoolId: item, schoolName }
        })
        this.subject = list.result.subjectCount
                      .filter(item => item.schoolId === ids[0])
                      .map(item => item.courseName)
        this.tableData = school.map(item => {
          const subjects = list.result.subjectCount.filter(n => n.schoolId === item.schoolId)
          return {...item, subjects}
        })
        this.tableLever = [ ...list.result.subjectAvgScore ].map(item => ({
          ...item,
          schoolScore: item.schoolScore.map(items => ({
            goodOne: (!items.goodOne || items.goodOne === 'NaN') ? 0 : items.goodOne,
            goodThree: (!items.goodThree || items.goodThree === 'NaN') ? 0 : items.goodThree,
            goodTwo: (!items.goodTwo || items.goodTwo === 'NaN') ? 0 : items.goodTwo,
            gradeOne: (!items.gradeOne || items.gradeOne === 'NaN') ? 0 : items.gradeOne,
            gradeThree: (!items.gradeThree || items.gradeThree === 'NaN') ? 0 : items.gradeThree,
            gradeTwo: (!items.gradeTwo || items.gradeTwo === 'NaN') ? 0 : items.gradeTwo,
            courseAvg: (!items.courseAvg || items.courseAvg === 'NaN') ? 0 : items.courseAvg,
            courseName: items.courseName,
            level: items.level
          }))
        }))
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
    } else if (examList.code === -2) {
      error()
    } else {
      notice(this, examList.message, 2000)
    }

    this.getData()
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/variable.scss';
.chart-1-10 {
  position: relative;
  >.el-button {
    position: absolute;
    right: 0;
    top: -66px;
  }

  .select {

    >.el-select {
      margin-left: $width;
    }

    .el-button {
      margin-left: $width;
    }
  }

  .lever {
    margin-top: $width;
  
    p {
      font-size: 16px;
    }

    >.el-table {
      width: 90%;
      margin: $width auto;
    }
  }

  .echarts {
    width: 100%;
  }
}

</style>
