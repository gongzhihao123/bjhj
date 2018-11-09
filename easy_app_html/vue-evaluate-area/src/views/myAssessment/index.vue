<template>
  <div id="myAssessment">
    <!--头部-->
    <div class="head">
      <p>测评列表</p>
    </div>
     <!--表格-->
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading">
      <el-table-column
        type="index"
        label="序号"
        width="8%">
      </el-table-column>
      <el-table-column
        label="测评名称"
        width="25%">
        <template scope="scope">
          <span @click="CheckName(scope.$index, scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="18%"
        label="开始时间"> 
        <template scope="scope">
          <span>{{scope.row.starttime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
        </template>            
      </el-table-column>
      <el-table-column
        width="18%"
        label="结束时间"> 
        <template scope="scope">
          <span>{{scope.row.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
        </template>                     
      </el-table-column>  
      <el-table-column
        width="16%"
        label="测评状态">
        <template scope="scope">
          <img src="../../assets/images/green-point.png" v-if="nowDate > scope.row.starttime && nowDate  < scope.row.endtime">
          <span v-if="nowDate > scope.row.starttime && nowDate  < scope.row.endtime">进行中</span>
          <img src="../../assets/images/red-point.png" v-if="nowDate > scope.row.endtime">
          <span v-if="nowDate > scope.row.endtime">已结束</span> 
        </template>
      </el-table-column>          
        <el-table-column label="操作" width="15%">
          <template scope="scope">
            <el-button v-if="scope.row.viewState === 1 || scope.row.viewState === 2" class="check" @click="CheckResult(scope.$index, scope.row)">查看测评结果</el-button>
            <el-button v-if="scope.row.viewState === 3" :disabled="true">查看测评结果</el-button>
          </template>
        </el-table-column>             
    </el-table>           
  </div>
</template>

<script>
import { notice } from '../../api/index.js'
export default {
  name: 'myAssessment',
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
    CheckResult (index, row) {
      sessionStorage.rowResult = JSON.stringify(row)
      if (row.viewState === 2) {
        // 查看我的
        this.$router.push({path: '/myAssessment/checkOther'})
      } else if (row.viewState === 1) {
        // 查看所有人
        this.$router.push({path: '/myAssessment/checkAll'})
      }
    },
    getMyEvalList () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`myEvaluate/getMyEvalList`)
        .then(res => {
          if (res.data.code === 1) {
            console.log(res.data.result)
            this.tableData = res.data.result
          } else if (res.data.code === -2) {
            // error(this)
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
    this.getMyEvalList()
    var d = new Date()
    this.nowDate = d.getTime()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss'; 
#myAssessment {
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
       right: 0px;
       top: 0px;
       margin: 0px;
       padding: 0px;

       li {
         list-style-type: none;
         float: left;
         height: 63px;
         line-height: 63px;
         padding: 0px 26px;
         border-left: 1px solid #DDDDDD;

         &:hover {
           cursor: pointer;
         }
         img {
            vertical-align: middle;
         }
       }
       .active {
         background: #F2F2F2;
         color: #1CB9FE; 
       }
     }
   }
  .el-table {
    border: none;
    padding-bottom: 20px;

    &:before{
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
          &:nth-child(1), &:nth-child(6) {
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
              text-align: center;
            // .look {
            //   padding: 10px 30px;
            //   background: #13CE67;
            //   border: 1px solid #13CE67;

            //   span {
            //     color: $white;
            //   }
            // }
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
}
</style>
