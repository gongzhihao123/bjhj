<template>
  <div class="area-enter">
    <!-- 区级学生录入情况 -->
    <enter :type="1"
            v-if="user.companyType == 2"
            :firstList="areaList"
            :switchMenu="switchMenu"
            :tableHead="tableHead"
            :tableList="tableList"
            :totalCount="totalCount"
            @switchType="getList"
            @changePage="changePage"></enter>

    <!-- 校级学生录入情况 -->
    <enter :type="2"
            v-if="user.companyType == 1"
            :firstList="schoolList"
            :switchMenu="switchMenu"
            :tableHead="schoolHead"
            :tableList="tableList"
            :totalCount="totalCount"
            @switchType="getList"
            @changePage="changePage"></enter>
  </div>
</template>

<script>
import enter from '@/components/EnterSituation'
import { notice } from '../../api/index.js'
export default {
  name: 'area-enter',
  data () {
    return {
      examId: '',
      areaList: [
        { name: '总学校数', num: 0 },
        { name: '未提交学校数', num: 0 },
        { name: '学生人数', num: 0 }
      ],
      switchMenu: [
        { name: '全部', id: '' },
        { name: '未提交', id: '0' },
        { name: '已提交', id: '1' }
      ],
      tableHead: [
        '学校名称', '录入情况', '学生人数'
      ],
      tableList: [],
      schoolList: [
        { name: '总班级数', num: 0 },
        { name: '未提交班级数', num: 0 },
        { name: '学生人数', num: 0 }
      ],
      schoolHead: [
        '班级名称', '录入情况', '学生人数'
      ],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      val: ''
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
    getDetail () {
      if (this.user.companyType === 1) {
        this.$https.get(`/examStudentEnter/stateSchool?examId=${this.examId}`)
        .then(res => {
          if (res.data.code === 1) {
            this.schoolList[0].num = res.data.result.totalNum
            this.schoolList[1].num = res.data.result.notCommitNum
            this.schoolList[2].num = res.data.result.studentNum
          }
        })
      } else {
        this.$https.get(`/examStudentEnter/stateArea?examId=${this.examId}`)
        .then(res => {
          if (res.data.code === 1) {
            this.areaList[0].num = res.data.result.totalNum
            this.areaList[1].num = res.data.result.notCommitNum
            this.areaList[2].num = res.data.result.studentNum
          }
        })
      }
    },
    async getList (val = '', s = 1) {
      this.val = val
      this.pageNo = s
      let res = {}
      if (this.user.companyType === 1) {
        res = await this.$https.get(`/examStudentEnter/stateSchoolList?examId=${this.examId}&enterState=${val}`)
        if (res.data.code === 1) {
          this.tableList = res.data.result || []
        } else {
          notice(this, res.data.message, 2000)
        }
      } else {
        res = await this.$https.get(`/examStudentEnter/stateAreaList?examId=${this.examId}&enterState=${val}&pageNo=${s}&pageSize=${this.pageSize}`)
        if (res.data.code === 1) {
          this.totalCount = res.data.result.totalCount
          this.tableList = res.data.result.list || []
        } else {
          notice(this, res.data.message, 2000)
        }
      }
    },
    changePage (val) {
      this.getList(this.val, val)
    }
  },
  created () {
    this.examId = sessionStorage.PARAMS_EXAMID
    this.getDetail()
    this.getList()
  }
}
</script>

<style lang="scss">

</style>
