// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './layouts/App'
import store from './store/index'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as filters from './filters'
import 'lib-flexible/flexible.js'
import clickOutside from './utils/clickout'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.use(Mint)
Vue.use(ElementUI)
Vue.config.productionTip = false
// 实例化过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
Vue.directive('click-outside', clickOutside)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
