<template>
  <div id="look-question">
    <header>
      <span>查看结果</span>
      <el-input v-if="evalType === '3'" v-model="keyword" @keyup.enter.native="search" :on-icon-click="search" placeholder="输入关键字查询" icon="search"></el-input>
      <div class="button-group">
        <el-button size="large" @click="daochu">导出</el-button>
      </div>
    </header>	

			<!--主体  -->
			<main>
        <p>被测评人: <span>{{perInfo.userName}}</span></p>
        <div class="questionType">
          <p><img src="../../../assets/images/zhuguan.png">客观题得分<i>/</i></p>
          <el-table
            :data="contentList"
            border
            width="100%">
            <el-table-column
              label="题号">
              <template scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="题目">
            </el-table-column>
            <el-table-column
              prop="score"
              label="分数">
            </el-table-column>                   
          </el-table>

        </div>
        <div class="questionType">
            <p><img src="../../../assets/images/keguan.png">主观题详情<i>/</i></p>
            <ul>
              <li v-for="(item, index) in navList" :key="index">
                {{item.questionName}}
                <ul>
                  <li v-for="(ur, i) in item.users" :key="i">
                    {{ur.answer}}
                  </li>
                </ul>
              </li>
            </ul>
          </div>        
			</main>
	</div>
</template>

<script>
import { notice, error } from '../../../api/index.js'
export default {
  name: 'lookQuestion',
  data () {
    return {
      perInfo: {},
      contentList: [],
      evalId: '',
      navList: [],
      answerList: '',
      questionName: '',
      number: '',
      evalType: ''
    }
  },
  methods: {
    daochu () {
      var path = document.querySelector('#contextPath').value
      if (this.evalType === '3') {
        window.location.href = `${path}/eval/excelOtherSubjective?evalId=${this.evalId}&userId=${this.perInfo.userId}&userName=${this.perInfo.userName}`
      } else {
        window.location.href = `${path}/eval/excelTeacherSubjecttive?evalId=${this.evalId}&userId=${this.perInfo.userId}&userName=${this.perInfo.userName}&gradeId=${this.perInfo.gradeId}&subjectId=${this.perInfo.subjectId ? this.perInfo.subjectId : ''}`
      }
    },
    // 任课老师、班主任-获取主观题详细信息
    getTeacherSubjectiveDetail () {
      this.$https.get(`/eval/getTeacherSubjectiveDetail?evalId=${this.evalId}&userId=${this.perInfo.userId}&gradeId=${this.perInfo.gradeId}&subjectId=${this.perInfo.subjectId ? this.perInfo.subjectId : ''}`)
      .then(res => {
        if (res.data.code === 1) {
          this.navList = res.data.result
          if (this.navList.length !== 0) {
            if (this.navList.length !== 0) {
              this.answerList = this.navList[0].users.map(item => ({...item, width: item.answer.length * 16 + 'px'}))
              this.questionName = this.navList[0].questionName
              this.number = this.navList[0].number
            }
          }
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 其他测评-获取主观题详细信息
    getOtherSubjectiveDetail () {
      this.$https.get(`/eval/getOtherSubjectiveDetail?evalId=${this.evalId}&userId=${this.perInfo.userId}`)
      .then(res => {
        if (res.data.code === 1) {
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
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.evalType = sessionStorage.evalType
    this.evalId = sessionStorage.evalId
    this.perInfo = JSON.parse(sessionStorage.item)
    this.contentList = JSON.parse(sessionStorage.contentList)
    if (sessionStorage.evalId === '3') {
      this.getOtherSubjectiveDetail()
    } else {
      this.getTeacherSubjectiveDetail()
    }
  }
}
</script>
<style lang="scss">
@import '../../../assets/scss/main.scss';
#look-question {
  margin: $width;
  background: $white;
  border: 1px solid #ECECEC;
  border-radius: 4px;

  header{
    padding: $width / 2;
    height: 62px;
    box-sizing: border-box;
    border-bottom: 2px solid #DDDDDD;

    &>.el-input{
      width: 300px;
      margin-left: $width;
    }

    &>span{
      display: inline-block;
      width: 116px;
      height: 41px;
      font-size: 16px;
      line-height: 42px;
      text-align: center;

      &:first-child{
        color: #fff;
        background: url(../../../assets/images/left-tab-blue.png);
      }
    }

    .button-group{
      float: right;
    }
  }

 	main {
    // padding: $width*1.5 $width;
    // min-height: 600px;
    &>p {
      height: 55px;
      line-height: 55px;
      border-bottom: 1px solid #ddd;
      color: #999;
      font-size: 16px;
      padding-left: 20px;
      margin: 0px;

      &>span {
        color: #666;
      }
    }

    .questionType {
      border-bottom: 1px solid #ddd;
      padding: 20px 20px 40px 20px;

      &>p {

        &>img {
          margin: 0px 10px;
          vertical-align: middle;
        }
        &>i {
          font-size: 10px;
          margin: 0px 5px;
        }
      }

      &>.el-table {
        width: 80%;
        margin: 0 auto;
      }
      .el-table th {
        &:first-child {
          // background-color: #EBF2FC;
        }
        .cell {
            font-weight: normal;
        }
      }
      &>ul {
        width: 80%;
        margin: 0px auto;
        padding: 0px;

        &>li {
          padding-left: 20px;
          background: #EBF2FC;
          list-style-type: none;
          line-height: 50px;
          border-top: 1px solid #ddd;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          color: #666;

          &:last-child {
            border-bottom: 1px solid #ddd;
          }

          &>ul {
            &>li {
              list-style-type: none;
              line-height: 40px;
              background-color: #fff;
              color: #999;
              border-bottom: 1px solid #ddd;
              &:last-child {
                border-bottom: 1px solid #ddd;
              }
            }
          }
        }
      }
    }
	}
}
</style>