import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@/pages/home.vue')), 'group1')
const index = r => require.ensure([], () => r(require('@/pages/index.vue')), 'group1')
const answer = r => require.ensure([], () => r(require('@/pages/answer.vue')), 'group1')
const manager = r => require.ensure([], () => r(require('@/pages/manager.vue')), 'group1')
const addEvalStepOne = r => require.ensure([], () => r(require('@/pages/addEvalStepOne.vue')), 'group1')
const addEvalStepTwo = r => require.ensure([], () => r(require('@/pages/addEvalStepTwo.vue')), 'group1')
const answerResult = r => require.ensure([], () => r(require('@/pages/answerResult.vue')), 'group1')
const notFind = r => require.ensure([], () => r(require('@/pages/notFind.vue')), 'group1')

const router = new Router({
  routes: [
    {
      path: '/',
      component: home,
      name: 'home',
      redirect: '/index',
      children: [
        { path: '/index', name: 'index', component: index, meta: { state: 0 } },
        { path: '/answer', name: 'answer', component: answer, meta: { state: 0 } },
        { path: '/manager', name: 'manager', component: manager, meta: { state: 1 } },
        { path: '/addEvalStepOne', name: 'addEvalStepOne', component: addEvalStepOne, meta: { state: 1 } },
        { path: '/addEvalStepTwo', name: 'addEvalStepTwo', component: addEvalStepTwo, meta: { state: 1 } },
        { path: '/answerResult', name: 'answerResult', component: answerResult, meta: { state: 1 } }
      ]
    },
    {
      path: '*',
      component: notFind
    }
  ]
})

router.beforeEach((to, form, next) => {
  NProgress.start()
  next()
})

router.afterEach((to, form) => {
  NProgress.done()
})

export default router
