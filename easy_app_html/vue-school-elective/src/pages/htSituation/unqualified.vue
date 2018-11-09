<template>
  <div class='unqualified'>
      <p>{{ nowSemester.semesterName }} {{ activityName }}</p>
      <div class="table">
        <p class="total">选课不合格学生：{{ tableData.length }}</p>
        <el-table
          :data="tableData"
          style="width: 100%"
          class="display-table"
          stripe
          v-loading = "loading">
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
            prop="studentName"
            label="姓名"
            label-class-name="head">
          </el-table-column>
          <el-table-column
          prop="courseSelection"
          label="选课情况"
          label-class-name="head"></el-table-column>
        <el-table-column
          label="操作"
          width="200"
          label-class-name="head">
          <template scope="scope">
            <el-button type="danger" size="small" @click="noJoin(scope.row)">不参加选课</el-button>
          </template>
        </el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
import server from '../../utils/axios'
import { notice } from '../../api/index'
import { mapState } from 'vuex'
export default {
  name: 'unqualified',

  data () {
    return {
      loading: false,
      activityName: '',
      tableData: [],
      classIds: '',
      activityId: ''
    }
  },

  computed: {
    nowSemester () {
      return this.$store.getters.semesterList.filter(item => item.state === 1)[0]
    },
    ...mapState({
      user: state => state.user
    })
  },

  methods: {
    getData () {
      this.loading = true
      setTimeout(async () => {
        const { data } = await server.get(`/hTSituationController/getUnStudentList?activityId=${this.activityId}` +
                              `&classIds=${this.classIds}`)
                              .catch(() => { this.loading = false })
        if (data.code !== 1) notice(this, data.message, 2000)
        else {
          this.tableData = [...data.result || []]
        }
        this.loading = false
      }, 400)
    },

    noJoin (row) {
      this.$confirm('确定设置该同学不参加选课吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await server.post('/hTSituationController/setUnSelectStudent', {
          studentId: row.id
        })
        if (data.code !== 1) notice(this, data.message, 2000)
        else this.getData()
      }).catch(() => {})
    }
  },

  async created () {
    // 选课活动
    const { data } = await server.get('/hTResultController/getAllActivity')
    if (data.code === 1) {
      this.activityName = (data.result || []).filter(item => item.activityState === 1)[0].name
      this.activityId = (data.result || []).filter(item => item.activityState === 1)[0].id
    }
    this.classIds = (this.user.htClass || []).map(item => item.id).join(',')
    this.getData()
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.unqualified {

  .table {
    padding: $width;
    margin-top: $width;
    background: $white;

    .total {
      margin-bottom: $width;
    }
  }
}
</style>
