<template>
  <div id="brainpower">


    <header class="header">
      <ul class="nav">
        <li v-for="(item, i) in navList" :key="item.name" :class="{'lock-list': i == 2}" @click="navClick(item)">
          
          <span v-if="item.state == 2" class="lock-list">
            
            <el-dropdown
              :show-timeout="0">
              <span class="el-dropdown-link">
                {{item.name}}
              </span>
              <el-dropdown-menu slot="dropdown" class="lock">
                <el-dropdown-item  v-for="items in lockList" :key="items.name" @mousedown.native="lockClick(items)"> {{ items.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>

          <span v-else-if="item.state == 1" class="lock-list">
            
            <el-dropdown>
              <span class="el-dropdown-link">
                {{item.name}}
              </span>
              <el-dropdown-menu slot="dropdown" class="lock-clear">
                <el-dropdown-item  v-for="items in clearList" :key="items.name" @mousedown.native="clearClick(items)">{{ items.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>

          <span v-else>{{item.name}}</span>
        </li>
        <li class="arrow" :class="{downArrow: downArrowShow}" @click="downArrowShow = !downArrowShow">

        </li>
      </ul>
      <ul class="grade" v-if="downArrowShow">
        <li class="li">年级选择:</li>
        <li v-for="(item, i) in gradeList" :class="{active: activeIndex == i, lock: item.lock == 1}" :key="item.name" @click="gradeSwitch(item, i)">{{item.name}}</li>
      </ul>
      <ul class="grade" v-if="downArrowShow">
        <li class="li">班级选择:</li>
        <li v-for="(item, i) in classList" :class="{active: activeInd == i, lock: item.lock == 1}" :key="item.name" @click="classSwitch(item, i)">
          {{item.name}}({{parseInt(item.hours)}})
        </li>
      </ul>
    </header>

    <section class="subject-list" style="line-height: 50px;" ref="subject">
      <draggable v-model="subjectList" :options="{group:'people', 'disabled': canMove}" @start="startDrag" @end="endDrag" @update="dragUpdate($event, index)" @add="dragAdd($event, index)">
        <span v-for="(item, i) in subjectList" v-if="item" v-show="item.singleDouble === 0" :key="i" :class="{active: classInd == i}" @click="subjectSwitch(item, i, 1)" @mousedown="buttonDown(item, i)" @mouseup="dbl = {}" style="margin-bottom: 0;">{{item.courseName}}<br>{{item.teacherName}} <i>{{ parseInt(item.hour) }}</i> </span>
        <span v-for="(item, i) in subjectList" v-if="item.arr" v-show="item.singleDouble === 1" :key="i" :class="{active: classInd == i}" @click="subjectSwitch(item, i, 1)" @mousedown="buttonDown(item, i)" @mouseup="dbl = {}" style="margin-bottom: 0;">{{item.courseName}}/{{item.arr.courseName}}<br>{{item.teacherName}}/{{item.arr.teacherName}} <i>{{ (Number(item.hour) + Number(item.arr.hour)) }}</i> </span>
      </draggable>
      <!-- <span v-for="(item, i) in subjectList" :key="item.courseName" :class="{active: classInd == i}" @click="subjectSwitch(item, i)">{{item.courseName}}({{item.hour}})-{{item.teacherName}}</span> -->
    </section>

    <div class="table-groups" ref="height">
      <section class="table-group" ref="asides">

        <!-- 左侧表格 -->
        <div class="table">

            <div class="table-tr">
              <span class="table-header">课节</span>
              <div class="table-course" v-for="(item, i) in lessonList" :key="i">{{ item.lessones | lessonFilter }}</div>
            </div>
            <div v-for="(item, index) in tableData" :key="index" class="table-tr">
              <span class="table-header">{{ item.weekName }}</span>
              <draggable v-model="item.courseList" :options="{group:'people', 'disabled': canMove}" @start="startDrag" @end="endDrag" @update="dragUpdate($event, index)" @add="dragAdd($event, index)">
                <div v-for="(items, i) in item.courseList" :key="i" class="table-course table-subject-list" @mousedown="mouseDown(index, i, items)" @mouseup.right="rightEvent(items, 1)" :class="{lock: items.lockState == 1, 'can-mod': items.canMod, 'classroom': items.teacherDoubleName, 'teacher': (items.teacherNoarrangeReasonContent && items.teacherNoarrangeReasonContent !== 0)}">
                  <!-- <div v-if="items.teacherNoarrangeReasonContent">{{items.teacherNoarrangeReasonContent}}</div> -->
                  <div v-if="items.classNoarrangeReasonContent">{{items.classNoarrangeReasonContent}}</div>
                  <span v-else-if="items.teacherName" :class="{active: items.active == 1}">{{ items.subjectShortName || items.courseName }} <i v-if="items.subjectDoubleShortName">/</i> {{ items.subjectDoubleShortName }}<br>{{ items.teacherName }} <i v-if="items.subjectDoubleShortName">/</i> {{ items.teacherDoubleName }}</span>
                  <span v-else-if="!items.teacherName" style="border: none;">　</span>
                  <img class="tanhao-red" v-if="items.teacherForbidden === 1" src="../../assets/images/tanhao-red.png" alt="">
                  <!-- <span class="classroom" :class="{active: items.active == 2}" v-if="items.teacherDoubleName" @mousedown.stop="mouseDowns(index, i, items, 2)">{{ items.subjectDoubleShortName }}<br>{{ items.teacherDoubleName }}</span> -->
                  <ul v-show="items.menu && items.subjectShortName && !items.lockState">
                    <li v-for="(menu, ind) in menuList.left" :key="ind" @click="rightClick(index, i, menu)">{{ menu.name }}</li>
                  </ul>
                  <ul v-show="items.menu && items.subjectShortName && items.lockState">
                    <li v-for="(menu, ind) in menuList.leftContent" :key="ind" @click="rightClick(index, i, menu)">{{ menu.name }}</li>
                  </ul>
                </div>
              </draggable>
            </div>
          
        </div>

        <!-- 右侧表格 -->
        <div class="table">
          <div class="table-tr">
              <span class="table-header">课节</span>
              <div class="table-course" v-for="item in lessonList" :key="item.subjectShortName">{{ item.lessones | lessonFilter }}</div>
            </div>
            <div v-for="(item, index) in rightTable" :key="index" class="table-tr">
              <span class="table-header">{{ item.weekName }}</span>
              <div v-for="(items, i) in item.courseList" :key="i" class="table-course right" @mousedown.right="rightEvent(items)" :class="{'mod-active': (items.gradeName == gradeList[activeIndex].name) && (items.className == classList[activeInd].name) && (items.teacherName)}">
              <!-- <div v-if="items.teacherNoarrangeReasonContent"><br/>{{items.teacherNoarrangeReasonContent}}</div> -->
              <div v-if="items.classNoarrangeReasonContent"><br/>{{items.classNoarrangeReasonContent}}</div>
				      <div v-if="!items.classNoarrangeReasonContent && items.teacherName && items.gradeName">{{ items.gradeName }}{{ items.className}}</div>
				      <div v-if="!items.classNoarrangeReasonContent && !items.teacherName && !items.gradeName && items.doubleResult">{{ items.doubleResult.gradeName }}{{ items.doubleResult.className}}</div>
              <span v-if="!items.classNoarrangeReasonContent && items.doubleResult">{{ items.doubleResult.subjectShortName }}</span>
              <span v-if="items.teacherName">{{ items.subjectShortName }}</span>
              <!-- 
              <div v-show="items.teacherName">{{ items.gradeName }}{{ items.className}}</div>
              <span v-show="items.teacherName">{{ items.subjectShortName }}</span>
              -->
                <ul v-show="items.menu" v-if="items.teacherName && rightActiveId == items.id">
                  <li v-for="(menu, ind) in menuList.right" :key="ind" @click="rightClick(index, i, menu, items)">{{ menu.name }}</li>
                </ul>
              </div>
            </div>
        </div>
      </section>
    </div>
    


    <!--排课结果备份-->
    <el-dialog
      class="brain-dialog"
      title="排课结果备份"
      :visible.sync="backupVisible"
      :show-close="false"
      size="tiny">
      <div class="input" v-show="!backupFull">
        备份名称：
        <el-input v-model="backupName" :maxlength="20"></el-input>
      </div>
      <div class="radios" v-show="backupFull">
        已超出最大备份数量，请选择一个版本进行替换
        <el-radio v-for="item in backList" :key="item.name" class="radio" v-model="radio" :label="item.id">{{ item.name }}</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backupVisible = false">取 消</el-button>
        <el-button type="success" @click="backResult">确 定</el-button>
      </span>
    </el-dialog>

    <!--排课结果恢复-->
    <el-dialog
      class="brain-dialog"
      title="排课结果恢复"
      :visible.sync="recoverVisible"
      :show-close="false"
      size="tiny">
      <div class="radio">
        请选择要恢复的排版
        <el-radio v-for="item in backList" :key="item.name" class="radio" v-model="composing" @mouseenter.native="item.show = true" @mouseleave.native="item.show = false" :label="item.id">{{ item.name }} <i @click="delBackup(item)" v-if="item.show" class="el-icon-close" style="margin-left: 20px;font-size: 12px;cursor: pointer;color: #558ED5;font-weight: bold;"></i> </el-radio>
        <div v-if="backList.length === 0" class="no-backList">暂无备份</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recoverVisible = false">取 消</el-button>
        <el-button type="success" @click="recoveryResult">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 提示清除排课结果 -->
    <el-dialog
      class="brain-dialog"
      title="提示"
      :visible.sync="resultClear"
      :show-close="true"
      size="tiny">
      <div class="input">
        {{ remark }}
        <!-- 您确定要清除课节安排吗（除了锁定的课程）？ -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resultClear = false">取 消</el-button>
        <el-button type="success" @click="clearResult">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 若有单双周，是否已经设置排课规则 -->
    <el-dialog
      title="提示"
      :visible.sync="singleDoubleWeek"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      size="tiny">
      <div style="max-height: 300px; overflow-x: hidden;">
        <p style="margin-top: 5px;" v-for="(item, index) in singleDoubleWeekData" :key="index">
          {{ item }}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="$router.push('/rules/singleOrDouble')">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog
      class="brain-dialog"
      title="提示"
      :visible.sync="Onekey"
      :show-close="false"
      size="tiny">
      <p>确定要一键排课吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Onekey = false">取 消</el-button>
        <el-button type="success" @click="intelligent">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import querystring from 'querystring'
import { notice, success } from '../../api/index.js'
import draggable from 'vuedraggable'
export default {
  name: 'brainpower',
  data () {
    return {
      singleDoubleWeek: false,
      singleDoubleWeekData: [],
      downArrowShow: false,
      navList: [
        { name: '走班排课', state: '0', color: '#4DD093' },
        { name: '清除排课结果', state: '1', color: '#44AAF6' },
        { name: '锁定结果', state: '2', color: '#F6B244' },
        { name: '排课结果备份', state: '3', color: '#078EF3' },
        { name: '排课结果恢复', state: '4', color: '#F38A5F' }
      ],
      clearList: [
        { name: '清除全部', state: '2' },
        { name: '清除当前年级', state: '0' },
        { name: '清除当前班级', state: '1' }
      ],
      lockList: [
        { name: '锁定年级', state: '0' },
        { name: '锁定班级', state: '1' },
        { name: '解锁年级', state: '2' },
        { name: '解锁班级', state: '3' },
        { name: '解锁所有', state: '4' }
      ],
      gradeList: [],
      classList: [],
      backList: [],
      activeIndex: 0,
      activeInd: 0,
      subjectList: [],
      classInd: -1,
      weekList: [
        { name: '星期一', week: 1 },
        { name: '星期二', week: 2 },
        { name: '星期三', week: 3 },
        { name: '星期四', week: 4 },
        { name: '星期五', week: 5 }
      ],
      lessonList: [],
      resultClear: false,
      backupVisible: false,
      recoverVisible: false,
      Onekey: false,
      backupName: '',
      radio: '',
      composing: '',
      leftTable: [],
      rightTable: [],
      tableData: [],
      drag: false,
      start: {
        cols: 0, // 列
        rows: 0 // 行
      },
      end: {
        cols: 0,
        rows: 0
      },
      canMove: false,
      remark: '',
      backupFull: false,
      menuList: {
        left: [
          { name: '删除', state: 0, menuState: true },
          { name: '锁定', state: 1, menuState: true }
        ],
        leftContent: [
          { name: '解锁', state: 1, menuState: false }
        ],
        right: [
          { name: '进入班级', state: 2 },
          { name: '直接删除', state: 0 }
        ]
      },
      rightMenuShowItem: {},
      asideTable: [],
      clear: {
        gradeId: '',
        classId: ''
      },
      subjectActive: {},
      buttonState: false,
      asideList: [],
      rightActiveId: '',
      dbl: {}
    }
  },
  computed: {
    ...mapGetters([
      'semesterId',
      'section'
    ])
  },
  components: {
    draggable
  },
  created () {
    if (this.semesterId.semesterId && this.section.id) {
      this.getGrade()
      this.$https.get(`/arrange/validateRules?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 0) {
          this.singleDoubleWeek = true
          this.singleDoubleWeekData = res.data.message.split('；')
        } else {
          this.singleDoubleWeek = false
        }
      })
    }
  },
  methods: {
    // 删除备份
    delBackup (item) {
      this.$https.post(`/arrange/resultBackDelete?semesterId=${item.semesterId}&sectionId=${item.sectionId}&mainId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.getBackList()
          success(this, '删除成功', 1000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    gradeSwitch (item, i) {
      this.activeIndex = i
      this.classList = (this.gradeList[i].classList || []).map(item => ({...item, name: item.className}))
      this.activeInd = 0
      this.getClassHourByGrade()
      this.classSwitch(1, 0)
      this.lockState()
    },
    async classSwitch (item, i) {
      this.activeInd = i
      this.classInd = -1
      this.getCourseByClass()
      await this.getLessonHour()
      this.getResultList()
    },
    async subjectSwitch (item, i, s) {
      this.rightTable = (this.rightTable || []).map(item => ({
        ...item,
        courseList: (item.courseList || []).map(items => ({
          ...items,
          subjectFullName: '',
          subjectShortName: '',
          subjectId: '',
          teacherName: '',
          teacherId: '',
          menu: false
        }))
      }))
      this.classInd = i
      await this.filterSubject(s)
      await this.getResultTeacher(item)
      this.getDragState()
      if (s === 1) return
      // this.rightEvent('', 1)
    },
    getGrade () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`/common/selectGradeClassList?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(async res => {
        if (res.data.code === 1) {
          this.gradeList = (res.data.result || []).map(item => ({...item, lock: 0}))
          this.classList = (this.gradeList[0].classList || []).map(item => ({...item, name: item.className, hours: 0, lock: 0}))
          await this.getClassHourByGrade()
          await this.getCourseByClass()
          await this.getLessonHour()
          await this.getResultList()
          await this.lockState()
          await this.rightMoveToLeft()
          this.getDragState()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async getLessonHour () {
      if (!this.classList.length) return
      this.tableData = [
        { weekNum: 1, weekName: '星期一', courseList: [] },
        { weekNum: 2, weekName: '星期二', courseList: [] },
        { weekNum: 3, weekName: '星期三', courseList: [] },
        { weekNum: 4, weekName: '星期四', courseList: [] },
        { weekNum: 5, weekName: '星期五', courseList: [] }
      ]
      await this.$https.get(`/common/selectLessonHour?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&gradeId=${this.gradeList[this.activeIndex].id}&classId=${this.classList[this.activeInd].id}`)
      .then(res => {
        if (res.data.code === 1) {
          let lesson = (res.data.result || []).filter(item => item.week === 1)
          this.lessonList = lesson
          let mornList = (this.lessonList || []).filter(item => item.lessonPart === 1)
          this.lessonList.forEach(item => {
            if (item.lessonPart === 2) {
              item.lessones = mornList.length + item.lesson - 1
            } else {
              item.lessones = item.lesson
            }
          })
          this.tableData = [
            { weekNum: 1, weekName: '星期一', courseList: [] },
            { weekNum: 2, weekName: '星期二', courseList: [] },
            { weekNum: 3, weekName: '星期三', courseList: [] },
            { weekNum: 4, weekName: '星期四', courseList: [] },
            { weekNum: 5, weekName: '星期五', courseList: [] }
          ]
          this.tableData.forEach(item => {
            item.courseList = (this.lessonList || []).map(item => ({...item}))
          })
        }
      })
    },
    lockState () {
      let gradeIds = (this.gradeList || []).map(item => item.id).join(',')
      // this.semesterId.semesterId
      let classIds = (this.classList || []).map(item => item.id).join(',')
      this.$https.post('/arrange/lockState', querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        gradeIds,
        classIds
      }))
      .then(res => {
        if (res.data.code === 1) {
          let grade = res.data.result.gradeLock
          let classes = res.data.result.classLock
          this.gradeList.forEach(item => {
            grade.forEach(items => {
              if (item.id === items.id) {
                // item.lock = items.lock
                this.$set(item, 'lock', items.lock)
              }
            })
          })
          this.classList.forEach(item => {
            classes.forEach(items => {
              if (item.id === items.id) {
                // item.lock = items.lock
                this.$set(item, 'lock', items.lock)
              }
            })
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    navClick (item) {
      if (!this.semesterId.semesterId) {
        notice(this, '请选择学期', 2000)
        return
      }
      if (!this.section.id) {
        notice(this, '请选择学段', 2000)
        return
      }
      if (item.state === '0') {
        // 走班排课
        // this.intelligent()
        this.Onekey = true
      } else if (item.state === '1') {
        // 清除排课结果
        // this.resultClear = true
        // this.remark = '您确定要清除课节安排吗（除了锁定的课程）？'
        return
      } else if (item.state === '2') {
        // 锁定结果
        return
      } else if (item.state === '3') {
        this.backupVisible = true
        this.backupFull = false
        this.backupName = ''
        this.radio = ''
        this.backList = []
        // 排课结果备份
      } else if (item.state === '4') {
        // 排课结果恢复
        this.recoverVisible = true
        this.backList = []
        this.composing = ''
        this.getBackList()
      }
    },
    lockClick (item) {
      let gradeId = this.gradeList[this.activeIndex].id
      let classId = ''
      let lock = 0
      if (item.state === '0') {
        // 锁定年级
        lock = 1
      } else if (item.state === '1') {
        // 锁定班级
        lock = 1
        // this.resultClear = true
        classId = this.classList[this.activeInd].id
      } else if (item.state === '2') {
        // 解锁年级
        lock = 0
      } else if (item.state === '3') {
        // 解锁班级
        lock = 0
        classId = this.classList[this.activeInd].id
      } else if (item.state === '4') {
        // 解锁所有
        lock = 0
        gradeId = ''
      }
      this.$https.post(`/arrange/resultLock`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        gradeId,
        classId,
        lock
      }))
      .then(async res => {
        if (res.data.code === 1) {
          this.lockState()
          await this.getLessonHour()
          this.getResultList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    clearClick (item) {
      this.clear.gradeId = this.gradeList[this.activeIndex].id
      this.clear.classId = ''
      if (item.state === '0') {
        // 锁定年级
      } else if (item.state === '1') {
        // 锁定班级
        // this.resultClear = true
        this.clear.classId = this.classList[this.activeInd].id
      } else if (item.state === '2') {
        this.clear.gradeId = ''
      }
      this.resultClear = true
      this.remark = '您确定要清除课节安排吗（除了锁定的课程）？'
    },
    // 获取各班级的未安排课时
    getClassHourByGrade () {
      if (!this.gradeList.length) return
      // this.semesterId.semesterId
      this.$https.get(`/arrange/classHourByGrade?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&gradeId=${this.gradeList[this.activeIndex].id}`)
      .then(res => {
        if (res.data.code === 1) {
          // if (!res.data.result.length) return
          (res.data.result || []).forEach(item => {
            this.classList.forEach(items => {
              if (item.clazzId === items.id) {
                items.hours = item.hour
              }
            })
          })
        }
      })
    },
    // 根据班级获取课程
    getCourseByClass () {
      if (!this.classList.length) return
      this.$https.get(`/arrange/classHourByClass?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&gradeId=${this.gradeList[this.activeIndex].id}&classId=${this.classList[this.activeInd].id}`)
      .then(res => {
        if (res.data.code === 1) {
          // if (!res.data.result.length) return
          this.subjectList = (res.data.result || []).map(item => ({...item, lists: true}))
          let arr = []
          this.subjectList.forEach((item, index) => {
            if (item.singleDouble === 1) {
              arr.push(index)
            }
          })
          if (arr.length > 0 && arr.length % 2 === 0) {
            this.subjectList[arr[0]].arr = this.subjectList[arr[1]]
            this.subjectList.splice(arr[1], 1)
          } else if (arr.length > 0) {
            // notice(this, '0.5的课时，请设置单双周课程', 2000)
            return
          }
          let message = false
          this.subjectList.forEach(item => {
            if (!item.teacherName) {
              message = true
            }
          })
          if (message) {
            notice(this, '您有课程未设置老师', 2000)
          }
          this.asideList = [ ...this.subjectList ]
          this.$nextTick(_ => {
            this.$refs.height.style.height = document.querySelector('#brainpower').offsetHeight - 92 - this.$refs.subject.offsetHeight + 'px'
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 根据班级获取课程安排信息 -- 左侧表格
    async getResultList () {
      // if (!this.classList.length) return
      // this.semesterId.semesterId
      // this.classList[this.activeInd].id
      await this.$https.get(`/arrange/resultList?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&gradeId=${this.gradeList[this.activeIndex].id}&classId=${this.classList[this.activeInd].id}`)
      .then(res => {
        if (res.data.code === 1) {
          let tableData = res.data.result || []
          // 需要设置一个自动补全
          // if (tableData.every(item => !item.courseList)) {
          //   this.lessonList = []
          // }
          this.motion(tableData)
          this.$refs.asides.style.height = (this.lessonList.length + 1) * 57 + 'px'
          this.rightTable = []
          this.tableData.forEach(item => {
            let obj = {...item}
            if (item.courseList) {
              obj.courseList = (item.courseList || []).map(items => ({
                ...items,
                subjectFullName: '',
                subjectShortName: '',
                subjectId: '',
                teacherName: '',
                teacherId: '',
                canMod: false,
                gradeName: '',
                className: ''
              }))
            }
            this.rightTable.push(obj)
          })
          this.getClassHourByGrade()
        }
      })
    },
    motion (arr) {
      this.tableData.forEach(item => {
        arr.forEach(arrs => {
          if (arrs.weekNum === item.weekNum) {
            (item.courseList || []).forEach((items, i) => {
              if (arrs.courseList) {
                arrs.courseList.forEach(arres => {
                  if ((items.lesson === arres.lesson) && (items.lessonPart === arres.lessonPart)) {
                    // items = arres
                    this.$set(item.courseList, i, arres)
                  }
                })
              }
            })
          }
        })
      })
    },
    // 右侧表格
    async getResultTeacher (item) {
      await this.$https.get(`/arrange/resultByTeacher?semesterId=${this.semesterId.semesterId}` +
                            `&sectionId=${this.section.id}` +
                            `&teacherId=${this.subjectList[this.classInd].teacherId}` +
                            `&teacherDoubleId=${item ? (item.teacherDoubleId || '') : ''}` +
                            `&gradeId=${this.gradeList[this.activeIndex].id}` +
                            `&classId=${this.classList[this.activeInd].id}` +
                            `&subjectId=${this.subjectList[this.classInd].courseId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.asideTable = [ ...res.data.result ]
          this.rightMoveToLeft()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 右侧表格根据左侧变动
    rightMoveToLeft () {
      this.rightTable = []
      this.tableData.forEach(item => {
        let obj = {...item}
        if (item.courseList) {
          obj.courseList = (item.courseList || []).map(items => ({
            ...items,
            subjectFullName: '',
            subjectShortName: '',
            subjectId: '',
            teacherName: '',
            teacherId: '',
            gradeName: '',
            className: '',
            menu: false
          }))
        }
        this.rightTable.push(obj)
      })
      this.rightTable.forEach((item, ind) => {
        item.courseList.forEach((items, i) => {
          this.asideTable.forEach(hasSubs => {
            if ((hasSubs.lesson === items.lesson) && (hasSubs.lessonPart === items.lessonPart) && (hasSubs.week === (ind + 1))) {
              this.$set(item.courseList, i, hasSubs)
            }
          })
        })
      })
      this.rightTable.forEach((item, i) => {
        item.courseList.forEach((items, index) => {
          if (items.teacherName) {
            this.$set(this.tableData[i].courseList[index], 'canMod', false)
            this.tableData[i].courseList[index].canMod = false
          }
        })
      })
    },
    // 保存课程安排信息
    saveResult () {
      this.$https.post(`/arrange/resultSave`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        gradeId: this.gradeList[this.activeIndex].id,
        classId: this.classList[this.activeInd].id,
        resultList: JSON.stringify(this.tableData)
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '保存成功', 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 清除课节安排
    clearResult () {
      this.$https.post(`/arrange/resultClear`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        gradeId: this.clear.gradeId,
        classId: this.clear.classId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.resultClear = false
          // this.cancleSet()
          this.getGrade()
          this.activeIndex = 0
          success(this, '清除课节安排成功', 2000)
          this.getResultTeacher()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 排课结果备份
    backResult () {
      // this.semesterId.semesterId
      if (!this.backupName || this.backupName.trim() === '') {
        this.backupName = ''
        notice(this, '请输入备份名称', 2000)
        return
      }
      if (this.backupFull && !this.radio) {
        notice(this, '请选择要替换的备份', 2000)
        return
      }
      this.$https.post(`/arrange/resultBack`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        mainId: this.radio,
        name: this.backupName
      }))
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result) {
            this.backupFull = true
            this.backList = res.data.result
            this.radio = ''
          } else {
            this.backupName = ''
            this.radio = ''
            this.backupFull = false
            success(this, '备份成功', 2000)
            this.backupVisible = false
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取排课备份列表
    getBackList () {
      // this.semesterId.semesterId
      this.$https.get(`/arrange/resultBackList?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.backList = res.data.result.map(item => ({...item, show: false}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 恢复到备份
    recoveryResult () {
      if (!this.composing) {
        notice(this, '请选择要恢复的备份', 2000)
        return
      }
      this.$https.post(`/arrange/resultRecovery`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        mainId: this.composing
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.recoverVisible = false
          success(this, '恢复成功', 2000)
          this.getGrade()
          this.activeIndex = 0
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async dragUpdate (e, index) {
      // 列内变化，需要手动改变数据
      // 不能实现两个互换位置，而是插队
      this.end.cols = index
      this.end.rows = e.newIndex
      // 判断是否符合拖动条件
      let canMod = false
      if (this.end.rows < this.start.rows) {
        canMod = this.tableData[this.end.cols].courseList[this.end.rows + 1].canMod && (!this.tableData[this.end.cols].courseList[this.end.rows + 1].teacherName)
      } else {
        canMod = this.tableData[this.end.cols].courseList[this.end.rows - 1].canMod && (!this.tableData[this.end.cols].courseList[this.end.rows - 1].teacherName)
      }
      if (canMod) { // 能拖
        // 取消插队
        let modItem = {}
        // 往上移动
        if (this.end.rows < this.start.rows) {
          modItem = this.tableData[this.end.cols].courseList[this.end.rows + 1]
          this.tableData[this.end.cols].courseList.splice(this.end.rows + 1, 1)
          this.tableData[this.start.cols].courseList.splice(this.start.rows, 0, modItem)
        } else {
          // 往下移动
          modItem = this.tableData[this.end.cols].courseList[this.end.rows - 1]
          this.tableData[this.start.cols].courseList.splice(this.start.rows, 0, modItem)
          this.tableData[this.end.cols].courseList.splice(this.end.rows, 1)
        }
      } else {
        // 不能拖
        console.log('不能拖')
        let modItem = {}
        modItem = this.tableData[this.end.cols].courseList[this.end.rows]
        this.tableData[this.end.cols].courseList.splice(this.end.rows, 1)
        this.tableData[this.start.cols].courseList.splice(this.start.rows, 0, modItem)
        return
      }
      // await this.getResultTeacher()
      // this.rightMoveToLeft()
      let lesson = this.lessonList[this.end.rows].lesson
      let lessonPart = this.lessonList[this.end.rows].lessonPart
      this.saveSingle(this.tableData[this.end.cols].courseList[this.end.rows], lesson, lessonPart, this.end.cols + 1)
    },
    async dragAdd (e, index) {
      this.end.cols = index
      this.end.rows = e.newIndex
      if (this.buttonState) {
        if (this.dbl.arr) {
          this.tableData[this.end.cols].courseList.splice(this.end.rows, 1, this.dbl)
          let lesson = this.lessonList[this.end.rows].lesson
          let lessonPart = this.lessonList[this.end.rows].lessonPart
          let arr = this.tableData[this.end.cols].courseList.map(item => ({
            ...item,
            subjectId: item.courseId,
            subjectShortName: item.courseName
          }))
          await this.saveSingle(arr[this.end.rows], lesson, lessonPart, this.end.cols + 1)
          await this.getCourseByClass()
          this.subjectList.forEach((items, ind) => {
            if ((items.teacherName === this.subjectActive.teacherName) && (items.teacherId === this.subjectActive.teacherId)) {
              // this.$set(items, 'hour', items.hour--)
              this.subjectSwitch(items, ind)
            }
          })
          return
        }
        if (this.tableData[this.end.cols].courseList[this.end.rows + 1].canMod && (!this.tableData[this.end.cols].courseList[this.end.rows + 1].teacherName)) {
          this.tableData[this.end.cols].courseList.splice(this.end.rows + 1, 1)
          let lesson = this.lessonList[this.end.rows].lesson
          let lessonPart = this.lessonList[this.end.rows].lessonPart
          let arr = this.tableData[this.end.cols].courseList.map(item => ({
            ...item,
            subjectId: item.courseId,
            subjectShortName: item.courseName
          }))
          await this.saveSingle(arr[this.end.rows], lesson, lessonPart, this.end.cols + 1)
          await this.getCourseByClass()
          this.subjectList.forEach((items, ind) => {
            if ((items.teacherName === this.subjectActive.teacherName) && (items.teacherId === this.subjectActive.teacherId)) {
              // this.$set(items, 'hour', items.hour--)
              this.subjectSwitch(items, ind)
            }
          })
        } else {
          this.tableData[this.end.cols].courseList.splice(this.end.rows, 1)
          return
        }
      } else {
        if (this.tableData[this.end.cols].courseList[this.end.rows + 1].canMod && (!this.tableData[this.end.cols].courseList[this.end.rows + 1].teacherName)) {
          // 换列的时候触发事件
          // this.end.cols = index
          // this.end.rows = e.newIndex
          this.tableData[this.start.cols].courseList.splice(this.start.rows, 0, this.tableData[this.end.cols].courseList[this.end.rows + 1])
          this.tableData[this.end.cols].courseList.splice(this.end.rows + 1, 1)
          let lesson = this.lessonList[this.end.rows].lesson
          let lessonPart = this.lessonList[this.end.rows].lessonPart
          this.saveSingle(this.tableData[this.end.cols].courseList[this.end.rows], lesson, lessonPart, this.end.cols + 1)
        } else {
          // this.end.cols = index
          // this.end.rows = e.newIndex
          console.log('不能拖')
          let modItem = {}
          modItem = this.tableData[this.end.cols].courseList[this.end.rows]
          this.tableData[this.end.cols].courseList.splice(this.end.rows, 1)
          this.tableData[this.start.cols].courseList.splice(this.start.rows, 0, modItem)
          return
        }
      }
      // await this.getResultTeacher()
      // this.rightMoveToLeft()
    },
    startDrag (e) {
      this.drag = true
    },
    async endDrag () {
      // this.subjectList = [ ...this.asideList ]
      // this.subjectList.forEach((items, ind) => {
      //   if (items.teacherName === this.subjectActive.teacherName) {
      //     this.classInd = ind
      //   }
      // })
      await this.getCourseByClass()
      await this.getResultList()
      // await this.getResultTeacher()
    },
    buttonDown (item, i) {
      this.canMove = true
      if (Number(item.hour) !== 0) {
        this.canMove = false
      }
      if (item.arr) {
        this.dbl = { ...item }
      } else {
        this.dbl = {}
      }
      this.subjectActive = item
      this.subjectSwitch(item, i)
      this.buttonState = true
    },
    async mouseDown (index, i, item) {
      if (item.subjectDoubleId) {
        this.dbl.arr = {
          courseId: item.subjectDoubleId,
          courseName: item.subjectDoubleShortName,
          teacherId: item.teacherDoubleId,
          teacherName: item.teacherDoubleName
        }
      } else {
        this.dbl = {}
      }
      this.canMove = false
      this.buttonState = false
      if (!item.teacherName) {
        this.canMove = true
        return
      }
      if (item.lockState === 1) {
        this.canMove = true
        return
      }
      this.start.cols = index
      this.start.rows = i
      if ((this.subjectActive.teacherName === item.teacherName) && (this.subjectActive.teacherId === item.teacherId)) {
        this.subjectList.forEach((items, ind) => {
          if ((items.teacherName === item.teacherName) && (items.teacherId === item.teacherId)) {
            this.subjectSwitch(items, ind, item)
          }
        })
        return
      }
      this.subjectList.forEach((items, ind) => {
        if ((items.teacherName === item.teacherName) && (items.teacherId === item.teacherId)) {
          this.subjectActive = items
          items.teacherDoubleId = item.teacherDoubleId
          this.subjectSwitch(items, ind, item)
        }
      })
    },
    async mouseDowns (index, i, item, s) {
      this.canMove = false
      this.buttonState = false
      if (!item.teacherName) {
        this.canMove = true
        return
      }
      if (item.lockState === 1) {
        this.canMove = true
        return
      }
      this.start.cols = index
      this.start.rows = i
      if ((this.subjectActive.teacherName === item.teacherDoubleName) && (this.subjectActive.teacherId === item.teacherDoubleId)) return
      this.subjectList.forEach(async (items, ind) => {
        if ((items.teacherName === item.teacherDoubleName) && (items.teacherId === item.teacherDoubleId)) {
          this.subjectActive = items
          await this.subjectSwitch(items, ind, s)
        }
      })
    },
    async cancleSet () {
      this.classInd = -1
      await this.getLessonHour()
      await this.getResultList()
      await this.filterSubject()
      this.rightMoveToLeft()
    },
    leave (items) {
      items.menu = false
    },
    rightEvent (items, a) {
      if (a === 1) {
        this.tableData.forEach((item, i) => {
          item.courseList.forEach((items, ind) => {
            this.$set(item.courseList[ind], 'menu', false)
          })
        })
      }
      this.rightActiveId = items.id
      if (this.rightMenuShowItem === items) {
        if (items) {
          items.menu = !items.menu
        }
      } else {
        if (this.rightMenuShowItem) {
          this.rightMenuShowItem.menu = false
          this.$set(this.rightMenuShowItem, 'menu', false)
          if (items) {
            this.$set(items, 'menu', true)
          }
        } else {
          this.$set(items, 'menu', !items.menu)
        }
      }
      if (items) {
        this.rightMenuShowItem = items
      }
    },
    async rightClick (index, i, menu, items) {
      if (menu.state === 0) {
        // 删除
        // let lesson = this.tableData[index].courseList[i].lesson
        // this.tableData[index].courseList[i] = { lesson }
        // this.rightMoveToLeft()
        this.$https.post(`/arrange/resultClear`, querystring.stringify({
          semesterId: this.semesterId.semesterId,
          sectionId: this.section.id,
          resultId: items ? items.id : this.tableData[index].courseList[i].id
        }))
        .then(async res => {
          if (res.data.code === 1) {
            // let lesson = this.tableData[index].courseList[i].lesson
            // this.tableData[index].courseList[i] = { lesson }
            // this.rightMoveToLeft()
            await this.getClassHourByGrade()
            await this.getCourseByClass()
            this.tableData.forEach(item => {
              item.courseList = []
            })
            await this.getLessonHour()
            await this.getResultList()
            // await this.lockState()
            // await this.rightMoveToLeft()
            await this.getDragState()
            this.subjectList.forEach((items, ind) => {
              if ((items.teacherName === this.subjectActive.teacherName) && (items.teacherId === this.subjectActive.teacherId)) {
                this.subjectSwitch(items, ind)
              }
            })
          } else {
            notice(this, res.data.result, 2000)
          }
        })
      } else if (menu.state === 1) {
        // 锁定
        this.tableData[index].courseList[i].lockState = this.tableData[index].courseList[i].lockState === 0 ? 1 : 0
        this.$https.post(`/arrange/resultLock`, querystring.stringify({
          semesterId: this.semesterId.semesterId,
          sectionId: this.section.id,
          resultId: this.tableData[index].courseList[i].id,
          lock: this.tableData[index].courseList[i].lockState
        }))
        .then(async res => {
          if (res.data.code === 1) {
            await this.getResultList()
            this.subjectList.forEach((items, ind) => {
              if ((items.teacherName === this.tableData[index].courseList[i].teacherName) && (items.teacherId === this.tableData[index].courseList[i].teacherId)) {
                this.subjectActive = items
                this.subjectSwitch(items, ind)
              }
            })
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (menu.state === 2) {
        // 进入班级
        this.classList.forEach((item, x) => {
          if (item.id === items.classId) {
            this.classSwitch(1, x)
          }
        })
        // await this.getCourseByClass()
        // this.subjectList.forEach((items, ind) => {
        //   if ((items.teacherName === this.subjectActive.teacherName) && (items.teacherId === this.subjectActive.teacherId)) {
        //     this.subjectSwitch(items, ind)
        //   }
        // })
      }
      this.rightEvent(this.rightMenuShowItem)
    },
    // 通过选中的科目筛选列表
    filterSubject (s) {
      this.tableData.forEach(item => {
        item.courseList.forEach(c => {
          c.active = false
          if (c.teacherName === this.subjectList[this.classInd].teacherName) {
            c.active = 1
          } else if (c.teacherDoubleName === this.subjectList[this.classInd].teacherName) {
            c.active = 2
          }
        })
      })
    },
    // 一键排课
    intelligent () {
      let arr = []
      this.subjectList.forEach((item, index) => {
        if (item.hour === '0.5') {
          arr.push(index)
        }
      })
      if (arr.length > 0 && arr.length % 2 === 0) {
        this.subjectList[arr[0]].arr = this.subjectList[arr[1]]
        this.subjectList.splice(arr[1], 1)
      }
      this.$https.get(`/arrange/resultIntelligent?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.getGrade()
          this.activeIndex = 0
          this.Onekey = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 单个保存
    async saveSingle (item, lesson, lessonPart, week) {
      let resultJson = {}
      resultJson.id = item.id
      resultJson.sectionId = this.section.id
      resultJson.semesterId = this.semesterId.semesterId
      resultJson.gradeId = this.gradeList[this.activeIndex].id
      resultJson.gradeName = this.gradeList[this.activeIndex].name
      resultJson.classId = this.classList[this.activeInd].id
      resultJson.className = this.classList[this.activeInd].name
      resultJson.subjectId = item.subjectId
      resultJson.subjectShortName = item.subjectShortName
      resultJson.teacherId = item.teacherId
      resultJson.teacherName = item.teacherName
      resultJson.week = week
      resultJson.lesson = lesson
      resultJson.lessonPart = lessonPart
      if (this.dbl.arr) {
        resultJson.subjectDoubleId = this.dbl.arr.courseId
        resultJson.subjectDoubleShortName = this.dbl.arr.courseName
        resultJson.teacherDoubleId = this.dbl.arr.teacherId
        resultJson.teacherDoubleName = this.dbl.arr.teacherName
      } else {
        resultJson.subjectDoubleId = ''
        resultJson.subjectDoubleShortName = ''
        resultJson.teacherDoubleId = ''
        resultJson.teacherDoubleName = ''
      }
      await this.$https.post('arrange/resultSingleSave', querystring.stringify({
        resultJson: JSON.stringify(resultJson)
      }))
      .then(async res => {
        if (res.data.code === 1) {
          this.tableData.forEach(item => {
            item.courseList = []
          })
          await this.getLessonHour()
          await this.getResultList()
          // await this.lockState()
          // await this.rightMoveToLeft()
          // await this.getDragState()
          this.$nextTick(() => {
            this.subjectList.forEach((items, ind) => {
              if ((items.teacherName === this.subjectActive.teacherName) && (items.teacherId === this.subjectActive.teacherId)) {
                this.subjectSwitch(items, ind)
              }
            })
          })
        } else {
          this.getGrade()
          this.activeIndex = 0
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 点击课程，判断能否拖动
    getDragState () {
      // this.rightMoveToLeft()
      this.tableData = (this.tableData || []).map(item => ({
        ...item,
        courseList: item.courseList.map(items => ({
          ...items,
          canMod: true
        }))
      }))
      this.tableData.forEach((item, i) => {
        item.courseList.forEach((items, index) => {
          if (items.classNoarrangeReasonContent) {
            this.$set(this.tableData[i].courseList[index], 'canMod', false)
            this.tableData[i].courseList[index].canMod = false
          }
        })
      })
      this.rightTable.forEach((item, i) => {
        item.courseList.forEach((items, index) => {
          if (items.teacherName) {
            this.$set(this.tableData[i].courseList[index], 'canMod', false)
            this.tableData[i].courseList[index].canMod = false
          }
          if (items.teacherForbidden === 1) {
            this.$set(this.tableData[i].courseList[index], 'canMod', true)
            this.tableData[i].courseList[index].canMod = true
          }
        })
      })
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
  },
  watch: {
    semesterId () {
      this.getGrade()
      this.activeIndex = 0
    },
    section () {
      this.getGrade()
      this.activeIndex = 0
    }
  },
  mounted () {
    // document.querySelectorAll('.table').forEach(item => {
    document.oncontextmenu = function (e) {
      return false
    }
    // })
    document.onclick = (e) => {
      this.rightMenuShowItem.menu = false
      this.$set(this.rightMenuShowItem, 'menu', false)
    }
  }
}
</script>

<style lang="scss">

  #brainpower {
    $border: #E0E0E0;
    $color: #2BCEA7;
    padding: 10px 0;
    // border-top: 1px solid $border;
    height: calc(100vh - 80px);
    overflow: auto;
    .header {
      // height: 120px;
      width: calc(100% - 16px);
      margin-left: 6px;
      border: 1px solid $border;
      // box-shadow: 0 0 8px #ccc;
      padding: 10px 10px 10px;
      box-sizing: border-box;
      
      .nav {
        display: flex;
        li {
          width: 110px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          // padding-left: 15px;
          color: #A6ADB6;
          border: 1px solid #A6ADB6;
          border-radius: 4px;
          margin-right: 20px;
          cursor: pointer;
          &:nth-child(1) {
            &:hover {
              color: #fff;
              border-color: #55CE6F;
              background: #55CE6F;
            }
          }
          &:nth-child(2) {
            &:hover{
              color: #fff;
              border-color: #F95F5A;
              background: #F95F5A;
              span {
                color: #fff !important;
              }
            }
          }
          &:nth-child(3) {
            &:hover{
              color: #fff;
              border-color: #F6A812;
              background: #F6A812;
              span {
                color: #fff !important;
              }
            }
          }
          &:nth-child(4) {
            &:hover {
              color: #fff;
              border-color: #55CE6F;
              background: #55CE6F;
            }
          }
          &:nth-child(5) {
            &:hover {
              color: #fff;
              border-color: #12B4F0;
              background: #12B4F0;
            }
          }
          &:active {
            opacity: 0.8;
          }
        }
        .arrow {
          border: 0;
          width: 25px;
          background: url(../../assets/images/up.png) no-repeat 5px 4px;
          &:hover {
            background-image: url(../../assets/images/up-selected.png);
          }
        }
        .downArrow{
          border: 0;
          width: 25px;
          background: url(../../assets/images/down.png) no-repeat 5px 4px;
          &:hover {
            background-image: url(../../assets/images/down-selected.png);
          }
        }
      }
      .grade {
        display: flex;
        margin: 5px 0 0;
        li {
          padding: 5px 20px;
          font-family: PingFangSC-Regular;
          position: relative;

          &:first-child {
            font-weight: bold;
          }
          &.active {
            color: $color;
          }
          &:not(.li) {
            cursor: pointer;
          }
          &.lock {
            &::after {
              position: absolute;
              right: 0;
              top: 0;
              content: '';
              width: 20px;
              height: 20px;
              background: url(../../assets/images/lock.png) no-repeat center;
            }
          }
        }
      }
      .lock-list {
        display: block;
        position: relative;
        &:hover, &:active {
          // border-radius: 20px 20px 0 0;
          transition: all 0.6s;
          ul {
            height: 200px;
          }
        }
        ul {
          height: 0;
          overflow: hidden;
          position: absolute;
          background: #fff;
          box-shadow: 0 0 5px $border;
          border-radius: 0 0 10px 10px;
          transition: all 0.6s;
          z-index: 5;
          li {
            color: #333;
            margin: 0;
            border-radius: 0;
            &:hover {
              background: #F6B244;
              color: #fff;
            }
          }
        }

        &.clear {
          &:hover, &:active {
            ul {
              height: 120px;
            }
          }
          ul {
            li:hover {
              background: #44AAF6;
            }
          }
        }
        .el-dropdown {
          color: #A6ADB6 !important;
        }
      }
    }
    .subject-list {
      line-height: 70px;
      // overflow: auto;
      // margin-top: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      span {
        display: inline-block;
        min-width: 116px;
        min-height: 36px;
        line-height: 20px;
        border: 1px solid $color;
        margin-right: 13px;
        padding-left: 9px;
        margin-bottom: 20px;
        cursor: pointer;
        border-radius: 6px;
        color: $color;
        position: relative;
        vertical-align: middle;
        i {
          position: absolute;
          right: 8px;
          bottom: 10px;
        }
        &.active {
          background: #48D095;
          color: #fff;
          box-shadow: 0 0 5px #48D095;
        }
      }
      &.td {
        padding: 0;
        span {
          margin: 0;
        }
      }
    }

    .table-subject-list {
      line-height: 70px;
      // overflow: auto;

      padding-top: 5px;
      padding-bottom: 5px;
      span {
        display: inline-block;
        min-width: 106px;
        // min-height: px;
        line-height: 20px;
        border: 1px solid $color;
        text-align: center;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;
        border-radius: 6px;
        color: $color;
        &.active {
          background: #48D095;
          color: #fff;
          box-shadow: 0 0 5px #48D095;
        }
      }
      &.td {
        padding: 0;
        span {
          margin: 0;
        }
      }
    }

    .table-groups {
      width: 100%;
      // height: calc(100% - 270px);
      overflow: auto;
    }
    .table-group {
      display: flex;
      overflow: hidden;
      width: 1510px;
      // border-bottom: 1px solid #ccc;
      .table {
        flex-grow: 1;
        // height: 61px;
        table {
          width: 100%;
          td {
            height: 58px;
            line-height: 58px;
            text-align: center;
            border: 1px solid $border;
            &.tds {
              position: relative;
              span::after {
                position: absolute;
                right: 0;
                top: 0;
                content: '';
                width: 20px;
                height: 20px;
                background: url(../../assets/images/lock.png) no-repeat center;
              }
            }
            &.active {
              background: #E2FBF3;
            }
          }
          tr {
            &:first-child {
              background: #2BCEA7;
              color: #fff;
            }
          }
        }
        display: flex;
        .table-tr {
          flex-grow: 1;
          text-align: center;
          // line-height: 57px;
          & > * {
            border: 1px solid #ccc;
            &.table-course {
              height: 35px;
              // overflow: auto;
              border-top: none;
            }
          }
          .table-header {
            width: 144px;
            display: block;
            color: #fff;
            height: 30px;
            line-height: 30px;
            background: #2BCEA7;
          }
          .table-course {
            width: 144px;
            position: relative;
            padding: 0 !important;
            border-bottom: 1px solid #ccc;
            height: 51px;
            // line-height: 30px;
            // overflow: hidden;
            &::last-child {
              border-bottom: none;
            }
            span {
              margin: 0;
            }
            &.subject-list {
              span:nth-child(2) {
               border: none; 
              }
            }
            ul {
              position: absolute;
              right: -72px;
              top: 24px;
              width: 80px;
              line-height: 40px;
              background: #000;
              cursor: pointer;
              z-index: 1000;
              color: #fff;
              li {
                // border: 1px solid #999;
                &:hover {
                  color: #E49708;
                }
              }
              &::before{
                content: "";
                display: block;
                position: absolute;
                left: -10px;
                border: 10px solid transparent;
                border-top: 10px solid #000;
              }
            }
            &.lock::after {
              position: absolute;
              right: 0;
              top: 0;
              content: '';
              width: 20px;
              height: 20px;
              background: url(../../assets/images/lock.png) no-repeat center;
            }
            .tanhao-red {
              position: absolute;
              top: 19px;
              right: 3px;
              width: 14px;
              height: 14px;
            }
            &.right {
              line-height: 18px;

              &.mod-active {
                background: #2BCEA7;
                color: #fff;
              }
              ul {
                color: #999;
              }
            }
            &.active span {
              background: $color;
              color: #fff;
            }
            &.can-mod {
              background: #E2FBF3 !important;
            }

            &.teacher:after {
              content: '!';
              position: absolute;
              color: red;
              top: 4px;
              right: 2px;
            }
            
          }
          .classroom {
            // line-height: 30px;
            .classroom {
              display: inline-block;
              min-width: 106px;
              min-height: 36px;
              line-height: 20px;
              border: 1px solid $color !important;
              text-align: center;
              cursor: pointer;
              border-radius: 6px;
              color: $color;
              &.active {
                background: #48D095;
                color: #fff;
                box-shadow: 0 0 5px #48D095;
              }
            }
          }
        }
        &:nth-child(2) {
          .table-header, .table-course {
            width: 104px;
          }
        }
      }
    }
    .brain-dialog {
      .el-dialog {
        width: 590px;
      }
      .input {
        .el-input {
          width: 350px;
        }
      }
      .el-radio {
        display: block;
        margin-left: 15px;
        line-height: 30px;
      }
    }
    .button-group {
      margin: 20px 0 0;
      text-align: right;
      button:last-child {
        border-color: $color;
        color: $color;
        &:active {
          opacity: 0.6;
        }
      }
    }
    .no-backList {
      line-height: 40px;
      color: #ccc;
      text-align: center;
    }
  }
  .el-dropdown-menu {
    // left: 310px !important;
    transform: translateX(10px);
    .el-dropdown-menu__item {
      &:hover {
        background: rgb(246, 178, 68);
        color: #fff;
      }
    }

    &.lock {
      transform: translateX(24px);
    }
  }
</style>
