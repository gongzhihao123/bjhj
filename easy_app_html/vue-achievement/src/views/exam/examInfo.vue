<template>
  <div class="exam-info">

    <p class="top">
      <span class="to-list" @click="route('/exam')">返回考试列表</span>
      {{ detail.name }}> 考试信息
    </p>

    <el-button type="success" @click="router('/exam/textObj', detail)" v-if="menu.buttons && menu.buttons.achievementEdit == 1">编辑考试</el-button>

    <el-form
      ref="form"
      :model="detail"
      label-width="160px">
      <el-form-item label="考试名称：">
        <span>{{ detail.name }}</span>
      </el-form-item>

      <el-form-item label="学段：">
        <span>{{ detail.sectionName }}</span>
      </el-form-item>
      <el-form-item label="年级：">
        <span>{{ detail.gradeName }}</span>
      </el-form-item>
      <el-form-item label="考试类型：">
        <span>{{ detail.categoryName }}</span>
      </el-form-item>
      <el-form-item label="是否需要排名：">
        <span>{{ detail.rankFlag == 1 ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="学生信息录入时间：">
        <span>{{ detail.startTime | dateFormat('yyyy-MM-dd') }}至{{ detail.endTime | dateFormat('yyyy-MM-dd') }}</span>
      </el-form-item>
      <el-form-item label="成绩发布时间：">
        <span>{{ detail.publishStartTime | dateFormat('yyyy-MM-dd') }}至{{ detail.publishEndTime | dateFormat('yyyy-MM-dd') }}</span>
      </el-form-item>
      <el-form-item label="成绩录入方式：">
        <span>{{ detail.scoreEnterType == 1 ? '统一录入' : '任课教师录入' }}</span>
      </el-form-item>
      <el-form-item label="单科等级：">
        <span>{{ detail.rankCourseRuleName }}</span>
      </el-form-item>
      <el-form-item label="总分等级：">
        <span>{{ detail.rankScoreRuleName }}</span>
      </el-form-item>
      <el-form-item label="优良等级：">
        <span>{{ detail.rankLevelRuleName }}</span>
      </el-form-item>
      <el-form-item label="总分计算：">
        <span>{{ detail.scoreRuleName }}</span>
      </el-form-item>
      <el-form-item label="考号规则：">
        <span>{{ detail.examnoRuleName }}</span>
      </el-form-item>
      <el-form-item label="成绩规则：">
        <span>{{ detail.structureRuleName }}</span>
      </el-form-item>
      <el-form-item label="发布等级：">
        <span>{{ detail.rankPublishRuleName }}</span>
      </el-form-item>
      <el-form-item label="考试科目：">
        <span v-for="(item, i) in detail.courseList" :key="i">{{ item.courseName }}
          <span v-if="i != detail.courseList.length - 1">、</span>
        </span>
      </el-form-item>
      <el-form-item label="学生选科数：">
        <span>{{ detail.requireNum }}</span>
      </el-form-item>
      <el-form-item label="参加考试学校：">
        <span v-for="(item, i) in detail.schoolList" :key="i">{{ item.schoolName }}
          <span v-if="i != detail.schoolList.length - 1">、</span>
        </span>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { notice } from '../../api/index'
export default {
  name: 'exam-info',
  data () {
    return {
      id: '',
      detail: {
        name: ''
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    menu () {
      return this.$store.state.menu
    }
  },
  methods: {
    getDetail () {
      this.$https.get(`/examQuery/examDetailView?examId=${this.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detail = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    route (path) {
      this.$router.push(path)
    },
    router (r, item) {
      let obj = { id: this.id, sectionId: item.sectionId }
      this.$router.push({path: r, query: { obj: JSON.stringify(obj) }})
    }
  },
  created () {
    this.id = sessionStorage.PARAMS_EXAMID
    this.getDetail()
  }
}
</script>

<style lang="scss">
.exam-info {

  .el-form {
    margin-top: 20px;
  }

  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
