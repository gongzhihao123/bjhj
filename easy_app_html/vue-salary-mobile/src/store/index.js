import Vue from 'vue'
import Vuex from 'vuex'
// import 'babel-polyfill'
import service from '../api/index'

Vue.use(Vuex)

const state = {
  historyList: [],
  list: [],
  empty: false,
  salaryUserId: ''
}

const actions = {
  async historyList ({ commit }, data) {
    // 查看工资单
    const res = await service.historyList(data)
    if (res && res.code === 1) commit('HISTORYLIST', res.result)
  },
  async history ({ commit }) {
    // 查看历史的工资单
    const res = await service.history()
    if (res && res.code === 1) commit('HISTORY', res.result)
  },
  async indexDetail ({ commit }) {
    // 首页查看最新工资单
    const res = await service.indexDetail()
    if (res && res.code === 1) commit('INDEXDETAIL', res.result)
  },
  withdraw ({ commit }) {
    // 撤回的工资单
    commit('WITHDRAW')
  },
  others ({ commit }, data) {
    // 查看相应的工资单
    commit('OTHERS', data)
  }
}

const mutations = {
  HISTORYLIST (state, res) {
    state.historyList = res
  },
  HISTORY (state, res) {
    state.list = res
  },
  WITHDRAW (state) {
    state.empty = true
  },
  OTHERS (state, res) {
    state.salaryUserId = res
  },
  INDEXDETAIL (state, res) {
    state.historyList = res
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
