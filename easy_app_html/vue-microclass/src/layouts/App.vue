<template>
	<div id="app">

      <router-view></router-view>      

	</div>
</template>

<script>
export default {
  name: 'app',
  created () {
    const href = window.location.href
    let url = href.slice(href.indexOf('#') + 1)
    if (url === '/') {
      url = '/square'
    }
    this.$store.dispatch('init', {url})
    // if (url === '/square') {
    //   this.$router.push({path: url, query: {name: '教案广场'}})
    // }
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
  }
}
</script>

<style lang="scss">
	#app {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
    background: #EAF0F9;
    min-width: 1312px;
	}
</style>
