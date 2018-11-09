<template>
  <div id="home">
      <header class="index-header">
        <div class="top-header">
          <div class="head-left">
            <img src="../assets/images/logo.png" ondragstart="return false;" @click="route({path: '/index'}, 0)">
            <span class="title" @click="route({path: '/index'}, 0)">问卷调查</span>
          </div>
          <ul class="nav" v-show="!isIndex">
            <!--<li v-for="(item, index) in leftMenu" :key="index" :class="{active: activeIndex === index}" @click="route(item, index)">
              {{item.name}}
            </li>-->
            <li v-for="(item, index) in leftMenu" :key="index">
              <!--{{item.name}}-->
              <router-link active-class="active" :to='item.path'>{{item.name}}
              </router-link>
            </li>
          </ul>
          <div class="head-right" v-if="!visitor">
            
            <el-dropdown>
              <span class="el-dropdown-link">
                <img :src="user.userFace" ondragstart="return false;" v-if="user.userFace">
                <span class="users" v-else>{{ user.name.slice(-2) }}</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logouts">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </header>
      <div class="main">
        <transition name="list">
          <router-view></router-view>
        </transition>
      </div>
      <footer class="education-index-foot">
        <p>Copyright @2017-2027 北京怀教网络科技股份有限公司 All Right Reserved</p>
        <p>联系电话：4008-135-136</p>
      </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { logout } from '../api/index.js'
