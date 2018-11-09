<template>
  <div id="collaborate">
    
    <!--切换我发出的--我收到的-->
    <header class="my-sent">
      <ul>
        <li v-bind:class="{active: i === index}" @click="selectedNav(item, index)" v-for="(item, index) in navList" :key="index">{{item.name}}</li>
      </ul>
      <el-button @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true" @click="addSynergy">
        新增协同
        <img v-if="borderOne" src="../../../assets/images/border.png">
      </el-button>
      <div v-if="receviedNum !== 0" class="recevied-num">
        {{receviedNum}}
      </div>
      <div class="recevied-num my-recevied" v-if="receviedNum !== 0">
        {{receviedNum}}
      </div>
    </header>
    <!--筛选目录-->
    <div class="screening-directory">
      <div class="semester">
        <span>学期：</span>
        <el-select v-model="semesterValue" @change="semesterSelect">
          <el-option
            v-for="item in semesterList"
            :key="item.semesterId"
            :label="item.semesterName"
            :value="item.semesterId">
          </el-option>
        </el-select>
      </div>
      <transition name="slide-down" mode="out-in"> 
        <div class="grade">
          <i>年级：</i>
          <span v-for="(item, index) in gradeList" :key="index" @click="gradeSelect(item, index)" :class="{active: gradeActive===index}">
            {{item.gradeName}}
          </span>
        </div>
      </transition>
      <transition name="slide-down" mode="out-in">
        <div class="course" v-if="courseList.length !== 0">
          <i>科目：</i>
          <span v-for="(item, index) in courseList" :key="index" @click="courseSelect(item, index)" :class="{active: courseActive===index}">
            {{item.curriculumName}}
          </span>
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
    </div>
    
    <!--主体-->
    <main>
      <el-row class="main-top">
        <el-col :span="3">
          <span @click="sortByTime">邀请时间
            <img v-if="sort === 1" src="../../../assets/images/sort-active.png">
            <img v-if="sort === 2" src="../../../assets/images/sortup-active.png">
          </span>
          
        </el-col>
        <el-col :span="21" class="search-button">
          <span @click="searchBoxShow = true" v-if="!searchBoxShow"></span>
          <div v-if="searchBoxShow">
            <img class="search" src="../../../assets/images/search-icon.png">
            <el-input v-focus="true" @blur="searchBoxShow = false" placeholder="输入关键字检索" :maxlength="50" v-model="title" @keyup.enter.native="handleIconClick"></el-input>
            <img class="delete-icon" @click="clearTitle" v-if="title" src="../../../assets/images/delete.png">
            <!--<div v-if="hotSearchShow" class="hot-search">
              <p>热门搜索</p>
              <ul>
                <li v-for="(item, index) in hotSearchList" :key="index">
                  {{item.name}}
                </li>
              </ul>
            </div>-->
          </div>
        </el-col>
      </el-row>
      <p style="text-align: center;margin-top: 20px;color: #636C7F;" class="no-result" v-if="list.length === 0">暂无数据</p>
      <div class="main-body" v-if="item.show" v-for="(item, index) in list" :key="index">
        <el-row @click.native="lookDetails(item)" style="cursor: pointer;">
          <img src="../../../assets/images/dian.png"> <span>{{'《' + item.title + '》'}}</span>
        </el-row>
        <el-row>
          <span>学科：{{item.courseName}}</span>
          <span>年级：{{item.gradeName}}</span>
          <span>作者：{{item.createdUserName}}</span>
          <span>发表时间：{{item.createdTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</span>
          <span>协同结束时间：{{item.endTime | dateFormatT('yyyy-MM-dd hh:mm:ss')}}</span>
        </el-row>
        <el-row>
          <el-col :span="10">
            <span>
              <img src="../../../assets/images/comment.png">评论：{{item.commentNum ? item.commentNum : 0}}
            </span>
            <span>
              <img src="../../../assets/images/collect.png">收藏：{{item.collectionNum ? item.collectionNum : 0}}
            </span>
            <span>
              <img src="../../../assets/images/score.png">评分：{{item.score ? item.score : 0}}
            </span>
          </el-col>
          <el-col :span="14">
            <el-button @click="synergyFinish(item)" v-if="type === 1">结束协同</el-button>
            <el-button @click="mark(item)" v-if="type === 2">标注</el-button>
            <el-button @click="mark(item)" v-if="type === 1 && item.endTime > nowTime">标注</el-button>
          </el-col>
        </el-row>
      </div>
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
  </div>
</template>
<script>
import { notice, error } from '../../../api/index.js'
import { mapGetters, mapActions } from 'vuex'
import querystring from 'querystring'
export default {
  name: 'collaborate',
  directives: {
    focus: {
      inserted: function (el, option) {
        var defClass = 'el-input'
        var defTag = 'input'
        var value = option.value || true
        if (typeof value === 'boolean') {
          value = { cls: defClass, tag: defTag, foc: value }
        } else {
          value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false }
        }
        if (el.classList.contains(value.cls) && value.foc) {
          el.getElementsByTagName(value.tag)[0].focus()
        }
      }
    }
  },
  data () {
    return {
      dataNum: '',
      userId: '',
      borderOne: true,
      hotSearchShow: false,
      i: 0,
      searchBoxShow: false,
      navList: [
        {name: '我发出的'},
        {name: '我收到的'}
      ],
      semesterValue: '',
      gradeValue: '',
      courseValue: '',
      semesterList: [],
      gradeList: [],
      courseList: [],
      hotSearchList: [
        {name: '谁是最可爱的人'},
        {name: '农夫与蛇'}
      ],
      gradeActive: '',
      courseActive: '',
      list: [],
      type: 1,
      title: '',
      pageNo: 1,
      pageCount: 10,
      sort: 1,
      totalCount: 0,
      nowTime: '',
      receviedNum: 0,
      searchList: []
    }
  },
  methods: {
    ...mapActions([
      'my',
      'detail',
      'board',
      'judge'
    ]),
    // 清空搜索列表
    clearSearch () {
      this.searchList = []
      this.gradeValue = ''
      this.courseValue = ''
      this.parentId = ''
      this.getSynergyList()
    },
    // 删除搜索列表
    delSearList (item, index) {
      this.searchList.splice(index, 1)
      if (item.type === 'grade') this.gradeValue = ''
      if (item.type === 'course') this.courseValue = ''
      this.getSynergyList()
    },
    // 选择学期
    semesterSelect () {
      this.getGradeAndCourseData()
      this.searchList = []
      this.courseList = []
      this.courseValue = ''
      this.gradeValue = ''
      this.getSynergyList()
    },
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
      this.getSynergyList()
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
      this.getSynergyList()
    },
    // 查看详情
    lookDetails (item) {
      // if (this.type === 2) {
      //   this.receviedNum --
      // }
      this.detail(item)
      this.$router.push({path: '/my/collaborateView', query: {pageNo: this.pageNo}})
    },
    // 结束协同
    synergyFinish (item) {
      if (item.endTime) {
        // this.$https.post(`/mine/synergyFinish`, querystring.stringify({
        //   planId: item.id
        // }))
        // .then(res => {
        //   if (res.data.code === 1) {
        //     success(this, '结束协同成功', 1000)
        //   } else if (res.data.code === -2) {
        //     notice(this, res.data.message, 2000)
        //   }
        // })
        this.$https.get(`/mine/lessonPlanHtmlRead?filepath=${item.filePath}`)
        .then(res => {
          let content = res.data.result
          // content = content.replace(/【\d{1}】/g, '')
          // content = content.replace(/【\d{2}】/g, '')
          this.$https.post(`/mine/lessonPlanHtmlSave`, querystring.stringify({
            planId: item.id,
            html: content
          }))
          .then(res => {
            let filePath = res.data.result
            this.$https.post(`/mine/lessonPlanUpdate`, querystring.stringify({
              id: item.id,
              title: item.title,
              filePath: filePath,
              auth: item.auth,
              summarize: item.summarize
            }))
            .then(res => {
            })
          })
        })
        this.getSynergyList()
        this.getReceviedNum()
        this.detail(item)
        this.board('1')
        this.judge('1')
        sessionStorage.mark = '/my/collaborate'
        this.$router.push({path: `/my/collaborateOver`, query: {id: item.id}})
      } else {
        this.detail(item)
        this.board('1')
        this.judge('1')
        sessionStorage.mark = '/my/collaborate'
        this.$router.push(`/my/collaborateOver`)
      }
    },
    // 清空搜索内容
    clearTitle () {
      this.title = ''
      this.getSynergyList()
    },
    // 按时间排序
    sortByTime () {
      if (this.sort === 1) {
        this.sort = 2
      } else if (this.sort === 2) {
        this.sort = 1
      }
      this.getSynergyList()
    },
    // 搜索
    handleIconClick () {
      this.getSynergyList()
    },
    // 标注按钮
    mark (item) {
      this.detail(item)
      this.$router.push({path: `/my/synergyMark`, query: {pageNo: this.pageNo}})
    },
    // 新增协同按钮
    addSynergy () {
      this.$router.push(`/my/addSynergy`)
    },
    // 我发出的-我收到的
    selectedNav (item, index) {
      this.i = index
      if (index === 0) {
        this.type = 1
      } else if (index === 1) {
        this.type = 2
      }
      this.getSynergyList()
    },
    handleSizeChange (val) {
      this.pageCount = val
      this.getSynergyList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getSynergyList()
    },
    // 获取协同备课列表（发出的/收到的）
    getSynergyList () {
      this.$https.get(`/mine/synergyList?semesterId=${this.semesterValue}&gradeId=${this.gradeValue}&courseId=${this.courseValue}&type=${this.type}&title=${this.title}&sort=${this.sort}&pageNo=${this.pageNo}&pageSize=${this.pageCount}`)
      .then(res => {
        if (res.data.code === 1) {
          this.nowTime = new Date().getTime()
          if (this.type === 2) this.list = res.data.result.plans.list.map(item => ({...item, show: (item.endTime > this.nowTime) ? 1 : 0}))
          else {
            this.list = res.data.result.plans.list.map(item => ({...item, show: 1}))
          }
          this.totalCount = res.data.result.plans.totalCount
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 查询我收到的
    getReceviedNum () {
      this.$https.get(`/mine/synergyList?semesterId=${this.semesterValue}&gradeId=${''}&courseId=${''}&type=${2}&title=${''}&sort=${''}&pageNo=${1}&pageSize=${2000}`)
      .then(res => {
        if (res.data.code === 1) {
          this.receviedNum = res.data.result.plans.list.filter(item => item.checkState === 0 && item.endTime > this.nowTime).length
          sessionStorage.receviedNum = this.receviedNum
        } else if (res.data.code === -2) {
          // notice(this, res.data.message, 2000)
        }
      })
    },
    getGradeAndCourseData () {
      // 获取教师对应的信息
      this.$https.get(`/common/selectGradeSimpleCourse?teacherId=${this.userId}&semesterId=${this.semesterValue}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result.length !== 0) {
            this.gradeList = res.data.result
            // this.courseList = res.data.result[0].courseList
          } else {
            this.gradeList = []
            this.courseList = []
          }
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 查询学期
    getSemesterList () {
      this.$https.get(`/common/selectSemesterList`)
      .then(res => {
        if (res.data.code === 1) {
          this.semesterList = res.data.result
          if (res.data.result.length !== 0) {
            this.semesterValue = (res.data.result || []).filter(item => item.state === 1)[0].semesterId
            this.getGradeAndCourseData()
            this.getReceviedNum()
          }
        } else if (res.data.code === -2) {
          error(this)
        } else {
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
      this.getSynergyList()
    }
  },
  created () {
    this.userId = this.user.user.loginUser.id
    this.getSemesterList()
    setTimeout(() => {
      this.getReceviedNum()
    }, 200)
    if (this.$route.query.pageNo) {
      this.pageNo = Number(this.$route.query.pageNo)
    }
  }
}
</script>
<style lang="scss">
@import '../../../assets/scss/main.scss';
#collaborate{
  // 切换我发出的--我收到的
  .my-sent{
    position: relative;
    border-bottom: 1px solid #ddd;
    padding: 0 70px;
    height: 60px;
    box-sizing: border-box;
    padding-top: 17px;
    ul{
      float: left;
      list-style: none;
      margin: 0;
      padding: 0;
      li{
        cursor: pointer;
        float: left;
        margin-right: 20px;
        font-size: 16px;
        color: #636C7B;
        padding: 10px;
        border-bottom: 2px solid transparent;
        &.active{
          color: #408EE6;
          border-bottom: 2px solid #408EE6;
        }
      }
    }
    .el-button{
      margin-top: 5px;
      float: right;
      color: #408EE6;
      border: 1px solid #408EE6;
      padding: 7px 20px;
      position: relative;
      &:hover{
        background: #408EE6;
        color: $white;
      }
      img{
        position: absolute;
        top: -2px;
      }
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
    }
    .my-recevied{
      top: 22px;
      left: 245px;
    }
  }
  // 筛选目录
  .screening-directory{
    padding: 0 70px 20px;
    border-bottom: 1px solid #ddd;
    &>div{
      margin-top: $width;
    }
    // 学期
    .semester{
      &>span{
        color: #6B7482;
        margin-right: $width;
      }
    }
    .grade,.course,{
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
    // 搜索
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
  }
  // 主体
  main{
    position: relative;
    padding: 40px 70px 100px;
    .main-top{
      padding-left: 20px;
      background: #DDE6EF;
      border-radius: 5px;
      margin-bottom: 20px;
      .el-col:first-child{
        color: #636C7B;
        line-height: 40px;
        span{
          cursor: pointer;
          img{
            margin-left: 5px;
            vertical-align: middle;
          }
        }
      }
      .el-col:nth-child(2){
        text-align: center;
        height: 40px;
        &>span{
          margin-left: -50px;
          display: inline-block;
          margin-bottom: -2px;
          width: 80px;
          height: 40px;
          background: url(../../../assets/images/search.png);
          cursor: pointer;
          &:hover{
            background: url(../../../assets/images/search-active.png);
          }
        }
        &>div{
          margin-left: 50px;
          position: relative;
          display: inline-block;
          &>img.search{
            vertical-align: middle;
            margin-right: 10px;
          }
          &>img.delete-icon{
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 12px;
          }
          &>.el-input{
            width: 300px;
            .el-input__inner{
              height: 40px;
              width: 300px;
              border: 0;
              background: #DDE6EF;
            }
          }
          .hot-search{
            box-shadow: 0px 2px 5px #DDE6EF;
            display: inline-block;
            z-index: 105;
            border: 1px solid #ddd;
            position: absolute;
            left: 0;
            width: 310px;
            height: 160px;
            border-radius: 5px;
            background: #fff;
            text-align: left;
            padding: 10px;
            &>p{
              color: #C6CBD5;
            }
            ul{
              li{
                margin-top: 10px;
                color: #A6AEBB;
              }
            }
          }
        }
      }
    }
    .main-body{
      margin-top: 15px;
      border-bottom: 1px dashed #ddd;
      .el-row:first-child{
        img{
          vertical-align: middle;
        }
        span{
          color: #636C7B;
          font-size: 16px;
        }
      }
      .el-row:nth-child(2){
        margin-top: 5px;
        padding-left: 15px;
        span{
          margin-right: 20px;
          color: #A2AAB8;
        }
      }
      .el-row:nth-child(3){
        padding: 15px;
        .el-col:first-child{
          span{
            margin-right: 20px;
            color: #666666;
            img{
              vertical-align: middle;
              margin-right: 10px;
            }
          }
        }
        .el-col:last-child{
          text-align: right;
          .el-button{
            border: 1px solid #A2AECD;
            color: #A2AECD;
            padding: 5px 15px;
            &:hover{
              border: 1px solid #408EE6;
              background: #408EE6;
              color: #fff;
            }
          }
        }
      }
      &:last-child{
        border: 0;
      }
    }
    .el-pagination{
      position: absolute;
      bottom: 10px;
      right:10px;
    }
  }
}
</style>
