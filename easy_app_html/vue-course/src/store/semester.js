import * as type from './mutations-type'

const state = {
  semesterId: {},
  semesterName: {},
  section: {}
}

const actions = {
  semesterId({ commit }, item) {
    commit(type.SEMESTERID, item)
  },
  semesterName({ commit }, item) {
    commit(type.SEMESTERNAME, item)
  },
  section({ commit }, item) {
    commit(type.SECTION, item)
  }
}

const mutations = {
  [type.SEMESTERID](state, item) {
    state.semesterId = {...item }
  },
  [type.SEMESTERNAME](state, item) {
    state.semesterName = {...item }
  },
  [type.SECTION](state, item) {
    state.section = {...item }
  }
}

const getters = {
  semesterId(state) {
    return state.semesterId
  },
  section(state) {
    return state.section
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
