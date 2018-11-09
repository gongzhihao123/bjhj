<template>
    <div id="checkCourse">
        <!-- 内容区 -->
        <div class="Info">
          <h2>{{Info.microclassName}}<span>{{Info.uploadUserName}}</span></h2>
          <!-- <vue-video :src="Info.microclassUrl" poster="" style="width: 100%;" v-if="Info.microclassUrl" v-loading="loading"></vue-video> -->
          <div class="content">
            <iframe :src="Info.microclassUrl" width="100%" height="600" frameborder="no" allowfullscreen="true" allowtransparency="true" v-loading="loading"></iframe>
          </div>
          <!-- 简介评论区 -->
          <div class="intro">
            <h2>微课简介:</h2>
            <div class="intro-content">{{Info.microclassInfo}}</div>
          </div>

          <div class="check-btn">
              <el-button type="primary" @click="check(1)">通过</el-button>
              <el-button type="danger" @click="check(2)">驳回</el-button>
              <el-button @click="back">返回</el-button>
          </div>
        </div>
        </div>
</template>

<script>
import { success } from '../../utils/index'
import vueVideo from '../../components/video'
export default {
  name: 'checkCourse',
  data () {
    return {
      textarea: '',
      loading: false,
      checkItem: {},
      Info: {}
    }
  },
  methods: {
    async check (num) {
      const data = await this.$store.dispatch('CheckCourse', {
        id: this.checkItem.id,
        checkState: num,
        checkUser: this.checkItem.checkUser
      })
      success(data)
      this.$router.push('/manage')
    },
    back () {
      this.$router.push('/manage')
    },
    async getCourse () {
      const data = await this.$store.dispatch('getCourse', {
        microclassId: this.checkItem.id
      })
      this.Info = data
      const path = document.getElementById('contextPath').value
      this.Info.microclassUrl = path + '/common/microclassView/' + this.Info.id
      setTimeout(() => {
        this.loading = false
      }, 2000)
    }
  },
  async created () {
    this.loading = true
    this.checkItem = JSON.parse(sessionStorage.checkItem)
    await this.getCourse()
  },
  components: {
    vueVideo
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/main.scss';
@import '../../assets/scss/index.scss';
#checkCourse {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;

  li {
    list-style-type: none;
  }

  .el-breadcrumb {
    padding: 20px;
    border-bottom: 1px solid #DAE2ED;
  }
  .content {
    padding: 0px 50px;
  }
    iframe {
      margin: 30px auto !important;
      /* width: 90% !important; */
      height: 600px !important;
    }
    .vjs-icon-play:before {
      text-align: center;
      line-height: 56px;
    }
  .Info {
    /* height: calc(100vh - 175px); */
    /* overflow: scroll; */
    &>h2 {
      text-align: center;
      margin-top: 0px;
      padding-top: 20px;

      &>span {
        font-weight: normal;
        margin-left: 20px;
        font-size: 16px;
      }
    }
    .intro, .comment {
      width: 90%;
      margin: 30px auto;
      &>h2 {
        font-size: 16px;
      }
    }
    .intro-content {
      line-height: 30px;
    }

    .check-btn {
      padding: 20px;
      text-align: right;
    }
  }
}
</style>
