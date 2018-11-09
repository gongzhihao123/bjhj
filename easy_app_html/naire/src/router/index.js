import Vue from 'vue'
import Router from 'vue-router'
import naireList from '@/view/naireList'
import naireDetail from '@/view/naireDetail'
import success from '@/view/success'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/naireList'
    },
    {
      path: '/naireList',
      name: 'naireList',
      component: naireList
    },
    {
      path: '/naireDetail',
      name: 'naireDetail',
      component: naireDetail
    },
    {
      path: '/success',
      name: 'success',
      component: success
    }
  ]
})
