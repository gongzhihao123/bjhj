import service from '@/api/index'
import {success, error} from '@/utils/handle'
const state = {
  workList: '',
  summaryList: ''
}

const actions = {
  async getWork ({commit}, parameter) {
    const res = await service.getWork(parameter)
    if (res && res.code === 1) commit('GETWORK', res.result)
    else error(res.message)
  },
  async saveWork ({commit}, parameter) {
    const res = await service.saveWork(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delWork ({commit}, parameter) {
    const res = await service.delWork(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async getSummary ({commit}, parameter) {
    const res = await service.getSummary(parameter)
    if (res && res.code === 1) commit('GETSUMMARY', res.result)
    else error(res.message)
  },
  async saveSummary ({commit}, parameter) {
    const res = await service.saveSummary(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delSummary ({commit}, parameter) {
    const res = await service.delSummary(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  }
}

const mutations = {
  GETWORK (state, data) {
    state.workList = data
  },
  GETSUMMARY (state, data) {
    state.summaryList = data
  }
}

export default {
  state,
  actions,
  mutations
}
