<template>
  <div id="add-study">
    <!--顶部导航-->
    <header>
      <p>我的
        <i>&nbsp;>&nbsp;我的备课</i>
        <i v-if="navMy.planId">&nbsp;>&nbsp;新增学案</i>
        <i v-if="navMy.id">&nbsp;>&nbsp;编辑学案</i>
        <span @click="goBack">
          返回上一层
        </span>
      </p>
    </header>

    <!--主体部分-->
    <main>
      <vue-loading v-if="loading" type="spiningDubbles" color="#5AC1DD" :size="{ width: '50px', height: '50px' }"></vue-loading>
      <p class="title">
        <span>学案标题：</span>
        <el-input v-model="title" :maxlength="50"></el-input>
      </p>
      <div class="main-body">
        <p class="operation-button-group">
          <!-- 本地导入 功能先行去除 time ：2018/7/11 -->
          <!-- <el-upload
            class="upload"
            :action="actionimport"
            :show-file-list="false"
            name="file"
            :on-success="successImport"
            :before-upload="handlePreview">
            <el-button @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true">
              本地导入
              <img v-if="borderOne" src="../../../assets/images/border.png">
            </el-button>
          </el-upload>  -->
          
            
            <el-button @click="upload" @mouseenter.native="borderTwo = false" @mouseleave.native="borderTwo = true">
              上传附件
              <img v-if="borderTwo" src="../../../assets/images/border.png">
            </el-button>
            
            <el-button @mouseenter.native="borderThree = false" @mouseleave.native="borderThree = true" @click="modelDownload">
              导出学案
              <img v-if="borderThree" src="../../../assets/images/border.png">
            </el-button>
        </p>
        <Ueditor @ready="editorReady" class="ueditor"></Ueditor>

        <div class="main-body-footer">
          <p>
            附件：
          </p>
          <el-row>
            <el-col style="textAlign: left;" :span="13" v-for="(item, index) in attenchmentList" :key="index">
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                v-if="item.fileName.length > 20"
                :content="item.fileName">
                <i slot="reference" @dblclick="dblDownloadAttenchment(item)" @click="downloadAttenchment(item)">{{item.fileName.slice(0, 20) + '...'}}</i>
              </el-popover>
              <i v-if="item.fileName.length <= 20" @click="downloadAttenchment(item)">{{item.fileName}}</i>
              <span style="float: right" class="detele" @click="deteleAttachment(item)">
                删除
              </span>
              <span style="float: right" class="download" @click="downloadAttenchment(item)">
                下载
              </span>
            </el-col>
          </el-row>
          <div>
            <el-button @click="lessonPlanSave">
              保存
            </el-button>
            <el-button @click="goBack">
              取消
            </el-button>
          </div>
        </div>
      </div>
    </main>

    <!--上传附件弹出框-->
    <el-dialog
      title="上传附件"
      v-model="uploadDialogVisible"
      :show-close="false"
      class="upload-dialog"
      size="tiny">
      <div>
        <img src="../../../assets/images/upload.png">
        <el-upload
          name="file"
          ref="upload"
          :data="{'planId': planId}"
          class="upload-demo"
          :on-success="success"
          :before-upload="beforeAvatarUpload"
          :action="action"
          :auto-upload="false"
          multiple>
          <el-button v-if="uploadButtonShow" size="middle" type="primary" @mouseenter.native="uploadBorder = false" @mouseleave.native="uploadBorder = true">选择本地文件
            <img src="../../../assets/images/border.png" v-if="uploadBorder">
          </el-button>
          <p style="margin-top: 5px;" v-if="!uploadButtonShow" v-for="(item, index) in successName" :key="index">{{item.name}}</p>
        </el-upload>
        <p>上传须知：</p>
        <p>
          默认上传文件大小限制：OFFICE文件：20M，PDF文件：10M，纯文本：1M，FLASH文件：1024M，音频文件：2048M，图片文件：5M，电子书文件：200M
        </p>
      </div>
      <i @click="uploadDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadConfirm">确 定</el-button>
        <el-button type="primary" @click="uploadCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Ueditor from '../../../components/Ueditor'
