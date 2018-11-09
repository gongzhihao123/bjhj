import * as type from './mutations-type'
// import { TreeMenu } from '../api/tree'
export default {
  [type.INIT] (state, user) {
    state.user = user.loginUser
  },
  [type.SEMESTERID] (state, item) {
    state.semesterId = { ...item }
  },
  [type.SECTION] (state, item) {
    state.section = { ...item }
  }
}
