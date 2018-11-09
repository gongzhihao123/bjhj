import * as type from './mutations-type'
// import { TreeMenu } from '../api/tree'
export default {
  [type.INIT] (state, user) {
    state.user = user.loginUser
    state.leftMenu = user.leftMenu.filter(item => item.name !== '首页')
    state.leftMenu.forEach(item => {
      if (item.name === '创建问卷') {
        item.path = '/created'
      } else if (item.name === '问卷管理') {
        item.path = '/manage'
      } else if (item.name === '问卷审核') {
        item.path = '/audit'
      } else if (item.name === '问卷设置') {
        item.path = '/set'
      }
    })
  }
}
