<template>
  <div id="add-synergy">
    <!--顶部导航-->
    <header>
      <p>我的&nbsp;> &nbsp;我的协同&nbsp;>&nbsp;新增协同
        <span @click="goBack">
          返回上一层
        </span>   
      </p>
    </header>

    <div class="screening">
      <div class="grade">
        <i>年级：</i>
        <span v-for="(item, index) in gradeList" :key="index" @click="gradeSelect(item, index)" :class="{active: gradeActive===index}">
          {{item.gradeName}}
        </span>
      </div>
      <transition name="slide-down" mode="out-in">
        <div class="grade" v-if="courseList.length !== 0">
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

      <el-row class="save-operation">
        <span>
          截止时间：
          <el-date-picker
            type="date"
            v-model="dateValue"
            placeholder="选择日期">
          </el-date-picker>
        </span>
        <div class="invitedTeacher">
          受邀老师：
          <i>
            <span v-if="selectedTeacherList.length === 0">请选择受邀老师</span>
            <span class="has-selected-teacher" v-for="(item, index) in selectedTeacherList" :key="index">
              {{item.name}}
              <b style="font-weight: normal;" v-if="index + 1 !== selectedTeacherList.length">、</b>
            </span>
          </i>
          <sup @click="teacherBoxShow"></sup>
          <transition name="slide-left" mode="out-in">
            <div class="teacher" v-if="teacherShow">
              <div class="teacher-left">
                <el-input v-model="filterPeople"></el-input>
                <el-tree
                  class="filter-tree"
                  show-checkbox
                  :data="tree"
                  :props="defaultProps"
                  node-key="userId"
                  ref="tree"
                  :filter-node-method="filterNode"
                  @check-change="changeTeacher"
                  >
                </el-tree>
              </div>
              <div class="teacher-right">
                <p class="has-selected-teacher" v-for="(item, index) in selectedTeacherList" :key="index">
                  {{item.name}}
                  <img @click="deleteUser(item, index)" src="../../../assets/images/name-close.png">
                </p>
              </div>
              <span class="select-teacher-button">
                <el-button @click="teacherShow = false">确定</el-button>
                <el-button @click="teacherShow = false">取消</el-button>
              </span>
            </div>
          </transition>
        </div>
        <span>
          <el-button @click="save">保存</el-button>
          <el-button @click="goBack">取消</el-button>
        </span>
      </el-row>
    </div>

    <main>
      <el-input placeholder="输入关键字搜索" :maxlength="50" v-model="title" @keyup.enter.native="handleIconClick" :on-icon-click="handleIconClick" icon="search"> </el-input>
      <el-row class="main-top">
        <el-col :span="8">
          教案名称
        </el-col>
        <el-col :span="8">
          年级
        </el-col>
        <el-col :span="8">
          学科
        </el-col>
      </el-row>
      <p style="text-align: center;margin-top: 20px;color: #636C7F;" class="no-result" v-if="list.length === 0">暂无数据</p>
      <el-row class="main-body" v-for="(item, index) in list" :key="index">
          
        <el-col :span="8">
          <el-checkbox @change="addDelete(item)" v-model="item.checked"></el-checkbox>
          <span v-if="item.title.length > 15">
            {{item.title.slice(0, 15) + '...'}}
          </span>
          <span v-else>
            {{item.title}}
          </span>
        </el-col>
        <el-col :span="8">
          {{item.gradeName}}
        </el-col>
        <el-col :span="8">
          {{item.courseName}}
        </el-col>
      </el-row>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </main>
  </div>
</template>

