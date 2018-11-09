<template>
  <div class="app">
    <header>
      <div class="header-left">
        <router-link to="/" class="logo">
          <img src="../assets/images/logo.png" alt="" width="32px" height="32px">
          <span class="logo-line">|</span>
          <span class="logo-name">工资管理</span>
        </router-link>
        <div class="nav">
          <a
            href="javascript:;" 
            v-for="(item,index) in path"
            @click="nav(item, index)"
            :key="index"
            :class="{'active': index === activeInd}">
            {{ item.name }}
          </a>
          <!-- <router-link to="/addWages">新建工资</router-link> -->
          <!-- <router-link to="/history">历史管理</router-link> -->
        </div>
      </div>
      <div class="user">
        <el-dropdown @command="Command">
          <span class="el-dropdown-link">
            <span v-if="!userImg">{{ userName.slice(-2) }}</span>
            <img :src="userImg ? userImg : userFace" alt="" class="user-head">
          </span>
          <el-dropdown-menu slot="dropdown">
            <li @click="Command" class="logoyt">退出登录</li>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <div class="content">
      <transition name="fade" mode="">
        <router-view></router-view>        
      </transition>
    </div>
  </div>
</template>

<script>
import userFace from './../assets/images/people.png'
import * as config from './../config'
export default {
  name: 'app',
  data () {
    return {
      userFace,
      path: [
        { path: '/addWages', name: '新建工资' },
        { path: '/history', name: '历史管理' }
      ],
      activeInd: -1
    }
  },

  computed: {
    userImg () {
      return this.$store.state.userImg
    },
    userName () {
      return this.$store.state.userName
    }
  },

  watch: {
    '$route' (to, from) {
      this.activeInd = to.meta.index
    }
  },

  methods: {
    async nav (item, index) {
      await this.$store.dispatch('search')
      if (item.name === '新建工资') {
        this.$store.dispatch('change')
      }
      if (this.$route.name === 'release' && item.name === '历史管理') {
        this.$confirm('是否要放弃编辑本次工资单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (this.$store.state.history.month.length === 0) {
            this.$alert('您还没有上传过工资表', '提示', {
              confirmButtonText: '确定'
            })
          } else {
            this.$router.push(item.path)
            this.activeInd = index
          }
        }).catch(() => {
          this.activeInd = 0
        })
      } else if (this.$route.name === 'release' && item.name === '新建工资') {
        this.$confirm('是否要放弃编辑本次工资单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$router.push(item.path)
          this.activeInd = index
        }).catch(() => {
          this.activeInd = 0
        })
      } else if (item.name === '历史管理' && this.$store.state.history.month.length === 0) {
        this.$alert('您还没有上传过工资表', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        this.$router.push(item.path)
        this.activeInd = index
      }
    },
    Command () {
      if (this.$route.name === 'release') {
        this.$confirm('是否要放弃编辑本次工资单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          window.location.href = window.location.origin + config.API_ROOT + '/logout'
        })
      } else {
        window.location.href = window.location.origin + config.API_ROOT + '/logout'
      }
    }
  },
  mounted () {
    this.$store.dispatch('started')
  }
}
</script>

<style scoped lang="scss">

@import '../assets/scss/variable.scss';

.app {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  min-width: 1340px;
  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 $width;
    height: $header-height;
    line-height: $header-height;
    background: $header-bg;
    color: $white;

    .header-left {
      display: flex;

      > .logo {
        position: relative;
        height: $header-height;

        .logo-line {
          display: block;
          position: absolute;
          top: 15px;
          left: 50px;
          line-height: 1;
          font-size: 20px;
        }

        .logo-name {
          margin-left: 40px;
          vertical-align: middle;
          font-size: 24px;
        }
      }

      > .nav {
        margin-left: $width * 3;
        display: flex;

        a {
          position: relative;
          display: block;
          padding: 0 14px;
          font-size: 16px;
          color: #c0ccda;
          -webkit-transform: perspective(1px) translateZ(0);
          transform: perspective(1px) translateZ(0);
          box-shadow: 0 0 1px transparent;
          overflow: hidden;
        }

        > a {
          margin-right: $header-height;
        }

        a:hover,
        a.active {
          color: $white;
        }

        a::after {
          content: "";
          position: absolute;
          z-index: -1;
          left: 0;
          right: 0;
          bottom: 0;
          background: $theme;
          height: 4px;
          -webkit-transform: translateY(4px);
          transform: translateY(4px);
          -webkit-transition-property: transform;
          transition-property: transform;
          -webkit-transition-duration: 0.3s;
          transition-duration: 0.3s;
          -webkit-transition-timing-function: ease-out;
          transition-timing-function: ease-out;
        }

        a:hover::after,
        a.active::after {
          -webkit-transform: translateY(0);
          transform: translateY(0);
        }
      }
    }

    > .user {
      display: flex;
      align-items: center;
      .el-dropdown-link {
        position: relative;
        span {
          width: 100%;
          display: block;
          position: absolute;
          text-align: center;
        }
      }

      .user-head {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }

      .user-name {
        margin: 0 10px;
      }

      > a > img {
        margin-top: 15px;
        vertical-align: sub;
      }
    }
  }
}

.logoyt {
  padding: 5px 10px;
  cursor: pointer;
  list-style: none;
  &:hover {
    background: #ecf5ec;
    color: #78b978;

  }
}

</style>
