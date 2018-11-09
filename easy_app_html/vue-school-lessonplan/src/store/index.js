import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import my from './modules/my'
import 'babel-polyfill'

Vue.use(Vuex)

const state = {
  path: document.getElementById('contextPath').value,
  // code: JSON.parse(window.localStorage.getItem('coder') || '-2'),
  leftMenu: [],
  user: {},
  rights: [],
  defaultActive: '',
  edit: {
    name: '',
    id: ''
  }
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
    my
  }
})
