import ax from './axios'

// 查看历史记录
export function enquiries (data) {
  return ax.get('manager/selectSalaryUserByMonth', {
    params: data
  }).then(res => res.data)
}
// 及时发送和定时发送
export function timeNote (data) {
  return ax.post('manager/publishSalary', data).then(res => res.data)
}
// 撤回和现在立即发送
export function withdraw (data) {
  return ax.post('manager/updateSalaryUserState', data).then(res => res.data)
}
// 保存用户信息
export function preservation (data) {
  return ax.post('manager/updateSalaryUserById', data).then(res => res.data)
}
// 删除用户工资单
export function dele (data) {
  return ax.post('manager/deleteSalary', data).then(res => res.data)
}
// 页面初始化
export function started () {
  return ax.get('common/initPage').then(res => res.data)
}
// 查询工资列表
export function search () {
  return ax.get('manager/selectSalaryList').then(res => res.data)
}
// 定时发送修改接口
export function HistorytTiming (data) {
  return ax.post('manager/updateSalaryPublishTime', data).then(res => res.data)
}
