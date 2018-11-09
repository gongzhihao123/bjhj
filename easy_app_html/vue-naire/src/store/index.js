import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
// import details from './modules/details'
import 'babel-polyfill'
// import * as type from './mutations-type'

Vue.use(Vuex)

const state = {
  user: {},
  leftMenu: []
}

/***
 ****组件获取 state 用 vuex 的 getter
 ****组件触发动作用 vuex 的 action
 ****修改 state 用 vuex 的 mutation
 ***/

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
