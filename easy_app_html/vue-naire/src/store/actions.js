import * as type from './mutations-type'
import axios from 'axios'
import router from '../router'

export const init = ({ commit }) => {
  axios.get(`/common/initPage`)
  .then(res => {
    if (res.data.code === 1) {
      commit(type.INIT, { ...res.data.result })
      const href = window.location.href
      let url = href.slice(href.indexOf('#') + 1)
      if (url === '/') url = '/index'
      router.replace(url)
    } else if (res.data.code === -2) {
      // let path = document.querySelector('#contextPath').value
      // window.location.href = `/sso/login?redirectUrl=/naire`
      window.location.href = res.data.result
    } else if (res.data.code === -3) {
      alert('您没有权限，请联系管理员')
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/logout`
    }
  })
}
