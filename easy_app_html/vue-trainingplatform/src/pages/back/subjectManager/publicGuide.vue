<template>
  <div class="public-guide">
    <header>
      <img src="../../../../src/assets/images/courseManager/manager-iocn.png"><span>课题管理</span>
    </header>

    <main>
      <p><img src="../../../assets/images/circle-icon.png">发布课题指南</p>
      <!-- 表格 -->
      <div class="table-box">
        <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        @select-all="selectAll"
        @select="choose"
        v-loading="loading">
        <el-table-column
          type="selection"
          align='center'
          show-overflow-tooltip
          label-class-name="head"
          width="60">
        </el-table-column>
        <el-table-column
          label="课题指南名称"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span @click="showData(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdUserName"
          show-overflow-tooltip
          label-class-name="head"
          label="发布人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label-class-name="head"
          label="建立时间">
          <template slot-scope="scope">
            <span>{{scope.row.createdTime | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label-class-name="head"
          label="截止时间">
          <template slot-scope="scope">
            <span>{{scope.row.stopTime | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </main>

    <!-- 按钮组 -->
    <div class="button-group">
      <el-button type="primary" @click="add"><img src="../../../../src/assets/images/courseManager/add-guide.png">新增</el-button>
      <el-button @click="deleteList" type="primary" :disabled="count < 1"><img src="../../../../src/assets/images/courseManager/delete-btn.png">删除</el-button>
      <span>已选 {{count}} 条</span>


      <!-- 分页 -->
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
      title="课题指南"
      :visible.sync="dialogVisible"
      width="655px">
      
      <el-form :model="guideData" ref="guideData" label-width="100px" class="demo-ruleForm" v-if="dialogVisible">
        <el-row>
          <el-col :span="7" class="text-right">课题指南名称：</el-col>
          <el-col :span="17">
            <el-form-item
              prop="newName"
              :rules="[
                { required: true, message: '课题指南名称不能为空'},
              ]"
            >
              <el-input type="newName" v-model="guideData.newName" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7" class="text-right">内容简介：</el-col>
          <el-col :span="17">
            <el-input type="textarea" :rows="4" v-model="contentIntro" style="margin: 0 0 20px 20px;width: 300px;"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7" class="text-right">立项号前缀：</el-col>
          <el-col :span="17">
            <el-form-item
              prop="newNumber"
              :rules="[
                { required: true, message: '立项号前缀不能为空'},
              ]"
            >
              <el-input type="newNumber" v-model="guideData.newNumber" auto-complete="off" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7" class="text-right">截止日期：</el-col>
          <el-col :span="17">
            <el-form-item
              prop="endDate"
              :rules="[
                { required: true, message: '截止日期不能为空'},
              ]"
            >
              <el-date-picker
                style="width: 300px;"
                v-model="guideData.endDate"
                type="date"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7" class="text-right">附件：</el-col>
          <el-col :span="17">
            <el-upload
              class="upload-demo"
              :action="action"
              multiple
              name="uploadFile"
              :before-upload="beforeUpload"
              :on-success="Success"
              :on-remove="handleRemove"
              :file-list="fileList">
              <el-button type="primary">浏览...</el-button>
              <span slot="tip" class="el-upload__tip" style="display: block;">附件只能上传.doc,.docx,.xls,xlsx格式的文件。</span>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('guideData')">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="课题指南详情"
      :visible.sync="Detail"
      width="655px">
      
      <el-form :model="detailData" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="7" class="text-right">课题指南名称：</el-col>
          <el-col :span="17">
            <el-form-item>
              <span>{{detailData.name}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7" class="text-right">内容简介：</el-col>
          <el-col :span="17">
            <el-form-item>
              <span class="content-box">{{detailData.content}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7" class="text-right">立项号前缀：</el-col>
          <el-col :span="17">
            <el-form-item>
              <span>{{detailData.topCodePrefix}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7" class="text-right">截止日期：</el-col>
          <el-col :span="17">
            <el-form-item>
              <span>{{detailData.stopTime | dateFormat('yyyy-MM-dd HH:mm')}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7" class="text-right">附件：</el-col>
          <el-col :span="17">
          <el-form-item>
            <a v-for="(item, index) in filelist" :key="index" @click="lookDetail(item.id)">{{item.fileName}}</a>
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import service from '../../../utils/axios.js'
import { notice, success } from '../../../api/index.js'
import { dateFormat } from '../../../filters/index.js'
export default {
  name: 'public-guide',
  data () {
    return {
      fileList: [],
      loading: false,
      Detail: false,
      detailData: {},
      contentIntro: '',
      guideData: {
        newName: '',
        newNumber: '',
        endDate: ''
      },
      dialogVisible: false,
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      tableData: [],
      uploadFile: '',
      fileIds: [],
      filelist: [],
      count: 0,
      ids: {}
    }
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/backTopicGuideController/uploadFile`
    }
  },
  methods: {
    handleRemove (file) {
      let a = this.fileList.indexOf(file.response.result)
      this.fileIds.splice(a, 1)
    },
    submitForm (guideData) {
      this.$refs[guideData].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          let date = dateFormat((new Date(this.guideData.endDate)).getTime() + 86399900, 'yyyy-MM-dd HH:mm:ss')
          service.post('backTopicGuideController/addTopicGuide', {
            guideName: this.guideData.newName,
            content: this.contentIntro,
            topCodePrefix: this.guideData.newNumber,
            stopTime: date,
            uploadFileIds: this.fileIds.join(',')
          })
          .then(res => {
            if (res.data.code !== 1) {
              notice(this, res.data.message, 2000)
            } else {
              success(this, res.data.message, 2000)
              this.fileIds = []
              this.getData()
            }
          })
          .catch(res => {
            notice(this, res.data.message, 2000)
          })
        } else {
          return false
        }
      })
    },
    lookDetail (id) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/backTopicGuideController/downloadFile?fileId=${id}`
    },
    showData (row) {
      this.Detail = true
      service.get(`backTopicGuideController/getTopicGuideDetails?id=${row.id}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.detailData = res.data.result.tpGuide
          this.filelist = res.data.result.fileList
        }
      })
    },
    choose (selection, row) {
      this.count = selection.length
      this.ids = selection.map(n => n.id).join(',')
    },
    selectAll (selection) {
      this.count = selection.length
      this.ids = selection.map(n => n.id).join(',')
    },
    add () {
      this.contentIntro = ''
      this.dialogVisible = true
      this.guideData = {}
    },
    Success (response) {
      this.fileIds.push(response.result)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
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
    getData () {
      this.count = 0
      this.loading = true
      setTimeout(() => {
        service.get(`backTopicGuideController/getTopicGuideList?pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
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
    },
    deleteList () {
      service.post('backTopicGuideController/deleteGuide', {
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
            service.get(`backTopicGuideController/getTopicGuideList?pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
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
.public-guide{
  padding-bottom: $width;


  table {
    border-color: #fff !important;
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
  .content-box {
    display: block;
    max-height: 350px;
    overflow: auto;
  }
  main {
    background: #fff;

    p {
      font-size: 16px;
      border-bottom: 1px solid #EBEEF7;
      padding: $width;
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
           &:nth-child(5){
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
           &:nth-child(5){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
           }
          &:nth-child(2) {
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }

    .bottom {
      padding: $width;
      span {
        line-height: 30px;
      }
    }
  }

  .button-group {

    // 分页
    .el-pagination{
      width: 500px;
      text-align: right;
      float: right;
    }
    margin-top: 20px;
    &>span {
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
        background: #FF857A;
        border: 1px solid #FF857A;

        &:hover {
          background: #FF6C60;
          border: 1px solid #FF6C60;
        }
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

  .el-dialog{
    .el-dialog__footer {
      text-align: center;
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
    .el-dialog__body{
      padding: $width*2 $width*5;
      .text-right{
        text-align: right;
        line-height: $width*2;
        font-size: 16px;
      }
      .el-form-item__content{
        margin-left: 20px !important;
        a {
          margin-right: 20px;
          color: #1AB3F7;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .upload-demo{
        margin-left: $width;
        .el-button{
          margin-right: $width;
        }
      }
    }
  }
}
</style>
