import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'  // 页面顶部进度条
import 'nprogress/nprogress.css'

// icons
import * as type from '../assets/icons'

const index = () => import(/* webpackChunkName: "index" */ '../pages/index')
const noFind = () => import(/* webpackChunkName: "noFind" */ '../pages/noFind')

// 教务主任
// 选课管理
const dMactivity = () => import(/* webpackChunkName: "dManage" */ '../pages/dManage/activity')
const dMlesson = () => import(/* webpackChunkName: "dManage" */ '../pages/dManage/lesson')
const dMaddActivity = () => import(/* webpackChunkName: "dManage" */ '../pages/dManage/addActivity')
const dMaddlesson = () => import(/* webpackChunkName: "dManage" */ '../pages/dManage/addlesson')
const dMaddlessonDetail = () => import(/* webpackChunkName: "dManage" */ '../pages/dManage/lessonDetails')

// 选课调整
const dAadjust = () => import(/* webpackChunkName: "dAdjust" */ '../pages/dAdjust/adjust')
const dAfailed = () => import(/* webpackChunkName: "dAdjust" */ '../pages/dAdjust/failed')

// 选课状态
const dSstudent = () => import(/* webpackChunkName: "dSituation" */ '../pages/dSituation/student')
const dSlesson = () => import(/* webpackChunkName: "dSituation" */ '../pages/dSituation/lesson')

// 选课结果
const dRresult = () => import(/* webpackChunkName: "dResult" */ '../pages/dResult/result')
const dRrecord = () => import(/* webpackChunkName: "dResult" */ '../pages/dResult/record')

// 基础设置
const dBtemplate = () => import(/* webpackChunkName: "dBase" */ '../pages/dBase/template')

// 学生
// 课程列表
const sLesson = () => import(/* webpackChunkName: "sLesson" */ '../pages/sLesson/index')
const sDetail = () => import(/* webpackChunkName: "sLesson" */ '../pages/sLesson/detail')

// 选课结果
const sResult = () => import(/* webpackChunkName: "sResult" */ '../pages/sResult/index')

// 选课记录
const sRecord = () => import(/* webpackChunkName: "sRecord" */ '../pages/sRecord/index')

// 任课教师
// 开课申请
const tApply = () => import(/* webpackChunkName: "tApply" */ '../pages/tApply/index')
const tAddApplay = () => import(/* webpackChunkName: "tApply" */ '../pages/tApply/addApplay')
const tApplayDetails = () => import(/* webpackChunkName: "tApply" */ '../pages/tApply/applyDetails')

// 学生管理
const tRecruit = () => import(/* webpackChunkName: "tManage" */ '../pages/tManage/recruit')
const tStudent = () => import(/* webpackChunkName: "tManage" */ '../pages/tManage/student')
const tScope = () => import(/* webpackChunkName: "tManage" */ '../pages/tManage/score')

// 班主任
// 选课状况
const htNotjoin = () => import(/* webpackChunkName: "htSituation" */ '../pages/htSituation/notjoin')
const htUnqualified = () => import(/* webpackChunkName: "htSituation" */ '../pages/htSituation/unqualified')
const htStudent = () => import(/* webpackChunkName: "htSituation" */ '../pages/htSituation/student')

// 选课结果
const htResult = () => import(/* webpackChunkName: "htResult" */ '../pages/htResult/result')
const htRecord = () => import(/* webpackChunkName: "htResult" */ '../pages/htResult/record')

Vue.use(Router)

