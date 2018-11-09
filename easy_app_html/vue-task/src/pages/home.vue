<template>
  <div class='home'>
    <header>
      <el-row>
        <el-col :span="12">
          <img src="../assets/images/logo.png" alt="">
          任务管理
        </el-col>
        <el-col :span="12">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="userPath" v-if="userPath" alt="">
              <span v-else>
                {{ userName.substring(userName.length-2, userName.length) }}
              </span>
            </span>
            <el-dropdown-menu slot="dropdown" style="margin-top:0px;">
              <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <!-- <el-button size="small" @click="languageChange">
        切换语言
      </el-button> -->
    </header>

    <main>
      <!-- 左侧导航 -->
      <div class="home-left">
        <ul>
          <li @click="route(item, index)" v-if="item.show" v-for="(item, index) in leftMenu" :class="{active: activeNum === index}" :key="index">
            {{ item.name }}
          </li>
        </ul>
      </div>

      <!-- 右侧路由 -->
      <div class="home-right">
        <p>
          {{ titleName }}
        </p>
        <div>
          <router-view/>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      adminFlag: false,
      userName: '',
      userPath: '',
      activeNum: 0,
      titleName: '',
      leftMenu: [
        { name: '我负责的子任务', pathUrl: '/task/taskList', show: true },
        { name: '我参与的子任务', pathUrl: '/task/partList', show: true },
        { name: '任务总览', pathUrl: '/task/overview', show: true },
        { name: '任务类型', pathUrl: '/label/index', show: true }
      ]
    }
  },
  methods: {
    logout () {
      const path = document.getElementById('contextPath').value
      window.location.href = `${path}/logout`
    },
    route (item, index) {
      this.$router.push(item.pathUrl)
      sessionStorage.TASK_PAGENO = 1
    },
    languageChange () {
      if (this.$i18n.locale === 'zh-CN') this.$i18n.locale = 'en-US'
      else this.$i18n.locale = 'zh-CN'
      localStorage.LANGUAGE = this.$i18n.locale
    }
  },
  watch: {
    '$route' (form, to) {
      this.titleName = form.name
      if (form.name === '任务详情') {
      } else {
        this.activeNum = form.meta.num
      }
    }
  },
  created () {
    this.activeNum = this.$route.meta.num
    this.titleName = this.$route.name
    setTimeout(() => {
      this.userPath = this.$store.state.user.loginUser.userFace
      this.userName = this.$store.state.user.loginUser.name
      this.adminFlag = this.$store.state.user.loginUser.adminFlag
      if (!this.adminFlag) {
        this.leftMenu[2].show = false
      }
    }, 400)
    // this.$i18n.locale = localStorage.LANGUAGE
  }
}
</script>

<style lang="scss">
@import '../assets/scss/variable.scss';
@import '../assets/scss/mixin.scss';
.home {
  background: #EFF1F2;
  min-width: 1366px;

  &>header {
    height: 80px;
    line-height: 80px;
    background: linear-gradient(90deg, #5C6DF9, #558CFB);
    color: #fff;

    .el-row {
      .el-col:nth-child(1) {
        padding-left: 50px;
        font-size: 24px;
        img {
          vertical-align: middle;
          margin-right: 10px;
        }
      }

      .el-col:nth-child(2) {
        padding-right: 40px;
        text-align: right;
        .el-dropdown-link{
          cursor: pointer;
          display: inline-block;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #96BBF8;
          color: #fff;
          text-align: center;
          line-height: 36px;
          vertical-align: middle;
          img{
            width: 36px;
            height: 36px;
            border-radius: 50%;
            vertical-align: middle;
            cursor: pointer;
          }
        }
      }
    }
  }

  &>main {
    display: flex;
    .home-left {
      background: #363A41;
      width: 263px;
      height: calc(100vh - 82px);
      box-sizing: border-box;
      overflow-x: auto;
      ul {
        li {
          color: #A4ADC0;
          line-height: 58px;
          padding-left: 50px;
          font-size: 16px;
          border-right: 5px solid transparent;
          cursor: pointer;
          &.active {
            background: #282B30;
            border-left: 5px solid #EFF1F2;
          }
          img {
            vertical-align: middle;
            margin-right: 10px;
          }
        }
      }
    }

    .home-right {
      flex: 1;
      height: calc(100vh - 102px);
      box-sizing: border-box;
      overflow-x: auto;
      &>div {
        padding: 20px;
      }
      &>p {
        height: 58px;
        line-height: 58px;
        padding-left: 20px;
        color: #558CFB;
        background: #fff;
        font-size: 16px;
        img {
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
