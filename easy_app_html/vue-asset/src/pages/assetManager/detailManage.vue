<template>
  <div class='detail-manage'>
    <header>
      <el-input placeholder="请输入要搜索的内容" v-model="keyword" :maxlength="20"></el-input>
      <el-button type="primary" size="small" @click="search">搜索</el-button>
      <!-- <el-button type="danger" size="small">删除</el-button> -->
    </header>

    <main>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="code"
          label-class-name="head"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="assetName"
          label-class-name="head"
          label="资产名称">
        </el-table-column>
        <el-table-column
          prop="userName"
          label-class-name="head"
          label="领用人">
        </el-table-column>
        <el-table-column
          prop="userDeptName"
          label-class-name="head"
          label="部门">
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="totalCount !== 0"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-size="10"
        :total="totalCount">
      </el-pagination>
    </main>
  </div>
</template>

<script>
export default {
  name: 'detail-manage',
  data () {
    return {
      canDel: false,
      totalCount: 0,
      dialogVisible: false,
      tableData: [],
      pageNo: 1,
      contentData: {
        name: '',
        code: ''
      },
      companyCodeId: '',
      keyword: ''
    }
  },
  methods: {
    search () {
      this.getList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    // 获取列表
    async getList () {
      const data = await this.$store.dispatch('statistic', { pageSize: 10, pageNo: this.pageNo, keyword: this.keyword })
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
.detail-manage {

  header {
    .el-input {
      width: 300px;
    }
  }

  main {
    margin-top: 20px;
    padding: 20px;
    background: #fff;
    .el-table {
      margin-top: 0;

      th {
        &:nth-child(3){
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }

  .el-dialog {
    .el-form{
      .el-row{
        .el-col{
          &>span{
            display: inline-block;
            width: 80px;
            text-align: left;
          }
          .el-form-item{
            width: 65%;
            display: inline-block;
            .el-form-item__content{
              margin-left: 0 !important;
            }
          }

          .el-input {
            width: 400px;
          }
        }
      }
    }
  }
}
</style>
