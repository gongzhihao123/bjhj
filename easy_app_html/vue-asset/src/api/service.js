import axios from './axios'
// 页面初始化
export function init () {
  return axios.get('/common/initPage').then((res) => res.data)
}

// 资产列表
export function assetList (data) {
  return axios.get('/asset', { params: data }).then((res) => res.data)
}
export function assetType (data) {
  return axios.get('/asset/type').then((res) => res.data)
}
export function assetAdd (data) {
  return axios.post('/asset', data).then((res) => res.data)
}
export function assetDel (data) {
  return axios.delete(`/asset?assetId=${data.id}`).then((res) => res.data)
}
export function assetDetail (data) {
  return axios.get(`/asset/detail`, { params: data }).then((res) => res.data)
}
export function assetEdit (data) {
  return axios.put(`/asset`, data).then((res) => res.data)
}
// 入库
export function putIn (data) {
  return axios.post(`/asset/in`, data).then((res) => res.data)
}
// 报废
export function putOut (data) {
  return axios.post(`/asset/out`, data).then((res) => res.data)
}
// 领用
export function borrow (data) {
  return axios.post(`/asset/borrow`, data).then((res) => res.data)
}
// 领用列表
export function backList (data) {
  return axios.get(`/asset/back`, { params: data }).then((res) => res.data)
}
// 归还
export function back (data) {
  return axios.post(`/asset/back`, data).then((res) => res.data)
}
// 该资产下所有的资产
export function all (data) {
  return axios.get(`/asset/all`, { params: data }).then((res) => res.data)
}
// 入库、报废、领用、归还四合一
export function totalOperation (data) {
  return axios.post(`/asset/storage`, data).then((res) => res.data)
}
export function returnList (data) {
  return axios.get(`/asset/borrow`, { params: data }).then((res) => res.data)
}
export function getUser (data) {
  return axios.get(`/asset/user`).then((res) => res.data)
}
export function inStorage (data) {
  return axios.get(`/asset/inStorage`, { params: data }).then((res) => res.data)
}
export function outStorage (data) {
  return axios.get(`/asset/scrap`, { params: data }).then((res) => res.data)
}

// 领用详情管理
export function statistic (data) {
  return axios.get(`/statistic`, { params: data }).then((res) => res.data)
}

// 资产流水管理
export function streamList (data) {
  return axios.get(`/stream`, { params: data }).then((res) => res.data)
}

// 资产类型
export function typeList (data) {
  return axios.get(`/type`, { params: data }).then((res) => res.data)
}
export function typeAdd (data) {
  return axios.post(`/type`, data).then((res) => res.data)
}
export function typeDel (data) {
  return axios.delete(`/type?typeId=${data.id}`).then((res) => res.data)
}
export function companyCode (data) {
  return axios.get(`/type/companyCode`).then((res) => res.data)
}
export function companyCodeEdit (data) {
  return axios.post(`/type/companyCode`, data).then((res) => res.data)
}

// 领用详情
export function teacher (data) {
  return axios.get(`/teacher`, { params: data }).then((res) => res.data)
}
export function teacherBorrow (data) {
  return axios.get(`/teacher/borrow`, { params: data }).then((res) => res.data)
}
