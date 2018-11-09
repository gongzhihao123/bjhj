<template>
  <div class='overview'>
    <!-- 头部搜索 -->
    <header>
      <!-- <el-button type="primary" size="small" @click="$router.push('/task/taskDetail')">导出列表</el-button> -->

      <el-select v-model="searchLabel">
        <el-option
          v-for="item in chargeLabelOption"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-select v-model="searchState">
        <el-option
          v-for="item in stateOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-input placeholder="请输入任务名称" v-model="title" :maxlength="20"></el-input>

      <el-button size="small" type="success" @click="overviewList" icon="el-icon-search">搜索</el-button>
    </header>

    <!-- 列表主体 -->
    <main>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="名称"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span style="cursor: pointer;" @click="routeDetail(scope.row)">
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="标签"
          label-class-name="head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="状态"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
             <span  v-if="scope.row.finishedNum === scope.row.totalNum">
                已完成
              </span>
              <span v-else>
                <i style="color: #FF9223;" v-if="scope.row.days < 0">
                  已延期{{ Math.abs(scope.row.days) }}天
                </i>
                <i style="color: #48BB58;" v-else>
                  进行中
                </i>
              </span>
          </template>
        </el-table-column>
        <el-table-column
          label="完成情况"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.finishedNum }}/{{scope.row.totalNum}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createdUserName"
          label="负责人"
          label-class-name="head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="结束时间"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.finishTime | dateFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
      </el-table>

      <footer>
        <el-row>
          <el-col :span="24">
            <el-pagination
              v-if="totalCount !== 0"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :current-page.sync="pageNo"
              :page-size="10"
              :total="totalCount">
            </el-pagination>
          </el-col>
        </el-row>
      </footer>
    </main>
  </div>
</template>

<script>
export default {
  name: 'overview',
  data () {
    return {
      tableData: [],
      title: '',
      searchLabel: '',
      searchState: [],
      stateOptions: [
        { id: '', name: '全部状态' },
        { id: 1, name: '已完成' },
        { id: 3, name: '已延期' },
        { id: 2, name: '进行中' }
      ],
      chargeLabelOption: [],
      degreeOption: [
        { id: 1, name: '普通' },
        { id: 2, name: '重要' },
        { id: 3, name: '紧急' },
        { id: 4, name: '重要且紧急' }
      ],
      totalCount: 0,
      pageNo: 1
    }
  },
  methods: {
    // 跳转详情
    routeDetail (val) {
      this.$router.push({path: '/task/taskDetail', query: { taskId: val.id, flag: false }})
      sessionStorage.TASK_PAGENO = this.pageNo
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.overviewList()
    },
    // 获取标签列表
    async overviewTaskList () {
      const data = await this.$store.dispatch('overviewTaskList')
      this.chargeLabelOption = data
      this.chargeLabelOption.unshift({ name: '全部', id: '' })
      if (data.length !== 0 && !this.searchLabel) {
        this.searchLabel = data[0].id
      }
    },
    async overviewList () {
      const data = await this.$store.dispatch('overviewList', {
        taskId: this.searchLabel,
        state: this.searchState,
        title: this.title,
        pageNo: this.pageNo,
        pageSize: 10
      })
      this.tableData = data.list
      this.totalCount = data.totalCount
    }
  },
  mounted () {
  },
  watch: {
  },
  async created () {
    if (sessionStorage.TASK_PAGENO) {
      this.pageNo = Number(sessionStorage.TASK_PAGENO)
    } else {
      this.pageNo = 1
    }
    await this.overviewTaskList()
    await this.overviewList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.overview {
  header {
    .el-input {
      width: 150px;
    }
  }

  main {
    margin-top: 20px;
    padding: 20px;
    background: #fff;

    .el-table {
      th {
        &:nth-child(8){
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
      i {
        font-style: normal;
      }
    }
  }

  .el-dialog {
    .el-dialog__body {
      // .edui-editor {
      //   width: 449px !important;
      //   .edui-box {
      //     height: 23px !important;
      //   }
      // }
      // .edui-editor-iframeholder {
      //   width: 449px !important;
      // }

      .el-form{
        .el-row{
          .el-col{
            &>span{
              display: inline-block;
              width: 90px;
              text-align: left;
              vertical-align: top;
            }
            .el-form-item{
              width: 80%;
              display: inline-block;
              .el-form-item__content{
                margin-left: 0 !important;
              }
            }

            .el-input {
              width: 450px;
            }
            .el-textarea {
              width: 470px;
            }
          }
        }

        .people {
          width: 450px;
          border: 1px  solid #CED2D9;
          border-radius: 5px;
          min-height: 40px;
          .el-tag {
            margin-left: 5px;
          }
        }
      }
      ul {
        max-height: 150px;
        overflow-x: hidden;
      }
    }
  }

}
.inner {
  .el-dialog {
    .el-dialog__body {
      .el-tree {
        height: 350px;
        overflow-x: auto;
      }
      p {
        text-align: center;
      }
    }
  }
}
</style>
