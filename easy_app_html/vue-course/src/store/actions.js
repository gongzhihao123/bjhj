import * as type from './mutations-type'
import axios from 'axios'
import router from '../router'

export const init = ({ commit }) => {
  axios.get(`/common/initPage`)
  .then(res => {
    // console.log(res)
    // 您没有【走班排课】访问/操作权限，请联系管理员
    if (res.data.code === 1) {
      if (!res.data.result.loginUser || !res.data.result.loginUser.rights || res.data.result.loginUser.rights.length === 0) {
        alert('您没有【走班排课】访问/操作权限，请联系管理员')
        let path = document.querySelector('#contextPath').value
        window.location.href = `${path}/logout`
      }
      commit(type.INIT, { ...res.data.result })
      const href = window.location.href
      let url = href.slice(href.indexOf('#') + 1)
      if (url === '/') url = '/'
      router.replace(url)
    } else if (res.data.code === -2) {
      // let path = document.querySelector('#contextPath').value
      // window.location.href = `/sso/login`
    } else if (res.data.code === -3) {
      alert('您没有权限，请联系管理员')
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/logout`
    }
  })
}
export const semesterId = ({ commit }, a) => {
  commit(type.SEMESTERID, a)
}
export const section = ({ commit }, a) => {
  commit(type.SECTION, a)
}
