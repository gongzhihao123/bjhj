<template>
  <div class="area-score-enter">
    <!-- scoreEnterType 1 统一录入  2 任课教师录入-->
    <enter :type="6"
            v-if="scoreEnterType == 1"
            :firstList="totalList"
            :switchMenu="switchMenu"
            :tableHead="totalHead"
            :tableList="tableList"
            @switchType="getList"></enter>

    <!-- 区级成绩录入情况 -->
    <enter :type="4"
            v-if="scoreEnterType == 2 && quToSchool == 2"
            :firstList="schoolList"
            :switchMenu="switchMenu"
            :tableHead="tableHead"
            :tableList="tableList"
            :totalCount="totalCount"
            @switchType="getList"
            @changePage="changePage"
            @changeTo="changeTo"></enter>

    <!-- 校级成绩录入情况 -->
    <enter :type="5"
            v-if="scoreEnterType == 2 && quToSchool == 1"
            :firstList="subList"
            :switchMenu="subList"
            :tableHead="schoolHead"
            :tableList="tableList"
            @switchType="getList"></enter>
  </div>
</template>

<script>
import { notice } from '@/api/index.js'
import enter from '@/components/EnterSituation'
export default {
  name: 'area-score-enter',
  data () {
    return {
      examId: '',
      scoreEnterType: '',
      totalList: [
        { name: '总科目数', num: 0 },
        { name: '未提交科目数', num: 0 }
      ],
      schoolList: [
        { name: '总学校数', num: 0 },
        { name: '未提交学校数', num: 0 },
        { name: '学生人数', num: 0 }
      ],
      switchMenu: [
        { name: '全部', id: '' },
        { name: '未提交', id: 0 },
        { name: '已提交', id: 1 }
      ],
      tableHead: [
        '学校名称', '录入情况'
      ],
      totalHead: [
        '科目', '录入情况', '提交人', '更新时间'
      ],
      tableList: [],
      subList: [
      ],
      schoolHead: [
        '班级', '总人数', '缺考人数', '更新时间'
      ],
      filterList: [],
      pageSize: 10,
      pageNo: 1,
      val: '',
      totalCount: 0,
      quToSchool: 2,
      companyId: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  components: {
    enter
  },
  methods: {
    async getDetail () {
      if (Number(this.scoreEnterType) === 1) {
        this.$https.get(`/examScoreEnter/state?examId=${this.examId}`)
        .then(res => {
          if (res.data.code === 1) {
            this.totalList[0].num = res.data.result.totalNum
            this.totalList[1].num = res.data.result.notCommitNum
            this.tableList = res.data.result.detailList || []
            this.filterList = [...this.tableList]
            this.totalCount = this.tableList.length
          }
        })
      } else {
        if (this.quToSchool === 2) {
          this.$https.get(`/examScoreEnter/stateArea?examId=${this.examId}`)
          .then(res => {
            if (res.data.code === 1) {
              this.schoolList[0].num = res.data.result.totalNum
              this.schoolList[1].num = res.data.result.notCommitNum
              this.schoolList[2].num = res.data.result.studentNum
            }
          })
        } else if (this.quToSchool === 1) {
          this.$https.get(`/examScoreEnter/stateSchool?examId=${this.examId}&schoolId=${this.companyId}`)
          .then(res => {
            if (res.data.code === 1) {
              this.subList = (res.data.result.statisticsList || []).map(item => ({
                ...item,
                ...(res.data.result.courseList || []).find(items => String(items.courseId) === String(item.courseId)),
                result: (res.data.result.detailMap && res.data.result.detailMap[item.courseId]) ? res.data.result.detailMap[item.courseId] : []
              })).map(item => ({
                ...item,
                name: item.courseName,
                id: item.courseId,
                num: `${item.updateNum}/${item.totalNum}`
              }))
              this.filterList = [...this.subList]
              if (this.subList.length < 1) return
              this.tableList = this.subList[0].result
            } else {
              notice(this, res.data.message, 2000)
            }
          })
        }
      }
    },
    async getList (val, s = 1) {
      this.val = val
      if (Number(this.scoreEnterType) === 1) {
        if (!val && val !== 0) {
          this.tableList = [...this.filterList]
        } else {
          this.tableList = this.filterList.filter(item => Number(item.enterFlag) === Number(val))
        }
      } else {
        if (this.quToSchool === 1) {
          this.tableList = (this.subList.find(item => String(item.id) === String(val)) || {result: []}).result
        } else if (this.quToSchool === 2) {
          this.$https.get(`/examScoreEnter/stateAreaList?examId=${this.examId}&enterState=${val}&pageSize=${this.pageSize}&pageNo=${s}`)
          .then(res => {
            if (res.data.code === 1) {
              this.tableList = res.data.result.list
              this.totalCount = res.data.result.totalCount
            }
          })
        }
      }
    },
    changePage (val) {
      this.getList(this.val, val)
    },
    changeTo (val) {
      this.companyId = val
      this.quToSchool = 1
      this.getDetail()
      this.getList('', 1)
    },
    updata () {
      this.quToSchool = Number(this.user.companyType)
      this.examId = sessionStorage.PARAMS_EXAMID
      this.scoreEnterType = JSON.parse(sessionStorage.EXAMINFO || '{"scoreEnterType": ""}').scoreEnterType
      this.getDetail()
      this.getList('', 1)
    }
  },
  created () {
    this.updata()
  }
}
</script>

<style lang="scss">

</style>
