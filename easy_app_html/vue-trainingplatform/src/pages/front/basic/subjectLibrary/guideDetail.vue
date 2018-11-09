<template>
  <div class="guide-detail">

    <header>
      <div class="title">       
        <p>
          <span>
            {{ contentData.name }}
          </span>
        </p>
        <p>
          <span v-if="contentData.stopTime < new Date().getTime()">申报已截止</span>
          <el-button type="small" :disabled="JSON.parse(this.$route.query.para).checkState" @click="declareButton" v-if="contentData.stopTime > new Date().getTime()">现在申报</el-button>
        </p>
        <p>
          <span>
            发布单位：{{ contentData.companyName }}
          </span>
          <span>
            发布人：{{ contentData.createdUserName }}
          </span>
          <span>
            发布日期：{{ contentData.createdTime | dateFormatT('yyyy-MM-dd') }}
          </span>
        </p>
      </div>
    </header>

    <div class="content" v-html="contentData.content">
      
    </div>

    <footer>
      <p>
        <img src="../../../../assets/images/attachment-icon.png" alt="">
        附件：
        <span v-for="(item, index) in contentData.fileList" :key="index">{{ item.fileName }} <i @click="downloadFile(item)">下载</i> </span>
      </p>
      <p>
        <img src="../../../../assets/images/deadline-icon.png" alt="">
        申报截止日期：{{ contentData.stopTime | dateFormatT('yyyy-MM-dd') }}
      </p>
      <p>
        <el-button size="small" type="success" :disabled="JSON.parse(this.$route.query.para).checkState" v-if="contentData.stopTime > new Date().getTime()" @click="declareButton">现在申报</el-button>
        <el-button type="small" @click="$router.push('/subjectLibrary/subjectDeclaration')">返回</el-button>
      </p>
    </footer>
  </div>
</template>

<script>
import server from '../../../../utils/axios'
import { notice } from '../../../../api/index'
export default {
  name: 'guide-detail',
  data () {
    return {
      contentData: {}
    }
  },
  methods: {
    // 现在申报
    declareButton () {
      sessionStorage.SUBJECT_ID = ''
      sessionStorage.IS_CHANGE = '0'
      this.$router.push({ path: '/declarationStep/index', query: {id: JSON.parse(this.$route.query.para).id} })
      sessionStorage.BACK_PATH = '/subjectLibrary/subjectDeclaration'
    },
    // 附件下载
    downloadFile (val) {
      var path = document.getElementById('contextPath').value
      window.location.href = `${path}/frontTopicDeclareController/downloadFile?fileId=${val.id}`
    },
    // 获取课题指南详情
    getGuide () {
      server.get(`/frontTopicDeclareController/getGuide?guideId=${JSON.parse(this.$route.query.para).id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.contentData = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.getGuide()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.guide-detail{
  background: #fff;
  padding: $width*2 0;

  header{
    .title{
      &>p:nth-child(1){
        position: relative;
        text-align: center;
        &>span{
          font-size: 24px;
        }

        &>.el-button{
          position: absolute;
          right: 0;
          top: 0;
        }
      }

      &>p:nth-child(2){
        margin-top: $width;
        text-align: center;
        &>span{
          color: #FF595A;
          font-size: 16px;
        }
        .el-button{
          margin-left: $width;
        }
      }

      &>p:nth-child(3){
        padding: $width/2;
        border-top: 1px solid #ddd;
        margin-top: $width;
        text-align: center;
        &>span{
          margin-right: $width*3;
          &:nth-child(3) {
            margin-right: 0;
          }
        }
      }
    }
  }

  .content{
    max-height: 600px;
    color: #898989;
    margin-top: $width;
    padding: 0 $width*2;
    font-size: 15px;
    overflow-x: hidden;
  }

  footer{
    padding: 0 $width*2;

    p {
      img {
        vertical-align: middle;
      }
    }

    &>p:nth-child(1){
      margin-top: $width;
      &>span{
        margin-left: $width;
        i{
          font-style: normal;
          margin-left: $width;
          text-decoration: underline;
          color: #42AFFF;
          cursor: pointer;
        }
      }
    }

    &>p:nth-child(2){
      margin-top: $width/2;
    }

    &>p:nth-child(3){
      margin-top: $width/2;
      text-align: center;
    }
  }
}
</style>
