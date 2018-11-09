<template>
  <div id="teachers">
    <!--教师课表-->
    <header class="header">
       <div class="button-group">
         <el-button type="warning" @click="exportTable(1)">导出Excel</el-button>
         <el-button type="warning" @click="exportTable">导出所有教师Excel</el-button>
       </div>
    </header>
    <div class="grade-layout">
      <div class="tree">
        <el-input
          v-model="searchTeacher">
        </el-input>
        <!-- <ul class="grade-list">
          <li v-for="item in teachersList" :key="item.name">{{ item.name }}</li>
        </ul> -->
        <el-tree
          class="filter-tree"
          :data="gradeList"
          :props="defaultProps"
          @node-click="nodeClick"
          :filter-node-method="filterNode"
          :highlight-current="true"
          ref="tree">
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
                  <span>{{ section.name }}{{ items.gradeName }}{{ items.className }}</span>
                  <span v-if="items.connet">{{ items.connet }}</span>
                  <span>{{ items.subjectShortName }}</span>
                  <span class="teacher-name" v-show="items.classroomCatagoryName">{{ items.classroomCatagoryName }}</span>
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
                  <span>{{ section.name }}{{ items.gradeName }}{{ items.className }}</span>
                  <span v-if="items.connet">{{ items.connet }}</span>
                  <span>{{ items.subjectShortName }}</span>
                  <span class="teacher-name" v-show="items.classroomCatagoryName">{{ items.classroomCatagoryName }}</span>
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="tableListMorn.length == 0 && tableListAfter.length == 0">
            <tr>
              <td colspan="6" class="no-content">暂无数据</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { notice } from '../../../api/index.js'
export default {
  name: 'teachers',
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
      teachersList: [],
      searchTeacher: '',
      defaultProps: {
        children: 'teachers',
        label: 'name'
      },
      tableListMorn: [],
      tableListAfter: [],
      gradeList: [],
      teacherActive: {},
      lessonList: [],
      haveMorningRead: false,
      maxMorning: '',
      maxAfternoon: ''
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
      this.getTeacher()
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleIconClick () {},
    getTeacher () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`/common/selectTeacher?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result.map((item, i) => ({
            name: item.gradeName,
            id: item.gradeId,
            parent: 1,
            gradeIndex: i,
            teachers: item.teachers.map(items => ({
              name: items.teacherName,
              id: items.teacherId,
              gradeId: item.gradeId,
              gradeIndex: i,
              gradeName: item.gradeName
            }))
          }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    nodeClick (data) {
      if (data.parent === 1) {
        this.teacherActive.gradeIndex = data.gradeIndex
        this.teacherActive.gradeId = data.id
        this.teacherActive.gradeName = data.name
      } else {
        this.teacherActive = {...data}
        this.getTable()
      }
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
    getTable () {
      // this.semesterId.semesterId
      this.$https.get(`/timeTable/teacherView?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&teacherId=${this.teacherActive.id}`)
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
          let result = res.data.result || []
          let afternoon = result.filter(item => item.lessonPart === 2)
          let morning = result.filter(item => item.lessonPart === 1)
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
          this.tableListMorn = morningList.map(item => ({
            ...item,
            teachers: this.motion(item.teachers)
          }))
          this.tableListAfter = afterList.map(item => ({
            ...item,
            teachers: this.motion(item.teachers)
          }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 自动补全
    motion (arr) {
      // console.log(arr)
      // if (arr.length === 5) return
      let arr1 = [...arr]
      for (let i = 1; i < 6; i++) {
        let a = arr1.filter(items => items.week === i)
        if (a.length === 1) {
          arr[i - 1] = {...a[0]}
        } else if (a.length > 1) {
          arr[i - 1] = {...a[0]}
          arr[i - 1].connet = `${this.section.name}${a[1].gradeName}${a[1].className}`
        } else {
          arr[i - 1] = 1
        }
      }
      return arr
    },
    // 比较器
    compare (attr) {
      return (obj1, obj2) => {
        let attr1 = obj1[attr]
        let attr2 = obj2[attr]
        if (attr1 > attr2) {
          return 1
        } else if (attr1 < attr2) {
          return -1
        } else {
          return 0
        }
      }
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
        if (!this.teacherActive.name) {
          notice(this, '请选择教师', 2000)
          return
        }
        window.location.href = `${path}/timeTable/teacherExport?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&teacherId=${this.teacherActive.id}&teacherNames=${this.teacherActive.name}`
      } else {
        if (!this.teacherActive.gradeIndex && this.teacherActive.gradeIndex !== 0) {
          notice(this, '请选择年级', 2000)
          return
        }
        let teacherIds = this.gradeList[this.teacherActive.gradeIndex].teachers.map(item => item.id).join(',')
        let teacherNames = this.gradeList[this.teacherActive.gradeIndex].teachers.map(item => item.name).join(',')
        window.location.href = `${path}/timeTable/teacherExport?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&teacherIds=${teacherIds}&teacherNames=${teacherNames}`
      }
    }
  },
  watch: {
    async semesterId () {
      await this.getMaxLesson()
      this.getTeacher()
    },
    async section () {
      await this.getMaxLesson()
      this.getTeacher()
    },
    searchTeacher (val) {
      this.$refs.tree.filter(val)
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
  #teachers {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      /* overflow: auto; */
      right: 0;
    .grade-table {
      tbody {
        td {
          height: 60px;
          span {
            display: block;
          }
        }
      }
    }
    .el-input {
      width: 190px;
      height: 34px;
      margin: 20px;
      margin-bottom: 0;
    }
    .table-box {
      position: absolute;
      left: 240px;
      right: 0;
      top: 52px;
      bottom: 0;
      overflow: auto;
    }
  }
</style>
