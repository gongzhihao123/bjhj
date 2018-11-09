<template>
  <div class="subject-declaration">
      <div class="head">
          <span>当前位置：课题库</span>
          <p>
            <img src="../../../../assets/images/project-guide.png" alt="">
          课题指南</p>
          <!-- <el-input  placeholder="请输入关键字搜索" v-model="keyword">
              <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input> -->
      </div>
      <div class="body">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="课题指南名称"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
            <template slot-scope="scope">
                <span @click="look(scope.row)">{{scope.row.name}}</span>
            </template>          
          </el-table-column>
          <el-table-column
            label="发布人"
            width="110"
            align='center'
            show-overflow-tooltip
            label-class-name="head"
            prop="createdUserName">
          </el-table-column>
          <el-table-column
            label="发布时间"
            width="110"
            show-overflow-tooltip
            label-class-name="head"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.createdTime | dateFormat('yyyy-MM-dd') }}
            </template>
          </el-table-column>
          <el-table-column
            label="截止时间"
            width="110"
            show-overflow-tooltip
            label-class-name="head"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.stopTime | dateFormat('yyyy-MM-dd') }}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            width="110"
            show-overflow-tooltip
            label-class-name="head"
            align="center">
            <template slot-scope="scope">
              <span :style="{color: scope.row.usedFlag ? '#87D57C' : '#65A3F3'}">
                {{ scope.row.usedFlag ? '已申报' : '未申报'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="110"
            show-overflow-tooltip
            label-class-name="head"
            align="center">
            <template slot-scope="scope">
              <el-button @click="declarationButton(scope.row.id)" :disabled="scope.row.usedFlag || scope.row.stopTime < new Date().getTime()" type="primary">申报</el-button>
            </template>
          </el-table-column>                          
        </el-table>
      </div>
      

      <el-pagination
        v-if="totalCount !== 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>  
  </div>
</template>

<script>
import server from '../../../../utils/axios'
import { notice } from '../../../../api/index'
export default {
  name: 'subject-declaration',
  data () {
    return {
      keyword: '',
      pageSize: 10,
      pageNo: 1,
      totalCount: 0,
      tableData: []
    }
  },
  methods: {
    // 查看指南详情
    look (val) {
      let para = {
        stopTime: val.stopTime,
        id: val.id,
        checkState: val.usedFlag
      }
      this.$router.push({ path: '/subjectLibrary/guideDetail', query: {para: JSON.stringify(para)} })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getGuideList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getGuideList()
    },
    // 获取指南列表
    getGuideList () {
      server.get(`/frontTopicDeclareController/getGuideList?pageNo=${this.pageNo}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    declarationButton (value) {
      sessionStorage.SUBJECT_ID = ''
      sessionStorage.IS_CHANGE = '0'
      sessionStorage.BACK_PATH = '/subjectManager/myDeclaration'
      this.$router.push({ path: '/declarationStep/index', query: {id: value} })
    }
  },
  created () {
    this.getGuideList()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.subject-declaration{
  
  .head {
    width: 100%;

    &:after {
      @include clearfloat;
    }
    >p {
      line-height: 60px;
      background: #F8F9FC;
      border-bottom: 1px solid #EBEEF7;
      padding-left: 20px;
      margin-top: 20px;

      img {
        vertical-align: middle;
        margin-right: 5px;
      }
    }
    // >.el-input {
    //   float: right;
    //   width: 260px;
    // }
  }

  .body {
    padding: 20px;
    background: #fff;
    .el-table {
      margin-top: 0px;
      .el-table__body, .el-table__footer, .el-table__header {
        width: 100% !important;
      }
      th>.cell {
        font-weight: bold;
        font-size: 14px;
        color: #333;
      }
      .el-table__body {
        tr {
          td {
            &:nth-child(1) {
              .cell {
                &:hover {
                  span{
                    cursor: pointer;
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
    margin-top: 20px;
    text-align: right;
  }
}
</style>
