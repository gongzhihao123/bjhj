import * as type from './mutations-type'
import router from '../router'

export default {

  [type.INIT] (state, { user, url }) {
    if (user.loginUser.userRole === 3) {
      router.replace(url === '/' ? '/record/supervisionRecord' : url)
    } else {
      router.replace(url === '/' ? '/index' : url)
    }
    state.leftmenu = user.rights
    state.user = user.loginUser
    state.staticUrl = user.rootUrl + user.previewInterface
    state.userType = user.userType
    state.previewUrl = user.previewUrl
    state.rootUrl = user.rootUrl
    state.schoolYear = user.schoolYear
    state.leaderFlag = user.leaderFlag
    state.previewInterface = user.previewInterface
    state.areaId = user.areaId
  }
}
