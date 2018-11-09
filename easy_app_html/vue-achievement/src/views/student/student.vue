<template>
    <div class="student">
      <div class="box">
        <div class="navList">

          <el-select v-model="semester" @change="getExamList()" placeholder="请选择学期">
            <el-option
              v-for="item in semesterList"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select v-model="exam" placeholder="请选择考试" @change="getExamDetail">
            <el-option
              v-for="item in examList"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>

        <div class="tabs" v-if="isLevel">
          <div>
            <h1>考试成绩</h1>
            <el-row v-for="(item, i) in achievementList.listSubjectScore" :key="i">
              <el-col :span="10" style="padding-left: 10px;">{{ item.courseName }}</el-col>
              <el-col :span="14">{{ item.detailName }}</el-col>
            </el-row>
          </div>
        </div>

        <div class="tabs" v-else>
          <div>
            <h1>考试成绩</h1>
            <el-row v-for="(item, i) in achievementList.listSubjectScore" :key="i">
              <el-col :span="10" style="padding-left: 10px;">{{ item.courseName }}</el-col>
              <el-col :span="5">{{ item.comprehensiveScore }} <span class="tip">分</span></el-col>
              <el-col :span="9" class="tip">满分：{{ item.courseFullMarks || 0 }}分</el-col>
            </el-row>
            <el-row class="last">
              <el-col :span="10" style="padding-left: 10px;">总分</el-col>
              <el-col :span="14">{{achievementList.comprehensiveScore}}分</el-col>
            </el-row>
          </div>

          <div v-if="isRank">
            <h1>总分排名</h1>
            <el-row>
              <el-col :span="10" style="padding-left: 10px;">班排名</el-col>
              <el-col :span="5">{{achievementList.classSort || 0}}</el-col>
              <el-col :span="9" class="tip">总人数： {{achievementList.classCount || 0}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10" style="padding-left: 10px;">校排名</el-col>
              <el-col :span="5">{{achievementList.schoolSort || 0}}</el-col>
              <el-col :span="9" class="tip">总人数： {{achievementList.schoolCount || 0}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10" style="padding-left: 10px;">区排名</el-col>
              <el-col :span="5">{{achievementList.areaSort || 0}}</el-col>
              <el-col :span="9" class="tip">总人数： {{achievementList.areaCount || 0}}</el-col>
            </el-row>
          </div>
          
        </div>

        

      </div>
      
    </div>
</template>

<script>
// import querystring from 'querystring'
// import { mapGetters } from 'vuex'
import { notice } from '../../api/index.js'
export default {
  name: 'student',
  data () {
    return {
      isLevel: false,
      semester: '',
      semesterList: [],
      exam: '',
      examList: [],
      semesterId: '',
      achievementList: [],
      isRank: true
    }
  },
  methods: {
    // 获取学期列表
    async getSemesterList () {
      await this.$https.get(`/common/semesterList`)
      .then(res => {
        if (res.data.code === 1) {
          this.semesterList = res.data.result || []
          if (this.semesterList.length > 0) {
            this.semester = this.semesterList.filter(item => item.state === 1)[0].id
          } else {
            this.semester = ''
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    //  获取考试列表
    async getExamList () {
      await this.$https.get(`/examScoreQuery/examList?semesterId=${this.semester}`)
      .then(res => {
        if (res.data.code === 1) {
          this.examList = (res.data.result || [])
          if (this.examList.length > 0) {
            this.exam = this.examList[0].id
          } else {
            this.exam = ''
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取考试成绩详情
    async getExamDetail (val) {
      if (this.examList && this.examList.length > 0) {
        this.examList.find(items => items.id === val).publishFlag === 1 ? (this.isLevel = true) : (this.isLevel = false)
        this.examList.find(items => items.id === val).rankFlag === 1 ? (this.isRank = true) : (this.isRank = false)
        await this.$https.get(`/examScoreQuery/scoreDetail?examId=${this.exam}`)
        .then(res => {
          if (res.data.code === 1) {
            this.achievementList = (res.data.result || [])
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    }
  },
  async created () {
    await this.getSemesterList()
  }
}
</script>
<style lang="scss" scoped>
 .student {
  width: 1200px;
  height: calc(100vh - 90px);
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: 20px;

  > .box {
    box-sizing: border-box;
    background: #fff;
    padding: 20px;

    > .navList {
      height: 50px;
      margin-bottom: 20px;

      > .el-select {
        width: 330px;
        margin-right: 20px;
      }
    }

    > .tabs {
      height: calc(100vh - 210px);
      overflow-y: auto;

      > div {
        margin-bottom: 50px;

        &:last-child {
          margin-bottom: 0;
        }

        > h1 {
          color: #1ABC9C;
          margin-bottom: 20px;
        }

        > .el-row {
          height: 40px;
          line-height: 40px;
          border-top: 1px solid #ccc;

          .tip {
            color: #ccc;
          }

          &:last-child {
            border-bottom: 1px solid #ccc;
          }
        }

        > .last {
          height: 50px;
          line-height: 50px;
          font-weight: bold;
          color: #1ABC9C;
          border-bottom: 1px solid #ccc;
        }
      }
    }
  }
 }
</style>
