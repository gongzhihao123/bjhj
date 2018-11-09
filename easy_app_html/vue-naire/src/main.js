// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './layouts/App.vue'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/css/reset.css'
import './assets/scss/index.scss'
import './assets/css/iconfont.css'
import axios from 'axios'
import * as filters from './filters/index.js'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
axios.defaults.baseURL = document.querySelector('#contextPath').value
Vue.prototype.$https = axios

Vue.config.productionTip = false

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
