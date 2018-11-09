<template>
  <div class="history"  v-touch:swipe.bottom='touchBottom'>
    <div v-for="(year, index) in mouth" :key="index" class="year-list">
      <div class="year-title item">{{ year.name }}</div>
      <div
        v-for="(mouth, n) in year.children" 
        :key="n" 
        class="mouth-list item"
        :class="{ 'disabled': mouth.disabled }"
        v-if="!mouth.disabled"
        @click="jump(mouth)">
        <div>
          <p class="mouth-title">{{ mouth.name }}</p>
          <time>{{ mouth.createTime }}</time>
        </div>
        <div class="mouth-total">
          <p>{{ mouth.total }}</p>
          <span v-if="mouth.disabled">已撤回</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setupWebViewJavascriptBridge } from './../utils/setupWeb.js'
import { format } from '../utils/timetTranslate'
export default {
  name: 'history',

  data () {
    return {
      list: [],
      mouth: []
    }
  },

  methods: {
    async touchBottom () {
      await this.$store.dispatch('history')
      try {
        window.esMobile.finishRefreshing()
      } catch (e) {
        console.log(e)
      }
      this.list = this.$store.state.list
      var arr = []
      for (var i = 0; i < this.list.length; i++) {
        arr.push(this.list[i].month.toString().substr(0, 4))
      }
      arr = Array.from(new Set(arr))
      this.mouth = []
      for (var s = 0; s < arr.length; s++) {
        this.mouth.push({name: arr[s], children: []})
      }
      for (var z = 0; z < this.mouth.length; z++) {
        for (var j = 0; j < this.list.length; j++) {
          if (this.mouth[z].name === this.list[j].month.toString().substr(0, 4)) {
            var json = {}
            if (this.list[j].state === 2) {
              json.disabled = true
            }
            json.salaryUserId = this.list[j].salaryUserId
            json.name = Number(this.list[j].month.toString().substr(4, 2)) + '月工资单' + (Number(this.list[j].month.toString().substr(6)) === 1 ? '' : '(' + Number(this.list[j].month.toString().substr(6)) + ')')
            json.total = this.list[j].totalMoney
            json.createTime = format(this.list[j].publishTime, 'MM-dd hh:mm')
            this.mouth[z].children.push(json)
          }
        }
      }
    },
    async jump (item) {
      document.title = item.name + '明细'
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('historyPage', {'login': item.name + '明细'}, function (response) {
          console.log(response)
        })
      })
      try {
        window.esMobile.homePage(item.name + '明细')
      } catch (e) {
        console.log(e)
      }

      if (item.disabled) {
        await this.$store.dispatch('withdraw')
      }
      await this.$store.dispatch('historyList', item.salaryUserId)
      this.$store.dispatch('others', item.salaryUserId)
      this.$router.push({path: '/detail'})
    }
  },

  async mounted () {
    var _this = this
    window['startRefresh'] = (text) => {
      _this.touchBottom()
    }
    await this.$store.dispatch('history')
    document.title = '历史管理'
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('historyPage', {'login': '历史管理'}, function (response) {
        console.log(response)
      })
    })
    try {
      window.esMobile.homePage('历史管理')
      window.esMobile.setHaveRefresh(true)
      window.esMobile.setCanManageBack(false)
      window.esMobile.showRightButton(false)
    } catch (e) {
      console.log(e)
    }
    this.list = this.$store.state.list
    var arr = []
    for (var i = 0; i < this.list.length; i++) {
      arr.push(this.list[i].month.toString().substr(0, 4))
    }
    arr = Array.from(new Set(arr))
    for (var s = 0; s < arr.length; s++) {
      this.mouth.push({name: arr[s], children: []})
    }
    for (var z = 0; z < this.mouth.length; z++) {
      for (var j = 0; j < this.list.length; j++) {
        if (this.mouth[z].name === this.list[j].month.toString().substr(0, 4)) {
          var json = {}
          if (this.list[j].state === 2) {
            json.disabled = true
          }
          json.salaryUserId = this.list[j].salaryUserId
          json.name = Number(this.list[j].month.toString().substr(4, 2)) + '月工资单' + (Number(this.list[j].month.toString().substr(6)) === 1 ? '' : '(' + Number(this.list[j].month.toString().substr(6)) + ')')
          json.total = this.list[j].totalMoney
          json.createTime = format(this.list[j].publishTime, 'MM-dd hh:mm')
          this.mouth[z].children.push(json)
        }
      }
    }
  }

}
</script>

<style scoped lang="scss">
@import '../assets/scss/variable.scss';

.history {

  >.year-list {
    .item {
      padding: 1rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e5e5;
    }

    .year-title {
      padding-top: 1.2rem;
      font-size: 1rem;
      color: #999999;
      background: transparent;
    }

    >.mouth-list {
      display: flex;
      justify-content: space-between;
      color: $black;
      font-size: 1.2rem;

      &.disabled {
        background: rgba(0, 0, 0, .05);
        color: $disabled;
      }

      time,
      .mouth-total span {
        font-size: 1rem;
        color: #888888;
      }
    }
  }
}

</style>
