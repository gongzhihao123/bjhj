import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // 页面顶部进度条
import 'nprogress/nprogress.css'

const noFind = resolve => require(['../../src/pages/noFind.vue'], resolve)
const home = resolve => require(['../../src/pages/home.vue'], resolve)

// 资产管理员
const taskList = resolve => require(['@/pages/task/taskList.vue'], resolve)
const partList = resolve => require(['@/pages/task/partList.vue'], resolve)
const taskDetail = resolve => require(['@/pages/task/taskDetail.vue'], resolve)
const overview = resolve => require(['@/pages/task/overview.vue'], resolve)

// 普通教师
const label = resolve => require(['@/pages/label/index.vue'], resolve)

Vue.use(Router)
const routes = [
  {
    path: '/',
    component: home,
    // redirect: '/studentCMIS',
    children: [
      // 任务列表
      { path: '/task/taskList', component: taskList, name: '我负责的子任务', meta: { num: 0 } },
      { path: '/task/partList', component: partList, name: '我参与的子任务', meta: { num: 1 } },
      { path: '/task/taskDetail', component: taskDetail, name: '任务详情', meta: { num: 0 } },
      // 任务维护
      { path: '/task/overview', component: overview, name: '任务总览', meta: { num: 2 } },
      { path: '/label/index', component: label, name: '任务类型', meta: { num: 3 } }
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
