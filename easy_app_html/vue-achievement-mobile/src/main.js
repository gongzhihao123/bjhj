// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/index.scss'
import store from './store'
import axios from 'axios'

Vue.use(ElementUI)
Vue.config.productionTip = false

axios.defaults.baseURL = document.querySelector('#contextPath').value
Vue.prototype.$https = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  ...App
})
