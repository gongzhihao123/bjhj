<template>
  <div class="planning">
    <div class="header">个人荣誉</div>
    <div class="plannContent">
      <div class="header">
        <el-button size="small" type="primary" icon="el-icon-plus"  @click="addPlaning">新增</el-button>
      </div>
      <div class="content"  v-loading='loading'>
        <div v-if="historyHonor.length">
          <p style="padding: 10px;">审核数据</p>
          <el-table
            :data="historyHonor"
            style="width: 100%">
            <el-table-column
              prop="honorName"
              label="荣誉名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="honorDate"
              label="授予日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="company"
              label="授予单位">
            </el-table-column>
            <el-table-column
              prop="level"
              label="级别">
              <template slot-scope="scope">
              <span v-for="(item, index) in levelType" :key="index" v-if="(scope.row.level + '').indexOf((index + 1) + '') !== -1" >
                {{ item }}
              </span>
            </template>
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
                  <el-button size="small" @click="down(scope.row)" type="primary">
                    <i class="iconfont">&#xe63b;</i>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="honorName"
            label="荣誉名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="honorDate"
            label="授予日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="company"
            label="授予单位">
          </el-table-column>
          <el-table-column
            prop="level"
            label="级别">
            <template slot-scope="scope">
              <span v-for="(item, index) in levelType" :key="index" v-if="(scope.row.level + '').indexOf((index + 1) + '') !== -1" >
                {{ item }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="附件">
            <template slot-scope="scope">
              <div class="prove">
                {{ scope.row.honorFileName }}
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
                <el-button :disabled="scope.row.scope === 0" size="small" @click="edit(scope.row)" type="success">
                  <i class="iconfont">&#xe62e;</i>
                </el-button>
                <el-button :disabled="scope.row.scope === 0" size="small" @click="delPlan(scope.row)" type="danger">
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
          <el-form-item label="授予日期" prop="honorDate">
            <el-date-picker
              v-model="addPlanForm.honorDate"
              size="small"
              type="date"
              placeholder="请选择时间"
              format="yyyy年MM月dd日"
              value-format="yyyy年MM月dd日">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="授予单位级别" prop="level">
            <div class="textPlann">
              <el-select size="small" v-model="addPlanForm.level" placeholder="请选择级别">
                <el-option
                  v-for="(item, index) in levelType"
                  :key="item"
                  :label="item"
                  :value="index + 1">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="授予名称" prop="honorName">
            <div class="textPlann">
              <el-input  :maxlength="20" size="small"  placeholder="请输入授予名称" v-model="addPlanForm.honorName"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="授予单位" prop="company">
            <div class="textPlann">
              <el-input  :maxlength="20" size="small"  placeholder="请输入授予单位" v-model="addPlanForm.company"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="荣誉附件">
            <div class="uploadPlann">
              <el-upload
                v-loading='loadUp'
                :on-success="success"
                :before-upload="before"
                :action="uploadPath"
                class="upload"
                multiple
                :show-file-list="false">
                <el-button size="small" type="primary">上传附件</el-button>
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
  name: 'honor',
  data () {
    return {
      scopeDate: '',
      tableData: [],
      addPlanForm: {
        honorName: '',
        honorDate: '',
        company: '',
        level: '',
        honorFile: '',
        honorFileName: ''
      },
      addPlanRules: {
        honorName: [
          { required: true, message: '请输入荣誉名称', trigger: 'blur' }
        ],
        honorDate: [
          { required: true, message: '请输入授予日期', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入签发单位', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入级别', trigger: 'blur' }
        ]
      },
      file: '',
      totalCount: 11,
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      plann: false,
      plannState: true,
      loadUp: false,
      loading: false,
      checkState: 0,
      historyHonor: '',
      levelType: ['国家级', '省市级', '区县级', '园级', '其他']
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
      window.open(item.honorFile)
    },
    before (file) {
      const reg = new RegExp(/[.jpg.JPG.png.PNG]$/)
      this.loadUp = true
      if (!reg.test(file.name)) {
        error('请上传jpg 或 png 图片')
        this.loadUp = false
        return false
      }
    },
    success (data) {
      if (data.code === 1) {
        this.loadUp = false
        this.addPlanForm.honorFile = data.result.fileUrl
        this.addPlanForm.honorFileName = data.result.fileName
        this.file = data.result.fileName
      }
    },
    handleCurrentChange (item) {
      console.log(item)
    },
    addPlaning () {
      this.file = ''
      this.plann = true
      this.plannState = true
      this.$nextTick(() => {
        this.addPlanForm = {
          honorName: '',
          honorDate: '',
          company: '',
          level: '',
          honorFile: '',
          honorFileName: ''
        }
        this.$refs['addPlanForm'].resetFields()
      })
    },
    edit (item) {
      this.file = item.honorFileName
      this.addPlanForm.honorName = item.honorName
      this.addPlanForm.honorDate = item.honorDate
      this.addPlanForm.company = item.company
      this.addPlanForm.level = item.level
      this.levelType.forEach((elem, index) => {
        if ((item.level + '').indexOf((index + 1) + '') !== -1) {
          this.addPlanForm.level = elem
        }
      })
      this.addPlanForm.honorFile = item.honorFile
      this.addPlanForm.honorFileName = item.honorFileName
      this.addPlanForm.id = item.id
      this.plann = true
      this.plannState = false
    },
    addPlann (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          if (this.addPlanForm.honorFileName) {
            await this.$store.dispatch('saveHonor', this.addPlanForm)
            this.plann = false
            this.planList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
            this.addPlanForm = {
              honorName: '',
              honorDate: '',
              company: '',
              level: '',
              honorFile: '',
              honorFileName: ''
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '请上传荣誉附件'
            })
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
        await this.$store.dispatch('delHonor', {
          id: item.id
        })
        this.planList(10, this.tableData.length <= 1 ? this.totalPage - 1 || 1 : this.totalPage || 1)
      })
    },
    cancel (item) {
      this.plann = false
      this.$refs[item].resetFields()
    },
    async planList (pageSize, pageNo, startDate, endDate) {
      // this.loading = true
      await this.$store.dispatch('getHonor', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.honor.honorList.totalCount
      this.tableData = this.$store.state.honor.honorList.list
      this.totalPage = this.$store.state.honor.honorList.totalPage
      this.checkState = this.$store.state.honor.checkState
      if (this.$store.state.honor.historyHonor) {
        this.historyHonor = this.$store.state.honor.historyHonor
      }
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
      justify-content: flex-end;
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
      > div {
        margin-bottom: 20px;
      }
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
