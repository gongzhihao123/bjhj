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
    <el-dialog
      :title="add ? '新建文件夹' : '重命名文件夹'"
      :visible.sync="addfolders"
      width="400px">
      <el-input placeholder='请输入文件夹名称' v-model="addFoldName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="addfolders = false; addFoldName = ''">取 消</el-button>
        <el-button v-if="add" type="primary" @click="addFolder">确 定</el-button>
        <el-button v-else @click="renFolder">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="moveFold"
      width="400px">
      <div slot="title">{{ changeType === 1 ? '移动到' : changeType === 2 ? '复制到' : '' }}下列文件夹中</div>
      <div class="dialogBody">
        <el-tree
          :data="actionsFoldList"
          node-key="id"
          :props="defaultProps"
          :render-content="renderContents"
          @node-click='selectFold'>
        </el-tree>
      </div>
      <div slot="footer">
        <el-button @click="moveFold = false; selectFoldId = ''">取消</el-button>
        <el-button type="primary" @click="determineFold">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
    :visible.sync="weight"
    :before-close="beforeClose"
    width="500px">
      <div slot="title">设置权限</div>
      <div class="setUp">
        <div class="userPermissions">
          <span class="userLabel">查看权限</span>
          <el-radio v-model="radio" label="1">公开</el-radio>
          <el-radio v-model="radio" label="2">非公开</el-radio>
        </div>
        <div class="Readwrite">
          <span class="userLabel" @click.stop="readWriter">读写权限</span>
          <div @click="
            treeListView = !treeListView;
            lookPeople = false;
            responsibles = false;
            userFilter = [];
          ">
            <span v-if="!userList.length">点击选择人员</span>
            <el-tag
              v-else
              v-for="tag in userList"
              :key="tag.userId"
              closable
              @close='deleteUsers(tag)'>
              {{tag.name}}
            </el-tag>
          </div>
          <transition name="list" mode="out-in">
            <div class="treeUserBody" v-if="treeListView">
              <div class="treeUser">
                <div>
                  <el-input v-model="userFilter" v-focus="true" placeholder="请输入关键字"></el-input>
                  <el-tree
                    :data="userTree"
                    node-key="userId"
                    show-checkbox
                    ref="userTreeFilter"
                    :props="userTreeProp"
                    default-expand-all
                    :filter-node-method="filterNode"
                    @check-change="handleCheckChange">
                  </el-tree>
                </div>
                <div>
                  <ul class="selectUserList">
                    <transition-group name="list" mode="in-out">
                      <li v-for="(item, index) in userList" class="user" :key="index">
                        <span>{{ item.name }}</span>
                        <span @click="deleteUsers(item)" >x</span>
                      </li>
                    </transition-group>
                  </ul>
                </div>
              </div>
              <div class="footer">
                <el-button type="primary" @click="treeListView = false">确定</el-button>
                <el-button @click="treeListView = false" >取消</el-button>
              </div>
            </div>
          </transition>
        </div>
        <transition name="list" mode="out-in">
          <div v-if="radio === '2'" class="Readwrite">
            <span class="userLabel" @click.stop="ViewUserShow" >查看人员</span>
            <div @click="
              treeListView = false;
              lookPeople = !lookPeople;
              responsibles = false;
              userFilter = [];
            ">
              <span v-if="!viewUserList.length">点击选择人员</span>
              <el-tag
                v-else
                v-for="tag in viewUserList"
                :key="tag.userId"
                closable
                @close='deleteViewUser(tag)'>
                {{tag.name}}
              </el-tag>
            </div>
            <transition name="list" mode="out-in">
              <div class="treeUserBody" v-if="lookPeople">
                <div class="treeUser">
                  <div>
                    <el-input v-model="userFilter" v-focus="true" placeholder="请输入关键字"></el-input>
                    <el-tree
                      :data="userTree"
                      node-key="userId"
                      show-checkbox
                      ref="userTreeFilter"
                      :props="userTreeProp"
                      default-expand-all
                      :filter-node-method="filterNode"
                      @check-change="ViewUserChange">
                    </el-tree>
                  </div>
                  <div>
                    <ul class="selectUserList">
                      <transition-group name="list" mode="in-out">
                        <li v-for="(item, index) in viewUserList" class="user" :key="index">
                          <span>{{ item.name }}</span>
                          <span @click="deleteViewUser(item)" >x</span>
                        </li>
                      </transition-group>
                    </ul>
                  </div>
                </div>
                <div class="footer">
                  <el-button type="primary" @click="lookPeople = false">确定</el-button>
                  <el-button @click="lookPeople = false" >取消</el-button>
                </div>
              </div>
            </transition>
          </div>
        </transition>
        <div class="Readwrite responsiblePeople">
          <span class="userLabel" @click.stop="responsibleShow">负责人</span>
            <div @click="
            treeListView = false;
            lookPeople = false;
            responsibles = !responsibles;
            userFilter = [];
          ">
              <span v-if="!responsibleList.length">点击选择人员</span>
              <el-tag
                v-else
                v-for="tag in responsibleList"
                :key="tag.userId"
                closable
                @close='deleteResponsible(tag)'>
                {{tag.name}}
              </el-tag>
            </div>
            <transition name="list" mode="out-in">
              <div class="treeUserBody" v-if="responsibles">
                <div class="treeUser">
                  <div>
                    <el-input v-model="userFilter" v-focus="true" placeholder="请输入关键字"></el-input>
                    <el-tree
                      :data="userTree"
                      node-key="userId"
                      show-checkbox
                      ref="userTreeFilter"
                      :props="userTreeProp"
                      default-expand-all
                      :filter-node-method="filterNode"
                      @check-change="responsibleChange">
                    </el-tree>
                  </div>
                  <div>
                    <ul class="selectUserList">
                      <transition-group name="list" mode="in-out">
                        <li v-for="(item, index) in responsibleList" class="user" :key="index">
                          <span>{{ item.name }}</span>
                          <span @click="deleteResponsible(item)" >x</span>
                        </li>
                      </transition-group>
                    </ul>
                  </div>
                </div>
                <div class="footer">
                  <el-button type="primary" @click="responsibles = false">确定</el-button>
                  <el-button @click="responsibles = false" >取消</el-button>
                </div>
              </div>
            </transition>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="weight = false; selctBox = true;">取消</el-button>
        <el-button type="pirmary" @click="updateFolder" >确定</el-button>
      </div>
    </el-dialog>
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
import creatshare from '@/assets/image/cancelShare-selected.png'
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
    // 读写权限操作
    readWriter () {
      this.treeListView = !this.treeListView
      this.lookPeople = false
      this.responsibles = false
      this.userFilter = []
      let arr = []
      this.userList.forEach((items, index) => {
        arr.push(items.userId)
      })
      setTimeout(() => {
        this.userBool = true
        this.$refs.userTreeFilter.setCheckedKeys(arr)
      }, 200)
    },
    deleteUsers (item) {
      let arr = []
      let usersList = this.userList
      usersList.forEach((items, index) => {
        if (items.userId === item.userId) {
          this.userList.splice(index, 1)
        } else {
          arr.push(items.userId)
        }
      })
      setTimeout(() => {
        this.userBool = true
        this.$refs.userTreeFilter.setCheckedKeys(arr)
      }, 200)
    },
    handleCheckChange (data, checked, inedte) {
      if (data.deptId && checked) {
        this.userBool = false
        if (this.userList.filter(item => (item.userId === data.userId)).length === 0) {
          data.fileUpload = 1
          this.userList.push(data)
        }
      } else if (data.deptId && !checked) {
        if (!this.userBool) {
          this.userList.forEach((item, index) => {
            if (item.userId === data.userId) {
              this.userList.splice(index, 1)
            }
          })
        }
      }
    },
    // 查看人员的操作
    deleteViewUser (item) {
      let viewUserList = this.viewUserList
      let arr = []
      viewUserList.forEach((items, index) => {
        if (items.userId === item.userId) {
          this.viewUserList.splice(index, 1)
        } else {
          arr.push(items.userId)
        }
      })
      setTimeout(() => {
        this.viewUser = true
        this.$refs.userTreeFilter.setCheckedKeys(arr)
      }, 200)
    },
    ViewUserShow () {
      this.lookPeople = !this.lookPeople
      this.treeListView = false
      this.responsibles = false
      this.userFilter = []
      let arr = []
      this.viewUserList.forEach((items, index) => {
        arr.push(items.userId)
      })
      setTimeout(() => {
        this.viewUser = true
        this.$refs.userTreeFilter.setCheckedKeys(arr)
      }, 200)
    },
    ViewUserChange (data, checked, inedte) {
      if (data.deptId && checked) {
        if (this.viewUserList.filter(item => (item.userId === data.userId)).length === 0) {
          data.fileView = 1
          this.viewUserList.push(data)
          this.selectViewUserList.push(data.userId)
          this.viewUser = false
        }
      } else if (data.deptId && !checked) {
        let viewUserList = this.viewUserList
        if (!this.viewUser) {
          viewUserList.forEach((item, index) => {
            if (item.userId === data.userId) {
              this.viewUserList.splice(index, 1)
            }
          })
        }
      }
    },
    // 负责人修改
    deleteResponsible (item) {
      let responsibleList = this.responsibleList
      let arr = []
      responsibleList.forEach((items, index) => {
        if (items.userId === item.userId) {
          this.responsibleList.splice(index, 1)
        } else {
          arr.push(items.userId)
        }
      })
      setTimeout(() => {
        this.adminUser = true
        this.$refs.userTreeFilter.setCheckedKeys(arr)
      }, 200)
    },
    responsibleShow () {
      this.treeListView = false
      this.lookPeople = false
      this.responsibles = !this.responsibles
      this.userFilter = []
      let arr = []
      this.responsibleList.forEach((items, index) => {
        arr.push(items.userId)
      })
      setTimeout(() => {
        this.adminUser = true
        this.$refs.userTreeFilter.setCheckedKeys(arr)
      }, 200)
    },
    responsibleChange (data, checked, inedte) {
      if (data.deptId && checked) {
        if (this.responsibleList.filter(item => (item.userId === data.userId)).length === 0) {
          this.adminUser = false
          data.fileManager = 1
          this.responsibleList.push(data)
          this.selectResponsible.push(data.userId)
        }
      } else if (data.deptId && !checked) {
        if (!this.adminUser) {
          let responsibleList = this.responsibleList
          responsibleList.forEach((item, index) => {
            if (item.userId === data.userId) {
              this.responsibleList.splice(index, 1)
              this.selectResponsible.splice(index, 1)
            }
          })
        }
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
    async renFolder () {
      if (this.addFoldName !== '') {
        await this.$store.dispatch('renamefold', {
          folderId: this.treeNode.id,
          folderName: this.addFoldName
        })
        this.addfolders = false
        this.refresh()
      }
    },
    // 选择文件夹 移动带某个文件夹
    async determineFold () {
      await this.$store.dispatch('move', {
        toFolderId: this.selectFoldId,
        fromFolderId: this.treeNode.parentId,
        folderIds: this.treeNode.id,
        fileIds: '',
        type: this.changeType
      })
      this.refresh()
      this.moveFold = false
    },
    // 树节点删除文件
    deleteFold (data) {
      if (this.adminFlag) {
        this.$confirm(`<span style='color:red'>确认要把所选文件放入回收站吗？<br/>删除的文件只有管理员可以通过回收箱还原？</span>`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(async () => {
          await this.$store.dispatch('deleteFold', {
            folderId: data.parentId,
            fileIds: '',
            folderIds: data.id
          })
          this.refresh()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        if (data.folderLevel > 2) {
          const arr = data.parentIds.split(',')
          const foldWeight = arr.splice(1, 2)
          var fileManager = []
          foldWeight.forEach(item => {
            var weightFolderOption = this.$store.state.foldList.filter(item => item.id === Number(item))[0]
            if (weightFolderOption.fileManager === 1) {
              fileManager.push(true)
            } else {
              fileManager.push(false)
            }
          })
          if (fileManager.includes(true)) {
            this.$confirm(`<span style='color:red'>确认要把所选文件放入回收站吗？<br/>删除的文件只有管理员可以通过回收箱还原？</span>`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }).then(async () => {
              await this.$store.dispatch('deleteFold', {
                folderId: data.parentId,
                fileIds: '',
                folderIds: data.id
              })
              this.refresh()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '抱歉！您没有删除文件夹的权限'
            })
          }
        }
        if (data.folderLevel === 1 || data.folderLevel === 2) {
          if (data.fileManager === 1) {
            this.$confirm(`<span style='color:red'>确认要把所选文件放入回收站吗？<br/>删除的文件只有管理员可以通过回收箱还原？</span>`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }).then(async () => {
              await this.$store.dispatch('deleteFold', {
                folderId: data.parentId,
                fileIds: '',
                folderIds: data.id
              })
              this.refresh()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '抱歉！您没有删除文件夹的权限'
            })
          }
        }
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
    // 移动文件夹
    async moveFolder (data) {
      await this.$store.dispatch('getActionFold')
      this.actionsFoldList = new Tree(this.$store.state.lookFolder.actionsFolder).comprehensive(0)
      this.moveFold = true
      this.changeType = 1
      this.treeNode = data
    },
    // 树节点新建文件夹
    addFold (data) {
      if (this.adminFlag) {
        this.add = true
        this.addfolders = true
        this.treeNode = data
      } else {
        if (data.folderLevel === 0) {
          this.$notify.error({
            title: '错误',
            message: '抱歉！第一级文件夹管理员才能创建'
          })
          return false
        }
        console.log(data)
        const arr = data.parentIds.split(',')
        let foldWeight = null
        let fileManager = []
        if (data.folderLevel > 2) {
          foldWeight = arr.splice(1, 2)
        } else if (data.folderLevel === 1) {
          foldWeight = [data.id]
        } else if (data.folderLevel === 2) {
          foldWeight = [data.parentId, data.id]
        }
        foldWeight.forEach(items => {
          var weightFolderOption = this.$store.state.foldList.filter(data => data.id === Number(items))[0]
          if (weightFolderOption.fileManager === 1) {
            fileManager.push(1)
          }
          if (weightFolderOption.fileUpload === 1) {
            fileManager.push(2)
          }
          if (weightFolderOption.fileView === 1) {
            fileManager.push(3)
          }
        })
        if (fileManager.includes(1) || fileManager.includes(2)) {
          this.add = true
          this.addfolders = true
          this.treeNode = data
        } else {
          this.$notify.error({
            title: '错误',
            message: '抱歉！该文件夹只有管理员才能新建'
          })
        }
      }
    },
    // 复制文件夹
    async copyFolder (data) {
      await this.$store.dispatch('getActionFold')
      this.actionsFoldList = new Tree(this.$store.state.lookFolder.actionsFolder).comprehensive(0)
      this.moveFold = true
      this.changeType = 2
      this.treeNode = data
    },
    // 树节点修改文件名称
    renameFold (data) {
      if (this.adminFlag) {
        this.add = false
        this.addfolders = true
        this.treeNode = data
        this.addFoldName = data.name
      } else {
        if (data.folderLevel > 2) {
          const arr = data.parentIds.split(',')
          const foldWeight = arr.splice(1, 2)
          var fileManager = []
          foldWeight.forEach(item => {
            var weightFolderOption = this.$store.state.foldList.filter(item => item.id === Number(item))[0]
            if (weightFolderOption.fileManager === 1 || data.fileUpload === 1) {
              fileManager.push(true)
            } else {
              fileManager.push(false)
            }
          })
          if (fileManager.includes(true)) {
            this.add = false
            this.addfolders = true
            this.treeNode = data
            this.addFoldName = data.name
          } else {
            this.$notify.error({
              title: '错误',
              message: '抱歉！您没有命名该文件夹的权限'
            })
          }
        }
        if (data.folderLevel === 1 || data.folderLevel === 2) {
          if (data.fileManager === 1 || data.fileUpload === 1) {
            this.add = false
            this.addfolders = true
            this.treeNode = data
            this.addFoldName = data.name
          } else {
            this.$notify.error({
              title: '错误',
              message: '抱歉！您没有命名该文件夹的权限'
            })
          }
        }
      }
    },
    // 权限管理
    async weightFold (data) {
      await this.$store.dispatch('getUser')
      this.radio = data.viewType + ''
      let users = this.$store.state.lookFolder.userList.users.map(item => {
        item.parentId = item.deptId
        return item
      })
      await this.$store.dispatch('getFolderUser', {
        folderId: data.id
      })
      this.responsibleList = []
      this.userList = []
      this.viewUserList = []
      this.$store.state.lookFolder.userList.users.forEach(item => {
        this.$store.state.lookFolder.getFoldList.forEach(items => {
          if (item.userId === items.userId) {
            if (items.fileManager === 1) {
              this.responsibleList.push(item)
            }
            if (items.fileUpload === 1) {
              this.userList.push(item)
            }
            if (items.fileView === 1) {
              this.viewUserList.push(item)
            }
          }
        })
      })
      this.userTree = await new Tree([...this.$store.state.lookFolder.userList.depts, ...users]).comprehensive(0)
      if (this.adminFlag) {
        this.treeNode = data
        this.weight = true
        this.selctBox = false
      } else {
        const arr = data.parentIds.split(',')
        const foldWeight = arr.splice(1, 2)
        var fileManager = []
        foldWeight.forEach(item => {
          var weightFolderOption = this.$store.state.foldList.filter(item => item.id === Number(item))[0]
          if (weightFolderOption.fileManager === 1) {
            fileManager.push(true)
          } else {
            fileManager.push(false)
          }
        })
        if (fileManager.includes(true)) {
          this.add = true
          this.addfolders = true
          this.treeNode = data
        } else {
          this.$notify.error({
            title: '错误',
            message: '抱歉！您没有该文件夹的权限'
          })
        }
      }
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
      if (data.id === 0) {
        return (
          <span class="custom-tree-node" on-click = { () => this.content(node, data) }>
            <img src={ folder } />
            <span>{data.name}</span>
            <span class='allOptions'>
              <el-dropdown trigger="hover">
                <img src={ pullDown } />
                <el-dropdown-menu slot="dropdown">
                  <li on-click = { () => { this.addFold(data) } }><img src={ finder } />新建文件夹</li>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        )
      } else {
        if (data.folderLevel > 2) {
          return (
            <span class="custom-tree-node" on-click = { () => this.content(node, data) }>
              <img src={ folder } />
              <span>{data.name}</span>
              <span class='allOptions'>
                <el-dropdown trigger="hover">
                  <img src={ pullDown } />
                  <el-dropdown-menu slot="dropdown">
                    <li on-click = { () => { this.addFold(data) } }><img src={ finder } />新建文件夹</li>
                    <li on-click = { () => { this.deleteFold(data) } }><img src={ deletes } />删除文件夹</li>
                    <li on-click = { () => { this.renameFold(data) } }><img src={ rename } />重命名文件夹</li>
                    <li on-click = { () => { this.moveFolder(data) } }><img src={ move } />移动到....</li>
                    <li on-click = { () => { this.copyFolder(data) } }><img src={ copy } />复制到....</li>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          )
        } else {
          return (
            <span class="custom-tree-node" on-click = { () => this.content(node, data) }>
              <img src={ folder } />
              <span>{data.name}</span>
              <span class='allOptions'>
                <el-dropdown trigger="hover">
                  <img src={ pullDown } />
                  <el-dropdown-menu slot="dropdown">
                    <li on-click = { () => { this.addFold(data) } }><img src={ finder } />新建文件夹</li>
                    <li on-click = { () => { this.deleteFold(data) } }><img src={ deletes } />删除文件夹</li>
                    <li on-click = { () => { this.renameFold(data) } }><img src={ rename } />重命名文件夹</li>
                    <li on-click = { () => { this.weightFold(data) } }><img src={ creatshare } />修改权限</li>
                    <li on-click = { () => { this.copyFolder(data) } }><img src={ copy } />复制到....</li>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          )
        }
      }
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
    await this.$store.dispatch('folderList')
    console.log(new Tree(this.$store.state.foldList).comprehensive(null))
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
