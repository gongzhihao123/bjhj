import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import active from './modules/active'
import 'babel-polyfill'

Vue.use(Vuex)

const state = {
  path: document.getElementById('contextPath').value,
  checkState: '1'
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
  mutations,
  modules: {
    active
  }
})
