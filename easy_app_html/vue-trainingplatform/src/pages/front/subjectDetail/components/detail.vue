<template>
    <div class="subject-detail">
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
                          <ul  :class="{now: topicDetailsByIdDto.phasesSort - 1 === index, 'active': topicDetailsByIdDto.phasesSort - 1 > index}">
                            <li  :class="{Hheight: item.stopTime === null}">{{item.phasesName}}</li>
                            <li>{{item.stopTime | dateFormat('yyyy-MM-dd')}}</li>
                          </ul>
                          <img src="../../../../assets/images/courses/icon-arrow.png" v-if="index !== tpTopicPhasesList.length - 1">
                        </li>
                </ul>                    
            </el-col>
        </el-row> 
        
        <div class="Detail">
            <div class="left-box">
                <div class="box">
                    <span class="small">{{Info.stopTime | dateFormat('MM') | month}}</span>
                    <span>{{Info.stopTime | dateFormat('dd')}}</span>
                    <i></i>
                </div>
                <!-- <ul>
                    <li>进展状态:</li>
                    <li>浏览次数:</li>
                </ul>               -->
            </div>
            <div class="right-box">
                <p>{{Info.name}}</p>
                <ul>
                    <li><span>活动负责人:</span>{{Info.responsibleUser}}</li>
                    <li><span>教研目标:</span>{{Info.activityAim}}</li>
                    <li><span>参与人：</span>{{Info.participationUser}}</li>
                    <ul>
                        <li><span>记录人员: </span>{{Info.recordUser}}</li>
                        <li><span>观察分工:</span>{{Info.observeUser}}</li>
                        <li><span>主持人员:</span>{{Info.directUser}}</li>
                    </ul>
                </ul>
            </div>
        </div>
        <div class="record">
            <p><img src="../../../../assets/images/courses/active-icon.png">活动记录</p>
            <div class="content" v-html="Info.content"></div> 
            <ul class="picList"> 
              <li v-for="(item, index) in imgList" style="width: 150px; height: 150px;">
                <img :src="item.filePath ? item.filePath : face" alt="图片" style="width: 150px; height: 150px;">
              </li>              
            </ul>              
        </div>
        <div class="achievement">
            <p><img src="../../../../assets/images/courses/result-icon.png">活动成果</p>
                <ul>
                    <li v-for="(item, index) in fileList">
                        <span @click="lookDetail(item)" style="color: #1AB3F7">{{item.fileName}}</span> 
                    </li>
                </ul>
        </div>           
    </div>
    </template>
      
      
