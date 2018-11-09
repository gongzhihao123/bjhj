import service from '@/api/index'
import {success, error} from '@/utils/handle'
const state = {
  archivesList: ''
}

const actions = {
  async getArchives ({commit}, parameter) {
    const res = await service.getArchives(parameter)
    if (res && res.code === 1) commit('GETARCHIVES', res.result)
    else error(res.message)
  },
  async saveArchives ({commit}, parameter) {
    const res = await service.saveArchives(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delArchives ({commit}, parameter) {
    const res = await service.delArchives(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  }
}

const mutations = {
  GETARCHIVES (state, data) {
    state.archivesList = data
  }
}

export default {
  state,
  actions,
  mutations
}
