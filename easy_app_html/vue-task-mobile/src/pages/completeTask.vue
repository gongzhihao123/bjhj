<template>
  <div class='complete-task'>
    <mt-header title="完成任务">
      <router-link to="/detail" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right" @click.native="confirm">
        <span :class="{canSubmit: content === ''}">确定</span>
      </mt-button>
    </mt-header>

    <main>
      <p class="icon">
        <label>
          <img src="../assets/images/input_pic.png" alt="">
          <input id="file_img" type="file" multiple @change="uploadImg" ref="upload">
        </label>
        <!-- <img src="../assets/images/input_voice.png" alt=""> -->
        <span>
          任务反馈
        </span>
      </p>
      <div>
        <el-input type="textarea" v-model="content" placeholder="请输入反馈内容"></el-input>
      </div>
      <el-row class="img-list">
        <el-col :span="8" v-for="(item, index) in imgList" :key="index">
          <img :src="item.url">
          <span @click="imgList.splice(index, 1)">
            X
          </span>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<script>
export default {
  name: 'complete-task',
  data () {
    return {
      content: '',
      imgList: []
    }
  },
  methods: {
    async confirm () {
      if (this.content) {
        let files = []
        this.imgList.forEach((item) => {
          files.push({ fileName: item.name, filePath: item.filePath })
        })
        await this.$store.dispatch('taskChildFeedback', {
          taskChildUserId: sessionStorage.TASK_ID,
          feedback: this.content,
          attachments: JSON.stringify(files)
        })
        this.$router.push('/detail')
      }
    },
    // 上传图片
    async uploadImg () {
      for (let i in this.$refs.upload.files) {
        if (this.$refs.upload.files[i].type) {
          let fileName = this.$refs.upload.files[i].name
          if (fileName.indexOf('jpg') !== -1 || fileName.indexOf('png') !== -1) {
          } else {
            alert('请上传图片')
            return
          }
          let FormD = new FormData()
          FormD.append('file', this.$refs.upload.files[i])
          const path = document.getElementById('contextPath').value
          this.$http({
            method: 'post',
            url: `${path}/charge/attachment`,
            data: FormD
          }).then(async (res) => {
            this.imgList.push({ name: fileName, filePath: res.data.result, url: this.$store.state.user.previewUrl + this.$store.state.user.rootUrl + `${path}/common/download?fileName=${fileName}&filePath=` + res.data.result })
          })
        }
      }
    }
  },
  watch: {
  },
  created () {
  }
}
</script>

<style lang="scss">
@import '../assets/scss/mixin.scss';
.complete-task {
  background: #fff;
  height: 100%;
  &>header {
    background: #fff;
    color: #4B4B4B;
    height: 96px;
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
    .canSubmit {
      color: #CACACF;
    }
  }

  &>main {
    border-top: 10px solid #F3F3F3;

    p {
      border-bottom: 2px solid #F3F3F3;
      padding: 10px;
      img {
        float: right;
        width: 60px;
        height: 60px;
        margin-right: 20px;
      }
      span {
        line-height: 60px;
        font-size: 40px;
      }
    }
    &>div {
      .el-textarea {
        width: 100%;
        .el-textarea__inner {
          border: 0;
          resize: none;
          width: 100%;
          height: 40vh;
          font-size: 30px;
        }
        .el-textarea__inner::placeholder {
          font-size: 30px;
        }
      }
    }
  }
  .img-list {
    .el-col {
      margin-top: 20px;
      position: relative;
    }
    text-align: center;
    img {
      width: 200px;
      height: 200px;
    }
    span {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      line-height: 45px;
      background: #000;
      color: #fff;
      top: -20px;
      right: 10px;
    }
  }
  .icon {
    input {
      display: none;
    }
  }
}
</style>
