/**
 *
 * @export
 * @param {any} time 输入需要转化的时间参数
 * @param {any} format 需要转化的格式
 * @returns 返回处理后的时间格式
 */
export function format (time, format) {
  // if (!time) return null
  var date = new Date(time)
  var o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    'S': date.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

/**
 * @export
 * @param { number } size 输入转换的参数
 * @return 返回处理后的时间格式
 */

export function SizeOf (size) {
  if (size < 1024) {
    return size + 'B'
  } else if (size >= 1024 && size < 1024 * 1024) {
    return parseInt(size / 1024) + 'KB'
  } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
    return parseInt(size / 1024 / 1024) + 'MB'
  } else if (size >= 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024) {
    return parseInt(size / 1024 / 1024 / 1024) + 'GB'
  } else if (size > 1024 * 1024 * 1024 * 1024 * 1024) {
    return parseInt(size / 1024 / 1024 / 1024 / 1024) + 'TB'
  }
}
