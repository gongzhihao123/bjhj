<template>
    <div id='deptResult'>
    <!--头部-->
      <div class="head">
        <p>测评列表</p>
      </div>
     <!--问卷-->
      <div class="naire">
        <!--<h3>{{naire.title}}</h3>-->
         <!--表格-->
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
        label="测评名称"
        width="20%"
        prop="name">
      </el-table-column>
      </el-table-column>
      <el-table-column
        width="20%"
        label="测评开始时间">
        <template scope="scope">
          <span>{{scope.row.starttime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>  
        </template>          
      </el-table-column>
      <el-table-column
        width="20%"
        label="测评结束时间">
        <template scope="scope">
          <span>{{scope.row.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
        </template>             
      </el-table-column>  
      <el-table-column
        width="15%"
        label="测评状态">
        <template scope="scope">
          <img src="../../assets/images/green-point.png" v-if="nowDate > scope.row.starttime && nowDate < scope.row.endtime">&nbsp;&nbsp;<span v-if="nowDate > scope.row.starttime && nowDate < scope.row.endtime">进行中</span>
          <img src="../../assets/images/red-point.png" v-if="nowDate > scope.row.endtime">&nbsp;&nbsp;<span v-if="nowDate > scope.row.endtime">已结束</span>
          <span>{{scope.row.state}}</span>
        </template>
      </el-table-column>          
        <el-table-column label="操作" width="12%">
          <template scope="scope">
            <el-button  class="check" @click="goInfo(scope.$index, scope.row)">查看结果</el-button>
          </template>
        </el-table-column>             
    </el-table>   
      </div>         
    </div>
</template>

<script>
import { notice, error } from '../../api/index.js'
export default {
  name: 'deptResult',
  data () {
    return {
      member: true,
      list: false,
      nowDate: '',
      tableData: [],
      loading: false
    }
  },
  methods: {
    checkPass () {
      this.dialogVisible = true
    },
    checkReturn () {
      this.reasonVisible = true
      // this.$router.push({path: '/assessmentCheck/index'})
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
    back () {
      this.$router.push({path: '/assessmentCheck/index'})
    },
    goInfo (index, row) {
      sessionStorage.dept = JSON.stringify(row)
      this.$router.push({path: '/deptResult/deptResultInfo'})
    },
    getDeptEvalList () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`deptEvaluate/getDeptEvalList`)
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
    let d = new Date()
    this.nowDate = d.getTime()
    this.getDeptEvalList()
  }

}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';
#deptResult {
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
   }
   .naire {
    margin-top: 30px;
    position: relative;
     &>h3 {
       width: 100%;
       margin: 0px;
       text-align: center;
       font-weight: normal;
       font-family: '微软雅黑';
       font-size: 16px;
     }
    .el-table {
      padding-bottom: 20px;
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
        }
      }
      .el-table__body {
        tr {
          height: 50px;
          line-height: 50px;
          td {
            .cell {
              text-align: left;
              padding: 0px;
            }
            &:nth-child(1) {
              .cell {
                text-align: center;
              }
            }
            &:nth-child(6) {
              .cell {
                img {
                  padding: 0px 10px 0px 0px;
                }
              }
            }
            &:last-child {
              .cell {
                // text-align: center;
              .look {
                padding: 10px 30px;
                background: #13CE67;
                border: 1px solid #13CE67;

                span {
                  color: $white;
                }
              }
              .check{
                background: #1CB9FE;
                border: 1px solid #1CB9FE;
                span {
                  color: $white;
                }
              }            
              }
            }
          }
        }
      }                                      
    }  
    .el-pagination {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }   
 }       
}
</style>