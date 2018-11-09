<template>
  <div class='label-index'>
    <!-- 头部搜索 -->
    <header>
      <el-button type="primary" size="small" @click="add">新增</el-button>
    </header>

    <main>
       <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="name"
            label-class-name="head"
            show-overflow-tooltip
            label="名称">
          </el-table-column>
          <el-table-column
            prop="createdUserName"
            label-class-name="head"
            show-overflow-tooltip
            label="创建人">
          </el-table-column>
          <el-table-column
            label-class-name="head"
            show-overflow-tooltip
            label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createdTime | dateFormat('yyyy-MM-dd HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column
            label-class-name="head"
            show-overflow-tooltip
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" :disabled="!scope.row.editFlag" size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button :disabled="!scope.row.editFlag" :type="scope.row.lockFlag ? 'success' : 'warning'" size="small" @click="changeState(scope.row)">{{ scope.row.lockFlag ? '启用' : '禁用' }}</el-button>
              <el-button :disabled="!scope.row.editFlag" type="danger" size="small" @click="del(scope.row)">删除</el-button>
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
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
      width="545px">
        <el-form v-if="dialogVisible" :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="24" class="text-right">
              <span> 任务名称：</span>
              <el-form-item
                prop="name"
                :rules="[
                  { required: true, message: '任务名称不能为空'},
                ]"
              >
                <el-input v-model.trim="contentData.name" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :disabled="canAdd" type="primary" @click="submitForm('contentData')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { dateFormatT } from '@/filters/index'
export default {
  name: 'label-index',
  data () {
    return {
      dialogVisible: false,
      pageNo: 1,
      canAdd: false,
      tableData: [],
      totalCount: 0,
      isEdit: true,
      contentData: {
        name: ''
      },
      taskId: ''
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    add () {
      this.isEdit = false
      this.dialogVisible = true
      this.canAdd = false
      this.contentData = {
        name: ''
      }
    },
    async changeState (val) {
      await this.$store.dispatch('taskState', {
        taskId: val.id
      })
      await this.getList()
    },
    edit (val) {
      this.isEdit = true
      this.taskId = val.id
      this.dialogVisible = true
      this.canAdd = false
      this.contentData = {
        name: val.name
      }
    },
    del (val) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('taskDel', val.id)
        await this.getList()
      })
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.canAdd = true
          if (this.isEdit) {
            await this.$store.dispatch('taskEdit', {
              taskId: this.taskId,
              name: this.contentData.name
            })
          } else {
            await this.$store.dispatch('taskAdd', {
              name: this.contentData.name
            })
          }
          await this.getList()
          this.canAdd = false
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    async getList () {
      let data = await this.$store.dispatch('taskList', {
        pageSize: 10,
        pageNo: this.pageNo
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
.label-index {
  header {
  }

  main {
    margin-top: 20px;
    padding: 20px 0;
    background: #fff;
    padding: 20px;
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
