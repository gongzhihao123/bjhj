import Vue from 'vue'
import Vuex from 'vuex'
import service from './../api/index'
import taskList from './module/taskList'
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
      router.push(url.url === '/' ? '/task/taskList' : url.url)
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
    taskList
  }
})
