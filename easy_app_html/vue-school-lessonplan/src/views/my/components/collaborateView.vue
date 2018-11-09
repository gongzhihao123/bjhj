<template>
  <div id="collaborate-view">
    <!--顶部导航-->
    <header>
      <p>我的&nbsp;> &nbsp;我的协同&nbsp;>&nbsp;{{all.sectionName}}&nbsp;>&nbsp;{{all.gradeName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发表时间：
        {{all.createdTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}
        <span @click="goBack">
          返回上一层
        </span>
      </p>
    </header>

    <!--主体部分-->
    <main>
      <div class="title">
        <span>{{all.title}}</span>
        <p>
          <span>作者：{{all.createdUserName}}</span>
          <el-rate v-model="starValue" disabled></el-rate>
          <span>（已评人数：{{all.commentedNum ? all.commentedNum : 0}} &nbsp;&nbsp;&nbsp;综合得分：{{all.score ? all.score : 0}}）</span>
          <span class="download-button" @click="download">下载</span>
          <span class="reuse-button" @click="reuse">复用</span>
        </p>
      </div>

      <div class="main-body">
        <el-row class="mark-view" v-html="content">
        </el-row>

        <div class="main-body-footer">
          <p>
            附件：<span v-for="(item, index) in attenchmentsList" :key="index">
              <span @click="dblDownloadAttenchment(item, true)">
                {{item.fileName}}
              </span>
              <i @click="downloadAttenchment(item)">下载</i> </span>
          </p>
          <div class="after-school-summary">
            <span>
              课 后 小 结
            </span>
            <div>
              <p>{{all.summarize}}</p>
            </div>
          </div>

          <div class="comment">
            <el-row>
              <el-col :span="12">
                <span>
                  评&nbsp;&nbsp;&nbsp; 论
                </span>
              </el-col>
              <el-col :span="12">
                共 {{commentsList.length === 0 ? 0 : commentsList.length}} 条评论
              </el-col>
            </el-row>


            <div>
              <transition-group name="slide-down" mode="out-in">
                <el-row v-for="(item, index) in commentsList" :key="index">
                  <el-col :span="20">
                    <p>
                      <span> {{item.createdUserName}}</span>
                      <span></span>
                      <span>{{item.createdTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</span>
                    </p>
                    <p>
                      {{item.comment}}
                    </p>
                  </el-col>
                  <el-col :span="4">
                    <span v-if="item.createdUser === all.createdUser" @click="deleteComment(item)">
                      删除
                    </span>
                  </el-col>
                </el-row>
              </transition-group>
            </div>
          </div>

          <div class="close-button">
            <el-button @click="goBack">
              关闭
            </el-button>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { success, notice } from '../../../api/index.js'
export default {
  name: 'collaborate-view',
  data () {
    return {
      canDbl: true,
      content: '',
      starValue: 0,
      addMarkDialogVisible: false,
      borderOne: true,
      borderTwo: true,
      all: '',
      attenchmentsList: [],
      commentsList: []
    }
  },
  methods: {
    ...mapActions([
      'my',
      'judge'
    ]),
    goBack () {
      this.$router.push({path: '/my/collaborate', query: {pageNo: this.$route.query.pageNo}})
    },
    // 下载
    download () {
      if (this.content) {
        const path = document.querySelector('#contextPath').value
        window.location.href = `${path}/square/lessonPlanDownload?planId=${this.all.id}`
      } else {
        notice(this, '该文件没有具体内容，请勿下载！', 2000)
      }
    },
    // 复用
    reuse () {
      this.my(this.all)
      sessionStorage.auth = this.all.auth
      sessionStorage.addLessonPlanDialogVisible = '2'
      this.judge('1')
      this.$router.push(`/my/reuse`)
      sessionStorage.path = '/my/collaborateView'
    },
    // 下载课件
    downloadAttenchment (item) {
      this.timer = setTimeout(() => {
        if (this.canDbl) {
          const path = document.querySelector('#contextPath').value
          window.location.href = `${path}/square/lessonPlanCourseWareDownload?attachmentId=${item.id}`
        }
        this.canDbl = true
      }, 700)
    },
    // 在线预览
    dblDownloadAttenchment (item) {
      clearTimeout(this.timer)
      this.canDbl = false
      const path = document.querySelector('#contextPath').value
      if ((item.fileName.indexOf('docx') !== -1) || (item.fileName.indexOf('ppt') !== -1) || (item.fileName.indexOf('word') !== -1) || (item.fileName.indexOf('pdf') !== -1) || (item.fileName.indexOf('xlsx') !== -1) || (item.fileName.indexOf('xls') !== -1)) {
        window.open(`${this.previewUrl}${path}/square/lessonPlanOfficePreview?attachmentId=${item.id}`)
      } else {
        notice(this, '该课件不支持在线预览', 2000)
      }
    },
    // 查询详情
    getDetail (val) {
      this.$https.get(`/square/lessonPlanDetail?planId=${val}`)
      .then(res => {
        if (res.data.code === 1) {
          this.all = res.data.result.plan
          this.attenchmentsList = res.data.result.attenchments
          this.commentsList = res.data.result.comments
          this.$https.get(`/mine/lessonPlanHtmlRead?filepath=${this.all.filePath}`)
          .then(res => {
            this.content = res.data.result
            this.content = this.content.replace(/【\d{1}】/g, '')
            this.content = this.content.replace(/【\d{2}】/g, '')
          })
        }
      })
    },
    // 删除评论
    deleteComment (item) {
      this.$https.get(`/square/lessonPlanCommentDelete?commentId=${item.id}&planId=${this.all.id}`)
      .then(res => {
        if (res.data.code === 1) {
          success(this, '删除评论成功', 1000)
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
        this.getDetail(this.all.id)
      })
    }
  },
  computed: {
    ...mapGetters([
      'detail',
      'previewUrl'
    ])
  },
  created () {
    if (this.detail.id) {
      sessionStorage.id = this.detail.id
      this.getDetail(this.detail.id)
    } else {
      this.getDetail(sessionStorage.id)
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#collaborate-view{
  // .mark-disabled{
  //   display: none;
  // }
  // 顶部导航
  header{
    height: 42px;
    background: #DDE6EF;
    box-sizing: border-box;
    padding:10px 20px;
    p{
      margin: 0;
      color: #78818E;
      span{
        height: 25px;
        cursor: pointer;
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

  // 主体
  main{
    width: 1040px;
    margin: 0 auto;
    .title{
      padding: 20px 70px 0;
      &>span{
        display: block;
        text-align: center;
        font-size: 18px;
        margin-right: 20px;
        color: #666666;
        font-weight: bold;
      }
      &>p{
        margin-top: 15px;
        line-height: 25px;
        &>span{
          margin-right: 20px;
          color: #A2AAB8;
        }
        .el-rate{
          vertical-align: middle;
          display: inline-block;
        }
        .download-button{
          cursor: pointer;
          display: inline-block;
          padding-left: 30px;
          background: url(../../../assets/images/download.png) no-repeat;
          width: 30px;
          height: 25px;
        }
        .reuse-button{
          cursor: pointer;
          display: inline-block;
          padding-left: 30px;
          background: url(../../../assets/images/reuse.png) no-repeat;
          width: 30px;
          height: 25px;
        }
      }
    }

    .main-body{
      padding: 20px 70px;
      .mark-view{
        width: 100%;
        height: 500px;
        overflow-x: hidden; 
        border: 1px solid #B5BBC4;
        padding: 20px;
        table{
          border-collapse: collapse;
          td{
            border: 1px solid #666;
          }
        }
      }

      .main-body-footer{
        &>p{
          line-height: 25px;
          margin: 20px 0;
          span{
            margin-left: 10px;
            color:#408EE6;
            cursor: pointer;
            i {
              font-style: normal;
            }
          }
        }
        .after-school-summary{
          margin-top: 20px;
          &>span{
            display: inline-block;
            width: 155px;
            height: 37px;
            color: #fff;
            font-size: 16px;
            text-align: center;
            line-height: 37px;
            background: url(../../../assets/images/lan.png) no-repeat;
          }
          &>div{
            border: 1px solid #C4C9D0;
            padding: 20px;
            border-radius: 5px;
            p{
              color: #636C7B;
            }
          }
        }

        .comment{
          margin-top: 20px;
          &>.el-row{
            .el-col:first-child{
              &>span{
                display: inline-block;
                width: 155px;
                height: 37px;
                color: #fff;
                font-size: 16px;
                text-align: center;
                line-height: 37px;
                background: url(../../../assets/images/lv.png) no-repeat;
              }
            }
            .el-col:last-child{
              padding: 15px;
              padding-bottom: 0;
              text-align: right;
              color: #A2AAB8;
            }
          }
          &>div:nth-child(2){
            border: 1px solid #C4C9D0;
            padding: 20px;
            border-radius: 8px;
            .el-row{
              margin-bottom: 10px;
              .el-col:first-child{
                p:first-child{
                  span:first-child{
                    color: #408EE6;
                    margin-right: 20px;
                  }
                  span:nth-child(2){
                    display: inline-block;
                    height: 6px;
                    border: 1px solid #A2AAB8;
                    margin-right: 10px;
                  }
                  span:last-child{
                    color: #A2AAB8;
                    margin-right: 20px;
                  }
                }
                p:last-child{
                  width: 740px;
                  color: #636C7B;
                  margin-top: 5px;
                }
              }
              .el-col:last-child{
                text-align: right;
                span{
                  margin-top: 10px;
                  line-height: 25px;
                  display: inline-block;
                  padding-left: 30px;
                  background: url(../../../assets/images/delete-icon.png) no-repeat;
                  width: 30px;
                  height: 25px;
                  cursor: pointer;
                  color: #7F7F7F;
                  &:hover{
                    background: url(../../../assets/images/delete-icon-active.png) no-repeat;
                    color: #FF6C60;
                  }
                }
              }
            }
          }
        }

        .close-button{
          margin-top: 20px;
          text-align: center;
          .el-button{
            padding:8px 30px;
            border: 1px solid #FF6C60;
            color: #FF6C60;
            &:hover{
              background: #FF6C60;
              color: $white;
            }
          }
        }
      }
    }
  }

}

</style>
