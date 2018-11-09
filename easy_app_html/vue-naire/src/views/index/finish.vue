<template>
  <div id="finish">
    <div class="img"></div>
    <p>问卷到此结束，感谢您的参与！</p>
    <div>
        <el-button @click="route('/index')" v-if="type != 1">返回问卷列表</el-button>
        <el-button type="primary" @click="route('/homeDetails')" v-show="showResult == 1">查看结果</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'finish',
  data () {
    return {
      showResult: 0,
      naireId: this.naireId,
      type: ''
    }
  },
  created () {
    this.showResult = this.$route.query.showResult
    this.naireId = this.$route.query.naireId
    this.type = this.$route.query.type
  },
  methods: {
    route (s) {
      this.$router.push({path: s, query: {naireId: this.naireId}})
    }
  }
}
</script>

<style lang="scss" scoped>
    #finish {
        text-align: center;
        padding: 120px 0;
        background: #fff;
        .img {
            width: 100px;
            height: 100px;
            margin: 0 auto;
            background: url(../../assets/images/answerNaire.png) no-repeat center;
        }
        p {
            padding: 20px;
        }
    }
</style>
