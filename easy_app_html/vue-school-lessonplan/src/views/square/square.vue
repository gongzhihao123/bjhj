<template>
  <div id="square">
    <!--顶部-->
      <div class="head">
        <ul>
          <li v-for="(item, index) in nav" :key="index"><a :class="{'active': activeInd === index, 'space': activeInd === 1}" @click="link(item, index)">{{item.name}}</a></li>
        </ul>
      </div>
      <!--分类-->
      <div class="type" v-loading="cardloading">

        <div class="term">
          <span>学期：</span>
          <el-select v-model="valuecontent" placeholder="请选择" @change="clearSearch">
            <el-option
              v-for="item in options"
              :key="item.semesterId"
              :label="item.semesterName"
              :value="item.semesterId">
            </el-option>
          </el-select>
        </div>
        <div class="peroid">
          <span>学段：</span>
          <span v-for="(item, i) in peroid" :key="i" :class="{'nav-list-span': true, 'active': peroidInd === i}" @click="peroidClick(item, i)">{{item.name}}</span>
        </div>
        <transition name="list" class="tag-list" tag="span">        
        <div class="grade" v-if="grade.length">
          <span>年级：</span>
          <span v-for="(item, i) in grade" :key="i" :class="{'nav-list-span': true, 'active': gradeInd === i}" @click="gradeClick(item, i)">{{item.name}}</span>
        </div>
        </transition>
        <transition name="list" class="tag-list" tag="span">        
        <div class="subject" v-if="subject.length">
          <span>学科：</span>
          <div>
            <span v-for="(item, i) in subject" :key="i" :class="{'nav-list-span': true, 'active': subjectInd === i}" @click="subjectClick(item, i)">{{item.curriculumName}}</span>
          </div>
        </div>
        </transition>  
        <div class="search">
          <span>搜索：</span>
          <transition-group name="list" class="tag-list" tag="span">
          <div v-for="(item, i) in navInfo" :key="i" v-if="item != undefined && item !== ''">{{item}}
          <i class="el-icon-close" @click="handleSearch(item, i)"></i>
          </div>
          <span v-show="searchCount !== 0" @click="clearSearch" key="-2">清空筛选</span>
        </transition-group>
        </div>              
      </div>
      <!--搜索和排序-->
      <div class="search"> 
        <el-row>
          <ul class="type-choose">
              <el-col :span="10">
              <li @click="timesort">
                发表时间1
                <img src="../../assets/images/sort.png" v-if="timest === 0">
                <img src="../../assets/images/sort-active.png" v-if="timest === 1">
                <img src="../../assets/images/sortup-active.png" v-if="timest === 2">
              </li>
              <li @click="scoresort">
                评分
                <img src="../../assets/images/sort.png" v-if="scorest === 0">
                <img src="../../assets/images/sort-active.png" v-if="scorest === 1">
                <img src="../../assets/images/sortup-active.png" v-if="scorest === 2">            
              </li>
              <li @click="collectsort">
                收藏
                <img src="../../assets/images/sort.png" v-if="collectst === 0">
                <img src="../../assets/images/sort-active.png" v-if="collectst === 1">
                <img src="../../assets/images/sortup-active.png" v-if="collectst === 2">            
              </li>
            </el-col>
            <el-col :span="14">
              <li class="search-pic"  @mouseenter="show = true" @mouseleave="show = false" @click="showinputs()"> 
                <img src="../../assets/images/search.png" v-if="!show && showinput === false">
                <img src="../../assets/images/search-active.png" v-if="show && showinput === false" class="search-active">

                <div class="input-box" v-if="showinput === true">
                  <img src="../../assets/images/search-icon.png" v-if="inputflag" @click="gosearch">
                  <img src="../../assets/images/search-icon-input.png" v-if="!inputflag" @click="gosearch">
                  <input type="text" v-model="keyword" maxlength="50" placeholder="请输入关键字检索" @keyup.enter="gosearch"  autofocus="autofocus" @blur="showinput = false" id="sea-input">
                  <img src="../../assets/images/delete.png" v-if="inputflag"  @click="deleteInfo">
                </div>
            </li>
            </el-col>
          </ul>
        </el-row>
      </div>

      <!--教案列表-->
      <transition name="slide-left" mode="out-in">      
        <div class="planlist" v-if="activeInd === 0">
          <ul class="list-ul" v-loading="loading" v-if="this.totalCount !== 0">
            <li v-for="(plan, index) in plans" :key="index" class="list-li" @click="goInfo(index)">
              《{{plan.title}}》
              <div class="intro">
                <span>学科：{{plan.courseName}}</span>
                <span>年级：{{plan.gradeName}}</span>
                <span>作者：{{plan.createdUserName}}</span>
                <span>发表时间：{{plan.createdTime | dateFormat('yyyy-MM-dd hh:mm')}}</span>
              </div>
              <div class="num">
                <span class="num-li"><img src="../../assets/images/comment.png">评论:<i v-if="plan.commentNum"> {{plan.commentNum}}</i><i v-if="!plan.commentNum">&nbsp;0</i></span>
                <span class="num-li"><img src="../../assets/images/collect.png">收藏:<i v-if="plan.collectionNum"> {{plan.collectionNum}}</i><i v-if="!plan.collectionNum">&nbsp;0</i></span>
                <span class="num-li"><img src="../../assets/images/score.png">评分:<i v-if="plan.score"> {{(plan.score).toFixed(1)}}</i><i v-if="!plan.score">&nbsp;0</i></span>
              </div>
            </li>

          </ul>
        </div>
      </transition>
      <p v-if="this.totalCount === 0" class="nullInfo">暂无数据</p>
      <!--优秀教案-->
      <transition name="slide-left" mode="out-in">
        <div class="excellentplan" v-if="activeInd === 1">
          <ul v-loading="loading" class="list-ul" v-if="this.totalCount !== 0">
            <li v-for="(eplan, index) in eplans" :key="index" class="list-li" @click="goInfo(index)">
              《{{eplan.title}}》
              <div class="intro">
                <span>学科：{{eplan.courseName}}</span>
                <span>年级：{{eplan.gradeName}}</span>
                <span>作者：{{eplan.createdUserName}}</span>
                <span>发表时间：{{eplan.createdTime | dateFormat('yyyy-MM-dd hh:mm')}}</span>
              </div>
              <div class="num">
                <span class="num-li"><img src="../../assets/images/comment.png">评论:<i v-if="eplan.commentNum"> {{eplan.commentNum}}</i><i v-if="!eplan.commentNum">&nbsp;0</i></span>
                <span class="num-li"><img src="../../assets/images/collect.png">收藏:<i v-if="eplan.collectionNum"> {{eplan.collectionNum}}</i><i v-if="!eplan.collectionNum">&nbsp;0</i></span>
                <span class="num-li"><img src="../../assets/images/score.png">评分:<i v-if="eplan.score"> {{(eplan.score).toFixed(1)}}</i><i v-if="!eplan.score">&nbsp;0</i></span>
              </div>
            </li>            
          </ul>
        </div>
      </transition>


      <!--分页-->
      <el-pagination
        v-if="totalCount !== 0"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalCount">
      </el-pagination>
  </div>
