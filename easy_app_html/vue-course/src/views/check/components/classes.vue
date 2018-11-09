<template>
  <div id="classes">
    <!--班级课表-->
    <header class="header">
       <el-checkbox v-model="showTeacherName">显示教师姓名</el-checkbox>
       <el-checkbox v-model="showCourseFull">显示课程全称</el-checkbox>
       <div class="button-group">
         <el-button type="warning" @click="exportTable(1)">导出Excel</el-button>
         <el-button type="warning" @click="exportTable">导出所有班级Excel</el-button>
       </div>
    </header>
    <div class="grade-layout">
      <div class="tree">
        <el-tree
          class="filter-tree"
          :data="gradeList"
          :props="defaultProps"
          @node-click="nodeClick"
          :highlight-current="true">
        </el-tree>
      </div>
      <div class="table-box">
        <table class="grade-table check-table">
          <thead>
            <tr>
              <td>课节</td>
              <td v-for="(item, i) of weekList" :key="i">{{ item.name }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in tableList" :key="i">
              <td>{{ item.lesson | lessonFilter }}</td>
              <td v-for="(items, index) in item.week" :key="index" v-show="index < 5">
                <span class="teacher-name" v-show="showCourseFull">{{ items.subjectFullName }}</span>
                <span class="teacher-name" v-show="!showCourseFull">{{ items.subjectShortName }}</span>
                <span class="teacher-name" v-show="showTeacherName">{{ items.teacherName }}</span>
                <span class="teacher-name" v-show="items.classNoarrangeReasonContent">{{ items.classNoarrangeReasonContent }}</span>
                <span class="teacher-name" v-show="items.classroomCatagoryName">{{ items.classroomCatagoryName }}</span>
                <!-- {{items.lesson}}{{items.lessonPart}}{{items.week}} -->
              </td>
            </tr>
          </tbody>
          <tfoot v-show="tableList.length == 0">
            <tr>
              <td colspan="6" class="no-content">暂无数据</td>
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
  name: 'classes',
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
      gradeList: [],
      defaultProps: {
        children: 'classList',
        label: 'name'
      },
      classActive: {},
      tableList: [],
      courseList: [],
      loading: false,
      lessonList: []
    }
  },
  computed: {
    ...mapGetters([
      'semesterId',
      'section'
    ])
  },
  components: {
    vueLoading
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
          this.gradeList = (res.data.result || []).map((item, i) => ({
            ...item,
            parent: 1,
            gradeIndex: i,
            classList: item.classList.map(classes => ({ name: classes.className, classList: null, gradeId: item.id, gradeName: item.name, gradeIndex: i, id: classes.id }))
          }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async nodeClick (data) {
      if (data.parent === 1) {
        // 选择年级
        this.classActive.gradeIndex = data.gradeIndex
        this.classActive.gradeId = data.id
        this.classActive.gradeName = data.name
      } else {
        // 班级
        this.classActive = {...data}
        await this.getLesson(data)
        this.getTable()
      }
    },
    getTable () {
      // this.semesterId.semesterId 201701
      // this.classActive.id 131
      this.loading = true
      this.$https.get(`/timeTable/classView?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&gradeId=${this.classActive.gradeId}&classId=${this.classActive.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let tableList = res.data.result
          // let length = 0
          let arr = this.lessonList
          this.tableList = []
          // tableList.forEach(item => {
          //   if (!item.courseList) return
          //   if (item.courseList.length > length) {
          //     arr = item.courseList
          //     length = item.courseList.length
          //   }
          // })
          let index = arr.filter(item => item.lessonPart === 1).length
          let a = index
          arr.forEach(item => {
            if (item.lessonPart === 2) {
              item.lesson = index++
            }
          })
          for (let i = 0; i < tableList.length; i++) {
            if (!tableList[i].courseList) continue
            index = a
            tableList[i].courseList.forEach(items => {
              if (items.lessonPart === 2) {
                items.lesson = index++
              }
            })
          }
          this.courseList = arr
          arr = []
          for (let i = 0; i < tableList.length; i++) {
            if (!tableList[i].courseList) continue
            tableList[i].courseList.forEach(items => {
              arr.push(items)
            })
          }
          // console.log(arr)
          this.courseList.forEach((item, i) => {
            this.tableList[i] = {}
            this.tableList[i].lesson = item.lesson
            this.tableList[i].week = arr.filter(item => item.lesson === i)
          })
          this.loading = false
          // 自动补全
          this.tableList.forEach(item => {
            if (item.week.length !== 5) {
              // item.week = []
              let arr = [...item.week]
              for (let i = 1; i < 6; i++) {
                // item.week.push({week: i})
                let a = arr.filter(items => items.week === i)
                // console.log(a)
                if (a.length) {
                  item.week[i - 1] = a[0]
                } else {
                  item.week[i - 1] = {}
                }
              }
            }
          })
          // console.log(this.tableList)
        } else {
          this.loading = false
          notice(this, res.data.message, 2000)
        }
      })
    },
    exportTable (s) {
      let grade = this.classActive
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
        if (!grade.name) {
          notice(this, '请选择班级', 2000)
          return
        }
        window.location.href = `${path}/timeTable/classExport?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&showFullName=${this.showCourseFull}&showTeacherName=${this.showTeacherName}&sectionName=${this.section.name}&clazzName=${grade.gradeName + grade.name}&clazzId=${grade.id}`
      } else {
        // if (!grade.gradeIndex && grade.gradeIndex !== 0) {
        //   notice(this, '请选择年级', 2000)
        //   return
        // }
        let classNames = []
        this.gradeList.forEach(item => {
          item.classList.forEach(items => {
            classNames.push(item.name + items.name)
          })
        })
        classNames = classNames.join(',')
        window.location.href = `${path}/timeTable/classExport?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&showFullName=${this.showCourseFull}&showTeacherName=${this.showTeacherName}&sectionName=${this.section.name}&clazzName=${classNames}`
      }
    },
    async getLesson (data) {
      await this.$https.get(`common/selectLessonHour?sectionId=${this.section.id}` +
                      `&semesterId=${this.semesterId.semesterId}` +
                      `&gradeId=${data.gradeId}` +
                      `&classId=${data.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.lessonList = res.data.result.filter(item => item.week === 1)
        }
      })
    }
  },
  watch: {
    semesterId () {
      this.getGrade()
    },
    section () {
      this.getGrade()
    }
  },
  filters: {
    lessonFilter (val) {
      if (val === 10) return '第十节'
      let lesson = {
        '0': '早读',
        '1': '第一节',
        '2': '第二节',
        '3': '第三节',
        '4': '第四节',
        '5': '第五节',
        '6': '第六节',
        '7': '第七节',
        '8': '第八节',
        '9': '第九节'
      }
      return lesson[val]
    }
  }
}
</script>

<style lang="scss" scoped>
#classes {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  tbody td {
    height: 60px;
  }
  .teacher-name {
    display: block;
  }
  .tree {
    overflow: auto;
  }
  .grade-layout {
    position: absolute;
    left: 0;
    right: 0;
    top: 40px;
    bottom: 0;
  }
}
</style>
