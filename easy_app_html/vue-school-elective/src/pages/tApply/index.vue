<template>
  <div class="tApply">
    <!-- 头部 -->
    <header>
      选课活动：
      <el-select v-model="value" placeholder="请选择" @change="getLessionList">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </header>

    <!--申请列表-->

    <div class="table-box" >
      <div class="btn">
        <p>申请列表</p>
        <el-button 
          type="success"
          :disabled="!value || value !== actId || !hasTemplate"
          @click="toDetail(-1, 3)">新增申请</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="display-table"
        stripe
        v-loading="loading">
        <el-table-column
          prop="name"
          label="课程名称"
          label-class-name="head"
          min-width="200px"
         show-overflow-tooltip>
          <template scope="scope">
            <el-button type="text" @click="toDetail(scope.row.id, 1)">
              {{ scope.row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="课程类型"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="审核状态"
          label-class-name="head"
          show-overflow-tooltip>
          <template scope="scope">
            {{
              scope.row.state === 0
              ? '未审核'
              : scope.row.state === 1
                ? '通过'
                : '未通过'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="180px">
          <template scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="right" v-if="scope.row.state !== 1">
              <el-button size="small" type="primary" v-if="value === actId && hasTemplate"  @click="toDetail(scope.row.id, 2)"><i class="iconfont icon-edit"></i></el-button>
            </el-tooltip>
            <el-popover
                placement="top"
                width="140"
                trigger="click"
                v-model="scope.row.pop"
                v-if="scope.row.state !== 1">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.pop = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="dele(scope.row)">确定</el-button>
                </div>
                <span slot="reference">
                  <el-tooltip effect="dark" content="删除" placement="right">
                    <el-button size="small" v-if="value === actId && hasTemplate" type="danger"><i class="iconfont icon-delete"></i></el-button>
                  </el-tooltip>
                </span>
              </el-popover>
            <el-tooltip effect="dark" content="复制" placement="right">
              <el-button size="small" type="success" @click="toDetail(scope.row.id, 4)"><i class="iconfont icon-clone"></i></el-button>
            </el-tooltip>
          </template>
       
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { notice } from '../../api/index.js'
import server from '../../utils/axios.js'
export default {
  name: 'tApply',
  data () {
    return {
      actId: '',
      options: [],
      value: '',
      tableData: [],
      loading: false,
      hasTemplate: false
    }
  },
  methods: {

    async dele (row) {
      const { data } = await server.post('/tLessonController/deleteLesson', {
        lessonId: row.id
      })
      if (data.code !== 1) notice(this, data.message, 2000)
      else this.getLessionList()
    },

    getActivityList () {
      server.get(`/tLessonController/getActivityList`)
      .then(res => {
        if (res.data.code === 1) {
          this.options = res.data.result || []
          this.options.forEach(item => {
            if (item.activityState === 1) {
              this.$store.commit('DA_ACTIVETY_ID', { id: item.id })
              this.actId = item.id
              this.value = item.id
            }
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },

    getLessionList () {
      this.loading = true
      setTimeout(() => {
        server.get(`/tLessonController/getLessionList?activityId=${this.value}`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = (res.data.result || []).map(item => ({ ...item, pop: false }))
          } else {
            notice(this, res.data.message, 2000)
          }
          this.loading = false
        })
        .finally(res => {
          this.loading = false
        })
      }, 500)
    },

    // 跳转到详情页面 -- 跳转到复制页面
    toDetail (id, state) {
      if (state === 1) this.$router.push({path: `/tApply/applyDetails/${id}`, query: {parameter: this.value}})
      else if (state === 2) this.$router.push({path: `/tApply/addApply/edit/${id}`, query: {parameter: this.value}})
      else if (state === 3) this.$router.push({path: `/tApply/addApply/add`, query: {parameter: this.value}})
      else if (state === 4) this.$router.push({path: `/tApply/addApply/copy/${id}`, query: {parameter: this.value, history: this.actId}})
    }
  },
  async created () {
    // 是否有模板
    // 是否有模板
    const { data: template } = await server.get('/tLessonController/getTemplate')
    if (template.code === 1 && template.result) this.hasTemplate = true

    this.getActivityList()
    this.getLessionList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';

.tApply {

  // 头部

  >header{
    padding: $width;
    background: $white;
    border-radius: 4px;

    margin-bottom: 20px;

    .el-select{
      width: 360px;
      margin-left: $width;
    }
  }

  >.table-box {
    padding: $width;
    background: $white;

    >.btn {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }
}
</style>
