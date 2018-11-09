<template>
  <div class="home">
    <div class="header">
      <div class="logo" @click="$router.push('/lookfolder')">
        <img src="./../assets/image/logo.png">
        <span>文件管理</span>
      </div>
      <div class="user">
        <el-dropdown>
          <span class="el-dropdown-link">
            <img :src="user.userFace ? user.userFace : userFace">
            <span>{{ user.name }}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <li @click="Command" class="logoyt">退出登录</li>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="bodyMain">
      <div class="treeList" :style="{width: offLeft + 'px'}">
        <div class="treeContent" ref="treeDate">
          <el-tree
            :data="folderList"
            node-key="id"
            :props="defaultProps"
            :render-content="renderContent">
          </el-tree>
        </div>
        <div class="operate" v-if="user.adminFlag">
          <ul>
            <li v-for="(item, index) in operateList" @click="jumpRoute(item)" :key="index">
              <img :src="item.icon">
              <span>{{ item.content }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="dropArticle" :style="{left: offLeft + 'px'}" @mousedown="dropDown" ref='dropElem'>
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div class="contentMain" :style="{width: windowWidth - offLeft + 'px'}">
        <transition name="list" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <div class="scaling" :class="uploadFile ? 'scalingShow' : ''">
      <span @click.stop="$store.dispatch('uploadFile', uploadFile ? false : true)">{{ uploadFile ? '点我收起' : '点我展开' }}</span>
      <div class="uploadBody">
        <file-upload
          ref="fileUpload"
          :ext="ext"
          :tip="tip"
          :data="{'parentId': $store.state.lookFolder.parentFolder, 'uploadType': 1}"
          @handleSuccess="handleSuccess"
          name="uploadFile"
        ></file-upload>
      </div>
    </div>
  </div>
</template>
<script>
import download from './../assets/image/download-selected.png'
import move from './../assets/image/move-selected.png'
import rename from './../assets/image/rename-selected.png'
import deletes from './../assets/image/delete-selected.png'
import finder from './../assets/image/folder-card-icon.png'
import copy from './../assets/image/copy-selected.png'
import pullDown from './../assets/image/options.png'
import operate from './../assets/image/operate.png'
import recycles from './../assets/image/recycles.png'
import statistics from './../assets/image/statistics.png'
import folder from './../assets/image/folder.png'
import userFace from './../assets/image/avatar.png'
import { Tree } from './../utils/tree'
import fileUpload from './../components/upload'
import * as config from './../config'
export default {
  name: 'home',
  data () {
    return {
      userFace,
      download,
      move,
      rename,
      deletes,
      finder,
      copy,
      operate,
      recycles,
      statistics,
      folder,
      pullDown,
      leftViev: '',
      offLeft: 300,
      user: {},
      operateList: [{
        url: '/recycle',
        content: '回收站',
        icon: recycles
      }, {
        url: '/record',
        content: '操作记录',
        icon: operate
      }, {
        url: '/statistical',
        content: '文件统计',
        icon: statistics
      }],
      defaultProps: {
        children: 'children',
        name: 'name'
      },
      userTreeProp: {
        children: 'children',
        label: 'name'
      },
      treeNode: '',
      addFoldName: '',
      addfolders: false,
      add: false,
      changeType: 1,
      moveFold: false,
      selectFoldId: '',
      ext: '',
      tip: '',
      adminFlag: false,
      windowWidth: 0,
      weight: false,
      userTree: [],
      radio: '1',
      Readwrite: '',
      Checkstaff: '',
      responsible: '',
      userFilter: '',
      userList: [],
      responsibleList: [],
      treeListView: false,
      lookPeople: false,
      responsibles: false,
      selectResponsible: [],
      viewUserList: [],
      selectViewUserList: [],
      selctBox: true,
      userBool: false,
      viewUser: false,
      adminUser: false,
      actionsFoldList: []
    }
  },
  components: {
    fileUpload
  },
  computed: {
    folderList () {
      var arr = new Tree(this.$store.state.foldList).comprehensive(null)
      if (arr) {
        return arr
      } else {
        return []
      }
    },
    uploadFile () {
      return this.$store.state.lookFolder.uploadNew
    }
  },
  watch: {
    userFilter (item) {
      this.$refs.userTreeFilter.filter(item)
    }
  },
  methods: {
    // 树节点筛选
    filterNode (val, data) {
      if (!val) return true
      return data.name.indexOf(val) !== -1
    },
    // 弹窗关闭回调
    beforeClose (done) {
      this.treeListView = false
      this.lookPeople = false
      this.responsibles = false
      this.userList = []
      this.viewUserList = []
      this.responsibleList = []
      done()
    },
    // 更改权限
    async updateFolder () {
      this.userList.forEach(item => {
        item.fileUpload = 1
      })
      this.viewUserList.forEach(item => {
        item.fileView = 1
      })
      this.responsibleList.forEach(item => {
        item.fileManager = 1
      })
      this.weight = false
      let crr = [...this.userList, ...this.viewUserList, ...this.responsibleList]
      var json = {}
      var arr = []
      for (var i = 0; i < crr.length; i++) {
        if (!json[crr[i].userId]) {
          arr.push(crr[i])
          json[crr[i].userId] = 1
        }
      }
      arr.forEach((item) => {
        if (!item.fileView) {
          item.fileView = 2
        }
        if (!item.fileUpload) {
          item.fileUpload = 2
        }
        if (!item.fileManager) {
          item.fileManager = 2
        }
        item.userName = item.name
        delete item.name
      })
      this.userList = []
      this.viewUserList = []
      this.responsibleList = []
      await this.$store.dispatch('updateFolder', {
        folderId: this.treeNode.id,
        viewType: Number(this.radio),
        rightUserJson: JSON.stringify(arr)
      })
      if (this.$store.state.lookFolder.parentFolder) {
        await this.$store.dispatch('getFolder')
        await this.$store.dispatch('getFolder')
        await this.$store.dispatch('folderList')
        this.filesList = this.$store.state.lookFolder.folderList
      } else {
        await this.$store.dispatch('folderList')
        var allFold = this.$store.state.foldList.filter(item => item.parentId === 0)
        this.$store.dispatch('allFold', allFold)
      }
    },
    // 退出登录
    Command () {
      window.location.href = window.location.origin + config.contextPath + '/logout'
    },
    handleSuccess () {
      this.refresh()
    },
    jumpRoute (item) {
      this.$router.push({ path: item.url })
    },
    // 刷新判断
    async refresh () {
      if (this.$store.state.lookFolder.parentFolder) {
        await this.$store.dispatch('getFolder')
        await this.$store.dispatch('getFolder')
        await this.$store.dispatch('folderList')
      } else {
        await this.$store.dispatch('folderList')
        var allFold = this.$store.state.foldList.filter(item => item.parentId === 0)
        this.$store.dispatch('allFold', allFold)
      }
    },
    async addFolder () {
      if (this.addFoldName !== '') {
        await this.$store.dispatch('addFolder', {
          parentId: this.treeNode.id,
          folderName: this.addFoldName
        })
        this.addFoldName = ''
        this.refresh()
        this.addfolders = false
      }
    },
    // 树节点点击时的回调
    selectFold (data) {
      this.selectFoldId = data.id
    },
    // 树形结构渲染
    renderContents (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <img src={ folder } />
          <span>{data.name}</span>
        </span>
      )
    },
    // 拖拽宽度不固定
    dropDown (e) {
      this.leftViev = e.pageX - this.$refs.dropElem.offsetLeft
      document.onmousemove = (e) => {
        this.offLeft = e.pageX - this.leftViev
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
    },
    // 点击中间的选中
    async content (data, node) {
      if (this.$route.path !== '/lookfolder') {
        this.$router.push('/lookfolder')
      }
      if (node.id !== 0) {
        await this.$store.dispatch('parentFold', node.id)
        this.$store.dispatch('getFolder')
      } else {
        var allFold = this.$store.state.foldList.filter(item => item.parentId === 0)
        this.$store.dispatch('allFold', allFold)
      }
    },
    // 树形结构渲染
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node" on-click = { () => this.content(node, data) }>
          <img src={ folder } />
          <span>{data.name}</span>
        </span>
      )
    }
  },
  directives: {
    focus: {
      inserted: function (el, option) {
        var defClass = 'el-input'
        var defTag = 'input'
        var value = option.value || true
        if (typeof value === 'boolean') {
          value = { cls: defClass, tag: defTag, foc: value }
        } else {
          value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false }
        }
        if (el.classList.contains(value.cls) && value.foc) {
          el.getElementsByTagName(value.tag)[0].focus()
        }
      }
    }
  },
  async mounted () {
    this.windowWidth = document.body.offsetWidth
    window.onresize = () => {
      this.windowWidth = document.body.offsetWidth
    }
    await this.$store.dispatch('initPage')
    var allFold = this.$store.state.foldList.filter(item => item.parentId === 0)
    this.$store.dispatch('allFold', allFold)
    this.user = this.$store.state.user
    this.adminFlag = this.user.adminFlag
  }
}
</script>
<style lang='scss'>
  .home {
    width: 100%;
    height: 100%;
    .header {
      width: 100%;
      height: 50px;
      background: #409EFF;
      padding: 0 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .logo {
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
        span {
          font-size: 20px;
          color: #fff;
        }
      }
      .user {
        display: flex;
        align-items: center;
        img {
          width: 35px;
          height: 35px;
          margin-right: 10px;
          border-radius: 50%;
        }
        span {
          font-size: 18px;
          color: #fff;
        }
      }
    }
    .bodyMain {
      width: 100%;
      height: calc(100vh - 50px);
      background: #eaf0f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .treeList {
        width: 300px;
        height: 100%;
        background: #fff;
        box-sizing: border-box;
        border: 1px solid #E3E3E3;
        .treeContent {
          width: 100%;
          height: calc(100% - 80px);
          padding: 10px;
          overflow: auto;
          .custom-tree-node {
            width: 80%;
            display: flex;
            align-content: center;
            img {
              width: 16px;
              height: 16px;
              margin-right: 10px;
            }
          }
        }
        .operate {
          width: 100%;
          height: 80px;
          border-top: 2px solid #E3E3E3;
          box-sizing: border-box;
          overflow: auto;
          ul {
            width: 100%;
            li {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 77px;
              float: left;
              border: 1px solid #E3E3E3;
              padding: 5px;
              margin: 10px 0px 10px 20px;
              color: #409EFF;
              img {
                width: 24px;
                height: 24px;
                margin-bottom: 2px;
              }
            }
          }
        }
      }
      .dropArticle {
        width: 13px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 300px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 1;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        i {
          display: block;
          width: 2px;
          height: 16px;
          background: #ccc;
          margin-left: 3px;
        }
        &:hover {
          cursor: move;
          opacity: 1;
          background: rgba(0, 0, 0, .3);
        }
      }
      .contentMain {
        width: 100%;
        height: calc(100vh - 50px);
        background: #fff;
        box-sizing: border-box;
        border: 1px solid #E3E3E3;
        border-width: 1px 1px 1px 1px;
        overflow: auto;
      }
    }
    .scaling {
      position: fixed;
      bottom: 0px;
      right: -431px;
      width: 460px;
      height: 300px;
      transition: .35S linear;
      z-index: 999;
      display: flex;
      justify-content: flex-start;
      >span:nth-child(1) {
        padding: 5px;
        display: block;
        border: 1px solid #E3E3E3;
        width: 30PX;
        height: 90px;
        border-right: 0px;
        background: #fff;
      }
      .uploadBody {
        width: 100%;
        height: 300px;
        padding: 10px;
        border: 1px solid #E3E3E3;
        background: #fff;
      }
    }
    .scalingShow {
      right: 0;
    }
   .setUp {
      div {
        &.userPermissions {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .userLabel {
          width:100px;
          line-height: 40px;
        }
      }
      .Readwrite {
        display: flex;
        justify-content: flex-start;
        align-content: center;
        position: relative;
        margin-bottom: 10px;
        > div:nth-child(2) {
          width: 380px;
          height: 40px;
          overflow: auto;
          border: 1px solid #E3E3E3;
          color: #CCC;
          border-radius: 5px;
          padding: 3px;
          span {
            margin-right: 10px;
            margin-bottom: 5px;
            padding: 0 10px;
            line-height: 30px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
          }
          div {
            line-height: 40px;
          }
        }
        .treeUserBody {
          position: absolute;
          top: 43px;
          width: 460px;
          z-index: 99;
          background: #fff;
          border: 1px solid #E3E3E3;
          .treeUser {
            display: flex;
            justify-content: space-between;
            align-content: center;
            padding: 10px;
            > div {
              padding: 10px;
              width: 220px;
              border: 1px solid #E3E3E3;
              margin: 10px;
              >div:nth-child(2) {
                margin-top: 10px;
                height: 200px;
                overflow: auto;
              }
              .user {
                border-bottom: 1px solid #E3E3E3;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span {
                  &:nth-child(2) {
                    color: red;
                    text-align: right;
                  }
                }
              }
              .selectUserList {
                height: 250px;
                overflow: auto;
              }
            }
          }
          .footer {
            padding: 5px 20px;
            text-align: right;
          }
        }
      }
    }
  }
  .el-dropdown-menu {
    li {
      user-select: none;
      padding: 5px 15px;
    }
  }
  .logoyt {
    padding: 5px 10px;
    cursor: pointer;
    list-style: none;
  }
</style>
