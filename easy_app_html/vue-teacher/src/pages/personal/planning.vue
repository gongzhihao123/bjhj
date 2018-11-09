<template>
  <div class="planning">
    <div class="header">个人发展规划</div>
    <div class="plannContent">
      <div class="header">
        <el-date-picker
          v-model="scopeDate"
          size="small"
          type="daterange"
          unlink-panels
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
            label="时间范围"
            width="280">
            <template slot-scope="scope">
              <div>
                {{ scope.row.startDate + '-' + scope.row.endDate  }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="development"
            label="发展规划">
          </el-table-column>
          <el-table-column
            label="附件">
            <template slot-scope="scope">
              <div class="prove">
                {{ scope.row.planfileName }}
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
                <el-button size="small" @click="edit(scope.row)" type="success">
                  <i class="iconfont">&#xe62e;</i>
                </el-button>
                <el-button size="small" @click="delPlan(scope.row)" type="danger">
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
        <el-form :model="addPlanForm" ref="addPlanForm" label-width="100px" :rules="addPlanRules">
          <el-form-item label="时间范围" prop="scopeDate">
            <el-date-picker
              v-model="addPlanForm.scopeDate"
              size="small"
              type="daterange"
              format="yyyy年MM月dd日"
              value-format="yyyy年MM月dd日"
              range-separator="至"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="规划名称" prop="platDevelopment">
            <div class="textPlann">
              <el-input  :maxlength="20" type="textarea"  v-model="addPlanForm.platDevelopment"></el-input>
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
                <el-button size="small" type="primary">上传发展计划</el-button>
              </el-upload>
              {{ file }}
            </div>
          </el-form-item>
        </el-form>
        <div class="footer" slot="footer">
          <el-button type="primary" v-if="plannState" size="small" @click="addPlann('addPlanForm')">确定</el-button>
          <el-button type="primary" v-else size="small" @click="addPlann('addPlanForm')">确定</el-button>
          <el-button size="small" @click="cancel('addPlanForm')" >取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {error} from './../../utils/handle.js'
export default {
  name: 'planning',
  data () {
    return {
      scopeDate: '',
      tableData: [],
      addPlanForm: {
        scopeDate: '',
        platDevelopment: '',
        planfile: '',
        planfileName: ''
      },
      addPlanRules: {
        scopeDate: [
          { required: true, message: '请选择时间范围', trigger: 'blur' }
        ],
        platDevelopment: [
          { required: true, message: '请输入发展计划', trigger: 'blur' }
        ]
      },
      file: '',
      pageSize: 10,
      totalCount: 11,
      currentPage: 1,
      totalPage: 1,
      plann: false,
      plannState: true,
      loadUp: false,
      loading: false
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
      const reg = new RegExp(/[.doc.DOC.docx.DOCX]$/)
      this.loadUp = true
      if (!reg.test(file.name)) {
        error('请上传word文档')
        this.loadUp = true
        return false
      }
    },
    success (data) {
      if (data.code === 1) {
        this.loadUp = false
        this.addPlanForm.planfile = data.result.fileUrl
        this.addPlanForm.planfileName = data.result.fileName
        this.file = data.result.fileName
      }
    },
    search () {
      if (this.scopeDate) {
        this.planList(10, this.currentPage, this.scopeDate[0], this.scopeDate[1])
      } else {
        this.planList(10, this.currentPage)
      }
    },
    handleCurrentChange (item) {
      this.scopeDate = ''
      this.planList(10, item)
    },
    addPlaning () {
      this.file = ''
      this.plann = true
      this.plannState = true
      this.$nextTick(() => {
        this.addPlanForm = {
          scopeDate: '',
          platDevelopment: '',
          planfile: '',
          planfileName: ''
        }
        this.$refs['addPlanForm'].resetFields()
      })
    },
    edit (item) {
      this.addPlanForm.scopeDate = [item.startDate, item.endDate]
      this.addPlanForm.platDevelopment = item.development
      this.addPlanForm.id = item.id
      this.file = item.planfileName
      this.addPlanForm.planfile = item.planfile
      this.addPlanForm.planfileName = item.planfileName
      this.plann = true
      this.plannState = false
    },
    delPlan (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('delPlan', {
          id: item.id
        })
        this.planList(10, this.tableData.length <= 1 ? this.totalPage - 1 || 1 : this.totalPage || 1)
      })
    },
    down (item) {
      window.open(item.planfile)
    },
    addPlann (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          if (this.addPlanForm.planfile) {
            await this.$store.dispatch('savePlan', {
              id: this.addPlanForm.id,
              startDate: this.addPlanForm.scopeDate[0],
              endDate: this.addPlanForm.scopeDate[1],
              platDevelopment: this.addPlanForm.platDevelopment,
              planfile: this.addPlanForm.planfile,
              planfileName: this.file
            })
            this.plann = false
            this.addPlanForm = {
              scopeDate: '',
              platDevelopment: '',
              planfile: '',
              planfileName: ''
            }
            this.planList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
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
    cancel (item) {
      this.plann = false
      this.$refs[item].resetFields()
    },
    async planList (pageSize, pageNo, startDate, endDate) {
      this.loading = true
      await this.$store.dispatch('getPlan', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.planning.planList.totalCount
      this.tableData = this.$store.state.planning.planList.list
      this.totalPage = this.$store.state.planning.planList.totalPage
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
    height: calc(100vh - 135px);
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
      padding: 0 15px;
      color: #85a4ff;
      font-weight: bold;
      border-bottom: 1px solid #e5e5e5;
    }
    .content {
      width: 100%;
      padding: 10px;
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
