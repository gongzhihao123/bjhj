<template>
  <div id="teach-no-class" class="clearfix">
    <div class="tootil">
      <ul class="nav-lists">
        <li v-for="(item, i) in btnList" :key="item.name" :class="{active: activeInd == i}" @click="active(item, i)">{{item.name}}</li>
      </ul>
    </div>
    <div class="left-nav">
      <el-input
        placeholder="请输入教师姓名"
        v-model="filterText">
      </el-input>
      <el-tree :filter-node-method="filterNode" ref="tree2" :data="teacherList" :props="defaultProps" @node-click="handleNodeClick" class="filter-tree" :highlight-current="true"></el-tree>
    </div>
    <div class="right-content">
      <table class="subject-classroom">
        <tr>
          <th v-for="item in weekHeader" :key="item.name">{{item.name}}</th>
        </tr>
        <tr v-for="item in subjectList" :key="item.subject">
          <td>{{item.lesson | lessonFilter}}</td>
          <td @click.stop="rightOn(item, items, $event)" v-for="(items, i) in item.content" :key="i" class="actionable" :class="{'no-mod': teacherId && items.setLevel === 2}">
            <div v-if="items.reason != 1">
              <section v-if="teacherId && items.setLevel === 2">
                <span>年级 - {{items.reason}}</span>
              </section>

              <section v-else>
                <span class="deleteSure" @click="deleteClassNoLessonSetOne(items)">X</span>
                <span>{{items.reason}}</span>
              </section>
              

            </div>
            <div v-else>
              <span>　</span>
            </div>
            <ul v-show="items.rightMenu" :class="{bottom: contextMenuPosition}">
              <li v-for="reason of rightMenus" :key="reason.content" @click="changeReasonSet(reason, items, item)">{{ reason.content | textLength }}</li>
            </ul>
          </td>
        </tr>
        <tr v-if="subjectList.length == 0">
          <td :colspan="6" style="color: #ccc;">暂无数据</td>
        </tr>
      </table>
    </div>


    <!--教师不排课课表-->
    <el-dialog :title="dislogTitle" :visible.sync="classNoClass" class="dialog">
      <div class="dialog-set-one">
        <p>
          <span>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期 :</span>
          <span>{{this.semesterId.semesterName}}</span>
        </p>
        <p>
          <el-select v-model="reasonDialog" placeholder="所有原因" @change="getClassNoLessonList">
            <el-option
              v-for="item in rightMenus"
              :key="item.id"
              :label="item.content"
              :value="item.id">
            </el-option>
          </el-select>
          <span class="red" style="margin-left: 20px;" @click="deleteClassNoLessonSetAll">全部删除</span>
        </p>
        <p class="green">
          共{{dialogTableContent.length}}条教师不排课设置:
          <el-input
            style="float:right;"
            placeholder="请输入教师姓名"
            icon="search"
            v-model="keyword"
            :on-icon-click="handleIconClick">
          </el-input>
        </p>
      </div>
      <div class="dialog-box">
        <table class="dialog-table">
          <tr>
            <th v-for="item in dialogTable" :key="item.name">{{item.name}}</th>
          </tr>
          <tr v-for="item in dialogTableContent" :key="item.grade">
            <td>{{item.teacherName ? item.teacherName : item.gradeName}}</td>
            <td>{{item.week | weekFilter}} {{item.lesson | lessonFilter}}</td>
            <td>{{item.reason}}</td>
            <td class="red" @click="deleteClassNoLessonSetOne(item)">删除</td>
          </tr>
          <tr v-if="dialogTableContent.length == 0">
            <td :colspan="6" style="color: #ccc;">暂无数据</td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <!--添加原因-->
    <el-dialog
      title="添加原因"
      :visible.sync="addReason"
      size="tiny">
      <span>原因 : </span>
      <el-input type="text" style="width:300px;margin-left: 20px;" v-model="reasonValue" :maxlength="15"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addReason = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="addReasons" class="sure">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑原因-->
    <el-dialog
      title="编辑原因"
      :visible.sync="changeReason"
      size="tiny">
      <div class="reason-box">
        <p v-for="item in rightMenus" :key="item.rightMenu">
          <span>原因 : </span>
          <input type="text" v-model="item.content" :maxlength="15" @blur="changeReasonSure(item)" />
          <span class="red" @click="deleteReason(item)">删除</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeReason = false" class="sure">关闭</el-button>
      </span>
    </el-dialog>
    <!--是否覆盖弹出框-->
    <el-dialog
      :title="dislogTitle"
      :visible.sync="coverDialog"
      size="tiny">
      <p class="coverTitle">此节课时已经有设置不排课的教师，是否覆盖以下教师的不排课原因？</p>
      <table class="coverDialog">
        <tr>
          <th>年级</th>
          <th>教师</th>
          <th>不排课原因</th>
        </tr>
        <tr v-for="item in dialogTableContent" :key="item.grade">
          <td>{{item.gradeName}}</td>
          <td>{{item.teacherName ? item.teacherName : item.gradeName}}</td>
          <td>{{item.reason}}</td>
        </tr>
        <tr v-if="dialogTableContent.length == 0">
          <td :colspan="6" style="color: #ccc;">暂无数据</td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCover" class="cancel">否</el-button>
        <el-button type="primary" @click="sureCover" class="sure">是</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import querystring from 'querystring'
