<template>
  <div class="fileList" ref="fileList" @click="closeFold">
    <!-- <div class="boxSelect" v-if="selctBox"></div> -->
    <table ref="fileListTable">
      <thead>
        <tr>
          <td>
            <el-checkbox v-model="checkSelect" :indeterminate="isIndeterminate" @change="changeBox" >全选</el-checkbox>
          </td>
          <td>
            <div class="sortNmae">
              <div>
                <i class="el-icon-caret-top" @click="sortTop" :class="ascending === true ? 'iclassName' : ''" ></i>
                <i class="el-icon-caret-bottom" @click="sortBottom" :class="ascending === false ? 'iclassName' : ''"></i>
              </div>
              <div>文件名 (双击进入文件夹)</div>
            </div>
          </td>
          <td>文件大小</td>
          <td>
            <div class="sortNmae">
              <div>
                <i class="el-icon-caret-top" @click="sortTimeTop" :class="ascendTime === true ? 'iclassName' : ''" ></i>
                <i class="el-icon-caret-bottom" @click="sortTimeBottom" :class="ascendTime === false ? 'iclassName' : ''"></i>
              </div>
              <div>更新时间</div>
            </div>
          </td>
          <td>上传人</td>
        </tr>
      </thead>
      <tbody style="position:relative; z-index:99999999">
        <tr v-for="(item, index) in filesList" ref="selectFiles" :key="index" @contextmenu.prevent="menutext($event, item, index)" @click.stop="addSelect(item)"  @dblclick="addTr(item)"  :class="item.show ? 'selectThe' : ''">
        <td><el-checkbox  @change='selectFileList(item)' v-model="item.check"></el-checkbox></td>
          <td>
            <img src="./../../../assets/image/folder-list.png" v-if="!item.fileType">
            <img src="./../../../assets/image/word-list.png" v-else-if="item.fileType && item.fileSuffix.toLowerCase() === '.doc' || item.fileSuffix.toLowerCase() === '.docx'">
            <img :src="`/fileManager/common/imageView?fileId=${item.id}`" v-else-if="item.fileSuffix.toLowerCase() && item.fileSuffix.toLowerCase() === '.png' || item.fileSuffix.toLowerCase() === '.jpeg' || item.fileSuffix.toLowerCase() === '.png' || item.fileSuffix.toLowerCase() === '.jpg' || item.fileSuffix.toLowerCase() === '.gif'">
            <img src="./../../../assets/image/zip-list.png" v-else-if="item.fileType && item.fileSuffix.toLowerCase() === '.zip' || item.fileSuffix.toLowerCase() === '.rar' || item.fileSuffix.toLowerCase() === '.arj' || item.fileSuffix.toLowerCase() === '.gz' || item.fileSuffix.toLowerCase() === '.z'">
            <img src="./../../../assets/image/music-list.png" v-else-if="item.fileType && item.fileSuffix.toLowerCase() === '.wav' || item.fileSuffix.toLowerCase() === '.aif' || item.fileSuffix.toLowerCase() === '.au' || item.fileSuffix.toLowerCase() === '.mp3' || item.fileSuffix.toLowerCase() === '.ram' || item.fileSuffix.toLowerCase() === '.wma' || item.fileSuffix.toLowerCase() === '.mmf' || item.fileSuffix.toLowerCase() === '.amr' || item.fileSuffix.toLowerCase() === '.aac' || item.fileSuffix.toLowerCase() === '.flac'">
            <img src="./../../../assets/image/video-list.png" v-else-if="item.fileType && item.fileSuffix.toLowerCase() === '.mpg' || item.fileSuffix.toLowerCase() === '.mp4' || item.fileSuffix.toLowerCase() === '.mpeg' || item.fileSuffix.toLowerCase() === '.rm' || item.fileSuffix.toLowerCase() === '.avi' || item.fileSuffix.toLowerCase() === '.rmvb' || item.fileSuffix.toLowerCase() === '.mov' || item.fileSuffix.toLowerCase() === '.wmv' || item.fileSuffix.toLowerCase() === '.asf' || item.fileSuffix.toLowerCase() === '.dat' || item.fileSuffix.toLowerCase() === '.asx' || item.fileSuffix.toLowerCase() === '.wvx' || item.fileSuffix.toLowerCase() === '.mpe' || item.fileSuffix.toLowerCase() === '.mpa'">
            <img src="./../../../assets/image/xls-list.png" v-else-if="item.fileType && item.fileSuffix.toLowerCase() === '.xls' || item.fileSuffix.toLowerCase() === '.xlsx'">
            <img src="./../../../assets/image/ppt-list.png" v-else-if="item.fileType && item.fileSuffix.toLowerCase() === '.ppt' || item.fileSuffix.toLowerCase() === '.pptx'">
            <img src="./../../../assets/image/pdf-list.png" v-else-if="item.fileType && item.fileSuffix.toLowerCase() === '.pdf'">
            <img src="./../../../assets/image/txt-list.png" v-else-if="item.fileType && item.fileSuffix.toLowerCase() === '.txt'">
            <img src="./../../../assets/image/html-list.png" v-else-if="item.fileType && item.fileSuffix.toLowerCase() === '.html'">
            <img src="./../../../assets/image/unknown-list.png" v-else>
            <span v-if="!item.rename">{{ item.name.length > 20 ? item.name.slice(0, 20) + '...' + (item.fileSuffix ? item.fileSuffix : '') : item.name }}</span>
            <el-input v-else placeholder="请输入文件名称" :autofocus="true" @keydown.enter.native="renameFolder" @blur="renameFolder" v-focus="true" v-model="folderNames.name"></el-input>
          </td>
          <td>
            <span v-if="item.fileSize">
              {{ item.fileSize | SizeOf }}
            </span>
            <span v-else>--------</span>
          </td>
          <td>{{item.updateTime | format('yyyy/MM/dd hh:mm')}}</td>
          <td>{{item.userName}}</td>
        </tr>
        <tr v-if="!addFold">
          <td></td>
          <td><img src="./../../../assets/image/folder-list.png"><el-input type="text" :autofocus="true" @keydown.enter.native="addFoldNmae" v-focus="true" placeholder="请输入文件夹名称" @blur="addFoldNmae" v-model="folderName"></el-input></td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
        </tr>
      </tbody>
    </table>
    <div v-if="filesList.length === 0 && addFold" class="noFolder">
      <img src="./../../../assets/image/no-result.png" alt="">
    </div>
    <ul class="selectBox" v-if="listShow" ref="selectMenu" :style="{left: trueLeft + 'px',top: trueTop + 'px'}">
      <li  v-for="(item, index) in operation" :key="index" v-if="
        item.name === '修改权限' ? weight
        : item.name === '复制文件' ? operat
        : item.name === '移动文件' ? moveFolder
        : item.name === '重命名文件' ? reNameFolds
        : item.name === '删除文件' ? delFolder : true
      " @click.stop="renameFold(item)"  ><img :src="item.icon" alt="">{{ item.name }}</li>
    </ul>
    <el-dialog
      @click.native.stop="movesFolder"
      :visible.sync="moveFold"
      :before-close="beforeClose"
      width="450px">
      <div slot="title">{{ changeType === 1 ? '移动到' : changeType === 2 ? '复制到' : '' }}下列文件夹中</div>
      <div class="dialogBody">
        <el-tree
          :data="foldList"
          node-key="id"
          :props="defaultProps"
          :render-content="renderContent"
          @node-click='selectFold'>
        </el-tree>
      </div>
      <div slot="footer">
        <el-button @click.stop="moveFold = false; selectFoldId = ''; selctBox = true">取消</el-button>
        <el-button type="primary" @click.stop="determineFold">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
    :visible.sync="userPermissions"
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
          <div @click.stop="
            treeListView = !treeListView;
            lookPeople = false;
            responsibles = false;
            userFilter = '';
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
                        <span @click.stop="deleteUsers(item)" >x</span>
                      </li>
                    </transition-group>
                  </ul>
                </div>
              </div>
              <div class="footer">
                <el-button type="primary" @click.stop="treeListView = false">确定</el-button>
                <el-button @click.stop="treeListView = false" >取消</el-button>
              </div>
            </div>
          </transition>
        </div>
        <transition name="list" mode="out-in">
          <div v-if="radio === '2'" class="Readwrite">
            <span class="userLabel" @click.stop="ViewUserShow" >查看人员</span>
            <div @click.stop="
              treeListView = false;
              lookPeople = !lookPeople;
              responsibles = false;
              userFilter = '';
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
                          <span @click.stop="deleteViewUser(item)" >x</span>
                        </li>
                      </transition-group>
                    </ul>
                  </div>
                </div>
                <div class="footer">
                  <el-button type="primary" @click.stop="lookPeople = false">确定</el-button>
                  <el-button @click.stop="lookPeople = false" >取消</el-button>
                </div>
              </div>
            </transition>
          </div>
        </transition>
        <div class="Readwrite responsiblePeople">
          <span class="userLabel" @click.stop="responsibleShow">负责人</span>
            <div @click.stop="
            treeListView = false;
            lookPeople = false;
            responsibles = !responsibles;
            userFilter = '';
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
                          <span @click.stop="deleteResponsible(item)" >x</span>
                        </li>
                      </transition-group>
                    </ul>
                  </div>
                </div>
                <div class="footer">
                  <el-button type="primary" @click.stop="responsibles = false">确定</el-button>
                  <el-button @click.stop="responsibles = false" >取消</el-button>
                </div>
              </div>
            </transition>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.stop="userPermissions = false; selctBox = true;">取消</el-button>
        <el-button type="pirmary" @click.stop="updateFolder" >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import move from '@/assets/image/move-selected.png'
