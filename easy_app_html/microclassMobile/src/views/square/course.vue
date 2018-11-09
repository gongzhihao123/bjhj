<template>
    <div id="course">
      <!--视频-->
      <!-- <div class="video-box"> -->
          <i class="el-icon-arrow-left" @click.stop="back"></i>
          <div class="content-view" id="iframe-box">
            <iframe
              :src="Info.microclassUrl"
              width="100%"
              frameborder="0"
              allowfullscreen="true"
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowtransparency="true"
              v-loading="loading"
              style="background-color: #fff"
              id="ifram">
            </iframe>
          </div>
      <!-- </div> -->
      <!--简介-->
      <div class="content">
          <p class="title">{{Info.microclassName}}</p>
          <div class="intro">
            {{Info.microclassInfo}}
          </div>
          <!--评论区-->
          <!-- <el-input v-model="value" placeholder="快来说说你的感受吧" @keyup.enter="saveComment" id="inputa"></el-input> -->
          <el-button @click="comment" class="commentClick">快来说说你的感受吧</el-button>
          <div class="view">
            <span>{{Info.visitCount}}次浏览</span>
            <span><img src="../../assets/images/comment.png">{{Info.commentCount}}</span>
          </div>
          <div class="line"></div>
          <ul class="list">
            <li v-for="(m, index) in commentList" :key="index">
              <img :src="m.userFace" v-if="m.userFace">
              <span class="nametip" v-if="!m.userFace">{{m.userName.slice(m.userName.length - 2, m.userName.length)}}</span>
              <div class="listItem">
                <p>{{m.userName}}</p>
                <p class="comments">{{m.comment}}</p>
              </div>
              <i class="el-icon-delete" @click="deleteComment(m)" v-if="item.uploadUser === userId || adminFlag"></i>
            </li>
          </ul>
      </div>
    </div>
</template>

