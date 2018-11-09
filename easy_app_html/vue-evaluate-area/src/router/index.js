import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

// 懒加载
const home = resolve => require(['@/views/home.vue'], resolve)
const noFind = resolve => require(['../views/noFind.vue'], resolve)
const subjectActive = resolve => require(['../views/assessmentManager/components/subjectActive.vue'], resolve)
// 懒加载分组

// 测评管理
const assessmentManager = r => require.ensure([], () => r(require('../views/assessmentManager/index.vue')), 'group1')
const createAssessment = r => require.ensure([], () => r(require('../views/assessmentManager/components/createAssessment.vue')), 'group1')
const basicInformation = r => require.ensure([], () => r(require('../views/assessmentManager/components/basicInformation.vue')), 'group1')
const assessmentWay = r => require.ensure([], () => r(require('../views/assessmentManager/components/assessmentWay.vue')), 'group1')
const otherParameterSetting = r => require.ensure([], () => r(require('../views/assessmentManager/components/otherParameterSetting.vue')), 'group1')
const editAssessment = r => require.ensure([], () => r(require('../views/assessmentManager/components/editAssessment.vue')), 'group1')
const lookResult = r => require.ensure([], () => r(require('../views/assessmentManager/components/lookResult.vue')), 'group1')
const assessmentDetails = r => require.ensure([], () => r(require('../views/assessmentManager/components/assessmentDetails.vue')), 'group1')
const assessmentState = r => require.ensure([], () => r(require('../views/assessmentManager/components/assessmentState.vue')), 'group1')
const lookDetails = r => require.ensure([], () => r(require('../views/assessmentManager/components/lookDetails.vue')), 'group1')

// 测评表管理
const assessmentTableManager = r => require.ensure([], () => r(require('../views/assessmentTableManager/index.vue')), 'group2')
const addTable = r => require.ensure([], () => r(require('../views/assessmentTableManager/components/addTable.vue')), 'group2')

// 设置
const set = r => require.ensure([], () => r(require('../views/set/index.vue')), 'group3')

// 测评审核
const assessmentCheck = r => require.ensure([], () => r(require('../views/assessmentCheck/index.vue')), 'group4')
const teacherCheck = r => require.ensure([], () => r(require('../views/assessmentCheck/components/teacherCheck.vue')), 'group4')
const otherCheck = r => require.ensure([], () => r(require('../views/assessmentCheck/components/otherCheck.vue')), 'group4')

// 我要测评
const myComment = r => require.ensure([], () => r(require('../views/myComment/index.vue')), 'group5')
const otherComment = r => require.ensure([], () => r(require('../views/myComment/components/otherComment.vue')), 'group5')
const CommentName = r => require.ensure([], () => r(require('../views/myComment/components/CommentName.vue')), 'group5')
const CommentTeacher = r => require.ensure([], () => r(require('../views/myComment/components/CommentTeacher.vue')), 'group5')
const CheckInfo = r => require.ensure([], () => r(require('../views/myComment/components/CheckInfo.vue')), 'group5')
const groupInfo = r => require.ensure([], () => r(require('../views/myComment/components/groupInfo.vue')), 'group5')
const groupComment = r => require.ensure([], () => r(require('../views/myComment/components/groupComment.vue')), 'group5')

