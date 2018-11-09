<template>
  <div class="planning">
    <div class="header">市级/区级/园级骨干教师申请表</div>
    <div class="plannContent">
      <div class="header">
        <div>
          <el-button size="small" >下载市级申请表</el-button>
          <el-button size="small" >下载区级申请表</el-button>
          <el-button size="small" >下载园级申请表</el-button>
        </div>
        <div>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addPlaning">新增</el-button>
        </div>
      </div>
      <div class="content" v-loading='loading'>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="backbone"
            label="题目"
            width="180">
          </el-table-column>
          <el-table-column
            prop="backboneDate"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="category"
            label="类型">
            <template slot-scope="scope" >
              <span v-for="(item, index) in categoryType" :key="index" v-if="(scope.row.category + '').indexOf((index + 1) + '') !== -1" >
                {{ item }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="附件">
            <template slot-scope="scope">
              <div class="prove">
                {{ scope.row.backboneFileName }}
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
          <el-form-item label="日期" prop="backboneDate">
            <el-date-picker
              v-model="addPlanForm.backboneDate"
              size="small"
              type="date"
              placeholder="请选择时间"
              format="yyyy年MM月dd日"
              value-format="yyyy年MM月dd日">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="题目" prop="backbone">
            <div class="textPlann">
              <el-input  :maxlength="20" size="small"  placeholder="请输入题目名称" v-model="addPlanForm.backbone"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="类型" prop="category">
             <div class="textPlann">
              <el-select size="small" v-model="addPlanForm.category" placeholder="请选择类别">
                <el-option
                  v-for="(item, index) in categoryType"
                  :key="item"
                  :label="item"
                  :value="index + 1">
                </el-option>
              </el-select>
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
                <el-button size="small" type="primary">请上传附件</el-button>
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
import {error} from '@/utils/handle.js'
export default {
  name: 'honor',
  data () {
    return {
      scopeDate: '',
      tableData: [{
        backbone: '优秀教师',
        backboneDate: '2016年05月02日',
        category: '王小虎',
        backboneFile: '附件',
        backboneFileName: '附件'
      }],
      addPlanForm: {
        backbone: '',
        backboneDate: '',
        category: '',
        backboneFile: '',
        backboneFileName: ''
      },
      addPlanRules: {
        backbone: [
          { required: true, message: '请输入荣誉名称', trigger: 'blur' }
        ],
        backboneDate: [
          { required: true, message: '请输入授予日期', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ]
      },
      file: '',
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      totalCount: 11,
      plann: false,
      plannState: true,
      categoryType: ['市级骨干教师申请表', '区级骨干教师申请表', '园级骨干教师申请表'],
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
        this.addPlanForm.backboneFile = data.result.fileUrl
        this.addPlanForm.backboneFileName = data.result.fileName
        this.file = data.result.fileName
      }
    },
    handleCurrentChange (item) {
      console.log(item)
    },
    addPlaning () {
      this.plann = true
      this.file = ''
      this.plannState = true
      this.$nextTick(() => {
        this.addPlanForm = {
          backbone: '',
          backboneDate: '',
          category: '',
          backboneFile: '',
          hbackboneFileName: ''
        }
        this.$refs['addPlanForm'].resetFields()
      })
    },
    edit (item) {
      this.file = item.backboneFileName
      this.addPlanForm.backbone = item.backbone
      this.addPlanForm.backboneDate = item.backboneDate
      this.categoryType.forEach((elem, index) => {
        if ((item.category + '').indexOf((index + 1) + '') !== -1) {
          this.addPlanForm.category = elem
        }
      })
      this.addPlanForm.level = item.level
      this.addPlanForm.id = item.id
      this.addPlanForm.backboneFile = item.backboneFile
      this.addPlanForm.backboneFileName = item.backboneFileName
      this.plann = true
      this.plannState = false
    },
    delPlan (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('delApply', {
          id: item.id
        })
        this.planList(10, this.tableData.length <= 1 ? this.totalPage - 1 || 1 : this.totalPage || 1)
      })
    },
    down (item) {
      window.open(item.backboneFile)
    },
    addPlann (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          if (this.addPlanForm.backboneFile) {
            await this.$store.dispatch('saveApply', this.addPlanForm)
            this.plann = false
            this.planList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
            this.addPlanForm = {
              backbone: '',
              backboneDate: '',
              category: '',
              backboneFile: '',
              backboneFileName: ''
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '请上传授予计划'
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
      await this.$store.dispatch('getApply', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.apply.applyList.totalCount
      this.tableData = this.$store.state.apply.applyList.list
      this.totalPage = this.$store.state.apply.applyList.totalPage
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
