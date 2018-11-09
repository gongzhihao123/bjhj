import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'
// import mutations from './mutations'
import square from './modules/square'
import service from './../api/index'
import set from './modules/set'
import my from './modules/my'
import check from './modules/check'
// import router from '../router/index'

Vue.use(Vuex)

const state = {
  user: ''
}

const actions = {
  // 页面初始化
  async init ({commit}, url) {
    const res = await service.init()
    if (res.code === 1) {
      // console.log(res.result)
      // if (res.result.loginUser.adminFlag) {
      //   router.push(url.url === '/' ? '/assetManager/assetList' : url.url)
      // } else {
      //   router.push(url.url === '/' ? '/commonTeacher/receiveDetail' : url.url)
      // }
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
/***
****组件获取 state 用 vuex 的 getter
****组件触发动作用 vuex 的 action
****修改 state 用 vuex 的 mutation
***/

export default new Vuex.Store({
  state,
  // getters,
  actions,
  mutations,
  modules: {
    my,
    square,
    set,
    check
  }
})
