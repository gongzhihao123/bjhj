import Vue from 'vue'
import Vuex from 'vuex'
import 'babel-polyfill'
import service from '../api/index'
import { notice } from '../utils/res'

Vue.use(Vuex)

const state = {
  user: JSON.parse(window.sessionStorage.getItem('USER') || '{ "id": "" }')
}

const actions = {
  async init ({ commit }, data) {
    const res = await service.init(data)
    if (!res || res.code !== 1) notice(res.message)
    else commit('USER', res.result)
    return res
  },
  async getSemester ({ commit }, data) {
    const res = await service.getSemester(data)
    if (!res || res.code !== 1) notice(res.message)
    return res.result || []
  },
  async getScore ({ commit }, data) {
    const res = await service.getScore(data)
    if (!res || res.code !== 1) notice(res.message)
    return res.result || []
  },
  async getExam ({ commit }, data) {
    const res = await service.getExam(data)
    if (!res || res.code !== 1) notice(res.message)
    return res.result || []
  }
}

const mutations = {
  USER (state, data) {
    state.user = data.loginUser
    window.sessionStorage.setItem('USER', JSON.stringify(data.loginUser))
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
