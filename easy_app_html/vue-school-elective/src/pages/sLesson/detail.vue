<template>
  <div class="detail">
    
    <header>
      {{detailContent.name}}
    </header>

    <main>

      <el-row>
        <el-col :span="3">
          <span>课程类别：</span>
        </el-col>
        <el-col :span="21">
          {{ detailContent.typeName }}
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">
          <span>授课教师：</span>
        </el-col>
        <el-col :span="21">
          {{ detailContent.teacherName }}
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">
          <span>教师简介：</span>
        </el-col>
        <el-col :span="21" v-html="detailContent.teacherIntro">
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">
          <span>课程简介：</span>
        </el-col>
        <el-col :span="21" v-html="detailContent.lessonIntro">
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">
          <span>人数限额：</span>
        </el-col>
        <el-col :span="21">
          {{ detailContent.limitNum }}
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">
          <span>已选人数：</span>
        </el-col>
        <el-col :span="21">
          {{ detailContent.hasChoiceCount }}
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">
          <span>上课时间：</span>
        </el-col>
        <el-col :span="21">
          星期{{ detailContent.week }}第{{ detailContent.section }}节课
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">
          <span>上课地点：</span>
        </el-col>
        <el-col :span="21">
          {{ detailContent.locationName }}
        </el-col>
      </el-row>

      <div class="footer">
        <el-button @click="cancleSelectedCourse" v-if="logic === 1 && detailContent.ifChoice === 1" class="cancleCourse">取消选课</el-button>
        <el-button @click="signList" :disabled="canJoin || timeState === 1 || timeState === 3 || timeState === 5" v-if="logic === 2" :class="{signUpCourse: !canJoin && (limitNum > choiceCount) && (timeState === 2 || timeState === 4)}">加入选课单</el-button>
        <el-button @click="signCourse" v-if="logic === 1 && detailContent.ifChoice === 0" :disabled="canJoin || timeState === 1 || timeState === 3 || timeState === 5" :class="{signUpCourse: !canJoin && (timeState === 2 || timeState === 4)}">报名课程</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </main>

  </div>
</template>

<script>
import service from '../../utils/axios'
import { notice, success } from '../../api/index.js'
export default {
  name: 'detail',
  data () {
    return {
      lessonId: '',
      detailContent: '',
      logic: '',
      canJoin: false,
      timeState: '',
      limitNum: '',
      choiceCount: '',
      list: []
    }
  },
  methods: {
    // 加入选课单
    signList () {
      this.detailContent.lessonId = this.detailContent.id
      this.detailContent.lessonName = this.detailContent.name
      this.detailContent.choiceCount = this.detailContent.hasChoiceCount
      sessionStorage.HAS_COURSE_LIST = JSON.stringify(this.list.concat(this.detailContent))
      success(this, '加入选课单成功', 1000)
      this.canJoin = true
    },
    // 取消选课
    cancleSelectedCourse () {
      service.post('/sLessonController/cancelLesson', ({
        lessonId: this.detailContent.id
      }))
      .then(async res => {
        if (res.data.code === 1) {
          success(this, '取消选课成功', 1000)
          await this.getDetail()
          this.canJoin = false
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 报名课程
    signCourse () {
      service.post('/sLessonController/addStudentChoiceLesson', ({
        lessonIds: this.detailContent.id,
        activityId: this.detailContent.activityId,
        wishLevels: ''
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '报名成功', 1000)
          this.getDetail()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 返回
    goBack () {
      this.$router.push({path: '/s/lesson', query: {courseId: 1}})
    },
    async getDetail () {
      await service.get(`/sLessonController/getLessonEdetails?lessonId=${this.lessonId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detailContent = res.data.result
          if (JSON.parse(sessionStorage.HAS_COURSE_LIST).length >= JSON.parse(this.$route.query.parameter).count) {
            this.canJoin = true
          }
          if (JSON.parse(sessionStorage.HAS_COURSE_LIST).length !== 0) {
            JSON.parse(sessionStorage.HAS_COURSE_LIST).forEach((item, index) => {
              if (item.lessonId === this.detailContent.id) {
                this.canJoin = true
              }
            })
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.lessonId = JSON.parse(this.$route.query.parameter).lessonId
    this.logic = JSON.parse(this.$route.query.parameter).logic
    this.timeState = JSON.parse(this.$route.query.parameter).timeState
    this.choiceCount = JSON.parse(this.$route.query.parameter).choiceCount
    this.limitNum = JSON.parse(this.$route.query.parameter).limitNum
    this.list = JSON.parse(sessionStorage.HAS_COURSE_LIST)
    this.getDetail()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.detail{
  margin: $width/2;
  
  main{
    margin-top: $width;
    padding: $width*1.5 $width*2;
    background: #fff;
    border-radius: 4px;

    .el-row{
      margin-bottom: $width;

      .el-col:first-child{
        span{
          display: inline-block;
          color: #84B7FE;
          border-left: 2px solid #84B7FE;
          padding-left: $width;
        }
      }
    }

    .footer{
      text-align: right;
      margin-top: $width*2;

      .signUpCourse{
        border-color: #7BB2FE;
        color: #7BB2FE;
        border-radius: 6px;

        &:hover{
          background: #7BB2FE;
          color: #fff;
        }
      }

      .cancleCourse{
        border-color: #FF6040;
        color: #FF6040;
        border-radius: 6px;

        &:hover{
          background: #FF6040;
          color: #fff;
        }
      }

      .el-button:last-child{
        border: 1px solid #6DDA6D;
        color: #6DDA6D;
        &:hover{
          background: #6DDA6D;
          color: #fff;
        }
      }
    }
  }
}
</style>
