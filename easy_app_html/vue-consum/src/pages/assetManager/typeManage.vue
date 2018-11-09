<template>
  <div class='type-manage'>
    <header>
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
          label="类型">
        </el-table-column>
        <el-table-column
          prop="name"
          label-class-name="head"
          label="管理人员">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.typeManagerList" :key="index">
              {{ item.userName }} <i v-if="scope.row.typeManagerList.length - 1 !== index">、</i>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="head"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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
      :title="titleName"
      :visible.sync="dialogVisible"
      width="545px">
      <el-form v-if="dialogVisible" :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="24" class="text-right">
            <span> 类型：</span>
            <el-form-item
              prop="name"
              :rules="[
                { required: true, message: '物品类型不能为空'},
              ]"
            >
              <el-input :disabled="titleName === '编辑'" v-model.trim="contentData.name" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-right">
            <span> 编号：</span>
            <el-form-item
              prop="code"
              :rules="[
                { required: true, message: '编号不能为空'},
              ]"
            >
              <el-input :disabled="titleName === '编辑'" v-model.trim="contentData.code" :maxlength="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="24" class="text-right">
            <span> 管理员：</span>
            <el-form-item
              prop="user"
              :rules="[
                { required: true, message: '管理员不能为空'},
              ]"
            >
              <el-select multiple collapse-tags v-model="contentData.user" placeholder="请选择">
                <el-option-group
                  v-for="group in userList"
                  :key="group.userId"
                  :label="group.name">
                  <el-option
                    v-for="item in group.children"
                    :key="item.userId"
                    :label="item.name"
                    :value="item.userId">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24" class="manager">
            <span> 管理员：</span>
            <div class="user">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
              <el-tree ref="data" :data="userList" :filter-node-method="filterNode" node-key="userId" show-checkbox :props="defaultProps" @check-change="handleNodeClick"></el-tree>
              <div>
                <p v-for="(item, index) in hasSelected" :key="index"> {{ item.name }}
                  <i @click="reMove(index)">x</i>
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('contentData')" :disabled="canDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { TreeMenu } from '../../utils/tree.js'
import { notice } from '../../utils/index'
export default {
  name: 'type-manage',
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      titleName: '新增',
      canDel: false,
      totalCount: 0,
      dialogVisible: false,
      tableData: [],
      pageNo: 1,
      userList: [],
      userCopy: [],
      filterText: '',
      typeId: '',
      contentData: {
        name: '',
        code: '',
        user: []
      },
      hasSelected: []
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    reMove (i) {
      this.hasSelected.splice(i, 1)
      this.$refs.data.setCheckedNodes(this.hasSelected)
    },
    handleNodeClick (a, b) {
      if (a.userId) {
        if (b === true) {
          if (this.hasSelected.filter(item => item.userId === a.userId).length === 0) {
            this.hasSelected.push({name: a.name, userId: a.userId})
          }
        } else {
          let list = []
          this.hasSelected.forEach((m, index) => {
            if (m.userId !== a.userId) {
              list.push({name: m.name, userId: m.userId})
            }
          })
          this.hasSelected = list
        }
      }
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    // 新增按钮
    addButton () {
      this.titleName = '新增'
      this.dialogVisible = true
      this.canDel = false
      this.contentData = {
        name: '',
        code: '',
        user: []
      }
      this.hasSelected = []
      this.deptUserList()
    },
    // 获取人
    async deptUserList () {
      let data = await this.$store.dispatch('deptUserList')
      this.receiveDept = [...data.depts]
      this.receiveUser = [...data.users].map(item => ({...item, parentId: item.deptId}))
      this.userCopy = [...data.users].map(item => ({...item, parentId: item.deptId}))
      this.userList = new TreeMenu(this.receiveDept.concat(this.receiveUser)).init(0)
    },
    // 编辑
    async edit (val) {
      this.titleName = '编辑'
      this.typeId = val.id
      this.dialogVisible = true
      this.canDel = false
      this.contentData = {
        name: val.name,
        code: val.code,
        user: val.typeManagerList.map(item => item.userId)
      }
      await this.deptUserList()
      this.hasSelected = val.typeManagerList.map(item => ({...item, name: item.userName}))
      this.$refs.data.setCheckedNodes(this.hasSelected)
    },
    // 删除
    del (val) {
      this.$confirm('删除类型,该类型下的物品也将删除,是否继续?', '提示', {
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
          if (!(/^[a-zA-Z\d]+$/).test(this.contentData.code)) {
            notice('编码请输入数字或字母')
            return
          }
          // if (this.hasSelected.length === 0) {
          //   notice('请选择管理人员')
          //   return
          // }
          this.canDel = true
          let arr = []
          this.hasSelected.forEach((item) => {
            arr.push({ userId: item.userId, userName: item.name })
          })
          if (this.titleName === '新增') {
            await this.$store.dispatch('typeAdd', {
              typeName: this.contentData.name,
              code: this.contentData.code,
              managerJson: JSON.stringify(arr)
            })
          } else {
            await this.$store.dispatch('typeManager', {
              typeId: this.typeId,
              managerJson: JSON.stringify(arr)
            })
          }
          this.canDel = false
          await this.getList()
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    // 获取列表
    async getList () {
      const data = await this.$store.dispatch('typeList', { pageSize: 20, pageNo: this.pageNo })
      this.tableData = data.list
      this.totalCount = data.totalCount
    }
  },
  watch: {
    filterText (val) {
      this.$refs.data.filter(val)
    }
  },
  async created () {
    await this.getList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.type-manage {
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
    .manager {
      &>span {
        vertical-align: top;
      }
    }
    .user {
      display: inline-block;
      width: 400px;
      &>div:nth-child(1) {
        margin-bottom: 10px;
      }
      &>div:nth-child(2) {
        display: inline-block;
        width: 200px;
        height: 200px;
        overflow-x: hidden;
      }
      &>div:nth-child(3) {
        vertical-align: top;
        display: inline-block;
        padding: 10px;
        height: 200px;
        overflow-x: hidden;
        box-sizing: border-box;
        width: 180px;
        p {
          margin-bottom: 5px;
          i {
            float: right;
            font-style: normal;
            cursor: pointer;
            color: #EC2126;
          }
        }
      }
    }
  }
}
</style>
