<template>
  <div id="evalution-result">
    <!--顶部导航-->
    <header>
      <p>备课检查&nbsp;&nbsp;
        <i v-if="bread.gradeName">> &nbsp;{{bread.gradeName}}&nbsp; </i>
        <i v-if="bread.courseName">> &nbsp;{{bread.courseName}}&nbsp; </i>
        > &nbsp;评价结果
        <span @click="goBack">
          返回上一层
        </span>
      </p>
    </header>

    <!--列表部分-->
    <main>
      <div>
        <el-row class="main-top">
          <el-col :span="6">
            教师姓名
          </el-col>
          <el-col :span="6">
            教案数量
          </el-col>
          <el-col :span="6">
            综合评价结果
          </el-col>
          <el-col :span="6">
            操作
          </el-col>
        </el-row>

        <el-row class="main-body" v-for="(item, index) in list" :key="index">
            
          <el-col :span="6">
            <span>
              {{item.createdUserName}}
            </span>
          </el-col>
          <el-col :span="6">
            {{item.planNum}}
          </el-col>
          <el-col :span="6">
            <span v-if="item.avgScore === null">--</span>
            <span v-else>{{item.avgScore.toFixed(1)}}</span>
          </el-col>
          <el-col :span="6">
            <span @click="getResultDetailList(item)">查看详情</span>
          </el-col>
        </el-row>
      </div>
      
    </main>

    <div class="footer-button">
      <el-button @click="exportDetail">
        导出详情
      </el-button>
      <el-button @click="goBack">
        关闭
      </el-button>
    </div>

    <!--详情弹出框-->
    <el-dialog
      title="查看详情"
      v-model="detailsDialogVisible"
      :show-close="false"
      class="details-dialog"
      size="tiny">
      <div>
        <el-row>
          <el-col :span="8">教师姓名</el-col>
          <el-col :span="8">教案名称</el-col>
          <el-col :span="8">我的分数</el-col>
        </el-row>
        
        <el-row class="details-list">
          <el-col :span="8" :style="{lineHeight: nameHeight}">{{name}}</el-col>
          <el-col :span="16">
            <el-row v-for="(item, index) in detailsList" :key="index">
              <el-col :span="12" class="plan-name">{{item.planName}}</el-col>
              <el-col :span="12">{{item.scoreSum === 0 ? '--' : item.scoreSum}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="total-mark">
          <el-col :span="8">
            综合评价结果
          </el-col>
          <el-col :span="16">
            <span v-if="number === 'NaN'">--</span>
            <span v-else>{{number}}</span>
          </el-col>
        </el-row>
      </div>
      <i @click="detailsDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailsDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { notice, error } from '../../../api/index.js'
export default {
  name: 'evalution-result',
  data () {
    return {
      detailsDialogVisible: false,
      list: [],
      number: '',
      userId: '',
      name: '',
      detailsList: [],
      nameHeight: '',
      totalScore: 0,
      bread: ''
    }
  },
  methods: {
    goBack () {
      this.$router.push('/check')
    },
    // 获取评价结果列表
    getResultList () {
      this.$https.get(`/check/checkResultList?startTime=${this.bread.startTime}&endTime=${this.bread.endTime}&courseId=${this.bread.courseId}&gradeId=${this.bread.gradeId}&semesterId=${this.bread.semesterId}&sectionId=${this.bread.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取详情
    getResultDetailList (val) {
      this.name = val.createdUserName
      this.detailsDialogVisible = true
      this.$https.get(`/check/checkResultDetailList?userId=${val.createdUserId}&startTime=${this.bread.startTime}&endTime=${this.bread.endTime}&courseId=${this.bread.courseId}&gradeId=${this.bread.gradeId}&semesterId=${this.bread.semesterId}&sectionId=${this.bread.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detailsList = res.data.result
          this.nameHeight = this.detailsList.length * 30 + 'px'
          // this.totalScore = 0
          // let num = 0
          // this.detailsList.forEach((item, index) => {
          //   this.totalScore += item.scoreSum
          //   if (item.scoreSum !== 0) {
          //     num++
          //   }
          // })
          this.number = val.avgScore.toFixed(1)
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 导出详情
    exportDetail () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/check/checkResultDetailExport?startTime=${this.bread.startTime}&endTime=${this.bread.endTime}&courseId=${this.bread.courseId}&gradeId=${this.bread.gradeId}&semesterId=${this.bread.semesterId}&sectionId=${this.bread.sectionId}`
    }
  },
  created () {
    this.bread = JSON.parse(this.$route.query.parameter)
    this.getResultList()
  }
}
</script>

<style lang="scss">
@import  '../../../assets/scss/main.scss';
#evalution-result{
  // 顶部导航
  header{
    height: 42px;
    background: #DDE6EF;
    box-sizing: border-box;
    padding:10px 20px;
    p{
      margin: 0;
      color: #78818E;
      
      i{
        font-style: normal;
      }
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

  // 主体部分
  main{
    padding:50px 70px 0;
    &>div{
      border: 1px solid #DAE0E7;
      border-radius: 5px;
    }
    .main-top{
      background: #DDE6EF;
      line-height: 40px;
      text-align: center;
      color: #636C7B;
    }
    .main-body{
      text-align: center;
      border-bottom: 1px dashed #ddd;
      padding: 10px 0;
      color: #636C7B;
      line-height: 26px;
      &:last-child{
        border: 0;
      }
      .el-col:last-child{
        span{
          display: inline-block;
          width: 60px;
          height: 26px;
          padding-left: 30px;
          cursor: pointer;
          margin-left: 20px;
          background: url(../../../assets/images/view.png) no-repeat;
          line-height: 26px;
          &:hover{
            background: url(../../../assets/images/view-active.png) no-repeat;
            color: #9FD35D;
          }
        }
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
    .el-button:first-child{
      border: 1px solid #408EE6;
      color: #408EE6;
      padding:8px 16px;
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
  // 详情弹出框
  .details-dialog{
    .el-dialog{
      width: 685px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      .el-dialog__header{
        text-align: center;
        padding:0;
        background: #3281F8;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        span{
          display: inline-block;
          width:100%;
          box-sizing: border-box;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          margin-top: 5px;
          padding: 20px;
          background: #fff;
          color: #408EE6;
          font-weight: normal;
        }
      }
      .el-dialog__body{
        border-top: 1px solid #ddd;
        text-align: center;
        padding: 46px 0;
        margin: 0 46px;
        &>div{
          border: 1px solid #B7C2D0;
          border-radius: 5px;
          &>.el-row:nth-child(1){
            line-height: 42px;
            background: #DDE6EF;
            border-bottom: 1px solid #B7C2D0;
            text-align: center;
            .el-col{
              border-right: 1px solid #B7C2D0;
              &:last-child{
                border: 0;
              }
            }
          }
          .el-col:last-child{
            border-right: 1px solid #B7C2D0;
          }
          .details-list{
            display: flex;
            .el-col{
              border-right: 1px solid #B7C2D0;
              border-bottom: 1px solid #B7C2D0;
              &:last-child{
                border-right: 0;
              }
            }
            .plan-name{
              height: 31px;
              overflow-x: hidden;
            }
            &>.el-col{
              .el-row{
                line-height: 30px;
                &:last-child{
                  .el-col{
                    border-bottom: 0;
                  }
                }
                .el-col:last-child{
                  color: #408EE6;
                }
              }
            }
          }
          .total-mark{
            line-height: 30px;
            .el-col{
              border-right: 1px solid #B7C2D0;
              &:last-child{
                border-right: 0;
                color: #408EE6;
              }
            }
          }
        }
        &>sup{
          position: absolute;
          top: 0;
          left: 20px;
          width: 35px;
          height: 5px;
          background: #9FD35D;
        }
        &>i{
          cursor: pointer;
          width: 22px;
          height: 22px;
          position: absolute;
          background: url(../../../assets/images/dialog-close.png) no-repeat;
          top: 15px;
          right: 10px;
          &:hover{
            background: url(../../../assets/images/dialog-close-hover.png) no-repeat;
          }
        }
      }
      .el-dialog__footer{
        .el-button{
          padding: 8px 28px;
        }
        .el-button:nth-child(1){
          border: 1px solid #408EE6;
          color: #408EE6;
          margin-right: 250px;
          &:hover{
            background: #408EE6;
            color: $white;
          }
        }
      }
    }
  }
}

</style>
