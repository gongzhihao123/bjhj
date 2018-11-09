<template>
  <div class="declaration-index">
    <div >
      <div class="declaration-index-left">
        <!-- <ul>
          <li v-for="(item, index) in list" :key="index" :class="{ navActive: activeNum === index, noticeActive: item.notice === true }" @click="route(item, index)">
            {{ index + 1 +'.' + item.name }}
          </li>
        </ul> -->

        <el-steps v-if="!reasonShow" direction="vertical" :active="activeNum">
          <el-step :title="item.name" @click.native="route(item, index)" v-for="(item, index) in list" :key="index"></el-step>
        </el-steps>

        <ul v-if="reasonShow">
          <li v-for="(item, index) in list" :key="index" :class="{ navActive: activeNum === index }"  @click="route(item, index)">
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="declaration-index-right">
        <div>
          <router-view></router-view>
        </div>

        <div v-if="reasonShow">
          <el-input type="textarea" v-model="reason" :rows="5" :maxlength="30" placeholder="事由"></el-input>
          <p>
            <el-button type="primary" :disabled="canSubmit" @click="changeSubmit">提交</el-button>
            <el-button type="primary" @click="revokeTotopic">撤项</el-button>
          </p>
        </div>

        <p>
          <el-button size="small" type="primary" @click="preview" v-if="!reasonShow">查看申请表</el-button>
          <el-button size="small" type="primary" :disabled="canSubmit" v-if="!reasonShow" @click="submitButton">提交申请表</el-button>
          <el-button size="small" type="success" @click="back()">返回我的课题</el-button>
          <!-- <span style="color: #aaa; margin-left: 10px;" v-if="!reasonShow">(请填写完10步再点击预览、提交)</span> -->
        </p>
      </div>
    </div>
    
  </div>
</template>