<script>
import face from '../../../../assets/images/mr.jpg'
import { mapGetters } from 'vuex'
import service from '../../../../utils/axios'
import { notice } from '../../../../api/index.js'
export default {
  name: 'subject-detail',
  data () {
    return {
      face,
      dialogVisible: false,
      uploadFiles: '',
      topicDetailsByIdDto: {},
      tpTopicPhasesList: {},
      activityCount: 0,
      datumCount: 0,
      bread: {},
      imgList: [],
      picList: [],
      second: {},
      logCount: 0,
      activityId: '',
      Info: {},
      fileList: [],
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
    lookDetail (item) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/frontTopicDetailsController/downloadFileActivity?fileId=${item.id}`
    },
    getData () {
      this.picList = []
      service.get(`frontTopicDetailsController/getActivityDetails?activityId=${this.activityId}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.Info = res.data.result
          this.Info.content = this.Info.content.replace(/\\n/g, '<br>')
          this.fileList = res.data.result.fileList
          res.data.result.imgList ? this.imgList = res.data.result.imgList : this.imgList = []
          if (this.imgList.length !== 0) {
            this.imgList = this.imgList.map(item => ({...item, filePath: item.filePath && item ? (this.staticUrl + '?filepath=' + item.filePath) : ''}))
          }
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
    this.activityId = sessionStorage.activityId
    this.loading = true
    this.bread = JSON.parse(sessionStorage.bread)
    this.second = JSON.parse(sessionStorage.second)
    setTimeout(() => {
      this.getData()
    }, 300)
  },
  computed: {
    ...mapGetters([
      'staticUrl'
    ])
  }
}
</script>
      
<style lang="scss">
      @import '../../../../assets/scss/variable.scss';
      @import '../../../../assets/scss/mixin.scss';
      .subject-detail{
        background: #f1f2f7;
        width: 1200px;
        margin: 0 auto;
      
        &:after {
          @include clearfloat;
        }
      
        .el-upload--picture-card {
          display: none;
        }
        .el-upload-list__item-actions {
          width: 100px;
          height: 100px;
        }
        .el-row {
          /* margin-top: 20px; */
          background: #fff;
          position: relative;
          margin-bottom: 20px;
      
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
                      cursor: pointer;
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
        .Detail {
            display: flex;

            .left-box {
                width: 155px;
                background: #fff;
                border: 1px solid #EDF1F4;
                margin-right: 20px;
                float: left;
                padding: 30px;
                position: relative;

                .box {
                    margin-left: 50%;
                    margin-top: 50%;
                    transform: translate(-50%, -50%);
                    float: left;
                    height: 98px;
                    position: relative;
                    background: url(../../../../assets/images/courses/blue-bg.png);

                    span {
                    width: 78px;
                    display: block;
                    color: #fff;
                    font-size: 24px;
                    text-align: center;
                    line-height: 60px;
                    margin-bottom: 5px;         
                    }

                    .small {
                    font-size: 20px;
                    height: 30px;
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

                &>ul {
                    position: absolute;
                    bottom: 20px;
                    &>li {
                        line-height: 25px;
                    }
                }

                .line {
                    float: left;
                    width: 2px;
                    height: 83px;
                    border-right: 2px solid #AFAFAF;
                    margin: 11px 40px;

                }                
            }
            .right-box {
                float: left;
                background: #fff;
                border: 1px solid #EDF1F4;
                flex: 1;

                p {
                    font-size: 16px;
                    padding: 20px;
                    border-bottom: 1px solid #EDF1F4;
                    color: #333;
                    text-align: center;
                }

            ul {
                padding: 20px;

                &>ul {
                      padding: 0px;
                      &:after {
                        display: block;
                        content: '';
                        height: 0;
                        clear: both;
                        overflow: hidden;
                        visibility: hidden;
                      }

                      &>li {
                        float: left;
                        width: 33%;
                      }
                    }                
                li {
                    line-height: 30px;
                    text-indent: 1.5em;

                    &:after {
                        @include clearfloat;
                    }

                    span {
                        width: 100px;
                        text-align: left;
                        margin-left: 10px;
                        display: block;
                        float: left;
                    }
                }
            }                
            }
        }
        .achievement {
            margin-bottom: 20px;
            padding-bottom: 20px;

            ul {
                max-height: 152px;
                overflow-y: auto;
                &>li {
                    line-height: 30px;
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
        .record, .achievement {
            background: #fff;
            margin-top: 20px;

            .el-button {
                margin-left: 10px;
            }

            .content {
                width: 900px;
                height: 500px;
                border: 1px solid #ccc;
                overflow-y: scroll;
                margin: 20px auto;
            }
            
            .picList {
                height: 200px;
                max-height: 200px;
                overflow-y: auto;
                width: 900px;
                margin: 15px auto;
                li {
                  margin-right: 10px;
                  margin-top: 10px;
                  width: 150px;
                  height: 150px;
                  display: block;
                  float: left;
                }

                &:after {
                    @include clearfloat;
                }

                li {
                    width: auto;
                    float: left;
                }
            }
            p {
                font-size: 14px;
                color: #333;
                padding: 20px;
                border-bottom: 1px solid #EDF1F4;
                line-height: 25px;

                &>img {
                  vertical-align: middle;
                  margin-right: 10px;
                }
            }

            ul {
                margin-top: 20px;
                li {
                    text-indent: 2em;
                }
            }
        }
      }
      
      </style>
      