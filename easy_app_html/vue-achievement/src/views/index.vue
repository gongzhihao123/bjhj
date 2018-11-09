<template>
  <div class="index">
    <header class="header">
      <div class="logo">
        <img src="../assets/images/achievement.png" alt="" ondragstart="return false;">
        <span>成绩分析</span>
      </div>
      <nav class="nav">
        <div>
          <router-link v-for="item in leftMenu"
                    :key="item.name"
                    :to="item.path"
                    :class="{active: ($route.meta.page && $route.meta.page == item.page)}"
                    active-class="active">
            {{item.name}}
          </router-link>
        </div>
      </nav>
      <div class="user">
          <!-- <img :src="user.userFace" alt="" ondragstart="return false;" v-if="user.userFace">
          <img src="../assets/images/avatar.png" alt="" ondragstart="return false;" v-else>
          <span>{{ user.name }}</span>
          <el-tooltip class="item tip-logout" effect="dark" content="退出" placement="bottom" style="padding: 0px;">
            <a href="javascript:;" style="color: black;">
              <i @click="handleClick" class="icon iconfont icon-back" style="cursor: pointer; margin-left: 4px; c"></i>
            </a>
          </el-tooltip> -->
          <!-- <img src="../assets/images/indexH.png" alt="" @click="handleClick"/> -->
          <div class="person" >
            <el-popover
              ref="popover"
              placement="bottom"
              :width="60"
              trigger="hover"
              popper-class="user-pop"
              :disabled="!user.id">
              <a @click="logouts" style="cursor: pointer">退出</a>
            </el-popover>
            <span v-popover:popover style="display: block;">
              <img :src="user.userFace" width="36" height="36" v-if="user.userFace" style="border-radius: 50%; margin-right: 4px;"/>
              <!-- <span v-if="!user.userFace" class="user-name">
                {{ user.name ? user.name.slice(-2, user.name.length) : ''}}
              </span> -->
              <span v-else style="position: relative;">
                <img :src="face" alt="" class="userface" />
                <span style="position: absolute; left: 3px;top: -8px;color: #999;">{{ user.name ? user.name.slice(-2) : '' }}</span>
              </span>
            </span>
          </div>
      </div>
    </header>

    <main class="main">
      <router-view></router-view>
    </main>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { logout } from '../api/index.js'
import face from '../assets/images/avatar.png'
export default {
  name: 'index',
  data () {
    return {
      navList: [
        { name: '规则管理', path: '/rule' },
        { name: '知识点管理', path: '/knowledge' },
        { name: '考试管理', path: '/exam' },
        { name: '成绩分析', path: '/achievement' },
        { name: '权限管理', path: '/right' }
      ],
      face
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'leftMenu'
    ])
  },
  methods: {
    handleClick () {
      // 退出
      this.$confirm('确定返回首页吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logout()
      }).catch(() => {
      })
    },
    logouts () {
      logout()
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/scss/variable.scss';
  .index {
    height: calc(100% - 50px);
    min-width: 1300px;

    .header {
      // display: flex;
      // justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;
      height: 50px;
      width: 100%;
      min-width: 1300px;
      background: $theme;
      color: $white;
      line-height: 50px;

      .logo {
        float: left;
        
        > img {
          margin-top: 8px;
          height: 32px;
          margin-left: 10px;
          float: left;
        }
        > span {
          float: left;
          margin-left: 10px;
          font-size: 18px;
          line-height: 50px;
        }
      }

      .user {
        float: right;
        height: 50px;
        * {
          float: left;
          // margin-left: 10px;
          display: inline-block;
        }

        > img {
          margin-top: 14px;
          margin-right: 16px;
          cursor: pointer;
        }

        .person {
          height: 50px;
          margin-right: 20px;
          position: relative;
          > span {
            height: 34px;
            margin: 8px 4px 0 0;

            img {
              height: 34px;
              width: 34px;
              // margin-top: 8px;
              border-radius: 50%;
            }

            // .user-name {
            //   width: 34px;
            //   line-height: 34px;
            //   box-sizing: border-box;
            //   position: absolute;
            //   right: 6px;
            //   color: #999;
            //   padding-left: 3px;
            //   // transform: translateX(-2px);
            //   background-color: #CFE7FF;
            //   border-radius: 50%;
            // }
          }

          .user-pop {
            text-align: center;
            min-width: 50px!important;
          }

          
          
        }
      }
      .nav {
        // float: left;
        // padding-left: 171px;
        // background: #E2EFE5;
        position: absolute;
        left: 316px;
        div {
          display: flex;
          width: 800px;
          margin: 0 auto;
          // justify-content: space-between;
          line-height: 50px;
          font-weight: bold;
          color: $white;

          a {
            padding: 0 20px;
            margin-right: 50px;

            &.active {
              background: #E2EFE5;
              color: $theme;
            }
          }
        }
      }
    }

    .main {
      height: 100%;
    }
  }
  .el-popover {
    text-align: center;
    min-width: 50px !important;
    color: #20A1FF;
  }
</style>

