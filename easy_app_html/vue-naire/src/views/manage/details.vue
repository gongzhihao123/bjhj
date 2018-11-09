<template>
  <div id="details">
    <h3 class="h3">{{ name }}
      <el-button @click="router">返回</el-button>
      <el-button type="success" @click="exportResult">导出</el-button>
    </h3>

    <header class="details-header">
      <p>发布人：<span>{{createdName}}</span></p>
      <p>截止时间：<span>{{endTime}}</span></p>
      <p>问卷题数：<span>{{queryNum}}题</span></p>
      <p>答题情况：<span>共需{{needNum ? needNum : 0}}人参加答卷，其中已答卷{{answerCount ? answerCount : 0}}人，未答卷{{noAnswerNum ? noAnswerNum : 0}}人&nbsp;</span>
        <span class="span" @click="naireAnswerSituation" v-if="type !== 1">点击查看答卷情况 ></span>
        <!-- <span class="span" @click="naireAnswerSituation" v-if="type !== 1" v-show="showResult == 1">点击查看答卷情况 ></span> -->
      </p>
    </header>

    <main class="details-main">
      <section v-for="(item, i) in questList" :key="i">
        <div v-if="item.questionType == 1">
          <p>{{item.sorts}}.{{item.name}}</p>
          <ul>
            <li v-for="(items, index) in item.options" :key="index">
              <span class="name">{{items.radioboxName}}　</span>
              <span class="num" :class="{check: showResult == 1}" @click="clickOption(items, item)">{{items.radioboxCount ? items.radioboxCount : 0}}票</span>
              <span class="progress">
                <el-progress :show-text="false" :percentage="items.radioboxCount ? ((items.radioboxCount / item.countAll).toFixed(4) * 100) : 0"></el-progress>
              </span>
              <span class="ratio">{{items.radioboxCount ? Math.round((items.radioboxCount / item.countAll) * 10000) / 100: 0}}%</span>
              <transition name="fade" v-show="showResult == 1">
                <section class="content" v-show="items.show">
                  <span v-for="s in items.answerList" :key="s" @click="route(s)" :class="{check: showResult == 1}" style="cursor: pointer">{{s.user_name}}</span>
                </section>
              </transition>
            </li>
          </ul>
        </div>

        <div v-if="item.questionType == 2">
          <p>{{item.sorts}}.{{item.name}}</p>
          <ul>
            <li v-for="(items, index) in item.options" :key="index">
              <span class="name">{{items.checkboxName}}　</span>
              <span :class="{num: true, check: showResult == 1}" @click="clickOption(items, item)">{{items.checkboxCount ? items.checkboxCount : 0}}票</span>
              <span class="progress">
                <el-progress :show-text="false" :percentage="items.checkboxCount ? ((items.checkboxCount / item.countAll).toFixed(4) * 100) : 0"></el-progress>
              </span>
              <span class="ratio">{{items.checkboxCount ? Math.round((items.checkboxCount / item.countAll) * 10000)/100 : 0}}%</span>
              <transition name="fade" v-show="showResult == 1">
                <section class="content" v-show="items.show">
                  <span v-for="s in items.answerList" :key="s" @click="route(s)" :class="{check: showResult == 1}">{{s.user_name}}</span>
                </section>
              </transition>
            </li>
          </ul>
        </div>

        <div v-if="item.questionType == 3">
          <p>{{item.sorts}}.{{item.name}}</p>
          <section class="details-table">
            <table>
              <thead>
                <tr>
                  <td>内容</td>
                  <td v-show="showResult == 1">答题人</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="items in item.options[0].commonAnswer" :key="items">
                  <td>{{items.aswer}}</td>
                  <td v-show="showResult == 1">{{items.userName}}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <div v-if="item.questionType == 4">
          <p>{{item.name}}</p>
        </div>
        
      </section>
    </main>

    <el-dialog
      :visible.sync="previent"
      :show-close="false"
      top="10%"
      size="tiny">
      <ul class="header" v-if="user.companyType === 1">
        <li v-for="(item, i) in userList" :key="i" :class="{active: userInd == i}" @click="switchIdent(item, i)" >{{ item.name }}</li>
        <i class="el-icon-close" @click="previent = false"></i>
      </ul>
      <ul class="header" v-else>
        <li v-for="(item, i) in userLists" :key="i" :class="{active: userInd == i}" @click="switchIdent(item, i)" >{{ item.name }}</li>
        <i class="el-icon-close" @click="previent = false"></i>
      </ul>
      <table>
        <tr>
          <td>已作答
            <p>({{ answerNum }})</p>
          </td>
          <td>
            <section>
              <span v-for="(item, index) in respondenceList" :key="index" v-show="item.answerState == 2">{{item.userName}}</span>
            </section>
          </td>
        </tr>
        <tr>
          <td>未作答
            <p>({{ awaitNum }})</p>
          </td>
          <td>
            <section>
              <span v-for="(item, index) in respondenceList" :key="index" v-show="item.answerState == 1">{{item.userName}}</span>
            </section>
          </td>
        </tr>
      </table>
    </el-dialog>





  </div>
