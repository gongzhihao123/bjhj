<template>
  <div id="class-no-class" class="clearfix">
    <div class="tootil">
      <ul class="nav-lists">
        <li v-for="(item, i) in btnList" :key="item.name" :class="{active: activeInd == i}" @click="active(item, i)">{{item.name}}</li>
      </ul>
    </div>
    <div class="left-nav">
      <el-tree :data="gradeList" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true"></el-tree>
    </div>
    <div class="right-content">
      <table class="subject-classroom">
        <tr>
          <th v-for="item in weekHeader" :key="item.name">{{item.name}}</th>
        </tr>
        <tr v-for="item in subjectList" :key="item.subject">
          <td>{{item.lesson | lessonFilter}}</td>
          <td @click="rightOn(items, $event)" v-for="(items, i) in item.content" :key="i" class="actionable" :class="{'no-mod': classId && items.setLevel == 2}">
            <div v-if="items.reason != 1">
              <section v-if="classId && items.setLevel == 2">
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


    <!--班级不排课课表-->
    <el-dialog :title="dialogTitle" :visible.sync="classNoClass" class="dialog">
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
        <p>共{{dialogTableContent.length}}条班级不排课设置:
          <!-- <el-input
            style="float:right; width: 300px;"
            placeholder="请输入班级名"
            icon="search"
            v-model="keyword"
            :on-icon-click="getClassDetail">
          </el-input> -->
        </p>
        
      </div>
      <div class="dialog-box">
        <table class="dialog-table">
          <tr>
            <th v-for="item in dialogTable" :key="item.name">{{item.name}}</th>
          </tr>
          <tr v-for="item in dialogTableContent" :key="item.grade">
            <td>{{item.gradeName}} {{item.className}}</td>
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
      <el-input type="text" style="width:300px;margin-left: 20px;" v-model="reasonValue" :maxlength="10"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addReason = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="addReasons" class="sure" :disabled="disable">确 定</el-button>
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
          <input type="text" v-model="item.content" :maxlength="10" @blur="changeReasonSure(item)" />
          <span class="red" @click="deleteReason(item)">删除</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeReason = false" class="sure">关闭</el-button>
      </span>
    </el-dialog>
    <!--是否覆盖弹出框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="coverDialog"
      :closeOnClickModal="false"
      :closeOnPressEscape="false"
      size="tiny">
      <p class="coverTitle">此节课时已经有设置不排课的班级，是否覆盖以下班级的不排课原因？</p>
      <table class="coverDialog">
        <tr>
          <th>年级</th>
          <th>班级</th>
          <th>不排课原因</th>
        </tr>
        <tr v-for="item in dialogTableContent" :key="item.grade">
          <td>{{item.gradeName}}</td>
          <td>{{item.className}}</td>
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
  name: 'class-no-class',
  data () {
    return {
      dialogTitle: '',
      defaultProps: {
        children: 'classLists',
        label: 'name'
      },
      keyword: '',
      weekHeader: [
        {name: '课节', week: 0},
        {name: '星期一', week: 1},
        {name: '星期二', week: 2},
        {name: '星期三', week: 3},
        {name: '星期四', week: 4},
        {name: '星期五', week: 5}
      ],
      subjectList: [],
      subject: '',
      btnList: [
        { name: '添加原因' },
        { name: '编辑原因' },
        { name: '班级不排课列表' }
      ],
      activeInd: '0',
      addReason: false,
      changeReason: false,
      classNoClass: false,
      listNum: '',
      dialogTable: [
        {name: '年级/班级'},
        {name: '不排课时间'},
        {name: '不排课原因'},
        {name: '操作'}
      ],
      dialogTableContent: [],
      rightMenus: [],
      rightMenu: false,
      rightMenuShowItem: '',
      gradeList: [],
      gradeId: '',
      classId: '',
      gradeName: '',
      className: '',
      reasonValue: '',
      reasonDialog: '',
      isClass: false,
      lessonList: [],
      afternoonLesson: [],
      morningLesson: [],
      after: [],
      maxAfternoon: '',
      maxMorning: '',
      haveMorningRead: false,
      week: '',
      lesson: '',
      setLevel: 1,
      templateId: '',
      isGrade: false,
      coverDialog: false,
      coverClassRecord: false,
      reasonDia: {},
      contextMenuPosition: false,
      disable: false
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
      this.$https.get('/setting/classNoarrangeReasonInit')
      .then(res => {
      })
    },
    async handleNodeClick (data) {
      if (data.parent === 1) {
        this.gradeId = data.id
        this.gradeName = data.name
        this.isGrade = true
        this.isClass = false
        this.setLevel = 2
        this.classId = ''
      } else {
        this.classId = data.id
        this.className = data.name
        this.isGrade = false
        this.isClass = true
        this.setLevel = ''
      }
      await this.getMaxLesson()
      await this.getLesson()
      this.getClassDetail()
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
        this.dialogTitle = '班级不排课列表'
        this.reasonDialog = ''
        this.getReasonList()
        this.getClassNoLessonList()
        this.classNoClass = true
      }
    },
    // 取消覆盖
    cancelCover () {
      this.coverDialog = false
      this.getClassDetail()
    },
    // 确认覆盖
    sureCover () {
      this.coverDialog = false
      this.coverClassRecord = true
      this.classSetSave(this.reasonDia)
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
    // 获取课节信息
    async getLesson () {
      this.morningLesson = []
      this.afternoonLesson = []
      // await this.$https.get(`common/selectLessonHour?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&gradeId=${this.gradeId}&classId=${this.classId}`)
      // .then(res => {
      //   if (res.data.code === 1) {
      //     this.morningLesson = res.data.result.filter(item => item.week === 1 && item.lessonPart === 1)
      //     if (this.haveMorningRead) {
      //       // 判断前提是有早读的情况下，再判断课节列表第一个是不是早读，如果没有早读，先把早读放进去
      //       if (this.morningLesson[0].lesson !== 0) {
      //         this.morningLesson.unshift({lesson: 0, lessonPart: 1})
      //       }
      //     }
      //     // 如果上午课节比最大课节小的话
      //     if (this.morningLesson.length < (this.maxMorning + 1)) {
      //       this.morningLesson = this.motionLesson(this.morningLesson, (this.maxMorning + 1), 1)
      //     }
      //     this.afternoonLesson = res.data.result.filter(item => item.week === 1 && item.lessonPart === 2)
      //     if (this.afternoonLesson.length < this.maxAfternoon) {
      //       this.afternoonLesson = this.motionLesson(this.afternoonLesson, this.maxAfternoon, 2)
      //     }
      //     this.after = this.afternoonLesson.map(item => ({
      //       companyId: item.companyId,
      //       id: item.id,
      //       lesson: item.lesson,
      //       lessones: this.maxMorning + item.lesson + 1,
      //       lessonEnd: item.lessonEnd,
      //       lessonPart: item.lessonPart,
      //       templateId: item.templateId,
      //       week: item.week
      //     }))
      //     this.lessonList = this.morningLesson.concat(this.after)
      //   } else {
      //   }
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
    // 获取最大课节数
    async getMaxLesson () {
      await this.$https.get(`common/selectMaxLessonHour?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        this.haveMorningRead = res.data.result.haveMorningRead
        this.maxMorning = res.data.result.maxMorning
        this.maxAfternoon = res.data.result.maxAfternoon
      })
    },
    // 选择右键菜单
    async changeReasonSet (reason, item, row) {
      let reasonOne = { ...item }
      item.reason = reason.content
      this.lesson = row.lesson
      this.lessonPart = row.lessonPart
      this.week = item.week
      // console.log(reason)
      this.reasonId = reason.id
      this.templateId = row.templateId
      if (this.isGrade) {
        this.dialogTitle = '提示'
        await this.getClassNoLessonList()
        // console.log(this.dialogTableContent.length)
        this.reasonDia = { ...reasonOne }
        if (this.dialogTableContent.length) {
          this.coverDialog = true
        } else {
          this.coverDialog = false
          this.classSetSave(reasonOne)
        }
        this.week = item.week
        this.lesson = row.lesson
      } else {
        this.coverClassRecord = true
        this.classSetSave(reasonOne)
      }
    },
    async rightOn (items, e) {
      // console.log(items)
      // console.log(e)
      if (items.reason === 1) {
        if (this.classId && items.setLevel === 2) return
        if (this.gradeId && !this.classId && items.reason === 1) {
          this.gradeAddNew = true
        }
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
      }
    },
    // 获取年级班级列表
    getClassList () {
      this.$https.get(`common/selectGradeSimple?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(async res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result.map((item, i) => ({
            id: item.id,
            name: item.name,
            parent: 1,
            gradeIndex: i,
            classLists: item.classList.map(items => ({ name: items.className, id: items.id, gradeIndex: i }))
          }))
          this.setLevel = 1
          await this.getMaxLesson()
          await this.getLesson()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取原因列表
    async getReasonList () {
      this.rightMenus = []
      await this.$https.get(`/setting/classNoarrangeReasonList`)
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
    // 添加原因
    addReasons () {
      if (!this.reasonValue) {
        notice(this, '请填写要添加的原因', 2000)
        return
      }
      this.disable = true
      this.$https.get(`/setting/classNoarrangeReasonAdd?content=${this.reasonValue}`)
      .then(res => {
        this.disable = false
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
      this.$https.get(`/setting/classNoarrangeReasonUpdate?id=${item.id}&content=${item.content}`)
      .then(res => {
        if (res.data.code === 1) {
          this.getReasonList()
          this.getClassDetail()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 单个删除原因
    deleteReason (item) {
      this.$https.get(`/setting/classNoarrangeReasonDelete?reasonId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.getReasonList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 全部删除班级不排课信息(支持批量删除，弹框)
    deleteClassNoLessonSetAll () {
      this.$https.get(`/setting/classNoarrangeSetDetailBatchDelete?reasonId=${''}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&gradeId=${this.gradeId}&classId=${this.classId}&noarrangeId=${''}`)
      .then(res => {
        if (res.data.code === 1) {
          this.classNoClass = false
          this.getClassDetail()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除单个班级不排课信息
    deleteClassNoLessonSetOne (item) {
      this.$https.get(`/setting/classNoarrangeSetDetailBatchDelete?noarrangeId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.getClassNoLessonList()
          // this.classNoClass = false
          this.getClassDetail()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
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
    // 获取 班级不排课设置信息(填充表格)
    getClassDetail () {
      if (this.isGrade) {
        this.setLevel = 2
      } else if (this.isClass) {
        this.setLevel = ''
      }
      this.$https.get(`/setting/classNoarrangeSetList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&gradeId=${this.gradeId}&classId=${this.classId}&setLevel=${this.setLevel}&keyword=${this.keyword}`)
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
    // 新增不排课设置信息(支持新增/修改，可选择原因)
    classSetSave (a) {
      if (this.isClass) {
        this.setLevel = 3
      } else if (this.isGrade) {
        this.setLevel = 2
      }
      let obj = {}
      if (a.reason === 1) { // 新增
        obj = {
          semesterId: this.semesterId.semesterId,
          sectionId: this.section.id,
          sectionName: this.semesterId.semesterName,
          gradeId: this.gradeId,
          gradeName: this.gradeName,
          classId: this.classId,
          className: this.className,
          week: this.week,
          lesson: this.lesson,
          lessonPart: this.lessonPart,
          templateId: this.templateId,
          reasonId: this.reasonId,
          setLevel: this.setLevel,
          coverClassRecord: this.coverClassRecord
        }
      } else {
        obj.id = a.id
        obj.reasonId = this.reasonId
        obj.coverClassRecord = true
      }
      this.$https.post(`/setting/classNoarrangeSetSave`, querystring.stringify({
        ...obj
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getClassDetail()
          success(this, '操作成功', 2000)
        } else {
          this.getClassDetail()
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取班级不排课列表(弹框)
    async getClassNoLessonList () {
      let obj = {
        week: this.week,
        lesson: this.lesson,
        gradeId: this.gradeId,
        classId: this.classId
      }
      if (this.dialogTitle === '班级不排课列表') {
        obj = {
          week: '',
          lesson: '',
          gradeId: '',
          classId: ''
        }
      }
      await this.$https.get(`/setting/classNoarrangeSetDetailList?reasonId=${this.reasonDialog}&week=${obj.week}&lesson=${obj.lesson}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&gradeId=${obj.gradeId}&classId=${obj.classId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.dialogTableContent = res.data.result
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
      this.getClassList()
    }
    this.initRea()
  },
  watch: {
    semesterId () {
      this.getClassList()
    },
    section () {
      this.getClassList()
    }
  }
}
</script>



<style lang="scss">
$color: #2BCEA7;
#class-no-class {
  padding-bottom: 20px;
  height: calc(100% - 20px);
  width: 100%;
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
    // float: left;
    // width: 84%;
    // min-height:500px;
    // border-radius: 4px;
    position: absolute;
    left: 240px;
    right: 10px;
    bottom: 0;
    top: 70px;
    overflow: auto;
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
      }
    }
    .dialog-box {
      max-height: 316px;
      overflow: auto;
      margin-bottom: 30px;
    }
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
  .red {
    color: red;
    cursor: pointer;
  }
  .el-dialog__body {
    max-height: 500px;
    overflow: auto;
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
    height: calc(100% - 102px) !important;
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
