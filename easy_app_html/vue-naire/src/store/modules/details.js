import * as type from '../mutations-type'
// import axios from 'axios'

const state = {
  details: {}
}

const actions = {
  details ({ commit }, item) {
    commit(type.DETAILS, item)
  }
}

const mutations = {
  [type.DETAILS] (state, item) {
    state.details = { ...item }
  }
}

const getters = {
  details (state) {
    return state.details
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
