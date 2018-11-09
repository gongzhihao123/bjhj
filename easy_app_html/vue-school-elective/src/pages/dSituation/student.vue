<template>
  <div class="student">
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
          prop="gradeName"
          label="年级"
          label-class-name="head"
          show-overflow-tooltip
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级"
          label-class-name="head"
          show-overflow-tooltip
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="unqualified"
          :label="type.unqualified"
          label-class-name="head"
          show-overflow-tooltip
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="successNum"
          :label="type.qualified"
          label-class-name="head"
          show-overflow-tooltip
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="notJoinNum"
          label="不参加选课"
          label-class-name="head"
          show-overflow-tooltip
          min-width="140">
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="100">
          <template scope="scope">
            <el-tooltip  effect="dark" :enterable="false" content="查看详情" placement="right">
              <el-button v-if="scope.$index !== tableData.length - 1" size="small" @click="getClassSituation(scope.row)" type="success"><i class="iconfont icon-look"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <el-dialog
      title="学生选课详情"
      :visible.sync="dialogVisible"
      size="tiny">

      <el-table
        :data="detailList"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="gradeName"
          label="年级"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          min-width="100">
        </el-table-column>
        <el-table-column
          label="选课结果"
          width="100">
          <template scope="scope">
            <p v-if="logic === 1 && scope.row.joinState === 1">
              <span v-if="scope.row.status === 0" style="color: #FF694A;">
                未选课
              </span>
              <span v-if="scope.row.status === 1" style="color: #FF694A;">不合格</span>
              <span v-if="scope.row.status === 2" style="color: #7DB3FE;">合格</span>
              <span v-if="scope.row.status === 3">落选</span>
            </p>
            <p v-if="logic === 2 && scope.row.joinState === 1">
              <span v-if="scope.row.choices.length === 0" style="color: #FF694A;">未选课</span>
              <span v-else  style="color: #7DB3FE;">已选课</span>
            </p>
            <p v-if="scope.row.joinState === 0">不参加选课</p>
          </template>
        </el-table-column>
        <el-table-column
          label="选课情况"
          width="190">
          <template scope="scope">
            <p v-if="scope.row.choices.length !== 0" v-for="(item, index) in scope.row.choices" :key="index">
              <span v-if="logic === 2">第{{ index + 1 | num }}志愿:</span>
              {{ item.lessonName }}
            </p>
            <p v-else>--</p>
          </template>
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
  name: 'student',
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      detailList: [],
      activityId: '',
      name: '',
      logic: '',
      type: {
        unqualified: '',
        qualified: ''
      }
    }
  },
  methods: {
    // 获取当前选课活动
    getActivityList () {
      service.get('dActivityController/getActivityList')
      .then(res => {
        if (res.data.code === 1) {
          this.activityId = (res.data.result || []).filter(item => item.activityState === 1)[0].id
          // （1-先到先得、2-优先级）
          this.logic = (res.data.result || []).filter(item => item.activityState === 1)[0].logic
          if (this.logic === 1) {
            this.type = {
              unqualified: '选课不合格',
              qualified: '选课合格'
            }
          } else if (this.logic === 2) {
            this.type = {
              unqualified: '未选课',
              qualified: '已选课'
            }
          }
          this.name = (JSON.parse(localStorage.SEMESTERLIST) || []).filter(item => item.state === 1)[0].semesterName + '  ' + (res.data.result || []).filter(item => item.activityState === 1)[0].name
          this.getClassSituationList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取班级学生选课状况列表
    getClassSituationList () {
      service.get(`/dSituationController/getClassSituationList?activityId=${this.activityId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result
          if (this.tableData.length !== 0) {
            if (this.logic === 1) {
              this.tableData.forEach((item) => {
                item.unqualified = item.totalNum - item.notJoinNum - item.qualifiedNum
                item.successNum = item.qualifiedNum
              })
            } else if (this.logic === 2) {
              this.tableData.forEach((item) => {
                item.unqualified = item.totalNum - item.notJoinNum - item.chosenNum
                item.successNum = item.chosenNum
              })
            }
            let unqualifiedTotal = 0
            let successTotal = 0
            let notJoinNumTotal = 0
            this.tableData.forEach((item, index) => {
              unqualifiedTotal += item.unqualified
              successTotal += item.successNum
              notJoinNumTotal += item.notJoinNum
            })
            this.tableData.push({ gradeName: '合计', unqualified: unqualifiedTotal, successNum: successTotal, notJoinNum: notJoinNumTotal })
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取班级学生选课详情
    getClassSituation (item) {
      this.dialogVisible = true
      service.get(`/dSituationController/getClassSituation?activityId=${this.activityId}&classId=${item.classId}`)
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

.student {
   margin: $width;

  .condition-list {
    padding: $width*2;
    background: $white;
    border-radius: 4px;
    margin-top: $width*2;

    .el-table {
      border: 0;
      thead {
        border-radius: 5px;
      }
      tbody {
        tr:last-child {
          td:first-child {
            background: #AFD1FF;
            color: #fff;
          }
        }
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
            text-align: left;
            background: #E5E5E5;
          }
        }

        td {
          border-right:1px solid #BBBBBB;
          border-bottom:1px solid #BBBBBB;
        }
        
        .cell {
          text-align: left;
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
