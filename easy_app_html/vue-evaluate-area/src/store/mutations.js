import * as type from './mutations-type'
// import { TreeMenu } from '../api/tree'
export default {
  [type.INIT] (state, user) {
    state.user = user
  }
}
