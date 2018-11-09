<template>
  <div id="square">
    <mt-header fixed title="微课广场">
        <router-link to="/" slot="left">
          <i class="el-icon-arrow-left" @click="route"></i>
        </router-link>
        <mt-button slot="right"><img src="../../assets/images/search.png" @click="searchCourse"></mt-button>
    </mt-header>
      <ul class="search">
        <li><span @click="activeIndex = 0" v-if="peroid[itemIndex1]">{{peroid[itemIndex1].name}}<i class ="el-icon-caret-bottom"></i></span></li>
        <li><span @click="activeIndex = 1" v-if="grade[itemIndex2]">{{grade[itemIndex2].name}}<i class ="el-icon-caret-bottom"></i></span></li>
        <li><span @click="activeIndex = 2" v-if="subject[itemIndex3]">{{subject[itemIndex3].curriculumName}}<i class ="el-icon-caret-bottom"></i></span></li>
      </ul>
      <ul class="search-list" v-if="activeIndex !== -1">
        <li v-for="(item, index) in peroid" :key="index" v-if="activeIndex === 0" @click="peroidClick(index)" :class="{activeIndex: itemIndex1 === index}">{{item.name}}</li>
        <li v-for="(item, index) in grade" :key="index" v-if="activeIndex === 1"  @click="gradeClick(index)" :class="{activeIndex: itemIndex2 === index}">{{item.name}}</li>
        <li v-for="(item, index) in subject" :key="index" v-if="activeIndex === 2"  @click="subjectClick(index)" :class="{activeIndex: itemIndex3 === index}">{{item.curriculumName}}</li>
      </ul>
      <div class="pullscreen" v-if="activeIndex !== -1" id="pullscreen" @click="pull"></div>
      <ul class="list"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10">
          <li v-for="(item, i) in list" :key="i" @click.stop.prevent="lookIn(item)">
              <img :src="item.imageUrl">
              <p v-if="item.microclassName.length < 20">{{item.microclassName}}</p>
              <p v-if="item.microclassName.length >= 20">{{item.microclassName.slice(0, 20) + '...'}}</p>
              <span>{{item.uploadUserName}}</span>
              <p class="tips"><span>浏览&nbsp;{{item.visitCount}}</span><span>评论&nbsp;{{item.commentCount}}</span></p>
            </li>
      </ul>
      <p class="tip" v-if="list.length === 0">暂无数据</p>
  </div>
