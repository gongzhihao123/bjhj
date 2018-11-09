<template>
  <div id="checkAll">
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
      <!--表格-->
      <!--班主任/任课教师-->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        v-if="rowResult.evalType !== 3">
        <el-table-column
          type="index"
          label="序号"
          width="10%">
          <template scope="scope">
            <span :class="{ active: scope.row.teacherId === user.id }">{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
          </template>          
        </el-table-column>
        <el-table-column
          label="被测评人"
          width="18%">
          <template scope="scope">
            <span :class="{ active: scope.row.teacherId === user.id }">{{scope.row.teacherName}}</span>
          </template>          
        </el-table-column>
        <el-table-column
          width="18%"
          label="年级">
          <template scope="scope">
            <span :class="{ active: scope.row.teacherId === user.id }">{{scope.row.gradeName}}</span>
          </template>                     
        </el-table-column>        
        <el-table-column
          width="18%"
          label="学科"
          v-if="rowResult.evalType === 1">                     
          <template scope="scope">
            <span :class="{ active: scope.row.teacherId === user.id }">{{scope.row.subjectName}}</span>
          </template>           
        </el-table-column>    
        <el-table-column
          prop="totalScore"
          width="18%"
          label="总分">
          <template scope="scope">
            <span :class="{ active: scope.row.teacherId === user.id }">{{scope.row.totalScore.toFixed(1)}}</span>
          </template>          
        </el-table-column>
        <el-table-column
          width="18%"
          label="名次">
          <template scope="scope">
            <span :class="{ active: scope.row.teacherId === user.id }">{{scope.row.sort}}</span>
          </template>          
        </el-table-column>
      </el-table> 
      <!--其他测评-->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        v-if="rowResult.evalType === 3">
        <el-table-column
          type="index"
          label="序号"
          width="10%">
          <template scope="scope">
            <span :class="{ active: scope.row.userId === user.id }">{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
          </template>          
        </el-table-column>
        <el-table-column
          label="被测评人"
          width="15%">
          <template scope="scope">
            <span :class="{ active: scope.row.userId === user.id }">{{scope.row.userName}}</span>
          </template>          
        </el-table-column>
        <el-table-column
          width="15%"
          label="年级"
          v-if="rowResult.evalType !== 3"> 
          <template scope="scope">
            <span :class="{ active: scope.row.userId === user.id }">{{scope.row.gradeName}}</span>
          </template>                     
        </el-table-column>
        <el-table-column
          width="15%"
          label="部门/职务"
          v-if="rowResult.evalType === 3">
          <template scope="scope">
            <span :class="{ active: scope.row.userId === user.id }">{{scope.row.deptName}}</span>
          </template>                    
        </el-table-column>     
        <el-table-column
          width="10%"
          label="总分">
          <template scope="scope">
            <span :class="{ active: scope.row.userId === user.id }">{{scope.row.totalScore.toFixed(1)}}</span>  
          </template>                        
        </el-table-column>  
        <el-table-column
          width="10%"
          label="名次">
          <template scope="scope">
            <span :class="{ active: scope.row.userId === user.id }">{{scope.row.sort}}</span>
          </template>          
        </el-table-column>
        <el-table-column :label="mode.modeName" width="15%" v-for="(mode, i) in modeList" :key="i">
            <template scope="scope">
              <span :class="{ active: scope.row.userId === user.id }">{{ scope.row.scoreList[i].score }}</span>
            </template>
        </el-table-column>                       
      </el-table>       
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>                   
    </div>        
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notice, error } from '../../../api/index.js'
export default {
  name: 'checkAll',
  data () {
    return {
      member: true,
      list: false,
      rowResult: {},
      currentPage: 1,
      loading: false,
      tableData: [],
      totalCount: 0,
      pageSize: 20,
      modeList: [],
      nowDate: ''
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
    getAllEvalResultByOther () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`myEvaluate/getAllEvalResultByOther?evalId=${this.rowResult.id}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.result.list[0].userScoreList
            this.modeList = res.data.result.list[0].modeList
            this.totalCount = res.data.result.totalCount
            this.tableData.forEach(item => {
              if (item.scoreList.length !== this.modeList.length) {
                let num = item.scoreList.length
                for (let i = 0; i < Number(this.modeList.length - num); i++) {
                  item.scoreList.push({ score: '-' })
                }
              }
            })
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
    },
    getAllEvalResultByTeacher () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`myEvaluate/getAllEvalResultByTeacher?evalId=${this.rowResult.id}&pageNo=${this.currentPage}&pageSize=20`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.result.list
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
    },
    back () {
      this.$router.push({path: '/myAssessment/index'})
    },
    handleSizeChange (val) {
      this.pageSize = val
      if (this.rowResult.evalType === 3) {
        this.getAllEvalResultByOther()
      } else {
        this.getAllEvalResultByTeacher()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if (this.rowResult.evalType === 3) {
        this.getAllEvalResultByOther()
      } else {
        this.getAllEvalResultByTeacher()
      }
    }
  },
  created () {
    this.rowResult = JSON.parse(sessionStorage.rowResult)
    let d = new Date()
    this.nowDate = d.getTime()
    if (this.rowResult.evalType === 3) {
      this.getAllEvalResultByOther()
    } else {
      this.getAllEvalResultByTeacher()
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss'; 
#checkAll {

    .active {
      font-weight: bold !important;
    }
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
    width: 100%;
    padding: 0px;
    position: relative;
    &>h3 {
      font-weight: normal;
      text-align: center;
    }
    &>ul {
      width: 90%;
      margin: 0 auto;
      background: #f1f1f1;
      border: 1px solid #ddd;
      padding: 0px 0px 0px 5px;
      margin-bottom: 20px;
      li {
        line-height: 20px;
        list-style-type: none;
        padding: 10px 0px;
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
              text-align: left;
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
          }
        }
      }                                      
    } 
    &>.el-pagination {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }    
  }    
}
</style>
