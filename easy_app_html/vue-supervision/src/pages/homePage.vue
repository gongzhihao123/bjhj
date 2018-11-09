<template>
    <div class="homePage">
      <!-- 顶部logo -->
      <header>
        <!-- logo -->
        <div class="logo">
          <img src="../assets/images/Artboard.png">
          <span>督导平台</span>  
        </div>            
        <!-- 菜单 -->
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#48B2EC"
          text-color="#fff"
          router
          active-text-color="#fff">
          <template v-for="(item, index) in menu" v-if="item.show">
            <el-menu-item :index="item.path" v-if="item.children.length === 0">
              <img src="../assets/images/Artboard 10.png" v-if="item.name === '首页'">
              <img src="../assets/images/Artboard Copy.png" v-if="item.name === '挂牌督导'">
              <img src="../assets/images/Artboard Copy 2.png" v-if="item.name === '相关文件'">
              <img src="../assets/images/Artboard Copy 3.png" v-if="item.name === '统计分析'">
              <img src="../assets/images/Artboard Copy 7.png" v-if="item.name === '计划总结'">
              <img src="../assets/images/Artboard Copy 6.png" v-if="item.name === '督导记录'">
              <img src="../assets/images/Artboard Copy 5.png" v-if="item.name === '整改与反馈'">
              {{item.name}}
            </el-menu-item>
            <el-submenu :index="index+''" v-if="item.children.length !== 0">
              <template slot="title">
              <img src="../assets/images/Artboard 10.png" v-if="item.name === '首页'">
              <img src="../assets/images/Artboard Copy.png" v-if="item.name === '挂牌督导'">
              <img src="../assets/images/Artboard Copy 2.png" v-if="item.name === '相关文件'">
              <img src="../assets/images/Artboard Copy 3.png" v-if="item.name === '统计分析'">
              <img src="../assets/images/Artboard Copy 7.png" v-if="item.name === '计划总结'">
              <img src="../assets/images/Artboard Copy 6.png" v-if="item.name === '督导记录'">
              <img src="../assets/images/Artboard Copy 5.png" v-if="item.name === '整改与反馈'">
                {{ item.name }}
              </template>
              <el-menu-item :index="child.path" v-for="(child, i) in item.children" v-if="child.show" :key="i" class="menu-item">{{child.name}}</el-menu-item>
            </el-submenu>
          </template>          
        </el-menu>
        <!-- 人物信息 -->
        <div class="home">
            <img @click="toPlatform" src="../assets/images/Artboard 10.png" style="width: 19px; height: 17px;">
            <el-dropdown>
              <span class="el-dropdown-link">
                <img v-if="userRight.userFace" :src="userRight.userFace">
                <span v-if="!userRight.userFace">{{ userRight ? userRight.name.substring(userRight.name.length-2, userRight.name.length) : '' }}</span>
              </span>
              <el-dropdown-menu slot="dropdown" style="margin-top:0px;">
                <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>          
          </div>
      </header>
      <div class="front-index-middle">
        <router-view></router-view>
      </div>		
    </div>
  </template>
  <script>
  import server from '../utils/axios'
  export default {
    name: 'homePage',
    data () {
      return {
        openPlatformUrl: '',
        userRight: '',
        activeIndex: '/index',
        path: '',
        menu: [
          { name: '首页', path: '/index', children: [], show: false },
          { name: '挂牌督导',
            show: false,
            children: [
              { name: '挂牌督导', path: '/supervisor/common', show: false },
              { name: '学校管理', path: '/supervisor/school', show: false },
              { name: '人员管理', path: '/supervisor/manage', show: false },
              { name: '督导责任区', path: '/supervisor/response', show: false },
              { name: '责任学校', path: '/supervisor/organization', show: false }
            ]
          },
          { name: '相关文件',
            show: false,
            children: [
              { name: '培训文件', path: '/file/train', show: true },
              { name: '法律文件', path: '/file/law', show: true }
            ]
          },
          { name: '统计分析', path: '/analysis/workload', children: [], show: false },
          { name: '计划总结', path: '/plan/index', show: false, children: [] },
          { name: '督导记录', path: '/record/supervisionRecord', children: [], show: false },
          { name: '整改通知', path: '/notice/rectificationNotice', children: [], show: false }
        ]
      }
    },
    methods: {
      logout () {
        const path = document.getElementById('contextPath').value
        window.location.href = `${path}/logout`
      },
      handleSelect (key, keyPath) {
        if (key === '/file/train' || key === '/file/law') {
          sessionStorage.filename = ''
        }
        sessionStorage.path = key
        if (key === '/supervisor/common') {
          sessionStorage.state = null
        }
      },
      toPlatform () {
        window.open(this.openPlatformUrl)
      }
    },
    created () {
      if (sessionStorage.path) {
        this.activeIndex = sessionStorage.path
      }
      server.get(`/common/initPage`)
      .then(res => {
        this.userRight = res.data.result.loginUser
        this.openPlatformUrl = res.data.result.openPlatformUrl
        let rigths = res.data.result.leftMenu
        if (rigths.filter(item => item.url === '/index').length !== 0) this.menu[0].show = true
        if (rigths.filter(item => item.url === '/gpdd').length !== 0) this.menu[1].show = true
        if (rigths.filter(item => item.url === '/rygl').length !== 0) this.menu[1].children[1].show = true
        if (rigths.filter(item => item.url === '/xxgl').length !== 0) this.menu[1].children[2].show = true
        if (rigths.filter(item => item.url === '/zrxx').length !== 0) this.menu[1].children[4].show = true
        if (rigths.filter(item => item.url === '/ddzrq').length !== 0) this.menu[1].children[3].show = true
        if (rigths.filter(item => item.url === '/dxgpdd').length !== 0) this.menu[1].children[0].show = true
        if (rigths.filter(item => item.url === '/xgwj').length !== 0) this.menu[2].show = true
        if (rigths.filter(item => item.url === '/pxwj').length !== 0) this.menu[2].children[0].show = true
        if (rigths.filter(item => item.url === '/flwj').length !== 0) this.menu[2].children[1].show = true
        if (rigths.filter(item => item.url === '/tjfx').length !== 0) this.menu[3].show = true
        if (rigths.filter(item => item.url === '/jhzj').length !== 0) this.menu[4].show = true
        if (rigths.filter(item => item.url === '/xxddjl').length !== 0) this.menu[5].show = true
        if (rigths.filter(item => item.url === '/xxzgyfk').length !== 0) this.menu[6].show = true
      })
    },
    watch: {
      '$route' (to) {
        this.activeIndex = to.fullPath
      }
    }
  }
  </script>
  <style lang="scss">
  @import '../assets/scss/variable.scss';
  @import '../assets/scss/mixin.scss';
  .homePage {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #f1f2f7;
    min-width: 1366px;
    overflow-x: hidden;

    .el-menu--horizontal {
      border-bottom: none !important;
    }
  
    &>header {
      width: 100%;
      height: 50px;
      background: #48B2EC;  
      display: block;
      clear: both;

      .logo {
        width: 200px;
        float: left;
        height: 50px;
        margin-left: 20px;
        line-height: 50px;
          img{
            vertical-align: middle;
          }
          span{
            vertical-align: middle;
            font-size: 20px;
            margin-left: $width/2;
            // font-weight: bold;
            color: #fff;
        }
      }
      ul {
        float: left;
        height: 50px;
        .el-submenu {
          height: 50px;
          line-height: 50px;
        }
        .el-submenu .el-menu-item {
          min-width: 120px !important;
          height: 50px;
          line-height: 50px;

          &:hover {
            background-color:  #32A2DF !important;
          }
        }
        .el-menu-item {
          &>img {
            vertical-align: middle;
            margin-right: 10px;
          }
        }
        .el-menu {
          &>li {
            &:hover {
              background-color: #48B2EC !important;
            }
          }
        }
        .el-menu-item.is-active {
          border-bottom-color: #32A2DF !important;
          background: #32A2DF !important; 
          &:hover {
            background-color: #32A2DF !important;
          }        
        }
        .is-active {
          &>.el-submenu__title {
            border-bottom-color: #32A2DF !important;
            background: #32A2DF !important;
            &:hover {
              background-color: #32A2DF !important;
            }            
          }           
        }
        .el-submenu__title{
          height: 50px !important;
          line-height: 50px !important;

          &>img {
            vertical-align: middle;
            margin-right: 10px;
          }          
          
          &:hover {
            background-color: #48B2EC !important;
          }
        }
        .el-submenu__title, .el-menu-item {
          height: 50px;
          line-height: 50px;
          .el-submenu__icon-arrow {
            color: #fff;
          }
        }
        img{
          vertical-align: middle;
        }
        span{
          vertical-align: middle;
          font-size: 14px;
          cursor: pointer;
          margin-left: $width/2;
        }        
      }
      .home{
        width: 120px;
        float: right;
        height: 50px;

        img {
          vertical-align: middle;
          margin-right: 20px;
          &:hover {
            cursor: pointer;
          }
        }

        .el-dropdown-link{
          line-height: 48px;
          cursor: pointer;
          img{
            width: 36px;
            height: 36px;
            border-radius: 50%;
            vertical-align: middle;
          }
          span{
            display: inline-block;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #3CDBCD;
            color: #fff;
            text-align: center;
            line-height: 36px;
            vertical-align: middle;
          }
        }
      }      
      
    }
    &>.front-index-middle {
      min-width: 1366px;
      margin: 0 auto;
    }
  }
  </style>
  
  
  