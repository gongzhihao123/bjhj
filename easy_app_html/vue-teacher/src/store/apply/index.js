import service from '@/api/index'
import {success, error} from '@/utils/handle'
const state = {
  applyList: ''
}

const actions = {
  async getApply ({commit}, parameter) {
    const res = await service.getApply(parameter)
    if (res && res.code === 1) commit('GETAPPLY', res.result)
    else error(res.message)
  },
  async saveApply ({commit}, parameter) {
    const res = await service.saveApply(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delApply ({commit}, parameter) {
    const res = await service.delApply(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  }
}

const mutations = {
  GETAPPLY (state, data) {
    state.applyList = data
  }
}

export default {
  state,
  actions,
  mutations
}
