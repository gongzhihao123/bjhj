import ax from './axios'
// 工资详情
export function historyList (data) {
  return ax.get(`common/historySalaryDetails?t=${new Date().getTime()}`, {
    params: {
      salaryUserId: data
    }
  }).then(res => res.data)
}
// 历史工资单
export function history () {
  return ax.get('common/historySalaryList').then(res => res.data)
}

export function indexDetail () {
  return ax.get('common/newSalaryDetails').then(res => res.data)
}
