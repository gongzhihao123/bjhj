<template>
  <div class='home'>
    <mt-header title="任务管理">
      <mt-button icon="back" slot="left" @click="route"></mt-button>
      <mt-button slot="right" @click.native="addTask">添加</mt-button>
    </mt-header>

    <div class="search-operation">
      <span @click="search">
        筛选
        <i class="iconfont icon-sanjiao-up" v-if="isSearch"></i>
        <i class="iconfont icon-sanjiao-down" v-else></i>
      </span>

      <sup :class="{ active: typeNum === index }" v-for="(item, index) in typeList" v-if="typeNum === index" :key="index">
        {{ item.name }}、
      </sup>
      <sup :class="{ active: stateNum === index }" v-if="stateNum === index" v-for="(item, index) in stateList" :key="index"> {{ item.name }}、 </sup>
      <sup :class="{ active: labelNum === index }" v-if="labelNum === index" v-for="(item, index) in labelList" :key="index">
        <sup v-if="item.name && item.name.length >= 5"> {{ item.name.slice(0, 4) + '...' }} </sup>
        <sup v-else> {{ item.name }} </sup>
      </sup>

      <i class="iconfont icon-sousuo" @click="searchRoute"></i>

      <transition name="slide-down" mode="out-in">
        <div class="search-option" v-if="isSearch" @click="hide">
          <div>
            <span>
              任务分类
            </span>
            <p>
              <span @click="typeSelect(item, index)" :class="{ active: typeNum === index }" v-for="(item, index) in typeList" :key="index"> {{ item.name }} </span>
            </p>
            <span>
              任务状态
            </span>
            <p>
              <span @click="stateSelect(item, index)" :class="{ active: stateNum === index }" v-for="(item, index) in stateList" :key="index"> {{ item.name }} </span>
            </p>
            <span>
              任务标签
            </span>
            <p>
              <span @click="labelSelect(item, index)" :class="{ active: labelNum === index }" v-for="(item, index) in labelList" :key="index">
                <span v-if="item.name && item.name.length >= 4"> {{ item.name.slice(0, 3) + '...' }} </span>
                <span v-else> {{ item.name }} </span>
              </span>
            </p>
          </div>

        </div>
      </transition>
    </div>

    <main>
      <ul>
        <li v-for="(item, index) in taskList" :key="index" @click="toDetail(item)">
          <p>
            <i> {{ item.finishTime | dateFormat('yyyy-MM-dd HH:mm') }} </i>
            <span v-if="item.title && item.title.length >= 14"> {{ item.title.slice(0, 14) + '...' }} </span>
            <span v-else> {{ item.title }} </span>
          </p>
          <p>
            <i>
              <span  v-if="item.finishedNum === item.totalNum">
                已完成
              </span>
              <span v-else>
                <i style="color: #FF9223;" v-if="item.days < 0">
                  已延期{{ Math.abs(item.days) }}天
                </i>
                <i style="color: #48BB58;" v-else>
                  进行中
                </i>
              </span>
            </i>
            <i>
              <span v-if="item.taskName && item.taskName.length >= 4"> {{ item.taskName.slice(0, 2) + '...' }} </span>
              <span v-else> {{ item.taskName }} </span>
            </i>
            <span>
              <i>
                {{ item.createdUserName }}
              </i>
              完成 {{ item.finishedNum }}/{{ item.totalNum }}
            </span>
            <span v-if="typeNum === 1">
              <i v-if="item.feedbackFlag" style="color: #74BC43;">
               我已完成
              </i>
              <i v-else style="color: #C13108;">
                我未完成
              </i>
            </span>
          </p>
        </li>
      </ul>
      <footer>
        <span v-if="totalCount <= taskList.length">
          没有更多了
        </span>
        <mt-button v-else @click.native="loadMore">加载更多</mt-button>
      </footer>
    </main>
  </div>
</template>

