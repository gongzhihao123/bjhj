// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import * as filters from './filters'
import './assets/scss/reset.scss'
import Mint from 'mint-ui'

// 全局的axios默认值
axios.defaults.baseURL = document.querySelector('#contextPath').value

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// 添加到原型上
Vue.prototype.$https = axios

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Mint)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  ...App
})
