import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'  // 页面顶部进度条
import 'nprogress/nprogress.css'

const noFind = resolve => require(['../../src/pages/noFind.vue'], resolve)
const login = resolve => require(['../../src/pages/login.vue'], resolve)
const loginMethod = resolve => require(['../../src/pages/loginMethod.vue'], resolve)

// 前台
const front = r => require.ensure([], () => r(require('../pages/front/index.vue')), 'group1')
const basicIndex = r => require.ensure([], () => r(require('../pages/front/basic/index.vue')), 'group1')
// 前台-课程申报
const homePage = r => require.ensure([], () => r(require('../pages/front/basic/homePage/index.vue')), 'group1')
const governmentDocument = r => require.ensure([], () => r(require('../pages/front/basic/governmentDocument/index.vue')), 'group1')
// 前台-课题库
const subjectDeclaration = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/subjectDeclaration.vue')), 'group1')
const subjectList = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/subjectList.vue')), 'group1')
const guideDetail = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/guideDetail.vue')), 'group1')
const declarationStep = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/index.vue')), 'group1')
// 前台-课题库-申报步骤
const one = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/1.vue')), 'group1')
const two = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/2.vue')), 'group1')
const three = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/3.vue')), 'group1')
const four = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/4.vue')), 'group1')
const five = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/5.vue')), 'group1')
const six = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/6.vue')), 'group1')
const seven = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/7.vue')), 'group1')
const eight = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/8.vue')), 'group1')
const nine = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/9.vue')), 'group1')
const ten = r => require.ensure([], () => r(require('../pages/front/basic/subjectLibrary/declarationStep/10.vue')), 'group1')

// 前台-政策详情
const fileInfo = r => require.ensure([], () => r(require('../pages/front/basic/governmentDocument/fileInfo.vue')), 'group1')
// 前台-课题管理
const myDeclaration = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/myDeclaration.vue')), 'group1')
const mySubject = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/mySubject.vue')), 'group1')
const subjectChange = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/subjectChange.vue')), 'group1')
const expertsLibrary = r => require.ensure([], () => r(require('../pages/front/basic/expertsLibrary/index.vue')), 'group1')
const communication = r => require.ensure([], () => r(require('../pages/front/basic/communication/index.vue')), 'group1')
// 前台-课题详情
const subjectDetailIndex = r => require.ensure([], () => r(require('../pages/front/subjectDetail/index.vue')), 'group1')
const subjectDetailIntro = r => require.ensure([], () => r(require('../pages/front/subjectDetail/components/intro.vue')), 'group1')
const subjectDetailState = r => require.ensure([], () => r(require('../pages/front/subjectDetail/components/state.vue')), 'group1')
const subjectDetailMeterical = r => require.ensure([], () => r(require('../pages/front/subjectDetail/components/meterical.vue')), 'group1')
const subjectDetailDaily = r => require.ensure([], () => r(require('../pages/front/subjectDetail/components/daily.vue')), 'group1')
const subjectDetailActive = r => require.ensure([], () => r(require('../pages/front/subjectDetail/components/active.vue')), 'group1')
const subjectDetailContent = r => require.ensure([], () => r(require('../pages/front/subjectDetail/components/detail.vue')), 'group1')
// 前台-课题流程
const changeDetails = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/subjectFlow/changeDetails.vue')), 'group1')
const addPlan = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/subjectFlow/flow/addPlan.vue')), 'group1')
const peopleManage = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/subjectFlow/flow/peopleManage.vue')), 'group1')
const projectData = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/subjectFlow/flow/projectData.vue')), 'group1')
const studyActive = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/subjectFlow/flow/studyActive.vue')), 'group1')
const studyLog = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/subjectFlow/flow/studyLog.vue')), 'group1')
const subminPlan = r => require.ensure([], () => r(require('../pages/front/basic/subjectManager/subjectFlow/flow/submitPlan.vue')), 'group1')

