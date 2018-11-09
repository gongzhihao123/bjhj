<template>
  <div class="peopleManage">
    <div class="table-box" v-loading="loading">
      <table>
        <tr>
          <th>
            <el-checkbox v-model="checkedAll" @change="handleAll"></el-checkbox>
          </th>
          <th v-for="item in tableNaV" :key="item.name">{{item.name}}</th>
        </tr>
        <tr v-for="item in tableList" :key="item.name">
          <td>
            <el-checkbox v-model="item.checked" @change="handleOne"></el-checkbox>
          </td>
          <td>{{item.userName}}</td>
          <td>{{item.companyName}}</td>
          <td>{{item.specialtyDuty}}</td>
          <td>{{item.userType}}</td>
          <td>
            <el-button @click="changeInfo(item)" type="primary" :disabled="$route.query.signFlag == 3 || $route.query.checkState == 2">编辑</el-button>
            <el-button @click="deleteClick(item)" type="primary" :disabled="$route.query.signFlag == 3 || $route.query.checkState == 2">删除</el-button>
          </td>
        </tr>
        <tr v-if="!tableList.length">
          <td colspan="6" style="text-align: center;">暂无数据</td>
        </tr>
      </table>
    </div>
    <div class="button-box">
        <el-button class="add-btn" type="primary" @click="addPeople" :disabled="$route.query.signFlag == 3 || $route.query.checkState == 2">添加</el-button>
        <el-button class="delete-btn" type="primary" @click="deleteClick" :disabled="$route.query.signFlag == 3 || $route.query.checkState == 2">删除</el-button>
    </div>
    
    <el-dialog :title="dialogTitle" :visible.sync="peopleManageDialog">
      <div>
      
        <p class="dialogP">
          <span class="label-span">工作单位：</span>
          <el-button type="primary" size="small" @click="search" :disabled="
          dialogTitle === '编辑'" style="margin-left: 10px;">选择</el-button>
          {{ company }}
        </p>
        <p class="dialogP">
          <span class="label-span">参与人姓名：</span>
          <el-input class="levelInput" v-model="userName" :disabled="
          dialogTitle === '编辑'"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">性别：</span>
          <el-radio v-model="sex" label="1">男</el-radio>
          <el-radio v-model="sex" label="2">女</el-radio>
        </p>
        <p class="dialogP">
          <span class="label-span">出生年月：</span>
          <el-date-picker
            class="levelInput"
            v-model="birthdayDate"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            format="yyyy 年 MM 月 dd 日">
          </el-date-picker>
        </p>
        <p class="dialogP"><span class="label-span">学历：</span><el-input class="levelInput" v-model="education"></el-input></p>
        <p class="dialogP"><span class="label-span">学位：</span><el-input class="levelInput" v-model="degree"></el-input></p>
        <p class="dialogP"><span class="label-span">专业职务：</span><el-input class="levelInput" v-model="positions"></el-input></p>
        <p class="dialogP"><span class="label-span">研究专长：</span><el-input class="levelInput" v-model="speciality"></el-input></p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogTitle === '编辑'" type="primary" @click="update" :disabled="canSave">确 定</el-button>
        <el-button v-else type="primary" @click="addSure" :disabled="canSave">确 定</el-button>
        <el-button @click="peopleManageDialog = false" class="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="deleteDialog">
      <div>
        <span>确定删除选中的信息吗？</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteSure" :disabled="canSave">确 定</el-button>
        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 弹出框 -->
    <el-dialog width="340px" title="请选择学校" :visible.sync="outerVisible">
      <el-input
        placeholder="输入关键字进行过滤"
        prefix-icon="el-icon-search"
        v-model="filterText">
      </el-input>
      <el-tree :data="schoolList" :props="defaultProps" @node-click="handleNodeClick" ref="tree2" :filter-node-method="filterNode" @node-expand="handleNodeClick"></el-tree>
        <p v-if="schoolList.length === 0"> 暂无数据 </p>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { notice, success } from '../../../../../../api/index'
