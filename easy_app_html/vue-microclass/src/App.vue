<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  async created () {
    const href = window.location.href
    let url = href.slice(href.indexOf('#') + 1)
    this.$store.dispatch('init', { url })
  }
}
</script>

<style>
#app {
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  min-width: 1366px;
  width: 100%;
  background: #EAEFF8;
}
</style>
