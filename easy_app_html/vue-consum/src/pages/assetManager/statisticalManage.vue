<template>
  <div class='statistical-manage'>
    <!-- 头部搜索 -->
    <header>
      <el-input v-model.trim="searchName" :maxlength="20" placeholder="输入名称"></el-input>

      <el-input v-model.trim="searchUserName" :maxlength="20" placeholder="输入领用人"></el-input>

      <el-input v-model.trim="searchName" :maxlength="20" placeholder="输入资产名陈"></el-input>

      <el-input v-model.trim="searchUserName" :maxlength="20" placeholder="输入资产类别"></el-input>

      <el-date-picker
        v-model="searchDateValue"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-button size="small" type="success" @click="statistics">搜索</el-button>
    </header>

    <main>
       <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="userName"
            label-class-name="head"
            show-overflow-tooltip
            label="领用人">
          </el-table-column>
          <el-table-column
            prop="userDeptName"
            label-class-name="head"
            show-overflow-tooltip
            label="部门">
          </el-table-column>
          <el-table-column
            prop="name"
            label="资产名称"
            label-class-name="head"
            show-overflow-tooltip
            width="180">
          </el-table-column>
          <el-table-column
            prop="dataType"
            label-class-name="head"
            show-overflow-tooltip
            label="资产类别"
            width='200'>
          </el-table-column>
          <el-table-column
            label="数量"
            label-class-name="head"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{ Math.abs(Number(scope.row.number)) }}
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
    handleCurrentChange (val) {
      this.pageNo = val
      this.statistics()
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
