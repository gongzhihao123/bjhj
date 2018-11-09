<template>
  <div class='login'>
    <p class="login-logo">
      <img src="../assets/images/logo-white.png" alt="">
      <span>教育科研管理平台</span>
    </p>
    <el-row v-if="!show">
      <el-col :span="24">
        <span @click="to">
          平台登录
        </span>
      </el-col>
      <el-col :span="24">
        <span @click="show = true">
          专家登录
        </span>
      </el-col>
    </el-row>
    <transition name="fadeIn" mode="out-in">
      <div class="login-box" v-if="show">
        <div>
          <span>
          </span>
          <el-input v-model="username" @keyup.enter.native="login" @blur="blur">
          </el-input>
        </div>
        
        <div>
          <span>
          </span>
          <el-input v-model="password" type="password" @keyup.enter.native="login">
          </el-input>
        </div>
        
        <p>
          <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
        </p>
        <el-button @click="login" type="primary">登录</el-button>
        <sup class="error-message" v-if="errorShow">
          您的账号或密码输入有误，请重新输入
        </sup>
      </div>
    </transition>
    
  </div>
</template>

<script>
import server from '../utils/axios'
export default {
  name: 'login',
  data () {
    return {
      rememberPassword: false,
      username: '',
      password: '',
      show: false,
      errorShow: false,
      openLoginUrl: ''
    }
  },
  methods: {
    blur () {
      if (localStorage.TRAININGPLATFORM_LOGIN) {
        if (this.username === JSON.parse(localStorage.TRAININGPLATFORM_LOGIN).username) {
          this.password = JSON.parse(localStorage.TRAININGPLATFORM_LOGIN).password
        }
      }
    },
    to () {
      // const path = document.getElementById('contextPath').value
      if (this.openLoginUrl) {
        window.location.href = this.openLoginUrl
      }
    },
    login () {
      server.post('/localLogin', {
        username: this.username,
        password: this.password
      })
      .then(res => {
        if (res.data.code === 1) {
          if (this.rememberPassword) {
            localStorage.TRAININGPLATFORM_LOGIN = JSON.stringify({ username: this.username, password: this.password })
          }
          const path = document.getElementById('contextPath').value
          window.location.href = `${path}`
        } else {
          this.errorShow = true
        }
      })
    }
  },
  watch: {
    errorShow () {
      if (this.errorShow) {
        setTimeout(() => {
          this.errorShow = false
        }, 2000)
      }
    }
  },
  created () {
    server.get('/common/initPage')
    .then(res => {
      this.openLoginUrl = res.data.result.openLoginUrl
    })
  }
}
</script>

<style lang="scss">
@import '../assets/scss/variable.scss';
@import '../assets/scss/mixin.scss';
.login {
  background: url(../assets/images/login-bg.png) no-repeat;
  background-size: cover;
  min-width: 1366px;
  min-height: 670px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .login-logo{
    position: absolute;
    top: 40%;
    margin-top: -50px;
    left: 50%;
    margin-left: -205px;
    img{
      vertical-align: middle;
      width: 70px;
    }
    span{
      vertical-align: middle;
      color: #fff;
      font-size: 46px;
      margin-left: $width;
    }
  }

  &>.el-row{
    width: 444px;
    height: 200px;
    position: absolute;
    top: 55%;
    margin-top: -80px;
    left: 50%;
    margin-left: -202px;

    .el-col{
      text-align: center;
      span{
        display: inline-block;
        width: 300px;
        height: 60px;
        line-height: 60px;
        margin-top: 40px;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        font-size: 22px;
        color: #fff;
        border: 1px solid #D1DFF4;
        &:hover{
          background: #D1DFF4;
          color: #3E89EB;
        }
      }
    }
  }

  .login-box{
    width: 392px;
    height: 390px;
    position: absolute;
    top: 55%;
    margin-top: -90px;
    left: 50%;
    margin-left: -178px;
    background: #3880E9;
    box-sizing: border-box;
    text-align: center;
    padding: 67px 40px;
    &>div{
      margin-top: $width*1.5;
      &>span{
        display: inline-block;
        width: 40px;
        height: 39px;
        background: #fff url(../assets/images/user-icon.png) no-repeat 10px 9px;
        vertical-align: middle;
        margin-top: -3px;
      }
      
      .el-input{
        margin-left: -3px;
        width: 268px;
        border-radius: 0;
        .el-input__inner{
          border-radius: 0;
        }
      }
      &:nth-child(2){
        span{
          background: #fff url(../assets/images/lock-icon.png) no-repeat 14px 10px;
        }
      }
    }
    
    p{
      margin-top: 20px;
      text-align: left;
      .el-checkbox__label{
        color: #fff;
      }
    }
    .el-button{
      margin-top: 30px;
    }
    .error-message{
      position: absolute;
      top: 38%;
      right: 40px;
      font-size: 14px;
      color: #ff4949;
    }
  }
}
</style>
