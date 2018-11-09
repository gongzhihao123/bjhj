<template>
  <div class="answer">
    <div id="commonDetails" v-if="evalDto">
      <h3 class="h3" style="text-align:center;">
        民主测评表
        <slot name="button"></slot>
      </h3>

      <main class="details-main">
        <div class="el-table el-table--border">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" min-width="1170px">
            <thead class="is-group has-gutter">
              <tr>
                <th colspan="1" rowspan="1"><div class="cell">项&nbsp;&nbsp;目<br/>内&nbsp;&nbsp;容</div></th>
                <th v-for="item in tableOneTitile" :key="item.id" :colspan="item.colspan" rowspan="1"><div class="cell">{{item.name}}</div></th>
              </tr>
              <tr>
                <th :width="tableWidth*2 + '%'" colspan="1" rowspan="1"><div class="cell">被测评人\<br/>评价等级</div></th>
                <th :width="tableWidth + '%'" v-for="item in tableTwoTitile" :key="item.id" colspan="1" rowspan="1"><div class="cell">{{item.name}}</div></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="eitem in evalDto.evaluators" :key="eitem.id">
                <td colspan="1" rowspan="1"><div class="cell">{{eitem.name}}</div></td>
                <td v-for="item in tableTwoTitile" :key="item.id" colspan="1" rowspan="1" @click="selectItem(item.qid, eitem.id, item.qid+':'+eitem.id+':'+item.value)">
                  <div class="cell">
                    <i v-bind:class="{'el-icon-success':true, 'success':(userResult['q'+item.qid+'u'+eitem.id] === item.qid+':'+eitem.id+':'+item.value)}" ></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="1" rowspan="1"></td>
                <td v-for="item in tableTwoTitile" :key="item.id" colspan="1" rowspan="1"></td>
              </tr>
              <tr>
                <td colspan="1" rowspan="1"><div class="cell">参评人<br/>身&nbsp;&nbsp;份</div></td>
                <td v-for="(item, i) in tableDegreeTitile" :key="i" :colspan="item.id!=-1?3:2" rowspan="1" :class="(item.id==-1&&(i==tableDegreeTitile.length-1))?'no-border':''">
                  <div class="cell" v-if="item.id!=-1">{{item.name}}</div>
                  <div class="cell" v-if="item.id===-1"><i @click="selectItemDegree(item.value)" v-bind:class="{'el-icon-success':true, 'success':(userDegree===item.value)}" ></i></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="answer-btn">
          <el-button v-show="canEditor" type="success" @click="submitResult">提交答卷</el-button>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import service from '../api/index'
import { mapGetters } from 'vuex'
import { error, warning, success, dateFormat } from '../utils/common'

