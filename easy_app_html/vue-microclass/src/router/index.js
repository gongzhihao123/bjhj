import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import HelloWorld from '@/components/HelloWorld'

// 懒加载
const index = resolve => require(['./../views/index.vue'], resolve)
const noFind = resolve => require(['./../views/noFind.vue'], resolve)

// 微课广场
const square = r => require.ensure([], () => r(require('../views/square/square.vue')), 'group1')
const course = r => require.ensure([], () => r(require('../views/square/course.vue')), 'group1')

// 我的微课
const my = r => require.ensure([], () => r(require('../views/my/my.vue')), 'group2')

// 微课管理
const manage = r => require.ensure([], () => r(require('../views/manage/manageCourse.vue')), 'group3')
const check = r => require.ensure([], () => r(require('../views/manage/checkCourse.vue')), 'group3')

// 功能设置
const set = r => require.ensure([], () => r(require('../views/set/set.vue')), 'group4')

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: index,
    name: '全局页面',
    redirect: '/square',
    children: [
      {
        path: '/square',
        component: square,
        name: '微课广场'
      },
      {
        path: '/course',
        component: course,
        name: '微课查看'
      },
      {
        path: '/my',
        component: my,
        name: '我的微课'
      },
      {
        path: '/manage',
        component: manage,
        name: '微课管理'
      },
      {
        path: '/check',
        component: check,
        name: '微课审批'
      },
      {
        path: '/set',
        component: set,
        name: '功能设置'
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
  NProgress.start()
  next()
})

router.afterEach(transition => {
  NProgress.done()
})

export default router
