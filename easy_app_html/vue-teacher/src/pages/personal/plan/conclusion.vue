<template>
  <div class="planning">
    <div class="plannContent">
      <div class="header">
        <el-date-picker
          v-model="scopeDate"
          size="small"
          unlink-panels
          type="daterange"
          format="yyyy年MM月dd日"
          value-format="yyyy年MM月dd日"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <div>
          <el-button size="small" type="success" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addPlaning">新增</el-button>
        </div>
      </div>
      <div class="content" v-loading='loading'>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="summaryDate"
            label="时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="summaryName"
            label="总结名称">
          </el-table-column>
          <el-table-column
            label="附件">
            <template slot-scope="scope">
              <div class="prove">
                {{ scope.row.summaryFileName }}
                <i class="iconfont">&#xe62c;</i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-button size="small" @click="down(scope.row)" type="primary">
                  <i class="iconfont">&#xe63b;</i>
                </el-button>
                <el-button @click="edit(scope.row)" size="small" type="success">
                  <i class="iconfont">&#xe62e;</i>
                </el-button>
                <el-button @click="delSummary(scope.row)" size="small" type="danger">
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
          <el-form-item label="时间范围" prop="summaryDate">
            <el-date-picker
              v-model="workServe.summaryDate"
              size="small"
              type="date"
              placeholder="请选择日期"
              format="yyyy年MM月dd日"
              value-format="yyyy年MM月dd日">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="总结名称" prop="summaryName">
            <div class="textPlann">
              <el-input  :maxlength="20" placeholder="请输入总结名称"  v-model="workServe.summaryName"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="发展计划">
            <div class="uploadPlann">
              <el-upload
                v-loading='loadUp'
                :before-upload="before"
                :on-success="success"
                :action="uploadPath"
                class="upload"
                :show-file-list="false">
                <el-button size="small" type="primary">上传总结文件</el-button>
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
  name: 'conclusion',
  data () {
    return {
      scopeDate: '',
      tableData: [],
      workServe: {
        summaryDate: '',
        summaryName: '',
        summaryFile: '',
        summaryFileName: ''
      },
      addPlanRules: {
        summaryDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        summaryName: [
          { required: true, message: '请输入总结名称', trigger: 'blur' }
        ]
      },
      file: '',
      totalCount: 11,
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      plann: false,
      plannState: true,
      loading: false,
      loadUp: false
    }
  },
  computed: {
    uploadPath () {
      const routePath = document.querySelector('#contextPath').value
      return window.location.origin + routePath + '/common/teacherUpload'
    }
  },
  methods: {
    down (item) {
      window.open(item.summaryFile)
    },
    search () {
      if (this.scopeDate) {
        this.summaryList(10, this.currentPage, this.scopeDate[0], this.scopeDate[1])
      } else {
        this.summaryList(10, this.currentPage)
      }
    },
    before (file) {
      const reg = new RegExp(/[.doc.DOC.docx.DOCX]$/)
      this.loadUp = true
      if (!reg.test(file.name)) {
        error('请上传word文档')
        this.loadUp = false
        return false
      }
    },
    success (data) {
      if (data.code === 1) {
        this.loadUp = false
        this.workServe.summaryFile = data.result.fileUrl
        this.workServe.summaryFileName = data.result.fileName
        this.file = data.result.fileName
      }
    },
    handleCurrentChange (item) {
      this.scopeDate = ''
      this.summaryList(10, item)
    },
    delSummary (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('delSummary', {
          id: item.id
        })
        this.summaryList(10, this.tableData.length <= 1 ? this.totalPage - 1 || 1 : this.totalPage || 1)
      })
    },
    addPlaning () {
      this.plann = true
      this.plannState = true
      this.file = ''
      this.$nextTick(() => {
        this.workServe = {
          summaryDate: '',
          summaryName: '',
          summaryFile: '',
          summaryFileName: ''
        }
        this.$refs['workServe'].resetFields()
      })
    },
    addPlann (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          if (this.workServe.summaryFile) {
            await this.$store.dispatch('saveSummary', this.workServe)
            this.plann = false
            this.workServe = {
              summaryDate: '',
              summaryName: '',
              summaryFile: '',
              summaryFileName: ''
            }
            this.summaryList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
          } else {
            this.$notify.error({
              title: '错误',
              message: '请上传发展计划'
            })
          }
        } else {
          return false
        }
      })
    },
    edit (item) {
      this.workServe.summaryDate = item.summaryDate
      this.workServe.summaryName = item.summaryName
      this.workServe.summaryFile = item.summaryFile
      this.workServe.summaryFileName = item.summaryFileName
      this.workServe.id = item.id
      this.file = item.summaryFileName
      this.plann = true
      this.plannState = false
    },
    cancel (item) {
      this.plann = false
      this.$refs[item].resetFields()
    },
    async summaryList (pageSize, pageNo, startDate, endDate) {
      this.loading = true
      await this.$store.dispatch('getSummary', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.plan.summaryList.totalCount
      this.tableData = this.$store.state.plan.summaryList.list
      this.totalPage = this.$store.state.plan.summaryList.totalPage
      this.loading = false
    }
  },
  mounted () {
    this.summaryList(10, 1)
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
