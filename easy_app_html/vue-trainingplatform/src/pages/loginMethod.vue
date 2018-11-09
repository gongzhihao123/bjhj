<template>
  <div class='login-method'>
    <!-- <el-row v-if="!show">
      <el-col :span="12">
        <span @click="to">
          平台登录
        </span>
      </el-col>
      <el-col :span="12">
        <span @click="show = true">
          专家登录
        </span>
      </el-col>
    </el-row> -->
    <transition name="fadeIn" mode="out-in">
      <div class="login-box" v-if="true">
        <p>
          <img src="../assets/images/logo-white.png" alt="">
          教师科研管理平台
        </p>
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
        
        <p class="login-method">
          <el-radio-group v-model="radioValue">
            <el-radio :label="1">平台登录</el-radio>
            <el-radio :label="2">专家登录</el-radio>
          </el-radio-group>
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
  name: 'login-method',
  data () {
    return {
      rememberPassword: false,
      radioValue: 1,
      username: '',
      password: '',
      show: false,
      errorShow: false
    }
  },
  methods: {
    blur () {
      // if (localStorage.TRAININGPLATFORM_LOGIN) {
      //   if (this.username === JSON.parse(localStorage.TRAININGPLATFORM_LOGIN).username) {
      //     this.password = JSON.parse(localStorage.TRAININGPLATFORM_LOGIN).password
      //   }
      // }
    },
    to () {
      // const path = document.getElementById('contextPath').value
      window.location.href = `/sso/login?redirectUrl=http%253A%252F%252Fwww.meetyuu.com%252Ftrainingplatform%252F`
    },
    login () {
      server.post('/login', {
        username: this.username,
        password: this.password,
        userType: this.radioValue
      })
      .then(res => {
        if (res.data.code === 1) {
          // if (this.rememberPassword) {
          //   localStorage.TRAININGPLATFORM_LOGIN = JSON.stringify({ username: this.username, password: this.password })
          // }
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
  }
}
</script>

<style lang="scss">
@import '../assets/scss/variable.scss';
@import '../assets/scss/mixin.scss';
.login-method {
  background: url(../assets/images/login-background.jpg) no-repeat;
  background-size: cover;
  min-width: 1366px;
  min-height: 620px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &>.el-row{
    width: 444px;
    height: 200px;
    position: absolute;
    top: 55%;
    margin-top: -80px;
    left: 50%;
    margin-left: -202px;

    .el-col{
      span{
        display: inline-block;
        width: 200px;
        height: 76px;
        background: url(../assets/images/login-button.png);
        line-height: 76px;
        text-align: center;
        cursor: pointer;
        font-size: 22px;
        color: #fff;
        &:hover{
          background: url(../assets/images/keydown.png);
        }
      }
    }
  }

  .login-box{
    width: 392px;
    height: 320px;
    position: absolute;
    top: 50%;
    margin-top: -90px;
    left: 50%;
    margin-left: -192px;
    background: url(../assets/images/login-box.png) no-repeat;
    box-sizing: border-box;
    text-align: center;
    padding: 40px 40px;
    p:nth-child(1) {
      position: absolute;
      top: -90px;
      color: #fff;
      font-size: 36px;
      left: 55px;
      img{
        vertical-align: middle;
      }
    }
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
    
    .login-method{
      margin-top: 25px;
      .el-radio__label{
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
