<template>
  <div class="sLesson">

    <div class="activity-name">
      <el-row>
        <el-col :span="24">
          {{ name }} > <span></span>
        </el-col>
      </el-row>
    </div>

    <header>
      <p>选课时间：{{ startTime | dateFormat('yyyy-MM-dd HH:mm')}} <span style="margin: 20px;">至</span> {{ endTime | dateFormat('yyyy-MM-dd HH:mm')}} </p>
      <el-row>
        <el-col :span="12">
          课程类别：
          <el-select v-model="value" @change="activityChange" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        </el-col>
        <el-col :span="12">
          <el-button type="success" @click="myList">我的选课单</el-button>
        </el-col>
      </el-row>
    </header>

    <main>

      <p>
        <span>
          <img src="../../assets/images/canSelectedCourse.png" alt="">
          可以选择{{ canSelectedNum }}门课程
        </span>
        <span>
          已选择：{{ hasSelectedNum }}门课程
        </span>
        <i v-if="logic === 2">(提示：选课的先后顺序即为选课志愿顺序，如需调整志愿顺序，可以在已选课程页面修改。)</i>
      </p>
      <article v-if="courseList.length === 0">暂无数据</article>
      <div v-if="courseList.length !== 0">
        <el-card class="box-card" v-for="(item, index) in courseList" :key="index">
          <div slot="header" class="clearfix">
            <el-tooltip :content="item.lessonName" placement="top">
              <span v-if="item.lessonName.length >= 12">{{ item.lessonName.slice(0, 12) + '...' }}</span>
            </el-tooltip>
            <span v-if="item.lessonName.length < 12">{{ item.lessonName }}</span>
            <i></i>
          </div>
          <div class="body">
            <p>课程类别：{{ item.typeName }}</p>
            <p>授课老师：{{ item.teacherName }}</p>
            <p>上课时间：星期{{ item.week }}第{{ item.section }}节课</p>
            <p>人数限额：{{ item.limitNum }}</p>
            <p>已选人数：{{ item.choiceCount }}</p>
            <div>
              <el-button @click="lookDetail(item, index)">查看详情</el-button>
              <el-button @click="cancleSelectedCourse(item, index)" :disabled="!studentRepick || (timeState === 1) || (timeState === 5) || (timeState === 3)" v-if="logic === 1 && item.ifChoice === 1" :class="{cancleCourse: studentRepick && (timeState === 2 || timeState === 4)}">取消选课</el-button>
              <el-button @click="PriorityCancel(item, index)" :disabled="!studentRepick || (timeState === 1) || (timeState === 5) || (timeState === 3)" v-if="logic === 2 && item.isSelected === 2" :class="{cancleCourse: studentRepick && (timeState === 2 || timeState === 4)}">取消选课</el-button>
              <el-button @click="signCourse(item, index)" :disabled="list.length >= canSelectedNum || item.limitNum <= item.choiceCount || timeState === 1 || timeState === 3 || timeState === 5" v-if="logic === 1 && item.ifChoice === 0" :class="{signUpCourse: list.length < canSelectedNum && (item.limitNum > item.choiceCount) && (timeState === 2 || timeState === 4)}">报名课程</el-button>
              <el-button v-if="logic === 2 && item.isSelected === 1" :disabled="list.length >= canSelectedNum || timeState === 1 || timeState === 3 || timeState === 5" :class="{joinList: list.length < canSelectedNum && (timeState === 2 || timeState === 4)}" @click="joinList(item, index)">加入选课单</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </main>

    <el-dialog
      title="我的选课单"
      :visible.sync="dialogVisible"
      size="tiny">
      <p>{{ name }} > <span>已选课程</span></p>
      <p>选课时间：{{ startTime | dateFormat('yyyy-MM-dd HH:mm')}} <span style="margin: 10px;">至</span> {{ endTime | dateFormat('yyyy-MM-dd HH:mm')}} </p>
      <span v-if="logic === 2">提示：按志愿的顺序录取课程，优先录取第一志愿的课程，第一志愿落选，再录取第二志愿，以此类推。</span>
      
      <el-table
        :data="list"
        v-if="logic === 1"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="typeName"
          label="课程类别"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="lessonName"
          label="课程名称"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="任课教师"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="limitNum"
          label="人数限额"
          width="130">
        </el-table-column>
        <el-table-column
          prop="choiceCount"
          label="已选人数"
          width="190">
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template scope="scope">
            <el-tooltip  effect="dark" content="取消选课" placement="right">
              <el-button size="small" :disabled="!studentRepick || (timeState === 1) || (timeState === 5)" @click="cancleSelectedCourse(scope.row, scope.$index)" type="danger"><i class="iconfont icon-quxiao"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="list"
        v-if="logic === 2"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="志愿顺序"
          min-width="80">
          <template scope="scope">
            <span>第{{ scope.$index + 1 | num }}志愿</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="课程类别"
          show-overflow-tooltip
          min-width="90">
        </el-table-column>
        <el-table-column
          prop="lessonName"
          label="课程名称"
          show-overflow-tooltip
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="teacherName"
          show-overflow-tooltip
          label="任课老师"
          width="100">
        </el-table-column>
        <el-table-column
          prop="limitNum"
          label="人数限额"
          show-overflow-tooltip
          width="90">
        </el-table-column>
        <el-table-column
          prop="choiceCount"
          label="已选人数"
          show-overflow-tooltip
          width="90">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template scope="scope">
            <el-tooltip  effect="dark" :enterable="false" content="上移" placement="right">
              <el-button :disabled="endTime < new Date().getTime()" size="small" @click="moveUp(scope.row, scope.$index)" type="primary"><i class="iconfont icon-shangyi"></i></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" :enterable="false" content="下移" placement="right">
              <el-button :disabled="endTime < new Date().getTime()" size="small" @click="moveDown(scope.row, scope.$index)" type="primary"><i class="iconfont icon-xiayi"></i></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" :enterable="false" content="取消选课" placement="right">
              <el-button size="small" :disabled="!studentRepick || (timeState === 1) || (timeState === 5)" @click="cancleSelectedCourse(scope.row, scope.$index)" type="danger"><i class="iconfont icon-quxiao"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          <span v-if="logic === 2">取 消</span>  
          <span v-if="logic === 1">关 闭</span>
        </el-button>
        <el-button v-if="logic === 2" @click="selectedCourse">提 交</el-button>
      </span>
    </el-dialog>  
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import service from '../../utils/axios'
import { notice, success } from '../../api/index.js'
export default {
  name: 'sLesson',
  data () {
    return {
      dialogVisible: false,
      name: '',
      activityId: '',
      logic: '',
      typeId: '',
      startTime: '',
      endTime: '',
      value: '',
      options: [],
      canSelectedNum: '',
      hasSelectedNum: '',
      courseList: [],
      list: [],
      studentRepick: '',
      timeState: '',
      canLeave: true
    }
  },
  methods: {
    // 报名课程
    signCourse (item, index) {
      this.selectedCourse(item)
      this.getAllChoiceLesson()
    },
    // 查看详情
    lookDetail (item, index) {
      let parameter = {
        lessonId: item.id,
        logic: this.logic,
        count: this.canSelectedNum,
        timeState: this.timeState,
        limitNum: item.limitNum,
        choiceCount: item.choiceCount
      }
      sessionStorage.HAS_COURSE_LIST = JSON.stringify(this.list)
      this.$router.push({path: '/s/detail', query: {parameter: JSON.stringify(parameter)}})
    },
    // 选课
    selectedCourse (item) {
      let lessonIds
      let wishLevels = []
      if (this.logic === 1) {
        wishLevels = []
        if (item.lessonId) {
          lessonIds = item.lessonId
        }
      } else {
        if (this.canSelectedNum > this.list.length) {
          notice(this, `您还没有选够${this.canSelectedNum}门课程`, 2000)
          return
        }
        lessonIds = this.list.map(n => n.lessonId).join(',')
        if (this.list.length !== 0) {
          this.list.forEach((child, index) => {
            wishLevels.push(index + 1)
          })
        }
      }
      service.post('/sLessonController/addStudentChoiceLesson', ({
        lessonIds: lessonIds,
        activityId: this.activityId,
        wishLevels: wishLevels.join(',')
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.dialogVisible = false
          let message = ''
          if (this.logic === 1) {
            message = '报名成功'
            this.getStudentCanAndChoiceLessonList()
            this.getMyChoiceLesson()
          } else {
            message = '提交成功'
            this.canLeave = true
          }
          success(this, message, 1000)
          this.getAllChoiceLesson()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 加入选课单
    joinList (item, index) {
      if (this.canSelectedNum <= this.list.length) {
        notice(this, `您已经选择了${this.canSelectedNum}门课程`, 2000)
        return
      }
      let a = 0
      if (this.list.length !== 0) {
        this.list.forEach((child) => {
          if (child.lessonId === item.lessonId) {
            a = 1
            notice(this, '选单中已有该课程', 2000)
          }
        })
      }
      if (a === 0) {
        item.isSelected = 2
        this.list.push(item)
        this.canLeave = false
        success(this, '加入选课单成功', 1000)
      }
    },
    // 取消选课-优先级
    PriorityCancel (item, index) {
      if (this.list.length !== 0) {
        this.list.forEach((child, i) => {
          if (item.lessonId === child.lessonId) {
            item.isSelected = 1
            this.list.splice(i, 1)
          }
        })
      }
    },
    // 取消选课
    cancleSelectedCourse (item, index) {
      if (this.logic === 1) {
        service.post('/sLessonController/cancelLesson', ({
          lessonId: item.lessonId
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '取消选课成功', 1000)
            this.getMyChoiceLesson()
            this.getStudentCanAndChoiceLessonList()
            this.getAllChoiceLesson()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else {
        if (this.list.length !== 0) {
          this.list.splice(index, 1)
          this.canLeave = false
          this.courseList.forEach((child, i) => {
            if (item.lessonId === child.id) {
              child.isSelected = 1
            }
          })
        }
      }
    },
    // 上移
    moveUp (child, index) {
      if (index !== 0) {
        let list = [...this.list]
        this.list.splice(index, 1, list[index - 1])
        this.list.splice(index - 1, 1, list[index])
        this.canLeave = false
      }
    },
    // 下移
    moveDown (child, index) {
      if (index !== this.list.length - 1) {
        let list = [...this.list]
        this.list.splice(index, 1, list[index + 1])
        this.list.splice(index + 1, 1, list[index])
        this.canLeave = false
      }
    },
    activityChange () {
      this.getStudentCanAndChoiceLessonList()
    },
    // 我的选课单按钮
    myList () {
      this.dialogVisible = true
    },
    // 获取我的选课单列表
    getMyChoiceLesson () {
      service.get(`/sLessonController/getMyChoiceLesson?activityId=${this.activityId}`)
      .then(res => {
        if (res.data.code === 1) {
          if (Number(this.$route.query.courseId) === 1) {
            if (this.logic === 1) {
              this.list = res.data.result
            } else {
              this.list = JSON.parse(sessionStorage.HAS_COURSE_LIST)
            }
          } else {
            this.list = res.data.result
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取当前选课活动
    getActivityList () {
      service.get(`/sLessonController/getAllChoiceLesson?typeId=${''}`)
      .then(res => {
        if (res.data.code === 1) {
          this.activityId = res.data.result.electiveActivity.id
          // （1-先到先得、2-优先级）
          this.logic = res.data.result.electiveActivity.logic
          this.studentRepick = res.data.result.electiveActivity.studentRepick
          this.name = JSON.parse(localStorage.SEMESTERLIST).filter(item => item.state === 1)[0].semesterName + '  ' + res.data.result.electiveActivity.name
          this.getMyChoiceLesson()
          setTimeout(() => {
            this.getAllChoiceLesson()
          }, 200)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取基本信息
    getAllChoiceLesson () {
      service.get(`/sLessonController/getAllChoiceLesson`)
      .then(res => {
        if (res.data.code === 1) {
          let data = res.data.result
          if (this.typeId === '') {
            this.options = data.typeList
            this.options.unshift({ id: '', name: '全部' })
            this.timeState = data.electiveActivity.timeState
            if (this.timeState === 1 || this.timeState === 2) {
              this.startTime = data.electiveActivity.primaryStartTime
              this.endTime = data.electiveActivity.primaryEndTime
            } else {
              if (data.electiveActivity.secondStartTime) {
                this.startTime = data.electiveActivity.secondStartTime
                this.endTime = data.electiveActivity.secondEndTime
              } else {
                this.startTime = data.electiveActivity.primaryStartTime
                this.endTime = data.electiveActivity.primaryEndTime
              }
            }
          }
          this.hasSelectedNum = data.studentChoiceEdetails.choiceCount
          this.canSelectedNum = data.studentChoiceEdetails.canChoiceCount
          this.getStudentCanAndChoiceLessonList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取当前学生已选的和可选的课程列表
    getStudentCanAndChoiceLessonList () {
      service.get(`/sLessonController/getStudentCanAndChoiceLessonList?typeId=${this.value}&activityId=${this.activityId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.courseList = res.data.result.map(item => ({...item, lessonId: item.id, isSelected: 1}))
          this.courseList.forEach((item, index) => {
            this.list.forEach((child) => {
              if (item.lessonId === child.lessonId) {
                item.isSelected = 2
              }
            })
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'semesterList'
    ])
  },
  beforeRouteLeave (to, from, next) {
    console.log(this.list)
    if (to.path === '/s/detail') {
      next()
    } else {
      if (this.logic === 2) {
        if (!this.canLeave) {
          this.$confirm('您还没有提交选课结果，确定离开吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            next()
          }).catch(() => {
            next(false)
          })
        } else {
          next()
        }
      } else {
        next()
      }
    }
  },
  created () {
    if (this.semesterList.length !== 0) {
      localStorage.SEMESTERLIST = JSON.stringify(this.semesterList)
    }
    this.getActivityList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.sLesson {
  margin: $width * 0.5 $width;

  .activity-name {
    .el-col {
      span {
        color: #7BB2FE;
      }
    }
  }

  header {
    margin-top: $width*1.5;
    padding: $width*2;
    background: #fff;
    border-radius: 4px;

    .el-row {
      margin-top: $width;

      .el-col:first-child {
        .el-input {
          width: 360px;
        }
      }

      .el-col:last-child {
        text-align: right;
        margin-top: $width/2;
      }
    }
  }

  main {
    margin-top: $width;

    &>p {
      img {
        vertical-align: middle;
        margin-right: $width;
        margin-top: -$width/4;
      }

      span:first-child {
        color: #ECA01D;
      }

      span:nth-child(2) {
        margin-left: $width;
        color: #7BB2FE;
      }

      i {
        font-style: normal;
        margin-left: $width;
        color: #C0C0C0;
        font-size: 12px;
      }
    }

    &>article {
      margin-top: $width*3;
      text-align: center;
      color: #5E7382;
    }

    &>div {
      margin-top: $width;

      .box-card {
        display: inline-block;
        width: 240px;
        margin-right: 45px;
        margin-bottom: $width;

        .el-card__header {
          background: #6fa9fe;
          height: 40px;
          padding: 0;
          line-height: 40px;
          font-size: 15px;
          font-weight: bold;
          i {
            display: block;
            width: 0;
            border: 6px solid transparent;
            border-top-color: #6fa9fe;
            margin-top: -1px;
          }

          .clearfix {
            margin-left: $width;
            color: #fff;
          }
        }
        
        .el-card__body {
          padding-right: $width/5;
        }

        .body {
          
          &>p {
            margin-top: $width/2;
          }
          &>div {
            margin-top: $width;

            .el-button:first-child {
              border-color: #6AD969;
              color: #6AD969;
              border-radius: 6px;

              &:hover {
                background: #6AD969;
                color: #fff;
              }
            }

            .signUpCourse,.joinList {
              border-color: #7BB2FE;
              color: #7BB2FE;
              border-radius: 6px;

              &:hover {
                background: #7BB2FE;
                color: #fff;
              }
            }

            .cancleCourse {
              border-color: #FF6040;
              color: #FF6040;
              border-radius: 6px;

              &:hover {
                background: #FF6040;
                color: #fff;
              }
            }

            .not-cancle-course {
              border-color: #fff;
              color: #fff;
              border-radius: 6px;
            }
          }
        }
      }
    }
  }

  // 我的选课单
  .el-dialog {
    width: 880px;

    .el-dialog__body {
      height: 450px;
      overflow-x: hidden;
      &>p {
        margin-bottom: $width*0.8;
      }

      &>span {
        color: #C0C0C0;
        font-size: 12px;
      }

      .el-table {
        margin-top: $width/4;
        border:1px solid #BBBBBB;

        th {
          background: #E5E5E5;
          border-right:1px solid #BBBBBB;
          border-bottom:1px solid #BBBBBB;

          .cell {
            background: #E5E5E5;
          }
        }

        td {
          border-right:1px solid #BBBBBB;
          border-bottom:1px solid #BBBBBB;
        }
        
        .cell {
          text-align: center;
        }
      }
    }

    .el-dialog__footer {

      .el-button:first-child {
        border: 1px solid #FF6040;
        color: #FF6040;
        &:hover {
          background: #FF6040;
          color: #fff;
        }
      }

      .el-button:last-child{
        border: 1px solid #7BB2FE;
        color: #7BB2FE;
        &:hover {
          background: #7BB2FE;
          color: #fff;
        }
      }
    }
  }
}
</style>
