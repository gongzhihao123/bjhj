<template>
  <div class="study-log">
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
          <td>{{item.name}}</td>
          <td>{{item.createdUserName}}</td>
          <td>{{item.companyName}}</td>
          <td>{{item.createdTime}}</td>
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
        <el-button class="add-btn" type="primary" @click="addPlan" :disabled="$route.query.signFlag == 3 || $route.query.checkState == 2">写日志</el-button>
        <el-button class="delete-btn" type="primary" @click="deleteClick" :disabled="$route.query.signFlag == 3 || $route.query.checkState == 2">删除</el-button>      
        <el-pagination
        v-if="tableList.length > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    
    <el-dialog :title="dialogTitle" :visible.sync="addplanDialog">
      <div>
        <p class="dialogP">
          <span class="label-span">标题：</span>
          <el-input class="levelInput" v-model="logTitle" :maxlength="60"></el-input>
        </p>
        <p>
          <span class="label-span" style="vertical-align: top;">内容：</span>
          <textarea class="levelInput" style="resize: none;overflow-x: hidden;" cols="20" rows="5" v-model="logContent"></textarea>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSure" :disabled="canSave">确 定</el-button>
        <el-button @click="addplanDialog = false" class="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="deleteDialog">
      <div>
        <span>确定删除选中的信息吗？</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteSure" :disabled="canSave">确 定</el-button>
        <el-button @click="deleteDialog = false" class="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import service from '../../../../../../utils/axios.js'
import {notice, success} from '../../../../../../api/index'
import { dateFormat } from '../../../../../../filters/index.js'
export default {
  name: 'study-log',
  data () {
    return {
      loading: false,
      logTitle: '',
      logContent: '',
      checkedAll: false,
      deleteDialog: false,
      addplanDialog: false,
      currentPage: 1,
      dialogTitle: '',
      startDate: '',
      endDate: '',
      tableNaV: [
        {name: '日志名称'},
        {name: '编写人'},
        {name: '所属单位'},
        {name: '上传时间'},
        {name: '操作'}
      ],
      tableList: [],
      infoList: [],
      infoId: '',
      pageSize: 10,
      totalCount: 0,
      canSave: false
    }
  },
  methods: {
    addPlan () {
      this.logTitle = ''
      this.logContent = ''
      this.dialogTitle = '写日志'
      this.addplanDialog = true
    },
    addSure () {
      if (!this.logTitle.trim()) {
        notice(this, '请填写日志标题', 2000)
        return
      }
      if (!this.logContent.trim()) {
        notice(this, '请填写日志内容', 2000)
        return
      }
      if (this.dialogTitle === '写日志') {
        this.canSave = true
        service.post(`/frontTopicManageController/addResearchLog`, ({
          tptopId: this.$route.query.item,
          name: this.logTitle,
          content: this.logContent
        }))
        .then(res => {
          this.canSave = false
          if (res.data.code === 1) {
            this.getList()
            success(this, res.data.message || '提交成功', 2000)
            this.addplanDialog = false
          }
        })
      } else {
        this.canSave = true
        service.post(`/frontTopicManageController/updateResearchLog`, ({
          id: this.infoId,
          name: this.logTitle,
          content: this.logContent
        }))
        .then(res => {
          this.canSave = false
          if (res.data.code === 1) {
            this.getList()
            success(this, res.data.message || '编辑成功', 2000)
            this.checkedAll = false
            this.addplanDialog = false
          }
        })
      }
    },
    changeInfo (item) {
      this.infoId = item.id
      this.logTitle = item.name
      this.logContent = item.content
      this.dialogTitle = '编辑'
      this.addplanDialog = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
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
      service.post(`/frontTopicManageController/deleteResearchLog`, ({
        ids: this.infoList
      }))
      .then(res => {
        this.canSave = false
        if (res.data.code === 1) {
          success(this, res.data.message || '删除成功', 2000)
          this.deleteDialog = false
          this.checkedAll = false
          this.getList()
        } else {
          notice(this, res.data.message || '删除失败', 2000)
        }
      })
    },
    getList () {
      this.loading = true
      service.get(`/frontTopicManageController/researchLogList?tptopId=${this.$route.query.item}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result.list || []).map(item => ({
            ...item,
            createdTime: dateFormat(item.createdTime, 'yyyy-MM-dd')
          }))
        } else {
          notice(this, res.data.message || '获取失败', 2000)
        }
        this.totalCount = res.data.result.totalCount
        this.loading = false
      }).catch(_ => {
        this.loading = false
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss">
.study-log {

  .table-box {
    padding: 20px;
    background: #fff;

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
  .button-box {
    margin-top: 20px;
    .el-pagination {
      float: right;
    }
  }
  .el-button {
    padding: 10px 25px;
    
    &:nth-child(2) {
      background: #FF6C60;
      border: 1px solid #FF6C60;
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
      width: 80px;
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
    .upload-demo {
      display: inline-block;
      margin-left: 6px;
    }
    textarea {
      border-color: #d8dce5;
    }
  }
}
</style>
