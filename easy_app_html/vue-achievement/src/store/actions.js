import * as type from './mutations-type'
import axios from 'axios'
import router from '../router'

export const init = ({ commit }) => {
  axios.get(`/common/initPage?mobile=1`)
  .then(res => {
    if (res.data.code === 1) {
      if (res.data.result.loginUser.userType === 2) {
        commit(type.INIT, { ...res.data.result })
        router.replace('/student')
        return
      }
      if (!res.data.result.leftMenu) {
        alert('您没有权限，请联系管理员')
        let path = document.querySelector('#contextPath').value
        window.location.href = `${path}/logout`
      }
      commit(type.INIT, { ...res.data.result })
      const href = window.location.href
      let url = href.slice(href.indexOf('#') + 1)
      if (url === '/') {
        let item = res.data.result.leftMenu[0]
        if (item.name === '规则管理') {
          url = '/rule'
        } else if (item.name === '知识点管理') {
          url = '/knowledge'
        } else if (item.name === '考试管理') {
          url = '/exam'
        } else if (item.name === '成绩分析') {
          url = '/achievement'
        } else if (item.name === '权限管理') {
          url = '/right'
        }
      }
      router.replace(url)
    } else if (res.data.code === -2) {
      // let path = document.querySelector('#contextPath').value
      window.location.href = `/sso/login`
    } else if (res.data.code === -3) {
      alert('您没有权限，请联系管理员')
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/logout`
    }
  })
}

export const getMenu = ({ commit }, id) => {
  axios.get(`/common/examManageMenu?examId=${id}`)
  .then(res => {
    if (res.data.code === 1) {
      commit(type.GETMENU, res.data.result)
      console.log(res.data.result)
      return res.data.result
    } else {}
  })
}
