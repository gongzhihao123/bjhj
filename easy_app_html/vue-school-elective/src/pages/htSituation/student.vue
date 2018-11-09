<template>
  <div class="htStudent">
      <p>{{ nowSemester.semesterName }} {{ activityName }}</p>
      <div class="table">
        <div class="search">
          <el-input
            placeholder="学生姓名"
            icon="search"
            v-model="name"
            :on-icon-click="getData"
            @keyup.enter.native="getData">
          </el-input>
        </div>
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
          prop="courseNames"
          label="选课志愿"
          label-class-name="head"
          min-width="300"
          show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
  </div>

</template>

<script>
import server from '../../utils/axios'
// import { notice } from '../../api/index'
import { mapState } from 'vuex'

export default {
  name: 'htStudent',

  data () {
    return {
      classIds: '',
      name: '',
      loading: false,
      tableData: [],
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
        const { data } = await server.get(`/hTSituationController/getalreadyStudentList?activityId=${this.activityId}` +
                              `&classIds=${this.classIds}&name=${this.name}`)
                              .catch(() => { this.loading = false })
        if (data.code === 1) this.tableData = [...data.result || []]
        this.loading = false
      }, 600)
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

.htStudent {

  >.table {
    padding: $width;   
    margin-top: $width; 
    background: $white;

    >.search {
      margin-bottom: $width;
      text-align: right;

      >.el-input {
        width: 320px;
      }
    }
  }
}
</style>
