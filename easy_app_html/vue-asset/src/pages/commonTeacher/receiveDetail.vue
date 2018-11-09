<template>
  <div class='receive-detail'>
    <!-- 头部搜索 -->
    <header>
      <el-input v-model.trim="searchName" :maxlength="20" placeholder="输入资产名称"></el-input>

      <el-input v-model.trim="searchCode" :maxlength="20" placeholder="输入资产编号"></el-input>

      <el-date-picker
        v-model="searchDateValue"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-select v-model="optionValue" placeholder="请选择类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button size="small" type="success" @click="getList">搜索</el-button>
      <el-button size="small" type="success" @click="look">查看我的领用</el-button>
    </header>

    <main>
       <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="code"
            label="资产编号"
            label-class-name="head"
            show-overflow-tooltip
            width="240">
          </el-table-column>
          <el-table-column
            prop="name"
            label="资产名称"
            label-class-name="head"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="userName"
            label-class-name="head"
            show-overflow-tooltip
            label="人员">
          </el-table-column>
          <el-table-column
            prop="userDeptName"
            label-class-name="head"
            show-overflow-tooltip
            label="所属部门">
          </el-table-column>
          <el-table-column
            label-class-name="head"
            show-overflow-tooltip
            width="180"
            label="日期">
            <template slot-scope="scope">
              {{ scope.row.date | dateFormat('yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            label-class-name="head"
            show-overflow-tooltip
            label="备注信息">
          </el-table-column>
          <el-table-column
            label-class-name="head"
            show-overflow-tooltip
            label="操作类型">
            <template slot-scope="scope">
              <span v-if="scope.row.operation === 1">入库</span>
              <span v-if="scope.row.operation === 2">报废</span>
              <span v-if="scope.row.operation === 3">领用</span>
              <span v-if="scope.row.operation === 4">归还</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-pagination
        v-if="totalCount !== 0"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-size="10"
        :total="totalCount">
      </el-pagination>
    </main>

    <el-dialog
      title="查看我的领用"
      :visible.sync="dialogVisible"
      width="650x">
        <el-table
          :data="dialogTableData"
          style="width: 100%">
          <el-table-column
            prop="code"
            label-class-name="head"
            width="240"
            show-overflow-tooltip
            label="资产编号">
          </el-table-column>
          <el-table-column
            prop="assetName"
            label-class-name="head"
            show-overflow-tooltip
            label="资产名称">
          </el-table-column>
          <el-table-column
            prop="reason"
            show-overflow-tooltip
            label-class-name="head"
            label="备注">
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="dialogTotalCount !== 0"
          layout="prev, pager, next"
          @current-change="dialogHandleCurrentChange"
          :current-page.sync="dialogPageNo"
          :page-size="10"
          :total="dialogTotalCount">
        </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormatT } from '@/filters/index'
export default {
  name: 'receive-detail',
  data () {
    return {
      dialogVisible: false,
      pageNo: 1,
      tableData: [],
      dialogTableData: [],
      searchName: '',
      searchDateValue: '',
      searchCode: '',
      optionValue: '',
      options: [
        { label: '全部', value: '' },
        { label: '入库', value: 1 },
        { label: '报废', value: 2 },
        { label: '领用', value: 3 },
        { label: '归还', value: 4 }
      ],
      totalCount: 0,
      dialogPageNo: 1,
      dialogTotalCount: 0
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    async dialogHandleCurrentChange (val) {
      this.dialogPageNo = val
      let data = await this.$store.dispatch('teacherBorrow', {
        pageSize: 10,
        pageNo: this.dialogPageNo
      })
      this.dialogTableData = data.list
      this.dialogTotalCount = data.totalCount
    },
    async look () {
      this.dialogVisible = true
      let data = await this.$store.dispatch('teacherBorrow', {
        pageSize: 10,
        pageNo: 1
      })
      this.dialogTableData = data.list
      this.dialogTotalCount = data.totalCount
    },
    async getList () {
      const data = await this.$store.dispatch('teacher', {
        name: this.searchName,
        code: this.searchCode,
        startDate: this.searchDateValue ? dateFormatT(this.searchDateValue[0].getTime(), 'yyyy-MM-dd hh:mm:ss') : null,
        endDate: this.searchDateValue ? dateFormatT(this.searchDateValue[1].getTime(), 'yyyy-MM-dd') + ' 23:59:59' : null,
        operation: this.optionValue,
        pageNo: this.pageNo,
        pageSize: 10
      })
      this.tableData = data.list
      this.totalCount = data.totalCount
    }
  },
  watch: {
  },
  async created () {
    this.getList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.receive-detail {
  header {
    .el-input {
      width: 150px;
    }
  }

  main {
    margin-top: 20px;
    padding: 20px 0;
    background: #fff;
    padding: 20px;
    .el-table {
      margin-top: 0;
    }
  }

  .el-dialog {
    .el-dialog__body {
      padding-top: 0;

      .el-table {
        th {
          &:nth-child(2){
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
