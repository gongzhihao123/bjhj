import * as types from '../mutations-type'

const state = {
  activityId: window.localStorage.getItem('ACTIVITY_ID'),
  activeState: undefined // 0 不可修改， 1 可以修改／添加
}

const mutations = {
  [types.DA_ACTIVETY_ID] (state, { id }) {
    state.activityId = id
    window.localStorage.setItem('ACTIVITY_ID', id)
  },

  [types.DA_ACTIVETY_STATE] (state, active) {
    state.activeState = active
  }
}

export default {
  state,
  mutations
}
