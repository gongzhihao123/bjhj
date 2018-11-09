<template>
  <div class='add-task'>
    <mt-header title="添加任务">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right" @click.native="add">
       <span :class="{canSave: canSave === 1}">确定</span>
      </mt-button>
    </mt-header>

    <div>
      <article>
        <el-row>
          <el-col :span="4">标题</el-col>
          <el-col :span="20">
            <el-input v-model="title" placeholder="请输入任务名称" :maxlength="20"></el-input>
          </el-col>
        </el-row>
        <el-row @click.native="labelValue = true">
          <el-col :span="4">任务</el-col>
          <el-col :span="20">
            <span v-if="labelName && labelName.length > 12">{{ labelName.slice(0, 13) + '...' }}</span>
            <span v-else>{{ labelName }}</span>
            <i class="iconfont icon-you"></i>
          </el-col>
        </el-row>
        <mt-actionsheet
          cancelText=""
          :actions="labelOption"
          v-model="labelValue">
        </mt-actionsheet>
      </article>

      <main>
        <p class="icon">
          <label>
            <img src="../assets/images/input_pic.png" alt="">
            <input type="file" multiple @change="uploadImg" ref="upload">
          </label>
            <!-- <img @click="audioButton" src="../assets/images/input_voice.png" alt=""> -->
            <input type="file" @change="uploadAudio" ref="upload_audio">
          <span>
            任务描述
          </span>
        </p>
        <div>
          <el-input type="textarea" :maxlength="500" v-model="content" placeholder="请输入描述内容"></el-input>
        </div>
        <el-row class="img-list">
          <el-col :span="8" v-for="(item, index) in imgList" :key="index">
            <img :src="item.url">
            <span @click="imgList.splice(index, 1)">
              X
            </span>
          </el-col>
        </el-row>
        <el-row class="audio-list">
          <el-col :span="24" v-for="(item, index) in audioList" :key="index">
            <span>
              语音文件
            </span>
            <span @click="audioList.splice(index, 1)">
              X
            </span>
          </el-col>
        </el-row>
      </main>

      <footer>
        <el-row @click.native="openPicker">
          <el-col :span="7">截止时间</el-col>
          <el-col :span="17">
            <span> {{ timeValue }} </span>
            <i class="iconfont icon-you"></i>
          </el-col>
        </el-row>
        <el-row @click.native="sheetVisible = true">
          <el-col :span="7">紧急程度</el-col>
          <el-col :span="17">
            <span>{{ rankName }}</span>
            <i class="iconfont icon-you"></i>
          </el-col>
        </el-row>
        <el-row @click.native="addUser">
          <el-col :span="7">参与人</el-col>
          <el-col :span="17">
            <span v-if="userListName && userListName.length > 10" style="color: #757575;"> {{ userListName.slice(0, 10) + '...' }} </span>
            <span v-else style="color: #757575;"> {{ userListName }} </span>
            <i class="iconfont icon-you"></i>
          </el-col>
        </el-row>
        <mt-datetime-picker
          ref="picker"
          type="datetime"
          @confirm="handleConfirm"
          @cancel="handleCancel"
          year-format="{value} 年"
          month-format="{value} 月"
          date-format="{value} 日"
          hour-format="{value} 时"
          minute-format="{value} 分"
          v-model="pickerValue">
        </mt-datetime-picker>
        <mt-actionsheet
          cancelText=""
          :actions="actions"
          v-model="sheetVisible">
        </mt-actionsheet>
      </footer>
    </div>
  </div>
</template>

