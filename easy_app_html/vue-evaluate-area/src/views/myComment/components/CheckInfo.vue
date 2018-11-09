<template>
    <div id='CheckInfo'>
    <!--问卷-->
      <div class="naire">
        <h3>{{rowMes.tableName}}</h3>
        <ul>
          <li><span class="tips"><img src="../../../assets/images/person.png"><i>/</i>被测评人：</span>{{rowMes.userName}}</li>
          <li><span class="tips"><img src="../../../assets/images/time.png"><i>/</i>测评时间：</span>{{rowInfo.starttime | dateFormatT('yyyy-MM-dd hh:mm')}} 至 {{rowInfo.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</li>
          <li><span class="tips"><img src="../../../assets/images/dept.png"><i>/</i>部门/职务：</span>{{rowMes.deptName}}</li>
          <li><span class="tips"><img src="../../../assets/images/notice.png"><i>/</i>测评说明：</span><span v-if="rowInfo.remark !== null">{{rowInfo.remark}}</span><span v-if="rowInfo.remark === null">无</span></li>
        </ul>
      </div>         
      <div class="naireInfo">
          <ul v-if="newquestion.length !== 0">
            <li v-for="(ques, i) in newquestion" :key="i">
              <span v-if="ques.questionType !== 3">{{ques.number}}、&nbsp;</span><span>{{ques.title}}</span>
              <ul v-if="ques.content">
                <li v-for="(con, i) in ques.content" :key="i">
                  <el-radio-group v-model="ques.radio">
                    <el-radio :label="con.content" @change.native="handleChange(con, ques)" :disabled="checkedState === 3">{{con.content}}</el-radio>
                  </el-radio-group>                  
                </li>
              </ul>
              <el-input 
                type="textarea" 
                autosize
                placeholder="请输入内容"
                v-model="ques.textarea" 
                v-if="!ques.content && ques.questionType === 2"
                :disabled="checkedState === 3"
                @blur="addResult(ques)">
              </el-input>
            </li>
          </ul>
          <p v-if="newquestion.length === 0">暂无数据</p>
          <!--未答题显示-->
          <div class="button-group" v-if="checkedState === 2 && newquestion.length !== 0">
            <el-button @click="submit">提交</el-button>
            <el-button @click="back">取消</el-button>
          </div>
          <el-button @click="back" v-if="checkedState === 2 && newquestion.length === 0">取消</el-button>
          <!--已答题-->
          <el-button @click="back" v-if="checkedState === 3">关闭</el-button>
      </div>
      
    <!--提示框-->
    <el-dialog
      title="未作答提示"
      :visible.sync="boxVisibile"
      size="tiny"
      :close-on-click-modal="false"
      class="checkPass">
      <span>您有未作答的题目，请作答后提交</span>
      <span>未做完题目：{{numberstr}} </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="go">离开</el-button>
        <el-button type="primary" @click="qusubmit">留在此页</el-button>
      </span>
    </el-dialog>     
    </div>
</template>

<script>
import querystring from 'querystring'
import { notice, error, success } from '../../../api/index.js'
export default {
  name: 'CheckInfo',
  data () {
    return {
      newquestion: [],
      reasonVisible: false,
      dialogVisible: false,
      boxVisibile: false,
      iteme: '',
      eosIds: '',
      questionTypes: '',
      answers: [],
      answerstr: '',
      checkedState: 0,
      numbers: [],
      numberstr: '',
      rowMes: {},
      rowInfo: {},
      groupstate: 0
    }
  },
  methods: {
    checkPass () {
      this.dialogVisible = true
    },
    passSubmit () {
      this.dialogVisible = false
      this.$router.push({path: '/assessmentCheck/index'})
    },
    returnSubmit () {
      this.reasonVisible = false
      this.textarea = ''
      this.$router.push({path: '/assessmentCheck/index'})
    },
    returnCancel () {
      this.textarea = ''
    },
    addResult (ques) {
      this.$set(this.answers, ques.number, {number: ques.number, answer: ques.textarea})
    },
    handleChange (con, ques) {
      this.$set(this.answers, ques.number, {number: ques.number, answer: con.score})
    },
    back () {
      // 进行中的取消，清楚所选
      if (this.checkedState === 2) {
        this.answers.forEach((item, index) => {
          this.newquestion.forEach(ques => {
            if (index === ques.number) {
              item = ''
            }
          })
        })
      }
      this.$router.push({path: '/myComment/otherComment'})
      // }
    },
    go () {
      this.boxVisibile = false
      this.$router.push({path: '/myComment/otherComment'})
    },
    submit () {
      let time = new Date().getTime()
      if (time > this.rowInfo.endtime) {
        notice(this, '该测评已经超过测评结束时间！', 2000)
        return
      }
      // 清空未答题题号数组
      // this.numbers = []
      this.numberstr = ''
      // 如果答案题号和问题题号相等。删除掉相同的题
      let a = [...this.newquestion].filter(n => n.questionType !== 3)
      // this.answers = this.answers.filter(item => item)
      this.answers.forEach((item, index) => {
        a.forEach((child, i) => {
          if (item.number === child.number && item.answer !== '') {
            a.splice(i, 1)
          }
        })
      })
      // 未答题的题号
      this.numberstr = a.map(n => n.number).join(',')
      // 所有答案
      this.answerstr = this.answers.map(item => item.answer).join('/')
      // 提交--未完全答题
      if (a.length !== 0) {
        this.boxVisibile = true
      } else {
        // 提交--完全答题
        this.$https.post(`myEvaluate/saveEvalUserResult`, querystring.stringify({eosIds: this.eosIds, questionTypes: this.questionTypes, answers: this.answerstr, evalId: this.rowMes.evalId}))
        .then(res => {
          if (res.data.code === 1) {
            success(this, res.data.message, 2000)
            this.getEvalUserForTableAndResult()
            this.$router.push({path: '/myComment/otherComment'})
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
      }
    },
    qusubmit () {
      this.boxVisibile = false
    },
    // 获取题目
    getEvalUserForTableAndResult () {
      this.answers = []
      this.answerstr = ''
      this.$https.get(`myEvaluate/getEvalUserForTableAndResult?evalId=${this.rowMes.evalId}&groupId=${this.rowMes.groupId}&userId=${this.rowMes.userId}&tableId=${this.rowMes.tableId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.newquestion = res.data.result[0].tableDtoList.map(item => ({...item, textarea: '', radio: ''}))
          this.eosIds = this.newquestion.map(item => item.eosId).join(',')
          this.questionTypes = this.newquestion.map(item => item.questionType).join(',')
          // 显示已选的题目答案
          this.newquestion.forEach(item => {
            // 选择题
            if (item.content) {
              // 把content转换成数组对象
              this.$set(item, 'content', JSON.parse(item.content))
              // 显示已选
              if (item.getScore !== null && item.state === 1) {
                // 选择题
                item.content.forEach(con => {
                  if (item.getScore === con.score) {
                    item.radio = con.content
                    this.$set(this.answers, item.number, {number: item.number, answer: con.score})
                  }
                })
              }
            } else {
              // 简答题
              if (item.answer) {
                item.textarea = item.answer
                this.$set(this.answers, item.number, {number: item.number, answer: item.textarea})
              }
            }
          })
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
    }
  },
  created () {
    this.rowInfo = JSON.parse(sessionStorage.rowInfo)
    this.rowMes = JSON.parse(sessionStorage.rowMes)
    this.checkedState = JSON.parse(sessionStorage.checkedState)
    if (this.$route.query.groupstate) {
      this.groupstate = JSON.parse(this.$route.query.groupstate)
    }
    this.getEvalUserForTableAndResult()
  }

}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#CheckInfo {
  background: #F0F0F0;

  .el-radio__input.is-disabled.is-checked .el-radio__inner {
    background: #409eff !important;
    border-color: #409eff !important;

    &:after {
      background-color: #fff !important;
    }
  }

  .el-radio__input.is-disabled+span.el-radio__label {
    color: #606266;
  }
  .el-radio__input.is-disabled.is-checked+span.el-radio__label {
    color: #000 !important;
  }

   .naire {
     background: #fff;
     border-radius: 4px;
     margin-bottom: 10px;

     &>h3 {
       width: 100%;
       margin: 0px;
       text-align: center;
       font-weight: normal;
       font-family: '微软雅黑';
       font-size: 20px;
       padding: 40px 0px;
       border-bottom: 1px solid #E6E6E6;
     }
     &>ul {
       width: 45%;
       height: auto;
       margin: 28px auto 0px auto;
       padding: 5px 0px 5px 0px;

       li {
         list-style-type: none;
         line-height: 45px;
         text-align: left;
         font-size: 14px;
         display: flex;
         .tips {
          min-width: 110px;
          color: #999999;

            i {
              // font-size: 12px;
              margin: 0px 5px;
            }
            img {
            vertical-align: middle;
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
           min-width: 72px;
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
   }
  .naireInfo {
    border-radius: 4px;
    background: #fff;
    padding: 30px 28% 0px;
    margin: 0 auto;
    text-align: center;
    &>ul {
      padding: 0px;

      &>li {
        padding-bottom: 20px;
        list-style-type: none;
        text-align: left
        ;
        &>.el-textarea {
          &>.el-textarea__inner {
            resize: none;
            height: 80px !important;
            outline: none;
          }
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
      text-align: center;
      margin: 20% auto;
    }
    &>.el-button {
      margin-bottom: 20px;
    }
    &>.button-group {
      margin-bottom: 20px;
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
        span {
          font-weight: normal;
        }

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
        span {
          display: block;
          width: 245px;
          margin: 2px auto;
          text-align: left;
        }
      }
      .el-dialog__footer {
        margin-top: -15px;
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