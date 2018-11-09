import Vue from 'vue'
import App from './layouts/App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import clickOutside from './utils/clickout'
import VueQuillEditor from 'vue-quill-editor'
import './assets/scss/index.scss'
import './utils/finally'
import * as filters from './filters'

Vue.use(VueQuillEditor)

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.directive('click-outside', clickOutside)

// 实例化过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  store,
  router,
  ...App
})

export default app
