<template>
  <div id="subject-active">
    <header>
      <span>被测评人：{{parameter.name}}</span>
      <span>题目：主观题</span>
      <el-button @click="exportQuertion">导出</el-button>
    </header>
    <main>
      <div class="main-left">
        <p v-for="(item, index) in list" :key="index" @click="assessmentWaySelected(item, index)" :class="{active: assessmentWayActive === index}">
          <span>{{item.tableName}}</span>
        </p>
      </div>
      <div class="main-middle">
        <p v-if="navList.length !== 0" v-for="(item, index) in navList" :key="index" @click="questionSelected(item, index)" :class="{active: titleActive === index}">
          <span>{{item.number}}.</span>
          {{item.questionName}}
        </p>
        <div style="text-align: center;" v-if="navList.length === 0">
          暂无主观题
        </div>
      </div>
      <div v-if="navList.length !== 0" class="main-right">
        <p>{{number}}.{{questionName}}
          <span style="margin-left: 30px;">{{assessmentWayName}}</span>
        </p>
        <div class="title">
          <span v-for="(item, index) in titleList" :key="index">{{item.name}}</span>
          <span>{{questionName}}</span>
        </div>
        <div v-if="answerList.length !== 0" class="list" v-for="(item, index) in answerList" :key="index">
          <span>{{index + 1}}</span>
          <span v-if="item.userName">{{item.userName}}</span>
          <span v-if="!item.userName"> -- </span>
          <span v-if="item.deptName">{{item.deptName}}</span>
          <span v-if="!item.deptName"> -- </span>
          <span>
            <i :style="{width: item.width}">
              {{item.answer}}
            </i>
          </span>
        </div>
        <p style="padding-left: 60px;" v-if="answerList.length === 0">暂未答题</p>
      </div>
    </main>
  </div>
</template>

<script>
import { notice } from '../../../api/index.js'
export default {
  name: 'subjectActive',
  data () {
    return {
      parameter: {},
      titleActive: 0,
      assessmentWayActive: 0,
      navList: [],
      questionName: '',
      number: '',
      list: [],
      answerList: [],
      titleList: [
        {num: 3, name: '序号'},
        {num: 3, name: '测评人'},
        {num: 3, name: '部门'}
      ],
      assessmentWayName: ''
    }
  },
  methods: {
    // 导出
    exportQuertion () {
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/eval/excelOtherSubjective?evalId=${this.parameter.evalId}&userId=${this.parameter.userId}&userName=${this.parameter.name}`
    },
    assessmentWaySelected (item, index) {
      this.assessmentWayName = item.tableName
      this.assessmentWayActive = index
      this.navList = item.questions
      this.assessmentWayName = item.tableName
      if (this.answerList.length !== 0) {
        this.answerList = this.navList[0].users.map(child => ({...child, width: child.answer.length * 16 + 'px'}))
        this.questionName = this.navList[0].questionName
        this.number = this.navList[0].number
      }
    },
    questionSelected (item, index) {
      this.titleActive = index
      this.questionName = item.questionName
      this.answerList = item.users
      this.number = item.number
    },
    // 其他测评-获取主体详细信息
    getOtherSubjectiveDetail () {
      this.$https.get(`/eval/getOtherSubjectiveDetail?evalId=${this.parameter.evalId}&userId=${this.parameter.userId}`)
      .then(res => {
        if (res.data.code === 1) {
          console.log(res)
          this.list = res.data.result
          if (this.list.length !== 0) {
            this.navList = this.list[0].questions
            this.assessmentWayName = this.list[0].tableName
            if (this.navList.length !== 0) {
              this.answerList = this.navList[0].users.map(item => ({...item, width: item.answer.length * 16 + 'px'}))
              this.questionName = this.navList[0].questionName
              this.number = this.navList[0].number
            }
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.parameter = JSON.parse(sessionStorage.subjectiveParameter)
    this.getOtherSubjectiveDetail()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#subject-active{
  // position: relative;
  // margin-top: -60px;

  header{
    background: #fff;
    padding: $width;

    &>span{
      font-size: 15px;
      margin-right: $width*2;
    }

    .el-button{
      float: right;
      margin-top: -8px;
    }
  }

  &>div{
    padding: $width;
    font-size: 18px;
    background: #fff;
    margin-top: $width;
    text-align: center;
  }

  main{
    margin: $width;
    display: flex;

    .main-left,.main-middle{
      margin-left: $width;
      width: 240px;
      background: #fff;
      border: 1px solid #ECECEC;
      border-radius: 4px;
      padding: $width/2;

      p{
        border-left: 2px solid transparent;
        padding: $width 5px;
        font-size: 15px;
        color: #2F3430;
        cursor: pointer;
      }

      .active{
        border-left: 2px solid #1CB9FE;
        background: #DAF5FF;
      }
    }

    .main-right{
      padding-bottom: $width * 2;
      flex: 1;
      margin-left: $width;
      background: #fff;
      border: 1px solid #ECECEC;
      border-radius: 4px;

      &>p{
        padding: $width;
        border-bottom: 1px solid #DCDCDC;
        font-size: 15px;
      }

      .title{
        border-bottom: 1px solid #DCDCDC;
        line-height: 48px;
        font-size: 15px;

        span:nth-child(1),span:nth-child(2),span:nth-child(3){
          display: inline-block;
          width: $width*6;
          text-align: center;
          margin-left: $width*2;

          &:last-child{
            margin-left: $width*2;
          }
        }

        span:last-child{
          margin-left: $width*2;
        }
      }

      .list{
        overflow-x: scroll;
        line-height: 48px;

        &>span{
           display: inline-block;
           width: $width*6;
           text-align: center;
           margin-left: $width*2;
        }
        
        &>span:last-child{
          width: 100px;
          text-align: left;
          i{
            font-style: normal;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
