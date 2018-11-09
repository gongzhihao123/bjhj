import service from './../../api/index'
import { error } from './../../utils/handle'

const state = {
  recordList: '',
  timeswitch: true
}

const actions = {
  async getRecord ({commit}, data) {
    const res = await service.getRecord(data)
    if (res && res.code === 1) commit('GETRECORD', res.result)
    else error(res.message)
  },
  TimeRecord ({commit}, data) {
    commit('TIMERECORD', data)
  }
}

const mutations = {
  GETRECORD (state, data) {
    state.recordList = data
  },
  TIMERECORD (state, data) {
    if (data) {
      state.recordList.list.sort((a, b) => {
        return a.createdTime - b.createdTime
      })
    } else {
      state.recordList.list.sort((a, b) => {
        return b.createdTime - a.createdTime
      })
    }
  }
}

export default {
  state,
  actions,
  mutations
}
