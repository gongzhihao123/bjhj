<template>
    <div id='groupComment'>
      <div class="head">
        <!-- <el-button @click="back">返回</el-button> -->
      </div>
      <div class="content">
        <h3>{{rowMes.tableName}}</h3>
        <div class="checktime">
          <p><img src="../../../assets/images/time.png"><i>/</i>测评时间：{{rowInfo.starttime | dateFormatT('yyyy-MM-dd hh:mm')}}&nbsp;至&nbsp;
          {{rowInfo.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</p>
          <p><img src="../../../assets//images/notice.png"><i>/</i>测评说明：<span v-if="rowInfo.remark !== null">{{rowInfo.remark}}</span><span v-if="rowInfo.remark === null">无</span></p>
        </div>
        </div>
        <div class="table-box">
        <!-- 表格 -->
        <el-table
        :data="datas"
        border
        height="700">
        <!-- 左边固定的人员信息 -->
        <el-table-column
          fixed
          width="200"
          align="center">
          <template scope="scope">
              <ul class="perInfo">
                <li>{{scope.row.teacher.userName}}</li>
                <li v-if="rowInfo.evalType === 1">{{scope.row.teacher.deptName}}</li>
                <li v-if="rowInfo.evalType === 2">{{scope.row.teacher.companyName}}</li>
              </ul>                    
          </template>
        </el-table-column>
        <!-- 顶部固定的题型 -->
        <el-table-column
          v-for="(item, index) in questionInfo"
          :key="index"
          :label="item.quetitle"
          :prop="item.id + ''"
          :width="item.questionType === 3 ? 200 : 220">
          <template scope="scope">
              <el-radio-group v-if="item.questionType === 1" v-model="scope.row[item.id].value">
                <ul style="padding: 0">
                  <li v-for="(content, i) in scope.row[item.id].content" class="radio-li" :key="i">
                    <el-radio class="radio" :label="content.score" :disabled="checkedState === 3" v-if="checkedState === 3 && scope.row[item.id].value === content.score || checkedState === 2">
                      {{ content.content }}
                    </el-radio>
                  </li>
                </ul>
              </el-radio-group>
              <el-input v-else-if="(item.questionType === 2 && checkedState === 3 && scope.row[item.id].value !== null) || (item.questionType === 2 && checkedState === 2)"  type="textarea" :rows="3"
                        v-model="scope.row[item.id].value" placeholder="请输入内容" :disabled="checkedState === 3">
              </el-input>
            </template>            
        </el-table-column> 

      </el-table>
      <div class="button-group" v-if="checkedState === 2 && questionInfo.length !== 0 && !flag">
        <el-button @click="submit">提交</el-button>
        <el-button @click="back">取消</el-button>
      </div>
      <div v-else class="button-group">
        <el-button @click="quit">关闭</el-button>
      </div>
      <el-button @click="back" v-if="checkedState === 2 && questionInfo.length === 0">取消</el-button>
      <el-button @click="back" v-if="checkedState === 3 && !flag">关闭</el-button>
      </div>
    <!--提示框-->
    <el-dialog
      title="未作答提示"
      :visible.sync="boxVisibile"
      size="tiny"
      :close-on-click-modal="false"
      class="checkPass">
      <span>您有未作答的题目，请作答后提交</span>
      <span>未做完题目：
        <ul>
          <li v-for="(re, i) in numbers" :key="i">
            {{re.name}}: &nbsp;&nbsp;{{re.numbers}}  
          </li>  
        </ul>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="go">离开</el-button>
        <el-button type="primary" @click="boxVisibile = false">留在此页</el-button>
      </span>
    </el-dialog>            
    </div>
</template>

<script>
import querystring from 'querystring'
import { notice, error, success } from '../../../api/index.js'
export default {
  name: 'groupComment',
  data () {
    return {
      loading: false,
      boxVisibile: false,
      rowInfo: {},
      rowMes: {},
      questionInfo: [],
      teacherInfo: [],
      otherScoreList: [],
      answers: [],
      ids: '',
      questionType: '',
      numberstr: '',
      answerstr: '',
      numbers: [],
      checkedState: 0,
      flag: false,
      datas: []
    }
  },
  methods: {
    quit () {
      this.$router.push({path: '/myComment/groupInfo'})
    },
    back () {
      this.$router.push({path: '/myComment/groupInfo'})
    },
    getEvalTableForTableAndResult () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`myEvaluate/getEvalTableForTableAndResult?evalId=${this.rowMes.evalId}&tableId=${this.rowMes.tableId}&groupId=${this.rowMes.groupId}`)
        .then(res => {
          if (res.data.code === 1) {
            res.data.result.evalTabQuestionList ? this.questionInfo = res.data.result.evalTabQuestionList : this.questionInfo = []
            if (this.questionInfo.length === 0) {
              this.flag = true
            } else {
              this.questionInfo.forEach(item => {
                if (item.questionType === 1) {
                  this.$set(item, 'content', JSON.parse(item.content))
                }
              })
              this.questionInfo = this.questionInfo.map(child => ({...child, radio: '', textarea: '', teanswer: [], quetitle: ''}))
              this.questionInfo.forEach(item => {
                if (item.questionType === 3) {
                  item.quetitle = item.title
                } else {
                  item.quetitle = item.number + '.' + item.title
                }
              })
            }
            res.data.result.evalOtherScoreDtoList ? this.teacherInfo = res.data.result.evalOtherScoreDtoList : this.teacherInfo = []
            res.data.result.otherScoreList ? this.otherScoreList = res.data.result.otherScoreList : this.otherScoreList = []
            if (this.otherScoreList.length !== 0) {
              this.ids = this.otherScoreList.map(item => item.id).join(',')
              this.questionTypes = this.otherScoreList.map(item => item.questionType).join(',')
            }
            var datas = []
            if (this.teacherInfo.length !== 0) {
              this.teacherInfo.forEach(teacher => {
                var data = {
                  teacher: teacher
                }
                let evalQuestion = this.questionInfo.filter(item => item.questionType !== 3)
                evalQuestion.forEach(ques => {
                  var score
                  score = this.otherScoreList.find(score => score.userId === teacher.userId && ques.id === score.questionId)
                  if (score.state === 0) {
                    data[ques.id] = {
                      value: score ? score.answer || score.score || null : null,
                      questionId: ques.id,
                      content: ques.content,
                      number: ques.number,
                      state: score.state,
                      etsId: score.id
                    }
                  } else if (score.state === 1) {
                    data[ques.id] = {
                      value: score ? score.answer || score.score : null,
                      questionId: ques.id,
                      content: ques.content,
                      number: ques.number,
                      state: score.state,
                      etsId: score.id
                    }
                  }
                })
                datas.push(data)
              })
              this.datas = datas
            }
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
          this.loading = false
        })
        .catch(res => {
          notice(this, '连接超时', 2000)
        })
        .finally(res => {
          this.loading = false
        })
      }, 500)
    },
    submit () {
      let time = new Date().getTime()
      if (time > this.rowInfo.endtime) {
        notice(this, '该测评已经超过测评结束时间！', 2000)
        return
      }
      this.ids = ''
      let ids = []
      this.answers = []
      this.answerstr = ''
      this.numbers = []
      this.datas.forEach(item => {
        let a = {name: '', numbers: []}
        for (var s in item) {
          if (s !== 'teacher') {
            if (item[s].value === null || item[s].value === '') {
              a.numbers.push(item[s].number)
              a.name = item.teacher.userName
            } else {
              this.answers.push(item[s].value)
              ids.push(item[s].etsId)
            }
          }
        }
        if (a.name !== '') {
          this.numbers.push(a)
        }
      })
      this.answerstr = this.answers.join('/')
      this.ids = ids.join(',')
      if (this.numbers.length > 0) {
        this.boxVisibile = true
        return
      }
      this.$https.post(`myEvaluate/saveEvalTableResult`, querystring.stringify({ids: this.ids, questionTypes: this.questionTypes, anwsers: this.answerstr, evalId: this.rowMes.evalId}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.getEvalTableForTableAndResult()
          this.$router.push({path: '/myComment/groupInfo'})
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
    go () {
      this.boxVisibile = false
      this.$router.push({path: '/myComment/groupInfo'})
    }
  },
  created () {
    this.rowInfo = JSON.parse(sessionStorage.rowInfo)
    this.rowMes = JSON.parse(sessionStorage.rowMes)
    this.checkedState = JSON.parse(sessionStorage.checkedState)
    this.getEvalTableForTableAndResult()
  }
}
</script>
<style lang="scss">
#groupComment {
  background: #F0F0F0;

  .el-radio__input.is-disabled.is-checked .el-radio__inner {
    background: #409eff !important;
    border-color: #409eff !important;

    &:after {
      background-color: #fff !important;
    }
  }

  .el-radio__input.is-disabled+span.el-radio__label {
    color: #606266 !important;
  }  

  .perInfo {
      li {
        text-align: center !important;
      }
    }

      ul {
        padding: 0px;
       li {
        list-style-type: none;
       } 
      }
      .radio-li {
        list-style: none;
        line-height: 20px;
    }

    .radio-li .el-radio {
      white-space: normal;
      display: inline-flex;
    }

    .radio-li .el-radio .el-radio__input {
      padding-top: 1px;
    }

    .radio-li .el-radio .el-radio__label {
      display: block;
    }
    tbody>tr>td>.cell {
      padding-left: 18px;
      padding-right: 18px;      
      ul {
        li {
          text-align: left;
        }
      }
    }  
    .head {
        background: #fff;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
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
        right: 10px;
        top: 10px;
        }
    }
    .content {
      position: relative;
      background: #fff;
      padding-top: 20px;
      margin-top: 0px;
      padding-bottom: 20px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      margin-bottom: 20px;

      h3 {
        text-align: center;
        font-weight: normal;
      }
      .checktime {
        padding: 20px;
        margin: 0 auto;
        background: #fff;

        p {
          img {
            vertical-align: middle;
          }
          i {
              padding: 0px 5px;
            }
        }
      }
    }
    .table-box {
      padding-top: 20px;
      background: #fff;

      width: 100%;
      height: 800px;
      position: relative;

      .el-table {
        width: 95% !important;
        overflow-y: auto;
        margin: 20px auto;
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
      }
      .el-table__header-wrapper {
        overflow: none;
      }
      .el-table__header-wrapper thead div {
        background-color: #eef1f6;
        color: #1f2d3d;
      }  
      .button-group {
        text-align: center;
        position: absolute;
        bottom: 20px;
        width: 100%;
      }
      &>.el-button {
        margin: 20px auto 20px 48%;
      }
    }
   .checkPass {
    .el-dialog {
      width: 444px;
      min-height: 300px;

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
        height: 200px;
        overflow: auto;
        padding-top: 15%;
        padding-bottom: 15%;

        ul {
          padding: 0px;
          margin: 0px;

          li {
            list-style-type: none;
            line-height: 30px;
          }
        }
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