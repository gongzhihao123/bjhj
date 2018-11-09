import Vue from 'vue'
import Vuex from 'vuex'
import service from '../api/index'
import { error } from '../utils/common'

Vue.use(Vuex)

const state = {
  index: 1,
  loginUser: {
    id: 0,
    name: '--',
    userFace: '',
    adminFlag: false
  }
}

const getters = {
  loginUser (state) {
    return state.loginUser
  }
}

const actions = {
  // 页面初始化
  async started ({ commit }) {
    var res = await service.init()
    if (res && res.code === 1) commit('STARTED', res.result)
    else error(res.message)
  }
}

const mutations = {
  STARTED (state, res) {
    state.loginUser = res
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