// 后台
const back = r => require.ensure([], () => r(require('../pages/back/index.vue')), 'group2')
// 首页
const backHomePage = r => require.ensure([], () => r(require('../pages/back/home/index.vue')), 'group2')
// 账号管理
const backID = r => require.ensure([], () => r(require('../pages/back/ID/index.vue')), 'group2')
// 课题管理
const backPublicGuide = r => require.ensure([], () => r(require('../pages/back/subjectManager/publicGuide.vue')), 'group2')
const backSubjectType = r => require.ensure([], () => r(require('../pages/back/subjectManager/subjectType.vue')), 'group2')
const backExpertsManager = r => require.ensure([], () => r(require('../pages/back/subjectManager/expertsManager.vue')), 'group2')
const backAssignGroup = r => require.ensure([], () => r(require('../pages/back/subjectManager/assignGroup.vue')), 'group2')
const backSubjectList = r => require.ensure([], () => r(require('../pages/back/subjectManager/subjectList.vue')), 'group2')
// 政策文件管理
const backPolicyDocument = r => require.ensure([], () => r(require('../pages/back/policyDocument/index.vue')), 'group2')
const backProjectApproval = r => require.ensure([], () => r(require('../pages/back/subjectReview/projectApproval.vue')), 'group2')
const backMySubject = r => require.ensure([], () => r(require('../pages/back/subjectReview/mySubject.vue')), 'group2')
const backSubjectChange = r => require.ensure([], () => r(require('../pages/back/subjectReview/subjectChange.vue')), 'group2')
const backProjectApprovalScore = r => require.ensure([], () => r(require('../pages/back/subjectReview/projectApprovalScore.vue')), 'group2')
const backProjectApprovalSigned = r => require.ensure([], () => r(require('../pages/back/subjectReview/projectApprovalSigned.vue')), 'group2')
const backMySubjectScore = r => require.ensure([], () => r(require('../pages/back/subjectReview/mySubjectScore.vue')), 'group2')
const backMySubjectSigned = r => require.ensure([], () => r(require('../pages/back/subjectReview/mySubjectSigned.vue')), 'group2')
const backMySubjectOver = r => require.ensure([], () => r(require('../pages/back/subjectReview/mySubjectOver.vue')), 'group2')
const backSubjectChangeDetail = r => require.ensure([], () => r(require('../pages/back/subjectReview/subjectChangeDetail.vue')), 'group2')

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: front,
    name: '前台',
    redirect: '/basic/index',
    num: 0,
    children: [
      {
        path: '/basic/index',
        component: basicIndex,
        redirect: '/homePage/index',
        children: [
          {
            path: '/homePage/index',
            meta: {num: 0},
            component: homePage
          },
          {
            path: '/governmentDocument/index',
            meta: {num: 1},
            component: governmentDocument
          },
          {
            path: '/front/fileInfo',
            meta: {num: 1},
            component: fileInfo
          },
          {
            path: '/subjectLibrary/subjectDeclaration',
            meta: {num: 2},
            component: subjectDeclaration
          },
          {
            path: '/subjectLibrary/subjectList',
            meta: {num: 2},
            component: subjectList
          },
          {
            path: '/subjectLibrary/guideDetail',
            meta: {num: 2},
            component: guideDetail
          },
          {
            path: '/declarationStep/index',
            meta: {num: 2},
            component: declarationStep,
            redirect: '/declarationStep/1',
            children: [
              {
                path: '/declarationStep/1',
                meta: {num: 2, stepNum: 0},
                component: one
              },
              {
                path: '/declarationStep/2',
                meta: {num: 2, stepNum: 1},
                component: two
              },
              {
                path: '/declarationStep/3',
                meta: {num: 2, stepNum: 2},
                component: three
              },
              {
                path: '/declarationStep/4',
                meta: {num: 2, stepNum: 3},
                component: four
              },
              {
                path: '/declarationStep/5',
                meta: {num: 2, stepNum: 4},
                component: five
              },
              {
                path: '/declarationStep/6',
                meta: {num: 2, stepNum: 5},
                component: six
              },
              {
                path: '/declarationStep/7',
                meta: {num: 2, stepNum: 6},
                component: seven
              },
              {
                path: '/declarationStep/8',
                meta: {num: 2, stepNum: 7},
                component: eight
              },
              {
                path: '/declarationStep/9',
                meta: {num: 2, stepNum: 8},
                component: nine
              },
              {
                path: '/declarationStep/10',
                meta: {num: 2, stepNum: 9},
                component: ten
              }
            ]
          },
          {
            path: '/subjectManager/myDeclaration',
            meta: {num: 3},
            component: myDeclaration
          },
          {
            path: '/subjectManager/changeDetails',
            meta: {num: 3},
            component: changeDetails,
            redirect: '/subjectManager/addPlan',
            children: [
              {
                path: '/subjectManager/addPlan',
                meta: {num: 3},
                component: addPlan
              },
              {
                path: '/subjectManager/peopleManage',
                meta: {num: 3},
                component: peopleManage
              },
              {
                path: '/subjectManager/projectData',
                meta: {num: 3},
                component: projectData
              },
              {
                path: '/subjectManager/studyActive',
                meta: {num: 3},
                component: studyActive
              },
              {
                path: '/subjectManager/studyLog',
                meta: {num: 3},
                component: studyLog
              },
              {
                path: '/subjectManager/subminPlan',
                meta: {num: 3},
                component: subminPlan
              }
            ]
          },
          {
            path: '/subjectManager/mySubject',
            meta: {num: 3},
            component: mySubject
          },
          {
            path: '/subjectManager/subjectChange',
            meta: {num: 3},
            component: subjectChange
          },
          {
            path: '/expertsLibrary/index',
            meta: {num: 4},
            component: expertsLibrary
          },
          {
            path: '/communication/index',
            meta: {num: 5},
            component: communication
          }
        ]
      },
      {
        path: '/subjectDetail/index',
        component: subjectDetailIndex,
        redirect: '/subjectDetail/intro',
        children: [
          {
            path: '/subjectDetail/intro',
            component: subjectDetailIntro,
            meta: {num: 0}
          },
          {
            path: '/subjectDetail/state',
            component: subjectDetailState,
            meta: {num: 1}
          },
          {
            path: '/subjectDetail/meterical',
            component: subjectDetailMeterical,
            meta: {num: 2}
          },
          {
            path: '/subjectDetail/daily',
            component: subjectDetailDaily,
            meta: {num: 3}
          },
          {
            path: '/subjectDetail/active',
            component: subjectDetailActive,
            meta: {num: 4}
          },
          {
            path: '/subjectDetail/detail',
            component: subjectDetailContent,
            meta: {num: 4}
          }
        ]
      }
    ]
  },
  {
    path: '/back/index',
    component: back,
    name: '后台',
    redirect: '/backHomePage/index',
    children: [
      {
        path: '/backHomePage/index',
        component: backHomePage
      },
      {
        path: '/backID/index',
        component: backID
      },
      {
        path: '/subjectGroup/backPublicGuide',
        component: backPublicGuide
      },
      {
        path: '/subjectGroup/backSubjectType',
        component: backSubjectType
      },
      {
        path: '/subjectGroup/backExpertsManager',
        component: backExpertsManager
      },
      {
        path: '/subjectGroup/backAssignGroup',
        component: backAssignGroup
      },
      {
        path: '/subjectGroup/backSubjectList',
        component: backSubjectList
      },
      {
        path: '/backPolicyDocument/index',
        component: backPolicyDocument
      },
      {
        path: '/subjectReview/backProjectApproval',
        component: backProjectApproval
      },
      {
        path: '/subjectReview/backMySubject',
        component: backMySubject
      },
      {
        path: '/subjectReview/backSubjectChange',
        component: backSubjectChange
      },
      {
        path: '/subjectReview/backProjectApprovalScore',
        component: backProjectApprovalScore
      },
      {
        path: '/subjectReview/backProjectApprovalSigned',
        component: backProjectApprovalSigned
      },
      {
        path: '/subjectReview/backMySubjectScore',
        component: backMySubjectScore
      },
      {
        path: '/subjectReview/backMySubjectSigned',
        component: backMySubjectSigned
      },
      {
        path: '/subjectReview/backMySubjectOver',
        component: backMySubjectOver
      },
      {
        path: '/subjectReview/backSubjectChangeDetail',
        component: backSubjectChangeDetail
      }
    ]
  },
  {
    path: '/login',
    component: login,
    meta: { requiresAuth: false } // 是否验证已经登陆
  },
  {
    path: '/loginMethod',
    component: loginMethod,
    meta: { requiresAuth: false } // 是否验证已经登陆
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

router.beforeEach((to, from, next) => {
  NProgress.start()
  next() // 确保一定要调用 next()
})

router.afterEach(transition => {
  NProgress.done()
})

export default router
