import * as type from '../mutations-type'

const state = {
  remind: {}
}

const actions = {
  remind ({ commit }, item) {
    commit(type.REMIND, item)
  }
}

const mutations = {
  [type.REMIND] (state, item) {
    state.remind = { ...item }
  }
}

const getters = {
  remind (state) {
    return state.remind
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
