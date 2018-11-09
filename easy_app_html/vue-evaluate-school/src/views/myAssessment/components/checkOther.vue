<template>
  <div id="checkMy">
    <!--头部-->
    <div class="head">
      <p>测评结果</p>
      <el-button @click="back">返回</el-button>      
    </div>
    <div class="content">
      <h3>{{rowResult.name}}</h3>
     <ul class="content-box">
        <li>
          测评时间： {{rowResult.starttime | dateFormatT('yyyy-MM-dd hh:mm')}}至
          {{rowResult.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}
        </li>
        <li>当前状态：
          <span v-if="nowDate > rowResult.starttime && nowDate < rowResult.endtime">测评进行中</span>
          <span v-if="nowDate >rowResult.endtime">测评结束</span>
        </li>
    </ul>
      <p>测评结果</p>
      <!--任课教师和班主任-->
      <!--<p >总分：{{rowResult.totalScore}}</p>-->
      <table v-if="tableData.length !== 0">
        <tr>
          <th>学科</th>
          <th>总分</th>
        </tr>
        <tr v-for="(item, i) in tableData">
          <td>{{item.subjectName}}</td>
          <td>{{item.score === 0 ? item.score : item.score.toFixed(1)}}</td>
        </tr>
      </table>
      <!--其他测评-->
      <!--表格-->
      <table class="table-box" border="1" v-if="scoreList.length !== 0">
        <tr>
          <td>组别</td>
          <td>分数</td>
          <td>总分</td>
        </tr>
        <tr v-for="(list, index) in scoreList" :key="index">
          <th>{{list.modeName}}</th>
          <th>{{list.score}}</th>
          <th v-if="index === 0" :rowspan="scoreList.length">{{totalScore}}</th>
        </tr>
      </table>
      <p v-if="scoreList.length === 0 && rowResult.evalType === 3" class="null">暂无数据</p>
      <p v-if="tableData.length === 0 && rowResult.evalType !== 3" class="null">暂无数据</p>
    </div>         
  </div>
</template>

<script>
import { notice, error } from '../../../api/index.js'
export default {
  name: 'checkMy',
  data () {
    return {
      member: true,
      list: false,
      rowResult: {},
      nowDate: '',
      totalScore: 0,
      scoreList: [],
      tableData: []
    }
  },
  methods: {
    memberClick () {
      if (this.member) {
        this.member = false
        this.list = true
      } else {
        this.member = true
        this.list = false
      }
    },
    listClick () {
      if (this.list) {
        this.list = false
        this.member = true
      } else {
        this.list = true
        this.member = false
      }
    },
    getMyEvalResultByOther () {
      this.$https.get(`myEvaluate/getMyEvalResultByOther?evalId=${this.rowResult.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.totalScore = res.data.result.totalScore
          this.scoreList = res.data.result.scoreList
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
    },
    getMyEvalResultByTeacher () {
      this.$https.get(`myEvaluate/getMyEvalResultByTeacher?evalId=${this.rowResult.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result
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
    },
    back () {
      this.$router.push({path: '/myAssessment/index'})
    }
  },
  created () {
    this.rowResult = JSON.parse(sessionStorage.rowResult)
    let d = new Date()
    this.nowDate = d.getTime()
    if (this.rowResult.evalType === 3) {
      this.getMyEvalResultByOther()
    } else {
      this.getMyEvalResultByTeacher()
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss'; 
#checkMy {
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
      right: 10px;
      top: 10px;
     }     
   }
  .content {
    width: 80%;
    margin: 0 auto;
    &>h3 {
      text-align: center;
      font-weight: normal;
    }
    &>ul {
      width: inherit;
      margin: 0 auto;
      background: #f1f1f1;
      border: 1px solid #ddd;
      padding: 0px 0px 0px 5px;
      li {
        line-height: 20px;
        list-style-type: none;
        padding: 10px 0px;
      }
    }
    &>p {
      width: inherit;
      margin: 0 auto;
      line-height: 30px;
      padding: 10px 0px;
      text-indent: 1rem;
    }  
    &>table {
      width: 60%;
      margin: 0 auto;
      border-collapse:collapse;
      margin-bottom: 20px;

      &>tr {
        &>th, &>td {
          text-align: center;
          line-height: 30px;
          border: 1px solid #ccc;
        }
      }
    }  
    .table-box {
      width: 80%;
      margin: 0 auto;
      text-align: center;
      border-collapse:collapse;
      border-color: #333;
      margin-bottom: 10%;

      tr {
        
        td {
          line-height: 30px;
          color: #333;
        }
        th {
          color: #333;
          line-height: 30px;
          font-weight: normal;
        }
      }
    }
    .null {
      text-align: center;
      margin: 20px 0px;
    }
  }
}
</style>
