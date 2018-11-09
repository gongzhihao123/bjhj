<template>
  <div id="classroom">
    <!--教室课表-->
    <header class="header">
       <el-checkbox v-model="showTeacherName">显示教师姓名</el-checkbox>
       <el-checkbox v-model="showCourseFull">显示课程</el-checkbox>
       <div class="button-group">
         <el-button type="warning" @click="exportTable(1)">导出Excel</el-button>
         <el-button type="warning" @click="exportTable">导出所有教室Excel</el-button>
       </div>
    </header>
    <div class="grade-layout">
      <div class="tree">
        <el-tree
          class="filter-tree"
          :data="classroomList"
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
                <span class="teacher-name" v-show="items.gradeName">{{ section.name }}{{ items.gradeName }}{{ items.className }}</span>
                <span v-if="items.connet">{{ items.connet }}</span>
                <span class="teacher-name" v-show="showCourseFull">{{ items.subjectFullName }}</span>
                <span class="teacher-name" v-show="showTeacherName">{{ items.teacherName }}</span>
                <span class="teacher-name" v-show="items.classNoarrangeReasonContent">{{ items.classNoarrangeReasonContent }}</span>
                <!-- <span class="teacher-name" v-show="items.classroomCatagoryName">{{ items.classroomCatagoryName }}</span> -->
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
  name: 'classroom',
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
      classroomList: [],
      defaultProps: {
        children: 'classList',
        label: 'name'
      },
      classActive: {},
      tableList: [],
      courseList: [],
      loading: false,
      lessonList: [],
      haveMorningRead: false,
      maxMorning: 0,
      maxAfternoon: 0,
      morningLesson: [],
      afternoonLesson: []
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
      this.getCategory()
    }
  },
  methods: {
    getCategory () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`/timeTable/classRoomList`)
      .then(res => {
        if (res.data.code === 1) {
          this.classroomList = (res.data.result || []).map((item, i) => ({
            ...item,
            name: item.categoryName,
            parent: 1,
            gradeIndex: i,
            classList: item.classrooms.map(classes => ({ ...classes, name: classes.classroomNo, classList: null, classRoomId: classes.id, id: classes.id }))
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
        await this.getMaxLesson(data)
        this.getTable()
      }
    },
    // 获取最大课节数
    async getMaxLesson () {
      await this.$https.get(`common/selectMaxLessonHour?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        this.haveMorningRead = res.data.result.haveMorningRead
        this.maxMorning = res.data.result.maxMorning
        this.maxAfternoon = res.data.result.maxAfternoon
        this.morningLesson = []
        this.afternoonLesson = []
        if (this.haveMorningRead) {
          // 判断前提是有早读的情况下，再判断课节列表第一个是不是早读，如果没有早读，先把早读放进去
          if (this.morningLesson[0]) {
            if (this.morningLesson[0].lesson !== 0) {
              this.morningLesson.unshift({lesson: 0, lessonPart: 1})
            }
          }
        }
        // 如果上午课节比最大课节小的话
        if (this.morningLesson.length < (this.maxMorning + 1)) {
          this.morningLesson = this.motionLesson(this.morningLesson, (this.maxMorning + 1), 1)
        }
        this.morningLesson = this.morningLesson.map(item => ({
          lesson: item.lesson,
          lessones: item.lesson,
          lessonPart: item.lessonPart
        }))
        if (this.afternoonLesson.length < this.maxAfternoon) {
          this.afternoonLesson = this.motionLesson(this.afternoonLesson, this.maxAfternoon, 2)
        }
        this.after = this.afternoonLesson.map(item => ({
          lesson: item.lesson + 1,
          lessones: this.maxMorning + item.lesson + 1,
          lessonPart: item.lessonPart
        }))
        this.lessonList = this.morningLesson.concat(this.after)
        // console.log(this.lessonList)
      })
    },
    // 补全课节
    motionLesson (arr, length, lessonPart) {
      let arr1
      if (!arr) {
        arr1 = []
      } else {
        arr1 = arr.map(item => item.lesson)
      }
      let arr2 = []
      for (let i = 0; i < length; i++) {
        arr2.push({lesson: i, lessonPart})
      }
      for (let i = 0; i < length; i++) {
        let a = arr1.filter(item => item === i)
        if (a.length) {
          arr2[a[0]] = arr[arr1.indexOf(a[0])]
        }
      }
      return arr2
    },
    getTable () {
      this.loading = true
      this.$https.get(`timeTable/classRoomView?semesterId=${this.semesterId.semesterId}&classRoomId=${this.classActive.classRoomId}`)
      .then(res => {
        if (res.data.code === 1) {
          let tableList = res.data.result
          let arr = this.lessonList
          this.tableList = []
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
                if (a.length === 1) {
                  item.week[i - 1] = {...a[0]}
                } else if (a.length > 1) {
                  item.week[i - 1] = {...a[0]}
                  item.week[i - 1].connet = `${this.section.name}${a[1].gradeName}${a[1].className}`
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
      let path = document.querySelector('#contextPath').value
      if (s === 1) {
        if (!grade.id) {
          notice(this, '请选择教室', 2000)
          return
        }
        window.location.href = `${path}/timeTable/classRoomViewExport?semesterId=${this.semesterId.semesterId}&classRoomId=${grade.id}&classroomNo=${grade.classroomNo}&categoryName=${grade.categoryName}`
      } else {
        window.location.href = `${path}/timeTable/classRoomViewExport?semesterId=${this.semesterId.semesterId}`
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
      this.getCategory()
    },
    section () {
      this.getCategory()
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
#classroom {
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
