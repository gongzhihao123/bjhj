<template>
  <div id="lesson-plan-details">
    <!--顶部导航-->
    <header>
      <p>{{all.createdUserName}}的教案详情
        <span @click="goBack">
          返回上一层
        </span>
      </p>
    </header>

    <main>
      <div>
        <div class="main-left">
          <p>教案名称</p>
          <el-row v-for="(item, index) in lessonPlanList" :key="index" @click.native="selected(item, index)">
            <el-col :span="14" :class="{active: n === index}">
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                v-if="item.title.length > 12"
                :content="item.title">
                <span slot="reference">{{item.title.slice(0, 11) + '...'}}</span>
              </el-popover>
              <span v-if="item.title.length <= 12">{{item.title}}</span>
            </el-col>
            <el-col :span="10" :class="{active: n === index}">
              {{item.createdTime | dateFormatT('yyyy-MM-dd hh:mm:ss')}}
              <img v-if="n === index" src="../../../assets/images/empty-sanjiao.png">
            </el-col>
          </el-row>
        </div>
        <div class="main-right">
          <p>所有教案&nbsp;>&nbsp;{{message.sectionName}}-{{message.gradeName}}&nbsp;>&nbsp;{{message.title}}</p>
          <div class="main-right-body">
            <div class="main-right-body-top">
              <h3>{{message.title}}</h3>
              <p>
                <span>{{message.createdUserName}}</span>
                <el-rate v-model="message.score" disabled></el-rate>
                {{message.score ? message.score : 0}}
              </p>
            </div>
            <el-row class="mian-right-body-middle">
              <Ueditor @ready="editorReady" class="ueditor"></Ueditor>
              <p>
                <i>附件：</i>
                <span @dblclick="dblDownloadAttenchment(item, true)" @click="downloadAttenchment(item)" v-for="(item, index) in attachmentlist" :key="index">
                  {{ item.fileName }}
                </span>
              </p>
            </el-row>
          </div>
        </div>
      </div>
    </main>

    <div class="footer">
      <el-row class="footer-top">
        <el-col :span="4">评价项目</el-col>
        <el-col :span="12">评价细则</el-col>
        <el-col :span="4">分值</el-col>
        <el-col :span="4">评分</el-col>
      </el-row>
      <el-row class="footer-list" v-for="(item, index) in pointList" :key="index">
        <el-col :span="4">{{item.title}}</el-col>
        <el-col :span="12">{{item.checkpoint}}</el-col>
        <el-col :span="4">{{item.score}}</el-col>
        <el-col :span="4">
          <el-input @blur="blur" type="number" min="0" :max="Number(item.score)" step="0.1" placeholder="请输入"v-model="item.scores"></el-input>
        </el-col>
      </el-row>
      <el-row class="total-score">
        <el-col :span="4">总分</el-col>
        <el-col :span="20">{{scoreCount.toFixed(1)}}</el-col>
      </el-row>
    </div>

    <div class="footer-button">
      <el-button class="saveButton" @click="savePointScore">
        保存
      </el-button>
      <el-button @click="goBack">
        关闭
      </el-button>
    </div>
  </div>
</template>

