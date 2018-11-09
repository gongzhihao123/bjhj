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

<style lang="scss">
@import '../assets/scss/variable.scss';
@import '../assets/scss/mixin.scss';
@import '../assets/scss/index.scss';

#app {
  // position: absolute;
  // top: 0px;
  // bottom: 0px;
  // right: 0px;
  // left: 0px;
  // min-width: 1366px;
  // width: 100%;
  background: #EFF1F2;
}
</style>
