<template>
  <div class="answer">
    <div class="head noprint" v-if="headBool">
      <div>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
    <div id="commonDetails" v-if="evalDto">
      <h3 class="h3" style="text-align:center;">
        民主测评情况汇总表
        <slot name="button"></slot>
      </h3>
      <p style="float:left;line-height:40px">被测评单位：{{ evalDto.evalCompany.companyName }}</p>
      <p class="noprint" style="float:right;line-height:40px">参与人数{{evalDto.allCount?evalDto.allCount+'人':'全员'}}，已完成{{evalDto.answeredCount}}人</p>
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
                <th :width="getTableWidth(item.id)" v-for="item in tableTwoTitile" :key="item.id" colspan="1" rowspan="1">
                  <div class="cell" :style="getTableWidthCell(item.id)" >{{item.name}}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="eitem in evalDto.evaluators" :key="eitem.id">
                <td colspan="1" rowspan="1"><div class="cell">{{eitem.name}}</div></td>
                <td v-for="item in tableTwoTitile" :key="item.id" colspan="1" rowspan="1" >
                  <div class="cell">
                    <p>{{userResult['q'+item.qid+'u'+eitem.id+'a'+item.value]}}</p>
                    <p v-if="item.id=='rate_lv'&&rateResult&&rateResult['q'+item.qid+'u'+eitem.id]">{{(rateResult['q'+item.qid+'u'+eitem.id].fine/rateResult['q'+item.qid+'u'+eitem.id].all)*100 | numFormat}}%</p>
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
                  <div class="cell" v-if="item.id===-1">{{degreeResult['d'+item.value]}}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <p class="noprint" v-if="evalDto.unUsers">未答人员名单：{{ evalDto.unUsers.toString() }}</p>
    </div>
  </div>
</template>
<script>
import service from '../api/index'
import { mapGetters } from 'vuex'
import { error, dateFormat } from '../utils/common'

export default {
  name: 'answerResult',
  data () {
    return {
      ecId: 0,
      evalDto: {
        eval: {
          id: 0,
          name: '',
          companyId: 0,
          companyName: '',
          createdTime: ''
        },
        evalCompany: {
          companyName: ''
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
      degreeResult: {},
      rateResult: {},
      userDegree: -1,
      canEditor: true,
      headBool: false
    }
  },
  created () {
    this.ecId = this.$route.query.id
    this.getEvalDetail()
  },
  mounted () {
    setTimeout(() => {
      this.headBool = true
    }, 300)
  },
  methods: {
    // 获取
    async getEvalDetail () {
      const res = await service.getEvalQuestion(this.ecId)
      if (res && res.code === 1) {
        this.evalDto = res.result
      } else {
        error(res.message)
      }
    },
    getTableWidth (itemId) {
      if (itemId === 'rate_lv') {
        return '40px'
      }
      return this.tableWidth + '%'
    },
    getTableWidthCell (itemId) {
      if (itemId === 'rate_lv') {
        return 'width: 40px;margin-left: 10px;'
      }
      return ''
    }
  },
  filters: {
    dateFormat: function (arg) {
      return dateFormat(arg, 'yyyy-MM-dd hh:mm')
    },
    numFormat: function (arg) {
      if (!arg) {
        return '0'
      }
      var f = parseFloat(arg)
      if (!f) {
        return '0'
      }
      return Math.round(arg * 100) / 100
    }
  },
  watch: {
    evalDto () {
      var tableOneTitileObj = []
      var tableTwoTitileObj = []
      var tableDegreeTitileObj = []
      var rateQId = 0
      var rateResultObj = {}
      this.evalDto.template.questions.forEach(item => {
        var optionsObj = item.options.split(',')
        // 特殊处理，计算现任职务评价的优秀率
        var isRateItem = item.name === '现任职务评价'
        if (isRateItem) {
          tableOneTitileObj.push({id: item.id, name: item.name, colspan: optionsObj.length + 1})
        } else {
          tableOneTitileObj.push({id: item.id, name: item.name, colspan: optionsObj.length})
        }
        optionsObj.forEach((oitem, i) => {
          tableTwoTitileObj.push({id: item.id + '_' + i, qid: item.id, name: oitem, value: i})
        })
        if (rateQId === 0) {
          if (isRateItem) {
            tableTwoTitileObj.push({id: 'rate_lv', qid: item.id, name: '优秀率', value: optionsObj.length, width: 40})
            rateQId = item.id
          }
        }
      })
      if (this.evalDto.evalCompany.companyId === this.loginUser.companyId) {
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
      // 参与人身份
      let answerUser = this.evalDto.answer
      if (answerUser) {
        this.userDegree = answerUser.degree
      }
      // 编辑统计数据
      let answerData = this.evalDto.answerData
      if (answerData) {
        this.$forceUpdate()
        answerData.forEach(item => {
          this.userResult['q' + item.questionId + 'u' + item.evaluatorId + 'a' + item.answer] = item.userCount
          if (rateQId === item.questionId) {
            var rateA = rateResultObj['q' + item.questionId + 'u' + item.evaluatorId] || {all: 0, fine: 0}
            rateA.all = (rateA.all || 0) + item.userCount
            if (item.answer === 0) {
              rateA.fine = (rateA.fine || 0) + item.userCount
            }
            rateResultObj['q' + item.questionId + 'u' + item.evaluatorId] = rateA
          }
        })
      }
      console.log(rateResultObj)
      // 编辑统计人员登记数据
      let degreeData = this.evalDto.degreeData
      if (degreeData) {
        this.$forceUpdate()
        degreeData.forEach(item => {
          this.degreeResult['d' + item.degree] = item.userCount
        })
      }
      // 特殊处理，计算现任职务评价的优秀率
      this.$forceUpdate()
      this.rateResult = rateResultObj
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
.head {
  position: absolute;
  width: 100vw;
  top: 49px;
  left: 0px;
  background: #fff;
  div {
    width: 1200px;
    text-align: right;
    padding: 20px 0px;
    margin: 0 auto;
  }
}
#commonDetails {
  background: $white;
  position: relative;
  padding: 15px;
  text-align: left;
  margin-top: 102px;
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
        padding: 0;
        font-weight: bold;
        p {
          font-size: 12px;
        }
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
@media print {
 .noprint{ display:none;}
 #commonDetails {
   margin-top: 10px;
 }
}
</style>
