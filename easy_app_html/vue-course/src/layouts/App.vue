<template>
  <div id="app">
    <header class="header">
      <div>
        <section>
          <span class="logo"></span>
          走班排课
        </section>

        <nav class="nav">
          <ul class="nav-list">
            <li v-for="(item, i) in navList" :key="item.name" @click="route(item, i)" :class="{active: activeInd === i}">{{ item.name }}
            </li>
          </ul>
          <div>
            <span>学期选择 &nbsp;&nbsp;&nbsp;</span>
            <el-select v-model="semesterValue" placeholder="请选择" @change="semesterChange">
              <el-option
                v-for="(item, i) in semesterList"
                :key="item.semesterId"
                :label="item.semesterName"
                :value="i">
              </el-option>
            </el-select>

            <span>学段选择 &nbsp;&nbsp;&nbsp;</span>
            <el-select v-model="sectionValue" placeholder="请选择" @change="sectionChange">
              <el-option
                v-for="(item, i) in sectionList"
                :key="item.id"
                :label="item.name"
                :value="i">
              </el-option>
            </el-select>
          </div>
          
        </nav>

        <div class="head-right">
          <div class="person" >
            <el-dropdown>
              <span class="el-dropdown-link">
                <img :src="user.userFace" width="36" height="36" v-if="user.userFace" style="border-radius: 50%; margin-right: 4px;"/>
                <span v-else class="user-name">{{ user.name ? user.name.slice(-2, user.name.length) : ''}}</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><a @click="logouts" style="color: #333; text-align: center; display: block;">退出</a></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import store from '../store'
import Logo from '../assets/images/course.png'
import { mapGetters, mapActions } from 'vuex'
import { logout, notice } from '../api/index.js'
export default {
  name: 'app',
  data () {
    return {
      Logo,
      navList: [
        { name: '基础信息', path: '/basicInfo' },
        { name: '排课规则', path: '/rules' },
        { name: '走班排课', path: '/brainpower' },
        { name: '课表查看', path: '/check' }
      ],
      activeInd: '',
      semesterList: [],
      semesterValue: '',
      sectionValue: '',
      sectionList: [],
      isActive: false
    }
  },
  beforeCreate () {
    let lessThenIe8 = (function () {
      let UA = navigator.userAgent
      let isIE = UA.indexOf('MSIE') > -1
      let v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie'
      return v < 8
    }())
    if (lessThenIe8) {
      window.alert('您使用的浏览器版本过低请使用ie9及其以上版本')
    }
    store.dispatch('init')
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    ...mapActions([
      'semesterId',
      'section'
    ]),
    back () {
      logout()
    },
    logouts () {
      logout()
    },
    route (item, i) {
      console.log(i)
      if (!i) {
        console.log(this.$store.state.user.name)
        // let href = window.location.href.split('/').filter(item => item)
        // window.open(`${href[0]}//${href[1]}/education`)
        let href = this.$store.state.user.platformUrl
        window.open(`${href}/education`)
        return
      }
      // this.activeInd = this.$route.meta.page
      this.$router.push(item.path)
    },
    // 切换学期事件
    semesterChange (val) {
      this.semesterId(this.semesterList[val])
    },
    // 切换学段
    sectionChange (val) {
      this.section(this.sectionList[val])
    },
    // 获取学期信息接口
    getSemesterList () {
      this.$https.get('common/selectSemesterList')
      .then(res => {
        if (res.data.code === 1) {
          this.semesterList = res.data.result
          res.data.result.forEach((item, i) => {
            if (item.state === 1) {
              this.semesterValue = i
            }
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学段信息接口
    getSectionList () {
      this.$https.get('common/sectionList')
      .then(res => {
        if (res.data.code === 1) {
          this.sectionList = res.data.result
          if (!res.data.result) return
          this.sectionValue = 0
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  watch: {
    '$route' () {
      this.activeInd = this.$route.meta.page
    }
  },
  created () {
    this.getSemesterList()
    this.getSectionList()
  }
}
</script>

<style lang="scss" scoped>
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  min-width: 1200px;
  /*min-height: 960px;*/
  background: #f2f2f2;
  .content {
    padding: 0;
    max-width: 1560px;
    margin: 0 auto;
    background:#fff;
    min-width: 1200px;
    height: calc(100% - 50px);
  }
  .header {
    width: 100%;
    height: 50px;
    background: #51D08F;
    font-size: 18px;
    line-height: 50px;
    color: #fff;
    // margin-bottom: 20px;
    > div {
      padding-left: 20px;
      max-width: 1560px;
      margin: 0 auto;
      min-width: 1200px;
      
      > section > span.logo {
        display: inline-block;
        margin-right: 10px;
        width: 34px;
        height: 34px;
        background: url(../assets/images/course.png) no-repeat center;
        background-size: cover;
        // background-color: red;
        vertical-align: middle;
      }
    }

    section {
      float: left;
    }

    .nav {
      float: left;
      // width: 900px;
      // float: left;
      font-size: 16px;
      &>div {
        float: left;
      }

      .el-select {
        width: 100px;
        &:first-of-type {
          width: 200px;
        }
      }
    }
    .nav-list {
      float: left;
      margin-right: 150px;
      margin-left: 20px;
      height: 50px;
      li {
        display: inline-block;
        height: 50px;
        line-height: 50px;
        width: 94px;
        text-align: center;
        // padding-left: 20px;
        // border: 2px solid #93E1B1;
        margin-top: 0;
        margin-bottom: 0;
        color: #FFF;
        // border-radius: 5px 5px 5px 5px;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          background: #24B96F;
          color: #fff;
        }
        &.active {
          background: #24B96F;
        }
        // &:nth-child(1) {
        //   background: url(../assets/images/jcxx.png) no-repeat 12px 8px;
        //   &.active {
        //     background: url(../assets/images/jcxx-selected.png);
        //   }
        // }
        // &:nth-child(2) {
        //   background: url(../assets/images/pkgz.png) no-repeat 12px 8px;
        //   &.active {
        //     background: #40BB8A url(../assets/images/pkgz-selected.png) no-repeat 12px 8px;
        //     color: #fff;
        //   }
        // }
        // &:nth-child(3) {
        //   background: url(../assets/images/znpk.png) no-repeat 12px 8px;
        //   &.active {
        //     background: #40BB8A url(../assets/images/znpk-selected.png) no-repeat 12px 8px;
        //     color: #fff;
        //   }
        // }
        // &:nth-child(4) {
        //   background: url(../assets/images/kbck.png) no-repeat 12px 8px;
        //   &.active {
        //     background: #40BB8A url(../assets/images/kbck-selected.png) no-repeat 12px 8px;
        //     color: #fff;
        //   }
        // }
        // a {
        //   display: block;
        //   color: #444;
        //   &.active {
        //     background: linear-gradient(180deg, #93E1B1, #40BB8A);
        //     color: #fff;
        //   }
        // }
      }
    }
  }
  .head-right{
    float: right;
    color: #fff;
    line-height: 50px;
    // min-width: 0 !important;
    width: 50px;
    height: 50px;
    margin-right: 20px !important;

    img {
      vertical-align: middle;
    }
    .user-name {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      width: 34px;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      // position: absolute;
      font-size: 14px;
      right: 6px;
      color: #fff;
      padding-left: 3px;
      background-color: #CFE7FF;
      border-radius: 50%;
    }
  }
}
</style>