import rename from '@/assets/image/rename-selected.png'
import deletes from '@/assets/image/delete-selected.png'
import copy from '@/assets/image/copy-selected.png'
import download from '@/assets/image/download-selected.png'
import creatshare from '@/assets/image/cancelShare-selected.png'
import folder from '@/assets/image/folder-list.png'
import { Tree } from './../../../utils/tree'
import picure from './../../../assets/image/picture-list.png'
import * as config from './../../../config'
// import BoxChoose from './../../../utils/boxChoose'
export default {
  name: 'fileList',
  props: ['folderList'],
  data () {
    return {
      picure,
      chooseBox: '',
      addFold: true,
      folderName: '',
      filesList: [],
      canvasBool: true,
      listShow: false,
      trueLeft: 0,
      trueTop: 0,
      folderNames: '',
      operation: [{icon: rename, name: '重命名文件'}, {icon: download, name: '下载文件'}, {icon: deletes, name: '删除文件'}, {icon: move, name: '移动文件'}, {icon: copy, name: '复制文件'}, {icon: creatshare, name: '修改权限'}],
      moveFold: false,
      defaultProps: {
        children: 'children',
        name: 'name'
      },
      userTreeProp: {
        children: 'children',
        label: 'name'
      },
      selectFoldId: '',
      changeType: '',
      userTree: [],
      userPermissions: false,
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
      checkSelect: false,
      isIndeterminate: false,
      weight: true,
      operat: true,
      reNameFolds: true,
      delFolder: true,
      moveFolder: true,
      foldList: [],
      adminFlag: '',
      ascending: '',
      ascendTime: ''
    }
  },
  watch: {
    folderList (item) {
      this.checkSelect = false
      this.listShow = false
      this.isIndeterminate = false
      this.filesList = [...item, ...{check: false}]
      this.folderList.forEach(item => {
        item.show = false
        item.check = false
      })
    },
    userFilter (item) {
      this.$refs.userTreeFilter.filter(item)
    }
  },
  methods: {
    movesFolder () {
    },
    sortTop () {
      this.ascendTime = ''
      this.ascending = true
      this.$store.dispatch('sortTopName', this.ascending)
    },
    sortBottom () {
      this.ascendTime = ''
      this.ascending = false
      this.$store.dispatch('sortTopName', this.ascending)
    },
    sortTimeTop () {
      this.ascending = ''
      this.ascendTime = true
      this.$store.dispatch('sortTime', this.ascendTime)
    },
    sortTimeBottom () {
      this.ascending = ''
      this.ascendTime = false
      this.$store.dispatch('sortTime', this.ascendTime)
    },
    closeFold () {
      this.$forceUpdate()
      this.filesList.forEach(item => {
        item.show = false
        item.userName += ' '
        item.rename = false
        item.check = false
      })
      this.isIndeterminate = false
      this.listShow = false
      this.trueLeft = 0
      this.trueTop = 0
    },
    addSelect (item) {
      this.$forceUpdate()
      item.check = !item.check
      item.show = !item.show
      this.listShow = false
      let arr = []
      this.folderList.forEach(item => {
        if (item.check) {
          arr.push(true)
        } else {
          arr.push(false)
        }
      })
      if (arr.includes(true)) {
        this.isIndeterminate = true
      } else {
        this.isIndeterminate = false
      }
      this.$emit('fileList', this.filesList)
    },
    selectFileList (item) {
      this.$forceUpdate()
      this.listShow = false
      item.show = !item.show
      let count = this.filesList.filter(item => item.check)
      count.length === this.filesList.length ? this.checkSelect = true : this.checkSelect = false
      if (this.checkSelect) {
        this.isIndeterminate = false
      } else {
        this.isIndeterminate = true
      }
      if (count.length === 0) {
        this.isIndeterminate = false
      }
      this.$emit('fileList', this.filesList)
    },
    changeBox () {
      this.$forceUpdate()
      this.folderList.forEach(item => {
        if (this.checkSelect) {
          item.show = true
          item.check = true
          this.isIndeterminate = false
        } else {
          item.show = false
          item.check = false
        }
      })
      this.$emit('fileList', this.filesList)
    },
    // 弹窗关闭回调
    beforeClose (done) {
      this.selctBox = true
      this.treeListView = false
      this.lookPeople = false
      this.responsibles = false
      this.userList = []
      this.viewUserList = []
      this.responsibleList = []
      done()
      this.$nextTick(() => {
        this.selctBoxs()
      })
    },
    // 鼠标右击菜单
    menutext (e, item, index) {
      this.$forceUpdate()
      this.filesList.forEach(item => {
        item.check = false
        item.show = false
      })
      item.check = true
      item.show = true
      this.listShow = true
      this.$nextTick(() => {
        if (e.pageY + this.$refs.selectMenu.offsetHeight > document.body.offsetHeight) {
          this.trueTop = e.pageY - this.$refs.selectMenu.offsetHeight
        } else {
          this.trueTop = e.pageY
        }
        if (e.pageX + this.$refs.selectMenu.offsetWidth > document.body.offsetWidth) {
          this.trueLeft = e.pageX - this.$refs.selectMenu.offsetWidth
        } else {
          this.trueLeft = e.pageX
        }
      })
      if (this.adminFlag) {
        this.option = true
        if (item.folderLevel > 2) {
          this.moveFolder = true
          this.weight = false
        } else {
          this.weight = true
          this.moveFolder = false
        }
        if (item.fileType) {
          this.moveFolder = true
          this.weight = false
        }
        this.$emit('fileList', this.filesList)
      } else {
        const folderContent = item.fileType ? this.$store.state.foldList.filter(items => items.id === Number(this.$store.state.lookFolder.parentFolder))[0] : item
        const arr = folderContent.parentIds.split(',')
        let foldWeight = null
        let fileManager = []
        if (folderContent.folderLevel > 2) {
          foldWeight = arr.splice(1, 2)
        } else if (folderContent.folderLevel === 1) {
          foldWeight = [folderContent.id]
          foldWeight.forEach((items, index) => {
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
        } else if (folderContent.folderLevel === 2) {
          foldWeight = [folderContent.parentId, folderContent.id]
        }
        if (folderContent.folderLevel !== 1) {
          foldWeight.forEach((items, index) => {
            var weightFolderOption = this.$store.state.foldList.filter(data => data.id === Number(items))[0]
            if (index === 0) {
              if (weightFolderOption.fileManager === 1) {
                fileManager.push(1)
                if (weightFolderOption.fileUpload === 1) {
                  fileManager.push(2)
                }
                if (weightFolderOption.fileView === 1) {
                  fileManager.push(3)
                }
              }
            } else {
              if (weightFolderOption.fileManager === 1) {
                fileManager.push(1)
              }
              if (weightFolderOption.fileUpload === 1) {
                fileManager.push(2)
              }
              if (weightFolderOption.fileView === 1) {
                fileManager.push(3)
              }
            }
          })
        }
        if (folderContent.folderLevel === 1 || folderContent.folderLevel === 2) {
          this.operat = true
          if (item.fileType) {
            this.moveFolder = true
            this.weight = false
          } else {
            this.moveFolder = false
            this.weight = true
          }
          if (fileManager.includes(1)) {
            this.reNameFolds = true
            this.delFolder = true
            if (item.fileType) {
              this.moveFolder = true
            } else {
              this.moveFolder = false
            }
          } else {
            this.reNameFolds = false
            this.delFolder = false
            this.weight = false
            this.moveFolder = false
          }
        } else {
          this.weight = false
          this.operat = true
          if (fileManager.includes(1)) {
            this.reNameFolds = true
            this.delFolder = true
            this.moveFolder = true
          } else {
            this.reNameFolds = false
            this.delFolder = false
            this.moveFolder = false
          }
        }
      }
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
      this.userPermissions = false
      this.userList = []
      this.viewUserList = []
      this.responsibleList = []
      await this.$store.dispatch('updateFolder', {
        folderId: this.folderNames.id,
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
      this.userFilter = ''
      let arr = []
      this.userList.forEach((items, index) => {
        arr.push(items.userId)
      })
      setTimeout(() => {
        this.userBool = true
        if (this.$refs.userTreeFilter) {
          this.$refs.userTreeFilter.setCheckedKeys(arr)
        }
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
        if (this.$refs.userTreeFilter) {
          this.$refs.userTreeFilter.setCheckedKeys(arr)
        }
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
        if (this.$refs.userTreeFilter) {
          this.$refs.userTreeFilter.setCheckedKeys(arr)
        }
      }, 200)
    },
    ViewUserShow () {
      this.lookPeople = !this.lookPeople
      this.treeListView = false
      this.responsibles = false
      this.userFilter = ''
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
        if (this.$refs.userTreeFilter) {
          this.$refs.userTreeFilter.setCheckedKeys(arr)
        }
      }, 200)
    },
    responsibleShow () {
      this.treeListView = false
      this.lookPeople = false
      this.responsibles = !this.responsibles
      this.userFilter = ''
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
    // 树节点筛选
    filterNode (val, data) {
      if (!val) return true
      return data.name.indexOf(val) !== -1
    },
    // 选择文件夹 移动带某个文件夹
    async determineFold () {
      let folderIds = []
      let fileIds = []
      this.filesList.forEach(item => {
        if (item.show && item.fileSuffix) {
          fileIds.push(item.id)
        } else if (item.show && !item.fileSuffix) {
          folderIds.push(item.id)
        }
      })
      if (folderIds.length || fileIds.length) {
        await this.$store.dispatch('move', {
          toFolderId: this.selectFoldId,
          fromFolderId: this.$store.state.lookFolder.parentFolder ? this.$store.state.lookFolder.parentFolder : 0,
          folderIds: folderIds.join(','),
          fileIds: fileIds.join(','),
          type: this.changeType
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
        this.moveFold = false
        this.selctBox = true
      } else {
        this.$alert('请选择文件', '警告', {
          confirmButtonText: '确定'
        })
      }
    },
    // 树节点点击时的回调
    selectFold (data) {
      this.selectFoldId = data.id
    },
    // 树形结构渲染
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <img src={ folder } />
          <span>{data.name}</span>
        </span>
      )
    },
    // 修改名字
    async renameFolder () {
      if (!this.folderNames.fileSuffix) {
        await this.$store.dispatch('renamefold', {
          folderId: this.folderNames.id,
          folderName: this.folderNames.name
        })
      } else {
        await this.$store.dispatch('renamefile', {
          fileId: this.folderNames.id,
          name: this.folderNames.name
        })
      }
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
    // 点击操作控制
    async renameFold (item) {
      this.listShow = false
      this.trueLeft = 0
      this.trueTop = 0
      if (item.name !== '重命名文件') {
        this.filesList.forEach(item => {
          item.rename = false
          item.userName += ' '
        })
      }
      if (item.name === '重命名文件') {
        this.filesList.forEach(item => {
          if (item.show) {
            item.rename = true
            this.folderNames = item
            item.userName += ' '
          } else {
            item.rename = false
          }
        })
      } else if (item.name === '删除文件') {
        this.$confirm(`<span style='color:red'>确认要把所选文件放入回收站吗？<br/>删除的文件只有管理员可以通过回收箱还原？</span>`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(async () => {
          this.filesList.forEach(item => {
            if (item.show) {
              this.folderNames = item
            }
          })
          await this.$store.dispatch('deleteFold', {
            folderId: this.$store.state.lookFolder.parentFolder ? this.$store.state.lookFolder.parentFolder : 0,
            fileIds: this.folderNames.fileSuffix ? this.folderNames.id : '',
            folderIds: this.folderNames.fileSuffix ? '' : this.folderNames.id
          })
          if (this.$store.state.lookFolder.parentFolder) {
            await this.$store.dispatch('getFolder')
            await this.$store.dispatch('getFolder')
            await this.$store.dispatch('folderList')
          } else {
            await this.$store.dispatch('folderList')
            var allFold = this.$store.state.foldList.filter(item => item.parentId === 0)
            this.$store.dispatch('allFold', allFold)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (item.name === '移动文件') {
        await this.$store.dispatch('getActionFold')
        this.foldList = new Tree(this.$store.state.lookFolder.actionsFolder).comprehensive(0)
        this.changeType = 1
        this.moveFold = true
        this.selctBox = false
      } else if (item.name === '复制文件') {
        await this.$store.dispatch('getActionFold')
        this.foldList = new Tree(this.$store.state.lookFolder.actionsFolder).comprehensive(0)
        this.changeType = 2
        this.moveFold = true
        this.selctBox = false
      } else if (item.name === '修改权限') {
        this.userPermissions = true
        this.selctBox = false
        await this.$store.dispatch('getUser')
        this.filesList.forEach(item => {
          if (item.show) {
            this.folderNames = item
          }
        })
        this.radio = this.folderNames.viewType + ''
        let users = this.$store.state.lookFolder.userList.users.map(item => {
          item.parentId = item.deptId
          return item
        })
        await this.$store.dispatch('getFolderUser', {
          folderId: this.folderNames.id
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
      } else if (item.name === '下载文件') {
        this.filesList.forEach(items => {
          if (items.show) {
            this.folderNames = items
          }
        })
        if (this.folderNames.fileType) {
          window.open(`${config.contextPath}/common/fileDownload?folderId=${this.$store.state.lookFolder.parentFolder}&fileIds=${this.folderNames.id}`)
        } else {
          window.open(`${config.contextPath}/common/fileDownload?folderId=${this.$store.state.lookFolder.parentFolder}&folderIds=${this.folderNames.id}`)
        }
      }
    },
    // 双击进入文件中
    async addTr (item) {
      this.listShow = false
      this.trueLeft = 0
      this.trueTop = 0
      this.isIndeterminate = false
      if (!item.fileType) {
        await this.$store.dispatch('parentFold', item.id)
        this.$parent.sameLevel.$emit('enterThe')
        this.$store.dispatch('getFolder')
      } else {
        this.$emit('preView', item)
      }
    },
    // 新建文件夹
    async addFoldNmae () {
      if (this.folderName === '') {
        this.addFold = true
      } else {
        await this.$store.dispatch('addFolder', {
          parentId: this.$store.state.lookFolder.parentFolder ? this.$store.state.lookFolder.parentFolder : 0,
          folderName: this.folderName
        })
        this.folderName = ''
        this.addFold = true
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
      }
    },
    listView () {
      this.listShow = false
    },
    selctBoxs () {
      // const _this = this
      // this.chooseBox = new BoxChoose('.boxSelect', (item) => {
      //   if (item.move) {
      //     _this.listShow = false
      //   }
      //   if (item.type === 'move') {
      //     for (var i = 0; i < _this.$refs.selectFiles.length; i++) {
      //       var sl = _this.$refs.selectFiles[i].offsetWidth + _this.$refs.selectFiles[i].offsetLeft
      //       var st = _this.$refs.selectFiles[i].offsetHeight + _this.$refs.selectFiles[i].offsetTop
      //       if (sl > item.startX && st > item.startY && _this.$refs.selectFiles[i].offsetLeft < item.startX + item.width && _this.$refs.selectFiles[i].offsetTop < item.startY + item.height) {
      //         _this.filesList[i].show = true
      //         _this.filesList[i].userName += ' '
      //       } else {
      //         _this.filesList[i].show = false
      //         _this.filesList[i].userName += ' '
      //       }
      //       _this.$emit('fileList', _this.filesList)
      //     }
      //   }
      // })
    }
  },
  async mounted () {
    console.log(sessionStorage.folderId)
    // const _this = this
    // this.chooseBox = new BoxChoose('.boxSelect', (item) => {
    //   if (item.move) {
    //     _this.listShow = false
    //   }
    //   if (item.type === 'move') {
    //     for (var i = 0; i < _this.$refs.selectFiles.length; i++) {
    //       var sl = _this.$refs.selectFiles[i].offsetWidth + _this.$refs.selectFiles[i].offsetLeft
    //       var st = _this.$refs.selectFiles[i].offsetHeight + _this.$refs.selectFiles[i].offsetTop
    //       if (sl > item.startX && st > item.startY && _this.$refs.selectFiles[i].offsetLeft < item.startX + item.width && _this.$refs.selectFiles[i].offsetTop < item.startY + item.height) {
    //         _this.filesList[i].show = true
    //         _this.filesList[i].userName += ' '
    //       } else {
    //         _this.filesList[i].show = false
    //         _this.filesList[i].userName += ' '
    //       }
    //       _this.$emit('fileList', _this.filesList)
    //     }
    //   }
    // })
    // document.addEventListener('dblclick', (value) => {
    //   this.filesList.forEach(item => {
    //     item.show = false
    //     item.userName += ' '
    //     item.rename = false
    //   })
    //   this.listShow = false
    //   this.trueLeft = 0
    //   this.trueTop = 0
    //   _this.$emit('fileList', _this.filesList)
    // })
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
  async beforeCreate () {
    if (sessionStorage.folderId) {
      await this.$store.dispatch('folderList')
      await this.$store.dispatch('parentFold', sessionStorage.folderId)
      this.$parent.sameLevel.$emit('enterThe')
      this.$store.dispatch('getFolder')
    } else {
      await this.$store.dispatch('folderList')
      this.adminFlag = this.$store.state.user.adminFlag
      this.filesList = this.$store.state.lookFolder.folderList
      this.$parent.sameLevel.$on('add', value => {
        this.filesList.forEach(item => {
          item.show = false
          item.check = false
          item.rename = false
        })
        this.addFold = false
        this.listShow = false
      })
      this.$parent.sameLevel.$on('changeType', async value => {
        await this.$store.dispatch('getActionFold')
        this.foldList = new Tree(this.$store.state.lookFolder.actionsFolder).comprehensive(0)
        let check = this.filesList.map(item => item.check)
        if (check.includes(true)) {
          this.moveFold = true
          this.changeType = value
          this.listShow = false
          this.selctBox = false
        } else {
          this.$message({
            type: 'info',
            message: '请先选择文件'
          })
        }
      })
      this.$parent.sameLevel.$on('listViews', value => {
        this.listShow = false
        this.selctBox = false
      })
      this.$parent.sameLevel.$on('downloadFile', value => {
        let fileIds = []
        let folderIds = []
        this.filesList.forEach(item => {
          if (item.show) {
            if (item.fileSuffix) {
              fileIds.push(item.id)
            } else {
              folderIds.push(item.id)
            }
          }
        })
        if (!folderIds.length && !fileIds.length) {
          this.$message({
            type: 'info',
            message: '请先选择文件'
          })
        } else {
          window.open(`${config.contextPath}/common/fileDownload?folderId=${this.$store.state.lookFolder.parentFolder}&folderIds=${folderIds.join(',')}&fileIds=${fileIds.join(',')}`)
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
  .fileList {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    overflow-y: auto;
    .boxSelect {
      position:absolute;
      width:0;
      height:0;
      margin:0;
      padding:0;
      border: 1px #0099FF dashed;
      background: rgba(195, 213, 237, 0.6);
      z-index:1000;
      opacity:0.6;
      top: 0;
      left: 0;
    }
    .write {
      width: 100%;
      height: 100%;
      z-index: 1;
      position: absolute;
    }
    table {
      width: 80%;
      position: absolute;
      z-index: 2;
      thead {
        user-select:none;
        tr {
          td {
            padding: 10px;
            vertical-align: middle;
            .sortNmae {
              display: flex;
              align-items: center;
              div:nth-child(1) {
                display: flex;
                flex-direction: column;
                margin-right: 10px;
              }
              i {
                cursor: pointer;
                font-size: 18px;
              }
              .iclassName {
                color: #0099FF;
              }
            }
          }
          border: 1px solid #E3E3E3;
        }
      }
      tbody {
        user-select:none;
        tr {
          border: 1px solid #E3E3E3;
          td {
            padding: 10px;
            img {
              width: 40px;
              height: 40px;
              margin-right: 15px;
            }
            img + div {
              width: 50%;
              margin-left: 30px;
            }
            &:nth-child(1) {
              width: 60px;
              text-align: center;
            }
          }
          &:hover {
            cursor: pointer;
            background: #c6e2ff;
          }
          &.selectThe {
            background: #c6e2ff;
          }
        }
      }
    }
    .noFolder {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .selectBox {
      width: 150px;
      background: #fff;
      border: 1px solid #E3E3E3;
      position: fixed;
      z-index: 9999999;
      border-radius: 5px;
      li {
        user-select: none;
        margin: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          margin-right: 10px;
        }
      }
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
            }
            .selectUserList {
              height: 250px;
              overflow: auto;
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
</style>
