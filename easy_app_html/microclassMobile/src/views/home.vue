<template>
    <div id="home">
        <!-- <transition name="list" mode="out-in"> -->
          <router-view></router-view>
        <!-- </transition> -->
      </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style lang="scss" scoped>
  #home {
    width: 100%;
    height: calc(100vh);
  }
</style>
