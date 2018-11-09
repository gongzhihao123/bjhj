import * as type from './mutations-type'
import axios from 'axios'
// import router from '../router'

export const init = ({ commit }) => {
  axios.get(`/common/initPage`)
  .then(res => {
    if (res.data.code === 1) {
      commit(type.INIT, { ...res.data.result })
    } else if (res.data.code === -2) {
      window.location.href = `/sso/login`
    }
  })
}

