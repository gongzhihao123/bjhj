<template>
  <div class="subject-index">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="bread.url">{{bread.name}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="!flag">{{navList[activeNum].name}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="flag" :to="secondUrl">{{navList[activeNum].name}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="flag">活动详情</el-breadcrumb-item>
    </el-breadcrumb> 
          
    <header>
      <ul>
        <li v-for="(item, index) in navList" :key="index" :class="{ navActive: activeNum === index}" @click="route(item)">
          <span>{{item.name}}</span>
        </li>
      </ul>
    </header>
    <main>
      <transition name="fadeIn" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
  </div>
</template>

<script>
import { notice } from '../../../api/index.js'
// import { mapGetters } from 'vuex'
export default {
  name: 'subject-index',
  data () {
    return {
      bread: {},
      activeNum: 0,
      flag: false,
      secondUrl: '',
      navList: [
        {img: '', name: '课程概述', path: '/subjectDetail/intro'},
        {img: '', name: '阶段报告', path: '/subjectDetail/state'},
        {img: '', name: '课题资料', path: '/subjectDetail/meterical'},
        {img: '', name: '研究日志', path: '/subjectDetail/daily'},
        {img: '', name: '研究活动', path: '/subjectDetail/active'}
      ]
    }
  },
  methods: {
    route (item) {
      if (JSON.parse(sessionStorage.open) === 2 && item.name !== '课程概述') {
        notice(this, '当前课题未公开，您不能查看详情', 2000)
      } else {
        this.$router.push(`${item.path}`)
      }
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'remind'
  //   ])
  // },
  watch: {
    '$route' (to) {
      this.activeNum = to.meta.num
      if (window.location.href.indexOf('/subjectDetail/detail') > 0) {
        this.secondUrl = '/subjectDetail/active'
        this.flag = true
      } else {
        this.flag = false
      }
    }
  },
  created () {
    this.bread = JSON.parse(sessionStorage.bread)
    this.activeNum = this.$route.meta.num
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.subject-index{
background: #f1f2f7;

  .el-breadcrumb  {
    width: 1200px;
    margin: 20px auto;
  }
  header{
    /* background: #1AB3F7; */
    &>ul{
      list-style: none;
      padding: 0;
      width: 1200px;
      margin: 10px auto 0px;
      min-height: 61px;
      line-height: 61px;
      border-bottom: 1px solid #EBEEF7;
      background: #fff;

      li {
        float: left;
        margin: 0 40px;
        width: 66px;

        span {
          font-size: 16px;
          padding: 20px 0px;
          color: #999999;
          cursor: pointer;          
        }
      }
      .navActive {
        &>span {
          color: #5295EB;
          border-bottom: 2px solid #5295EB;
        }
      }
    }
  }
}
</style>
