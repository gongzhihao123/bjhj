<template>
  <div class="subject-type">
    <header>
        <img src="../../../../src/assets/images/courseManager/manager-iocn.png"><span>课题管理</span>
    </header>

    <main>
      <p><img src="../../../assets/images/circle-icon.png">课题分类管理</p>
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
          label="课题分类"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
      </el-table>
      </div>
    </main>
    <div class="button-group">
      <el-button @click="add"><img src="../../../../src/assets/images/courseManager/add-guide.png">添加</el-button>
      <el-button  @click="edit" :disabled="count !== 1 || count === 0"><img src="../../../../src/assets/images/courseManager/edit-btn.png">修改</el-button>
      <el-button type="primary" :disabled="count < 1" @click="deletelist"><img src="../../../../src/assets/images/courseManager/delete-btn.png">删除</el-button>
      <span class="count">已选 {{count}} 条</span>
    </div>
    <!-- 弹出框 -->
    <el-dialog
      title="课题分类"
      :visible.sync="dialogVisible"
      width="500px">
      
      <el-form :model="newData" ref="newData" label-width="100px" class="demo-ruleForm" v-if="dialogVisible">
        <el-row>
          <el-col :span="7" class="text-right">课题类别名称：</el-col>
          <el-col :span="17">
            <el-form-item
              prop="newName"
              :rules="[
                { required: true, message: '课题类别名称不能为空'},
              ]"
            >
              <el-input type="newName" v-model="newData.newName" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('newData')">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import service from '../../../utils/axios.js'
import { notice, success } from '../../../api/index.js'
export default {
  name: 'subject-type',
  data () {
    return {
      dialogVisible: false,
      count: 0,
      addflag: true,
      loading: false,
      id: '',
      newData: {
        newName: ''
      },
      tableData: [],
      selection: []
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          if (this.addflag) {
            service.post('backTopicTypeController/addClassify', {
              name: this.newData.newName
            })
            .then(res => {
              if (res.data.code !== 1) {
                notice(this, res.data.message, 2000)
              } else {
                success(this, res.data.message, 2000)
                this.newData = {}
                this.getData()
              }
            })
            .catch(res => {
              notice(this, res.data.message, 2000)
            })
          } else {
            service.post('backTopicTypeController/updeteClassify', {
              name: this.newData.newName,
              id: this.id
            })
            .then(res => {
              if (res.data.code !== 1) {
                notice(this, res.data.message, 2000)
              } else {
                success(this, res.data.message, 2000)
                this.newData = {}
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
    add () {
      this.dialogVisible = true
      this.addflag = true
      this.newData.newName = ''
    },
    edit () {
      if (this.count > 1) {
        notice(this, '请选择一个课题分类名称进行修改', 2000)
        return
      }
      this.newData.newName = this.selection[0].name
      this.dialogVisible = true
      this.addflag = false
    },
    deletelist () {
      service.post('backTopicTypeController/deleteClassify', {
        ids: this.ids
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
    },
    choose (selection, row) {
      this.count = selection.length
      this.ids = selection.map(n => n.id).join(',')
      this.selection = [...selection]
      this.newData.newName = selection[0].name
      this.id = selection[0].id
    },
    selectAll (selection) {
      this.count = selection.length
      this.selection = [...selection]
      this.ids = selection.map(n => n.id).join(',')
      if (this.count === 1) {
        this.id = selection[0].id
      }
    },
    getData () {
      this.loading = true
      this.count = 0
      setTimeout(() => {
        service.get(`backTopicTypeController/getClassify`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.result
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
  created () {
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.subject-type{
  padding-bottom: 20px;

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
           &:nth-child(2){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
           }
        }
      }
    }
    .el-table td, .el-table th.is-leaf {
      border: none !important;
    }
    .el-table .head  {
      background: #EBEEF7;
      color: #666;
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
           &:nth-child(2){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
           }
        }
      }
    } 


  }
  .button-group {
    margin-top: 20px;
    .count {
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
  .el-dialog{
    .el-dialog__body{
      padding: 50px;

      .text-right{
        text-align: right;
        line-height: $width*2;
        font-size: 16px;
      }
      .el-form-item__content{
        margin-left: 20px !important;
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
