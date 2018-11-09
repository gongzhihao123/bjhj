import Vue from 'vue'
import Router from 'vue-router'
// import NProgress from 'nprogress'  // 页面顶部进度条
// import 'nprogress/nprogress.css'
// import index from '@/views/index'
// 懒加载
const index = resolve => require(['@/views/index.vue'], resolve)
const noFind = resolve => require(['../views/noFind.vue'], resolve)

// 懒加载分组

// 教案广场
const square = r => require.ensure([], () => r(require('../views/square/square.vue')), 'group1')
const squareInfo = r => require.ensure([], () => r(require('../views/square/components/squareInfo.vue')), 'group1')
const squareReuse = r => require.ensure([], () => r(require('../views/square/components/squareReuse.vue')), 'group1')
const squareModel = r => require.ensure([], () => r(require('../views/square/components/squareModel.vue')), 'group1')

// 我的
const my = r => require.ensure([], () => r(require('../views/my/my.vue')), 'group2')
const lesson = r => require.ensure([], () => r(require('../views/my/components/lesson.vue')), 'group2')
const collaborate = r => require.ensure([], () => r(require('../views/my/components/collaborate.vue')), 'group2')
const collect = r => require.ensure([], () => r(require('../views/my/components/collect.vue')), 'group2')
const comment = r => require.ensure([], () => r(require('../views/my/components/comment.vue')), 'group2')
const addStudy = r => require.ensure([], () => r(require('../views/my/components/addstudy.vue')), 'group2')
const addSynergy = r => require.ensure([], () => r(require('../views/my/components/addsynergy.vue')), 'group2')
const synergyMark = r => require.ensure([], () => r(require('../views/my/components/synergyMark.vue')), 'group2')
const collectView = r => require.ensure([], () => r(require('../views/my/components/collectView.vue')), 'group2')
const addLessonPlan = r => require.ensure([], () => r(require('../views/my/components/addLessonPlan.vue')), 'group2')
const referenceTemplate = r => require.ensure([], () => r(require('../views/my/components/referenceTemplate.vue')), 'group2')
const lessonView = r => require.ensure([], () => r(require('../views/my/components/lessonView.vue')), 'group2')
const collaborateView = r => require.ensure([], () => r(require('../views/my/components/collaborateView.vue')), 'group2')
const reuse = r => require.ensure([], () => r(require('../views/my/components/reuse.vue')), 'group2')
const collaborateOver = r => require.ensure([], () => r(require('../views/my/components/collaborateOver.vue')), 'group2')

// 备课检查
const check = r => require.ensure([], () => r(require('../views/check/check.vue')), 'group3')
const evaluationResult = r => require.ensure([], () => r(require('../views/check/components/evaluationResult.vue')), 'group3')
const lessonPlanDetails = r => require.ensure([], () => r(require('../views/check/components/lessonPlanDetails.vue')), 'group3')

// 备课管理

