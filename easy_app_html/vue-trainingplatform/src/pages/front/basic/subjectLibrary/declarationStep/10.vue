<template>
  <div class="step-10">
    <p>课题负责人所在单位意见
      <br>
      <span>
        <i>*</i>
        说明：建议2000字以内
      </span> 
    </p>

    <div>
      <p>
        <el-button type="primary" size="small" @click="submitForm()" :disabled="canSave">
          保存
        </el-button>
      </p>

      <el-form :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">

        <el-row>
          <el-col :span="24" class="text-right">
            申请书所填写的内容是否属实：该课题负责人和参加者的政治业务素质是否适合承担本课题的研究工作；本单位能否提供完成本课题所需的时间和条件；本单位是否同意承担本课题的管理任务和信誉保证
          </el-col>
          <el-col :span="24">
            <el-upload
              class="upload-demo"
              :action="action"
              :show-file-list="false"
              :on-success="success"
              :before-upload="beforeUpload">
              <el-button type="primary" size="small">选择文件</el-button>
              <span v-if="!fileId" slot="tip" class="el-upload__tip"> 未选择图片（请上传有单位公章的图片 图片大小(300 x 400) ）</span>
            </el-upload>
            <img :src="img" v-if="img">
          </el-col>
        </el-row>

      </el-form>
    </div>

  </div>
</template>

<script>
import server from '../../../../../utils/axios'
import { success, notice } from '../../../../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'step-10',
  data () {
    return {
      canSave: false,
      contentData: {},
      fileId: '',
      action: '',
      img: '',
      editId: ''
    }
  },
  methods: {
    submitForm () {
      if (!this.fileId) {
        notice(this, '请先上传图片', 2000)
        return
      }
      if (this.editId) {
        this.edit()
      } else {
        this.save()
      }
    },
    // 保存
    save () {
      this.canSave = true
      server.post('/frontTopicDeclareController/saveStepTen', {
        topicId: sessionStorage.SUBJECT_ID,
        fileId: this.fileId
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '保存成功', 1000)
          this.getStepTen()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 修改
    edit () {
      this.canSave = true
      server.post('/frontTopicDeclareController/editStepTen', {
        id: this.editId,
        topicId: sessionStorage.SUBJECT_ID,
        fileId: this.fileId
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '修改成功', 1000)
          this.getStepTen()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 上传之前的钩子
    beforeUpload (file) {
      if (file.type.indexOf('image') === -1) {
        this.$message.error('请上传图片')
        return false
      }
    },
    // 上传成功的钩子
    success (file) {
      this.fileId = file.result.fileId
      this.img = `${this.staticUrl}?filepath=${file.result.filepath}`
    },
    // 获取图片-第10步
    getStepTen () {
      server.get(`/frontTopicDeclareController/getStepTen?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.result) {
          this.img = `${this.staticUrl}?filepath=${res.data.result.filePath}`
          // this.img = this.previewUrl + this.staticUrl + res.data.result.filePath
          this.fileId = res.data.result.fileId
          this.editId = res.data.result.id
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'staticUrl',
      'previewUrl'
    ])
  },
  mounted () {
    var path = document.getElementById('contextPath').value
    this.action = `${path}/frontTopicDeclareController/uploadImage`
  },
  beforeRouteLeave (to, from, next) {
    if (this.editId) {
      next()
    } else {
      this.$confirm('您还没有创建课题负责人所在单位意见，确定离开吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    }
  },
  created () {
    this.getStepTen()
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-10{
  &>p:nth-child(1){
    text-align: center;
    padding: 17px;
    font-size: 20px;
    background: #F8F9FC;
    border-bottom: #EDF1F4;
    &>span {
      font-size: 14px;
      color: #B8B8B8;

      i {
        color: red;
      }
    }
  }

  &>div {
    padding: 0 20px 20px;
    &>p:nth-child(1){
      text-align: right;
      padding: $width/2;
      font-size: 18px;
    }
    .el-form{
      .text-right{
        font-size: 15px;
        // margin: 0 0 $width $width;
        color: #999;
        margin-bottom: 20px;
      }
      .el-form-item__content{
        margin-left: 0 !important;
        padding-right: 20px;
      }
      img{
        margin-top: $width;
        width: 300px;
        height: 400px;
      }
    }
  }

}
</style>
