<template>
  <div class="fileList" ref="fileList" @click="closeFold">
    <!-- <div class="recycleBin"></div> -->
    <table v-if="filesList.length">
      <thead>
        <tr>
          <td>
            <el-checkbox v-model="checkSelect" :indeterminate="isIndeterminate" @change="changeBox" >全选</el-checkbox>
          </td>
          <td>文件名</td>
          <td>文件大小</td>
          <td>删除时间</td>
          <td>上传人</td>
        </tr>
      </thead>
      <tbody style="position:relative; z-index:99999999">
        <tr v-for="(item, index) in filesList" ref="selectFiles" @contextmenu.prevent="menutext($event, item, index)" @click.stop="addSelect(item)" :key="index" :class="item.show ? 'selectThe' : ''">
          <td><el-checkbox  @change='selectFileList(item)' v-model="item.check"></el-checkbox></td>
          <td>
            <img src="./../../../assets/image/folder-list.png" v-if="!item.fileId">
            <img src="./../../../assets/image/word-list.png" v-else-if="item.fileId && new RegExp(/(.doc|.docx)$/).test(item.name.toLowerCase())">
            <img :src="`/fileManager/common/imageView?fileId=${item.fileId}`" v-else-if="item.fileId && new RegExp(/(.jpg|.png|.gif|.bmp|.jpeg)$/).test(item.name.toLowerCase())">
            <img src="./../../../assets/image/zip-list.png" v-else-if="item.fileId && new RegExp(/(.zip|.rar|.arj|.gz|.z)$/).test(item.name.toLowerCase())">
            <img src="./../../../assets/image/music-list.png" v-else-if="item.fileId && new RegExp(/(.wav|.aif|.au|.mpg|.mp3|.ram|.wma|.mmf|.amr|.aac|.flac)$/).test(item.name.toLowerCase())">
            <img src="./../../../assets/image/video-list.png" v-else-if="item.fileId && new RegExp(/(.mpg|.mp4|.rm|.mpeg|.avi|.rmvb|.mov|.wmv|.asf|.dat|.mpe|.asx|.wvx|.mpa)$/).test(item.name.toLowerCase())">
            <img src="./../../../assets/image/xls-list.png" v-else-if="item.fileId && new RegExp(/(.xls|.xlsx)$/).test(item.name.toLowerCase())">
            <img src="./../../../assets/image/ppt-list.png" v-else-if="item.fileId && new RegExp(/(.ppt|.pptx)$/).test(item.name.toLowerCase())">
            <img src="./../../../assets/image/pdf-list.png" v-else-if="item.fileId && new RegExp(/(.pdf)$/).test(item.name.toLowerCase())">
            <img src="./../../../assets/image/txt-list.png" v-else-if="item.fileId && new RegExp(/(.txt)$/).test(item.name.toLowerCase())">
            <img src="./../../../assets/image/html-list.png" v-else-if="item.fileId && new RegExp(/(.html)$/).test(item.name.toLowerCase())">
            <img src="./../../../assets/image/unknown-list.png" v-else>
            <span v-if="!item.rename">{{ item.name.length > 20 ? item.name.slice(0, 20) + '...' + (item.fileSuffix ? item.fileSuffix : '') : item.name }}</span>
          </td>
          <td>
            <span v-if="item.fileSize">
              {{ item.fileSize | SizeOf }}
            </span>
            <span v-else>--------</span>
          </td>
          <td>{{item.createdTime | format('yyyy/MM/dd hh:mm')}}</td>
          <td>{{item.userName}}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="noFolder">
      <img src="./../../../assets/image/no-result.png" alt="">
    </div>
    <ul class="selectBox" ref="selectMenu" v-if="listShow" :style="{left: trueLeft + 'px',top: trueTop + 'px'}">
      <li  v-for="(item, index) in operation" :key="index" @click.stop="renameFold(item)"  ><img :src="item.icon" alt="">{{ item.name }}</li>
    </ul>
    <!-- <div class="write" @click="closeFile"></div> -->
  </div>
