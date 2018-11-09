/**
 * 发送信息页面
 */
import { error } from '@/utils/handle'
import service from '@/api/index'

const state = {
  date: '9月工资将于2017-08-12 10:20进行发送！',
  routeSta: false,
  oneMore: 0,
  publishSelect: ''
}

const actions = {
  // 发送 或 定时发送
  async timeNow ({ commit }, data) {
    const res = await service.timeNote(data)
    if (res && res.code === 1) commit('TIMENOW', [data, res.result])
    else error(res.message)
  },
  change ({ commit }) {
    commit('CHANGE')
  }
}

const mutations = {
  TIMENOW (state, data) {
    console.log(data)
    if (data[0].publishTime) {
      state.date = '此工资单将于' + data[0].publishTime + '进行发送'
      state.oneMore = 2
      state.routeSta = true
    } else {
      state.oneMore = 1
      state.routeSta = true
    }
    state.publishSelect = data[1]
  },
  CHANGE () {
    state.oneMore = 0
  }
}

export default {
  state,
  actions,
  mutations
}
