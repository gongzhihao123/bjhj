<template>
  <div class="activity">
    <div class="title">
      <span>选课活动列表</span>
      <el-button type="success" size="small" @click="add">新增</el-button>
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        style="width: 100%"
        class="display-table"
        stripe
        v-loading = "loading">
        <el-table-column
          label="选课活动"
          label-class-name="head">
          <template scope="scope">
              {{nowSemester.semesterName}} {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="activityState"
          label="状态"
          label-class-name="head">
          <template scope="scope">
            {{ scope.row.activityState === 0 ? '停用' : '激活' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="220"
          label-class-name="head">
          <template scope="scope">
            <el-tooltip  effect="dark" :enterable="false" content="查看" placement="right">
              <el-button size="small" type="success" @click="look(scope.row)"><i class="iconfont icon-look"></i></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="激活" placement="right" v-if="scope.row.activityState === 0">
              <el-button size="small" type="success"  @click="changeState(scope.row, 'activate')"><i class="iconfont icon-act"></i></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" :enterable="false" content="停用" placement="right" v-if="scope.row.activityState === 1">
              <el-button size="small" type="danger"  @click="changeState(scope.row, 'stop')"><i class="iconfont icon-stop"></i></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="设置" placement="right" v-if="scope.row.activityState === 1">
              <el-button size="small" type="info" @click="edit(scope.row)"><i class="iconfont icon-set"></i></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="发布结果" placement="right" v-if="scope.row.activityState === 1" >
              <el-button size="small" type="primary" @click="changeState(scope.row, 'publish')"><i class="iconfont icon-release"></i></el-button>
            </el-tooltip>
              <el-popover
                placement="top"
                width="140"
                trigger="click"
                v-model="scope.row.pop">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.pop = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="dele(scope.row.id)">确定</el-button>
                </div>
                <span slot="reference">
                  <el-tooltip effect="dark" :enterable="false" content="删除" placement="right" v-if="scope.row.activityState === 0">
                    <el-button size="small" type="danger"><i class="iconfont icon-delete"></i></el-button>
                  </el-tooltip>
                </span>
              </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import server from '../../utils/axios'
import { notice, success } from '../../api/index'
export default {
  name: 'activity',

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
        const { data } = await server.get('/dActivityController/getActivityList')
                                .finally(() => { this.loading = false })
        if (data.code === 1) this.tableData = [...data.result.map(item => ({ ...item, pop: false }))]
        else notice(this, data.message, 2000)
        this.loading = false
      }, 400)
    },

    async changeState (row, state) {
      let para = {
        activityId: row.id,
        publish: null,
        stop: null,
        activate: null
      }
      para[state] = 1
      let message = ''
      if (state === 'publish') message = '发布'
      else if (state === 'stop') message = '停用'
      else if (state === 'activate') message = '激活'
      const { data } = await server.post('/dActivityController/updateActivityState', para)
      if (data.code !== 1) {
        notice(this, message + '失败', 2000)
      } else {
        success(this, message + '成功', 2000)
        this.getData()
      }
    },

    add () {
      this.$router.push('/dManage/addActivity')
      this.$store.commit('DA_ACTIVETY_STATE', 1)
    },

    look (row) {
      this.$router.push(`/dManage/addActivity/${row.id}`)
      this.$store.commit('DA_ACTIVETY_STATE', 0)
    },

    edit (row) {
      this.$router.push(`/dManage/addActivity/${row.id}`)
      this.$store.commit('DA_ACTIVETY_STATE', 1)
    },

    async dele (id) {
      const { data } = await server.post('/dActivityController/deleteActivity', { id })
      if (data.code === 1) this.getData()
      else notice(this, data.message, 2000)
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

.activity {

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    >.el-button {
      margin-right: $width;
    }
  }

  .table-box {
    padding: $width;
    margin-top: $width;
    background: $white;
  }
}

</style>
