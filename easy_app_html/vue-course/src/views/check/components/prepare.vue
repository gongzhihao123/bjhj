<template>
  <div id="prepare">
    <!--备课组课表-->
    
    <header class="header">
       <!-- <el-checkbox v-model="showTeacherName">显示教师姓名</el-checkbox>
       <el-checkbox v-model="showClass">显示班级</el-checkbox> -->
       <div class="button-group">
         <el-button type="warning" @click="exportTable">导出Excel</el-button>
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
              <td v-for="item of weekList" :key="item.name">{{ item.name }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableListMorn" :key="item.lesson">
              <td>{{ item.lesson | lessonFilter }}</td>
              <td v-for="(items, i) in item.teachers" :key="i" v-if="i < 5">
                <span v-if="items == 1 || !items">
                  <span> </span>
                </span>
                <span  v-else>
                  <div v-for="(teacherName, ind) in items" :key="ind" v-if="teacherName" style="line-height: 32px;">
                    <!-- <span>{{ teacherName.className }}-</span> -->
                    <span>{{ teacherName.teacherName }}-</span>
                    <span>{{ teacherName.className }}</span>
                  </div>
                </span>
              </td>
            </tr>

            <tr v-for="item of tableListAfter" :key="item.lesson">
              <td>{{ item.lesson | lessonFilter }}</td>
              <td v-for="(items, i) in item.teachers" :key="i" v-if="i < 5">
                <span v-if="items == 1 || !items">
                  <span> </span>
                </span>
                <span  v-else>
                  <div v-for="(teacherName, ind) in items" :key="ind" v-if="teacherName" style="line-height: 32px;">
                    <!-- <span>{{ teacherName.className }}-</span> -->
                    <span>{{ teacherName.teacherName }}-</span>
                    <span>{{ teacherName.className }}</span>
                  </div>
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="tableListMorn.length == 0 && tableListAfter.length == 0">
            <tr>
              <td colspan="6" class="no-content">暂无数据</td>
            </tr>
          </tfoot>
          <!-- <tbody></tbody>
          <tfoot>
            <tr>
              <td colspan="6" class="no-content">暂无数据</td>
            </tr>
          </tfoot> -->
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { notice } from '../../../api/index.js'
export default {
  name: 'prepare',
  data () {
    return {
      weekList: [
        { name: '星期一', week: 1 },
        { name: '星期二', week: 2 },
        { name: '星期三', week: 3 },
        { name: '星期四', week: 4 },
        { name: '星期五', week: 5 }
      ],
      showClass: false,
      showTeacherName: false,
      gradeList: [],
      defaultProps: {
        children: 'gradeInfo',
        label: 'name'
      },
      prepareActive: {},
      tableList: [],
      tableListMorn: [],
      tableListAfter: [],
      maxMorning: 0,
      maxAfternoon: 0,
      haveMorningRead: false,
      lessonList: []
    }
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
      this.getGrade()
    }
  },
  methods: {
    getGrade () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`/common/selectSubject?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result.map((item, i) => ({
            id: item.chooiceId,
            name: item.curriculumName,
            parent: 1,
            gradeIndex: i,
            gradeInfo: item.gradeInfo.map(grade => ({ name: grade.gradeName, id: grade.gradeId, subjectId: item.chooiceId, subjectName: item.curriculumName, gradeIndex: i }))
          }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    getTable () {
      // this.semesterId.semesterId
      this.$https.get(`/timeTable/subjectView?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&gradeId=${this.prepareActive.id}&subjectId=${this.prepareActive.subjectId}`)
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
          let afternoon = res.data.result.filter(item => item.lessonPart === 2)
          let morning = res.data.result.filter(item => item.lessonPart === 1)
          res.data.result.forEach(item => {
            if (item.lessonPart === 2) {}
          })
          // let maxMorn = morning.map(item => item.lesson)
          // maxMorn = maxMorn.sort()[maxMorn.length - 1] + 1
          // let maxAfter = afternoon.map(item => item.lesson)
          // maxAfter = maxAfter.sort()[maxAfter.length - 1]
          let maxMorn = this.maxMorning
          let maxAfter = this.maxAfternoon
          let morningList = []
          let afterList = []
          if (this.haveMorningRead) {
            for (let i = 0; i < maxMorn + 1; i++) {
              morningList[i] = {}
              morningList[i].lesson = i
              morningList[i].lessonPart = 1
              morningList[i].teachers = morning.filter(item => item.lesson === i)
            }
            for (let i = 1; i < maxAfter + 1; i++) {
              afterList[i - 1] = {}
              // afterList[i - 1].lessones = i
              afterList[i - 1].lesson = i + maxMorn
              afterList[i - 1].lessonPart = 2
              afterList[i - 1].teachers = afternoon.filter(item => item.lesson === i)
            }
          } else {
            for (let i = 1; i < maxMorn + 1; i++) {
              morningList[i] = {}
              morningList[i].lesson = i
              morningList[i].lessonPart = 1
              morningList[i].teachers = morning.filter(item => item.lesson === i)
            }
            for (let i = 1; i < maxAfter; i++) {
              afterList[i - 1] = {}
              // afterList[i - 1].lessones = i
              afterList[i - 1].lesson = i + maxMorn
              afterList[i - 1].lessonPart = 2
              afterList[i - 1].teachers = afternoon.filter(item => item.lesson === i)
            }
          }
          // 自动补全
          // console.log(morningList)
          this.tableListMorn = morningList.map((item, i) => ({
            ...item,
            teachers: this.motion(item.teachers)
          }))
          this.tableListAfter = afterList.map(item => ({
            ...item,
            teachers: this.motion(item.teachers)
          }))
          // console.log(this.tableListMorn)
          // console.log(this.tableListAfter)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => console.log(res))
    },
    // 获取最大课节数
    async getMaxLesson () {
      if (!this.semesterId.semesterId || !this.section.id) return
      await this.$https.get(`common/selectMaxLessonHour?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        let haveMorningRead = res.data.result.haveMorningRead
        let maxMorning = res.data.result.maxMorning
        let maxAfternoon = res.data.result.maxAfternoon
        this.maxMorning = maxMorning
        this.haveMorningRead = haveMorningRead
        this.maxAfternoon = maxAfternoon
        let morningLesson = []
        let afternoonLesson = []
        if (haveMorningRead) {
          // 判断前提是有早读的情况下，再判断课节列表第一个是不是早读，如果没有早读，先把早读放进去
          if (morningLesson[0]) {
            if (morningLesson[0].lesson !== 0) {
              morningLesson.unshift({lesson: 0, lessonPart: 1})
            }
          }
        }
        // 如果上午课节比最大课节小的话
        if (morningLesson.length < (maxMorning + 1)) {
          morningLesson = this.motionLesson(morningLesson, (maxMorning + 1), 1)
        }
        morningLesson = morningLesson.map(item => ({
          lesson: item.lesson,
          lessones: item.lesson,
          lessonPart: item.lessonPart
        }))
        if (afternoonLesson.length < maxAfternoon) {
          afternoonLesson = this.motionLesson(afternoonLesson, maxAfternoon, 2)
        }
        let after = afternoonLesson.map(item => ({
          lesson: item.lesson + 1,
          lessones: maxMorning + item.lesson + 1,
          lessonPart: item.lessonPart
        }))
        this.lessonList = morningLesson.concat(after)
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
    // 自动补全
    motion (arr) {
      // if (arr.length === 5) return arr
      let arr1 = [...arr]
      for (let i = 1; i < 6; i++) {
        let a = arr1.filter(items => items.week === i)
        if (a.length) {
          arr[i - 1] = a
        } else {
          arr[i - 1] = 1
        }
      }
      return arr
    },
    nodeClick (data) {
      if (data.parent === 1) {
        // .
      } else {
        this.prepareActive = data
        this.getTable()
      }
    },
    exportTable () {
      if (!this.semesterId.semesterId) {
        notice(this, '请选择学期', 2000)
        return
      }
      if (!this.section.id) {
        notice(this, '请选择学段', 2000)
        return
      }
      if (!this.prepareActive.id) {
        notice(this, '请选择年级', 2000)
        return
      }
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/timeTable/subjectExport?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&gradeId=${this.prepareActive.id}&gradeName=${this.prepareActive.name}&subjectId=${this.prepareActive.subjectId}&subjectName=${this.prepareActive.subjectName}&sectionName=${this.section.name}`
    }
  },
  watch: {
    async semesterId () {
      await this.getMaxLesson()
      this.getGrade()
    },
    async section () {
      await this.getMaxLesson()
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
<style>
#prepare {
  height: 100%;
  overflow: auto;
}
</style>
