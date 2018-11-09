<template>
  <div class='task-detail'>
    <header>
      <p>{{ detail.title }}</p>
      <p>
        <span> <i>完成时间：</i> {{ detail.finishTime | dateFormat('yyyy-MM-dd HH:mm:ss') }}</span>
        <span> <i>状态：</i>
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
        </span>
        <span> <i>紧急程度：</i>
          <span v-if="detail.rank === 1">普通</span>
          <span v-if="detail.rank === 2">重要</span>
          <span v-if="detail.rank === 3">紧急</span>
          <span v-if="detail.rank === 4">重要且紧急</span>
        </span>
      </p>
      <el-row>
        <el-col :span="4">
          <span> <i>负责人：</i> {{ detail.createdUserName }}</span>
        </el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="2">
              <i>参与人：</i>
            </el-col>
            <el-col :span="22">
              <span>{{ (detail.userList || []).map(item => item.userName).join('、') }}</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </header>

    <main>
      <!-- 任务描述 -->
      <p>任务描述：</p>
      <div>
        <div v-html="detail.content">

        </div>
        <P>
          附件：
          <span style="cursor: pointer;color: #409EFF;" v-for="(item, index) in detail.attachmentList" :key="index" @click="download(item)">
            {{ index === detail.attachmentList.length - 1 ? item.fileName : item.fileName + '、' }}
          </span>
        </P>
      </div>

      <!-- 任务反馈 -->
      <div  v-if="flag && taskChildUserId && !feedbackFlag">
        <span>
          任务反馈:
        </span>
        <el-input type="textarea" :disabled="feedbackFlag" v-model.trim="feedback" placeholder="请输入反馈内容" :rows="4"></el-input>

        <el-upload
          v-if="!feedbackFlag"
          class="upload-demo"
          ref="upload"
          :action="action"
          :file-list="editFileList"
          :on-change="fileChange"
          :before-remove="fileRemove"
          :on-success="fileSuccess"
          :auto-upload="false"
          multiple>
          <span>上传附件</span>
        </el-upload>
      </div>

      <!-- 完成未完成列表 -->
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="完成" name="first">
            <el-row v-if="item.feedbackFlag" v-for="(item, index) in detail.userList" :key="index">
              <el-col :span="20">
                <span>{{ item.userName }}  反馈时间：{{ item.feedbackTime | dateFormat('yyyy-MM-dd HH:mm:ss') }}</span>
                <p>{{ item.feedback }}</p>
                <span style="cursor: pointer;color: #409EFF;" v-for="(child, index) in item.attachmentList" :key="index" @click="download(child)">
                  {{ child.fileName }}、
                </span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="未完成" name="second">
            <el-row v-if="!item.feedbackFlag" v-for="(item, index) in detail.userList" :key="index">
              <el-col :span="20">
                <span>{{ item.userName }}</span>
                <p>未完成</p>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <!-- <p>
          <el-button size="small" @click="complete = true">完成</el-button>
          <el-button size="small" @click="complete = false">未完成</el-button>
        </p>
        <div>
        </div> -->
      </div>
    </main>

    <footer>
      <el-button size="small" @click="back">返回</el-button>
      <el-button v-if="flag && taskChildUserId && !feedbackFlag" size="small" type="primary" @click="submit">提交</el-button>
    </footer>

  </div>
</template>

<script>
// import { dateFormatT } from '@/filters/index'
// import { TreeMenu } from '@/utils/tree'
import { mapState } from 'vuex'
import { notice } from '@/utils/index'
export default {
  name: 'task-detail',
  data () {
    return {
      detail: {},
      complete: true,
      action: '',
      editFileList: [],
      fileList: [],
      taskChildUserId: '',
      fileNum: 0,
      fileData: [],
      feedback: '',
      feedbackFlag: false,
      flag: true,
      activeName: 'first'
    }
  },
  methods: {
    fileChange (file, fileList) {
      this.fileList = fileList
    },
    fileRemove (file, fileList) {
    },
    async fileSuccess (res, file, fileList) {
      this.fileNum++
      this.fileData.push({ fileName: file.name, filePath: res.result })
      if (this.fileNum === fileList.length) {
        await this.$store.dispatch('taskChildFeedback', {
          taskChildUserId: this.taskChildUserId,
          feedback: this.feedback,
          attachments: JSON.stringify(this.fileData)
        })
        history.back()
      }
    },
    back () {
      history.back()
    },
    async submit () {
      if (!this.feedback) {
        notice('请输入反馈内容')
        return
      }
      if (this.fileList.length === 0) {
        await this.$store.dispatch('taskChildFeedback', {
          taskChildUserId: this.taskChildUserId,
          feedback: this.feedback,
          attachments: JSON.stringify([])
        })
        history.back()
      } else {
        this.$refs.upload.submit()
      }
    },
    async getDetail () {
      const data = await this.$store.dispatch('taskChildDetail', {
        taskChildId: this.$route.query.taskId
      })
      this.detail = data
      this.detail.userList.forEach(item => {
        if (item.editFlag === true) {
          this.taskChildUserId = item.id
          if (item.feedback) {
            this.feedback = item.feedback
            this.feedbackFlag = true
          }
          item.attachmentList.forEach(item => {
            this.editFileList.push({ name: item.fileName, url: item.filePath })
          })
        }
      })
    },
    download (val) {
      const path = document.getElementById('contextPath').value
      window.location.href = `${path}/common/download?fileName=${val.fileName}&filePath=${val.filePath}`
    }
  },
  watch: {
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  mounted () {
    const path = document.getElementById('contextPath').value
    this.action = `${path}/charge/attachment`
  },
  async created () {
    this.flag = this.$route.query.flag
    this.getDetail()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.task-detail {
  background: #fff;
  padding: 20px;
  &>header {
    i {
      font-style: normal;
      color: #999999;
    }
    &>p {
      margin-bottom: 10px;
      span {
        margin-right: 30px;
      }
    }
    &>p:nth-child(1) {
      font-size: 20px;
      font-weight: bold;
    }
    &>.el-row {
      &>.el-col-2 {
        width: 169px;
      }
    }
  }

  main {
    // 任务描述
    &>p {
      font-size: 18px;
      margin: 10px 0;
    }
    &>div:nth-child(2) {
      border-bottom: 1px solid #999;
      border-top: 1px solid #999;
      &>div {
        min-height: 200px;
        max-height: 500px;
        overflow-x: hidden;
      }
      &>p {
        margin: 10px;
      }
    }
    // 任务反馈
    &>div:nth-child(3) {
      &>span {
        display: inline-block;
        font-size: 18px;
        margin: 10px;
      }

      .el-upload {
        margin: 10px;
        span {
          color: #409EFF;
        }
      }
    }
    &>div:nth-child(4) {
      &>p {
        margin: 10px;
      }
      &>div {
        padding: 10px;
        border-top: 1px solid #999;
        .el-row {
          margin-top: 10px;
        }
      }
    }
  }

  &>footer {
    padding: 20px;
    text-align: center;
  }
}
</style>
