import * as type from './mutations-type'
import router from '../router'

export default {

  [type.INIT] (state, { user, sectionList, semesterList, url }) {
    state.leftmenu = user.rightList
    state.user = user.loginUser
    router.replace(url === '/'
    ? state.leftmenu[0].urlPath
      ? state.leftmenu[0].urlPath
      : state.leftmenu[0].resources[0].urlPath
    : url)
    state.sectionList = [...sectionList]
    state.semesterList = [...semesterList]
    console.log(state)
    window.localStorage.setItem('ELECTIVE_USER', JSON.stringify(user.loginUser))
    window.localStorage.setItem('ELECTIVE_LEFTMENU', JSON.stringify(state.leftmenu))
  },

  [type.EDITSTATE] (state, action) {
    state.edit = action
  }
}
