import axios from './axios'
// 页面初始化
export function init () {
  return axios.get('/common/initPage').then((res) => res.data)
}
// 获取学期
export function getPeroid () {
  return axios.get('/common/selectSemesterList').then((res) => res.data)
}

// 获取学段
export function getSection () {
  return axios.get('/common/sectionList').then((res) => res.data)
}

// 获取年级
export function getGrade (data) {
  return axios.get('/common/selectGradeClassList', { params: data }).then((res) => res.data)
}

// 获取科目
export function getSubject () {
  return axios.get('/common/selectCourseList').then((res) => res.data)
}

// 获取微课广场列表
export function getCourseList (data) {
  return axios.get('/squareMicrocourse/squareMicrocoursePage', { params: data }).then((res) => res.data)
}

// 获取我的列表
export function getMyList (data) {
  return axios.get('/myMicrocourse/myMicrocoursePage', { params: data }).then((res) => res.data)
}
// 获取功能设置审核人
export function getDetail () {
  return axios.get('common/selectDeptUserList').then((res) => res.data)
}

// 获取已选的审批人
export function getChecked () {
  return axios.get('common/selectCheckUserList').then((res) => res.data)
}
// 获取功能设置列表
export function getNumber () {
  return axios.get('/setMicrocourse/setMicrocourseDetail').then((res) => res.data)
}

// 保存功能设置
export function saveSet (data) {
  return axios.post('/setMicrocourse/setMicrocourseSave', data).then((res) => res.data)
}

// 保存微课
export function saveCourse (data) {
  return axios.post('/myMicrocourse/myMicrocourseSave', data).then((res) => res.data)
}

// 删除微课
export function deleteCourse (data) {
  return axios.post('/myMicrocourse/myMicrocourseDelete', data).then((res) => res.data)
}

// 发布/取消发布
export function publishCourse (data) {
  return axios.post('/myMicrocourse/myMicrocoursePublic', data).then((res) => res.data)
}

// 获取微课详情
export function getCourse (data) {
  return axios.get('/common/selectMicrocourseDetail', { params: data }).then((res) => res.data)
}

// 修改微课
export function editCourse (data) {
  return axios.post('/myMicrocourse/myMicrocourseEdit', data).then((res) => res.data)
}

// 微课审核列表
export function CourseList (data) {
  return axios.get('/checkMicrocourse/checkMicrocoursePage', { params: data }).then((res) => res.data)
}

// 微课管理，删除微课
export function DeleteCourse (data) {
  return axios.post('/checkMicrocourse/checkMicrocourseDelete', data).then((res) => res.data)
}

// 获取评论列表
export function getComment (data) {
  return axios.get('/squareMicrocourse/squareMicrocourseCommentList', { params: data }).then((res) => res.data)
}

// 删除用户评论
export function deleteComment (data) {
  return axios.post('/squareMicrocourse/squareMicrocourseCommentDelete', data).then((res) => res.data)
}

// 保存评论
export function saveComment (data) {
  return axios.post('/squareMicrocourse/squareMicrocourseCommentSave', data).then((res) => res.data)
}
// 审批
export function CheckCourse (data) {
  return axios.post('/checkMicrocourse/checkMicrocourseCheck', data).then((res) => res.data)
}
// 微课广场查看微课详情
export function squareDetail (data) {
  return axios.get('/squareMicrocourse/squareMicrocourseDetail', { params: data }).then((res) => res.data)
}

// 获取审批人
export function getCheckUser () {
  return axios.get('/common/selectCheckUserList').then((res) => res.data)
}
