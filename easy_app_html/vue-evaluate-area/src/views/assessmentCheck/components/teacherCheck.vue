<template>
    <div id='teacherCheck'>
    <!--头部-->
      <div class="head">
        <p>查看问卷</p>
        <el-button @click="back" v-if="rowIn.checkState === 1">返回</el-button>
        <div class="button-group">
          <p v-if="rowIn.checkState === 2">审核状态：
            <span class="pass">审核通过</span>
          </p>
          <p class="returnbox" v-if="rowIn.checkState === 3">
            <ul>
              <li class="returnInfo">审核状态：<span>审核驳回</span></li>
              <li class="returnReason">
                <el-popover
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
        <h3 v-if="flag === 0">{{rowIn.name}}</h3>
        <h3 v-if="flag === 1">{{tableName}}</h3>
        <ul>
          <li><p>测评类型：</p><span v-if="rowIn.evalType === 1">本单位测评</span><span v-if="rowIn.evalType === 2">跨单位测评</span></li>
          <li v-if="rowIn.starttime || rowIn.endtime"><p>测评时间：</p> {{rowIn.starttime | dateFormatT('yyyy-MM-dd hh:mm')}} 至 {{rowIn.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</li>
          <li v-if="naire.teacherGradeList"><p>测评范围：</p><div><span v-for="(item, i) in naire.teacherGradeList" :key="i">{{item.gradeName}}</span><span v-if="!naire.teacherGradeList">无</span></div></li>
          <li v-if="naire.evalType === 1"><p>科目：</p> <span v-for="(sub, i) in naire.teacherSubjectList" :key="i">{{sub.subjectName}}</span><span v-if="!naire.teacherSubjectList">无</span></li>
        </ul>
        <div class="naireInfo">
          <ul v-if="newquestion.length !== 0">
            <li v-for="(ques, i) in newquestion" :key="i">
              <span v-if="ques.questionType !== 3">{{ques.number}}、&nbsp;</span><span>{{ques.title}}</span>
              <ul v-if="ques.content">
                <li v-for="(con, index) in ques.content" :key="index">
                  <el-radio-group v-model="ques.radio">
                    <el-radio  :label="con.content">{{con.content}}</el-radio>
                  </el-radio-group>                  
                </li>
              </ul>
              <p v-if="!ques.content"></p>
            </li>
          </ul>
          <p v-if="newquestion.length === 0">暂无数据</p>
        </div>
      </div>                
    </div>
</template>

<script>
import querystring from 'querystring'
import { notice, error, success } from '../../../api/index.js'
export default {
  name: 'teacherCheck',
  data () {
    return {
      checkState: '',
      evalId: '',
      loading: false,
      naire: {},
      reasonVisible: false,
      dialogVisible: false,
      textarea: '',
      quedtion: [],
      newquestion: [],
      radio: '',
      rowResult: {},
      rowIn: {},
      tableId: '',
      flag: 0,
      tableName: ''
    }
  },
  methods: {
    checkPass () {
      this.dialogVisible = true
    },
    checkReturn () {
      this.reasonVisible = true
    },
    passSubmit () {
      this.dialogVisible = false
      this.$https.post(`/examine/check`, querystring.stringify({id: this.rowIn.id, checkState: 2, reason: this.textarea}))
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
      this.reasonVisible = false
      this.$https.post(`/examine/check`, querystring.stringify({id: this.rowIn.id, checkState: 3, reason: this.textarea}))
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
      this.textarea = ''
      this.$router.push({path: '/assessmentCheck/index'})
    },
    returnCancel () {
      this.textarea = ''
    },
    back () {
      if (this.flag === 1) {
        this.$router.push({path: '/assessmentCheck/otherCheck'})
      } else {
        this.$router.push({path: '/assessmentCheck/index'})
      }
    },
    // 查看题
    getEvalTableDeatil () {
      if (this.$store.state.checkState === '1') {
        this.$https.get(`common/getEvalTableNeedCheckDeatil?tableId=${this.tableId}`)
        .then(res => {
          if (res.data.code === 1) {
          // 把题型数组合并
            this.newquestion = res.data.result
            for (let i = 0; i < this.newquestion.length; i++) {
              if (this.newquestion[i] === undefined) {
                this.newquestion.splice(i, 1)
              }
            }
            this.newquestion.forEach(item => {
              if (!item.content) return
              this.$set(item, 'content', JSON.parse(item.content))
              this.$set(item, 'radio', '')
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
      } else {
        this.$https.get(`/common/getEvalTableDeatil?tableId=${this.tableId}`)
        .then(res => {
          if (res.data.code === 1) {
          // 把题型数组合并
            this.newquestion = res.data.result
            for (let i = 0; i < this.newquestion.length; i++) {
              if (this.newquestion[i] === undefined) {
                this.newquestion.splice(i, 1)
              }
            }
            this.newquestion.forEach(item => {
              if (!item.content) return
              this.$set(item, 'content', JSON.parse(item.content))
              this.$set(item, 'radio', '')
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
      }
    },
    handleRadio (con, ques) {}
  },
  created () {
    this.rowIn = JSON.parse(sessionStorage.rowIn)
    if (this.$route.query.flag) {
      this.flag = this.$route.query.flag
      this.tableName = this.$route.query.name
    }
    if (sessionStorage.tableId) {
      this.tableId = JSON.parse(sessionStorage.tableId)
    }
    this.getEvalTableDeatil()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#teacherCheck {
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
     &>.el-button {
       position: absolute;
       right: 20px;
       top: 20px;
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
        ul {
          li {
            height: 20px;
            line-height: 20px;
          }
        }
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
       width: 45%;
       height: auto;
       border: 1px solid #DDDDDD;
       margin: 28px auto 36px auto;
       background: #F7F7F7;
       padding: 5px 0px 5px 12px;

       li {
         list-style-type: none;
         line-height: 45px;
         min-height: 45px;
         font-size: 14px;
         &:nth-child(1) {
           span {
             width: auto;
           }
         }
         &:nth-child(3) {
           &>div {
            float: left;
            width: 428px;
           }
         }
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
     &>.naireInfo {
       width: 45%;
       margin: 0 auto;
       padding: 0px;
       &>ul {
         padding: 0px;
          &>li {
            padding-bottom: 20px;
            list-style-type: none;
            &>p {
              height: 5%;
            }
            &>span {
              height: 30px;
              line-height: 30px;
            }
            &>ul {
              padding: 0px;
              &>li {
                list-style-type: none;
                height: 30px;
                line-height: 30px;
              }
            }
          }
       }
       &>p {
         margin: 20px 0px;
         text-align: center;
       }
     }
   }  
}
</style>