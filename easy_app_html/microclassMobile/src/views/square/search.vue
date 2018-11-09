<template>
    <div id="search">
    <header>
      <!-- <el-input
        placeholder="请输入关键词"
        v-model="inputvalue"
        @keyup.enter.native="getIndex"> -->
        <input type="search" placeholder="请输入关键词" @change="getIndex" id="inputb" v-model="inputvalue">
      <!-- </el-input> -->
      <img src="../../assets/images/search-icon.png">
      <el-button type="text" @click="back">取消</el-button>
    </header>

    <!--内容-->
      <ul class="list" v-if="list.length !== 0">
        <li v-for="(item, i) in list" :key="i" @click="lookIn(item)">
          <img :src="item.imageUrl">
          <p>{{item.microclassName}}</p>
          <span>{{item.uploadUserName}}</span>
          <p class="tips"><span>浏览{{item.visitCount}}</span><span>评论{{item.commentNum}}</span></p>
        </li>
      </ul>
      <p class="tip" v-if="list.length === 0">暂无数据</p>
    </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      inputvalue: '',
      list: [],
      choose: {}
    }
  },
  methods: {
    lookIn (item) {
      item.path = '/search'
      sessionStorage.item = JSON.stringify(item)
      this.$router.push('/course')
    },
    back () {
      this.$router.push('/square')
    },
    loadBottom () {
      // 加载更多数据
      this.allLoaded = true
      this.$refs.loadmore.onBottomLoaded()
    },
    async getIndex () {
      if (document.getElementById('inputb')) {
        document.getElementById('inputb').blur()
      }
      if (this.inputvalue === '') {
        return
      }
      const data = await this.$store.dispatch('getIndex', {
        courseId: '',
        sectionId: '',
        gradeId: '',
        keyword: this.inputvalue,
        state: 1,
        pageNo: 1,
        pageSize: this.choose.pageSize
      })
      this.list = data.list
      const path = document.getElementById('contextPath').value
      this.list.map(item => {
        item.imageUrl = path + '/common/imageView/' + item.id
      })
    }
  },
  async created () {
    this.choose = JSON.parse(sessionStorage.choose)
    await this.getIndex()
  }
}
</script>
<style lang="scss">
#search {
  width: 100%;
  height: 100%;
  position: relative;

  .tip {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
    color: #ccc;
    font-size: 28px;
  }

  img[src=""]{
  opacity: 0;
  }

  video::-internal-media-controls-download-button {
      display: none;
  }
/* 解决苹果自带浏览器无法自动获取焦点 */
  input {
    -webkit-user-select: auto;
  }

  header {
    width: 100%;
    height: 96px;
    line-height: 96px;
    background: #fff;
    position: fixed;
    top: 0px;

    img {
      position: absolute;
      width: 26px;
      height: 26px;
      top: 36px;
      left: 60px;
    }
    .el-input {
      width: auto;
      height: 96px;
    }
    input {
      width: 590px;
      height: 70px;
      line-height: 70px;
      background:#efefef;
      margin: 13px 0px 13px 33px;
      font-size: 28px;
      color: #999;
      padding-left: 73px;
      display: table-cell;
      border-radius:5px;
      font-size: 28px;
      color: #999;
      display: inline-block;
    }

    .el-button {
      position: absolute;
      top: 20px;
      right: 20px;
      font-family:PingFangSC-Regular;
      font-size:32px;
      color:#4a4a4a;
    }
  }

  .list {
    margin-top: 120px;
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
      background: #fff;
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
