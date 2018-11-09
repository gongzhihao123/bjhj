<template>
    <div class="fileLook">
        <div class="content" v-loading="loading">
          <el-button @click="back">返回</el-button>
          <el-button @click="download" type="primary" v-if="ulList.fileId !== ''"><i class="el-icon-download"></i>下载
            (<span v-if="ulList.size > 1024 && ulList.size < 1048576" class="number">
            {{parseInt(ulList.size/1024)+'KB'}}
            </span>
            <span v-if="ulList.size > 1048576" class="number">
            {{parseInt(ulList.size/1024/1024) +'MB'}}
            </span>)
          </el-button>
          <h2>{{ulList.title}}</h2>
          <div class="content-box">
            <div class="contentInfo">
              <ul v-if="ulList.type === 1 || ulList.type === 2">
                <li><span v-if="ulList.type === 1">计划类别：</span><span v-if="ulList.type === 2">总结类别：</span><span v-if="ulList.planType === 1 && ulList.type === 1">学年计划</span><span v-if="ulList.planType === 2 && ulList.type === 1">学期计划</span>
                  <span v-if="ulList.planType === 1 && ulList.type === 2">学年总结</span><span v-if="ulList.planType === 2 && ulList.type === 2">学期总结</span>
                </li>
                <li><span>学年：</span><span>{{ulList.schoolYear + ' - ' + (Number(ulList.schoolYear) + 1 )+ '学年' }}</span></li>
                <li><span>学期：</span><span v-if="ulList.semester === 1">第一学期</span><span v-if="ulList.semester === 2">第二学期</span></li>
              </ul>
              <ul v-if="ulList.type === 3 || ulList.type === 4">
                  <li><span v-if="ulList.type === 3">计划类别：</span><span v-if="ulList.type === 4">总结类别：</span><span v-if="ulList.planType === 1 && ulList.type === 3">学年计划</span><span v-if="ulList.planType === 2 && ulList.type === 3">学期计划</span>
                    <span v-if="ulList.planType === 1 && ulList.type === 4">学年总结</span><span v-if="ulList.planType === 2 && ulList.type === 4">学期总结</span>
                  </li>
                <li><span>学年：</span><span>{{ulList.schoolYear + ' - ' + (Number(ulList.schoolYear) + 1 )+ '学年' }}</span></li>
                <li><span>学期：</span><span v-if="ulList.semester === 1">第一学期</span><span v-if="ulList.semester === 2">第二学期</span></li>
                <li><span>责任区：</span><span>{{areaName}}</span></li>
                <li><span>制定人：</span><span>{{createdUserName}}</span></li>
              </ul>
              <ul v-if="ulList.type === 5 || ulList.type === 6">
                  <li><span v-if="ulList.type === 5">计划类别：</span><span v-if="ulList.type === 6">总结类别：</span><span v-if="ulList.planType === 1 && ulList.type === 5">学年计划</span><span v-if="ulList.planType === 2 && ulList.type === 5">学期计划</span>
                    <span v-if="ulList.planType === 1 && ulList.type === 6">学年总结</span><span v-if="ulList.planType === 2 && ulList.type === 6">学期总结</span>
                  </li>
                <li><span>学年：</span><span>{{ulList.schoolYear + ' - ' + (Number(ulList.schoolYear) + 1 )+ '学年' }}</span></li>
                <li v-if="ulList.title !== '学年计划'"><span>学期：</span><span v-if="ulList.semester === 1">第一学期</span><span v-if="ulList.semester === 2">第二学期</span></li>
                <li><span>制定人：</span><span>{{createdUserName}}</span></li>
              </ul>
              <div class="detail-content" v-if="ulList.fileId === ''">
                {{ulList.content}}
              </div>
              <iframe :src="url" class="score-content" style="width:945px;height: 850px;margin: 10px auto;" v-if="ulList.fileId !== ''"></iframe>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import server from '../../utils/axios'
