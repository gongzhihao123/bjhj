<template>
  <div class="jobTitle">
    <div class="header">
      <span>职称管理</span>
      <el-button size="small" @click="addjob" type="primary"><i class="iconfont">&#xe600;</i>新增</el-button>
    </div>
    <div class="content" v-loading='loading'>
      <el-table
        :data="jobTitleList"
        style="width: 100%">
        <el-table-column
          prop="titleDate"
          label="评职时间">
        </el-table-column>
        <el-table-column
          prop="level"
          label="级别">
        </el-table-column>
        <el-table-column
          prop="company"
          label="评职所在单位">
        </el-table-column>
        <el-table-column
          label="证书">
          <template slot-scope="scope">
            <div class="prove">
              {{scope.row.certificateName}}
              <i class="iconfont">&#xe62c;</i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <div class="operation">
              <el-button @click="down(scope.row)" size="small" type="primary">
                <i class="iconfont">&#xe63b;</i>
              </el-button>
              <el-button @click="edit(scope.row)" :disabled="scope.row.state === 0" size="small" type="success">
                <i class="iconfont">&#xe62e;</i>
              </el-button>
              <el-button @click="delJob(scope.row)" :disabled="scope.row.state === 0" size="small" type="danger">
                <i class="iconfont">&#xe61b;</i>
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
            prop="titleDate"
            label="评职时间">
          </el-table-column>
          <el-table-column
            prop="level"
            label="级别">
          </el-table-column>
          <el-table-column
            prop="company"
            label="评职所在单位">
          </el-table-column>
          <el-table-column
            label="证书">
            <template slot-scope="scope">
              <div class="prove">
                {{ scope.row.certificateName }}
                <i class="iconfont">&#xe62c;</i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <div class="operation">
                <el-button size="small" @click="down(scope, row)" type="primary">
                  <i class="iconfont">&#xe63b;</i>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="jobState ? '新增' : '编辑'"
      :visible.sync="jobDio"
      width="500px">
      <div class="content">
        <el-form :model="jobForm" ref="jobForm" label-width="100px" :rules="jobRules">
          <el-form-item label="级别" prop="level">
            <el-input-number v-model="jobForm.level" :min="1" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="评职时间" prop="titleDate">
            <el-date-picker
              v-model="jobForm.titleDate"
              size="small"
              type="date"
              placeholder="请选择时间"
              format="yyyy年MM月dd日"
              value-format="yyyy年MM月dd日">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="职称所在单位" prop="company">
            <div class="textPlann">
              <el-input  :maxlength="20" size="small" placeholder="请输入职称所在单位" v-model="jobForm.company"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="上传证书">
            <div class="uploadPlann">
              <el-upload
                v-loading='beforeUpload'
                :action="uploadPath"
                :before-upload="beforeUp"
                :on-success="success"
                class="upload"
                :show-file-list="false">
                <el-button size="small" type="primary">上传证书文件</el-button>
              </el-upload>
              {{ file }}
            </div>
          </el-form-item>
        </el-form>
        <div class="footer" slot="footer">
          <el-button type="primary" v-if="jobState" size="small" @click="addJob('jobForm')">确定</el-button>
          <el-button type="primary" v-else size="small" @click="addJob('jobForm')">确定</el-button>
          <el-button size="small" @click="cancel('jobForm')" >取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {error} from './../../utils/handle.js'
export default {
  name: 'jobTitle',
  data () {
    return {
      jobTitleList: [
        {
          titleDate: '2018年6月27日',
          level: '2021-09-09',
          company: '浙江省杭州市',
          certificate: 'file',
          certificateName: 'wenjain'
        }
      ],
      jobForm: {
        titleDate: '',
        level: '',
        company: '',
        certificate: '',
        certificateName: ''
      },
      jobRules: {
        titleDate: [
          { required: true, message: '请选择评职时间', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入职称级别', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入评职所在单位', trigger: 'blur' }
        ]
      },
      file: '',
      jobState: false,
      jobDio: false,
      checkState: 1,
      loading: false,
      beforeUpload: false,
      before: ''
    }
  },
  computed: {
    uploadPath () {
      const routePath = document.querySelector('#contextPath').value
      return window.location.origin + routePath + '/common/teacherUpload'
    }
  },
  methods: {
    beforeUp (file) {
      const reg = new RegExp(/[.jpg.JPG.png.PNG]$/)
      this.beforeUpload = true
      if (!reg.test(file.name)) {
        error('请上传jpg 或 png 图片')
        this.beforeUpload = false
        return false
      }
    },
    success (data) {
      if (data.code === 1) {
        this.beforeUpload = false
        this.jobForm.certificate = data.result.fileUrl
        this.jobForm.certificateName = data.result.fileName
        this.file = data.result.fileName
      }
    },
    down (item) {
      window.open(item.certificate)
    },
    addjob () {
      this.jobDio = true
      this.jobState = true
      this.jobForm = {
        titleDate: '',
        level: '',
        company: '',
        certificate: '',
        certificateName: ''
      }
      this.file = ''
      this.$nextTick(() => {
        this.$refs['jobForm'].resetFields()
      })
    },
    addJob (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          console.log(this.jobForm)
          if (this.file) {
            await this.$store.dispatch('saveTeach', this.jobForm)
          } else {
            error('请上传文件')
          }
          this.jobDio = false
          this.jobList()
        } else {
          return false
        }
      })
    },
    edit (item) {
      this.jobForm = item
      this.file = item.certificate
      this.jobState = false
      this.jobDio = true
    },
    delJob (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('delTeach', {
          id: item.id
        })
        this.jobList()
      })
    },
    async jobList () {
      this.loading = true
      await this.$store.dispatch('getTeach')
      this.jobTitleList = this.$store.state.jobList.teacherTitle
      this.checkState = this.$store.state.jobList.checkState
      if (this.$store.state.jobList.teacherEditRecord) {
        this.before = this.$store.state.jobList.teacherEditRecord
      }
      this.loading = false
    },
    cancel (item) {
      this.jobDio = false
      this.$refs[item].resetFields()
    }
  },
  mounted () {
    this.jobList()
  }
}
</script>
<style lang='scss' scoped>
.jobTitle {
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
    div {
      &:nth-child(2) {
        p {
          padding: 10px;
          font-size: 15px;
        }
      }
    }
  }
  .prove {
    color: #97acff;
  }
  .operation {
    button {
      padding: 5px;
      width: 25px;
      height: 25px;
    }
  }
  .uploadPlann {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding-right: 10px;
    font-size: 16px;
    color: #97acff;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
