<template>
  <div class="preview">
    <div v-if="type === 'image'" class="imgPreView">
      <div class="centerImage">
        <img :src="`/fileManager/common/imageView?fileId=${currentImage}`">
      </div>
      <div class="thumbnail">
        <ul ref="imgContent" :style="{'margin-left': distance + 'px'}" >
          <li v-for="(item, index) in images" :key="index" :class="currentImage === item.id ? 'select' : ''" ref="imgView" @click.stop="switchImage(item, index)">
            <img :src="`/fileManager/common/imageView?fileId=${item.id}`" alt="">
          </li>
        </ul>
      </div>
      <div class="left" @click.stop="before">
        <img src="./../../../assets/image/left.png">
      </div>
      <div class="right" @click.stop="next">
        <img src="./../../../assets/image/right.png">
      </div>
      <div class="close el-icon-close" @click.stop="close"></div>
    </div>
    <div v-else-if="type === 'order' || type === 'multimedia'" class="orderPreView">
      <iframe :src="`/fileManager/common/fileView?fileId=${current.id}`"></iframe>
      <div class="close el-icon-close" @click.stop="close"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'preview',
  data () {
    return {
      images: [],
      multimedia: [],
      other: [],
      currentImage: '',
      distance: '',
      imagContents: '',
      imgIndex: '',
      currentOrder: '',
      currentMultimedia: ''
    }
  },
  props: ['type', 'current'],
  methods: {
    // 图片切换
    switchImage (item, index) {
      this.imgIndex = index
      this.currentImage = item.id
      this.distance = this.imagContents - (this.$refs.imgView[index].offsetLeft - this.$refs.imgContent.offsetLeft)
    },
    // 切换之前的图片
    before () {
      this.imgIndex--
      if (this.imgIndex < 0) {
        this.$emit('imgViewShow')
      } else {
        this.currentImage = this.images[this.imgIndex].id
        this.distance = this.imagContents - (this.$refs.imgView[this.imgIndex].offsetLeft - this.$refs.imgContent.offsetLeft)
      }
    },
    next () {
      this.imgIndex++
      if (this.imgIndex > this.images.length - 1) {
        this.$emit('imgViewShow')
      } else {
        this.currentImage = this.images[this.imgIndex].id
        this.distance = this.imagContents - (this.$refs.imgView[this.imgIndex].offsetLeft - this.$refs.imgContent.offsetLeft)
      }
    },
    close () {
      this.$emit('imgViewShow')
    }
  },
  mounted () {
    if (this.type === 'image') {
      this.currentImage = this.current.id
      this.imagContents = this.$refs.imgContent.offsetLeft
    } else if (this.type === 'order') {
      this.currentOrder = this.current.id
    } else if (this.type === 'multimedia') {
      this.currentOrder = this.current.id
    }
    this.$nextTick(() => {
      if (this.type === 'image') {
        this.images.forEach((item, index) => {
          if (item.id === this.currentImage) {
            this.imgIndex = index
            this.distance = this.imagContents - (this.$refs.imgView[index].offsetLeft - this.$refs.imgContent.offsetLeft)
          }
        })
      }
    })
  },
  async created () {
    if (this.type === 'image') {
      this.filesList = this.$store.state.lookFolder.folderList
      this.filesList.forEach(item => {
        if (item.fileSuffix) {
          if (this.type === 'image') {
            if (new RegExp(/(.jpg|.png|.gif|.bmp|.jpeg)$/).test(item.fileSuffix)) {
              this.images.push(item)
            }
          } else if (this.type === 'multimedia') {
            if (new RegExp(/(.mp3|.mp4|.mkv|.mpg|.avi|.mid|.wav)$/).test(item.fileSuffix)) {
              this.multimedia.push(item)
            }
          } else if (this.type === 'order') {
            if (!new RegExp(/(.jpg|.png|.gif|.bmp|.jpeg)$/).test(item.fileSuffix)) {
              if (!new RegExp(/(.mp3|.mp4|.mkv|.mpg|.avi|.mid|.wav)$/).test(item.fileSuffix)) {
                this.other.push(item)
              }
            }
          }
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.preview {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0 , 0 , 0.5);
  z-index: 2002;
  .orderPreView {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    iframe {
      width: 85%;
      height: 90vh;
      background: #fff;
    }
    .close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(256, 256, 256, .35);
      color: rgba(256, 256, 256, .67);
      text-align: center;
      line-height: 50px;
      font-size: 30px;
      font-weight: bolder;
    }
  }
  .multimediaPreView {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .imgPreView {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .centerImage {
      height: 600px;
      background: #fff;
      img {
        height: 100%;
      }
    }
    .thumbnail {
      width: 100%;
      position: absolute;
      bottom: 00px;
      overflow: hidden;
      background: rgba(0, 0 , 0 , 0.7);
      ul {
        margin-left: 50%;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        li {
          width: 60px;
          height: 60px;
          margin: 3px;
          border: 1px solid #E3E3E3;
          background: #fff;
          img {
            width: 100%;
            height: 100%;
          }
          &.select {
            border: 1px solid #409EFF;
          }
        }
      }
    }
    .left {
      position: absolute;
      top: 50%;
      left: 20px;
      width: 100px;
      height: 100px;
      margin-top: -50px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      position: absolute;
      top: 50%;
      right: 20px;
      width: 100px;
      height: 100px;
      margin-top: -50px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(256, 256, 256, .35);
      color: rgba(256, 256, 256, .67);
      text-align: center;
      line-height: 50px;
      font-size: 30px;
      font-weight: bolder;
    }
  }
}
</style>