// 我的测评
const myAssessment = r => require.ensure([], () => r(require('../views/myAssessment/index.vue')), 'group6')
const checkOther = r => require.ensure([], () => r(require('../views/myAssessment/components/checkOther.vue')), 'group6')
const checkAll = r => require.ensure([], () => r(require('../views/myAssessment/components/checkAll.vue')), 'group6')
// 本部门结果
const deptResult = r => require.ensure([], () => r(require('../views/deptResult/index.vue')), 'group7')
const deptResultInfo = r => require.ensure([], () => r(require('../views/deptResult/components/deptResultInfo.vue')), 'group7')

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: home,
    name: '我要测评',
    redirect: '/myComment/index',
    num: 0,
    children: [
      {
        path: '/myComment/index',
        component: myComment,
        meta: {num: 0}
      },
      {
        path: '/myComment/otherComment',
        component: otherComment,
        meta: {num: 0}
      },
      // 任课教师
      {
        path: '/myComment/CommentName',
        component: CommentName,
        meta: {num: 0}
      },
      // 班主任
      {
        path: '/myComment/CommentTeacher',
        component: CommentTeacher,
        meta: {num: 0}
      },
      // 评价
      {
        path: '/myComment/CheckInfo',
        component: CheckInfo,
        meta: {num: 0}
      },
      // 按组
      {
        path: '/myComment/groupInfo',
        component: groupInfo,
        meta: {num: 0}
      },
      // 按组测评
      {
        path: '/myComment/groupComment',
        component: groupComment,
        meta: {num: 0}
      }
    ]
  },
  {
    path: '/',
    component: home,
    name: '我的测评',
    num: 1,
    children: [
      {
        path: '/myAssessment/index',
        component: myAssessment,
        meta: {num: 1}
      },
      {
        path: '/myAssessment/checkOther',
        component: checkOther,
        meta: {num: 1}
      },
      {
        path: '/myAssessment/checkAll',
        component: checkAll,
        meta: {num: 1}
      }
    ]
  },
  {
    path: '/',
    component: home,
    name: '测评管理',
    num: 2,
    children: [
      {
        path: '/assessmentManager/index',
        component: assessmentManager,
        meta: {num: 2}
      }
    ]
  },
  {
    path: '/',
    component: home,
    name: '测评表管理',
    num: 3,
    children: [
      {
        path: '/assessmentTableManager/index',
        component: assessmentTableManager,
        meta: {num: 3}
      },
      {
        path: '/assessmentTableManager/addTable',
        component: addTable,
        meta: {num: 3}
      }
    ]
  },
  {
    path: '/',
    component: home,
    name: '设置',
    num: 4,
    children: [
      {
        path: '/set/index',
        component: set,
        meta: {num: 4}
      }
    ]
  },
  {
    path: '/',
    component: home,
    name: '测评审核',
    num: 5,
    children: [
      {
        path: '/assessmentCheck/index',
        component: assessmentCheck,
        meta: {num: 5}
      },
      {
        // 任课教师和班主任测评
        path: '/assessmentCheck/teacherCheck',
        component: teacherCheck,
        meta: {num: 5}
      },
      {
        // 其他教师
        path: '/assessmentCheck/otherCheck',
        component: otherCheck,
        meta: {num: 5}
      }
    ]
  },
  {
    path: '/',
    component: home,
    name: '本部门结果',
    num: 6,
    children: [
      {
        path: '/deptResult/index',
        component: deptResult,
        meta: {num: 6}
      },
      {
        path: '/deptResult/deptResultInfo',
        component: deptResultInfo,
        meta: {num: 6}
      }
    ]
  },
  {
    path: '/assessmentManager/createAssessment',
    component: createAssessment,
    redirect: '/assessmentManager/basicInformation',
    children: [
      {
        path: '/assessmentManager/basicInformation',
        component: basicInformation
      },
      {
        path: '/assessmentManager/assessmentWay',
        component: assessmentWay
      },
      {
        path: '/assessmentManager/otherParameterSetting',
        component: otherParameterSetting
      }
    ]
  },
  {
    path: '/assessmentManager/editAssessment',
    component: editAssessment
  },
  {
    path: '/assessmentManager/lookResult',
    component: lookResult
  },
  {
    path: '/assessmentManager/lookDetails',
    component: lookDetails
  },
  {
    path: '/assessmentManager/assessmentDetails',
    component: assessmentDetails
  },
  {
    path: '/assessmentManager/assessmentState',
    component: assessmentState
  },
  {
    path: '/assessmentManager/subjectActive',
    component: subjectActive
  },
  {
    path: '*',
    component: noFind,
    meta: { requiresAuth: false } // 是否验证已经登陆
  }
]

const router = new Router({
  mode: 'hash',
  base: __dirname,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

export default router
