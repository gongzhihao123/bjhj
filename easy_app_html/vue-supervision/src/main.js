// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './layouts/App'
import router from './router'
// import BaiduMap from 'vue-baidu-map'
import AMap from 'vue-amap'
import ElementUI from 'element-ui'
import VueHighcharts from 'vue-highcharts'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/index.scss'
import * as filters from './filters'
import clickOutside from './utils/clickout'

Vue.config.productionTip = false
Vue.use(VueHighcharts)
Vue.use(ElementUI)
Vue.use(AMap)
AMap.initAMapApiLoader({
  key: '024f912f0f9501478d63e1888855e87e',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
})

Vue.directive('click-outside', clickOutside)
// 实例化过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
// Vue.use(BaiduMap, {
//   ak: 'IjDpkqzwdxdviu0Z0MewmF9GVE3G0UEv'
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
