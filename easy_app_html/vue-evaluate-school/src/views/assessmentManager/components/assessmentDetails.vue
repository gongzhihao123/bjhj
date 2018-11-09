<template>
  <div id="assessment-details">
    <header>
      <span>测评详情</span>
      <div>
        <!-- <el-button size="large" @click="dialogVisible = true">导出</el-button> -->
        <el-button size="large" @click="close">关闭</el-button>
      </div>
    </header>

    <main>
      <!-- 班主任-任课老师测评 -->
      <el-row class="list-title" v-if="evalType === '1' || evalType === '2'">
        <el-col :span="3">
          序号
        </el-col>
        <el-col :span="4">
          测评人
        </el-col>
        <el-col :span="4">
          年级
        </el-col>
        <el-col :span="4">
          班级
        </el-col>
        <el-col :span="3">
          总分
        </el-col>
        <el-col :span="9"></el-col>
      </el-row>

      <!-- 列表主体 -->
      <div class="list" v-if="evalType === '1' || evalType === '2'">
        <el-row v-for="(item, index) in list" :key="index">
          <el-col :span="3">
            {{ index + 1 }}
          </el-col>
          <el-col :span="4">
            {{ item.userName }}
          </el-col>
          <el-col :span="4">
           {{ item.gradeName }}
          </el-col>
          <el-col :span="4" style="color: #3EA9FD;cursor: pointer;" @click.native="lookSujective(item)">
            {{ item.className }}
          </el-col>
          <el-col :span="3">
            <span v-if="item.totalScore === 0">--</span>
            <span v-else>{{ item.totalScore }}</span>
          </el-col>
        </el-row>

        <!-- 题目内容 -->
        <transition name="slide-left" mode="out-in">
          <div class="content" v-if="contentBoxShow">
          <span @click="contentBoxShow = false">x</span>
          <p><span>被测评人：</span>{{ name }}</p>
          <el-row class="content-list-header">
            <el-col :span="12">题目</el-col>
            <el-col :span="12">分数</el-col>
          </el-row>
          <el-row class="content-list-body" v-for="(item, index) in contentList" :key="index">
            <el-col :span="12">{{ item.number }}</el-col>
            <el-col :span="12">
              <span v-if="item.score === 0">--</span>
              <span v-else>{{ item.score }}</span>
            </el-col>
          </el-row>
        </div>
        </transition>
      </div>

      <!-- 其他测评 -->
      <el-row class="list-title" v-if="evalType === '3'">
        <el-col :span="2">
          序号
        </el-col>
        <el-col :span="5">
          测评人
        </el-col>
        <el-col :span="5">
          部门/分组
        </el-col>
        <el-col :span="4">
          测评方式
        </el-col>
        <el-col :span="4">
          权重
        </el-col>
        <el-col :span="4">
          分数
        </el-col>
      </el-row>

      <!-- 列表主体 -->
      <div class="list" v-if="evalType === '3'">
        <el-row v-for="(item, index) in list" :key="index">
          <el-col :span="2">
            {{ index + 1 }}
          </el-col>
          <el-col :span="5">
            {{ item.userName }}
          </el-col>
          <el-col :span="5">
            <span v-if="item.deptName">
              {{ item.deptName }}
            </span>
            <span v-else>
              --
            </span>
          </el-col>
          <el-col :span="4">
            {{ item.modeName }}
          </el-col>
          <el-col :span="4">
            {{ item.weight }}
          </el-col>
          <el-col :span="4">
            {{ item.score }}
          </el-col>
        </el-row>
      </div>
      
      <!--分页-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </main>

    <!-- <el-dialog
      title="选择导出内容"
      v-model="dialogVisible"
      size="tiny">
      <el-row>
        <el-col :span="6" v-for="(item, index) in exportList" :key="index">
          <el-checkbox>{{item.name}}</el-checkbox>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'
