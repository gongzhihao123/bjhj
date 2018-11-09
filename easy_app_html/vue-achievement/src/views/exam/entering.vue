<template>
  <div class="entering">

    <!-- 录入情况 -->
    <section class="common-css">

      <!-- 左侧菜单 -->
      <!-- <section class="left-menu">
          <el-tree :data="treeMenu"
                   :props="defaultProps">
          </el-tree>
      </section> -->


      <!-- 右侧内容 -->
      <section class="right-content">
        <p class="top">
          <span class="to-list" @click="route('/exam')">返回考试列表</span>
          {{ examInfo.name }}> 学生信息 > 录入情况
        </p>

        <div class="exam-table">
          <section class="exam-enter">

            <div class="enter-head">
              <span class="titlt">学生信息录入</span>
              <section class="student-num">
                <em class="exam-num">参加考试人数： <span>{{ examNumberAll }}</span> 人</em>
                <div class="triangle-up"></div>
                <div class="student-box">
                  <span v-for="item in studentNumList" :key="item.schoolName">{{ item.schoolName }} {{ item.studentNum }}</span>
                </div>
              </section>
              
              <div>
                <span :class="{active: enterState.student == 0}" @click="studentSwitch('student', 0)">未完成录入</span>
                <span :class="{active: enterState.student == 1}" @click="studentSwitch('student', 1)">已完成录入</span>
              </div>
            </div>

            <div class="enter-content">
              <section class="content-left">
                <chart :options="polarOne"></chart>
              </section>

              <section class="content-right">
                <div v-for="item in enterState.studentList" :key="item.name" v-show="item.studentEnterFlag == enterState.student">{{ item.schoolName }}</div>
                <div v-show="enterState.studentList.length == 0">暂无数据</div>                
              </section>
            </div>
          </section>

          <section class="exam-enter">

            <div class="enter-head">
              <span class="titlt">试题录入</span>

              <div>
                <span :class="{active: enterState.test == 0}" @click="studentSwitch('test', 0)">未完成录入</span>
                <span :class="{active: enterState.test == 1}" @click="studentSwitch('test', 1)">已完成录入</span>
              </div>
            </div>

            <div class="enter-content">
              <section class="content-left">
                <chart :options="polarTwo"></chart>
              </section>
              <section class="content-right">
                <div v-for="item in enterState.testList" :key="item.courseName" v-show="item.paperEnterFlag == enterState.test">{{ item.courseName }}</div>
                <div v-show="enterState.testList.length == 0">暂无数据</div>
              </section>
            </div>

          </section>

          <section class="exam-enter">

            <div class="enter-head">
              <span class="titlt">成绩录入</span>

              <div>
                <span :class="{active: enterState.three == 0}" @click="studentSwitch('three', 0)">未完成录入</span>
                <span :class="{active: enterState.three == 1}" @click="studentSwitch('three', 1)">已完成录入</span>
              </div>
            </div>

            <div class="enter-content">
              <section class="content-left">
                <chart :options="polarThree"></chart>
              </section>

              <section class="content-right">
                <div v-for="item in enterState.testList" :key="item.name" v-show="item.scoreEnterFlag == enterState.three">{{ item.courseName }}</div>
                <div v-show="enterState.testList.length === 0">暂无数据</div>
              </section>
            </div>
          </section>

          

        </div>

        <el-button type="primary" @click="route('/exam')">返回</el-button>
        
      </section>

      

    </section>
  </div>
</template>

