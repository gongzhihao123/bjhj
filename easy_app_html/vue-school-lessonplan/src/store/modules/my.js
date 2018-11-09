import * as type from '../mutations-type'
// import axios from 'axios'

const state = {
  my: {},
  board: {},
  detail: {},
  judge: {},
  recevied: {},
  hide: {}
}

const actions = {
  my ({ commit }, item) {
    commit(type.MY, item)
  },
  board ({ commit }, item) {
    commit(type.BOARD, item)
  },
  detail ({ commit }, item) {
    commit(type.DETAIL, item)
  },
  judge ({ commit }, item) {
    commit(type.JUDGE, item)
  },
  recevied ({ commit }, item) {
    commit(type.RECEIVED, item)
  },
  hide ({ commit }, item) {
    commit(type.HIDE, item)
  }
}

const mutations = {
  [type.MY] (state, item) {
    state.my = { ...item }
  },
  [type.BOARD] (state, item) {
    state.board = { ...item }
  },
  [type.DETAIL] (state, item) {
    state.detail = { ...item }
  },
  [type.JUDGE] (state, item) {
    state.judge = { ...item }
  },
  [type.RECEIVED] (state, item) {
    state.recevied = { ...item }
  },
  [type.HIDE] (state, item) {
    state.hide = { ...item }
  }
}

const getters = {
  my (state) {
    return state.my
  },
  board (state) {
    return state.board
  },
  detail (state) {
    return state.detail
  },
  judge (state) {
    return state.judge
  },
  recevied (state) {
    return state.recevied
  },
  hide (state) {
    return state.hide
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
