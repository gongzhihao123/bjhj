<template>
  <div class="experience">
    <div class="header">
      <span>主要工作经历</span>
      <el-button size="small" type="primary" @click='addWork'><i class="iconfont">&#xe600;</i>新增</el-button>
    </div>
    <div class="content" v-loading='loading'>
      <el-table
        :data="experienceList"
        style="width: 100%">
        <el-table-column
          prop="startDate"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="结束时间">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="单位">
        </el-table-column>
        <el-table-column
          prop="workContent"
          label="工作内容">
        </el-table-column>
        <el-table-column
          label="曾任党政职务">
          <template slot-scope="scope">
            {{ scope.row.governmentJob ? scope.row.governmentJob : '------' }}
          </template>
        </el-table-column>
        <el-table-column
          label="曾任专业技术">
          <template slot-scope="scope">
            {{ scope.row.majorTechnology ? scope.row.majorTechnology : '------' }}
          </template>
        </el-table-column>
        <el-table-column
          label="工作备注">
          <template slot-scope="scope">
            {{ scope.row.jobRemark ? scope.row.jobRemark : '------' }}
          </template>
        </el-table-column>
        <el-table-column
          label="工作证明人">
          <template slot-scope="scope">
            {{ scope.row.jobReterence ? scope.row.jobReterence : '------' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <div class="operation">
              <el-button  :disabled="scope.row.state === 0" size="small" @click="edit(scope.row)" type="success">
                <i  class="iconfont">&#xe62e;</i>
              </el-button>
              <el-button  :disabled="scope.row.state === 0" size="small" @click="delWork(scope.row)" type="danger">
                <i  class="iconfont">&#xe61b;</i>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="before.length">
        <p>历史数据</p>
        <el-table
          :data="before"
          style="width: 100%">
          <el-table-column
            prop="startDate"
            label="开始时间">
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="结束时间">
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="workContent"
            label="工作内容">
          </el-table-column>
          <el-table-column
          label="曾任党政职务">
          <template slot-scope="scope">
            {{ scope.row.governmentJob ? scope.row.governmentJob : '------' }}
          </template>
        </el-table-column>
        <el-table-column
          label="曾任专业技术">
          <template slot-scope="scope">
            {{ scope.row.majorTechnology ? scope.row.majorTechnology : '------' }}
          </template>
        </el-table-column>
        <el-table-column
          label="工作备注">
          <template slot-scope="scope">
            {{ scope.row.jobRemark ? scope.row.jobRemark : '------' }}
          </template>
        </el-table-column>
        <el-table-column
          label="工作证明人">
          <template slot-scope="scope">
            {{ scope.row.jobReterence ? scope.row.jobReterence : '------' }}
          </template>
        </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="learnState ? '新增' : '编辑'"
      :visible.sync="learning"
      width="400px">
      <div class="content">
        <el-form :model="learn" label-width="100px" :rules="learnRules" size="small" ref="learn" >
          <el-form-item label="开始时间" prop="startDate">
            <el-date-picker
              v-model="learn.startDate"
              size="small"
              type="date"
              placeholder="请选择时间"
              format="yyyy年MM月dd日"
              value-format="yyyy年MM月dd日">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker
              v-model="learn.endDate"
              size="small"
              type="date"
              placeholder="请选择时间"
              format="yyyy年MM月dd日"
              value-format="yyyy年MM月dd日">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工作单位" prop="companyName">
            <el-input  :maxlength="20" v-model="learn.companyName" placeholder="请输入工作单位"></el-input>
          </el-form-item>
          <el-form-item label="工作内容" prop="workContent" >
            <el-input  :maxlength="20" v-model="learn.workContent" placeholder="请输入工作内容"></el-input>
          </el-form-item>
          <el-form-item label="曾任党政职务" prop="governmentJob" >
            <el-input  :maxlength="20" v-model="learn.governmentJob" placeholder="请输入曾任党政职务"></el-input>
          </el-form-item>
          <el-form-item label="曾任专业技术" prop="majorTechnology" >
            <el-input  :maxlength="20" v-model="learn.majorTechnology" placeholder="请输入曾任专业技术"></el-input>
          </el-form-item>
          <el-form-item label="工作证明人" prop="jobReterence" >
            <el-input  :maxlength="20" v-model="learn.jobReterence" placeholder="请输入工作证明人"></el-input>
          </el-form-item>
          <el-form-item label="工作备注" prop="jobRemark" >
            <el-input  :maxlength="20" v-model="learn.jobRemark" type="textarea" placeholder="请输入工作备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer" slot="footer">
        <el-button size="small" v-if="learnState" @click="addWorkIng('learn')" type="primary">确定</el-button>
        <el-button size="small" v-else @click="addWorkIng('learn')" type="primary" >确定</el-button>
        <el-button size="small" @click="cancel('learn')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'experience',
  data () {
    return {
      experienceList: [
        {
          endDate: '2017年6月27日',
          startDate: '2017年6月27日',
          governmentJob: '全职教师',
          jobRemark: '全职教师',
          majorTechnology: '全职教师',
          jobReterence: '全职教师',
          workContent: '浙江省杭州市',
          companyName: '北京怀柔教委'
        }
      ],
      learn: {
        startDate: '',
        endDate: '',
        governmentJob: '',
        jobRemark: '',
        majorTechnology: '',
        jobReterence: '',
        workContent: '',
        companyName: ''
      },
      learnRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        workContent: [
          { required: true, message: '请输入工作内容', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入工作单位', trigger: 'blur' }
        ]
      },
      before: '',
      checkState: 1,
      learning: false,
      learnState: false,
      loading: false
    }
  },
  methods: {
    async getExperienceList () {
      this.loading = true
      await this.$store.dispatch('getExperience')
      if (this.$store.state.experienceList) {
        this.experienceList = this.$store.state.experienceList.teacherWorkExperience
        this.checkState = this.$store.state.experienceList.checkState
        if (this.$store.state.experienceList.teacherEditRecord) {
          this.before = this.$store.state.experienceList.teacherEditRecord
        }
      }
      this.loading = false
    },
    addWork (item) {
      this.learn = {
        startDate: '',
        endDate: '',
        governmentJob: '',
        jobRemark: '',
        majorTechnology: '',
        jobReterence: '',
        workContent: '',
        companyName: ''
      }
      this.$nextTick(() => {
        this.$refs['learn'].resetFields()
      })
      this.learnState = true
      this.learning = true
    },
    edit (item) {
      this.learn = JSON.parse(JSON.stringify(item))
      this.learning = true
      this.$nextTick(() => {
        this.$refs['learn'].resetFields()
      })
      this.learnState = false
    },
    addWorkIng (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch('saveExperience', this.learn)
          this.learning = false
          this.getExperienceList()
        } else {
          return false
        }
      })
    },
    async delWork (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('delExperience', {
          id: item.id
        })
        this.getExperienceList()
      })
    },
    cancel (item) {
      this.learning = false
      this.$refs[item].resetFields()
    }
  },
  mounted () {
    this.getExperienceList()
  }
}
</script>
<style lang='scss' scoped>
.experience {
  width: 100%;
  background: #fff;
  margin-top: 20px;
  border-radius: 5px;
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
  > .content {
    padding: 15px;
    &:nth-child(2) {
      p {
        padding: 10px;
        font-size: 15px;
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
}
</style>
