<template>
  <div class="test-enter-situation">
    <!-- 试卷录入情况 -->
    <enter :type="3"
            :firstList="schoolList"
            :switchMenu="switchMenu"
            :tableHead="tableHead"
            :tableList="tableList"
            @switchType="getList"></enter>
  </div>
</template>

<script>
import enter from '@/components/EnterSituation'
import { notice } from '@/api/index.js'
export default {
  name: 'test-enter-situation',
  data () {
    return {
      examId: '',
      schoolList: [
        { name: '总科目数', num: 0 },
        { name: '未提交科目数', num: 0 }
      ],
      switchMenu: [
        { name: '全部', id: '' },
        { name: '未提交', id: '0' },
        { name: '已提交', id: '1' }
      ],
      tableHead: [
        '科目', '录入情况'
      ],
      tableList: [],
      filterList: []
    }
  },
  components: {
    enter
  },
  methods: {
    getDetail () {
      this.$https.get(`/examQuestionEnter/state?examId=${this.examId}`)
      .then(res => {
        if (res.data.code === 1) {
          let result = res.data.result
          this.schoolList[0].num = result.totalNum
          this.schoolList[1].num = result.notCommitNum
          this.tableList = result.detailList
          this.filterList = [...this.tableList]
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    getList (val = '') {
      if (!val && val !== '0') {
        this.tableList = this.filterList
      } else this.tableList = this.filterList.filter(item => Number(item.enterFlag) === Number(val))
    }
  },
  created () {
    this.examId = sessionStorage.PARAMS_EXAMID
    this.getDetail()
  }
}
</script>

<style lang="scss">

</style>
