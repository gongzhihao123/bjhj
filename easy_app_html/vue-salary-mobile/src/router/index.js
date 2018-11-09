import Vue from 'vue'
import Router from 'vue-router'

const index = () => import(/* webpackChunkName: "index" */ '../pages/index')

const history = () => import(/* webpackChunkName: "history" */ '../pages/history')

const notice = () => import(/* webpackChunkName: "notice" */ '../pages/noticeDetail')

const detail = () => import(/* webpackChunkName: "detail" */ '../pages/detail')

const never = () => import(/* webpackChunkName: "never" */'../pages/never.vue')

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/history',
      name: 'history',
      component: history
    },
    {
      path: '/notice',
      name: 'notice',
      component: notice
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/never',
      name: 'never',
      component: never
    }
  ]
})
