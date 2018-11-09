// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './layouts/App'
import router from './router'
import store from './store/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import * as filters from './filters'
import './assets/scss/index.scss'
import '../static/utf8-jsp/ueditor.config'
import '../static/utf8-jsp/ueditor.all'
import '../static/utf8-jsp/lang/zh-cn/zh-cn'
import '../static/utf8-jsp/ueditor.parse.min.js'
import axios from 'axios'

axios.defaults.baseURL = document.querySelector('#contextPath').value
Vue.prototype.$https = axios
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.config.productionTip = false

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
