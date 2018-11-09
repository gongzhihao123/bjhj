<template>
  <div class="subject-list">
      <div class="head">
          <p>当前位置:课题库</p>
          <el-input  placeholder="请输入关键字搜索" v-model="keyword" @keyup.enter.native="getData">
              <el-button slot="append" icon="el-icon-search" @click="getData" ></el-button>
          </el-input>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        border>
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          label="课题名称"
          align="center"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span @click="lookDetail(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="classificationName"
          label="课题分类"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="leadUserName"
          label="课题负责人"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="单位"
          width="140"
          align="center">
        </el-table-column>
        <el-table-column
          label="立项时间"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.checkedTime | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phasesName"
          label="进展阶段"
          width="120"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.checkState === 1 && scope.row.phasesSort === 5 ? '已结题' : scope.row.phasesName }}
          </template>
        </el-table-column>                          
      </el-table>

      <el-pagination
        v-if="tableData.length !== 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>      
  </div>
</template>

<script>
import service from '../../../../utils/axios'
import { notice } from '../../../../api/index.js'
export default {
  name: 'subject-list',
  data () {
    return {
      keyword: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    }
  },
  methods: {
    lookDetail (row) {
      let bread = {}
      bread.name = '课题库'
      bread.url = this.$route.path
      sessionStorage.bread = JSON.stringify(bread)
      sessionStorage.open = JSON.stringify(row.openState)
      this.$router.push({path: '/subjectDetail/intro'})
      sessionStorage.id = row.id
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    getData () {
      service.get(`frontTopicDetailsController/getTopicDetailsPage?pageNo=${this.currentPage}&pageSize=${this.pageSize}&keyword=${this.keyword}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          res.data.result.list.length > 0 ? this.tableData = res.data.result.list : this.tableData = []
          this.totalCount = res.data.result.totalCount
          this.keyword = ''
        }
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.subject-list{
  padding: 20px;
  background: #fff;
  .head {
    width: 100%;

    &:after {
      @include clearfloat;
    }
    >p {
      float: left;
      line-height: 40px;
    }
    >.el-input {
      float: right;
      width: 260px;
    }
  }
  .el-table {
    margin-top: 20px;
    th>.cell {
      font-weight: bold;
      font-size: 14px;
      color: #333;
    }
    .el-table__header {
      tr {
        background: #f5f7fa;
      }
    }
    .el-table__body {
      tr {
        td {
          &:nth-child(2) {
            .cell {
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