<script>
import { dateFormat } from '../filters/index'
export default {
  name: 'add-task',
  data () {
    return {
      imgList: [],
      canSave: 0,
      title: '',
      content: '',
      pickerValue: '',
      labelOption: [],
      labelName: '',
      labelId: '',
      rankName: '',
      rankId: '',
      labelValue: false,
      sheetVisible: false,
      timeValue: '',
      actions: [
        { id: 1, name: '普通', method: this.rankMethod },
        { id: 2, name: '重要', method: this.rankMethod },
        { id: 3, name: '紧急', method: this.rankMethod },
        { id: 4, name: '重要且紧急', method: this.rankMethod }
      ],
      userList: [],
      userListName: '',
      audioList: []
    }
  },
  methods: {
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
    },
    // 上传语音
    async uploadAudio () {
      let fileName = this.$refs.upload_audio.files[0].name
      var FormD = new FormData()
      FormD.append('file', this.$refs.upload.files[0])
      const path = document.getElementById('contextPath').value
      this.$http({
        method: 'post',
        url: `${path}/charge/attachment`,
        data: FormD
      }).then(async (res) => {
        this.audioList.push({ name: fileName, filePath: res.data.result, url: this.$store.state.user.previewUrl + this.$store.state.user.rootUrl + `${path}/common/download?fileName=""&filePath=` + res.data.result })
        window.isCanShowAudio(false)
      })
    },
    audioButton () {
      try {
        window.esMobile.isCanShowAudio(true)
        window.esMobile.audioInput()
        this.uploadAudio()
      } catch (e) {
        console.log(e)
      }
    },
    handleConfirm (val) {
      if (this.title && this.labelId && this.content && this.timeValue && this.rankId && sessionStorage.TASK_USER) {
        this.canSave = 1
      } else {
        this.canSave = 0
      }
      // this.pickerValue = dateFormat(val.getTime(), 'yyyy-MM-dd HH:mm')
    },
    handleCancel (val) {
      this.timeValue = ''
    },
    addUser () {
      this.$router.push('/user')
      sessionStorage.TASK_DETAIL = JSON.stringify({
        title: this.title,
        labelName: this.labelName,
        labelId: this.labelId,
        content: this.content,
        finishTime: this.timeValue,
        rankId: this.rankId,
        imgList: this.imgList,
        audioList: this.audioList,
        rankName: this.rankName
      })
    },
    openPicker () {
      this.$refs.picker.open()
      if (this.timeValue) {
        this.pickerValue = this.timeValue
      }
    },
    labelMethod (item) {
      this.labelName = item.name
      this.labelId = item.id
      if (this.title && this.labelId && this.content && this.timeValue && this.rankId && sessionStorage.TASK_USER) {
        this.canSave = 1
      } else {
        this.canSave = 0
      }
    },
    rankMethod (item) {
      this.rankName = item.name
      this.rankId = item.id
      if (this.title && this.labelId && this.content && this.timeValue && this.rankId && sessionStorage.TASK_USER) {
        this.canSave = 1
      } else {
        this.canSave = 0
      }
    },
    async add () {
      if (this.title && this.labelId && this.content && this.timeValue && this.rankId && sessionStorage.TASK_USER) {
        let files = []
        this.imgList.concat(this.audioList).forEach((item) => {
          files.push({ fileName: item.name, filePath: item.filePath })
        })
        await this.$store.dispatch('addTaskChild', {
          taskId: this.labelId,
          title: this.title,
          content: this.content,
          finishTime: dateFormat(this.timeValue, 'yyyy-MM-dd HH:mm:ss'),
          rank: this.rankId,
          users: sessionStorage.TASK_USER,
          files: JSON.stringify(files)
        })
        await this.$router.push('/')
      }
    },
    // 获取标签列表
    async getLableOption () {
      const data = await this.$store.dispatch('unlockedTaskList')
      this.labelOption = data.map(item => ({...item, method: this.labelMethod}))
    }
  },
  watch: {
    title () {
      if (this.title && this.labelId && this.content && this.timeValue && this.rankId && sessionStorage.TASK_USER) {
        this.canSave = 1
      } else {
        this.canSave = 0
      }
    },
    content () {
      if (this.title && this.labelId && this.content && this.timeValue && this.rankId && sessionStorage.TASK_USER) {
        this.canSave = 1
      } else {
        this.canSave = 0
      }
    },
    pickerValue (val) {
      this.timeValue = dateFormat(new Date(val).getTime(), 'yyyy-MM-dd HH:mm')
    }
  },
  created () {
    this.getLableOption()
    if (sessionStorage.TASK_USER) {
      this.userList = JSON.parse(sessionStorage.TASK_USER)
      this.userListName = this.userList.map(item => item.userName).join('、')
    }
    if (sessionStorage.TASK_DETAIL) {
      let data = JSON.parse(sessionStorage.TASK_DETAIL)
      this.title = data.title
      this.labelName = data.labelName
      this.labelId = data.labelId
      this.content = data.content
      this.rankId = data.rankId
      this.rankName = data.rankName
      this.imgList = data.imgList
      this.audioList = data.audioList
      this.timeValue = dateFormat(new Date(data.finishTime).getTime(), 'yyyy-MM-dd HH:mm')
    }
    if (this.title && this.labelId && this.content && this.timeValue && this.rankId && sessionStorage.TASK_USER) {
      this.canSave = 1
    } else {
      this.canSave = 0
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/mixin.scss';
.add-task {
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
      color: #CACACF;
      .canSave {
        color: #4B4B4B;
      }
    }
  }

  &>div {
    height: 92%;
    overflow-x: hidden;
    &>article {
      border-top: 16px solid #F3F3F3;
      border-bottom: 16px solid #F3F3F3;
      .el-row:nth-child(1) {
        border-bottom: 4px solid #E5E6E7;
        padding: 15px 20px;
        .el-col:nth-child(1) {
          font-size: 36px;
          padding-left: 10px;
          color: #4a4a4a;
          padding-top: 4px;
        }
        .el-col:nth-child(2) {
          padding-top: -2px;
          .el-input__inner {
            border: 0;
            font-size: 36px;
            line-height: 40px;
            height: 50px;
          }
          .el-input__inner::-webkit-input-placeholder {
            font-size: 36px !important;
          }
        }
      }
      .el-row:nth-child(2) {
        padding: 4px 20px;
        .el-col:nth-child(1) {
          font-size: 36px;
          padding-left: 10px;
          line-height: 60px;
          color: #4a4a4a;
        }
        .el-col:nth-child(2) {
          text-align: right;
          line-height: 54px;
          span {
            vertical-align: middle;
            font-size: 30px;
            color: #757575;
          }
          i {
            font-size: 32px;
            vertical-align: middle;
            color: #C7C7CC;
          }
        }
      }
    }

    &>main {
      p {
        border-bottom: 4px solid #F3F3F3;
        padding: 12px 30px;
        img {
          float: right;
          width: 50px;
          height: 50px;
          margin-right: 20px;
        }
        span {
          line-height: 60px;
          font-size: 36px;
        }
      }
      &>div {
        .el-textarea {
          .el-textarea__inner {
            padding: 20px;
            border: 0;
            resize: none;
            height: 400px;
            font-size: 36px;
            color: #757575;
          }
          .el-textarea__inner::placeholder {
            font-size: 36px;
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
    }

    &>footer {
      background: #fff;
      border-top: 16px solid #F3F3F3;
      padding-bottom: 80px;
      .el-row {
        padding: 4px 20px;
        border-bottom: 4px solid #F3F3F3;
        .el-col:nth-child(1) {
          padding-left: 10px;
          font-size: 36px;
          text-align: left;
          line-height: 60px;
        }
        .el-col:nth-child(2) {
          text-align: right;
          line-height: 54px;
          span {
            vertical-align: middle;
            font-size: 30px;
            color: #757575;
          }
          i {
            vertical-align: middle;
            font-size: 32px;
            color: #C7C7CC;
            font-style: normal;
          }
        }
      }
    }
    .icon {
      input {
        display: none;
      }
    }
  }
  .picker-toolbar {
    height: 60px;
  }
  .picker-item {
    font-size: 40px;
  }
  .mint-datetime-action {
    font-size: 40px;
    line-height: 60px !important;
  }
  .mint-actionsheet-listitem {
    height: 60px;
    line-height: 60px;
    font-size: 36px;
    border-bottom: 4px solid #ddd;
  }
  .picker-items {
    .picker-slot:nth-child(1) {
      flex: 1.2 1 0% !important;
    }
  }
}
</style>
