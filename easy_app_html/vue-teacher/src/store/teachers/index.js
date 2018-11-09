import service from '@/api/index'
import {success, error} from '@/utils/handle'
const state = {
  teacherList: '',
  teacherDetail: ''
}

const actions = {
  async getTeacher ({commit}, parameter) {
    const res = await service.getTeacherList(parameter)
    if (res && res.code === 1) commit('GETTEACHER', res.result)
    else error(res.message)
  },
  async teacherState ({commit}, parameter) {
    const res = await service.teacherState(parameter)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async teacherDetail ({commit}, parameter) {
    const res = await service.teacherDetail(parameter)
    if (res && res.code === 1) commit('TEACHERDETAIL', res.result)
    else error(res.message)
  }
}

const mutations = {
  GETTEACHER (state, data) {
    state.teacherList = data
  },
  TEACHERDETAIL (state, data) {
    state.teacherDetail = data
  }
}

export default {
  state,
  actions,
  mutations
}
