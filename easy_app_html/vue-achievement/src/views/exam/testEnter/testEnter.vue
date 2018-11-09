<template>
  <div class="test-enter">
    <p class="top">
      <span class="to-list" @click="route('/exam')">返回考试列表</span>
      {{ examInfo.name }}> 
      <span>试卷录入</span>
    </p>

    <el-button @click="route('/exam/addTest')" type="success" v-if="menu.buttons && menu.buttons.paperAdd == 1">新增试卷</el-button>

    <div class="table">
      <table>
        <tr>
          <th v-for="(item, i) in thead" :key="i" style="background: #eef2f5;">{{ item }}</th>
        </tr>
        <tr v-for="(item, i) in tableList" :key="i" @click="route('/exam/checkTest', item)">
          <td>{{ item.courseName }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.createdUname }}</td>
          <td>{{ item.updateTime | dateFormat('yyyy-MM-dd hh:mm') }}</td>
        </tr>
        <tr v-if="tableList.length < 1">
          <th colspan="4" class="no-content">暂无数据</th>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { notice } from '../../../api/index.js'
export default {
  name: 'test-enter',
  data () {
    return {
      thead: ['科目', '试卷名称', '创建人', '更新时间'],
      tableList: [],
      examInfo: {
        id: '',
        scoreRuleId: '',
        name: ''
      }
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu
    }
  },
  methods: {
    getSubject () {
      // this.$https.get(`/examQuestionEnter/paperList?examId=${this.examInfo.id}&scoreRuleId=${this.examInfo.scoreRuleId}`)
      this.$https.get(`/examQuestionEnter/paperSimpleList?examId=${this.examInfo.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = res.data.result || []
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    route (path, query) {
      this.$router.push({path, query: {obj: JSON.stringify(query)}})
    }
  },
  created () {
    this.examInfo = JSON.parse(sessionStorage.EXAMINFO)
    this.getSubject()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
.test-enter {
  table {
    margin-top: 20px;
    width: 100%;

    th, td {
      border: 1px solid $border-color;
      line-height: 38px;
      text-align: center;
    }

    td {
      cursor: pointer;
    }

    .no-content {
      color: #999;
    }
  }
}
</style>
