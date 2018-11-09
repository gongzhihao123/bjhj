// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './layout/App'
import router from './router'
import store from './store'
import elementUi from 'element-ui'

import '../static/theme/index.css'
import 'swiper/dist/css/swiper.css'
import './assets/scss/index.scss'

Vue.use(elementUi)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
