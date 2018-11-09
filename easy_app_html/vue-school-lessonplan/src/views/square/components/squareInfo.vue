<template>
  <div id="squareInfo">
      <div class="head">
        <span>{{name}}
          <i>>{{sectionName}}></i>
          <i>{{gradeName}}></i>
          <i>{{courseName}}</i>
        </span>
        <span class="publish">发表时间：{{time | dateFormat('yyyy-MM-dd hh:mm')}}</span>
        <a @click="closebox">
        <i class="back"></i>
        返回上一层</a>
      </div>

      <div class="plancontent">
        <div class="plan-head">
          <h3>{{plan.title}}</h3>
          <div>
          <span>作者: {{plan.createdUserName}}</span>
          <el-rate
            :disabled="plan.scoreFlag"
            @change="getPlanScore"
            :allow-half="true"
            v-model="plan.myScore">
          </el-rate>
          <span class="number">（已评人数：{{plan.commentedNum ? plan.commentedNum : 0}}&nbsp;&nbsp;&nbsp;&nbsp;综合得分： {{plan.score ? plan.score : 0}}）</span>
          <ul>
            <li @click="getCollect"><img src="../../../assets/images/wcollect.png" v-if="!plan.collectionFlag"><img src="../../../assets/images/collect.png" v-if="plan.collectionFlag"><span>收藏</span></li>
            <li @click="exportplan"><img src="../../../assets/images/download.png"><span>下载</span></li>
            <li @click="reusemodel" class="reuse"><img src="../../../assets/images/reuse.png"><span>复用</span></li>
          </ul>          
          </div>
        </div>
        <div class="plan-excel">
          <Ueditor @ready="editorReady" class="ueditor" v-loading="uloading"></Ueditor>
        </div>

        <div class="afterclass">
          <img src="../../../assets/images/lan.png">
          <span>课后小结</span>
          <div class="sum">{{plan.summarize}}</div>
        </div>

        <div class="comment">
          <img src="../../../assets/images/lv.png">
          <span>评&nbsp;&nbsp;&nbsp;&nbsp;论</span>
          <p>共{{comments.length}}条评论</p>
          <ul> 
            <transition-group name="slide-left" mode="out-in" class="animation">  
            <li v-for="(comment, index) in comments" :key="index">
              <span class="comment-name">{{comment.createdUserName}}</span>
              <span class="comment-createdtime">|&nbsp;&nbsp;{{comment.createdTime | dateFormat('yyyy-MM-dd hh:mm')}}</span>
              <p>{{comment.comment}}</p>
              <div  class="delete-icon"  @click="deletecomment(index)" v-if="comment.deleteFlag">
                <i class="icon-pic"></i>
                <span>删除</span>
              </div>
            </li>
            </transition-group>
          </ul>

          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 5}"
            placeholder="请输入评论内容"
            v-model.trim="commentcontent"
            :maxlength="1000">
          </el-input>

          <div class="button-box">
            <el-button type="primary" @click="getCommentAdd">提交</el-button>
            <el-button @click="commentcontent = ''">取消</el-button>
          </div>
        </div>

        <el-button class="close" @click="closebox">关闭</el-button>
      </div>


  </div>
</template>

