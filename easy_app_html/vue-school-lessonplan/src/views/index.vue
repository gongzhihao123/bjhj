<template>
  <div id="index">
    <!--头部-->
    <div class="head">
      <img src="../assets/images/xietong-tb.png">
      <div class="userInfo">
        <a  class="person">
          <img src="../assets/images/bpeople.png" v-if="!userInfo.userFace">
          <img :src="userInfo.userFace" v-if="userInfo.userFace"/>
          <span>{{user.user.loginUser.name}}</span>
          <i class="el-icon-arrow-down"></i>
        </a>
        <div class="list">
          <a  @click="logout">退出</a>
        </div>
      </div>
    </div>
    
    <!--内容-->
    <div class="content">
      <div class="nav">
        <ul v-loading="navloading">
          <li :class="{ 'active': activeInd == index }" v-for="(item, index) in navInfo" :key="index" @click="link(item, index)" v-if="item.Check">
            <img src="../assets/images/square.png" v-if="index === 0">
            <img src="../assets/images/square_active.png" v-if="index === 0&& activeInd === index">
            <img src="../assets/images/my.png" v-if="index === 1">
            <img src="../assets/images/my_active.png" v-if="index === 1&& activeInd === index">
            <img src="../assets/images/lessoncheck.png" v-if="index === 2">
            <img src="../assets/images/lessoncheck_active.png" v-if="index === 2&& activeInd === index">
            <img src="../assets/images/lessonmanage.png" v-if="index === 3">
            <img src="../assets/images/lessonmanage_active.png" v-if="index === 3&& activeInd === index">
            <a>{{item.name}}</a>
          </li>
        </ul>
      </div>
      <div class="appInfo">
        <transition name="slide-left" mode="out-in">
          <router-view></router-view>  
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { error, notice } from '../api/index.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      userInfo: {rights: []},
      rightList: [],
      navloading: false,
      navInfo: [
        {name: '教案广场', Check: true},
        {name: '我的', Check: true},
        {name: '备课检查', Check: false},
        {name: '备课管理', Check: false}
      ],
      activeInd: 0
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'path'
    ])
  },
  methods: {
    ...mapActions([
      'my',
      'hide'
    ]),
    link (item, index) {
      this.activeInd = index
      localStorage.activeInd = 0
      sessionStorage.currentPage = 1
      this.hide(item)
      setTimeout(() => {
        if (this.activeInd === 0) {
          this.$router.push({path: '/square', query: {name: this.navInfo[this.activeInd].name}})
        }
        if (this.activeInd === 1) {
          this.$router.push({path: '/my', query: {name: this.navInfo[this.activeInd].name}})
          this.my('1')
        }
        if (this.activeInd === 2) {
          this.$router.push({path: '/check', query: {name: this.navInfo[this.activeInd].name}})
        }
        if (this.activeInd === 3) {
          this.$router.push({path: '/set', query: {name: this.navInfo[this.activeInd].name}})
          this.my('2')
        }
      }, 100)
    },
    getMenu () {
      // 获取页面菜单信息
      this.$https.get(`/common/initPage`)
      .then(res => {
        if (res.data.code === 1) {
          this.navInfo = res.data.result.rightList
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    logout () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/logout`
    }
  },
  watch: {
    $route (to, from) {
      this.activeInd = to.meta.num
    }
  },
  created () {
    this.navloading = true
    setTimeout(() => {
      this.userInfo = this.user.user.loginUser
      this.rightList = this.user.user.rightList
      if (this.userInfo.rights) {
        let a = this.userInfo.rights.join(',')
        if (a.indexOf('/check/*') !== -1) this.navInfo[2].Check = true
        if (a.indexOf('/lessonSet/*') !== -1) this.navInfo[3].Check = true
      }
      this.navloading = false
    }, 300)
    if (this.$route.meta.num === undefined) {
      this.activeInd = 0
    } else {
      this.activeInd = this.$route.meta.num
    }
  }
}
</script>

<style lang="scss" scoped>
#index {
  margin: 0px;
  width: 100%;
  height: auto;
  background: #EAF0F9;
  overflow: hidden;

 .head {
   width: 100%;
   min-width: 1312px;
   height: 57px;
   background: #3281F8;
   box-shadow: 0px 3px 7px #A7D4FF;

   img {
     margin: 11px 0px 10px 40px;
   }
  .userInfo {
    width: auto;
    float: right;
    position: relative;
    margin-right: 62px;   

    .person {
      color: #fff;
      text-decoration: none;
      display: block;

        img {
          width: 43px;
          height: 43px;
          margin: 7px 0px;
          float: left;
          border-radius: 100%;
        }
        span {
          color: #fff;
          margin:  18px 30px 18px 20px;
          float: left;
        }
        i {
          font-style: normal;
          float: left;
          margin-top: 21px;
          font-size: 14px;
        }
      }
      .person:after {
        content: "";        
        display: block;               
        clear: both;
      }
      .list {
        display: none;
        position: absolute;
        border: 1px solid #ccc;
        right: 6px;
        top: 45px;
        background: #fff;
        z-index: 10;

        a {
          width: 120px;
          text-align: center;
          color: rgb(71, 86, 105);
          line-height: 25px;
          text-decoration: none;
          display: block;
        }
        a:hover {
          background: #e5e5e5;
          cursor: pointer;
        }
      }
    }
    .userInfo:hover  {
      .list {
        display: block;
      }
    }   
 }

 .content {
   margin: 15px 20px 0px 20px;
   display: flex;
   background: #EAF0F9;
   padding-bottom: 20px;
   .nav {
     width: 227px;
     border: 1px solid #E3EAF4;
     border-radius: 8px;
     background: #fff;
     margin-right: 20px;

     ul {
       margin-top: 38px;
       padding: 0px;
       li {
         list-style-type: none;
         width: 227px;
         height: 35px;
         line-height: 35px;
         margin-bottom: 25px;
         color: #707886;
         border-left: 2px solid #fff;
         position: relative;

         img {
           position: absolute;
           top: 3px;
           left: 63px;
           /*margin-right: 16px;*/
         }
           a {
             color: #707886;
             display: block;
             line-height: 35px;
             height:　35px;      
             font-size: 14px;
             position: absolute;
             left: 108px;

           }

       }
       li:hover {
         cursor: pointer;
       }
       .active {
         border-left: 2px solid #408EE6;

         a {
           color: #408EE6;
         }
       }
     }
   }
   .appInfo {
     flex-grow: 1;
    //  max-height: 850px;
    //  overflow-x: hidden;
     background: #fff;
     border: 1px solid #E3EAF4;
     border-radius: 8px;
   }
 }

}
</style>
