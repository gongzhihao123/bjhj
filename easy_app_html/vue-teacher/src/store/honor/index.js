import service from '@/api/index'
import {success, error} from '@/utils/handle'
const state = {
  honorList: '',
  historyHonor: '',
  checkState: ''
}

const actions = {
  async getHonor ({commit}, parameter) {
    const res = await service.getHonor(parameter)
    if (res && res.code === 1) commit('GETHONOR', res.result)
    else error(res.message)
  },
  async saveHonor ({commit}, parameter) {
    const res = await service.saveHonor(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delHonor ({commit}, parameter) {
    const res = await service.delHonor(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  }
}

const mutations = {
  GETHONOR (state, data) {
    state.honorList = data.teacherWorkExperience
    state.checkState = data.checkState
    if (data.teacherEditRecord) {
      state.historyHonor = data.teacherEditRecord
    }
  }
}

export default {
  state,
  actions,
  mutations
}
