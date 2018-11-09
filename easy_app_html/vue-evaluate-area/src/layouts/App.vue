<template>
  <div id="app">
    <div class="header" v-if="show">
      <img src="../assets/images/logo.png">
      <i>测评考核</i>
      <span>
        <img class="face" v-if="userFace" :src="userFace">
        <img class="face" v-else src="../assets/images/bpeople.png">
        <span>{{name}}</span>
        <el-tooltip content="退出" placement="bottom" effect="light">
          <img @click="logout" src="../assets/images/logout.png">
        </el-tooltip> 
      </span>
    </div>
    <transition name="fadeIn" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      show: true,
      name: '',
      userFace: ''
    }
  },
  computed: {
    ...mapGetters([
      'active',
      'user'
    ])
  },
  methods: {
    logout () {
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/logout`
    }
  },
  created () {
    setTimeout(() => {
      this.name = this.user.name
      this.userFace = this.user.userFace
    }, 600)
  },
  beforeCreate () {
    let lessThenIe8 = (function () {
      let UA = navigator.userAgent
      let isIE = UA.indexOf('MSIE') > -1
      let v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie'
      return v < 8
    }())
    if (lessThenIe8) {
      window.alert('您使用的浏览器版本过低请使用ie9及其以上版本')
    }
    const href = window.location.href
    let url = href.slice(href.indexOf('#') + 1)
    if (url === '/') {
      url = '/myComment/index'
    }
    this.$store.dispatch('init', {url})
  }
}
</script>

<style lang="scss">
@import '../assets/scss/main.scss';
#app {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100%;
  min-width: 1366px;
  background: #F0F0F0;
  .header{
    padding: 0 $width;
    height: $width*3;
    background: #1CB9FE;
    line-height: $width*3;
    color: $white;
    &>img{
      vertical-align: middle;
      // cursor: pointer;
      margin-top: 8px;
      float: left;
    }
    &>i{
      font-style: normal;
      font-size: 26px;
      margin-left: $width;
    }
    &>span{
      float: right;
      .face{
        vertical-align: middle;
        width: 33px;
        border-radius: 50%;
      }
      span{
        margin: 0 5px;
      }
      img:last-child{
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }
}
</style>
