<template>
  <div id="look-result">
    <header>
      <span>查看结果</span>
      <el-input v-model="keyword" @keyup.enter.native="search" :on-icon-click="search" placeholder="输入关键字查询" icon="search"></el-input>
      <div class="button-group">
        <el-button size="large" @click="daochu">导出</el-button>
        <el-button size="large" @click="close">关闭</el-button>
      </div>
    </header>

    <!-- 列表 -->
    <div class="other-main">
      <div class="list-title" :style="{width: (assessmentWayList.length) * 160 + 1206 + 'px'}">
        <span>
          序号
        </span>
        <span>
          被测评人
        </span>
        <span>
          单位
        </span>
        <span>
          部门/分组
        </span>
        <span>
          总分
        </span>
        <span>
          名次
        </span>
        <span v-for="(item, index) in assessmentWayList" :key="index">
          <el-popover
            placement="top"
            width="200"
            v-if="item.modeName.length > 4" 
            trigger="hover"
            :content="item.modeName">
            <i slot="reference" style="font-style: normal;">
              {{item.modeName.slice(0, 4) + '...'}}
            </i>
          </el-popover>
          <i style="font-style: normal;" v-if="item.modeName.length <= 4">
            {{item.modeName}}
          </i>
        </span>
        <span>
          主观题
        </span>
      </div>

      <div class="list" :style="{width: (assessmentWayList.length) * 160 + 1206+ 'px'}">
        <div v-for="(item, index) in list" :key="index">
          <span>
            {{index + 1}}
          </span>
          <span  @click="toAssessmentDetails(item)" :class="{realState: realState === '1'}">
            {{item.userName}}
          </span>
          <span>
            {{item.companyName}}
          </span>
          <span>
            {{item.deptName}}
          </span>
          <span>
            <span v-if="item.state">{{ String(item.totalScore).indexOf('.') !== -1 ? parseFloat(item.totalScore).toFixed(2) : parseFloat(item.totalScore) }}</span>
            <span v-else>--</span>
          </span>
          <span :span="3">
            {{item.sort}}
          </span>
          <span v-for="(child, i) in assessmentWayList" :key="i">
            <span>{{item.scoreList.filter(sco => sco.modeId === child.id)[0] ? item.scoreList.filter(sco => sco.modeId === child.id)[0].score : '--'}}</span>
            <!-- <span>{{child.state === 1 ? child.score : '--'}}</span> -->
          </span>
          <span>
            <a @click="otherDetails(item)">详细</a>
          </span>
        </div>
      </div>
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
  </div>
</template>