export default {
  name: 'assessmentDetails',
  data () {
    return {
      contentBoxShow: false,
      dialogVisible: false,
      list: [],
      contentList: [],
      exportList: [
        {name: '总表'},
        {name: '按学科导出'},
        {name: '按年级导出'},
        {name: '按班级导出'}
      ],
      parameter: '',
      evalType: '',
      objectiveList: [],
      name: '',
      totalCount: 0,
      pageSize: 20,
      pageNo: 1
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.pageNo = val
      if (this.parameter.evalType === '3') {
        this.getOtherObjectDetail()
      } else {
        this.getTeacherStudentDetail()
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      if (this.parameter.evalType === '3') {
        this.getOtherObjectDetail()
      } else {
        this.getTeacherStudentDetail()
      }
    },
    lookSujective (item) {
      let list = []
      item.questions.forEach((child, index) => {
        this.objectiveList.forEach((n) => {
          if (child.questionId === n.id) {
            child.number = n.number
            list.push(child)
          }
        })
      })
      this.contentList = list
      this.name = item.userName
      this.contentBoxShow = true
    },
    // 关闭
    close () {
      this.$router.push('/assessmentManager/lookResult')
    },
    // 任课教师、班主任-实名查看测评详细
    getTeacherStudentDetail () {
      this.$https.get(`/eval/getTeacherStudentDetail?evalId=${this.parameter.evalId}&userId=${this.parameter.userId}&gradeId=${this.parameter.gradeId}&subjectId=${this.parameter.subjectId}&pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result.users.list
          this.totalCount = res.data.result.users.totalCount
          this.objectiveList = res.data.result.questions
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 其他测评-实名查看测评详细
    getOtherObjectDetail () {
      this.$https.get(`/eval/getOtherObjectDetail?evalId=${this.parameter.evalId}&userId=${this.parameter.userId}&pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result.list
          this.totalCount = res.data.result.totalCount
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.parameter = JSON.parse(this.$route.query.parameter)
    this.evalType = this.parameter.evalType
    if (this.parameter.evalType === '3') {
      this.getOtherObjectDetail()
    } else {
      this.getTeacherStudentDetail()
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#assessment-details{
  margin: $width;
  background: $white;
  border: 1px solid #ECECEC;
  border-radius: 4px;

  header{
    padding: $width / 2;
    height: 62px;
    box-sizing: border-box;
    border-bottom: 2px solid #DDDDDD;

    &>span{
      display: inline-block;
      width: 116px;
      height: 41px;
      font-size: 16px;
      line-height: 42px;
      text-align: center;

      &:first-child{
        color: #fff;
        background: url(../../../assets/images/left-tab-blue.png);
      }
    }

    div{
      float: right;
    }
  }

  // 主体
  main{
    padding: $width*1.5 $width;

    // 列表头部
    .list-title{
      text-align: center;
      // margin-top: $width;
      border-bottom: 1px solid #E6E6E6;
      padding: $width/2 0;
      font-size: 15px;
    }

    // 列表主体
    .list{
      position: relative;

      .el-row{
        line-height: 48px;
        border-bottom: 1px solid #E6E6E6;
        font-size: 15px;
        text-align: center;

        &:hover{
          background: #F7F7F7;
        }
      }

      .content{
        box-sizing: border-box;
        margin-bottom: $width;
        position: absolute;
        z-index: 101;
        width: 340px;
        right: 0px;
        top: -$width * 3;
        box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
        border: 1px solid #E2E2E2;
        padding: $width/2 $width;

        &>span{
          float: right;
          font-size: 26px;
          color: #B2B2B2;
          cursor: pointer;
        }

        &>p{
          margin-top: $width*1.5;
          font-size: 15px;
          text-align: center;

          span{
            color: #999999;
          }
        }

        .content-list-header{
          margin-top: $width;
        }

        .content-list-body:hover{
          background: #F7F7F7;
        }

        .content-list-footer{

          .el-col:last-child{
            color: #0199FE;
            cursor: pointer;
          }
        }
      }
    }
  }

  // 导出弹出框
  .el-dialog{
    width: 620px;

    .el-dialog__header{
      padding: $width;

      span{
        font-weight: normal;
      }
    }
    
    .el-dialog__body{
      padding: $width*4 $width*3;
    }
  }

  // 分页
  .page {
    text-align: right;
    margin-top: $width;
    margin-bottom: $width;

    .el-pagination {
      margin-right: 20px;
    }
  }
}
</style>
