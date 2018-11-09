<template>
  <div class="lookfolder">

   <crumbs :crumbsList='crumbsList'></crumbs>

    <div class="handle">

      <handle v-on:deleteFold="deleteFolder"></handle>

      <select-option v-on:viewType='viewType'></select-option>

    </div>
    <div class="listfiles">

      <file-list v-on:preView='preView' ref="listMenu" v-on:fileList="fileList" :folderList='foldersList' v-if="viewShow === 0"></file-list>

      <file-card v-on:preView='preView' ref="cardMenu" :folderList='foldersList' v-on:filesList="fileList" v-else></file-card>

    </div>
    <preview v-if="preview" :type='fileType' :current='current' v-on:imgViewShow='imgViewShow'></preview>
  </div>
</template>
<script>
import crumbs from './components/crumbs'

import handle from './components/handle'

import selectOption from './components/selectOption'

import fileList from './components/fileList'

import fileCard from './components/fileCard'

import preview from './components/preview'

import Vue from 'vue'
export default {
  name: 'lookfolder',
  data () {
    return {
      viewShow: 0,
      sameLevel: new Vue(),
      foldList: [],
      ext: '',
      tip: '',
      preview: false,
      fileType: 'images',
      current: ''
    }
  },
  components: {
    crumbs,
    handle,
    selectOption,
    fileList,
    fileCard,
    preview
  },
  computed: {
    foldersList () {
      if (this.$store.state.lookFolder.folderList) {
        return this.$store.state.lookFolder.folderList
      } else {
        return []
      }
    },
    crumbsList () {
      if (this.$store.state.lookFolder.crumbs.length) {
        return this.$store.state.lookFolder.crumbs
      } else {
        return []
      }
    }
  },
  methods: {
    imgViewShow () {
      this.preview = false
    },
    // 文件预览
    preView (item) {
      if (new RegExp(/(.jpg|.png|.gif|.bmp|.jpeg)$/).test(item.fileSuffix)) {
        this.fileType = 'image'
      }
      if (new RegExp(/(.mp3|.mp4|.mkv|.mpg|.avi|.mid|.wav)$/).test(item.fileSuffix)) {
        this.fileType = 'multimedia'
      }
      if (!new RegExp(/(.jpg|.png|.gif|.bmp|.jpeg)$/).test(item.fileSuffix)) {
        if (!new RegExp(/(.mp3|.mp4|.mkv|.mpg|.avi|.mid|.wav)$/).test(item.fileSuffix)) {
          this.fileType = 'order'
        }
      }
      this.current = item
      this.preview = true
    },
    // 筛选处选中的文件
    fileList (data) {
      this.foldList = data.filter(item => item.show === true)
    },
    handleSuccess (data) {
      console.log(data)
    },
    // 文件删除
    deleteFolder () {
      if (this.viewShow === 0) {
        this.$refs.listMenu.listView()
      } else {
        this.$refs.cardMenu.listView()
      }
      this.$confirm(`<span style='color:red'>确认要把所选文件放入回收站吗？<br/>删除的文件只有管理员可以通过回收箱还原？</span>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(async () => {
        if (this.foldList.length) {
          var fileIds = []
          var folderIds = []
          this.foldList.forEach(item => {
            if (!item.fileType) {
              folderIds.push(item.id)
            } else {
              fileIds.push(item.id)
            }
          })
          await this.$store.dispatch('deleteFold', {
            folderId: this.$store.state.lookFolder.parentFolder ? this.$store.state.lookFolder.parentFolder : 0,
            fileIds: fileIds.join(','),
            folderIds: folderIds.join(',')
          })
          if (this.$store.state.lookFolder.parentFolder) {
            await this.$store.dispatch('getFolder')
            await this.$store.dispatch('getFolder')
            await this.$store.dispatch('folderList')
          } else {
            await this.$store.dispatch('folderList')
            var allFold = this.$store.state.foldList.filter(item => item.parentId === 0)
            this.$store.dispatch('allFold', allFold)
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    viewType (data) {
      this.viewShow = data
      if (this.foldersList.length) {
        this.foldersList.forEach(item => {
          item.show = false
          item.check = false
        })
      }
    }
  },
  mounted () {
    // document.onclick = () => {
    //   this.preview = !this.preview
    // }
  }
}
</script>
<style lang='scss' scoped>
  .lookfolder {
    min-width: 1100px;
    height: 100%;
    .handle {
      width: 100%;
      padding: 10px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #E3E3E3;
    }
    .listfiles {
      width: 100%;
      height: calc(100% - 101px);
    }
  }
</style>
