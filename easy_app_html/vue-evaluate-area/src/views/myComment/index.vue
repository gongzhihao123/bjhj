<template>
  <div id="myComment">
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
        width="6%">
      </el-table-column>
      <el-table-column
        label="测评名称"
        width="25%">
        <template scope="scope">
        <el-popover
          placement="top-start"
          width="250"
          popper-class="popover-box"
          trigger="hover"
          :content="scope.row.name"
          >
        <span v-if="scope.row.name.length >= 20" @click="CheckName(scope.$index, scope.row)" slot="reference">{{scope.row.name.slice(0, 20) + '...'}}</span>                  
        </el-popover>                
        <span v-if="scope.row.name.length < 20" @click="CheckName(scope.$index, scope.row)" >{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="实名匿名"
        width="15%">
        <template scope="scope">
          <span v-if="scope.row.realState === 1">实名</span>
          <span v-if="scope.row.realState === 0">匿名</span>
        </template>        
      </el-table-column>
      <el-table-column
        width="15%"
        label="开始时间">
        <template scope="scope">
          <span>{{scope.row.starttime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
        </template>                     
      </el-table-column>
      <el-table-column
        width="15%"
        label="结束时间"> 
        <template scope="scope">
          <span>{{scope.row.endtime | dateFormatT('yyyy-MM-dd hh:mm')}}</span>
        </template>                    
      </el-table-column>  
      <el-table-column
        width="13%"
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
            <el-button v-if="(nowDate > scope.row.endtime) || (nowDate > scope.row.starttime && nowDate  < scope.row.endtime && scope.row.state === 1)" class="look" @click="CheckName(scope.$index, scope.row)">查看</el-button>
            <el-button v-if="(nowDate > scope.row.starttime && nowDate < scope.row.endtime && scope.row.state === 0)" class="check" @click="CheckName(scope.$index, scope.row)">开始测评</el-button>
          </template>
        </el-table-column>             
    </el-table>        
  </div>
</template>

<script>
import { notice } from '../../api/index.js'
export default {
  name: 'myComment',
  data () {
    return {
      member: true,
      loading: false,
      list: false,
      nowDate: 0,
      tableData: [],
      checkedState: 0
    }
  },
  methods: {
    CheckName (index, row) {
      sessionStorage.rowInfo = JSON.stringify(row)
      if (this.nowDate < row.starttime) {
        // 未开始测评状态值
        this.checkedState = 1
      } else if (this.nowDate > row.starttime && this.nowDate < row.endtime) {
        // 进行中测评状态值
        this.checkedState = 2
      } else if (this.nowDate > row.endtime) {
        // 已结束
        this.checkedState = 3
      }
      sessionStorage.checkedState = JSON.stringify(this.checkedState)
      this.$router.push({path: '/myComment/otherComment'})
    },
    getEvalList () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`myEvaluate/getEvalList`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.result.evalList
            this.nowDate = res.data.result.nowDate
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
    this.getEvalList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss'; 
  #myComment {
    .head {
     width: 100%;
     height: 63px;
     border-bottom: 2px solid #DDDDDD;

     &>p {
      padding-left: 23px;
      line-height: 63px;
      margin: 0px;
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
          &:nth-child(1), &:nth-child(7) {
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
          &:nth-child(2) {
            .cell {
              &:hover {
                color: #1CB9FE;
                cursor: pointer;
              }
            }
          }
          &:last-child {
            .cell {
              text-align: center;
            .look {
              padding: 10px 30px;
              background: #1CB9FE;
              border: 1px solid #1CB9FE;              
              span {
                color: $white;
              }
            }
            .check{
              background: #13CE67;
              border: 1px solid #13CE67;              
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
