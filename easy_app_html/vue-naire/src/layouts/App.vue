<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import store from '../store'
import { mapActions } from 'vuex'
export default {
  name: 'app',
  beforeCreate () {
    let lessThenIe8 = (function () {
      let UA = navigator.userAgent
      let isIE = UA.indexOf('MSIE') > -1
      let v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie'
      return v < 8
    }())
    if (lessThenIe8) {
      window.alert('您使用的浏览器版本过低请使用ie9及其以上版本')
    }
    // store.dispatch('init')
  },
  methods: {
    ...mapActions([
      'init'
    ])
  },
  created () {
    const href = window.location.href
    let url = href.slice(href.indexOf('#') + 1)
    if (url.indexOf('/answers') < 0) {
      this.init()
      this.$router.push(`${url}`)
    } else {
      this.$router.push(`${url}`)
    }
  }
}
</script>

<style>
@media screen and (max-width: 1250px) {
  #app {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    overflow: auto;
    background: rgb(245, 245, 245);
  }
}
@media screen and (min-width: 1250px) {
  #app {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    min-width: 1200px;
    position: absolute;
    overflow: auto;
    /*min-height: 960px;*/
    background: rgb(245, 245, 245);
  }
}
</style>
