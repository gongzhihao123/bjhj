<template>
  <div class="capability common">
    <section class ="section-crumbs">
      <el-breadcrumb separator=">" class="crumbs">
        <el-breadcrumb-item :to="{ path: '/knowledge/list' }">知识点管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/knowledge/list' }">{{ phase.gradeName }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/knowledge/list' }">{{ phase.courseName }}</el-breadcrumb-item>
        <el-breadcrumb-item>能力等级</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <section class="section-content">
      <section class="nav">
        <ul>
          <li @click="onShowOne"><span :class="{active: isActiveOne}">知识点</span></li>
          <li @click="onShowTwo"><span :class="{active: isActiveTwo}">能力等级</span></li>
        </ul>
      </section>
      <section class="content">
        <section class="content-nav">
          <span v-for="(item, i) in fileLists" :key="item.name" :class="{checking: activeInd == i}" @click="activeTab(item, i)">
            <span v-if="activeInd == i">{{ item.name }}</span>
            <span v-else-if="activeInd !== i && item.name.length > 6">{{item.name.substring(0,6)}}...</span>
            <span v-else>{{item.name}}</span>
            <em class="small-close" @click="deleteFileDetails(item)">x</em>
          </span>
          <!-- <span class="addNew" @click="addNewFile" :class="{checking: checked}<span @click="addNewFile" :class="{checking: activeInd == 0}">+</span>">+</span> -->
          <span @click="addNewFile" :class="{addChecking: fileLists.length === 0, addNew: fileLists.length !== 0}">+</span>
        </section>

        <section class="content-contents" v-show="fileLists.length">
         <!-- 能力等级 -->
         <el-button class="green add-knowladge" @click="addDetails">新增能力等级</el-button>
         <div v-loading="loading">
           <table>
            <tr>
              <th>等级</th>
              <th>能力</th>
              <th>管理</th>
            </tr>
            <tr v-for="item in capabilityList" :key="item.gradeLevel">
              <td>{{ item.gradeLevel }}</td>
              <td>{{ item.gradeName }}</td>
              <td>
                <el-button size="mini" @click="changeDetails(item)" class="edit small-btn"></el-button>
                <el-button size="mini" @click="deleteDetails(item)" class="delete small-btn"></el-button>
              </td>
            </tr>
            <tr v-if="capabilityList.length == 0">
              <td colspan="3">暂无数据</td>
            </tr>
          </table>
         </div>
         
        </section>
      </section>
    </section>
    <!--新增能力等级-->
    <el-dialog
      title="新增能力等级文件夹"
      :visible.sync="addNewKnowledgeDialog"
      class="add-new-dialog"
      :show-close="false">
      <i class="el-icon-close close" @click="addNewKnowledgeDialog = false"></i>
      <table class="dialog-table">
        <tr>
          <td>名称：</td>
          <td>
            <el-input v-model="newFileName" placeholder="文件夹名称不能超过20个字符" class="dialog-table-input" :maxlength="20"></el-input>
          </td>
        </tr>
        <tr>
          <td>引用能力等级：</td>
          <td>
            <el-select v-model="knowledgeId" placeholder="不引用" class="dialog-table-input">
              <el-option
                v-for="item in fileLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addNewKnowledgeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNewFileSure" :disabled="addFolder">{{ addFolder ? '保存中...' : '保 存' }}</el-button>
      </span>
    </el-dialog>

    <!-- 删除文件夹 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteFolderDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="deleteFolderDialog = false"></i>
      <span>确定删除该文件以及该文件内的所有知识点吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteFolderDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteFileSure">确 定</el-button>
      </span>
    </el-dialog>

    <!--删除-->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="deleteDialog = false"></i>
      <span>确定删除此条能力等级设置吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteCapabilityLevel">确 定</el-button>
      </span>
    </el-dialog>

     <!--新增等级-->
    <el-dialog
      :title=addOrEdit
      :visible.sync="addDialog"
      class="add-new-dialog"
      :show-close="false">
      <i class="el-icon-close close" @click="addDialog = false"></i>
      <table class="dialog-table">
        <tr>
          <td>等级：</td>
          <td>
            <!-- <el-input v-model="newLevelNum" placeholder="请输入" class="dialog-table-input" max-length="50"></el-input> -->
            <el-select v-model="newLevelNum" style="width: 100%;">
              <el-option
                v-for="(item, i) in ability"
                :key="i"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>能力：</td>
          <td>
            <el-input v-model="newLevelName" placeholder="请输入" class="dialog-table-input" max-length="50"></el-input>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCapabilityLevel" :disabled="addFile">{{ addFile ? '保存中...' : '保 存' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { success, notice } from '../../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'capability',
  data () {
    return {
      loading: false,
      isActiveOne: false,
      input2: '',
      isActiveTwo: true,
      addNewKnowledgeDialog: false,
      newFileName: '',
      deleteFolderDialog: false,
      knowledgeId: '',
      fileLists: [],
      activeInd: 0,
      checked: false,
      data2: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        },
        {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        },
        {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      addOrEdit: '',
      deleteDialog: false,
      addDialog: false,
      uploadShow: false,
      capabilityList: [],
      treeMenu: [
        { name: '知识点管理' }
      ],
      infoId: '',
      folderId: '',
      newLevelName: '',
      newLevelNum: '',
      deleteId: '',
      levelId: '',
      phase: {
        gradeName: '',
        courseName: ''
      },
      bigFileId: '',
      addFolder: false,
      addFile: false,
      ability: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  },
  methods: {
    onShowOne () {
      this.isActiveOne = true
      this.isActiveTwo = false
      this.$router.push({path: '/knowledge/subjectDetail', query: {infoId: this.infoId, gradeName: this.$route.query.gradeName, courseName: this.$route.query.courseName}})
    },
    onShowTwo () {
      this.isActiveOne = false
      this.isActiveTwo = true
    },
    // 新建文件
    addNewFile () {
      this.checked = true
      this.addNewKnowledgeDialog = true
      this.newFileName = ''
      this.knowledgeId = ''
    },
    // 切换选项卡
    activeTab (item, i) {
      this.activeInd = i
      this.folderId = item.id
      this.getInfoList()
    },

    // 删除详情
    deleteDetails (item) {
      this.deleteId = item.id
      this.deleteDialog = true
    },

    // 删除文件夹
    deleteFileDetails (item) {
      this.bigFileId = item.id
      this.deleteFolderDialog = true
    },

    // 编辑详情
    changeDetails (item) {
      this.addOrEdit = '编辑能力等级'
      this.newLevelNum = item.gradeLevel
      this.newLevelName = item.gradeName
      this.levelId = item.id
      this.addDialog = true
    },

    // 新增详情
    addDetails () {
      this.addOrEdit = '新增能力等级'
      this.newLevelNum = ''
      this.newLevelName = ''
      this.addDialog = true
    },
    // 获取文件夹列表
    getList () {
      this.loading = true
      this.$https.get(`knowledge/folderList?knowledgeGradeCourseId=${this.infoId}&type=${2}`)
      .then(res => {
        if (res.data.code === 1) {
          this.fileLists = res.data.result || []
          if (!res.data.result || res.data.result.length === 0) return
          this.folderId = this.folderId ? this.folderId : res.data.result[0].id
          this.getInfoList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 新增能力等级文件夹信息
    addNewFileSure () {
      // if (!this.knowledgeId) {
      //   this.knowledgeId = 0
      // }
      if (this.newFileName.length > 20) {
        notice(this, '文件夹标题长度不能超过20个字符', 2000)
        return
      }
      if (!this.newFileName || this.newFileName.trim() === '') {
        notice(this, '请填写能力等级文件夹名称', 2000)
        return
      }
      this.addFolder = true
      this.$https.post(`knowledge/masteryFolderAdd`, querystring.stringify({
        knowledgeGradeCourseId: this.infoId,
        name: this.newFileName,
        folderId: this.knowledgeId || 0
      }))
      .then(res => {
        this.addFolder = false
        if (res.data.code === 1) {
          this.addNewKnowledgeDialog = false
          success(this, res.data.message, 2000)
          this.getList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除能力等级文件夹信息
    deleteFileSure () {
      this.$https.post(`knowledge/masteryFolderDelete`, querystring.stringify({
        id: this.bigFileId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.folderId = ''
          this.getList()
          this.deleteFolderDialog = false
          this.activeInd = 0
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取能力等级信息列表
    getInfoList () {
      this.$https.get(`knowledge/masteryList?folderId=${this.folderId}`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.capabilityList = res.data.result || []
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 新增能力等级
    addCapabilityLevel () {
      if (!this.newLevelNum || this.newLevelNum.trim() === '') {
        notice(this, '输入不能为空', 2000)
        return
      }
      if (!this.newLevelName || this.newLevelName.trim() === '') {
        notice(this, '输入不能为空', 2000)
        return
      }
      let obj = {}
      if (this.addOrEdit === '编辑能力等级') {
        obj.id = this.levelId
        obj.folderId = this.folderId
        obj.gradeLevel = this.newLevelNum
        obj.gradeName = this.newLevelName
      } else if (this.addOrEdit === '新增能力等级') {
        obj.folderId = this.folderId
        obj.gradeLevel = this.newLevelNum
        obj.gradeName = this.newLevelName
      }
      this.addFile = true
      this.$https.post(`knowledge/masterySave`, querystring.stringify({
        ...obj
      }))
      .then(res => {
        this.addFile = false
        if (res.data.code === 1) {
          this.addDialog = false
          this.getInfoList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除能力等级信息
    deleteCapabilityLevel () {
      this.$https.post(`knowledge/masteryDelete`, querystring.stringify({
        id: this.deleteId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.deleteDialog = false
          success(this, res.data.message, 2000)
          this.getInfoList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  // filters: {
  //   textLength (val) {
  //     if (val.length > 4) {
  //       return val.subString(0, 4) + '...'
  //     } else {
  //       return val
  //     }
  //   }
  // },
  filters: {
    textLength (val) {
      if (val) {
        if (val.length > 36) {
          return val.substring(0, 36) + '...'
        } else {
          return val
        }
      }
    }
  },
  created () {
    this.infoId = this.$route.query.infoId
    this.phase.gradeName = this.$route.query.gradeName
    this.phase.courseName = this.$route.query.courseName
    this.getList()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
.capability {
  .nav {
    height: 40px;
    width: 100%;
    background: #ddd;
    line-height: 40px;
    background: #fff;
    font-size: 14px;
    color: #435a6c;
    ul li {
      float: left;
      width: 200px;
      &>span {
        display: inline-block;
        width: 80px;
        text-align: center;
        cursor: pointer;
      }
    }
    .active {
      border-bottom: 2px solid #23a4e6;
      color: #23a4e6;
    }
  }
  // .section-content {
  //   min-width: 100% !important;
  // }
  .content {
    width: 100%;
    height: calc(89%);
    background: #fff;
    margin-top: 20px;
    .content-nav {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      min-height: 40px;
      line-height: 40px;
      font-size: 0;
      background: #EEF2F5;
      .checking {
        background: #fff;
        border-radius: 4px 4px 0 0;
      }
      &>span {
        position: relative;
        display: inline-block;
        min-width: 130px;
        height: 40px;
        padding: 0 10px;
        font-size: 14px;
        text-align: center;
        background: #EEF2F5;
        border-radius: 4px 0;
        cursor: pointer;
      }
      .small-close {
        position: absolute;
        right: -4px;
        top: -5px;
        display: inline-block;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 50%;
        background: #78797B;
        color: #fff;
        z-index: 99;
        display: none;
      }
      span:hover .small-close {
        display: block;
      }
      .addNew {
        font-size: 30px;
        font-weight: bold;
        color: #b3d7f3;
        cursor: pointer;
      }
      .addChecking {
        font-size: 30px;
        font-weight: bold;
        color: #b3d7f3;
        cursor: pointer;
        background: #fff;
      }
    }
    .content-contents {
      padding: 40px;
      width: calc(100% - 80px);
      height: calc(100% - 160px);
      >div{
        // margin-top: 30px;
        width: 100%;
        max-height: 450px;
        overflow: auto;
        >table {
          width: 100%;
          // height:50px;
          // overflow: auto;
          margin-top: 20px;
          tr {
            height: 36px;
            th,td {
              border: 1px solid #ccc;
              text-align: center;
            }
            th {
              background: #EEF2F5;
            }
            td {
              .edit {
                background: url(../../../assets/icons/edit.png) no-repeat center;
              }
              .edit:hover {
                background: url(../../../assets/icons/editing.png) no-repeat center;
              }
              // 树里面的删除小图标
              .delete {
                background: url(../../../assets/icons/delete.png) no-repeat center;
              }
              .delete:hover {
                background: url(../../../assets/icons/deleteing.png) no-repeat center;
              }
            }
          }
          // 小图标统一样式
          .small-btn {
            width: 28px !important;
            height: 28px !important;
            border: 0;
            position: relative;
            cursor: pointer;
            .small-tooltip {
              position: absolute;
              left: 30px;
              top: 4px;
              display: none;
              width: 40px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              background: #666;
              font-size: 12px;
              color: #fff;
              border-radius: 2px;
              z-index: 99;
            }
          }
        }
      }
    }
  }
  .add-new-dialog {
    table {
      height: 100px !important;
      tr {
        td:first-child {
          text-align: right;
        }
        td:last-child {
          padding-left: 10px;
        }
      }
    }
  }
  .blue {
    background-color: #55ACEE;
    border: 0;
    padding-left: 36px;
    color: #fff;
    font-size: 12px;
  }
  .green {
    background-color: #7fce89;
    padding-left: 36px;
    border: 0;
    color: #fff;
    font-size: 12px;
  }
  .add-knowladge {
    background: #7fce89 url(../../../assets/icons/addKnowledeg.png) no-repeat 6px center;
  }
  .dialog-table-input {
    .el-input__inner {
      width: 300px !important;
    }
  }
  .el-dialog {
    .downloadTemplate {
      color: $theme;
      cursor: pointer;
    }

    p {
      line-height: 34px;
    }
    
    section {
      margin-top: 20px;

      h3 {
        display: inline;
        float: left;
        height: 48px;
        line-height: 48px;
      }

      .upload-demo {
        display: inline;

        .el-upload {
          float: right;
          margin-left: 40px;
          margin-top: 4px;
        }

        ul {
          float: right;
          width: 240px;
          height: 40px;
          // transform: translateY(-9px);
          border: 1px solid $border-color;
          border-radius: 6px;
          overflow: hidden;
          // margin-right: 20px;
        }

        .el-upload-list__item-status-label, .el-icon-close {
          display: none;
        }
      }
    }
  }
}
</style>
  