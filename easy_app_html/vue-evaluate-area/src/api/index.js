// import querystring from 'querystring'

/**
 * 错误信息
 *
 * @export
 * @param {object} _this 作用域对象
 * @param {string} message 提示信息
 * @param {number} time 持续时间
 */
export function notice (_this, message, time) {
  if (message === 'None') message = '您没有操作权限'
  _this.$notify({
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
  _this.$notify({
    title: '提示',
    message: message,
    type: 'success',
    duration: time
  })
}

/**
 * 超时跳转
 *
 * @export
 * @param {object} _this
 */
export function error (_this) {
  _this.$alert('您还没有登录，请登录后继续操作', '错误', {
    confirmButtonText: '确认',
    type: 'warning'
  }).then(() => {
    window.location.href = `/evaluate`
  })
}
