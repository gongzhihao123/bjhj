<template>
  <div class="planning">
    <div class="header">帮带活动</div>
    <div class="plannContent">
      <div class="header">
        <div></div>
        <div>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addPlaning">新增</el-button>
        </div>
      </div>
      <div class="content">
        <div v-if='historyReview.length'>
          <p>历史数据</p>
            <el-table
            :data="historyReview"
            style="width: 100%">
            <el-table-column
              prop="yearDate"
              label="起止时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="review"
              label="活动主题"
              width="180">
            </el-table-column>
            <el-table-column
              prop="yearReview"
              label="活动内容">
            </el-table-column>
            <el-table-column
              prop="checkType"
              label="活动成效">
            </el-table-column>
            <el-table-column
              prop="remarks"
              label="相关资料">
            </el-table-column>
          </el-table>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="yearDate"
            label="起止时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="review"
            label="活动主题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="yearReview"
            label="活动内容">
          </el-table-column>
          <el-table-column
            prop="checkType"
            label="活动成效">
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="相关资料">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-button :disabled="scope.row.state === 0" size="small" @click="edit(scope.row)" type="success">
                  <i class="iconfont">&#xe62e;</i>
                </el-button>
                <el-button :disabled="scope.row.state === 0" size="small" @click="delPlan(scope.row)" type="danger">
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
          <el-form-item label="起始年份" prop="yearDateStart">
            <el-date-picker
              v-model="addPlanForm.yearDateStart"
              placeholder="选择起始年份"
              size="small"
              type="year"
              format="yyyy"
              value-format="yyyy">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="终止年份" prop="yearDateEnd">
            <el-date-picker
              v-model="addPlanForm.yearDateEnd"
              placeholder="选择终止年份"
              size="small"
              type="year"
              format="yyyy"
              value-format="yyyy">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动主题" prop="yearReview">
            <div class="textPlann">
              <el-input  :maxlength="20" size="small" placeholder="请输入活动主题" v-model="addPlanForm.yearReview"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="活动内容" prop="review">
            <div class="textPlann">
              <el-input  :maxlength="20" size="small" placeholder="请输入活动内容" v-model="addPlanForm.review"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="活动成效" prop="checkType">
            <div class="textPlann">
              <el-input  :maxlength="20" size="small" placeholder="请输入活动成效" v-model="addPlanForm.checkType"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="相关资料" prop="remarks">
            <div class="textPlann">
              <el-input  :maxlength="20" size="small"  type="textarea"  placeholder="请输入相关资料" v-model="addPlanForm.remarks"></el-input>
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
  name: 'gangActivity',
  data () {
    return {
      scopeDate: '',
      tableData: [],
      addPlanForm: {
        yearDate: '',
        yearReview: '',
        checkType: '',
        yearDateStart: '',
        yearDateEnd: '',
        review: '',
        remarks: ''
      },
      addPlanRules: {
        yearReview: [
          { required: true, message: '请输入活动主题', trigger: 'blur' }
        ],
        checkType: [
          { required: true, message: '请输入活动成效', trigger: 'blur' }
        ],
        yearDateStart: [
          { required: true, message: '请选择活动起始时间', trigger: 'blur' }
        ],
        yearDateEnd: [
          { required: true, message: '请选择活动终止时间', trigger: 'blur' }
        ],
        review: [
          { required: true, message: '请输入活动内容', trigger: 'blur' }
        ]
      },
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      plann: false,
      plannState: true,
      totalCount: 11,
      checkState: 0,
      historyReview: ''
    }
  },
  computed: {
    uploadPath () {
      const routePath = document.querySelector('#contextPath').value
      return window.location.origin + routePath + '/common/teacherUpload'
    }
  },
  methods: {
    handleCurrentChange (item) {
      this.planList(10, item)
    },
    addPlaning () {
      this.file = ''
      this.plann = true
      this.plannState = true
      this.$nextTick(() => {
        this.addPlanForm = {
          backbone: '',
          yearDate: '',
          review: '',
          remarks: '',
          yearDateStart: '',
          yearDateEnd: ''
        }
        this.$refs['addPlanForm'].resetFields()
      })
    },
    edit (item) {
      this.addPlanForm.yearReview = item.yearReview
      this.addPlanForm.checkType = item.checkType
      this.addPlanForm.yearDateStart = item.yearDate.split('-')[0]
      this.addPlanForm.yearDateEnd = item.yearDate.split('-')[1]
      this.addPlanForm.review = item.review
      this.addPlanForm.remarks = item.remarks
      this.addPlanForm.id = item.id
      this.plann = true
      this.plannState = false
    },
    addPlann (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          this.addPlanForm.yearDate = [this.addPlanForm.yearDateStart, this.addPlanForm.yearDateEnd].join('-')
          await this.$store.dispatch('saveReview', this.addPlanForm)
          this.planList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
          this.plann = false
          this.addPlanForm = {
            backbone: '',
            yearDate: '',
            review: '',
            remarks: '',
            yearDateStart: '',
            yearDateEnd: ''
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
        await this.$store.dispatch('delReview', {
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
      this.loading = true
      await this.$store.dispatch('getReview', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.appraisal.reviewList.totalCount
      this.tableData = this.$store.state.appraisal.reviewList.list
      this.totalPage = this.$store.state.appraisal.reviewList.totalPage
      this.checkState = this.$store.state.appraisal.checkState
      let arr = []
      this.$store.state.appraisal.historyReview.forEach(item => {
        arr.push(JSON.parse(item))
      })
      this.historyReview = arr
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
