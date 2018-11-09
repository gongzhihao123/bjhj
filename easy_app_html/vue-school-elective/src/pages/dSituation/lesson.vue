<template>
  <div class="lesson">
    <p>
      {{ name }}
    </p>

    <div class="condition-list">
      <el-table
        :data="tableData"
        class="display-table"
        stripe
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="课程名称"
          label-class-name="head"
          show-overflow-tooltip
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="授课教师"
          label-class-name="head"
          show-overflow-tooltip
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="limitNum"
          label="人数上限"
          label-class-name="head"
          show-overflow-tooltip
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="signCount"
          :render-header="renderContent"
          label-class-name="head"
          show-overflow-tooltip
          min-width="160">
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="100">
          <template scope="scope">
            <el-tooltip  effect="dark" :enterable="false" content="查看详情" placement="right">
              <el-button size="small" @click="look(scope.row)" type="success"><i class="iconfont icon-look"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="查看详情"
      :visible.sync="dialogVisible"
      size="tiny">
      <p>
        <span>{{ courseName }}</span>
        >
        <span>报名情况</span>
      </p>

      <el-table
        :data="detailList"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="gradeName"
          label="年级"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级"
          width="200">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="学生姓名"
          width="190">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button :plain="true" type="danger" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>  
  </div>
</template>

<script>
import service from '../../utils/axios'
import { notice } from '../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'lesson',
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      detailList: [],
      name: '',
      logic: '',
      sorting: 1,
      courseName: ''
    }
  },
  methods: {
    renderContent (h, { column, $index }) {
      return (
        <span>
          <span>报名人数</span>
          { column.filterOpened
            ? <span class="sort-img-up" on-click={ () => this.sort(column, $index) }></span>
            : <span class="sort-img-down" on-click={ () => this.sort(column, $index) }></span>
          }
        </span>
      )
    },
    sort (column, i) {
      if (column.filterOpened === true) {
        column.filterOpened = false
        this.sorting = 1
      } else {
        column.filterOpened = true
        this.sorting = 2
      }
      if (this.logic === 1) {
        this.activityStatusFirst()
      } else {
        this.activityStatusPriority()
      }
    },
    // 查看详情
    look (val) {
      this.dialogVisible = true
      this.courseName = val.name
      if (this.logic === 1) {
        this.activityStatusFirstDetails(val.id)
      } else {
        this.activityStatusPriorityDetails(val.id)
      }
    },
    // 获取当前选课活动
    getActivityList () {
      service.get('dActivityController/getActivityList')
      .then(res => {
        if (res.data.code === 1) {
          this.activityId = (res.data.result || []).filter(item => item.activityState === 1)[0].id
          // （1-先到先得、2-优先级）
          this.logic = (res.data.result || []).filter(item => item.activityState === 1)[0].logic
          this.name = JSON.parse(localStorage.SEMESTERLIST).filter(item => item.state === 1)[0].semesterName + '  ' + res.data.result.filter(item => item.activityState === 1)[0].name
          if (this.logic === 1) {
            this.activityStatusFirst()
          } else {
            this.activityStatusPriority()
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 查询课程状态（优先级）
    activityStatusPriority () {
      service.get(`/dSituationController/activityStatusPriority?activityId=${this.activityId}&sort=${this.sorting}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 查询课程状态详情（优先级）
    activityStatusPriorityDetails (item) {
      service.get(`/dSituationController/activityStatusPriorityDetails?lessonId=${item}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detailList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 查询课程状态（先到先得）
    activityStatusFirst () {
      service.get(`/dSituationController/activityStatusFirst?activityId=${this.activityId}&sort=${this.sorting}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 查询课程状态详情（先到先得）
    activityStatusFirstDetails (item) {
      service.get(`/dSituationController/activityStatusFirstDetails?lessonId=${item}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detailList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'semesterList'
    ])
  },
  created () {
    if (this.semesterList.length !== 0) {
      localStorage.SEMESTERLIST = JSON.stringify(this.semesterList)
    }
    setTimeout(() => {
      this.getActivityList()
    }, 200)
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.lesson {
  margin: $width;

  .condition-list {
    padding: $width*2;
    background: $white;
    border-radius: 4px;
    margin-top: $width*2;

    .el-table {
      border: 0;
      .sort-img-down {
        cursor: pointer;
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url(../../assets/images/sort-down.png);
        vertical-align: middle;
        margin-left: $width/4;
        &:hover {
          background: url(../../assets/images/sort-down-hover.png);
        }
      }
      .sort-img-up {
        cursor: pointer;
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url(../../assets/images/sort-up.png);
        vertical-align: middle;
        margin-left: $width/4;
        &:hover {
          background: url(../../assets/images/sort-up-hover.png);
        }
      }
      thead {
        border-radius: 5px;
      }
      th {
        border: 0;
      }
      td {
        border: 0;
      }
    }
  }

  .el-dialog {
    width: 680px;

    .el-dialog__body {
      padding:$width $width*2;

      .el-table {
        margin-top: $width;
        border:1px solid #BBBBBB;

        th {
          background: #E5E5E5;
          border-right:1px solid #BBBBBB;
          border-bottom:1px solid #BBBBBB;

          .cell {
            background: #E5E5E5;
          }
        }

        td {
          border-right:1px solid #BBBBBB;
          border-bottom:1px solid #BBBBBB;
        }
        
        .cell {
          text-align: center;
        }
      }
    }

    .el-dialog__footer {
      .el-button {
        border-color: #FF6040;
        color: #FF6040;
      }
    }
  }
}
</style>
