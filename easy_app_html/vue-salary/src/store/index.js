import Vue from 'vue'
import Vuex from 'vuex'
import 'babel-polyfill'
// import '../utils/mock'
import history from './module/history'
import release from './module/release'
import service from '../api/index'
import { error } from '../utils/handle'
Vue.use(Vuex)

const state = {
  documents: [],
  userName: '',
  userImg: ''
}

const actions = {
  // 把页面的数据传输的 release
  payBill ({ commit }, data) {
    commit('PAYBILL', data)
  },
  // 页面初始化
  async started ({ commit }) {
    const res = await service.started()
    if (res && res.code === 1) commit('STARTED', res.result)
    else error(res.message)
  }
}

const mutations = {
  PAYBILL (state, data) {
    state.documents = data
  },
  STARTED (state, res) {
    state.userName = res.name
    state.userImg = res.userFace
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    history,
    release
  }
})
