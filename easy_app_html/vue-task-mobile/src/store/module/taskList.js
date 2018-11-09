import service from '@/api/index'
const state = {
}

const actions = {
  async chargeLabelList ({commit}, data) {
    const res = await service.chargeLabelList(data)
    if (res && res.code === 1) return res.result
  },
  async chargeList ({commit}, data) {
    const res = await service.chargeList(data)
    if (res && res.code === 1) return res.result
  },
  async getUser ({commit}, data) {
    const res = await service.getUser(data)
    if (res && res.code === 1) return res.result
  },
  async addTaskChild ({commit}, data) {
    const res = await service.addTaskChild(data)
    if (res && res.code === 1) return res.result
  },
  async unlockedTaskList ({commit}, data) {
    const res = await service.unlockedTaskList(data)
    if (res && res.code === 1) {
      return res.result
    }
  },
  // 详情页
  async taskChildFeedback ({commit}, data) {
    const res = await service.taskChildFeedback(data)
    if (res && res.code === 1) {
      return res.result
    }
  },
  async taskChildDetail ({commit}, data) {
    const res = await service.taskChildDetail(data)
    if (res && res.code === 1) return res.result
  },
  // 我参与的子任务
  async participateList ({commit}, data) {
    const res = await service.participateList(data)
    if (res && res.code === 1) return res.result
  },
  async participateLabelList ({commit}, data) {
    const res = await service.participateLabelList(data)
    if (res && res.code === 1) return res.result
  },
  // 我参与的子任务
  async overviewList ({commit}, data) {
    const res = await service.overviewList(data)
    if (res && res.code === 1) return res.result
  },
  async overviewTaskList ({commit}, data) {
    const res = await service.overviewTaskList(data)
    if (res && res.code === 1) return res.result
  }
}

const mutations = {
}

const getters = {
}

export default ({
  state,
  actions,
  mutations,
  getters
})
