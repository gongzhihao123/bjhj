<template>
  <div class="my-subject-score">
    <header>
      阶段报告评分
    </header>

    <main>
      <div class="score-left">
        <p>当前阶段</p>

        <el-steps :active="Number(this.detail.phasesSort) - 1">
          <el-step v-for="(item, index) in navList" :key="index" :title="item.name" :description="item.time.substring(0, 10)"></el-step>
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
        </div>

        <div>
          <iframe :src="url" class="score-content" width="900" height="900"></iframe>
        </div>

        <div class="data-list">
          <el-button-group>
            <el-button @click="getPhasesReport">阶段报告</el-button>
            <el-button @click="getDatumList">课题资料</el-button>
            <el-button @click="getLogList">研究日志</el-button>
            <el-button @click="getActivityList">研究活动</el-button>
          </el-button-group>

          <!-- 阶段报告列表 -->
          <el-table
            v-if="show[0]"
            :data="reportData"
            border
            stripe>
            <el-table-column
              prop="reportName"
              label="报告名称"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="phasesName"
              label="报告类型"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="createdTime"
              label="上传时间"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="state"
              label="审核状态"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
          </el-table>

          <!-- 课题资料列表 -->
          <el-table
            v-if="show[1]"
            :data="datumData"
            border 
            stripe>
            <el-table-column
              prop="name"
              label="资料名称"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="createdUserName"
              label="上传人"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="所属单位"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="datumType"
              label="资料类型"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="createdTime"
              label="上传时间"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
          </el-table>

          <!-- 日志资料列表 -->
          <el-table
            v-if="show[2]"
            :data="logData"
            border
            stripe>
            <el-table-column
              prop="name"
              label="日志名称"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="createdUserName"
              label="编写人"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="所属单位"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="createdTime"
              label="上传时间"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
              <!-- <template slot-scope="scope">
                {{ scope.row.createdTime | dateFormat('yyyy-MM-dd') }}
              </template> -->
            </el-table-column>
          </el-table>

          <!-- 活动列表 -->
          <el-table
            v-if="show[3]"
            :data="activityData"
            border
            stripe>
            <el-table-column
              prop="name"
              label="活动名称"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="responsibleUser"
              label="活动发起人"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="开始时间"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
              <!-- <template slot-scope="scope">
                {{ scope.row.startTime | dateFormat('yyyy-MM-dd') }}
              </template> -->
            </el-table-column>
            <el-table-column
              prop="stopTime"
              label="结束时间"
              align='center'
              show-overflow-tooltip
              label-class-name="head">
              <!-- <template slot-scope="scope">
                {{ scope.row.stopTime | dateFormat('yyyy-MM-dd') }}
              </template> -->
            </el-table-column>
          </el-table>

          <el-pagination
            v-if="totalCount !== 0 && show[0] === false"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
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
          <el-input v-model="comment" type="textarea" :maxlength="30" :rows="3" placeholder="请输入评价内容"></el-input>
        </div>

        <footer>
          <el-button type="primary" size="small" @click="submitForm('contentData')">提交</el-button>
          <el-button size="small" @click="$router.push('/subjectReview/backMySubject')">返回</el-button>
        </footer>
      </div>
      <div class="score-right">
        <el-button size="small" @click="$router.push('/subjectReview/backMySubject')"> 返回 </el-button>
      </div>
    </main>

  </div>
</template>

