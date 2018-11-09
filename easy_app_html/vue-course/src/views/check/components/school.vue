<template>
  <div id="school">
    <!--学校课表-->
    <header class="header">
       <el-checkbox v-model="showCourseFull">显示课程全称</el-checkbox>
       <div class="button-group">
         <el-button type="warning" @click="exportTable(1)">导出横版Excel</el-button>
         <el-button type="warning" @click="exportTable(2)">导出竖版Excel</el-button>
       </div>
    </header>
    <div class="table-box">
      <table class="school-table check-table">
        <thead>
          <tr>
            <td>年级</td>
            <td>班级</td>
            <td v-for="item of weekList" :key="item.name">{{item.name}}</td>
          </tr>
          <tr v-if="courseList.length != 0">
            <td></td>
            <td></td>
            <td v-for="item of weekList" :key="item.name">
              <table>
                <tr>
                  <td v-for="(course, i) in courseList" :key="i">{{course.lessones | lessonFilter}}</td>
                </tr>
              </table>
            </td>
          </tr>
        </thead>
        <!-- 年级 -->
        <tbody v-for="(grade, index) in tableList" :key="index">
          <!-- 班级第一行 -->
          <tr v-for="(classes, ind) in grade.clazzList" :key="ind" v-if="ind == 0">
            <!-- 周 -->
            <td :rowspan="grade.clazzList.length">{{ grade.gradeName }}</td> 
            <td>{{ classes.clazzName }}</td>
            <td v-for="(week, i) in classes.weekList" :key="i">
              <table>
                <tr>
                  <td v-for="course in week.courseList" :key="course.id">
                    <span v-show="showCourseFull">{{ course.subjectFullName }}</span>
                    <span v-show="!showCourseFull">{{ course.subjectShortName }}</span>
                    <span v-show="course.classNoarrangeReasonContent">{{ course.classNoarrangeReasonContent }}</span>
                  </td>
                </tr>
              </table>
            </td> 
          </tr>
          <!-- 班级 -->
          <tr v-for="(classes, ind) in grade.clazzList" :key="ind" v-if="ind != 0">
            <!-- 周 -->
            <td>{{ classes.clazzName }}</td>
            <td v-for="(week, i) in classes.weekList" :key="i">
              <table>
                <tr>
                  <td v-for="course in week.courseList" :key="course.id">
                    <span v-show="showCourseFull">{{ course.subjectFullName }}</span>
                    <span v-show="!showCourseFull">{{ course.subjectShortName }}</span>
                    <span v-show="course.classNoarrangeReasonContent">{{ course.classNoarrangeReasonContent }}</span>
                  </td>
                </tr>
              </table>
            </td> 
          </tr>
        </tbody>
        <tr v-if="tableList.length == 0">
          <td colspan="7" class="no-content">暂无数据</td>
        </tr>
      </table>
      <vue-loading type="bars" color="#d9544e" :size="{ width: '50px', height: '50px' }" v-show="loading"></vue-loading>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import vueLoading from 'vue-loading-template'
import { notice } from '../../../api/index.js'
export default {
  name: 'school',
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
      courseList: [],
      tableList: [],
      loading: false,
      haveMorningRead: false,
      maxMorning: '',
      maxAfternoon: '',
      lessonList: [],
      morningLesson: [],
      afternoonLesson: []
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
  async created () {
    if (this.semesterId.semesterId && this.section.id) {
      await this.getMaxLesson()
      this.getTable()
    }
  },
  methods: {
    handleClick () {
      // return false
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
        // let a = arr1.some(item => item === i)
        let a = arr1.filter(item => item === i)
        if (a.length) {
          // console.log(arr1.indexOf(a[0]))
          arr2[a[0]] = arr[arr1.indexOf(a[0])]
          // arr2[arr[i].lesson] = arr[i]
          // if (lessonPart === 1) {
          //   arr2[arr[i].lesson] = arr[i]
          // } else {
          //   arr2[arr[i - 1].lesson] = arr[i - 1]
          // }
        }
      }
      return arr2
    },
    getTable () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.loading = true
      // this.semesterId.semesterId
      this.$https.get(`timeTable/schoolView?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          // let length = 0
          let arr = []
          if (!res.data.result) {
            this.tableList = []
            this.courseList = []
            this.loading = false
            return
          }
          this.tableList = res.data.result
          // this.tableList.forEach(item => {
          //   item.clazzList.forEach(items => {
          //     items.weekList.forEach(week => {
          //       if (!week.courseList) return
          //       if (week.courseList.length > length) {
          //         arr = week.courseList
          //         length = week.courseList.length
          //       }
          //     })
          //   })
          // })
          arr = this.lessonList
          // let arr1 = arr.filter(item => item.lessonPart === 1)
          // arr.forEach(item => {
          //   if (item.lessonPart === 2) {
          //     item.lesson = arr1.length + item.lesson
            // }
          // })
          // console.log(arr)
          this.loading = false
          this.courseList = arr
          this.tableList.forEach(item => {
            item.clazzList.forEach(items => {
              items.weekList.forEach(week => {
                week.courseList = this.motion(week.courseList)
              })
            })
          })
        } else {
          this.loading = false
          notice(this, res.data.message, 2000)
        }
      })
    },
    motion (arr) {
      // console.log(arr)
      if (!arr) {
        arr = []
      }
      let arr1 = this.lessonList.map(item => ({...item}))
      arr1.forEach((item, i) => {
        arr.forEach(items => {
          // if (item.lesson === items.lesson && item.lesson === items.lessones) {
          if (item.lesson === items.lesson && item.lessonPart === items.lessonPart) {
            this.$set(arr1, i, items)
            item = items
          }
        })
      })
      // console.log(arr1)
      return arr1
    },
    exportTable (s) {
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
        window.location.href = `${path}/timeTable/schoolExportHorizontal?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&sectionName=${this.section.name}&showFullName=${this.showCourseFull}`
      } else {
        window.location.href = `${path}/timeTable/schoolExportVertical?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&sectionName=${this.section.name}&showFullName=${this.showCourseFull}`
      }
    }
  },
  watch: {
    async semesterId () {
      await this.getMaxLesson()
      this.getTable()
    },
    async section () {
      await this.getMaxLesson()
      this.getTable()
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
<style lang="scss">
#school {
  // position: absolute;
  // padding: 0 20px;
  background: #fff;
  // bottom: 0;
  // top: 276px;
  // left: 0;
  // right: 0;
  overflow: auto;
  .header {
    // position: absolute;
    // left: 0;
    // right: 0;
    // padding: 0 20px;
    background: #fff;
    z-index: 10;
  }
  .school-table {
    width: 100%;
    overflow: auto;
    // margin: 0 20px;
    table {
      border: none;
      td {
        border-width: 0px;
        border-right-width: 1px;
      }
    }
    thead {
      tr:nth-child(2) {
        td {
          background: #fff;
          color: #444;
        }
      }
    }
  }
  .table-box {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 40px;
    overflow: auto;
  }
}
</style>
