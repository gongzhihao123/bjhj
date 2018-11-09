<template>
  <div class="front-index">

    <!-- 顶部logo -->
    <header>
      <div>
        <el-row>
          <el-col :span="5" @click.native="$router.push('/basic/index')">
            <img src="../../assets/images/logo-white.png">
            <span>
              教育科研管理平台
            </span>
          </el-col>
          <el-col :span="14" v-if="remindShow">
            <el-badge :value="messageNum" class="item">
              <img src="../../assets/images/prompting-white.png">
            </el-badge>
            <span @click="route" style="color: #fff;">
              您有要提交的报告！
            </span>
          </el-col>
          <el-col :span="remindShow ? 5 : 19">
            <el-dropdown>
              <span class="el-dropdown-link">
                <img v-if="userRight.userFace && userRight.userType === 1" :src="userRight.userFace">
                <img v-if="userRight.userFace && userRight.userType !== 1" :src="staticUrl + '?filepath=' + userRight.userFace">
                <span v-if="!userRight.userFace">{{ userRight.name.substring(userRight.name.length-2, userRight.name.length) }}</span>
                <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
              </span>
              <el-dropdown-menu slot="dropdown" style="margin-top:0px;">
                <el-dropdown-item @click.native="$router.push('/back/index')" v-if="userLeftmenu">后台管理</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
    </header>

    <div class="front-index-middle">
      <router-view></router-view>
    </div>
    <footer class="footer">
      <p>
        Copyright @2017-2027 北京怀教网络科技股份有限公司 All Right Reserved
      </p>
      <p>
        联系电话：4008-135-136
      </p>
    </footer>
  </div>
</template>

<script>
import server from '../../utils/axios'
// import { notice } from '../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      messageNum: 0,
      remindShow: false,
      userRight: { userFace: '', name: '' },
      userLeftmenu: ''
    }
  },
  methods: {
    route () {
      this.$router.push('/subjectManager/mySubject')
    },
    // 消息提醒
    getRemindCode () {
      server.get(`/frontIndexController/getRemindCode`)
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
      'leftmenu',
      'userType',
      'remind',
      'staticUrl'
    ])
  },
  watch: {
    remind () {
      this.getRemindCode()
    }
  },
  created () {
    this.getRemindCode()
    server.get('/common/initPage')
    .then(res => {
      this.userRight = res.data.result.loginUser
      this.userLeftmenu = res.data.result.rights
    })
    setTimeout(() => {
      // if (this.user) {
      //   this.userRight = this.user
      // }
      // this.userLeftmenu = this.leftmenu
    }, 600)
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.front-index{
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  // bottom: 0px;
  background: #f1f2f7;
  min-width: 1200px;
  &>header{
    height: 56px;
    background: #5FA2F9;

    &>div{
      width: 1200px;
      margin: 0 auto;

      .el-col:first-child{
        cursor: pointer;
        line-height: 54px;
        img{
          vertical-align: middle;
          width: 41px;
        }
        span{
          vertical-align: middle;
          font-size: 20px;
          margin-left: $width/2;
          color: #fff;
        }
      }

      .el-col:nth-child(2){
        line-height: 54px;
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

      .el-col:last-child{
        text-align: right;
        .el-dropdown-link{
          line-height: 55px;
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
            text-align: center;
            line-height: 36px;
            vertical-align: middle;
          }
        }
        // img{
        //   margin-top: 13px;
        //   width: 30px;
        //   height: 30px;
        //   vertical-align: middle;
        // }
        // span{
        //   margin-top: 12px;
        //   cursor: pointer;
        //   display: inline-block;
        //   padding: 0 5px;
        //   vertical-align: middle;
        //   font-size: 15px;
        // }
      }
    }
  }

  .front-index-middle{
    min-height: calc(100vh - 164px);
    background: #f1f2f7;
  }

  &>.footer{
    position: absolute;
    font-size: 12px;
    left: 0;
    right: 0;
    background: #333333;
    text-align: center;
    color: #fff;
    padding: 23px;
    p{
      margin: 10px;
    }
  }

  .item {
    sup {
      position: absolute;
      top: 20px;
      padding: 0;
      width: 13px;
      height: 13px;
      line-height: 13px;
    }
  }
}
</style>
