<template>
  <div id="answer">
    <answers :details="templatePre" v-if="answerState == 2"></answers>
    <el-button type="success" v-if="answer == 1 && answerState == 2" @click="answerNaire" :disabled="clickState">提交答卷</el-button>

    <div class="finish" v-if="answerState == 1">
      <div class="img"></div>
      <p>{{ message }}</p>
      <div>
      </div>
    </div>

    <!--弹框提醒-->
    <el-dialog
      title="提示"
      class="dialog-remind"
      top="15%"
      size="tiny"
      :visible.sync="remind">
      <p>您有未作答的题目，请作答后提交</p>
      <p>未作答题目：
        <span v-for="(item, index) in noAnswer" :key="index">
          <span  v-if="index != (noAnswer.length - 1)" >{{item}} , </span>
          <span  v-else>{{item}}</span>
        </span>
      </p>
      <div class="button-group">
        <el-button @click="remind = false">确定</el-button>
      </div>
    </el-dialog>

    <!--遮罩-->
    <aside class="shade" v-show="answer == 1">
      <img src="../../assets/images/logo.png" ondragstart="return false;" @click="route({path: '/index'})">
      <span class="title" @click="route({path: '/index'})">问卷调查</span>
    </aside>
  </div>
</template>

<script>
import answers from '../../components/details'
import { notice, success } from '../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'answer',
  data () {
    return {
      answer: true, // 判断是否是答题页，显示答卷按钮0回答  1查看
      naireId: '',
      templatePre: {},
      noAnswer: [],
      remind: false,
      showResult: '',
      clickState: false,
      type: '',
      answerState: '',
      message: ''
    }
  },
  components: {
    answers
  },
  methods: {
    // 比较器
    compare (propertyName) {
      return (obj1, obj2) => {
        let val1 = obj1[propertyName]
        let val2 = obj2[propertyName]
        if (val2 < val1) {
          return 1
        } else if (val2 > val1) {
          return -1
        } else {
          return 0
        }
      }
    },
    getDetails () {
      this.$https.get(`/common/naireDetail?ciphertext=${this.naireId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.templatePre = res.data.result
          this.answerState = 2
          this.type = this.templatePre.type
          this.showResult = this.templatePre.showResult
          this.templatePre.qNum = this.templatePre.questions.filter(item => item.questionType !== 4).length
          this.templatePre.questions = this.templatePre.questions.map(item => ({...item, checked: ''}))
          this.templatePre.questions.forEach(item => {
            if (item.questionType === 1) {
              item.options.sort(this.compare('radioboxSort'))
              item.checked = ''
            } else if (item.questionType === 2) {
              item.options.sort(this.compare('checkboxSort'))
              item.options = item.options.map(items => ({...items, checked: false}))
            } else if (item.questionType === 3) {
              item.answer = ''
            }
          })
          let i = 1
          this.templatePre.questions.forEach(item => {
            if (item.questionType !== 4) {
              item.sorts = i++
            }
          })
          if (Number(this.answer) === 1) {
            this.templatePre.print = 1
          }
        } else {
          this.answerState = 1
          this.message = res.data.message || '已答问卷，感谢您的参与！'
        }
      })
    },
    answerNaire () {
      this.noAnswer = []
      this.clickState = true
      // this.templatePre.questions = this.templatePre.questions.filter(item => item.questionType !== 4)
      let answerjson = this.templatePre.questions.map(item => ({
        ...item,
        naireId: this.naireId,
        questionId: item.id,
        type: item.questionType
      }))
      answerjson = answerjson.filter(item => item.questionType !== 4)
      answerjson.forEach(item => {
        if (item.type === 1) {
          item.radioId = item.options[Number(item.checked)].radioboxId
          if (!item.checked) {
            if (item.checked !== 0) {
              this.noAnswer.push(item.sorts)
            }
          }
        } else if (item.type === 2) {
          item.checkboxId = item.options.filter(item => item.checked).map(item => item.checkboxId).join(',')
          if (!item.checkboxId) {
            this.noAnswer.push(item.sorts)
          }
        } else if (item.type === 3) {
          item.aswer = item.answer
          if (!item.aswer) {
            this.noAnswer.push(item.sorts)
          }
        }
      })
      if (this.noAnswer.length !== 0) {
        this.remind = true
        this.clickState = false
        return
      }
      this.$https.post(`/common/naireAnswerSave`, querystring.stringify({
        naireId: this.naireId,
        // MAC: '58.133.87.122',
        questionJson: JSON.stringify(answerjson.map(item => ({...item, options: null})))
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.$router.push({path: '/finish', query: {showResult: this.showResult, naireId: this.naireId, type: this.type}})
        } else {
          notice(this, res.data.message, 2000)
        }
        this.clickState = false
      })
    },
    route () {
      this.$router.push({path: 'index', query: {type: this.type}})
    }
  },
  created () {
    this.naireId = this.$route.query.naireId
    this.answer = this.$route.query.answer
    this.getDetails()
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1250px) {
  #answer {
    .el-button {
      margin: 20px auto;
      display: block;
    }
    .shade {
      width: 700px;
      height: 50px;
      line-height: 50px;
      background: #fff;
      position: fixed;
      top: 0;
      z-index: 10;
      &>img {
        float: left;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 6px;
      }
      .title {
        font-family: 微软雅黑;
        color: #333;
        font-size: 22px;
        letter-spacing: 2px;
        // font-weight: bold;
      }
      * {
        cursor: pointer;
      }
    }

    .finish {
      text-align: center;
      padding: 120px 0;
      background: #fff;
      .img {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        background: url(../../assets/images/notice.png) no-repeat center;
        background-size: cover;
      }
      p {
        padding: 20px;
      }
    }
  }
}
@media screen and (min-width: 1250px) {
    #answer {
    .el-button {
      margin: 20px auto;
      display: block;
    }
    .shade {
      width: 700px;
      height: 50px;
      line-height: 50px;
      background: #fff;
      position: fixed;
      top: 0;
      z-index: 10;
      &>img {
        float: left;
        margin-right: 10px;
        margin-top: 6px;
      }
      .title {
        font-family: 微软雅黑;
        color: #333;
        font-size: 22px;
        letter-spacing: 2px;
        // font-weight: bold;
      }
      * {
        cursor: pointer;
      }
    }

    .finish {
      text-align: center;
      padding: 120px 0;
      background: #fff;
      .img {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        background: url(../../assets/images/notice.png) no-repeat center;
        background-size: cover;
      }
      p {
        padding: 20px;
      }
    }
  }
}
</style>
