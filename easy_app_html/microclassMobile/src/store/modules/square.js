import service from '@/api/index'
import { error } from '@/utils/index'
const state = {
}

const actions = {
  async getIndex ({commit}, data) {
    const res = await service.getIndex(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async getPeroid ({commit}, data) {
    const res = await service.getPeroid(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async getSection ({commit}, data) {
    const res = await service.getSection(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async getGrade ({commit}, data) {
    const res = await service.getGrade(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async getSubject ({commit}, data) {
    const res = await service.getSubject(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async getCourseList ({commit}, data) {
    const res = await service.getCourseList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async getComment ({commit}, data) {
    const res = await service.getComment(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async deleteComment ({commit}, data) {
    const res = await service.deleteComment(data)
    if (res && res.code === 1) return res.message
    else error(res.message)
  },
  async saveComment ({commit}, data) {
    const res = await service.saveComment(data)
    if (res && res.code === 1) return res.message
    else error(res.message)
  },
  async squareDetail ({commit}, data) {
    const res = await service.squareDetail(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  }
}

const mutations = {
}

export default ({
  state,
  actions,
  mutations
})
