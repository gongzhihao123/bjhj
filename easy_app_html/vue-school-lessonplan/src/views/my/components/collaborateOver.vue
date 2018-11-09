<template>
  <div id="collaborate-over">
    <!--顶部导航-->
    <header>
      <p>我的&nbsp;> &nbsp;我的协同&nbsp;>&nbsp;协同标注
        <span @click="goBack">
          返回上一层
        </span>
      </p>
    </header>
    <!--主体部分-->
    <main>
      <vue-loading v-if="loading" type="spiningDubbles" color="#5AC1DD" :size="{ width: '50px', height: '50px' }"></vue-loading>  
      <p class="title">
        <span>教案标题：</span>
        <el-input v-model="title" disabled></el-input>
      </p>
      <div class="main-body">
        <p class="operation-button-group">
          <el-button v-if="userId === all.createdUser" @click="upload" @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true">
            插入课件
            <img v-if="borderOne" src="../../../assets/images/border.png">
          </el-button>
          
          <!-- <el-button v-if="userId === all.createdUser" @click="modelDownload" @mouseenter.native="borderTwo = false" @mouseleave.native="borderTwo = true">
            导出教案
            <img v-if="borderTwo" src="../../../assets/images/border.png">
          </el-button> -->
        </p>
        <el-row class="edit-mark">
          <el-col :span="16">
            <Ueditor v-model="content" @ready="editorReady" class="ueditor"></Ueditor>
            <!--<div v-html="content" @click="getElement"></div>-->
          </el-col>
          <el-col :span="8">
            <p>标注</p>
            <div>
              <div class="mark-content">
                <ul>
                  <li v-for="(item, index) in markList" :key="index">
                    <p>[{{item.mark}}] 
                      <el-popover
                        placement="top"
                        width="400"
                        trigger="hover"
                        :content="item.content">
                        <span slot="reference" v-if="item.content.length > 20">{{item.content.slice(0, 20) + '...'}}</span>
                      </el-popover>
                      <span v-if="item.content.length <= 20">{{item.content}}</span>
                    </p>
                    <span>{{item.createdTime |  dateFormat('yyyy-MM-dd hh:mm:ss')}}</span>
                  </li>
                </ul>
              </div>
              <ul class="mark-nav">
                <li v-for="(item, index) in markPersonList" :key="index" @click="selected(item, index)" v-bind:class="{active: n === index}">
                  <i style="font-style: normal;" v-if="item.userName.length > 3">{{item.userName.slice(0,3) + '...'}}</i>
                  <i style="font-style: normal;" v-if="item.userName.length <= 3">{{item.userName}}</i>
                  <img v-if="index === n" src="../../../assets/images/yuanjiao.png">
                  <span :style="{borderLeftColor:item.color}"></span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
        <div class="main-body-footer">
          <p>
            <i>课件：</i>
            <span v-for="(item, index) in attenchmentsList" @click="downloadAttenchment(item)" :key="index">{{item.fileName}}</span>
            <!--<span>
              <img src="../../../assets/images/delete-icon.png"> 删除
            </span>-->
          </p>
          <div>
            <el-button @click="save">
              保存
            </el-button>
            <el-button @click="goBack">
              关闭
            </el-button>
          </div>
        </div>
      </div>
    </main>
    <!--添加标注弹出框-->
    <el-dialog
      title="添加标注"
      v-model="addMarkDialogVisible"
      :show-close="false"
      class="add-mark-dialog"
      size="tiny">
      <el-input v-model="markContent" :maxlength="1000" type="textarea"placeholder="请输入"></el-input>
      <i @click="addMarkDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markButton">确 定</el-button>
        <el-button type="primary" @click="addMarkDialogVisible = false">取 消</el-button>
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
        <el-button @click="uploadConfirm">确 定</el-button>
        <el-button type="primary" @click="uploadCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import querystring from 'querystring'
