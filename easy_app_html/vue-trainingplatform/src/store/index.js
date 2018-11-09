import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import dManage from './modules/dManage'
// import message from '../data/initPage'

Vue.use(Vuex)

const state = {
  // user: JSON.parse(window.localStorage.getItem('TRAININGPLATFORM_USER') || '{ "id": "" }'),
  // leftmenu: JSON.parse(window.localStorage.getItem('TRAININGPLATFORM_LEFTMENU') || '{ "right": "" }')
  // leftmenu: JSON.parse(window.localStorage.getItem('TRAININGPLATFORM_LEFTMENU') || '[]')
  // semesterList: JSON.parse(window.localStorage.getItem('SEMESTERLIST') || '[]'), // 学期列表
  // sectionList: [] // 学段列表
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
    dManage
  }
})
