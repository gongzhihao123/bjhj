<template>
  <div class="sRecord">
    <div class="table-box">
      <el-table
        :data="tableData"
        style="width: 100%"
        class="display-table"
        stripe
        v-loading = "loading">
        <el-table-column
          prop="activityName"
          label="选课活动"
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
          label="成绩"
          label-class-name="head">
          <template scope="scope">
            {{ scope.row.score || 0 }}
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
  name: 'sRecord',

  data () {
    return {
      loading: false,
      tableData: []
    }
  },

  methods: {
    getData () {
      this.loading = true
      setTimeout(async () => {
        const { data } = await server.get('/sResultController/getStudentAllResultLesson')
        if (data.code === 1) this.tableData = [...(data.result || []).map(item => ({ ...item, pop: false }))]
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

.sRecord {

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
    background: $white;
  }
}

</style>
