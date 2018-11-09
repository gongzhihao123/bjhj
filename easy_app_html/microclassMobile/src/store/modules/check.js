import service from '@/api/index'
import { error } from '@/utils/index'
const state = {
}

const actions = {
  async CourseList ({commit}, data) {
    const res = await service.CourseList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async DeleteCourse ({commit}, data) {
    const res = await service.DeleteCourse(data)
    if (res && res.code === 1) return res.message
    else error(res.message)
  },
  async CheckCourse ({commit}, data) {
    const res = await service.CheckCourse(data)
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