<script>
import { setupWebViewJavascriptBridge } from '../utils/setupWeb.js'
export default {
  name: 'home',
  data () {
    return {
      searchLabel: '',
      searchState: '',
      isSearch: false,
      typeNum: 0,
      typeList: [
        { name: '我负责的' },
        { name: '我参与的' }
      ],
      stateNum: '',
      stateList: [
        { id: 1, name: '已完成' },
        { id: 3, name: '已延期' },
        { id: 2, name: '进行中' }
      ],
      labelNum: 0,
      labelList: [],
      taskList: [],
      pageNo: 0,
      totalCount: 0,
      screeningList: []
    }
  },
  methods: {
    route () {
      sessionStorage.TYPE = ''
      sessionStorage.STATE = ''
      sessionStorage.LABELNUM = ''
      sessionStorage.LABEL = ''
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('finishBack', {}, function (response) {
          console.log(response)
        })
      })
      try {
        window.esMobile.finishBack()
      } catch (e) {
        console.log(e)
      }
    },
    hide (e) {
      if (e.target.className === 'search-option') {
        this.isSearch = false
      }
    },
    toDetail (val) {
      sessionStorage.TASK_MOBILE_TASKID = val.id
      this.$router.push({path: '/detail'})
    },
    addTask () {
      sessionStorage.TASK_DETAIL = ''
      sessionStorage.TASK_USER = []
      this.$router.push('/addTask')
    },
    loadMore () {
      if (this.typeNum === 0) {
        this.chargeList()
      } else if (this.typeNum === 1) {
        this.participateList()
      } else {
        this.overviewList()
      }
    },
    async typeSelect (item, index) {
      this.typeNum = index
      this.pageNo = 0
      this.taskList = []
      sessionStorage.TYPE = index
      sessionStorage.LABEL = ''
      this.labelNum = 0
      if (index === 0) {
        await this.chargeLabelList()
        await this.chargeList()
      } else if (index === 1) {
        await this.participateLabelList()
        await this.participateList()
      } else {
        await this.overviewTaskList()
        await this.overviewList()
      }
    },
    stateSelect (item, index) {
      if (this.stateNum === index) {
        this.stateNum = ''
        this.searchState = ''
      } else {
        this.stateNum = index
        this.searchState = item.id
      }
      sessionStorage.STATE = this.searchState
      this.pageNo = 0
      this.taskList = []
      if (this.typeNum === 0) {
        this.chargeList()
      } else if (this.typeNum === 1) {
        this.participateList()
      } else {
        this.overviewList()
      }
    },
    labelSelect (item, index) {
      this.labelNum = index
      this.searchLabel = item.id
      this.pageNo = 0
      this.taskList = []
      sessionStorage.LABELNUM = index
      sessionStorage.LABEL = this.searchLabel
      if (this.typeNum === 0) {
        this.chargeList()
      } else if (this.typeNum === 1) {
        this.participateList()
      } else {
        this.overviewList()
      }
    },
    searchRoute () {
      this.$router.push({path: '/search', query: {searchLabel: sessionStorage.LABEL, type: sessionStorage.TYPE, searchState: sessionStorage.STATE}})
    },
    search () {
      this.isSearch = !this.isSearch
    },
    // 获取我负责的任务列表
    async chargeLabelList () {
      const data = await this.$store.dispatch('chargeLabelList')
      this.labelList = data
      this.labelList.unshift({ name: '全部', id: '' })
      if (data.length !== 0 && !sessionStorage.LABEL) {
        this.searchLabel = data[0].id
        sessionStorage.LABEL = data[0].id
      }
    },
    // 获取我负责的子任务
    async chargeList () {
      this.pageNo++
      const data = await this.$store.dispatch('chargeList', {
        taskId: sessionStorage.LABEL,
        state: sessionStorage.STATE,
        title: '',
        pageNo: this.pageNo,
        pageSize: 10
      })
      this.totalCount = data.totalCount
      this.taskList = this.taskList.concat(data.list)
    },
    // 获取我参与的任务列表
    async participateLabelList () {
      const data = await this.$store.dispatch('participateLabelList')
      this.labelList = data
      this.labelList.unshift({ name: '全部', id: '' })
      if (data.length !== 0 && !sessionStorage.LABEL) {
        this.searchLabel = data[0].id
        sessionStorage.LABEL = data[0].id
      }
    },
    // 获取我参与的子任务列表
    async participateList () {
      this.pageNo++
      const data = await this.$store.dispatch('participateList', {
        taskId: sessionStorage.LABEL,
        state: sessionStorage.STATE,
        title: '',
        pageNo: this.pageNo,
        pageSize: 10
      })
      this.totalCount = data.totalCount
      this.taskList = this.taskList.concat(data.list)
    },
    //  获取任务总览任务列表
    async overviewTaskList () {
      const data = await this.$store.dispatch('overviewTaskList')
      this.labelList = data
      this.labelList.unshift({ name: '全部', id: '' })
      if (data.length !== 0 && !sessionStorage.LABEL) {
        this.searchLabel = data[0].id
        sessionStorage.LABEL = data[0].id
      }
    },
    // 获取任务总览子任务列表
    async overviewList () {
      this.pageNo++
      const data = await this.$store.dispatch('overviewList', {
        taskId: sessionStorage.LABEL,
        state: sessionStorage.STATE,
        title: '',
        pageNo: this.pageNo,
        pageSize: 10
      })
      this.totalCount = data.totalCount
      this.taskList = this.taskList.concat(data.list)
    }
  },
  watch: {
  },
  async created () {
    if (!sessionStorage.TYPE) {
      sessionStorage.TYPE = 0
    }
    if (sessionStorage.LABELNUM) {
      this.labelNum = Number(sessionStorage.LABELNUM)
    }
    if (sessionStorage.STATE === '1') {
      this.stateNum = 0
    } else if (sessionStorage.STATE === '3') {
      this.stateNum = 1
    } else if (sessionStorage.STATE === '2') {
      this.stateNum = 2
    }
    setTimeout(() => {
      if (this.$store.state.user.loginUser.adminFlag) {
        this.typeList.push({ name: '任务总览' })
      }
    }, 400)
    if (sessionStorage.TYPE === '0') {
      this.typeNum = 0
      await this.chargeLabelList()
      await this.chargeList()
    } else if (sessionStorage.TYPE === '1') {
      this.typeNum = 1
      await this.participateLabelList()
      await this.participateList()
    } else if (sessionStorage.TYPE === '2') {
      this.typeNum = 2
      await this.overviewTaskList()
      await this.overviewList()
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/mixin.scss';
.home {
  background: #fff;
  height: 100%;
  &>header {
    background: #fff;
    color: #4B4B4B;
    height: 96px;
    padding: 0 30px;
    i {
      font-size:  30px;
    }
    h1 {
      line-height: 96px;
      font-size: 36px;
    }
    .mint-button-text {
      font-size: 32px;
    }
  }

  &>.search-operation {
    padding: 20px;
    background: #F3F3F3;
    &>span {
      display: inline-block;
      border: 2px solid #EBEBEB;
      padding: 0 20px;
      text-align: center;
      background: #fff;
      border-radius: 30px;
      width: 186px;
      height: 58px;
      line-height: 58px;
      vertical-align: middle;
      font-size: 32px;
      &>i {
        float: right;
        font-size: 36px;
      }
    }
    &>i {
      float: right;
      font-size: 42px;
    }
    sup {
      font-size: 26px;
    }
    .search-option {
      position: absolute;
      left: 0;
      right: 0;
      top: 185px;
      bottom: 0;
      background-color: rgba(203,203,203,0.5);
      &>div {
        background: #F3F3F3;
        padding: 20px;
        padding-top: 0;
        max-height: 96%;
        overflow-x: hidden;
        &>span {
          display: inline-block;
          margin: 24px 0 0px;
          font-size: 24px;
          color: #A9A9A9;
        }
        &>p {
          &>span {
            display: inline-block;
            width: 29%;
            height: 68px;
            margin-top: 20px;
            margin-right: 20px;
            font-size: 28px;
            color: #4A4A4A;
            background: #fff;
            border-radius: 34px;
            text-align: center;
            line-height: 68px;
            border: 2px solid transparent;
            &.active {
              background: #EAF9FD;
              border: 2px solid #6BB0F7;
              color: #6BB0F7;
            }
          }
        }
      }
    }
  }

  &>main {
    width: 100%;
    background: #fff;
    height: 82%;
    overflow-x: hidden;
    ul {
      li {
        padding: 20px 30px;
        border-bottom: 4px solid #F1F2F4;
        &:active {
          background: #F3F3F3;
        }
        i {
          font-style: normal;
          // font-size: 24px;
        }
        span {
          font-size: 28px;
        }
        &>p:nth-child(1) {
          &>i {
            color: #A3A3A3;
            font-size: 24px;
            float: right;
          }
          span {
            font-size: 32px;
          }
        }
        &>p:nth-child(2) {
          margin-top: 10px;
          &>i:nth-child(1) {
            line-height: 40px;
            color: #A3A3A3;
            float: right;
            font-size: 24px;
          }
          &>i:nth-child(2) {
            display: inline-block;
            width: 100px;
            height: 38px;
            text-align: center;
            line-height: 38px;
            border-radius: 20px;
            color: #0D8DD3;
            border: 4px solid #0D8DD3;
            span {
              font-size: 24px;
            }
          }
          &>span:nth-child(3) {
            i {
              border-right: 2px solid #8F8F8F;
              padding-right: 4px;
              margin-right: 10px;
              font-size: 28px;
            }
          }
        }
      }
    }

    footer {
      text-align: center;
      padding: 20px;
      .mint-button {
        padding: 20px 60px;
        line-height: 8px;
        .mint-button-text {
          font-size: 26px;
        }
      }
    }
  }
}
</style>
