<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',

  watch: {
    $route (to, from) {
      this.$nextTick(() => {
        const homePage = document.querySelector('.homePage')
        homePage.scrollTo(0, 0)
      })
    }
  },

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
    const href = window.location.href
    let url = href.slice(href.indexOf('#') + 1)
    this.$store.dispatch('init', { url })
  }
}
</script>

<style scoped>
#app {
  /* background: #f1f2f7; */
  /* position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px; */
  /* width: 100%; */
}
</style>