<script>
import { notice } from '../../api/index.js'
// import querystring from 'querystring'
import Vue from 'vue'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
Vue.use(ECharts)
// register component to use
export default {
  name: 'entering',
  data () {
    let data = []
    for (let i = 0; i <= 360; i++) {
      let t = i / 180 * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }
    return {
      treeMenu: [
        {
          name: '录入情况'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      examInfo: {
        name: ''
      },
      enterState: {
        student: 1,
        test: 1,
        three: 1,
        studentList: [],
        testList: []
      },
      examId: '',
      unfinished: 0,
      finished: 0,
      polarOne: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          position: 'inside'
        },
        legend: {
          orient: 'vertical',
          x: 'left'
        },
        series: [
          {
            name: '学生信息录入统计',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: 0, name: '已录入'},
              {value: 0, name: '未录入'}
            ]
          }
        ]
      },
      polarTwo: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          position: 'inside'
        },
        legend: {
          orient: 'vertical',
          x: 'left'
        },
        series: [
          {
            name: '试题录入统计',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: 0, name: '已录入'},
              {value: 0, name: '未录入'}
            ]
          }
        ]
      },
      polarThree: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          position: 'inside'
        },
        legend: {
          orient: 'vertical',
          x: 'left'
        },
        series: [
          {
            name: '成绩录入统计',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: 0, name: '已录入'},
              {value: 0, name: '未录入'}
            ]
          }
        ]
      },
      examNumberAll: 0,
      studentNumList: []
    }
  },
  methods: {
    studentSwitch (s, i) {
      this.enterState[s] = i
    },
    route (s) {
      this.$router.push(s)
    },
    // 获取录入情况
    getExamDetails () {
      let obj = JSON.parse(this.$route.query.obj)
      this.examId = obj.id
      this.$https.get(`/examStateEnter/stateDetail?examId=${this.examId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.enterState.studentList = res.data.result.filter(item => item.type === 1)
          this.enterState.testList = res.data.result.filter(item => item.type === 2)
          this.polarOne.series[0].data[0].value = (res.data.result.filter(item => item.type === 1) || []).filter(item => item.studentEnterFlag === 1).length
          this.polarOne.series[0].data[1].value = (res.data.result.filter(item => item.type === 1) || []).filter(item => item.studentEnterFlag === 0).length
          this.polarTwo.series[0].data[0].value = (res.data.result.filter(item => item.type === 2) || []).filter(item => item.paperEnterFlag === 1).length
          this.polarTwo.series[0].data[1].value = (res.data.result.filter(item => item.type === 2) || []).filter(item => item.paperEnterFlag === 0).length
          this.polarThree.series[0].data[0].value = (res.data.result.filter(item => item.type === 2) || []).filter(item => item.scoreEnterFlag === 1).length
          this.polarThree.series[0].data[1].value = (res.data.result.filter(item => item.type === 2) || []).filter(item => item.scoreEnterFlag === 0).length
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取各学校参加考试的人数
    getStudentNum () {
      this.$https.get(`/examStateEnter/studentNum?examId=${this.examId}`)
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res)
          this.studentNumList = res.data.result
          this.examNumberAll = 0
          res.data.result.forEach(item => {
            this.examNumberAll += item.studentNum
          })
        }
      })
    }
  },
  created () {
    let obj = JSON.parse(this.$route.query.obj)
    this.examInfo.id = obj.id
    this.examInfo.name = obj.name
    this.getExamDetails()
    this.getStudentNum()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
  .entering {
    height: calc(100% - 20px);
    .echarts {
      width: 260px !important;
      height: 240px !important;
    }
    canvas {
      width: 260px !important;
      // height: 240px !important;
    }
    .el-tree {
      .el-tree-node__content {
        background: $white !important;
        color: $theme;
      }
    }

    .el-tree-node__expand-icon {
      border: transparent;
    }

    .right-content {
      padding: 0 40px 40px;
      height: calc(100% - 20px);

      p.content-head {
        height: 66px;
        line-height: 70px;
        font-weight: bold;

        .el-button {
          float: right;
          margin-top: 10px;
          line-height: 20px;
          font-weight: normal;

          i {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid $white;
            transform: translateX(-2px) scale(1.1);
            text-align: center;
          }
        }
      }

      .exam-table {
        height: calc(100% - 126px);
        overflow: auto;

        .exam-enter {
          height: 308px;

          .enter-head {
            display: flex;
            justify-content: space-between;
            height: 48px;
            line-height: 48px;
            padding-top: 20px;
            font-weight: bold;


            > span {
              padding-left: 40px;
              background: url(../../assets/icons/entering.png) no-repeat 4px center;
            }

            > div {
              > span {
                display: inline-block;
                padding: 0 20px;
                cursor: pointer;
                transform: translateY(1px);
                border-radius: 6px 6px 0 0;

                &.active {
                  background: $white;
                  color: #55acee;
                }
              }
            }

          }

          .student-num {
            width: 60%;
            .exam-num {
              cursor: pointer;
              position: relative;
              // margin-left: -111px;
              >span {
                font-weight: bold;
                // font-size: 26px;
              }
            }

            .triangle-up {
              display: none;
              position: absolute;
              margin-top: -16px;
              margin-left: 0px;
              width: 0;
              height: 0;
              border-left: 10px solid transparent;
              border-right: 10px solid transparent;
              border-bottom: 16px solid #848484;
          }

            .student-box {
              display: none;
              position: absolute;
              padding: 10px;
              min-width: 200px;
              min-height: 100px;
              background: #848484;
              color: #fff;
              z-index: 1000;
              max-width: 600px;
              max-height: 500px;
              overflow: auto;
            }

            &:hover {
              .triangle-up, .student-box {
                display: block;
              }
            }
          }

          .enter-content {
            display: flex;
            justify-content: space-between;
            height: 240px;
            // background: $white;

            .content-left {
              width: 260px;
              min-width: 260px;
              height: 100%;
              background: $white;
              margin-right: 10px;
            }

            .content-right {
              flex-grow: 1;
              box-sizing: border-box;
              height: 100%;
              background: $white;
              padding: 24px;
              overflow: auto;

              > div {
                display: inline-block;
                // width: 254px;
                padding: 4px 10px;
                line-height: 34px;
              }
            }
          }
        }
      }

      > .el-button {
        display: block;
        margin: 0 auto;
      }
    }
  }
</style>

