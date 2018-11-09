<template>
    <div id='otherCheck'>
    <!--头部-->
      <div class="head">
        <p>查看问卷</p>
        <div class="button-group">
          <el-button @click="checkPass" v-if="rowIn.checkState === 1">审核通过</el-button>
          <el-button @click="checkReturn" v-if="rowIn.checkState === 1">审核驳回</el-button>
          <p v-if="rowIn.checkState === 2">审核状态：
            <span class="pass">审核通过</span>
          </p>
          <p class="returnbox" v-if="rowIn.checkState === 3">
            <ul>
              <li class="returnInfo">审核状态：<span>审核驳回</span></li>
              <li class="returnReason">
                <el-popover
                  popper-class="popper"
                  placement="bottom"
                  width="200"
                  trigger="hover"
                  :content="rowIn.reason">
                <span v-if="rowIn.reason.length >= 10" slot="reference">{{rowIn.reason.slice(0, 10) + '...'}}</span>                  
                </el-popover>
                <span v-if="!rowIn.reason" class="nullcontent">-</span>
                <span v-if="rowIn.reason.length < 10">{{rowIn.reason}}</span>                
              </li>
            </ul>
          </p>
          <el-button @click="back" class="backbtn" v-if="rowIn.checkState === 2 || rowIn.checkState === 3">返回</el-button>          
        </div>
      </div>
     <!--问卷-->
  <div class="naire">
        <h3>{{rowIn.name}}</h3>
        <ul>
          <li><p>测评类型：</p><span v-if="rowIn.evalType === 1">本单位测评</span><span v-if="rowIn.evalType === 2">跨单位测评</span></li>
          <li><p>测评时间：</p> {{rowIn.starttime | dateFormatT('yyyy-MM-dd hh:mm')}} 至 {{rowIn.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</li>
        </ul>
         <!--表格-->
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading">
      <el-table-column
          type="index"
          label="编号"
          width="8%">
      </el-table-column>
      <el-table-column
          label="被测评人"
          width="18%">
          <template scope="scope">
            <el-popover
              ref="popover"
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.checkBN">
              <span v-if="scope.row.checkBN.length >= 10" slot="reference">{{scope.row.checkBN.slice(0, 10) + '...'}}</span>
            </el-popover>
            <span v-if="scope.row.checkBN.length < 10">{{scope.row.checkBN}}</span>
          </template>                        
      </el-table-column>
      <el-table-column
          prop="modeName"
          label="测评方式"
          width="15%">
      </el-table-column>
      <el-table-column
          prop="weight"
          width="10%"
          label="权重">             
      </el-table-column>
      <el-table-column
          label="测评人"
          width="35%">
          <template scope="scope">
            <el-popover
              ref="popover"
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.checkN">
              <span v-if="scope.row.checkN.length >= 20" slot="reference">{{scope.row.checkN.slice(0, 20) + '...'}}</span>
            </el-popover>
            <span v-if="scope.row.checkN.length < 20">{{scope.row.checkN}}</span>
          </template>
      </el-table-column>            
      <el-table-column
          label="试卷"
          width="14%">
          <template scope="scope">
            <span @click="CheckIn(scope.$index, scope.row)">{{scope.row.tableName}}</span>
          </template>
      </el-table-column>            
    </el-table>      
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
        <el-button type="primary" @click="passSubmit">确 定</el-button>
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
            max-length="120"
            :autofocus="true"
            v-focus="true">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="returnCancel">取 消</el-button>
        <el-button type="primary" @click="returnSubmit">确 定</el-button>
      </span>
    </el-dialog>         
    </div>
</template>

<script>
import querystring from 'querystring'
import { notice, error, success } from '../../../api/index.js'
export default {
  name: 'otherCheck',
  data () {
    return {
      naire: {},
      tableData: [],
      loading: false,
      reasonVisible: false,
      dialogVisible: false,
      rowIn: {},
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
    checkPass () {
      this.dialogVisible = true
    },
    checkReturn () {
      this.reasonVisible = true
      // this.$router.push({path: '/assessmentCheck/index'})
    },
    passSubmit () {
      this.dialogVisible = false
      this.$https.post(`/examine/check`, querystring.stringify({id: this.rowIn.id, checkState: 2, reason: this.ruleForm.textarea}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, '连接超时', 2000)
      })
      this.$router.push({path: '/assessmentCheck/index'})
    },
    returnSubmit () {
      if (this.ruleForm.textarea === '') {
        return
      }
      this.reasonVisible = false
      this.$https.post(`/examine/check`, querystring.stringify({id: this.rowIn.id, checkState: 3, reason: this.ruleForm.textarea}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
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
      this.$router.push({path: '/assessmentCheck/index'})
    },
    returnCancel () {
      this.ruleForm.textarea = ''
      this.reasonVisible = false
    },
    back () {
      if (this.rowIn.checkState === 1) {
        this.$router.push({path: '/assessmentCheck/index', query: {checkState: '1'}})
      } else if (this.rowIn.checkState === 2) {
        this.$router.push({path: '/assessmentCheck/index', query: {checkState: '2'}})
      } else {
        this.$router.push({path: '/assessmentCheck/index', query: {checkState: '3'}})
      }
    },
    getEvalDetailByOther () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`/examine/getEvalDetailByOther?evalId=${this.rowIn.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.result
            this.tableData.forEach((item) => {
              // 测评人
              item.checkN = []
              item.checkBN = []
              item.users.forEach((teacher) => {
                item.checkN.push(teacher.deptName + '-' + teacher.userName)
              })
              // 被测评人
              item.teachers.forEach((teacher) => {
                item.checkBN.push(String(teacher.deptName) + '-' + String(teacher.userName))
              })
              item.checkN = item.checkN.join(',')
              item.checkBN = item.checkBN.join(',')
            })
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, '连接超时', 2000)
        })
        .finally(res => {
          this.loading = false
        })
      }, 500)
    },
    CheckIn (index, row) {
      sessionStorage.tableId = JSON.stringify(row.tableId)
      this.$router.push({path: '/assessmentCheck/teacherCheck', query: {flag: 1, name: row.tableName}})
    }
  },
  created () {
    this.rowIn = JSON.parse(sessionStorage.rowIn)
    this.getEvalDetailByOther()
  },
  watch: {
    reasonVisible () {
      this.ruleForm.textarea = ''
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#otherCheck {
   .head {
     width: 100%;
     height: 63px;
     border-bottom: 2px solid #DDDDDD;
     position: relative;

     &>p {
      padding-left: 23px;
      line-height: 63px;
      margin: 0px;
     }
     &>.button-group {
      position: absolute;
      right: 5px;
      top: 15px;
      .el-button {
        &:first-child {
          background: #1CB9FE;
          border: 1px solid #1CB9FE;
          margin-left: 60px;
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
      p {
        float: left;
        .pass {
          color: #2AD273;
        }
        .returnInfo {
          span {
            color: #FD4F50; 
          }
        }
        ul {
          margin: 0px;
          li {
            list-style-type: none;
            text-align: right;
          }
        }
      }
      .returnbox {
        margin: 0px;
      } 
      .backbtn {
        float: left;
        padding: 10px 20px;
        margin-left: 20px;
        margin-right: 10px;
      }
     }
   }
   .naire {
    margin-top: 30px;
     &>h3 {
       width: 100%;
       margin: 0px;
       text-align: center;
       font-weight: normal;
       font-family: '微软雅黑';
       font-size: 20px;
     }
     &>ul {
       width: 97%;
       height: auto;
       border: 1px solid #DDDDDD;
       margin: 28px auto 36px auto;
       background: #F7F7F7;
       padding: 5px 0px 5px 12px;

       li {
         list-style-type: none;
         line-height: 45px;
         height: 45px;
         font-size: 14px;
         &:after {
            display: block;
            content: '';
            height: 0;
            clear: both;
            overflow: hidden;
            visibility: hidden;
         }
         p {
           width: 72px;
           text-align: right;
           float: left;
           margin: 0px;
           padding: 0px;
         }
         span {
           margin: 0 5px;
           float: left;
         }
       }
     }
    &>.el-table {
    border: none;
    margin-bottom: 20%;
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
            &:nth-child(5) {
            .cell {
                text-align: center;
                margin-left: 0px;
            }
            }
            &:nth-child(1) {
              .cell {
                text-align: center;
              }
            }
          .cell {
            padding: 0px;
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
            .cell {
              padding: 0px;
            }
            &:nth-child(1) {
              .cell {
                text-align: center;
                padding: 0px;
              }
            }
            &:nth-child(2) {
            .cell {
              span {
                margin-right: 5px;
              }
                &:hover {
                color: #1CB9FE;
                cursor: pointer;
                }
              }
            }
            &:nth-child(5){
              .cell {
                span {
                  margin-right: 5px;
                }
                text-align: center;
                width: 100%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                &:hover {
                  color: #1CB9FE;
                  cursor: pointer;
                }
              }
            }
          &:last-child {
            .cell {
              text-align: left;
              span {
                &:hover {
                  color: #1CB9FE;
                  cursor: pointer;
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
   .popper {
     word-break: break-all;
   }       
}
</style>