<template>
    <div id='depeResultInfo'>
    <!--头部-->
      <div class="head">
        <p>测评列表</p>
        <el-button @click="back">返回</el-button>
      </div>
    <!--详情-->
    <div class="naire">
      <h3>{{dept.name}}</h3>
        <ul>
          <li><p>测评时间：</p> {{dept.starttime | dateFormatT('yyyy-MM-dd hh:mm')}} 至 {{dept.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</li>
          <li><p>测评状态：</p>
            <span v-if="nowDate > dept.starttime && nowDate < dept.endtime">测评进行中</span>
            <span v-if="nowDate > dept.endtime">测评结束</span>
          </li>
        </ul>
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
            label="被评价人"
            width="40%"
            prop="userName">            
        </el-table-column>
        <el-table-column
            label="总分"
            width="40%">
            <template scope="scope">
              <span>{{scope.row.totalScore === 0 ? scope.row.totalScore : scope.row.totalScore.toFixed(2)}}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="sort"
            width="10%"
            label="名次">             
        </el-table-column>          
      </el-table>   
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>      
    </div>    
    </div>
</template>

<script>
import { notice, error } from '../../../api/index.js'
export default {
  name: 'depeResultInfo',
  data () {
    return {
      tableData: [],
      loading: false,
      dept: {},
      nowDate: '',
      pageSize: 20,
      currentPage: 1,
      totalCount: 0
    }
  },
  methods: {
    back () {
      this.$router.push({path: '/deptResult/index'})
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getDeptEvalDetailByOther(val)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getDeptEvalDetailByOther()
    },
    getDeptEvalDetailByOther () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`deptEvaluate/getDeptEvalDetailByOther?evalId=${this.dept.id}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.result.list[0].userScoreList
            this.totalCount = res.data.result.totalCount
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
    this.dept = JSON.parse(sessionStorage.dept)
    this.getDeptEvalDetailByOther()
  }

}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';  
#depeResultInfo {
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
   .naire {
    margin-top: 30px;
    position: relative;
     &>h3 {
       width: 100%;
       margin: 0px;
       text-align: center;
       font-weight: normal;
       font-family: '微软雅黑';
       font-size: 20px;
     }
     &>ul {
       width: 97%;
       height: auto;
       border: 1px solid #DDDDDD;
       margin: 28px auto 36px auto;
       background: #F7F7F7;
       padding: 5px 0px 5px 12px;

       li {
         list-style-type: none;
         line-height: 45px;
         height: 45px;
         font-size: 14px;
         &:after {
            display: block;
            content: '';
            height: 0;
            clear: both;
            overflow: hidden;
            visibility: hidden;
         }
         p {
           width: 72px;
           text-align: right;
           float: left;
           margin: 0px;
           padding: 0px;
         }
         span {
           margin: 0 5px;
           float: left;
         }
       }
     }
    &>.el-table {
      border: none;
      padding-bottom: 10%;
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
              &:first-child {
                .cell {
                  padding-left: 40px;
                  text-align: left;
                }
              }
              .cell {
              padding: 0px;
              background: $white;
              font-size: 14px;
              font-family: '微软雅黑';
              font-weight: normal;
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
              text-align: center;
            }
            &:first-child {
              .cell {
                padding-left: 40px;
                text-align: left;
              }
            }
              &:last-child {
              .cell {
              .el-button {
                  &:first-child {
                  background: #1CB9FE;
                  border: 1px solid #1CB9FE;
                  margin-left: 60px;
                  span {
                      color: $white;
                  }
                  }
                  &:last-child {
                  background: $white;
                  border: 1px solid #C4C4C4;
                  span {
                      color: #6F6F6F;
                  }
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