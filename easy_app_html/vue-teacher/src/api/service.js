import axios from './axios'

// 首页
export function init () {
  return axios.get('/common/initPage').then(res => res.data)
}

export function logout () {
  return axios.get('/logout').then(res => res.data)
}

// 基础教师基础信息
export function getTeacher (parameter) {
  return axios.get('/teacher/teacherInfo', {params: parameter}).then(res => res.data)
}

// 保存教师基础信息
export function teacherInfoSave (parameter) {
  return axios.post('/teacher/teacherInfoSave', parameter).then(res => res.data)
}

// 教师工作经历
export function workList () {
  return axios.get('/teacher/teacherWorkExperienceList').then(res => res.data)
}

export function saveTeachList (parameter) {
  return axios.post('/teacher/teacherWorkExperienceSave', parameter).then(res => res.data)
}

export function deleTeachList (parameter) {
  return axios.post('/teacher/teacherWorkExperienceDelete', parameter).then(res => res.data)
}

// 学习经历
export function teachExperience (parameter) {
  return axios.get('/teacher/teacherQualificationsList', {params: parameter}).then(res => res.data)
}

export function delExperience (parameter) {
  return axios.post('/teacher/teacherQualificationsDelete', parameter).then(res => res.data)
}

export function teachExperienceSave (parameter) {
  return axios.post('/teacher/teacherQualificationsSave', parameter).then(res => res.data)
}

// 职称管理列表
export function getTeach () {
  return axios.get('/teacher/teacherTitleList').then(res => res.data)
}

export function saveTeach (parameter) {
  return axios.post('/teacher/teacherTitleSave', parameter).then(res => res.data)
}

export function delTeach (parameter) {
  return axios.post('/teacher/teacherTitleDelete', parameter).then(res => res.data)
}

// 个人发展规划
export function getPlan (parameter) {
  return axios.get('/teacher/teacherPlanDevelopmentList', {params: parameter}).then(res => res.data)
}

export function savePlan (parameter) {
  return axios.post('/teacher/teacherPlanDevelopmentSave', parameter).then(res => res.data)
}

export function delPlan (parameter) {
  return axios.post('/teacher/teacherPlanDevelopmentDelete', parameter).then(res => res.data)
}

// 教师工作计划
export function getWork (parameter) {
  return axios.get('/teacher/teacherWorkPlanList', {params: parameter}).then(res => res.data)
}

export function saveWork (parameter) {
  return axios.post('/teacher/teacherWorkPlanSave', parameter).then(res => res.data)
}

export function delWork (parameter) {
  return axios.post('/teacher/teacherWorkPlanDelete', parameter).then(res => res.data)
}

// 教师工作总结
export function getSummary (parameter) {
  return axios.get('/teacher/teacherWorkSummaryList', {params: parameter}).then(res => res.data)
}

export function saveSummary (parameter) {
  return axios.post('/teacher/teacherWorkSummarySave', parameter).then(res => res.data)
}

export function delSummary (parameter) {
  return axios.post('/teacher/teacherWorkSummaryDelete', parameter).then(res => res.data)
}

// 教师业务档案
export function getArchives (parameter) {
  return axios.get('/teacher/teacherArchivesList', {params: parameter}).then(res => res.data)
}

export function saveArchives (parameter) {
  return axios.post('/teacher/teacherArchivesSave', parameter).then(res => res.data)
}

export function delArchives (parameter) {
  return axios.post('/teacher/teacherArchivesDelete', parameter).then(res => res.data)
}

// 教师荣誉
export function getHonor (parameter) {
  return axios.get('/teacher/teacherHonorList', {params: parameter}).then(res => res.data)
}

export function saveHonor (parameter) {
  return axios.post('/teacher/teacherHonorSave', parameter).then(res => res.data)
}

export function delHonor (parameter) {
  return axios.post('/teacher/teacherHonorDelete', parameter).then(res => res.data)
}

// 市级/区级/园级骨干教师申请表
export function getApply (parameter) {
  return axios.get('/teacher/teacherBackboneApplyList', {params: parameter}).then(res => res.data)
}

export function saveApply (parameter) {
  return axios.post('/teacher/teacherBackboneApplySave', parameter).then(res => res.data)
}

export function delApply (parameter) {
  return axios.post('/teacher/teacherBackboneApplyDelete', parameter).then(res => res.data)
}

// 年度考评
export function getReview (parameter) {
  return axios.get('/teacher/teacherYearReviewList', {params: parameter}).then(res => res.data)
}

export function saveReview (parameter) {
  return axios.post('/teacher/teacherYearReviewSave', parameter).then(res => res.data)
}

export function delReview (parameter) {
  return axios.post('/teacher/teacherYearReviewDelete', parameter).then(res => res.data)
}

// 课题研究/活动记录
export function getRecord (parameter) {
  return axios.get('/teacher/teacherTopicActivityList', {params: parameter}).then(res => res.data)
}

export function saveRecord (parameter) {
  return axios.post('/teacher/teacherTopicActivitySave', parameter).then(res => res.data)
}

export function delRecord (parameter) {
  return axios.post('/teacher/teacherTopicActivityDelete', parameter).then(res => res.data)
}

// 论文发表
export function getPaper (parameter) {
  return axios.get('/teacher/teacherTopicPaperList', {params: parameter}).then(res => res.data)
}

export function savePaper (parameter) {
  return axios.post('/teacher/teacherTopicPaperSave', parameter).then(res => res.data)
}

export function delPaper (parameter) {
  return axios.post('/teacher/teacherTopicPaperDelete', parameter).then(res => res.data)
}

// 课题培训
export function getTrain (parameter) {
  return axios.get('/teacher/teacherTopicTrainList', {params: parameter}).then(res => res.data)
}

export function saveTrain (parameter) {
  return axios.post('/teacher/teacherTopicTrainSave', parameter).then(res => res.data)
}

export function delTrain (parameter) {
  return axios.post('/teacher/teacherTopicTrainDelete', parameter).then(res => res.data)
}

// 课题培训
export function getStudy (parameter) {
  return axios.get('/teacher/teacherGooutStudyList', {params: parameter}).then(res => res.data)
}

export function saveStudy (parameter) {
  return axios.post('/teacher/teacherGooutStudySave', parameter).then(res => res.data)
}

export function delStudy (parameter) {
  return axios.post('/teacher/teacherGooutStudyDelete', parameter).then(res => res.data)
}

// 教师管理
export function getTeacherList (parameter) {
  console.log(parameter)
  return axios.get('/teacher/managerTeacherList', {params: parameter}).then(res => res.data)
}

export function teacherState (parameter) {
  return axios.post('/teacher/managerTeacherCheck', parameter).then(res => res.data)
}

export function teacherDetail (parameter) {
  return axios.get('/teacher/managerTeacherDatail', {params: parameter}).then(res => res.data)
}
