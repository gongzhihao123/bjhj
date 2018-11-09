// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import * as filters from './filters'
import './assets/scss/index.scss'
// import axios from 'axios'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

// axios.defaults.baseURL = document.querySelector('#contextPath').value
// Vue.prototype.$https = axios
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueVideoPlayer)
Vue.config.productionTip = false

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
