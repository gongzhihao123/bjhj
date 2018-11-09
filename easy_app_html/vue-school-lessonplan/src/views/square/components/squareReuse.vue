<template>
  <div id="squareReuse">
    <div class="head-title">
      <span>新增教案</span>
      <a @click.prevent="changepage">
        <span class="head-title-bg"></span>
        返回上一层</a>
    </div>

    <div class="plancontent">
      <div class="plan-head">
        <span>教案标题:
        <img src="../../../assets/images/private.png" v-if="auth === 1">
        <img src="../../../assets/images/public.png" v-if="auth === 0">
        </span>
        <input type="text" v-model="title">
      </div>

      <div class="plan-content">
        <div class="button-group">
          <el-button @click.native="goModel" @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true">
            引用模板
            <img v-if="borderOne" src="../../../assets/images/border.png">
          </el-button>
          <el-upload
            class="upload"
            :action="actionimport"
            name="file"
            :on-success="successimport"
            :before-upload="handlePreview">
            <el-button @mouseenter.native="borderTwo = false" @mouseleave.native="borderTwo = true">
              本地导入
              <img v-if="borderTwo" src="../../../assets/images/border.png">            
            </el-button>
          </el-upload>          
            <el-button @click="upload" @mouseenter.native="borderThree = false" @mouseleave.native="borderThree = true">
              上传课件
              <img v-if="borderThree" src="../../../assets/images/border.png">
            </el-button>
          <el-button @mouseenter.native="borderFour = false" @mouseleave.native="borderFour = true" @click="modelout">
            教案导出
            <img v-if="borderFour" src="../../../assets/images/border.png">            
          </el-button>
          <el-button @click.native="sumVisible = true" @mouseenter.native="borderFive = false" @mouseleave.native="borderFive = true">
            课后小结
            <img v-if="borderFive" src="../../../assets/images/border.png">            
          </el-button>
          <el-button @click.native="changeright" @click="setCommonLessonPlan" @mouseenter.native="borderSix = false" @mouseleave.native="borderSix = true">
            设为<a v-if="auth === 1">公</a><a v-if="auth === 0">私</a>有教案
            <img v-if="borderSix" src="../../../assets/images/border.png">            
          </el-button>
        </div>

        <div class="plan-excel">
          <Ueditor @ready="editorReady" class="ueditor"></Ueditor>
          <span class="classname">课件：<a v-if="attenchments.length === 0">无</a> </span>
            <el-row>
              <el-col :span="6" v-for="(item, index) in attenchments" :key="index">
                <a v-if="item.fileName.length > 12">{{item.fileName.slice(0, 12) + '...'}}</a>
                <a v-if="item.fileName.length <= 12">{{item.fileName}}</a>
                <span @click="deteleAttachment(item)">
                  删除
                </span>
              </el-col>
          </el-row>          
          <div class="buttons">
            <el-button @click="save">保存</el-button>
            <el-button @click="changepage">取消</el-button>
          </div>
        </div>

      </div>
    </div>

    <el-dialog title="课后小结" v-model="sumVisible" class="summodel">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="summarize">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sumVisible = false">确定</el-button>
          <el-button @click="sumVisible = false">取 消</el-button>
        </span>
    </el-dialog> 

    <!--上传课件弹出框-->
    <el-dialog
      title="上传附件"
      v-model="uploadDialogVisible"
      :show-close="false"
      class="upload-dialog"
      size="tiny">
      <div>
        <img src="../../../assets/images/upload.png">
        <el-upload
          :show-file-list="false"
          name="file"
          :data="{'planId': planId}"
          class="upload-demo"
          :on-success="success"
          :before-upload="beforeAvatarUpload"
          :action="action"
          multiple>
          <el-button v-if="uploadButtonShow" size="middle" type="primary" @mouseenter.native="uploadBorder = false" @mouseleave.native="uploadBorder = true">选择本地文件
            <img src="../../../assets/images/border.png" v-if="uploadBorder">
          </el-button>
          <p v-else>上传成功</p>
        </el-upload>
        <p>上传须知：</p>
        <p>
          默认上传文件大小限制：OFFICE文件：20M，PDF文件：10M，纯文本：1M，FLASH文件：1024M，音频文件：2048M，图片文件：5M，电子书文件：200M
        </p>
      </div>
      <i @click="uploadDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">确 定</el-button>
        <el-button type="primary" @click="uploadDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>


