<template>
  <div class="naireDetail clearfix">
    <div class="header">
      <img src="../assets/images/return.png" alt="返回" @click="$router.push('/naireList')" />
      <!-- <h3 v-if="!detail.title || detail.title.length < 20">{{ detail.title }}</h3>
      <h3 v-else>{{ detail.title.substring(0, 19) + '...' }}</h3> -->
      <h3>{{ detail.title }}</h3>
      <span class="submit" v-show="isAnswer == 1" @click="answerNaire(detail.id)">提交</span>
    </div>
    <div class="main">
      <p>发布人：{{ detail.createdUserName }}</p>
      <p>截止时间：{{ detail.endTime | dateFormat('yyyy-MM-dd hh:mm') }}</p>
      <p class="num">问卷题数：{{ detail.qCount }}题</p>
      <ul>
        <li v-for="(item, i) in questionList" :key="i">
          <p class="name">
            <span>{{ item.sorts ? item.sorts + '.' : '' }}</span>
            {{ item.name }}
          </p>
          <div v-if="item.questionType == 1">
            <el-radio-group v-model="item.radioId" :disabled="isAnswer != 1">
              <el-radio v-for="(ans, ind) in item.options" :key="ind" :label="ans.radioboxId">{{ ans.radioboxName }}</el-radio>
            </el-radio-group>
          </div>
          <div v-else-if="item.questionType == 3">
            <textarea class="textbox" v-model="item.aswer" :disabled="isAnswer != 1"></textarea>
          </div>
          <div v-else-if="item.questionType == 2">
            <el-checkbox-group v-model="item.checkbox" :disabled="isAnswer != 1">
              <el-checkbox v-for="(ans, ind) in item.options" :key="ind" :label="ans.checkboxId">{{ ans.checkboxName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
// import { dateFormat } from '../filters/index.js'
import querystring from 'querystring'
import { notice, success } from '@/api/index.js'
export default {
  name: 'naireDetail',
  data () {
    return {
      naireId: '',
      childId: '',
      isAnswer: '',
      remind: false,
      detail: {
        title: ''
      },
      noAnswer: [],
      questionList: [],
      clickState: false,
      isShow: ''
    }
  },
  methods: {
    answerNaire () {
      if (this.clickState) return
      this.clickState = true
      this.noAnswer = []
      // this.templatePre.questions = this.templatePre.questions.filter(item => item.questionType !== 4)
      let answerjson = this.questionList.map(item => ({
        ...item,
        naireId: this.naireId,
        questionId: item.id,
        type: item.questionType
      }))
      answerjson = answerjson.filter(item => item.questionType !== 4)
      answerjson.forEach(item => {
        if (item.type === 1) {
          if (!item.radioId) {
            this.noAnswer.push(item.sort)
          }
        } else if (item.type === 2) {
          if (!item.checkbox || !item.checkbox.length) {
            this.noAnswer.push(item.sort)
          }
          item.checkboxId = item.checkbox.join(',')
        } else if (item.type === 3) {
          if (!item.aswer) {
            this.noAnswer.push(item.sort)
          }
        }
      })
      if (this.noAnswer.length > 0) {
        // this.remind = true
        this.$message({
          message: `您有未作答的题目:${this.noAnswer.join(',')}`,
          type: 'warning'
        })
        this.clickState = false
        return
      }
      this.$https.post(`/index/naireAnswerSave`, querystring.stringify({
        naireId: this.naireId,
        childId: this.childId,
        childName: this.$route.query.childName || '',
        answerjson: JSON.stringify(answerjson.map(item => ({...item, options: null})))
      })).then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.$router.push('/success')
          // this.$router.push({path: '/finish', query: {showResult: this.showResult, naireId: this.naireId, type: this.type}})
        } else {
          notice(this, res.data.message, 2000)
        }
        this.clickState = false
      })
    },
    getDetail () {
      // 判断是不是消息提醒页面过来
      this.$https.get(`/index/naireDetail?naireId=${this.naireId}&childId=${this.childId}`)
        .then(res => {
          if (res.data.result.type === 3) {
            notice(this, '该问卷为外部问卷', 2000)
            this.isAnswer = 2
            return
          }
          // 判断问卷状态
          let naireState = res.data.result.naireState
          if (Number(res.data.result.answerState) === 1 && naireState !== null && naireState === 2) {
            notice(this, '该问卷调查已结束，您未及时作答。', 2000)
            this.isAnswer = 2
            this.isShow = 2
            return
          }
          let resultState = res.data.result.state
          if (resultState === 0 || resultState === 1) {
            notice(this, '该问卷尚在审核中!', 2000)
            this.isAnswer = 2
            this.isShow = 2
            return
          }
          if (resultState === 3) {
            notice(this, '该问卷已下线!', 2000)
            this.isAnswer = 2
            this.isShow = 2
            return
          }
          if (resultState === 4) {
            notice(this, '该问卷审核未通过!', 2000)
            this.isAnswer = 2
            this.isShow = 2
            return
          }
          this.isAnswer = res.data.result.answerState
          if (Number(this.isAnswer) === 1) {
            this.$https.get(`/index/naireDetail?naireId=${this.naireId}&childId=${this.childId}`)
              .then(res => {
                this.detail = res.data.result
                let i = 0
                this.questionList = res.data.result.questions.map(item => {
                  if (item.questionType === 1) return { ...item, sorts: ++i, radioId: '', options: item.options ? item.options.sort(this.compare('radioboxSort')) : [] }
                  else if (item.questionType === 2) return { ...item, checkbox: [], sorts: ++i, options: item.options ? item.options.sort(this.compare('checkboxSort')) : [] }
                  else if (item.questionType === 3) return { ...item, sorts: ++i, aswer: '' }
                  else return item
                })
              })
          } else {
            if (this.isShow === 2) {
              return
            }
            this.$https.get(`/index/naireUserResult?naireId=${this.naireId}&childId=${this.childId}`)
              .then(res => {
                this.detail = res.data.result
                let i = 0
                this.questionList = res.data.result.questions.map(item => {
                  if (item.questionType === 1) return { ...item, sorts: ++i, radioId: (item.options || []).find(items => items.radioboxFlag) ? (item.options || []).find(items => items.radioboxFlag).radioboxId : '', options: item.options ? item.options.sort(this.compare('radioboxSort')) : [] }
                  else if (item.questionType === 2) return { ...item, sorts: ++i, checkbox: (item.options || []).filter(items => items.checkboxFlag) ? (item.options || []).filter(items => items.checkboxFlag).map(items => items.checkboxId) : [], options: item.options ? item.options.sort(this.compare('checkboxSort')) : [] }
                  else if (item.questionType === 3) return { ...item, sorts: ++i, aswer: item.options ? item.options[0].commonAnswer[0] ? item.options[0].commonAnswer[0].aswer : '' : '' }
                  else return item
                })
              })
          }
        })
    },
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
    }
  },
  created () {
    this.naireId = this.$route.query.id
    this.childId = this.$route.query.childId || ''
    // this.isAnswer = this.$route.query.answerState
    this.getDetail()
    try {
      window.esMobile.hideTitleBar()
    } catch (e) {
      // console.log(e)
    }
  }
}
</script>

