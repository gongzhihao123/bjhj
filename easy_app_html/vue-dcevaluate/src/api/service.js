import axios from './axios'
import * as config from './../config'

// 初始化系统
export function init () {
  return axios.get('initPage').then(res => res.data)
}

// 获取我可以作答的民主测评
export function getMyEvalList () {
  return axios.get('eval/getMyEvalList').then(res => res.data)
}

// 获取我可以作答的民主测评
export function getMyEvalDetail (evalId) {
  return axios.get('eval/getMyEvalQuestion', {params: {evalId: evalId}}).then(res => res.data)
}

// 作答民主测评
export function postMyEvalResult (data) {
  return axios.post('eval/answerQuestion', data).then(res => res.data)
}

// 退出系统
export function logout () {
  window.location.href = config.contentPath + '/logout'
}

// 获取本单位发布的民主测评
export function getAllEvalList (pageNo, pageSize, state, keyword) {
  return axios.get('manager/getAllEvalList', {params: {pageNo: pageNo, pageSize: pageSize, state: state, keyword: keyword}}).then(res => res.data)
}

// 获取模板列表
export function getTemplateList () {
  return axios.get('manager/getTemplateList', {params: {}}).then(res => res.data)
}

// 获取编辑发布测评第一步民主测评基本信息
export function getEvalStepOne (id) {
  return axios.get('manager/getEvalStepOne', {params: {id: id}}).then(res => res.data)
}

// 发布测评第一步
export function addEvalStepOne (id, name, tempId) {
  return axios.post('manager/addEvalStepOne', {id: id, name: name, tempId: tempId}).then(res => res.data)
}

// 获取参与单位信息
export function getEvalCompanyList (id) {
  return axios.get('manager/getEvalCompanyList', {params: {id: id}}).then(res => res.data)
}

// 新增测评单位
export function addEvalCompany (evalId, companyId, companyName, names) {
  return axios.post('manager/addEvalCompany', {evalId: evalId, companyId: companyId, companyName: companyName, names: names}).then(res => res.data)
}

// 删除测评单位
export function deleteEvalCompany (ecId) {
  return axios.post('manager/deleteEvalCompany', {ecId: ecId}).then(res => res.data)
}

// 设置被测评人
export function updateEvalEvaluator (ecId, names) {
  return axios.post('manager/updateEvalEvaluator', {ecId: ecId, names: names}).then(res => res.data)
}

// 设置参与测评人
export function updateEvalUser (ecId, state, users) {
  return axios.post('manager/updateEvalUser', {ecId: ecId, state: state, users: users}).then(res => res.data)
}

// 获取已经设置参与测评人
export function getUpdateEvalUser (ecId) {
  return axios.get('manager/getUpdateEvalUser', {params: {ecId: ecId}}).then(res => res.data)
}

// 发布测评
export function publishEval (id) {
  return axios.post('manager/publishEval', {id: id}).then(res => res.data)
}

// 关闭测评
export function closeEval (id) {
  return axios.post('manager/closeEval', {id: id}).then(res => res.data)
}

// 删除测评
export function deleteEval (id) {
  return axios.post('manager/deleteEval', {id: id}).then(res => res.data)
}

// 获取测评表格数据
export function getEvalQuestion (ecId) {
  return axios.get('manager/getEvalQuestion', { params: {ecId: ecId} }).then(res => res.data)
}

// 获得单位列表
export function getCompanyList () {
  return axios.get('commmon/getChildCompanyList').then(res => res.data)
}

// 获取单位人员
export function getCompanyDeptUser (companyId) {
  return axios.get('commmon/getCompanyDeptUser', {params: {'companyId': companyId}}).then(res => res.data)
}