</template>

<script>
import { error, notice } from './../../api/index.js'
export default {
  name: 'square',
  data () {
    return {
      nav: [
        {name: '全部教案'},
        {name: '优秀教案'}
      ],
      timest: 1,
      collectst: 0,
      scorest: 0,
      searchCount: 0,
      options: [
        {semesterId: ''}
      ],
      searches: [],
      valuecontent: '',
      activeInd: 0,
      peroidInd: -1,
      gradeInd: -1,
      subjectInd: -1,
      active: true,
      flag: false,
      show: false,
      showinput: false,
      inputflag: false,
      loading: false,
      cardloading: false,
      currentPage: 1,
      sectionId: '',
      gradeId: '',
      courseId: '',
      pageSize: 6,
      totalCount: 1,
      column: 1,
      sort: 2,
      type: 1,
      name: '',
      courseName: '',
      gradeName: '',
      sectionName: '',
      planId: '',
      time: '',
      keyword: '',
      navInfo: [],
      peroid: [],
      grade: [],
      subject: [],
      plans: [],
      eplans: []
    }
  },
  methods: {
    link (item, index) {
      this.activeInd = index
      localStorage.activeInd = this.activeInd
      this.type = this.activeInd + 1
      this.timest = 1
      this.collectst = 0
      this.scorest = 0
      this.keyword = ''
      this.clearSearch()
      this.getPlanList()
    },
    peroidClick (item, i) {
      if (this.peroidInd === i) {
        this.peroidInd = -1
        this.navInfo[0] = ''
        this.searchCount = 0
        this.clearSearch()
        this.getPlanList()
      } else {
        this.peroidInd = i
        this.navInfo[0] = item.name
        this.sectionId = item.id
        this.searchCount = 1
        this.gradeId = ''
        this.navInfo[1] = ''
        this.navInfo[2] = ''
        this.gradeInd = -1
        this.subjectInd = -1
        this.getSelectGradeClassList()
        this.getPlanList()
      }
    },
    gradeClick (item, i) {
      if (this.gradeInd === i) {
        this.gradeInd = -1
        this.navInfo[1] = ''
        this.searchCount--
        this.getPlanList()
        this.gradeId = ''
      } else {
        this.gradeInd = i
        this.gradeId = item.id
        this.subjectInd = -1
        this.navInfo[1] = item.name
        this.navInfo[2] = ''
        this.searchCount++
        this.getSelectCourseList()
        this.getPlanList()
      }
    },
    subjectClick (item, i) {
      if (this.subjectInd === i) {
        this.subjectInd = -1
        this.navInfo[2] = ''
        this.searchCount--
        this.courseId = ''
        this.getPlanList()
      } else {
        this.subjectInd = i
        this.navInfo[2] = item.curriculumName
        this.courseId = item.id
        this.searchCount++
        this.getPlanList()
      }
    },
    timesort () {
      // 按发表时间
      this.column = 1
      this.scorest = 0
      this.collectst = 0
      if (this.currentPage !== 1) {
        this.currentPage = 1
      }
      if (this.timest === 2 || this.timest === 0) {
        this.timest = 1
        this.sort = 2
        this.getPlanList()
        return
      }
      if (this.timest === 1) {
        this.sort = 1
        this.getPlanList()
        this.timest = 2
      }
    },
    scoresort () {
      // 按评分
      this.column = 2
      this.timest = 0
      this.collectst = 0
      if (this.currentPage !== 1) {
        this.currentPage = 1
      }
      if (this.scorest === 2 || this.scorest === 0) {
        this.sort = 2
        this.getPlanList()
        this.scorest = 1
        return
      }
      if (this.scorest === 1) {
        this.sort = 1
        this.getPlanList()
        this.scorest = 2
      }
    },
    collectsort () {
      // 按收藏数
      this.column = 3
      this.timest = 0
      this.scorest = 0
      if (this.currentPage !== 1) {
        this.currentPage = 1
      }
      if (this.collectst === 2 || this.collectst === 0) {
        this.sort = 2
        this.getPlanList()
        this.collectst = 1
        return
      }
      if (this.collectst === 1) {
        this.sort = 1
        this.getPlanList()
        this.collectst = 2
      }
    },
    showinputs () {
      this.showinput = true
      this.keyword = ''
      setTimeout(() => {
        document.getElementById('sea-input').focus()
      }, 300)
    },
    gosearch () {
      this.getPlanList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getPlanList()
    },
    goInfo (index) {
      if (this.type === 1) {
        let modelInfo = {}
        modelInfo.time = this.plans[index].createdTime
        modelInfo.sectionName = this.plans[index].sectionName
        modelInfo.gradeName = this.plans[index].gradeName
        modelInfo.courseName = this.plans[index].courseName
        modelInfo.planId = this.plans[index].id
        sessionStorage.modelInfo = JSON.stringify(modelInfo)
        sessionStorage.currentPage = JSON.stringify(this.currentPage)
        this.$router.push('/squareInfo')
      }
      if (this.type === 2) {
        let modelInfo = {}
        modelInfo.time = this.eplans[index].createdTime
        modelInfo.sectionName = this.eplans[index].sectionName
        modelInfo.gradeName = this.eplans[index].gradeName
        modelInfo.courseName = this.eplans[index].courseName
        modelInfo.planId = this.eplans[index].id
        sessionStorage.modelInfo = JSON.stringify(modelInfo)
        sessionStorage.currentPage = JSON.stringify(this.currentPage)
        this.$router.push('/squareInfo')
      }
    },
    deleteInfo () {
      this.keyword = ''
    },
    getSelectSemesterList () {
      // 获取学期信息列表
      this.cardloading = true
      setTimeout(() => {
        this.$https.get(`/common/selectSemesterList`)
        .then(res => {
          if (res.data.code === 1) {
            this.options = res.data.result
            if (this.options.length !== 0) {
              this.valuecontent = this.options.filter(item => item.state === 1)[0].semesterId
            }
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
          this.cardloading = false
        })
        .catch(res => {
          notice(this, res.data.message, 2000)
        })
        this.cardloading = false
      }, 200)
    },
    getSectionList () {
      // 获取学段
      this.$https.get(`/common/sectionList`)
      .then(res => {
        if (res.data.code === 1) {
          this.peroid = res.data.result
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },
    getSelectGradeClassList () {
      // 获取年级
      this.$https.get(`/common/selectGradeClassList?sectionId=${this.sectionId}&semesterId=${this.valuecontent}`)
      .then(res => {
        if (res.data.code === 1) {
          this.grade = res.data.result
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },
    getSelectCourseList () {
      // 获取学科信息列表
      this.$https.get(`/common/selectCourseList?sectionId=${this.sectionId}&semesterId=${this.valuecontent}&gradeId=${this.gradeId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subject = res.data.result
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },
    getPlanList () {
      // 学案列表
      this.loading = true
      setTimeout(() => {
        this.$https.get(`/square/lessonPlanList?type=${this.type}&pageNo=${this.currentPage}&pageSize=${this.pageSize}&sectionId=${this.sectionId}&gradeId=${this.gradeId}&courseId=${this.courseId}&title=${this.keyword}&column=${this.column}&sort=${this.sort}&semesterId=${this.valuecontent}`)
        .then(res => {
          if (res.data.code === 1) {
            if (this.type === 1) {
              this.plans = res.data.result.list
              this.totalCount = res.data.result.totalCount
            }
            if (this.type === 2) {
              this.eplans = res.data.result.list
              for (var i = 0; i < this.eplans.length; i++) {
                this.eplans[i].coverImage = 'http://114.215.83.40/static/lessonplan/' + this.eplans[i].coverImage
              }
              this.totalCount = res.data.result.totalCount
            }
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
          this.loading = false
        })
      }, 600)
    },
    handleSearch (item, i) {
      switch (i) {
        case 0:
          this.navInfo[0] = ''
          this.clearSearch()
          this.getPlanList()
          break
        case 1:
          this.gradeInd = ''
          this.gradeId = ''
          this.navInfo[1] = ''
          this.searchCount--
          this.getPlanList()
          break
        case 2:
          this.subjectInd = ''
          this.navInfo[2] = ''
          this.searchCount--
          this.courseId = ''
          this.getPlanList()
          break
      }
    },
    clearSearch () {
      this.searchCount = 0
      this.navInfo = []
      this.peroidInd = -1
      this.gradeInd = -1
      this.subjectInd = -1
      this.sectionId = ''
      this.semesterId = ''
      this.courseId = ''
      this.gradeId = ''
      this.getPlanList()
    }
  },
  created () {
    if (localStorage.activeInd) {
      this.activeInd = Number(localStorage.activeInd)
      this.type = this.activeInd + 1
    }
    // 获取全部教案
    this.getPlanList()
    setTimeout(() => {
      // 获取学期和学段
      this.getSelectSemesterList()
      this.getSectionList()
    }, 600)
    if (sessionStorage.currentPage) {
      this.currentPage = JSON.parse(sessionStorage.currentPage)
    } else {
      this.currentPage = 1
    }
  }
}
</script>

<style lang="scss" scoped>
#square {
  width: 100%;
  margin: 0px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;
  
  .head {
    width: 100%;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    ul {
      width: auto;
      height: 40px;
      background: #DDE6EF;
      padding-left: 30px;
      margin: 0px;
      border-bottom: 1px solid#DAE2ED;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      li {
        float: left;
        list-style-type: none;
        margin-left: 35px;

        a {
          color: #636C7B;
          width: 90px;
          height: 31px;
          border-radius: 10px 10px 0px 0px;
          display: block;
          margin-top: 10px;
          text-align: center;
          font-size: 14px;
          line-height: 31px;
          border-bottom: 1px solid #fff;

        }
        .active {
          background: #fff;
          color: #408EE6;
        }
        a:hover {
          cursor: pointer;
        }
      }
    }
  }

  .type {
    padding: 25px 0px 25px 70px;
    border-bottom: 1px solid #DDE6EF;
    .peroid,.grade,.subject,.term ,.search{
      &.subject {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span {
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
            margin: 0 10px;
            padding:1px  15px;
            border-radius: 13px;
            border: 1px solid transparent;
            cursor: pointer;
          }
        }
      }
      /*margin-top: 25px;*/
      padding: 12px 0px;
      span {
        font-size: 14px;
        color: #4792E7;
        margin-right: 20px;
      }
      .nav-list-span {
        font-size: 14px;
        padding: 3px 17px;
        margin: 0 15px 0px 0px;
        cursor: default;
        color: #636C7B;
        border: 1px solid #fff;
        border-radius: 16px;
      }
      .nav-list-span:hover {
        border: 1px solid #408EE6;
        border-radius: 16px;
        cursor: pointer;
      }
      .active {
        color: #fff;
        background: #408EE6;
        border-radius: 16px;
        border: 1px solid #408EE6;
      }
    }
  }
  
  .search {
     padding: 40px 60px 12px 65px;

    .tag-list {
        div {
          color: #999;
          display: inline-block;
          /*width: 100px;*/
          height: 26px;
          line-height: 26px;
          border-radius: 13px;
          vertical-align: middle;
          border: 1px solid ;
          padding: 0 12px;
          margin-right: 8px;
          &:first-child {
            margin-left: 10px;
          }
          i {
            font-size: 12px;
            /*margin-left: 5px;*/
            cursor: pointer;
            transform: scale(0.8);
            &:hover {
              &:before {
              background: #FF6C60;
              color: #fff;
              }
            }
            &:before {
              border-radius: 100%;
              padding: 5px;
              font-size: 12px;
            }
          }
        }   
        span {
          &:hover {
            cursor: pointer;
          }
        }     
      }
    .type-choose {
      height: 40px;
      background: #DDE6EF;
      border-radius: 6px;
      padding-left: 16px;

      li {
        list-style-type: none;
        float: left;
        font-size: 14px;
        color: #636C7B;
        height: 40px;
        line-height: 40px;
        margin-right: 37px;

        img {
          margin-left: 10px;
          margin-top: 5px;
        }

        &:hover {
          cursor: pointer;
        }
      }
      .search-pic {
        margin-left: 8%;
        width: 80px;
        height: 40px;
        display: block;

        img {
            margin-left: 0px;
            margin-top: 0px;
        }

        .input-box {
          position: relative;
          img {
              margin-right: 15px;
              vertical-align: middle;
          }
          input {
            position: absolute;
            top: 12px;
            outline: none;
            background: #DDE6EF;
            border-left: none;
            border-top: none;
            border-right: none;
            border-bottom: none;
            text-indent: 1em;
            /*color: #B2BAC7;*/
            width: 218px;
          }
          .hot-search {
            width: 400px;
            height: 180px;
            border: 1px solid #DDE6EF;
            display: block;
            border-radius: 8px;
            box-shadow: 0px 2px 5px #DDE6EF;
            background: #fff;
            position: absolute;
            padding-left: 16px;

            .hot-title {
              color: #D4D8DF;
            }
            .hot-content {
              color: #A2AAB8;
              list-style-type: none;
              width: inherit;
              margin-right: 0px;
            }
            li:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
    .type-choose:after {
      content: " ";
      clear: both;
    }
  }

  .planlist {
    padding: 0px 60px 0px 65px;
    border-bottom: none;

    .list-ul {
      margin: 0px;
      padding-left: 20px;
      padding-bottom: 120px;
      .list-li {
        color: #A8B0BD; 
        list-style-type:disc inside;
        margin-top: 24px;
        border-bottom: 1px dashed #DAE2ED;
        color: #666666;

        &:last-child {
          border-bottom: none;
        }
        .intro {
          margin: 10px 32px 20px 8px;
          span {
            color: #A2AAB8;
            padding-left: 0px;
            margin-right: 24px;
          }
        }
      }
      .list-li:hover {
        cursor: pointer;
      }
    }
    .num {
      padding-bottom: 10px;
      
      .num-li {
        line-height: 24px;
        padding-left: 8px;
        vertical-align: middle;
        color: #666666;

        img {
          margin-right: 10px;
          vertical-align: middle;
        }

        i {
          font-style: normal;
          margin-right: 30px;
        }
      }
    }
  }

  .excellentplan {
    padding: 0px 60px 0px 65px;
    border-bottom: none;


    ul {
      margin: 0px;
      padding-left: 20px;
      padding-bottom: 120px;
      .list-li {
        color: #A8B0BD; 
        list-style-type:disc inside;
        margin-top: 24px;
        border-bottom: 1px dashed #DAE2ED;
        color: #666666;

        &:last-child {
          border-bottom: none;
        }
        .intro {
          margin: 10px 32px 20px 8px;
          span {
            color: #A2AAB8;
            padding-left: 0px;
            margin-right: 24px;
          }
        }
      }
      .list-li:hover {
        cursor: pointer;
      }  
    }
    .num {
      padding-bottom: 10px;
      
      .num-li {
        line-height: 24px;
        padding-left: 8px;
        vertical-align: middle;
        color: #666666;

        img {
          margin-right: 10px;
          vertical-align: middle;
        }

        i {
          font-style: normal;
          margin-right: 30px;
        }
      }
    }    

  }

  .nullInfo {
    text-align: center;
    color: #666666;
    padding: 20px 0px 20px 0px;
  }
  
  .el-pagination  {
    float: right;
    margin-right: 60px;
    margin-bottom: 30px;
  }   
}

</style>
