import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

// 懒加载
const home = resolve => require(['../views/home.vue'], resolve)

// 微课广场
const square = r => require.ensure([], () => r(require('../views/square/square.vue')), 'group1')

// 微课查看
const course = r => require.ensure([], () => r(require('../views/square/course.vue')), 'group2')

// 搜索页
// 微课广场
const search = r => require.ensure([], () => r(require('../views/square/search.vue')), 'group3')

const comment = r => require.ensure([], () => r(require('../views/square/comment.vue')), 'group4')
Vue.use(Router)

const routes = [
  {
    path: '/',
    component: home,
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
        path: '/search',
        component: search,
        name: '搜索'
      },
      {
        path: '/comment',
        component: comment,
        name: '评论'
      }
    ]
  }
]

const router = new Router({
  mode: 'hash',
  base: __dirname,
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
})
export default router
