<template>
  <div class="policy-document">
    <header>
        <img src="../../../../src/assets/images/courseManager/manager-iocn.png"><span>政策文件管理</span>
    </header>
    <main>
      <el-table
        :data="tableData"
        v-loading="taloading"
        stripe
        @select-all="selectAll"
        @select="choose"
        style="width: 100%">
        <el-table-column
          type="selection"
          show-overflow-tooltip
          label-class-name="head"
          width="80">
        </el-table-column>
        <el-table-column
          label="序号"
          show-overflow-tooltip
          label-class-name="head"
          width="80">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="标题"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span @click="look(scope.row)">{{scope.row.titleName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="建立时间"
          width="260"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span>{{scope.row.createdTime | dateFormat('yyyy-MM-dd HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="文件类型"
          show-overflow-tooltip
          width="220"
          label-class-name="head">
          <template slot-scope="scope">
            <span v-if="scope.row.policyType === 1">文件发布</span>
            <span v-if="scope.row.policyType === 2">资料提交</span>
          </template>
        </el-table-column>
        </el-table-column>
      </el-table>    
      </main>

      <div class="button-box">
        <el-button  @click="add"><img src="../../../assets/images/courseManager/publish.png">发布</el-button>
        <el-button  @click="edit" :disabled="count > 1 || count === 0"><img src="../../../assets/images/courseManager/edit-btn.png">编辑</el-button>
        <el-button  @click="deleteList" :disabled="count === 0"><img src="../../../assets/images/courseManager/delete-btn.png">删除</el-button>

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

    <!-- 添加/修改 -->
    <el-dialog
      :title="editflag ? '编辑政策文件' : '发布政策文件'"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="30%"
      center
      v-if="centerDialogVisible">
      <el-form :model="newData" ref="newData">
        <el-form-item
         prop="input"
        :rules="[{ required: true, message: '标题名称不能为空'}]">
        <span>标题：</span>
        <el-input type="text" v-model="newData.input" :maxlength="55"></el-input>
      </el-form-item>
      <el-form-item
        prop="htmlStr"
        :rules="[{ required: true, message: '内容不能为空'}]">
        <span>内容：</span>
        <Ueditor v-if="centerDialogVisible" @ready="editorReady" class="ueditor" ref="ueditorRef"></Ueditor>        
      </el-form-item>
      <el-form-item>
        <span>类型：</span>
        <el-radio v-model="newData.radio" label="1" :disabled="alength !== 0">文件发布</el-radio>
        <el-radio v-model="newData.radio" label="2" :disabled="alength !== 0">资料提交</el-radio>   
      </el-form-item>
      <el-form-item>
        <span class="uploadList">附件：</span>
        <el-upload
          class="upload-demo"
          :action="action"
          :before-upload="beforeUpload"
          name="uploadFile"
          :on-success="Success"
          multiple
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :file-list="fileList"
          v-if="!editflag">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传doc/docx/xls/xlsx文件</div>
        </el-upload>        
        <h4 v-if="editflag">附件列表</h4>
          <el-upload
            class="upload-demo"
            :action="action"
            :before-upload="beforeUpload"
            name="uploadFile"
            :on-success="Success"
            multiple
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :file-list="efileList"
            v-if="editflag">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传doc/docx/xls/xlsx文件</div>
          </el-upload>
          <h4 class="title" v-if="editflag && alength !== 0">资料提交列表</h4>       
          <el-upload
            class="upload-demo"
            :action="action"
            :before-upload="beforeUpload"
            name="uploadFile"
            :on-success="Success"
            multiple
            :on-remove="handleRemove"
            :file-list="afileList"
            v-if="editflag">
          </el-upload> 
      </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit('newData')">确 定</el-button>        
        <el-button @click="cancel">取 消</el-button>
      </span>
  </el-dialog>  
  
  <!-- 详情 -->
    <el-dialog
    title="政策文件详情"
    :visible.sync="detailVisible"
    :close-on-click-modal="false"
    width="30%"
    center
    v-if="detailVisible">
    <el-form :model="detailData">
      <el-form-item>
      <span>标题：</span>
      <span>{{detailData.titleName}}</span>
    </el-form-item>
    <el-form-item>
      <span>内容：</span>
      <Ueditor v-if="detailVisible" @ready="editorReady" class="ueditor unedit"></Ueditor>        
    </el-form-item>
    <el-form-item>
      <span>类型：</span>
      <el-radio v-model="detailData.radio" label='1' :disabled="true">文件发布</el-radio>
      <el-radio v-model="detailData.radio" label='2' :disabled="true">资料提交</el-radio>   
    </el-form-item>
    <el-form-item>
      <span class="uploadList">附件：</span>
      <ul class="left">
        <li v-if="elength !== 0"><h4>附件列表</h4></li>
        <li v-for="(item, index) in efileList" @click="lookDetail(item.id)" class="list"><a>{{item.fileName}}</a></li>
      </ul>
      <ul class="right">
        <li v-if="alength !== 0"><h4>资料提交列表</h4></li>
        <li v-for="(item, index) in afileList" @click="lookDetail(item.id)" class="list"><a>{{item.fileName}}</a></li>        
      </ul>
    </el-form-item>
    </el-form>
  </el-dialog>  
  </div>
</template>

<script>
import service from '../../../utils/axios.js'
import { notice, success } from '../../../api/index.js'
import Ueditor from '../../../components/Ueditor'
export default {
  name: 'policy-document',
  data () {
    return {
      currentPage: 1,
      taloading: false,
      pageSize: 10,
      totalCount: 0,
      lookflag: false,
      elength: 0,
      alength: 0,
      upIds: [],
      fileList: [],
      fileIds: [],
      uploadFile: '',
      detailData: {
        titleName: '',
        radio: '',
        htmlStr: ''
      },
      uloading: false,
      editflag: false,
      efileList: [],
      newData: {
        input: '',
        radio: '1',
        htmlStr: ''
      },
      tableData: [],
      afileList: [],
      centerDialogVisible: false,
      detailVisible: false,
      UE: {},
      content: '',
      count: 0,
      ids: '',
      selection: []
    }
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/backPolicyFileController/uploadFile`
    }
  },
  methods: {
    handleRemove (file) {
      if (!this.editflag) {
        let a = this.fileIds.indexOf(file.id)
        this.fileIds.splice(a, 1)
      } else {
        if (this.efileList.some(item => item.id === file.id)) {
          this.selection[0].fileIds = this.selection[0].fileIds.replace(file.id, '')
          this.selection[0].fileIds = this.selection[0].fileIds.split(',').filter(item => item).join(',')
          service.post(`backPolicyFileController/deletePolicyFile`, {
            id: this.selection[0].id,
            uploadFileIds: file.id,
            subFileIds: ''
          })
          .then(res => {
            if (res.data.code !== 1) {
              notice(this, res.data.message, 2000)
            } else {
              success(this, res.data.message, 2000)
            }
          })
        } else if (this.afileList.some(item => item.id === file.id)) {
          this.selection[0].subFileIds = this.selection[0].subFileIds.replace(file.id, '')
          this.selection[0].subFileIds = this.selection[0].subFileIds.split(',').filter(item => item).join(',')
          service.post(`backPolicyFileController/deletePolicyFile`, {
            id: this.selection[0].id,
            uploadFileIds: '',
            subFileIds: file.id
          })
          .then(res => {
            if (res.data.code !== 1) {
              notice(this, res.data.message, 2000)
            } else {
              success(this, res.data.message, 2000)
            }
          })
        }
      }
      this.elength = this.selection[0].fileIds.split(',').filter(item => item).length
      this.alength = this.selection[0].subFileIds.split(',').filter(item => item).length
    },
    Success (response) {
      if (!this.editflag) {
        this.fileIds.push(response.result)
      } else {
        this.upIds.push(response.result)
      }
    },
    lookDetail (id) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/backPolicyFileController/downloadFile?fileId=${id}`
    },
    look (row) {
      this.lookflag = true
      this.detailVisible = true
      service.get(`backPolicyFileController/getPolicyDetails?policyId=${row.id}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.detailData.radio = String(res.data.result.tpPolicy.policyType)
          this.efileList = res.data.result.uploadFileList || []
          this.afileList = res.data.result.subFileList || []
          this.elength = this.efileList.length
          this.alength = this.afileList.length
          this.detailData.titleName = res.data.result.tpPolicy.titleName
          this.detailData.htmlStr = res.data.result.tpPolicy.content
        }
      })
    },
    editorReady (instance) {
      this.UE = instance
      if (!this.lookflag) {
        setTimeout(() => {
          instance.setContent(this.newData.htmlStr)
          instance.setEnabled('inserthtml')
          instance.addListener('contentChange', () => {
            this.newData.htmlStr = instance.getContent()
          })
        }, 200)
      } else {
        setTimeout(() => {
          instance.setContent(this.detailData.htmlStr)
          instance.setDisabled('inserthtml')
          instance.addListener('contentChange', () => {
            this.detailData.htmlStr = instance.getContent()
          })
        }, 100)
      }
    },
    add () {
      this.lookflag = false
      this.centerDialogVisible = true
      this.editflag = false
      this.newData.radio = '1'
      this.newData.htmlStr = ''
      this.detailData.htmlStr = ''
      this.newData.input = ''
      this.afileList = []
      this.efileList = []
      this.elength = this.efileList.length
      this.alength = this.afileList.length
      this.fileList = []
      this.fileIds = []
      setTimeout(() => {
        this.$nextTick(() => {
          this.editorReady(this.$refs.ueditorRef.instance)
        })
      }, 200)
    },
    edit () {
      this.centerDialogVisible = true
      this.afileList = []
      this.efileList = []
      this.editflag = true
      this.lookflag = false
      this.newData.input = this.selection[0].titleName
      this.newData.radio = String(this.selection[0].policyType)
      this.newData.htmlStr = this.selection[0].content
      if (this.selection[0].uploadFileList) {
        this.selection[0].uploadFileList.map(item => {
          this.efileList.push({name: item.fileName, url: item.filePath, id: item.id})
        })
      }
      if (this.selection[0].subFileList) {
        this.selection[0].subFileList.map(item => {
          this.afileList.push({name: item.fileName, url: item.filePath, id: item.id})
        })
      }
      this.elength = this.efileList.length
      this.alength = this.afileList.length
      this.$nextTick(() => {
        this.editorReady(this.$refs.ueditorRef.instance)
      })
    },
    deleteList () {
      service.post(`backPolicyFileController/deletePolicyt`, {
        ids: this.ids
      })
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          success(this, res.data.message, 2000)
          this.taloading = true
          service.get(`backPolicyFileController/getPolicyList?pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
          .then(res => {
            if (res.data.code !== 1) {
              notice(this, res.data.message, 2000)
            } else {
              this.taloading = false
              this.tableData = res.data.result.list
              this.totalCount = res.data.result.totalCount
              if (this.tableData.length === 0 && this.currentPage !== 1) {
                this.currentPage = this.currentPage - 1
                this.getData()
              }
            }
          })
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    choose (selection, row) {
      this.selection = selection
      this.count = selection.length
      this.ids = selection.map(n => n.id).join(',')
    },
    selectAll (selection) {
      this.selection = selection
      this.count = selection.length
      this.ids = selection.map(n => n.id).join(',')
    },
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'xls' || arr[arr.length - 1] === 'xlsx' || arr[arr.length - 1] === 'doc' || arr[arr.length - 1] === 'docx') {
          resolve()
        } else {
          notice(this, '请上传正确格式文件', 2000)
          reject(arr)
        }
      })
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.centerDialogVisible = false
          if (!this.editflag) {
            // 添加
            service.post(`backPolicyFileController/addPolicy`, {
              titleName: this.newData.input,
              content: this.newData.htmlStr,
              type: this.newData.radio,
              uploadFileIds: this.fileIds.join(',')
            })
            .then(res => {
              if (res.data.code !== 1) {
                notice(this, res.data.message, 2000)
              } else {
                success(this, res.data.message, 2000)
                this.fileIds = []
                this.getData()
                this.count = 0
              }
            })
          } else {
            // 修改
            service.post(`backPolicyFileController/updatePolic`, {
              id: this.selection[0].id,
              titleName: this.newData.input,
              content: this.newData.htmlStr,
              type: this.newData.radio,
              uploadFileIds: this.upIds.join(',')
            })
            .then(res => {
              if (res.data.code !== 1) {
                notice(this, res.data.message, 2000)
              } else {
                success(this, res.data.message, 2000)
                this.getData()
                this.count = 0
                this.upIds = []
              }
            })
          }
        } else {
          return false
        }
      })
    },
    cancel () {
      this.centerDialogVisible = false
    },
    getData () {
      this.taloading = true
      setTimeout(() => {
        service.get(`backPolicyFileController/getPolicyList?pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
        .then(res => {
          if (res.data.code !== 1) {
            notice(this, res.data.message, 2000)
          } else {
            this.tableData = res.data.result.list
            this.totalCount = res.data.result.totalCount
            this.taloading = false
          }
        })
      }, 200)
    }
  },
  components: {
    Ueditor
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.policy-document{
    padding-bottom: $width;


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

    .el-table td:first-child .cell, .el-table th:first-child .cell {
      padding-left: 10px;
    }

    header {
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

    .title {
      margin-top: 10px;
    }

    .uploadList {
      width: 100%;
      display: block;
    }

    .metal {
      width: 100%;
      margin-top: 15px;
    }
    .left, .right {
      width: 100%;
      margin-top: 5px;
      background: #fff;
    }
    
    &>.el-upload-list {
      .el-icon-close, .el-icon-close-tip, .el-upload-list__item-status-label {
        display: none !important;
      }
    }
    .list {
      &>a {
        color: #1AB3F7;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .edui-editor {
      .edui-editor-iframeholder {
          height: 180px !important;
      }
    }

    .unedit {
      .edui-editor {
        .edui-editor-toolbarbox {
          display: none;
        }
        .edui-editor-iframeholder {
          height: 270px !important;
        }
      }
    }
    .el-form-item__content {
      line-height: 23px;
    }    
    .button-box {
      margin-top: $width;
      .el-pagination {
        float: right;
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
    main {
      background: #fff;
      padding: $width;   


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
           &:nth-child(5){
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
          .cell {
            &>span {
              &>span {
                padding: 5px 10px;
                background: #73C3EB;
                color: #fff;
              }
            }
          }
          &:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
          &:nth-child(5){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            .cell {
              &>span {
                height: 29px;
                line-height: 29px;
                display: block;
                float: left;
                margin-right: 10px;
              }
            }
           }
        }
      }      
    }
      .el-table::before {
        display: none;
      }
      tr {
        td {
          &:nth-child(10),&:nth-child(11),&:nth-child(12),&:nth-child(13),&:last-child {
            .cell {
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
      .el-table__body-wrapper{
        overflow: auto !important;
      }
      .el-pagination{
        text-align: right;
        margin-top: $width
      }      
    }
    .el-dialog--center {
      width: 576px !important;

      .el-dialog__header {
        .el-dialog__title {
          width: 90%;
          text-align: left;
        }
      }  
      .el-dialog__body {
        height: 500px;
        overflow-y: auto;        

        .el-upload-list {
          /* max-height: 60px;
          overflow-y: scroll; */
        }
        .el-radio {
          margin-left: 10px;
          .el-radio__input {
            float: none !important;
          }
          &>span {
            float: none !important;
          }
        }
        .upload-demo {

          span {
            width: 48px !important;
            height: 14px !important;
            line-height: 14px !important;
          }
        }
        .el-form {
          .el-form-item__content {
            .el-input {
              width: 260px;
            }
            .el-form-item__error {
              margin-left: 50px;
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
      .edui-default .edui-editor-bottomContainer {
        display: none;
      }

    }
}
</style>
