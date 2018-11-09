import axios from './axios'

// 初始化
export function init () {
  return axios.get('/initPage').then(res => res.data)
}

// 获取所有可访问的文件夹列表
export function foldList () {
  return axios.get(`/common/getAllFolderList`).then(res => res.data)
}

// 获取可以操作的文件夹
export function actionFold () {
  return axios.get(`/common/getActionFolderList`).then(res => res.data)
}

// 搜索文件或文件夹
export function searchFold (data) {
  return axios.get(`/common/search`, {params: data}).then(res => res.data)
}

// 获取文件夹下的文件
export function fileList (data) {
  return axios.get(`/common/getFileList`, {params: data}).then(res => res.data)
}

// 重命名文件夹
export function renameFile (data) {
  return axios.post(`/common/renameFile`, data).then(res => res.data)
}

// 删除文件
export function deleteFile (data) {
  return axios.post(`/common/deleteFile`, data).then(res => res.data)
}

// 复制/移动文件/文件夹
export function copyFile (data) {
  return axios.post(`/common/copyFile`, data).then(res => res.data)
}

// 新建文件夹
export function addFile (data) {
  return axios.post(`/common/addFolder`, data).then(res => res.data)
}

// 重命名文件夹
export function renameFolder (data) {
  return axios.post(`/common/renameFolder`, data).then(res => res.data)
}

// 获取回收站文件列表
export function recycleList (data) {
  return axios.get(`/manager/getRecycleList`, { params: data }).then(res => res.data)
}

// 还原文件/文件夹
export function restoreFile (data) {
  return axios.post(`/manager/restoreFile`, data).then(res => res.data)
}

// 批量删除文件/文件夹
export function foreverDeleteFile (data) {
  return axios.post(`/manager/deleteFile`, data).then(res => res.data)
}

// 清空回收站
export function deleteAllFile () {
  return axios.post(`/manager/deleteAllFile`).then(res => res.data)
}

// 操作记录列表
export function getRecord (data) {
  return axios.get(`/manager/getLogList`, {params: data}).then(res => res.data)
}

// 数据统计
export function statistics (data) {
  return axios.get(`/manager/statistics`, {params: data}).then(res => res.data)
}

// 获取阻止架构的人
export function userList () {
  return axios.get(`/common/userList`).then(res => res.data)
}

// 文件授权
export function updateFolder (data) {
  return axios.post(`common/updateFolder`, data).then(res => res.data)
}

// 获取文件权限信息
export function getFolderUser (data) {
  return axios.get('/common/getFolderUser', { params: data }).then(res => res.data)
}
