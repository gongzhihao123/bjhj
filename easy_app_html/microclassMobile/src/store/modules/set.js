import service from '@/api/index'
import { error, success } from '@/utils/index'
const state = {
}

const actions = {
  async getDetail ({commit}, data) {
    const res = await service.getDetail(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async saveSet ({commit}, data) {
    const res = await service.saveSet(data)
    if (res && res.code === 1) success(res.message)
    else error(res.message)
  },
  async getNumber ({commit}, data) {
    const res = await service.getNumber(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async getChecked ({commit}, data) {
    const res = await service.getChecked(data)
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
