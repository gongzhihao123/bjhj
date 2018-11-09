<template>
  <div id="reference-template">
    <!--顶部导航-->
    <header>
      <p>新增（或编辑）教案 > 引用模板
        <span @click="goBack">
          返回上一层
        </span>
      </p>
    </header>

    <!--主体部分-->
    <main>
      <div>
        <el-row class="main-top">
          <el-col :span="12">
            备课模板
          </el-col>
          <el-col :span="12">
            操作
          </el-col>
        </el-row>
        <el-row class="main-body" v-for="(item, index) in list" :key="index">
          <el-col :span="12">{{item.name}}</el-col>
          <el-col :span="12">
            <span @click="look(item)">查看</span>
            <span @click="referenceTemplate(item)">引用</span>
          </el-col>
        </el-row>
      </div>
    </main>

    <!--查看弹出框-->
    <el-dialog
      title="查看"
      v-model="lookDialogVisible"
      :show-close="false"
      class="upload-dialog"
      size="tiny">
      <div v-html="content">
        
      </div>
      <i @click="lookDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="referenceTemplate">引 用</el-button>
        <el-button type="primary" @click="lookDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Ueditor from '../../../components/Ueditor'
import { notice, success } from '../../../api/index.js'
import { mapActions } from 'vuex'
export default {
  name: 'reference-template',
  components: {
    Ueditor
  },
  data () {
    return {
      lookDialogVisible: false,
      uploadBorder: true,
      list: [],
      content: '',
      id: ''
    }
  },
  methods: {
    ...mapActions([
      'board',
      'judge'
    ]),
    // 查看
    look (item) {
      this.id = item.id
      this.lookDialogVisible = true
      this.$https.get(`/mine/lessonPlanTemplateDetail?templateId=${item.id}`)
      .then(res => {
        this.content = res.data.result.html
      })
    },
    goBack () {
      this.$router.push(sessionStorage.templatePath)
      this.judge('0')
    },
    // 引用
    referenceTemplate (item) {
      if (item.id) {
        this.$https.get(`/mine/lessonPlanTemplateDetail?templateId=${item.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.board(res.data.result)
            this.judge('2')
            success(this, '引用模板成功', 1000)
            this.$router.push(sessionStorage.templatePath)
          } else if (res.data.code === -2) {
            notice(this, res.data.message, 2000)
          }
        })
      } else {
        this.$https.get(`/mine/lessonPlanTemplateDetail?templateId=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.board(res.data.result)
            this.judge('2')
            success(this, '引用模板成功', 1000)
            this.lookDialogVisible = false
            this.$router.push(sessionStorage.templatePath)
          } else if (res.data.code === -2) {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 获取模板列表
    getLessonPlanTemplateList () {
      this.$https.get(`/mine/lessonPlanTemplateList`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result
        } else if (res.data.code === -2) {
          notice(this, res.data.messge, 2000)
        }
      })
    }
  },
  created () {
    this.getLessonPlanTemplateList()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#reference-template{

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
    padding: 70px;
    &>div{
      text-align: center;
      border: 1px solid #C3CDDA;
      border-radius: 5px;
      padding-bottom: 150px;
      .main-top{
        background: #DDE6EF;
        color: #636C7B;
        .el-col{
          line-height: 38px;
        }
      }
      .main-body{
         color: #636C7B;
        border-bottom: 1px dashed #DAE2ED;      
        line-height: 54px;   
        .el-col:nth-child(2){
          span{
            display: inline-block;
            width: 30px;
            height: 26px;
            padding-left: 30px;
            cursor: pointer;
            margin-left: 20px;
          }
          span:nth-child(1){
            background: url(../../../assets/images/view.png) no-repeat;
            line-height: 26px;
            &:hover{
              background: url(../../../assets/images/view-active.png) no-repeat;
              color: #9FD35D;
            }
          }
          span:nth-child(2){
            background: url(../../../assets/images/quote.png) no-repeat;
            line-height: 26px;
            &:hover{
              background: url(../../../assets/images/quote-active.png) no-repeat;
              color: #4993E7;
            }
          }
        }
        &:hover{
          .el-col:nth-child(1){
            color: #408EE6;
          }
        }
      }
    }
  }

  // 查看弹出框
  .upload-dialog{
    .el-dialog{
      // width: 1091px;
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
        max-height: 400px;
        overflow: auto;
        &>div{
          table{
            border-collapse: collapse;
            td{
              border: 1px solid #ddd;
            }
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
        padding-top: $width;
        text-align: center;
        .el-button{
          padding: 8px 28px;
        }
        .el-button:nth-child(1){
          border: 1px solid #408EE6;
          color: #408EE6;
          margin-left: 20px;
          &:hover{
            background: #408EE6;
            color: $white;
          }
        }
        .el-button:nth-child(2){
          border: 1px solid #FF6C60;
          color: #FF6C60;
          background: #fff;
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
