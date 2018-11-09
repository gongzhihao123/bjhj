<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <header class="head">
      <span class="left" @click="callback">返回</span>
      <span class="center">成绩查询</span>
      <span class="left"></span>
    </header>
    <router-view/>
  </div>
</template>

<script>
import { setupWebViewJavascriptBridge } from '@/utils/setupWeb.js'
export default {
  name: 'App',
  methods: {
    callback () {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('finishBack', {'back': true}, function (response) {
          console.log(response)
        })
      })
      try {
        window.esMobile.finishBack()
      } catch (err) {
        console.log(err)
      }
    }
  },
  beforeCreate () {
    this.$store.dispatch('init')
  },
  created () {
    window.onresize = function () {
      fnResize()
    }
    function fnResize () {
      var deviceWidth = document.documentElement.clientWidth || window.innerWidth
      if (deviceWidth >= 750) {
        deviceWidth = 750
      }
      if (deviceWidth <= 320) {
        deviceWidth = 320
      }
      document.documentElement.style.fontSize = (deviceWidth / 7.5) + 'px'
    }
    fnResize()
    try {
      window.esMobile.hideTitleBar()
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="scss">
#app {
  background: #f1f2f7;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  font-size: 12px;

  .head {
    display: flex;
    height: 1rem;
    text-align: center;
    line-height: 1rem;
    background: #000000;
    color: #fff;
    font-size: 16px;

    > span {
      display: inline-block;
      box-sizing: border-box;
    }

    .left {
      width: 80px;

      &:first-child {
        padding-left: 0.6rem;
        text-align: left;
        background: url(./assets/images/return.png) no-repeat .1rem center;
      }
    }

    .center {
      flex-grow: 1;
    }
  }
}
</style>
