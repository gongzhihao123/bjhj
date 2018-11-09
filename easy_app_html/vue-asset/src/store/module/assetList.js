import service from '@/api/index'
import { error, success } from '@/utils/index'
const state = {
  watchStorage: ''
}

const actions = {
  async assetList ({commit}, data) {
    const res = await service.assetList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async assetType ({commit}, data) {
    const res = await service.assetType(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async assetAdd ({commit}, data) {
    const res = await service.assetAdd(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  async assetDel ({commit}, data) {
    const res = await service.assetDel(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  async assetDetail ({commit}, data) {
    const res = await service.assetDetail(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async assetEdit ({commit}, data) {
    const res = await service.assetEdit(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  // 入库
  async putIn ({commit}, data) {
    const res = await service.putIn(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  // 报废
  async putOut ({commit}, data) {
    const res = await service.putOut(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  // 领用
  async borrow ({commit}, data) {
    const res = await service.borrow(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  // 领用列表
  async backList ({commit}, data) {
    const res = await service.backList(data)
    if (res && res.code === 1) {
      return res.result
    } else error(res.message)
  },
  // 归还
  async back ({commit}, data) {
    const res = await service.back(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  // 归还
  async all ({commit}, data) {
    const res = await service.all(data)
    if (res && res.code === 1) {
      return res.result
    } else error(res.message)
  },
  // 入库、报废、领用、归还四合一
  async totalOperation ({commit}, data) {
    const res = await service.totalOperation(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  async returnList ({commit}, data) {
    const res = await service.returnList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async getUser ({commit}, data) {
    const res = await service.getUser(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async inStorage ({commit}, data) {
    const res = await service.inStorage(data)
    if (res && res.code === 1) {
      return res.result
    } else error(res.message)
  },
  async outStorage ({commit}, data) {
    const res = await service.outStorage(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async statistic ({commit}, data) {
    const res = await service.statistic(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async watchStorage ({commit}, data) {
    commit('WATCHSTORAGE')
  }
}

const mutations = {
  'WATCHSTORAGE' (state, data) {
    if (data.code === 1) {
      state.wathcStorage = data.result
    }
  }
}

const getters = {
  watchStorage (state) {
    return state.watchStorage
  }
}

export default ({
  state,
  actions,
  mutations,
  getters
})
