import Vue from 'vue'
import Vuex from 'vuex'
import service from './../api/index'
import assetList from './module/assetList'
import type from './module/type'
import assetManage from './module/assetManage'
import router from '../router/index'

Vue.use(Vuex)

const state = {
  user: ''
}

const actions = {
  // 页面初始化
  async init ({commit}, url) {
    const res = await service.init()
    if (res.code === 1) {
      if (res.result.loginUser.adminFlag) {
        router.push(url.url === '/' ? '/assetManager/assetList' : url.url)
      } else {
        router.push(url.url === '/' ? '/commonTeacher/receiveDetail' : url.url)
      }
    }
    commit('INIT', res)
  }
}

const mutations = {
  INIT (state, data) {
    if (data.code === 1) {
      state.user = data.result
    }
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    assetList,
    type,
    assetManage
  }
})
