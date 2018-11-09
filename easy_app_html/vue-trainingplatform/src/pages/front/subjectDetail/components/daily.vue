<template>
  <div class="subject-daily">   
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
      <ul class="list" v-loading="loading">
        <li v-for="(item, index) in tableData" :key="index">
            <div class="box">
                <span class="small">{{item.createdTime | dateFormat('MM') | month}}</span>
                <span>{{item.createdTime | dateFormat('dd')}}</span>
                <i></i>
            </div>
              <div class="line"></div>
              <div class="content">
                <p>{{item.name}}</p>
                <el-popover
                  ref="popover"
                  placement="top-start"
                  width="600"
                  trigger="hover"
                  v-if="String(item.content).length > 60"
                  :content="item.content">
                  <p slot="reference" class="short">{{item.content.slice(0, 60) + '...'}}</p>
                </el-popover>            
                <p v-if="String(item.content).length <= 60" class="short">{{item.content}}</p>                
                <!-- <p>{{item.content}}</p> -->
                <p>{{item.createdTime | dateFormat('yyyy-MM-dd HH:ss')}}</p>
              </div>         
        </li>
      </ul>

      <el-pagination
      v-if="tableData.length !== 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>      
  </div>
</template>

<script>
import service from '../../../../utils/axios'
import { notice } from '../../../../api/index.js'
export default {
  name: 'subject-daily',
  data () {
    return {
      currentPage: 1,
      totalCount: 0,
      bread: {},
      pageSize: 5,
      topicDetailsByIdDto: {},
      tpTopicPhasesList: {},
      activityCount: 0,
      datumCount: 0,
      logCount: 0,
      tableData: [],
      loading: false,
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
    getData () {
      service.get(`frontTopicDetailsController/getLogListByTopicId?topicId=${this.topicId}&pageSize=${this.pageSize}&pageNo=${this.currentPage}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.tableData = res.data.result.list
          this.totalCount = res.data.result.totalCount
          this.loading = false
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
    this.bread = JSON.parse(sessionStorage.bread)
    this.loading = true
    sessionStorage.second = {}
    setTimeout(() => {
      this.getData()
    }, 300)
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.subject-daily{
  background: #f1f2f7;
  width: 1200px;
  margin: 0 auto;

  .short {
    font-weight: normal !important;
    font-size: 14px !important;
  }

  .el-breadcrumb {
    margin-top: 16px;
  }

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
        padding: 20px 40px 20px 0px;

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
  .list {
    width: 100%;
    margin-top: 20px;

    li {
      background: #fff;
      margin-bottom: 20px;
      padding: 30px 20px 30px 40px;

      &:after {
        @include clearfloat;
      }

      .box {
        float: left;
        margin-top: 3px;
        height: 98px;
        position: relative;
        background: url(../../../../assets/images/courses/blue-bg.png);

        span {
          width: 78px;
          display: block;
          color: #fff;
          line-height: 60px;
          font-size: 24px;
          text-align: center;
          margin-bottom: 5px;         
        }

        .small {
          font-size: 20px;
          line-height: 30px;
        }

        i {
          display: inline-block;
          border: 1px solid #fff;
          width: 24px;
          position: absolute;
          bottom: 10px;
          right: 27px;
        }

      }

      .line {
        float: left;
        width: 2px;
        height: 83px;
        border-right: 1px solid #AFAFAF;
        margin: 11px 40px;

      }      

      .content {
        margin-top: 8px;
        p {
        line-height: 30px;

        &:first-child {
          font-weight: bold;
          font-size: 16px;
        }
      }
      }
    }
  }
  .el-pagination {
    text-align: right;
    margin-top: 20px;
    margin-bottom: 20px;
  }  
}

</style>
