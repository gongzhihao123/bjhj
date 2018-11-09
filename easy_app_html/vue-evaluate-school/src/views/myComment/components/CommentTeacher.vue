<template>
    <div id='CommentTeacher'>
      <!--头部-->
      <div class="head">
        <p>被评价人列表</p>       
        <el-button @click="back">返回</el-button>
      </div> 
      <!--表格-->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          width="25%">
        </el-table-column>
        <el-table-column
          label="被测评人"
          width="25%">
          <template scope="scope">
            <span @click="CommentName(scope.$index, scope.row)">{{scope.row.teacherName}}</span>
          </template>              
        </el-table-column>
        <el-table-column
          prop="tableName"
            label="所用评测表名称"
            width="25%">
        </el-table-column>            
          <el-table-column label="操作" width="25%">
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
  name: 'CommentTeacher',
  data () {
    return {
      rowInfo: {},
      member: true,
      list: false,
      tableData: [],
      loading: false
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
    CommentName (index, row) {
    //   this.$router.push({path: '/'})
    },
    back () {
      this.$router.push({path: '/myComment/index'})
    },
    checkInfo (index, row) {
      sessionStorage.rowMes = JSON.stringify(row)
      this.$router.push({path: '/myComment/CheckInfo'})
    },
    getEvalUserListToTeacher () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`myEvaluate/getEvalUserListToTeacher?evalId=${this.rowInfo.id}`)
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
    this.getEvalUserListToTeacher()
  }

}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';   
#CommentTeacher {
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
          &:nth-child(1) {
            .cell {
                text-align: left;
                padding-left: 20px;
            }
          }
          .cell {
            padding: 0px;
            background: $white;
            font-size: 14px;
            font-family: '微软雅黑';
            font-weight: normal;
          }
          &:nth-child(4) {
            .cell {
              text-align: center;
            }
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
            text-align: left;
            padding-left: 20px;
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
            .editbtn {
              padding: 10px 10px;
            }
            }
          }
        }
      }
    }                                           
  }   
}
</style>