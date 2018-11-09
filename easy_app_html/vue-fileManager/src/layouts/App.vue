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
  watch: {
    '$route' (to, form) {
      if (to.name === 'lookfolder') {
        this.$store.dispatch('uploadBtn', true)
      } else {
        this.$store.dispatch('uploadBtn', false)
      }
    }
  }
}
</script>

<style>

</style>