<script>
import { dateFormatT } from '../../../../../filters/index'
import server from '../../../../../utils/axios'
import { success, notice } from '../../../../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'declaration-index',
  data () {
    return {
      activeNum: 0,
      guideId: '',
      reasonShow: false,
      list: [],
      reason: '',
      canSubmit: false
    }
  },
  methods: {
    // 预览
    preview () {
      if (!sessionStorage.SUBJECT_ID) {
        notice(this, '请先创建课题', 2000)
        return
      }
      server.get(`/frontTopicManageController/updateDeclaration?id=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          if (!res.data.result.two) {
            this.list[1].notice = true
            notice(this, '第二步还没有填写', 1000)
            return
          } else {
            this.list[1].notice = false
          }
          if (!res.data.result.three) {
            this.list[2].notice = true
            notice(this, '第三步还没有填写', 1000)
            return
          } else {
            this.list[2].notice = false
          }
          if (!res.data.result.four) {
            this.list[3].notice = true
            notice(this, '第四步还没有填写', 1000)
            return
          } else {
            this.list[3].notice = false
          }
          if (!res.data.result.five) {
            this.list[4].notice = true
            notice(this, '第五步还没有填写', 1000)
            return
          } else {
            this.list[4].notice = false
          }
          if (!res.data.result.six) {
            this.list[5].notice = true
            notice(this, '第六步还没有填写', 1000)
            return
          } else {
            this.list[5].notice = false
          }
          if (!res.data.result.seven) {
            this.list[6].notice = true
            notice(this, '第七步还没有填写', 1000)
            return
          } else {
            this.list[6].notice = false
          }
          if (!res.data.result.eight) {
            this.list[7].notice = true
            notice(this, '第八步还没有填写', 1000)
            return
          } else {
            this.list[7].notice = false
          }
          if (!res.data.result.nine) {
            this.list[8].notice = true
            notice(this, '第九步还没有填写', 1000)
            return
          } else {
            this.list[8].notice = false
          }
          if (!res.data.result.ten) {
            this.list[9].notice = true
            notice(this, '十步还没有填写', 1000)
          } else {
            this.list[9].notice = false
          }
        }
      })
      server.get(`/frontTopicDeclareController/preview?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          // window.open(this.previewUrl + this.staticUrl + res.data.result)
          window.open(`${this.previewUrl}${this.staticUrl}?filepath=${res.data.result}`)
        } else {
          // notice(this, res.data.message, 2000)
        }
      })
    },
    route (item, index) {
      if (sessionStorage.SUBJECT_ID) {
        this.$router.push({ path: item.path, query: {id: this.guideId} })
      } else {
        if (index !== 0) {
          notice(this, '请先创建课题内容', 2000)
        }
      }
    },
    // 撤项
    revokeTotopic () {
      if (!this.reason) {
        notice(this, '请填写撤项事由', 2000)
        return
      }
      server.post(`/frontTopicManageController/RevokeTotopic?tpTopicId=${sessionStorage.SUBJECT_ID}&changeReason=${this.reason}`)
      .then(res => {
        if (res.data.code === 1) {
          this.$router.push('/subjectManager/mySubject')
          success(this, '撤项提交成功', 1000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 变更提交
    changeSubmit () {
      if (sessionStorage.NINESTEPCONTENT === '[]') {
        notice(this, '请填写预期研究成果', 2000)
        return
      }
      if (!this.reason) {
        notice(this, '请填写变更事由', 2000)
        return
      }
      let obj = JSON.parse(sessionStorage.ONESTEPCONTENT)
      this.canSubmit = true
      server.post('/frontTopicManageController/saveStateOne', {
        changeId: sessionStorage.changeId === 'null' ? null : JSON.parse(sessionStorage.changeId).id,
        tpTopicId: sessionStorage.SUBJECT_ID,
        name: obj.name,
        guideId: obj.guideId,
        keyword: obj.keyword,
        topicLevel: '区级课题',
        topicTypeId: obj.topicTypeId,
        companyName: obj.companyName,
        wishResult: obj.wishResult,
        wishFinishTime: String(obj.wishFinishTime).length === 13 ? dateFormatT(Number(obj.wishFinishTime), 'yyyy-MM-dd hh:mm:ss') : dateFormatT(obj.wishFinishTime, 'yyyy-MM-dd hh:mm:ss'),
        topicCode: obj.topicCode,
        clickNum: obj.clickNum,
        referralsState: obj.referralsState,
        changeReason: this.reason,
        stepNineList: sessionStorage.NINESTEPCONTENT
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '变更提交成功', 1000)
        } else {
          notice(this, res.data.message, 2000)
        }
        this.$router.push('/subjectManager/mySubject')
      })
    },
    // 提交
    submitButton () {
      if (!sessionStorage.SUBJECT_ID) {
        notice(this, '请先创建课题', 2000)
        return
      }
      this.canSubmit = true
      server.post(`/frontTopicManageController/submitDeclaration`, ({
        id: sessionStorage.SUBJECT_ID,
        state: 0
      }))
      .then(res => {
        this.canSubmit = false
        if (res.data.code === 1) {
          success(this, '提交成功', 2000)
          this.$router.push('/subjectManager/myDeclaration')
        } else if (res.data.code === 0) {
          server.get(`/frontTopicManageController/updateDeclaration?id=${sessionStorage.SUBJECT_ID}`)
          .then(res => {
            if (res.data.code === 1) {
              if (!res.data.result.two) {
                this.list[1].notice = true
                notice(this, '第二步还没有填写', 1000)
                return
              } else {
                this.list[1].notice = false
              }
              if (!res.data.result.three) {
                this.list[2].notice = true
                notice(this, '第三步还没有填写', 1000)
                return
              } else {
                this.list[2].notice = false
              }
              if (!res.data.result.four) {
                this.list[3].notice = true
                notice(this, '第四步还没有填写', 1000)
                return
              } else {
                this.list[3].notice = false
              }
              if (!res.data.result.five) {
                this.list[4].notice = true
                notice(this, '第五步还没有填写', 1000)
                return
              } else {
                this.list[4].notice = false
              }
              if (!res.data.result.six) {
                this.list[5].notice = true
                notice(this, '第六步还没有填写', 1000)
                return
              } else {
                this.list[5].notice = false
              }
              if (!res.data.result.seven) {
                this.list[6].notice = true
                notice(this, '第七步还没有填写', 1000)
                return
              } else {
                this.list[6].notice = false
              }
              if (!res.data.result.eight) {
                this.list[7].notice = true
                notice(this, '第八步还没有填写', 1000)
                return
              } else {
                this.list[7].notice = false
              }
              if (!res.data.result.nine) {
                this.list[8].notice = true
                notice(this, '第九步还没有填写', 1000)
                return
              } else {
                this.list[8].notice = false
              }
              if (!res.data.result.ten) {
                this.list[9].notice = true
                notice(this, '十步还没有填写', 1000)
              } else {
                this.list[9].notice = false
              }
            }
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 返回
    back () {
      this.$router.push(sessionStorage.BACK_PATH)
    }
  },
  watch: {
    '$route' (to) {
      if (sessionStorage.IS_CHANGE === '1') {
        if (to.meta.stepNum === 8) {
          this.activeNum = 2
          return
        }
      }
      this.activeNum = to.meta.stepNum
    }
  },
  computed: {
    ...mapGetters([
      'staticUrl',
      'previewUrl'
    ])
  },
  created () {
    this.activeNum = this.$route.meta.stepNum
    this.guideId = Number(this.$route.query.id)
    if (sessionStorage.IS_CHANGE === '1') {
      this.reasonShow = true
      this.list = [
        { name: '课题内容', path: '/declarationStep/1' },
        { name: '负责人信息', path: '/declarationStep/2' },
        { name: '预期研究成果', path: '/declarationStep/9' }
      ]
    } else {
      this.reasonShow = false
      this.list = [
        { name: '第一步：课题内容', notice: false, path: '/declarationStep/1' },
        { name: '第二步：负责人信息', notice: false, path: '/declarationStep/2' },
        { name: '第三步：参与人信息', notice: false, path: '/declarationStep/3' },
        { name: '第四步：课题组成员相关研究成果', notice: false, path: '/declarationStep/4' },
        { name: '第五步：课题组成员"十二五"所承担课题', notice: false, path: '/declarationStep/5' },
        { name: '第六步：课题设计论证', notice: false, path: '/declarationStep/6' },
        { name: '第七步：前期工作参阅的主要文献', notice: false, path: '/declarationStep/7' },
        { name: '第八步：完成课题的条件和保证', notice: false, path: '/declarationStep/8' },
        { name: '第九步：预期研究成果', notice: false, path: '/declarationStep/9' },
        { name: '第十步：课题负责人所在单位意见', notice: false, path: '/declarationStep/10' }
      ]
    }
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.declaration-index{
  padding: $width;
  &>div:first-child{
    display: flex;
  }
  &>div:nth-child(2){
    &>p{
      margin-top: $width;
      text-align: center;
    }
  }
  .declaration-index-left{
    width: 300px;
    height: 698px;
    padding-bottom: 20px;
    background: #fff;
    // padding: 20px;

    .el-steps {
      padding: $width;
    }

    .el-step {
      max-width: 100% !important;
      cursor: pointer;
    }

    ul {
      padding-top: 20px;
      li {
        border-left: 2px solid transparent;
        padding-left: 80px;
        line-height: 50px;
        cursor: pointer;

        &:nth-child(1) {
          background: url(../../../../../assets/images/change-1.png) no-repeat 50px 17px;
        }
        &:nth-child(2) {
          background: url(../../../../../assets/images/change-2.png) no-repeat 50px 17px;
        }
        &:nth-child(3) {
          background: url(../../../../../assets/images/change-3.png) no-repeat 50px 17px;
        }
      }

      .navActive{
        border-left: 2px solid #5295EB;
        color: #5396EB;
        background: #E9F2FD;

        &:nth-child(1) {
          background: #E9F2FD url(../../../../../assets/images/change-1-blue.png) no-repeat 50px 17px;
        }
        &:nth-child(2) {
          background: #E9F2FD url(../../../../../assets/images/change-2-blue.png) no-repeat 50px 17px;
        }
        &:nth-child(3) {
          background: #E9F2FD url(../../../../../assets/images/change-3-blue.png) no-repeat 50px 17px;
        }
      }
    }
    // ul{
    //   li{
    //     position: relative;
    //     color: #838383;
    //     cursor: pointer;
    //     padding: $width/1.5;
    //     margin-bottom: $width;
    //     border: 1px solid #DEDEDE;
    //     &::after{
    //       content: '';
    //       display: none;
    //       position: absolute;
    //       right: -30px;
    //       top: -1px;
    //       border-left: 15px solid #3CC1F9;
    //       border-right: 15px solid transparent;
    //       border-top: 24px solid transparent;
    //       border-bottom: 24px solid transparent;
    //     }

    //     &:hover{
    //       background: #3CC1F9;
    //       border: 1px solid #3CC1F9;
    //       color: #fff;
    //     }
    //   }
    //   .navActive{
    //     background: #3CC1F9;
    //     color: #fff;
    //     &::after{
    //       display: block;
    //     }
    //   }
    //   .noticeActive{
    //     color: red;
    //   }
    // }
  }

  .declaration-index-right{
    flex: 1;
    margin-left: 26px;

    &>div {
      background: #fff;
    }

    &>div:nth-child(2) {
      padding: $width;

      .el-textarea {
        margin-bottom: 20px;
      }

      p {
        text-align: center;
      }
    }

    &>p{
      // background: #EFEFEF;
      padding: $width/2;
      // .el-button:nth-child(1){
      //   float: right;
      // }
      // .el-button{
      //   &::before{
      //     margin-right: 5px;
      //   }
      // }
      // &::after{
      //   content: '';
      //   display: block;
      //   height: 0;
      //   clear: both;
      //   visibility: hidden;
      // }
    }
  }
}
</style>
