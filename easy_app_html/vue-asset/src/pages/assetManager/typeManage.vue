<template>
  <div class='type-manage'>
    <header>
      <el-input placeholder="设置学校编号（1-10位数字或英文）" v-model="schoolCode" @blur="schoolBlur" :maxlength="10"></el-input>
      <span>
        学校编号：
      </span>
      <el-button type="primary" size="small" @click="addButton">新增</el-button>
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
          prop="name"
          label-class-name="head"
          label="资产类型">
        </el-table-column>
        <el-table-column
          label-class-name="head"
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
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

    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="545px">
      <el-form v-if="dialogVisible" :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="24" class="text-right">
            <span> 资产类型：</span>
            <el-form-item
              prop="name"
              :rules="[
                { required: true, message: '资产类型不能为空'},
              ]"
            >
              <el-input v-model.trim="contentData.name" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="text-right">
            <span> 类型编号：</span>
            <el-form-item
              prop="code"
              :rules="[
                { required: true, message: '类型编号不能为空'},
              ]"
            >
              <el-input v-model.trim="contentData.code" :maxlength="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm ('contentData')" :disabled="canDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { notice } from '../../utils/index'
export default {
  name: 'type-manage',
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
      schoolCode: '',
      companyCodeId: ''
    }
  },
  methods: {
    async schoolBlur () {
      if (!(/^[0-9a-zA-Z]{1,10}$/).test(this.schoolCode)) {
        notice('学校编号请输入1-10位数字或英文')
        await this.companyCode()
        return
      }
      await this.$store.dispatch('companyCodeEdit', { companyCodeId: this.companyCodeId, code: this.schoolCode })
      await this.companyCode()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    // 新增按钮
    addButton () {
      this.dialogVisible = true
      this.canDel = false
      this.contentData.name = ''
      this.contentData.code = ''
    },
    // 删除
    del (val) {
      this.$confirm('删除资产类型后，资产类型下的资产会被同时删除，您是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('typeDel', val)
        await this.getList()
      })
    },
    // 新增确认
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!(/^[0-9a-zA-Z]{3}$/).test(this.contentData.code)) {
            notice('类型编号请输入3位数字或英文')
            return
          }
          this.canDel = true
          await this.$store.dispatch('typeAdd', { typeName: this.contentData.name, code: this.contentData.code })
          await this.getList()
          this.canDel = false
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    // 获取列表
    async getList () {
      const data = await this.$store.dispatch('typeList', { pageSize: 10, pageNo: this.pageNo })
      this.tableData = data.list
      this.totalCount = data.totalCount
    },
    async companyCode () {
      const data = await this.$store.dispatch('companyCode')
      this.companyCodeId = data.id
      this.schoolCode = data.code
    }
  },
  watch: {
  },
  async created () {
    await this.companyCode()
    await this.getList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.type-manage {

  header {
    .el-input {
      float: right;
      width: 300px;
      vertical-align: middle;
    }
    &>span {
      float: right;
      line-height: 40px;
      margin-right: 10px;
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
