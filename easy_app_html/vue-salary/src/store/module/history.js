/**
 * 这是历史管理
 */
import service from '@/api/index'
import { error } from '@/utils/handle'

const state = {
  historyDate: [],
  createdTime: '',
  publishTime: '',
  remark: '',
  payroll: '',
  month: '',
  historyId: '',
  messageTime: '',
  preserV: ''
}

const actions = {
  // 查询历史人员
  async enquiries ({ commit }, data) {
    const res = await service.enquiries(data)
    if (res && res.code === 1) commit('ENQUIRIES', res.result)
    else error(res.message)
  },
  // 撤回 或 重新发送
  async withdraw ({ commit }, data) {
    const res = await service.withdraw(data)
    if (res && res.code === 1) commit('WITHDRAW', res.result)
    else error(res.message)
  },
  // 保存用户信息
  async preservation ({ commit }, data) {
    const res = await service.preservation(data)
    if (res && res.code === 1) commit('PRESERVATION', res.message)
    else error(res.message)
  },
  // 删除工资表
  async dele ({ commit }, data) {
    const res = await service.dele(data)
    if (res && res.code === 1) commit('DELE', res.result)
    else error(res.message)
  },
  // 查看工资列表
  async search ({commit}) {
    const res = await service.search()
    if (res && res.code === 1) commit('SEARCH', res.result)
    else error(res.message)
  },
  // 定时发送历史
  async historyTime ({commit}, data) {
    const res = await service.HistorytTiming(data)
    if (res && res.code === 1) commit('HISTORYTIME', [res.message, data.publishTime])
    else error(res.message)
  }
}

const mutations = {
  ENQUIRIES (state, res) {
    if (res) {
      state.historyId = res.id
      state.createdTime = res.createdTime
      state.publishTime = res.publishTime
      state.historyDate = res.salaryUserList
      state.remark = res.remark
      state.payroll = res.id
    } else {
      state.historyDate = []
    }
  },
  WITHDRAW (state, res) {
  },
  PRESERVATION (state, res) {
    state.preserV = res
  },
  DELE (state, res) {
  },
  SEARCH (state, res) {
    state.month = res
  },
  HISTORYTIME (state, res) {
    state.publishTime = res[1]
    state.messageTime = res[0]
  }
}

export default {
  state,
  actions,
  mutations
}
