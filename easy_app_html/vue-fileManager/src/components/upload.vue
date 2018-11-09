<template>
 <div>
  <el-radio v-model="radio" :label="0">上传文件</el-radio>
  <el-radio v-model="radio" v-if="admin" :label="1">上传文件夹</el-radio>
  <div id="list" class="uploader-list"></div>
  <div id="wrapper">
   <div class="uploader-container">
    <div :id="id" @click="FolderParent" limitSize="1" :ext="ext" v-show="uploadBtn ? uploadFold : true"></div>
   </div>
  </div>
  <div class="el-upload__tip">{{tip}}</div>
  <div class="file-list">
   <ul class="el-upload-list el-upload-list--text">
    <li v-for="(file, index) in fileList" v-if="file.status === 'success' ? false : true" :class="['el-upload-list__item', 'is-' + file.status]" :key="index">
     <a class="el-upload-list__item-name">
      <i class="el-icon-document"></i>
      {{file.name.length >= 20 ? file.name.slice(0, 20) + '....' : file.name}}
     </a>
     <label class="el-upload-list__item-status-label">
      <i class="el-icon-upload-success el-icon-circle-check"></i>
     </label>
     <i class="el-icon-close" v-if="file.percentage >= 99 ? file.status === 'success' ? false : true : true" @click="removeFile(file)"></i>
     <el-progress
      :type="listType === 'picture-card' ? 'circle' : 'line'"
      :stroke-width="listType === 'picture-card' ? 6 : 2"
      :percentage="file.percentage"
      v-if="file.percentage >= 99 ? file.status === 'success' ? false : true : true">
     </el-progress>
    </li>
   </ul>
  </div>
 </div>
