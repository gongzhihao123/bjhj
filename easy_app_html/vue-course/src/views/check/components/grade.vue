<template>
  <div id="grade">
    <!--年级课表-->
    <header class="header">
       <el-checkbox v-model="showTeacherName">显示教师姓名</el-checkbox>
       <el-checkbox v-model="showCourseFull">显示课程全称</el-checkbox>
       <div class="button-group">
         <el-button type="warning" @click="exportTable(1)">导出Excel</el-button>
         <el-button type="warning" @click="exportTable">导出所有年级Excel</el-button>
       </div>
    </header>
    <div class="grade-layout">
      <div class="tree">
        <ul class="grade-list">
          <li v-for="(item, i) in gradeList" :key="item.name" :class="{active: gradeInd == i}" @click="switchGrade(item, i)">{{ item.name }}</li>
        </ul>
        <p v-if="gradeList.length == 0" class="no-content none">暂无数据</p>
      </div>
      <div class="theader">
        <span class="set-width">课节</span>
        <span class="set-width">班级</span>
        <span class="set-width" v-for="item of weekList" :key="item.name">{{ item.name }}</span>
      </div>
      <div class="table-box">
        <table class="grade-table check-table">
          <!-- <thead>
            <tr>
              <td>课节</td>
              <td>班级</td>
              <td v-for="item of weekList" :key="item.name">{{ item.name }}</td>
            </tr>
          </thead> -->
          <tbody>
            <tr v-for="item in courseList" :key="item.name">
              <td>{{ item.name }}</td>
              <td>
                <table>
                  <tr v-for="(items, i) in item.course" :key="i">
                    <td class="get-width">{{ items.clazzName }}</td>
                  </tr>
                </table>
              </td>
              <td v-for="i in 5" :key="i">
                <table>
                  <tr v-for="items in item.course" :key="items.clazzName">
                    <td>
                      <span v-show="showCourseFull" v-if="items.weekList[i - 1].courseList">{{ items.weekList[i - 1].courseList[0].subjectFullName }}</span>
                      <span v-show="!showCourseFull" v-if="items.weekList[i - 1].courseList">{{ items.weekList[i - 1].courseList[0].subjectShortName }}</span>
                      <span v-show="showTeacherName" v-if="items.weekList[i - 1].courseList">{{ items.weekList[i - 1].courseList[0].teacherName }}</span>
                      <span v-if="items.weekList[i - 1].courseList">{{ items.weekList[i - 1].courseList[0].classNoarrangeReasonContent }}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr v-if="courseList.length == 0">
              <td colspan="7" class="no-content">暂无数据</td>
            </tr>
          </tfoot>
        </table>
        <vue-loading type="bars" color="#d9544e" :size="{ width: '50px', height: '50px' }" v-show="loading"></vue-loading>
      </div>
    </div>
    
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import vueLoading from 'vue-loading-template'
import { notice } from '../../../api/index.js'
export default {
  name: 'grade',
  data () {
    return {
      weekList: [
        { name: '星期一', week: 1 },
        { name: '星期二', week: 2 },
        { name: '星期三', week: 3 },
        { name: '星期四', week: 4 },
        { name: '星期五', week: 5 }
      ],
      showCourseFull: false,
      showTeacherName: false,
      gradeInd: -1,
      gradeList: [],
      gradeActive: {},
      courseList: [],
      loading: false
    }
  },
  components: {
    vueLoading
  },
  computed: {
    ...mapGetters([
      'semesterId',
      'section'
    ])
  },
  created () {
    if (this.semesterId.semesterId && this.section.id) {
      this.getGrade()
    }
  },
  methods: {
    getGrade () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`/common/selectGradeClassList?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result
          this.gradeInd = 0
          this.gradeActive = this.gradeList[0]
          this.getTable()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    switchGrade (item, i) {
      this.gradeInd = i
      this.gradeActive = item
      this.getTable()
    },
    getTable () {
      // this.semesterId.semesterId
      this.courseList = []
      this.loading = true
      this.$https.get(`/timeTable/gradeView?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&gradeId=${this.gradeActive.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let tableList = res.data.result
          if (tableList) {
            for (let i in tableList) {
              this.courseList.push({ name: i, course: tableList[i] })
            }
          }
          this.loading = false
        } else {
          notice(this, res.data.message, 2000)
          this.loading = false
        }
        this.$nextTick(() => {
          if (document.querySelectorAll('.get-width').length) {
            let w = document.querySelectorAll('.get-width')[0].clientWidth
            document.querySelectorAll('.set-width').forEach(item => {
              item.style.width = w + 'px'
            })
          }
          // console.log(w)
        })
      })
    },
    exportTable (s) {
      let grade = this.gradeActive
      if (!this.semesterId.semesterId) {
        notice(this, '请选择学期', 2000)
        return
      }
      if (!this.section.id) {
        notice(this, '请选择学段', 2000)
        return
      }
      let path = document.querySelector('#contextPath').value
      if (s === 1) {
        window.location.href = `${path}/timeTable/gradeExport?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&sectionName=${this.section.name}&showFullName=${this.showCourseFull}&gradeId=${grade.id}&gradeName=${grade.name}&showTeacherName=${this.showTeacherName}`
      } else {
        let gradeName = this.gradeList.map(item => item.name).join(',')
        window.location.href = `${path}/timeTable/gradeExport?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&sectionName=${this.section.name}&showFullName=${this.showCourseFull}&showTeacherName=${this.showTeacherName}&gradeName=${gradeName}`
      }
    }
  },
  watch: {
    semesterId () {
      this.getGrade()
    },
    section () {
      this.getGrade()
    }
  }
}
</script>
<style lang="scss" scoped>
#grade {
  min-height: 400px;
  .table-box {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 250px;
    top: 90px;
    overflow: auto;
  }
  .theader {
    // position: fixed;
    // left: 270px;
    position: absolute;
    left: 250px;
    right: 0;
    background: #26CEA9;
    color: #fff;
    height: 40px;
    line-height: 40px;
    border-radius: 6px;
    box-sizing: border-box;
    span {
      display: inline-block;
      width: 160px;
      text-align: center;
      border-right: 1px solid #ccc;
    }
  }
  .tree {
    min-height: 80px;
  }
  .grade-table {
    tbody {
      background: #fff;
      td {
        height: 60px;
        width: 160px;
        table {
          border-width: 0;
          td {
            border-width: 0;
            border-bottom-width: 1px;
          }
          span {
            display: block;
          }
        }
      }
    }
  }
}
</style>