</template>

<script>
import querystring from 'querystring'
import Ueditor from '../../../components/Ueditor'
import { error, notice, success } from '../../../api/index.js'
export default {
  name: 'squareReuse',
  data () {
    return {
      flag: false,
      input: '',
      msg: 'Welcome to your Vue.js',
      editor: null,
      planId: '',
      cont: '',
      borderOne: true,
      borderTwo: true,
      borderThree: true,
      borderFour: true,
      borderFive: true,
      borderSix: true,
      dialogVisible: false,
      change: false,
      sumVisible: false,
      uploadDialogVisible: false,
      uploadButtonShow: true,
      uploadBorder: true,
      textcontent: '',
      time: '',
      courseName: '',
      gradeName: '',
      sectionName: '',
      attenchments: [],
      plan: {},
      comments: [],
      filePath: '',
      content: '',
      modelhtml: '',
      auth: '',
      title: '',
      summarize: '',
      contentimport: ''
    }
  },
  methods: {
    changepage () {
      this.$router.push({path: '/squareInfo', query: {time: this.time, courseName: this.courseName, sectionName: this.sectionName, gradeName: this.gradeName, planId: this.planId}})
    },
    goModel () {
      this.$router.push({path: '/squareModel'})
    },
    changeright () {
      if (this.private === false) {
        this.private = true
      } else {
        this.private = false
      }
    },
    editorReady (instance) {
      setTimeout(() => {
        instance.setContent(this.content)
        instance.addListener('contentChange', () => {
          this.content = instance.getContent()
          this.change = true
        })
      }, 200)
    },
    getPlanDetail () {
      this.$https.get(`/square/lessonPlanDetail?planId=${this.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.attenchments = res.data.result.attenchments
          this.comments = res.data.result.comments
          this.plan = res.data.result.plan
          this.filepath = this.plan.filePath
          this.auth = this.plan.auth
          this.title = this.plan.title
          this.summarize = this.plan.summarize
          this.getPlanHtml()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    getPlanHtml () {
      this.$https.get(`/mine/lessonPlanHtmlRead?filepath=${this.filepath}`)
      .then(res => {
        if (res.data.code === 1) {
          if (this.modelhtml) {
            this.content = this.modelhtml
          } else if (this.contentimport) {
            this.content = this.contentimport
          } else {
            this.content = res.data.result
          }
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    // 上传之前
    beforeAvatarUpload (file) {
      if (file.type.indexOf('image') !== -1 && file.type.size > 5242880) {
        this.$message.error('请上传5M以内的图片')
      }
      if (file.type.indexOf('audio') !== -1 && file.type.size > 2147483648) {
        this.$message.error('请上传2048M以内的音频')
      }
    },
    setCommonLessonPlan () {
      if (this.auth === 0) {
        this.auth = 1
        success(this, '设为私有教案成功', 1000)
      } else if (this.auth === 1) {
        this.auth = 0
        success(this, '设为公有教案成功', 1000)
      }
    },
    save () {
      if (!this.title || (!this.title && !this.content)) {
        notice(this, '请输入教案名称和内容', 3000)
        return
      }
      this.$https.post(`/mine/lessonPlanHtmlSave`, querystring.stringify({planId: this.planId, html: this.content}))
      .then(res => {
        if (res.data.code === 1) {
          this.filePath = res.data.result
          this.$https.post(`/mine/lessonPlanUpdate`, querystring.stringify({id: this.planId, filePath: this.filePath, auth: this.auth, title: this.title, summarize: this.summarize}))
          .then(res => {
            if (res.data.code === 1) {
              success(this, res.data.message, 3000)
              this.change = false
            } else if (res.data.code === -2) {
              error(this)
            } else {
              notice(this, res.data.message, 3000)
            }
          })
          .catch(res => {
            notice(this, res.message, 2000)
          })
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    upload () {
      this.uploadDialogVisible = true
      this.uploadButtonShow = true
    },
    deteleAttachment (item) {
      this.$https.get(`/mine/lessonPlanCourseWareDelete?attachmentId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          success(this, '删除课件成功', 1000)
          this.getPlanDetail()
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    success (res) {
      this.uploadButtonShow = false
      this.getPlanDetail()
    },
    modelout () {
      if (this.change) {
        notice(this, '请先保存！', 2000)
        return
      }
      if (!this.change) {
        const path = document.querySelector('#contextPath').value
        window.location.href = `${path}/square/lessonPlanDownload?planId=${this.planId}`
      }
    },
    successimport (res) {
      if (res.code === 1) {
        this.contentimport = res.result
        success(this, '导入成功', 3000)
        this.getPlanDetail()
      }
    },
    handlePreview (file) {
      const isFile = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword'
      if (!isFile) {
        this.$message.error('文件只能是doc或者是docx格式')
        return false
      }
    }
  },
  components: {
    Ueditor
  },
  computed: {
    // 下载
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/mine/lessonPlanCourseWareUpload`
    },
    // 本地导入
    actionimport () {
      const path = document.querySelector('#contextPath').value
      return `${path}/mine/lessonPlanTemplateImport`
    }
  },
  created () {
    this.modelInfo = JSON.parse(sessionStorage.modelInfo)
    this.sectionName = this.modelInfo.sectionName
    this.gradeName = this.modelInfo.gradeName
    this.courseName = this.modelInfo.courseName
    this.time = this.modelInfo.time
    this.planId = this.modelInfo.planId
    this.modelhtml = this.$route.query.modelhtml
    this.getPlanDetail()
  }
}
</script>

<style lang="scss">
#squareReuse {
  width: 100%;
  margin: 0px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;

  .head-title {
      width: auto;
      height: 40px;
      background: #DDE6EF;
      padding-left: 20px;
      border-bottom: 1px solid #E1E8F1;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;        


      span{
          padding-left: 22px;
          line-height: 40px;
          color: #636C7B;
          font-size: 14px;
          margin: 0px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;            
        }

      a {
        text-decoration: none;
        line-height: 40px;
        float: right;
        margin-right: 20px;
        position: relative;
        color: #B2BCCE;
        

        .head-title-bg {
          display: inline-block;
          vertical-align: middle;
          width: 24px;
          height: 24px;
          border: none;
          margin-right: 10px;
          padding: 0px;
          background: url(../../../assets/images/back.png) no-repeat;
        }
      }

      a:hover {
        color: #408EE6;
        cursor: pointer;
        .head-title-bg {
          background: url(../../../assets/images/back-active.png) no-repeat;
        }
      }    
  }

  .plancontent {
    .plan-head {
      width: 100%;
      height: 80px;
      border-bottom: 1px solid #E1E8F1;
      text-align: center;
      line-height: 80px;
      position: relative;

      span {
        font-size: 16px;
        color: #666;
        font-weight: bold;
        margin-right: 25px;
        position: relative;

      img {
        position: absolute;
        top: -8px;
        right: -426px;
        vertical-align: middle;
        }
      }
      input {
        width: 400px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid #C8D5E6;
        outline: none;
        text-indent: 1em;
      }
    }
    .plan-content {
      .button-group {
        width: 800px;
        margin: 20px auto 22px auto;
        text-align: center;

        &:after {
          display: block;
          content: '';
          clear: both;
          overflow: hidden;
          visibility: hidden;
        }
        .el-button {
          min-width: 100px;
          height: 30px;
          border: 1px solid #408EE6;
          color: #408EE6;
          margin-right: 20px;
          padding: 0px;
          margin-left: 0px;
          float: left;

          span {
            width: 100px;
            height:　30px;
            color: #408EE6;
            font-size: 14px;
            line-height: 30px;
            position: relative;
            padding: 0 20px;

            img {
              position: absolute;
              top: -9px;
            }
          }
        }
        .el-button:hover {
          background: #408EE6;
          cursor: pointer;
          color: #fff;

          span {
            color: #fff;
          }
        }
        .upload {
          width: auto;
          float: left;

          .el-upload-list {
            display: none;
          }
        }        
      }
      .plan-excel {

        width: 800px;
        margin: 0 auto 36px auto;

        .ueditor {
          margin-bottom: 40px;
          padding-bottom: 10px;
          div {
            div {
              .edui-editor-iframeholder {
                min-height: 600px;
              }
            }
          }
        }
        .classname {
          color:　#666666;
          line-height: 26px;
          margin-right: 5px;
          a {
            color: #408EE6;
            text-decoration: underline;
          }
          a:hover {
            cursor: pointer;
          }
        }
        .el-row {
          .el-col {
            text-align: center;
            a {
            margin-top: 5px;
            color: #408EE6;
            text-decoration: underline;              
            }

          span{
            margin-left: 20px;
            cursor: pointer;
            display: inline-block;
            width: 30px;
            height: 26px;
            padding-left: 30px;
            color: #A2AECD;
            background: url(../../../assets/images/delete-icon.png) no-repeat;
            margin-left: 10px;
            line-height: 26px;
            &:hover{
              background: url(../../../assets/images/delete-icon-active.png) no-repeat;
              color: #FF6C60;
            }
          }            
          }
        }
        .buttons {
          text-align: center;
          margin-top: 15px;
          .el-button {
            width: 90px;
            height: 33px;
            border: 1px solid #FF6C60;
            color: #FF6C60;
            border-radius: 4px;
            margin-right: 18px;

          }

          .el-button:hover {
            cursor: pointer;
            background: #408EE6;
            border: 1px solid #408EE6;
            color: #fff;
          }
        }
      }
    }
  }

  .summodel{
    .el-dialog {
      background: url(../../../assets/images/sum-header.png) no-repeat;
      width: 560px;
      background-color: #fff;      
      border-radius: 15px;
      .el-dialog__body {
        padding: 30px;

        .el-textarea {
          /*height: 300px !important;*/

          .el-textarea__inner {
            height: 300px !important;
            outline: none;
            border: 1px solid #ccc;
          }
        }
      }

      .el-dialog__footer {
        span {
        .el-button {
          min-width: 100px;
          height: 30px;
          border: 1px solid #408EE6;
          color: #408EE6;
          margin-right: 20px;
          padding: 0px;
          margin-left: 0px;
          background: #fff;

          span {
            width: 100px;
            height:　30px;
            color: #408EE6;
            font-size: 14px;
            line-height: 30px;
          }
        }
        .el-button:hover {
          background: #408EE6;
          cursor: default;
          color: #fff;

          span {
            color: #fff;
          }
        }          
        }
      }
    }
  }
  .upload-dialog{
    .el-dialog{
      width: 489px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      .el-dialog__header{
        text-align: center;
        padding:0;
        background: #3281F8;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        span{
          display: inline-block;
          width:100%;
          box-sizing: border-box;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          margin-top: 5px;
          padding: 20px;
          background: #fff;
          color: #408EE6;
          font-weight: normal;
        }
      }
      .el-dialog__body{
        border-top: 1px solid #ddd;
        text-align: center;
        padding: 46px 0;
        margin: 0 46px;
        &>div{
          padding-top: 20px;
          width: 360px;
          height: 280px;
          border: 1px solid #ddd;
          margin: 0 auto;
          .el-upload{
            margin-top: 20px;
            .el-button{
              position: relative;
              padding: 8px 40px;
              background: #fff;
              color: #408EE6;
              &:hover{
                background: #408EE6;
                color: #fff;
              }
              img{
                position: absolute;
                top:-2px;
                right: 5px;
              }
            }
          }
          &>p:nth-child(3){
            color: #FF6C60;
            text-align: left;
            padding-left: 10px;
            margin-top: 20px;
          }
          &>p:nth-child(4){
            text-align: left;
            padding: 10px;
            color: #B7C2D0;
          }
        }
        &>sup{
          position: absolute;
          top: 0;
          left: 20px;
          width: 35px;
          height: 5px;
          background: #9FD35D;
        }
        &>i{
          cursor: pointer;
          width: 22px;
          height: 22px;
          position: absolute;
          background: url(../../../assets/images/dialog-close.png) no-repeat;
          top: 15px;
          right: 10px;
          &:hover{
            background: url(../../../assets/images/dialog-close-hover.png) no-repeat;
          }
        }
      }
      .el-dialog__footer{
        .el-button{
          padding: 8px 28px;
        }
        .el-button:nth-child(1){
          border: 1px solid #408EE6;
          color: #408EE6;
          &:hover{
            background: #408EE6;
            color: #fff;
          }
        }
        .el-button:nth-child(2){
          border: 1px solid #FF6C60;
          color: #FF6C60;
          background: #fff;
          margin-right: 95px;
          &:hover{
            background: #FF6C60;
            color: #fff;
          }
        }
      }
    }
  }  
}

</style>
