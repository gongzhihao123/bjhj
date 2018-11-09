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
export function error () {
  // let path = document.querySelector('#contextPath').value
  window.location.href = `/sso/login`
}

export function logout () {
  let path = document.querySelector('#contextPath').value
  window.location.href = `${path}/logout`
}
