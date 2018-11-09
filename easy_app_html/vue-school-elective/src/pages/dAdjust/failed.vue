<template>
  <div class="failed">
    
    <header>
      <el-row>
        <el-col :span="12">
          选课活动：{{ name }}
        </el-col>
        <el-col :span="12">
          <el-button :disabled="tableData.length === 0 || autoLessonButton" @click="autoLesson" type="success">自动安排学生</el-button>
        </el-col>
      </el-row>
    </header>

    <main>
      <p>
        <img src="../../assets/images/cancel-class.png" alt="">
        <span>落选学生： {{ tableData.length }}名</span>
      </p>

      <el-table
        :data="tableData"
        class="display-table"
        stripe
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="序号"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
          <template scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="gradeName"
          label="年级"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="studentName"
          label="学生姓名"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="countNum"
          label="落选课程"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          label-class-name="head"
          width="100">
          <template scope="scope">
            <el-tooltip  effect="dark" :enterable="false" content="安排学生" placement="right">
              <el-button size="small" @click="arrangementStudent(scope.row, scope.$index)" type="success"><i class="iconfont icon-group"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </main>

    <!-- 安排学生弹出框 -->
    <el-dialog
      class="arrange-student"
      :title="gradeAndClassName"
      :visible.sync="dialogVisible"
      size="tiny">
      <p style="color: #7BB2FE;">
        <img src="../../assets/images/has-selected-class.png" alt="">
        已安排{{ hasAssangeClassList.length }}门课程：
      </p>

      <el-table
        :data="hasAssangeClassList"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="课程名称"
          prop="courseName"
          width="230">
        </el-table-column>
        <el-table-column
          prop="courseType"
          label="课程类型"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="授课老师"
          min-width="120">
        </el-table-column>
        <el-table-column
          label="上课时间"
          min-width="120">
          <template scope="scope">
            <span>
              星期{{ scope.row.courseTime[0] | num}} <br> 第{{ scope.row.courseTime[1] | num }}节课
            </span>
          </template>
        </el-table-column>
      </el-table>

      <p style="color: #FAAC24;" v-if="logic === 1">
        <img src="../../assets/images/cancel-class.png" alt="">
        还需安排{{ needCourseNum }}门课程：
      </p>

      <el-select v-model="value" @change="courseTypeChange" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <div v-for="(item, index) in allCourseList" :key="index">
        <p>
          星期{{ item.courseTime[0] | num }}第{{ item.courseTime[1] | num }}节课
        </p>
        <el-table
          :data="item.courseList"
          border
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            width="50">
            <template scope="scope">
              <!-- <el-radio v-model="item.value" :label="String(scope.row.id)">&nbsp;</el-radio> -->
              <el-checkbox v-model="scope.row.checked" @change.native="boxChange(item, scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="课程名称"
            prop="courseName"
            width="140">
          </el-table-column>
          <el-table-column
            prop="courseType"
            label="课程类型"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="teacherName"
            label="授课老师"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="limitNum"
            label="人数上限"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="courseNum"
            label="课程人数"
            min-width="100">
          </el-table-column>
        </el-table>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button :plain="true" type="danger" @click="dialogVisible = false">取 消</el-button>
        <el-button :plain="true" type="primary" @click="adjustCourseConfirm">确 定</el-button>
        <el-button :plain="true" type="primary" :class="{next: !canArrangement}" :disabled="canArrangement" @click="next">安排下一个学生</el-button>
      </span>
    </el-dialog> 
  </div>
</template>

