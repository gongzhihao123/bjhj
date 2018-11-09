<template>
  <div class='statistical-manage'>
    <!-- 头部搜索 -->
    <header>
      <el-input v-model.trim="searchName" :maxlength="20" placeholder="输入名称"></el-input>

      <el-input v-model.trim="searchUserName" :maxlength="20" placeholder="输入领用人"></el-input>

      <el-date-picker
        v-model="searchDateValue"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-button size="small" type="success" @click="statistics">搜索</el-button>
      <el-button type="primary"  size='small' @click="detailPrint">导出</el-button>
    </header>

    <main>
       <template>
        <el-table
          :data="tableData"
          ref="multipleTable"
          id="table-content"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          style="width: 100%">
            <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="userName"
            show-overflow-tooltip
            label="领用人">
          </el-table-column>
          <el-table-column
            prop="userDeptName"
            show-overflow-tooltip
            label="所属组织">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            show-overflow-tooltip
            width="240">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="数量">
            <template slot-scope="scope">
              {{ Math.abs(Number(scope.row.number)) }}
            </template>
          </el-table-column>
           <el-table-column
            prop="name"
            label="单位"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="日期">
            <template slot-scope="scope">
              {{ scope.row.date | dateFormat('yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-pagination
        v-if="totalCount !== 0"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-size="20"
        :total="totalCount">
      </el-pagination>
    </main>
  </div>
</template>

<script>
import { dateFormatT } from '@/filters/index'
export default {
  name: 'statistical-manage',
  data () {
    return {
      pageNo: 1,
      tableData: [],
      searchName: '',
      searchDateValue: '',
      searchUserName: '',
      optionValue: '',
      options: [
        { label: '全部', value: '' },
        { label: '入库', value: 1 },
        { label: '报废', value: 2 },
        { label: '领用', value: 3 }
      ],
      totalCount: 0
    }
  },
  methods: {
    // 获取表格信息
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    async detailPrint () {
      console.log('qwe', this.tableData)
    },
    // 获取资产列表
    async statistics () {
      const data = await this.$store.dispatch('statistics', {
        userName: this.searchUserName,
        consumName: this.searchName,
        startDate: this.searchDateValue ? dateFormatT(this.searchDateValue[0].getTime(), 'yyyy-MM-dd hh:mm:ss') : null,
        endDate: this.searchDateValue ? dateFormatT(this.searchDateValue[1].getTime(), 'yyyy-MM-dd hh:mm:ss') : null,
        pageNo: this.pageNo,
        pageSize: 20
      })
      this.tableData = data.list
      this.totalCount = data.totalCount
    }
  },
  watch: {
  },
  async created () {
    await this.statistics()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.statistical-manage {
  header {
    .el-input {
      width: 150px;
    }
  }

  main {
    margin-top: 20px;
    padding: 20px;
    background: #fff;
    .el-table {
      margin-top: 0;
      th {
        &:nth-child(8){
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
}
</style>
