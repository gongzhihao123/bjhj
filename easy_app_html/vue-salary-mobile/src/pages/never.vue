<template>
    <div class="contents">
      <div class="icon">
        <img src="../assets/images/blank.png" alt="">
        <span>目前没有工资记录</span>
      </div>
    </div>
</template>
<script>
import { setupWebViewJavascriptBridge } from './../utils/setupWeb.js'
export default {
  name: 'never',
  mounted () {
    try {
      window.esMobile.homePage('工资详情')
      window.esMobile.setCanManageBack(true)
    } catch (e) {
      console.log(e)
    }
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('finishBack', {'back': true}, function (response) {
        console.log(response)
      })
      bridge.callHandler('historyPage', {'login': '工资详情'}, function (response) {
        console.log(response)
      })
    })
    window['titleBarBackListener'] = () => {
      try {
        window.esMobile.finishBack()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.contents {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon{
    img {
      display: block;
      margin: 0 auto;
      width: 6rem;
      height: 6rem;
      margin-bottom: .7rem;
    }
    span {
      display: block;
      color: rgba(0, 0, 0, .38);
      font-size: 1rem;
    }
  }
}
</style>