</template>
<script>
import deletes from '@/assets/image/delete-selected.png'
import reduction from '@/assets/image/reduction.png'
// import BoxChoose from './../../../utils/boxChoose'
export default {
  name: 'fileList',
  props: ['folderList'],
  data () {
    return {
      chooseBox: '',
      addFold: true,
      folderName: '',
      filesList: [],
      canvasBool: true,
      listShow: false,
      trueLeft: 0,
      trueTop: 0,
      folderNames: '',
      operation: [{icon: deletes, name: '删除文件'}, {icon: reduction, name: '还原文件'}],
      moveFold: false,
      defaultProps: {
        children: 'children',
        name: 'name'
      },
      selectFoldId: '',
      changeType: '',
      checkSelect: false,
      isIndeterminate: false
    }
  },
  watch: {
    folderList (item) {
      this.checkSelect = false
      this.listShow = false
      this.isIndeterminate = false
      this.filesList = [...item, ...{check: false}]
      this.folderList.forEach(item => {
        item.show = false
        item.check = false
      })
    }
  },
  methods: {
    addSelect (item) {
      this.$forceUpdate()
      item.check = !item.check
      item.show = !item.show
      this.listShow = false
      let arr = []
      this.folderList.forEach(item => {
        if (item.check) {
          arr.push(true)
        } else {
          arr.push(false)
        }
      })
      if (arr.includes(true)) {
        this.isIndeterminate = true
      } else {
        this.isIndeterminate = false
      }
      this.$emit('fileList', this.filesList)
    },
    selectFileList (item) {
      this.$forceUpdate()
      this.listShow = false
      item.show = !item.show
      let count = this.filesList.filter(item => item.check)
      count.length === this.filesList.length ? this.checkSelect = true : this.checkSelect = false
      if (this.checkSelect) {
        this.isIndeterminate = false
      } else {
        this.isIndeterminate = true
      }
      if (count.length === 0) {
        this.isIndeterminate = false
      }
      this.$emit('fileList', this.filesList)
    },
    closeFold () {
      this.$forceUpdate()
      this.filesList.forEach(item => {
        item.show = false
        item.userName += ' '
        item.rename = false
        item.check = false
      })
      this.isIndeterminate = false
      this.listShow = false
      this.trueLeft = 0
      this.trueTop = 0
      this.$emit('filesList', this.filesList)
    },
    changeBox () {
      this.$forceUpdate()
      this.folderList.forEach(item => {
        if (this.checkSelect) {
          item.show = true
          item.check = true
          this.isIndeterminate = false
        } else {
          item.show = false
          item.check = false
        }
      })
      this.$emit('fileList', this.filesList)
    },
    // 鼠标右击菜单
    menutext (e, item, index) {
      this.$forceUpdate()
      this.listShow = true
      this.$nextTick(() => {
        if (e.pageY + this.$refs.selectMenu.offsetHeight > document.body.offsetHeight) {
          this.trueTop = e.pageY - this.$refs.selectMenu.offsetHeight
        } else {
          this.trueTop = e.pageY
        }
        if (e.pageX + this.$refs.selectMenu.offsetWidth > document.body.offsetWidth) {
          this.trueLeft = e.pageX - this.$refs.selectMenu.offsetWidth
        } else {
          this.trueLeft = e.pageX
        }
      })
      this.filesList.forEach(items => {
        if (item.folderId && item.fileId) {
          if (item.fileId === items.fileId) {
            items.show = true
            items.check = true
          } else {
            items.show = false
            items.check = false
          }
        } else if (item.folderId && !item.fileId) {
          if (item.folderId === items.folderId) {
            items.show = true
            items.check = true
          } else {
            items.show = false
            items.check = false
          }
        }
      })
      this.$emit('fileList', this.filesList)
    },
    // 点击操作控制
    async renameFold (item) {
      this.listShow = false
      this.trueLeft = 0
      this.trueTop = 0
      if (item.name === '删除文件') {
        this.$confirm(`<span style='color:red'>是否彻底删除？</span>`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(async () => {
          this.filesList.forEach(item => {
            if (item.show) {
              this.folderNames = item
            }
          })
          await this.$store.dispatch('thoroughly', {
            fileIds: this.folderNames.fileId ? this.folderNames.fileId : '',
            folderIds: this.folderNames.fileId ? '' : this.folderNames.folderId
          })
          this.$emit('refresh')
        })
      } else if (item.name === '还原文件') {
        this.filesList.forEach(item => {
          if (item.show) {
            this.folderNames = item
          }
        })
        await this.$store.dispatch('reduction', {
          fileId: this.folderNames.fileId ? this.folderNames.fileId : '',
          folderId: this.folderNames.fileId ? '' : this.folderNames.folderId
        })
        this.$emit('refresh')
      }
    }
  },
  mounted () {
    // const _this = this
    // this.chooseBox = new BoxChoose('.recycleBin', (item) => {
    //   if (item.move) {
    //     _this.listShow = false
    //   }
    //   if (item.type === 'move') {
    //     for (var i = 0; i < _this.$refs.selectFiles.length; i++) {
    //       var sl = _this.$refs.selectFiles[i].offsetWidth + _this.$refs.selectFiles[i].offsetLeft
    //       var st = _this.$refs.selectFiles[i].offsetHeight + _this.$refs.selectFiles[i].offsetTop
    //       if (sl > item.startX && st > item.startY && _this.$refs.selectFiles[i].offsetLeft < item.startX + item.width && _this.$refs.selectFiles[i].offsetTop < item.startY + item.height) {
    //         _this.filesList[i].show = true
    //         _this.filesList[i].userName += ' '
    //       } else {
    //         _this.filesList[i].show = false
    //         _this.filesList[i].userName += ' '
    //       }
    //       _this.$emit('fileList', _this.filesList)
    //     }
    //   }
    // })
    // document.addEventListener('dblclick', (value) => {
    //   this.filesList.forEach(item => {
    //     item.show = false
    //     item.userName += ' '
    //   })
    //   this.listShow = false
    //   this.trueLeft = 0
    //   this.trueTop = 0
    //   _this.$emit('fileList', _this.filesList)
    // })
  },
  created () {
    this.$emit('refresh')
  }
}
</script>
<style lang='scss' scoped>
  .fileList {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    .recycleBin {
      position:absolute;
      width:0;
      height:0;
      margin:0;
      padding:0;
      border: 1px #0099FF dashed;
      background: rgba(195, 213, 237, 0.6);
      z-index:1000;
      opacity:0.6;
      top: 0;
      left: 0;
    }
    .write {
      width: 100%;
      height: 100%;
      z-index: 1;
      position: absolute;
    }
    table {
      width: 80%;
      position: absolute;
      z-index: 2;
      thead {
        user-select:none;
        tr {
          td {
            padding: 10px;
            &:nth-child(1) {
              width: 30px;
              text-align: center;
            }
          }
          border: 1px solid #E3E3E3;
        }
      }
      tbody {
        user-select:none;
        tr {
          cursor: pointer;
          border: 1px solid #E3E3E3;
          td {
            padding: 10px;
            img {
              width: 40px;
              height: 40px;
            }
            img + div {
              width: 50%;
              margin-left: 20px;
            }
          }
          &.selectThe {
            background: #c6e2ff;
          }
          &:hover {
            background: #c6e2ff;
          }
        }
      }
    }
    .noFolder {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .selectBox {
      width: 150px;
      background: #fff;
      border: 1px solid #E3E3E3;
      position: fixed;
      z-index: 9999999;
      border-radius: 5px;
      li {
        user-select: none;
        margin: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 15px;
          height: 16px;
          margin-right: 10px;
        }
      }
    }
  }
</style>
