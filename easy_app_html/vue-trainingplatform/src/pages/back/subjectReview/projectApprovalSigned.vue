<template>
  <div class="project-approval-signed">
    <header>
      课题立项签署
    </header>

    <main>
      <p class="signed-name">
        <el-button size="small" @click="$router.push('/subjectReview/backProjectApproval')">返回</el-button>
        <span>课题名称：</span>
        <i>{{ detail.name }}</i> 
      </p>

      <p class="signed-company">
        <span>单位：</span>
        <i>{{ detail.companyName }}</i> 
      </p>

      <div class="signed-detail">
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
              {{ scope.row.score ? scope.row.score >= 60 ? '通过' : '不通过' : null }}
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

      <div class="signed-advice">
        <span>
          评审组长意见：
        </span>
        <el-radio-group v-model="radioValue">
          <el-radio :label="1">同意立项</el-radio>
          <el-radio :label="2">不予立项</el-radio>
        </el-radio-group>
        <el-input type="textarea" :maxlength="30" v-model="content" placeholder="请填写" :rows="3"></el-input>
      </div>

      <footer>
        <el-button type="primary" size="small" @click="submitForm">提交</el-button>
        <el-button size="small" @click="$router.push('/subjectReview/backProjectApproval')">返回</el-button>
      </footer>
    </main>

  </div>
</template>

<script>
import server from '../../../utils/axios'
import { success, notice } from '../../../api/index'
export default {
  name: 'project-approval-signed',
  data () {
    return {
      radioValue: 1,
      content: '',
      detail: {},
      tableData: [],
      totalData: []
    }
  },
  methods: {
    submitForm () {
      server.post('/backDeclareCheckController/saveTopicSign', {
        checkId: this.tableData.filter(item => item.userType === 1)[0].id,
        topicId: this.detail.id,
        checkState: this.radioValue,
        opinion: this.content
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '提交成功', 1000)
          this.$router.push('/subjectReview/backProjectApproval')
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取详情
    getTopicCheckScoreList () {
      server.get(`/backDeclareCheckController/getTopicCheckScoreList?topicId=${this.detail.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result
          let averageScore = 0
          let realityCount = 0
          res.data.result.forEach((item, index) => {
            if (item.score) {
              averageScore += item.score
              realityCount += 1
            }
          })
          this.totalData = [
            { allCount: this.tableData.length, realityCount: realityCount, agreement: res.data.result.filter(item => item.score >= 60).length, disagreement: res.data.result.filter(item => item.score && item.score < 60).length, averageScore: (averageScore / (realityCount === 0 ? 1 : realityCount)).toFixed(0) }
          ]
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.detail = JSON.parse(this.$route.query.par)
    this.getTopicCheckScoreList()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.project-approval-signed{
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
        width: 130px;
        text-align: right;
      }
      i{
        font-style: normal;
        margin-left: $width;
        font-weight: bold;
      }
    }

    .signed-detail,.signed-synthesise,.signed-advice{
      margin-bottom: $width;
      &>span{
        display: inline-block;
        width: 130px;
        text-align: right;
      }
    }

    .signed-advice{
      .el-radio-group{
        margin-left: $width;
      }
      .el-textarea{
        margin-top: $width;
        .el-textarea__inner{
          width: 900px;
        }
      }
    }

    footer{
      margin-top: $width;
    }
  }

}
</style>
