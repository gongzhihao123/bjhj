<template>
    <div id='groupInfo'>
      <!--头部-->
      <div class="head">
        <p>测评列表&nbsp;>&nbsp;{{rowInfo.name}}</p>
        <ul class="list">
          <li :class="{active: member}" @click="memberClick">
            <img src="../../../assets/images/member-active.png" v-if="member === true">
            <img src="../../../assets/images/member.png" v-if="member === false">
            人员列表
          </li>
          <li :class="{active:list}" @click="listClick">
            <img src="../../../assets/images/comment.png" v-if="list === false">
            <img src="../../../assets/images/comment-active.png" v-if="list === true">
            评价列表
          </li>
        </ul>
        <el-button @click="back">返回</el-button>        
      </div> 
      <!--审核未通过表格-->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          width="10%">
        </el-table-column>
        <el-table-column
          prop="tableName"
            label="所用评价表名称"
            width="80%">
        </el-table-column>            
          <el-table-column label="操作" width="10%">
            <template scope="scope">
              <el-button v-if="checkedState === 2 && scope.row.state === 1" class="editbtn" @click="checkInfo(scope.$index, scope.row)">编辑</el-button>
              <el-button v-if="checkedState === 2 && scope.row.state === 0" class="checkbtn" @click="checkInfo(scope.$index, scope.row)">测评</el-button>
              <el-button v-if="checkedState === 3" class="checkbtn" @click="checkInfo(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>             
      </el-table>             
    </div>
</template>

<script>
import { notice, error } from '../../../api/index.js'
export default {
  name: 'groupInfo',
  data () {
    return {
      member: false,
      loading: false,
      list: true,
      tableData: [],
      rowInfo: {},
      checkedState: 0
    }
  },
  methods: {
    back () {
      this.$router.push({path: '/myComment/index'})
    },
    memberClick () {
      if (this.member) {
        this.member = false
        this.list = true
      } else {
        this.member = true
        this.list = false
      }
      if (this.rowInfo.evalType === 3) {
        this.$router.push({path: '/myComment/otherComment'})
      } else {
        this.$router.push({path: '/myComment/CommentName'})
      }
    },
    listClick () {
      if (this.list) {
        return
      } else {
        this.list = true
        this.member = false
      }
      this.$router.push({path: '/myComment/groupInfo'})
    },
    CommentName (index, row) {
      // this.$router.push({path: '/myComment/CommentName'})
      this.$router.push({path: '/myComment/CommentTeacher'})
    },
    checkInfo (index, row) {
      sessionStorage.rowMes = JSON.stringify(row)
      if (this.member) {
        this.$router.push({path: '/myComment/CheckInfo', query: {groupstate: JSON.stringify(2)}})
      } else if (this.list) {
        this.$router.push({path: '/myComment/groupComment', query: {groupstate: JSON.stringify(2)}})
      }
    },
    groupInfo (index, row) {
      this.$router.push({path: '/myComment/groupComment', query: {title: row.name}})
    },
    getEvalTableListToOther () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`myEvaluate/getEvalTableListToOther?evalId=${this.rowInfo.id}`)
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
        .finally(res => {
          this.loading = false
        })
      }, 500)
    }
  },
  created () {
    this.rowInfo = JSON.parse(sessionStorage.rowInfo)
    this.checkedState = JSON.parse(sessionStorage.checkedState)
    this.getEvalTableListToOther()
  }

}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';   
#groupInfo {
    padding-bottom: 20px;
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
     .list {
       position: absolute;
       right: 10%;
       top: 0px;
       margin: 0px;
       padding: 0px;

       li {
         list-style-type: none;
         float: left;
         height: 63px;
         line-height: 63px;
         padding: 0px 20px;

         &:hover {
           cursor: pointer;;
         }
         img {
            vertical-align: middle;
         }
       }
       .active {
        color: #1CB9FE; 
        border-bottom: 2px solid #1CB9FE;
       }
     }
     &>.el-button {
       position: absolute;
       top: 10px;
       right: 15px;
     }     
   }
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
          .cell {
            text-align: center;
            &:first-child {
              padding: 0px;
            }
            padding: 0px;
            background: $white;
            padding-left: 40px;
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
            }
          }
          &:nth-child(2) {
            .cell {
              text-align: center;
              &:hover {
                color: #000;
                cursor: auto;
              }
            }
          }                   
          &:last-child {
            .cell {
              text-align: center;
            .el-button {
                background: #1CB9FE;
                border: 1px solid #1CB9FE;
                padding: 10px 25px;
                span {
                  color: $white;
                  margin: 0px;
                }
            }
            .checkbtn {
              background: #13CE67;
              border: 1px solid #13CE67;
            }
            }
          }
        }
      }
    }                                           
  }   
}
</style>