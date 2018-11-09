// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './layouts/App'
import router from './router'
import './assets/scss/index.scss'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as filter from './filter/index'
import VueHighcharts from 'vue-highcharts'

Vue.use(ElementUI)

// highcharts的引入
Vue.use(VueHighcharts)

// 实例化所有的过滤器
Object.keys(filter).forEach(item => { Vue.filter(item, filter[item]) })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
