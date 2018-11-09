import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const Home = r => require.ensure([], () => r(require('./../page/home.vue')), 'group1')

const lookfolder = r => require.ensure([], () => r(require('./../page/lookFolder/index.vue')), 'group1')

const recyclebin = r => require.ensure([], () => r(require('./../page/recycleBin/index.vue')), 'group2')

const record = r => require.ensure([], () => r(require('./../page/record/index.vue')), 'group3')

const statistical = r => require.ensure([], () => r(require('./../page/statistical/index.vue')), 'group4')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/lookfolder' },
    {
      path: '/',
      component: Home,
      name: '文件页',
      children: [
        {path: '/lookfolder', component: lookfolder, name: 'lookfolder', meta: {page: 'lookfolder'}}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '回收站',
      children: [
        {path: '/recycle', component: recyclebin, name: 'recycle', meta: {page: 'recycle'}}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '操作记录',
      children: [
        {path: '/record', component: record, name: 'record', meta: {page: 'record'}}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '文件统计',
      children: [
        {path: '/statistical', component: statistical, name: 'statistical', meta: {page: 'statistical'}}
      ]
    }
  ]
})

router.beforeEach((to, form, next) => {
  NProgress.start()
  next()
})

router.afterEach((to, form, next) => {
  NProgress.done()
})

export default router
