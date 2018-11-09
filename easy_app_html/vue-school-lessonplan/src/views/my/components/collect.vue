<template>
  <div id="collect">
    <header>
      <!--年级-->
      <div class="grade">
        <i>学段：</i>
        <span  v-for="(item, index) in sectionList" :key="index" @click="sectionSelect(item, index)" :class="{active: sectionActive===index}">
          {{item.name}}
        </span>
      </div>
      <!--年级-->
      <div class="grade" v-if="gradeList.length !== 0">
        <i>年级：</i>
        <span  v-for="(item, index) in gradeList" :key="index" @click="gradeSelect(item, index)" :class="{active: gradeActive===index}">
          {{item.name}}
        </span>
      </div>
      
      <!--学科-->
      <transition name="slide-down" mode="out-in">
        <div class="subject" v-if="subjectList.length !== 0">
          <i>学科：</i>
          <div>
            <span v-for="(item, index) in subjectList" :key="index" @click="subjectSelect(item, index)" v-bind:class="{active: subjectActive===index}">
              {{item.curriculumName}}
            </span>
          </div>
          
        </div>
      </transition>
      
      <!--搜索-->
      <p class="search">
        <i>搜索：</i>
        <transition-group name="slide-left" mode="out-in">
          <span v-for="(item, index) in searchList" :key="index">
            {{item.name}}
            <span @click="delSearList(item, index)">X</span>
          </span>
        </transition-group>
        <b v-if="searchList.length !== 0" @click="clearSearch">清空筛选</b>
      </p>
      <div v-if="Number(receviedNum) !== 0" class="recevied-num">{{receviedNum}}</div>
    </header>

    <!--主体-->
    <main>
      <el-row class="main-top">
        <span @click="searchBoxShow = true" v-if="!searchBoxShow"></span>
        <div v-if="searchBoxShow">
          <img class="search" src="../../../assets/images/search-icon.png">
          <el-input @blur="searchBoxShow = false" placeholder="输入关键字检索" v-focus="true" :maxlength="50" v-model="title" @keyup.enter.native="handleIconClick"></el-input>
          <img class="delete-icon" v-if="title" @click="clearTitle" src="../../../assets/images/delete.png">
          <!--<div v-if="hotSearchShow" class="hot-search">
            <p>热门搜索</p>
            <ul>
              <li v-for="(item, index) in hotSearchList" :key="index">
                {{item.name}}
              </li>
            </ul>
          </div>-->
        </div>
      </el-row>
      <p style="text-align: center;margin-top: 20px;color: #636C7F;" class="no-result" v-if="list.length === 0">暂无数据</p>
      <div class="main-body" v-for="(item, index) in list" :key="index" @click="goCollectView(item)">
        <el-row>
          <img src="../../../assets/images/dian.png"> <span>{{'《' + item.title + '》'}}</span>
        </el-row>
        <el-row>
          <span>学科：{{item.courseName}}</span>
          <span>年级：{{item.gradeName}}</span>
          <span>作者：{{item.createdUserName}}</span>
          <span>发表时间：{{item.createdTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</span>
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
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'collect',
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
      userId: '',
      hotSearchShow: false,
      searchBoxShow: false,
      hotSearchList: [
        {name: '谁是最可爱的人'},
        {name: '农夫与蛇'}
      ],
      sectionActive: '',
      gradeActive: '',
      subjectActive: '',
      searchList: [],
      gradeList: [],
      subjectList: [],
      sectionList: [],
      secionId: '',
      gradeId: '',
      subjectId: '',
      title: '',
      pageNo: 1,
      pageCount: 10,
      totalCount: 0,
      sectionId: '',
      receviedNum: 0,
      list: []
    }
  },
  methods: {
    ...mapActions([
      'detail'
    ]),
    // 删除搜索列表
    delSearList (item, index) {
      this.searchList.splice(index, 1)
      if (item.type === 'grade') this.gradeId = ''
      if (item.type === 'subject') this.subjectId = ''
      if (item.type === 'section') this.sectionId = ''
      this.getCollectionList()
    },
    // 清空搜索列表
    clearSearch () {
      this.searchList = []
      this.sectionId = ''
      this.gradeId = ''
      this.subjectId = ''
      this.getCollectionList()
    },
     // 清空搜索内容
    clearTitle () {
      this.title = ''
      this.getCollectionList()
    },
    goCollectView (item) {
      this.detail(item)
      this.$router.push({path: '/my/collectView', query: {pageNo: this.pageNo}})
    },
    handleSizeChange (val) {
      this.pageCount = val
      this.getCollectionList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getCollectionList()
    },
    handleIconClick () {
      this.getCollectionList()
    },
    // 选择学段
    sectionSelect (item, index) {
      this.sectionActive = index
      this.sectionId = item.id
      this.gradeId = ''
      this.subjectId = ''
      let n = 0
      n = (this.searchList.filter(item => item.type === 'section')).length
      if (n === 0) {
        this.searchList.push({id: item.id, name: item.name, type: 'section'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'section') {
            if (item.id === val.id) {
              this.searchList.splice(index, 1)
              // this.sectionId = ''
              this.gradeId = ''
              this.subjectId = ''
              this.gradeList = []
              this.subjectList = []
              this.searchList = []
              return
            }
            this.searchList.splice(index, 1, {id: item.id, name: item.name, type: 'section'})
          }
        })
      }
      this.searchList.forEach((item, index) => {
        if (item.type === 'grade') this.searchList.splice(index, 1)
        if (item.type === 'subject') this.searchList.splice(index, 1)
      })
      this.getGradeList()
      this.getCollectionList()
    },
    // 选择年级
    gradeSelect (item, index) {
      this.gradeActive = index
      this.gradeId = item.id
      this.subjectId = ''
      let n = 0
      n = (this.searchList.filter(item => item.type === 'grade')).length
      if (n === 0) {
        this.searchList.push({id: item.id, name: item.name, type: 'grade'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'grade') {
            if (item.id === val.id) {
              this.searchList.splice(index, 1)
              this.gradeId = ''
              this.subjectId = ''
              return
            }
            this.searchList.splice(index, 1, {id: item.id, name: item.name, type: 'grade'})
          }
        })
      }
      this.searchList.forEach((item, index) => {
        if (item.type === 'subject') this.searchList.splice(index, 1)
      })
      this.getSubjectList()
      this.getCollectionList()
    },
    // 选择学科
    subjectSelect (item, index) {
      this.subjectActive = index
      this.subjectId = item.id
      let n = 0
      n = (this.searchList.filter(item => item.type === 'subject')).length
      if (n === 0) {
        this.searchList.push({id: item.id, name: item.curriculumName, type: 'subject'})
      } else {
        this.searchList.forEach((val, index) => {
          if (val.type === 'subject') {
            if (item.id === val.id) {
              this.searchList.splice(index, 1)
              this.subjectId = ''
              return
            }
            this.searchList.splice(index, 1, {id: item.id, name: item.curriculumName, type: 'subject'})
          }
        })
      }
      this.getCollectionList()
    },
    // 查询学期
    getSemesterList () {
      this.$https.get(`/common/selectSemesterList`)
      .then(res => {
        if (res.data.code === 1) {
          this.semesterList = res.data.result.filter(item => item.state === 1)
          this.getCollectionList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学段信息列表
    getSectionList () {
      this.$https.get(`/common/sectionList`)
      .then(res => {
        if (res.data.code === 1) {
          this.sectionList = res.data.result
        } else if (res.data.code === -2) {
          //
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取年级信息列表
    getGradeList () {
      this.$https.get(`/common/selectGradeClassList?sectionId=${this.sectionId}&semesterId=${''}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    getSubjectList () {
      // 获取学科信息列表
      this.$https.get(`/common/selectCourseList?sectionId=${this.sectionId}&semesterId=${this.semesterList[0].semesterId}&gradeId=${this.gradeId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subjectList = res.data.result
        } else {
          notice(this, res.data.message, 3000)
        }
      })
    },
    // 获取我收藏的教案列表
    getCollectionList () {
      this.$https.get(`/mine/collectionList?sectionId=${this.sectionId}&gradeId=${this.gradeId}&courseId=${this.subjectId}&title=${this.title}&pageNo=${this.pageNo}&pageSize=${this.pageCount}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result.list
          this.totalCount = res.data.result.totalCount
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
      if (this.searchList.filter(item => item.type === 'grade').length === 0) this.gradeActive = ''
      if (this.searchList.filter(item => item.type === 'subject').length === 0) this.subjectActive = ''
      if (this.searchList.filter(item => item.type === 'section').length === 0) this.sectionActive = ''
    }
  },
  created () {
    this.receviedNum = sessionStorage.receviedNum
    if (!this.receviedNum) {
      this.receviedNum = 0
    }
    this.userId = this.user.user.loginUser.id
    this.getSemesterList()
    this.getSectionList()
    if (this.$route.query.pageNo) {
      this.pageNo = Number(this.$route.query.pageNo)
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#collect{
  
  // 筛选目录
  header{
    position: relative;
    padding-left: 80px;
    padding-bottom: $width*1;
    padding-top: 5px;
    border-bottom: 1px solid #E8EDF4;
    &>div{
      margin-top: $width;
    }
    // 学段--年级--学科
    .grade,.subject,{
      &.subject {
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
    // 搜索
    .search{
      margin-top: 15px;
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
    .recevied-num{
      position: absolute;
      top: -65px;
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
  }
  main{
    position: relative;
    padding: 40px 70px 100px;

    .main-top{
      text-align: center;
      padding-left: 20px;
      background: #DDE6EF;
      border-radius: 5px;
      margin-bottom: 20px;
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
        margin-left: 100px;
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
          width: 340px;
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

    .main-body{
      cursor: pointer;
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
