import axios from './axios'
// 页面初始化
export function init () {
  return axios.get('/common/initPage').then((res) => res.data)
}
export function chargeLabelList (data) {
  return axios.get(`/charge/taskList`).then((res) => res.data)
}
export function chargeList (data) {
  return axios.get(`/charge/list`, { params: data }).then((res) => res.data)
}
export function getUser (data) {
  return axios.get(`/charge/user`).then((res) => res.data)
}
export function addTaskChild (data) {
  return axios.post(`/charge/addTaskChild`, data).then((res) => res.data)
}
export function unlockedTaskList (data) {
  return axios.get(`/charge/unlockedTaskList`).then((res) => res.data)
}
// 详情页
export function taskChildDetail (data) {
  return axios.get(`/charge/taskChildDetail`, { params: data }).then((res) => res.data)
}
export function taskChildFeedback (data) {
  return axios.post(`/participate/taskChildFeedback`, data).then((res) => res.data)
}
// 我参与的子任务
export function participateList (data) {
  return axios.get(`/participate/list`, { params: data }).then((res) => res.data)
}
export function participateLabelList (data) {
  return axios.get(`/participate/taskList`).then((res) => res.data)
}
// 任务总览
export function overviewList (data) {
  return axios.get(`/overview/list`, { params: data }).then((res) => res.data)
}
export function overviewTaskList (data) {
  return axios.get(`/overview/taskList`).then((res) => res.data)
}
