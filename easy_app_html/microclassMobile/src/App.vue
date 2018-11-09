<template>
  <div id="app">
    <transition name='list' mode='out-in'>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    const href = window.location.href
    let url = href.slice(href.indexOf('#') + 1)
    this.$store.dispatch('init', { url })
    window.esMobile.hideTitleBar()
    try {
      window.esMobile.hideTitleBar()
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style>
#app {
}
</style>
