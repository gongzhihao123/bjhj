<template>
  <div class="htRecord">
    <div class="content">
      <div class="tree">
        <el-input
          placeholder="输入关键字进行筛选"
          v-model="filterText">
        </el-input>

        <el-tree
          class="filter-tree"
          :data="tree"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
          highlight-current
          @node-click="treeClick">
        </el-tree>
      </div>
      <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-loading = "loading">
        <el-table-column
          prop="activityName"
          label="选课活动"
          label-class-name="d-head"
          min-width="150px"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="课程类别"
          min-width="150px"
          label-class-name="d-head">
        </el-table-column>
        <el-table-column
          prop="lessonName"
          label="课程名称"
          min-width="150px"
          label-class-name="d-head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="score"
          label="成绩"
          min-width="150px"
          label-class-name="d-head">
        </el-table-column>
      </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import server from '../../utils/axios'
import { notice } from '../../api/index'
import { mapState } from 'vuex'
export default {
  name: 'htRecord',

  data () {
    return {
      filterText: '',
      tree: [],
      loading: false,
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  computed: {
    ...mapState({
      user: state => state.user
    })
  },

  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    treeClick (data) {
      if (data.children) return
      else this.getData(data.id)
    },

    getData (id) {
      this.loading = true
      setTimeout(async () => {
        const { data } = await server.get(`/hTResultController/getStudentResult?studentId=${id}`)
                          .catch(() => { this.loading = false })
        if (data.code !== 1) notice(this, data.message, 2000)
        else {
          this.tableData = [...data.result || []]
        }
        this.loading = false
      }, 400)
    }
  },

  async created () {
    this.tree = this.user.htClass.map(item => ({...item, children: []}))
    for (let i = 0; i < this.tree.length; i++) {
      const { data } = await server.get(`/hTResultController/getClassStudentList?classId=${this.tree[i].id}`)
      if (data.code === 1) this.tree[i].children.push(...(data.result || []).map(item => ({ id: item.id, name: item.studentName, studentId: item.studentId })))
    }
  }
}
</script>

<style lang="scss">

@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.htRecord {
  height: calc(100% - 40px);
  background: $white;
  padding: 20px;

  >.content {
    display: flex;
    justify-content: space-between;
    height: 100%;
    border: 1px solid #bbbbbb;
    border-radius: 4px;

    >.tree {
      padding: 20px;
      max-height: calc(100% - 40px);
      width: 240px;
      overflow-y: auto;

      >.el-tree {
        margin-top: 20px;
        border: 0;
      }
    }

    >.table {
      width: calc(100% - 240px);
      padding: 20px;
      border-left: 1px solid #bbbbbb;
      overflow-y: auto;      
      max-height: calc(100% - 40px);
      .el-table{
        border: 1px solid #BBBBBB;
      }
      .d-head {
        text-align: center;
        background: rgb(225, 225, 225);
      }
      th.d-head{
        border-right: 1px solid #BBBBBB;
        border-bottom: 1px solid #BBBBBB;
      }
    }
  }
}
</style>
