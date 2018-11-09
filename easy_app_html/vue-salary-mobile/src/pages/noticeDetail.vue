<template>
  <div class="notice-detail">
    <div class="content" v-html="content"></div>
  </div>
</template>

<script>
import { setupWebViewJavascriptBridge } from './../utils/setupWeb.js'
export default {
  name: 'notice-detail',
  data () {
    return {
    }
  },
  computed: {
    content () {
      if (this.$store.state.historyList.length) {
        return this.$store.state.historyList[0].remark
      } else {
        return ''
      }
    }
  },
  async mounted () {
    document.title = '公告'
    var _this = this
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('iconHistory', {show: true, image: 'http://www.meetyuu.com/static/salaryMobile/img/green.png', methods: 'jumpHead'}, function (response) {
        console.log(response)
      })
      bridge.registerHandler('jumpHead', function (data, responseCallback) {
        _this.$router.push({path: '/history'})
      })
      bridge.callHandler('historyPage', {'login': '公告'}, function (response) {
        console.log(response)
      })
    })
    try {
      window.esMobile.homePage('公告')
      window.esMobile.showRightButton(false)
      window.esMobile.setCanManageBack(false)
    } catch (e) {
      console.log(e)
    }
    /* eslint-disable */ // 忽略代码检测
    window['showHistor'] = function () {
      _this.$router.push({path: '/history'})
    }
  }
}
</script>

<style scoped lang="scss">
.notice-detail {
  .content {
    padding: 1rem;
    font-size: 1.3rem;
    line-height: 2rem;
  }
}

</style>
