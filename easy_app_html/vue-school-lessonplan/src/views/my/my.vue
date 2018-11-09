<template>
  <div id="my">
      <nav>
        <ul>
          <li v-for="(item, index) in navList" :key="index" @click="rout(item, index)" v-bind:class="{active: n===index}">
            {{item.name}}
          </li>
        </ul>
      </nav>
      <main>
        <transition name="slide-left" mode="out-in">
          <router-view></router-view>  
        </transition>
      </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'my',
  data () {
    return {
      n: 0,
      navList: [
        {name: '我的备课', path: '/my/lesson'},
        {name: '我的协同', path: '/my/collaborate'},
        {name: '我的收藏', path: '/my/collect'},
        {name: '我收到的评价', path: '/my/comment'}
      ]
    }
  },
  methods: {
    rout (item, index) {
      this.n = index
      this.$router.push(item.path)
    }
  },
  computed: {
    ...mapGetters([
      'my'
    ])
  },
  watch: {
    my () {
      this.n = 0
      if (window.location.href.indexOf('/my/collaborate') !== -1) this.n = 1
    }
  },
  created () {
    if (this.$route.meta.manager === 0) {
      this.n = 0
    } else {
      this.n = this.$route.meta.manager
    }
  }
}
</script>

<style lang="scss">
@import  '../../assets/scss/main.scss';
#my {
  width: 100%;
  height: auto;
  margin: 0px;
  padding: 0px;
  // 顶部导航
  nav{
    height: 42px;
    background: #DDE6EF;
    padding-top: $width/2;
    box-sizing: border-box;
    padding-left: 66px;
    position: relative;
    &>ul{
      margin: 0;
      padding: 0;
      overflow: hidden;
      li{
        list-style: none;
        float: left;
        border-radius: 8px;
        padding: 13px;
        padding-top: 6px;
        color: #737C8A;
        margin-right: 10px;
        cursor: pointer;
        &.active{
          background: $white;
          color: #76AEED;
        }
      }
    }
  }
  main{
    margin-top: 10px;
  }
}

</style>
