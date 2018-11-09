import Vue from 'vue'
import Router from 'vue-router'

const home = resolve => require(['../../src/pages/home.vue'], resolve)
const search = resolve => require(['../../src/pages/search.vue'], resolve)
const detail = resolve => require(['../../src/pages/detail.vue'], resolve)
const completeTask = resolve => require(['../../src/pages/completeTask.vue'], resolve)
const addTask = resolve => require(['../../src/pages/addTask.vue'], resolve)
const user = resolve => require(['../../src/pages/user.vue'], resolve)

Vue.use(Router)
const routes = [
  {
    path: '/',
    component: home
  },
  // 搜索页面
  { path: '/search', component: search },
  // 详情页
  { path: '/detail', component: detail },
  // 完成任务页面
  { path: '/completeTask', component: completeTask },
  // 添加任务页面
  { path: '/addTask', component: addTask },
  // 添加参与人
  { path: '/user', component: user }
]

const router = new Router({
  mode: 'hash',
  base: __dirname,
  routes
})

export default router