</template>
<script>
import { setupWebViewJavascriptBridge } from '../../utils/setupWeb.js'
export default {
  name: 'square',
  data () {
    return {
      list: [],
      topStatus: '',
      loading: false,
      activeIndex: -1,
      itemIndex1: 0,
      itemIndex2: 0,
      itemIndex3: 0,
      nav: [],
      peroid: [],
      grade: [],
      subject: [],
      semesterId: '',
      userId: '',
      pageSize: 6,
      pageNo: 1
    }
  },
  methods: {
    pull () {
      this.activeIndex = -1
    },
    hide () {
      console.log(0)
      this.activeIndex = -1
    },
    async loadMore () {
      this.pageNo++
      const data = await this.$store.dispatch('getIndex', {
        courseId: this.subject[this.itemIndex3] ? this.subject[this.itemIndex3].curriculumId : '',
        sectionId: this.peroid[this.itemIndex1] ? this.peroid[this.itemIndex1].id : '',
        gradeId: this.grade[this.itemIndex2] ? this.grade[this.itemIndex2].id : '',
        keyword: '',
        state: 1,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      })
      data.list.forEach(element => {
        this.list.push(element)
      })
      const path = document.getElementById('contextPath').value
      this.list.map(item => {
        item.imageUrl = path + '/common/imageView/' + item.id
      })
    },
    route () {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('finishBack', {}, function (response) {
          console.log(response)
        })
      })
      try {
        window.esMobile.finishBack()
      } catch (e) {
        console.log(e)
      }
    },
    peroidClick (index) {
      this.pageNo = 1
      this.itemIndex1 = index
      this.getGrade()
      this.getIndex()
      this.loadMore()
      this.activeIndex = -1
    },
    gradeClick (index) {
      this.pageNo = 1
      this.itemIndex2 = index
      this.getIndex()
      this.loadMore()
      this.activeIndex = -1
    },
    searchCourse () {
      let obj = {}
      obj.courseId = this.subject[this.itemIndex3].curriculumId
      obj.sectionId = this.peroid[this.itemIndex1].id
      obj.gradeId = this.grade[this.itemIndex2].id
      obj.pageSize = this.pageSize
      sessionStorage.choose = JSON.stringify(obj)
      this.$router.push('/search')
    },
    subjectClick (index) {
      this.pageNo = 1
      this.itemIndex3 = index
      this.getIndex()
      this.loadMore()
      this.activeIndex = -1
    },
    lookIn (item) {
      item.path = '/square'
      sessionStorage.item = JSON.stringify(item)
      this.$router.push('/course')
    },
    // 学期
    async getPeroid () {
      const data = await this.$store.dispatch('getPeroid')
      this.semesterId = data[0].semesterId
    },
    // 学段
    async getSection () {
      this.peroid = await this.$store.dispatch('getSection')
      let obj = {
        name: '全部学段',
        id: ''
      }
      this.peroid.unshift(obj)
    },
    // 年级
    async getGrade () {
      const data = await this.$store.dispatch('getGrade', {
        sectionId: this.peroid[this.itemIndex1].id,
        semesterId: this.semesterId
      })
      let obj = {
        name: '全部年级',
        id: ''
      }
      data.unshift(obj)
      this.grade = data
    },
    // 科目
    async getSubject () {
      // this.cardloading = false
      const data = await this.$store.dispatch('getSubject')
      let obj = {
        curriculumName: '全部学科',
        curriculumId: ''
      }
      data.unshift(obj)
      this.subject = data
    },
    async getIndex () {
      const data = await this.$store.dispatch('getIndex', {
        courseId: this.subject[this.itemIndex3].curriculumId,
        sectionId: this.peroid[this.itemIndex1].id,
        gradeId: this.grade[this.itemIndex2].id,
        keyword: '',
        state: 1,
        pageNo: 1,
        pageSize: this.pageSize
      })
      this.list = data.list
      const path = document.getElementById('contextPath').value
      this.list.map(item => {
        item.imageUrl = path + '/common/imageView/' + item.id
      })
    }
  },
  async created () {
    this.user = this.$store.state.user.loginUser
    this.getSubject()
    await this.getPeroid()
    await this.getSection()
    await this.getGrade()
    try {
      window.esMobile.hideTitleBar()
    } catch (e) {
      console.log(e)
    }
  },
  async beforeCreate () {
    const data = await this.$store.dispatch('getIndex', {
      courseId: '',
      sectionId: '',
      gradeId: '',
      keyword: '',
      state: 1,
      pageNo: 1,
      pageSize: 6
    })
    this.list = data.list
    const path = document.getElementById('contextPath').value
    const href = window.location.href
    let url = href.slice(0, href.indexOf('#') - 1)
    this.list.map(item => {
      item.imageUrl = url + path + '/common/imageView/' + item.id
    })
  },
  watch: {
    activeIndex () {
      var body = document.getElementById('square')
      if (this.activeIndex !== -1) {
        body.style.overflow = 'hidden'
      } else if (this.activeIndex === -1) {
        body.style.overflow = 'scroll'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::-webkit-scrollbar{
  display: none;
}
#square {
  width: 100%;
  height:100%;
  background: #fff;
  position: relative;

  .tip {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 30%;
    color: #ccc;
    font-size: 28px;
  }
  .pullscreen {
    width: 100%;
    height: calc(100vh);
    opacity:0;
    z-index: 10;
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .mint-header-title {
    line-height: 96px;
  }

  .mint-header-button > a {
    font-size: 36px;
    line-height: 96px;
    color: #4a4a4a;
  }
  img[src=""]{
  opacity: 0;
  }
  .video-js .vjs-control {
    width: 80px;
    height:80px;
  }
  .mint-header {
    height: 96px;
    font-size: 36px;
    line-height: 96px;
    background: #fff;
    box-shadow:0 2px 4px 0 rgba(0,0,0,0.08);
    color: #000;
    width: 100%;
    padding: 0px 30px;
  }
  .mint-header .mint-button {
    height: 96px;
    line-height: 96px;
  }
  .mint-button-text {
    &>img {
      width: 41px;
      height: 42px;
      display: block;
      margin-bottom: 9px;
    }
  }
  .mintui .mintui-back {
    font-size: 44px !important;
    color: #000;
  }
  .search {
    top: 98px;
    height: 96px;
    background: #fff;
    // border-bottom: 1px solid #d8d8d8;
    position: fixed;
    width: 100%;
    padding: 0px 60px;
    &:after {
      display: block;
      content: '';
      height: 0;
      clear: both;
      overflow: hidden;
      visibility: hidden;
    }

    li {
      width: 33%;
      float: left;
      height: 96px;
      line-height: 96px;
      text-align: center;

      .active {
        color: #3997f9;
      }

      &>span {
        font-size: 28px
      }
      .el-icon-caret-bottom {
        display: inline-block;
        margin-left: 12px;
      }
    }
  }

  .search-list {
    width: 100%;
    position: fixed;
    top: 174px;
    border-top: 1px solid #d8d8d8;
    z-index: 99;
    max-height: 384px;
    overflow: scroll;
    display: block;
    z-index: 90;

    .activeIndex {
      color: #3997f9;
    }
    &>li {
      height: 96px;
      line-height: 96px;
      background: #fff;
      padding-left: 48px;
      font-size: 32px;
    }
  }

  .list {
    margin-top: 193px;
    width: 100%;
    &:after {
    display: block;
    content: '';
    height: 0;
    clear: both;
    overflow: hidden;
    visibility: hidden;
    }

    li {
      width: 49%;
      float: left;

      .tips {
        margin-top: 0px;
        margin-left: 18px;
      }

      &>p {
        margin: 27px 0px 18px 20px;
        font-family:PingFangSC-Regular;
        font-size:28px;
        color:#000000;
        letter-spacing:0;
        line-height:28px;
        text-align:left;

        &>span {
          margin: 12px 32px 30px  0px;
        }
      }
      span {
        margin-left: 18px;
        font-family:PingFangSC-Regular;
        font-size:24px;
        color:#999999;
        letter-spacing:0;
        line-height:24px;
        text-align:left;
      }

      &:nth-child(2n+1) {
        margin-right: 2%;
      }
      &>img
      {
        width: 100%;
        height: 200px;
        border: 1px solid #ccc;
        display: block;
        background: #ccc;
      }
    }
  }
}

</style>
