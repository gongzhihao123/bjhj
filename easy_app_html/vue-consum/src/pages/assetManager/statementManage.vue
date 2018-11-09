<template>
  <div class='statement-manage'>
    <!-- 头部搜索 -->
    <header>
      <el-input v-model.trim="searchName" :maxlength="20" placeholder="输入物品名称"></el-input>

      <el-input v-model.trim="searchUserName" :maxlength="20" placeholder="输入人员"></el-input>

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
    </header>

    <main>
       <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="code"
            label="物品编号"
            label-class-name="head"
            show-overflow-tooltip
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="物品名称"
            label-class-name="head"
            show-overflow-tooltip
            width="180">
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
            label="所属组织">
          </el-table-column>
          <el-table-column
            label-class-name="head"
            show-overflow-tooltip
            label="数量">
            <template slot-scope="scope">
              {{ Math.abs(Number(scope.row.number)) }}
            </template>
          </el-table-column>
          <el-table-column
            label-class-name="head"
            show-overflow-tooltip
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
        :page-size="20"
        :total="totalCount">
      </el-pagination>
    </main>
  </div>
</template>

<script>
import { dateFormatT } from '@/filters/index'
export default {
  name: 'statement-manage',
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
      this.getList()
    },
    // 获取资产列表
    async getList () {
      const data = await this.$store.dispatch('streamList', {
        name: this.searchName,
        userName: this.searchUserName,
        startDate: this.searchDateValue ? dateFormatT(this.searchDateValue[0].getTime(), 'yyyy-MM-dd hh:mm:ss') : null,
        endDate: this.searchDateValue ? dateFormatT(this.searchDateValue[1].getTime(), 'yyyy-MM-dd hh:mm:ss') : null,
        operation: this.optionValue,
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
    await this.getList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.statement-manage {
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
