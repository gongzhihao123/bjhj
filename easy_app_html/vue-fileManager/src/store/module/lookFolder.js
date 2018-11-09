import service from './../../api/index'
import { success, error } from './../../utils/handle'
import parent from './../index'

const state = {
  folderList: '',
  beforeFoldList: '',
  parentFolder: '',
  crumbs: [],
  peopleFolder: '',
  userType: '',
  userList: [],
  getFoldList: [],
  uploadNew: false,
  actionsFolder: [],
  switchs: true,
  timeSwitch: true
}

const actions = {
  async search ({commit}, data) {
    const res = await service.searchFold(data)
    if (res && res.code) commit('SEARCH', res.result)
  },
  // 获取文件夹下的文件
  async getFolder ({commit}) {
    let data = {folderId: state.parentFolder}
    const res = await service.fileList(data)
    if (res && res.code) commit('GETFOLDER', res.result)
    else error(res.message)
  },
  // 新建文件夹
  async addFolder ({commit}, data) {
    const res = await service.addFile(data)
    if (res && res.code === 1) {
      parent.state.foldList = res.result
      success('成功')
    } else error(res.message)
  },
  // 删除文件夹
  async deleteFold ({commit}, data) {
    const res = await service.deleteFile(data)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  // 修改文件名称
  async renamefile ({commit}, data) {
    const res = await service.renameFile(data)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  // 修改文件夹名称
  async renamefold ({commit}, data) {
    const res = await service.renameFolder(data)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  // 移动或拷贝文件夹
  async move ({commit}, data) {
    const res = await service.copyFile(data)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  // 获取组织架构人物
  async getUser ({commit}, data) {
    const res = await service.userList(data)
    if (res && res.code === 1) commit('GETUSER', res.result)
    else error(res.message)
  },
  // 权限控制
  async updateFolder ({commit}, data) {
    const res = await service.updateFolder(data)
    if (res && res.code === 1) success('成功')
    else error(res.message)
  },
  // 获取文件夹权限
  async getFolderUser ({commit}, data) {
    const res = await service.getFolderUser(data)
    if (res && res.code === 1) commit('GETFOLDERUSER', res.result)
    else error(res.message)
  },
  // 获取可操作的文件夹
  async getActionFold ({commit}, data) {
    const res = await service.actionFold(data)
    if (res && res.code === 1) commit('GETACTIONFOLD', res.result)
    else error(res.message)
  },
  // 筛选类型
  changeType ({commit}, data) {
    commit('CHANGETYPE', data)
  },
  peopleType ({commit}, data) {
    commit('PEOPLETYPE', data)
  },
  // 全部的顶层文件
  allFold ({commit}, data) {
    commit('ALLFOLD', data)
  },
  // 选中的父节点
  parentFold ({commit}, data) {
    sessionStorage.folderId = data
    commit('PARENTFOLD', data)
  },
  uploadFile ({commit}, data) {
    commit('UPLOADFILE', data)
  },
  sortTopName ({commit}, data) {
    commit('SORTTOPNAME', data)
  },
  sortTime ({commit}, data) {
    commit('SORTTIME', data)
  }
}

const mutations = {
  SORTTOPNAME (state, data) {
    if (data) {
      state.folderList.sort((a, b) => {
        return b.name.localeCompare(a.name)
      })
    } else {
      state.folderList.sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    }
  },
  SORTTIME (state, data) {
    if (data) {
      state.folderList.sort((a, b) => {
        return a.updateTime - b.updateTime
      })
    } else {
      state.folderList.sort((a, b) => {
        return b.updateTime - a.updateTime
      })
    }
  },
  GETFOLDERUSER (state, data) {
    state.getFoldList = data
  },
  SEARCH (state, data) {
    state.folderList = data
    state.beforeFoldList = state.folderList
  },
  GETFOLDER (state, data) {
    if (data) {
      let childList = data.childList.map(item => {
        item.show = false
        item.rename = false
        return item
      })
      let fileList = data.fileList.map(item => {
        item.show = false
        item.rename = false
        return item
      })
      state.folderList = [...childList, ...fileList]
      state.beforeFoldList = state.folderList
      state.crumbs = data.parentsFolderList
    } else {
      state.folderList = []
    }
  },
  PARENTFOLD (state, data) {
    state.peopleFolder = ''
    state.userType = ''
    state.parentFolder = data
  },
  ALLFOLD (state, data) {
    if (data) {
      let allfold = data.map(item => {
        item.show = false
        return item
      })
      state.folderList = [...allfold]
      state.beforeFoldList = state.folderList
      state.parentFolder = ''
      state.crumbs = []
    } else {
      state.folderList = []
    }
  },
  // 文件类型筛选
  CHANGETYPE (state, data) {
    let screening = []
    if (data === 0) {
      state.beforeFoldList.forEach(item => {
        if (item.fileSuffix) {
          if (item.fileSuffix === '.txt' || item.fileSuffix === '.doc' || item.fileSuffix === '.docx' || item.fileSuffix === '.wps' || item.fileSuffix === '.pdf') {
            screening.push(item)
          }
        }
      })
    } else if (data === 1) {
      state.beforeFoldList.forEach(item => {
        if (item.fileSuffix) {
          if (item.fileSuffix === '.mp3' || item.fileSuffix === '.mp4' || item.fileSuffix === '.mkv' || item.fileSuffix === '.mpg' || item.fileSuffix === '.avi' || item.fileSuffix === '.mid' || item.fileSuffix === '.wav') {
            screening.push(item)
          }
        }
      })
    } else if (data === 2) {
      state.beforeFoldList.forEach(item => {
        if (item.fileSuffix) {
          if (item.fileSuffix === '.jpg' || item.fileSuffix === '.jpeg' || item.fileSuffix === '.png' || item.fileSuffix === '.gif' || item.fileSuffix === '.bmp') {
            screening.push(item)
          }
        }
      })
    } else if (data === 3) {
      state.beforeFoldList.forEach(item => {
        if (item.fileSuffix) {
          if (item.fileSuffix === '.rar' || item.fileSuffix === '.zip') {
            screening.push(item)
          }
        }
      })
    } else if (data === 4) {
      state.beforeFoldList.forEach(item => {
        if (item.fileSuffix) {
          if (item.fileSuffix !== '.rar' && item.fileSuffix !== '.zip') {
            if (item.fileSuffix !== '.jpg' && item.fileSuffix !== '.jpeg' && item.fileSuffix !== '.png' && item.fileSuffix !== '.gif' && item.fileSuffix !== '.bmp') {
              if (item.fileSuffix !== '.mp3' && item.fileSuffix !== '.mp4' && item.fileSuffix !== '.mkv' && item.fileSuffix !== '.mpg' && item.fileSuffix !== '.avi' && item.fileSuffix !== '.mid' && item.fileSuffix !== '.wav') {
                if (item.fileSuffix !== '.txt' && item.fileSuffix !== '.doc' && item.fileSuffix !== '.docx' && item.fileSuffix !== '.wps' && item.fileSuffix !== '.pdf') {
                  screening.push(item)
                }
              }
            }
          }
        }
      })
    } else if (data === '') {
      screening = state.beforeFoldList
      state.peopleFolder = ''
    }
    if (state.userType === 0) {
      state.folderList = []
      state.peopleFolder = []
      screening.forEach(item => {
        if (item.userName === parent.state.user.name) {
          state.folderList.push(item)
          state.peopleFolder.push(item)
        }
      })
      if (data === '') {
        state.peopleFolder = ''
      }
    } else if (state.userType === 1) {
      state.folderList = []
      state.peopleFolder = []
      screening.forEach(item => {
        if (item.userName !== parent.state.user.name) {
          state.folderList.push(item)
          state.peopleFolder.push(item)
        }
      })
    } else if (state.userType === '') {
      state.folderList = screening
      state.peopleFolder = screening
    }
  },
  PEOPLETYPE (state, data) {
    let screening = []
    state.userType = data
    if (data === 0) {
      if (state.peopleFolder === '') {
        state.beforeFoldList.forEach(item => {
          if (item.userName === parent.state.user.name) {
            screening.push(item)
          }
        })
      } else {
        state.peopleFolder.forEach(item => {
          if (item.userName === parent.state.user.name) {
            screening.push(item)
          }
        })
      }
    } else if (data === 1) {
      if (state.peopleFolder === '') {
        state.beforeFoldList.forEach(item => {
          if (item.userName !== parent.state.user.name) {
            screening.push(item)
          }
        })
      } else {
        state.peopleFolder.forEach(item => {
          if (item.userName !== parent.state.user.name) {
            screening.push(item)
          }
        })
      }
    } else if (data === '') {
      if (state.peopleFolder === '') {
        screening = state.beforeFoldList
      } else {
        screening = state.peopleFolder
      }
    }
    state.folderList = screening
  },
  GETUSER (state, data) {
    state.userList = data
  },
  UPLOADFILE (state, data) {
    state.uploadNew = data
  },
  GETACTIONFOLD (state, data) {
    state.actionsFolder = data
  }
}

export default ({
  state,
  actions,
  mutations
})
