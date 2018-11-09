<template>
    <div id='otherComment'>
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
      <!--本单位-->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        v-if="rowInfo.evalType === 1">
        <el-table-column
          type="index"
          label="序号"
          width="8%">
        </el-table-column>
        <el-table-column
          label="被评价人"
          width="22%">
          <template scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>              
        </el-table-column>    
        <el-table-column
          prop="deptName"
          label="部门/分组"
          width="20%">
        </el-table-column>
        <el-table-column
          prop="modeName"
          width="14%"
          label="测评方式">             
        </el-table-column>
        <el-table-column
          prop="tableName"
            label="所用评价表名称"
            width="18%">
        </el-table-column>            
          <el-table-column label="操作" width="18%" label-class-name="take">
            <template scope="scope">
              <el-button v-if="checkedState === 2 && scope.row.state === 1" class="editbtn" @click="checkInfo(scope.$index, scope.row)">编辑</el-button>
              <el-button v-if="checkedState === 2 && scope.row.state === 0" class="checkbtn" @click="checkInfo(scope.$index, scope.row)">测评</el-button>
              <el-button v-if="checkedState === 3" class="checkbtn" @click="checkInfo(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>             
      </el-table>         
      <!--跨单位-->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        v-if="rowInfo.evalType === 2">
        <el-table-column
          type="index"
          label="序号"
          width="8%">
        </el-table-column>
        <el-table-column
          label="被评价人"
          width="22%">
          <template scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>              
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="单位"
          width="18%">
        </el-table-column>      
        <el-table-column
          prop="deptName"
          label="部门/分组"
          width="18%">
        </el-table-column>
        <el-table-column
          prop="modeName"
          width="14%"
          label="测评方式">             
        </el-table-column>
        <el-table-column
          prop="tableName"
            label="所用评价表名称"
            width="18%">
        </el-table-column>            
          <el-table-column label="操作" width="18%" label-class-name="take">
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
  name: 'otherComment',
  data () {
    return {
      member: true,
      loading: false,
      list: false,
      tableData: [],
      checkedState: 0,
      rowInfo: {}
    }
  },
  methods: {
    back () {
      this.$router.push({path: '/myComment/index'})
    },
    memberClick () {
      if (this.member) {
        return
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
      this.$router.push({path: '/myComment/groupInfo'})
    },
    checkInfo (index, row) {
      sessionStorage.rowMes = JSON.stringify(row)
      this.$router.push({path: '/myComment/CheckInfo', query: {groupstate: JSON.stringify(1)}})
    },
    getEvalUserListToOther () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`myEvaluate/getEvalUserListToOther?evalId=${this.rowInfo.id}`)
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
    this.checkedState = JSON.parse(sessionStorage.checkedState)
    this.rowInfo = JSON.parse(sessionStorage.rowInfo)
    this.getEvalUserListToOther()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';   
#otherComment {
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
    padding-bottom: 20px;

    &:before {
      display: none;
    }
    
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
              text-align: center;
            }
          }
          .cell {
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
        .take{
            .cell {
              text-align: center;
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
          &:nth-child(2) {
            .cell {
              &:hover {
                color: #000;
                cursor: auto;
              }
            }
          }
          &:nth-child(1) {
            .cell {
              text-align: center;
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