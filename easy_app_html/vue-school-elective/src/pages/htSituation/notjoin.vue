<template>
  <div class="thNotjoin">
    <div class="btn">
      <el-button type="success" @click="addS">新增</el-button>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        class="display-table"
        stripe
        v-loading="loading">
        <el-table-column
          prop="gradeName"
          label="年级"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="原因"
          label-class-name="head"
          min-width="200px"
          show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.notJoinReason || '无'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="80px">
          <template scope="scope">
            <el-popover
              placement="top"
              width="140"
              trigger="click"
              v-model="scope.row.pop">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.pop = false">取消</el-button>
                <el-button type="primary" size="mini" @click="dele(scope.row)">确定</el-button>
              </div>
              <span slot="reference">
                <el-tooltip effect="dark" content="删除" placement="right">
                  <el-button size="small" type="danger"><i class="iconfont icon-delete"></i></el-button>
                </el-tooltip>
              </span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

  <el-dialog title="新增不参加选课学生" :visible.sync="dialog">
    <el-form :model="form" ref="form" v-if="dialog">
      <el-form-item 
        label="选择学生"
        prop="studentId"
        class="form-table"
        :rules="[
          { required: true, type: 'array', message: '请选择学生', trigger: 'change' },
        ]"
        >
        <el-table
          :data="studentData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          max-height="300">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="年级"
            prop="gradeName">
          </el-table-column>
          <el-table-column
            prop="className"
            label="班级">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="原因">
        <el-input type="textarea" :rows="4" :maxlength="200" v-model="form.reason"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="dialog = false">取 消</el-button>
      <el-button  @click="submit('form')">确 定</el-button>
    </div>
  </el-dialog>

  </div>
</template>

<script>
import server from '../../utils/axios'
import { notice } from '../../api/index'
import { mapState } from 'vuex'

export default {
  name: 'thNotjoin',

  data () {
    return {
      dialog: false,
      tableData: [],
      loading: false,
      classIds: '',
      form: {
        reason: '',
        studentId: []
      },
      studentData: []
    }
  },

  computed: {
    ...mapState({
      activityId: state => state.dManage.activityId,
      user: state => state.user
    })
  },

  methods: {

    handleSelectionChange (val) {
      this.form.studentId = val.map(item => item.id)
    },

    async dele (row) {
      const { data } = await server.post('/hTSituationController/updateStudent', {
        studentId: row.id
      })
      if (data.code !== 1) notice(this, data.message, 2000)
      else this.getData()
    },

    async addS () {
      this.dialog = true
      const { data } = await server.get(`/hTSituationController/getAddUnJoinStudentList?activityId=${this.activityId}` +
                              `&classIds=${this.classIds}`)
      if (data.code === 1) {
        this.studentData = [...data.result || []]
        this.form = {
          reason: '',
          studentId: []
        }
      }
    },

    getData () {
      this.loading = true
      setTimeout(async () => {
        const { data } = await server.get(`/hTSituationController/getUnJoinStudentList?activityId=${this.activityId}` +
                              `&classIds=${this.classIds}`)
                              .catch(() => { this.loading = false })
        if (data.code !== 1) notice(this, data.message, 2000)
        else {
          this.tableData = (data.result || []).map(item => ({ ...item, pop: false }))
        }
        this.loading = false
      }, 400)
    },

    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },

    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data } = await server.post('/hTSituationController/saveStudentBatch', {
            ids: this.form.studentId.join(','),
            reason: this.form.reason
          })
          if (data.code !== 1) notice(this, data.message, 2000)
          else {
            this.dialog = false
            this.getData()
          }
        } else {
          return false
        }
      })
    }
  },

  created () {
    this.classIds = (this.user.htClass || []).map(item => item.id).join(',')
    this.getData()
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.thNotjoin {
  height: 100%;

  >.btn {
    margin-bottom: 20px;
    padding-right: 20px;
    text-align: right;
  }

  >.table {
    background: $white;
    padding: 20px;
  }
}
</style>
