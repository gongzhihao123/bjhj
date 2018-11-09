<template>
  <div id="newmodel">
    <div class="head-title">
      <span>新增备课模板</span>
      <a @click.prevent="change">
        <span class="head-title-bg"></span>
        返回上一层</a>
    </div>

    <div class="plancontent">
      <div class="plan-head">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="title-form">
          <el-form-item label="模板名称：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>       
      </div>

      <div class="plan-content">

        <div class="plan-excel">
          <Ueditor @ready="editorReady" class="ueditor"></Ueditor>
          <div class="buttons">
            <!-- <el-button class="modelout" @click="exportmodel">模板导出</el-button> -->
            <el-button @click="save">保存</el-button>
            <el-button @click="close">关闭</el-button>
          </div>
        </div>

      </div>
    </div>

    <el-dialog title="课后小结" v-model="sumVisible">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="textcontent">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sumVisible = false">确定</el-button>
          <el-button @click="sumVisible = false">取 消</el-button>
        </span>
    </el-dialog> 
  </div>


</template>

<script>
import querystring from 'querystring'
import { notice, success } from '../../../api/index.js'
import Ueditor from '../../../components/Ueditor'
export default {
  name: 'newmodel',
  data () {
    return {
      flag: false,
      input: '',
      editor: null,
      cont: '',
      dialogVisible: false,
      sumVisible: false,
      textcontent: '',
      show: false,
      content: '',
      templateId: '',
      UE: {},
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
    change () {
      this.hideUeditor()
      this.$router.push({path: '/set/lessonmodel'})
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
      instance.setContent('')
      instance.addListener('contentChange', () => {
        this.content = instance.getContent()
      })
    },
    hideUeditor () {
      this.UE.setHide()
    },
    save () {
      if (!this.form.name || (!this.form.name && !this.content)) {
        notice(this, '请输入模板名称和内容', 2000)
        return
      }
      this.$https.post(`/templateSet/templateAdd`, querystring.stringify({name: this.form.name, html: this.content}))
      .then(res => {
        this.templateId = res.data.result
        success(this, res.data.message, 3000)
        this.show = true
      })
    },
    close () {
      this.hideUeditor()
      this.$router.push('/set/lessonmodel')
    },
    exportmodel () {
      if (!this.show) {
        notice(this, '请先保存!', 3000)
        return
      }
      if (this.show) {
        const path = document.querySelector('#contextPath').value
        window.location = `${path}/templateSet/templateExport?templateId=${this.templateId}`
      }
    }
  },
  components: {
    Ueditor
  },
  watch: {
    deletingDialogVisible () {
      if (this.deletingDialogVisible === true) {
        setTimeout(() => {
          this.deleteSuccess = true
        }, 1000)
      } else {
        this.deleteSuccess = false
      }
    },
    deleteSuccess () {
      if (this.deleteSuccess === true) {
        setTimeout(() => {
          this.deletingDialogVisible = false
        }, 300)
      }
    }
  },
  created () {}
}
</script>

<style lang="scss">
#newmodel {
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

            border: 1px solid #408EE6;
            color: #408EE6;
            &:last-child {
              border: 1px solid #FF6C60;
              color: #FF6C60;

              &:hover {
                background: #FF6C60;
                border: 1px solid #FF6C60;                
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
              border: 1px solid #9FD35D !important;
              color: #fff;
            }         
          }

          .el-button:hover {
            cursor: pointer;
            color: #fff;
            background: #408EE6;
            border: 1px solid #408EE6;             
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