<script>
// import querystring from 'querystring'
import { mapGetters } from 'vuex'
export default {
  name: 'lookResult',
  data () {
    return {
      evalId: '',
      contentBoxShow: false,
      gradeActive: 0,
      subjectActive: 0,
      gradeList: [],
      subjectList: [],
      excelTypes: '',
      evalType: '',
      list: [],
      keyword: '',
      title: '',
      realState: '',
      name: '',
      assessmentWayList: [],
      pageSize: 20,
      totalCount: 0,
      pageNo: 1
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.pageNo = val
      this.getOtherResultList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getOtherResultList()
    },
    // 导出
    daochu () {
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/eval/excelOther?evalId=${this.evalId}&keyword=${this.keyword}`
    },
    // 其他测评详细
    otherDetails (item) {
      let parameter = {}
      parameter = {
        evalId: this.evalId,
        userId: item.userId,
        evalType: this.evalType,
        name: item.userName
      }
      sessionStorage.subjectiveParameter = JSON.stringify(parameter)
      window.open(`#/assessmentManager/subjectActive`)
    },
    search () {
      this.getOtherResultList()
    },
    // 跳转到测评详情
    toAssessmentDetails (item) {
      if (this.realState === '1') {
        let parameter = {}
        parameter = {
          evalId: this.evalId,
          userId: item.userId,
          evalType: this.evalType
        }
        this.$router.push({path: '/assessmentManager/assessmentDetails', query: {parameter: JSON.stringify(parameter)}})
      }
    },
    // 关闭
    close () {
      this.$router.push('/assessmentManager/index')
    },
    // 其他测评-查询测评结果列表
    getOtherResultList () {
      this.$https.get(`/eval/getOtherResultList?evalId=${this.evalId}&keyword=${this.keyword}&pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result.list[0].userScoreList
          this.totalCount = res.data.result.totalCount
          // this.list.forEach((item) => {
          //   item.list = [...res.data.result.list[0].modeList]
          //   item.list.forEach((child, i) => {
          //     item.modes.forEach((n, index) => {
          //       if (child.modeName === n.modeName) {
          //         item.list[i] = n
          //       }
          //     })
          //   })
          // })
          this.assessmentWayList = res.data.result.list[0].modeList
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'people'
    ])
  },
  created () {
    if (this.people.id) {
      sessionStorage.title = this.people.name
      sessionStorage.evalId = this.people.id
      sessionStorage.evalType = this.people.evalType
      sessionStorage.realState = this.people.realState
    }
    this.title = sessionStorage.title
    this.evalType = sessionStorage.evalType
    this.evalId = sessionStorage.evalId
    this.realState = sessionStorage.realState
    this.getOtherResultList()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#look-result{
  margin: $width;
  background: $white;
  border: 1px solid #ECECEC;
  border-radius: 4px;

  header{
    padding: $width / 2;
    height: 62px;
    box-sizing: border-box;
    border-bottom: 2px solid #DDDDDD;

    &>.el-input{
      width: 300px;
      margin-left: $width;
    }

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

    .button-group{
      float: right;
    }
  }

  // 主体
  main{
    padding: $width*1.5 $width;
    min-height: 600px;

    .main-header{
      font-size: 17px;
    }

    .screening{
      margin-top: $width*1.5;

      &>.el-col:first-child{
        border: 1px solid #ddd;
        padding: $width/1.2;
        padding-bottom: 0;

        .grade,.subject{
          i{
            font-style: normal;
            color: #989898;
            font-size: 15px;
          }

          span{
            font-size: 15px;
            display: inline-block;
            margin:0 $width 10px;
            padding:2px;
            color: #343434;
            cursor: pointer;
            border-bottom: 2px solid transparent;
          }

          .active{
            color:#35BFFF;
            border-bottom: 2px solid #1EB8FF;
          }
        }
        
        .grade{
          border-bottom: 1px dashed #ddd; 
        }

        .subject{
          margin-top: $width/1.5;
        }
      }

      &>.el-col:last-child{
        text-align: right;
        .el-input{
          margin-top: $width*5;
          width: 290px;
        }
      }
    }

    // 列表头部
    .list-title{
      text-align: center;
      margin-top: $width;
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

        .el-col:nth-child(4){
          color: #39A9FE;
          cursor: pointer;
        }

        .realState{
          cursor: pointer;
        }
      }

      .content{
        box-sizing: border-box;
        margin-bottom: $width;
        position: absolute;
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
            a{
              color: #39A9FE;
              text-decoration: none;
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .other-main{
    padding-bottom: $width*2;
    width: 100%;
    overflow-x: scroll;

    // 列表头部
    .list-title{
      // width: 130%;
      margin-top: $width;
      border-bottom: 1px solid #E6E6E6;
      padding: $width/2 0;
      font-size: 15px;

      &>span{
        display: inline-block;
        width: 80px;
        margin-left: $width*2;
        margin-right: $width*2;
      }
    }

    // 列表主体
    .list{
      // width: 130%;
      position: relative;

      div{
        line-height: 48px;
        border-bottom: 1px solid #E6E6E6;
        font-size: 15px;
        // text-align: center;

        &>span{
          display: inline-block;
          width: 80px;
          margin-left: $width*2;
          margin-right: $width*2;
        }

        &:hover{
          background: #F7F7F7;
        }

        &>span:last-child{
          a{
            color: #39A9FE;
            text-decoration: none;
            cursor: pointer;
          }
        }

        .realState{
          cursor: pointer;
          color: #39A9FE;
        }
      }
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
}
</style>
