<template>
  <div id="assessmentCheck">
    <!--头部-->
    <div class="head">
      <p>测评审核</p>
    </div>
    <div class="content">
      <!--审核状态-->
      <span>审核状态：</span>
      <el-tabs v-model="checkState" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="1">
          <!--待审核表格-->
          <el-table
            v-loading="unloading"
            :data="list"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="8%"
              >
            </el-table-column>
            <el-table-column
              label="测评名称"
              width="22%">
              <template scope="scope">
                <el-popover
                  placement="top-start"
                  width="350"
                  popper-class="popover-box"
                  trigger="hover"
                  :content="scope.row.name"
                  >
                <span v-if="scope.row.name.length >= 20" @click="CheckIn(scope.$index, scope.row)" slot="reference">{{scope.row.name.slice(0, 20) + '...'}}</span>                  
                </el-popover>                
                <span v-if="scope.row.name.length < 20" @click="CheckIn(scope.$index, scope.row)">{{scope.row.name}}</span>
              </template>              
            </el-table-column>
            <el-table-column
              label="开始时间"
              width="22%">
              <template scope="scope">
                <span>{{scope.row.starttime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="22%"
              label="结束时间">
              <template scope="scope">
                <span>{{scope.row.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
              </template>                         
            </el-table-column>
              <el-table-column label="操作" width="26%">
                <template scope="scope">
                  <el-button @click="checkedPass(scope.$index, scope.row)">审核通过</el-button>
                  <el-button @click="checkedReturn(scope.$index, scope.row)">审核驳回</el-button>
                </template>
              </el-table-column>             
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="审核通过" name="2">
          <!--审核通过表格-->
          <el-table
            :data="list"
            v-loading="unloading"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="8%">
            </el-table-column>
            <el-table-column
              label="测评名称"
              width="25%">
              <template scope="scope">
                <el-popover
                  placement="top-start"
                  width="350"
                  trigger="hover"
                  :content="scope.row.name"
                  >
                <span v-if="scope.row.name.length >= 20" @click="CheckIn(scope.$index, scope.row)" slot="reference">{{scope.row.name.slice(0, 20) + '...'}}</span>                  
                </el-popover>                
                <span v-if="scope.row.name.length < 20" @click="CheckIn(scope.$index, scope.row)">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="开始时间"
              width="25%">
              <template scope="scope">
                <span>{{scope.row.starttime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
              </template>              
            </el-table-column>
            <el-table-column
              width="25%"
              label="结束时间">
              <template scope="scope">
                <span>{{scope.row.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
              </template>                          
            </el-table-column>
              <el-table-column label="操作" width="17%">
                <template scope="scope">
                  <el-button @click="CheckIn(scope.$index, scope.row)">查看</el-button>
                </template>
              </el-table-column>             
          </el-table>          
        </el-tab-pane>
        <el-tab-pane label="审核未通过" name="3">
          <!--审核未通过表格-->
          <el-table
            :data="list"
            v-loading="unloading"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="8%">
            </el-table-column>
            <el-table-column
              label="测评名称"
              width="22%">
              <template scope="scope">
                <el-popover
                  placement="top-start"
                  width="350"
                  trigger="hover"
                  :content="scope.row.name"
                  >
                <span v-if="scope.row.name.length >= 20" @click="CheckIn(scope.$index, scope.row)" slot="reference">{{scope.row.name.slice(0, 20) + '...'}}</span>
                </el-popover>                
                <span v-if="scope.row.name.length < 20" @click="CheckIn(scope.$index, scope.row)">{{scope.row.name}}</span>
              </template>              
            </el-table-column>
            <el-table-column
              label="开始时间"
              width="18%">
              <template scope="scope">
                <span>{{scope.row.starttime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
              </template>              
            </el-table-column>
            <el-table-column
              width="18%"
              label="结束时间">
              <template scope="scope">
                <span>{{scope.row.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
              </template>                           
            </el-table-column>
            <el-table-column
                label="驳回原因"
                width="14%">
                <template scope="scope">
                  <el-popover
                    placement="top-start"
                    width="350"
                    trigger="hover"
                    :content="scope.row.reason"
                    >
                  <span v-if="scope.row.reason && scope.row.reason.length >= 20" slot="reference">{{scope.row.reason.slice(0, 20) + '...'}}</span>
                  </el-popover>                
                  <span v-if="scope.row.reason && scope.row.reason.length < 20">{{scope.row.reason}}</span>                  
                  <span v-if="!scope.row.reason">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-</span>
                </template>                
            </el-table-column>            
              <el-table-column label="操作" width="20%">
                <template scope="scope">
                  <el-button @click="CheckIn(scope.$index, scope.row)">查看</el-button>
                </template>
              </el-table-column>             
          </el-table>          
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--确认审核通过-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      size="tiny"
      :close-on-click-modal="false"
      class="checkPass">
      <span>确定通过审核么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPass()">确 定</el-button>
      </span>
    </el-dialog>
    <!--驳回原因-->
    <el-dialog
      title="填写驳回原因"
      :visible.sync="reasonVisible"
      size="tiny"
      :close-on-click-modal="false"
      class="checkReturn">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-if="reasonVisible">
        <el-form-item prop="textarea">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="ruleForm.textarea"
            :autofocus="true"
            v-focus="true"
            maxlength="120">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelReturn()">取 消</el-button>
        <el-button type="primary" @click="submitReturn()">确 定</el-button>
      </span>
    </el-dialog>    
  </div>
</template>

<script>
import querystring from 'querystring'
import { notice, error, success } from '../../api/index.js'
export default {
  name: 'assessmentCheck',
  data () {
    return {
      activeName: 'first',
      dialogVisible: false,
      reasonVisible: false,
      unloading: false,
      checkState: '1',
      id: '',
      list: [],
      tableData: [],
      ruleForm: {
        textarea: ''
      },
      rules: {
        textarea: [
          {required: true, message: '驳回原因不能为空！', trigger: 'blur'}
        ]
      }
    }
  },
  directives: {
    focus: {
      inserted: function (el, option) {
        var defClass = 'el-textarea'
        var defTag = 'textarea'
        var value = option.value || true
        if (typeof value === 'boolean') {
          value = { cls: defClass, tag: defTag, foc: value }
        } else {
          value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false }
        }
        if (el.classList.contains(value.cls) && value.foc) {
          el.getElementsByTagName(value.tag)[0].focus()
        }
      }
    }
  },
  methods: {
    handleClick (tab, event) {
      this.getList(tab.name)
      this.$store.state.checkState = tab.name
      this.checkState = tab.name
      sessionStorage.active = tab.name
    },
    checkedPass (index, row) {
      this.dialogVisible = true
      this.id = row.id
    },
    checkedReturn (index, row) {
      this.reasonVisible = true
      this.id = row.id
    },
    submitPass () {
      this.dialogVisible = false
      this.$https.post(`/examine/check`, querystring.stringify({id: this.id, checkState: 2, reason: this.ruleForm.textarea}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.getList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, '连接超时', 2000)
      })
    },
    submitReturn () {
      if (this.ruleForm.textarea === '') {
        return
      }
      this.reasonVisible = false
      this.$https.post(`/examine/check`, querystring.stringify({id: this.id, checkState: 3, reason: this.ruleForm.textarea}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.getList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, '连接超时', 2000)
      })
      this.ruleForm.textarea = ''
    },
    cancelReturn () {
      this.ruleForm.textarea = ''
      this.reasonVisible = false
    },
    CheckIn (index, row) {
      sessionStorage.rowIn = JSON.stringify(row)
      // 本单位，跨单位都需要先到列表，在看试卷
      this.$router.push({path: '/assessmentCheck/otherCheck'})
    },
    getList () {
      this.unloading = true
      this.list = []
      setTimeout(() => {
        this.$https.get(`/examine/getList?checkState=${this.checkState}`)
        .then(res => {
          if (res.data.code === 1) {
            this.list = res.data.result
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
          this.unloading = false
        })
        .catch(res => {
          notice(this, '连接超时', 2000)
        })
        .finally(res => {
          this.unloading = false
        })
      }, 500)
    }
  },
  created () {
    this.getList()
    this.checkState = sessionStorage.active
  },
  watch: {
    reasonVisible () {
      this.ruleForm.textarea = ''
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';  
.popover-box {
  word-break: break-all;
}
 #assessmentCheck {  
   .head {
     width: 100%;
     height: 63px;
     border-bottom: 2px solid #DDDDDD;

     &>p {
      padding-left: 23px;
      line-height: 63px;
      margin: 0px;
     }
   }
   .content {
     margin-top: 17px;
     position: relative;
     padding: 0px;
     &>span {
       position: absolute;
       color: #6F6F6F;
       left: 40px;
       top: 24px;
     }
     .el-tabs {
       .el-tabs__header {
         border-bottom: 0px;
         padding: 18px 40px 18px 18px;
         border: 1px solid $gray;
         margin-left: 20px;
         width: 422px;
         .expand-trigger {
           width: 422px;
           div {
             width: 422px;
           }
         }
         .contract-trigger {
           width: 422px;
         }       
         .el-tabs__nav {
           margin-left: 24%;
         }
         .el-tabs__item {
           height: auto;
           line-height: 30px;
           color: #6F6F6F;
         }
         .is-active {
           color: #1CB9FE;
         }
         .el-tabs__active-bar {
           bottom: 3px !important;
           background: #1CB9FE;
         }
       }
       .el-tabs__content {
         .el-tab-pane {
           &:first-child{
             .el-table {
               border: none;
               table {
                 width: 100% !important;
               }
               .el-table__empty-block {
                 width: 100% !important;
               }
               .el-table__header {
                 tr {
                    height: 63px;
                    line-height: 63px;
                   th {
                     padding: 0px;
                     height: auto;
                     background: $white;
                     &:nth-child(1), &:nth-child(5) {
                       .cell {
                         text-align: center;
                       }
                     }
                     .cell {
                       background: $white;
                       font-size: 14px;
                       font-family: '微软雅黑';
                       font-weight: normal;
                     }
                   }
                 }
               }
               .el-table__body {
                 tr {
                   height: 50px;
                   line-height: 50px;
                   td {
                     &:nth-child(1) {
                       text-align: center;
                     }
                     &:nth-child(2) {
                       .cell {;                         
                         &:hover {
                           color: #1CB9FE;
                           cursor: pointer;
                         }
                       }
                     }
                     &:last-child {
                       .cell {
                        text-align: center;
                        .el-button {
                          &:first-child {
                            background: #1CB9FE;
                            border: 1px solid #1CB9FE;
                            span {
                              color: $white;
                            }
                          }
                          &:last-child {
                            background: $white;
                            border: 1px solid #C4C4C4;
                            span {
                              color: #6F6F6F;
                            }
                            &:hover {
                              border: 1px solid #1CB9FE;
                              span {
                                color: #1CB9FE;
                              }
                            }
                          }
                        }                        
                       }
                     }
                   }
                 }
               }
             }
           }
           &:nth-child(2) {
             .el-table {
               border: none;
               table {
                 width: 100% !important;
               }
               .el-table__empty-block {
                 width: 100% !important;
               }
               .el-table__header {
                 tr {
                    height: 63px;
                    line-height: 63px;
                   th {
                     padding: 0px;
                     height: auto;
                     background: $white;
                     &:nth-child(1), &:nth-child(5) {
                       .cell {
                         text-align: center;
                       }
                     }
                     .cell {
                       background: $white;
                       font-size: 14px;
                       font-family: '微软雅黑';
                       font-weight: normal;
                     }
                   }
                 }
               }
               .el-table__body {
                 tr {
                   height: 50px;
                   line-height: 50px;
                   td {
                     &:nth-child(1), &:nth-child(5){
                       .cell {
                         text-align: center;
                       }
                     }
                     &:nth-child(2) {
                       .cell {                         
                         &:hover {
                           color: #1CB9FE;
                           cursor: pointer;
                         }
                       }
                     }
                     &:last-child {
                       .cell {
                        .el-button {
                            background: #1CB9FE;
                            border: 1px solid #1CB9FE;
                            span {
                              color: $white;
                            }
                        }
                       }
                     }
                   }
                 }
               }                                      
             }
           }
           &:nth-child(3) {
             .el-table {
               border: none;
               table {
                 width: 100% !important;
               }
               .el-table__empty-block {
                 width: 100% !important;
               }
               .el-table__header {
                 tr {
                    height: 63px;
                    line-height: 63px;
                   th {
                     padding: 0px;
                     height: auto;
                     background: $white;
                     &:nth-child(1), &:nth-child(6) {
                       .cell {
                         text-align: center;
                       }
                     }
                     .cell {
                       background: $white;
                       font-size: 14px;
                       font-family: '微软雅黑';
                       font-weight: normal;
                     }
                   }
                 }
               }
               .el-table__body {
                 tr {
                   height: 50px;
                   line-height: 50px;
                   td {
                     &:nth-child(1), &:nth-child(6){
                       .cell {
                         text-align: center;
                       }
                     }
                     &:nth-child(2) {
                       .cell {                      
                         &:hover {
                           color: #1CB9FE;
                           cursor: pointer;
                         }
                       }
                     }
                     &:nth-child(5) {
                       .cell {
                         display:block; 
                         width: auto;
                         overflow: hidden; 
                         white-space: nowrap; 
                         text-overflow: ellipsis;
                       }
                     }                     
                     &:last-child {
                       .cell {
                        /*text-align: center;*/
                        .el-button {
                            background: #1CB9FE;
                            /*margin-left: 62px;*/
                            border: 1px solid #1CB9FE;
                            span {
                              color: $white;
                            }
                        }
                       }
                     }
                     .cell {
                       &>div {
                         /*margin-left: 17px;*/
                       }
                     }
                   }
                 }
               }                                           
             }
           }
         }
       }
     }
   }
   .checkPass {
    .el-dialog {
      width: 444px;
      height: 264px;
      .el-dialog__header {
        text-align: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #D5D5D5;

        .el-dialog__close {
            position: absolute;
            right: 18px;
            top: 18px;
        }
      }
      .el-dialog__body {
        text-align: center;
        padding-top: 15%;
        padding-bottom: 15%;
      }
      .el-button--primary {
        background: #1CB9FE;
        border-color: #1CB9FE;
      }
      .el-button--default {
        &:hover {
          border-color: #1CB9FE;
          span {
            color: #1CB9FE;
          }
        }
      }      
    }
   }
   .checkReturn {
     .el-dialog {
       width: 444px;
       height: 265px;
       .el-dialog__header {
         span {
           font-weight: normal;
           margin-left: -30px;
         }
         .el-dialog__close {
           position: absolute;
           top: 18px;
           right: 18px;
         }
       }
       .el-dialog__body {
         .el-form-item {
           width: 100%;
           margin-bottom: 0px;
         }         
         .el-textarea {
          .el-textarea__inner {
            height: 110px;
            resize: none;
            outline: none;
            margin-bottom: 20px;
          }
         }
       }
       .el-button--primary {
         background: #1CB9FE;
         border-color: #1CB9FE;
       }
       .el-button--default {
         &:hover {
           border-color: #1CB9FE;
           span {
             color: #1CB9FE;
           }
         }
       }
     }
   }
 } 
</style>
