<template>
  <div id="lessonmodel">  
      <div class="button-group">
        <el-button @click="NewModel" @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true">
          新增
          <img v-if="borderOne" src="../../../assets/images/border.png">
        </el-button>
        <!-- <el-upload
          class="upload"
          :action="action"
          name="file"
          :on-success="successimport"
          :before-upload="handlePreview">
          <el-button @mouseenter.native="borderTwo = false" @mouseleave.native="borderTwo = true">
            导入
            <img v-if="borderTwo" src="../../../assets/images/border.png">
          </el-button>
          <div slot="" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload> -->
        <el-button @click="deleteAll" @mouseenter.native="borderThree = false" @mouseleave.native="borderThree = true">
          批量删除
          <img v-if="borderThree" src="../../../assets/images/border.png">
        </el-button>
      </div>  
      <vue-loading class="import-loading" v-if="importLoading" type="spiningDubbles" color="#5AC1DD" :size="{ width: '50px', height: '50px' }"></vue-loading>
      <div class="modelset">
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="6%">
            </el-table-column>
            <el-table-column
              label="备课模板"
              width="50%"
              prop="name">
            </el-table-column>
            <el-table-column label="操作" width="44%">
              <template scope="scope">
                <a class="view" @click="look(scope.row)"><i></i><span>查看</span></a>
                <a class="edit" @click="edit(scope.row)"><i></i><span>编辑</span></a>
                <a class="delete" @click="deleteModel(scope.row,  scope.$index)"><i></i><span>删除</span></a>
              </template>
            </el-table-column>
        </el-table>
      </div> 

      <!--查看已保存的模板-->
      <el-dialog title="" v-model="dialogVisible" class="model">
        <h3>模板名称：{{lookInfo.name}}</h3>
        <div class="modelcontent" v-html="htmlStr">

        </div>
        <!--<Ueditor @ready="editorReady" class="ueditor"></Ueditor>        -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关 闭</el-button>
        </span>     
      </el-dialog>

    <!--删除弹出框-->
    <el-dialog
      title="删除提示"
      v-model="deleteDialogVisible"
      :show-close="false"
      class="delete-dialog"
      size="tiny">
      <img src="../../../assets/images/delete-warning.png"><span>您确定要删除这
        <span v-if="deleteGroup === 1">1</span>
        <span v-if="deleteGroup === 2">{{selected.length}}</span>
        项？</span>
      <p>
        删除后将无法还原
      </p>
      <i @click="deleteDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delConfirm">确 定</el-button>
        <el-button type="primary" @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>      
      <!--正在删除弹出框-->
      <el-dialog
        class="deleting"
        v-model="deletingDialogVisible"
        :show-close="false"
        size="tiny">
        <span>
          <vue-loading v-if="!deleteSuccess" type="spiningDubbles" color="#ffffff" :size="{ width: '20px', height: '20px' }"></vue-loading>
          <img v-if="deleteSuccess" style="margin-top: 2px;" src="../../../assets/images/success.png">  
          <span v-if="!deleteSuccess">正在删除</span>
          <span v-if="deleteSuccess" class="delete-success">删除成功</span>
        </span>
      </el-dialog>          
  </div>
</template>

