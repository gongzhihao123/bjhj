<template>
  <div class="back-index">
    <div class="left">
        <p class="left-header" @click="$router.push('/basic/index')">
          <img src="../../assets/images/logo-white-back.png" alt="">
          <span>教育科研管理平台</span>
        </p>

        <div class="left-nav">
          <el-menu
            :default-active="defaultPath"
            class="el-menu-vertical-demo"
            router
            background-color="#283B5B"
            text-color="#fff"
            active-text-color="#5295EB">
            <el-menu-item index="/backHomePage/index">
              <img v-if="defaultPath === '/backHomePage/index'" src="../../assets/images/back-nav-1.png">
              <img v-else src="../../assets/images/nav-1.png">
              <span>首页</span>
            </el-menu-item>           
            <template v-for="(item,index) in leftMenu">         
              <el-submenu :index="index+''" v-if="item.show && item.children.length !== 0">
                <template slot="title">
                  <img v-if="index === 1 && (defaultPath.indexOf('subjectGroup') === -1)" :src="item.icon">
                  <img v-if="index === 3 && (defaultPath.indexOf('subjectReview') === -1)" :src="item.icon">
                  <img v-if="index === 1 && (defaultPath.indexOf('subjectGroup') !== -1)" src="../../assets/images/back-nav-3.png">
                  <img v-if="index === 3 && (defaultPath.indexOf('subjectReview') !== -1)" src="../../assets/images/back-nav-5.png">
                  <span class="title" style="color: #5295EB" v-if="index === 1 && defaultPath.indexOf('subjectGroup') !== -1">{{item.name}}</span>
                  <span class="title" style="color: #5295EB" v-if="index === 3 && defaultPath.indexOf('subjectReview') !== -1">{{item.name}}</span>
                  <span class="title" v-if="index === 1 && defaultPath.indexOf('subjectGroup') === -1">{{item.name}}</span>
                  <span class="title" v-if="index === 3 && defaultPath.indexOf('subjectReview') === -1">{{item.name}}</span>
                </template>
                <el-menu-item v-for="(child, i) in item.children" v-if="child.show" :key="i" :index="child.pathUrl">
                  <span class="text">
                    {{child.name}}
                  </span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-if="item.show && item.children.length === 0" :index="item.pathUrl">
                <img v-if="index === 0 && defaultPath !== '/backID/index'" :src="item.icon">
                <img v-if="index === 2 && defaultPath !== '/backPolicyDocument/index'" :src="item.icon">
                <img v-if="index === 0 && defaultPath === '/backID/index'" src="../../assets/images/back-nav-2.png">
                <img v-if="index === 2 && defaultPath === '/backPolicyDocument/index'" src="../../assets/images/back-nav-4.png">
                <span>{{ item.name }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
    </div>

    <div class="right">
      <el-row class="right-header">
        <el-col :span="19" v-if="remindShow">
          <el-badge :value="messageNum" class="item">
            <img src="../../assets/images/prompting-black.png">
          </el-badge>
          <span @click="$router.push('/subjectReview/backMySubject')">
            您有要审核的课题！
          </span>
        </el-col>
        <el-col :span="remindShow ? 5 : 24">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img v-if="userRight.userFace && userRight.userType === 1" :src="userRight.userFace">
                <img v-if="userRight.userFace && userRight.userType !== 1" :src="staticUrl + '?filepath=' + userRight.userFace">
              <span v-if="!userRight.userFace">{{ userRight.name.substring(userRight.name.length-2, userRight.name.length) }}</span>
              <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
            </span>
            <el-dropdown-menu slot="dropdown" style="margin-top: -10px;">
              <el-dropdown-item @click.native="$router.push('/basic/index')">跳转前台</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      
      <main>
        <transition name="fadeIn" mode="out-in">
          <router-view></router-view>
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import IDIcon from '../../assets/images/back-2.png'
import subjectIcon from '../../assets/images/nav-4.png'
import policyIcon from '../../assets/images/nav-2.png'
import reviewIcon from '../../assets/images/backSubjectChange-icon-white.png'
import { mapGetters } from 'vuex'
import server from '../../utils/axios'
// import { notice } from '../../api/index'
export default {
  name: 'back-index',
  data () {
    return {
      messageNum: 0,
      userRight: { userFace: '', name: '' },
      remindShow: false,
      closeIconShow: false,
      defaultPath: '',
      leftMenu: [
        { name: '账号管理', pathUrl: '/backID/index', children: [], show: false, icon: IDIcon },
        { name: '课题管理',
          children: [
            { name: '发布课题指南', pathUrl: '/subjectGroup/backPublicGuide', show: false },
            { name: '课题分类管理', pathUrl: '/subjectGroup/backSubjectType', show: false },
            { name: '专家库管理', pathUrl: '/subjectGroup/backExpertsManager', show: false },
            { name: '添加评审', pathUrl: '/subjectGroup/backAssignGroup', show: false },
            { name: '课题列表', pathUrl: '/subjectGroup/backSubjectList', show: false }
          ],
          show: false,
          icon: subjectIcon
        },
        { name: '政策文件管理', pathUrl: '/backPolicyDocument/index', children: [], show: false, icon: policyIcon },
        { name: '课题评审',
          children: [
            { name: '立项申请评审', pathUrl: '/subjectReview/backProjectApproval', show: false },
            { name: '我负责的课题', pathUrl: '/subjectReview/backMySubject', show: false },
            { name: '变更及撤项审核', pathUrl: '/subjectReview/backSubjectChange', show: false }
          ],
          show: false,
          icon: reviewIcon
        }
      ]
    }
  },
  methods: {
    // 消息提醒
    getRemindBackMessage () {
      server.get(`/backIndexController/getRemindBackMessage`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result === 1) {
            this.remindShow = true
            this.messageNum = res.data.result
          } else {
            this.remindShow = false
          }
        } else {
          // notice(this, res.data.message, 2000)
        }
      })
    },
    logout () {
      const path = document.getElementById('contextPath').value
      if (this.user.userType === 1) {
        window.location.href = `${path}/openLogout`
      } else {
        window.location.href = `${path}/localLogout`
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'userType',
      'leftmenu',
      'remind',
      'staticUrl'
    ])
  },
  watch: {
    remind () {
      this.getRemindBackMessage()
    },
    '$route' (to) {
      this.defaultPath = to.path
      if (to.path === '/subjectReview/backProjectApprovalSigned' || to.path === '/subjectReview/backProjectApprovalScore') {
        this.defaultPath = '/subjectReview/backProjectApproval'
      }
      if (to.path === '/subjectReview/backMySubjectScore' || to.path === '/subjectReview/backMySubjectSigned' || to.path === '/subjectReview/backMySubjectOver') {
        this.defaultPath = '/subjectReview/backMySubject'
      }
      if (to.path === '/subjectReview/backSubjectChangeDetail') {
        this.defaultPath = '/subjectReview/backSubjectChange'
      }
    }
  },
  created () {
    this.getRemindBackMessage()
    server.get('/common/initPage')
    .then(res => {
      this.userRight = res.data.result.loginUser
      let rights = res.data.result.rights.join(',')
      if (rights.indexOf('/backAccountController') !== -1) {
        this.leftMenu[0].show = true
      }
      if (rights.indexOf('/backTopicGuideController') !== -1) {
        this.leftMenu[1].show = true
      }
      if (rights.indexOf('/backTopicGuideController') !== -1) {
        this.leftMenu[1].children[0].show = true
      }
      if (rights.indexOf('/backTopicTypeController') !== -1) {
        this.leftMenu[1].children[1].show = true
      }
      if (rights.indexOf('/backExpertController') !== -1) {
        this.leftMenu[1].children[2].show = true
      }
      if (rights.indexOf('/backJudgementController') !== -1) {
        this.leftMenu[1].children[3].show = true
      }
      if (rights.indexOf('/backTopicListController') !== -1) {
        this.leftMenu[1].children[4].show = true
      }
      if (rights.indexOf('/backPolicyFileController') !== -1) {
        this.leftMenu[2].show = true
      }
      if (rights.indexOf('/backDeclareCheckController') !== -1) {
        this.leftMenu[3].show = true
      }
      if (rights.indexOf('/backDeclareCheckController') !== -1) {
        this.leftMenu[3].children[0].show = true
      }
      if (rights.indexOf('/backPhaseCheckController') !== -1) {
        this.leftMenu[3].children[1].show = true
      }
      if (rights.indexOf('/backChangeCheckController') !== -1) {
        this.leftMenu[3].children[2].show = true
      }
    })
    this.defaultPath = this.$route.path
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.back-index{
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  min-width: 1366px;

  &>.left{
    background: #283B5B;
    width: 262px;
    // box-sizing: border-box;
    // overflow-x: auto;
    &>.left-header{
      background: #5295EB;
      padding: 19px $width;
      cursor: pointer;
      img{
        margin-left: $width*0.5;
        vertical-align: middle;
      }

      span{
        margin-left: $width/2;
        font-size: 17px;
        color: #fff;
      }
    }

    .left-nav{
      width: 262px;
      height: calc(100vh - 72px);
      box-sizing: border-box;
      overflow-x: auto;
      .el-menu-vertical-demo{
        border-right: 0px;
        div{
          &:hover{
            // background-color: #10A1E3 !important;
          }
        }
        li{
          img{
            margin-left: $width*1.5;
          }
          span{
            margin-left: $width;
            font-size: 15px;
          }
          &:hover{
            // background-color: #41B3E9 !important;
          }
          ul{
            span {
              margin-left: 55px; 
            }
          }
        }
        .el-submenu .el-menu-item{
          height: 56px;
          line-height: 56px;
        }
        i{
          color: #fff;
          font-size: 16px;
        }
        .is-active{
          background-color: #202F49 !important;
          
        }
        .el-menu-item.is-active {
          &:after {
            content: '';
            border: 8px solid transparent;
            border-right: 8px solid #fff;
            position: absolute;
            right: 0;
            top: calc(50% - 8px);
          }
        }
      }
    }
  }

  .right{
    flex: 1;
    overflow-x: auto;
    background: #F0F5FB;

    &>.right-header{
      background: #fff;
      height: 72px;
      padding: 0 $width*2;
      border-bottom: 1px solid #ddd;
       .el-col:first-child{
        line-height: 71px;
        img{
          vertical-align: middle;
        }
        span{
          vertical-align: middle;
          font-size: 16px;
          cursor: pointer;
          color: #666;
          margin-left: $width/2;
        }
      }

      .el-col:last-child{
        text-align: right;
        padding-right: $width/2;
        .el-dropdown-link{
          line-height: 72px;
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
            background: #CFE7FF;
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 36px;
            vertical-align: middle;
          }
        }
      }
    }

    &>main{
      margin: 20px $width*2;
    }
  }

  .item {
    sup {
      position: absolute;
      top: 30px;
      padding: 0;
      width: 13px;
      height: 13px;
      line-height: 13px;
    }
  }
}
</style>
