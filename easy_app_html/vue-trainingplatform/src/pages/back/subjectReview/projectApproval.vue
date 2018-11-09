<template>
  <div class="project-approval">

    <div class="nav-name">
      <img src="../../../assets/images/backSubjectChange-icon.png" alt="">
      课题评审
    </div>

    <header>
      <span v-if="endTime && endTime >= new Date().getTime()">
        本次评审到{{ endTime | dateFormat('yyyy-MM-dd') }}结束，距评审结束还有{{ ((endTime - new Date().getTime())/1000/60/60/24).toFixed(0) }}天
      </span>
      <span style="color: red;" v-if="endTime && endTime < new Date().getTime()">
        本次评审到{{ endTime | dateFormat('yyyy-MM-dd') }}结束，距评审结束还有 0 天
      </span>
      立项申请评审
      <i>*</i>
      <p>(提交前请先指定课题分类)</p>
    </header>

    <main>
      <el-radio-group v-model="value" @change="screening">
        <el-radio :label="5">全部</el-radio>
        <el-radio :label="3">待审批</el-radio>
        <el-radio :label="0">待签署意见</el-radio>
        <el-radio :label="1">同意立项</el-radio>
        <el-radio :label="2">不予立项</el-radio>
        <el-radio :label="4">待指定类别</el-radio>
      </el-radio-group>

      <el-table
        :data="tableData"
        stripe
        @selection-change="change"
        style="width: 100%">
        <el-table-column
          type="selection"
          align='center'
          show-overflow-tooltip
          label-class-name="head"
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          label="课题名称"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="classificationName"
          label="课题分类"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="leadUserName"
          label="负责人"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="单位"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="score"
          label="得分"
          align='center'
          width="60"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="签署状态"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-if="scope.row.checkState === 0" style="color: #5295EB;">未签署</span>
            <span v-if="scope.row.checkState === 1" style="color: #87D57C;">同意立项</span>
            <span v-if="scope.row.checkState === 2" style="color: #F58071;">不予立项</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align='center'
          width="160"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :enterable="false" content="评分" placement="top">
              <el-button type="primary" size="small" @click="score(scope.row.id)" v-if="scope.row.checkState === 0"><i class="iconfont icon-score"></i></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="评分" placement="top">
              <el-button type="primary" size="small" @click="score(scope.row.id)" v-if="scope.row.checkState !== 0" :disabled="scope.row.score !== null"><i class="iconfont icon-score"></i></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="签署" placement="top">
              <el-button v-if="scope.row.userType === 1" :disabled="scope.row.checkState !== 0" type="primary" size="small" @click="signed(scope.row)"><i class="iconfont icon-signed"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </main>

    <p>
      <el-button type="primary" @click="assignCategory" :disabled="canAssignCategory">指定课题分类</el-button>
      <el-button type="primary" @click="submit" v-if="projectApprovalUser && projectApprovalUser.userType === 1" :disabled="tableData.length === 0 || tableData.some(item => !item.classificationName)">提交</el-button>
      <el-pagination
        v-if="totalCount !== 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </p>
    
    <!-- 评分弹出框 -->
    <el-dialog
      :visible.sync="scoreDialogVisible"
      class="score-dialog"
      width="922px">
      <p slot="title">
        <span>
          本次评审到
          <span style="color: #629DEC;">{{ detail.guideCheckEndTime | dateFormat('yyyy-MM-dd') }}
          </span>结束，距评审结束还有
            <span style="color: red;">
              {{ Number(((detail.guideCheckEndTime - new Date().getTime())/1000/60/60/24).toFixed(0)) < 0 ? 0 : (((detail.guideCheckEndTime - new Date().getTime())/1000/60/60/24).toFixed(0)) }}</span> 天
        </span>
        <i>课题立项评审</i>
      </p>

      <div>
        <p>
          评审分组： <span v-for="(item, index) in userList" :key="index">{{ item.userName }}</span> <br>
          邀请专家： <span v-for="(item, index) in expertsList" :key="index">{{ item.userName }}</span>
        </p>
        <p>
          课题名称： {{ detail.topicName }}
        </p>
      </div>

      <div>
        <iframe :src="url" class="score-content" width="870" height="400"></iframe>
      </div>

      <el-form :model="contentData" ref="contentData" label-width="150px" class="demo-ruleForm">

        <div class="score-scoring">
          <span>得分：</span>
          <el-form-item
            prop="score"
            :rules="[
              { required: true, message: '评分不能为空'},
            ]"
          >
            <el-input placeholder="满分为100分，请输入" type="number" max="100" min="0" v-model="contentData.score"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <div class="score-appraise">
        <p>评价：</p>
        <el-input type="textarea" v-model="comment" :rows="3" :maxlength="30" placeholder="请输入评价内容"></el-input>
      </div>

      <footer>
        <el-button type="primary" size="small" @click="submitForm('contentData')">确定</el-button>
        <el-button type="danger" size="small" @click="scoreDialogVisible = false">返回</el-button>
      </footer>
      
      <ul>
        <li v-for="(item, index) in pointList" :key="index">
          <span>
            {{ item.name }}
          </span>
          <i></i>
        </li>
      </ul>
    </el-dialog>


    <!-- 签署弹出框 -->
    <el-dialog
      :visible.sync="signedDialogVisible"
      class="signed-dialog"
      width="600px">

      <p slot="title">
        <i>签署</i>
      </p>

      <div>
        <p>
          课题名称： <span>{{ detail.name }}</span> <br>
          单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位： <span>{{ detail.companyName }}</span>
        </p>
      </div>

      <div>
        <p>
          评审详细信息：
        </p>
        <el-table
          :data="peopleData"
          border
          stripe>
          <el-table-column
            prop="userName"
            label="评审人"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            label="评审意见"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
            <template slot-scope="scope">
              {{ scope.row.score ? scope.row.score >= 60 ? '通过' : '不通过' : null }}
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="评分"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="comment"
            label="评语"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>

        <p>
          评审综合信息：
        </p>

        <el-table
          :data="totalData"
          border
          stripe>
          <el-table-column
            prop="allCount"
            label="评审组人数"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="realityCount"
            label="实际评审人数"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="agreement"
            label="同意立项"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="disagreement"
            label="不同意立项"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="averageScore"
            label="平均得分"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>
      </div>

      <div class="signed-advice">
        <span>
          评审组长意见：
        </span>
        <el-radio-group v-model="signedRadioValue">
          <el-radio :label="1">同意立项</el-radio>
          <el-radio :label="2">不予立项</el-radio>
        </el-radio-group>
        <el-input type="textarea" :maxlength="30" v-model="signedContent" placeholder="请填写" :rows="3"></el-input>
      </div>

      <footer>
        <el-button type="primary" size="small" @click="signedSubmitForm">提交</el-button>
        <el-button size="small" @click="signedDialogVisible = false">返回</el-button>
      </footer>

      <ul>
        <li v-for="(item, index) in pointList" :key="index">
          <span>
            {{ item.name }}
          </span>
          <i></i>
        </li>
      </ul>
    </el-dialog>

    <el-dialog
      title="指定课题类别"
      :visible.sync="dialogVisible"
      width="30%">
      <el-radio-group v-model="radioValue">
        <el-radio :label="item.id" v-for="(item, index) in subjectTypeList" :key="index"> {{ item.name }} </el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTopicClassification">确 定</el-button>
        <el-button type="danger" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import server from '../../../utils/axios'
