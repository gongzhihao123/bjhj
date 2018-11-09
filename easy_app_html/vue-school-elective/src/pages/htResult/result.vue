<template>
  <div class="htResult">
    <div class="htResult-head">
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
      <div class="select">
        <span>课程名称</span>
        <el-select v-model="lessonId" clearable placeholder="请选择课程名称" @change="activeChange">
          <el-option
            v-for="item in lessList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="table-box">
      <div class="search">
        <el-input
          placeholder="请输入学生姓名"
          icon="search"
          v-model="studentName"
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
          prop="lessonName"
          label="课程名称"
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
              星期{{ scope.row.week | num }}第{{ scope.row.section | num }}节
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import server from '../../utils/axios'
import { notice } from '../../api/index'
import { mapState } from 'vuex'
export default {
  name: 'htResult',

  data () {
    return {
      loading: false,
      activityId: '',
      activeList: [],
      lessonId: '',
      lessList: [],
      studentName: '',
      tableData: []
    }
  },

  computed: {
    ...mapState({
      user: state => state.user
    })
  },

  methods: {
    async activeChange (e) {
      const { data } = await server.get(`/hTResultController/getLessonAndStudentAboutMyStudent?activityId=${this.activityId}` +
                            `&lessonId=${this.lessonId}&studentName=${this.studentName}` +
                            `&classIds=${this.user.htClass.map(item => item.id).join(',')}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.lessList = (data.result.lessonList || []).map(item => ({ id: item.id, name: item.name }))
        this.getData()
      }
    },

    getData () {
      this.loading = true
      setTimeout(async () => {
        const { data } = await server.get(`/hTResultController/getLessonAndStudentAboutMyStudent?activityId=${this.activityId}` +
                              `&lessonId=${this.lessonId}&studentName=${this.studentName}` +
                              `&classIds=${this.user.htClass.map(item => item.id).join(',')}`)
                              .finally(() => { this.loading = false })
        if (data.code !== 1) notice(this, data.message, 2000)
        else {
          this.tableData = [...(data.result.studentList || [])]
        }
        this.loading = false
      }, 400)
    }
  },

  async created () {
    // 选课活动
    const { data } = await server.get('/hTResultController/getAllActivity')
    if (data.code === 1) {
      this.activeList = [...data.result.map(item => ({ activityId: item.id, name: item.name, activityState: item.activityState }))]
      this.activityId = this.activeList.filter(item => item.activityState === 1)[0].activityId
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.htResult {
  .htResult-head {
    background: $white;
    padding: $width;

    >.select {
      margin: 16px 0;

      >.el-select {
        width: 300px;
        margin-left: $width/2;
      }
    }
  }

  .table-box {
    background: $white;
    margin-top: 16px;
    padding: 16px;

    >.search {
      text-align: right;
      margin-bottom: 20px;

      >.el-input {
        width: 260px;
      }
    }
  }
}
</style>
