<template>
    <div id="course">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{bread.routeName}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{bread.peroid}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{bread.grade}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{bread.subject}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{bread.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="back">返回</el-button>

        <!-- 内容区 -->
        <div class="Info">
          <h2>{{bread.title}}<span>{{bread.author}}</span></h2>
          <!-- <vue-video :src="Info.microclassUrl" poster="" style="width: 100%;" v-if="Info.microclassUrl" v-loading="loading"></vue-video> -->
          <div class="content">
            <iframe :src="Info.microclassUrl" width="100%" height="600" frameborder="no" allowfullscreen="true" allowtransparency="true" v-loading="loading"></iframe>
          </div>
          <!-- 简介评论区 -->
          <div class="intro">
            <h2>微课简介:</h2>
            <div class="intro-content">{{Info.microclassInfo}}</div>
          </div>
          <div class="comment">
          <h2>用户评论:</h2>
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="textarea"
            :maxlength="200">
          </el-input>
          <el-button type="primary" @click="saveComment">我要评论</el-button>

          <!--  评论列表区-->
          <ul class="commentlist">
            <li v-for="(item, index) in commentList" :key="index">
              <img :src="item.userFace" v-if="item.userFace">
              <span class="nametip" v-if="!item.userFace">{{item.userName.slice(item.userName.length - 2, item.userName.length)}}</span>
              <ul>
                <li><span>{{item.userName}}</span> &nbsp;| &nbsp;<span>{{item.createTime | dateFormat('yyyy-MM-ddd')}}</span><li>
                <li><p>{{item.comment}}</p></li>
              </ul>
              <i @click="deleteComment(item)" v-if="bread.uploadUser === userId || adminFlag"><img src="../../assets/images/delete-icon-active.png">删除</i>
            </li>
          </ul>
        </div>
        </div>
    </div>
</template>

<script>
import { success, notice } from '../../utils/index'
import vueVideo from '../../components/video'
export default {
  name: 'course',
  data () {
    return {
      textarea: '',
      bread: {},
      loading: false,
      Info: {},
      commentList: [],
      userType: '',
      userId: '',
      adminFlag: ''
    }
  },
  methods: {
    async saveComment () {
      if (this.textarea === '') {
        notice('评论内容不能为空')
        return
      }
      const data = await this.$store.dispatch('saveComment', {
        userType: this.userType,
        microclassId: this.bread.id,
        comment: this.textarea
      })
      success(data)
      this.textarea = ''
      this.getComment()
    },
    async deleteComment (item) {
      const data = await this.$store.dispatch('deleteComment', {
        commentId: item.id
      })
      success(data)
      this.getComment()
    },
    back () {
      this.$router.push(this.bread.path)
    },
    async getCourse () {
      this.loading = true
      const data = await this.$store.dispatch('getCourse', {
        microclassId: this.bread.id
      })
      this.Info = data
      const path = document.getElementById('contextPath').value
      this.Info.microclassUrl = path + '/common/microclassView/' + this.Info.id
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    async squareDetail () {
      this.loading = true
      const data = await this.$store.dispatch('squareDetail', {
        id: this.bread.id
      })
      this.Info = data
      const path = document.getElementById('contextPath').value
      this.Info.microclassUrl = path + '/common/microclassView/' + this.Info.id
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    async getComment () {
      const data = await this.$store.dispatch('getComment', {
        id: this.bread.id
      })
      this.commentList = data
    }
  },
  async created () {
    this.bread = JSON.parse(sessionStorage.bread)
    if (this.bread.path === '/square') {
      await this.squareDetail()
    } else {
      await this.getCourse()
    }
    await this.getComment()
    setTimeout(() => {
      this.userType = this.$store.state.user.loginUser.userType
      this.adminFlag = this.$store.state.user.loginUser.adminFlag
      this.userId = this.$store.state.user.loginUser.id
    }, 200)
  },
  components: {
    vueVideo
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/main.scss';
@import '../../assets/scss/index.scss';
#course {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;
  position: relative;

  .el-breadcrumb__inner {
    font-weight: normal;
  }

  .nametip {
    width: 50px;
    height: 50px;
    background: #4D5F84;
    color: #fff;
    border-radius: 100%;
    display: inline-block;
    text-align: center;
    line-height: 50px;
    float: left;
  }

  &>.el-button {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  li {
    list-style-type: none;
  }

  .el-breadcrumb {
    padding: 20px;
    border-bottom: 1px solid #DAE2ED;
  }
  .el-breadcrumb__item {
    line-height: 40px;
  }
  .vjs-icon-play:before {
    text-align: center;
    line-height: 56px;
  }
  .Info {
    .content {
      padding: 0px 50px;
    }
    iframe {
      margin: 30px auto !important;
      /* width: 90% !important; */
      height: 600px !important;
    }
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

      .el-textarea__inner {
        resize: none !important;
      }
      .el-textarea {
        margin-bottom: 20px;
      }
      &>.el-button {
        float: right;
        margin-bottom: 50px;
      }
    }
    .intro-content {
      line-height: 30px;
    }
    .commentlist {
      margin: 0px auto;
      clear: both;
      padding: 0px;
      @extend .clearfix;
      display: block;

      &>li {
        border-bottom: 1px dashed #ccc;
        position: relative;
        margin-bottom: 20px;

        &:last-child {
          border-bottom: none;
        }

        &>img {
          width: 50px;
          height: 50px;
          display:inline-block;
          float: left;
          margin-right: 10px;
          border-radius: 100%;
        }
        &>ul {
          max-width: 90%;
          margin: 0px 0px 0px 60px;
          padding: 0px;
        }

        &>i {
          position: absolute;
          top: 0px;
          right: 10px;
          font-style: normal;
          cursor: pointer;

          &>img {
            float: left;
            margin-right: 10px;
            /* width: 20px; */
            /* height: 20px; */
            /* display: block; */
          }
        }
      }

    }
  }
}
</style>
