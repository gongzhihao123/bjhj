<template>
  <div class="law">
    <p>法律文件</p>
    <div class="content">
      <div class="top">
        <div class="left">
            <el-button @click="upload" type="primary" :disabled="role !== 4">上传文件</el-button>
            <el-button :disabled="selection.length === 0 || role !== 4" @click="deleteList('del')">删除</el-button>
        </div>
        <el-button @click="getList(filename)" class="search">搜索</el-button>
        <el-input v-model="filename" placeholder="请输入文件名称进行搜索"></el-input>
        <div class="schoolyear">
          <span>年份：</span>
          <el-select v-model="value2" placeholder="请选择">
            <el-option
              v-for="item in years"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>             
        </div>   
      </div>

      <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        label="文件名称"
        align="center"
        width="450">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column
        prop="createdUserName"
        align="center"
        label="上传人"
        width="300">
      </el-table-column>
      <el-table-column
        prop="address"
        label="上传时间"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createdDate | dateFormat('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column
      prop="address"
      label="操作"
      align="center"
      show-overflow-tooltip>
      <template slot-scope="scope">
          <el-button type="text" class="view" @click="view(scope.row.fileId)" icon="el-icon-view">预览</el-button>
          <el-button type="text" class="download" @click="download(scope.row.fileId)" icon="el-icon-download">下载</el-button>
          <el-button type="text"class="delete" @click="deleteList(scope.row.id)" :disabled="role !== 4" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>        
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>      
    </div>
    <el-dialog title="上传文件" :visible.sync="dialogVisible">
        <el-form :model="form" :rules="rules" ref="form" v-if="dialogVisible" v-loading="loading">
          <el-form-item label-width="200px">
              <el-upload
                class="upload-demo"
                :action="action"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                multiple
                :limit="1"
                name="file"
                :auto-upload="false"
                ref="upload1"
                :on-success="Success"
                :on-change="beforeUpload"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button type="primary" size="small">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传doc/docx/pdf文件，且大小不超过20M</div>
              </el-upload>              
          </el-form-item>
          <el-form-item label="文件名:" prop="rename">
            <el-input v-model.trim="form.rename" style="width: 352px; height: 35px;" :maxlength="25"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm ('form')">保存</el-button>
        </div>
    </el-dialog>      
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import server from '../../utils/axios'
import { notice, success } from '../../api/index'
export default {
  name: 'law',
  data () {
    return {
      currentPage: 1,
      role: '',
      pageSize: 10,
      totalCount: 0,
      attachmentId: '',
      loading: false,
      selection: [],
      file: '',
      years: [],
      fileList2: [],
      value2: '',
      form: {
        rename: ''
      },
      filename: '',
      fileList: [],
      dialogVisible: false,
      tableData: [],
      rules: {
        rename: [
          { required: true, message: '文件名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.fileList2.length === 0) {
            notice('请上传文件')
            return
          }
          this.loading = true
          this.$refs.upload1.submit()
        } else {
          return false
        }
      })
    },
    upload () {
      this.form.rename = ''
      this.dialogVisible = true
    },
    view (id) {
      let url
      url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${id}`
      this.$router.push({path: '/file/fileInfo', query: {id: id, url: url, size: this.tableData.filter(item => item.attachment.id === id)[0].attachment.size}})
      sessionStorage.filename = this.filename
    },
    download (id) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/common/readAttachment?attachmentId=${id}`
    },
    deleteList (id) {
      server.post(`/flwjController/deleteFile`, {
        fileIds: id === 'del' ? this.selection.map(item => item.id).join(',') : id
      })
      .then(res => {
        if (res.data.code === 1) {
          success(res.data.message)
          this.getList()
        } else {
          notice(res.data.message)
        }
      })
    },
    beforeUpload (file, fileList) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'doc' || arr[arr.length - 1] === 'docx' || arr[arr.length - 1] === 'pdf') {
          this.form.rename = file.name
          this.fileList2 = fileList
          resolve()
        } else {
          this.fileList = []
          notice('请上传正确格式文件')
          reject(arr)
        }
      })
    },
    handleSelectionChange (val) {
      this.selection = val
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleRemove (file, fileList) {
      this.form.rename = ''
    },
    handlePreview (file) {
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    getList () {
      server.get(`/flwjController/getPage?year=${this.value2}&keyword=${this.filename}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result.list ? this.tableData = res.data.result.list : this.tableData = []
          if (this.tableData.length !== 0) {
            this.tableData.map(item => {
              item.fileId = item.attachment.id
            })
          }
          this.totalCount = res.data.result.totalCount
        } else {
          notice(res.data.message)
        }
      })
    },
    Success (response, fileList) {
      this.attachmentId = response.result
      server.post(`/flwjController/saveFile`, {
        name: this.form.rename,
        attachmentId: this.attachmentId
      })
      .then(res => {
        if (res.data.code === 1) {
          success(res.data.message)
          this.loading = false
          this.dialogVisible = false
          this.getList()
        } else {
          notice(res.data.message)
        }
      })
    },
    getYear () {
      server.get(`/flwjController/getYear`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.years = res.data.result : this.years = []
          res.data.result ? this.value2 = res.data.result[0] : this.value2 = ''
          this.getList()
        } else {
          notice(res.data.message)
        }
      })
    }
  },
  created () {
    if (sessionStorage.filename) {
      this.filename = sessionStorage.filename
    } else {
      this.filename = ''
    }
    this.getYear()
    setTimeout(() => {
      this.role = this.user.userRole
    }, 50)
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/flwjController/uploadAttachment`
    },
    ...mapGetters([
      'previewUrl',
      'rootUrl',
      'previewInterface',
      'user'
    ])
  }
}
</script>
<style lang="scss">
.law {
  padding: 20px;


 .el-table {
      .el-button.is-disabled.el-button--text {
        color: #c0c4cc !important;
      }
    }
  .el-form-item__error {
    margin-left: 64px;
  }

  .el-dialog {
      width: 500px;
      min-height: 304px;
  }
  .el-form-item__content {
    margin-left: 0px !important;
  }
  .el-dialog__body {
    padding-bottom: 0px;
  }
  .el-dialog__footer {
    padding-top: 0px;
    margin-top: -10px;      
  }
  &>p {
    font-family: PingFang-SC-Regular;
    color: #333;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 20px;
  }
  &>.content {
    background: #fff;
    min-height: 800px;


    &>.el-pagination {
      float: right;
      margin-top: 20px;
      margin-right: 20px;
    }
    &>.top {
      padding: 20px;
      clear: both;

      .left {
        float: left;
        margin-bottom: 20px;
      }

      .upload-demo {
        width: 80px;
        float: left;
        margin: 0px 10px 0px 0px;

        .el-upload {
          .el-button {
            padding: 12px 15px;
          }
        }
      }

      .el-input {
        width: 244px;
        height: 40px;
        margin-left: 15px;
        margin-right: 10px;
        float: right;
      }
      .search {
        float: right;
      }
      .schoolyear {
        float: right;
        &>span {
          line-height: 40px;
          height: 40px;
          display: block;
          float: left;
        }
      }
    }
    .el-table thead {
      tr {
        background-color: #F5F5F5 !important;
        th {
          &>.cell {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #333333;
            font-weight: bold;
            line-height: 22px;
          }
        }
      }
    }
    .el-table__body td {
      padding: 0px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;

      &:last-child {
        .view {
          color: #13CE66;
        }
        .download {
          color: #20A0FF;
        }
        .delete {
          color: #FF4949;             
        }
        span {
          margin-right: 10px;
          font-family: PingFang-SC-Regular;
          font-size: 14px;            
        }
      }
    }
    .el-upload__tip {
      width: 200px;
    }
    .el-table th.is-leaf {
      padding: 0px !important;
      line-height: 40px; 
      background: #F5F5F5;     
  } 
  }
}
</style>

