<template>
  <div class='user'>
    <mt-header title="选择参与人">
      <router-link to="" slot="left" @click.native="toTask">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right" @click.native="$router.push('/addTask')">确定</mt-button>
    </mt-header>

    <main>
      <el-input
        placeholder="请输入名字"
        v-model="searchContent">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <mt-checklist
        v-model="value"
        :options="options">
      </mt-checklist>
    </main>
  </div>
</template>

<script>
export default {
  name: 'user',
  data () {
    return {
      value: [],
      searchContent: '',
      options: [],
      userList: [],
      userData: []
    }
  },
  methods: {
    toTask () {
      sessionStorage.TASK_USER = JSON.stringify(this.userData)
      this.$router.push('/addTask')
    },
    async getUser () {
      const data = await this.$store.dispatch('getUser')
      data.users.forEach((item) => {
        this.options.push({ label: item.name, value: {userId: item.userId, userName: item.name} })
        this.userList.push({ name: item.name, userId: item.userId })
      })
    }
  },
  watch: {
    async searchContent () {
      this.options = []
      this.userList.filter(item => (item.name.indexOf(this.searchContent) !== -1)).forEach((item) => {
        this.options.push({ label: item.name, value: {userId: item.userId, userName: item.name} })
      })
    },
    value () {
      sessionStorage.TASK_USER = JSON.stringify(this.value)
    }
  },
  created () {
    if (sessionStorage.TASK_USER) {
      this.value = JSON.parse(sessionStorage.TASK_USER)
      this.userData = JSON.parse(sessionStorage.TASK_USER)
    }
    this.getUser()
  }
}
</script>

<style lang="scss">
@import '../assets/scss/mixin.scss';
.user {
  background: #fff;
  height: 100%;
  &>header {
    background: #fff;
    color: #4B4B4B;
    height: 96px;
    padding: 0 20px;
    h1 {
      font-size: 42px;
      line-height: 96px;
    }
    i {
      font-size:  30px;
    }
    .mint-button-text {
      font-size: 32px;
    }
  }
  .mint-checkbox-core {
    border: 4px solid #ddd;
    width: 30px;
    height: 30px;
  }
  .mint-checkbox-label {
    font-size: 32px;
  }
  .mint-checkbox-core::after {
    top: 8px;
    left: 13px;
  }
  .mint-cell {
    height: 80px;
    border-bottom: 4px solid #ddd;
    .mint-cell-wrapper {
      line-height: 80px;
    }
    &:active {
      background: #ddd;
    }
  }
  &>main {
    .el-input {
      i {
        line-height: 80px;
        font-size: 30px;
      }
    }
    .el-input__inner {
      height: 80px;
      font-size: 36px;
      line-height: 40px;
      padding-left: 60px;
    }
    .el-input__inner::placeholder {
      font-size: 36px;
    }
    border-top: 16px solid #F3F3F3;
    overflow-x: hidden;
    height: 90%;
  }
}
</style>
