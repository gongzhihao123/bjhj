import service from '@/api/index'
import {success, error} from '@/utils/handle'
const state = {
  recordList: '',
  paperList: '',
  trainList: ''
}

const actions = {
  async getRecord ({commit}, parameter) {
    const res = await service.getRecord(parameter)
    if (res && res.code === 1) commit('GETRECORD', res.result)
    else error(res.message)
  },
  async saveRecord ({commit}, parameter) {
    const res = await service.saveRecord(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delRecord ({commit}, parameter) {
    const res = await service.delRecord(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async getPaper ({commit}, parameter) {
    const res = await service.getPaper(parameter)
    if (res && res.code === 1) commit('GETPAPER', res.result)
    else error(res.message)
  },
  async savePaper ({commit}, parameter) {
    const res = await service.savePaper(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delPaper ({commit}, parameter) {
    const res = await service.delPaper(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async getTrain ({commit}, parameter) {
    const res = await service.getTrain(parameter)
    if (res && res.code === 1) commit('GETTRAIN', res.result)
    else error(res.message)
  },
  async saveTrain ({commit}, parameter) {
    const res = await service.saveTrain(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delTrain ({commit}, parameter) {
    const res = await service.delTrain(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  }
}

const mutations = {
  GETRECORD (state, data) {
    state.recordList = data
  },
  GETPAPER (state, data) {
    state.paperList = data
  },
  GETTRAIN (state, data) {
    state.trainList = data
  }
}

export default {
  state,
  actions,
  mutations
}
