import service from '@/api/index'
import { error, success } from '@/utils/index'
const state = {
}

const actions = {
  async taskList ({commit}, data) {
    const res = await service.taskList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async taskAdd ({commit}, data) {
    const res = await service.taskAdd(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async taskDel ({commit}, data) {
    const res = await service.taskDel(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  async taskEdit ({commit}, data) {
    const res = await service.taskEdit(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  async taskState ({commit}, data) {
    const res = await service.taskState(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  async unlockedTaskList ({commit}, data) {
    const res = await service.unlockedTaskList(data)
    if (res && res.code === 1) {
      return res.result
    } else error(res.message)
  },
  async getUser ({commit}, data) {
    const res = await service.getUser(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async addTaskChild ({commit}, data) {
    const res = await service.addTaskChild(data)
    if (res && res.code === 1) {
      success('新建成功')
      return res.result
    } else error(res.message)
  },
  async chargeLabelList ({commit}, data) {
    const res = await service.chargeLabelList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async chargeList ({commit}, data) {
    const res = await service.chargeList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async editTaskChild ({commit}, data) {
    const res = await service.editTaskChild(data)
    if (res && res.code === 1) {
      success('编辑成功')
      return res.result
    } else error(res.message)
  },
  async taskChildDetail ({commit}, data) {
    const res = await service.taskChildDetail(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  // 详情页
  async taskChildFeedback ({commit}, data) {
    const res = await service.taskChildFeedback(data)
    if (res && res.code === 1) {
      success(res.message)
      return res.result
    } else error(res.message)
  },
  // 我参与的子任务
  async participateList ({commit}, data) {
    const res = await service.participateList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async participateLabelList ({commit}, data) {
    const res = await service.participateLabelList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  // 任务总览
  async overviewTaskChildDetail ({commit}, data) {
    const res = await service.overviewTaskChildDetail(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async overviewList ({commit}, data) {
    const res = await service.overviewList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
  },
  async overviewTaskList ({commit}, data) {
    const res = await service.overviewTaskList(data)
    if (res && res.code === 1) return res.result
    else error(res.message)
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
