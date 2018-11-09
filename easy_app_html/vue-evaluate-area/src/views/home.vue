<template>
  <div id="home">
    <!-- 头部 -->
    

    <div class="home-body">
      <div class="home-body-left">
        <ul>
          <li v-if="item.show" v-for="(item, index) in navList" :key="index" @click="route(item,index)" :class="{ 'active': activeInd === item.num }">
            {{item.name}}
          </li>
        </ul>
      </div>
      <div class="home-body-right">
        <transition name="slide-left" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      activeInd: 0,
      navList: [],
      adminFlag: false
    }
  },
  methods: {
    route (item, index) {
      if (index === 5) {
        sessionStorage.active = 1
      }
      if (window.location.href.indexOf('/assessmentTableManager/addTable') !== -1) {
        this.$confirm('确定离开当前页面?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.activeInd = item.num
          this.$router.push(item.children[0].path)
        }).catch(() => {
        })
      } else {
        this.activeInd = item.num
        this.$router.push(item.children[0].path)
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    '$route' (to, form, next) {
      this.activeInd = to.meta.num
    }
  },
  created () {
    this.activeInd = this.$route.meta.num
    setTimeout(() => {
      this.navList = this.$router.options.routes.map(item => ({...item, show: true}))
      if (!this.user.adminFlag || this.user.companyType === 1) {
        this.navList[4].show = false
      }
      if (!this.user.evalFlag) {
        this.navList[2].show = false
        this.navList[3].show = false
      }
      if (!this.user.checkFlag) {
        this.navList[5].show = false
      }
      if (!this.user.deptFlag) {
        this.navList[6].show = false
      }
    }, 400)
  }
}
</script>

<style lang="scss">
@import '../assets/scss/main.scss';
#home{
  // min-width: 1366px;
  background: #F0F0F0;

  .home-body{
    display: flex;
    padding: $width;
    .home-body-left{
      width: 200px;
      background: $white;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      ul{
        width: 200px;
        list-style: none;
        padding:$width/4 0;
        li{
          line-height: 48px;
          color: #3F474A;
          padding-left: 70px;
          border-left: 2px solid transparent;
          cursor: pointer;
          font-size: 14px;
        }
        .active{
          background: #C7EEFF;
          border-left: 2px solid #1EB8FE;
        }
      }
    }

    .home-body-right{
      flex: 1;
      background: $white;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      margin-left: $width/2;
    }
  }
}
</style>