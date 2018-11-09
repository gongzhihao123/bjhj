<template>
    <div class="home">
      <header class="header">
        <div class="headTitle">
          <img src="./../assets/img/logo.png">
          教师成长档案
        </div>
        <div class="user">
          <el-dropdown @command="handleCommand">
            <div>
              <img :src="user.userFace ? user.userFace : userFace" alt="">
              <span>{{ user.name ? user.name : '请登录' }}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in list" :key="index" :command='item.name'>{{ item.content }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </header>
      <div class="main clearfix">
        <aside class="subMenu">
          <el-menu
            default-active="2"
            class="menu"
            @open="handleOpen"
            @close="handleClose"
            active-text-color="#20a0ff"
            text-color="#fff"
            background-color='#354052'
            router
            >
            <el-submenu v-for="(item, index) in $router.options.routes.slice(1)" v-if='item.children.length !== 1' :key="index" :index="index + ''">
              <template slot="title">
                <img src="./../assets/img/personal.png">
                <span>{{ item.name }}</span>
              </template>
                <el-menu-item v-for="(items, elem) in item.children"  :index="items.path + ''" :key="elem">
                  <span class="before" v-if="items.name === '个人信息' && TeacherInfo ? true : items.name === '个人荣誉' && TeacherHonor ? true : items.name === '年度考评' && TeacherYearReview ? true : ''" ></span>
                  <span>{{ items.name }}</span>
                </el-menu-item>
            </el-submenu>
              <el-menu-item v-if="user.adminFlag"  :index="'/teachers'">
                <img src="./../assets/img/teacher.png">
                <span slot="title">教师档案管理</span>
              </el-menu-item>
          </el-menu>
        </aside>
        <div class="mainBody">
          <transition name="list" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
      <el-dialog
        title="修改密码"
        :visible.sync="changePwd"
        width="400px">
        <el-form ref="form" :model="passWord" :rules="passRules">
          <el-form-item prop='oldPass'>
            <el-input  :maxlength="20" v-model="passWord.oldPass" type="password" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item prop='newPass'>
            <el-input  :maxlength="20" v-model="passWord.newPass" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="determine">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
import userFace from './../assets/img/userFace.jpeg'
import * as config from './../config.js'
export default {
  data () {
    return {
      userFace,
      user: '',
      list: [{name: 'logOut', content: '退出登录'}],
      changePwd: false,
      passWord: {
        oldPass: '',
        newPass: ''
      },
      passRules: {
        oldPass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ]
      },
      TeacherInfo: false,
      TeacherYearReview: false,
      TeacherHonor: false
    }
  },
  methods: {
    async determine () {
      await this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('changePwd', {
            oldPwd: this.passWord.oldPass,
            newPwd: this.passWord.newPass
          })
          this.changePwd = false
          this.passWord.oldPass = ''
          this.passWord.newPass = ''
          this.$refs['form'].resetFields()
        } else {
          return false
        }
      })
    },
    handleCommand (command) {
      if (command === 'logOut') {
        window.location.href = window.location.origin + config.contentPath + '/logout'
      } else if (command === 'Modify') {
        this.changePwd = true
      }
    },
    handleOpen (data, item) {},
    handleClose (data, item) {}
  },
  mounted () {
    setTimeout(() => {
      this.user = this.$store.state.user
      console.log(this.user)
      this.$store.state.user.rights.forEach((item) => {
        if (item === 'TeacherInfo') {
          this.TeacherInfo = true
        } else if (item === 'TeacherYearReview') {
          this.TeacherYearReview = true
        } else if (item === 'TeacherHonor') {
          this.TeacherHonor = true
        }
      })
    }, 500)
  }
}

</script>
<style lang='scss' scoped>
.home {
  width: 100%;
  min-width: 1200px;
  .header {
    width: 100%;
    height: 59px;
    overflow: hidden;
    background-color: $header-bg;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .headTitle {
      height: 100%;
      color: #fff;
      font-size: 18px;
      padding-left: 10px;
      font-weight: 600;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 30px;
        margin-right: 8px;
      }
    }

    .user {
      background-color: $header-bg;
      line-height: 59px;
      display: flex;
      justify-content: flex-start;
      > div {
        padding:0 10px 0 10px;
        img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          margin-left: 15px;
        }
        span {
          font-size: 16px;
          color: #fff;
          margin-right: 60px;
          margin-left: 10px;
          margin-right: 20px;
        }
        &:hover {
          background: #22282B;
        }
      }
    }
  }
  .main {
    height:calc(100vh - 59px);
    overflow: hidden;
    position: relative;
    .subMenu {
      width: 280px;
      height: 100%;
      overflow: hidden;
      background-color: #354052;
      position: absolute;
      left: 0;
      .menu {
        width: 102%;
        background: #354052;
      }
    }
    .mainBody {
      position: absolute;
      top: 0px;
      left: 280px;
      right: 0px;
      bottom: 0px;
      overflow: auto;
    }
  }
}
</style>