<script>
import server from '../../../utils/axios'
import { notice } from '../../../api/index'
import { mapActions, mapGetters } from 'vuex'
import { dateFormat } from '../../../filters/index.js'
export default {
  name: 'my-subject-score',
  data () {
    return {
      pageSize: 10,
      pageNo: 1,
      totalCount: 0,
      url: '',
      comment: '',
      detail: {},
      expertsList: [],
      userList: [],
      contentData: {
        score: ''
      },
      show: [true, false, false, false],
      reportData: [],
      datumData: [],
      logData: [],
      activityData: [],
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
    ...mapActions([
      'remind'
    ]),
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.savePhasesCheckScore()
        } else {
          return false
        }
      })
    },
    // 获取阶段报告
    getPhasesReport () {
      if (this.show[0] === false) {
        this.pageSize = 10
        this.pageNo = 1
      }
      this.show = [true, false, false, false]
      server.get(`/backPhaseCheckController/getPhasesReport?topicId=${this.$route.query.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.reportData = res.data.result
          this.reportData.forEach((item) => {
            item.createdTime = dateFormat(item.createdTime, 'yyyy-MM-dd')
            if (item.checkState === 0) item.state = '未审核'
            if (item.checkState === 1) item.state = '通过'
            if (item.checkState === 2) item.state = '不通过'
            if (item.checkState === 3) item.state = '建议修改'
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取阶段课题资料
    getDatumList () {
      if (this.show[1] === false) {
        this.pageSize = 10
        this.pageNo = 1
      }
      this.show = [false, true, false, false]
      server.get(`/backPhaseCheckController/getDatumList?topicId=${this.$route.query.id}&pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.datumData = res.data.result.list
          this.totalCount = res.data.result.totalCount
          this.datumData.forEach((item) => {
            item.createdTime = dateFormat(item.createdTime, 'yyyy-MM-dd')
            if (item.datumType === 1) item.datumType = '开题资料'
            if (item.datumType === 2) item.datumType = '中期资料'
            if (item.datumType === 3) item.datumType = '结题资料'
            if (item.datumType === 4) item.datumType = '研究成果'
            if (item.datumType === 5) item.datumType = '其他'
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取阶段日志资料
    getLogList () {
      if (this.show[2] === false) {
        this.pageSize = 10
        this.pageNo = 1
      }
      this.show = [false, false, true, false]
      server.get(`/backPhaseCheckController/getLogList?topicId=${this.$route.query.id}&pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.logData = res.data.result.list
          this.logData.forEach((item) => {
            item.createdTime = dateFormat(item.createdTime, 'yyyy-MM-dd')
          })
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取阶段活动资料
    getActivityList () {
      if (this.show[3] === false) {
        this.pageSize = 10
        this.pageNo = 1
      }
      this.show = [false, false, false, true]
      server.get(`/backPhaseCheckController/getActivityList?topicId=${this.$route.query.id}&pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.activityData = res.data.result.list
          this.activityData.forEach((item) => {
            item.startTime = dateFormat(item.startTime, 'yyyy-MM-dd')
            item.stopTime = dateFormat(item.stopTime, 'yyyy-MM-dd')
          })
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取详情
    getTopicScoreDetail () {
      server.get(`/backPhaseCheckController/getTopicScoreDetail?topicId=${this.$route.query.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detail = res.data.result
          this.expertsList = this.detail.checkUsers.filter(item => item.userType === 3)
          this.userList = this.detail.checkUsers.filter(item => item.userType !== 3)
          this.navList[Number(this.detail.phasesSort) - 1].time = this.detail.phasesTime
          this.contentData.score = this.detail.checkScore
          this.comment = this.detail.checkComment
          this.getPhasesReport()
          if (!res.data.result.checkScore) {
            this.$refs['contentData'].resetFields()
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存评分信息
    savePhasesCheckScore () {
      if (this.contentData.score > 100 || this.contentData.score < 0) {
        notice(this, '评分应在0-100之间', 2000)
        return
      }
      server.post(`/backPhaseCheckController/savePhasesCheckScore`, {
        checkId: this.detail.checkId,
        score: Math.round(this.contentData.score),
        comment: this.comment
      })
      .then(res => {
        if (res.data.code === 1) {
          this.remind('1')
          this.$router.push('/subjectReview/backMySubject')
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      let num = 0
      this.show.forEach((item, index) => {
        if (item === true) {
          num = index
        }
      })
      if (num === 0) this.getPhasesReport()
      if (num === 1) this.getDatumList()
      if (num === 2) this.getLogList()
      if (num === 3) this.getActivityList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      let num = 0
      this.show.forEach((item, index) => {
        if (item === true) {
          num = index
        }
      })
      if (num === 0) this.getPhasesReport()
      if (num === 1) this.getDatumList()
      if (num === 2) this.getLogList()
      if (num === 3) this.getActivityList()
    }
  },
  watch: {
    show () {
      // this.pageSize = 10
      // this.pageNo = 1
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
    setTimeout(() => {
      server.get(`/backPhaseCheckController/getPhasesReport?topicId=${this.$route.query.id}`)
      .then(res => {
        if (res.data.code === 1) {
          server.get(`/backPhaseCheckController/getPreviewPath?fileId=${res.data.result.filter(item => item.phasesId === this.detail.phasesId)[0].fileId}`)
          .then(res => {
            this.url = `${this.previewUrl}${this.staticUrl}?filepath=${res.data.result.filePath}`
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }, 600)
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.my-subject-score{
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
        min-height: 105px;
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

      // 列表
      .data-list{
        margin-top: $width;
        text-align: center;

        // 分页
        .el-pagination{
          text-align: right;
          margin-top: $width
        }
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