import { notice, success } from '../../../api/index.js'
import Ueditor from '../../../components/Ueditor'
import vueLoading from 'vue-loading-template'
export default {
  name: 'collaborateOver',
  components: {
    Ueditor,
    vueLoading
  },
  data () {
    return {
      addMarkDialogVisible: false,
      uploadDialogVisible: false,
      uploadButtonShow: true,
      borderOne: true,
      borderTwo: true,
      title: '',
      n: 0,
      all: '',
      content: '',
      planId: '',
      isSave: true,
      uploadBorder: true,
      editorContent: '',
      attenchmentsList: [],
      markList: [],
      markContent: '',
      Num: 0,
      color: '',
      markPersonList: [
        {color: '#408ee6', marks: [], userId: -1, userName: '全部'}
      ],
      userId: '',
      loading: false,
      successNum: 0
    }
  },
  methods: {
    // 下载课件
    downloadAttenchment (item) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/mine/lessonPlanCourseWareDownload?attachmentId=${item.id}`
    },
    // 删除标记
    delMark (item) {
      this.$https.get(`/mine/synergyMarkDelete?markId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          success(this, '删除标记成功', 1000)
          this.getMarkList()
          this.content = this.content.replace(`<span class="mark-disabled" style="color: ${this.color};">【${item.mark}】</span>`, '')
          this.editorContent.setContent(this.content)
          this.$https.post(`/mine/lessonPlanHtmlSave`, querystring.stringify({
            planId: sessionStorage.planId,
            html: this.content
          }))
          .then(res => {
            var filePath = res.data.result
            this.$https.post(`/mine/lessonPlanUpdate`, querystring.stringify({
              id: sessionStorage.planId,
              title: this.title,
              filePath: filePath,
              auth: '',
              summarize: ''
            }))
            .then(res => {
              if (res.data.code === 1) {
                //
              } else if (res.data.code === -2) {
                notice(this, res.data.message, 2000)
              }
            })
          })
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 1000)
        }
      })
    },
    save () {
      this.content = this.content.replace(/【\d{1}】/g, '')
      this.content = this.content.replace(/【\d{2}】/g, '')
      this.$https.post(`/mine/lessonPlanHtmlSave`, querystring.stringify({
        planId: sessionStorage.planId,
        html: this.content
      }))
      .then(res => {
        var filePath = res.data.result
        this.$https.post(`/mine/lessonPlanUpdate`, querystring.stringify({
          id: sessionStorage.planId,
          title: this.title,
          filePath: filePath,
          auth: '',
          summarize: ''
        }))
        .then(res => {
          if (res.data.code === 1) {
            // success(this, '保存成功', 1000)
            this.$https.post(`/mine/synergyFinish`, querystring.stringify({
              planId: this.$route.query.id
            }))
            .then(res => {})
            this.$router.push(`/my/collaborate`)
          } else if (res.data.code === -2) {
            notice(this, res.data.message, 2000)
          }
        })
      })
    },
    selected (item, index) {
      this.n = index
      this.markList = item.marks
      // this.Num = item.marks[item.marks.length - 1].mark
    },
    // 添加标记
    markButton () {
      if (!(/^\s*$/g).test(this.markContent)) {
        // this.Num ++
        this.$https.post(`/mine/synergyMarkAdd`, querystring.stringify({
          planId: sessionStorage.planId,
          mark: Number(this.Num) + 1,
          content: this.markContent
        }))
        .then(res => {
          if (res.data.code === 1) {
            this.getMarkList()
            setTimeout(() => {
              this.editorContent.execCommand('inserthtml', `<span class="mark-disabled" style="color: ${this.color};">【${Number(this.Num)}】</span>`)
              this.addMarkDialogVisible = false
              this.$https.post(`/mine/lessonPlanHtmlSave`, querystring.stringify({
                planId: sessionStorage.planId,
                html: this.content
              }))
              .then(res => {
                var filePath = res.data.result
                this.$https.post(`/mine/lessonPlanUpdate`, querystring.stringify({
                  id: sessionStorage.planId,
                  title: this.title,
                  filePath: filePath,
                  auth: '',
                  summarize: ''
                }))
                .then(res => {
                  if (res.data.code === 1) {
                    //
                  } else if (res.data.code === -2) {
                    notice(this, res.data.message, 2000)
                  }
                })
              })
            }, 500)
          } else if (res.data.code === 0) {
            notice(this, '您无权添加标注', 2000)
          }
        })
      } else {
        notice(this, '请输入要标记的内容', 2000)
      }
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
    uploadConfirm () {
      this.$refs.upload.submit()
      this.uploadDialogVisible = false
      this.loading = true
    },
    uploadCancel () {
      this.uploadDialogVisible = false
    },
    // 上传课件
    upload () {
      this.planId = sessionStorage.planId
      this.uploadDialogVisible = true
      this.uploadButtonShow = true
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },
    // 查询附件
    getAttenchments () {
      this.$https.get(`/square/lessonPlanDetail?planId=${sessionStorage.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.attenchmentsList = res.data.result.attenchments
        }
      })
    },
    // 教案导出
    modelDownload () {
      if (this.isSave) {
        if (this.content) {
          const path = document.querySelector('#contextPath').value
          window.location.href = `${path}/square/lessonPlanDownload?planId=${sessionStorage.planId}`
        } else {
          notice(this, '该文件没有具体内容，请勿导出！', 2000)
        }
      } else {
        notice(this, '请先保存！', 2000)
      }
    },
    goBack () {
      this.editorContent.setHide()
      this.$router.push(`/my/collaborate`)
      // this.content = this.content.replace(/【\d{1}】/g, '')
      // this.content = this.content.replace(/【\d{2}】/g, '')
      // this.$https.post(`/mine/lessonPlanHtmlSave`, querystring.stringify({
      //   planId: sessionStorage.planId,
      //   html: this.content
      // }))
      // .then(res => {
      //   var filePath = res.data.result
      //   this.$https.post(`/mine/lessonPlanUpdate`, querystring.stringify({
      //     id: sessionStorage.planId,
      //     title: this.title,
      //     filePath: filePath,
      //     auth: '',
      //     summarize: ''
      //   }))
      //   .then(res => {
      //     if (res.data.code === 1) {
      //       this.$router.push(`/my/collaborate`)
      //     } else if (res.data.code === -2) {
      //       notice(this, res.data.message, 2000)
      //     }
      //   })
      // })
    },
    editorReady (instance) {
      setTimeout(() => {
        this.editorContent = instance
        instance.setContent(this.content)
        // this.editorContent.setDisabled('inserthtml')
        instance.addListener('contentChange', () => {
          this.content = instance.getContent()
        })
      }, 200)
    },
    // 获取标注列表
    getMarkList () {
      this.$https.get(`/mine/synergyMarkList?planId=${sessionStorage.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.markPersonList = [{color: '#408ee6', marks: [], userId: -1, userName: '全部'}]
          res.data.result.forEach((item, index) => {
            item.marks.forEach((child, i) => {
              this.markPersonList[0].marks.push(child)
            })
          })
          this.markPersonList = this.markPersonList.concat(res.data.result)
          if (this.markPersonList.length > 1) {
            this.markList = this.markPersonList[this.n].marks
            this.color = (this.markPersonList || []).filter(item => item.userId === this.userId)[0].color
            this.Num = (this.markPersonList || []).filter(item => item.userId === this.userId)[0].marks[((this.markPersonList || []).filter(item => item.userId === this.userId)[0].marks.length) - 1].mark
          } else {
            this.markList = []
            this.Num = 0
          }
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 查询详情
    getDetails () {
      this.$https.get(`/square/lessonPlanDetail?planId=${sessionStorage.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.all = res.data.result.plan
          this.title = res.data.result.plan.title
          this.attenchmentsList = res.data.result.attenchments
          this.$https.get(`/mine/lessonPlanHtmlRead?filepath=${res.data.result.plan.filePath}`)
          .then(res => {
            if (res.data.code === 1) {
              this.content = res.data.result
            } else if (res.data.code === -2) {
              notice(this, res.data.message, 2000)
            }
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'detail',
      'user'
    ]),
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/mine/lessonPlanCourseWareUpload`
    }
  },
  created () {
    this.userId = this.user.user.loginUser.id
    if (this.detail.id) {
      sessionStorage.planId = this.detail.id
    }
    this.getDetails()
    this.getMarkList()
  }
}
</script>
<style lang="scss">
@import '../../../assets/scss/main.scss';
#collaborate-over{
  // 顶部导航
  header{
    height: 42px;
    background: #DDE6EF;
    box-sizing: border-box;
    padding:10px 20px;
    p{
      margin: 0;
      color: #78818E;
      cursor: pointer;
      span{
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
      left: 35%;
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
  }
  .main-body{
    // width: 1000px;
    margin: 20px;
    
    // 操作按钮组
    .operation-button-group{
      padding: 0 70px;
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
      }
    }
    .edit-mark{
      display: flex;
      padding: 20px 20px;
      // .el-col:first-child{
      //   border: 1px solid #B7C2D0;
      //   border-radius: 5px;
      //   padding: 10px;
      //   min-height: 310px;
      // }
      // table{
      //   border-collapse: collapse;
      //   td{
      //     border: 1px solid #ddd;
      //   }
      // }
      // 富文本编辑器
      .ueditor {
        width: 100%;
        .edui-editor{
          width: 100% !important;
          .edui-editor-iframeholder{
            width: 100% !important;
          }
          .edui-editor-iframeholder {
            min-height: 600px;
          }
        }
      }
      // 右侧标注
      .el-col:last-child{
        padding-left: 20px;
        &>p{
          border: 1px solid #B7C2D0;
          background: #DDE6EF;
          color: #636C7B;
          padding: 10px;
          margin: 0;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          width:65%;
        }
        &>div{
          display: flex;
          ul {
            list-style: none;
            padding-left: 0;
          }
          .mark-content{
            // height: 810px;
            // float: left;
            min-height: 800px;
            min-width: 182px;
            width: 65%;
            padding: 10px;
            border: 1px solid #B7C2D0;
            border-top: 0;
            padding-bottom: 20px;
            li{
              &>p{
                color: #636C7B;
                margin: 10px 0;
                span{
                  margin-left: 10px;
                }
              }
              &>span{
                margin-left: 30px;
                color: #A2AAB8;
              }
            }
          }
          .mark-nav{
            // float: left;
            padding-left: 10px;
            li{
              width: 54px;
              cursor: pointer;
              padding:8px 10px;
              text-align: center;
              color: #A2AECD;
              margin-bottom: 10px;
              border: 1px solid #B7C2D0;
              border-radius: 5px;
              position: relative;
              img{
                // display: none;
                position: absolute;
                right: 73px;
                bottom: -11px;
              }
              span{
                position: absolute;
                right: -5px;
                top: 0;
                display: inline-block;
                // width:20px;
                height:30px;
                border: 3px solid transparent;
                border-left: 3px solid red;
              }       
              
            }
            .active{
                color: #408EE6;
                background: #fff;
                margin-left: -11px;
                padding-left: 22px;
                border-bottom-left-radius: 0;
                border-top-left-radius: 0;
                border-left: 0;
              }
          }
        }
      }
    }
    .main-body-footer{
      padding:0 20px;
      &>p{
        i{
          font-style: normal;
        }
        span{
          margin-left: 20px;
          cursor: pointer;
          color: #3281F8;
          text-decoration: underline;
        }
      }
      &>div{
        margin-top: 20px;
        text-align: center;
        .el-button{
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
  // 添加标注弹出框
  .add-mark-dialog{
    .el-dialog{
      width: 485px;
      // height: 256px;
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
        padding: 30px 0;
        margin: 0 46px;
        .el-textarea__inner{
          height: 205px;
          resize: none;
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
          margin-right: 105px;
          &:hover{
            background: #FF6C60;
            color: $white;
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
