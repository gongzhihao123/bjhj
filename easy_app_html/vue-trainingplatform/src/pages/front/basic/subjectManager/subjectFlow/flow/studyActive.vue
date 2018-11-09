<template>
  <div class="study-active">
    <div class="table-box" v-loading="loading">
      <table>
        <tr>
          <th>
            <el-checkbox v-model="checkedAll" @change="handleAll"></el-checkbox>
          </th>
          <th v-for="(item, index) in tableNaV" :key="index">{{item.name}}</th>
        </tr>
        <tr v-for="(item, index) in tableList" :key="index">
          <td>
            <el-checkbox v-model="item.checked" @change="handleOne"></el-checkbox>
          </td>
          <td>{{item.name}}</td>
          <td>{{item.responsibleUser}}</td>
          <td>{{item.startTime}}</td>
          <td>{{item.stopTime}}</td>
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
        <el-button class="add-btn" type="primary" @click="peopleManage" :disabled="$route.query.signFlag == 3 || $route.query.checkState == 2">记录</el-button>
        <el-button class="delete-btn" type="primary" @click="deleteClick" :disabled="$route.query.signFlag == 3">删除</el-button>      
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
    
    <el-dialog :visible.sync="peopleManageDialog" top="5%">
      <div>
        <p class="dialogP">
          <span class="label-span">活动名称：</span>
          <el-input class="levelInput" v-model="activeName"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">活动负责人：</span>
          <el-input class="levelInput" v-model="activeEading"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">活动目标：</span>
          <el-input class="levelInput" v-model="activeTarget"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">参与人：</span>
          <el-input class="levelInput" v-model="activePeople"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">活动时间：</span>
          <el-date-picker
            class="levelInput"
            v-model="activeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </p>
        <p class="dialogP">
          <span class="label-span">记录人员：</span><el-input class="small-input" v-model="keepPerson"></el-input>
          <span>观察分工：</span><el-input class="small-input" v-model="watchAllot"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">录像人员：</span><el-input class="small-input" v-model="videoPerson"></el-input>
          <span>主持人员：</span><el-input class="small-input" v-model="managePerson"></el-input>
        </p>
        <p style="margin-top: 10px;">
          <span class="label-span" style=" vertical-align: top;">活动记录：</span>
          <textarea cols="69" rows="3" v-model="activeKeeping"></textarea>
        </p>
        <section style="margin-top: 10px;" ref="imgs">
          <span class="label-span" style=" vertical-align: top;">精彩瞬间：</span>
          <div class="photos">
            <el-upload
              :action="uploadFiles"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="removeImg"
              :before-upload="beforeAvatarUpload"
              ref="img"
              :on-change="changeImg"
              :on-success="imgHandleSuccess"
              :file-list="imgList"
              name="file"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </section>
        <div class="dialogP" ref="files" v-if="isChange" style="margin-top: 10px;">
          <el-upload
            class="upload-demo"
            :action="uploadFiles"
            :before-upload="beforeUpload"
            multiple
            :limit="1"
            :file-list="fileList"
            ref="file"
            :auto-upload="false"
            name="file"
            :on-success="fileHandleSuccess">
            <span class="label-span" style="margin-right: 10px;">附件:</span>
            <span v-for="(item, index) in filesList" :key="index">{{item.fileName}}</span>
          </el-upload>
        </div>
        <p style="margin-top: 10px;" v-if="!isChange" ref="files">
          <span class="label-span">活动成果：</span>
          <el-upload
            class="upload-demo"
            :action="uploadFiles"
            :before-upload="beforeUpload"
            multiple
            :limit="1"
            :file-list="fileList"
            ref="file"
            :auto-upload="false"
            name="file"
            :on-success="fileHandleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <span class="tiptle">(只能上传.doc.docx格式的文件且大小不超过1M)</span>
          </el-upload>
        </p>
        
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSure" :disabled="canSave">确 定</el-button>
        <el-button @click="peopleManageDialog = false" class="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="deleteDialog" class="delete-dialog" width="500px">
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
import { mapGetters } from 'vuex'
export default {
  name: 'study-active',
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      loading: false,
      activeName: '',
      activeEading: '',
      activeTarget: '',
      activePeople: '',
      activeDate: [],
      keepPerson: '',
      watchAllot: '',
      videoPerson: '',
      managePerson: '',
      activeKeeping: '',
      checkedAll: false,
      peopleManageDialog: false,
      deleteDialog: false,
      currentPage: 1,
      startDate: '',
      endDate: '',
      sex: '1',
      birthdayDate: '',
      tableNaV: [
        {name: '活动名称'},
        {name: '活动发起人'},
        {name: '开始时间'},
        {name: '结束时间'},
        {name: '操作'}
      ],
      tableList: [],
      fileList: [],
      imgList: [],
      upload: {
        tptopId: '',
        name: '',
        responsibleUser: '',
        activityAim: '',
        participationUser: '',
        startTime: '',
        stopTime: '',
        observeUser: '',
        recordUser: '',
        videoUser: '',
        directUser: '',
        content: ''
      },
      infoList: [],
      infoId: '',
      isChange: false,
      pageSize: 10,
      totalCount: 0,
      canSave: false,
      imgData: [],
      fileData: [],
      imageUrl: '',
      changeState: false, // 编辑时，判断文件是否更改
      filesList: []
    }
  },
  computed: {
    ...mapGetters([
      'staticUrl'
    ]),
    uploadFiles () {
      let path = document.querySelector('#contextPath').value
      return `${path}/frontTopicManageController/uploadFile`
    }
  },
  methods: {
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    changeImg (file, fileList) {
      this.changeState = true
    },
    removeImg (file, fileList) {
      if (!this.isChange) return
      this.imgData.splice(file.index, 1)
      this.imgList = fileList.map((item, i) => ({
        ...item,
        index: i
      }))
    },
    beforeAvatarUpload (file) {
      const isjpeg = file.type === 'image/jpeg'
      const isjpg = file.type === 'image/jpg'
      const isJPG = file.type === 'image/JPG'
      const isJPEG = file.type === 'image/JPEG'
      const isPNG = file.type === 'image/PNG'
      const isPng = file.type === 'image/png'
      let arr = [isjpeg, isjpg, isJPG, isJPEG, isPNG, isPng]
      const isLt2M = file.size / 1024 / 1024 < 2
      if (arr.every(item => !item)) {
        this.$message.error('图片请上传PNG 或者 JPG 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return
      }
      return true
    },
    peopleManage () {
      this.isChange = false
      this.canSave = false
      this.activeName = ''
      this.activeEading = ''
      this.activeTarget = ''
      this.activePeople = ''
      this.activeDate = []
      this.keepPerson = ''
      this.watchAllot = ''
      this.videoPerson = ''
      this.managePerson = ''
      this.activeKeeping = ''
      this.fileList = []
      this.imgList = []
      if (this.$refs.img) {
        this.$refs.img.clearFiles()
      }
      if (this.$refs.file) {
        this.$refs.file.clearFiles()
      }
      this.fileData = []
      this.imgData = []
      this.peopleManageDialog = true
    },
    changeInfo (item) {
      if (this.$refs.file) {
        this.$refs.file.clearFiles()
      }
      this.changeState = false
      this.isChange = true
      this.canSave = false
      this.infoId = item.id
      this.activeName = item.name
      if (item.imgPath) {
        this.imgList = (item.imgPath || '').split(',').map((item, i) => {
          return {
            name: 'img',
            index: i,
            url: `${this.staticUrl}?filepath=${item}`
          }
        })
      } else {
        this.imgList = []
      }
      this.activeEading = item.responsibleUser
      this.activeTarget = item.activityAim
      this.activePeople = item.participationUser
      this.imgData = item.imgIds ? item.imgIds.split(',') : []
      this.activeDate = []
      this.activeDate[0] = item.startTime
      this.activeDate[1] = item.stopTime
      this.keepPerson = item.recordUser
      this.watchAllot = item.observeUser
      this.videoPerson = item.videoUser
      this.managePerson = item.directUser
      this.activeKeeping = item.content
      this.peopleManageDialog = true
      this.filesList = []
      if (item.fileIds) {
        service.get(`/frontTopicManageController/researchActivityListFiles?fileIds=${item.fileIds}`)
        .then(res => {
          if (res.data.code === 1) {
            this.filesList = res.data.result
          } else {
            notice(this, res.data.message || '获取失败', 2000)
          }
        })
      }
    },
    fileHandleSuccess (res, file, fileList) {
      this.fileData.push(res.result)
      this.fileList = fileList
      if (!this.isChange) {
        if ((this.fileList.length === this.fileData.length) && (this.imgList.length === this.imgData.length)) {
          this.submitTable()
        }
      } else {
        this.emitTable()
      }
    },
    imgHandleSuccess (res, file, fileList) {
      this.imgList = fileList
      this.imgData.push(res.result)
      if (!this.isChange) {
        if ((this.fileList.length === this.fileData.length) && (this.imgList.length === this.imgData.length)) {
          this.submitTable()
        }
      } else {
        this.emitTable()
      }
    },
    addSure () {
      if (!this.activeName.trim()) {
        notice(this, '请填写活动名称', 2000)
        return
      }
      if (!this.activeEading.trim()) {
        notice(this, '请填写活动负责人', 2000)
        return
      }
      if (!this.activeTarget.trim()) {
        notice(this, '请填写活动目标', 2000)
        return
      }
      if (!this.activePeople.trim()) {
        notice(this, '请填写活动参与人', 2000)
        return
      }
      if (!this.activeDate) {
        notice(this, '请选择活动时间', 2000)
        return
      }
      if (!this.activeKeeping.trim()) {
        notice(this, '请填写活动记录', 2000)
        return
      }
      if (!this.isChange) {
        let imgs = this.$refs.imgs.getElementsByClassName('el-upload-list__item-name')
        let files = this.$refs.files.getElementsByClassName('el-upload-list__item-name')
        if (imgs.length === 0 && files.length === 0) {
          this.submitTable()
        } else {
          this.$refs.img.submit()
          this.$refs.file.submit()
        }
      } else {
        let files = this.$refs.files.getElementsByClassName('el-upload-list__item-name')
        if (this.changeState) {
          this.$refs.img.submit()
        }
        if (files.length !== 0) {
          this.$refs.file.submit()
        }
        this.emitTable()
      }
    },
    submitTable () {
      this.upload.tptopId = this.$route.query.item
      this.upload.name = this.activeName
      this.upload.responsibleUser = this.activeEading
      this.upload.activityAim = this.activeTarget
      this.upload.participationUser = this.activePeople
      this.upload.startTime = dateFormat(this.activeDate[0], 'yyyy-MM-dd HH:mm:ss')
      this.upload.stopTime = dateFormat(this.activeDate[1], 'yyyy-MM-dd HH:mm:ss')
      this.upload.observeUser = this.watchAllot
      this.upload.recordUser = this.keepPerson
      this.upload.videoUser = this.videoPerson
      this.upload.directUser = this.managePerson
      this.upload.content = this.activeKeeping
      let imgs = this.$refs.imgs.getElementsByClassName('el-upload-list__item-name')
      let files = this.$refs.files.getElementsByClassName('el-upload-list__item-name')
      if ((this.imgData.length !== imgs.length) || this.fileData.length !== files.length) return
      service.post(`/frontTopicManageController/addResearchActivity`, ({
        tptopId: this.upload.tptopId,
        name: this.upload.name,
        responsibleUser: this.upload.responsibleUser,
        activityAim: this.upload.activityAim,
        participationUser: this.upload.participationUser,
        startTime: this.upload.startTime,
        stopTime: this.upload.stopTime,
        observeUser: this.upload.observeUser,
        recordUser: this.upload.recordUser,
        videoUser: this.upload.videoUser,
        directUser: this.upload.directUser,
        content: this.upload.content,
        imgIds: this.imgData.join(','),
        fileIds: this.fileData.join(',')
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.peopleManageDialog = false
          this.canSave = false
          success(this, res.data.message || '提交成功', 2000)
          this.getList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    emitTable () {
      this.canSave = true
      service.post(`/frontTopicManageController/updateResearchActivity`, ({
        id: this.infoId,
        name: this.activeName,
        responsibleUser: this.activeEading,
        activityAim: this.activeTarget,
        participationUser: this.activePeople,
        startTime: dateFormat(this.activeDate[0], 'yyyy-MM-dd HH:mm:ss'),
        stopTime: dateFormat(this.activeDate[1], 'yyyy-MM-dd HH:mm:ss'),
        observeUser: this.watchAllot,
        recordUser: this.keepPerson,
        videoUser: this.videoPerson,
        directUser: this.managePerson,
        imgIds: this.imgData.join(','),
        content: this.activeKeeping,
        fileIds: this.fileData.join(',')
      }))
      .then(res => {
        this.canSave = false
        if (res.data.code === 1) {
          this.peopleManageDialog = false
          // success(this, res.data.message || '提交成功', 2000)
          this.checkedAll = false
          this.getList()
        } else {
          notice(this, res.data.message || '上传失败', 2000)
        }
      })
    },
    handleSuccess (data) {
      this.canSave = false
      if (data.code === 1) {
        // this.$refs.file.submit()
        this.peopleManageDialog = false
        // success(this, data.message || '提交成功', 2000)
        // this.getList()
      } else {
        notice(this, data.message || '上传失败', 2000)
      }
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
      service.post(`/frontTopicManageController/deleteResearchActivity`, ({
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
      service.get(`/frontTopicManageController/researchActivityList?tptopId=${this.$route.query.item}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result.list || []).map(item => ({
            ...item,
            startTime: dateFormat(item.startTime, 'yyyy-MM-dd'),
            stopTime: dateFormat(item.stopTime, 'yyyy-MM-dd')
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
.study-active {
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
  .el-dialog {
    width: 700px;

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
      width: 500px;
      margin-left: 10px;
    }
    .small-input {
      width: 193px;
      margin-right: 18px;
      margin-left: 16px;
    }
    .datePicker {
      margin-left: 6px;
      width: 144px;
    }
    .upload-demo {
      width: 500px;
      display: inline-block;
      margin-left: 10px;
      margin-top: -20px;
    }
    textarea {
      border-color: #d8dce5;
      margin-left: 10px;
      resize: none;
    }
    .el-upload-list {
      // width: 300px;
      // margin-left: -20px;
      // margin-top: 20px;
      float: right;
      li {
        overflow-x: auto;
        width: 439px;
      }
    }
    .tiptle {
      color: #ccc;
      font-size: 12px;
      margin-left: 10px;
    }
    .photos {
      width: 500px;
      height: 120px;
      display: inline-block;
      margin-left: 12px;
      border: 1px solid #ccc;
      
      > div {
        height: 100px;
        padding: 10px;

        .el-upload--picture-card {
          height: 100px;
          width: 100px;
          line-height: 100px;
        }

        li {
          height: 100px;
          width: 100px;
          margin: 0;
          overflow: hidden;
        }
        ul {
          width: 350px;
          height: 100px;
          overflow: auto;
        }
      }
    }
  }
}
</style>
