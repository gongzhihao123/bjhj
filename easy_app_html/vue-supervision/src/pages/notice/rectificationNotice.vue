<template>
  <div class="rectification-notice">
    <p>整改通知</p>
    <div class="content">
      <div class="top">
        <el-select v-model="schoolYear" placeholder="请选择学年" @change="getZgyfkPage">
          <el-option
            v-for="item in options"
            :key="item.schoolYear"
            :label="item.schoolYearName"
            :value="item.schoolYear">
          </el-option>
        </el-select>
        <el-select v-model="state" @change="getZgyfkPage">
          <el-option
            v-for="item in stateOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          show-overflow-tooltip
          label="标题"
          align="center">
          <template slot-scope="scope">
            <span :class="{red: scope.row.limitDate < nowDate && scope.row.state === 1}">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="通知日期"
          align="center">
          <template slot-scope="scope">
            <span :class="{red: scope.row.limitDate < nowDate  && scope.row.state === 1}">{{ scope.row.createdDate | dateFormat('yyyy-MM-dd') }}</span>
          </template>
        </el-table-column>            
        <el-table-column
          label="整改期限"
          align="center">
          <template slot-scope="scope">
            <span :class="{red: scope.row.limitDate < nowDate  && scope.row.state === 1}">{{ scope.row.limitDate | dateFormat('yyyy-MM-dd') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="状态"
          align="center">
          <template slot-scope="scope">
            <span :class="{red: scope.row.limitDate < nowDate  && scope.row.state === 1}">{{ scope.row.state === 1 ? '整改中' : scope.row.state === 2 ? '已整改' : '已确认' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="督导"
          align="center">
          <template slot-scope="scope">
            <span :class="{red: scope.row.limitDate < nowDate  && scope.row.state === 1}">{{ scope.row.userName }}</span>
          </template>
        </el-table-column>                       
        <el-table-column
          label="操作"
          align="center"
          width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1" @click="getZgyfkDetails(scope.row)">反馈</span>
            <span @click="look(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="totalCount !== 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination> 
    </div>
    <transition name="slide-left" mode="out-in">

      <div class="detial" v-click-outside="hide" v-if="dialogTableVisible">
        <span @click="close">
          <i class="el-icon-close"></i>
        </span>      
        <p class="title">整改通知>{{ detail.title }}</p>

        <div class="confirm">
            <el-row>
              <el-col :span="5">责任督学</el-col>
              <el-col :span="19">{{detail.userName}}</el-col>
            </el-row>

            <el-row>
              <el-col :span="5">通知日期</el-col>
              <el-col :span="19">{{ detail.createdDate | dateFormat('yyyy-MM-dd')}}</el-col>
            </el-row>

            <el-row>
              <el-col :span="5">整改期限</el-col>
              <el-col :span="19">{{ detail.limitDate | dateFormat('yyyy-MM-dd') }}</el-col>
            </el-row>

            <el-row>
                <el-col :span="5">整改标题</el-col>
                <el-col :span="19">{{ detail.title }}</el-col>
            </el-row>
            
            <el-row>
                <el-col :span="5">问题描述</el-col>
                <el-col :span="19">{{ detail.remark }}</el-col>
            </el-row>

            <el-row>              
              <el-col :span="5">附件</el-col>
              <el-col :span="19">
              <p v-for="(item, index) in detail.fileList" :key="index">
                {{ item.name }}
                <span class="cursor-pointer blue-color" @click="route(item)">预览</span>
                <span class="cursor-pointer blue-color" @click="downloadFile(item)">下载({{ (item.size / 1024 / 1024).toFixed(2) }})MB</span>
              </p>
            </el-col>
          </el-row>
          </div>
        <!-- <ul>
          <li><span class="tips">责任督学:</span> <span>{{ detail.userName }}</span></li>
          <li><span class="tips">通知日期:</span> <span>{{ detail.createdDate | dateFormat('yyyy-MM-dd') }}</span></li>
          <li><span class="tips">整改期限:</span> <span>{{ detail.limitDate | dateFormat('yyyy-MM-dd') }}</span></li>
          <li><span class="tips">整改标题:</span> <span>{{ detail.title }}</span></li>
          <li><span class="tips">问题描述:</span> <p>{{ detail.remark }}</p></li>
          <li><span class="tips">附件:</span>
            <ul>
              <li v-for="(item, index) in detail.fileList" :key="index">{{ item.name }}
                <a @click="route(item)">预览</a>
                <a @click="downloadFile(item)">下载</a>
              </li>
            </ul>
          </li>
        </ul> -->

        <ul>
          <li v-for="(item, index) in List" :key="index">
            <!-- 反馈意见 -->
            <div class="confirm">
              <el-row>
                <el-col :span="5">反馈人</el-col>
                <el-col :span="19">{{item.userName}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">反馈时间</el-col>
                <el-col :span="19">{{ item.createdDate | dateFormat('yyyy-MM-dd')}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">反馈</el-col>
                <el-col :span="19">{{ item.feedback }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">附件</el-col>
                <el-col :span="19">
                  <p v-for="(m, index) in item.fileList" :key="index">
                    {{ m.name }}
                    <span class="cursor-pointer blue-color" @click="route(m)">预览</span>
                    <span class="cursor-pointer blue-color" @click="downloadFile(m)">下载({{ (m.size / 1024 / 1024).toFixed(2) }})MB</span>
                  </p>
                </el-col>
              </el-row>
            </div>
            <!-- 督导意见 -->
            <div class="confirm">
              <el-row>
                <el-col :span="5">督学人员</el-col>
                <el-col :span="19">{{detail.userName}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">督学时间</el-col>
                <el-col :span="19">{{item.remarkDate | dateFormat('yyyy-MM-dd')}}</el-col>
              </el-row>
              <el-row>
                  <el-col :span="5">督导意见</el-col>
                  <el-col :span="19">
                    <span v-if="item.dxOpinion === 1">整改措施到位</span>
                    <span v-if="item.dxOpinion === 2">整改不到位，需要继续整改</span>
                  </el-col>
                </el-row>
              <el-row>
                <el-col :span="5">督导内容</el-col>
                <el-col :span="19">{{item.remark}}</el-col>
              </el-row>
            </div>            
          </li>
        </ul>
        <p class="return" v-if="isEdit">反馈:</p>
        <el-input
          type="textarea"
          v-if="isEdit"
          placeholder="请输入文字"
          v-model="feedback">
        </el-input>
        <el-upload
          v-if="isEdit"
          class="upload-demo"
          ref="upload"
          name="uploadFile"
          :action="action"
          :before-upload="beforeUpload"
          :auto-upload="false"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :on-success="success">
          <el-button size="small" icon="el-icon-plus" type="text">上传附件</el-button>
          <span slot="tip" class="el-upload__tip">(支持.doc .docx .pdf .jpg .png格式且大小不超过20M的文件)</span>
        </el-upload> 
        <div slot="footer" class="footer" v-if="isEdit">
          <el-button size="small" :disabled="canSave" type="primary" @click="confirm">确 定</el-button>
          <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
        </div>               
        <div slot="footer" class="footer" v-if="!isEdit">
          <el-button size="small" type="primary" @click="dialogTableVisible = false">返 回</el-button>
        </div>               
      </div>
    </transition>            
  </div>
</template>
<script>
import server from '../../utils/axios'
import { mapGetters } from 'vuex'
import { notice, success } from '../../api/index'
export default {
  name: 'rectification-notice',
  data () {
    return {
      nowDate: '',
      isEdit: true,
      canSave: false,
      tableData: [],
      List: [],
      options: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      schoolYear: '',
      detail: {},
      state: '',
      stateOptions: [
        { name: '全部', id: '' },
        { name: '整改中', id: 1 },
        { name: '已整改', id: 2 },
        { name: '已确认', id: 3 }
      ],
      dialogTableVisible: false,
      feedback: '',
      fileList: [],
      fileListNumber: 0
    }
  },
  methods: {
    route (val) {
      let url
      url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${val.id}`
      window.open(`#/file/fileInfo?id=${val.id}&url=${url}&size=${val.size}`)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getZgyfkPage()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getZgyfkPage()
    },
    hide () {
      this.dialogTableVisible = false
    },
    success (res, file, fileList) {
      this.fileList.push(res)
      this.fileListNumber += 1
      if (this.fileListNumber === fileList.length) {
        this.addFk()
      }
    },
    // 督导过程上传附件之前
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'jpg' || arr[arr.length - 1] === 'png' || arr[arr.length - 1] === 'pdf' || arr[arr.length - 1] === 'doc' || arr[arr.length - 1] === 'docx') {
          if (file.size <= 20971520) {
            resolve()
          } else {
            this.$message.error('请上传20M以内的文件')
            reject(arr)
          }
        } else {
          this.$message.error('请上传正确的文件格式')
          reject(arr)
        }
      })
    },
    handleExceed (files, fileList) {
      this.$message.error(`当前限制选择 3 个文件`)
    },
    look (val) {
      server.get(`/schoolZgController/getZgyfkDetails?id=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.isEdit = false
          this.detail = res.data.result
          res.data.result.feedBackList ? this.List = res.data.result.feedBackList : this.List = []
          this.dialogTableVisible = true
        } else {
          notice(res.data.message)
        }
      })
    },
    close () {
      this.dialogTableVisible = false
    },
    // 分页查询整改与反馈
    async getZgyfkPage () {
      await server.get(`/schoolZgController/getZgyfkPage?schoolYear=${this.schoolYear}` +
                  `&pageNo=${this.pageNo}` +
                  `&pageSize=${this.pageSize}` +
                  `&state=${this.state}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list
          this.totalCount = res.data.result.totalCount
        } else {
          notice(res.data.message)
        }
      })
    },
    // 确定
    confirm () {
      if (!this.feedback) {
        notice('请输入反馈内容')
        return
      }
      if (this.$refs.upload.uploadFiles.length !== 0) {
        this.$refs.upload.submit()
        return
      }
      this.addFk()
    },
    // 添加整改
    addFk () {
      this.canSave = true
      server.post(`/schoolZgController/addFk`, {
        id: this.detail.id,
        feedback: this.feedback,
        fileIds: this.fileList.map(item => item.result).join(',')
      })
      .then(res => {
        if (res.data.code === 1) {
          this.dialogTableVisible = false
          success('反馈成功')
          this.getZgyfkPage()
        } else {
          notice(res.data.message)
        }
        this.canSave = false
      })
    },
    // 获取学年
    async getSchoolYearAndSemeter () {
      await server.get('/schoolZgController/getSchoolYearAndSemeter')
      .then(res => {
        if (res.data.code === 1) {
          this.options = res.data.result.schoolYearSemesterList
          this.schoolYear = res.data.result.schoolYearSemesterToWebDto.schoolYear
        } else {
          notice(res.data.message)
        }
      })
    },
    downloadFile (val) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/schoolZgController/downloadFileById?fileId=${val.id}`
    },
    // 查询整改与反馈详情
    getZgyfkDetails (val) {
      server.get(`/schoolZgController/getZgyfkDetails?id=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.fileList = []
          this.fileListNumber = 0
          this.isEdit = true
          this.detail = res.data.result
          res.data.result.feedBackList ? this.List = res.data.result.feedBackList : this.List = []
          this.feedback = ''
          this.dialogTableVisible = true
        } else {
          notice(res.data.message)
        }
      })
    }
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/schoolZgController/uploadFile`
    },
    ...mapGetters([
      'previewUrl',
      'rootUrl',
      'previewInterface'
    ])
  },
  async created () {
    this.nowDate = new Date().getTime()
    await this.getSchoolYearAndSemeter()
    await this.getZgyfkPage()
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
@import '../../assets/scss/transition.scss';
.rectification-notice {
  padding: 20px;

  .confirm {
      margin-top: $width;
      margin-bottom: $width;
      border: 1px solid #DADADA;
      border-bottom: 0;
      .el-row {
        border-bottom: 1px solid #DADADA;
      }
      .el-col {

        &:after {
          display: block;
          content: '';
          clear: both;
          overflow: hidden;
          visibility: hidden;
        }
        border-left: 1px solid #DADADA;
        padding: 8px 5px;
        min-height: 35px;
      }
      .el-col:nth-child(1) {
        text-align: center;
        border-left: 0;
      }
      .el-col:nth-child(2) {
      }
    }

    .cursor-pointer {
    cursor: pointer;
    margin-left: 10px;
  }

  .blue-color {
    color: #3FADFF;
  }

  .el-dialog {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 720px;
    height: 911px;
    margin-top: 50px !important;
  }
  .detial {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 720px;
    height: calc(100vh - 50px);
    box-sizing: border-box;
    margin-top: 50px !important;
    overflow-x: hidden;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.50);
    padding: 20px;
    z-index: 999;

    &>span {
      float: right;

      i {
        font-family: AppleColorEmoji;
        font-size: 18px;
        color: #333;
        letter-spacing: 0;
        font-weight: bold;
      }
      &:hover {
        cursor: pointer;
      }
    }

    .title {
      clear: both;
      font-family: PingFang-SC-Regular;
      font-size: 18px;
      color: #333333;
    }
    &>ul {
      margin-top: 20px;
      &>li {
        line-height: 20px;
        margin-bottom: 20px;
        clear: both;

        &:after {
          display: block;
          content: '';
          clear: both;
          overflow: hidden;
          visibility: hidden;       
        }

        &>.tips {
          font-weight: bold;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #333333;
          width: 88px;
          text-align: right;
          display: block;
          float: left;
          margin-left: 0px;
        }

        &>ul {
          width: 600px;
          margin-left: 89px;

          &>li {
            a {
              font-family: PingFang-SC-Regular;
              font-size: 14px;
              color: #4A90E2;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
        &>p {
          max-height: 100px;
          overflow-y: auto;
          float: left;
          margin-left: 20px;
        }
        &>span {
          margin-left: 20px;
          font-weight: normal;
        }
      }
    }
    .return {
      border-top: 1px solid #DCDCDC;
      padding-top: 20px;
      font-weight: bold;
      color: #333;
      padding-left: 32px;
    }
    .el-textarea {
      margin: 20px;
    }
    .el-textarea__inner {
      resize: none;
      width: 680px;
      height: 204px;
    }
    .footer {
      margin-top: 20px;
    }
    .el-upload-list {
      max-height: 120px;
      overflow-y: auto;
    }
    .el-upload__tip {
      margin-left: 10px;
    }
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
    padding-bottom: 20px;
    &>.top {
      min-width: 300px;
      float: right;
      padding: 20px;
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
    .el-table th.is-leaf {
        padding: 0px !important;
        line-height: 40px; 
        background: #F5F5F5;     
    }   
    .el-table__body td {
      &:last-child {
        .cell {
          span {
            font-family: PingFang-SC-Regular;
            font-size: 14px;
            color: #509BE4;   
            cursor: pointer;             
          }
        } 
      }   
      padding: 0px;
      height: 40px;
      line-height: 40px;
    }          
  }
  .el-pagination {
    margin: 20px;
    text-align: right;
  }

  .red {
    color: #FF6D6D;
  }
}
</style>


