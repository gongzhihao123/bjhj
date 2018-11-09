import service from '@/api/index'
import {success, error} from '@/utils/handle'
const state = {
  reviewList: '',
  historyReview: '',
  checkState: ''
}

const actions = {
  async getReview ({commit}, parameter) {
    const res = await service.getReview(parameter)
    if (res && res.code === 1) commit('GETREVIEW', res.result)
    else error(res.message)
  },
  async saveReview ({commit}, parameter) {
    const res = await service.saveReview(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async delReview ({commit}, parameter) {
    const res = await service.delReview(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  }
}

const mutations = {
  GETREVIEW (state, data) {
    state.reviewList = data.teacherWorkExperience
    state.checkState = data.checkState
    if (data.teacherEditRecord && data.teacherEditRecord.length) {
      state.historyReview = data.teacherEditRecord || []
    }
  }
}

export default {
  state,
  actions,
  mutations
}
