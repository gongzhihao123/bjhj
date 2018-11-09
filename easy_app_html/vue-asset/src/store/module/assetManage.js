import service from '@/api/index'
import { error } from '@/utils/index'
const state = {
}

const actions = {
  async streamList ({commit}, data) {
    const res = await service.streamList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async teacher ({commit}, data) {
    const res = await service.teacher(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async teacherBorrow ({commit}, data) {
    const res = await service.teacherBorrow(data)
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
