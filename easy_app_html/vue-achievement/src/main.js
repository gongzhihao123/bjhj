// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './layouts/App'
import store from './store'
import ElementUI from 'element-ui'
import router from './router'
import './assets/scss/index.scss'
import 'element-ui/lib/theme-default/index.css'
import './utils/finally'
import './assets/css/iconfont.css'
import VueECharts from 'vue-echarts'
import * as filters from './filters/date.js'
import axios from 'axios'

Vue.use(ElementUI)
Vue.component('chart', VueECharts)

axios.defaults.baseURL = document.querySelector('#contextPath').value
Vue.prototype.$https = axios

Vue.config.productionTip = false

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  ...App
})
