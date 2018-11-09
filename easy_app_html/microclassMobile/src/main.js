// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import './assets/scss/index.scss'
import * as filters from './filters'
// import axios from 'axios'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'lib-flexible/flexible.js'
import clickOutside from './utils/clickout'

Vue.config.productionTip = false
// axios.defaults.baseURL = document.querySelector('#contextPath').value
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// 引入mint-ui
Vue.use(MintUI)

// 引入element ui
Vue.use(ElementUI)

// 引入Video
Vue.use(VueVideoPlayer)

Vue.directive('click-outside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
