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
  background: #EFF1F2;
}
</style>
