import Vue from 'vue'
import Vuex from 'vuex'
import service from './../api/index'
import {success, error} from './../utils/handle'
import planning from './planning/index'
import plan from './plan/index'
import archives from './archives/index'
import honor from './honor/index'
import apply from './apply/index'
import appraisal from './appraisal/index'
import research from './research/index'
import study from './training/index'
import teachers from './teachers/index'

Vue.use(Vuex)

const state = {
  user: '',
  teacherInfo: '',
  leanList: '',
  experienceList: '',
  jobList: ''
}

const actions = {
  async init ({commit}) {
    const res = await service.init()
    if (res && res.code === 1) commit('INIT', res.result)
    else error(res.message)
  },
  async logout ({commit}) {
    const res = await service.logout()
    if (res && res.code === 1) commit('LOGOUT')
  },
  async changePwd ({commit}, parameter) {
    const res = await service.changePwd(parameter)
    if (res && res.code === 1) success('修改成功')
  },
  async TeachInfo ({commit}, parameter) {
    const res = await service.getTeacher(parameter)
    if (res && res.code === 1) commit('TEACHINFO', res.result)
    else error(res.message)
  },
  async saveTeachInfo ({commit}, parameter) {
    const res = await service.teacherInfoSave(parameter)
    if (res && res.code === 1) success('保存成功 正在审核')
    else error(res.message)
  },
  async getLearnList ({commit}, parameter) {
    const res = await service.teachExperience(parameter)
    if (res && res.code === 1) commit('GETLEARNLIST', res.result)
    else error(res.message)
  },
  async addLearn ({commit}, parameter) {
    const res = await service.teachExperienceSave(parameter)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  async delLearn ({commit}, parameter) {
    const res = await service.delExperience(parameter)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  async getExperience ({commit}) {
    const res = await service.workList()
    if (res && res.code === 1) commit('GETLEXPERIENCE', res.result)
    else error(res.message)
  },
  async saveExperience ({commit}, parameter) {
    const res = await service.saveTeachList(parameter)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  async delExperience ({commit}, parameter) {
    const res = await service.deleTeachList(parameter)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  async getTeach ({commit}) {
    const res = await service.getTeach()
    if (res && res.code === 1) commit('GETTEACH', res.result)
    else error(res.message)
  },
  async saveTeach ({commit}, parameter) {
    const res = await service.saveTeach(parameter)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  async delTeach ({commit}, parameter) {
    const res = await service.delTeach(parameter)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  }
}

const mutations = {
  INIT (state, data) {
    state.user = data
  },
  LOGOUT (state, data) {
    state.user = ''
  },
  TEACHINFO (state, data) {
    state.teacherInfo = data
  },
  GETLEARNLIST (state, data) {
    state.leanList = data
  },
  GETLEXPERIENCE (state, data) {
    state.experienceList = data
  },
  GETTEACH (state, data) {
    state.jobList = data
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    planning,
    plan,
    archives,
    honor,
    apply,
    appraisal,
    research,
    study,
    teachers
  }
})
