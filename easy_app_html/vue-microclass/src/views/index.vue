<template>
  <div id="index">
    <!-- 头部 -->
    <div class="head">
      <img src="../assets/images/logoIcon.png">
      <span class="title">微课管理</span>
      <div class="userInfo">
        <el-dropdown>
          <span class="el-dropdown-link">
            <img :src="user.userFace" v-if="user.userFace" class="pic">
            <span class="nametip" v-if="!user.userFace && user.name">{{user.name.slice(user.name.length - 2, user.name.length)}}</span>
            <a class="person">{{user.name}}</a>
          </span>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px;">
            <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 内容 -->
    <main>
      <!-- 左导航 -->
      <div class="left-menu">
        <el-menu
          @open="handleOpen"
          :default-active="defaultPath"
          class="el-menu-vertical-demo"
          router
          unique-opened
          background-color="#4D5F84"
          text-color="#A4ADC0"
          active-text-color="#fff">
          <template v-for="(item, index) in leftMenu">
            <el-menu-item :key="index" @click.native="route(item)" :index="item.urlPath">
              <span>{{ item.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>

      <!-- 右内容 -->
      <div class="right-content">
        <router-view/>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      user: {},
      defaultPath: '',
      leftMenu: []
    }
  },
  watch: {
    '$route' (to) {
      this.defaultPath = to.path
      if (to.path !== '/course' && to.path !== '/check') {
        sessionStorage.path = to.path
      }
      this.defaultPath = sessionStorage.path
      // if (this.defaultPath === '/course') {
      //   this.defaultPath = sessionStorage.path
      // } else if (this.defaultPath === '/check') {
      //   // this.defaultPath = '/check'
      // }
    }
  },
  methods: {
    route (item) {
      sessionStorage.path = item.urlPath
    },
    handleOpen (key, keyPath) {
      this.$router.push(this.leftMenu[key].pathUrl)
    },
    logout () {
      const path = document.getElementById('contextPath').value
      window.location.href = `${path}/logout`
      sessionStorage.path = ''
    }
  },
  created () {
    if (sessionStorage.path) {
      this.defaultPath = sessionStorage.path
      sessionStorage.path = ''
    } else {
      this.defaultPath = this.$route.path
    }
    function compare (property) {
      return function (obj1, obj2) {
        var value1 = obj1[property]
        var value2 = obj2[property]
        return value1 - value2
      }
    }
    setTimeout(() => {
      this.user = this.$store.state.user.loginUser
      this.leftMenu = this.$store.state.user.rightList
      this.leftMenu.forEach(item => {
        if (item.name === '微课广场') {
          item.urlPath = '/square'
          item.num = 0
        } else if (item.name === '我的微课') {
          item.num = 1
          item.urlPath = '/my'
        } else if (item.name === '微课管理') {
          item.num = 2
          item.urlPath = '/manage'
        } else if (item.name === '功能设置') {
          item.urlPath = '/set'
          item.num = 3
        }
      })
      this.leftMenu = this.leftMenu.sort(compare('num'))
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
  #index {
    min-width: 1366px;
    background: #EAEFF8;
    .pic {
      width: 50px;
      height: 50px;
      display: block;
      float: left;
      border-radius: 100%;
      margin-top: 15px;
      margin-right: 10px;
    }
    .nametip {
      width: 50px;
      height: 50px;
      background: #4D5F84;
      color: #fff;
      border-radius: 100%;
      display: inline-block;
      text-align: center;
      line-height: 50px;
      float: left;
      margin-top: 15px;
      margin-right: 10px;
    }

    .el-dropdown {
      cursor: pointer;
      &>span {
        &>a {
          color: #fff;
        }
      }
    }

    .head {
      line-height: 80px;
      height: 80px;
      background: #4B73EB;
      color: #fff;
      &>img {
        width: 50px;
        height: 50px;
        display: inline-block;
        margin-left: 36px;
        vertical-align: middle;
        margin-right: 20px;
      }
      .title {
        font-size: 24px;
      }
      .userInfo {
        float: right;
        width: 200px;

        &>img {
          width: 40px;
          height: 40px;
          display: inline-block;
          border-radius: 100%;
          vertical-align: middle;
          margin-right: 20px;
        }
        &>a {
          font-size: 16px;
        }
      }
    }

    &>main {
      /* height: calc(100vh - 80px); */
      /* overflow: hidden; */
      width: 100%;
      display: flex;
      .left-menu {
        width: 263px;
        min-height: calc(100vh - 80px);
        background: #4D5F84;

        .el-menu {
          border-right: 1px solid #4D5F84 !important;
        }
      }

      .right-content {
        flex: 1;
        padding: 20px;
        width: 100%;
        /* height: calc(100vh - 120px); */
      }
    }
  }
</style>
