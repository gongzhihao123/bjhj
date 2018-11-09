<template>
  <div class="naireList">
    <div class="header clearfix">
      <img src="../assets/images/return.png" alt="返回" @click="route" />
      <h3>问卷调查</h3>
    </div>

    <div class="main clearfix">
      <ul class="ulList" v-infinite-scroll="loadMore" infinite-scroll-distance="10">
        <li v-for="(item, i) in naireList" :key="i" @click="toDetail(item)">
          <div class="left">
            <img src="../assets/images/logo.png" alt="" />
            <i class="round" v-show="item.type == 1"></i>
          </div>
          <div class="right">
            <p>
              <span class="title">{{ item.title }}</span>
              <!-- <span class="title" v-if="item.title.length < 14">{{ item.title }}</span>
              <span class="title" v-else>{{ item.title.substring(0, 13) + '...' }}</span> -->
              <span class="date">{{ item.publishTime | dateFormat('yyyy-MM-dd') }}</span>
            </p>
            <p class="content">
              发布人：{{ item.createdUserName }}

              <span v-if="item.type == 3" style="float: right;color: orange;">[外部问卷]</span>

              <span v-else>
                <span style="float:right;" v-if="item.answerState == 1">
                  <span v-if="item.naireState == 1 && item.type == 2" class="ing">进行中</span>
                  <span v-if="item.naireState == 2 && item.type == 2" class="end">已结束</span>

                  <span v-if="item.overtimeFlag && item.type == 3 && item.forwardState == 2" class="end">已过期</span>
                  <span v-if="!item.overtimeFlag && item.type == 3 && item.forwardState == 2" class="ing">进行中</span>

                  <span v-if="item.overtimeFlag && item.type == 3 && item.forwardState == 0" class="end">已结束</span>
                  <span v-if="!item.overtimeFlag && item.type == 3 && item.forwardState == 0" class="ing">进行中</span>

                  <span v-if="!item.overtimeFlag && item.type == 3 && item.forwardState == 1" class="ing">待审核</span>
                </span>

                <span v-if="item.answerState == 2" style="float:right;color: #999;">已作答</span>
              </span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { setupWebViewJavascriptBridge } from '../utils/setupWeb.js'
import { notice } from '../api/index.js'
export default {
  name: 'naireList',
  data () {
    return {
      naireList: [],
      pageNo: 1,
      loading: false,
      pageSize: 6
    }
  },
  methods: {
    loadMore () {
      this.pageNo++
      this.getDetail()
    },
    toDetail (item) {
      if (item.naireState === 2 && item.answerState === 1) {
        notice(this, '该问卷调查已结束', 2000)
      } else {
        if (!item.overtimeFlag && item.type === 3 && item.forwardState === 1) {
          this.$router.push({path: '/naireDetail', query: {id: item.id, answerState: 2}})
        } else {
          this.$router.push({path: '/naireDetail', query: {id: item.id, answerState: item.answerState}})
        }
      }
    },
    getDetail () {
      this.$https.get(`/index/nairePage?pageNo=${this.pageNo}&pageSize=${this.pageSize}&mobileFlag=${1}`)
        .then(res => {
          if (res.data.code === 1) {
            (res.data.result.list || []).forEach(item => {
              this.naireList.push(item)
            })
          }
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
    }
  },
  created () {
    this.naireList = []
    this.$https.get(`/index/nairePage?pageNo=${1}&pageSize=${this.pageSize}&mobileFlag=${1}`)
      .then(res => {
        if (res.data.code === 1) {
          (res.data.result.list || []).forEach(item => {
            this.naireList.push(item)
          })
        }
      })
    try {
      window.esMobile.hideTitleBar()
    } catch (e) {
      // console.log(e)
    }
  }
}
</script>

<style lang="scss">
.naireList {
  > .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fff;
    z-index: 100;

    > img {
      float: left;
      vertical-align: middle;
      margin-top: 13px;
    }

    > h3 {
      display: inline-block;
    }
  }
  .main {
    height: calc(100vh - 50px);
    box-sizing: border-box;
    padding: 0 10px;
    margin-top: 50px;
    text-align: left;

    > ul li {
      float: left;
      box-sizing: border-box;
      list-style-type: none;
      width: 100%;
      height: 70px;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;

      .left {
        float: left;
        position: relative;
        width: 50px;
        height: 50px;

        > img {
          width: 50px;
          height: 50px;
        }

        > .round {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: red;
          right: 3px;
          top: -2px;
        }
      }

      .right {
        float: right;
        width: calc(100% - 60px);
        padding-left: 10px;

        > p {
          text-align: left;

          .title {
            display: inline-block;
            width: calc(100% - 70px);
            font-size: 14px;
            font-weight: bold;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
          }

          .date {
            float: right;
            color: #999;
            vertical-align: middle;
            padding-top: 4px;
          }
        }

        > .content {
          font-size: 12px;
          color: #999;
          margin-top: 13px;
        }
      }
    }
  }
  .clearfix:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .green {
    background: #19b955;
    border-color: #19b955;
    color: #fff;
  }
  .blue {
    background: #1F9FFF;
    border-color: #1F9FFF;
    color: #fff;
  }
  .yellow {
    background: #f7ba2b;
    border-color: #f7ba2b;
    color: #fff;
  }
  .end {
    color: #f13f3f;
  }
  .ing {
    color: #19b957;
  }
}

</style>
