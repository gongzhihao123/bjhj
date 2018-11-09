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
            prop="trainTopic"
            label="培训主题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="trainDate"
            label="主题时间">
          </el-table-column>
          <el-table-column
            label="培训级别">
            <template slot-scope="scope">
              {{ scope.row.level === 1 ? '国家级课题' : scope.row.level === 2 ? '市级课题' : scope.row.level === 3 ? '区级课题' : scope.row.level === 4 ? '校级课题' : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="trainAddress"
            label="培训地址">
          </el-table-column>
          <el-table-column
            label="附件">
            <template slot-scope="scope">
              <div class="prove">
                文件
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
          <el-form-item label="发表时间" prop="trainDate">
            <div class="textPlann">
              <el-date-picker
                v-model="workServe.trainDate"
                size="small"
                type="date"
                placeholder="请选择时间"
                format="yyyy年MM月dd日"
                value-format="yyyy年MM月dd日">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="培训主题" prop="trainTopic">
            <el-input  :maxlength="20"  placeholder="请输入培训主题" v-model="workServe.trainTopic"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="trainAddress">
            <el-input  :maxlength="20" placeholder="请输入培训地址" v-model="workServe.trainAddress"></el-input>
          </el-form-item>
          <el-form-item label="培训级别" prop="level">
            <el-select v-model="workServe.level" placeholder="请选择">
                <el-option
                  v-for="(item, index) in levelType"
                  :key="index"
                  :label="item"
                  :value="index + 1">
                </el-option>
              </el-select>
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
        trainTopic: '',
        trainDate: '',
        level: '',
        trainAddress: '',
        trainFile: '',
        trainFileName: ''
      },
      addPlanRules: {
        trainTopic: [
          { required: true, message: '请输入培训主题', trigger: 'blur' }
        ],
        trainDate: [
          { required: true, message: '请选择培训日期', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择培训类别', trigger: 'blur' }
        ],
        trainAddress: [
          { required: true, message: '请输入培训地址', trigger: 'blur' }
        ]
      },
      file: '',
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      plann: false,
      plannState: true,
      totalCount: 11,
      loading: false,
      loadUp: false,
      levelType: ['国家级课题', '市级课题', '区级课题', '校级课题']
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
        this.workServe.trainFile = data.result.fileUrl
        this.workServe.trainFileName = data.result.fileName
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
          trainTopic: '',
          trainDate: '',
          level: '',
          trainAddress: '',
          trainFile: '',
          trainFileName: ''
        }
        this.$refs['workServe'].resetFields()
      })
    },
    addPlann (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          this.levelType.forEach((elem, index) => {
            if (this.workServe.level === elem) {
              this.workServe.level = index + 1
            }
          })
          await this.$store.dispatch('saveTrain', this.workServe)
          this.planList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
          this.plann = false
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
        await this.$store.dispatch('delTrain', {
          id: item.id
        })
        this.planList(10, this.tableData.length <= 1 ? this.totalPage - 1 || 1 : this.totalPage || 1)
      })
    },
    down (item) {
      window.open(item.trainFile)
    },
    editor (item) {
      this.workServe.trainTopic = item.trainTopic
      this.workServe.trainDate = item.trainDate
      this.levelType.forEach((elem, index) => {
        if (Number(item.level) === index + 1) {
          this.workServe.level = elem
        }
      })
      this.workServe.trainAddress = item.trainAddress
      this.file = item.trainFileName
      this.workServe.trainFile = item.trainFile
      this.workServe.trainFileName = item.trainFileName
      this.workServe.id = item.id
      this.plann = true
      this.plannState = false
    },
    cancel (item) {
      this.plann = false
      this.$refs[item].resetFields()
    },
    async planList (pageSize, pageNo, startDate, endDate) {
      this.loading = true
      await this.$store.dispatch('getTrain', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.research.trainList.totalCount
      this.tableData = this.$store.state.research.trainList.list
      this.totalPage = this.$store.state.research.trainList.totalPage
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
