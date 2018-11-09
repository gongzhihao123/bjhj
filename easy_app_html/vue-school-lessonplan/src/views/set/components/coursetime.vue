<template>
  <div id="coursetime">
    <div class="head">
        <span>备课管理>按照课时>查看</span>
        <router-link to="/set/lessonset">
        <i class="back"></i>
        返回上一层</router-link>
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

     <!--课时安排-->

     <div class="courseplan">
        <div class="content" v-loading="loading">
          <p v-if="weeks.length === 0">暂无数据</p>
            <div class="head-title" v-for="n in weeks">
                <span>第{{n}}周</span>
                <ul>
                    <li v-for="m in times">第{{m}}课时</li>
                </ul>
            </div>
        </div>
        <el-button @click="close">关闭</el-button>
     </div>
  </div>
</template>

<script>
import { error, notice } from '../../../api/index.js'
export default {
  name: 'coursetime',
  data () {
    return {
      cardloading: false,
      valuecontent: '',
      activeInd: 0,
      searchCount: 0,
      peroidInd: -1,
      gradeInd: -1,
      subjectInd: -1,
      weeks: '',
      times: '',
      loading: false,
      n: 1,
      m: 1,
      sectionId: '',
      gradeId: '',
      courseId: '',
      navInfo: [],
      peroid: [],
      grade: [],
      subject: [],
      options: [
        {semesterId: ''}
      ]
    }
  },
  methods: {
    link (item, index) {
      this.activeInd = index
      localStorage.activeInd = this.activeInd
      this.type = this.activeInd + 1
      this.clearSearch()
    },
    peroidClick (item, i) {
      if (this.peroidInd === i) {
        this.peroidInd = -1
        this.navInfo[0] = ''
        this.searchCount = 0
        this.clearSearch()
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
        this.getSemesterDetail()
        this.getSelectGradeClassList()
      }
    },
    gradeClick (item, i) {
      if (this.gradeInd === i) {
        this.gradeInd = -1
        this.navInfo[1] = ''
        this.searchCount--
        this.gradeId = ''
      } else {
        this.gradeInd = i
        this.gradeId = item.id
        this.subjectInd = -1
        this.navInfo[1] = item.name
        this.navInfo[2] = ''
        this.searchCount++
        this.getSelectCourseList()
      }
    },
    subjectClick (item, i) {
      if (this.subjectInd === i) {
        this.subjectInd = -1
        this.navInfo[2] = ''
        this.searchCount--
        this.courseId = ''
      } else {
        this.subjectInd = i
        this.navInfo[2] = item.curriculumName
        this.courseId = item.id
        this.getCoursetime()
        this.searchCount++
      }
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
            this.weeks = ''
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
    getSemesterDetail () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`/common/selectSemesterDetail?sectionId=${this.sectionId}&semesterId=${this.valuecontent}`)
          .then(res => {
            if (res.data.code === 1) {
              if (res.data.result) {
                this.weeks = res.data.result.weekNum
              } else {
                this.weeks = ''
                this.loading = false
                return
              }
            } else if (res.data.code === -2) {
              error(this)
            } else {
              notice(this, res.data.message, 3000)
            }
            this.loading = false
          })
          .catch(res => {
            notice(this, res.data.message, 2000)
          })
      }, 600)
    },
    getCoursetime () {
      this.loading = true
      setTimeout(() => {
        this.$https.get(`/common/selectClassHourList?sectionId=${this.sectionId}&gradeId=${this.gradeId}&courseId=${this.courseId}&semesterId=${this.valuecontent}`)
        .then(res => {
          if (res.data.code === 1) {
            if (!res.data.result) {
              this.times = ''
              return
            }
            this.times = res.data.result
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
          this.loading = false
        })
        .catch(res => {
          notice(this, res.data.message, 2000)
        })
      }, 600)
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
    close () {
      this.$router.push('/set/lessonset')
    },
    handleSearch (item, i) {
      switch (i) {
        case 0:
          this.navInfo[0] = ''
          this.clearSearch()
          break
        case 1:
          this.gradeInd = ''
          this.navInfo[1] = ''
          this.searchCount--
          break
        case 2:
          this.subjectInd = ''
          this.navInfo[2] = ''
          this.searchCount--
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
      this.gradeId = ''
      this.getSemesterDetail()
      this.getCoursetime()
    },
    scrollTop () {
      window.scrollTo(0, 0)
    }
  },
  created () {
    this.getSelectSemesterList()
    this.getSectionList()
    this.scrollTop()
  }
}
</script>

<style  lang="scss">
#coursetime {
    width: 100%;
    margin: 0px;
    padding: 0px;
    background: #fff;
    /*border: 1px solid #E3EAF4;*/
    min-width: 1025px;
    border-radius: 8px;

    .head {
      width: auto;
      height: 40px;
      background: #DDE6EF;
      padding-left: 20px;
      border-bottom: 1px solid #E1E8F1;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;      

      span {
        color: #636C7B;
        font-size: 14px;
        line-height: 40px;
        color: #636C7B;
        letter-spacing: 2px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;        
      }

      .publish {
        margin-left: 28px;
      }
      a {
        text-decoration: none;
        line-height: 40px;
        float: right;
        margin-right: 20px;
        position: relative;
        &:visited {
          color: #88909D;
        }
        color: #88909D;
        

        .back {
          width: 24px;
          height: 24px;
          display: block;
          vertical-align: middle;
          right: 85px;
          vertical-align: middle;
          position: absolute;
          top: 8px;
          background: url(../../../assets/images/back.png) no-repeat;

        }
      }

      a:hover {
        color: #408EE6;
        cursor: pointer;

        .back {
          background: url(../../../assets/images/back-active.png) no-repeat;
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
        > span {
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
      display: flex;
      flex-wrap: wrap;
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
        margin: 0 15px 15px 0px;
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
          padding: 0 10px;
          margin-right: 8px;
          &:first-child {
            margin-left: 10px;
          }
          i {
            font-size: 12px;
            margin-left: 5px;
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
        margin-left: 36%;

        img {
            margin-left: 0px;
            margin-top: 0px;
        }

        .input-box {
          img {
              margin-right: 15px;
              vertical-align: middle;
          }
          input {
            outline: none;
            background: #DDE6EF;
            border-left: 1px solid #9EA7B4;
            border-top: none;
            border-right: none;
            border-bottom: none;
            text-indent: 1em;
            color: #B2BAC7;
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
    .courseplan {
        padding: 40px 60px 0px 66px;
        .content {
            /*width: 100%;*/
            border: 1px solid #B7C2D0;
            border-radius: 4px;
            height: auto;
            padding: 5px 30px 0px 37px;
            margin-bottom: 40px;
            height: 950px;
            overflow-x: hidden;
            position: relative;

            p {
              position: absolute;
              top: 20%;
              left: 50%;
              color: #636C7B;
            }
            .head-title {
              width: 100%;
              min-height: 25%;

              span {
                  line-height: 40px;
                  color: #8A929F;
                  font-size: 14px;
                  /*margin-left: 20px;*/
                  width: 100%;
                  background: #DDE6EF;
                  border-radius: 4px;
                  margin-top: 35px;
                  height: 40px;
                  display: block;
                  padding-left: 20px;
              }

              ul {
                li {
                    list-style-type: none;
                    line-height: 20px;
                    padding: 5px 0px;
                    color: #8A929F;
                }
              }
            }            
        }

        .el-button {
            margin-left: 48%;
            width: 90px;
            height: 30px;
            margin-bottom: 34px;
            border: 1px solid #FF6C60;
            position: relative;
            padding: 0px;

            &:hover {
              background: #FF6C60;
              span {
                color: #fff;
              }
            }
            span {
              color: #FF6C60;
              position: absolute;
              width: 90px;
              left: 0px;
              text-align: center;
              height: 30px;
              line-height: 30px;
              top: 0px;
            }
        }


    }
}

</style>
