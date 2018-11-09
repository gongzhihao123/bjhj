<template>
  <div class="subject-state">
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
                  <ul @click="clickdata(index)" :class="{now: topicDetailsByIdDto.phasesSort - 1 === index, 'past': topicDetailsByIdDto.phasesSort - 1 > index, 'active':  activeNum === index}">
                    <li :class="{Hheight: item.stopTime === null}">{{item.phasesName}}</li>
                    <li>{{item.stopTime | dateFormat('yyyy-MM-dd')}}</li>
                  </ul>
                  <img src="../../../../assets/images/courses/icon-arrow.png" v-if="index !== tpTopicPhasesList.length - 1">
                </li>
              </ul>            
          </el-col>
      </el-row>   
      
      <div class="content">
        <div class="Info">
            <el-popover
              ref="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              v-if="namelength > 20"
              :content="topicDetailsByIdDto.name">
              <p slot="reference">{{topicDetailsByIdDto.name.slice(0, 20) + '...'}}</p>
            </el-popover>            
            <p v-if="namelength <= 20">{{topicDetailsByIdDto.name}}</p>          
          <ul>
            <li>单位: <span>{{topicDetailsByIdDto.companyName}}</span></li>
            <li>负责人: <span>{{topicDetailsByIdDto.leadUserName}}</span></li>
          </ul>

          <ul>
              <li>课题申报指南号: <span>{{topicDetailsByIdDto.topicCode}}</span></li>
              <li>当前阶段: <span>{{topicDetailsByIdDto.phasesName}}</span></li>
              <li>课题类别: <span>{{topicDetailsByIdDto.classificationName}}</span></li>
            </ul>
        </div>
        <iframe :src="url" class="score-content" style="width:1100px;height: 800px;margin: 16px 2%;"></iframe>
        <!-- <div class="content-box" v-html="content"> -->
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import service from '../../../../utils/axios'
import { notice } from '../../../../api/index.js'
export default {
  name: 'subject-state',
  data () {
    return {
      url: '',
      active: 0,
      bread: {},
      tpTopicPhasesList: {},
      topicDetailsByIdDto: {},
      activityCount: 0,
      namelength: 0,
      datumCount: 0,
      logCount: 0,
      tableData: [],
      activeNum: 0,
      content: '',
      stateList: [
        {name: '申请阶段', phasesSort: 1},
        {name: '开题阶段', phasesSort: 2},
        {name: '中期研究阶段', phasesSort: 3},
        {name: '中期总结阶段', phasesSort: 4},
        {name: '结题阶段', phasesSort: 5}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'staticUrl',
      'previewUrl'
    ])
  },
  methods: {
    back () {
      window.history.back()
    },
    clickdata (index) {
      if (this.active - 1 < index) {
        return false
      } else {
        this.activeNum = index
        this.getData()
      }
    },
    getData () {
      service.get(`frontTopicDetailsController/getTopicView?topicId=${this.topicId}&phasesSort=${this.activeNum + 1}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.content = res.data.result
          this.url = `${this.previewUrl}${this.staticUrl}?filepath=${this.content}`
        }
      })
    }
  },
  created () {
    this.topicId = sessionStorage.id
    sessionStorage.second = {}
    this.tpTopicPhasesList = JSON.parse(sessionStorage.tpTopicPhasesList)
    this.topicDetailsByIdDto = JSON.parse(sessionStorage.topicDetailsByIdDto)
    this.activityCount = sessionStorage.activityCount
    this.datumCount = sessionStorage.datumCount
    this.logCount = sessionStorage.logCount
    this.active = this.topicDetailsByIdDto.phasesSort - 1
    // this.activeNum = this.topicDetailsByIdDto.phasesSort
    this.namelength = this.topicDetailsByIdDto.name.length
    this.bread = JSON.parse(sessionStorage.bread)
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.subject-state{
  background: #f1f2f7;
  width: 1200px;
  margin: 0 auto;


  &:after {
    @include clearfloat;
  }

  .el-row {
    margin-top: 20px;
    background: #fff;
    position: relative;

    .step {
        position: absolute;
        right: 0px;
        top: 0px;
        float: none;
        padding: 15px 40px 15px 0px;

        &>li {
          float: left;
          font-size: 14px;
          /* padding: 0px 10px; */

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
              background: #87d57c;

              &>li {
                color: #fff !important;
              }
            }
            .past {
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
              cursor: pointer;
              padding: 5px;
              border: 1px solid #B2B2B2;
              border-radius: 4px;              

              &>li {
                text-align: center;
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

    &:nth-child(1) {
      margin-top: 0px;
    }

    .red {
      width: 70% !important;
      float: none;
      display: block;
      position: absolute;
      top: 17px;

      &:after {
        @include clearfloat;
      }
      li {
        float: left;
        width: 8px !important;
        height: 8px !important;
        display: block;
        background: #fff;
        border-radius: 100%;
        margin-right: 80px;
        margin-left: 80px;
        text-align: center;
      }
    }

    &:after {
      @include clearfloat;
    }
    &>.el-col {
      &:after {
        @include clearfloat
      }        
    }
  }

  
  
  .content {
    margin: 16px auto 15px auto;
    background: #fff;
    padding: 20px;

    .Info {
      margin: 0 auto;
      background: #F3F3F3;
      padding: 20px;
      
      p {
        font-weight: bold;
        font-size: 16px;
        color: #333;
        margin-bottom: 10px;
      }

      ul {
        /* width: 100%; */
        display: block;

        &:after {
          @include clearfloat;
        }
        li {
          width: 20%;
          float: left;
          line-height: 30px;
        }
      }
    }
    .content-box {
      width: 900px;
      margin: 16px auto 0px auto;
      height: 930px;
      border: 1px solid #ccc;
      overflow-y:scroll;
    }
  }
}

</style>
