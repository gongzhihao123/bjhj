<template>
  <div class="lesson" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="lesson-head">
      <div class="select">
        <span>选课活动</span>
        <el-select v-model="activityId" placeholder="请选择选课活动" @change="activeChange">
          <el-option
            v-for="item in activeList"
            :key="item.activityId"
            :label="item.name"
            :value="item.activityId">
          </el-option>
        </el-select>
      </div>
      <div class="select" v-if="nowStateId === activityId">
        <span>课程类型</span>
        <el-select v-model="typeId" clearable placeholder="请选择课程类型" @change="getData($event)">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="btn" v-if="nowStateId === activityId">
        <el-button
          type="success"
          @click="toDetail(-1, 5)"
          :disabled="activityId === '' || !hasTemplate">新增</el-button>
        <el-button type="primary" @click="download">下载课程模板</el-button>
        <!-- <el-button type="primary" :disabled="!typeId">导入课程</el-button> -->
        <el-upload
            class="upload-demo"
            :action="action"
            name="uploadFile"
            :data="{ 'activityId': activityId, 'activityType': typeId }"
            :on-success="handleSuccess"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-error="handleError"
            style="display: inline-block; margin: 0 10px;">
            <el-button type="primary">导入课程</el-button>
          </el-upload>
        <el-button
          type="primary"
          @click="editTime"
          :disabled="multipleSelection.length === 0">修改上课时间</el-button>
        <el-button 
          type="warning" 
          @click="check"
          :disabled="multipleSelection.length === 0">审核</el-button>
      </div>
    </div>


    <div class="table-box">
      <el-tabs v-model="checkState" @tab-click="handleClick">
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane label="未审核" name="0"></el-tab-pane>
        <el-tab-pane label="审核通过" name="1"></el-tab-pane>
        <el-tab-pane label="审核未通过" name="2"></el-tab-pane>
      </el-tabs>
      <div class="search">
        <el-input
          placeholder="请输入教师姓名或课程名称"
          icon="search"
          v-model="name"
          :on-icon-click="getData"
           @keyup.enter.native="getData">
        </el-input>
      </div>
      <div class="cont">
      <el-table
        :data="tableData"
        style="width: 100% !important"
        class="display-table"
        stripe
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        v-loading="loading">
        <el-table-column
          type="selection"
          width="50"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="课程名称"
          label-class-name="head"
          show-overflow-tooltip
          min-width="110">
          <template scope="scope">
            <el-button type="text" @click="toDetail(scope.row.id, 1)">
              {{ scope.row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="授课教师"
          width="100"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="limitNum"
          label="人数上限"
          width="100"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="上课时间"
          width="110"
          show-overflow-tooltip
          label-class-name="head">
          <template scope="scope">
            <div v-if="scope.row.week">
              星期{{ scope.row.week | num }} 第{{ scope.row.section | num }}节
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="locationName"
          label="上课地点"
          width="120"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="审批状态"
          width="100"
          label-class-name="head">
          <template scope="scope">
            {{
              scope.row.checkState === 0
              ? '未审核'
              : scope.row.checkState === 1
                ? '通过'
                : '未通过'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="220"
          label-class-name="head">
          <template scope="scope">
          <!-- v-if="scope.row.checkState === 0 || scope.row.checkState === 2" -->
            <el-tooltip  effect="dark" :enterable="false" content="审核" placement="right" v-if="nowStateId === activityId">  
              <el-button size="small" type="warning" @click="toDetail(scope.row.id, 2)"><i class="iconfont icon-check"></i></el-button>
            </el-tooltip>
              <el-popover
                placement="top"
                width="140"
                trigger="click"
                v-model="scope.row.pop"
                v-if="nowStateId === activityId">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.pop = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="dele(scope.row)">确定</el-button>
                </div>
                <span slot="reference">
                  <el-tooltip effect="dark" :enterable="false" content="删除" placement="right">
                    <el-button size="small" type="danger"><i class="iconfont icon-delete"></i></el-button>
                  </el-tooltip>
                </span>
              </el-popover>
            <el-tooltip effect="dark" :enterable="false" content="编辑" placement="right" v-if="nowStateId === activityId">
              <el-button size="small" type="primary" @click="toDetail(scope.row.id, 3)"><i class="iconfont icon-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="复制" placement="right">
              <el-button size="small" type="success" @click="toDetail(scope.row.id, 4)"><i class="iconfont icon-clone"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </div>

    <!-- 批量设置时间 -->
    <el-dialog title="批量设置上课时间" :visible.sync="timeDialog" size="small">
        <el-form
            :model="timeForm"
            label-width="100px"
            ref="timeForm"
            v-if="timeDialog" 
            :inline="true">
          <el-form-item label="上课时间"
                        prop="lessonTimeId"
                        :rules="[
                          { required: true, type: 'number', message: '请选择时间', trigger: 'change' }
                        ]"
                        style="width: 100%">
            <el-select v-model="timeForm.lessonTimeId" style="width: 300px" placeholder="请选择时间">
              <el-option  v-for="item in timeList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer">
          <el-button type="danger" @click="timeDialog = false">取消</el-button>
          <el-button :plain="true" type="primary" @click="submit('timeForm')">保存</el-button>
        </div>
    </el-dialog>

    <!-- 审核 -->
    <el-dialog title="审核" :visible.sync="checkDialog" size="small">
      <el-form
          :model="checkForm"
          ref="checkForm"
          v-if="checkDialog" >
        <el-form-item label="审批意见" label-width="100px">
            <el-radio-group v-model="checkForm.checkState">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
        </el-form-item>
        <transition mode="out-in" name="slide-up" >
          <el-form-item
          v-if="checkForm.checkState !== 1"
            style="padding: 0 30px">
            <el-input 
              type="textarea"
              placeholder="请输入不通过原因"
              :maxlength="200"
              v-model="checkForm.reason"
              :rows="5"></el-input>
          </el-form-item>
        </transition>
      </el-form>
        <div slot="footer">
          <el-button type="danger" @click="checkDialog = false">取消</el-button>
          <el-button :plain="true" type="primary" @click="submit('checkForm')">提交</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import server from '../../utils/axios'
import { notice } from '../../api/index'
import { num } from '../../filters/index.js'
import { mapGetters } from 'vuex'

export default {
  name: 'lesson',

  data () {
    return {
      multipleSelection: [],
      fullscreenLoading: false,
      activityId: '',
      nowStateId: '', // 是否为当前激活的活动
      typeId: '',
      checkState: '-1',
      name: '',
      timeDialog: false,
      checkDialog: false,
      loading: false,
      activeList: [],
      typeList: [],
      tableData: [],
      timeForm: {
        lessonTimeId: ''
      },
      hasTemplate: false,
      checkForm: {
        checkState: 0,
        reason: ''
      },
      timeList: []
    }
  },

  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/dLessonController/importLesson`
    },

    ...mapGetters([
      'semesterList',
      'sectionList'
    ])
  },

  methods: {

    beforeUpload (file) {
      this.fullscreenLoading = true
      const reg = new RegExp(/[.xlsx.xls.XLSX.XLS]$/)
      if (!reg.test(file.name)) {
        this.$message.error('上传的文件只能是Excel格式。')
        this.fullscreenLoading = false
      }
    },

    handleError (err) {
      this.fullscreenLoading = false
      notice(this, err, 2000)
    },

    handleSuccess (res, file) {
      if (res.code !== 1) notice(this, res.message || '')
      else this.getData()
      this.fullscreenLoading = false
    },

    // 选课活动修改
    async activeChange (e) {
      const { data } = await server(`/dLessonController/getLessonTypeList?activityId=${e}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.typeId = ''
        this.typeList = data.result.map(item => ({ name: item.name, id: item.id }))
        this.getData()
      }
    },

    // 修改上课时间
    editTime () {
      this.timeDialog = true
      this.timeForm = { lessonTimeId: '' }
    },

    // 下载模板
    download () {
      const semesterId = this.semesterList.find(item => item.state === 1).semesterId
      const path = document.querySelector('#contextPath').value
      window.location = `${path}/dLessonController/downTemplate?activityId=${this.activityId}` +
                        `&semesterId=${semesterId}`
    },

    // 审核
    check () {
      this.checkDialog = true
      this.checkForm = {
        checkState: 1,
        reason: ''
      }
    },

    handleClick () {
      this.getData()
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    async dele (row) {
      const { data } = await server.post('/dLessonController/lessonId', { lessonId: row.id })
      if (data.code !== 1) notice(this, data.message, 2000)
      else this.getData()
    },

    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 修改时间
          if (formName === 'timeForm') {
            const { data } = await server.post('/dLessonController/updateLessonTimeId', {
              lessonIds: this.multipleSelection.map(item => item.id).join(','),
              ...this.timeForm
            })
            if (data.code !== 1) notice(this, data.message, 1000)
            else {
              this.getData()
              this.timeDialog = false
            }
          }

          // 批量审核
          if (formName === 'checkForm') {
            const { data } = await server.post('/dLessonController/examineLessonList', {
              lessonIds: this.multipleSelection.map(item => item.id).join(','),
              ...this.checkForm
            })
            if (data.code !== 1) notice(this, data.message, 2000)
            else {
              this.checkDialog = false
              this.getData()
            }
          }
        } else {
          return false
        }
      })
    },

    getData (e) {
      this.loading = true
      setTimeout(async () => {
        const { data } = await server.get(`/dLessonController/getLessonList?activityId=${this.activityId}&name=${this.name}` +
                        `&typeId=${this.typeId}&checkState=${this.checkState === '-1' ? ' ' : ~~this.checkState}`)
                        .finally(() => { this.loading = false })
        this.tableData = data.result.map(item => ({...item, pop: false}))
        this.loading = false
      }, 400)
    },

    async getTime () {
      const { data } = await server.get(`/dActivityLessontimeController/getLessonTimeList?activityId=${this.activityId}`)
      if (data.code === 1) {
        this.timeList = data.result.map(item => {
          return {
            name: `星期${num(item.week)} - 第${num(item.section)}节`,
            id: item.id
          }
        })
      }
    },

    // 跳转到详情页面 -- 跳转到复制页面
    toDetail (id, state) {
      if (state === 1) this.$router.push({path: `/dManage/dMaddlessonDetail/view/${id}`, query: {parameter: this.activityId}})
      else if (state === 2) this.$router.push({path: `/dManage/dMaddlessonDetail/check/${id}`, query: {parameter: this.activityId}})
      else if (state === 3) this.$router.push({path: `/dManage/dMaddlesson/edit/${id}`, query: {parameter: this.activityId}})
      else if (state === 4) this.$router.push({path: `/dManage/dMaddlesson/copy/${id}`, query: {parameter: this.activityId}})
      else if (state === 5) this.$router.push({path: `/dManage/dMaddlesson/add`, query: {parameter: this.activityId}})
    }
  },

  async created () {
    const { data } = await server.get('/dLessonController/getActivityList')
    if (data.code === 1) {
      this.activeList = [...data.result.map(item => ({ activityId: item.id, name: item.name, activityState: item.activityState }))]
      this.nowStateId = this.activityId = this.activeList.filter(item => item.activityState === 1)[0].activityId
      this.$store.commit('DA_ACTIVETY_ID', { id: this.nowStateId })
    }

    // 是否有模板
    const { data: template } = await server.get('/dLessonController/getTemplate')
    if (template.code === 1 && template.result) this.hasTemplate = true
    // this.getData()
    this.getTime()
  }
}
</script>

<style lang="scss">

@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.lesson {

  >.lesson-head {
    background: $white;
    padding: $width;
    border-radius: 4px;

    >.select {
      margin: 16px 0;

      >.el-select {
        width: 300px;
        margin-left: $width/2;
      }
    }
  }

  >.table-box {
    margin-top: $width;
    background: $white;

    >.el-tabs {

      >.el-tabs__header {
        padding: 0 $width;
        margin: 0;
      }
    }

    >.search {
      text-align: right;
      padding: $width;

      >.el-input {
        width: 280px;
      }
    }

    >.cont {
      padding: 0 $width $width;
    }
  }

  .el-dialog {
    .el-radio-group {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 80%;
      height: 36px;
    }
  }
}

</style>