<style lang="scss">
.naireDetail {
  > .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    z-index: 100;

    > img {
      float: left;
      vertical-align: middle;
      margin-top: 13px;
    }

    > h3 {
      display: inline-block;
      width: calc(100% - 80px);
      font-size: 14px;
      font-weight: bold;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }

    > .submit {
      float: right;
      color: #5EB2F9;
    }
  }
  .clearfix:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  > .main {
    height: calc(100vh - 50px);
    margin-top: 50px;
    color: #333;
    padding: 10px 20px;

    > p {
      height: 30px;
      line-height: 30px;
    }

    > .num {
      margin-bottom: 20px;
    }

    > ul li {
      margin-bottom: 20px;

      > .name {
        width: 100%;
        min-height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        font-weight: bold;
      }

      .textbox {
        width: 300px;
        height: 80px;
        outline: none;
        -webkit-appearance: none;
        -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        overflow-y: auto;
        resize: none;
        border-color: #ddd !important;
      }
    }
  }

  .el-radio,.el-checkbox {
    display: block;
    width: 300px;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    border-bottom: 0;
    &:last-child {
      border-bottom: 1px solid #ddd;
    }
  }
  .el-radio+.el-radio,.el-checkbox+.el-checkbox {
    margin-left: 0 !important;
  }
}
</style>
