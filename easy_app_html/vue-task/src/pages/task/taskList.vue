<template>
  <div class='task-list'>
    <!-- 头部搜索 -->
    <header>
      <el-button type="primary" size="small" @click="taskAdd">新建子任务</el-button>
      <el-button type="primary" size="small" @click="daochu">导出列表</el-button>

      <el-select v-model="searchLabel">
        <el-option
          v-for="item in chargeLabelOption"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-select v-model="searchState">
        <el-option
          v-for="item in stateOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-input placeholder="请输入子任务名称" v-model="title" :maxlength="20"></el-input>

      <el-button size="small" type="success" @click="chargeList" icon="el-icon-search">搜索</el-button>
    </header>

    <!-- 列表主体 -->
    <main>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="名称"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span style="cursor: pointer;" @click="routeDetail(scope.row)">
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="任务"
          label-class-name="head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="状态"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span  v-if="scope.row.finishedNum === scope.row.totalNum">
              已完成
            </span>
            <span v-else>
              <i style="color: #FF9223;" v-if="scope.row.days < 0">
                已延期{{ Math.abs(scope.row.days) }}天
              </i>
              <i style="color: #48BB58;" v-else>
                进行中
              </i>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="完成情况"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.finishedNum }}/{{scope.row.totalNum}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createdUserName"
          label="负责人"
          label-class-name="head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="结束时间"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.finishTime | dateFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button :disabled="scope.row.finishedNum > 0" size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <footer>
        <el-row>
          <el-col :span="24">
            <el-pagination
              v-if="totalCount !== 0"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :current-page.sync="pageNo"
              :page-size="10"
              :total="totalCount">
            </el-pagination>
          </el-col>
        </el-row>
      </footer>
    </main>

    <el-dialog
      :title="isEdit ? '编辑子任务' : '新建子任务'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="610px">

      <el-dialog
        width="510px"
        title="选择参与人"
        :visible.sync="innerVisible"
        class="inner"
        append-to-body>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
          :data="treeData"
          show-checkbox
          ref="treeData"
          node-key="userId"
          :default-expand-all="true"
          :filter-node-method="filterNode"
          @check-change="changeTeacher"
          :props="defaultProps">
        </el-tree>
        <p>
          <el-button type="primary" @click="innerVisible = false">确定</el-button>
        </p>
      </el-dialog>

      <el-form v-if="dialogVisible" :model="contentData" :rules="rules" ref="contentData" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="24" class="text-right">
            <span> <i style="color: red;"> * </i> 任务：</span>
            <el-form-item
              prop="label"
            >
              <el-select v-if="!isEdit" v-model="contentData.label" placeholder="请选择任务">
                <el-option
                  v-for="item in labelOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-if="isEdit" v-model="editLabelName" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="text-right">
            <span> <i style="color: red;"> * </i> 标题：</span>
            <el-form-item
              prop="name"
            >
              <el-input v-model.trim="contentData.name" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="text-right">
            <span> <i style="color: red;"> * </i> 描述：</span>
            <el-form-item
              prop="note"
            >
              <!-- <Ueditor @ready="editorReady" class="ueditor" ref="ueditorRef"></Ueditor> -->
              <quill-editor v-model="contentData.note"
                            ref="myQuillEditor"
                            @ready="onEditorReady($event)">
              </quill-editor>
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="action"
                :file-list="editFileList"
                :on-change="fileChange"
                :before-remove="fileRemove"
                :on-success="fileSuccess"
                :auto-upload="false"
                multiple>
                <span style="color: #409EFF;">上传附件</span>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="text-right">
            <span> <i style="color: red;"> * </i> 完成时间：</span>
            <el-form-item
              prop="dateTime"
            >
              <el-date-picker
                v-model="contentData.dateTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="text-right">
            <span> <i style="color: red;"> * </i> 紧急程度：</span>
            <el-form-item
              prop="degree"
            >
              <el-select v-model="contentData.degree" placeholder="请选择紧急程度">
                <el-option
                  v-for="item in degreeOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="text-right">
            <span> <i style="color: red;"> * </i> 参与人：</span>
            <el-form-item
              prop="people"
            >
              <el-button size="small" type="primary" @click="addPeople">新增参与人</el-button>
              <div class="people">
                <el-tag
                  v-for="(tag, index) in peopleOption"
                  :key="tag.name"
                  closable
                  @close="handleClose(tag, index)"
                  :type="tag.type">
                  {{tag.name}}
                </el-tag>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" :disabled="canAdd" type="primary" @click="submitForm('contentData')">提 交</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { dateFormat } from '@/filters/index'
// import { notice, success } from '@/utils/index'
import { TreeMenu } from '@/utils/tree'
import Ueditor from '@/components/Ueditor'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'task-list',
  data () {
    return {
      isEdit: false,
      canAdd: false,
      filterText: '',
      peopleOption: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableData: [],
      title: '',
      searchLabel: '',
      searchState: [],
      stateOptions: [
        { id: '', name: '全部状态' },
        { id: 1, name: '已完成' },
        { id: 3, name: '已延期' },
        { id: 2, name: '进行中' }
      ],
      chargeLabelOption: [],
      degreeOption: [
        { id: 1, name: '普通' },
        { id: 2, name: '重要' },
        { id: 3, name: '紧急' },
        { id: 4, name: '重要且紧急' }
      ],
      editLabelName: '',
      totalCount: 0,
      pageNo: 1,
      innerVisible: false,
      dialogVisible: false,
      labelOption: [],
      rules: {
        name: [{ required: true, message: '名称不能为空' }],
        label: [{ required: true, message: '任务不能为空' }],
        note: [{ required: true, message: '任务描述不能为空' }],
        dateTime: [{ required: true, message: '完成时间不能为空' }],
        degree: [{ required: true, message: '紧急程度不能为空' }],
        people: [{ required: true, message: '请选择参与人' }]
      },
      contentData: {
        name: '',
        label: '',
        note: '',
        dateTime: '',
        degree: '',
        people: ''
      },
      fileNum: 0,
      fileList: [],
      fileData: [],
      editFileList: [],
      UE: {},
      action: '',
      taskChildId: ''
    }
  },
  components: {
    Ueditor,
    quillEditor
  },
  methods: {
    daochu () {
      const path = document.getElementById('contextPath').value
      window.location.href = `${path}/charge/export?taskId=${this.searchLabel}&state=${this.searchLabel}&title=${this.title}&pageSize=${10}&pageNo=${this.pageNo}`
    },
    // 跳转详情
    routeDetail (val) {
      this.$router.push({path: '/task/taskDetail', query: { taskId: val.id, flag: true }})
      sessionStorage.TASK_PAGENO = this.pageNo
    },
    fileChange (file, fileList) {
      this.fileList = fileList
    },
    fileRemove (file, fileList) {
      return new Promise((resolve, reject) => {
        if (!file.raw) {
          this.editFileList.forEach((item, index) => {
            if (item.uid === file.uid) {
              this.editFileList.splice(index, 1)
            }
          })
          resolve()
        } else {
          resolve()
        }
      })
    },
    async fileSuccess (res, file, fileList) {
      this.fileNum++
      this.fileData.push({ fileName: file.name, filePath: res.result })
      if (this.fileNum === (fileList.length - this.editFileList.length)) {
        let users = []
        this.peopleOption.forEach(item => {
          users.push({ userName: item.name, userId: item.userId })
        })
        this.editFileList.forEach(item => {
          this.fileData.push({ fileName: item.name, filePath: item.url })
        })
        let files = this.fileData
        await this.$store.dispatch(this.isEdit ? 'editTaskChild' : 'addTaskChild', {
          taskChildId: this.isEdit ? this.taskChildId : null,
          taskId: this.contentData.label,
          title: this.contentData.name,
          content: this.contentData.note,
          finishTime: dateFormat(this.contentData.dateTime, 'yyyy-MM-dd HH:mm:ss'),
          rank: this.contentData.degree,
          users: JSON.stringify(users),
          files: JSON.stringify(files)
        })
        this.canAdd = false
        await this.chargeLabelList()
        await this.chargeList()
      }
    },
    handleClose (tag, index) {
      this.peopleOption.splice(index, 1)
    },
    addPeople () {
      this.innerVisible = true
      setTimeout(() => {
        this.$refs.treeData.setCheckedNodes(this.peopleOption)
      }, 200)
    },
    changeTeacher (a, b) {
      if (a.deptId) {
        if (b === true) {
          if ((this.peopleOption.filter(item => item.userId === a.userId)).length === 0) {
            this.peopleOption.push(a)
          }
        } else {
          var list = []
          this.peopleOption.forEach((m, index) => {
            if (m.userId !== a.userId) {
              list.push(m)
            }
          })
          this.peopleOption = list
        }
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.chargeList()
    },
    // 编辑
    async edit (val) {
      this.taskChildId = val.id
      this.isEdit = true
      this.dialogVisible = true
      this.contentData = {
        name: '',
        label: '',
        note: '',
        dateTime: '',
        degree: '',
        people: ''
      }
      this.canAdd = false
      this.fileNum = 0
      this.fileData = []
      this.fileList = []
      this.editFileList = []
      const data = await this.$store.dispatch('taskChildDetail', {
        taskChildId: val.id
      })
      this.editLabelName = data.taskName
      this.peopleOption = []
      data.userList.forEach(item => {
        this.peopleOption.push({ name: item.userName, userId: item.userId })
      })
      data.attachmentList.forEach(item => {
        this.editFileList.push({ name: item.fileName, url: item.filePath })
      })
      this.contentData = {
        name: data.title,
        label: data.taskId,
        note: data.content,
        dateTime: data.finishTime,
        degree: data.rank,
        people: ''
      }
      setTimeout(() => {
        document.querySelector('.ql-editor').setAttribute('data-placeholder', '请输入描述')
      }, 20)
    },
    // 新建任务按钮
    taskAdd () {
      this.isEdit = false
      this.dialogVisible = true
      this.contentData = {
        name: '',
        label: '',
        note: '',
        dateTime: '',
        degree: '',
        people: ''
      }
      this.peopleOption = []
      this.canAdd = false
      this.fileNum = 0
      this.fileData = []
      this.fileList = []
      this.editFileList = []
      setTimeout(() => {
        document.querySelector('.ql-editor').setAttribute('data-placeholder', '请输入描述')
      }, 20)
    },
    editorReady (instance) {
      this.UE = instance
    },
    // 新增确认
    submitForm (formName) {
      if (this.peopleOption.length === 0) {
        this.rules.people[0].required = true
      } else {
        this.rules.people[0].required = false
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.canAdd = true
          this.dialogVisible = false
          if (this.fileList.length === 0) {
            let users = []
            this.peopleOption.forEach(item => {
              users.push({ userName: item.name, userId: item.userId })
            })
            let files = []
            this.editFileList.forEach(item => {
              files.push({ fileName: item.name, filePath: item.url })
            })
            await this.$store.dispatch(this.isEdit ? 'editTaskChild' : 'addTaskChild', {
              taskChildId: this.isEdit ? this.taskChildId : null,
              taskId: this.contentData.label,
              title: this.contentData.name,
              content: this.contentData.note,
              finishTime: dateFormat(this.contentData.dateTime, 'yyyy-MM-dd HH:mm:ss'),
              rank: this.contentData.degree,
              users: JSON.stringify(users),
              files: JSON.stringify(files)
            })
            this.canAdd = false
            await this.chargeLabelList()
            await this.chargeList()
          } else {
            this.$refs.upload.submit()
          }
        } else {
          return false
        }
      })
    },
    onEditorReady () {},
    // 获取任务列表
    async getLableOption () {
      const data = await this.$store.dispatch('unlockedTaskList')
      this.labelOption = data
    },
    // 获取参与人列表
    async getUser () {
      const data = await this.$store.dispatch('getUser')
      let dept = data.depts.map(item => ({...item, userId: item.id}))
      let user = data.users.map(item => ({...item, parentId: item.deptId}))
      this.treeData = new TreeMenu(dept.concat(user)).init(0)
    },
    async chargeLabelList () {
      const data = await this.$store.dispatch('chargeLabelList')
      this.chargeLabelOption = data
      this.chargeLabelOption.unshift({ name: '全部', id: '' })
      if (data.length !== 0 && !this.searchLabel) {
        this.searchLabel = data[0].id
      }
    },
    async chargeList () {
      const data = await this.$store.dispatch('chargeList', {
        taskId: this.searchLabel,
        state: this.searchState,
        title: this.title,
        pageNo: this.pageNo,
        pageSize: 10
      })
      this.tableData = data.list
      this.totalCount = data.totalCount
    }
  },
  mounted () {
    const path = document.getElementById('contextPath').value
    this.action = `${path}/charge/attachment`
  },
  watch: {
    filterText (val) {
      this.$refs.treeData.filter(val)
    }
  },
  async created () {
    if (sessionStorage.TASK_PAGENO) {
      this.pageNo = Number(sessionStorage.TASK_PAGENO)
    } else {
      this.pageNo = 1
    }
    await this.chargeLabelList()
    await this.chargeList()
    await this.getLableOption()
    await this.getUser()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.task-list {
  header {
    .el-input {
      width: 150px;
    }
  }

  main {
    margin-top: 20px;
    padding: 20px;
    background: #fff;

    .el-table {
      th {
        &:nth-child(8){
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
      i {
        font-style: normal;
      }
    }
  }

  .el-dialog {
    .el-dialog__body {
      // .edui-editor {
      //   width: 449px !important;
      //   .edui-box {
      //     height: 23px !important;
      //   }
      // }
      // .edui-editor-iframeholder {
      //   width: 449px !important;
      // }
      .ql-editor {
        height: 200px;
      }
      .el-form{
        .el-row{
          .el-col{
            &>span{
              display: inline-block;
              width: 90px;
              text-align: left;
              vertical-align: top;
            }
            .el-form-item{
              width: 80%;
              display: inline-block;
              .el-form-item__content{
                margin-left: 0 !important;
              }
            }

            .el-input {
              width: 450px;
            }
            .el-textarea {
              width: 470px;
            }
          }
        }

        .people {
          width: 450px;
          border: 1px  solid #CED2D9;
          border-radius: 5px;
          min-height: 40px;
          .el-tag {
            margin-left: 5px;
          }
        }
      }
      ul {
        max-height: 150px;
        overflow-x: hidden;
      }
    }
  }

}
.inner {
  .el-dialog {
    .el-dialog__body {
      .el-tree {
        height: 350px;
        overflow-x: auto;
      }
      p {
        text-align: center;
      }
    }
  }
}
</style>
