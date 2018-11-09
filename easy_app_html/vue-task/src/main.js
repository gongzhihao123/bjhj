// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './layouts/App'
import store from './store/index'
import router from './router'
import i18n from './i18n/i18n'
import * as filters from './filters'
import '../static/utf8-jsp/ueditor.config'
import '../static/utf8-jsp/ueditor.all'
import '../static/utf8-jsp/lang/zh-cn/zh-cn'
import '../static/utf8-jsp/ueditor.parse.min.js'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
// 实例化过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
