import service from '@/api/index'
import {success, error} from '@/utils/handle'
const state = {
  studyList: ''
}

const actions = {
  async getStudy ({commit}, parameter) {
    const res = await service.getStudy(parameter)
    if (res && res.code === 1) commit('GETSTUDY', res.result)
    else error(res.message)
  },
  async saveStudy ({commit}, parameter) {
    const res = await service.saveStudy(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delStudy ({commit}, parameter) {
    const res = await service.delStudy(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  }
}

const mutations = {
  GETSTUDY (state, data) {
    state.studyList = data
  }
}

export default {
  state,
  actions,
  mutations
}