<script>
import { notice, success } from '../../../api/index.js'
import { mapGetters, mapActions } from 'vuex'
import { TreeMenu } from '../../../api/tree'
import { dateFormatT } from '../../../filters/index.js'
export default {
  name: 'addSynergy',
  data () {
    return {
      gradeList: [],
      courseList: [],
      list: [],
      dateValue: '',
      endTime: '',
      userId: '',
      pageNo: 1,
      pageCount: 10,
      title: '',
      totalCount: 0,
      tree: [],
      teacherShow: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchList: [],
      teacherList: [],
      selectedTeacherList: [],
      gradeActive: '',
      gradeValue: '',
      courseActive: '',
      courseValue: '',
      filterPeople: ''
    }
  },
  methods: {
    ...mapActions([
      'recevied'
    ]),
    // 过滤树节点
    filterNode (value, data) {
      console.log(value)
      if (!value) return true
      return data.name.indexOf(value) !== -1
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
      this.getLessonPlanList()
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
      this.getLessonPlanList()
    },
    // 清空搜索列表
    clearSearch () {
      this.searchList = []
      this.gradeValue = ''
      this.courseValue = ''
      this.getLessonPlanList()
    },
    // 删除搜索列表
    delSearList (item, index) {
      this.searchList.splice(index, 1)
      if (item.type === 'grade') this.gradeValue = ''
      if (item.type === 'course') this.courseValue = ''
      this.getLessonPlanList()
    },
    teacherBoxShow () {
      this.teacherShow = !this.teacherShow
      if (this.teacherShow) {
        setTimeout(() => {
          this.$refs.tree.setCheckedNodes(this.selectedTeacherList)
        }, 200)
      }
    },
    // 搜索按钮
    handleIconClick () {
      this.getLessonPlanList()
    },
    handleSizeChange (val) {
      this.pageCount = val
      this.getLessonPlanList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getLessonPlanList()
    },
    // 保存协同
    save () {
      if (this.dateValue === '') {
        notice(this, '请选择截止日期', 2000)
        return
      }
      this.endTime = dateFormatT(this.dateValue.getTime() + 86400000, 'yyyy-MM-dd hh:mm:ss')
      let json = []
      this.selectedTeacherList.forEach((item, index) => {
        json.push({id: item.userId, name: item.name})
      })
      let planId = ''
      this.list.forEach((item, index) => {
        if (item.checked === true) {
          planId = item.id
        }
      })
      if (planId === '') {
        notice(this, '请选择要添加协同的选项', 2000)
        return
      }
      if (json.length === 0) {
        notice(this, '请选择受邀老师', 2000)
        return
      }
      this.$https.get(`/mine/synergyUpdate?planId=${planId}&json=${JSON.stringify(json)}&endTime=${this.endTime}`)
      .then(res => {
        if (res.data.code === 1) {
          this.recevied('1')
          success(this, '添加协同成功', 1000)
          this.$router.push('/my/collaborate')
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    deleteUser (item, index) {
      this.selectedTeacherList.splice(index, 1)
      this.$refs.tree.setCheckedNodes(this.selectedTeacherList)
    },
    addDelete (item, index) {
      this.list.forEach((child, index) => {
        if (child.id !== item.id) {
          child.checked = false
        }
      })
    },
    goBack () {
      this.$router.push('/my/collaborate')
    },
    getGradeAndCourseData () {
      // 获取教师对应的信息
      this.$https.get(`/common/selectGradeSimpleCourse?teacherId=${this.userId}&semesterId=${this.semesterList[0].semesterId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result
          // this.courseList = res.data.result[0].courseList
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
          this.semesterList = res.data.result.filter(item => item.state === 1)
          this.getDeptList()
          this.getLessonPlanList()
          this.getGradeAndCourseData()
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取部门
    getDeptList () {
      this.$https.get(`/common/selectDeptList?semesterId=${this.semesterList[0].semesterId}`)
      .then(res => {
        this.teacherList = res.data.result
        if (res.data.code === 1) {
          res.data.result.forEach((item, index) => {
            this.$https.get(`/common/selectDeptUserList?deptId=${item.id}&keyword=${''}`)
            .then(res => {
              res.data.result.forEach((item, index) => {
                if (item.userId === this.userId) {
                  res.data.result.splice(index, 1)
                }
              })
              this.teacherList = this.teacherList.concat(res.data.result.map(item => ({...item, parentId: item.deptId})))
              this.tree = new TreeMenu(this.teacherList).init(0)
            })
          })
        }
      })
    },
    // 获取我的教案列表
    getLessonPlanList () {
      this.$https.get(`/mine/lessonPlanList?type=${1}&semesterId=${this.semesterList[0].semesterId}&sectionId=${''}&gradeId=${this.gradeValue}&courseId=${this.courseValue}&title=${this.title}&parentId=${''}&week=${''}&hour=${''}&pageNo=${this.pageNo}&pageSize=${this.pageCount}`)
      .then(res => {
        if (res.data.code === 1) {
          this.totalCount = res.data.result.totalCount
          this.list = res.data.result.list.map(item => ({...item, checked: false}))
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    changeTeacher (a, b) {
      if (a.deptId) {
        if (b === true) {
          if ((this.selectedTeacherList.filter(item => item.userId === a.userId)).length === 0) {
            this.selectedTeacherList.push(a)
          }
        } else {
          var list = []
          this.selectedTeacherList.forEach((m, index) => {
            if (m.userId !== a.userId) {
              list.push(m)
            }
          })
          this.selectedTeacherList = list
        }
      }
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
      this.getLessonPlanList()
    },
    filterPeople (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.userId = this.user.user.loginUser.id
    this.getSemesterList()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#add-synergy{
  // 顶部导航
  header{
    height: 42px;
    background: #DDE6EF;
    box-sizing: border-box;
    padding:10px 20px;
    p{
      margin: 0;
      color: #78818E;
      cursor: pointer;
      span{
        height: 25px;
        line-height: 25px;
        float: right;
        padding-left: 30px;
        background: url(../../../assets/images/back.png) no-repeat;
        &:hover{
          color: #408EE6;
          background: url(../../../assets/images/back-active.png) no-repeat;
        }
      }
    }
  }

  // 筛选
  .screening{
    padding: 0 0 10px 60px;
    border-bottom: 1px solid #ddd;
    .grade{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: $width;
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
    .save-operation{
      padding: 20px 0;
      &>span,.invitedTeacher{
        display: inline-block;
        margin-right: 20px;
        color: #636C7B;
        .el-date-editor{
          margin-left: 10px;
          .el-input__inner{
            height: 30px; 
          }
          .el-input__icon{
            font-size: 19px;
            width: 30px;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            background: #A2AECD;
            color: #fff;
            cursor: pointer;

            &:hover{
              background: #408EE6;
            }
          }
        }
        &>i{
          line-height: 28px;
          color: #97A8BE;
          padding-left: 10px;
          font-style: normal;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          vertical-align: middle;
          height: 28px;
          overflow: auto;
          margin-left: 10px;
          display: inline-block;
          width: 188px;
          border: 1px solid #BFCBD9;
        }
        sup{
          display: inline-block;
          width: 30px;
          height: 30px;
          background: url(../../../assets/images/selected-teacher.png);
          vertical-align: middle;
          margin-left: -5px;
          cursor: pointer;
          &:hover{
            background: url(../../../assets/images/teacher-blue.png);
          }
        }
      }
      .invitedTeacher{
        position: relative;
      }
      .teacher{
        position: absolute;
        z-index: 101;
        box-shadow: 2px 0px 5px #DDE6EF;
        background: #fff;
        border-radius: 5px;
        left: 82px;
        width: 350px;
        height: 300px;
        border: 1px solid #BFCBD9;
        .teacher-left{
          float: left;
          width:200px;
          height: 250px;
          overflow-x: hidden;
          border-right: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          padding: 5px;
          box-sizing: border-box;
          .el-tree{
            border: 0;
          }
        }
        .teacher-right{
          padding-top: 10px;
          float: right;
          overflow-x: hidden;
          width: 150px;
          height: 239px;
          border-bottom: 1px solid #ddd;
          p{
            padding: 2px 20px;
            font-size: 15px;
            color: #7AB1FB;
            img{
              float: right;
              cursor: pointer;
            }
          }
        }
        .select-teacher-button{
          clear: both;
          display: block;
          padding-top: 10px;
          text-align: center;
          .el-button{
            padding: 8px 28px;
          }
          .el-button:nth-child(1){
            border: 1px solid #408EE6;
            color: #4390E6;
            &:hover{
              background: #408EE6;
              color: $white;
            }
          }
          .el-button:nth-child(2){
            border: 1px solid #FF6C60;
            color: #FF6C60;
            background: #fff;
            &:hover{
              background: #FF6C60;
              color: $white;
            }
          }
        }
      }
      span:nth-child(3){
        .el-button{
          padding: 9px 30px;
        }
        .el-button:first-child{
          border: 1px solid #408EE6;
          color: #408EE6;
          &:hover{
            background: #408EE6;
            color: #fff;
          }
        }
        .el-button:last-child{
          border: 1px solid #FF6C60;
          color: #FF6C60;
          &:hover{
            background: #FF6C60;
            color: #fff;
          }
        }
      }
    }
  }

  main{
    padding: 30px 70px;
    padding-bottom: 300px;
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
      &:last-child{
        border: 0;
      }
      .el-col:first-child{
        .el-checkbox{
          margin-left: 20px;
          float: left
        }
        &>span{
          margin-left: -30px;
        }
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
