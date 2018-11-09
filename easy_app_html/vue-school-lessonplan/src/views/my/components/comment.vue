<template>
  <div id="comment">
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
      <transition name="slide-down" mode="out-in">
        <div class="course">
          <i>年级：</i>
          <span v-for="(item, index) in gradeList" :key="index" @click="gradeSelect(item, index)" :class="{active: gradeActive===index}">
            {{item.gradeName}}
          </span>
        </div>
      </transition>
      <transition name="slide-down" mode="out-in">
        <div class="course">
          <i>学科：</i>
          <div>
            <span v-for="(item, index) in courseList" :key="index" @click="courseSelect(item, index)" :class="{active: courseActive===index}">
              {{item.curriculumName}}
            </span>
          </div>
        </div>
      </transition>
      <!--搜索-->
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
      <div v-if="Number(receviedNum) !== 0" class="recevied-num my-recevied">
        {{receviedNum}}
      </div>
    </header>
    <!--主体部分-->
    <main>
      <el-input placeholder="输入关键字检索" :maxlength="50" @keyup.enter.native="handleIconClick" :on-icon-click="handleIconClick" v-model="title" icon="search"></el-input>
      
      <el-row class="main-top">
        <el-col :span="6">
          教案名称
        </el-col>
        <el-col :span="6">
          评分时间
        </el-col>
        <el-col :span="6">
          评价分数
        </el-col>
        <el-col :span="6">
          操作
        </el-col>
      </el-row>
      <p style="text-align: center;margin-top: 20px;color: #636C7F;" class="no-result" v-if="list.length === 0">暂无数据</p>
      <el-row class="main-body" v-for="(item, index) in list" :key="index">
          
        <el-col :span="6" :style="{lineHeight: item.rowHeight}">
          <span>
            {{item.title}}
          </span>
        </el-col>
        <el-col :span="6">
          <el-row v-if="item.scores.length !== 0" v-for="(child, n) in item.scores" :key="n">{{child.createdTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</el-row>
          <el-row v-if="item.scores.length === 0">--</el-row>
        </el-col>
        <el-col :span="6">
          <el-row v-if="item.scores.length !== 0" v-for="(child, n) in item.scores" :key="n">{{child.score}}</el-row>
          <el-row v-if="item.scores.length === 0">--</el-row>
        </el-col>
        <el-col :span="6">
          <el-row v-if="item.scores.length !== 0" v-for="(child, n) in item.scores" :key="n">
            <el-button @click="getCommentedDetail(item, child)">查看详情</el-button>
          </el-row>
          <el-row v-if="item.scores.length === 0">--</el-row>
        </el-col>
      </el-row>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </main>
    <!--我收到的评论详情弹出框-->
    <el-dialog
      title="我收到的评价详情"
      v-model="commentDialogVisible"
      :show-close="false"
      class="comment-dialog"
      size="tiny">
      <div>
        <el-row class="comment-dialog-name">
          <el-col :span="8">评价项目</el-col>
          <el-col :span="8">满分</el-col>
          <el-col :span="8">我的分数</el-col>
        </el-row>
        <el-row class="comment-dialog-details" v-for="(item, index) in commentDetailsList" :key="index">
          <el-col :span="8">{{item.title}}</el-col>
          <el-col :span="8">{{item.score}}</el-col>
          <el-col :span="8">{{item.actScore}}</el-col>
        </el-row>
        <el-row class="comment-dialog-details">
          <el-col :span="16">合计</el-col>
          <el-col :span="8">{{totalScore}}</el-col>
        </el-row>
      </div>
      <i @click="commentDialogVisible = false"></i>
      <sup></sup>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commentDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { notice, error } from '../../../api/index.js'
import { mapGetters } from 'vuex'
export default {
  name: 'comment',
  data () {
    return {
      gradeActive: '',
      courseActive: '',
      searchList: [],
      startDateValue: '',
      endDateValue: '',
      commentDialogVisible: false,
      gradeList: [],
      courseList: [],
      semesterValue: '',
      gradeValue: '',
      courseValue: '',
      semesterList: [],
      sectionId: '',
      title: '',
      userId: '',
      pageNo: 1,
      pageCount: 10,
      totalCount: 0,
      totalScore: 0,
      receviedNum: 0,
      list: [],
      startTime: '',
      endTime: '',
      commentDetailsList: []
    }
  },
  methods: {
    // 选择年级
    gradeSelect (item, index) {
      this.gradeActive = index
      this.gradeValue = item.gradeId
      let n = 0
      n = (this.searchList.filter(item => item.type === 'grade')).length
      if (n === 0) {
        this.searchList.push({id: item.gradeId, name: item.gradeName, type: 'grade'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'grade') {
            if (item.gradeId === val.id) {
              this.searchList.splice(index, 1)
              this.gradeValue = ''
              this.courseValue = ''
              return
            }
            this.searchList.splice(index, 1, {id: item.gradeId, name: item.gradeName, type: 'grade'})
          }
        })
      }
      this.courseList = (this.gradeList || []).filter(child => child.gradeId === item.gradeId)[0].courseList
      this.getCommentedList()
      this.searchList.forEach((item, index) => {
        if (item.type === 'course') this.searchList.splice(index, 1)
      })
    },
    // 选择学科
    courseSelect (item, index) {
      this.courseActive = index
      this.courseValue = item.curriculumChooiceId
      let n = 0
      n = (this.searchList.filter(item => item.type === 'course')).length
      if (n === 0) {
        this.searchList.push({id: item.curriculumChooiceId, name: item.curriculumName, type: 'course'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'course') {
            if (item.curriculumChooiceId === val.id) {
              this.searchList.splice(index, 1)
              this.courseValue = ''
              return
            }
            this.searchList.splice(index, 1, {id: item.curriculumChooiceId, name: item.curriculumName, type: 'course'})
          }
        })
      }
      this.getCommentedList()
    },
    // 清空搜索列表
    clearSearch () {
      this.searchList = []
      this.gradeValue = ''
      this.courseValue = ''
      this.parentId = ''
      this.getCommentedList()
    },
    // 删除搜索列表
    delSearList (item, index) {
      this.searchList.splice(index, 1)
      if (item.type === 'grade') this.gradeValue = ''
      if (item.type === 'course') this.courseValue = ''
      this.getCommentedList()
    },
    pickerOptions () {},
    handleSizeChange (val) {
      this.pageCount = val
      this.getCommentedList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getCommentedList()
    },
    semesterSelect () {
      this.getGradeSimpleCourse()
    },
    // 选择起始时间
    startTimeChange () {
      if (this.startDateValue) {
        if (this.endDateValue) {
          if (this.startDateValue.getTime() > this.endDateValue.getTime()) {
            notice(this, '起始日期应早于截止日期', 2000)
          } else {
            this.startTime = this.startDateValue.getTime()
            this.endTime = this.endDateValue.getTime() + 86400000
            this.getCommentedList()
          }
        }
      } else {
        if (this.endDateValue) {
          this.startTime = ''
          this.endTime = this.endDateValue.getTime()
          this.getCommentedList()
        } else {
          this.startTime = ''
          this.endTime = ''
          this.getCommentedList()
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
            this.startTime = this.startDateValue.getTime()
            this.endTime = this.endDateValue.getTime() + 86400000
            this.getCommentedList()
          }
        }
      } else {
        if (this.startDateValue) {
          this.startTime = this.startDateValue.getTime()
          this.endTime = ''
          this.getCommentedList()
        } else {
          this.startTime = ''
          this.endTime = ''
          this.getCommentedList()
        }
      }
    },
    // 搜索
    handleIconClick () {
      this.getCommentedList()
    },
    // 获取学期信息
    getSemesterList () {
      this.$https.get(`/common/selectSemesterList`)
      .then(res => {
        if (res.data.code === 1) {
          this.semesterList = res.data.result
          if (this.semesterList.length !== 0) {
            this.semesterValue = (res.data.result || []).filter(item => item.state === 1)[0].semesterId
            this.getGradeSimpleCourse()
          }
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取教师对应的信息
    getGradeSimpleCourse () {
      this.$https.get(`/common/selectGradeSimpleCourse?teacherId=${this.userId}&semesterId=${this.semesterValue}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result.length !== 0) {
            this.sectionId = res.data.result[0].courseList[0].sectionId
            this.gradeList = res.data.result
            this.courseList = res.data.result[0].courseList
          } else {
            this.sectionId = ''
            this.gradeList = []
            this.courseList = []
          }
          this.getCommentedList()
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取列表
    getCommentedList () {
      this.$https.get(`/mine/commentedList?semesterId=${this.semesterValue}&sectionId=${this.sectionId}&gradeId=${this.gradeValue}&courseId=${this.courseValue}&startTime=${this.startTime}&endTime=${this.endTime}&title=${this.title}&pageNo=${this.pageNo}&pageSize=${this.pageCount}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result.list.map(item => ({...item, rowHeight: (item.scores.length === 0 ? 1 : item.scores.length) * 31 + 'px'}))
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
        this.totalCount = res.data.result.totalCount
      })
    },
    // 查看详情
    getCommentedDetail (item, child) {
      this.$https.get(`/mine/commentedDetail?planId=${item.planId}&userId=${child.userId}`)
      .then(res => {
        this.totalScore = 0
        if (res.data.code === 1) {
          this.commentDialogVisible = true
          this.commentDetailsList = res.data.result
          this.commentDetailsList.forEach((item, index) => {
            this.totalScore += parseFloat(item.actScore)
          })
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    searchList () {
      if (this.searchList.filter(item => item.type === 'grade').length === 0) {
        this.gradeActive = ''
      }
      if (this.searchList.filter(item => item.type === 'course').length === 0) {
        this.courseActive = ''
      }
      this.getCommentedList()
    }
  },
  created () {
    this.receviedNum = sessionStorage.receviedNum
    if (!this.receviedNum) {
      this.receviedNum = 0
    }
    this.userId = this.user.user.loginUser.id
    this.getSemesterList()
  }
}
</script>
<style lang="scss">
@import '../../../assets/scss/main.scss';
#comment{
  // 筛选目录
  header{
    position: relative;
    padding: 20px 70px 0;
    border-bottom: 1px solid #ddd;
    &>div{
      padding-bottom: 15px;
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
        margin:0 10px 0 35px;
      }
      .el-input{
        margin-left: 20px;
      }
    }
    .course{
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
        margin: 0 10px !important;
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
    // 搜索
    .search{
      margin-bottom: 20px;
      i{
        font-style: normal;
        color: #6B7482;
      }
      &>span>span{
        display: inline-block;
        color: #6B7482;
        margin: 0 $width/2;
        padding:1px  15px;
        padding-right: 10px;
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
    &>:last-child{
      border-bottom: 0;
    }
    .recevied-num{
      position: absolute;
      top: -45px;
      left: 225px;
      display: inline-block;
      width: 16px;
      height: 16px;
      background: #FF6C60;
      border-radius: 50px;
      line-height: 16px;
      text-align: center;
      color: #fff;
      padding-bottom: 0;
    }
  }
  // 主体部分
  main{
    padding: 30px 70px;
    padding-bottom: 100px;
    position: relative;
    &>.el-input{
      width: 307px;
      .el-input__inner{
        height: 30px;
      }
    }
    .main-top{
      margin-top: 30px;
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
      .el-col .el-row{
        margin-top: 5px;
      }
      .el-col:first-child{
        line-height: 62px;
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
    .el-pagination{
      position: absolute;
      bottom: 10px;
      right:10px;
    }
  }
  // 我收到的评论详情
  .comment-dialog{
    .el-dialog{
      width: 683px;
      // height: 256px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      .el-dialog__header{
        text-align: center;
        padding:0;
        background: #3281F8;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        span{
          display: inline-block;
          width:100%;
          box-sizing: border-box;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          margin-top: 5px;
          padding: 20px;
          background: #fff;
          color: #408EE6;
          font-weight: normal;
        }
      }
      .el-dialog__body{
        border-top: 1px solid #ddd;
        text-align: center;
        padding: 46px 0;
        margin: 0 46px;
        &>div{
          border: 1px solid #B7C2D0;
          border-radius: 6px;
          .el-row{
            border-bottom: 1px solid #B7C2D0;
            &:last-child{
              border: 0;
            }
            .el-col{
              border-right: 1px solid #B7C2D0;
              &:last-child{
                border-right: 0;
              }
            }
          }
          .comment-dialog-name{
            background: #DDE6EF;
            line-height: 40px;
          }
          .comment-dialog-details{
            line-height: 40px;
            .el-col{
              height: 40px;
              overflow-x: hidden;
            }
          }
        }
        &>sup{
          position: absolute;
          top: 0;
          left: 20px;
          width: 35px;
          height: 5px;
          background: #9FD35D;
        }
        &>i{
          cursor: pointer;
          width: 22px;
          height: 22px;
          position: absolute;
          background: url(../../../assets/images/dialog-close.png) no-repeat;
          top: 15px;
          right: 10px;
          &:hover{
            background: url(../../../assets/images/dialog-close-hover.png) no-repeat;
          }
        }
      }
      .el-dialog__footer{
        .el-button{
          padding: 8px 28px;
          border: 1px solid #FF6C60;
          color: #FF6C60;
          background: #fff;
          margin-right: 250px;
          &:hover{
            background: #FF6C60;
            color: $white;
          }
        }
      }
    }
  }
}
</style>
