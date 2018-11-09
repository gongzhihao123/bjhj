<template>
  <div class="submitPlan">
    <div class="table-box" v-loading="loading">
      <table>
        <tr>
          <th v-for="item in tableNaV" :key="item.name">{{item.name}}</th>
        </tr>
        <tr v-for="item in tableList" :key="item.name">
          <td>{{item.reportName}}</td>
          <td>{{item.phasesName}}</td>
          <td>{{item.createdTime}}</td>
          <td>
            <span v-if="item.checkState === 0" style="color: #5295EB;">待审核</span>
            <span v-else-if="item.checkState === 1" style="color: #90D886;">通过</span>
            <span v-else-if="item.checkState === 2" style="color: #FF6C60;">未通过</span>
            <span v-else-if="item.checkState === 3" style="color: #FF6C60;">建议修改</span>
          </td>
          <td>
            <el-button @click="assessClick(item)" type="primary">查看</el-button></td>
          <td>
            <el-button @click="changeInfo(item)" type="primary" v-show="item.checkState == 3" :disabled="$route.query.signFlag == 3">编辑</el-button>
            <el-button @click="deleteClick(item)" type="primary" :disabled="item.checkState != 0 || $route.query.signFlag == 3 || $route.query.checkState == 2">删除</el-button>
            <el-button class="delete-btn" type="primary" @click="out(item)" :disabled="$route.query.signFlag == 3 || $route.query.checkState == 2">导出报告</el-button>
          </td>
        </tr>
        <tr v-if="!tableList.length">
          <td colspan="6" style="text-align: center;">暂无数据</td>
        </tr>
      </table>
    </div>
    <el-button class="add-btn" type="primary" @click="submitPlan" :disabled="lis != 0 || $route.query.signFlag == 3 || $route.query.checkState == 2">提交</el-button>
    
    <el-dialog :title="dialogTitle" :visible.sync="addplanDialog" class="add">
      <div>
        <p class="dialogP"><span class="label-span">报告名称：</span><el-input class="levelInput" v-model="report" :maxlength="60"></el-input></p>
        <p class="dialogP">
          <span class="label-span">报告类型：</span>
          <el-select v-model="type" placeholder="请选择" class="levelInput" :disabled="dialogTitle == '编辑'">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.phasesName"
              :disabled="item.value != $route.query.stage"
              :value="item.value">
            </el-option>
          </el-select>
        </p>
        <p class="dialogP" style="margin-bottom: 20px;">
          <span class="label-span">添加报告：</span>
          <el-upload
            class="upload-demo"
            :action="uploadFiles"
            :before-upload="beforeUpload"
            :limit="1"
            :file-list="fileList"
            ref="upload"
            :data="uploadData"
            name="uploadFile"
            :auto-upload="false"
            :on-success="handleSuccess">
            <el-button size="small" type="primary" @mouseup.native="changeFile" class="button-upload">选择文件</el-button>
            <span class="tiptle">(只能上传.doc.docx格式的文件且大小不超过1M)</span>
          </el-upload>
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

    <!-- 评审意见 -->
    <el-dialog title="评价内容" :visible.sync="assessDialog">
      <div>
        <textarea cols="63" rows="6" style="resize: none;" v-model="textContent" :readonly="true"></textarea>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {notice, success} from '../../../../../../api/index'
