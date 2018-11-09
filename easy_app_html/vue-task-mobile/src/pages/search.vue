<template>
  <div class='search'>
    <header>
      <span @click="$router.push('/')">
        取消
      </span>
      <el-input
        placeholder="请输入内容"
        v-model="searchContent">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </header>

    <main>
      <ul>
        <li v-for="(item, index) in taskList" :key="index" @click="toDetail(item)">
          <p>
            <i> {{ item.finishTime | dateFormat('yyyy-MM-dd HH:mm') }} </i>
            <span v-if="item.title.length >= 10"> {{ item.title.slice(0, 10) + '...' }} </span>
            <span v-else> {{ item.title }} </span>
          </p>
          <p>
            <i>
              <span  v-if="item.finishedNum === item.totalNum">
                已完成
              </span>
              <span  v-else>
                <i style="color: #FF9223;" v-if="item.days < 0">
                  已延期{{ Math.abs(item.days) }}天
                </i>
                <i style="color: #48BB58;" v-else>
                  进行中
                </i>
              </span>
            </i>
            <i>
              <span v-if="item.taskName.length >= 4"> {{ item.taskName.slice(0, 2) + '...' }} </span>
              <span v-else> {{ item.taskName }} </span>
            </i>
            <span>
              <i>
                {{ item.createdUserName }}
              </i>
              完成 {{ item.finishedNum }}/{{ item.totalNum }}
            </span>
            <span v-if="$route.query.type === '1'">
              <i v-if="item.feedbackFlag" style="color: #74BC43;">
               我已完成
              </i>
              <i v-else style="color: #C13108;">
                我未完成
              </i>
            </span>
          </p>
        </li>
        <li style="text-align: center;" v-if="taskList.length === 0">
          无搜索结果
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      searchContent: '',
      taskList: []
    }
  },
  methods: {
    // 跳转详情
    toDetail (item) {
      sessionStorage.TASK_MOBILE_TASKID = item.id
      this.$router.push('/detail')
    },
    // 获取我负责的子任务
    async chargeList () {
      const data = await this.$store.dispatch('chargeList', {
        taskId: this.$route.query.searchLabel,
        state: this.$route.query.searchState,
        title: this.searchContent,
        pageNo: 1,
        pageSize: 2000
      })
      this.taskList = data.list
    },
    // 获取我参与的子任务列表
    async participateList () {
      const data = await this.$store.dispatch('participateList', {
        taskId: this.$route.query.searchLabel,
        state: this.$route.query.searchState,
        title: this.searchContent,
        pageNo: 1,
        pageSize: 2000
      })
      this.taskList = data.list
    },
    // 获取任务总览子任务列表
    async overviewList () {
      const data = await this.$store.dispatch('overviewList', {
        taskId: this.$route.query.searchLabel,
        state: this.$route.query.searchState,
        title: this.searchContent,
        pageNo: 1,
        pageSize: 2000
      })
      this.taskList = data.list
    }
  },
  watch: {
    searchContent () {
      if (this.$route.query.type === 0) {
        this.chargeList()
      } else if (this.$route.query.type === 2) {
        this.participateList()
      } else {
        this.overviewList()
      }
    }
  },
  created () {
    if (this.$route.query.type === '0') {
      this.chargeList()
    } else if (this.$route.query.type === 2) {
      this.participateList()
    } else {
      this.overviewList()
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/mixin.scss';
.search {
  background: #fff;
  height: 100%;
  &>header {
    padding: 20px 30px;
    border-bottom: 2px solid #E7E9EC;
    &>span {
      float: right;
      font-size: 32px;
      line-height: 64px;
      color: #363636;
    }
    .el-input {
      width: 70%;
      i {
        line-height: 60px;
        font-size: 30px;
      }
      .el-input__inner {
        padding-left: 60px;
        border-radius: 40px;
        background: #F3F3F3;
        border: 0;
        font-size: 30px;
        height: 60px;
      }
      .el-input__inner::placeholder {
        font-size: 30px;
      }
    }
  }

  &>main {
    width: 100%;
    display: flex;
    background: #fff;
    height: 88%;
    overflow-x: hidden;
    ul {
      width: 100%;
      li {
        padding: 20px 30px;
        border-bottom: 4px solid #F1F2F4;
        &:active {
          background: #F3F3F3;
        }
        i {
          font-style: normal;
          // font-size: 24px;
        }
        span {
          font-size: 28px;
        }
        &>p:nth-child(1) {
          &>i {
            color: #A3A3A3;
            font-size: 24px;
            float: right;
          }
          span {
            font-size: 32px;
          }
        }
        &>p:nth-child(2) {
          margin-top: 10px;
          &>i:nth-child(1) {
            line-height: 40px;
            color: #A3A3A3;
            float: right;
            font-size: 24px;
          }
          &>i:nth-child(2) {
            display: inline-block;
            width: 100px;
            height: 38px;
            text-align: center;
            line-height: 38px;
            border-radius: 20px;
            color: #0D8DD3;
            border: 4px solid #0D8DD3;
            span {
              font-size: 24px;
            }
          }
          &>span:nth-child(3) {
            i {
              border-right: 2px solid #8F8F8F;
              padding-right: 4px;
              margin-right: 10px;
              font-size: 28px;
            }
          }
        }
      }
    }
  }
}
</style>
