<template>
  <div class="id-index">
    <header>
      <img src="../../../../src/assets/images/courseManager/manager-iocn.png"><span>账号管理</span>
    </header>

    <main>
      <div class="button-group">
        <p>
          <span>权限：</span>
          <el-select v-model="value" placeholder="请选择" @change="getList()">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </p>
        <p>
          <span>单位：</span>
          <el-input placeholder="请输入单位名称" suffix-icon="el-icon-search" v-model="companyKeyword" @change.native="getList()"></el-input>
        </p>
        <p>
          <span>姓名：</span>
          <el-input placeholder="请输入用户姓名" suffix-icon="el-icon-search" v-model="nameKeyword" @change.native="getList()"></el-input>
        </p>
      </div>
      <div class="table-box">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          label="序号"
          show-overflow-tooltip
          label-class-name="head"
          width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          show-overflow-tooltip
          label-class-name="head"
          width="120">
        </el-table-column>
        <el-table-column
          prop="phone"
          width="100"
          show-overflow-tooltip
          label-class-name="head"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="email"
          show-overflow-tooltip
          label-class-name="head"
          label="E-mail">
        </el-table-column>
        <el-table-column
          prop="companyName"
          show-overflow-tooltip
          label-class-name="head"
          label="单位名称">
        </el-table-column>
        <el-table-column
          prop="rightName"
          show-overflow-tooltip
          label-class-name="head"
          label="权限">
        </el-table-column>
        <el-table-column
          width="200"
          show-overflow-tooltip
          label-class-name="head"
          label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <i class="edit" @click="changeClick(scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="delete" @click="deleteClick(scope.row)"></i>
            </el-tooltip>
            <!-- <el-button type="danger" @click="changeClick(scope.row)"> 编辑 </el-button>
            <el-button type="danger" @click="deleteClick(scope.row)"> 删除 </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      </div>


    </main>
      <el-button @click="addNew"><img src="../../../assets/images/courseManager/add.png">新增</el-button>
        <el-pagination
        v-if="tableData.length > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
    </el-pagination>
      <el-dialog
        title="新增"
        :visible.sync="dialogVisible"
        width="482px">

        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
          <el-row>
            <el-col :span="14">
              <el-tree
                class="filter-tree"
                show-checkbox
                :data="schoolList"
                node-key="userId"
                :props="defaultProps"
                :filter-node-method="filterNode"
                @node-expand="handleNodeClick"
                @node-click="handleNodeClick"
                @check-change="handleChange"
                ref="tree">
              </el-tree>
            </el-col>
            <el-col :span="10" class="right-box">
              <ul>
                <li v-for="(item,i) in deptUserList" :key="i"><span>{{item.name}}</span>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <i class="el-icon-circle-close-outline" @click="deptListDelete(i)"></i>
                </el-tooltip>
                </li>
              </ul>
            </el-col>
          </el-row>
        <div class="chose-permissions">
          <h3>选择权限</h3>
          <el-row>
            <el-col :span="6" v-for="(item, index) in permissionsList" :key="index">
              <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addSure" :disabled="canSave">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
   


    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="deleteDialog" width="500px">
      <div>
        <span>确定删除选中的信息吗？</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteSure" :disabled="canSave">确 定</el-button>        
        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="选择权限" :visible.sync="changeDialog" width="600px">
      <div class="chose-permissions">
        <el-row>
          <el-col :span="6" v-for="(item, index) in permissionsList" :key="index">
            <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeSure" :disabled="canSave">确 定</el-button>        
        <el-button @click="changeDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { notice, success } from '../../../api/index.js'
