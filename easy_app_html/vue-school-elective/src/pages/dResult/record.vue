<template>
  <div class="record">
    
    <main>
      <div class="main-left">
        <el-input
            placeholder="学生姓名"
            v-model="filterText">
          </el-input>

          <el-tree
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            accordion
            :highlight-current="true"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
      </div>

      <div class="main-right">
        <p>
          学生选课记录：
        </p>

        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="activityName"
            label="选课活动"
            min-width="95">
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="课程类别"
            min-width="95">
          </el-table-column>
          <el-table-column
            prop="lessonName"
            label="课程名称"
            min-width="95">
          </el-table-column>
          <el-table-column
            prop="score"
            min-width="95"
            label="学生成绩">
          </el-table-column>
        </el-table>
      </div>
    </main>
  </div>
</template>

<script>
import service from '../../utils/axios'
import { notice } from '../../api/index'
import { mapGetters } from 'vuex'
// import { TreeMenu } from '../../api/tree'
export default {
  name: 'record',
  data () {
    return {
      tableData: [],
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      semesterId: '',
      sectionId: '',
      studentId: '',
      activityId: ''
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 点击树列表
    handleNodeClick (val) {
      if (val.studentName) {
        this.getStudentResult(val)
      }
    },
    // 获取当前学期
    getSemesterId () {
      service.get('/common/selectSemesterList')
      .then(res => {
        if (res.data.code === 1) {
          this.semesterId = (res.data.result || []).filter(item => item.state === 1)[0].semesterId
          this.getSectionId()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取当前学段
    getSectionId () {
      service.get(`/common/selectGradeSimpleCourse?teacherId=${this.user.id}&semesterId=${this.semesterId}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result.length !== 0 && res.data.result[0].courseList.length !== 0) {
            this.sectionId = res.data.result[0].courseList[0].sectionId
          }
          this.getClassSituation()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学生列表
    getClassSituation () {
      service.get(`/dSituationController/getClassStudentList`)
      .then(res => {
        if (res.data.code === 1) {
          let data = res.data.result
          if (!data.grades) return
          data.students.forEach((student) => {
            student.label = student.studentName
            data.classs.forEach((clazz) => {
              if (student.classId === clazz.id) {
                if (!clazz.children) {
                  let arr = []
                  clazz.children = arr
                }
                clazz.children.push(student)
              }
            })
          })
          data.classs.forEach((clazz) => {
            clazz.id = clazz.classId
            clazz.label = clazz.className
            data.grades.forEach((grade) => {
              if (clazz.gradeId === grade.id) {
                if (!grade.children) {
                  let arr = []
                  grade.children = arr
                }
                grade.children.push(clazz)
              }
            })
          })
          data.grades.forEach((grade) => {
            grade.id = grade.id
            grade.label = grade.name
            data.sections.forEach((section) => {
              section.id = section.id
              section.label = section.name
              if (grade.sectionId === section.id) {
                if (!section.children) {
                  let arr = []
                  section.children = arr
                }
                section.children.push(grade)
              }
            })
          })
          this.data = data.sections
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学生选课记录
    getStudentResult (val) {
      service.get(`/dSituationController/getStudentResult?studentId=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取当前选课活动
    getActivityList () {
      service.get('/dActivityController/getActivityList')
      .then(res => {
        if (res.data.code === 1) {
          this.activityId = (res.data.result || []).filter(item => item.activityState === 1)[0].id
          this.getClassSituation()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getClassSituation()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';

.record {
  margin: $width;
  padding: $width*2;
  background: $white;

  main {
    border: 1px solid #bbb;
    border-radius: 4px;
    display: flex;

    .main-left {
      width: 260px;
      box-sizing: border-box;
      border-right: 1px solid #bbb;
      padding: $width;
      max-height: 750px;
      overflow-x: hidden;

      .el-input__ {
        border-radius: 4px;
      }

      .el-tree {
        margin-top: $width;
        border: 0;
      }
    }

    .main-right {
      flex: 1;
      padding: $width;
      max-height: 750px;
      overflow-x: hidden;
      &>p {
        border-left: 2px solid #7BB2FE;
        color: #7BB2FE;
        padding-left: $width;
        margin-bottom: $width;
      }

      .el-table {
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
  }
}
</style>
