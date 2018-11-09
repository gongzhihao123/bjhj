import * as type from './mutations-type'
// import { TreeMenu } from '../api/tree'
export default {
  [type.INIT] (state, user) {
    state.user = user.loginUser
    state.leftMenu = user.leftMenu || []
    state.rights = user.rights
    state.leftMenu.forEach(item => {
      if (item.name === '规则管理') {
        item.path = '/rule'
      } else if (item.name === '知识点管理') {
        item.path = '/knowledge'
      } else if (item.name === '考试管理') {
        item.path = '/exam'
        item.page = 3
      } else if (item.name === '成绩分析') {
        item.path = '/achievement'
      } else if (item.name === '权限管理') {
        item.path = '/right'
      }
    })
  },

  [type.GETMENU] (state, data) {
    // console.log(data.menus.childList)
    if (!(data.menus && data.menus.childList)) return
    data.menus.childList = data.menus.childList.map(item => ({
      ...item,
      names: item.name,
      childList: item.childList.map(items => ({
        ...items,
        names: item.name + items.name
      }))
    }))
    state.menu = data
    sessionStorage.MENU = JSON.stringify(data)
  }
}
