<template>
  <div class="changeDetails">
      <p>当前位置： 课题管理</p>
      <ul class="two-level-nav" v-if="this.$route.query.userType == 1">
          <li v-for="(item, index) in liList" :key="item.name">
            <router-link :to="{path: item.path, query: {item: ids, userType: userType, stage: stage, signFlag: signFlag, checkState: checkState}}" active-class="active">{{item.name}}</router-link>
          </li>
      </ul>
      <ul class="two-level-nav three" v-else>
          <li v-for="(item, index) in liLists" :key="item.name" :class="{'li-active': index == activeIndex}">
            <router-link :to="{path: item.path, query: {item: ids, userType: userType, stage: stage, signFlag: signFlag, checkState: checkState}}" active-class="active">{{item.name}}</router-link>
          </li>
      </ul>
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'changeDetails',
  data () {
    return {
      liList: [
        {name: '建立课题计划', path: '/subjectManager/addPlan'},
        {name: '课题组成员管理', path: '/subjectManager/peopleManage'},
        {name: '提交阶段报告', path: '/subjectManager/subminPlan'},
        {name: '课题资料', path: '/subjectManager/projectData'},
        {name: '研究日志', path: '/subjectManager/studyLog'},
        {name: '研究活动', path: '/subjectManager/studyActive'}
      ],
      liLists: [
        {name: '课题资料', path: '/subjectManager/projectData'},
        {name: '研究日志', path: '/subjectManager/studyLog'},
        {name: '研究活动', path: '/subjectManager/studyActive'}
      ],
      activeIndex: 0
    }
  },
  computed: {
    ids () {
      return this.$route.query.item
    },
    userType () {
      return this.$route.query.userType
    },
    stage () {
      return this.$route.query.stage
    },
    signFlag () {
      return this.$route.query.signFlag
    },
    checkState () {
      return this.$route.query.checkState
    }
  },
  created () {
    if (this.$route.query.userType === 2) {
      this.$router.push({path: '/subjectManager/projectData', query: this.$route.query})
      this.activeIndex = 0
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/subjectManager/projectData') {
        this.activeIndex = 0
      } else {
        this.activeIndex = -1
      }
    }
  }
}
</script>

<style lang="scss">
.changeDetails {
  &>p {
    margin-bottom: 20px;
  }
  .two-level-nav {
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin-top: 20px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    display: block;
    background: #fff;
    
    li {
      float: left;
      width: calc(100% / 6);
      cursor: pointer;
      a {
        display: inline-block;
        width: 70%;
        height: 100%;
      }
    }
    .active {
      border-bottom: 3px solid #5295EB;
      color: #5295EB;
    }
  }
  .three {
    li {
      width: calc(100% / 3)
    }
    .li-active {
      a {
        border-bottom: 3px solid #5295EB;
      }
    }
  }
}
</style>
