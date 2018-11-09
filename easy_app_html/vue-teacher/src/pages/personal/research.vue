<template>
  <div class="plan">
    <div class="header">教育研究</div>
    <div class="plannContent">
      <div class="header">
        <ul>
          <li v-for="(item, index) in navList" :key="index" :class="active === index ? 'active' : '' " @click="focus(item, index)">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'plan',
  data () {
    return {
      navList: [
        {path: '/research/record', name: '课题研究及活动记录'},
        {path: '/research/paper', name: '发表或获奖论文'},
        {path: '/research/train', name: '课题培训'}
      ],
      active: 0
    }
  },
  methods: {
    focus (item, index) {
      this.active = index
      this.$router.push(item.path)
    }
  },
  mounted () {
    if (this.$router.history.current.name === '教育研究') {
      this.$router.push('/research/record')
    }
    this.navList.forEach((item, index) => {
      if (this.$router.history.current.name === item.name) {
        this.active = index
      }
    })
  }
}
</script>
<style scoped lang='scss'>
.plan {
  padding: 22px;
  > .header {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    &::before {
      height: 15px;
      width: 3px;
      content: '';
      display: block;
      background: #4c73eb;
      margin-top: 2px;
      margin-right: 10px;
    }
  }
  .plannContent {
    width: 100%;
    height: calc(100vh - 135px);
    background: #fff;
    margin-top: 10px;
    border-radius: 5px;
    box-sizing: border-box;
    > .header {
      width: 100%;
      padding: 10px 10px 0px 10px;
      border-bottom: 1px solid #E3E3E3;
      ul {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        li {
          margin: 0 10px;
          &.active {
            &::after {
              display: block;
              content: '';
              width: 100%;
              height: 2px;
              background: #4c73eb;
              margin-top: 10px;
            }
          }
        }
      }
    }
    > .content {
      width: 100%;
      height: calc(100% - 40px);
    }
  }
}
</style>
