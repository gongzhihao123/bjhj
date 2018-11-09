export function notice (_this, message, time) {
  if (message === 'None') message = '您没有操作权限'
  _this.$message({
    title: '错误',
    message: message,
    type: 'warning',
    duration: time
  })
}

/**
 * 成功信息
2 *
 * @export
 * @param {object} _this 作用域对象
 * @param {string} message 提示信息
 * @param {number} time 持续时间
 */
export function success (_this, message, time) {
  _this.$message({
    title: '提示',
    message: message,
    type: 'success',
    duration: time
  })
}

export function error (_this) {
  alert('您没有权限，请联系管理员')
  window.location.href = `/sso/login?redirectUrl=/naire`
}
