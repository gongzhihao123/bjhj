<template>
  <div class="handles">
    <el-button v-if="uploadFold" @click.stop="uploadFile">上传</el-button>
    <el-button @click.stop="downloadFile">下载</el-button>
    <el-button v-if="delFold" @click.stop="deleteFold">删除</el-button>
    <el-button v-if="addFolder" @click.stop="addFolders">新建文件夹</el-button>
    <el-dropdown v-if="operat" @command='changOperation' type="primary">
      <el-button trigger="click">更多</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in options"
          :key="item.id"
          :command="item.id"
          v-if="item.id === 0 ? moveFold : true"
        >{{ item.content }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  name: 'handle',
  data () {
    return {
      options: [{id: 0, content: '移动到'}, {id: 1, content: '复制到'}],
      upload: false,
      delFold: true,
      addFolder: true,
      uploadFold: true,
      operat: true,
      moveFold: false,
      adminFlag: false
    }
  },
  computed: {
    parentId () {
      return this.$store.state.lookFolder.parentFolder
    }
  },
  watch: {
    parentId (item) {
      if (item !== '') {
        console.log(this.$store.state.foldList)
        let folderContent = this.$store.state.foldList.filter(data => data.id === Number(item))[0]
        console.log(this.$store.state.foldList)
        if (!this.$store.state.user.adminFlag) {
          const arr = folderContent.parentIds.split(',')
          let foldWeight = null
          let fileManager = []
          if (folderContent.folderLevel > 2) {
            foldWeight = arr.splice(1, 2)
          } else if (folderContent.folderLevel === 1) {
            foldWeight = [item]
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
          } else if (folderContent.folderLevel === 2) {
            foldWeight = [this.$store.state.foldList.filter(data => data.id === Number(item))[0].parentId, item]
          }
          if (folderContent.folderLevel !== 1) {
            foldWeight.forEach((items, index) => {
              var weightFolderOption = this.$store.state.foldList.filter(data => data.id === Number(items))[0]
              if (index === 0) {
                if (weightFolderOption.fileManager === 1) {
                  fileManager.push(1)
                  if (weightFolderOption.fileUpload === 1) {
                    fileManager.push(2)
                  }
                  if (weightFolderOption.fileView === 1) {
                    fileManager.push(3)
                  }
                }
              } else {
                if (weightFolderOption.fileManager === 1) {
                  fileManager.push(1)
                }
                if (weightFolderOption.fileUpload === 1) {
                  fileManager.push(2)
                }
                if (weightFolderOption.fileView === 1) {
                  fileManager.push(3)
                }
              }
            })
          }
          if (folderContent.folderLevel === 1 || folderContent.folderLevel === 2) {
            this.operat = false
            if (fileManager.includes(1)) {
              this.addFolder = true
              this.delFold = true
              this.uploadFold = true
            } else {
              this.addFolder = false
              this.delFold = false
              this.uploadFold = false
            }
            if (fileManager.includes(2)) {
              this.addFolder = true
              this.uploadFold = true
            }
          } else {
            this.operat = true
            if (fileManager.includes(1)) {
              this.addFolder = true
              this.delFold = true
              this.uploadFold = true
              this.moveFold = true
            } else {
              this.delFold = false
              this.moveFold = false
            }
            if (fileManager.includes(2)) {
              this.downFolder = true
              this.uploadFold = true
              this.addFolder = true
            }
            if (!fileManager.includes(2) && !fileManager.includes(1)) {
              this.uploadFold = false
              this.addFolder = false
              this.downFolder = false
            }
          }
        } else {
          if (folderContent.folderLevel >= 2) {
            this.moveFold = true
          } else {
            this.moveFold = false
          }
        }
      } else {
        this.moveFold = false
        if (!this.adminFlag) {
          this.uploadFold = false
          this.addFolder = false
          this.delFold = false
          this.operat = false
        }
      }
    }
  },
  methods: {
    changOperation (item) {
      this.$parent.sameLevel.$emit('changeType', item + 1)
    },
    addFolders () {
      this.$parent.sameLevel.$emit('add')
    },
    deleteFold () {
      this.$emit('deleteFold')
    },
    downloadFile () {
      this.$parent.sameLevel.$emit('downloadFile')
    },
    listView () {
      this.$parent.sameLevel.$emit('listViews')
    },
    uploadFile () {
      this.$store.dispatch('uploadFile', this.upload = true)
    }
  },
  async mounted () {
    await this.$store.dispatch('initPage')
    this.adminFlag = this.$store.state.user.adminFlag
    if (this.$store.state.lookFolder.parentFolder === '') {
      if (!this.adminFlag) {
        this.uploadFold = false
        this.addFolder = false
        this.delFold = false
        this.operat = false
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.handles {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  div {
    margin-left: 10px;
  }
}
</style>
