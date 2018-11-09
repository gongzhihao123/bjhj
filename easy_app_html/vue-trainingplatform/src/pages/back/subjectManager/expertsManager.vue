<template>
  <div class="experts-manager">
    <header>
        <img src="../../../../src/assets/images/courseManager/manager-iocn.png"><span>课题管理</span>
    </header>

    <main>
        <p><img src="../../../assets/images/circle-icon.png">专家库管理</p>
        <div class="table-box">
          <el-table
          :data="tableData"
          v-loading="loading"
          stripe
          @select-all="selectAll"
          @select="choose"        
          style="width: 100%">
          <el-table-column
            type="selection"
            align='center'
            show-overflow-tooltip
            label-class-name="head"
            width="60">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="titleNum"
            label="职称数"
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话"
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="email"
            label="E-mail"
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="account"
            label="账号"
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="单位"
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>
        </div>
    </main>
      <div class="button-group">
        <el-button @click="add"><img src="../../../../src/assets/images/courseManager/add-guide.png">添加</el-button>
        <el-button  @click="edit" :disabled="count < 1 || count > 1" :class="{gray: count < 1 || count > 1}"><img src="../../../../src/assets/images/courseManager/edit-btn.png">修改</el-button>
        <el-button :disabled="count < 1" @click="deleteList"><img src="../../../../src/assets/images/courseManager/delete-btn.png">删除</el-button>
        <span>已选 {{count}} 条</span>

        <el-pagination
        v-if="tableData.length !== 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
      </div>
    <!-- 弹出框 -->
    <el-dialog
      :title="addflag ? '添加专家' : '编辑专家'"
      :visible.sync="dialogVisible"
      width="655px">
      
      <el-form :model="expertsData" ref="expertsData" :rules="rules" label-width="100px" class="demo-ruleForm" v-if="dialogVisible">
        <el-row>
          <el-col :span="5" class="text-right">姓名：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="userName">
              <el-input  v-model="expertsData.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">头像：</el-col>
          <el-col :span="19">
            <el-upload
              style="margin: 0 0 20px 20px;"
              class="upload-demo"
              :action="action"
               multiple
               name="uploadFile"
               :on-success="success"
               :limit="1"
              :before-upload="beforeUpload"
              :file-list="fileList">
              <el-button type="primary">浏览...</el-button>
              <span slot="tip" class="el-upload__tip">未选择头像</span>
            </el-upload>
          </el-col>
        </el-row>

        <el-row v-if="addflag">
          <el-col :span="5" class="text-right">账号：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="account">
              <el-input  v-model="expertsData.account" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">密码：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="password">
              <el-input type="password" v-model="expertsData.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">确认密码：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="passwordConfirm">
              <el-input type="password" v-model="expertsData.passwordConfirm" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">电话：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="phone">
              <el-input v-model="expertsData.phone" style="width: 395px;"></el-input>              
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">E-mail：</el-col>
          <el-col :span="19">
            <el-form-item
            prop="email">
              <el-input v-model="expertsData.email" style="width: 395px;"></el-input>            
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">单位：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="companyName">
              <el-input v-model="expertsData.companyName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">职称数：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="titleNum">
              <el-input v-model="expertsData.titleNum" auto-complete="off" :maxlength="2" :max="100" :min="0"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('expertsData')">确 定</el-button>        
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import service from '../../../utils/axios.js'
import { notice, success } from '../../../api/index.js'
export default {
  name: 'experts-manager',
  data () {
    var validateAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('账号不能为空'))
      } else {
        var re = new RegExp('^[a-zA-Z][a-zA-Z0-9_]{5,17}$')
        var result = re.exec(value)
        if (!result) {
          callback(new Error('账号不合法，请以字母开头，长度为6-18'))
        } else {
          callback()
        }
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      } else {
        if (this.expertsData.password !== '') {
          var re = new RegExp('^.{6,18}$')
          var result = re.exec(value)
          if (!result) {
            callback(new Error('密码长度为6-18位'))
          }
        }
        callback()
      }
    }
    var validatePasswordConfirm = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.expertsData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else {
        if (this.expertsData.phone !== '') {
          var re = new RegExp('^(([0-9]{8})|([0-9]{11}))$')
          var result = re.exec(value)
          if (!result) {
            callback(new Error('电话号码只能是8位数字或者11位数字'))
          } else {
            callback()
          }
        }
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱地址'))
      } else {
        if (this.expertsData.email !== '') {
          var re = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
          var result = re.exec(value)
          if (!result) {
            callback(new Error('请输入合法的邮箱地址格式'))
          } else {
            callback()
          }
        }
      }
    }
    var validateTitleNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入职称数'))
      } else {
        if (this.expertsData.titleNum !== '') {
          if (!(/^\d{1,3}$/).test(value)) {
            return callback(new Error('请输入1位或者2位数字'))
          } else {
            callback()
          }
        }
      }
    }
    var validateCompanyName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('单位名称不能为空'))
      } else {
        callback()
      }
    }
    var validateUserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('姓名不能为空'))
      } else {
        callback()
      }
    }
    return {
      fileList: [],
      pageSize: 10,
      count: 0,
      addflag: true,
      loading: false,
      expertsData: {
        account: '',
        userName: '',
        password: '',
        passwordConfirm: '',
        phone: '',
        email: '',
        titleNum: '',
        userFaceUrl: '',
        companyName: ''
      },
      rules: {
        account: [
          { validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        passwordConfirm: [
          { validator: validatePasswordConfirm, trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        titleNum: [
          { validator: validateTitleNum, trigger: 'blur' }
        ],
        companyName: [
          { validator: validateCompanyName, trigger: 'blur' }
        ],
        userName: [
        { validator: validateUserName, trigger: 'blur' }
        ]
      },
      id: '',
      dialogVisible: false,
      totalCount: 0,
      currentPage: 1,
      tableData: [],
      selection: [],
      file: []
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    success (response, fileList, file) {
      this.expertsData.userFaceUrl = response.result
      this.file = [...file]
    },
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'jpg' || arr[arr.length - 1] === 'png') {
          resolve()
        } else {
          notice(this, '请上传正确格式文件', 2000)
          reject(arr)
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          if (this.expertsData.password !== this.expertsData.passwordConfirm) {
            notice(this, '两次密码输入不一致，请确认后输入', 2000)
            return false
          }
          // 添加
          if (this.addflag) {
            service.post(`backExpertController/addExpertUser`, {
              userName: this.expertsData.userName,
              userFaceUrl: this.expertsData.userFaceUrl,
              password: this.expertsData.password,
              phone: this.expertsData.phone,
              email: this.expertsData.email,
              companyName: this.expertsData.companyName,
              titleNum: this.expertsData.titleNum,
              account: this.expertsData.account
            })
            .then(res => {
              if (res.data.code !== 1) {
                notice(this, res.data.message, 2000)
              } else {
                success(this, res.data.message, 2000)
                this.getData()
              }
            })
            .catch(res => {
              notice(this, res.data.message, 2000)
            })
          } else {
            // 修改
            service.post(`backExpertController/updateExpertUser`, {
              id: this.id,
              userName: this.expertsData.userName,
              userFaceUrl: this.expertsData.userFaceUrl,
              password: this.expertsData.password,
              phone: this.expertsData.phone,
              email: this.expertsData.email,
              companyName: this.expertsData.companyName,
              titleNum: this.expertsData.titleNum
            })
            .then(res => {
              if (res.data.code !== 1) {
                notice(this, res.data.message, 2000)
              } else {
                success(this, res.data.message, 2000)
                this.getData()
              }
            })
            .catch(res => {
              notice(this, res.data.message, 2000)
            })
          }
        } else {
          return false
        }
      })
    },
    deleteList () {
      service.post('backExpertController/deleteExpert', {
        ids: this.ids
      })
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          success(this, res.data.message, 2000)
          this.loading = true
          this.count = 0
          setTimeout(() => {
            service.get(`backExpertController/getExpertUserPage?pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
            .then(res => {
              if (res.data.code === 1) {
                this.tableData = res.data.result.list
                this.totalCount = res.data.result.totalCount
                if (this.tableData.length === 0 && this.currentPage !== 1) {
                  this.currentPage = this.currentPage - 1
                  this.getData()
                }
                this.loading = false
              } else {
                notice(this, res.data.message, 2000)
              }
              this.loading = false
            })
            .catch(res => {
              notice(this, res.data.message, 2000)
            })
          }, 1000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },
    add () {
      this.addflag = true
      this.dialogVisible = true
      this.expertsData = {}
      this.fileList = []
    },
    choose (selection, row) {
      this.count = selection.length
      this.ids = selection.map(n => n.id).join(',')
      this.expertsData.userName = selection[0].name
      this.expertsData.account = selection[0].account
      this.expertsData.password = selection[0].password
      this.expertsData.passwordConfirm = selection[0].password
      this.expertsData.email = selection[0].email
      this.expertsData.phone = selection[0].phone
      this.expertsData.titleNum = selection[0].titleNum
      this.expertsData.userFaceUrl = selection[0].userFace
      this.expertsData.companyName = selection[0].companyName
      this.id = selection[0].id
      this.selection = [...selection]
    },
    selectAll (selection) {
      this.count = selection.length
      this.selection = [...selection]
      this.ids = selection.map(n => n.id).join(',')
      if (this.count === 1) {
        this.id = selection[0].id
      }
    },
    edit () {
      this.addflag = false
      this.fileList = []
      if (this.count > 1) {
        notice(this, '请选择一个专家进行修改', 2000)
        return
      }
      let item = {}
      item.name = this.selection[0].name
      item.url = this.selection[0].userFace
      this.fileList.push(item)
      this.expertsData.userName = this.selection[0].name
      this.expertsData.account = this.selection[0].account
      this.expertsData.password = this.selection[0].password
      this.expertsData.passwordConfirm = this.selection[0].password
      this.expertsData.email = this.selection[0].email
      this.expertsData.phone = this.selection[0].phone
      this.expertsData.titleNum = this.selection[0].titleNum
      this.expertsData.userFaceUrl = this.selection[0].userFace
      this.expertsData.companyName = this.selection[0].companyName
      this.id = this.selection[0].id
      this.dialogVisible = true
    },
    getData () {
      this.loading = true
      this.count = 0
      setTimeout(() => {
        service.get(`backExpertController/getExpertUserPage?pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.result.list
            this.totalCount = res.data.result.totalCount
            this.loading = false
          } else {
            notice(this, res.data.message, 2000)
          }
          this.loading = false
        })
        .catch(res => {
          notice(this, res.data.message, 2000)
        })
      }, 1000)
    }
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/backExpertController/uploadFile`
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.experts-manager{
  padding-bottom: $width;
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
  .button-group {
    margin-top: 20px;

       // 分页
        .el-pagination{
          float: right;
        }
    &>span {
      line-height: 30px;
      margin-left: 10px;
    }

    &>.el-button {
      padding: 10px 15px;
      color: #fff;

      &>span {
        &>img {
          margin-right: 13px;
          vertical-align: middle;
        }
      }

      &:nth-child(1) {
        background: #59A1FF;
        border: 1px solid #59A1FF;

        &:hover {
          background: #5091E6;
          border: 1px solid #5091E6;
        }
      }
      &:nth-child(2) {
        background: #9AD692;
        border: 1px solid #9AD692;

        &:hover {
          background: #87D57C;
          border: 1px solid #87D57C;
        }
      }
      &:nth-child(3) {
        background: #FF857A;
        border: 1px solid #FF857A;

        &:hover {
          background: #FF6C60;
          border: 1px solid #FF6C60;
        }
      }
    }
  }
  main{
    background: #fff;

    p {
      padding: $width;
      font-size: 16px;
      border-bottom: 1px solid #EBEEF7;
      img {
        margin-right: 10px;
      }
    }
    .table-box {
      padding: $width;
      margin-top: 0px;
    }
    .el-table::before {
      display: none;
    }
    .el-table td, .el-table th.is-leaf {
      border: none !important;
    }
    .el-table .head  {
      background: #EBEEF7;
      color: #666;
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
           &:nth-child(6){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
           }
        }
      }
    }
    .el-table__body {
      tr {

        &:hover {
          cursor: default;
          td {
            color: #5295EB;
          }
        }
        td {
          color: #999;
          padding: 5px 0px;
          &:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
          &:nth-child(26){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
           }
        }
      }      
    }    
  }

  .el-dialog{
    .el-dialog__body{
      padding: $width $width*5 0 $width*1.5;
      .text-right{
        text-align: right;
        line-height: $width*2;
        font-size: 16px;
      }
      .el-form-item__content{
        margin-left: 20px !important;
      }
      .upload-demo{
        margin-left: $width;
        .el-button{
          margin-right: $width;
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
    .el-dialog__close {
      position: absolute;
      top: -60px;
      right: -60px;
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 50%;
      border: 2px solid #fff; 
      color: #fff;

      &:hover {
        background: #FF6C60;
        color: #fff;
      }
    }     
  }
}
</style>