<script>
import Ueditor from '../../../components/Ueditor'
import { error, notice, success } from '../../../api/index.js'
import { mapActions, mapGetters } from 'vuex'
import querystring from 'querystring'
export default {
  name: 'squareInfo',
  data () {
    return {
      navInfo: [],
      attenchments: [],
      comments: [],
      plan: {},
      name: '教案广场',
      htmlStr: '',
      sectionName: '',
      courseName: '',
      gradeName: '',
      filepath: '',
      time: '',
      planId: '',
      value: 0,
      commentcontent: '',
      content: '',
      uloading: false,
      UE: ''
    }
  },
  components: {
    Ueditor
  },
  computed: {
    ...mapGetters([
      'hide'
    ])
  },
  watch: {
    hide () {
      this.UE.setHide()
    }
  },
  methods: {
    ...mapActions([
      'my',
      'judge'
    ]),
    change () {
      this.flag = true
    },
    editorReady (instance) {
      this.UE = instance
      instance.setContent(this.htmlStr)
      instance.setDisabled('inserthtml')
      instance.addListener('contentChange', () => {
        this.htmlStr = instance.getContent()
      })
      setTimeout(() => {
        this.htmlStr = this.htmlStr.replace(/【\d{1}】/g, '')
        this.htmlStr = this.htmlStr.replace(/【\d{2}】/g, '')
        instance.setContent(this.htmlStr)
        instance.addListener('contentChange', () => {
          this.htmlStr = instance.getContent()
        })
      }, 200)
    },
    deletecomment (index) {
      this.$https.get(`/square/lessonPlanCommentDelete?commentId=${this.comments[index].id}&planId=${this.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.comments.length--
          this.getPlanDetail()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    exportplan () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/square/lessonPlanDownload?planId=${this.planId}`
    },
    reusemodel () {
      sessionStorage.addLessonPlanDialogVisible = '2'
      this.my(this.plan)
      sessionStorage.auth = this.plan.auth
      this.judge('1')
      sessionStorage.path = '/squareInfo'
      this.$router.push('/my/reuse')
    },
    getPlanDetail () {
      this.$https.get(`/square/lessonPlanDetail?planId=${this.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.attenchments = res.data.result.attenchments
          this.comments = res.data.result.comments
          this.plan = res.data.result.plan
          this.filepath = this.plan.filePath
          setTimeout(() => {
            this.getPlanHtml()
          }, 400)
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    getPlanScore () {
      this.$https.get(`/square/lessonPlanScore?planId=${this.planId}&score=${this.plan.myScore}`)
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.getPlanDetail()
        } else if (res.data.code === -2) {
          error(this)
        } else if (res.data.code === 0) {
          this.starclick = true
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    getPlanHtml () {
      if (!this.filepath) {
        return
      }
      this.$https.get(`/mine/lessonPlanHtmlRead?filepath=${this.filepath}`)
      .then(res => {
        if (res.data.code === 1) {
          this.htmlStr = res.data.result
          this.htmlStr = this.htmlStr.replace(/【\d{1}】/g, '')
          this.htmlStr = this.htmlStr.replace(/【\d{2}】/g, '')
          this.UE.setContent(this.htmlStr)
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    getHeight () {
      let h = document.getElementById('index').offsetHeight
      let app = document.getElementById('app')
      app.style.height = h + 'px'
      app.style.overflow = 'hidden'
    },
    getCollect () {
      this.$https.get(`/mine/lessonPlanCollection?planId=${this.planId}`)
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.getPlanDetail()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    getCommentAdd () {
      if (!this.commentcontent) {
        notice(this, '请输入评论内容', 2000)
        return
      }
      this.$https.post(`/square/lessonPlanCommentAdd`, querystring.stringify({planId: this.planId, comment: this.commentcontent}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.comments.length++
          this.commentcontent = ''
          this.getPlanDetail()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    closebox () {
      this.hideUeditor()
      this.$router.push(`/square`)
    },
    hideUeditor () {
      this.UE.setHide()
    }
  },
  created () {
    this.modelInfo = JSON.parse(sessionStorage.modelInfo)
    this.sectionName = this.modelInfo.sectionName
    this.gradeName = this.modelInfo.gradeName
    this.courseName = this.modelInfo.courseName
    this.time = this.modelInfo.time
    this.planId = this.modelInfo.planId
    this.getPlanDetail()
    this.uloading = true
    setTimeout(() => {
      this.uloading = false
    }, 1000)
  }
}
</script>

<style lang="scss">
  #squareInfo {
    width: 100%;
    margin: 0px;
    padding: 0px;
    background: #fff;
    border-radius: 8px;
    .mark-disabled{
      display: none;
    }
    .head {
      width: auto;
      height: 40px;
      background: #DDE6EF;
      padding-left: 20px;
      border-bottom: 1px solid #E1E8F1;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;      

      span {
        color: #636C7B;
        font-size: 14px;
        line-height: 40px;
        color: #636C7B;
        letter-spacing: 2px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;        

        i {
          font-style: normal;
        }
      }

      .publish {
        margin-left: 28px;
      }
      a {
        text-decoration: none;
        line-height: 40px;
        float: right;
        margin-right: 20px;
        position: relative;
        &:visited {
          color: #88909D;
        }
        color: #88909D;
        

        .back {
          width: 24px;
          height: 24px;
          display: block;
          vertical-align: middle;
          right: 85px;
          vertical-align: middle;
          position: absolute;
          top: 8px;
          background: url(../../../assets/images/back.png) no-repeat;

        }
      }

      a:hover {
        color: #408EE6;
        cursor: pointer;

        .back {
          background: url(../../../assets/images/back-active.png) no-repeat;
        }
      }

    }

    .plancontent {
      margin-top: 40px;

      .plan-head {

        &:after {
          content: "";        
          display: block;               
          clear: both;
        }
        h3 {
          color: #666666;
          text-align: center;
        }
        &>div {
          display: block;
          clear: both;
          overflow: hidden;
          width: 900px;
          margin: 0 auto;

          span {
            color: #A2AAB8;
            width: auto;
            float: left;
          }

          .el-rate {
            float: left;
            margin-left: 36px;
          }

          .number {
            margin-left: 17px;
          }

          ul {

            margin: 0px 0px 0px 36px;
            padding: 0px;
            width: auto;
            float: left;

            &:after {
              content: "";        
              display: block;               
              clear: both;
            }

            li {
              list-style-type: none;
              float: left;
              margin-right: 25px;
              margin-bottom: 15px;

              img {
                vertical-align: middle;
                float: left;
                margin-right: 10px;
              }

              span {
                float: left;
                color: #666666;
                line-height: 24px;
              }
            }
            li:hover {
              cursor: pointer;
            }
          }          
        }

      }

        .plan-excel {

          width: 900px;
          margin: 0px auto 30px auto;
          &>table {
            height: 500px;
            overflow: scroll;
            border-collapse: collapse;
            td {
                border: 1px solid #666;
            }
          }
          &>.ueditor {
          margin-bottom: 94px;
          div {
            .edui-editor {
              margin: 0px 165px 30px 0px;
            }
            div {
              .edui-editor-iframeholder {
                min-height: 600px;
              }
              .edui-editor-toolbarbox, .edui-editor-bottomContainer {
                display: none;
              }
            }
          }
        }
        }        

      .afterclass {
        margin: 74px 165px 30px 0px;
        border: 1px solid #B5BBC4;
        border-radius: 4px;
        min-height: 100px;
        position: relative;
        width: 900px;
        margin: 0 auto;

        img {
          position: absolute;
          top: -38px;
          left: 20px;
        }

        span {
          position: absolute;
          top: -28px;
          left: 65px;
          color: #fff;
          font-size: 16px;
        }
        
        .sum{
          padding-top: 20px;
          padding-left: 23px;
          color: #636C7B;
        }
      }
      .comment {
        margin: 60px auto 40px;
        border: 1px solid #B5BBC4;
        border-radius: 4px;
        position: relative;
        padding: 0px 20px 0px 20px;
        width: 860px;

        img {
          position: absolute;
          top: -38px;
          left: 20px;          
        }
        span {
          position: absolute;
          top: -28px;
          left: 75px;
          color: #fff;
          font-size: 16px;
        }

        p {
          position: absolute;
          right: 20px;
          top: -35px;
          color: #A2AECD;
        }

        ul {
          padding-left: 0px;
          border-bottom: 1px dashed #ccc;
          .animation {
            position: static;
            li {
              list-style-type: none;
              position: relative;
              display: block;

              .comment-name {
                color: #408EE6;
                font-size: 14px;
              }
              .comment-createdtime {
                color: #ccc;
                margin-left: 25px;
                font-size: 14px;
              }

              p {
                color: #636C7B;
                margin-top: 20px;
                word-wrap: break-word;
                max-width: 1325px;
                min-width: 778px;
              }
              span, p{
                position: static;
              }

              .delete-icon {
                width: 60px;
                height: 24px;
                position: absolute;
                top: 6px;
                right: 20px;

                .icon-pic {
                  width: 24px;
                  height: 24px;
                  display: block;
                  position: static;
                  vertical-align: middle;
                  background: url(../../../assets/images/delete-icon.png) no-repeat;
                  float: left;
                  margin-right: 8px;
                }
                
                span {
                  color: #636C7B;
                  font-size: 14px;
                }
              }

              .delete-icon:hover {
                cursor: pointer;
                span {
                  color: #FF6C60;
                }

                .icon-pic {
                  background: url(../../../assets/images/delete-icon-active.png) no-repeat;
                }
              } 
          }
          }
        }

        .el-textarea {
          margin: 30px 0px;
          padding-bottom: 100px;

          .el-textarea__inner {
            outline: none;
            resize: none;
            border: 1px solid #B5BBC4;
            height: 80px;
          }
        }

        .button-box {
          width: auto;
          position: absolute;
          right: 19px;
          bottom: 40px;
          .el-button {
            width: 90px;
            height: 33px;
            background: #fff;

            &:first-child {
              border: 1px solid #408EE6;
              span {
                position: static;
                color: #408EE6;
                font-size: 14px;
              }
              &:hover {
                background: #408EE6;
                border: 1px solid #408EE6;
                cursor: pointer;
                span {
                  color: #fff;
                }
              }
            }
            &:last-child {
              border: 1px solid #FF6C60;
              span {
                position: static;
                color: #FF6C60;
                font-size: 14px;
              }
              &:hover {
              background: #FF6C60;
              border: 1px solid #FF6C60;
              cursor: pointer;

              span {
                color: #fff;
              }
            }
            }
            }
        }
      }
      .close {
        width: 90px;
        height: 33px;
        background: #fff;
        border: 1px solid #FF6C60;
        margin-left: 46%;
        margin-bottom: 20px;

        span {
          color: #FF6C60;
        }
      }

      .close:hover {
        background: #FF6C60;
        border: 1px solid #FF6C60;
        cursor: pointer;

        span {
          color: #fff;
         }
      }
    }
  }

</style>
