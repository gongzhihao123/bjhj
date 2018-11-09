<template>
  <div class="planning">
    <div class="plannContent">
      <div class="header">
        <div></div>
        <div>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addPlaning">新增</el-button>
        </div>
      </div>
      <div class="content" v-loading='loading'>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="paper"
            label="论文名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="paperDate"
            label="发表时间">
          </el-table-column>
          <el-table-column
            prop="publish"
            label="出版/登载/获奖">
          </el-table-column>
          <el-table-column
            label="附件">
            <template slot-scope="scope">
              <div class="prove">
                {{ scope.row.paperFileName }}
                <i class="iconfont">&#xe62c;</i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-button @click="down(scope.row)" size="small" type="primary">
                  <i class="iconfont">&#xe63b;</i>
                </el-button>
                <el-button @click="editor(scope.row)" size="small" type="success">
                  <i class="iconfont">&#xe62e;</i>
                </el-button>
                <el-button @click="delPlan(scope.row)" size="small" type="danger">
                  <i class="iconfont">&#xe61b;</i>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :title="plannState ? '新增' : '编辑'"
      :visible.sync="plann"
      width="500px">
      <div class="content">
        <el-form :model="workServe" ref="workServe" label-width="100px" :rules="addPlanRules">
          <el-form-item label="发表时间" prop="paperDate">
            <div class="textPlann">
              <el-date-picker
                v-model="workServe.paperDate"
                size="small"
                type="date"
                placeholder="请选择时间"
                format="yyyy年MM月dd日"
                value-format="yyyy年MM月dd日">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="论文名称" prop="paper">
            <el-input  :maxlength="20" placeholder="请输入论文名称" v-model="workServe.paper"></el-input>
          </el-form-item>
          <el-form-item label="出版获奖情况" prop="publish">
            <el-input  :maxlength="20" placeholder="请输入出版获奖情况" v-model="workServe.publish"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <div class="uploadPlann">
              <el-upload
                v-loading='loadUp'
                :before-upload="before"
                :on-success="success"
                :action="uploadPath"
                class="upload"
                :show-file-list="false">
                <el-button size="small" type="primary">上传授予附件</el-button>
              </el-upload>
              {{ file }}
            </div>
          </el-form-item>
        </el-form>
        <div class="footer" slot="footer">
          <el-button v-if="plannState" type="primary" size="small" @click="addPlann('workServe')">确定</el-button>
          <el-button v-else type="primary" size="small" @click="addPlann('workServe')">确定</el-button>
          <el-button size="small" @click="cancel('workServe')" >取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {error} from './../../../utils/handle.js'
export default {
  name: 'paper',
  data () {
    return {
      scopeDate: '',
      tableData: [],
      workServe: {
        paper: '',
        paperDate: '',
        publish: '',
        paperFile: '',
        paperFileName: ''
      },
      addPlanRules: {
        paper: [
          { required: true, message: '请输入论文名称', trigger: 'blur' }
        ],
        paperDate: [
          { required: true, message: '请选择发表时间', trigger: 'blur' }
        ],
        publish: [
          { required: true, message: '请输入出版获奖情况', trigger: 'blur' }
        ]
      },
      file: '',
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      plann: false,
      plannState: true,
      loading: false,
      loadUp: false,
      totalCount: 11
    }
  },
  computed: {
    uploadPath () {
      const routePath = document.querySelector('#contextPath').value
      return window.location.origin + routePath + '/common/teacherUpload'
    }
  },
  methods: {
    before (file) {
      const reg = new RegExp(/[.jpg.JPG.png.PNG.doc.DOC.docx.DOCX]$/)
      this.loadUp = true
      if (!reg.test(file.name)) {
        error('请上传jpg 或 png 图片或者，word文档')
        this.loadUp = true
        return false
      }
    },
    success (data) {
      if (data.code === 1) {
        this.loadUp = false
        this.workServe.paperFile = data.result.fileUrl
        this.workServe.paperFileName = data.result.fileName
        this.file = data.result.fileName
      }
    },
    handleCurrentChange (item) {
      this.planList(10, item)
    },
    addPlaning () {
      this.file = ''
      this.plann = true
      this.plannState = true
      this.$nextTick(() => {
        this.workServe = {
          paper: '',
          paperDate: '',
          publish: '',
          paperFile: '',
          paperFileName: ''
        }
        this.$refs['workServe'].resetFields()
      })
    },
    addPlann (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch('savePaper', this.workServe)
          this.planList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
          this.plann = false
          this.workServe = {
            paper: '',
            paperDate: '',
            publish: '',
            paperFile: '',
            paperFileName: ''
          }
        } else {
          return false
        }
      })
    },
    delPlan (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('delPaper', {
          id: item.id
        })
        this.planList(10, this.tableData.length <= 1 ? this.totalPage - 1 || 1 : this.totalPage || 1)
      })
    },
    down (item) {
      window.open(item.paperFile)
    },
    editor (item) {
      this.workServe.id = item.id
      this.file = item.paperFileName
      this.workServe.paper = item.paper
      this.workServe.paperDate = item.paperDate
      this.workServe.publish = item.publish
      this.workServe.paperFile = item.paperFile
      this.workServe.paperFileName = item.paperFileName
      this.plann = true
      this.plannState = false
    },
    cancel (item) {
      this.plann = false
      this.$refs[item].resetFields()
    },
    async planList (pageSize, pageNo, startDate, endDate) {
      this.loading = true
      await this.$store.dispatch('getPaper', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.research.paperList.totalCount
      this.tableData = this.$store.state.research.paperList.list
      this.totalPage = this.$store.state.research.paperList.totalPage
      this.loading = false
    }
  },
  mounted () {
    this.planList(10, 1)
  }
}
</script>
<style lang='scss' scoped>
.planning {
  padding: 22px;
  padding-top: 0px;
  > .header {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    &::before {
      height: 15px;
      width: 3px;
      content: '';
      display: block;
      background: #4c73eb;
      margin-top: 2px;
      margin-right: 10px;
    }
  }
  .plannContent {
    width: 100%;
    height: calc(100vh - 187px);
    background: #fff;
    margin-top: 10px;
    border-radius: 5px;
    box-sizing: border-box;
    > .header {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #85a4ff;
      font-weight: bold;
      border-bottom: 1px solid #e5e5e5;
    }
    .content {
      width: 100%;
      height: calc(100% - 90px);
      overflow: auto;
    }
  }
  .operation {
    button {
      padding: 5px;
      width: 25px;
      height: 25px;
    }
  }
  .prove {
    color: #97acff;
  }
  .uploadPlann {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding-right: 10px;
    font-size: 16px;
    color: #97acff;
  }
  .textPlann {
    width: 350px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