import { mapGetters } from 'vuex'
import { success, notice } from '../../../api/index'
export default {
  name: 'project-approval',
  data () {
    return {
      pointList: [
        { name: '立项申请' },
        { name: '开题报告' },
        { name: '中期报告' },
        { name: '结题申请' },
        { name: '结题' }
      ],
      projectApprovalUser: {
        userType: ''
      },
      signedContent: '',
      signedRadioValue: 1,
      signedDialogVisible: false,
      contentData: {
        score: ''
      },
      url: '',
      value: 5,
      canAssignCategory: true,
      scoreDialogVisible: false,
      dialogVisible: false,
      radioValue: 3,
      pageSize: 10,
      pageNo: 1,
      totalCount: 0,
      tableData: [],
      totalData: [],
      selectedData: '',
      searchType: '',
      subjectTypeList: [],
      endTime: '',
      comment: '',
      detail: {},
      expertsList: [],
      userList: [],
      peopleData: [],
      navList: [
        { name: '立项申请', time: '' },
        { name: '开题阶段', time: '' },
        { name: '中期研究阶段', time: '' },
        { name: '中期总结阶段', time: '' },
        { name: '结题阶段', time: '' }
      ]
    }
  },
  methods: {
    signedSubmitForm () {
      server.post('/backDeclareCheckController/saveTopicSign', {
        checkId: this.peopleData.filter(item => item.userType === 1)[0].id,
        topicId: this.detail.id,
        checkState: this.signedRadioValue,
        opinion: this.signedContent
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '提交成功', 1000)
          this.signedDialogVisible = false
          this.getTopicScoreList()
          this.signedContent = ''
          // this.$router.push('/subjectReview/backProjectApproval')
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取签署详情
    getTopicCheckScoreList (val) {
      server.get(`/backDeclareCheckController/getTopicCheckScoreList?topicId=${val}`)
      .then(res => {
        if (res.data.code === 1) {
          this.peopleData = res.data.result
          let averageScore = 0
          let realityCount = 0
          res.data.result.forEach((item, index) => {
            if (item.score) {
              averageScore += item.score
              realityCount += 1
            }
          })
          this.totalData = [
            { allCount: this.peopleData.length, realityCount: realityCount, agreement: res.data.result.filter(item => item.score >= 60).length, disagreement: res.data.result.filter(item => item.score && item.score < 60).length, averageScore: (averageScore / (realityCount === 0 ? 1 : realityCount)).toFixed(0) }
          ]
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 筛选
    screening (val) {
      this.searchType = this.value
      this.getTopicScoreList()
    },
    // 多选框改变
    change (val) {
      if (val.length === 0) {
        this.canAssignCategory = true
        return
      }
      if (val.filter(item => item.userType !== 1).length > 0) {
        this.canAssignCategory = true
      } else {
        this.canAssignCategory = false
        this.selectedData = val.map(n => n.id).join(',')
      }
    },
    // 指定课题类别按钮
    assignCategory () {
      this.dialogVisible = true
      this.radioValue = ''
      this.getClassificationList()
    },
    // 课题类别确定
    submitTopicClassification () {
      if (!this.radioValue) {
        notice(this, '请指定课题分类', 2000)
        return
      }
      server.post(`/backDeclareCheckController/submitTopicClassification`, {
        topicIds: this.selectedData,
        classificationId: this.radioValue
      })
      .then(res => {
        if (res.data.code === 1) {
          this.dialogVisible = false
          this.getTopicScoreList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 提交
    submit () {
      server.post('/backDeclareCheckController/submitTopicCheck')
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 1000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 评分
    score (val) {
      this.getTopicScoreDetail(val)
      this.scoreDialogVisible = true
      // this.$router.push({ path: '/subjectReview/backProjectApprovalScore', query: {id: val} })
    },
    // 获取详情
    getTopicScoreDetail (val) {
      server.get(`/backDeclareCheckController/getTopicScoreDetail?topicId=${val}`)
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
              this.scoreDialogVisible = false
              this.getTopicScoreList()
            } else {
              notice(this, res.data.message, 2000)
            }
          })
        } else {
          return false
        }
      })
    },
    // 签署
    signed (val) {
      console.log(1)
      // let par = {
      //   id: val.id,
      //   name: val.name,
      //   companyName: val.companyName
      // }
      // this.$router.push({ path: '/subjectReview/backProjectApprovalSigned', query: { par: JSON.stringify(par) } })
      this.getTopicCheckScoreList(val.id)
      this.signedContent = ''
      this.detail = val
      this.signedDialogVisible = true
    },
    // 获取课题列表
    getTopicScoreList () {
      server.get(`/backDeclareCheckController/getTopicScoreList` +
                          `?pageNo=${this.pageNo}` +
                          `&pageSize=${this.pageSize}` +
                          `&searchType=${this.searchType === 5 ? '' : this.searchType}`)
      .then(res => {
        if (res.data.code === 1) {
          this.totalCount = res.data.result.totalCount
          this.tableData = res.data.result.list
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取课题分类列表
    getClassificationList () {
      server.get('/backDeclareCheckController/getClassificationList')
      .then(res => {
        if (res.data.code === 1) {
          this.subjectTypeList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取评审结束时间
    getCheckEndTime () {
      server.get('/backDeclareCheckController/getCheckEndTime')
      .then(res => {
        if (res.data.code === 1) {
          this.endTime = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getTopicScoreList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getTopicScoreList()
    }
  },
  computed: {
    ...mapGetters([
      'userType',
      'user',
      'staticUrl',
      'previewUrl'
    ])
  },
  created () {
    this.getCheckEndTime()
    this.getTopicScoreList()
    setTimeout(() => {
      this.projectApprovalUser = this.user
    }, 400)
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.project-approval{
  padding-bottom: $width;
  .nav-name {
    line-height: 60px;
    font-size: 16px;
    img {
      vertical-align: middle;
      margin-right: 10px;
    }
  }

  header{
    line-height: 56px;
    font-size: 16px;
    padding-left: $width;
    background: #F8F9FC;
    &:before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #5295EB;
    }
    i {
      color: red;
      margin: 0 10px;
    }
    p {
      display: inline-block;
      color: #A7A7A7;
    }
  }

  main{
    background: #fff;
    padding: $width $width*2;

    .el-button {
      background: #A1ADCC;
      border-color: #A1ADCC; 
      padding: 6px 10px;

      &:nth-child(1):hover {
        background: #FFB035;
        border-color: #FFB035; 
      }

      &:nth-child(2):hover {
        background: #5295EB;
        border-color: #5295EB; 
      }
    }
  }

  &>p{
    margin-top: $width;
    // 分页
    .el-pagination{
      float: right;
      text-align: right;
    }
  } 

  .el-dialog{
    .el-dialog__body{
      text-align: center;
      .el-radio{
        margin-top: $width;
        margin-bottom: $width;
        font-size: 18px;

        .el-radio__inner {
          border-radius: 0;
        }
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
  }

  // 签署弹出框
  .signed-dialog {
    .el-dialog {
      .el-dialog__header {
        border-bottom: 1px solid #ddd;
        p>i {
          font-style: normal;
          font-size: 16px;
        }
      }

      .el-dialog__body {
        text-align: left;
        padding-top: 15px;
        height: 623px;
        overflow-x: hidden;
        &>div {
          &>p {
            span {
              font-weight: bold;
            }
          }
        }

        .signed-advice{
          .el-radio-group{
            margin-left: $width;
          }
          .el-textarea{
            .el-textarea__inner{
              width: 550px;
            }
          }

          .el-radio__inner {
            border-radius: 50%;
          }
        }

        footer {
          margin-top: 15px;
          text-align: center;
        }
      }
    }
  }

  // 评分弹出框
  .score-dialog {
    .el-dialog {
      .el-dialog__header {
        border-bottom: 1px solid #ddd;
        p>span {
          float: right;
        }
        p>i {
          font-style: normal;
          font-size: 16px;
        }
      }

      .el-dialog__body {
        text-align: left;
        padding-top: 15px;
        height: 623px;
        overflow-x: hidden;
        // 评分部分
        .score-scoring{
          .el-form-item{
            display: inline-block;
            .el-form-item__content{
              margin-left: 0 !important;
            }
          }
          .el-input {
            width: 877px;
          }
        }

        &>div:nth-child(1) {
          margin-bottom: 15px;
          p {
            span {
              margin-right: 50px;
              color: #333333;
            }
          }
        }

        // 评价部分
        .score-appraise{
          p{
            display: inline-block;
            margin-bottom: $width/2;
            vertical-align: top;
          }
          .el-textarea {
            width: 877px;
          }
        }

        footer{
          padding-top: 20px;
          text-align: center;
        }

      }
    }
  }

  ul {
    position: absolute;
    left: -160px;
    top: 0;
    li {
      height: 142px;
      position: relative;
    }
    li span {
      display: inline-block;
      width: 100px;
      height: 50px;
      position: absolute;
      top: 44px;
      left: 0px;
      background: url(../../../assets/images/gray-bg.png) no-repeat 14px 8px;
      color: #9C9C9C;
      padding: 10px 18px;
    }
    li i {
      content: '';
      display: inline-block;
      width: 40px;
      height: 142px;
      position: absolute;
      top: 0px;
      left: 100px;
      background: url(../../../assets/images/gray-point.png) no-repeat 15px -20px;
    }
    li:nth-child(1) span {
      top: 40px;
      height: 60px;
      color: #fff;
      background: url(../../../assets/images/blue-bg.png) no-repeat 0px 8px;
    }
    li:nth-child(1) i {
      background: url(../../../assets/images/blue-point.png) no-repeat 15px -20px;
    }
  }

  // 弹出框关闭按钮
  .el-dialog__close {
    position: absolute;
    top: -60px;
    right: -60px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
    border: 2px solid #fff; 
    color: #fff;

    &:hover {
      background: #FF6C60;
      color: #fff;
    }
  }
}
</style>
