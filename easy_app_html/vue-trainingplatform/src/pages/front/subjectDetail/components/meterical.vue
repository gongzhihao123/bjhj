<template>
  <div class="subject-meterical">
      <el-row>
          <el-col :span="24">
            <div class="ul-List">
                <ul class="vertical-one">
                    <li>{{datumCount}}</li>
                    <li>{{activityCount}}</li>
                    <li>{{logCount}}</li>
                </ul> 
                <ul class="vertical-two">
                  <li><span>资料</span></li>
                  <li><span>活动</span></li>
                  <li><span>日志</span></li>
                </ul>                
            </div> 
            <ul class="step">
                <li v-for="(item, index) in tpTopicPhasesList" :key="index">
                  <ul :class="{now: topicDetailsByIdDto.phasesSort - 1 === index, 'active': topicDetailsByIdDto.phasesSort - 1 > index}">
                    <li  :class="{Hheight: item.stopTime === null}">{{item.phasesName}}</li>
                    <li>{{item.stopTime | dateFormat('yyyy-MM-dd')}}</li>
                  </ul>
                  <img src="../../../../assets/images/courses/icon-arrow.png" v-if="index !== tpTopicPhasesList.length - 1">
                </li>
            </ul>   
          </el-col>
      </el-row> 

      <div class="left">
        <p><img src="../../../../assets/images/courses/course-meterical.png">课题资料</p>
       <div class="table-box">
          <el-table
          :data="tableData"
          style="width: 100%"
          stripe>
          <el-table-column
            label="资料名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span @click="download(scope.row)">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="上传人"
            width="120"
            prop="createdUserName">
          </el-table-column>
          <el-table-column
            label="资料类型"
            width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.datumType === 1">开题资料</span>
              <span v-if="scope.row.datumType === 2">中期资料</span>
              <span v-if="scope.row.datumType === 3">结题资料</span>
              <span v-if="scope.row.datumType === 4">研究成果</span>
              <span v-if="scope.row.datumType === 5">其他</span>
            </template>
          </el-table-column>
          <el-table-column
            label="大小"
            width="120">
            <template slot-scope="scope">
              <span>{{(scope.row.fileSize/1024).toFixed(2)}}kb</span>
            </template>
          </el-table-column>
          <el-table-column
            label="上传日期"
            width="150">
            <template slot-scope="scope">
              <span>{{scope.row.createdTime | dateFormat('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>                          
      </el-table> 
       </div>
      
      <el-pagination
        v-if="tableData.length !== 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>      
      </div>
      <div class="right">
        <div class="right-top">
          <p><img src="../../../../assets/images/courses/course-member.png">课题负责人</p>
          <img :src='tpTopicStepTwo.leadUserFace ? tpTopicStepTwo.leadUserFace : face' alt="userFace">
          <div class="header-name">
              <span class="name">{{tpTopicStepTwo.leadUserName}}</span>
              <span>课题负责人</span>
          </div>
          <div class="line"></div>
          <ul>
              <li v-for="(item, index) in groupUserList" :key="index">{{index + 1}}.{{item.userName}}<span class="li-tip">组员</span></li>
            </ul>
        </div>
      </div>
  </div>
</template>

<script>
import face from '../../../../assets/images/mr.jpg'
import service from '../../../../utils/axios'
import { notice } from '../../../../api/index.js'
export default {
  name: 'subject-meterical',
  data () {
    return {
      face,
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      tableData: [],
      list: [],
      active: 0,
      tpTopicPhasesList: {},
      topicDetailsByIdDto: {},
      activityCount: 0,
      datumCount: 0,
      logCount: 0,
      bread: {},
      groupUserList: [],
      tpTopicStepTwo: {},
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
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    download (row) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/frontTopicDetailsController/downloadFile?fileId=${row.fileId}`
    },
    getData () {
      service.get(`frontTopicDetailsController/getDatumPage?topicId=${this.topicId}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.totalCount = res.data.result.totalCount
          this.tableData = res.data.result.list
        }
      })
    }
  },
  created () {
    this.topicId = sessionStorage.id
    this.tpTopicPhasesList = JSON.parse(sessionStorage.tpTopicPhasesList)
    this.topicDetailsByIdDto = JSON.parse(sessionStorage.topicDetailsByIdDto)
    this.activityCount = sessionStorage.activityCount
    this.datumCount = sessionStorage.datumCount
    this.logCount = sessionStorage.logCount
    this.groupUserList = JSON.parse(sessionStorage.groupUserList)
    this.tpTopicStepTwo = JSON.parse(sessionStorage.tpTopicStepTwo)
    this.bread = JSON.parse(sessionStorage.bread)
    sessionStorage.second = {}
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.subject-meterical{
  background: #f1f2f7;
  width: 1200px;
  margin: 0 auto 20px auto;

  &:after {
    @include clearfloat;
  }

  .el-row {
    margin-top: 20px;
    background: #fff;
    position: relative;

    &:nth-child(1) {
      margin-top: 0px;
    }

    &:after {
      @include clearfloat;
    }
    &>.el-col {
      &:after {
        @include clearfloat
      }

      .step {
        position: absolute;
        right: 0px;
        top: 0px;
        float: none;
        padding: 15px 40px 15px 0px;

        &>li {
          float: left;
          font-size: 14px;
          text-align: center;

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
            /* line-height: 136px; */

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
    }
  } 
  
  .left {
    margin-right: 20px;
    float: left;
    background: #fff;
    margin-top: 20px;
    width: 82%;
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

    .el-pagination {
      text-align: right;
      margin-right: 20px;
      margin-bottom: 20px;
    } 
  }
  .right {
    width: 16%;
    float: left;
    margin-top: 20px;
    border: 1px solid #EDF1F4;

    .right-top {
      margin-bottom: 16px;
      background: #fff;

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
      img {
        width: 100px;
        height: 100px;
        display: block;
        margin: 20px auto;
        border-radius: 100%;
      }

    }

  }
}

</style>