<script>
import { success, notice, error } from '../../../api/index.js'
import Ueditor from '../../../components/Ueditor'
import querystring from 'querystring'
import { mapGetters } from 'vuex'
export default {
  name: 'lesson-plan-details',
  components: {
    Ueditor
  },
  data () {
    return {
      n: '',
      time: '',
      userId: '',
      courseId: '',
      gradeId: '',
      message: '',
      content: '',
      filePath: '',
      lessonPlanList: [],
      all: '',
      pointList: [],
      scoreCount: 0,
      editorContent: '',
      jsonstr: [],
      canSave: true,
      attachmentlist: [],
      canDbl: true,
      timer: ''
    }
  },
  methods: {
    // 在线预览
    dblDownloadAttenchment (item, val) {
      clearTimeout(this.timer)
      this.canDbl = false
      const path = document.querySelector('#contextPath').value
      if ((item.fileName.indexOf('docx') !== -1) || (item.fileName.indexOf('ppt') !== -1) || (item.fileName.indexOf('word') !== -1) || (item.fileName.indexOf('pdf') !== -1) || (item.fileName.indexOf('xlsx') !== -1) || (item.fileName.indexOf('xls') !== -1)) {
        window.location.href = `${this.previewUrl}${path}/square/lessonPlanOfficePreview?attachmentId=${item.id}`
      } else {
        notice(this, '该课件不支持在线预览', 2000)
      }
    },
    // 下载课件
    downloadAttenchment (item, val) {
      this.timer = setTimeout(() => {
        if (this.canDbl) {
          const path = document.querySelector('#contextPath').value
          window.location.href = `${path}/square/lessonPlanCourseWareDownload?attachmentId=${item.id}`
        }
        this.canDbl = true
      }, 700)
    },
    editorReady (instance) {
      setTimeout(() => {
        instance.setContent(this.content)
        this.editorContent = instance
        this.content = this.content.replace(/【\d{1}】/g, '')
        this.content = this.content.replace(/【\d{2}】/g, '')
        this.editorContent.setDisabled('inserthtml')
        instance.addListener('contentChange', () => {
          this.content = instance.getContent()
        })
      }, 200)
    },
    goBack () {
      this.editorContent.setHide()
      this.$router.push('/check')
    },
    selected (item, index) {
      this.n = index
      this.message = item
      this.filePath = item.filePath
      this.getHtml()
      this.getPointList()
    },
    // 通过路径获取内容
    getHtml () {
      if (this.filePath !== '') {
        this.$https.get(`/mine/lessonPlanHtmlRead?filepath=${this.filePath}`)
        .then(res => {
          if (res.data.code === 1) {
            this.content = res.data.result
            this.content = this.content.replace(/【\d{1}】/g, '')
            this.content = this.content.replace(/【\d{2}】/g, '')
            this.editorContent.setContent(this.content)
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 获取老师的所有教案
    getPlanList () {
      this.$https.get(`/check/lessonPlanList?semesterId=${this.time.semesterValue}&startTime=${this.time.startTime}&endTime=${this.time.endTime}&userId=${this.all.createdUser}&courseId=${this.all.courseId}&gradeId=${this.all.gradeId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.lessonPlanList = res.data.result.filter(item => item.type === 1)
          this.lessonPlanList = this.lessonPlanList.filter(item => item.title !== '')
        } else if (res.data.code === -2) {
          error(this)
        }
      })
    },
    // 获取评价项目列表
    getPointList () {
      this.$https.get(`/check/lessonPlanDetail?userId=${this.all.createdUser}&planId=${this.message.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.attachmentlist = res.data.result.attachmentlist
          this.pointList = res.data.result.pointlist
          this.scoreCount = 0
          this.pointList.forEach((item, index) => {
            this.scoreCount += item.scores
          })
        } else if (res.data.code === -2) {
          // notice(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 失去焦点
    blur () {
      this.jsonstr = []
      this.scoreCount = 0
      for (let i = 0; i < this.pointList.length; i++) {
        let str = {}
        str.planId = this.message.id
        str.userId = this.userId
        str.pointId = this.pointList[i].id
        str.score = this.pointList[i].scores
        this.jsonstr.push(str)
        this.scoreCount += parseFloat(this.pointList[i].scores)
        if (!(/^\d+(\.\d+)?$/).test(this.pointList[i].scores)) {
          notice(this, this.pointList[i].title + `评分请输入小于等于${this.pointList[i].score}的数字`, 2000)
          this.canSave = true
          return
        } else {
          if (this.pointList[i].scores > this.pointList[i].score) {
            notice(this, this.pointList[i].title + `评分请输入小于等于${this.pointList[i].score}的数字`, 2000)
            this.canSave = true
            return
          }
        }
      }
      this.canSave = false
    },
    // 教案评分保存
    savePointScore () {
      if (!this.canSave) {
        this.$https.post(`/check/checkPointScoreSave`, querystring.stringify({
          jsonstr: JSON.stringify(this.jsonstr),
          scores: this.scoreCount
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '保存成功', 1000)
            this.canSave = true
            this.getPointList()
          } else if (res.data.code === -2) {
            notice(this, res.data.message, 2000)
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      'detail',
      'user',
      'previewUrl '
    ])
  },
  created () {
    this.time = JSON.parse(this.$route.query.time)
    if (this.detail.id) {
      sessionStorage.check = JSON.stringify(this.detail)
      this.all = this.detail
      this.getPlanList()
    } else {
      this.all = JSON.parse(sessionStorage.check)
      this.getPlanList()
    }
    setTimeout((item, index) => {
      if (this.lessonPlanList.length !== 0) {
        this.n = 0
        this.userId = this.user.user.loginUser.id
        this.message = this.lessonPlanList[0]
        this.filePath = this.message.filePath
        this.getHtml()
        this.getPointList()
      }
    }, 400)
  }
}
</script>

<style lang="scss">
@import  '../../../assets/scss/main.scss';
#lesson-plan-details{
  // 顶部导航
  .mark-disabled{
    display: none;
  }
  header{
    height: 42px;
    background: #DDE6EF;
    box-sizing: border-box;
    padding:10px 20px;
    p{
      margin: 0;
      color: #78818E;
      span{
        cursor: pointer;
        height: 25px;
        line-height: 25px;
        float: right;
        padding-left: 30px;
        background: url(../../../assets/images/back.png) no-repeat;
        &:hover{
          color: #408EE6;
          background: url(../../../assets/images/back-active.png) no-repeat;
        }
      }
    }
  }

  main{
    padding: 40px 10px;
    &>div{
      display: flex;
      border: 1px solid #B7C2D0;
      width: 100%;
      border-radius: 5px;
      .main-left{
        width: 340px;
        border-right: 1px solid #B7C2D0;
        p{
          margin: 0;
          background: #DDE6EF;
          border-bottom: 1px solid #B7C2D0;
          padding: 10px 15px;
          color: #636C7B;
        }
        .el-row{
          cursor: pointer;
          border-bottom: 1px dashed #DAE2ED;
          .el-col:first-child{
            color: #636C7B;
            padding: 10px 15px;
            border-left: 2px solid transparent;
            &.active{
              border-left: 2px solid #4C95E8;
              color: #4C95E8;
            }
          }
          .el-col:last-child{
            color: #636C7B;
            text-align: right;
            padding: 10px;
            margin-top: 2px;
            font-size: 12px;
            &.active{
              color: #4C95E8;
            }
            img{
              position: absolute;
              right: -3px;
            }
          }
        }
      }
      .main-right{
        flex: 1;
        &>p{
          border-bottom: 1px solid #B7C2D0;
          padding: 10px 15px;
          color: #636C7B;
        }
        .main-right-body{
          padding: 36px 10px;
          // max-height: 500px;
          box-sizing: border-box;
          // overflow-x: hidden;
          .main-right-body-top{
            border-bottom:1px solid #B7C2D0;
            h3{
              text-align: center;
              color: #666666;
              margin-bottom: 10px;
            }
            p{
              text-align: center;
              padding: 10px;
              color: #636C7B;
              .el-rate{
                display: inline-block;
                vertical-align: middle;
                margin-left: 20px;
                margin-right: 20px;
              }
            }
          }
          .mian-right-body-middle{

            // 富文本编辑器
            .ueditor {
              margin: 20px auto;
              width: 600px !important;
              #edui1{
                width: 600px !important;
              }
              .edui-editor-toolbarbox{
                display: none;
              }
              .edui-default .edui-editor-bottomContainer table{
                display: none;
              }
              div {
                div {
                  .edui-editor-iframeholder {
                    min-height: 600px;
                  }
                }
              }
            }
            p{
              margin: $width/2 auto;
              width: 600px;
              i{
                font-style: normal;
              }
              span{
                margin-right: $width;
                color: #408EE6;
                text-decoration: underline;
                cursor: pointer;
              }
            }
            // color: #636C7B;
            // text-indent: 2em;
            // table{
            //   border-collapse: collapse;
            //   td{
            //     border: 1px solid #666;
            //   }
            // }
          }
        }
      }
    }
  }

  .footer{
    margin:0 70px;
    border-top: 1px solid #B7C2D0;
    border-left: 1px solid #B7C2D0;
    border-radius: 5px;
    .footer-top{
      background: #DDE6EF;
      line-height: 40px;
      text-align: center;
      color: #636C7F;
      .el-col{
        border-right: 1px solid #B7C2D0;
        border-bottom: 1px solid #B7C2D0;
      }
    }
    .footer-list{
      line-height: 40px;
      text-align: center;
      color: #636C7F;
      .el-col{
        border-bottom: 1px solid #B7C2D0;
        border-right: 1px solid #B7C2D0;
        overflow-x: hidden;
        height: 41px;
        &:nth-child(3){
          border-right: 0;
        }
        &:last-child{
          border: 0;
          border-right: 0;
          .el-input__inner{
            border-top: 0;
            border-radius: 0;
            height: 41px;
          }
          .el-input__inner:focus{
            border-top: 1px solid #20A0FF;
          }
        }
      }
      &:last-child{
        border: 0;
      }
    }
    .total-score{
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid #B7C2D0;
      border-right: 1px solid #B7C2D0;
      border-bottom-right-radius: 5px;
      color: #636C7F;
      .el-col:first-child{
        border-right: 1px solid #B7C2D0;
      }
    }
  }

  .footer-button{
    margin-top: 50px;
    margin-bottom: 20px;
    text-align: center;
    .el-button{
      padding:8px 30px;
    }
    .saveButton{
      border: 1px solid #408EE6;
      color: #408EE6;
      &:hover{
        background: #408EE6;
        color: $white;
      }
    }
    .el-button:nth-child(2){
      border: 1px solid #FF6C60;
      color: #FF6C60;
      &:hover{
        background: #FF6C60;
        color: $white;
      }
    }
  }
}

</style>
