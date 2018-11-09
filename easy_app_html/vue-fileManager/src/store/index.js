import Vue from 'vue'
import Vuex from 'vuex'
import service from './../api/index'
import { error } from './../utils/handle'

import lookFolder from './module/lookFolder'
import recycle from './module/recycle'
import record from './module/record'
import statistics from './module/statistics'

Vue.use(Vuex)

const state = {
  user: '',
  foldList: [],
  uploadBtnBool: false
}

const actions = {
  // 初始化
  async initPage ({commit}) {
    const res = await service.init()
    if (res && res.code === 1) commit('INITPAGE', res.result)
    else error(res.message)
  },
  async folderList ({commit}) {
    const res = await service.foldList()
    if (res && res.code === 1) commit('FOLDERLIST', res.result)
    else error(res.message)
  },
  uploadBtn ({commit}, data) {
    commit('UPLOADBTN', data)
  }
}

const mutations = {
  INITPAGE (state, data) {
    state.user = data
  },
  FOLDERLIST (state, data) {
    state.foldList = data === null ? [] : data
  },
  UPLOADBTN (state, data) {
    state.uploadBtnBool = data
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    lookFolder,
    recycle,
    record,
    statistics
  }
})
