import service from '@/api/index'
import { error } from '@/utils/index'
const state = {
}

const actions = {
  async getMyList ({commit}, data) {
    const res = await service.getMyList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async saveCourse ({commit}, data) {
    const res = await service.saveCourse(data)
    if (res && res.code === 1) return res.message
    else error(res.message)
  },
  async deleteCourse ({commit}, data) {
    const res = await service.deleteCourse(data)
    if (res && res.code === 1) return res.message
    else error(res.message)
  },
  async publishCourse ({commit}, data) {
    const res = await service.publishCourse(data)
    if (res && res.code === 1) return res.message
    else error(res.message)
  },
  async getCourse ({commit}, data) {
    const res = await service.getCourse(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async editCourse ({commit}, data) {
    const res = await service.editCourse(data)
    if (res && res.code === 1) return res.message
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
