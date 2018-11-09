<template>
  <div class="my-subject-signed">
    <header>
      阶段报告签署
    </header>

    <main>
      <p class="signed-name">
        <el-button size="small" @click="$router.push('/subjectReview/backMySubject')">返回</el-button>
        <span>课题名称：</span>
        <i>{{ detail.topicName }}</i> 
      </p>

      <p class="signed-company">
        <span>单位：</span>
        <i>{{ detail.companyName }}</i> 
      </p>

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

      <div class="signed-detail" style="margin-top: 20px;">
        <span>
          评审详细信息：
        </span>

        <el-table
          :data="tableData"
          border
          stripe>
          <el-table-column
            prop="userName"
            label="评审人"
            align='center'
             width="200"
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            label="评审意见"
            align='center'
             width="200"
            show-overflow-tooltip
            label-class-name="head">
            <template slot-scope="scope">
              {{ scope.row.score ? scope.row.score >= 60 ? '通过' : '不通过' : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="评分"
            align='center'
             width="200"
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
      </div>

      <div class="signed-synthesise">
        <span>
          评审综合信息：
        </span>

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

      <div class="signed-advice" v-if="detail.phasesSort !== 4">
        <!-- 阶段报告 -->
        <span>
          评审组长意见：
        </span>
        <el-radio-group v-model="radioValue">
          <el-radio :label="1">同意</el-radio>
          <el-radio :label="2">不同意</el-radio>
          <el-radio :label="3">建议修改</el-radio>
        </el-radio-group>
      </div>
      
      <div class="signed-advice" v-if="detail.phasesSort === 4">
        <!-- 结题申请 -->
        <span>
          结题申请是否通过：
        </span>
        <el-radio-group v-model="radioValue">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
          <el-radio :label="3">建议修改</el-radio>
        </el-radio-group>
      </div>

      <el-form :model="contentData" :rules="rules" ref="contentData" label-width="100px" class="demo-ruleForm signed-time">
        <el-row v-if="radioValue === 3">
          <span>再次提交期限：</span>
          <el-form-item
            prop="dateValue"
          >
            <el-date-picker
              v-model="contentData.dateValue"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-row>
        
      </el-form>
      
      <div class="signed-advice">
        <!-- 结题申请 -->
        <span>
          详情：
        </span>
        <el-input v-model="comment" type="textarea" :maxlength="30" :rows="3"></el-input>
      </div>

      <footer>
        <el-button type="primary" size="small" @click="submitForm('contentData')">提交</el-button>
        <el-button size="small" @click="$router.push('/subjectReview/backMySubject')">返回</el-button>
      </footer>
    </main>

  </div>
</template>

<script>
import server from '../../../utils/axios'
import { notice } from '../../../api/index'
import { mapActions } from 'vuex'
import { dateFormat } from '../../../filters/index.js'
export default {
  name: 'my-subject-signed',
  data () {
    return {
      rules: {
        dateValue: [
          { required: true, message: '再次提交期限不能为空' }
        ]
      },
      pageSize: 10,
      pageNo: 1,
      totalCount: 0,
      show: [true, false, false, false],
      reportData: [],
      datumData: [],
      logData: [],
      activityData: [],
      radioValue: 1,
      detail: {},
      comment: '',
      tableData: [],
      totalData: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      contentData: {
        dateValue: ''
      }
    }
  },
  methods: {
    ...mapActions([
      'remind'
    ]),
    // 获取阶段报告
    getPhasesReport () {
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
          this.getPhasesReport()
          this.detail = res.data.result
          this.contentData.score = this.detail.checkScore
          this.comment = this.detail.checkOpinion
          this.tableData = res.data.result.checkUsers
          let averageScore = 0
          let realityCount = 0
          this.tableData.forEach((item, index) => {
            if (item.score) {
              averageScore += item.score
              realityCount += 1
            }
          })
          this.totalData = [
            { allCount: this.tableData.length, realityCount: realityCount, agreement: this.tableData.filter(item => item.score >= 60).length, disagreement: this.tableData.filter(item => item.score && item.score < 60).length, averageScore: (averageScore / (realityCount === 0 ? 1 : realityCount)).toFixed(0) }
          ]
          if (!res.data.result.checkScore) {
            this.$refs['contentData'].resetFields()
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 审核签署意见
    savePhasesSign () {
      server.post(`/backPhaseCheckController/savePhasesSign?`, {
        checkId: this.detail.checkId,
        topicId: this.$route.query.id,
        checkState: this.radioValue,
        opinion: this.comment,
        phasesId: this.detail.phasesId,
        submitTime: this.contentData.dateValue ? dateFormat(this.contentData.dateValue + 86399000, 'yyyy-MM-dd HH:mm:ss') : ''
      })
      .then(res => {
        if (res.data.code === 1) {
          this.remind('1')
          this.$router.push('/subjectReview/backMySubject')
        }
      })
    },
    submitForm (formName) {
      if (this.radioValue !== 3) {
        this.rules.dateValue[0].required = false
      } else {
        this.rules.dateValue[0].required = true
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.savePhasesSign()
        } else {
          return false
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
  created () {
    this.getTopicScoreDetail()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.my-subject-signed{
  padding-bottom: $width;
  header{
    line-height: 56px;
    font-size: 18px;
  }

  main{
    background: #fff;
    padding: $width;

    .signed-name,.signed-company{
      margin-bottom: $width;
      .el-button{
        float: right;
      }
      &>span{
        display: inline-block;
        width: 150px;
        text-align: right;
      }
      i{
        font-style: normal;
        margin-left: $width;
        font-weight: bold;
      }
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

    .signed-detail,.signed-synthesise,.signed-advice{
      margin-bottom: $width;
      &>span{
        display: inline-block;
        width: 150px;
        text-align: right;
      }
    }

    .signed-advice{
      .el-radio-group{
        margin-left: $width;
      }
      .el-textarea{
        width: 700px;
        margin-left: $width;
        .el-textarea__inner{
          // width: 900px;
        }
      }
    }

    .signed-time{
      .el-row{
        &>span{
          display: inline-block;
          width: 150px;
          text-align: right;
        }
        .el-form-item{
          display: inline-block;
          .el-form-item__content{
            margin-left: $width !important;
          }
        }
      }
    }

    footer{
      margin-top: $width;
    }
  }

}
</style>
