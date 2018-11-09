<template>
  <div class="index">
    <div class="head">
      <div class="logo">
        <router-link to="/dManage/activity">
          <img src="../assets/images/logo.png" class="middle"/>
          <span class="middle">校本选课</span>
        </router-link>
      </div>
      <div class="user">
        <img :src="user.userFace || face" width="30" class="middle" />
        <span class="middle">{{ user.name }}</span>
        <el-dropdown trigger="click">
          <i class="el-icon-arrow-down" style="cursor: pointer;"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a @click="logout" style="color: #20A0FF; display: block; text-align: center;">退出</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <main>
      <div class="left-menu">
        <div class="menu">
          <nav>
            <li v-for="(list, index) in leftmenu"
                :key="index"
                class="menu-list"
                @click="nav(list, index)"
                :class="{'active': index === menuInd}">
              <img :src="index === menuInd ? $router.options.routes[index].iconActive : $router.options.routes[index].icon" 
                    class="middle"
                    alt="icon"/>
              {{ list.name }}
            </li>
          </nav>
        </div>
        <div class="sub-menu" v-if="submenu !== ''" :style="{'paddingTop': 48 + 56*menuInd + 'px'}">
          <nav>
            <li v-for="(list, index) in submenu"
                :key="index"
                @click="subNav(list, index)"
                :class="{'active': index === submenuInd}">
                {{ list.name }}
            </li>
          </nav>
        </div>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import face from '../assets/images/avatar.png'
import { mapGetters } from 'vuex'
export default {
  name: 'index',

  data () {
    return {
      face,
      name: '李白',
      menuInd: 0,
      submenu: '',
      submenuInd: 0
    }
  },

  computed: {
    ...mapGetters([
      'user',
      'leftmenu',
      'edit'
    ])
  },

  watch: {
    '$route' (to, from, next) {
      if (!this.$route.children) this.submenuInd = this.$route.meta.subInd
      const arr = this.leftmenu.map(item => item.id)
      this.menuInd = arr.indexOf(to.meta.id)
      this.submenu = this.leftmenu[this.menuInd].resources || ''
    }
  },

  methods: {
    logout () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/logout`
    },

    nav (list, n) {
      this.$router.push(list.urlPath || list.resources[0].urlPath)
    },

    subNav (list, n) {
      this.$router.push(list.urlPath)
    }
  },

  created () {
    const arr = this.leftmenu.map(item => item.id)
    this.menuInd = arr.indexOf(this.$route.meta.id)
    this.submenu = this.leftmenu[this.menuInd].resources || ''
    if (!this.$route.children) this.submenuInd = this.$route.meta.subInd
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/variable.scss';
@import '../assets/scss/mixin.scss';

.index {
  position: absolute;
  bottom: 0;
  top: 0;
  width: 100%;
}

.head {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: $header-height;
  min-width: 1366px;
  line-height: $header-height;
  background: $head-bg;
  z-index: 999;
  >.logo {
    margin-left: $width;

    > a {
      color: $white;
      font-size: 2rem;

      >span {
        margin-left: $sm-pad;
      }
    }
  }

  >.user {
    margin-right: $width;
    color: $white;
  
    >img {
      width: 30px;
      height: 30px;
      display: block;
      border-radius: 4px;
      float: left;
      margin-top: 13px;
    }
    >span {
      margin: 0 $sm-pad;
    }

    i {
      color: $white;
      @include transform(scale(.7));
    }
  }
}

main {
  display: flex;
  height: calc(100% - 4rem);

  .left-menu {
    display: flex;
    height: 100%;

    >.menu {
      width: $left-menu;
      height: 100%;
      max-height: 100%;
      overflow: auto;
      background: $left-menu-bg;

      >nav {
        padding-top: $xlg-pad;

        >li>img {
          margin-right: $xs-pad;
        }

        >li.menu-list {
          text-align: center;
          padding: $normal-pad;
          color: $white;
          cursor: pointer;
        }

        >li.active {
          background: $white;
          color: $black;
        }
      }
    }

    >.sub-menu {
      width: $left-menu - 3rem;
      background: $white;
      @include transition(all .3s);

      >nav {

        >li {
          padding: $xs-pad $normal-pad;
          margin: $sm-pad $normal-pad;
          text-align: center;
          border-radius: $br;
          cursor: pointer;
        }
        
        >li.active {
          color: $white;
          background: $left-menu-bg;
          cursor: pointer;
        }
      }
    }
  }
  .content {
    padding: $width;
    min-width: 960px;
    max-height: 100%;
    overflow: auto;
    width: 100%;
  }
}
</style>
