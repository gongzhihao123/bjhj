<template>
  <div id="app">
    <transition :name="transition" mode="out-in">
      <router-view/>      
    </transition>
  </div>
</template>

<script>
import { setupWebViewJavascriptBridge } from './../utils/setupWeb.js'
export default {
  name: 'app',
  data () {
    return {
      transition: 'fade',
      title: '工单管理',
      bools: false
    }
  },
  watch: {
    async '$route' (to, from) {
      if (to.name === 'index') {
        await this.$store.dispatch('indexDetail')
      } else if (to.name === 'detail') {
        let str = Number(this.$store.state.historyList[0].month.toString().substr(4, 2)) + '月工资单' + (Number(this.$store.state.historyList[0].month.toString().substr(6)) === 1 ? '' : '(' + Number(this.$store.state.historyList[0].month.toString().substr(6)) + ')')
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('historyPage', {'login': str + '明细'}, function (response) {
            console.log(response)
          })
        })
        try {
          window.esMobile.homePage(str + '明细')
          window.esMobile.setCanManageBack(false)
        } catch (e) {
          console.log(e)
        }
      }
      if (to.name !== 'history') {
        var _this = this
        try {
          window.esMobile.showRightButton(true)
        } catch (e) {
          console.log(e)
        }
        /* eslint-disable */ // 忽略代码检测
        window['showHistor'] = function () {
          _this.$router.push({path: '/history'})
        }
      }
    }
  },
  async created () {
    await this.$store.dispatch('historyList')
    if (!this.$store.state.historyList.length) {
      this.bools = false
      this.$router.push({path: '/never'})
    }
    if (this.$route.name === 'detail') {
      this.$router.push({path: '/'})
    }
    var title = this.title
    var bools = this.bools
    var _this = this
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('iconHistory', {show: bools, image: 'http://www.meetyuu.com/static/salaryMobile/img/green.png', methods: 'jumpHead'}, function (response) {
        console.log(response)
      })
      bridge.registerHandler('jumpHead', function (data, responseCallback) {
        _this.$router.push({path: '/history'})
      })
    })
  }
}
</script>

<style>
#app {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
}
</style>
