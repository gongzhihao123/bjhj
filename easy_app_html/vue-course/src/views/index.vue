<template>
  <div id="index">
      <div class="main">
        <!-- <nav class="nav">
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
          <ul class="nav-list">
            <li v-for="(item, i) in navList" :key="item.name" @click="route(item, i)" :class="{active: activeInd === i}">{{ item.name }}
            </li>
          </ul>
        </nav> -->
      </div>
      <main >
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </main>
  </div>
</template>
<script>
// import { notice } from '../api/index'
// import { mapActions } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      // navList: [
      //   { name: '基础信息', path: '/basicInfo' },
      //   { name: '排课规则', path: '/rules' },
      //   { name: '走班排课', path: '/brainpower' },
      //   { name: '课表查看', path: '/check' }
      // ],
      // activeInd: 1,
      // semesterList: [],
      // semesterValue: '',
      // sectionValue: '',
      // sectionList: [],
      // isActive: false
    }
  }
  // methods: {
  //   ...mapActions([
  //     'semesterId',
  //     'section'
  //   ]),
  //   route (item, i) {
  //     if (!i) {
  //       let href = window.location.href.split('/').filter(item => item)
  //       window.open(`${href[0]}//${href[1]}/education`)
  //       return
  //     }
  //     this.activeInd = i
  //     this.$router.push(item.path)
  //   },
  //   // 切换学期事件
  //   semesterChange (val) {
  //     this.semesterId(this.semesterList[val])
  //   },
  //   // 切换学段
  //   sectionChange (val) {
  //     this.section(this.sectionList[val])
  //   },
  //   // 获取学期信息接口
  //   getSemesterList () {
  //     this.$https.get('common/selectSemesterList')
  //     .then(res => {
  //       if (res.data.code === 1) {
  //         this.semesterList = res.data.result
  //         res.data.result.forEach((item, i) => {
  //           if (item.state === 1) {
  //             this.semesterValue = i
  //           }
  //         })
  //       } else {
  //         notice(this, res.data.message, 2000)
  //       }
  //     })
  //   },
  //   // 获取学段信息接口
  //   getSectionList () {
  //     this.$https.get('common/sectionList')
  //     .then(res => {
  //       if (res.data.code === 1) {
  //         this.sectionList = res.data.result
  //         if (!res.data.result) return
  //         this.sectionValue = 0
  //       } else {
  //         notice(this, res.data.message, 2000)
  //       }
  //     })
  //   }
  // },
  // created () {
  //   this.activeInd = this.$route.meta.page
  //   this.getSemesterList()
  //   this.getSectionList()
  // }
}
</script>

<style lang="scss" scoped>
#index {
  height: calc(100% - 70px);
  .main, main {
    position: relative;
    padding: 10px;
    max-width: 1560px;
    margin: 0 auto;
    background:#fff;
    min-width: 1200px;
    padding-bottom: 0px;
    // height: 100%;
    // min-height: 700px;
    .nav {
      &>div {
        float: left;
      }
    }
    .nav-list {
      // margin-top: 10px;
      li {
        display: inline-block;
        height: 33px;
        line-height: 33px;
        width: 94px;
        text-align: center;
        padding-left: 20px;
        border: 2px solid #93E1B1;
        margin: 10px;
        margin-top: 0;
        margin-bottom: 0;
        color: #40BB8A;
        border-radius: 5px 5px 5px 5px;
        overflow: hidden;
        cursor: pointer;
        &:nth-child(1) {
          background: url(../assets/images/jcxx.png) no-repeat 12px 8px;
          &.active {
            background: url(../assets/images/jcxx-selected.png);
          }
        }
        &:nth-child(2) {
          background: url(../assets/images/pkgz.png) no-repeat 12px 8px;
          &.active {
            background: #40BB8A url(../assets/images/pkgz-selected.png) no-repeat 12px 8px;
            color: #fff;
          }
        }
        &:nth-child(3) {
          background: url(../assets/images/znpk.png) no-repeat 12px 8px;
          &.active {
            background: #40BB8A url(../assets/images/znpk-selected.png) no-repeat 12px 8px;
            color: #fff;
          }
        }
        &:nth-child(4) {
          background: url(../assets/images/kbck.png) no-repeat 12px 8px;
          &.active {
            background: #40BB8A url(../assets/images/kbck-selected.png) no-repeat 12px 8px;
            color: #fff;
          }
        }
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
  .el-select {
    margin-right: 20px;
  }
  > main {
    height: calc(100%);
    padding: 0 20px;
  }
}
</style>