</template>
<script>
import '../utils/jquery'
import '../utils/webuploader'
import * as config from './../config'
// eslint-disable-next-line
import { Base64 } from 'js-base64'
// eslint-disable-next-line
import CryptoJS from 'crypto-js'
export default {
  name: 'fileUpload',
  props: {
    id: {
      type: String,
      default: function () {
        return 'filePicker'
      }
    },

    name: {
      type: String,
      required: true
    },

    data: Object,

    // 上传提示
    tip: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 文件后缀名限制
    ext: {
      type: String,
      default: function () {
        return 'jpg,jpeg,png,pdf,mp4,avi.mp3'
      }
    },
    // 分片大小设置
    chunkSize: {
      type: Number,
      default: function () {
        return 2097152
      }
    },
    // 分片上传重试次数
    chunkRetry: {
      type: Number,
      default: function () {
        return 0
      }
    },
    // 是否自动上传
    auto: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 上传文件大小限制
    sizeLimit: {
      type: Number,
      default: function () {
        return 209715200
      }
    }
  },
  computed: {
    uploadBtn () {
      return this.$store.state.uploadBtnBool
    },
    admin () {
      return this.$store.state.user.adminFlag
    },
    parentIds () {
      return this.$store.state.lookFolder.parentFolder
    }
  },
  watch: {
    radio () {
      if (this.radio === 1) {
        // eslint-disable-next-line
        $('.webuploader-element-invisible').attr('webkitdirectory', '')
        // eslint-disable-next-line
        $('.webuploader-element-invisible').attr('mozdirectory', '')
      } else {
        // eslint-disable-next-line
        $('.webuploader-element-invisible').removeAttr('webkitdirectory', '')
        // eslint-disable-next-line
        $('.webuploader-element-invisible').removeAttr('mozdirectory', '')
      }
    },
    parentIds (item) {
      if (item !== '') {
        let folderContent = this.$store.state.foldList.filter(data => data.id === Number(item))[0]
        if (!this.$store.state.user.adminFlag) {
          const arr = folderContent.parentIds.split(',')
          let foldWeight = null
          let fileManager = []
          if (folderContent.folderLevel > 2) {
            foldWeight = arr.splice(1, 2)
          } else if (folderContent.folderLevel === 1) {
            foldWeight = [item]
          } else if (folderContent.folderLevel === 2) {
            foldWeight = [this.$store.state.foldList.filter(data => data.id === Number(item))[0].parentId, item]
          }
          foldWeight.forEach(items => {
            var weightFolderOption = this.$store.state.foldList.filter(data => data.id === Number(items))[0]
            if (weightFolderOption.fileManager === 1) {
              fileManager.push(1)
            }
            if (weightFolderOption.fileUpload === 1) {
              fileManager.push(2)
            }
            if (weightFolderOption.fileView === 1) {
              fileManager.push(3)
            }
          })
          if (folderContent.folderLevel === 1 || folderContent.folderLevel === 2) {
            if (fileManager.includes(1) || fileManager.includes(2)) {
              this.uploadFold = true
            } else {
              this.uploadFold = false
            }
          } else {
            if (fileManager.includes(1) || fileManager.includes(2)) {
              this.uploadFold = true
            } else {
              this.uploadFold = false
            }
          }
        } else {
          this.uploadFold = true
        }
      } else {
        this.uploadFold = true
      }
    }
  },
  data () {
    return {
      // appId: AppConfig.appId,
      // securityKey: AppConfig.securityKey,
      // checkUrl: AppConfig.checkUrl,
      uploadUrl: `${config.contextPath}/common/uploadFile`,
      mergeUrl: `${config.contextPath}/common/saveFile`,
      addFolder: `${config.contextPath}/common/addFolderImport`,
      previewName: '选择文件',
      wul_fileMd5: '',
      wul_size: 0,
      wul_fileName: '',
      wul_chunk: 0,
      wul_uploader: '',
      fileList: [],
      listType: 'text',
      percentage: 0,
      companySpace: '',
      radio: 0,
      pathName: '',
      parentId: '',
      theLog: '',
      thePrev: '',
      parentIdList: [],
      parentFormId: '',
      uploadFold: true
    }
  },
  methods: {
    FolderParent () {
      // this.parentFormId =
    },
    /**
    * 获取当前上传列表中的文件
    * @returns {Array|*}
    */
    getFileList: function () {
      return this.fileList
    },
    // 绑定事件
    wul_init: function () {
      // 提示只能选择一个文件
      this.wul_uploader.on(
        'filesQueued',
        function (files) {
          // 此时往需要上传的文件列表中添加文件
          for (let i = 0; i < files.length; i++) {
            let file = {
              name: files[i].name,
              type: files[i].type,
              ext: files[i].ext,
              status: 'ready',
              percentage: 0,
              id: files[i].id,
              parentFolderId: this.$store.state.lookFolder.parentFolder
            }
            // this.fileObject = file;
            this.fileList.push(file)
          }
        }.bind(this)
      )

      // 文件校验格式和大小
      this.wul_uploader.on(
        'error',
        function (type) {
          if (type === 'Q_EXCEED_SIZE_LIMIT') {
            this.$message({
              message: '文件超过指定大小',
              type: 'error'
            })
          }
          if (type === 'Q_TYPE_DENIED') {
            this.$message({
              message: '文件格式错误，请选择文件',
              type: 'error'
            })
          }
        }.bind(this)
      )

      // 上传进度
      this.wul_uploader.on(
        'uploadProgress',
        function (file, percentage) {
          let uploadFile = this.fileList.find(item => item.id === file.id)
          let percentageing = parseInt(percentage * 100)
          if (percentageing === 100) percentageing = 99
          uploadFile.percentage = percentageing
          uploadFile.status = 'uploading'
        }.bind(this)
      )

      // 每次切片上传完成之后的判断
      this.wul_uploader.on('uploadAccept', function (object, ret) {
        if (ret.code !== 1) {
          this.$message({
            message: '上传失败,失败原因: ' + ret.message,
            type: 'error'
          })
          this.fileList.find(item => item.id === object.file.id).status = 'error'
          this.removeFile(object.file)
        }
      }.bind(this))

      // 成功
      // eslint-disable-next-line
      this.wul_uploader.on('uploadSuccess', function (file, response) {
      // eslint-disable-next-line
      }.bind(this))

      this.wul_uploader.on('uploadBeforeSend', function (object, data, headers) {
        delete data.id
        delete data.lastModifiedDate
        delete data.size
        delete data.type
        delete data.name
      })
    },

    option: function (key, val) {
      this.wul_uploader.option(key, val)
      var options = this.wul_uploader.options
      this.wul_uploader.destroy() // 注销uploader
      // eslint-disable-next-line
      this.wul_uploader = WebUploader.create(options)
      this.wul_init()
    },

    stop: function (id) {
      this.wul_uploader.removeFile(id, true)
    },

    removeFile: function (file) {
      this.fileList.splice(this.fileList.indexOf(file), 1)
      this.stop(file.id)
    },
    change: function () {
      this.option('accept', {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png'
      })
    },

    init () {
      // eslint-disable-next-line
      WebUploader.Uploader.register(
        {
          'before-send-file': 'beforeSendFile',
          'before-send': 'beforeSend',
          'after-send-file': 'afterSendFile'
        },
        {
          beforeSendFile: function (file) {
            if (file.source.webkitRelativePath && typeof (file.source.webkitRelativePath) === 'string') {
              if (this.theLog !== '') {
                this.thePrev = this.theLog
                this.theLog = file.source.webkitRelativePath
              } else {
                this.theLog = file.source.webkitRelativePath
                this.pathName = file.source.webkitRelativePath.split('/')[0]
                file.source.webkitRelativePath.split('/').forEach((item, index) => {
                  if (index <= file.source.webkitRelativePath.split('/').length - 2) {
                    if (index === 0) {
                      // eslint-disable-next-line
                      jQuery.ajax({
                        type: 'POST',
                        async: false,
                        url: this.addFolder,
                        data: {
                          parentId: this.$store.state.lookFolder.parentFolder,
                          folderName: item
                        },
                        success: (res) => {
                          // 其中得来的是 第一层文件夹的ids
                          if (res.code === 1) {
                            this.parentId = res.result
                            this.parentIdList.push(this.parentId)
                          }
                        }
                      })
                    } else {
                      // eslint-disable-next-line
                      jQuery.ajax({
                        type: 'POST',
                        async: false,
                        url: this.addFolder,
                        data: {
                          parentId: this.parentId,
                          folderName: item
                        },
                        success: (res) => {
                          // 其中得来的是 第一层文件夹的ids
                          if (res.code === 1) {
                            this.parentId = res.result
                            this.parentIdList.push(this.parentId)
                          }
                        }
                      })
                    }
                  }
                })
              }
              if (this.thePrev) {
                let pathList = []
                let thePrev = this.thePrev.split('/')
                let theLog = this.theLog.split('/')
                theLog.every((item, index) => {
                  if (index <= theLog.length - 2) {
                    if (item !== thePrev[index]) {
                      if (index === 0) {
                        this.parentId = ''
                        this.theLog = ''
                        this.thePrev = ''
                        this.parentIdList = []
                      } else {
                        this.parentIdList = this.parentIdList.splice(0, index)
                      }
                      for (var i = index; i <= theLog.length - 2; i++) {
                        pathList.push(theLog[i])
                      }
                      return false
                    }
                    return true
                  }
                })
                pathList.forEach((item, index) => {
                  // eslint-disable-next-line
                  jQuery.ajax({
                    type: 'POST',
                    async: false,
                    url: this.addFolder,
                    data: {
                      parentId: this.parentIdList.length ? this.parentIdList[this.parentIdList.length - 1] : this.$store.state.lookFolder.parentFolder,
                      folderName: item
                    },
                    success: (res) => {
                      // 其中得来的是 第一层文件夹的ids
                      if (res.code === 1) {
                        this.parentId = res.result
                        this.parentIdList.push(this.parentId)
                      }
                      if (this.parentIdList.length) {
                        this.theLog = file.source.webkitRelativePath
                      }
                    }
                  })
                })
              }
            }
            // eslint-disable-next-line
            var deferred = WebUploader.Deferred()
            // eslint-disable-next-line
            jQuery.ajax({
              type: 'post',
              url: `${config.contextPath}/common/uploadFileSize`,
              data: {
                fileSize: file.size
              },
              success: (res) => {
                if (res.code !== 1) {
                  this.$message({
                    message: '上传失败,失败原因: 存储空间不足',
                    type: 'error'
                  })
                  deferred.reject()
                }
              }
            })
            this.wul_uploader.md5File(file).then(
              function (val) {
                this.wul_fileMd5 = val
                this.wul_size = file.size
                this.wul_fileName = file.name
                // eslint-disable-next-line
                var timestamp = Date.parse(new Date()) / 1000
                this.wul_chunk = 0
                return deferred.resolve()
              }.bind(this)
            )
            return deferred.promise()
          }.bind(this),
          beforeSend: function (block) {
            // eslint-disable-next-line
            var deferred = WebUploader.Deferred()
            if (block.chunk < this.wul_chunk) {
              return deferred.reject()
            }
            // eslint-disable-next-line
            var timestamp = Date.parse(new Date()) / 1000;
            this.wul_uploader.options.formData = {
              chunks: block.chunks,
              chunk: this.wul_chunk,
              md5Value: this.wul_fileMd5
            }
            deferred.resolve()
            return deferred.promise()
          }.bind(this),
          afterSendFile: async function (file) {
            // eslint-disable-next-line
            let parentIdFolder = ''
            this.fileList.forEach(item => {
              if (item.id === file.id) {
                parentIdFolder = item.parentFolderId
              }
            })
            // eslint-disable-next-line
            var timestamp = Date.parse(new Date()) / 1000
            let type
            if (file.type.indexOf('image') === 0) {
              type = '1'
            } else if ((file.type.indexOf('application') === 0)) {
              type = '2'
            } else if (file.type.indexOf('video') === 0) {
              type = '3'
            } else if (file.type.indexOf('audio') === 0) {
              type = '4'
            } else {
              type = '5'
            }
            if (!this.fileList.find(item => item.id === file.id)) return
            // 如果分块上传成功，则通知后台合并分块
            if (!this.$store.state.lookFolder.parentFolder) {
              this.$message({
                message: '上传失败,失败原因: 不能再第一层目录下上传文件',
                type: 'error'
              })
            } else {
              // eslint-disable-next-line
              jQuery.ajax({
                type: 'POST',
                url: this.mergeUrl,
                data: {
                  fileMd5: this.wul_fileMd5,
                  fileName: file.name,
                  fileSize: file.size,
                  fileType: type,
                  folderId: this.radio === 0 ? parentIdFolder : this.parentId
                },
                success: function (response) {
                  if (response.code === 1) {
                    this.fileList.find(item => item.id === file.id).status = 'success'
                    this.$emit('handleSuccess', response)
                  } else {
                    file.status = 'exception'
                    this.$message({
                      message: '上传失败,失败原因:' + response.message,
                      type: 'error'
                    })
                  }
                }.bind(this)
              })
            }
          }.bind(this)
        }
      )
      // eslint-disable-next-line
      this.wul_uploader = new WebUploader.Uploader({
        // swf文件路径
        swf: '../js/Uploader.swf',
        // 文件接收服务端。
        server: this.uploadUrl,

        // 定义选择按钮
        pick: {
          id: '#' + this.id,
          innerHTML: this.previewName
        },
        // 自动上传
        auto: true,
        // 禁止浏览器打开文件
        disableGlobalDnd: true,
        // 添加截图功能
        paste: '#wrapper',
        // 定义拖动面板
        dnd: '#wrapper',
        // 分片上传
        chunked: true,
        // 分片大小为2M
        chunkSize: this.chunkSize,
        // 分片上传失败重试次数
        chunkRetry: this.chunkRetry,
        // 图片不做压缩
        compress: false,
        // 队列设置10个,为了选择多个文件的时候能提示
        // fileNumLimit: 10,
        fileVal: 'uploadFile',
        // 提前准备好下一个文件
        prepareNextFile: false,
        // 限制单个文件大小
        fileSingleSizeLimit: this.sizeLimit,
        // 线程数
        threads: 1,
        // 支持重复文件上传
        duplicate: true,
        // 限制格式
        accept: {
          title: 'access',
          extensions: this.ext
        }
      })
      this.wul_init()
    }
  },

  mounted () {
    this.init()
  },

  beforeDestroy () {
    // this.wul_uploader.destroy()
  }
}
</script>
<style lang="scss">
#wrapper {
  width: 100%;
  margin: 0 auto;
  height: 35px;
}

.img-preview {
  width: 160px;
  height: 90px;
  margin-top: 1em;
  border: 1px solid #ccc;
}

#filePicker {
  height: 30px !important;
}

.cropper-wraper {
  position: relative;
}

.upload-btn {
  background: #ffffff;
  border: 1px solid #cfcfcf;
  color: #565656;
  padding: 10px 18px;
  display: inline-block;
  border-radius: 3px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;

  position: absolute;
  right: 1em;
  bottom: 2em;
}
.upload-btn:hover {
  background: #f0f0f0;
}
.uploader-container {
  width: 100%;
  font-size: 10px;
  padding-top: 10px;
}

.el-upload-list {
  height: 225px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: auto;

}

.webuploader-container {
  position: relative;
  width: 100px;
  height: 21px;
  float: left;
}
.webuploader-element-invisible {
  position: absolute !important;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
}
.webuploader-pick {
  position: relative;
  display: inline-block;
  cursor: pointer;
  background: #00b7ee;
  padding: 6px 15px;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
}
.webuploader-pick-hover {
  background: #00a2d4;
}

.webuploader-pick-disable {
  opacity: 0.6;
  pointer-events: none;
}
.file-list {
  width: 100%;
}
</style>
