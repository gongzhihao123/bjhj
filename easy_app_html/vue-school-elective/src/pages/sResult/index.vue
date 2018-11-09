<template>
  <div class="sResult">
    <div class="title">
      <span>{{ nowSemester.semesterName }}</span>
      >
      <span class="name">选课结果</span>
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        style="width: 100%"
        class="display-table"
        stripe
        v-loading = "loading">
        <el-table-column
          prop="typeName"
          label="课程类别"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="lessonName"
          label="课程名称"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="教师名称"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="lessonAddress"
          label="上课地点"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="上课时间"
          label-class-name="head">
            <template scope="scope">
              星期{{ scope.row.week | num }} 第{{ scope.row.section | num }}节
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import server from '../../utils/axios'
import { notice } from '../../api/index'
export default {
  name: 'sResult',

  data () {
    return {
      loading: false,
      tableData: []
    }
  },

  computed: {
    nowSemester () {
      return this.$store.getters.semesterList.filter(item => item.state === 1)[0]
    }
  },

  methods: {
    getData () {
      this.loading = true
      setTimeout(async () => {
        const { data } = await server.get('/sResultController/getStudentResultLesson')
        if (data.code === 1) this.tableData = data.result ? [...data.result.map(item => ({ ...item, pop: false }))] : []
        else notice(this, data.message, 2000)
        this.loading = false
      }, 400)
    }
  },

  created () {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.sResult {

  .title {
    width: 100%;
    display: flex;
    align-items: center;

    >span {
      margin-right: 10px;
    }

    >.name {
      margin-left: 10px;
      color: $blue;
    }

  }

  .table-box {
    padding: $width;
    margin-top: $width;
    background: $white;
  }
}

</style>
