import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // 页面顶部进度条
import 'nprogress/nprogress.css'
import icon1 from '../assets/images/nav_1-blue.png'
import icon2 from '../assets/images/nav_2-blue.png'
import icon3 from '../assets/images/nav_3-blue.png'
import icon4 from '../assets/images/nav_4-blue.png'

const noFind = resolve => require(['../../src/pages/noFind.vue'], resolve)
const home = resolve => require(['../../src/pages/home.vue'], resolve)

// 资产管理员
const assetList = resolve => require(['@/pages/assetManager/assetList.vue'], resolve)
const statementManage = resolve => require(['@/pages/assetManager/statementManage.vue'], resolve)
const typeManage = resolve => require(['@/pages/assetManager/typeManage.vue'], resolve)
const assetDetail = resolve => require(['@/pages/assetManager/assetDetail.vue'], resolve)
const statisticalManage = resolve => require(['@/pages/assetManager/statisticalManage.vue'], resolve)
const collarManage = resolve => require(['@/pages/assetManager/collarManage.vue'], resolve)

// 普通教师
const receiveDetail = resolve => require(['@/pages/commonTeacher/receiveDetail.vue'], resolve)

Vue.use(Router)
const routes = [
  {
    path: '/',
    component: home,
    // redirect: '/studentCMIS',
    children: [
      // 资产管理员
      { path: '/assetManager/assetList', component: assetList, name: '易耗品管理', meta: { num: 0, icon: icon1 } },
      { path: '/assetManager/statementManage', component: statementManage, name: '资产流水管理', meta: { num: 1, icon: icon2 } },
      { path: '/assetManager/typeManage', component: typeManage, name: '资产类型管理', meta: { num: 2, icon: icon3 } },
      { path: '/assetManager/statisticalManage', component: statisticalManage, name: '统计管理', meta: { num: 3, icon: icon3 } },
      { path: '/assetManager/collarManage', component: collarManage, name: '领用记录', meta: { num: 4, icon: icon3 } },
      // 普通教师
      { path: '/commonTeacher/receiveDetail', component: receiveDetail, name: '我的操作记录', meta: { num: 5, icon: icon4 } }
    ]
  },
  { path: '/assetManager/assetDetail', component: assetDetail, name: '资产详情', meta: { num: 0, icon: icon1 } },
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
