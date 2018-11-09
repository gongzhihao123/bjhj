import service from './../../api/index'
import { error, success } from './../../utils/handle'

const state = {
  recycleList: '',
  beforeRecycleList: ''
}

const actions = {
  // 获取文件列表
  async getRecye ({commit}, data) {
    const res = await service.recycleList(data)
    if (res && res.code === 1) commit('GETRECYE', res.result)
    else error(res.message)
  },
  // 彻底删除文件
  async thoroughly ({commit}, data) {
    const res = await service.foreverDeleteFile(data)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  // 还原文件
  async reduction ({commit}, data) {
    const res = await service.restoreFile(data)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  // 清空回收站
  async empty ({commit}) {
    const res = await service.deleteAllFile()
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  // 筛选
  searchRecycle ({commit}, data) {
    commit('SEARCHRECYCLE', data)
  }
}

const mutations = {
  GETRECYE (state, data) {
    state.recycleList = data
    state.beforeRecycleList = data.list
  },
  SEARCHRECYCLE (state, data) {
    if (data !== '') {
      let retrieve = []
      retrieve = state.recycleList.list.filter(item => item.name.indexOf(data) !== -1)
      state.recycleList.list = retrieve
    } else {
      state.recycleList.list = state.beforeRecycleList
    }
  }
}

export default {
  state,
  actions,
  mutations
}
