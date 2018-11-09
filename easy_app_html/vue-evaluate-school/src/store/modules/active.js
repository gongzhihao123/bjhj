import * as type from '../mutations-type'
// import axios from 'axios'

const state = {
  people: {},
  active: {},
  stateTitle: '',
  localData: []
}

const actions = {
  people ({ commit }, item) {
    commit(type.PEOPLE, item)
  },
  active ({ commit }, item) {
    commit(type.ACTIVE, item)
  },
  details ({ commit }, item) {
    commit(type.DETAILS, item)
  }
}

const mutations = {
  [type.PEOPLE] (state, item) {
    state.people = { ...item }
  },
  [type.ACTIVE] (state, item) {
    state.active = { ...item }
  },
  [type.DETAILS] (state, item) {
    state.stateTitle = item.state
    state.localData = item.data
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
