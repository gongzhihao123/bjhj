<template>
  <div class="basic-index">
    
    <header>
      <ul>
        <li v-for="(item, index) in navList" :key="index" :class="{ navActive: activeNum === index }" @click="jump(item)">
          <el-dropdown trigger="hover" v-if="item.name === '课题管理'">
            
            <span class="el-dropdown-link">
              <img :src="item.icon">
              {{ item.name }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(child, i) in subjectManagerList" :key="i" @click.native="route(child)">{{ child.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

           <el-dropdown trigger="hover" v-if="item.name === '课题库'">
            <span class="el-dropdown-link">
              <img :src="item.icon">
              {{ item.name }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(child, i) in subjectLibraryList" :key="i" @click.native="route(child)">{{ child.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <span v-if="item.name !== '课题库' && item.name !== '课题管理'">
            <img :src="item.icon">
            {{ item.name }}
          </span> 
        </li>
      </ul>
    </header>

    <main class="basic-index-main">
      <transition name="fadeIn" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
  </div>
</template>

<script>
import icon1 from '../../../assets/images/nav-1.png'
import icon2 from '../../../assets/images/nav-2.png'
import icon3 from '../../../assets/images/nav-3.png'
import icon4 from '../../../assets/images/nav-4.png'
import icon5 from '../../../assets/images/nav-5.png'
import icon6 from '../../../assets/images/nav-6.png'
export default {
  name: 'basic-index',
  data () {
    return {
      activeNum: 0,
      navList: [
        { img: '', name: '首页', path: '/homePage/index', icon: icon1 },
        { img: '', name: '政策文件', path: '/governmentDocument/index', icon: icon2 },
        { img: '', name: '课题库', path: '/subjectLibrary/index', icon: icon3 },
        { img: '', name: '课题管理', path: '/subjectManager/index', icon: icon4 },
        { img: '', name: '专家库', path: '/expertsLibrary/index', icon: icon5 },
        { img: '', name: '推介交流', path: '/communication/index', icon: icon6 }
      ],
      subjectManagerList: [
        { name: '我的申报', path: '/subjectManager/myDeclaration' },
        { name: '我的课题', path: '/subjectManager/mySubject' },
        { name: '课题变更', path: '/subjectManager/subjectChange' }
      ],
      subjectLibraryList: [
        { name: '课题列表', path: '/subjectLibrary/subjectList' },
        { name: '课题申报', path: '/subjectLibrary/subjectDeclaration' }
      ]
    }
  },
  methods: {
    route (item) {
      this.$router.push(`${item.path}`)
    },
    jump (item) {
      if (item.name !== '课题库' && item.name !== '课题管理') this.$router.push(`${item.path}`)
    }
  },
  watch: {
    '$route' (to) {
      this.activeNum = to.meta.num
    }
  },
  created () {
    this.activeNum = this.$route.meta.num
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.basic-index{
  background: #f1f2f7;
  min-width: 1200px;
  // padding-bottom: $width;
  &>header{
    background: #5295EB;

    &>ul{
      list-style: none;
      padding: 0;
      width: 1200px;
      height: 44px;
      line-height: 44px;
      margin: 0 auto;

      li{
        width: 200px;
        text-align: center;
        position: relative;
        float: left;
        padding: 0;
        cursor: pointer;
        height: 44px;
        &:hover{
          background: #4788DB;
        }
        
        img {
          vertical-align: middle;
          margin-right: 10px;
          margin-top: -2px;
        }

        span{
          display: block;
          padding: 0 $width;
          font-size: 16px;
          color: #fff;
          cursor: pointer;
        }
      }
      .navActive{
        background: #4788DB;
      }
    }
  }

  .basic-index-main{
    width: 1200px;
    margin: 40px auto;
  }
}
</style>
