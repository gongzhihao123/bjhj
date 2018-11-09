/**
 *
 * @export
 * @param {any} time 输入需要转化的时间参数
 * @param {any} format 需要转化的格式
 * @returns 返回处理后的时间格式
 */
export function dateFormat (time, format) {
  if (!time) return null
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
 * 更改裁剪图片地址
 *
 * @export
 * @param {string} url 需要处理的url地址
 * @param {string} width 宽
 * @param {string} height 高
 * @param {boolean} r 是否需要推荐样式
 * @param {boolean} si 是否需要水印
 * @returns 经过处理后的 url 地址
 */
export function cutImg (url, width, height, r, si) {
  if (!url) return
  let baseUrl = ''
  if (r) baseUrl += 'r_'
  if (si) baseUrl += 'si_'
  if (width) baseUrl += `w${width}_`
  if (height) baseUrl += `h${height}_`
  const ind = url.lastIndexOf('/') + 1
  return url.slice(0, ind) + baseUrl + url.slice(ind)
}