import vueLoading from 'vue-loading-template'
import querystring from 'querystring'
import { success, notice } from '../../../api/index.js'
import { mapGetters } from 'vuex'
export default {
  name: 'addStudy',
  components: {
    Ueditor,
    vueLoading
  },
  data () {
    return {
      successNum: 0,
      canDbl: true,
      successName: [],
      isSave: false,
      editorContent: '',
      uploadButtonShow: true,
      uploadDialogVisible: false,
      borderOne: true,
      borderTwo: true,
      borderThree: true,
      uploadBorder: true,
      content: '',
      parameter: '',
      title: '',
      attenchmentList: [],
      navMy: '',
      loading: false
    }
  },
  methods: {
    // 下载课件
    downloadAttenchment (item) {
      this.timer = setTimeout(() => {
        if (this.canDbl) {
          const path = document.querySelector('#contextPath').value
          window.location.href = `${path}/square/lessonPlanCourseWareDownload?attachmentId=${item.id}`
        }
        this.canDbl = true
      }, 700)
    },
    // 在线预览
    dblDownloadAttenchment (item) {
      clearTimeout(this.timer)
      this.canDbl = false
      const path = document.querySelector('#contextPath').value
      if ((item.fileName.indexOf('docx') !== -1) || (item.fileName.indexOf('ppt') !== -1) || (item.fileName.indexOf('word') !== -1) || (item.fileName.indexOf('pdf') !== -1) || (item.fileName.indexOf('xlsx') !== -1) || (item.fileName.indexOf('xls') !== -1)) {
        window.open(`${this.previewUrl}${path}/square/lessonPlanOfficePreview?attachmentId=${item.id}`)
      } else {
        notice(this, '该课件不支持在线预览', 2000)
      }
    },
    handlePreview (file) {
      const isFile = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword'
      if (!isFile) {
        this.$message.error('文件只能是doc或者是docx格式')
        return false
      }
      this.loading = true
    },
    // 本地导入成功
    successImport (res) {
      if (res.code === 1) {
        this.content = res.result
        this.content = this.content.replace('<div style="width:595.0pt;margin-bottom:72.0pt;margin-top:72.0pt;margin-left:90.0pt;margin-right:90.0pt;">', '')
        this.content = this.content.replace('<div style="width:595.0pt;margin-bottom:36.0pt;margin-top:36.0pt;margin-left:36.0pt;margin-right:36.0pt;">', '')
        this.editorContent.setContent(this.content)
        this.isSave = false
        success(this, '导入成功', 1000)
        this.loading = false
      }
    },
    // 教案导出
    modelDownload () {
      if (this.isSave) {
        if (this.content) {
          const path = document.querySelector('#contextPath').value
          window.location.href = `${path}/square/lessonPlanDownload?planId=${this.planId}`
        } else {
          notice(this, '该文件没有具体内容，请勿导出！', 2000)
        }
      } else {
        notice(this, '请先保存！', 2000)
      }
    },
    // 上传课件
    upload () {
      this.uploadDialogVisible = true
      this.uploadButtonShow = true
      this.successName = []
      if (this.$route.query.createdId) {
        this.planId = this.$route.query.createdId
      }
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },
    uploadConfirm () {
      // if (this.successName.length !== 0) {
      //   success(this, '上传成功', 1000)
      //   this.getAttenchments()
      // }
      this.$refs.upload.submit()
      this.uploadDialogVisible = false
      this.loading = true
    },
    uploadCancel () {
      this.uploadDialogVisible = false
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },
    success (res, file, fileList) {
      if (res.code === 1) {
        this.successNum++
        if (this.successNum === fileList.length) {
          this.loading = false
          this.successNum = 0
        }
        this.uploadButtonShow = false
        this.getAttenchments()
      } else notice(this, res.message, 2000)
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
    // 删除课件
    deteleAttachment (item) {
      this.$https.get(`/mine/lessonPlanCourseWareDelete?attachmentId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          success(this, '删除课件成功', 1000)
          this.getAttenchments()
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存学案
    lessonPlanSave () {
      let planId
      if (JSON.parse(sessionStorage.my).planId) {
        planId = JSON.parse(sessionStorage.my).planId
      } else if (JSON.parse(sessionStorage.my).id) {
        planId = JSON.parse(sessionStorage.my).id
      }
      if (this.$route.query.createdId) {
        planId = this.$route.query.createdId
      }
      if (!(/^\s*$/g).test(this.title)) {
        this.$https.post(`/mine/lessonPlanHtmlSave`, querystring.stringify({
          planId: planId,
          html: this.content
        }))
        .then(res => {
          this.filePath = res.data.result
          this.$https.post(`/mine/lessonPlanUpdate`, querystring.stringify({
            id: planId,
            title: this.title,
            filePath: this.filePath,
            auth: '',
            summarize: ''
          }))
          .then(res => {
            if (res.data.code === 1) {
              this.isSave = true
              if (JSON.parse(sessionStorage.my).planId) {
                success(this, '保存成功', 1000)
                this.$router.push({path: '/my/lesson', query: {name: '我的'}})
              } else if (JSON.parse(sessionStorage.my).id) {
                if (this.$route.query.createdId) {
                  success(this, '保存成功', 1000)
                  this.$router.push({path: '/my/lesson', query: {name: '我的'}})
                  return
                }
                success(this, '修改成功', 1000)
                this.$router.push({path: '/my/lesson', query: {name: '我的'}})
              }
            } else if (res.data.code === -2) {
              notice(this, res.data.message, 2000)
            }
          })
        })
      } else {
        notice(this, '请输入标题', 2000)
      }
    },
    // 查询附件
    getAttenchments () {
      if (this.$route.query.createdId) {
        this.planId = this.$route.query.createdId
      }
      this.$https.get(`/square/lessonPlanDetail?planId=${this.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.attenchmentList = res.data.result.attenchments
        }
      })
    },
    // 查询详情
    getDetails () {
      this.$https.get(`/square/lessonPlanDetail?planId=${this.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.parameter = res.data.result.plan
          this.attenchmentList = res.data.result.attenchments
          if (this.$route.query.createdId) {
            this.attenchmentList = []
          }
          this.title = this.parameter.title
          this.auth = this.parameter.auth
          this.summaryContent = this.parameter.summarize
          this.$https.get(`/mine/lessonPlanHtmlRead?filepath=${this.parameter.filePath}`)
          .then(res => {
            this.content = res.data.result
            if (this.board.id) {
              sessionStorage.board = JSON.stringify(this.board)
            }
            if (sessionStorage.judge === '2') {
              this.content = JSON.parse(sessionStorage.board).htmlStr
              this.isSave = false
            }
          })
        }
      })
    },
    goBack () {
      this.editorContent.setHide()
      if (JSON.parse(sessionStorage.my).planId) {
        this.$router.push('/my/lesson')
      } else if (JSON.parse(sessionStorage.my).id) {
        this.$router.push({path: '/my/lesson', query: {pageNo: this.$route.query.pageNo}})
      }
    },
    editorReady (instance) {
      setTimeout(() => {
        this.content = this.content.replace(/【\d{1}】/g, '')
        this.content = this.content.replace(/【\d{2}】/g, '')
        instance.setContent(this.content)
        this.editorContent = instance
        instance.addListener('contentChange', () => {
          this.content = instance.getContent()
          this.isSave = false
        })
      }, 200)
    }
  },
  computed: {
    ...mapGetters([
      'my',
      'board',
      'judge',
      'previewUrl'
    ]),
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
    if (this.my.planId) {
      sessionStorage.my = JSON.stringify(this.my)
    } else if (this.my.id) {
      sessionStorage.my = JSON.stringify(this.my)
    }
    if (this.judge[0] === '1' || this.judge[0] === '2') {
      sessionStorage.judge = this.judge[0]
    }
    if (JSON.parse(sessionStorage.my).planId) {
      this.planId = JSON.parse(sessionStorage.my).planId
      this.navMy = JSON.parse(sessionStorage.my)
      this.isSave = false
      if (this.board.id) {
        sessionStorage.board = JSON.stringify(this.board)
      }
      if (sessionStorage.judge === '2') {
        this.content = JSON.parse(sessionStorage.board).htmlStr
      }
    } else if (JSON.parse(sessionStorage.my).id) {
      this.isSave = true
      this.planId = JSON.parse(sessionStorage.my).id
      this.navMy = JSON.parse(sessionStorage.my)
      this.getDetails()
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#add-study{

  // 顶部导航
  header{
    height: 42px;
    background: #DDE6EF;
    box-sizing: border-box;
    padding:10px 20px;
    p{
      margin: 0;
      color: #78818E;
      
      i{
        font-style: normal;
      }
      span{
        cursor: pointer;
        height: 25px;
        line-height: 25px;
        float: right;
        padding-left: 30px;
        background: url(../../../assets/images/back.png) no-repeat;
        &:hover{
          color: #408EE6;
          background: url(../../../assets/images/back-active.png) no-repeat;
        }
      }
    }
  }

  // 主体
  main{
    position: relative;
    .vue-loading{
      position: absolute;
      left: 45%;
      top: 250px;
      z-index: 1000001;
    }

    .title{
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #ddd;
      span{
        font-size: 18px;
        margin-right: 20px;
        color: #666666;
        font-weight: bold;
      }
      .el-input{
        width: 400px;
      }
    }
    .main-body{
      width: 900px;
      margin: 20px auto;

      // 操作按钮组
      .operation-button-group{
        .upload{
          display: inline-block;
        }
        .el-button{
          position: relative;
          padding: 6px 15px;
          border-color: #408EE6;
          color: #408EE6;
          margin-right: 10px;
          &:hover{
            background: #408EE6;
            color: $white;
          }
          img{
            position: absolute;
            top: -2px;
          }
          &:last-child{
            margin-left: 0;
          }
        }
      }
      // 富文本编辑器
      .ueditor {
        margin: 20px 0;
        width: 900px !important;
        #edui1{
          width: 900px !important;
        }
        div {
          div {
            .edui-editor-iframeholder {
              min-height: 600px;
            }
          }
        }
      }
      
      .main-body-footer{
        &>p{
          &>span{
            display: inline-block;
            margin-left: 20px;
            margin-top: 5px;
          }
        }
        &>.el-row{
          .el-col{
            padding-left: 30px;
            line-height: 36px;
          }
          i{
            margin-top: 5px;
            color: #408EE6;
            text-decoration: underline;
            cursor: pointer;
            font-style: normal;
          }
          span.detele{
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
          span.download{
            margin-left: 20px;
            cursor: pointer;
            display: inline-block;
            width: 30px;
            height: 26px;
            padding-left: 30px;
            color: #A2AECD;
            background: url(../../../assets/images/download-gray.png) no-repeat;
            margin-left: 10px;
            line-height: 26px;
            &:hover{
              background: url(../../../assets/images/download-blue.png) no-repeat;
              color: #408EE6;
            }
          }
        }
        &>div{
          text-align: center;
          .el-button{
            margin-top: 20px;
            padding:8px 30px;
          }
          .el-button:first-child{
            border: 1px solid #408EE6;
            color: #408EE6;
            &:hover{
              background: #408EE6;
              color: $white;
            }
          }
          .el-button:nth-child(2){
            border: 1px solid #FF6C60;
            color: #FF6C60;
            &:hover{
              background: #FF6C60;
              color: $white;
            }
          }
        }
      }
    }
  }

  // 上传附件弹出框
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
          overflow-x: hidden;
          border: 1px solid #ddd;
          margin: 0 auto;
          .el-upload{
            margin-top: 20px;
            .el-button{
              position: relative;
              padding: 8px 40px;
              background: $white;
              color: #408EE6;
              &:hover{
                background: #408EE6;
                color: $white;
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
            color: $white;
          }
        }
        .el-button:nth-child(2){
          border: 1px solid #FF6C60;
          color: #FF6C60;
          background: #fff;
          margin-right: 95px;
          &:hover{
            background: #FF6C60;
            color: $white;
          }
        }
      }
    }
  }
}
</style>
