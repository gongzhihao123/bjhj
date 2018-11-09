<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {}
  },
  async created () {
    const href = window.location.href
    let url = href.slice(href.indexOf('#') + 1)
    this.$store.dispatch('init', { url })
    if (window.esMobile) {
      window.esMobile.hideTitleBar()
      try {
        window.esMobile.hideTitleBar()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/index.scss';
#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  ::-webkit-scrollbar {
    width: 5px;
    // display: none;
  }
}
</style>
