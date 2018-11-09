<template>
  <div class="template">
    <header>
      <el-button type="success" @click="addButton">新增</el-button>
    </header>

    <main>
      <el-table
        :data="tableData"
        class="display-table"
        stripe
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="开课申请单名称"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="createdUserName"
          label="创建人"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
        </el-table-column>
        <el-table-column
          label="创建时间"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
          <template scope="scope">
            <span>{{ scope.row.createdTime | dateFormat('yyyy-MM-dd HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
          <template scope="scope">
            <p style="color: #FBC77C;" v-if="scope.row.state === 0">停用</p>
            <p style="color: #88B9FE;" v-if="scope.row.state === 1">使用中</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="220">
          <template scope="scope">
            <el-tooltip v-if="scope.row.state === 0" effect="dark" :enterable="false" content="启用" placement="right">
              <el-button size="small" @click="start(scope.row)" type="primary"><i class="iconfont icon-start"></i></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.state === 1" effect="dark" :enterable="false" content="禁用" placement="right">
              <el-button size="small" @click="start(scope.row)" type="warning"><i class="iconfont icon-stop"></i></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" :enterable="false" placement="right">
              <el-button  @click="getTemplate(scope.row)" :disabled="scope.row.usedFlag" size="small" type="primary"><i class="iconfont icon-edit"></i></el-button>
            </el-tooltip>
            <el-popover
              placement="top"
              width="160"
              v-model="scope.row.pop">
              <p>您确定要删除这一项？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.pop = false">取消</el-button>
                <el-button type="primary" size="mini" @click="delTemplate(scope.row)">确定</el-button>
              </div>
              <span slot="reference">
                <el-tooltip  effect="dark" :enterable="false" content="删除" placement="right">
                  <el-button size="small" :disabled="scope.row.usedFlag" type="danger"><i class="iconfont icon-delete"></i></el-button>
                </el-tooltip>
              </span>
              
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </main>

    <!-- 新增开课申请单 -->
    <el-dialog
      class="add-list"
      :title="titleName"
      :visible.sync="dialogVisible"
      size="tiny">
      <el-form v-if="dialogVisible" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="开课申请单名称：" prop="name">
          <el-input v-model.trim="ruleForm.name" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>

      <el-row>
        <el-col :span="12">申请单内容：</el-col>
        <el-col :span="12">
          <el-button type="success" @click="addField">新增项目</el-button>
        </el-col>
      </el-row>

      <div class="table">
        <el-table
          :data="projectList"
          border
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="项目名称"
            min-width="200">
          </el-table-column>
          <el-table-column
            label="统一填写"
            width="190">
            <template scope="scope">
              <el-radio-group v-model="scope.row.flag" @change="change(scope.row, scope.$index)">
                <el-radio class="radio" label="1">是</el-radio>
                <el-radio class="radio" label="0">否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="190">
            <template scope="scope">
              <el-button size="small" @click="editOption(scope.row, scope.$index)" v-if="!scope.row.id || scope.row.id > 0" type="primary"><i class="iconfont icon-edit"></i></el-button>
              <el-button size="small" @click="delOption(scope.row, scope.$index)" v-if="!scope.row.id || scope.row.id > 0 || scope.row.id === -3 || scope.row.id === -4 || scope.row.id === -8 || scope.row.id === -9" type="danger"><i class="iconfont icon-delete"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      

      <span slot="footer" class="dialog-footer">
        <el-button :plain="true" type="danger" @click="dialogVisible = false">取 消</el-button>
        <el-button :plain="true" type="primary" @click="save('ruleForm')">保 存</el-button>
      </span>
    </el-dialog> 

    <!-- 新增字段 -->
    <el-dialog
      :title="filedName"
      class="add-list add-field"
      :visible.sync="fieldDialogVisible"
      size="tiny">
      <el-form v-if="fieldDialogVisible" :model="fieldForm" :rules="fields" ref="fieldForm">
        <el-form-item label="字段名称：" prop="fieldNameValue">
          <el-input v-model.trim="fieldForm.fieldNameValue" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>

      <p>
        统一填写：
        <el-radio class="radio" v-model="radioValue" label="1">是</el-radio>
        <el-radio class="radio" v-model="radioValue" label="0">否</el-radio>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button :plain="true" type="danger" @click="fieldCancel">取 消</el-button>
        <el-button :plain="true" type="primary" @click="saveField('fieldForm')">保 存</el-button>
      </span>
    </el-dialog> 
  </div>
</template>

<script>
import service from '../../utils/axios.js'
// import querystring from 'querystring'
import { notice, success } from '../../api/index'
export default {
  name: 'template',
  data () {
    return {
      titleName: '',
      radioValue: '0',
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入开课申请单名称', trigger: 'blur' }
        ]
      },
      fieldForm: {
        fieldNameValue: ''
      },
      fields: {
        fieldNameValue: [
          { required: true, message: '请输入字段名称', trigger: 'blur' }
        ]
      },
      fieldDialogVisible: false,
      dialogVisible: false,
      tableData: [],
      projectList: [
        { id: -1, name: '课程类型', flag: '0' },
        { id: -2, name: '课程名称', flag: '0' },
        { id: -3, name: '开始上课时间', flag: '0' },
        { id: -4, name: '课时数', flag: '0' },
        { id: -5, name: '选课对象', flag: '0' },
        { id: -6, name: '学生性别', flag: '0' },
        { id: -7, name: '人数限额', flag: '0' },
        { id: -8, name: '教师介绍', flag: '0' },
        { id: -9, name: '课程介绍', flag: '0' },
        { id: -10, name: '上课时间', flag: '0' },
        { id: -11, name: '上课地点', flag: '0' }
      ],
      editOrAdd: true,
      optionEditOrAdd: true,
      tempId: '',
      list: [],
      deleteIds: [],
      number: '',
      optionId: '',
      editCustoms: [],
      filedName: ''
    }
  },
  methods: {
    change (val, index) {
      if (val.id > 0) {
        if (this.editCustoms.length === 0) {
          this.editCustoms.push({ id: val.id, name: val.name, flag: val.flag })
        } else {
          let a = 0
          this.editCustoms.forEach((item, index) => {
            if (item.id === val.id) {
              this.editCustoms.splice(index, 1, { id: val.id, name: val.name, flag: val.flag })
              a = 1
            }
          })
          if (a === 0) {
            this.editCustoms.push({ id: val.id, name: val.name, flag: val.flag })
          }
        }
      } else {
        let num = 0
        this.projectList.forEach((item, index) => {
          if (item.id === -11) num = index
        })
        if (index > (num + 1 + this.list.length)) {
          this.projectList.splice(index, 1, { name: val.name, flag: val.flag })
        }
      }
    },
    // 修改选项
    editOption (val, index) {
      this.filedName = '编辑字段'
      this.fieldDialogVisible = true
      this.fieldForm.fieldNameValue = val.name
      this.optionEditOrAdd = false
      this.number = index
      this.radioValue = val.flag
      if (val.id) {
        this.optionId = val.id
      } else {
        this.optionId = ''
      }
    },
    // 删除选项
    delOption (val, index) {
      this.projectList.splice(index, 1)
      if (val.id && val.id > 0) {
        this.deleteIds.push(val.id)
      }
    },
    // 启用-禁用按钮
    start (val) {
      let state = ''
      if (val.state === 0) {
        state = 1
      } else {
        state = 0
      }
      service.post(`dTemplateController/updateTemplateState`, ({
        tempId: val.id,
        state: state
      }))
      .then(res => {
        this.getTemplateList()
      })
    },
    // 新增按钮
    addButton () {
      this.titleName = '新增开课申请单'
      this.dialogVisible = true
      this.editOrAdd = true
      this.ruleForm.name = ''
      this.radioValue = '0'
      this.projectList = [
        { id: -1, name: '课程类型', flag: '0' },
        { id: -2, name: '课程名称', flag: '0' },
        { id: -3, name: '开始上课时间', flag: '0' },
        { id: -4, name: '课时数', flag: '0' },
        { id: -5, name: '选课对象', flag: '0' },
        { id: -6, name: '学生性别', flag: '0' },
        { id: -7, name: '人数限额', flag: '0' },
        { id: -8, name: '教师介绍', flag: '0' },
        { id: -9, name: '课程介绍', flag: '0' },
        { id: -10, name: '上课时间', flag: '0' },
        { id: -11, name: '上课地点', flag: '0' }
      ]
    },
    // 新增项目按钮
    addField () {
      this.filedName = '新增字段'
      // this.dialogVisible = false
      this.fieldDialogVisible = true
      this.fieldForm.fieldNameValue = ''
      this.optionEditOrAdd = true
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          if (this.editOrAdd) {
            let customJson = []
            let num = 0
            this.projectList.forEach((item, index) => {
              if (item.id === -11) num = index
            })
            customJson = this.projectList.splice(num + 1)
            service.post('/dTemplateController/addTemplate', ({
              title: this.ruleForm.name,
              typeFlag: this.projectList.filter(item => item.id === -1)[0].flag,
              nameFlag: this.projectList.filter(item => item.id === -2)[0].flag,
              startWeekFlag: this.projectList.filter(item => item.id === -3).length === 0 ? 0 : this.projectList.filter(item => item.id === -3)[0].flag,
              weekNumFlag: this.projectList.filter(item => item.id === -4).length === 0 ? 0 : this.projectList.filter(item => item.id === -4)[0].flag,
              objectFlag: this.projectList.filter(item => item.id === -5)[0].flag,
              sexFlag: this.projectList.filter(item => item.id === -6)[0].flag,
              limitFlag: this.projectList.filter(item => item.id === -7)[0].flag,
              teacherIntroFlag: this.projectList.filter(item => item.id === -8).length === 0 ? 0 : this.projectList.filter(item => item.id === -8)[0].flag,
              lessonIntroFlag: this.projectList.filter(item => item.id === -9).length === 0 ? 0 : this.projectList.filter(item => item.id === -9)[0].flag,
              lessonTimeFlag: this.projectList.filter(item => item.id === -10)[0].flag,
              locationFlag: this.projectList.filter(item => item.id === -11)[0].flag,
              startWeekDeleteFlag: this.projectList.filter(item => item.id === -3).length === 0 ? 1 : 0,
              weekNumDeleteFlag: this.projectList.filter(item => item.id === -4).length === 0 ? 1 : 0,
              teacherIntroDeleteFlag: this.projectList.filter(item => item.id === -8).length === 0 ? 1 : 0,
              lessonIntroDeleteFlag: this.projectList.filter(item => item.id === -9).length === 0 ? 1 : 0,
              customJson: JSON.stringify(customJson)
            }))
            .then(res => {
              if (res.data.code === 1) {
                this.getTemplateList()
                success(this, '保存成功', 1000)
              } else {
                notice(this, res.data.message, 2000)
              }
            })
          } else {
            let newCustomJson = []
            let num = 0
            this.projectList.forEach((item, index) => {
              if (item.id === -11) num = index
            })
            newCustomJson = this.projectList.splice(num + 1 + this.list.length)
            service.post('/dTemplateController/editTemplate', ({
              id: this.tempId,
              title: this.ruleForm.name,
              typeFlag: this.projectList.filter(item => item.id === -1)[0].flag,
              nameFlag: this.projectList.filter(item => item.id === -2)[0].flag,
              startWeekFlag: this.projectList.filter(item => item.id === -3).length === 0 ? 0 : this.projectList.filter(item => item.id === -3)[0].flag,
              weekNumFlag: this.projectList.filter(item => item.id === -4).length === 0 ? 0 : this.projectList.filter(item => item.id === -4)[0].flag,
              objectFlag: this.projectList.filter(item => item.id === -5)[0].flag,
              sexFlag: this.projectList.filter(item => item.id === -6)[0].flag,
              limitFlag: this.projectList.filter(item => item.id === -7)[0].flag,
              teacherIntroFlag: this.projectList.filter(item => item.id === -8).length === 0 ? 0 : this.projectList.filter(item => item.id === -8)[0].flag,
              lessonIntroFlag: this.projectList.filter(item => item.id === -9).length === 0 ? 0 : this.projectList.filter(item => item.id === -9)[0].flag,
              lessonTimeFlag: this.projectList.filter(item => item.id === -10)[0].flag,
              locationFlag: this.projectList.filter(item => item.id === -11)[0].flag,
              startWeekDeleteFlag: this.projectList.filter(item => item.id === -3).length === 0 ? 1 : 0,
              weekNumDeleteFlag: this.projectList.filter(item => item.id === -4).length === 0 ? 1 : 0,
              teacherIntroDeleteFlag: this.projectList.filter(item => item.id === -8).length === 0 ? 1 : 0,
              lessonIntroDeleteFlag: this.projectList.filter(item => item.id === -9).length === 0 ? 1 : 0,
              newCustomJson: JSON.stringify(newCustomJson),
              editCustomJson: JSON.stringify(this.editCustoms),
              deleteIds: JSON.stringify(this.deleteIds)
            }))
            .then(res => {
              if (res.data.code === 1) {
                success(this, '编辑成功', 1000)
                this.getTemplateList()
              } else {
                notice(this, res.data.message, 2000)
              }
            })
          }
        } else {
        }
      })
    },
    saveField (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.optionEditOrAdd) {
            this.projectList.push({ name: this.fieldForm.fieldNameValue, flag: this.radioValue })
          } else {
            if (this.optionId) {
              this.projectList.splice(this.number, 1, { id: this.optionId, name: this.fieldForm.fieldNameValue, flag: this.radioValue })
              if (this.editCustoms.length === 0) {
                this.editCustoms.push({ id: this.optionId, name: this.fieldForm.fieldNameValue, flag: this.radioValue })
              } else {
                let a = 0
                this.editCustoms.forEach((item, index) => {
                  if (item.id === this.optionId) {
                    this.editCustoms.splice(index, 1, { id: this.optionId, name: this.fieldForm.fieldNameValue, flag: this.radioValue })
                    a = 1
                  }
                })
                if (a === 0) {
                  this.editCustoms.push({ id: this.optionId, name: this.fieldForm.fieldNameValue, flag: this.radioValue })
                }
              }
            } else {
              this.projectList.splice(this.number, 1, { name: this.fieldForm.fieldNameValue, flag: this.radioValue })
            }
          }
          this.fieldDialogVisible = false
          this.dialogVisible = true
        }
      })
    },
    // 新增字段弹框取消
    fieldCancel () {
      this.fieldDialogVisible = false
      this.dialogVisible = true
    },
    // 获取开课申请单列表
    getTemplateList () {
      this.titleName = '编辑开课申请单'
      service.get('dTemplateController/getTemplateList')
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.map(item => ({...item, pop: false}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 修改之前，获取申请单内容
    getTemplate (val) {
      service.get(`/dTemplateController/getTemplate?tempId=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let list = res.data.result
          this.ruleForm.name = val.title
          this.projectList = [
            { id: -1, name: '课程类型', flag: (list.typeFlag ? '1' : '0') },
            { id: -2, name: '课程名称', flag: (list.nameFlag ? '1' : '0') },
            { id: -3, name: '开始上课时间', flag: (list.startWeekFlag ? '1' : '0') },
            { id: -4, name: '课时数', flag: (list.weekNumFlag ? '1' : '0') },
            { id: -5, name: '选课对象', flag: (list.objectFlag ? '1' : '0') },
            { id: -6, name: '学生性别', flag: (list.sexFlag ? '1' : '0') },
            { id: -7, name: '人数限额', flag: (list.limitFlag ? '1' : '0') },
            { id: -8, name: '教师介绍', flag: (list.teacherIntroFlag ? '1' : '0') },
            { id: -9, name: '课程介绍', flag: (list.lessonIntroFlag ? '1' : '0') },
            { id: -10, name: '上课时间', flag: (list.lessonTimeFlag ? '1' : '0') },
            { id: -11, name: '上课地点', flag: (list.locationFlag ? '1' : '0') }
          ]
          let num1 = 0
          this.projectList.forEach((item, index) => {
            if (item.id === -3) num1 = index
          })
          if (list.startWeekDeleteFlag) this.projectList.splice(num1, 1)

          let num2 = 0
          this.projectList.forEach((item, index) => {
            if (item.id === -4) num2 = index
          })
          if (list.weekNumDeleteFlag) this.projectList.splice(num2, 1)

          let num3 = 0
          this.projectList.forEach((item, index) => {
            if (item.id === -8) num3 = index
          })
          if (list.teacherIntroDeleteFlag) this.projectList.splice(num3, 1)

          let num4 = 0
          this.projectList.forEach((item, index) => {
            if (item.id === -9) num4 = index
          })
          if (list.lessonIntroDeleteFlag) this.projectList.splice(num4, 1)

          this.list = res.data.result.customs
          res.data.result.customs.forEach((item) => {
            this.projectList.push({ id: item.id, name: item.name, flag: String(item.flag) })
          })
          this.dialogVisible = true
          this.editOrAdd = false
          this.tempId = val.id
          this.deleteIds = []
          this.editCustoms = []
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除开课申请单
    delTemplate (val) {
      service.post(`/dTemplateController/deleteTemplate`, ({
        tempId: val.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '删除成功', 1000)
          this.getTemplateList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.getTemplateList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.template {
  margin: 0 $width;
  header {
    text-align: right;
    padding-right: $width*2;
  }

  main {
    margin-top: $width;
    padding: $width*2;
    background: $white;
    border-radius: 4px;
  }

  // 新增开课申请单
  .add-list {
    .el-dialog {
      width: 680px;

      .el-dialog__body {
        padding: $width*2;

        .el-form {
          .el-form-item__content{
            display: inline-block;
          }

          .el-input {
            width: 260px;
          }
        }

        .el-row {
          .el-col:last-child {
            margin-top: -$width/2;
            text-align: right;
          }
        }

        .table {
          margin-top: $width;
          height: 300px;
          overflow-x: hidden;

          .el-table {
            border:1px solid #BBBBBB;

            th {
              background: #E5E5E5;
              border-right:1px solid #BBBBBB;
              border-bottom:1px solid #BBBBBB;

              .cell {
                background: #E5E5E5;
              }
            }

            td {
              border-right:1px solid #BBBBBB;
              border-bottom:1px solid #BBBBBB;
            }
            
            .cell {
              text-align: center;
            }
          }
        }
      }

      .el-dialog__footer {
        .el-button:first-child {
          border: 1px solid #FF6040;
          color: #FF6040;
        }
        .el-button:last-child {
          border: 1px solid #7BB2FE;
          color: #7BB2FE;
        }
      }
    }
  }

  // 新增字段
  .add-field {
    .el-dialog {
      width: 480px;

      .el-dialog__body {
        padding-bottom: $width;

        .el-input__inner {
          width: 300px;
        }

        &>p {
          padding-left: $width/5;

          .el-radio {
            margin: 0 $width*1.5;
          }
        }
      }
    }
  }
}
</style>
