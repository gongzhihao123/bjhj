<template>
  <div class="subject-detail common">
    <section class ="section-crumbs">
      <el-breadcrumb separator=">" class="crumbs">
        <el-breadcrumb-item :to="{ path: '/knowledge/list' }">知识点管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/knowledge/list' }">{{ phase.gradeName }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/knowledge/list' }">{{ phase.courseName }}</el-breadcrumb-item>
        <el-breadcrumb-item>知识点</el-breadcrumb-item>
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
            <em class="small-close" @click="deleteDetails(item)">x</em>
          </span>
          <span @click="addNewFile" :class="{addChecking: fileLists.length === 0, addNew: fileLists.length !== 0}">+</span>
        </section>

        <section class="content-contents" v-show="fileLists.length">
          <el-button class="green add-knowladge" @click="addDetails(1)">新增知识点</el-button>
          <el-button class="blue upload" @click="leadClick">批量上传</el-button>
          <el-button class="blue download" @click="pointDownload">批量下载</el-button>
          <el-input
            class="search"
            placeholder="输入规则关键词搜索"
            icon="search"
            v-model="keyword">
          </el-input>
          <div class="knowledge-list" v-loading="loading">
            <el-tree
              :data="dataList"
              :props="defaultProps"
              node-key="id"
              :highlight-current="false"
              :expand-on-click-node="false"
              :render-content="renderContent"
              :filter-node-method="filterNode"
              :default-expanded-keys="defaultList"
              ref="tree">
            </el-tree>
          </div>
        </section>
      </section>
    </section>
    <!--新增文件夹-->
    <el-dialog
      title="新增知识点文件夹"
      :visible.sync="addNewKnowledgeDialog"
      class="add-new-dialog"
      :show-close="false">
      <i class="el-icon-close close" @click="addNewKnowledgeDialog = false"></i>
      <table class="dialog-table">
        <tr>
          <td>名称：</td>
          <td>
            <el-input v-model="newFileName" placeholder="文件夹名称不能超过20个字符"  class="dialog-table-input" :maxlength="20"></el-input>
          </td>
        </tr>
        <tr>
          <td>引用知识点：</td>
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
        <el-button type="primary" @click="addNewFileSure" :disabled="filedDisable">{{filedDisable ? '保存中...' : '保 存'}}</el-button>
      </span>
    </el-dialog>

    <!--删除文件夹-->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="deleteDialog = false"></i>
      <span>确定删除该文件以及该文件内的所有知识点吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteFileSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除知识点 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogOne"
      :show-close="false">
      <i class="el-icon-close close" @click="deleteDialogOne = false"></i>
      <span>确定删除该知识点吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteDialogOne = false">取 消</el-button>
        <el-button type="primary" @click="deleteOne">确 定</el-button>
      </span>
    </el-dialog>

     <!--新增知识点-->
    <el-dialog
      :title=addOrEdit
      :visible.sync="addDialog"
      class="add-new-dialog"
      :show-close="false">
      <i class="el-icon-close close" @click="addDialog = false"></i>
      <table class="dialog-table">
        <tr>
          <td>知识点名称：</td>
          <td>
            <el-input v-model="newFileName" placeholder="请输入" class="dialog-table-input" @keyup.enter.native="knowledgeInfoSave"></el-input>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="knowledgeInfoSave" :disabled="disable">{{disable ? '保存中...' : '保 存'}}</el-button>
      </span>
    </el-dialog>
    <!-- 批量上传 -->
    <el-dialog
      title="批量上传"
      :visible.sync="uploadShow"
      :show-close="false">
      <i class="el-icon-close close" @click="uploadShow = false"></i>
      <h4>提示:</h4>
      <!-- <p>1.点击下载<span class="download">成绩导入模板.xls</span></p> -->
      <p class="downloadTemplate" @click="pointUpLoadDownload">1. 点击下载模版，导入模版.xls</p>
      <p>2.为保证导入数据有效性，导入Excel前，敬请您先下载模板，根据模板要求按需填写，请勿修改格式；</p>
      <p>3.批量导入只允许xls、xlsx格式文档，其他格式均无法导入。</p>
      <section>
        <h3>选择文件：</h3>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="upload"
          :data="{folderId}"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :auto-upload="false">
          <el-button slot="trigger" size="big" type="success">浏 览</el-button>
        </el-upload>
      </section>
      
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="leadTo">导 入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { notice, success } from '../../../api/index.js'
import querystring from 'querystring'
import { ContentTree } from '../../../api/tree.js'
export default {
  name: 'subject-detail',
  data () {
    return {
      loading: false,
      bigFileId: '',
      isActiveOne: true,
      keyword: '',
      isActiveTwo: false,
      addNewKnowledgeDialog: false,
      newFileName: '',
      knowledgeId: '',
      fileLists: [],
      knowledgeList: [
        { name: '嘻嘻' }
      ],
      activeInd: '',
      noChoose: 0,
      checked: false,
      dataList: [],
      defaultProps: {
        children: 'children',
        label: 'pointName'
      },
      addOrEdit: '',
      deleteDialog: false,
      deleteDialogOne: false,
      addDialog: false,
      uploadShow: false,
      infoId: '',
      folderId: '',
      treeMenu: [
        {
          name: '知识点管理',
          children: [
            { name: '能力等级', path: '/knowledge/capabilityLevel', parentName: '总分计算规则', parentPath: '/rule/totalSum', firstName: '总分相加', type: 2 }
          ]
        }
      ],
      num: '',
      oneId: '',
      addState: '',
      fileId: '',
      level: '',
      phase: {
        gradeName: '',
        courseName: ''
      },
      disable: false,
      filedDisable: false,
      defaultList: []
    }
  },
  watch: {
    keyword (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.pointName.indexOf(value) !== -1
    },
    handleIconClick () {
      this.keyword = this.keyword
      this.getKnowledgeList()
    },
    onShowOne () {
      this.isActiveOne = true
      this.isActiveTwo = false
    },
    onShowTwo () {
      this.isActiveOne = false
      this.isActiveTwo = true
      this.$router.push({path: '/knowledge/capabilityLevel', query: {infoId: this.infoId, gradeName: this.$route.query.gradeName, courseName: this.$route.query.courseName}})
    },
    // 新建文件
    addNewFile () {
      this.newFileName = ''
      this.knowledgeId = ''
      this.checked = true
      this.addNewKnowledgeDialog = true
    },
    // 切换选项卡
    activeTab (item, i) {
      this.activeInd = i
      this.folderId = item.id
      this.knowledgeName = item.name
      this.keyword = ''
      this.getKnowledgeList()
    },

    renderContent (h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{ data.pointNo } { data.pointName }</span>
          </span>
          <span>
            <el-button size="mini" on-click={ () => this.changeDetails(data) } class="edit small-btn"><span class="small-tooltip">编辑</span></el-button>
            <el-button size="mini" on-click={ () => this.deleteOneKnowladge(data) } class="delete small-btn"><span class="small-tooltip">删除</span></el-button>
            { data.level === 1 ? <el-button size="mini" on-click={ () => this.addDetails(data) } class="add small-btn"><span class="small-tooltip">新增</span></el-button> : ''}
          </span>
        </span>
      )
    },
    // 删除文件夹
    deleteDetails (item) {
      this.bigFileId = item.id
      this.deleteDialog = true
    },

    // 删除知识点
    deleteOneKnowladge (data) {
      this.oneId = data.id
      this.deleteDialogOne = true
    },
    // 编辑详情
    changeDetails (data) {
      this.addState = data
      this.num = data.pointNo
      this.addOrEdit = '编辑知识点'
      this.newFileName = data.pointName
      this.addState = data.parentPointId
      this.fileId = data.id
      this.level = data.level
      this.addDialog = true
    },

    // 新增详情
    addDetails (data) {
      this.addState = data
      if (data !== 1) {
        if (data.children) {
          let a = Number(data.children[data.children.length - 1].pointNo) + 0.1
          this.num = a.toFixed(1)
        } else {
          let a = Number(data.pointNo) + 0.1
          this.num = a.toFixed(1)
        }
      } else {
        if (this.dataList.length) {
          let a = this.dataList.length + 1
          this.num = a.toFixed(1)
        } else {
          let a = 1
          this.num = a.toFixed(1)
        }
      }
      this.addOrEdit = '新增知识点'
      this.newFileName = ''
      this.knowledgeId = ''
      this.addDialog = true
    },

    leadTo () {
      var arrs = document.getElementsByClassName('el-upload-list__item-name')
      if (arrs && arrs.length > 0) {
        this.$refs.upload.submit()
      } else {
        notice(this, '请选择文件', 2000)
      }
    },
    beforeUpload (file) {
      this.uploadFileName = ''
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'xls' || arr[arr.length - 1] === 'xlsx') {
          resolve()
        } else {
          notice(this, '请上传正确格式文件', 2000)
          reject()
        }
      })
    },
    leadClick () {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.uploadShow = true
    },
    handleSuccess (res, file, fileList) {
      // this.uploadFileName = file.name
      this.res = res.code
      // this.res.message = res.message
      this.uploadShow = false
      if (this.res === -5) {
        notice(this, '请选择文件', 2000)
      }
      if (this.res === 1) {
        this.getList()
        success(this, res.message, 2000)
      } else {
        notice(this, res.message, 2000)
      }
    },
    // 获取文件夹列表
    getList () {
      this.loading = true
      this.$https.get(`knowledge/folderList?knowledgeGradeCourseId=${this.infoId}&type=${1}`)
      .then(res => {
        if (res.data.code === 1) {
          this.fileLists = res.data.result || []
          if (!res.data.result || res.data.result.length === 0) return
          this.folderId = this.folderId ? this.folderId : res.data.result[0].id
          this.getKnowledgeList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 新增知识点文件夹信息(名称不能重复)
    addNewFileSure () {
      if (this.newFileName.length > 20) {
        notice(this, '文件夹标题长度不能超过20个字符', 2000)
        return
      }
      if (!this.newFileName || this.newFileName.trim() === '') {
        notice(this, '请填写知识点文件夹名称', 2000)
        return
      }
      this.filedDisable = true
      // if (!this.knowledgeId) {
      //   this.knowledgeId = 0
      // }
      this.$https.post(`knowledge/pointFolderAdd`, querystring.stringify({
        knowledgeGradeCourseId: this.infoId,
        name: this.newFileName,
        folderId: this.knowledgeId || 0
      }))
      .then(res => {
        this.filedDisable = false
        if (res.data.code === 1) {
          this.addNewKnowledgeDialog = false
          success(this, res.data.message, 2000)
          this.getList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除知识点文件夹信息
    deleteFileSure () {
      this.$https.post(`knowledge/pointFolderDelete`, querystring.stringify({
        id: this.bigFileId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.folderId = ''
          this.getList()
          this.deleteDialog = false
          this.activeInd = 0
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 单个保存知识点信息
    knowledgeInfoSave () {
      if (this.newFileName.length > 50) {
        notice(this, '知识点名称最大长度不能超过50个字符', 2000)
        return
      }
      if (!this.newFileName || this.newFileName.trim() === '') {
        notice(this, '请填写知识点名称', 2000)
        return
      }
      this.disable = true
      let obj = {}
      if (this.addOrEdit === '编辑知识点') {
        obj.id = this.fileId
        obj.folderId = this.folderId
        obj.parentPointId = this.addState
        obj.pointNo = this.num
        obj.pointName = this.newFileName
        obj.level = this.level
      } else {
        obj.folderId = this.folderId
        obj.parentPointId = this.addState === 1 ? 0 : this.addState.id
        obj.pointNo = this.num
        obj.pointName = this.newFileName
        obj.level = this.addState === 1 ? 1 : 2
      }
      this.$https.post(`knowledge/pointSave`, querystring.stringify({
        ...obj
      }))
      .then(async res => {
        this.disable = false
        if (res.data.code === 1) {
          this.addDialog = false
          success(this, res.data.message, 2000)
          await this.getKnowledgeList()
          // console.log(Math.floor(obj.pointNo))
          // console.log(this.dataList)
          this.defaultList = [obj.parentPointId]
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 单个删除知识点信息
    deleteOne () {
      this.$https.post(`knowledge/pointDelete`, querystring.stringify({
        id: this.oneId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.deleteDialogOne = false
          success(this, res.data.message, 2000)
          this.getKnowledgeList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取知识点信息列表
    async getKnowledgeList () {
      await this.$https.post(`knowledge/pointList`, querystring.stringify({
        folderId: this.folderId,
        name: this.keyword
      }))
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.dataList = (res.data.result || []).map(item => ({
            ...item,
            parentId: item.parentPointId
          }))
          if (!this.dataList.length) return
          this.dataList = new ContentTree([...this.dataList]).init(0)
          this.sortKnowledge(this.dataList)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 给知识点排序
    sortKnowledge (arr) {
      arr.forEach((item, i) => {
        item.pointNo = (i + 1).toFixed(1)
        if (item.children) {
          item.children.forEach((items, ind) => {
            items.pointNo = ((i + 1) + ((ind + 1) / 10)).toFixed(1)
          })
        }
      })
    },
    // 知识点批量下载
    pointDownload () {
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/knowledge/pointDownload?folderId=${this.folderId}`
    },
    // 知识点批量上传模板下载
    pointUpLoadDownload () {
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/knowledge/pointTemplateDownload`
    }
  },
  created () {
    this.infoId = this.$route.query.infoId
    this.phase.gradeName = this.$route.query.gradeName
    this.phase.courseName = this.$route.query.courseName
    this.getList()
  },
  computed: {
    upload () {
      let path = document.querySelector('#contextPath').value
      return `${path}/knowledge/pointUpload`
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
.subject-detail {
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
  .section-content {
    min-width: 1308px !important;
  }
  .content {
    width: 100%;
    height: calc(100% - 100px);
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
      height: calc(100% - 120px);
      overflow: auto;
      box-sizing: border-box;
      .search {
        width: 200px;
        margin-left: 10px;
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
  .upload {
    background: url(../../../assets/icons/upload.png) no-repeat 6px center #55ACEE;
  }
  .download {
    background: url(../../../assets/icons/download.png) no-repeat 6px center #55ACEE;
  }
  .el-icon-search:before {
    display: inline-block;
    background: #e0e7ec;
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    color: #7fce89;
    border-radius: 50%;
  }
  .knowledge-list {
    margin-top: 20px;
    max-height: 450px;
    overflow: auto;
    .el-tree {
      border: 0;
      max-height: 400px;
      overflow: auto;
      .el-tree-node__content {
        > span:nth-child(2) {
          > span:nth-child(2) {
            float: none !important;
            margin-left: 30px;
          }
        }
        // 树前面的加减小图标  默认的时候
        .el-tree-node__expand-icon {
          border: 0;
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url(../../../assets/icons/small+.png) no-repeat;
          transform: rotate(0);
        }
        // 树前面的加减小图标 点击展开的时候
        .expanded {
          background-image: url(../../../assets/icons/small-.png);
        }
        // 树里面的修改小图标
        .edit {
          background: url(../../../assets/icons/small-edit.png) no-repeat center ;
        }
        .edit:hover {
          background: url(../../../assets/icons/editing.png) no-repeat center ;
        }
        // 树里面的删除小图标
        .delete {
          background: url(../../../assets/icons/small-delete.png) no-repeat center;
        }
        .delete:hover {
          background: url(../../../assets/icons/deleteing.png) no-repeat center;
        }
        // 树里面的添加小图标
        .add {
          background: url(../../../assets/icons/small-add.png) no-repeat center;
        }
        .add:hover {
          background: url(../../../assets/icons/small-adding.png) no-repeat center;
        }
        // 小图标统一样式
        .small-btn {
          width: 28px;
          height: 28px;
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
        // 小图标 以及  划入之后的tooltip提示
        .small-btn:hover {
          .small-tooltip {
            display:inline-block;
          }
        } 
      }
      .el-tree-node__content:hover {
        background: transparent;
      }
      .is-leaf {
        background: transparent !important;
      }
    }
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
