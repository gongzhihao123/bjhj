<template>
  <div class='detail'>
    <mt-header title="任务详情">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>

    <div>
      <main>
        <p>
          {{ detail.title }}
        </p>

        <div>
          <p>
            任务：{{ detail.taskName }}
          </p>
          <p>
            截止：{{ detail.finishTime | dateFormat('yyyy-MM-dd HH:mm') }}
          </p>
          <p>
            <span  v-if="detail.finishedNum === detail.totalNum">
            已完成
          </span>
          <span v-else>
            <i style="color: #FF9223;" v-if="detail.days < 0">
              已延期{{ Math.abs(detail.days) }}天
            </i>
            <i style="color: #48BB58;" v-else>
              进行中
            </i>
          </span>
            |
            <span v-if="detail.rank === 1">普通</span>
            <span v-if="detail.rank === 2">重要</span>
            <span v-if="detail.rank === 3">紧急</span>
            <span v-if="detail.rank === 4">重要且紧急</span>
            |
            {{ detail.createdUserName }}
          </p>
          <p>
            参与人：
            <span v-for="(item, index) in detail.userList" :key="index">
              {{ item.userName }}、
            </span>
          </p>
        </div>

        <div v-html="detail.content">

        </div>

        <div>
          <span>
            附件：
          </span>
          <p style="cursor: pointer;color: #409EFF;" v-for="(item, index) in detail.attachmentList" :key="index" @click="download(item)">
            {{ item.fileName }}
          </p>
        </div>
      </main>

      <footer>
        <mt-navbar v-model="selected">
          <mt-tab-item id="1">完成</mt-tab-item>
          <mt-tab-item id="2">未完成</mt-tab-item>
        </mt-navbar>

        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">
            <el-row v-for="(item, index) in detail.userList" :key="index" v-if="item.feedbackFlag">
              <el-col :span="14">
                <p>
                  {{ item.userName }}
                </p>
              </el-col>
              <el-col :span="10">
                {{ item.feedbackTime | dateFormat('yyyy-MM-dd HH:mm') }}
              </el-col>

              <el-col :span="24">
                <p>
                  {{ item.feedback }}
                </p>
              </el-col>

              <el-col :span="24">
                <p style="color: #25A9F9;" v-for="(child, index) in item.attachmentList" :key="index" @click="download(child)">
                  <sup v-if="child.fileName && child.fileName.length >= 37"> {{ child.fileName.slice(0, 30) + '...' + child.fileName.slice(child.fileName.length - 6, child.fileName.length) }} </sup>
                  <sup v-else> {{ child.fileName }} </sup>
                </p>
              </el-col>
            </el-row>
          </mt-tab-container-item>
          <mt-tab-container-item id="2">
            <el-row :span="20" v-for="(item, index) in detail.userList" :key="index" v-if="!item.feedbackFlag">
              <el-col>
                <p>
                  {{ item.userName }}
                </p>
              </el-col>
            </el-row>
          </mt-tab-container-item>
        </mt-tab-container>
      </footer>
    </div>
    <aside @click="route" v-if="show && editFlag" :class="{complete: complete === true}">
      完成任务
    </aside>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {
      complete: true,
      selected: '1',
      editFlag: false,
      detail: {},
      show: true
    }
  },
  methods: {
    route () {
      if (!this.complete) this.$router.push('/completeTask')
    },
    download (val) {
      const path = document.getElementById('contextPath').value
      window.location.href = `${this.$store.state.user.previewUrl}${this.$store.state.user.rootUrl}${path}/common/download?fileName=${val.fileName}&filePath=${val.filePath}`
    },
    async getDetail () {
      const data = await this.$store.dispatch('taskChildDetail', {
        taskChildId: sessionStorage.TASK_MOBILE_TASKID
      })
      this.detail = data
      this.detail.userList.forEach(item => {
        if (item.editFlag) {
          this.editFlag = true
        }
        if (item.editFlag && !item.feedback) {
          this.complete = false
          sessionStorage.TASK_ID = item.id
        }
      })
    }
  },
  watch: {
  },
  created () {
    if (sessionStorage.TYPE === '2') {
      this.show = false
    }
    this.getDetail()
  }
}
</script>

<style lang="scss">
@import '../assets/scss/mixin.scss';
.detail {
  background: #fff;
  height: 100%;

  &>header {
    background: #fff;
    color: #4B4B4B;
    height: 96px;
    padding: 0 30px;
    i {
      font-size:  30px;
    }
    h1 {
      font-size: 36px;
      line-height: 96px;
    }
    .mint-button-text {
      font-size: 32px;
    }
  }

  &>div {
    height: 90%;
    overflow-x: hidden;
    &>main {
      background: #fff;
      padding: 0 30px;
      border-top: 6px solid #F4F4F5;
      border-bottom: 16px solid #F4F4F5;
      i {
        font-style: normal;
      }
      &>p {
        font-size: 42px;
        font-weight: bold;
        padding: 10px 0;
      }

      &>div:nth-child(2) {
        &>p {
          color: #929292;
          font-size: 28px;
          margin-bottom: 10px;
        }
      }
      &>div:nth-child(3) {
        color: #555555;
        margin: 16px 0;
        font-size: 32px;
      }

      &>div:nth-child(4) {
        padding: 16px 0;
        border-top: 2px solid #F7F7F7;
        &>span {
          font-size: 32px;
        }
        &>p {
          color: #4BABDE;
          margin-top: 10px;
          font-size: 28px;
        }
      }
    }

    &>footer {
      margin-bottom: 120px;
      background: #fff;
      .el-row {
        padding: 20px 40px;
        border-bottom: 4px solid #F7F7F9;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .el-col-20 {
          line-height: 50px;
          font-size: 30px;
        }
        .el-col-10 {
          text-align: right;
        }
        sup {
          font-size: 28px;
        }
      }
      .mint-tab-item-label {
        font-size: 36px;
      }
    }
  }

  &>aside {
    position: fixed;
    bottom: 0;
    background: #25A9F9;
    width: 100%;
    height: 80px;
    text-align: center;
    line-height: 80px;
    color: #fff;
    font-size: 40px;
    &:active {
      background: #52B4F2;
    }
    &.complete{
      background: #ddd;
    }
  }
}
</style>
