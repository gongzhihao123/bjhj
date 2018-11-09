<template>
  <div class="learning">
    <div class="header">
      <span>继续教育</span>
      <el-button @click="addLearn" size="small" type="primary"><i class="iconfont">&#xe600;</i>新增</el-button>
    </div>
    <div class="content" v-loading='loading'>
      <div>
        <el-table
          :data="learningList"
          style="width: 100%">
          <el-table-column
            prop="startDate"
            label="开始时间">
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="结束时间"
            width="100">
          </el-table-column>
          <el-table-column
            prop="graduationSchoole"
            label="学校"
            width="100">
          </el-table-column>
          <el-table-column
            prop="grantMajor"
            label="学科"
            width="100"
            >
          </el-table-column>
          <el-table-column
            prop="grantDegreeSchool"
            label="继教阶段"
            center
            >
          </el-table-column>
          <!-- <el-table-column
            prop="degree"
            label="学位">
          </el-table-column>
          <el-table-column
            prop="schoolLength"
            label="学制">
          </el-table-column> -->
          <el-table-column
            prop="degreeNumber"
            label="证书编号"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <div class="operation">
                <el-button :disabled="scope.row.state === 0" @click="edit(scope.row)" size="small" type="success">
                  <i class="iconfont">&#xe62e;</i>
                </el-button>
                <el-button :disabled="scope.row.state === 0" @click="delLearn(scope.row)" size="small" type="danger">
                  <i class="iconfont">&#xe61b;</i>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
            label="结束时间"
            width="100">
          </el-table-column>
          <el-table-column
            prop="graduationSchoole"
            label="学校"
            width="100">
          </el-table-column>
          <el-table-column
            prop="grantMajor"
            label="学科">
          </el-table-column>
          <el-table-column
            prop="grantDegreeSchool"
            label="继教阶段"
            width="100">
          </el-table-column>
          <!-- <el-table-column
            prop="degree"
            label="学位">
          </el-table-column>
          <el-table-column
            prop="schoolLength"
            label="学制">
          </el-table-column> -->
          <el-table-column
            prop="degreeNumber"
            label="证书编号"
            width="180">
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
          <el-form-item label="学制" prop="schoolLength">
            <el-input-number v-model="learn.schoolLength" :min="1" :step="1"></el-input-number>
          </el-form-item>
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
          <el-form-item label="毕业学校" prop="graduationSchoole">
            <el-input  :maxlength="20" v-model="learn.graduationSchoole" placeholder="请输入毕业学校"></el-input>
          </el-form-item>
          <el-form-item label="授学位学校" prop="grantDegreeSchool" >
            <el-input  :maxlength="20" v-model="learn.grantDegreeSchool" placeholder="请输入授学位学校"></el-input>
          </el-form-item>
          <el-form-item label="获学位学科" prop="grantMajor" placeholder="请输入获学位专业" >
            <el-input  :maxlength="20" v-model="learn.grantMajor"></el-input>
          </el-form-item>
          <el-form-item label="证书编号" prop="degreeNumber" placeholder="请输入学位证书号" >
            <el-input  :maxlength="20" v-model="learn.degreeNumber"></el-input>
          </el-form-item>
          <el-form-item label="学历" prop="degree">
            <el-select v-model="learn.degree" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in education"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer" slot="footer">
        <el-button size="small" v-if="learnState" @click="addLearnIng('learn')" type="primary">确定</el-button>
        <el-button size="small" v-else @click="addLearnIng('learn')" type="primary" >确定</el-button>
        <el-button size="small" @click="cancel('learn')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'learning',
  data () {
    return {
      learningList: [],
      checkState: 0,
      before: [],
      learn: {
        startDate: '',
        endDate: '',
        graduationSchoole: '',
        grantMajor: '',
        grantDegreeSchool: '',
        degree: '',
        degreeNumber: '',
        schoolLength: ''
      },
      learnRules: {
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        grantMajor: [
          { required: true, message: '请输入获学位专业', trigger: 'blur' }
        ],
        graduationSchoole: [
          { required: true, message: '请输入授毕业学校', trigger: 'blur' }
        ],
        grantDegreeSchool: [
          { required: true, message: '请输入授学位学校', trigger: 'blur' }
        ],
        degree: [
          { required: true, message: '请输入选择学位', trigger: 'blur' }
        ],
        degreeNumber: [
          { required: true, message: '请输入学位证书号', trigger: 'blur' }
        ],
        schoolLength: [
          { required: true, message: '请输入学制', trigger: 'blur' }
        ]
      },
      education: [
        '研究生教育', '博士研究生毕业', '博士研究生结业', '博士研究生肄业', '硕士研究生毕业', '硕士研究生结业', '硕士研究生肄业', '研究生班毕业', '研究生班结业', '研究生班肄业', '大学本科教育', '大学本科毕业', '大学本科结业', '大学本科肄业', '大学普通班毕业', '大学专科教育', '大学专科毕业', '大学专科结业', '大学专科肄业', '中等职业教育', '中等专科毕业', '中等专科结业', '中等专科肄业', '职业高中毕业', '职业高中结业', '职业高中肄业', '技工学校毕业', '技工学校结业', '技工学校肄业', '普通高级中学教育', '普通高中毕业', '普通高中结业', '普通高中肄业', '初级中学教育', '初中毕业', '初中肄业', '小学教育', '小学毕业', '小学肄业', '其他'
      ],
      learning: false,
      learnState: false,
      loading: false
    }
  },
  methods: {
    change (item) {
      if (!item) {
        for (let i in this.infoState) {
          this.infoState[i] = true
        }
      }
    },
    addLearn (item) {
      this.learnState = true
      this.$nextTick(() => {
        this.learn = {
          startDate: '',
          endDate: '',
          graduationSchoole: '',
          grantMajor: '',
          grantDegreeSchool: '',
          degree: '',
          degreeNumber: '',
          schoolLength: ''
        }
        this.$refs['learn'].resetFields()
      })
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
    addLearnIng (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch('addLearn', this.learn)
          this.learning = false
          this.leaningList()
        } else {
          return false
        }
      })
    },
    async delLearn (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('delLearn', {
          id: item.id
        })
        this.learningList()
      })
    },
    async leaningList () {
      this.loading = true
      await this.$store.dispatch('getLearnList')
      if (this.$store.state.leanList) {
        this.checkState = this.$store.state.leanList.checkState
        this.learningList = this.$store.state.leanList.teacherQualifications
        if (this.$store.state.leanList.teacherEditRecord) {
          this.before = this.$store.state.leanList.teacherEditRecord
        }
      }
      this.loading = false
    },
    cancel (item) {
      this.learning = false
      this.$refs[item].resetFields()
    }
  },
  mounted () {
    this.leaningList()
  }
}
</script>
<style lang='scss' scoped>
.learning {
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
  .content {
    width: 100%;
    padding: 15px;
    div {
      &:nth-child(1) {
        margin-bottom: 10px;
      }
      &:nth-child(2) {
        p {
          padding: 10px;
          font-size: 15px;
        }
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
  .textPlann {
    width: 350px;
  }
  .prove {
    padding-left: 10px;
    color: #97acff;
  }
}
</style>