import { notice } from '../../api/index'
export default {
  name: 'fileLook',
  data () {
    return {
      activeName: '',
      loading: false,
      id: '',
      file: {},
      ulList: {},
      url: '',
      areaName: '',
      createdUserName: '',
      role: ''
    }
  },
  methods: {
    download () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/common/readAttachment?attachmentId=${this.ulList.fileId}`
    },
    back () {
      history.back()
      sessionStorage.activeName = this.activeName
    },
    getDetails () {
      if (this.activeName === '1') {
        server.get(`/grjhzjController/getPlan?planId=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.ulList = {
              type: res.data.result.type,
              planType: res.data.result.planType,
              schoolYear: res.data.result.schoolYear,
              size: res.data.result.attachment !== null ? res.data.result.attachment.size : 0,
              semester: res.data.result.semester,
              fileId: res.data.result.attachment !== null ? res.data.result.attachment.id : '',
              title: res.data.result.title,
              content: res.data.result.content
            }
            this.url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${this.ulList.fileId}`
          } else {
            notice(this, res.data.message, 2000)
          }
        })
        this.loading = false
      } else if (this.activeName === '2') {
        server.get(`/zrqjhzjController/getPlan?planId=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.ulList = {
              type: res.data.result.type,
              planType: res.data.result.planType,
              schoolYear: res.data.result.schoolYear,
              size: res.data.result.attachment !== null ? res.data.result.attachment.size : 0,
              semester: res.data.result.semester,
              fileId: res.data.result.attachment !== null ? res.data.result.attachment.id : '',
              title: res.data.result.title,
              content: res.data.result.content
            }
            this.url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${this.ulList.fileId}`
          } else {
            notice(this, res.data.message, 2000)
          }
          this.loading = false
        })
      } else if (this.activeName === '3') {
        server.get(`/ddsjhzjController/getPlan?planId=${this.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.ulList = {
              type: res.data.result.type,
              planType: res.data.result.planType,
              schoolYear: res.data.result.schoolYear,
              size: res.data.result.attachment !== null ? res.data.result.attachment.size : 0,
              semester: res.data.result.semester,
              fileId: res.data.result.attachment !== null ? res.data.result.attachment.id : '',
              title: res.data.result.title,
              content: res.data.result.content
            }
            this.url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${this.ulList.fileId}`
          } else {
            notice(this, res.data.message, 2000)
          }
          this.loading = false
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      'previewUrl',
      'user',
      'rootUrl',
      'previewInterface'
    ])
  },
  created () {
    this.loading = true
    this.activeName = sessionStorage.activeName
    this.createdUserName = sessionStorage.createdUserName
    this.areaName = sessionStorage.areaName
    this.id = sessionStorage.id
    setTimeout(() => {
      this.getDetails()
      this.role = this.user.userRole
    }, 500)
  }
}
</script>
<style lang="scss">
    .fileLook {
        .content {

          &>h2 {
            height: 50px;
            line-height: 50px;
            background: #FFFFFF;
            border-bottom: 1px solid #E5E5E5;
            text-indent: 2em;
          }

          .contentInfo {
            margin: 20px auto;
            padding: 15px;
            width: 965px;
            height: 868px;
            background: #FFFFFF;
            box-shadow: 0 0 4px 0 rgba(0,0,0,0.25);
            border-radius: 4px;
            overflow-y: auto;


            &>ul {
              background: #F1F1F1;
              margin-bottom: 20px;

              &:after {
                display: block;
                content: '';
                clear: both;
                overflow: hidden;
                visibility: hidden;                
              }
              &>li {
                float: left;
                height: 38px;
                line-height: 38px;
                margin-right: 20px;
                margin-left: 10px;
              }
            }
          }
          .number {
            margin: 0px;
          }
          &>.el-button {
            float: right;
            margin-right: 20px;
            margin-top: 5px;

            &>span {

              &>.el-icon-download {
                margin-right: 10px;
              }
            }
          }
        }
    }
</style>