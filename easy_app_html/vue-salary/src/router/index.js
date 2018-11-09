import Vue from 'vue'
import Router from 'vue-router'

import NProgress from 'nprogress'  // 页面顶部进度条
import 'nprogress/nprogress.css'

const home = () => import(/* webpackChunkName: "home" */ '../pages/home')

const addWages = () => import(/* webpackChunkName: "addWages" */ '../pages/addWages/index')
const release = () => import(/* webpackChunkName: "addWages" */ '../pages/addWages/release')

const history = () => import(/* webpackChunkName: "history" */ '../pages/history')

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: home,
    name: 'home',
    meta: { index: -1 }
  },
  {
    path: '/addWages',
    component: addWages,
    name: 'addWages',
    meta: { index: 0 }
  },
  {
    path: '/release',
    component: release,
    name: 'release',
    meta: { index: 0 }
  },
  {
    path: '/history',
    component: history,
    name: 'history',
    meta: { index: 1 }
  }
]

const router = new Router({
  mode: 'hash',
  base: __dirname,
  linkExactActiveClass: 'link-active',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
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
