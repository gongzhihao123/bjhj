<template>
    <div class="fileDetail">
        <div class="content">
          <el-button @click="back">返回</el-button>
          <div class="content-box">
            <p>{{Info.title}}</p>
            <div class="box">
              {{Info.content}}
            </div>
            <ul>
              <li v-for="(item, index) in Info.fileList"><span>{{item.name}}</span><a @click="view(item)">预览</a><a @click="download(item.id)">下载</a></li>
            </ul>
          </div>
        </div>     
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { notice } from '../../api/index'
import server from '../../utils/axios'
export default {
  name: 'fileDetail',
  data () {
    return {
      id: '',
      flag: '',
      Info: {},
      url: ''
    }
  },
  methods: {
    back () {
      history.back()
    },
    download (id) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/common/readAttachment?attachmentId=${id}`
    },
    view (item) {
      sessionStorage.item = JSON.stringify(item)
      this.url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${item.id}`
      sessionStorage.url = this.url
      this.$router.push(`/supervisor/view`)
    },
    getData () {
      // 督导过程
      if (this.flag === '2') {
        server.get(`/zrxxController/getcDetails?ddgcId=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.Info = {
              title: res.data.result.title,
              content: res.data.result.ddProcess,
              fileList: res.data.result.fileList
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.flag === '1') {
        // 督导记录
        server.get(`/zrxxController/getDdjlDetails?id=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.Info = {
              title: res.data.result.title,
              content: res.data.result.ddProcess,
              fileList: res.data.result.fileList
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.flag === '3') {
        // 整改与反馈
        server.get(`/zrxxController/getZgyfkDetails?id=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.Info = {
              title: res.data.result.title,
              content: res.data.result.ddProcess,
              fileList: res.data.result.fileList
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.flag === '4') {
        // 学校情况
        server.get(`/zrxxController/selectXxqkDetails?situationId=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.Info = {
              title: res.data.result.title,
              content: res.data.result.situation,
              fileList: res.data.result.fileList
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    getDData () {
      // 督导过程
      if (this.flag === '2') {
        server.get(`/ddzrqController/getDdgcDetails?ddgcId=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.Info = {
              title: res.data.result.title,
              content: res.data.result.ddProcess,
              fileList: res.data.result.fileList
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.flag === '1') {
        // 督导记录
        server.get(`/ddzrqController/getDdjlDetails?id=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.Info = {
              title: res.data.result.title,
              content: res.data.result.ddProcess,
              fileList: res.data.result.fileList
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.flag === '3') {
        // 整改与反馈
        server.get(`/ddzrqController/getZgyfkDetails?id=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.Info = {
              title: res.data.result.title,
              content: res.data.result.ddProcess,
              fileList: res.data.result.fileList
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.flag === '4') {
        // 学校情况
        server.get(`/ddzrqController/selectXxqkDetails?situationId=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.Info = {
              title: res.data.result.title,
              content: res.data.result.situation,
              fileList: res.data.result.fileList
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    }
  },
  created () {
    this.id = sessionStorage.id
    this.flag = sessionStorage.flag
    if (sessionStorage.type === '1') {
      // 责任学校
      this.getData()
    } else {
      // 督导责任区
      this.getDData()
    }
  },
  computed: {
    ...mapGetters([
      'previewUrl',
      'rootUrl',
      'previewInterface'
    ])
  }
}
</script>
<style lang="scss">
    .fileDetail {
      .content {
        width: 945px;
        height: 863px;
        background: #fff;
        margin: 20px auto;
        background: #FFFFFF;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
        border-radius: 4px;
        position: relative;       

        &>.el-button {
          float: right;
          margin-right: 20px;
          margin-top: 20px;

          &>span {

            &>.el-icon-download {
              margin-right: 20px;
            }
          }
        }
        &>.content-box {
          padding: 10px 30px;
          clear: both;
          margin-top: 10px;

          &>p {
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: #333333;
            text-align: center;
            margin-top: 33px;
          }

          &>.box {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            text-indent: 2em;
            max-height: 700px;
            overflow-y: auto;        
          }
          &>ul {
            position: absolute;
            bottom: 20px;
            left: 20px;
            max-height: 200px;
            overflow-y: auto;

            &>li {
              line-height: 25px;

              span {
                margin-right: 10px;
              }
              a {
                color: #20A0FF;
                cursor: pointer;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
</style>