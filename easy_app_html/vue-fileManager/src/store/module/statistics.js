import service from './../../api/index'
import { error } from './../../utils/handle'

const state = {
  dataStatistics: ''
}

const actions = {
  async getStatistics ({commit}, data) {
    const res = await service.statistics(data)
    if (res && res.code === 1) commit('GETSTATISTICS', res.result)
    else error(res.message)
  }
}

const mutations = {
  GETSTATISTICS (state, data) {
    state.dataStatistics = data
  }
}

export default {
  state,
  actions,
  mutations
}
