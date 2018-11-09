// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/index.scss'
import App from './layouts/App.vue'
import router from './router'
import VueECharts from 'vue-echarts'
import store from './store'
import * as filters from './filters'
import '../static/utf8-jsp/ueditor.config'
import '../static/utf8-jsp/ueditor.all'
import '../static/utf8-jsp/lang/zh-cn/zh-cn'
import '../static/utf8-jsp/ueditor.parse.min.js'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('chart', VueECharts)
// 实例化过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