export default {
  name: 'answer',
  data () {
    return {
      evalId: 0,
      evalDto: {
        eval: {
          id: 0,
          name: '',
          companyId: 0,
          companyName: '',
          createdTime: ''
        },
        template: {
          id: 0,
          name: '',
          degree: '',
          schoolDegree: '',
          questions: []
        }
      },
      tableOneTitile: [],
      tableTwoTitile: [],
      tableDegreeTitile: [],
      tableWidth: 5,
      userResult: {},
      userDegree: -1,
      canEditor: true
    }
  },
  created () {
    this.evalId = this.$route.query.id
    this.getMyEvalDetail()
  },
  methods: {
    // 获取
    async getMyEvalDetail () {
      const res = await service.getMyEvalDetail(this.evalId)
      if (res && res.code === 1) {
        console.log(res)
        this.evalDto = res.result
      } else {
        error(res.message)
      }
    },
    selectItem (qid, uid, value) {
      if (this.canEditor) {
        this.$forceUpdate()
        this.userResult['q' + qid + 'u' + uid] = value
      }
    },
    selectItemDegree (value) {
      if (this.canEditor) {
        this.$forceUpdate()
        this.userDegree = value
      }
    },
    submitResult () {
      this.$confirm('提交后测评结果将不能进行修改，您确定要提交测评结果吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var vlidate = true
        var answerString = []
        let prompt = []
        // 判断是否选择了所有的测评的题目
        this.evalDto.evaluators.forEach(item => {
          this.evalDto.template.questions.forEach(qitem => {
            var selectedItemValue = this.userResult['q' + qitem.id + 'u' + item.id] || ''
            if (selectedItemValue && selectedItemValue.length > 0) {
              answerString.push(selectedItemValue)
            } else {
              prompt.push(`您未选择${item.name}参评项目${qitem.name}`)
              vlidate = false
              return false
            }
          })
        })
        if (prompt.length && this.userDegree !== -1) {
          warning(prompt[0])
        }
        // 判断是否选择身份
        if (this.userDegree === -1) {
          warning('请选择参评人身份')
          vlidate = false
          return false
        }
        if (vlidate) {
          this.postMyEvalResult(answerString)
        }
      }).catch((error) => {
        console.log(error)
      })
      return true
    },
    async postMyEvalResult (answerString) {
      var params = {}
      params.evalId = this.evalId
      params.degree = this.userDegree
      params.answerString = answerString.join(',')
      const res = await service.postMyEvalResult(params)
      console.log(res)
      if (res && res.code === 1) {
        if (this.canEditor) {
          this.canEditor = false
        }
        success('提交成功')
      } else {
        error(res.message || '提交失败，请稍后重试')
      }
    }
  },
  filters: {
    dateFormat: function (arg) {
      return dateFormat(arg, 'yyyy-MM-dd hh:mm')
    }
  },
  watch: {
    evalDto () {
      var tableOneTitileObj = []
      var tableTwoTitileObj = []
      var tableDegreeTitileObj = []
      this.evalDto.template.questions.forEach(item => {
        var optionsObj = item.options.split(',')
        tableOneTitileObj.push({id: item.id, name: item.name, colspan: optionsObj.length})
        optionsObj.forEach((oitem, i) => {
          tableTwoTitileObj.push({id: item.id + '_' + i, qid: item.id, name: oitem, value: i})
        })
      })
      if (this.evalDto.eval.companyId === this.loginUser.companyId) {
        var degreeObj = this.evalDto.template.degree.split(',')
        degreeObj.forEach((oitem, i) => {
          tableDegreeTitileObj.push({id: i, name: oitem, value: i})
          tableDegreeTitileObj.push({id: -1, name: oitem, value: i})
        })
      } else {
        var schoolDegreeObj = this.evalDto.template.schoolDegree.split(',')
        schoolDegreeObj.forEach((oitem, i) => {
          tableDegreeTitileObj.push({id: i, name: oitem, value: i})
          tableDegreeTitileObj.push({id: -1, name: oitem, value: i})
        })
      }
      this.tableDegreeTitile = tableDegreeTitileObj
      this.tableOneTitile = tableOneTitileObj
      this.tableTwoTitile = tableTwoTitileObj
      // 计算表格百分比宽度
      this.tableWidth = 100 / (tableTwoTitileObj.length + 2)
      // 是否限制修改
      if (this.evalDto.answer) {
        this.canEditor = this.evalDto.answer.answerState === 0
      } else {
        this.canEditor = true
      }
      // 参与人身份
      var answerUser = this.evalDto.answer
      if (answerUser) {
        this.userDegree = answerUser.degree
      }
      // 编辑答案
      var answerQuestions = this.evalDto.answerQuestions
      if (answerQuestions) {
        this.$forceUpdate()
        answerQuestions.forEach(item => {
          this.userResult['q' + item.questionId + 'u' + item.evaluatorId] = item.questionId + ':' + item.evaluatorId + ':' + item.answer
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      'loginUser'
    ])
  }
}
</script>
<style lang="scss">
@import '../assets/scss/variable.scss';
#commonDetails {
  background: $white;
  position: relative;
  padding: 15px;
  text-align: left;
  .el-table--border {
      border: 1px solid #000;
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      th,td {
          border-bottom: 1px solid #000;
          border-right: 1px solid #000;
      }
  }
  .answer-btn {
    text-align: center;
    width: 100%;
    margin-top: 40px;
  }
  .el-table {
    .cell {
      color: #333;
      text-align: center;
      font-weight: bold;
    }
    td.no-border {
      border-right: 0px;
    }
    td {
      width: 48px;
      height: 48px;
      padding: 10px 0;
      .cell {
        color: #666;
        text-align: center;
        font-weight: bold;
        padding: 0;
        i {
          color: #e3e3e3;
          font-size: 18px;
        }
        i.success {
          color: $theme;
          font-size: 18px;
        }
      }
    }
  }
  .h3 {
    text-align: center;
    line-height: 50px;
    font-size: 20px;

    .el-button {
      float: right;
      margin: 0 !important;
    }
  }
  .details-header {
    background: #f5f7fa;
    padding: 0 10px;
    p {
      line-height: 36px;
      color: #666;
      .span {
        color: #53a7ef;
        cursor: pointer;
      }
      span {
        color: #333;
      }
    }
  }
  .article {
    padding-top: 20px;
  }
  .details-main {
    margin: 20px 0;
    p {
      line-height: 40px;
    }
    ul {
      li {
        overflow: hidden;
        line-height: 40px;;
        box-sizing: border-box;
        min-height: 40px;
        position: relative;
        padding-left: 20px;
      }
    }
    .question {
      textarea {
        resize: none;
      }
    }
  }
}
</style>
