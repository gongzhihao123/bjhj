<template>
  <div id="check">
    <nav>
      <ul>
        <li class="active">
          备课检查
        </li>
      </ul>
      <!--<span>返回上一层</span>-->
    </nav>
    <!--顶部筛选-->
    <header>
      <div>
        <span>
          <span>学期：</span>
          <el-select v-model="semesterValue" @change="semesterSelect">
            <el-option
              v-for="item in semesterList"
              :key="item.semesterId"
              :label="item.semesterName"
              :value="item.semesterId">
            </el-option>
          </el-select>
        </span>
        <span>或</span>
        <span>
          <span>时间：</span>
          <el-date-picker
            v-model="startDateValue"
            :clearable="true"
            type="date"
            placeholder="选择起始日期"
            @change="startTimeChange">
          </el-date-picker>
          <span class="zhi">至</span>
          <el-date-picker
            v-model="endDateValue"
            type="date"
            placeholder="选择终止日期"
            @change="endTimeChange">
          </el-date-picker>
        </span>
      </div>
      <p class="course">
        <i>年级：</i>
        <span  v-for="(item, index) in gradeList" :key="index" @click="gradeSelect(item, index)" v-bind:class="{active: gradeActive===index}">
          {{item.gradeName}}
        </span>
      </p>
      <transition name="slide-left" mode="out-in">
        <div class="course" v-if="courseList.length !== 0">
          <i>学科：</i>
          <div>
            <span  v-for="(item, index) in courseList" :key="index" @click="courseSelect(item, index)" v-bind:class="{active: courseActive===index}">
              {{item.courseName}}
            </span>
          </div>
        </div>
      </transition>
      <p class="search">
        <i>搜索：</i>
        <transition-group name="slide-left" mode="out-in">
          <span  v-for="(item, index) in searchList" :key="index">
            {{item.name}}
            <span @click="delSearList(item, index)">X</span>
          </span>
        </transition-group>
        <b v-if="searchList.length !== 0" @click="clearSearch">清空筛选</b>
      </p>
    </header>
    <!--列表部分-->
    <div class="teacher-list">
      <p class="evaluation-button">
        <el-button @click="evaluationResult" @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true">
          评价结果
          <img v-if="borderOne" src="../../assets/images/border.png">
        </el-button>
      </p>
      <el-row class="main-top">
        <el-col :span="5">
          教师姓名
        </el-col>
        <el-col :span="5">
          年级
        </el-col>
        <el-col :span="5">
          学科
        </el-col>
        <el-col :span="4">
          教案数量
        </el-col>
        <el-col :span="5">
          操作
        </el-col>
      </el-row>
      <el-row class="main-body" v-for="(item, index) in list" :key="index">
          
        <el-col :span="5">
          <span @click="lookDetails(item)">
            {{item.createdUserName}}
          </span>
        </el-col>
        <el-col :span="5">
          {{item.gradeName}}
        </el-col>
        <el-col :span="5">
          {{item.courseName}}
        </el-col>
        <el-col :span="4">
          {{item.count ? item.count : '--'}}
        </el-col>
        <el-col :span="5">
          <el-button @click="lookDetails(item)">查看详情</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { notice, error } from '../../api/index.js'
