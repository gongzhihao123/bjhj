<template>
  <div class="planning">
    <div class="header">外出培训学习日志</div>
    <div class="plannContent">
      <div class="header">
        <div>
          <div>
            <el-input  :maxlength="20" size="small" v-model="keyword" placeholder="请输入关键字"></el-input>
          </div>
            <el-select size="small" clearable v-model="levelType" placeholder="请选择级别">
              <el-option
                v-for="(item, index) in levelTypes"
                :key="item"
                :label="item"
                :value="index + 1">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="scopeDate"
              size="small"
              type="daterange"
              format="yyyy年MM月dd日"
              value-format="yyyy年MM月dd日"
              range-separator="至"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div>
          <el-button size="small" type="success"  icon="el-icon-search" @click="search">搜索</el-button>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addPlaning">新增</el-button>
        </div>
      </div>
      <div class="content" v-loading='loading'>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="trainTheme"
            label="培训主题">
          </el-table-column>
          <el-table-column
            label="培训时间">
            <template slot-scope="scope">
              {{ scope.row.startDate + '-' + scope.row.endDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="trainCompany"
            label="主办单位">
          </el-table-column>
          <el-table-column
            width="100"
            label="培训级别">
            <template slot-scope="scope">
              {{ scope.row.trainLevel === 1 ? '国家级' : scope.row.trainLevel === 2 ? '省市级' : scope.row.trainLevel === 3 ? '区县级' : scope.row.trainLevel === 4 ? '园级' : scope.row.trainLevel === 5 ? '其他' : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="trainAddress"
            label="培训地址">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div>
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
          <el-form-item label="选择时间" prop="trainDate">
            <el-date-picker
              v-model="addPlanForm.trainDate"
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
          <el-form-item label="培训主题" prop="trainTheme">
            <div class="textPlann">
              <el-input  :maxlength="20" v-model="addPlanForm.trainTheme"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="主办单位" prop="trainAddress">
            <div class="textPlann">
              <el-input  :maxlength="20" type="textarea" v-model="addPlanForm.trainAddress"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="培训地址" prop="trainCompany">
            <div class="textPlann">
              <el-input  :maxlength="20" type="textarea" v-model="addPlanForm.trainCompany"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="培训级别" prop="trainLevel">
            <div class="textPlann">
              <el-select size="small" clearable v-model="addPlanForm.trainLevel" placeholder="请选择级别">
                <el-option
                  v-for="(item, index) in levelTypes"
                  :key="item"
                  :label="item"
                  :value="index + 1">
                </el-option>
              </el-select>
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
export default {
  name: 'planning',
  data () {
    return {
      scopeDate: '',
      tableData: [],
      addPlanForm: {
        trainCompany: '',
        trainTheme: '',
        trainDate: '',
        trainLevel: '',
        trainAddress: ''
      },
      addPlanRules: {
        trainCompany: [
          { required: true, message: '请输入培训地址', trigger: 'blur' }
        ],
        trainTheme: [
          { required: true, message: '请输入培训主题', trigger: 'blur' }
        ],
        trainDate: [
          { required: true, message: '请输入主题时间', trigger: 'blur' }
        ],
        trainLevel: [
          { required: true, message: '请选择培训级别', trigger: 'blur' }
        ],
        trainAddress: [
          { required: true, message: '请输入培训地址', trigger: 'blur' }
        ]
      },
      levelType: '',
      levelTypes: ['国家级', '省市级', '区县级', '园级', '其他'],
      file: '',
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      plann: false,
      plannState: true,
      loadUp: false,
      loading: false,
      totalCount: 11,
      keyword: ''
    }
  },
  computed: {
    uploadPath () {
      const routePath = document.querySelector('#contextPath').value
      return window.location.origin + routePath + '/common/teacherUpload'
    }
  },
  methods: {
    search () {
      if (this.scopeDate) {
        this.planList(10, this.currentPage, this.scopeDate[0], this.scopeDate[1], this.keyword, this.levelType)
      } else {
        this.planList(10, this.currentPage, '', '', this.keyword, this.levelType)
      }
    },
    handleCurrentChange (item) {
      this.scopeDate = ''
      this.keyword = ''
      this.levelType = ''
      this.planList(10, item)
    },
    addPlaning () {
      this.file = ''
      this.plann = true
      this.plannState = true
      this.$nextTick(() => {
        this.addPlanForm = {
          trainCompany: '',
          trainTheme: '',
          trainDate: '',
          trainLevel: '',
          trainAddress: ''
        }
        this.$refs['addPlanForm'].resetFields()
      })
    },
    edit (item) {
      this.addPlanForm.trainDate = [item.startDate, item.endDate]
      this.addPlanForm.trainTheme = item.trainTheme
      this.levelTypes.forEach((elem, index) => {
        if (item.trainLevel === index + 1) {
          this.addPlanForm.trainLevel = elem
        }
      })
      this.addPlanForm.id = item.id
      this.addPlanForm.trainAddress = item.trainAddress
      this.addPlanForm.trainCompany = item.trainCompany
      this.plann = true
      this.plannState = false
    },
    addPlann (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          this.levelTypes.forEach((elem, index) => {
            if (this.addPlanForm.trainLevel === elem) {
              this.addPlanForm.trainLevel = index + 1
            }
          })
          await this.$store.dispatch('saveStudy', {
            id: this.addPlanForm.id,
            trainCompany: this.addPlanForm.trainCompany,
            startDate: this.addPlanForm.trainDate[0],
            endDate: this.addPlanForm.trainDate[1],
            trainTheme: this.addPlanForm.trainTheme,
            trainLevel: this.addPlanForm.trainLevel,
            trainAddress: this.addPlanForm.trainAddress
          })
          this.plann = false
          this.planList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
          this.addPlanForm = {
            trainCompany: '',
            trainTheme: '',
            trainDate: '',
            trainLevel: '',
            trainAddress: ''
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
        await this.$store.dispatch('delStudy', {
          id: item.id
        })
        this.planList(10, this.tableData.length <= 1 ? this.totalPage - 1 || 1 : this.totalPage || 1)
      })
    },
    cancel (item) {
      this.plann = false
      this.$refs[item].resetFields()
    },
    async planList (pageSize, pageNo, startDate, endDate, keyword, trainLevel) {
      this.loading = true
      await this.$store.dispatch('getStudy', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate,
        keyword: keyword,
        trainLevel: trainLevel
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.study.studyList.totalCount
      this.tableData = this.$store.state.study.studyList.list
      this.totalPage = this.$store.state.study.studyList.totalPage
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
      div {
        &:nth-child(1) {
          display: flex;
          justify-content: flex-start;
          align-content: center;
          div {
            margin-right: 10px;
          }
        }
        &:nth-child(2) {
          width: 200px;
          display: flex;
          justify-content: flex-end;
          align-content: center;
        }
      }
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