const routes = [
  // 教务主任
  {
    path: '/',
    name: '选课管理',
    component: index,
    icon: type.dManage,
    iconActive: type.dManageA,
    children: [
      { path: '/dManage/activity', name: '选课设置', component: dMactivity, meta: { subInd: 0, requiresAuth: true, id: 1 } },
      { path: '/dManage/lesson', name: '课程管理', component: dMlesson, meta: { subInd: 1, requiresAuth: true, id: 1 } },
      { path: '/dManage/addActivity/:id(\\d+)?', name: '选课设置', component: dMaddActivity, meta: { subInd: 0, requiresAuth: true, id: 1 } },
      { path: '/dManage/dMaddlesson/:state/:id(\\d+)?', name: '课程管理', component: dMaddlesson, meta: { subInd: 1, requiresAuth: true, id: 1 } },
      { path: '/dManage/dMaddlessonDetail/:state/:id(\\d+)', name: '课程管理', component: dMaddlessonDetail, meta: { subInd: 1, requiresAuth: true, id: 1 } }
    ]
  },
  {
    path: '/',
    name: '选课调整',
    component: index,
    icon: type.dAdjust,
    iconActive: type.dAdjustA,
    children: [
      { path: '/dAdjust/adjust', name: '选课调整', component: dAadjust, meta: { subInd: 0, requiresAuth: true, id: 4 } },
      { path: '/dAdjust/failed', name: '落选学生', component: dAfailed, meta: { subInd: 1, requiresAuth: true, id: 4 } }
    ]
  },
  {
    path: '/',
    name: '选课状况',
    component: index,
    icon: type.dSituation,
    iconActive: type.dSituationA,
    children: [
      { path: '/dSituation/student', name: '学生选课状况', component: dSstudent, meta: { subInd: 0, requiresAuth: true, id: 7 } },
      { path: '/dSituation/lesson', name: '课程报名状况', component: dSlesson, meta: { subInd: 1, requiresAuth: true, id: 7 } }
    ]
  },
  {
    path: '/',
    name: '选课结果',
    component: index,
    icon: type.dResult,
    iconActive: type.dResultA,
    children: [
      { path: '/dResult/result', name: '选课结果', component: dRresult, meta: { subInd: 0, requiresAuth: true, id: 10 } },
      { path: '/dResult/record', name: '选课记录', component: dRrecord, meta: { subInd: 1, requiresAuth: true, id: 10 } }
    ]
  },
  {
    path: '/',
    name: '基础设置',
    component: index,
    icon: type.dBase,
    iconActive: type.dBaseA,
    children: [
      { path: '/dBase/template', name: '开课申请单', component: dBtemplate, meta: { subInd: 0, requiresAuth: true, id: 13 } }
    ]
  },
  // 学生
  {
    path: '/',
    name: '课程列表',
    component: index,
    icon: type.sLesson,
    iconActive: type.sLessonA,
    children: [
      { path: '/s/lesson', name: '课程列表', component: sLesson, meta: { subInd: 0, requiresAuth: true, id: 15 } },
      { path: '/s/detail', name: '课程列表', component: sDetail, meta: { subInd: 1, requiresAuth: true, id: 15 } }
    ]
  },
  {
    path: '/',
    name: '选课结果',
    component: index,
    icon: type.sResult,
    iconActive: type.sResultA,
    children: [
      { path: '/s/result', name: '选课结果', component: sResult, meta: { subInd: 0, requiresAuth: true, id: 16 } }
    ]
  },
  {
    path: '/',
    name: '选课记录',
    component: index,
    icon: type.sRecord,
    iconActive: type.sRecordA,
    children: [
      { path: '/s/record', name: '选课记录', component: sRecord, meta: { subInd: 0, requiresAuth: true, id: 17 } }
    ]
  },
  // 任课教师
  {
    path: '/',
    name: '开课申请',
    component: index,
    icon: type.tApply,
    iconActive: type.tApplyA,
    children: [
      { path: '/tApply/apply', name: '开课申请', component: tApply, meta: { subInd: 0, requiresAuth: true, id: 18 } },
      { path: '/tApply/addApply/:state/:id(\\d+)?', name: '开课申请', component: tAddApplay, meta: { subInd: 0, requiresAuth: true, id: 18 } },
      { path: '/tApply/applyDetails/:id(\\d+)', name: '开课申请', component: tApplayDetails, meta: { subInd: 0, requiresAuth: true, id: 18 } }
    ]
  },
  {
    path: '/',
    name: '学生管理',
    component: index,
    icon: type.tManage,
    iconActive: type.tManageA,
    children: [
      { path: '/tManage/recruit', name: '录取学生', component: tRecruit, meta: { subInd: 0, requiresAuth: true, id: 20 } },
      { path: '/tManage/student', name: '学生名单', component: tStudent, meta: { subInd: 1, requiresAuth: true, id: 20 } },
      { path: '/tManage/score', name: '学生成绩', component: tScope, meta: { subInd: 2, requiresAuth: true, id: 20 } }
    ]
  },
  // 班主任
  {
    path: '/',
    name: '选课状况',
    component: index,
    icon: type.htSituation,
    iconActive: type.htSituationA,
    children: [
      { path: '/htSituation/notjoin', name: '不参加选课', component: htNotjoin, meta: { subInd: 0, requiresAuth: true, id: 24 } },
      { path: '/htSituation/unqualified', name: '选课不合格', component: htUnqualified, meta: { subInd: 1, requiresAuth: true, id: 24 } },
      { path: '/htSituation/student', name: '已选课学生', component: htStudent, meta: { subInd: 2, requiresAuth: true, id: 24 } }
    ]
  },
  {
    path: '/',
    name: '选课结果',
    component: index,
    icon: type.htResult,
    iconActive: type.htResultA,
    children: [
      { path: '/htResult/result', name: '选课结果', component: htResult, meta: { subInd: 0, requiresAuth: true, id: 28 } },
      { path: '/htResult/record', name: '选课记录', component: htRecord, meta: { subInd: 1, requiresAuth: true, id: 28 } }
    ]
  },
  {
    path: '*',
    state: false, // 不显示在导航中
    name: 'noFind',
    component: noFind,
    requiresAuth: false
  }
]

const router = new Router({
  mode: 'hash',
  base: __dirname,
  linkActiveClass: 'router-link-active',
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(transition => {
  NProgress.done()
})

export default router