import service from '../../../../../../utils/axios.js'
import { TreeMenu } from '../../../../../../api/tree'
import { dateFormat } from '../../../../../../filters/index.js'
export default {
  name: 'peopleManage',
  data () {
    return {
      loading: false,
      userName: '',
      outerVisible: false,
      innerVisible: false,
      education: '',
      degree: '',
      company: '',
      positions: '',
      speciality: '',
      dialogTitle: '',
      checkedAll: false,
      peopleManageDialog: false,
      deleteDialog: false,
      currentPage4: 1,
      startDate: '',
      endDate: '',
      sex: '1',
      birthdayDate: '',
      tableNaV: [
        {name: '姓名'},
        {name: '单位'},
        {name: '职务'},
        {name: '课题组角色'},
        {name: '操作'}
      ],
      tableList: [],
      schoolList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      contentData: {
        name: '',
        sex: '',
        bornDate: '',
        education: '',
        degree: '',
        company: '',
        majorsDuty: '',
        specialty: ''
      },
      personId: '',
      infoId: '',
      infoList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      filterText: '',
      canSave: false,
      companyName: ''
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick (val) {
      if (val.deptId) {
        this.userName = val.name
        this.personId = val.userId
        this.outerVisible = false
        this.innerVisible = false
        this.contentData.name = val.name
      } else {
        if (!val.parentId && val.parentId !== 0) {
          this.getCompanyDeptUser(val)
        }
      }
    },
    addPeople () {
      this.dialogTitle = '添加参与人员'
      this.userName = ''
      this.birthdayDate = ''
      this.education = ''
      this.degree = ''
      this.company = ''
      this.positions = ''
      this.speciality = ''
      this.peopleManageDialog = true
    },
    changeInfo (item) {
      this.dialogTitle = '编辑'
      this.infoId = item.id
      this.userName = item.userName
      this.birthdayDate = item.birthday
      this.education = item.education
      this.degree = item.degree
      this.company = item.companyName
      this.positions = item.specialtyDuty
      this.speciality = item.studySpeciality
      this.peopleManageDialog = true
    },
    addSure () {
      if (!this.userName.trim()) {
        notice(this, '请填写人员姓名', 2000)
        return
      }
      if (!this.birthdayDate) {
        notice(this, '请选择出生年月', 2000)
        return
      }
      if (!this.education.trim()) {
        notice(this, '请填写学历', 2000)
        return
      }
      if (!this.degree.trim()) {
        notice(this, '请填写学位', 2000)
        return
      }
      if (!this.company.trim()) {
        notice(this, '请填写工作单位', 2000)
        return
      }
      if (!this.positions.trim()) {
        notice(this, '请填写专业职务', 2000)
        return
      }
      if (!this.speciality.trim()) {
        notice(this, '请填写研究专长', 2000)
        return
      }
      this.canSave = true
      service.post(`/frontTopicManageController/addMember`, ({
        tptopId: this.$route.query.item,
        userId: this.personId,
        name: this.userName,
        sex: this.sex,
        birthday: dateFormat(this.birthdayDate, 'yyyy-MM-dd HH:mm:ss'),
        education: this.education,
        degree: this.degree,
        companyName: this.company,
        specialtyDuty: this.positions,
        studySpeciality: this.speciality
      }))
      .then(res => {
        this.canSave = false
        if (res.data.code === 1) {
          this.peopleManageDialog = false
          this.getList()
        }
      })
    },
    deleteClick (item) {
      if (item.id) {
        this.infoList = item.id
      } else {
        if (this.tableList.filter(item => item.checked).length < 1) {
          notice(this, '请选择要删除的信息', 2000)
          return
        }
        this.infoList = this.tableList.filter(item => item.checked).map(items => items.id).join(',')
      }
      this.deleteDialog = true
    },
    deleteSure () {
      this.canSave = true
      service.post(`/frontTopicManageController/deleteMember`, ({
        ids: this.infoList
      }))
      .then(res => {
        this.canSave = false
        if (res.data.code === 1) {
          success(this, res.data.message || '删除成功', 2000)
          this.getList()
          this.checkedAll = false
          this.deleteDialog = false
        } else {
          notice(this, res.data.message || '删除失败', 2000)
        }
      })
    },
    // 全选
    handleAll () {
      if (this.checkedAll) {
        this.tableList = this.tableList.map(item => ({
          ...item,
          checked: true
        }))
      } else {
        this.tableList = this.tableList.map(item => ({
          ...item,
          checked: false
        }))
      }
    },
    // 单选
    handleOne () {
      const len = this.tableList.filter(item => item.checked).length
      if (this.tableList.length === len) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
    },
    getList () {
      this.loading = true
      service.get(`/frontTopicManageController/selectMember?tptopId=${this.$route.query.item}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = res.data.result || []
        } else {
          notice(this, res.data.message || '获取失败', 2000)
        }
        this.loading = false
      })
      .catch(_ => {
        this.loading = false
      })
    },
    // 搜索
    search () {
      this.filterText = ''
      this.getCompanyList()
    },
    // 获取单位信息
    getCompanyList () {
      service.get(`/frontTopicDeclareController/getCompanyList?keyword=${''}`)
      .then(res => {
        if (res.data.code === 1) {
          this.outerVisible = true
          this.schoolList = res.data.result.map(item => ({...item, children: [{name: '_'}]}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取人
    getCompanyDeptUser (item) {
      service.get(`/frontTopicDeclareController/getCompanyDeptUser?companyId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.company = item.name
          this.companyName = item.name
          res.data.result.users = res.data.result.users.map(item => ({...item, parentId: item.deptId}))
          this.treeData = new TreeMenu(res.data.result.depts.concat(res.data.result.users)).init(0)
          this.schoolList.filter(n => n.id === item.id)[0].children = this.treeData[0].children
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 修改
    update () {
      this.canSave = true
      service.post(`/frontTopicManageController/updateMember`, ({
        id: this.infoId,
        sex: this.sex,
        birthday: dateFormat(this.birthdayDate, 'yyyy-MM-dd HH:mm:ss'),
        education: this.education,
        degree: this.degree,
        companyName: this.company,
        specialtyDuty: this.positions,
        studySpeciality: this.speciality
      }))
      .then(res => {
        this.canSave = false
        if (res.data.code === 1) {
          this.peopleManageDialog = false
          this.checkedAll = false
          this.getList()
        }
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss">
.peopleManage {
  width: 100%;
  height: 100%;

  .button-box {
    margin-top: 20px;

    &>.el-button {
      padding: 10px 25px;
      
      &:nth-child(2) {
        background: #FF6C60;
        border: 1px solid #FF6C60;
      }
    }
  }

  .table-box {
    background: #fff;
    padding: 20px;

    table {
      width: 100%;
      margin: 0 auto;
      tr {
        cursor:　pointer;
        &:hover {
          background: #F1F3F9;
          
          td {
            color: #5295EB;

            &:first-child {
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
            &:nth-child(6){
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            }
          }
        }
        &:nth-child(1) {
          background: #EBEEF7;
          border-radius: 4px;

          th {
            font-size: normal;
            padding-top: 12px;
            padding-bottom: 12px;

            &:first-child {
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
            &:nth-child(6){
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            }
          }
        }        
        td {
            padding-top: 12px;
            padding-bottom: 12px;
            color: #999999;

            &>.el-button {
              padding: 6px 15px;
                &:nth-child(2) {
                  background: #FF6C60;
                  border: 1px solid #FF6C60;
                }             
              &>span {
                width: 38px;
                display: inline-block;
                text-align: center;
              }
            }
        }
        td,th {
          text-align: left;

          &:nth-child(1) {
            padding-left: 10px;
          }
        }
        th {
          font-weight: normal;
        }
      }
    }
  }
  .el-dialog {
    width: 500px;
    .el-dialog__header {
      border-bottom: 1px solid #E4E9ED;
      padding: 20px;
    }    
    .el-dialog__title {
      font-weight: normal;
    }
    .el-dialog__headerbtn {
      top: -55px;
      right: -55px;
    }
    .dialog-footer {
      text-align: center;
      &>.el-button {
        padding: 10px 28px;
        background: #5295EB;
        border: 1px solid #5295EB;
        &>span {
          color: #fff !important;
        }
        &:hover {
          &>span {
            color: #fff !important;
          }
        }
      }
      .cancel {
        background: #FF6C60 !important;
        border: 1px solid #FF6C60 !important;
      }
    }
    .el-dialog__headerbtn .el-dialog__close {
      border: 2px solid #fff;
      border-radius: 100%;
      font-weight: bold;
      padding: 5px;
      &:hover {
        background: #FF6C60;
        .el-icon-close:before {
          color: #fff;
        }        
      }
    }
    .el-icon-close:before {
      color: #fff;
    }
    .dialogP {
      height: 50px;
      line-height: 50px;
    }
    .label-span {
      display: inline-block;
      width: 110px;
      text-align: right;
    }
    .levelInput {
      width: 300px;
      margin-left: 10px;
    }
    .datePicker {
      margin-left: 6px;
      width: 144px;
    }
    .el-tree{
      margin-top: 20px;
      height: 500px;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
