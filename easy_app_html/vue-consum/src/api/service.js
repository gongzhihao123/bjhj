import axios from './axios'
// 页面初始化
export function init () {
  return axios.get('/common/initPage').then((res) => res.data)
}

// 资产列表
export function assetList (data) {
  return axios.get('/consum', { params: data }).then((res) => res.data)
}
export function assetType () {
  return axios.get('/consum/type').then((res) => res.data)
}
export function assetAdd (data) {
  return axios.post('/consum', data).then((res) => res.data)
}
export function assetDel (data) {
  return axios.delete(`/consum?consumId=${data.id}`).then((res) => res.data)
}
export function assetDetail (data) {
  return axios.get(`/consum/detail`, { params: data }).then((res) => res.data)
}
export function assetEdit (data) {
  return axios.put(`/consum`, data).then((res) => res.data)
}
export function totalOperation (data) {
  return axios.post(`/consum/storage`, data).then((res) => res.data)
}
export function returnList (data) {
  return axios.get(`/consum/borrow`, { params: data }).then((res) => res.data)
}
export function getUser () {
  return axios.get(`/consum/user`).then((res) => res.data)
}
export function inStorage (data) {
  return axios.get(`/consum/inStorage`, { params: data }).then((res) => res.data)
}
export function outStorage (data) {
  return axios.get(`/consum/outStorage`, { params: data }).then((res) => res.data)
}
// 资产流水管理
export function streamList (data) {
  return axios.get(`/stream`, { params: data }).then((res) => res.data)
}

// 资产类型
export function deptUserList (data) { // 获取人
  return axios.get(`/common/user`, { params: data }).then((res) => res.data)
}
export function typeList (data) {
  return axios.get(`/type`, { params: data }).then((res) => res.data)
}
export function typeAdd (data) {
  return axios.post(`/type`, data).then((res) => res.data)
}
export function typeDel (data) {
  return axios.delete(`/type?typeId=${data.id}`).then((res) => res.data)
}
export function typeManager (data) {
  return axios.post('/type/manager', data).then((res) => res.data)
}
// 领用详情
export function teacher (data) {
  return axios.get(`/teacher`, { params: data }).then((res) => res.data)
}
export function teacherBorrow () {
  return axios.get(`/teacher/borrow`).then((res) => res.data)
}
export function teacherType (data) {
  return axios.get(`/teacher/type`, { params: data }).then((res) => res.data)
}
// 统计管理
export function statistics (data) {
  return axios.get(`/statistics`, { params: data }).then((res) => res.data)
}
// 获取年级
export function getGrade (data) {
  return axios.get('/common/selectGradeClassList', { params: data }).then((res) => res.data)
}