<script>
import service from '../../utils/axios'
import { notice, success } from '../../api/index.js'
import { mapGetters } from 'vuex'
export default {
  name: 'failed',
  data () {
    return {
      autoLessonButton: false,
      dialogVisible: false,
      options: [],
      value: '',
      tableData: [],
      hasAssangeClassList: [],
      allCourseList: [],
      name: '',
      radioValue: '',
      logic: '',
      gradeAndClassName: '',
      parameter: {},
      needCourseNum: '',
      num: '',
      canArrangement: false,
      dialogClose: false
    }
  },
  methods: {
    // 自动安排学生
    autoLesson () {
      this.autoLessonButton = true
      service.post(`/dResultController/autoLesson`, ({
        activityId: this.activityId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '自动安排学生成功', 1000)
          this.getUnSelectStudent()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.autoLessonButton = false
      })
    },
    // 切换课程类型
    courseTypeChange () {
      this.getActivityCourseList()
    },
    // 安排下一个学生按钮
    async next () {
      await this.saveActivityLesson()
      let json = []
      if (this.allCourseList.length !== 0) {
        this.allCourseList.forEach((item, index) => {
          if (item.value) {
            json.push({ companyId: this.user.companyId, activityId: this.activityId, studentId: this.parameter.id, studentUserId: this.parameter.studentId, lessonId: Number(item.value), score: 0, public_flag: 0 })
          }
        })
      }
      if (this.num + 1 === this.tableData.length) {
        this.dialogVisible = false
        notice(this, '已经是最后一名学生了', 2000)
      } else {
        if (json.length !== 0) {
          this.arrangementStudent(this.tableData[this.num + 1], this.num + 1)
        }
      }
    },
    // 安排课程确定
    async adjustCourseConfirm () {
      await this.saveActivityLesson()
      if (!this.dialogClose) {
        this.dialogVisible = false
      }
    },
    // 安排课程
    async saveActivityLesson () {
      let json = []
      if (this.allCourseList.length !== 0) {
        this.allCourseList.forEach((item, index) => {
          if (item.value) {
            json.push({ companyId: this.user.companyId, activityId: this.activityId, studentId: this.parameter.id, studentUserId: this.parameter.studentId, lessonId: Number(item.value), score: 0, public_flag: 0 })
          }
        })
      }
      if (this.logic === 1) {
        if (json.length > this.needCourseNum) {
          this.dialogClose = true
          notice(this, `你最多可以选择${this.needCourseNum}门课`, 2000)
          return
        }
      } else {
        if (json.length > 1) {
          this.dialogClose = true
          notice(this, '您最多可以选择1门课', 2000)
          return
        }
      }
      if (json.length === 0) {
        await notice(this, '请选择课程', 2000)
        this.dialogClose = true
      } else {
        await service.post('/dResultController/saveActivityLesson', ({
          activityId: this.activityId,
          gradeId: this.parameter.gradeId,
          studentId: this.parameter.id,
          json: JSON.stringify(json)
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '安排成功', 1000)
            this.dialogClose = false
            this.getUnSelectStudent()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    boxChange (item, val) {
      item.courseList.forEach((child) => {
        if (child.id !== val.id) {
          child.checked = false
        }
      })
      if (val.checked) item.value = val.id
      else item.value = ''
    },
    // 获取课程类型列表
    getTypeList () {
      service.get(`/dActivityTypeController/getTypeList?activityId=${this.activityId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.options = res.data.result
          this.options.unshift({ id: '', name: '全部类型' })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 安排学生按钮
    arrangementStudent (val, index) {
      this.num = index
      this.dialogVisible = true
      this.getTypeList()
      // 获取该学生已选的课程
      service.get(`/dResultController/getElectiveActivityCourse?activityId=${this.activityId}&gradeId=${val.gradeId}&classId=${val.classId}&studentId=${val.studentId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.needCourseNum = Number(res.data.result.num) - Number(res.data.result.List.length)
          this.gradeAndClassName = '安排学生 > ' + val.gradeName + val.className + ' > ' + val.studentName
          this.hasAssangeClassList = res.data.result.List
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      this.parameter = {
        gradeId: val.gradeId,
        classId: val.classId,
        id: val.id,
        studentId: val.studentId,
        sex: val.sex
      }
      this.value = ''
      this.getActivityCourseList()
    },
    // 获取符合的课程
    getActivityCourseList () {
      service.get(`/dResultController/getActivityCourseList?activityId=${this.activityId}&gradeId=${this.parameter.gradeId}` +
                  `&classId=${this.parameter.classId}&studentId=${this.parameter.studentId}&sex=${this.parameter.sex}&typeId=${this.value}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result.forEach((child) => {
            child.courseList = child.courseList.map(item => ({...item, checked: false}))
          })
          // this.allCourseList = res.data.result.map(item => ({...item, value: ''}))
          this.allCourseList = res.data.result
          this.allCourseList.length !== 0 ? this.canArrangement = false : this.canArrangement = true
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取当前选课活动
    getActivityList () {
      service.get('dActivityController/getActivityList')
      .then(res => {
        if (res.data.code === 1) {
          this.activityId = (res.data.result || []).filter(item => item.activityState === 1)[0].id
          // （1-先到先得、2-优先级）
          this.logic = (res.data.result || []).filter(item => item.activityState === 1)[0].logic
          this.name = JSON.parse(localStorage.SEMESTERLIST).filter(item => item.state === 1)[0].semesterName + '  ' + (res.data.result || []).filter(item => item.activityState === 1)[0].name
          this.getUnSelectStudent()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取当前选课下的落选学生
    getUnSelectStudent () {
      service.get(`/dResultController/getUnSelectStudent?activityId=${this.activityId}&studentId=${''}&type=${0}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'semesterList',
      'user'
    ])
  },
  created () {
    if (this.semesterList.length !== 0) {
      localStorage.SEMESTERLIST = JSON.stringify(this.semesterList)
    }
    this.getActivityList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.failed{
  margin: $width;

  header {
    .el-row {

      .el-col:last-child {
        text-align: right;
        padding-right: $width*2;

        .el-button {
          margin-top: -$width;
        }
      }
    }
  }

  main {
    padding: $width*2;
    margin-top: $width;
    border-radius: 4px;
    background: $white;

    &>p {
      img{
        width: $width;
        height: $width;
        vertical-align: middle
      }

      span {
        margin-left: $width*0.5;
      }
    }

    .el-table {
      margin-top: $width*1.5;
    }
  }

  // 安排学生弹出框
  .arrange-student {
    .el-dialog {
      width: 680px;  

      .el-dialog__body {
        padding:$width $width*2;

        &>p {
          margin-top: $width;
          img {
            vertical-align: middle;
            width: $width;
            margin-right: $width;
          }
        }

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

        .el-select {
          margin-top: $width;
          margin-bottom: $width;
        }

        &>div:last-child {
          max-height: 400px;
          overflow-x: hidden;
          
          &>p {
            margin-top: $width;
          }
        }
      }

      .el-dialog__footer {
        .el-button:first-child {
          border: 1px solid #FF6040;
          color: #FF6040;
        }
        .el-button:nth-child(2) {
          border: 1px solid #7BB2FE;
          color: #7BB2FE;
        }
        .next {
          border: 1px solid #7BB2FE;
          color: #7BB2FE;
        }
      }
    }
  }
}
</style>
