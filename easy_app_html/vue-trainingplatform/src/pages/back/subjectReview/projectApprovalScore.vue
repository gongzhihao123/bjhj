<template>
  <div class="project-approval-score">
    <header>
      课题立项评分
    </header>

    <main>
      <div class="score-left">
        <p>当前阶段</p>

        <el-steps :active="0">
          <el-step v-for="(item, index) in navList" :key="index" :title="item.name" :description="item.time | dateFormat('yyyy-MM-dd')"></el-step>
        </el-steps>

        <div class="score-describe">
          <p>
            <span>课题名称：</span>
            {{ detail.topicName }}
          </p>
          <p>
            <span>内部评审人：</span>
            <i style="font-style: normal;" v-for="(item, index) in userList" :key="index"> {{ item.userName }} </i>
            <br>
            <span>评审专家：</span>
            <i style="font-style: normal;" v-for="(item, index) in expertsList" :key="index"> {{ item.userName }} </i>
          </p>
          <p>
            本次评审到{{ detail.guideCheckEndTime | dateFormat('yyyy-MM-dd') }}结束，距评审结束还有
            {{ Number(((detail.guideCheckEndTime - new Date().getTime())/1000/60/60/24).toFixed(0)) < 0 ? 0 : (((detail.guideCheckEndTime - new Date().getTime())/1000/60/60/24).toFixed(0)) }}天
          </p>
        </div>

        <div>
          <iframe :src="url" class="score-content" width="900" height="900"></iframe>
        </div>

        <el-form :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">

          <div class="score-scoring">
            <i>(提示：满分为100分)</i>
            <span>得分</span>
            <el-form-item
              prop="score"
              :rules="[
                { required: true, message: '评分不能为空'},
              ]"
            >
              <el-input type="number" max="100" min="0" v-model="contentData.score"></el-input>
            </el-form-item>
          </div>
        </el-form>

        <div class="score-appraise">
          <p>评价</p>
          <el-input type="textarea" v-model="comment" :rows="3" :maxlength="30" placeholder="请输入评价内容"></el-input>
        </div>

        <footer>
          <el-button type="primary" size="small" @click="submitForm('contentData')">提交</el-button>
          <el-button size="small" @click="$router.push('/subjectReview/backProjectApproval')">返回</el-button>
        </footer>
      </div>
      <div class="score-right">
        <el-button size="small" @click="$router.push('/subjectReview/backProjectApproval')"> 返回 </el-button>
      </div>
    </main>

  </div>
</template>

<script>
import server from '../../../utils/axios'
import { success, notice } from '../../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'project-approval-score',
  data () {
    return {
      contentData: {
        score: ''
      },
      comment: '',
      detail: {},
      navList: [
        { name: '立项申请', time: '' },
        { name: '开题阶段', time: '' },
        { name: '中期研究阶段', time: '' },
        { name: '中期总结阶段', time: '' },
        { name: '结题阶段', time: '' }
      ],
      expertsList: [],
      userList: [],
      url: ''
    }
  },
  methods: {
    // 获取详情
    getTopicScoreDetail () {
      server.get(`/backDeclareCheckController/getTopicScoreDetail?topicId=${this.$route.query.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detail = res.data.result
          this.expertsList = this.detail.checkUsers.filter(item => item.userType === 3)
          this.userList = this.detail.checkUsers.filter(item => item.userType !== 3)
          this.navList[0].time = this.detail.topicCreatedTime
          this.contentData.score = this.detail.checkScore
          this.comment = this.detail.checkComment
          this.url = `${this.previewUrl}${this.staticUrl}?filepath=${this.detail.previewUrl}`
          if (!res.data.result.checkScore) {
            this.$refs['contentData'].resetFields()
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.contentData.score > 100 || this.contentData.score < 0) {
            notice(this, '评分应在0-100之间', 2000)
            return
          }
          server.post(`/backDeclareCheckController/saveTopicCheckScore`, {
            checkId: this.detail.checkId,
            score: Math.round(this.contentData.score),
            comment: this.comment,
            submitFlag: ''
          })
          .then(res => {
            if (res.data.code === 1) {
              success(this, '提交成功', 1000)
              this.$router.push('/subjectReview/backProjectApproval')
            } else {
              notice(this, res.data.message, 2000)
            }
          })
        } else {
          return false
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'staticUrl',
      'previewUrl'
    ])
  },
  created () {
    this.getTopicScoreDetail()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.project-approval-score{
  padding-bottom: $width;
  header{
    line-height: 56px;
    font-size: 18px;
  }

  main{
    background: #fff;
    padding: $width;
    display: flex;

    .score-left{
      width: 900px;
      &>p{
        margin-bottom: $width;
      }
      
      // 描述
      .score-describe{
        margin-top: $width;
        min-height: 135px;
        background: #F3F3F3;
        box-sizing: border-box;
        padding: $width;

        &>p{
          line-height: 32px;
          font-weight: bold;
          span{
            font-weight: normal;
          }
        }
      }

      // 预览内容
      .score-content{
        margin-top: $width;
        min-height: 200px;
        max-height: 800px;
        overflow-x: hidden;
        border: 1px solid #E4E4E4;
      }

      // 评分部分
      .score-scoring{
        margin: 20px 0 30px;
        height: 60px;
        box-sizing: border-box;
        background: #F8F9FD;
        line-height: 60px;
        text-align: center;
        .el-form-item{
          display: inline-block;
          .el-form-item__content{
            margin-left: 0 !important;
          }
        }
        i{
          float: right;
          margin-right: $width;
          font-style: normal;
        }
        span{
          margin-right: $width*2;
          margin-left: $width*5;
        }
        .el-input{
          width: 80px;
        }
      }

      // 评价部分
      .score-appraise{
        p{
          margin-bottom: $width/2;
        }
      }

      footer{
        margin-top: $width;
      }
    }

    .score-right{
      flex: 1;
      text-align: right;
    }
  }
}
</style>