// import querystring from 'querystring'
import service from '../../../utils/axios.js'
import { mapGetters } from 'vuex'
import { TreeMenu } from '../../../api/tree.js'
export default {
  name: 'id-name',
  data () {
    return {
      canSave: false,
      loading: false,
      infoId: '',
      checkedList: [],
      qxIndex: '',
      companyKeyword: '',
      nameKeyword: '',
      currentPage: 1,
      value: '',
      dialogVisible: false,
      changeDialog: false,
      deleteDialog: false,
      tableData: [],
      permissionsList: [
        { name: '账号管理', id: 1, checked: false },
        { name: '课题管理', id: 2, checked: false },
        { name: '政策文件管理', id: 3, checked: false },
        { name: '课题评审', id: 4, checked: false }
      ],
      options: [
        {
          value: '',
          label: '全部权限'
        },
        {
          value: 1,
          label: '账号管理'
        }, {
          value: 2,
          label: '课题管理'
        }, {
          value: 3,
          label: '政策文件管理'
        }, {
          value: 4,
          label: '课题评审'
        }
      ],
      filterText: '',
      schoolList: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      contentData: {
        company: ''
      },
      treeData: [],
      companyId: '',
      userList: [],
      deptUserList: [],
      checkedCount: 0,
      totalCount: 0,
      pageSize: 10
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    handleNodeClick (data) {
      if (data.disabled) return
      if (data.parentIndex === 1) {
        this.getUserList(data)
      }
    },
    handleChange () {
      this.deptUserList = [ ...this.$refs.tree.getCheckedNodes(true) ]
      console.log(this.deptUserList)
      this.checkedCount = this.deptUserList.length
    },
    empty () {
      this.$refs.tree.setCheckedNodes([])
      this.checkedCount = 0
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    deleteClick (row) {
      this.infoId = row.id
      this.deleteDialog = true
    },
    deleteSure () {
      this.canSave = true
      service.post(`/backAccountController/deleteAccount`, ({
        id: this.infoId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message || '删除成功', 2000)
          this.loading = true
          service.get(`/backAccountController/accountList?pageNo=${this.currentPage}&pageSize=${this.pageSize}&name=${this.nameKeyword}&companyName=${this.companyKeyword}&rightId=${this.value}`)
          .then(res => {
            if (res.data.code === 1) {
              this.tableData = res.data.result.list || []
              this.totalCount = res.data.result.totalCount
              if (this.tableData.length === 0 && this.currentPage !== 1) {
                this.currentPage = this.currentPage - 1
                this.getList()
              }
            } else {
              if (res.data.message) {
                notice(this, res.data.message, 2000)
              }
            }
            this.loading = false
          })
          .catch(_ => {
            this.loading = false
          })
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
      this.deleteDialog = false
    },
    deptListDelete (i) {
      this.deptUserList.splice(i, 1)
      this.checkedCount = this.deptUserList.length
      this.$refs.tree.setCheckedKeys(this.deptUserList.map(item => item.userId), false)
    },
    changeClick (row) {
      this.permissionsList = this.permissionsList.map(item => ({
        ...item,
        checked: false
      }))
      row.rightName.split(',').forEach(item => {
        this.permissionsList.forEach(items => {
          if (item === items.name) {
            this.$set(items, 'checked', true)
          }
        })
      })
      this.infoId = row.id
      this.changeDialog = true
    },
    // 修改
    changeSure () {
      this.canSave = true
      this.checkedList = this.permissionsList.filter(item => item.checked).map(item => item.id).join(',')
      if (this.checkedList.length === 0) {
        notice(this, '请选择权限', 2000)
        return
      }
      service.post(`/backAccountController/updateAccount`, ({
        id: this.infoId,
        rightIds: this.checkedList
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '修改成功', 2000)
          this.changeDialog = false
          this.getList()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 获取列表
    getList () {
      this.loading = true
      service.get(`/backAccountController/accountList?pageNo=${this.currentPage}&pageSize=${this.pageSize}&name=${this.nameKeyword}&companyName=${this.companyKeyword}&rightId=${this.value}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list || []
          this.totalCount = res.data.result.totalCount
        } else {
          if (res.data.message) {
            notice(this, res.data.message, 2000)
          }
        }
        this.loading = false
      })
      .catch(_ => {
        this.loading = false
      })
    },
    // 获取单位信息
    addNew () {
      this.checkedCount = 0
      this.deptUserList = []
      this.permissionsList = this.permissionsList.map(item => ({
        ...item,
        checked: false
      }))
      this.dialogVisible = true
      service.get(`/backAccountController/getCompanyList?keyword=${this.contentData.company}`)
      .then(res => {
        if (res.data.code === 1) {
          this.schoolList = (res.data.result || []).map((item, i) => ({
            ...item,
            index: i,
            parentIndex: 1,
            children: [{
              name: '请稍后...',
              disabled: true,
              children: []
            }]
          }))
          // this.getUserList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 根据学校获取人
    getUserList (data) {
      service.get(`/backAccountController/getDeptUserList?companyId=${data.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.userList = [...res.data.result.depts || []].concat([...res.data.result.users || []].map(item => ({
            ...item,
            parentId: item.deptId,
            companyId: this.schoolList[data.index].id,
            companyName: this.schoolList[data.index].name
          })))
          this.schoolList[data.index].children = new TreeMenu(this.userList).init(0)[0].children.filter(item => item.children || item.children.length > 0)
          this.filters(this.schoolList[data.index].children)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    filters (arr) {
      arr = arr.filter(item => item.children.length > 0 || item.userId)
      arr.forEach(item => {
        if (item.children) {
          this.filters(item.children)
        }
      })
    },
    addSure () {
      this.canSave = true
      let deptUserList = this.deptUserList.map(item => ({
        id: item.userId,
        companyId: item.companyId,
        companyName: item.companyName,
        name: item.name,
        email: item.email,
        phone: item.mobile
      }))
      let rightIds = (this.permissionsList || []).filter(item => item.checked).map(item => item.id).join(',')
      if (deptUserList.length === 0 && rightIds === '') {
        notice(this, '请选择人员和权限', 2000)
        this.canSave = false
        return
      }
      if (deptUserList.length === 0) {
        notice(this, '请选择人员', 2000)
        this.canSave = false
        return
      }
      if (rightIds === '') {
        notice(this, '请选择权限', 2000)
        this.canSave = false
        return
      }
      service.post('backAccountController/addAccount', ({
        userList: JSON.stringify(deptUserList),
        rightIds
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getList()
          this.dialogVisible = false
          success(this, res.data.message || '保存成功', 2000)
        } else {
          notice(this, res.data.message || '保存失败', 2000)
        }
        this.canSave = false
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getList()
    // this.addNew()
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.id-index{
  padding-bottom: 20px;

  .el-table td:first-child .cell, .el-table th:first-child .cell {
    padding-left: 10px;
  }
  .table-box {
    padding: $width;
  }
  .el-table::before {
    display: none;
  }

  .el-table td, .el-table th.is-leaf {
    border: none !important;
  }

    .el-table .head  {
      background: #EBEEF7;
    }
    
    .el-table__header {
      width: auto !important;

      tr {
        background: #EBEEF7;
        border-radius: 4px;
        th {
          &:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
           &:nth-child(7){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
           }
        }
      }
    }

  header{
    padding: 25px 0px 20px 0px;

    &:after {
      display: block;
      content: '';
      height: 0;
      clear: both;
      overflow: hidden;
      visibility: hidden;
    }
    img {
      float: left;
    }
    span {
      margin-left: 10px;
      font-size: 16px;
      float: left;
      height: 24px;
      line-height: 24px;
    }
  }

  // 主体表格
  main{
    background: #fff;
    // p {
    //   font-size: 16px;
    //   border-bottom: 1px solid #EBEEF7;
    //   padding: $width;
    //   img {
    //     margin-right: 10px;
    //   }
    // }
    .button-group{
      padding: $width;
      &>p{
        float: left;
        margin-right: 20px;
        border: none !important;
        .el-input {
          width: 200px;
        }
      }

      &>.el-select{
        float: right;
        margin-right: $width;
      }
    }

    .el-table{

      tr {
        td {

          &:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
           &:nth-child(7){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;

            .edit {
              width: 22px;
              height: 22px;
              display: inline-block;
              cursor: pointer;
              background: url(../../../../src/assets/images/courseManager/btn-edit-normal.png);

              &:hover {
              background: url(../../../../src/assets/images/courseManager/btn-edit-active.png);
              }
            }
            .delete {
              cursor: pointer;
              width: 22px;
              height: 22px;
              display: inline-block;
              background: url(../../../../src/assets/images/courseManager/btn-delete-normal.png);

              &:hover {
              background: url(../../../../src/assets/images/courseManager/btn-delete-active.png);
              }
            }
           }
        }
      }
      .el-table__body-wrapper{
        overflow: hidden;
        tr {
          td {
            padding: 5px 0px;
          }
          &:hover {
            td {
              color: #5295EB;
            }
          }
        }
      }
    }

  }

  .el-button {
    margin-top: 20px;
    padding: 10px 15px;
    color: #fff;
    background: #59A1FF;
    border: 1px solid #59A1FF;
    cursor: pointer;

    &:hover {
      background: #5091E6;
      border: 1px solid #5091E6;
      cursor: default;
    }

    img {
        margin-right: 13px;
        vertical-align: middle;
      }
  }

      // 分页
    .el-pagination{
      float: right;
      margin-top: $width
    }

  // 新增弹出框
  .el-dialog{
    .el-dialog__title {
      font-weight: normal;
    }
    .el-dialog__body{
      .el-input {
        width: 70%;
        margin-bottom: 10px;
      }

      .el-col-6 {
        min-width: 26%;
      }
      &>.el-row{
        border-radius: 5px;
        border: 1px solid #ddd;
        height: 220px;
        .el-col:first-child,.el-col:last-child{
          padding: 10px 10px 0 10px;
          box-sizing: border-box;
          // height: 220px;
          border-right: 1px solid #ddd;
          
          .el-tree{
            // margin-top: 10px;
            height: 208px;
            overflow-x: hidden;
            span{
              font-size: 16px;
            }
          }
        }
        > .right-box {
          border-left: none;
          float: right;
          overflow: hidden;
          box-sizing: border-box;

          &>ul {
            height: 208px;
            overflow-x: hidden;
            &>li {
              &>span {
                color: #5FA4FA;
                display: inline-block;
                padding: 5px 10px;
              }

              &>i {
                cursor: pointer;
                &:hover {
                  color: #FF7267;
                }
              }
            }
          }
          &>p {
              width: 100%;
              height: 38px;
              background: #e1e1e1;
              margin: 0;
              box-sizing: border-box;
              &>.span:first-child {
                  float: left;
              }
              &>.span:last-child {
                  float: right;
              }
          }
          > div {
            height: calc(100% - 40px);
            overflow: auto;
          }
        }
      }
      
      .chose-permissions{
        border-radius: 5px;
        border: 1px solid #ddd;
        margin-top: 10px;
        padding: 5px 10px;

        h3{
          margin: 20px 0;
          font-weight: normal;
        }
        .el-col{
          text-align: center;
          span{
            font-size: 16px;
          }
        }
      }
    }
    .el-dialog__header {
      border-bottom: 1px solid #E4E9ED;
      padding: 20px;
    }

    .el-dialog__footer {
      text-align: center;
      padding-top: 0px;
      .el-button {
        cursor: pointer;
        padding: 10px 28px;
        color: #fff;

        &:nth-child(1) {
          background: #59A1FF;
          border: 1px solid #59A1FF;

          &:hover {
            background: #59A1FF !important;
            border: 1px solid #59A1FF !important;
          }
        }

        &:nth-child(2) {
          background: #FF6C60;
          border: 1px solid #FF6C60;
        }
      }
    }
    .el-dialog__headerbtn {
      top: -55px;
      right: -55px;
      border: 2px solid #fff;
      border-radius: 100%;
      width: 33px;
      height: 33px;

      &:hover{
        background: #FF6C60;
      }
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
      font-size: 18px;
      margin-top: 2px;
    }
  }
}
</style>