<script>
import querystring from 'querystring'
import vueLoading from 'vue-loading-template'
// import Ueditor from '../../../components/Ueditor'
import { notice, error, success } from '../../../api/index.js'
export default {
  name: 'lessonmodel',
  data () {
    return {
      importLoading: false,
      tableData: [],
      dialogVisible: false,
      deleteSuccess: false,
      deleteDialogVisible: false,
      loading: false,
      deletingDialogVisible: false,
      lookInfo: {},
      searchCount: 0,
      deleteGroup: '',
      borderOne: true,
      borderTwo: true,
      borderThree: true,
      deleteIdList: '',
      deleteId: '',
      dele: false,
      htmlStr: '',
      name: '',
      id: '',
      file: ''
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.selected = val
      if (this.selected.length === 0) {
        this.dele = true
      } else {
        this.dele = false
      }
    },
    deleteModel (row, index) {
      this.deleteDialogVisible = true
      this.deleteGroup = 1
      this.deleteId = row.id
    },
    delConfirm () {
      if (this.deleteGroup === 1) {
        this.$https.post(`/templateSet/templateDelete`, querystring.stringify({templateId: this.deleteId}))
        .then(res => {
          if (res.data.code === 1) {
            this.deleteDialogVisible = false
            this.deletingDialogVisible = true
            setTimeout(() => {
              this.$https.get(`/templateSet/templateList`)
              .then(res => {
                if (res.data.code === 0) {
                  this.tableData = res.data.result
                } else if (res.data.code === -2) {
                  error(this)
                } else {
                  notice(this, res.data.message, 3000)
                }
              })
            .catch(res => {
              notice(this, res.message, 2000)
            })
            }, 1000)
          }
        })
      } else if (this.deleteGroup === 2) {
        this.deleteIdList = this.selected.map(n => n.id).join(',')
        this.$https.post(`/templateSet/templateDeleteBatch`, querystring.stringify({templateIds: this.deleteIdList}))
          .then(res => {
            if (res.data.code === 1) {
              this.deleteDialogVisible = false
              this.deletingDialogVisible = true
              setTimeout(() => {
                this.$https.get(`/templateSet/templateList`)
                .then(res => {
                  if (res.data.code === 0) {
                    this.tableData = res.data.result
                  } else if (res.data.code === -2) {
                    error(this)
                  } else {
                    notice(this, res.data.message, 3000)
                  }
                })
                .catch(res => {
                  notice(this, res.message, 2000)
                })
              }, 1000)
            } else if (res.data.code === -2) {
              error(this)
            } else {
              notice(this, res.data.message, 3000)
            }
          })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      }
    },
    edit (row) {
      this.$router.push({path: '/editmodel', query: {id: row.id}})
    },
    look (row) {
      this.dialogVisible = true
      this.$https.get(`/templateSet/templateDetail?templateId=${row.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.lookInfo = res.data.result
          this.htmlStr = this.lookInfo.htmlStr
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
    },
    deleteAll () {
      if (this.selected === undefined || this.dele === true) {
        notice(this, '您还没有选中要删除的对象', 2000)
        return
      } else {
        this.deleteDialogVisible = true
        this.deleteGroup = 2
      }
    },
    NewModel () {
      this.$router.push('/newmodel')
    },
    getTemplateList () {
      // 获取模板列表
      this.loading = true
      setTimeout(() => {
        this.$https.get(`/templateSet/templateList`)
          .then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.result
            } else if (res.data.code === -2) {
              error(this)
            } else {
              notice(this, res.data.message, 3000)
            }
            this.loading = false
          })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      }, 600)
    },
    successimport (res) {
      if (res.code === 1) {
        success(this, res.message, 3000)
        this.getTemplateList()
      } else notice(this, res.message, 2000)
      this.importLoading = false
    },
    handlePreview (file) {
      const isFile = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword'
      if (!isFile) {
        this.$message.error('文件只能是doc或者是docx格式')
        return false
      }
      this.importLoading = true
    }
  },
  components: {
    // Ueditor,
    vueLoading
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/templateSet/templateImport`
    }
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
  created () {
    this.getTemplateList()
  }
}
</script>

<style  lang="scss">
#lessonmodel {
  .button-group {
    padding: 30px 60px 30px 66px;
    text-align: left;
    &:after {
      content: '';
      clear: both;
      display: block;
    }

    .el-button {
      width: 100px;
      height: 30px;
      border: 1px solid #408EE6;
      background: #fff;
      text-align: center;
      position: relative;
      float: left;
      margin-right: 22px;

      span {
        color: #408EE6;
        position: absolute;
        top: 8px;
        width: 100px;
        display: block;
        text-align: center;
        left: 0px;
        img {
          position: absolute;
          top: -10px;
          right: 10px;
        }
      }
    }

    .el-button:hover {
      cursor: pointer;
      background: #408EE6;
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
  .import-loading{
    position: absolute;
    left: 50%;
    top: 40%;
    z-index: 10001;
  }
  .modelset {
    padding-left: 66px;
    padding-right: 60px;


    .el-table {
        margin-bottom: 50px;

      .el-table__header-wrapper {
        table {
          width: 100% !important;
          thead {
            tr {
              th {
                text-align: center;
                .cell {
                  font-weight: normal;
                  color: #666;
                  
                }
                &:nth-child(2) {
                    text-align: left;
                    .cell {
                        margin-left: 100px;
                    }
                }
                &:nth-child(3){
                  text-align: center;

                  .cell {
                    font-weight: normal;
                  }
                }
              }
            }
          }
        }
      }

      .el-table__body-wrapper {
        table {
           width: 100% !important;

           tbody {
             tr {
               height: 54px;
               &:hover {
                 background: #fff !important;
               }
               td {
                   &:nth-child(1) {
                       text-align: center;
                   }
                   &:nth-child(2) {
                       text-align: left !important;
                       .cell {
                           color: #666;
                           margin-left: 100px;
                       }
                   }
                   &:nth-child(3) {
                    .cell {
                      display: flex;
                      justify-content: center;                     
                      .view {
                        i {
                        background: url(../../../assets/images/view.png) no-repeat;
                        }
                    }
                    .view:hover {
                        cursor: pointer;
                        i {
                        background: url(../../../assets/images/view-active.png) no-repeat;
                        }
                        span {
                        color: #9FD35D;
                        }
                    }
                    .edit {
                        i {
                        background: url(../../../assets/images/edit-icon.png) no-repeat;
                        }
                    }
                    .edit:hover {
                        cursor: pointer;
                        i {
                        background: url(../../../assets/images/edit-icon-active.png) no-repeat;
                        }
                        span {
                          color:#408EE6;
                        }
                    }
                   .delete {
                     i {
                       background: url(../../../assets/images/delete-icon.png) no-repeat;
                     }
                   }
                  .delete:hover {
                      cursor: pointer;
                      i {
                      background: url(../../../assets/images/delete-icon-active.png) no-repeat;
                      }
                      span {
                      color: #FF6C60;
                      }
                  }
                    a {
                        width: 80px;
                        display: block;
                        float: left;
                        margin-right: 30px;
                        i {
                        width: 24px;
                        height: 24px;
                        display: block;
                        float: left;
                        margin-right: 10px;
                        }
                        span {
                        color: #666;
                        }
                    }
                    }
                   }
               }
             }
           }
        }
        .el-table__empty-block {
          width: 100% !important;
        }
      }
    }      

  }
  .model {
    .el-dialog {
      width: 900px;
      top: 15%;
      border-radius: 15px;
      background: url(../../../assets/images/model-header.png) no-repeat;
      background-color: #fff;
      position: relative;
      .el-dialog__header {
        height: 0px;
        .el-dialog__headerbtn {
          width: 22px;
          height: 22px;
          background: url(../../../assets/images/dialog-close.png) no-repeat;

          &:hover {
            background: url(../../../assets/images/dialog-close-hover.png) no-repeat;
          }
          i {
            padding: 2px;
            &:before {
              content: '';
            }
          }
        }
        .el-dialog__headerbtn:hover {
          i {
            color: #BDC7D4;
          }
        }
      }
      .el-dialog__body {
        padding: 0px 60px;
        margin-bottom: 40px;
        h3 {
          width: 100%;
          text-align: center;
          border-bottom: 1px solid #DAE2ED;
          padding-bottom: 20px;
        }
        .content {
          height: 800px;
          border: 1px solid #ccc;
        }
        .ueditor {
          margin-bottom: 94px;
          div {
            div {
              .edui-editor-iframeholder {
                min-height: 600px;
              }
              .edui-editor-toolbarbox, .edui-editor-bottomContainer {
                display: none;
              }
            }
          }
        }
        .modelcontent {
          height: 500px;
          width: 780px;
          border: 1px solid #ccc;
          padding: 10px;
          overflow-x: auto;
          table {
            margin: 10px;
            border-collapse: collapse;
            td {
                border: 1px solid #ddd;
            }
          }
        }      
      }

      .el-dialog__footer {
        text-align: center;
        padding-bottom: 20px;
        .dialog-footer {
          .el-button {
            width: 90px;
            height: 30px;
            background: #fff;
            border: 1px solid #408EE6;
            margin-right: 20px;
            position: relative;

            span {
              color: #408EE6;
              position: absolute;
              width: 90px;
              text-align: center;
              display: block;
              left: 0px;
              height: 30px;
              top: 0px;
              line-height: 30px;
            }
          }

          .el-button:hover {
            background: #FF6C60;
            border: 1px solid #FF6C60;
            cursor: pointer;

            span {
              color: #fff;
            }
          }
        }
      }
    }
  }
    // 正在删除弹出框
  .deleting {
    background: rgba(204,204,204,0.2);
    .el-dialog{
      width: 140px;
      height: 30px;
      background: #7A7A7A;
      .el-dialog__header{
        display: none;
      }
      .el-dialog__body{
        padding: 0;
        color: #fff;
        &>span{
          position: absolute;
          top: 0;
          left: 20px;
          line-height: 45px;
          img{
            position: absolute;
            top: 4px;
            right:-20px;
          }
          span{
            position: absolute;
            width:130px;
            top: -5px;
            right:-150px;
          }
          .packaging{
            background: #7A7A7A;
            position: absolute;
            width:130px;
            line-height: 32px;
            top:0;
            right:-150px;
          }
          .delete-success{
            position: absolute;
            width:130px;
            top: -5px;
            right:-170px;
          }
        }
      }
    }
  } 
  // 删除弹出框
  .delete-dialog{
    .el-dialog{
      width: 407px;
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
        padding: 46px 0;
        margin: 0 46px;
        img{
          vertical-align: middle;
          margin-right: 10px;
        }
        &>span{
          font-size: 15px;
          color: #636C7B;
        }
        p{
          font-size: 12px;
          color: #BCC6D3;
          margin-top: 10px;
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
          margin-right: 65px;
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
