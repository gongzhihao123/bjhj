<template>
  <div class="fileInfo">
    <p class="top-title">当前位置： 政策文件</p>
    <div class="fileDetail">
      <div>
        <p class="title">{{groverment.titleName}}</p>
        <p class="company-detail">
          <span>发布单位：{{groverment.createdCompanyName}}</span>
          <span>发布人：{{groverment.createdUserName}}</span>
          <span>发布日期：{{groverment.createdTime | dateFormat('yyyy-MM-dd')}}</span>
        </p>
      </div>
      <main>
        <p v-html="groverment.content"></p>
      </main>
      <footer>
        <span><img src="../../../../assets/images/file.png">附件：</span>
          <ul class="listbox">
            <!-- 左边 -->
             <li v-for="(item, index) in groverment.uploadFileList" :key="index" v-if="groverment.uploadFileList.length !== 0" ><span>{{item.fileName}}</span>    <el-button type="text" @click="download(item.id)">下载</el-button></li>          
          </ul> 
        <el-upload
          class="upload-demo"
          v-if="groverment.policyType === 2 && fileList3.length !== 0"
          :action="action"
          :before-upload="beforeUpload"
          name="uploadFile"
          :on-success="Success"
          :on-remove="handleRemove"
          :file-list="fileList3">
          <el-button size="small" type="info">选择文件</el-button>
          <div slot="tip" class="el-upload__tip">(只能上传doc/docx/xls/xlsx文件)</div>
        </el-upload>
        <el-upload
          class="upload-demo1"
          drag
          v-if="groverment.policyType === 2 && fileList3.length === 0"
          :action="action"
          :before-upload="beforeUpload"
          name="uploadFile"
          :on-success="Success"
          :on-remove="handleRemove"
          :file-list="fileList3">
          <img src="../../../../assets/images/import-btn.png">
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">(只能上传doc/docx/xls/xlsx文件)</div>
        </el-upload>
        <span v-if="groverment.policyType === 2 && fileList3.length === 0" class="file-title"><img src="../../../../assets/images/import.png">文件上传：</span>     
      </footer>

      <el-button type="primary" class="back" @click="back">返回</el-button>
    </div>
  </div>
</template>


<script>
import service from '../../../../utils/axios.js'
import { notice, success } from '../../../../api/index.js'
export default {
  name: 'fileInfo',
  data () {
    return {
      fileList3: [],
      id: '',
      groverment: {
        subFileList: []
      }
    }
  },
  methods: {
    back () {
      history.back()
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
    Success (response) {
      service.post(`frontPolicyFileController/updatePolicySubFile`, {
        policyId: this.groverment.id,
        subFileIds: response.result
      })
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          success(this, res.data.message, 2000)
          this.getData()
        }
      })
    },
    handleRemove (file) {
      this.groverment.subFileIds = this.groverment.subFileIds.replace(file.id, '')
      this.groverment.subFileIds = this.groverment.subFileIds.split(',').filter(item => item).join(',')
      service.post(`frontPolicyFileController/deletePolicyFile`, {
        policyId: this.groverment.id,
        subFileIds: file.id
      })
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          success(this, '删除附件成功', 2000)
          this.getData()
        }
      })
    },
    download (id) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/frontPolicyFileController/downloadFile?fileId=${id}`
    },
    getData () {
      this.fileList3 = []
      service.get(`frontIndexController/getIndex`)
      .then(res => {
        if (res.data.code !== 1) {
          // notice(this, res.data.message, 2000)
        } else {
          console.log(res)
          this.groverment = res.data.result.tpPolicyList.filter(item => item.id === this.id)[0]
          console.log(this.groverment)
          this.groverment.subFileList.map(item => {
            let list = {}
            list.name = item.fileName
            list.url = item.filePath
            list.id = item.id
            this.fileList3.push(list)
          })
        }
      })
    }
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/frontPolicyFileController/uploadFile`
    }
  },
  created () {
    this.fileList3 = []
    this.id = JSON.parse(sessionStorage.grovermentId)
    setTimeout(() => {
      this.getData()
    }, 200)
  }
}
</script>


<style lang="scss">
.fileInfo {
  width: 100%;
  /* height: 820px; */
  background: #fff;
  border: 1px solid #EDF1F4;


  .el-upload-dragger {
    width:200px;
    height: 80px;
    img {
      width: 25px;
      height: 25px;
      padding: 15px;
    }
  }

  .top-title {
    background: #F1F2F7;
    padding-bottom: 20px;
  }

  &>.fileDetail {
    /* height: 700px; */
    background: #fff;

    .title {
      width: 100%;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      /* margin-bottom: 20px; */
      padding: 60px 0px;
      border-bottom: 1px solid #EDF1F4;
    }
    .company-detail {
      width: 90%;
      justify-content: center;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin: 20px auto 30px;
      display: flex;
      span {
        /* justify-content: center; */
        min-width: 200px;
      }
    }
    main {
      width: 88%;
      min-height: 400px;
      margin: 20px auto;
      overflow: auto;
    }
    footer {
      width: 88%;
      padding-top: 30px;
      margin: 0 auto;

      &:after {
        display: block;
        content: '';
        height: 0;
        clear: both;
        overflow: hidden;
        visibility: hidden;
      }
      &>span {

        float: left;
        &>img {
          margin-right: 10px;
          vertical-align: middle;
        }
      }

      .listbox {
        width: 350px;
        float: left;
        height: 100px;
        overflow-y: auto;
        display: block;
        margin-left: 10px;

        &>li {
          width: 350px;

          &:after {
            display: block;
            content: '';
            height: 0;
            clear: both;
            overflow: hidden;
            visibility: hidden;
          }

          &>span {
            float: left;
          }
          &>.el-button {
            float: right;
            margin-right: 15px;
            text-decoration: underline;
            padding: 0px;
            line-height: 19px;
          }
        }

      }
      .file-title {
        float: right;
        margin-right: 10px;
      }
      .upload-demo1 {
        float: right;
      }
      .upload-demo {
        float: right;
        width: 360px;

        .el-upload__tip {
          display: inline-block;
          margin-left: 10px;
        }
        .el-upload-list {
          height: 100px;
          max-height: 100px;
          margin-top: 10px;
          overflow: auto;
        }
      }
    }
  }
  .blue {
    color: #1AB3F7;
    cursor: pointer;
  }
  .back {
    padding: 10px 25px;
    background: #5091E6;
    margin-bottom: 20px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
</style>
