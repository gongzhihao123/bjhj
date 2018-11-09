<template>
  <div id="app">
    <transition name="list" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  async mounted () {
    await this.$store.dispatch('init')
  }
}
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