<script>
import vueVideo from '../../components/video'
import { MessageBox } from 'mint-ui'
export default {
  name: 'course',
  data () {
    return {
      value: '',
      item: {},
      commentList: [],
      userType: '',
      adminFlag: '',
      Info: {},
      userId: '',
      loading: false
    }
  },
  methods: {
    comment () {
      this.$router.push('/comment')
    },
    back () {
      this.$router.push(this.item.path)
    },
    async getComment () {
      const data = await this.$store.dispatch('getComment', {
        id: this.item.id
      })
      this.commentList = data
      this.commentList.map(item => {
      })
    },
    async saveComment () {
      document.getElementById('inputa').blur()
      await this.$store.dispatch('saveComment', {
        userType: this.userType,
        microclassId: this.item.id,
        comment: this.value
      })
      this.value = ''
      this.getComment()
      this.squareDetail()
    },
    async deleteComment (m) {
      MessageBox({
        title: '提示',
        message: '确定要删除该条评论么',
        showCancelButton: true,
        showConfirmButton: true
      })
      MessageBox.confirm('确定要删除该条评论么').then(async action => {
        await this.$store.dispatch('deleteComment', {
          commentId: m.id
        })
        this.getComment()
        this.squareDetail()
      })
    },
    async squareDetail () {
      this.loading = true
      const data = await this.$store.dispatch('squareDetail', {
        id: this.item.id
      })
      this.Info = data
      const path = document.getElementById('contextPath').value
      this.Info.microclassUrl = path + '/common/microclassView/' + this.Info.id
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  },
  mounted () {
    let ifram = document.getElementById('ifram')
    if (navigator.userAgent.match(/iPad|iPhone/i)) {
      let iframeBox = document.getElementById('iframe-box')
      iframeBox.style.width = 100 + '%'
      iframeBox.style.overflowX = 'hidden'
      iframeBox.style.overflowY = 'scroll'
      iframeBox.style.webkitOverflowScrolling = 'touch'
      ifram.setAttribute('scrolling', 'no')
      iframeBox.appendChild(ifram)
    }
  },
  async created () {
    this.item = JSON.parse(sessionStorage.item)
    await this.squareDetail()
    await this.getComment()
    setTimeout(() => {
      this.userType = this.$store.state.user.loginUser.userType
      this.adminFlag = this.$store.state.user.loginUser.adminFlag
      this.userId = this.$store.state.user.loginUser.id
    })
  },
  components: {
    vueVideo
  }
}
</script>
<style lang="scss">
// @import '../../assets/scss/video.scss';
.mint-msgbox {
  min-height: 200px;
}
.mint-msgbox-header {
  padding-top: 20px;
}
.mint-msgbox-btns {
  height: auto !important;
}
.mint-msgbox-title {
  font-size: 30px !important;
}
.mint-msgbox-btn {
  font-size: 28px !important;
}
.mint-msgbox-message {
  padding: 20px 0px !important;
  font-size: 28px !important;
}
#course {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;

  .content {
    position: absolute;
    top: 406px;
    width: 100%;
    background: #fff;
  }
  .content-view {
      height: 406px;
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 998;
  }
    // z-index: -1;
    iframe {
      position: fixed;
      height: 406px;
      width: 100%;
      min-width: 100%;
      border: 0;
      // top: 0px;
      // left: 0px;
      z-index: 1;
    }

    .el-icon-arrow-left {
      display: block;
      position: fixed;
      top: 33px;
      left: 10px;
      z-index: 999;
    }
    .el-icon-arrow-left:before {
      font-size: 36px;
      color: #ccc;
    }
  .pull-icon {
    position: absolute;
    right: 20px;
    top: 365px;
    z-index: 100;
    width: 24px;
    height: 24px;
    display: block;
  }
  .nametip {
    width: 76px;
    height: 76px;
    background: #4D5F84;
    color: #fff;
    border-radius: 100%;
    display: block;
    text-align: center;
    line-height: 76px;
    float: left;
    margin-right: 30px;
  }
  p {
    font-family:PingFangSC-Medium;
    font-size:32px;
    color:#4a4a4a;
    text-align:left;
    padding: 22px 0px 22px 20px;
    border-bottom: 1px solid #d8d8d8;
  }

  .intro {
    padding: 15px 20px 0px 20px;
    font-family: PingFangSC-Regular;
    font-size: 28px;
    color:#757575;
    line-height: 45px;
  }
  .commentClick{
    margin-top: 55px;
    margin-left: 50px;
    background:#f3f3f3;
    border:1px solid #d8d8d8;
    border-radius:100px;
    width:658px;
    height:62px;
    line-height: 28px;
    font-size: 28px;
    display: inline-block;
  }

  .view {
    margin-top: 48px;
    width: 100%;
    padding: 0px 28px 30px 28px;

    &>span {
      font-family: PingFangSC-Regular;
      font-size: 24px;
      color: #999999;
      &:nth-child(1) {
        min-width: 95px;
        height: 33px;
      }
      &:nth-child(2) {
        float: right;
        &>img {
          width: 26px;
          height: 26px;
          margin-right: 10px;
        }
      }
    }
  }

  .line {
    margin: 0px 28px;
    border-bottom: 1px solid #e5e5e5;
  }
  .comments {
    width: 520px;
    word-break: break-all;
  }
  .list {
    width: 100%;
    li {
        padding: 35px 30px;
        position: relative;
        display: flex;

        i {
          position: absolute;
          right: 25px;
          bottom: 30px;
          width: 50px;
          height: 50px;
          display: block;
          font-size: 24px;
          color: #ccc;
        }
        &:last-child {
          .listItem {
            p {
              &:nth-child(2) {
                border-bottom: none;
              }
            }
          }
        }
      &:after {
        display: block;
        content: '';
        height: 0;
        clear: both;
        overflow: hidden;
        visibility: hidden;
      }
      img {
        width: 76px;
        height: 76px;
        display: inline-block;
        margin-right: 25px;
        float: left;
        /* margin-left: 24px; */
        border-radius: 100%;
      }
      .listItem {
        flex: 1;
        float: left;
        p {
          border-bottom: none;
          padding: 0px;
          &:nth-child(1) {
          color: #999999;
          font-family: PingFangSC-Medium;
          font-size: 28px;
          line-height: 28px;
          }
          &:nth-child(2) {
          font-family: PingFangSC-Regular;
          font-size: 28px;
          color: #4a4a4a;
          line-height: 44px;
          border-bottom: 1px solid #e5e5e5;
          padding-bottom: 35px;
          }
        }
      }
    }
  }
}
</style>
