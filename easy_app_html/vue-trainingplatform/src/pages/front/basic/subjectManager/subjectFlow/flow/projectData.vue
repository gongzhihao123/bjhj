<template>
  <div class="project-data">
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
          <td>
            <span v-if="item.datumType === 1">开题资料</span>
            <span v-else-if="item.datumType === 2">中期资料</span>
            <span v-else-if="item.datumType === 3">结题资料</span>
            <span v-else-if="item.datumType === 4">研究成果</span>
            <span v-else>其他</span>
          </td>
          <td>{{item.createdTime}}</td>
          <td>
            <!--
              这其中的判断 主要是是否未当前人的判断
              还有 关于判断研究过程的判断
            -->
            <el-button type="primary" @click="changeInfo(item)" :disabled="($route.query.signFlag == 3 || $route.query.checkState == 2) ? true : user.id === item.createdUserId ? false : true">编辑</el-button>
            <el-button type="primary" @click="deleteClick(item)" :disabled="($route.query.signFlag == 3 || $route.query.checkState == 2) ? true : user.id === item.createdUserId ? false : true">删除</el-button>
          </td>
        </tr>
        <tr v-if="!tableList.length">
          <td colspan="7" style="text-align: center;">暂无数据</td>
        </tr>
      </table>

    </div>
    <div class="button-box">
        <el-button class="add-btn" type="primary" @click="addPlan" :disabled="$route.query.signFlag == 3 || $route.query.checkState == 2">上传</el-button>
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

    <el-dialog :title="dialogTitle" :visible.sync="addplanDialog" class="upload-dialog">
      <div>
        <p class="dialogP">
          <span class="label-span">资料名称：</span>
          <el-input class="levelInput" v-model="datumName" :maxlength="60"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">资料类型：</span>
          <el-select v-model="type" placeholder="请选择" class="levelInput">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </p>
        <p class="dialogP" v-if="dialogTitle === '上传资料'">
          <span class="label-span">添加资料：</span>
          <el-upload
            class="upload-demo"
            :action="uploadFiles"
            :before-upload="beforeUpload"
            multiple
            :limit="1"
            :file-list="fileList"
            ref="upload"
            :data="upload"
            name="uploadFile"
            :on-success="handleSuccess"
            :auto-upload="false">
            <el-button size="small" type="primary" class="button-upload">点击上传</el-button>
            <span class="tiptle">(只能上传.doc.docx格式的文件且大小不超过1M)</span>
          </el-upload>
        </p>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
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
import {notice, success} from '../../../../../../api/index'
import service from '../../../../../../utils/axios.js'
import { dateFormat } from '../../../../../../filters/index.js'
export default {
  name: 'project-data',
  data () {
    return {
      loading: false,
      datumName: '',
      addplanDialog: false,
      deleteDialog: false,
      checkedAll: false,
      dialogTitle: '',
      currentPage: 1,
      startDate: '',
      endDate: '',
      tableNaV: [
        {name: '资料名称'},
        {name: '上传人'},
        {name: '所属单位'},
        {name: '资料类型'},
        {name: '上传时间'},
        {name: '操作'}
      ],
      tableList: [],
      options: [
        {name: '开题资料', value: 1},
        {name: '中期资料', value: 2},
        {name: '结题资料', value: 3},
        {name: '研究成果', value: 4},
        {name: '其他', value: 5}
      ],
      type: '',
      fileList: [],
      upload: {
        tptopId: '',
        name: '',
        phaeseSort: ''
      },
      infoList: [],
      infoId: '',
      pageSize: 10,
      totalCount: 0,
      canSave: false,
      user: ''
    }
  },
  methods: {
    addPlan () {
      this.datumName = ''
      this.type = ''
      this.fileList = []
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.dialogTitle = '上传资料'
      this.addplanDialog = true
    },
    addSure () {
      if (this.dialogTitle === '上传资料') {
        if (!this.type) {
          notice(this, '请选择资料类型', 2000)
          return
        }
        var arrs = document.getElementsByClassName('el-upload-list__item-name')
        if (arrs && arrs.length > 0) {
          this.upload.tptopId = this.$route.query.item
          this.upload.name = this.datumName.trim()
          this.upload.phaeseSort = this.type
          this.canSave = true
          this.$refs.upload.submit()
        } else {
          notice(this, '请选择文件', 2000)
        }
      } else {
        this.canSave = true
        service.post(`/frontTopicManageController/updateData`, ({
          id: this.infoId,
          name: this.datumName.trim(),
          phaeseSort: this.type
        }))
        .then(res => {
          this.canSave = false
          if (res.data.code === 1) {
            this.addplanDialog = false
            success(this, '编辑成功', 2000)
            this.checkedAll = false
            this.getList()
          } else {
            this.canSave = false
            notice(this, res.data.messaage || '编辑失败', 2000)
          }
        })
      }
    },
    changeInfo (item) {
      this.infoId = item.id
      this.datumName = item.name
      this.type = Number(item.datumType)
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
      service.post(`/frontTopicManageController/deleteData`, ({
        ids: this.infoList
      }))
      .then(res => {
        this.canSave = false
        if (res.data.code === 1) {
          success(this, res.data.message || '删除成功', 2000)
          this.deleteDialog = false
          this.checkedAll = false
          this.getList()
        }
      })
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
    getList () {
      this.loading = true
      service.get(`/frontTopicManageController/selectDataList?tptopId=${this.$route.query.item}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result.list || []).map(item => ({
            ...item,
            createdTime: dateFormat(item.createdTime, 'yyyy-MM-dd')
          }))
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.message || '获取失败', 2000)
        }
        this.loading = false
      })
      .catch(_ => {
        this.loading = false
      })
    },
    handleSuccess (data) {
      this.canSave = false
      if (data.code === 1) {
        this.addplanDialog = false
        success(this, '提交成功', 2000)
        this.getList()
      } else {
        notice(this, data.message || '上传失败', 2000)
      }
    }
    // getTypeList () {
    //   service.get(`/frontTopicManageController/selectPhasesList?tptopId=${this.$route.query.item}`)
    //   .then(res => {
    //     if (res.data.code === 1) {
    //       this.options = (res.data.result || []).map(item => ({
    //         ...item,
    //         value: item.id
    //       }))
    //     }
    //   })
    // }
  },
  computed: {
    uploadFiles () {
      let path = document.querySelector('#contextPath').value
      return `${path}/frontTopicManageController/uploadData`
    }
  },
  created () {
    this.getList()
    setTimeout(() => {
      this.user = this.$store.state.user
    }, 1000)
  }
}
</script>

<style lang="scss">
.project-data {
  width: 100%;
  height: 100%;
  .button-upload {
  background: #A1ADCC;
  padding: 5px !important;
  border: 1px solid #A1ADCC;
}
.el-upload-list__item-status-label {
  display: block !important;
}

  .button-box {
    margin-top: 20px;
    .el-button {
      padding: 10px 25px;

      &:nth-child(2) {
        background: #FF6C60;
        border: 1px solid #FF6C60;
      }      
    }    
    .el-pagination {
      float: right;
    }
  }

  .table-box {
    padding: 20px;
    background: #fff;

    table {
      width: 100%;
      tr {
        cursor:　pointer;
        &:hover {
          background: #F1F3F9;
          
          td {
            color: #5295EB;
            &>.el-button {
              padding: 6px 15px;
                &:nth-child(2) {
                  background: #FF6C60;
                  border: 1px solid #FF6C60;
                }             
              &>span {
                display: inline-block;
                text-align: center;
              }
            }            

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
            &:nth-child(7){
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
    .upload-demo {
      display: inline-block;
      margin-left: 30px;
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
  }
  .upload-dialog {
    .el-dialog__footer {
      margin-top: 40px;
    }
  }
}
</style>
