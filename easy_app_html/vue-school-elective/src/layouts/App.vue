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
    this.$store.dispatch('init', { url })
  }
}
</script>

<style scoped>
#app {
  background: #f1f2f7;
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  min-width: 1366px;
}
</style>
