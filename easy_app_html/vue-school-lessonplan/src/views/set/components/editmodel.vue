<template>
  <div id="editmodel">
    <div class="head-title">
      <span>编辑备课模板</span>
      <a @click.prevent="changeclose">
        <span class="head-title-bg"></span>
        返回上一层</a>
    </div>

    <div class="plancontent">
      <div class="plan-head">
        <el-form :model="lookInfo" :rules="rules" ref="form" label-width="100px" class="title-form">
          <el-form-item label="模板名称：" prop="name">
            <el-input v-model="lookInfo.name"></el-input>
          </el-form-item>
        </el-form>         
      </div>

      <div class="plan-content">

        <div class="plan-excel">
          <Ueditor @ready="editorReady" class="ueditor" v-loading="uloading"></Ueditor>
          <div class="buttons">
            <el-button class="modelout" @click="exportmodel">模板导出</el-button>
            <el-button @click="savemodel">保存</el-button>
            <el-button @click="changeclose">关闭</el-button>
          </div>
        </div>

      </div>
    </div>

  </div>


</template>

<script>
import querystring from 'querystring'
import { notice, error, success } from '../../../api/index.js'
import Ueditor from '../../../components/Ueditor'
import { mapGetters } from 'vuex'
export default {
  name: 'editmodel',
  data () {
    return {
      flag: false,
      navInfo: [],
      input: '',
      msg: 'Welcome to your Vue.js',
      editor: null,
      name: '',
      time: '',
      cont: '',
      dialogVisible: false,
      uloading: false,
      textcontent: '',
      content: '',
      modelname: '',
      modelid: '',
      htmlStr: '',
      change: false,
      lookInfo: {},
      id: '',
      UE: {},
      // show: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changeclose () {
      this.hideUeditor()
      this.$router.push({path: '/set/lessonmodel'})
    },
    hideUeditor () {
      this.UE.setHide()
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
      this.UE = instance
      this.htmlStr = this.htmlStr.replace('<div style="width:595.0pt;margin-bottom:72.0pt;margin-top:72.0pt;margin-left:90.0pt;margin-right:90.0pt;">', '')
      this.htmlStr = this.htmlStr.replace('<div style="width:595.0pt;margin-bottom:36.0pt;margin-top:36.0pt;margin-left:36.0pt;margin-right:36.0pt;">', '')
      instance.setContent(this.htmlStr)
      this.content = this.htmlStr
      instance.addListener('contentChange', () => {
        this.content = instance.getContent()
        this.change = true
      })
    },
    look () {
      this.$https.get(`/templateSet/templateDetail?templateId=${this.modelid}`)
      .then(res => {
        if (res.data.code === 1) {
          console.log(res)
          this.lookInfo = res.data.result
          this.htmlStr = this.lookInfo.htmlStr
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
    },
    savemodel () {
      if (!this.lookInfo.name || (!this.lookInfo.name && !this.content)) {
        notice(this, '请输入模板名称和内容', 3000)
        return
      }
      this.$https.post(`/templateSet/templateUpd`, querystring.stringify({
        name: this.lookInfo.name,
        html: this.content,
        templateId: this.modelid
      }))
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
    },
    exportmodel () {
      if (this.change) {
        notice(this, '请先保存!', 2000)
        return
      }
      if (!this.change) {
        const path = document.querySelector('#contextPath').value
        window.location.href = `${path}/templateSet/templateExport?templateId=${this.modelid}`
      }
    }
  },
  components: {
    Ueditor
  },
  computed: {
    ...mapGetters([
      'hide'
    ])
  },
  watch: {
    hide () {
      this.UE.setHide()
    }
  },
  created () {
    this.navInfo = this.$route.query.navInfo
    this.name = this.$route.query.name
    this.time = this.$route.query.time
    this.modelid = this.$route.query.id
    this.look()
    this.uloading = true
    setTimeout(() => {
      this.uloading = false
    }, 1000)
  }
}
</script>

<style lang="scss">
#editmodel {
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
      .title-form {
        height: 80px;

        .el-form-item {
          height: inherit;
          width: 550px;
          margin: 0 auto;
          .el-form-item__label{
            line-height: 80px;
            padding: 0px;
            float: left;
            margin-right: 20px;
            font-size: 16px;
            color: #666666;
            font-weight: bold;
            /*margin-left: 33%;*/

            &:before {
              display: none;
            }
          }
          .el-form-item__content {
            line-height: 80px;
            width: 400px;
            float: left;
            margin-left: 0px !important;

            .el-input {
              width: auto;
            }
            .el-form-item__error {
              top: 70%;
            }
            .el-input__inner {
              height: 30px;
              width: 400px;
            }
          }
        }
      }
    }
    .plan-content {
       margin-top: 72px;
      .plan-excel {
        
        width: 800px;
        margin: 0 auto 36px auto;

        .ueditor {
          margin-bottom: 94px;
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
          a {
            color: #408EE6;
            text-decoration: underline;
          }
          a:hover {
            cursor: pointer;
          }
        }

        .buttons {
          text-align: center;
          p {
            color: red;
          }
          .el-button {
            width: 90px;
            height: 33px;
            &:nth-child(2) {
              border: 1px solid #408EE6;
              color: #408EE6;

              &:hover {
                background: #408EE6;
                color: #fff;
              }
            }
            &:last-child {
              border: 1px solid #FF6C60;
              color: #FF6C60;

              &:hover {
                background: #FF6C60;
                color: #fff;
              }       
            }
            border-radius: 4px;
            margin-right: 18px;

          }
          .modelout {
            width: 90px;
            height: 33px;
            border: 1px solid #9FD35D;
            color: #9FD35D;
            border-radius: 4px;
            margin-right: 18px;   

            &:hover {
              background: #9FD35D !important;
              color: #fff !important;
              border: 1px solid #9FD35D !important;
            }           
          }
        }
      }
    }
  }

  .el-dialog__wrapper {
    .el-dialog {
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
}

</style>
