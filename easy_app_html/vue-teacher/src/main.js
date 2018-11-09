// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './layouts/App.vue'
import router from './router'
import './assets/scss/index.scss'
import ElementUI from 'element-ui'
import './assets/scss/element-variables.scss'
import store from './store/index'
import * as filters from './filters/index'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 实例化过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