</template>

<script>
import { dateFormat } from '../../filters/index.js'
import { mapGetters } from 'vuex'
import { notice, error } from '../../api/index.js'
export default {
  name: 'details',
  data () {
    return {
      name: '',
      createdName: '',
      endTime: '',
      queryNum: 0,
      needNum: 0,
      answerNum: 0,
      awaitNum: 0,
      answerCount: 0,
      noAnswerNum: 0,
      previent: false,
      userList: [
        { name: '全部' },
        { name: '教师', type: 1 },
        { name: '学生', type: 2 },
        { name: '家长', type: 3 }
      ],
      userLists: [
        { name: '全部' },
        { name: '员工', type: 1 },
        { name: '学生', type: 2 },
        { name: '家长', type: 3 },
        { name: '外部单位', type: 4 }
      ],
      userInd: 0,
      questList: [],
      naireId: '',
      respondenceList: [],
      notRespondenceList: [],
      type: '',
      questId: '',
      optionsId: '',
      teachAnswerList: [],
      studentAnswerList: [],
      familyAnswerList: [],
      orderList: [],
      showResult: false
    }
  },
  computed: {
    exportUrl () {
      let path = document.querySelector('contextPath').value
      return `${path}/`
    },
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    switchIdent (item, i) {
      this.userInd = i
      if (item.type === 1) {
        this.respondenceList = this.teachAnswerList
      } else if (item.type === 2) {
        this.respondenceList = this.studentAnswerList
      } else if (item.type === 3) {
        this.respondenceList = this.familyAnswerList
      } else if (item.type === 4) {
        this.respondenceList = this.orderList
      } else {
        this.naireAnswerSituation()
      }
      this.answerNum = this.respondenceList.filter(item => item.answerState === 2).length
      this.awaitNum = this.respondenceList.filter(item => item.answerState === 1).length
    },
    // 查看问卷结果
    detail () {
      this.$https.get(`/manage/naireAnswerDetail?naireId=${this.naireId} `)
      .then(res => {
        if (res.data.code === 1) {
          let obj = res.data.result
          this.list = obj
          this.name = obj.title
          this.showResult = obj.joinWay === 1 ? 1 : false
          this.createdName = obj.createdUserName
          this.endTime = dateFormat(obj.endTime, 'yyyy-MM-dd hh:mm:ss')
          this.queryNum = obj.questions.filter(item => item.questionType !== 4).length
          this.needNum = res.data.result.userCount
          this.answerCount = res.data.result.answeredCount
          this.noAnswerNum = this.needNum - this.answerCount
          this.type = obj.type
          this.questList = obj.questions
          // this.questList.forEach(item => {
          //   item.options = item.options.map(items => ({...items, show: false, questionType: item.questionType, questId: item.id}))
          // })
          let i = 1
          this.questList.forEach(item => {
            item.options = item.options.map(items => ({...items, show: false, questionType: item.questionType}))
            if (item.questionType !== 4) {
              item.sorts = i++
            }
            if (item.questionType === 1) {
              item.countAll = 0
              item.options.forEach(items => {
                item.countAll += items.radioboxCount
              })
            } else if (item.questionType === 2) {
              item.countAll = 0
              item.options.forEach(items => {
                item.countAll += items.checkboxCount
              })
            }
          })
        } else if (res.data.code === -2) {
          error(this)
        }
      })
    },
    // 导出问卷结果  暂时没好
    exportResult () {
      let con = document.getElementById('contextPath').value
      window.location.href = `${con}/manage/naireAnswerDetailExport?naireId=${this.naireId}`
      // console.log(window.location.href)
    },
    // 获取答卷情况信息
    naireAnswerSituation () {
      this.previent = true
      this.$https.get(`/manage/naireAnswerSituation?naireId=${this.naireId}`)
      .then(res => {
        this.respondenceList = res.data.result
        this.teachAnswerList = this.respondenceList.filter(item => item.userType === 1)
        this.studentAnswerList = this.respondenceList.filter(item => item.userType === 2)
        this.familyAnswerList = this.respondenceList.filter(item => item.userType === 3)
        this.orderList = this.respondenceList.filter(item => item.userType === 4)
        if (this.userInd === 0) {
          this.answerNum = this.respondenceList.filter(item => item.answerState === 2).length
          this.awaitNum = this.respondenceList.filter(item => item.answerState === 1).length
        }
      })
    },
    // 查看具体选项答题人
    naireAnswerUserDetail (item, items) {
      this.$https.get(`/manage/naireAnswerUserDetail?questionId=${item.id}&optionId=${this.optionsId}&naireId=${this.naireId}`)
      .then(res => {
        if (res.data.code === 1) {
          // console.log(item)
          this.$set(items, 'answerList', res.data.result)
          // item.answerList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 单击选项
    clickOption (items, item) {
      if (this.type === 1) return
      if (this.showResult !== 1) return
      if (items.questionType === 1) {
        this.optionsId = items.radioboxId
      } else if (items.questionType === 2) {
        this.optionsId = items.checkboxId
      }
      items.show = !items.show
      if (!items.show) return
      this.naireAnswerUserDetail(item, items)
    },
    route (item) {
      let path = document.querySelector('#contextPath').value
      window.open(`${path}/#/answerNaire?naireId=${this.naireId}&userId=${item.user_id}`)
      sessionStorage.obj = this.$route.query.obj
      // this.$router.push({path: '/answerNaire', query: {naireId: this.naireId, userId: item.user_id}})
    },
    router () {
      this.$router.push({path: '/manage', query: {obj: this.$route.query.obj}})
    }
  },
  created () {
    let obj = JSON.parse(this.$route.query.obj)
    this.naireId = obj.naireId
    this.detail()
  }
}
</script>

<style lang="scss">
  @import '../../assets/scss/main.scss';
  #details {
    background: $white;
    position: relative;
    padding: 15px;
    .h3 {
      width: 900px;
      text-align: center;
      line-height: 50px;
      margin: 0 auto;
      font-size: 20px;
      .el-button:nth-child(2) {
        position: absolute;
        right: 16px;
        top: 24px;
        padding-left: 28px;
        font-weight: normal;
        background: url(../../assets/images/export.png) no-repeat 8px center #42d885;
      }
      .el-button:nth-child(1) {
        position: absolute;
        right: 96px;
        top: 24px;
        font-weight: normal;
      }
    }
    .details-header {
      border: 1px solid $border;
      padding: 0 10px;
      p {
        line-height: 36px;
        color: #666;
        .span {
          color: #53a7ef;
          cursor: pointer;
        }
        span {
          color: #333;
        }
      }
    }
    .details-main {
      margin: 20px 0;
      p {
        line-height: 40px;
      }
      ul {
        li {
          overflow: hidden;
          
          line-height: 40px;
          border: 1px solid $border;
          border-bottom: none;
          box-sizing: border-box;
          min-height: 40px;
          position: relative;
          // overflow: hidden;
          &:last-child {
            border-bottom: 1px solid $border;
          }
          &:nth-child(odd) {
            background: #f5f5f5;
            .el-progress-bar__outer {
              background: #f5f5f5;
            }
          }
          span {
            display: inline-block;
            border-right: 1px solid $border;
            float: left;
          }
          .name {
            width: 50%;
            padding-left: 20px;
          }
          .num {
            width: 80px;
          }
          .check {
            cursor: pointer;
            color: blue;
            text-decoration: underline;
          }
          .progress {
            width: 400px;
            
          }
          .ratio {
            width: 50px;
            border-right: none;
          }
          .el-progress-bar__outer {
            box-sizing: border-box;
            height: 40px !important;
            border-radius: 0;
            background: #fff;
            .el-progress-bar__inner {
              background: #ff6263;
              border-radius: 0;
            }
          }
          &:nth-child(2) {
            .el-progress-bar__inner {
              background: #ffc45c;
            }
          }
          &:nth-child(3) {
            .el-progress-bar__inner {
              background: #20ce52;
            }
          }
          &:nth-child(4) {
            .el-progress-bar__inner {
              background: #4fb3ff;
            }
          }
          &:nth-child(5) {
            .el-progress-bar__inner {
              background: #505cff;
            }
          }
          &:nth-child(6) {
            .el-progress-bar__inner {
              background: #ed45cc;
            }
          }
          .content {
            clear: both;
            max-height: 320px;
            overflow: auto;
            background: #fffaf1;
            display: block;
            span {
              border: none;
              height: 40px;
              display: inline-block;
              margin-right: 16px;
            }
          }
        }
      }
      .details-table {
        max-height: 400px;
        overflow: auto;
      }
      table {
        width: 1150px;
        td {
          &:first-child {
            width: 1000px;
          }
          &:nth-child(2) {
            text-align: center;
          }
        }
        thead {
          color: #B4B4B4;
        }
        tbody {
          tr {
            line-height: 40px;
            border: 1px solid $border;
            border-bottom: none;
            box-sizing: border-box;
            min-height: 40px;
            position: relative;
            // overflow: hidden;
            &:last-child {
              border-bottom: 1px solid $border;
            }
            &:nth-child(odd) {
              background: #f5f5f5;
            }
            td:first-child {
              border-right: 1px solid $border;
            }
          }
        }
      }
    }
    .el-dialog {
      width: 1200px;
      .el-dialog__header {
        display: none;
      }
      .header {
        li {
          display: inline-block;
          margin: 10px 16px;
          cursor: pointer;
          &.active {
            color: $theme;
            border-bottom: 2px solid $theme;
          }
        }
        i {
          float: right;
          cursor: pointer;
        }
      }
      table {
        width: 100%;
        margin: 18px 0;
        td {
          height: 260px;
          border: 1px solid $border;
          overflow: auto;
          position: relative;
          &:first-child {
            width: 72px;
            text-align: center;
          }
          section {
            position: absolute;
            top: 0;
            width: 100%;
            line-height: 24px;
            span {
              display: inline-block;
              margin: 0 12px;
            }
          }
        }
      }
    }
  }
</style>
