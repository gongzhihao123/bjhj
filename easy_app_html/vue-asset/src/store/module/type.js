import service from '@/api/index'
import { error, success } from '@/utils/index'
const state = {
}

const actions = {
  async typeList ({commit}, data) {
    const res = await service.typeList(data)
    if (res && res.code === 1) {
      return res.result
    } else error(res.message)
  },
  async typeAdd ({commit}, data) {
    const res = await service.typeAdd(data)
    if (res && res.code === 1) {
      success('添加成功')
      return res.result
    } else error(res.message)
  },
  async typeDel ({commit}, data) {
    const res = await service.typeDel(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async companyCode ({commit}, data) {
    const res = await service.companyCode(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async companyCodeEdit ({commit}, data) {
    const res = await service.companyCodeEdit(data)
    if (res && res.code === 1) {
      success('设置成功')
      return res.result
    } else error(res.message)
  }
}

const mutations = {
}

export default ({
  state,
  actions,
  mutations
})
