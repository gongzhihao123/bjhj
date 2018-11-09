import service from '@/api/index'
import { error } from '@/utils/index'
const state = {
}

const actions = {
  async typeList ({commit}, data) {
    const res = await service.typeList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async typeAdd ({commit}, data) {
    const res = await service.typeAdd(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async typeDel ({commit}, data) {
    const res = await service.typeDel(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async deptUserList ({commit}, data) {
    const res = await service.deptUserList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async typeManager ({commit}, data) {
    const res = await service.typeManager(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async statistics ({commit}, data) {
    const res = await service.statistics(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async teacherType ({commit}, data) {
    const res = await service.teacherType(data)
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
