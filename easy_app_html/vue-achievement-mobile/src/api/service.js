import axios from './axios'

export function init (params) {
  return axios.get('/common/initPage', { params })
    .then(res => res.data)
}

export function getSemester (params) {
  return axios.get('/common/semesterList', { params })
    .then(res => res.data)
}

export function getExam (params) {
  return axios.get('/examScoreQuery/examMobileList', { params })
    .then(res => res.data)
}

export function getScore (params) {
  return axios.get('/examScoreQuery/scoreMobileDetail', { params })
    .then(res => res.data)
}
