// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './layouts/App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import router from './router'
import './assets/scss/index.scss'
import store from './store/index.js'
import * as filters from './filters'
import './plugins/finally.js'
Vue.config.productionTip = false
import axios from 'axios'

axios.defaults.baseURL = document.querySelector('#contextPath').value
Vue.prototype.$https = axios
Vue.use(ElementUI)
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