import { mapActions, mapGetters } from 'vuex'
import { dateFormatT } from '../../filters/index.js'
export default {
  name: 'check',
  data () {
    return {
      gradeActive: '',
      borderOne: true,
      courseActive: '',
      gradeList: [],
      courseList: [],
      searchList: [],
      semesterValue: '',
      semesterList: [],
      gradeId: '',
      courseId: '',
      gradeName: '',
      courseName: '',
      startDateValue: '',
      endDateValue: '',
      startTime: '',
      sectionId: '',
      endTime: '',
      list: [],
      userId: ''
    }
  },
  methods: {
    ...mapActions([
      'detail'
    ]),
    // 查看详情按钮
    lookDetails (item) {
      this.detail(item)
      var time = {
        semesterValue: this.semesterValue,
        startTime: this.startTime,
        endTime: this.endTime
      }
      time = JSON.stringify(time)
      this.$router.push({path: `/check/lessonPlanDetails`, query: {time: time}})
    },
    // 评价结果按钮
    evaluationResult () {
      let parameter = {}
      parameter = {
        gradeName: this.gradeName,
        courseName: this.courseName,
        startTime: this.startTime,
        endTime: this.endTime,
        courseId: this.courseId,
        gradeId: this.gradeId,
        semesterId: this.semesterValue,
        sectionId: this.sectionId
      }
      parameter = JSON.stringify(parameter)
      this.$router.push({path: `/check/evaluationResult`, query: {parameter}})
    },
    // 选择起始时间
    startTimeChange () {
      if (this.startDateValue) {
        if (this.endDateValue) {
          if (this.startDateValue.getTime() > this.endDateValue.getTime()) {
            notice(this, '起始日期应早于截止日期', 2000)
          } else {
            this.startTime = dateFormatT(this.startDateValue.getTime(), 'yyyy-MM-dd hh:mm:ss')
            this.endTime = dateFormatT(this.endDateValue.getTime() + 86400000, 'yyyy-MM-dd hh:mm:ss')
            this.getLessonCheckList()
          }
        }
      } else {
        if (this.endDateValue) {
          this.startTime = ''
          this.endTime = dateFormatT(this.endDateValue.getTime() + 86400000, 'yyyy-MM-dd hh:mm:ss')
          this.getLessonCheckList()
        } else {
          this.startTime = ''
          this.endTime = ''
          this.getLessonCheckList()
        }
      }
    },
    // 选择截止时间
    endTimeChange () {
      if (this.endDateValue) {
        if (this.startDateValue) {
          if (this.startDateValue.getTime() > this.endDateValue.getTime()) {
            notice(this, '起始日期应早于截止日期', 2000)
          } else {
            this.startTime = dateFormatT(this.startDateValue.getTime(), 'yyyy-MM-dd hh:mm:ss')
            this.endTime = dateFormatT(this.endDateValue.getTime() + 86400000, 'yyyy-MM-dd hh:mm:ss')
            this.getLessonCheckList()
          }
        }
      } else {
        if (this.startDateValue) {
          this.startTime = dateFormatT(this.startDateValue.getTime() + 86400000, 'yyyy-MM-dd hh:mm:ss')
          this.endTime = ''
          this.getLessonCheckList()
        } else {
          this.startTime = ''
          this.endTime = ''
          this.getLessonCheckList()
        }
      }
    },
    // 清空搜索列表
    clearSearch () {
      this.searchList = []
      this.gradeId = ''
      this.courseId = ''
      this.gradeName = ''
      this.courseName = ''
      this.getLessonCheckList()
    },
    // 删除搜索列表
    delSearList (item, index) {
      this.searchList.splice(index, 1)
      if (item.type === 'grade') {
        this.gradeId = ''
        this.gradeName = ''
      }
      if (item.type === 'course') {
        this.courseId = ''
        this.courseName = ''
      }
      this.getLessonCheckList()
    },
    // 选择学期
    semesterSelect () {
      this.getGradeList()
      this.searchList = []
      this.courseList = []
      this.searchList.forEach((item, index) => {
        if (item.type === 'grade') {
          this.searchList.splice(index, 1)
        }
        if (item.type === 'course') {
          this.searchList.splice(index, 1)
        }
      })
      this.gradeId = ''
      this.courseId = ''
      this.getLessonCheckList()
      // this.getCourseList()
    },
    // 选择年级
    gradeSelect (item, index) {
      this.gradeActive = index
      this.gradeId = item.gradeId
      this.gradeName = item.gradeName
      let n = 0
      n = (this.searchList.filter(item => item.type === 'grade')).length
      if (n === 0) {
        this.searchList.push({id: item.gradeId, name: item.gradeName, type: 'grade'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'grade') {
            if (item.gradeId === val.id) {
              this.searchList.splice(index, 1)
              this.gradeId = ''
              this.courseId = ''
              return
            }
            this.searchList.splice(index, 1, {id: item.gradeId, name: item.gradeName, type: 'grade'})
          }
        })
      }
      this.searchList.forEach((item, index) => {
        if (item.type === 'course') this.searchList.splice(index, 1)
      })
      this.getCourseList()
      this.getLessonCheckList()
    },
    // 选择学科
    courseSelect (item, index) {
      this.courseActive = index
      this.courseId = item.courseId
      this.courseName = item.courseName
      let n = 0
      n = (this.searchList.filter(item => item.type === 'course')).length
      if (n === 0) {
        this.searchList.push({id: item.courseId, name: item.courseName, type: 'course'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'course') {
            if (item.courseId === val.id) {
              this.searchList.splice(index, 1)
              this.courseId = ''
              return
            }
            this.searchList.splice(index, 1, {id: item.courseId, name: item.courseName, type: 'course'})
          }
        })
      }
      this.getLessonCheckList()
    },
    // 获取学期信息
    getSemesterList () {
      this.$https.get(`/common/selectSemesterList`)
      .then(res => {
        if (res.data.code === 1) {
          this.semesterList = res.data.result
          if (this.semesterList.length !== 0) {
            this.semesterValue = (res.data.result || []).filter(item => item.state === 1)[0].semesterId
          }
          // 获取学段
          this.$https.get(`/check/lessonCheckSectionList?semesterId=${this.semesterValue}&userId=${this.userId}`)
          .then(res => {
            if (res.data.code === 1) {
              if (res.data.result) this.sectionId = res.data.result.sectionId
              this.getGradeList()
            } else if (res.data.code === -2) {
              // notice(this, res.data.message, 2000)
            }
          })
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取年级信息列表
    getGradeList () {
      this.$https.get(`/check/lessonCheckGradeList?sectionId=${this.sectionId}&userId=${this.userId}&semesterId=${this.semesterValue}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学科信息列表
    getCourseList () {
      this.$https.get(`/check/lessonCheckCourseList?sectionId=${this.sectionId}&userId=${this.userId}&gradeId=${this.gradeId}&semesterId=${this.semesterValue}`)
      .then(res => {
        if (res.data.code === 1) {
          this.courseList = res.data.result
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取备课检查列表
    getLessonCheckList () {
      this.$https.get(`/check/lessonCheckList?startTime=${this.startTime}&endTime=${this.endTime}&courseId=${this.courseId}&gradeId=${this.gradeId}&semesterId=${this.semesterValue}&sectionId=${this.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result
        } else if (res.data.code === -2) {
          // notice(this, res.data.message, 2000)
        }
      })
    }
  },
  watch: {
    searchList () {
      if (this.searchList.filter(item => item.type === 'grade').length === 0) this.gradeActive = ''
      if (this.searchList.filter(item => item.type === 'course').length === 0) this.courseActive = ''
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    this.userId = this.user.user.loginUser.id
    this.getSemesterList()
    setTimeout(() => {
      this.getLessonCheckList()
    }, 400)
  }
}
</script>
<style lang="scss">
@import  '../../assets/scss/main.scss';
#check{
width: 100%;
  height: auto;
  margin: 0px;
  padding: 0px;
  padding-bottom: 100px;
  // 顶部导航
  nav{
    height: 42px;
    background: #DDE6EF;
    padding-top: $width/2;
    box-sizing: border-box;
    padding-left: 66px;
    &>ul{
      margin: 0;
      li{
        float: left;
        list-style: none;
        border-radius: 8px;
        padding: 13px;
        padding-top: 6px;
        color: #737C8A;
        margin-right: 10px;
        cursor: pointer;
        &.active{
          background: $white;
          color: #76AEED;
        }
      }
    }
    &>span{
      margin-right: 20px;
      cursor: pointer;
      float: right;
      height: 25px;
      line-height: 25px;
      color: #6D7684;
      padding-left: 30px;
      background: url(../../assets/images/back.png) no-repeat;
      &:hover{
        color: #408EE6;
        background: url(../../assets/images/back-active.png) no-repeat;
      }
    }
  }
  // 筛选目录
  header{
    padding: 20px 70px 20px;
    border-bottom: 1px solid #ddd;
    &>div{
      // padding-bottom: 15px;
      span{
        .el-select{
          width: 200px;
          .el-input__inner{
            width: 200px;
          }
        }
        span{
          color: #636C7B;
        }
        .el-date-editor{
          margin-left: 10px;
        }
        .zhi{
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 3px;
          background: #9FD35D;
          color: #fff;
          padding:2px 0px 2px 5px;
          margin-left: 10px;
        }
      }
      span:nth-child(2) {
        color: #636C7B;
        margin:0 20px 0 40px;
      }
      .el-input{
        margin-left: 20px;
      }
    }
    .course{
      margin-top: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      i {
        min-width: 50px;
      }
      div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        & > span {
          padding: 0;
          margin: 0;
          margin: 0 $width/2;
          padding:1px  15px;
          border-radius: 13px;
          border: 1px solid transparent;
          cursor: pointer;
        }
      }
       &>span{
        display: inline-block;
        color: #6B7482;
        margin: 0 $width/2;
        padding:1px  15px;
        border-radius: 13px;
        border: 1px solid transparent;
        cursor: pointer;
        &:hover{
          border: 1px solid #408EE6;
        }
      }
      .active{
        background: #408EE6;
        color: $white;
      }
      i{
        font-style: normal;
        color: #6B7482;
      }
    }
    .search{
      margin-top: 20px;
      i{
        font-style: normal;
        color: #6B7482;
      }
      &>span>span{
        display: inline-block;
        color: #6B7482;
        margin: 0 $width/2;
        padding:1px  15px;
        border-radius: 13px;
        border: 1px solid #C6CED9;
        line-height: 23px;
        span{
          margin-left: 5px;
          line-height: 15px;
          display: inline-block;
          width: 14px;
          height: 14px;
          cursor: pointer;
          border-radius: 50%;
          font-size: 8px;
          text-align: center;
          &:hover{
            background: #FF6C60;
            color: #fff;
          }
        }
      }
      b{
        font-weight: normal;
        color: #4792E7;
        cursor: pointer;
      }
    }
  }
  .teacher-list{
    padding: 0 70px;
    .evaluation-button{
      padding: 20px;
      text-align: right;
      .el-button{
        position: relative;
        padding: 6px 15px;
        border-color: #408EE6;
        color: #408EE6;
        margin-left: 10px;
        &:hover{
          background: #408EE6;
          color: $white;
        }
        img{
          position: absolute;
          top: -2px;
          right: 5px;
        }
      }
    }
    .main-top{
      background: #DDE6EF;
      line-height: 40px;
      border-radius: 5px;
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
      .el-col:first-child{
        span{
          cursor: pointer;
        }
      }
      .el-col:last-child{
        .el-button{
          border-color: #A2AECD;
          padding: 5px 10px;
          span{
            color: #B4BDD6;
          }
          &:hover{
            background: #408EE6;
            span{
              color: #fff;
            }
            border-color: #408EE6;
          }
        }
      }
    }
  }
}
</style>
