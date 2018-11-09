<template>
  <div class="fileCard" ref='fileCard' @click="closeFold">
    <!-- <div class="cardBin"></div> -->
    <!-- <div class="boxFold"></div> -->
    <div class="allselect"><el-checkbox v-model="checkSelect" :indeterminate="isIndeterminate" @change="changeBox">全选</el-checkbox></div>
    <div class="folderCard">
      <div class="cardfold" v-for="(item, index) in filesList" @contextmenu.prevent="menutext($event, item, index)" @click.stop="addSelect(item)" :key="index" :class="item.show ? 'selectThe' : ''" ref="selectFiles">
        <el-checkbox v-model="item.check" @change="selectFileList(item)" ></el-checkbox>
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
        <span v-if="!item.rename">
          <span>{{ item.name.length > 3 ? item.name.slice(0, 3) + '...' : item.name }}</span>
          <br>
          <span>{{ item.userName }}</span>
        </span>
      </div>
    </div>
    <div v-if="filesList.length === 0 && addFold" class="noFolder">
      <img src="./../../../assets/image/no-result.png" alt="">
    </div>
    <ul class="selectBox" v-if="listShow" ref="selectMenu" :style="{left: trueLeft + 'px',top: trueTop + 'px'}">
      <li  v-for="(item, index) in operation" :key="index" @click.stop="renameFold(item)"  ><img :src="item.icon" alt="">
      {{ item.name }}
      </li>
    </ul>
    <!-- <div class="write" @click="closeFile"></div> -->
  </div>
</template>
<script>
import deletes from '@/assets/image/delete-selected.png'
// import BoxChoose from './../../../utils/boxChoose'
export default {
  name: 'fileCard',
  props: ['folderList'],
  data () {
    return {
      filesList: [],
      addFold: true,
      canvasBool: true,
      folderName: '',
      trueLeft: 0,
      trueTop: 0,
      folderNames: '',
      operation: [{icon: deletes, name: '删除文件'}, {icon: deletes, name: '还原文件'}],
      moveFold: false,
      listShow: false,
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
          } else {
            items.show = false
          }
        } else if (item.folderId && !item.fileId) {
          if (item.folderId === items.folderId) {
            items.show = true
          } else {
            items.show = false
          }
        }
      })
      this.$emit('fileList', this.filesList)
    },
    // 点击操作控制
    async renameFold (item) {
      this.trueLeft = 0
      this.listShow = false
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
            fileIds: this.folderNames.fileSuffix ? this.folderNames.folderId : '',
            folderIds: this.folderNames.fileSuffix ? '' : this.folderNames.folderId
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
          fileId: this.folderNames.fileSuffix ? this.folderNames.folderId : '',
          folderId: this.folderNames.fileSuffix ? '' : this.folderNames.folderId
        })
        this.$emit('refresh')
      }
    }
  },
  watch: {
    folderList (item) {
      this.listShow = false
      this.filesList = [...item, ...{check: false}]
      this.isIndeterminate = false
      this.filesList.forEach(item => {
        item.check = false
        item.show = false
      })
    }
  },
  mounted () {
    // const _this = this
    // this.chooseBox = new BoxChoose('.cardBin', (item) => {
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
    this.filesList = this.$store.state.recycle.recycleList.list
  }
}
</script>
<style lang='scss' scoped>
.fileCard {
  width: 100%;
  height: 100%;
  position: relative;
  .cardBin {
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
  .allselect {
    width: 100%;
    padding-left: 15px;
    border-bottom: 1px solid #E3E3E3;
  }
  .folderCard {
    position: absolute;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    .cardfold {
      width: 120px;
      height: 120px;
      padding: 10px;
      margin: 10px;
      position: relative;
      display: flex;
      align-items: center;;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      cursor: pointer;
      position: relative;
      label {
        position: absolute;
        top: 0px;
        left: 15px;
        display: none;
      }
      img {
        width: 50px;
        height: 50px;
        user-select: none;
        margin-bottom: 4px;
      }
      span {
        width: 100%;
        font-size: 15px;
      }
      &.selectThe {
        background: #c6e2ff;
        label {
          display: block;
        }
      }
      &:hover {
        background: #c6e2ff;
        label {
          display: block;
        }
      }
      textarea {
        height: 30px;
        border: 1px solid #e3e3e3;
      }
    }
  }
  .write {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
  }
  .addcard {
    width: 88px;
    height: 98px;
    padding: 10px;
    margin: 10px;
    text-align: center;
    img {
      width: 50px;
      height: 50px;
      user-select: none;
      margin-bottom: 5px;
    }
    div {
      height: 20px;
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
