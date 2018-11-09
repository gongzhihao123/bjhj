<template>
  <div class="subject-intro">
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="bread.url">{{bread.name}}</el-breadcrumb-item>
      <el-breadcrumb-item>课程概述</el-breadcrumb-item>
  </el-breadcrumb>  
    <el-row>
      <el-col :span="24">
        <div class="ul-List">
            <ul class="vertical-one">
                <li>{{Info.datumCount}}</li>
                <li>{{Info.activityCount}}</li>
                <li>{{Info.logCount}}</li>
              </ul>
              <ul class="vertical-two">
                <li><span>资料</span></li>
                <li><span>活动</span></li>
                <li><span>日志</span></li>
              </ul>  
        </div>       
          <ul class="step">
            <li v-for="(item, index) in Info.tpTopicPhasesList" :key="index">
              <ul :class="{now: Info.topicDetailsByIdDto.phasesSort - 1 === index, 'active': Info.topicDetailsByIdDto.phasesSort - 1 > index}">
                <li :class="{Hheight: item.stopTime === null}">{{item.phasesName}}</li>
                <li>{{item.stopTime | dateFormat('yyyy-MM-dd')}}</li>
              </ul>
              <img src="../../../../assets/images/courses/icon-arrow.png" v-if="index !== Info.tpTopicPhasesList.length - 1">
              <!-- <img src="../../../../assets/images/courses/icon-arrow-active.png" v-if="index !== Info.tpTopicPhasesList.length - 1 && Info.topicDetailsByIdDto.phasesSort - 1 > index"> -->
            </li>
          </ul>
      </el-col>
    </el-row>

    <div class="content">
      <div class="left-box">
          <div class="left-content">
              <p><img src="../../../../assets/images/courses/course-Info.png">课题信息</p>
              <ul class="Info">
                <li>课题名称： 
                  <el-popover
                    ref="popover"
                    placement="top-start"
                    width="300"
                    trigger="hover"
                    v-if="namelength > 15"
                    :content="Info.topicDetailsByIdDto.name">
                    <span slot="reference">{{Info.topicDetailsByIdDto.name.slice(0, 15) + '...'}}</span>
                  </el-popover>           
                  <span v-if="namelength <= 15">{{Info.topicDetailsByIdDto.name}}</span>
                </li>
                <li>课题级别： <span>{{Info.topicDetailsByIdDto.topicLevel}}</span></li>
                <li>课题类别： <span>{{Info.topicDetailsByIdDto.classificationName}}</span></li>
                <li>预期成果： <span v-if="String(Info.topicDetailsByIdDto.wishResult).indexOf('1') >= 0">专著</span>
                              <span v-if="String(Info.topicDetailsByIdDto.wishResult).indexOf('2') >= 0">译著</span>
                              <span v-if="String(Info.topicDetailsByIdDto.wishResult).indexOf('3') >= 0">研究报告</span>
                              <span v-if="String(Info.topicDetailsByIdDto.wishResult).indexOf('4') >= 0">工具书</span>
                              <span v-if="String(Info.topicDetailsByIdDto.wishResult).indexOf('5') >= 0">电脑</span>
                              <span v-if="String(Info.topicDetailsByIdDto.wishResult).indexOf('6') >= 0">其他</span>
                </li>
                <li>负责人： <span>{{Info.tpTopicStepTwo.leadUserName}}</span></li>
      
              </ul>
              <ul>          
                <li>关键词： 
                  <el-popover
                    ref="popover"
                    placement="top-start"
                    width="300"
                    trigger="hover"
                    v-if="keylength > 15"
                    :content="Info.topicDetailsByIdDto.keyword">
                    <span slot="reference">{{Info.topicDetailsByIdDto.keyword.slice(0, 15) + '...'}}</span>
                  </el-popover>            
                  <span v-if="keylength <= 15">{{Info.topicDetailsByIdDto.keyword}}</span>
                </li>
                <li>课题编号： <span>{{Info.topicDetailsByIdDto.topicCode}}</span></li>
                <li>立项单位： <span>{{Info.topicDetailsByIdDto.companyName}}</span></li>
                <li>承担单位： <span>{{Info.topicDetailsByIdDto.companyName}}</span></li>
                <li>立项日期： <span>{{Info.topicDetailsByIdDto.checkedTime | dateFormat('yyyy-MM-dd')}}</span></li>
                <li>完成日期： <span>{{Info.topicDetailsByIdDto.wishFinishTime | dateFormat('yyyy-MM-dd')}}</span></li>
              </ul>
            </div>
            <div class="left-bottom">
              <p><img src="../../../../assets/images/courses/member-count.png">课程统计</p>
              <ul>
                <li>进展状态： <span v-if="Info.phasesStateAndViewDto.phasesState === 1">正常<img src="../../../../assets/images/courses/icon-green.png"></span>
                              <span v-if="Info.phasesStateAndViewDto.phasesState === 2">延期<img src="../../../../assets/images/courses/icon-red.png"></span>
                              <span v-if="Info.phasesStateAndViewDto.phasesState === 3">其他撤项<img src="../../../../assets/images/courses/icon-orange.png"></span>
                </li>
                <li>浏览次数： <span>{{Info.phasesStateAndViewDto.clickNum}}</span></li>
              </ul>
            </div>
      </div>
      <div class="right-content">
        <p><img src="../../../../assets/images/courses/course-member.png">课题组成员</p>
        <div class="header-Info">
          <img :src='Info.tpTopicStepTwo.leadUserFace ? Info.tpTopicStepTwo.leadUserFace : face' alt="userFace">
          <div class="header-name"><span class="name">{{Info.tpTopicStepTwo.leadUserName}}</span><span>课题组负责人</span></div>
          <div class="line"></div>
          <ul>
            <li v-for="(item, index) in Info.groupUserList" :key="index">{{index + 1}}.{{item.userName}}<span class="li-tip">组员</span></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="left">
        <div class="left-box">
            <p><img src="../../../../assets/images/courses/member-result.png">负责人和课题组人与课程有关研究成果</p>
            <div class="table-box">
                <el-table
                :data="Info.fourList"
                stripe
                style="width: 100%">
                <el-table-column
                  prop="achievementName"
                  label="成果名称"
                  width="150"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="createdUser"
                  label="著作者"
                  width="150">
                </el-table-column>
                <el-table-column
                  label="成果形式"
                  prop="achievementShape"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="publishCompany"
                  label="出版单位"
                  width="150">
                </el-table-column>  
                <el-table-column
                  label="出版时间"
                  width="150">
                  <template slot-scope="scope">
                    <span>{{scope.row.publishTime | dateFormat('yyyy-MM-dd')}}</span>
                  </template>
                </el-table-column>                
              </el-table>
            </div>
        </div>
        <div class="box">
            <p><img src="../../../../assets/images/courses/member-analysic.png">完成课题的可行性分析</p>
            <p class="text" v-if="Info.eightList.length !== 0 && Info.eightList[0] !== null">{{Info.eightList[0].content}}</p>
        </div>
        <div class="left-box">
            <p><img src="../../../../assets/images/courses/expect-result.png">预期研究成果</p>
            <div class="table-box">
                <el-table
                :data="Info.nineList"
                stripe
                style="width: 100%">
                <el-table-column
                  label="开始时间至结束时间"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.startTime | dateFormat('yyyy-MM-dd')}}至 {{scope.row.stopTime | dateFormat('yyyy-MM-dd')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="achievementName"
                  show-overflow-tooltip
                  label="阶段性成果"
                  width="200">
                </el-table-column>
                <el-table-column
                  label="成果形式"
                  width="150">
                  <template slot-scope="scope">
                      <span v-if="scope.row.achievementShape === 1">专著</span>
                      <span v-if="scope.row.achievementShape === 2">译著</span>
                      <span v-if="scope.row.achievementShape === 3">研究报告</span>
                      <span v-if="scope.row.achievementShape === 4">工具书</span>
                      <span v-if="scope.row.achievementShape === 5">电脑</span>
                      <span v-if="scope.row.achievementShape === 6">其他</span>
                    </template>                
                </el-table-column>
                <el-table-column
                  prop="underwriter"
                  label="负责人"
                  width="200"
                  show-overflow-tooltip>
                </el-table-column>                 
              </el-table>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import face from '../../../../assets/images/mr.jpg'
import service from '../../../../utils/axios'
import { notice } from '../../../../api/index.js'
export default {
  name: 'subject-intro',
  data () {
    return {
      topicId: '',
      bread: {},
      name: '',
      face,
      namelength: 0,
      keylength: 0,
      Info: {
        topicDetailsByIdDto: {},
        tpTopicStepTwo: {},
        tpTopicPhasesList: [],
        eightList: [{}],
        phasesStateAndViewDto: {}
      },
      active: 0,
      stateList: [
        {name: '申请阶段', phasesSort: 1},
        {name: '开题阶段', phasesSort: 2},
        {name: '中期研究阶段', phasesSort: 3},
        {name: '中期总结阶段', phasesSort: 4},
        {name: '结题阶段', phasesSort: 5}
      ]
    }
  },
  methods: {
    getData () {
      service.get(`/frontTopicDetailsController/getTopicDetailsById?topicId=${this.topicId}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          res.data.result ? this.Info = res.data.result : this.Info = {}
          res.data.result.topicDetailsByIdDto ? this.Info.topicDetailsByIdDto = res.data.result.topicDetailsByIdDto : this.Info.topicDetailsByIdDto = []
          res.data.result.tpTopicStepTwo ? this.Info.tpTopicStepTwo = res.data.result.tpTopicStepTwo : this.Info.tpTopicStepTwo = []
          res.data.result.tpTopicPhasesList ? this.Info.tpTopicPhasesList = [...res.data.result.tpTopicPhasesList] : this.Info.tpTopicPhasesList = []
          res.data.result.eightList !== null ? this.Info.eightList[0] = res.data.result.eightList[0] : this.Info.eightList = []
          res.data.result.phasesStateAndViewDto ? this.Info.phasesStateAndViewDto = res.data.result.phasesStateAndViewDto : this.Info.phasesStateAndViewDto = {}
          sessionStorage.tpTopicPhasesList = JSON.stringify(res.data.result.tpTopicPhasesList)
          sessionStorage.topicDetailsByIdDto = JSON.stringify(res.data.result.topicDetailsByIdDto)
          sessionStorage.activityCount = res.data.result.activityCount
          sessionStorage.datumCount = res.data.result.datumCount
          sessionStorage.logCount = res.data.result.logCount
          sessionStorage.tpTopicStepTwo = JSON.stringify(res.data.result.tpTopicStepTwo)
          // this.Info.tpTopicStepTwo.leadUserFace = this.Info.tpTopicStepTwo.leadUserFace ? ('http://www.meetyuu.com/static/trainingplatform-upload' + this.Info.tpTopicStepTwo.leadUserFace) : ''
          sessionStorage.groupUserList = JSON.stringify(res.data.result.groupUserList)
          this.namelength = String(this.Info.topicDetailsByIdDto.name).length
          this.keylength = this.Info.topicDetailsByIdDto.keyword.length
        }
      })
    }
  },
  created () {
    this.bread = JSON.parse(sessionStorage.bread)
    this.topicId = JSON.parse(sessionStorage.id)
    sessionStorage.second = {}
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.subject-intro{
  background: #f1f2f7;
  width: 1200px;
  margin: 0 auto;

  .el-table__empty-block {
    width: 100% !important;
  }

  .el-table__body-wrapper{
    max-height: 200px;
    overflow-y: auto;
  }

  .text {
    font-weight: normal !important;
    max-height: 450px;
    min-height: 200px;
    overflow-y: auto;
    background: #fff !important;
  }

   .el-breadcrumb  {
     /* margin-top: 16px; */
     display: none;
   }
  
  &:after {
    @include clearfloat;
  }
  .content {
    
    margin-bottom: 16px;
    display: flex;

    .right-content {
      background: #fff;
      width: 220px;
      border: 1px solid #EDF1F4;
      margin-left: 20px;

      p {
          font-size: 16px;
          padding: 20px;
          line-height: 24px;
          height: 24px;
          background: #F8F9FC;
          border-bottom: 1px solid #EDF1F4;

          &>img {
            float: left;
            margin: 0px 10px 0px 0px;
            width: 24px;
            height: 24px;
          }
        }
        .header-name {
          padding: 20px;
          .name {
            font-size: 16px;
            font-weight: normal;
            text-align: center;
            margin-top:　15px;
            float: left;
            margin-right: 10px;
            color: #666;
          }
          span {
            color: #B3B3B3;
          }
        }

        .line {
          width: 20px;
          height: 1px;
          border-bottom: 2px solid #B3B3B3;
          border-radius: 4px;
          margin: 0 auto;
        }


        .header-Info {
          img {
          width: 100px;
          height: 100px;
          margin-left: 50%;
          margin-top: 20px;
          transform: translateX(-50%);
          border-radius: 100%;
        }
        }
        ul {
          width: 100%;
          margin-top: 20px;
          max-height: 300px;
          overflow: scroll;
          li {
            padding: 0px 20px 0px 30px;
            line-height: 30px;

            .li-tip {
              float: right;
              color: #999999;
            }
          }
        }      
    }
    .left-box {
      flex: 1;


      .left-content {
        background: #fff;
        border: 1px solid #EDF1F4;

        &:after {
          display: block;
          content: '';
          height: 0;
          clear: both;
          overflow: hidden;
          visibility: hidden;
        }
        p {
          font-size: 16px;
          padding: 20px;
          height: 24px;
          line-height: 24px;
          background: #F8F9FC;
          border-bottom: 1px solid #EDF1F4;

          &>img {
            float: left;
            margin-right: 10px;
          }
        }

        &>ul {
          width: 50%;
          display: block;
          padding: 30px 0px;
          float: left;

          li {
            width: 100%;
            text-indent: 2em;
            line-height: 35px;          

            span {
              padding: 0px;
              margin: 0px;
              color:#333;
              border: none;
              line-height: 30px;   
              margin-right: 4px;           
            }
          }
        }      
       }
      }

      .left-bottom {
        background: #fff;
        border: 1px solid #EDF1F4;
        margin-top: 20px;

        p {
          font-size: 16px;
          padding: 20px;
          height: 24px;
          line-height: 24px;
          background: #F8F9FC;
          border-bottom: 1px solid #EDF1F4;

          &>img {
            float: left;
            margin-right: 10px;
          }
        }

        &>ul {
          padding: 30px 20px;

          &:after {
            display: block;
            content: '';
            height: 0;
            clear: both;
            overflow: hidden;
            visibility: hidden;
          }
            li {
              float: left;
              width: 50%;

              &>span {
                height: 19px;
                display: inline-block;
                line-height: 19px;

                &>img {
                  margin-left: 10px;
                  vertical-align: middle;
                }
              }
            }
          }
      }

  }
  .el-row {
    background: #fff;
    margin-bottom: 20px;
    position: relative;

    &:nth-child(1) {
      margin-bottom: 20px;
    }

    &:after {
      @include clearfloat;
    }
    &:nth-child(3){
      background: #F0F5FB;
      .el-col {
        background: #fff;
        height: auto;
      }
    }
    &>.el-col {
      /* height: 136px; */
      &:after {
        @include clearfloat
      }

      .step{
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 15px 40px 15px 0px;

        li {

          &>ul {
            height: 40px;
            .Hheight {
              line-height: 40px;
            }
          }
          &:after {
            @include clearfloat;
          }

          .active {
              border: 1px solid #87d57c;

              &>li {
                color: #87d57c;
              }
            }

            .now {
              border: 1px solid #f99d48;
              &>li {
                color: #f99d48;
              }
            }
            &>ul {
              float: left;
              min-width: 80px;
              padding: 5px;
              border: 1px solid #B2B2B2;
              border-radius: 4px;

              &>li {
                min-width: 80px;
                display: block;
                float: none;
                color: #B3B3B3;
                line-height: 20px;
                text-align: center;
              }
          }
          &>img {
            float: left;
            margin: 10% 5px 0px 5px;
          }
        }
      }

      .ul-List {
        float: left;
        width: 25%;
        padding: 20px;
      }
      .vertical-one {
        display: block;
        float: none;
        &:after {
          display: block;
          content: '';
          height: 0;
          clear: both;
          overflow: hidden;
          visibility: hidden;
        }
        li {
          float: left;
          font-size: 18px;
          width: 50px;
          &:nth-child(1) {
            padding-left: 33px;
          }
          padding-left: 45px;
        }
      }
      .vertical-two {
        display: block;
        float: none;

        li {
          float: left;
          font-size: 14px;
          padding: 0px 20px;


          &:last-child {
              span {
                border-right: none;
              }
            }  

          span {
            color: #333;
            border-right: 1px solid #ccc;
            padding-left: 5px;
            padding-right: 20px;

          }
        }

        &:after {
          display: block;
          content: '';
          height: 0;
          clear: both;
          overflow: hidden;
          visibility: hidden;
        }
      }
      &>ul {
        float: left;
        padding: 0px 20px;
        li {
          float: left;
          font-size: 14px;
          /* padding: 0px 10px; */

        }
      }          
    }
  }

  .left {
    width: 100%;
    margin-top: 20px;
    margin-right: 16px;


    .left-box, .box {
      background: #fff;
      margin-bottom: 20px;
      border: 1px solid #EDF1F4;

      p {
        font-size: 16px;
        padding: 20px;
        height: 24px;
        line-height: 24px;
        background: #F8F9FC;
        border-bottom: 1px solid #EDF1F4;

        &>img {
          float: left;
          margin-right: 10px;
        }
      }
      .table-box {
        padding: $width;
        margin-top: 0px;
      }
      .el-table {
        margin: 0px;
      }
      .el-table td:first-child .cell, .el-table th:first-child .cell {
        padding-left: 10px;
      }
  
      .el-table::before {
        display: none;
      }
      .el-table__header {
        width: 100% !important;
  
        tr {
          background: #EBEEF7;
          border-radius: 4px;
          th {
            &:first-child {
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
             &:nth-child(5){
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
             }
          }
        }
      }
      .el-table td, .el-table th.is-leaf {
        border: none !important;
      }
      .el-table .head  {
        background: #EBEEF7;
        color: #666;
      }
      .el-table__body {
        width: 100% !important;
        tr {
  
            &:hover {
              cursor: default;
              td {
                color: #5295EB;
              }
            }
          td {
            color: #999;
            padding: 5px 0px;
            &:first-child {
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
             &:nth-child(5){
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
             }
          }
        }
      }  
    }    
  }
  .right {
    margin-top: 16px;
    float: left;
    width: 25%;

    .right-box {
      padding: 20px;
      background: #fff;
      margin-bottom: 16px;

      p {
        font-size: 16px;
        text-indent: 1em;
        font-weight: bold;
        margin-bottom: 18px;      
      }

      ul {
        li {
          line-height: 30px;
          text-indent: 2em;
        }
      }
    }

  }
}

</style>
