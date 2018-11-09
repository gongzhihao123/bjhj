<template>
  <div id="addEvalStepTwo">
    <section class="top-nav">
      <div class="nav-content">
        <div class="nav-left">
          <el-button v-if="eval.state == 0" @click="addEvalCompany()" class="green" icon="el-icon-plus">添加参与单位</el-button>
          <el-upload
            class="upload-demo"
            :action="uploadAction"
            name="uploadFile"
            :on-success="uploadSuccess"
            :show-file-list="false"
            :before-upload="uploadBefore"
            style="display: inline-block; margin-left: 0px;"
            :data="{id: evalId}"
            :on-error="uploadError">
            <el-button v-if="eval.state == 0" class="green" icon="el-icon-upload">模板导入</el-button>
          </el-upload>
          <el-button v-if="eval.state == 0" @click="fileExport()" class="blue" icon="el-icon-download">下载模板</el-button>
        </div>
        <div class="nav-right">
          <div class="nav-right-content">
            <el-button v-if="eval.state == 0" @click="editorBaseInfo()" class="blue" icon="el-icon-edit">修改基本信息</el-button>
            <el-button v-if="eval.state == 0" @click="publishEval()" class="yellow" icon="el-icon-circle-check-outline">发布</el-button>
            <el-button @click="back()" >返回</el-button>
          </div>
        </div>
      </div>
    </section>
    <article class="list">
      <el-row>
        <el-col :span="3">参与单位</el-col>
        <el-col :span="6">被测评人</el-col>
        <el-col :span="3">参与测评人</el-col>
        <el-col :span="3">已完成人数</el-col>
        <el-col :span="8">操作</el-col>
      </el-row>
      <div class="no-content" v-show="companys.length == 0">暂无数据</div>
      <el-row v-for="(item, i) in companys" :key="i">
        <el-col :span="3">{{item.companyName}}</el-col>
        <el-col :span="6">{{item.evaluator||'暂未设置'}}</el-col>
        <el-col :span="3" ><span v-if="item.publishState==1">全员</span><span v-if="item.publishState==2">{{item.userCount}}人</span></el-col>
        <el-col :span="3" >{{item.answeredCount}}人</el-col>
        <el-col :span="8" style="overflow: hidden; height: 60px;">
          <el-button v-if="eval.state != 0" class="blue"  @click="viewData(item)" icon="el-icon-view">查看</el-button>
          <el-button v-if="eval.state == 0" type="warning"  @click="viewEvaluatorEdit(item)" icon="el-icon-edit">被测评人</el-button>
          <el-button v-if="eval.state == 0" type="warning"  @click="viewEdit(item)" icon="el-icon-edit">测评人</el-button>
          <el-button v-if="eval.state == 0" class="red"  @click="deleteCompany(item)" icon="el-icon-delete">删除</el-button>
        </el-col>
      </el-row>
    </article>
    <el-dialog
      title="添加参与单位"
      :visible.sync="infoVis"
      width="600px">
      <div class="companySearch">
        <el-input v-model="keyword" placeholder="请输入学校信息" @input="keyChange"></el-input>
      </div>
      <div class="info-content">
        <template>
          <el-table
            border
            height="290"
            :data="companyList"
            @row-click='row'
            style="width: 100%">
            <el-table-column
              label="名称"
              prop="name">
            </el-table-column>
            <el-table-column
              label="类型"
              :filters="[{ text: '学校', value: 1 }, { text: '行政机关', value: 2 }]"
              :filter-method="filterTag"
              prop="orgType">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.orgType === 1 ? 'primary' : 'success'"
                  disable-transitions>{{scope.row.orgType === 1 ? '学校' : '行政机关'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="选择">
              <template slot-scope="scope">
                <i v-bind:class="{'el-icon-success':true, 'success':(scope.row.state)}" ></i>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="companySearch">
        <span>被测评人</span>
        <el-input v-model="measurement" placeholder="请输入被测评人（以逗号隔开）"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEvalCompanyAction">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑测评人"
      :visible.sync="infoEdit"
      width="600px">
        <div class="editContent">
          <div>
            <el-input placeholder="搜索关键字" v-model="keymodel"></el-input>
            <div>
              <el-tree
                @check='current'
                :props="defaultProps"
                :data="treeData"
                show-checkbox
                node-key="id"
                ref="tree"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                :render-content="renderContent">
              </el-tree>
            </div>
          </div>
          <div>
            <div>
              <div class="select">
                <span>已选中 {{ selectPer.length }} 人</span>
                <span @click="empty">清空</span>
              </div>
              <div>
                <el-tag
                  v-for="(item, index) in selectPer" v-if="!item.userList" :key="index"
                  closable
                  @close="tagClose(item, index)"
                  type="primary">
                  {{item.name}}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="selectProsen">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="编辑被测评人"
      :visible.sync="evaluatorEdit"
      width="600px">
        <div class="companySearch">
          <span>被测评人</span>
          <el-input v-model="editEvaluatorName" placeholder="请输入被测评人（以逗号隔开）"></el-input>
        </div>
        <h6 class="prompt">被测评人（以逗号隔开）</h6>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="selectEvaluatorEdit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import service from '../api/index'
import * as config from './../config'
import { error, success } from '../utils/common'

export default {
  name: 'addEvalStepTwo',
  data () {
    return {
      evalId: 0,
      canEditor: false,
      infoEdit: false,
      eval: {},
      companys: [],
      companyList: [],
      companyInfo: [],
      infoVis: false,
      evaluatorEdit: false,
      editEvaluatorId: '',
      editEvaluatorName: '',
      keyword: '',
      measurement: '',
      selectCompany: [],
      activeCompany: '',
      treeData: '',
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      selectPer: [],
      keymodel: '',
      editId: '',
      allSelect: []
    }
  },
  watch: {
    keymodel (value) {
      return this.$refs.tree.filter(value)
    }
  },
  methods: {
    // 初始化数据
    initData () {
      this.getEvalDetail()
      this.getEvalCompanyList()
    },
    fileExport () {
      window.location = config.contentPath + '/manager/fileExport'
    },
    uploadError (err) {
      this.fullscreenLoading = false
      error(err)
    },
    uploadSuccess (res, file) {
      setTimeout(() => {
        this.fullscreenLoading = false
        if (res.code === 1) {
          success('导入成功')
          this.getEvalCompanyList()
        } else {
          error(res.message)
        }
      }, 600)
    },
    uploadBefore (file) {
      this.fullscreenLoading = true
      const reg = /[.xls.xlsx.XLS.XLSX]$/
      if (!reg.test(file.name)) {
        this.$message.error('上传的文件只能是Excel格式。')
        this.fullscreenLoading = false
      }
      // const isExcel = file.type === 'application/vnd.ms-excel'
      // if (!isExcel) {
      //   this.$message.error('上传的文件只能是Excel格式。')
      //   this.fullscreenLoading = false
      // }
      // return isExcel
    },
    publishEval () {
      this.$alert(`<p style="color:red">您是否确定要发布该测评，发布后发布内容不能修改.</p>`, '系统提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.publishEvalAction(this.evalId)
      }).catch(() => {})
    },
    async publishEvalAction (id) {
      const ret = await service.publishEval(id)
      if (ret.code === 1) {
        success('发布成功')
        this.back()
      } else {
        error(ret.message || '发布失败')
      }
      this.getList()
    },
    // 获取参与单位列表信息
    async getEvalCompanyList () {
      const res = await service.getEvalCompanyList(this.evalId)
      if (res && res.code === 1) {
        if (res.result) {
          this.selectCompany = []
          res.result.forEach(ele => {
            this.selectCompany.push(ele.companyId)
          })
        }
        this.companys = res.result
      } else {
        error(res.message)
      }
    },
    // 删除测评单位
    deleteCompany (item) {
      this.$alert(`<p style="color:red">您是否确定要删除该单位？</p>`, '系统提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.deleteCompanyAction(item)
      }).catch(() => {})
    },
    async deleteCompanyAction (item) {
      await service.deleteEvalCompany(item.id)
      this.getEvalCompanyList()
    },
    // 查看统计结果
    async viewData (item) {
      this.$router.push({path: '/answerResult', query: {id: item.id}})
    },
    // 编辑测评人
    async viewEdit (item) {
      this.selectPer = []
      this.editId = item.id
      const res = await service.getCompanyDeptUser(item.companyId)
      const response = await service.getUpdateEvalUser(item.id)
      if (response && response.result) {
        let arr = []
        response.result.forEach(item => {
          arr.push(item.userId)
          item.id = item.userId
          item.name = item.userName
          this.selectPer.push(item)
        })
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(arr)
        })
      }
      if (res && res.result) {
        this.treeData = [...res.result[0].deptList, ...res.result[0].userList]
        res.result[0].userList.forEach(params => {
          this.allSelect.push(params.id)
          if (item.publishState === 1) {
            this.selectPer.push(params)
          }
        })
        res.result[0].deptList.forEach(elem => {
          elem.userList.forEach(params => {
            this.allSelect.push(params.id)
            if (item.publishState === 1) {
              this.selectPer.push(params)
            }
          })
        })
        if (item.publishState === 1) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.allSelect)
          })
        }
      }
      this.infoEdit = true
    },
    // 编辑被测评人
    async viewEvaluatorEdit (item) {
      this.editEvaluatorId = item.id
      this.editEvaluatorName = item.evaluator
      this.evaluatorEdit = true
    },
    // 点击单元格
    row (row) {
      this.companyList.forEach(item => {
        item.state = false
      })
      this.companyList.forEach(item => {
        item.state = false
        if (row.id === item.id) {
          item.state = true
        }
      })
      row.state = true
      this.activeCompany = row
    },
    // 筛选关键字
    keyChange () {
      this.companyList = this.companyInfo.filter(item => item.name.indexOf(this.keyword) !== -1)
    },
    // 筛选
    filterTag (value, row) {
      return row.orgType === value
    },
    // 新增单位测评
    async addEvalCompany () {
      const res = await service.getCompanyList()
      if (res && res.code === 1) {
        this.infoVis = true
        let arr = []
        res.result.forEach(elem => {
          if (!this.selectCompany.includes(elem.id)) {
            elem.state = false
            arr.push(elem)
          }
        })
        this.companyList = arr
        this.companyInfo = arr
      } else {
        error(res.message)
      }
    },
    // 获取测评内容
    async getEvalDetail () {
      const res = await service.getEvalStepOne(this.evalId)
      if (res && res.code === 1) {
        this.eval = res.result
      } else {
        error(res.message)
      }
    },
    async addEvalCompanyAction () {
      if (this.measurement && this.activeCompany.id) {
        const res = await service.addEvalCompany(this.evalId, this.activeCompany.id, this.activeCompany.name, this.measurement)
        if (res && res.code === 1) {
          this.infoVis = false
          this.measurement = ''
          this.keyword = ''
          this.getEvalCompanyList()
        }
      } else {
        error('请选择内容')
      }
    },
    // 树节点 筛选
    renderContent (h, { node, data, store }) {
      return (
        <span>{data.name}</span>
      )
    },
    // 树节点点击
    current (node, state) {
      this.selectPer = []
      state.checkedNodes.forEach(item => {
        if (!item.userList) {
          this.selectPer.push(item)
        }
      })
    },
    // 清空
    empty (item) {
      this.selectPer = []
      this.$refs.tree.setCheckedKeys([])
    },
    // 删除标签
    tagClose (item, index) {
      this.selectPer.splice(index, 1)
      let arr = this.selectPer.map(item => item.id)
      this.$refs.tree.setCheckedKeys(arr)
    },
    // 搜索
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    async selectProsen () {
      let arr = []
      this.selectPer.forEach(item => {
        let str = `${item.id}:${item.name}`
        arr.push(str)
      })
      if (this.selectPer.length !== this.allSelect.length && this.selectPer.length !== 0) {
        await service.updateEvalUser(this.editId, 2, arr.join(','))
      }
      this.getEvalCompanyList()
      this.infoEdit = false
      this.selectPer = []
      this.$refs.tree.setCheckedKeys([])
    },
    async selectEvaluatorEdit () {
      if (this.editEvaluatorId && this.editEvaluatorName) {
        await service.updateEvalEvaluator(this.editEvaluatorId, this.editEvaluatorName)
        this.getEvalCompanyList()
        this.evaluatorEdit = false
      }
    },
    back () {
      this.$router.push({path: '/manager'})
    },
    editorBaseInfo () {
      this.$router.push({path: '/addEvalStepOne', query: {id: this.evalId}})
    }
  },
  computed: {
    uploadAction () {
      return config.contentPath + '/manager/fileImport'
    }
  },
  created () {
    this.evalId = this.$route.query.id
    this.initData()
  }
}
</script>
<style lang="scss">
@import '../assets/scss/variable.scss';
#addEvalStepTwo {
  i.success {
    color: $theme;
    font-size: 18px;
  }
  section.top-nav {
    position: absolute;
    top: 51px;
    left: 0;
    right: 0;
    height: 68px;
    background: #fff;
    border-bottom: 1px solid #e4e4e4;
    .nav-content {
      width: 1200px;
      margin: 0 auto;
      height: 100%;
      line-height: 68px;
      .nav-left {
        float: left;
        height: 68px;
        &>.el-input {
          width: 240px;
          height: 36px;
        }
      }
      .nav-right {
        overflow: hidden;
        float: right;
        height: 68px;
        .nav-right-content {
          // border-right:1px solid #e4e4e4;
          float:left;
          .el-button {
            // margin-right: 22px;
            width: auto;
          }
        }
        .list {
          width: 60px;
          text-align: center;
          margin: 0 auto;
          &>img {
            width: 20px;
            height: 20px;
            cursor: pointer;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .no-content {
    text-align: center;
    background: #fff;
    padding: 20px;
    border-top: 1px solid #e4e4e4;
  }
  article{
    margin-top: 80px;
    min-height: 400px;
    .el-button {
      width: 86px;
      padding:10px 0;
    }
  }
  article.list {
    width: 100%;
    margin-bottom: 20px;
    .el-row:first-child {
      margin-top: 20px;
      border: none;
      background: #fff;
    }
    .el-row{
      height: 62px;
      border: 1px solid #e8e8e8;
      line-height: 62px;
      background: #fff;
    }
    .el-col:first-child {
      text-align: left;
      padding-left: 20px;
    }
    .el-col:last-child {
      text-align: left;
    }
    .el-col {
      text-align: center;
    }
    .type {
      background: #19b955;
      color: #fff;
      margin-left: 38px;
      border-radius: 2px;
    }
  }
  .prompt {
    color: red;
    text-align: right;
  }
  .companySearch {
    margin: 10px 0px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span {
      min-width: 100px;
    }
  }
  .info-content {
    height: 300px;
    overflow: auto;
    .logo {
      background: #ccc;
      display: block;
      padding: 10px;
      text-align: center;
      width: 55px;
      height: 55px;
      text-align: center;
      line-height: 35px;
      border-radius: 50%;
    }
    i {
      font-size: 18px;
    }
  }
  .editContent {
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    > div {
      width: 49%;
      &:nth-child(2) {
        border: 1px solid #e3e3e3;
        padding: 10px;
        height: 400px;
        .select {
          border-bottom: 1px solid #e3e3e3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            &:nth-child(2) {
              color: red;
            }
          }
          &+div {
            height: 360px;
            overflow: auto;
          }
        }
        span {
          margin: 3px;
        }
      }
      > div:nth-child(2) {
        border: 1px solid #e3e3e3;
        margin-top: 10px;
        padding: 10px;
        height: 350px;
        overflow: auto;
      }
    }
  }
  .green {
    background: #19b955;
    border-color: #19b955;
    color: #fff;
  }
  .blue {
    background: #1F9FFF;
    border-color: #1F9FFF;
    color: #fff;
  }
  .yellow {
    background: #f7ba2b;
    border-color: #f7ba2b;
    color: #fff;
  }
  .red {
    background: #f13f3f;
    border-color: #f13f3f;
    color: #fff;
  }
}
</style>
