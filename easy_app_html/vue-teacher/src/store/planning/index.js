import service from '@/api/index'
import {success, error} from '@/utils/handle'
const state = {
  planList: ''
}

const actions = {
  async getPlan ({commit}, parameter) {
    const res = await service.getPlan(parameter)
    if (res && res.code === 1) commit('GETPLAN', res.result)
    else error(res.message)
  },
  async savePlan ({commit}, parameter) {
    const res = await service.savePlan(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delPlan ({commit}, parameter) {
    const res = await service.delPlan(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  }
}

const mutations = {
  GETPLAN (state, data) {
    state.planList = data
  }
}

export default {
  state,
  actions,
  mutations
}