import { notice, success } from '../../../api/index.js'
export default {
  name: 'teach-no-class',
  data () {
    return {
      dislogTitle: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      weekHeader: [
        {name: '课节'},
        {name: '星期一'},
        {name: '星期二'},
        {name: '星期三'},
        {name: '星期四'},
        {name: '星期五'}
      ],
      subjectList: [],
      btnList: [
        { name: '添加原因' },
        { name: '编辑原因' },
        { name: '教师不排课列表' }
      ],
      activeInd: '0',
      addReason: false,
      changeReason: false,
      classNoClass: false,
      dialogTable: [
        {name: '教师姓名'},
        {name: '不排课时间'},
        {name: '不排课原因'},
        {name: '操作'}
      ],
      dialogTableContent: [],
      value: '1',
      rightMenus: [],
      content: '',
      rightMenuShowItem: '',
      reasonValue: '',
      maxAfternoon: '',
      maxMorning: '',
      reasonDialog: '',
      keyword: '',
      filterText: '',
      gradeId: '',
      teacherId: '',
      teacherName: '',
      setLevel: 1,
      reasonId: '',
      teacherSearch: '',
      teacherList: [],
      gradeAddNew: false,
      coverDialog: false,
      isGrade: false,
      isTeacher: false,
      week: '',
      lesson: '',
      gradeName: '',
      contextMenuPosition: false
    }
  },
  computed: {
    ...mapGetters([
      'semesterId',
      'section',
      'user'
    ])
  },
  methods: {
    initRea () {
      this.$https.get('/setting/teacherNoarrangeReasonInit')
      .then(res => {
      })
    },
    handleIconClick (ev) {
      this.getClassNoLessonList()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    async handleNodeClick (data) {
      if (data.parent === 0) {
        this.subjectId = data.subjectId
        this.subjectName = data.name
        this.setLevel = 1
        this.gradeId = ''
        this.gradeName = ''
        this.teacherId = ''
        this.isGrade = false
        this.isTeacher = false
        this.subjectList = []
      } else if (data.parent === 1) {
        this.gradeId = data.gradeId
        this.gradeName = data.gradeName
        this.gradeName = data.name
        this.subjectId = data.subjectId
        this.subjectName = data.subjectName
        this.isGrade = true
        this.isTeacher = false
        this.teacherId = ''
        this.setLevel = 2
        this.subjectList = []
      } else {
        this.gradeId = data.gradeId
        this.gradeName = data.gradeName
        this.subjectId = data.subjectId
        this.subjectName = data.subjectName
        this.teacherName = data.name
        this.teacherId = data.teacherId
        this.isGrade = false
        this.isTeacher = true
        this.setLevel = ''
        this.subjectList = []
      }
      if (data.parent === 0) return
      await this.getMaxLesson()
      await this.getLesson()
      this.getTeacherDetail()
    },
    async active (item, i) {
      this.activeInd = i
      if (this.activeInd === 0) {
        this.reasonValue = ''
        this.addReason = true
      } else if (this.activeInd === 1) {
        await this.getReasonList()
        if (this.rightMenus.length === 0) {
          notice(this, '请添加原因', 2000)
          return
        }
        this.changeReason = true
      } else if (this.activeInd === 2) {
        this.getReasonList()
        this.dislogTitle = '教师不排课列表'
        this.reasonDialog = ''
        this.keyword = ''
        this.week = ''
        this.lesson = ''
        this.getClassNoLessonList()
        this.classNoClass = true
      }
    },
    // 获取课节信息
    async getLesson () {
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
      if (this.afternoonLesson.length < this.maxAfternoon) {
        this.afternoonLesson = this.motionLesson(this.afternoonLesson, this.maxAfternoon, 2)
      }
      this.after = this.afternoonLesson.map(item => ({
        lesson: item.lesson,
        lessones: this.maxMorning + item.lesson + 1,
        lessonPart: item.lessonPart
      }))
      this.lessonList = this.morningLesson.concat(this.after)
    },
    // 补全课节
    motionLesson (arr, length, lessonPart) {
      let arr1 = arr.map(item => item.lesson)
      let arr2 = []
      for (let i = 0; i < length; i++) {
        if (lessonPart === 1) {
          arr2.push({lesson: i, lessonPart})
        } else {
          arr2.push({lesson: i, lessonPart})
        }
      }
      for (let i = 0; i < length; i++) {
        let a = arr1.some(item => item === i)
        if (a) {
          if (lessonPart === 1) {
            arr2[arr[i].lesson] = arr[i]
          } else {
            arr2[arr[i - 1].lesson] = arr[i - 1]
          }
        }
      }
      return arr2
    },
    // 获取最大课节数
    async getMaxLesson () {
      await this.$https.get(`common/selectMaxLessonHour?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        this.haveMorningRead = res.data.result.haveMorningRead
        this.maxMorning = res.data.result.maxMorning
        this.maxAfternoon = res.data.result.maxAfternoon
      })
    },
    // 右击事件
    async rightOn (item, items, e) {
      if (this.gradeId && items.setLevel === 1) return
      if (this.teacherId && items.setLevel === 2) return
      // if (this.gradeId && !this.teacherId && items.reason === 1) {
      //   this.gradeAddNew = true
      // }
      await this.getReasonList()
      if (this.rightMenuShowItem === items) {
        items.rightMenu = !items.rightMenu
      } else {
        if (this.rightMenuShowItem) {
          this.rightMenuShowItem.rightMenu = false
          items.rightMenu = true
        } else {
          this.$set(items, 'rightMenu', !items.rightMenu)
        }
      }
      this.rightMenuShowItem = items
      this.contextMenuPosition = false
      if (e.screenY > (document.body.clientHeight || document.documentElement.clientHeight)) {
        this.contextMenuPosition = true
      }
    },
    // 选择右键菜单
    async changeReasonSet (reason, item, row) {
      let reasonOne = { ...item }
      item.reason = reason.content
      this.lesson = row.lesson
      this.lessonPart = row.lessonPart
      this.week = item.week
      this.reasonId = reason.id
      this.templateId = row.templateId
      if (this.isGrade) {
        this.dislogTitle = '提示'
        this.week = item.week
        this.lesson = row.lesson
        this.reasonDia = { ...reasonOne }
        await this.getClassNoLessonList()
        if (this.dialogTableContent.length) {
          this.coverDialog = true
        } else {
          this.classSetSave(this.reasonDia)
        }
      } else {
        this.coverClassRecord = true
        this.classSetSave(reasonOne)
      }
    },
    // 取消覆盖
    cancelCover () {
      this.coverDialog = false
      this.getTeacherDetail()
    },
    // 确认覆盖
    sureCover () {
      this.coverDialog = false
      this.coverClassRecord = true
      this.classSetSave(this.reasonDia)
    },
    // 获取教师列表
    selectTeacher () {
      this.$https.get(`common/selecctSubjectGradeTeache?name=${this.teacherSearch}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(async res => {
        if (res.data.code === 1) {
          this.setLevel = 1
          if (res.data.code === 1) {
            this.setLevel = 1
            this.teacherList = res.data.result.map(item => ({
              name: item.subjectName,
              parent: 0,
              subjectId: item.subjectId,
              children: item.gradeTeachers.map(items => ({
                name: items.gradeName,
                parent: 1,
                gradeId: items.gradeId,
                subjectId: item.subjectId,
                subjectName: item.subjectName,
                children: items.teachers.map(itemss => ({
                  name: itemss.teacherName,
                  ...itemss,
                  subjectId: item.subjectId,
                  subjectName: item.subjectName,
                  gradeId: items.gradeId,
                  gradeName: items.gradeName
                }))
              }))
            }))
            await this.getMaxLesson()
            await this.getLesson()
          }
        }
      })
    },
    // 获取原因列表
    async getReasonList () {
      this.rightMenus = []
      await this.$https.get(`/setting/teacherNoarrangeReasonList`)
      .then(res => {
        if (res.data.code === 1) {
          this.rightMenus = res.data.result || []
          this.rightMenus = this.rightMenus.map(item => ({
            ...item,
            rightMenu: false
          }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取 教师不排课设置信息(填充表格)
    getTeacherDetail () {
      if (this.isGrade) {
        this.setLevel = 2
      } else {
        this.setLevel = ''
      }
      this.$https.get(`/setting/teacherNoarrangeSetList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&gradeId=${this.gradeId}&subjectId=${this.subjectId}&setLevel=${this.setLevel}&teacherId=${this.teacherId}`)
      .then(res => {
        if (res.data.code === 1) {
          let subjectList = res.data.result.map(item => ({
            id: item.id,
            rightMenu: false,
            lesson: item.lesson,
            lessonPart: item.lessonPart,
            reason: item.reason,
            reasonId: item.reasonId,
            setLevel: item.setLevel,
            week: item.week
          }))
          let arr = this.filterLesson(subjectList)
          this.subjectList = [...arr]
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    filterLesson (arr) {
      let arr1 = []
      this.lessonList.forEach(item => {
        let content = []
        let lesson = item.lesson
        if (item.lessonPart === 2) {
          lesson = item.lessones
          content = arr.filter(items => (item.lessones === items.lesson) && (item.lessonPart === items.lessonPart))
        } else {
          content = arr.filter(items => (item.lesson === items.lesson) && (item.lessonPart === items.lessonPart))
        }
        content = this.motion(content)
        arr1.push({content, lesson, lessonPart: item.lessonPart, templateId: item.templateId})
      })
      return arr1
    },
    // 自动补全
    motion (arr) {
      let arr1 = arr.map(item => item.week)
      let arr2 = []
      for (let i = 1; i < 6; i++) {
        arr2.push({reason: 1, rightMenu: false, week: i})
      }
      for (let i = 1; i < 6; i++) {
        let a = arr1.some(item => item === i)
        if (a) {
          let obj = arr.filter(objs => objs.week === i)[0]
          arr2[i - 1] = obj
        }
      }
      arr2 = arr2.map(rights => ({...rights, rightMenu: false}))
      return arr2
    },
    // 获取教师不排课列表(弹框)
    async getClassNoLessonList () {
      if (this.dislogTitle === '教师不排课列表') {
        this.week = ''
        this.lesson = ''
        this.subjectId = ''
      }
      if (!this.reasonDialog) {
        this.reasonDialog = ''
      }
      await this.$https.get(`/setting/teacherNoarrangeSetDetailList?reasonId=${this.reasonDialog}&courseId=${this.subjectId}&week=${this.week}&lesson=${this.lesson}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&keyword=${this.keyword}`)
      .then(res => {
        if (res.data.code === 1) {
          this.dialogTableContent = res.data.result
        }
      })
    },
    // 添加原因
    addReasons () {
      if (!this.reasonValue) {
        notice(this, '请填写要添加的原因', 2000)
        return
      }
      this.$https.get(`/setting/teacherNoarrangeReasonAdd?content=${this.reasonValue}`)
      .then(res => {
        if (res.data.code === 1) {
          this.addReason = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 编辑原因
    changeReasonSure (item) {
      this.$https.get(`/setting/teacherNoarrangeReasonUpdate?id=${item.id}&content=${item.content}`)
      .then(res => {
        if (res.data.code === 1) {
          this.getReasonList()
          this.getTeacherDetail()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 单个删除原因
    deleteReason (item) {
      if (item.id === 0) {
        notice(this, `系统预设原因，无法删除`, 2000)
        return
      }
      this.$https.get(`/setting/teacherNoarrangeReasonDelete?reasonId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.getReasonList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 全部删除教师不排课信息(支持批量删除，弹框)
    deleteClassNoLessonSetAll () {
      this.$https.get(`/setting/teacherNoarrangeSetDetailBatchList?reasonId=${''}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&noarrangeId=${''}`)
      .then(res => {
        if (res.data.code === 1) {
          this.classNoClass = false
          this.getTeacherDetail()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除单个教师不排课信息
    deleteClassNoLessonSetOne (item) {
      this.$https.get(`/setting/teacherNoarrangeSetDetailBatchList?noarrangeId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.getClassNoLessonList()
          this.getTeacherDetail()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
     // 新增不排课设置信息(支持新增/修改，可选择原因)
    classSetSave (a) {
      if (this.isGrade) {
        this.teacherName = ''
      } if (this.isTeacher) {
        this.setLevel = 3
      }
      let obj = {}
      if (a.reason === 1) { // 新增
        obj = {
          semesterId: this.semesterId.semesterId,
          sectionId: this.section.id,
          sectionName: this.semesterId.semesterName,
          subjectId: this.subjectId,
          gradeId: this.gradeId,
          gradeName: this.gradeName,
          teacherId: this.teacherId,
          teacherName: this.teacherName,
          week: this.week,
          lesson: this.lesson,
          lessonPart: this.lessonPart,
          templateId: this.templateId,
          reasonId: this.reasonId,
          setLevel: this.setLevel
        }
      } else {
        obj.id = a.id
        obj.reasonId = this.reasonId
      }
      this.$https.post(`/setting/teacherNoarrangeSetSave`, querystring.stringify({
        ...obj
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getTeacherDetail()
          success(this, res.data.message, 2000)
        } else {
          this.getTeacherDetail()
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  mounted () {
    document.querySelectorAll('td').forEach(item => {
      item.oncontextmenu = function (e) {
        return false
      }
    })
    document.querySelector('table').oncontextmenu = (e) => {
      return false
    }
    document.onclick = (e) => {
      if (this.rightMenuShowItem) {
        this.rightMenuShowItem.rightMenu = false
      }
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
    },
    weekFilter (val) {
      let week = {
        '1': '星期一',
        '2': '星期二',
        '3': '星期三',
        '4': '星期四',
        '5': '星期五'
      }
      return week[val]
    },
    textLength (val) {
      if (val) {
        if (val.length > 8) {
          return val.substring(0, 8) + '...'
        } else {
          return val
        }
      }
    }
  },
  created () {
    if (this.semesterId.semesterId && this.section.id) {
      this.selectTeacher()
    }
    this.initRea()
  },
  watch: {
    semesterId () {
      this.selectTeacher()
    },
    filterText (val) {
      this.$refs.tree2.filter(val)
    },
    section () {
      this.selectTeacher()
    }
  }
}
</script>



<style lang="scss">
#teach-no-class {
  padding-bottom: 20px;
  height: calc(100% - 20px);
  width: 100%;
  .el-input, .el-input__inner {
    width: 96%;
    margin-left:2%;
    margin-bottom: 3%;
  }
  .el-input__inner {
    border-color:#40BB8A;
    color:#40BB8A;
  }
  .el-input__icon {
    color:#40BB8A;
  }
  div.tootil {
    margin-bottom: 10px;
    .nav-lists {
      li {
        display: inline-block;
        height: 36px;
        line-height: 36px;
        padding: 0 14px;
        text-align: center;
        border: 1px solid #93E1B1;
        margin: 10px;
        color: #40BB8A;
        border-radius: 5px;
        cursor: pointer;
        &.active {
          background: linear-gradient(180deg, #93E1B1, #40BB8A);
          color: #fff;
        }
      }
    }
  }
  div.right-content {
    float: left;
    width: 84%;
    // min-height:500px;
    height: calc(100% - 60px);
    overflow: auto;
    // border-radius: 4px;
    table.subject-classroom {
      tr td {
        min-width: 150px;
      }
    }
  }
  .actionable {
    cursor: pointer;
    div span.deleteSure {
      margin-right:4px;
      display: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #26CEA9;
      color: #fff;
      line-height: 20px;
      text-align: center;
    }
    &:hover {
      div span.deleteSure {
        display: inline-block;
      }
    }
    &.no-mod {
      background: #eee;
      color: #333;
    }
    ul.bottom {
      bottom: 0 !important;
    }
  }
  .dialog {
    .dialog-set-one {
      width:90%;
      padding: 0 36px;
      &>p {
        margin: 20px 0; 
        .el-input, .el-input__inner {
          width: 200px;
          margin-left: 0;
          margin-bottom: 0;
        }
      }
    }
    
    .dialog-box {
      max-height: 316px;
      margin-bottom: 30px;
      overflow: auto;
      .dialog-table {
        width:90%;
        margin: 0 36px;
        margin-bottom: 50px;
        tr{
          height: 40px;
        }
        td,th {
          width: auto;
          border:1px solid #40BB8A;
          height: 40px;
          text-align: center;
        }
        th {
          color: #40BB8A;
          height: 30px;
        }
      }
    }
    
  }
  .red {
    color: red;
    cursor: pointer;
  }
  .green {
    color: #40BB8A;
  }
  .reason-box {
    margin-left: 20px;
    &>p{
      margin-bottom: 10px;
      input {
        width:300px;
        margin: 0 20px;
        height: 26px;
        padding-left:10px; 
      }
    }
  }
  .left-nav {
    height: calc(100% - 80px);
    overflow: auto;
  }
  p.coverTitle {
      margin-bottom: 20px;
      font-size: 16px;
    }
  .coverDialog {
    width: 100%;
    margin-bottom: 10px;
    th {
      font-weight: bold;
    }
    td,th {
      border: 1px solid #26CEA9;
      height: 30px;
      text-align: center;
    }
  }
}
</style>