import service from '../../../../../../utils/axios.js'
import { dateFormat } from '../../../../../../filters/index.js'
export default {
  name: 'submitPlan',
  data () {
    return {
      loading: false,
      report: '',
      dialogTitle: '',
      assessDialog: false,
      addplanDialog: false,
      deleteDialog: false,
      currentPage4: 1,
      startDate: '',
      endDate: '',
      textContent: '',
      tableNaV: [
        {name: '报告名称'},
        {name: '报告类型'},
        {name: '上传时间'},
        {name: '审核状态'},
        {name: '评审意见'},
        {name: '操作'}
      ],
      tableList: [],
      options: [],
      type: '',
      fileList: [],
      uploadData: {
        tptopId: '',
        name: '',
        phaeseSort: '',
        id: ''
      },
      infoList: [],
      canSave: false,
      li: [],
      lis: [],
      modState: false,
      fileId: '',
      fileName: ''
    }
  },
  computed: {
    uploadFiles () {
      let path = document.querySelector('#contextPath').value
      if (this.dialogTitle === '提交报告') {
        return `${path}/frontTopicManageController/addReport`
      } else {
        return `${path}/frontTopicManageController/updateRoportFile`
      }
    }
  },
  methods: {
    // 导出
    out (item) {
      let path = document.getElementById('contextPath').value
      window.location.href = `${path}/frontTopicManageController/downloadReport?id=${item.id}`
    },
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'doc' || arr[arr.length - 1] === 'docx') {
          resolve()
        } else {
          this.canSave = false
          notice(this, '请上传正确格式文件', 2000)
          reject(arr)
        }
      })
    },
    getTypeList () {
      service.get(`/frontTopicManageController/selectPhasesList?tptopId=${this.$route.query.item}`)
      .then(res => {
        if (res.data.code === 1) {
          this.options = (res.data.result || []).map(item => ({
            ...item,
            value: item.id
          }))
        }
      })
    },
    submitPlan () {
      this.report = ''
      this.type = ''
      this.fileList = []
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.dialogTitle = '提交报告'
      this.addplanDialog = true
      this.getTypeList()
    },
    changeFile (file, fileList) {
      this.fileList[0].url = true
    },
    changeInfo (item) {
      this.fileList = []
      this.modState = false
      this.report = item.reportName
      this.type = item.phasesId
      this.uploadData.id = item.id
      this.fileName = item.fileName
      this.fileId = item.fileId
      let obj = {
        name: item.fileName,
        url: ''
      }
      this.fileList.push({...obj})
      this.dialogTitle = '编辑'
      this.addplanDialog = true
      this.getTypeList()
    },
    handleSuccess (data) {
      this.canSave = false
      this.addplanDialog = false
      this.getList()
      if (data.result.fileId) {
        this.fileId = data.result.fileId
        this.fileName = data.result.fileName
        this.uploadData.tptopId = this.$route.query.item
        this.uploadData.name = this.report.trim()
        this.uploadData.phaeseSort = this.type
        service.post('/frontTopicManageController/updateReport', ({
          id: this.uploadData.id,
          name: this.report.trim(),
          fileId: this.fileId,
          fileName: this.fileName
        }))
        .then(res => {
          this.canSave = false
          if (res.data.code === 1) {
            this.getList()
            this.addplanDialog = false
            success(this, res.data.message || '修改成功', 2000)
          } else {
            notice(this, res.data.message || '修改失败', 2000)
          }
        })
      } else {
        if (data.code === 1) {
          this.addplanDialog = false
          success(this, '提交成功', 2000)
          this.getList()
        } else {
          notice(this, data.message || '上传失败', 2000)
        }
      }
    },
    addSure () {
      if (this.dialogTitle === '提交报告') {
        if (!this.type) {
          notice(this, '请选择报告类型', 2000)
          return
        }
        var arrs = document.getElementsByClassName('el-upload-list__item-name')
        if (arrs && arrs.length > 0) {
          this.uploadData.tptopId = this.$route.query.item
          this.uploadData.name = this.report.trim()
          this.uploadData.phaeseSort = this.type
          this.canSave = true
          this.$refs.upload.submit()
        } else {
          notice(this, '请选择文件', 2000)
        }
      } else if (this.dialogTitle === '编辑') {
        if (this.fileList[0].url) {
          this.$refs.upload.submit()
        } else {
          var arr = document.getElementsByClassName('el-upload-list__item-name')
          if (arr && arr.length > 0) {
            this.uploadData.tptopId = this.$route.query.item
            this.uploadData.name = this.report.trim()
            this.uploadData.phaeseSort = this.type
            service.post('/frontTopicManageController/updateReport', ({
              id: this.uploadData.id,
              name: this.report.trim(),
              fileId: this.fileId,
              fileName: this.fileName
            }))
            .then(res => {
              this.canSave = false
              if (res.data.code === 1) {
                this.getList()
                this.addplanDialog = false
                success(this, res.data.message || '修改成功', 2000)
              } else {
                notice(this, res.data.message || '修改失败', 2000)
              }
            })
          } else {
            notice(this, '请选择文件', 2000)
          }
        }
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
      service.post(`/frontTopicManageController/deleteReport`, ({
        ids: this.infoList
      }))
      .then(res => {
        this.canSave = false
        if (res.data.code === 1) {
          success(this, res.data.message || '删除成功', 2000)
          this.deleteDialog = false
          this.getList()
        }
      })
    },
    assessClick (item) {
      this.assessDialog = true
      this.textContent = item.opinion
    },
    getList () {
      this.loading = true
      service.get(`/frontTopicManageController/selectReport?tptopId=${this.$route.query.item}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result || []).map(item => ({
            ...item,
            createdTime: dateFormat(item.createdTime, 'yyyy-MM-dd')
          }))
          this.lis = this.tableList.filter(item => String(item.phasesId) === String(this.$route.query.stage)).length
          // this.li = this.tableList.filter(item => String(item.phasesId) === String(this.$route.query.stage) && item.checkState === 3).length
        } else {
          notice(this, res.data.message || '获取失败', 2000)
        }
        this.loading = false
      })
      .catch(_ => {
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
.submitPlan {

.button-upload {
  background: #A1ADCC;
  padding: 5px !important;
  border: 1px solid #A1ADCC;
}
.el-upload-list__item-status-label {
  display: block !important;
}
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
              width: 86px;
              padding: 6px 15px;
              margin-top: 0px;

                &:nth-child(2) {
                  background: #FF6C60;
                  border: 1px solid #FF6C60;
                }             
              &>span {
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
  .el-button {
    padding: 10px 25px;
    margin-top: 10px;
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
      float: left;
    }
    .levelInput {
      width: 300px;
      margin-left: 10px;
    }
    .datePicker {
      margin-left: 6px;
      width: 144px;
    }
    .el-upload {
      .el-button {
        display: block;
      }
    }
    .tiptle {
      margin-left: 0px;
    }
    .upload-demo {
      display: inline-block;
      float: left;
      margin-left: 10px;
      .el-upload-list {
        height: 50px;
        max-height: 50px;
        overflow: auto;
        li {
          overflow-x: auto;
          width: 439px;
        }
      }
    }
    .tiptle {
      color: #ccc;
      font-size: 12px;
      margin-left: 10px;
    }
    // .fileLists {
      // width: 86%;
      // height: 70px;
      // max-height: 70px;
      // overflow: auto;
      // margin: 10px 0 20px 36px;
      // li {
      //   line-height: 26px;
      //   height: 26px;
      // }
    // }
  }
  .add {
    .el-dialog__footer {
      margin-top: 40px;
    }
  }
}
</style>
