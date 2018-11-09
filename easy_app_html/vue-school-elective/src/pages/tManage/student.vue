<template>
  <div class="tStudent">
    <!-- 头部 -->
    <header>
      <ul>
        <li>
          选课活动：
          <el-select v-model="activeId" placeholder="请选择" @change="getLessonByTeacher(activeId)">
            <el-option
              v-for="item in actives"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>          
        </li>
        <li>
          课程名称：
          <el-select v-model="courseactive" placeholder="请选择">
            <el-option
              v-for="item in courses"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>          
        </li>
      </ul>
    </header>  

      <!--表格内容区-->
    <div class="content" v-loading="loading">
      <ul>
        <li>|&nbsp;上课地点：<span>{{locationName}}</span></li>
        <li>|&nbsp;上课时间：<span v-if="week">星期{{week | num}}</span>&nbsp;<span v-if="section">第{{section | num}}节</span></li>
        <li>|&nbsp;学生人数：<span>{{num}}</span></li>
      </ul>
      <el-button @click="exportName" type="success">导出名单</el-button>
      <!--表格-->
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="20%">
        </el-table-column>
        <el-table-column
          prop="gradeName"
          label="年级"
          width="35%">
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级"
          width="35%">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="学生姓名"
          width="20%">
        </el-table-column>        
      </el-table>      
    </div>      
  </div>
</template>

<script>
import { notice } from '../../api/index.js'
import service from '../../utils/axios.js'
// import { num } from '../../filters/index.js'
export default {
  name: 'tStudent',
  data () {
    return {
      loading: false,
      courseactive: '',
      actives: [],
      courses: [],
      activeId: '',
      tableData: [],
      locationName: '',
      week: '',
      section: '',
      num: '',
      index: ''
    }
  },
  methods: {
    // 获取选课活动
    getActivityByTeacher () {
      service.get(`tSituationController/getActivityByTeacher`)
      .then(res => {
        if (res.data.code === 1) {
          this.actives = res.data.result
          this.actives.length > 0 ? this.activeId = this.actives[0].id : this.activeId = ''
          // 获取课程名称
          this.getLessonByTeacher()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },

    // 获取课程名称
    getLessonByTeacher () {
      this.courseactive = ''
      service.get(`tSituationController/getLessonByTeacherList?activityId=${this.activeId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.courses = res.data.result
          this.courses.length > 0 ? this.courseactive = this.courses[0].id : this.courseactive = ''
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },

    // 导出
    exportName () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/tSituationController/teacherDownExcel?lessonId=${this.courseactive}`
    },

    // 获取课程详情
    getStudentForLesson () {
      this.loading = true
      setTimeout(() => {
        service.get(`tSituationController/getStudentForLesson?lessonId=${this.courseactive}`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.result.studentList
            if (res.data.result.studentCount !== null) {
              this.num = res.data.result.studentCount
            } else {
              this.num = 0
            }
          } else {
            notice(this, res.data.message, 2000)
          }
          this.loading = false
        })
        .catch(res => {
          notice(this, res.data.message, 2000)
        })
        .finally(res => {
          this.loading = false
        })
      }, 500)
    }
  },
  created () {
    // 获取选课活动
    this.getActivityByTeacher()
  },
  watch: {
    courseactive () {
      this.getStudentForLesson(this.courseactive)
      this.courses.forEach((item, i) => {
        if (this.courseactive === item.id) {
          this.index = i
        }
      })
      this.locationName = this.courses[this.index].locationName
      this.week = this.courses[this.index].week
      this.section = this.courses[this.index].section
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
.tStudent {
  // 头部
  header{
    padding: $width*2;
    background: $white;
    border-radius: 4px;
    margin-bottom: 25px;

    &>ul {
      margin: 0px;
      padding: 0px;

      &>li {
        list-style-type: none;
        margin-bottom: 20px;

        &>.el-select{
          width: 360px;
          margin-left: $width;
        }
      }
    }
  }

  // 表格内容
  .content {
    margin-top: 20px;
    background: $white;
    padding: $width  20% $width $width*2;    

    &>ul {
      margin: 0px;
      padding: 0px;

      &>li {
        list-style-type: none;
        color: #7bb2fe;
        font-weight: bold;
        line-height: 30px;
        margin: 15px 0px;
      }
    }

    // 按钮 
    &>.el-button {
      float: right;
      margin-bottom: 15px;
    }
    // 表格
    &>.el-table {
      margin-bottom: 10px; 
      margin-top: 20px;

      &>.el-table__header-wrapper {

        &>table {
          width: 100% !important;

          &>thead {
            &>tr {
              &>th {
                .cell {
                  text-align: center;                        
                }
              }
              &>td {
                text-align: center;
              }
            }
          }
        }

      }
      &>.el-table__body-wrapper {
        &>table, &>.el-table__empty-block {
          width: 100% !important;
        }
      }
    }    
  }
}
</style>
