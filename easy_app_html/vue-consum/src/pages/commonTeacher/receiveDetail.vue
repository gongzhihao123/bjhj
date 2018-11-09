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
      <el-button size="small" type="success" @click="typeManager">查看类型负责人</el-button>
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
            width="120">
          </el-table-column>
          <el-table-column
            prop="name"
            label="资产名称"
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

    <el-dialog
      title="查看我的领用"
      :visible.sync="dialogVisible"
      width="650x">
        <el-table
          :data="dialogTableData"
          style="width: 100%">
          <el-table-column
            prop="consumName"
            label-class-name="head"
            label="资产名称">
          </el-table-column>
          <el-table-column
            label-class-name="head"
            label="资产数量">
            <template slot-scope="scope">
              {{ Math.abs(scope.row.number) }}
            </template>
          </el-table-column>
        </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="类型负责人"
      :visible.sync="typeDialogVisible"
      width="650x">
        <el-table
        ref="multipleTable"
        :data="typeList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="code"
          label-class-name="head"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label-class-name="head"
          label="资产类型">
        </el-table-column>
        <el-table-column
          prop="name"
          label-class-name="head"
          show-overflow-tooltip
          label="管理人员">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.typeManagerList" :key="index">
              {{ item.userName }} <i v-if="scope.row.typeManagerList.length - 1 !== index">、</i>
            </span>
          </template>
        </el-table-column>
      </el-table>
        <el-pagination
          v-if="typeTotalCount !== 0"
          layout="prev, pager, next"
          @current-change="typeHandleCurrentChange"
          :current-page.sync="typePageNo"
          :page-size="20"
          :total="typeTotalCount">
        </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeDialogVisible = false">关闭</el-button>
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
      typeDialogVisible: false,
      typeList: [],
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
        { label: '领用', value: 3 }
      ],
      totalCount: 0,
      typePageNo: 1,
      typeTotalCount: 0
    }
  },
  methods: {
    typeManager () {
      this.typeDialogVisible = true
      this.getType()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    typeHandleCurrentChange (val) {
      this.typePageNo = val
      this.getType()
    },
    async look () {
      this.dialogVisible = true
      this.dialogTableData = await this.$store.dispatch('teacherBorrow')
    },
    async getList () {
      const data = await this.$store.dispatch('teacher', {
        name: this.searchName,
        code: this.searchCode,
        startDate: this.searchDateValue ? dateFormatT(this.searchDateValue[0].getTime(), 'yyyy-MM-dd hh:mm:ss') : null,
        endDate: this.searchDateValue ? dateFormatT(this.searchDateValue[1].getTime(), 'yyyy-MM-dd hh:mm:ss') : null,
        operation: this.optionValue,
        pageNo: this.pageNo,
        pageSize: 20
      })
      this.tableData = data.list
      this.totalCount = data.totalCount
    },
    async getType () {
      const data = await this.$store.dispatch('teacherType', {
        pageNo: this.typePageNo,
        pageSize: 20
      })
      this.typeList = data.list
      this.typeTotalCount = data.totalCount
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
    .el-select {
      width: 80px;
      .el-input {
        width: 80px;
      }
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
