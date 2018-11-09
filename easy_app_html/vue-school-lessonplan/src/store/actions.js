import * as type from './mutations-type'
import axios from 'axios'
import router from '../router'

export const init = ({ commit }, { url }) => {
  axios.get('/common/initPage')
  .then(response => {
    // console.log(response)
    if (response.data.code === -2) {
      window.location.href = `/lessonplan`
    } else if (response.data.code === 1) {
      commit(type.INIT, {
        code: response.data.code,
        user: response.data.result
      })
      router.replace(url)
    }
  })
  .catch(error => console.log(error))
}

// export const logOut = ({ commit }, { path }) => {
//   commit(type.LOGOUT, path)
// }

// export const changeDefault = ({ commit }, { path }) => {
//   commit(type.DEFAULT, path)
// }

// export const changeEdit = ({ commit }, para) => {
//   commit(type.EDIT, para)
// }

// export const clearEdit = ({commit}) => {
//   commit(type.CLEAREDIT)
// }