const set = r => require.ensure([], () => r(require('../views/set/set.vue')), 'group4')
const newmodel = r => require.ensure([], () => r(require('../views/set/components/newmodel.vue')), 'group4')
const lessonmodel = r => require.ensure([], () => r(require('../views/set/components/lessonmodel.vue')), 'group4')
const lcheckset = r => require.ensure([], () => r(require('../views/set/components/lcheckset.vue')), 'group4')
const lessonset = r => require.ensure([], () => r(require('../views/set/components/lessonset.vue')), 'group4')
const editmodel = r => require.ensure([], () => r(require('../views/set/components/editmodel.vue')), 'group4')
const coursetime = r => require.ensure([], () => r(require('../views/set/components/coursetime.vue')), 'group4')
const metericalview = r => require.ensure([], () => r(require('../views/set/components/metericalview.vue')), 'group4')

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: index,
    name: '教案广场',
    meta: {
      num: 0
    },
    children: [
      {
        path: '/square',
        component: square,
        meta: {
          num: 0
        },
        name: '全部教案'
      },
      {
        path: '/squareInfo',
        component: squareInfo,
        meta: {
          num: 0
        },
        name: '教案详情'
      },
      {
        path: '/squareReuse',
        component: squareReuse,
        meta: {
          num: 0
        },
        name: '新增教案'
      }, {
        path: '/squareModel',
        component: squareModel,
        meta: {
          num: 0
        },
        name: '教案模板'
      }
    ]
  },
  {
    path: '/',
    component: index,
    name: 'index',
    meta: {
      num: 1
    },
    children: [
      {
        path: '/my',
        component: my,
        name: '我的',
        redirect: '/my/lesson',
        children: [
          {path: '/my/lesson', component: lesson, name: '我的备课', meta: {num: 1, manager: 0}},
          {path: '/my/collaborate', component: collaborate, name: '我的协同', meta: {num: 1, manager: 1}},
          {path: '/my/collect', component: collect, name: '我的收藏', meta: {num: 1, manager: 2}},
          {path: '/my/comment', component: comment, name: '我收到的评论', meta: {num: 1, manager: 3}}
        ]
      },
      {
        path: '/my/addStudy',
        component: addStudy,
        meta: {num: 1}
      },
      {
        path: '/my/addSynergy',
        component: addSynergy,
        meta: {num: 1}
      },
      {
        path: '/my/synergyMark',
        component: synergyMark,
        meta: {num: 1}
      },
      {
        path: '/my/collectView',
        component: collectView,
        meta: {num: 1}
      },
      {
        path: '/my/addLessonPlan',
        component: addLessonPlan,
        meta: {num: 1}
      },
      {
        path: '/my/referenceTemplate',
        component: referenceTemplate,
        meta: {num: 1}
      },
      {
        path: '/my/lessonView',
        component: lessonView,
        meta: {num: 1}
      },
      {
        path: '/my/collaborateView',
        component: collaborateView,
        meta: {num: 1}
      },
      {
        path: '/my/reuse',
        component: reuse,
        meta: {num: 1}
      },
      {
        path: '/my/collaborateOver',
        component: collaborateOver,
        meta: {num: 1}
      }
    ]
  },
  {
    path: '/',
    component: index,
    name: 'index',
    meta: {
      num: 2
    },
    children: [
      {
        path: '/check',
        component: check,
        meta: {num: 2}
      },
      {
        path: '/check/evaluationResult',
        component: evaluationResult,
        meta: {num: 2}
      },
      {
        path: '/check/lessonPlanDetails',
        component: lessonPlanDetails,
        meta: {num: 2}
      }
    ]
  },
  {
    path: '/',
    component: index,
    name: 'index',
    meta: {
      num: 3
    },
    children: [
      {
        path: '/set',
        component: set,
        name: '备课管理',
        redirect: '/set/lessonmodel',
        children: [
          {path: '/set/lessonmodel', component: lessonmodel, name: '备课模板设置', meta: {num: 3, manager: 0}},
          {path: '/set/lessonset', component: lessonset, name: '备课设置', meta: {num: 3, manager: 1}},
          {path: '/set/lcheckset', component: lcheckset, name: '备课检查设置', meta: {num: 3, manager: 2}}
        ]
      },
      {
        path: '/newmodel',
        component: newmodel,
        name: '新增模板',
        meta: {num: 3}
      },
      {
        path: '/editmodel',
        component: editmodel,
        name: '编辑模板',
        meta: {num: 3}
      },
      {
        path: '/coursetime',
        component: coursetime,
        name: '备课目录查看-按课时',
        meta: {num: 3}
      },
      {
        path: '/metericalview',
        component: metericalview,
        name: '教材及编目设置-查看',
        meta: {num: 3}
      }
    ]
  },
  {
    path: '*',
    component: noFind
  }
]

const router = new Router({
  mode: 'hash',
  base: __dirname,
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  // NProgress.start()
  next()
})

router.afterEach(transition => {
  // NProgress.done()
})

export default router
