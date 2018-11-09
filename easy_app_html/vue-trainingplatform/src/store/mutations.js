import * as type from './mutations-type'
// import router from '../router'

export default {

  [type.INIT] (state, { user }) {
    state.leftmenu = user.rights
    state.user = user.loginUser
    state.staticUrl = user.rootUrl + user.previewInterface
    state.userType = user.userType
    state.previewUrl = user.previewUrl
    // window.localStorage.setItem('TRAININGPLATFORM_USER', JSON.stringify(null))
    // window.localStorage.setItem('TRAININGPLATFORM_LEFTMENU', JSON.stringify(state.leftmenu))
  }
}
