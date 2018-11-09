import * as type from '../mutations-type'
// import axios from 'axios'

const state = {
  people: {},
  active: {}
}

const actions = {
  people ({ commit }, item) {
    commit(type.PEOPLE, item)
  },
  active ({ commit }, item) {
    commit(type.ACTIVE, item)
  }
}

const mutations = {
  [type.PEOPLE] (state, item) {
    state.people = { ...item }
  },
  [type.ACTIVE] (state, item) {
    state.active = { ...item }
  }
}

const getters = {
  people (state) {
    return state.people
  },
  active (state) {
    return state.active
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