export default {
  name: 'home',
  data () {
    return {
      username: '',
      isIndex: true,
      activeIndex: 0,
      navList: [
        {name: '创建问卷', path: '/created'},
        {name: '问卷管理', path: '/manage'},
        {name: '问卷设置', path: '/set'},
        {name: '问卷审核', path: '/audit'}
      ],
      visitor: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'leftMenu'
    ])
  },
  created () {
    if (this.$route.meta.state !== -1) {
      this.isIndex = false
    }
    if (sessionStorage.index) {
      this.activeIndex = Number(sessionStorage.index)
    }
    const href = window.location.href
    let url = href.slice(href.indexOf('#') + 1)
    if (url.indexOf('/answers') > -1) {
      this.visitor = true
    }
  },
  methods: {
    route (item, index) {
      this.activeIndex = index
      sessionStorage.index = index
      this.$router.push(item.path)
    },
    back () {
      this.$confirm('确定要退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logout()
      }).catch((error) => {
        console.log(error)
      })
    },
    logouts () {
      logout()
    }
  },
  watch: {
    $route () {
      if (sessionStorage.index) {
        this.activeIndex = Number(sessionStorage.index) ? Number(sessionStorage.index) : 0
      }
      if (this.$route.meta.state === -1) {
        this.isIndex = true
      } else {
        this.isIndex = false
      }
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1250px) {
  #home {
    padding-top: 56px;
    .index-header {
      height: 50px;
      width: 100%;
      line-height: 50px;
      background: #fff;
      border-bottom: 1px solid #e4e4e4;
      vertical-align: center;
      position: fixed;
      z-index: 10;
      top: 0;
      .top-header{
        margin: 0 auto;
        width: 100%;
        .head-left {
          float: left;
          &>img {
            float: left;
            margin-right: 10px;
            margin-top: 6px;
          }
          .title {
            font-family: 微软雅黑;
            color: #333;
            font-size: 22px;
            letter-spacing: 2px;
            // font-weight: bold;
          }
          * {
            cursor: pointer;
          }
        }
        .head-right{
          float: right;
          color: #333;
          line-height: 50px;
          .el-dropdown-link>img {
            padding: 0;
            float: left;
            margin-top: 10px;
            margin-right: 10px;
            box-sizing: border-box;
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }

          .el-dropdown-link>.users {
            display: inline-block;
            width: 28px;
            height: 28px;
            background: #ccc;
            vertical-align: middle;
            line-height: 28px;
            text-align: center;
            color: #fff;
            border-radius: 50%;
            font-size: 12px;
          }
        }
        .nav {
          width: 100%;
          left: 40px;
          position: relative;
          font-size: 16px;
          li {
            height: 50px;
            // box-sizing: border-box;
            text-align: center;
            width: 80px;
            float: left;
            margin-right: 36px;
            cursor: pointer;
            // padding-top:10px;
            a {
              display: block;
              color: #333;
              height: 50px;
              line-height: 56px;
              box-sizing: border-box;
            }
            a:hover {
              color: #19b955;
            }
            a.active {
              color: #19b955;
              border-bottom: 3px solid #19b955;
            }
          }
          li:hover{
            color: #19b955;
          }
          li.active{
            border-bottom: 3px solid #19b955;
          }
        }
      }

      .users {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: #ccc;
        vertical-align: middle;
        line-height: 28px;
        text-align: center;
        color: #fff;
        border-radius: 50%;
        font-size: 12px;
      }
    }
    .main {
      width: 100%;
      // margin-top: 100px;
    }
    footer.education-index-foot {
      padding: 10px;
      color: #989898;
      text-align: center;
      line-height: 22px;
      font-size: .9rem;
      box-sizing: border-box;
      border-top: 1px solid #d1d1d1;
    }


    .el-dropdown-menu {
      text-align: center;
    }
  }
}
@media screen and (min-width: 1250px) {
  #home {
    padding-top: 56px;
    .index-header {
      height: 50px;
      width: 100%;
      min-width: 1200px;
      line-height: 50px;
      background: #fff;
      border-bottom: 1px solid #e4e4e4;
      vertical-align: center;
      position: fixed;
      z-index: 10;
      top: 0;
      .top-header{
        margin: 0 auto;
        max-width: 1200px;
        .head-left {
          float: left;
          &>img {
            float: left;
            margin-right: 10px;
            margin-top: 6px;
          }
          .title {
            font-family: 微软雅黑;
            color: #333;
            font-size: 22px;
            letter-spacing: 2px;
            // font-weight: bold;
          }
          * {
            cursor: pointer;
          }
        }
        .head-right{
          float: right;
          color: #333;
          line-height: 50px;
          .el-dropdown-link>img {
            padding: 0;
            float: left;
            margin-top: 10px;
            margin-right: 10px;
            box-sizing: border-box;
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }

          .el-dropdown-link>.users {
            display: inline-block;
            width: 28px;
            height: 28px;
            background: #ccc;
            vertical-align: middle;
            line-height: 28px;
            text-align: center;
            color: #fff;
            border-radius: 50%;
            font-size: 12px;
          }
        }
        .nav {
          min-width: 700px;
          left: 40px;
          position: relative;
          font-size: 16px;
          li {
            height: 50px;
            // box-sizing: border-box;
            text-align: center;
            width: 80px;
            float: left;
            margin-right: 36px;
            cursor: pointer;
            // padding-top:10px;
            a {
              display: block;
              color: #333;
              height: 50px;
              line-height: 56px;
              box-sizing: border-box;
            }
            a:hover {
              color: #19b955;
            }
            a.active {
              color: #19b955;
              border-bottom: 3px solid #19b955;
            }
          }
          li:hover{
            color: #19b955;
          }
          li.active{
            border-bottom: 3px solid #19b955;
          }
        }
      }

      .users {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: #ccc;
        vertical-align: middle;
        line-height: 28px;
        text-align: center;
        color: #fff;
        border-radius: 50%;
        font-size: 12px;
      }
    }
    .main {
      width: 1200px;
      min-height: 700px;
      margin: 16px auto;
      // margin-top: 100px;
    }
    footer.education-index-foot {
      position: absolute;
      left: 0;
      right: 0;
      // bottom: 0;
      margin: 0 auto;
      width: 1200px;
      height: 102px;
      color: #989898;
      text-align: center;
      line-height: 22px;
      font-size: 12px;
      padding-top: 32px;
      box-sizing: border-box;
      border-top: 1px solid #d1d1d1;
    }


    .el-dropdown-menu {
      text-align: center;
    }
  }
}
</style>
