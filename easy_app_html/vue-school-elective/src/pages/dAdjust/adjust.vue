<template>
  <div class="adjust">

    <header>
      <el-row>
        <el-col :span="12">
          选课活动：{{ name }}
        </el-col>
        <el-col :span="12">
          <el-button @click="aKey" type="success" v-if="logic === 2">一键安排学生</el-button>
          <el-button type="primary" :disabled="canPublish === 0" @click="publishResult">发布选课结果</el-button>
        </el-col>
      </el-row>
    </header>

    <main>
      <p>
        排序方式：
        <el-select v-model="value" @change="valueChange" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </p>

      <el-table
        :data="tableData"
        class="display-table"
        stripe
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="课程名称"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="授课教师"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="limitNum"
          label="人数上限"
          label-class-name="head"
          show-overflow-tooltip
          min-width="110">
        </el-table-column>
        <el-table-column
          label="上课时间"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
          <template scope="scope">
            <span> 星期{{ scope.row.week | num }}第{{ scope.row.section }}节课 </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="locationName"
          label="上课地点"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="countNum"
          label="课程人数"
          label-class-name="head"
          show-overflow-tooltip
          min-width="100">
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="150">
          <template scope="scope">
            <el-tooltip  effect="dark" :enterable="false" content="调整学生名单" placement="right">
              <el-button size="small" @click="adjustStudentList(scope.row, scope.$index)" type="primary"><i class="iconfont icon-adjust"></i></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" :enterable="false" content="取消开课" placement="right">
              <el-button size="small" @click="cancelClass(scope.row)" type="danger"><i class="iconfont icon-quxiao"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </main>

     <!-- 取消开课弹出框 -->
    <el-dialog
      class="cancel-class"
      title="取消开课"
      :visible.sync="cancelClassDialogVisible"
      size="tiny">
      <img src="../../assets/images/cancel-class.png" alt="">
      <p>取消开课后，课程中的学生将变成落选学生。<br>确定取消开课吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button :plain="true" type="danger" @click="cancelClassDialogVisible = false">取 消</el-button>
        <el-button :plain="true" type="primary" @click="cancelClassConfirm">确 定</el-button>
      </span>
    </el-dialog>  

    <!-- 一键安排弹出框 -->
    <el-dialog
      class="cancel-class"
      title="一键安排学生"
      :visible.sync="arrangeDialogVisible"
      size="tiny">
      <img src="../../assets/images/cancel-class.png" alt="">
      <p>重复点击一键安排按钮:对学生选课记录没有影响，但是会清除上一次安排的结果。<br>是否继续？</p>
      <span slot="footer" class="dialog-footer">
        <el-button :plain="true" type="danger" @click="arrangeDialogVisible = false">取 消</el-button>
        <el-button :plain="true" type="primary" @click="aKeyConfirm">确 定</el-button>
      </span>
    </el-dialog>  
    
    <!-- 安排学生弹出框 -->
    <el-dialog
      class="arrange-student"
      title="安排学生"
      :visible.sync="arrangeStudentDialogVisible"
      size="tiny">
      <el-row>
        <el-col :span="12">
          <span>{{ courseName }}</span>
          >
          <span>学生名单</span>
        </el-col>
        <el-col :span="12">
          <el-button type="success" @click="addStudentButton">添加学生</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="studentList"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="序号"
          min-width="80">
          <template scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gradeName"
          label="年级"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级"
          width="130">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="学生姓名"
          width="130">
        </el-table-column>
        <el-table-column
          label="操作"
          width="125">
          <template scope="scope">
            <el-button size="small" @click="del(scope.row)" type="danger"><i class="iconfont icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button :plain="true" type="danger" @click="close">关 闭</el-button>
      </span>
    </el-dialog>  

    <!-- 添加学生弹出框 -->
    <el-dialog
      class="add-student"
      title="添加学生"
      :visible.sync="addStudentDialogVisible"
      size="tiny">

      <div>

        <div class="add-student-left">
          <el-input
            placeholder="学生名称"
            v-model="filterText"
            @keyup.enter.native="search"
            >
          </el-input>

          <el-tree
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :highlight-current="true"
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
        </div>

        <div class="add-student-middle">
          <p>学生名单</p>
          <el-row>
            <el-col :span="6" v-for="(item, index) in defaultStudentList" :key="index" @click.native="selected(item)">
              <img style="width: 58px;height: 44px;" v-if="item.userFace" :src="item.userFace">
              <img class="img" v-else :src="img">
              <img v-if="item.show" class="selected" src="../../assets/images/has-selected-student.png">
              <el-popover
                placement="top"
                width="50"
                trigger="hover"
                :content="item.userName">
                <p slot="reference" v-if="item.userName.length > 3">{{ item.userName.slice(0, 3) + '...' }}</p>
              </el-popover>
              <p v-if="item.userName.length <= 3">{{ item.userName }}</p>
            </el-col>
          </el-row>
        </div>

        <div class="add-student-right">
          <p>已选学生</p>

          <el-row>
            <el-col :span="6" v-for="(item, index) in studentList" @click.native="delStudent(item, index)" :key="index">
              <img style="width: 58px;height: 44px;" v-if="item.userFace" :src="item.userFace">
              <img class="img" v-else :src="img">
              <el-popover
                placement="top"
                width="50"
                trigger="hover"
                :content="item.userName">
                <p slot="reference" v-if="item.userName.length > 3">{{ item.userName.slice(0, 3) + '...' }}</p>
              </el-popover>
              <p v-if="item.userName.length <= 3">{{ item.userName }}</p>
            </el-col>
          </el-row>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button :plain="true" type="danger" @click="addStudentDialogVisible = false">取 消</el-button>
        <el-button :plain="true" type="primary" @click="addStudentConfirm">确 认</el-button>
      </span>
    </el-dialog>  
  </div>
</template>

<script>
import service from '../../utils/axios'
import { notice, success } from '../../api/index.js'
import { mapGetters } from 'vuex'
import img from '../../assets/images/default-student-photo.png'
export default {
  name: 'adjust',
  data () {
    return {
      img: img,
      filterText: '',
      data: [
        {
          gradeName: '1年级',
          classList: [
            {
              gradeName: '1班'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'classList',
        label: 'className'
      },
      options: [
        { value: '1', label: '课程名称' },
        { value: '2', label: '课程人数 升序' },
        { value: '3', label: '课程人数 降序' }
      ],
      arrangeDialogVisible: false,
      arrangeStudentDialogVisible: false,
      addStudentDialogVisible: false,
      cancelClassDialogVisible: false,
      value: '1',
      tableData: [],
      studentList: [],
      defaultStudentList: [],
      activityId: '',
      name: '',
      logic: '',
      typeId: 3,
      cancelClassId: '',
      courseName: '',
      lessonId: '',
      canPublish: '',
      arrangeAll: false
    }
  },
  methods: {
    valueChange () {
      this.getAllChoiceLessonByActuvity()
    },
    // 搜索
    search () {
      service.get(`/dAdjustController/getActivityStudentList?activityId=${this.activityId}&lessonId=${this.lessonId}&name=${this.filterText}`)
      .then(res => {
        if (res.data.code === 1) {
          this.defaultStudentList = (res.data.result || []).map(item => ({...item, show: false}))
          if (this.defaultStudentList.length !== 0) {
            this.defaultStudentList.forEach((item, index) => {
              this.studentList.forEach((child) => {
                if (item.userId === child.userId) {
                  item.show = true
                }
              })
            })
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 发布选课结果
    publishResult () {
      service.post('/dAdjustController/publishResult', ({
        activityId: this.activityId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '发布结果成功', 1000)
          this.getAllChoiceLessonByActuvity()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 添加学生确认
    addStudentConfirm () {
      if (this.studentList.length === 0) {
        notice(this, '你还没有选择学生', 2000)
      } else {
        this.addStudentDialogVisible = false
        let json = []
        if (this.studentList.length !== 0) {
          this.studentList.forEach((item) => {
            if (item.gradeName) {
              json.push({ companyId: this.user.companyId, activityId: this.activityId, studentId: item.studentId, studentUserId: item.userId, lessonId: this.lessonId })
            } else {
              json.push({ companyId: this.user.companyId, activityId: this.activityId, studentId: item.id, studentUserId: item.userId, lessonId: this.lessonId })
            }
          })
        }
        service.post('/dAdjustController/saveActivityStudentBatch', ({
          activityId: this.activityId,
          json: JSON.stringify(json)
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '添加成功', 1000)
            this.getStudentList()
            this.getAllChoiceLessonByActuvity()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 去除学生
    delStudent (item, index) {
      // this.studentList.splice(index, 1)
      // if (this.defaultStudentList.length !== 0) {
      //   this.defaultStudentList.forEach((child, index) => {
      //     if (item.userId === child.userId) {
      //       child.show = false
      //     }
      //   })
      // }
    },
    // 选择学生
    selected (item) {
      let a = true
      let i = ''
      if (this.studentList.length !== 0) {
        this.studentList.forEach((child, index) => {
          if (item.userId === child.userId) {
            a = false
            i = index
          }
        })
      }
      if (!a) {
        this.studentList.splice(i, 1, item)
      } else {
        this.studentList.push(item)
      }
      if (this.defaultStudentList.length !== 0) {
        this.defaultStudentList.forEach((item, index) => {
          this.studentList.forEach((child) => {
            if (item.userId === child.userId) {
              item.show = true
            }
          })
        })
      }
    },
    // 关闭按钮
    close () {
      this.arrangeStudentDialogVisible = false
      this.getAllChoiceLessonByActuvity()
    },
    // 一键安排学生
    aKey () {
      this.arrangeDialogVisible = true
    },
    aKeyConfirm () {
      service.get(`/dAdjustController/adjustStudent?activityId=${this.activityId}`)
      .then(res => {
        this.arrangeDialogVisible = false
        if (res.data.code === 1) {
          success(this, '一键安排学生成功', 1000)
          this.getAllChoiceLessonByActuvity()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除学生
    del (val) {
      service.post('dAdjustController/deleteStudent', ({
        activityId: this.activityId,
        studentId: val.id,
        userId: val.userId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '删除成功', 1000)
          this.getStudentList()
          this.getAllChoiceLessonByActuvity()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 添加学生按钮
    addStudentButton () {
      this.addStudentDialogVisible = true
      this.defaultStudentList = []
    },
    // 点击树列表
    handleNodeClick (val, node) {
      if (val.gradeName) {
        service.get(`/dAdjustController/getActivityStudentList?activityId=${this.activityId}&gradeId=${val.gradeId}` +
                      `&classId=${val.classId}&lessonId=${this.lessonId}`)
        .then(res => {
          if (res.data.code === 1) {
            this.defaultStudentList = (res.data.result || []).map(item => ({...item, show: false}))
            if (this.defaultStudentList.length !== 0) {
              this.defaultStudentList.forEach((item, index) => {
                this.studentList.forEach((child) => {
                  if (item.userId === child.userId) {
                    item.show = true
                  }
                })
              })
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 获取树列表
    getData () {
      service.get(`/dAdjustController/getLessonClassList?lessonId=${this.lessonId}`)
      .then(res => {
        if (res.data.code === 1) {
          let arr = []
          res.data.result.forEach((child) => {
            var flag = false
            var grade
            arr.forEach((parent) => {
              if (child.gradeId === parent.gradeId) {
                flag = true
                grade = parent
              }
            })
            if (!flag) {
              grade = {
                gradeId: child.gradeId,
                className: child.gradeName,
                classList: []
              }
              arr.push(grade)
            }
            grade.classList.push(child)
          })
          this.data = arr
        }
      })
    },
    // 取消开课确定
    cancelClassConfirm (val) {
      service.post('/dAdjustController/cancelUpdateCourse', ({
        activityId: this.activityId,
        lessonId: this.cancelClassId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.cancelClassDialogVisible = false
          this.getAllChoiceLessonByActuvity()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 取消开课按钮
    cancelClass (item) {
      this.cancelClassDialogVisible = true
      this.cancelClassId = item.id
    },
    // 调整学生名单按钮
    adjustStudentList (item, index) {
      this.filterText = ''
      this.arrangeStudentDialogVisible = true
      this.courseName = item.name
      this.lessonId = item.id
      this.getStudentList()
      this.getData()
    },
    // 获取该课程下的所有已选学生
    getStudentList () {
      service.get(`/dAdjustController/getStudentList?activityId=${this.activityId}&lessonId=${this.lessonId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.studentList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取当前选课下的所有课程
    getAllChoiceLessonByActuvity () {
      service.get(`/dAdjustController/getAllChoiceLessonByActuvity?activityId=${this.activityId}&typeId=${this.value}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list
          let n = 0
          this.tableData.forEach((item) => {
            if (item.countNum !== 0) {
              n = 1
            }
          })
          if (n === 1) {
            this.arrangeAll = true
          } else {
            this.arrangeAll = false
          }
          this.canPublish = res.data.result.state
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
          // （logic : 1-先到先得、2-优先级）
          this.logic = (res.data.result || []).filter(item => item.activityState === 1)[0].logic
          this.name = JSON.parse(localStorage.SEMESTERLIST).filter(item => item.state === 1)[0].semesterName + '  ' + res.data.result.filter(item => item.activityState === 1)[0].name
          this.getAllChoiceLessonByActuvity()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.className.indexOf(value) !== -1
    }
  },
  computed: {
    ...mapGetters([
      'semesterList',
      'user'
    ])
  },
  watch: {
    addStudentDialogVisible () {
      if (this.addStudentDialogVisible === false) {
        this.getStudentList()
      }
    }
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
.adjust {
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
      .el-select {
        width: 300px;
        margin-left: $width;
      }
    }

    .el-table {
      margin-top: $width;
    }
  }

  // 取消开课弹出框
  .cancel-class {
    .el-dialog {
      width: 480px;

      .el-dialog__body {
        text-align: center;

        p {
          margin: $width;
        }
      }

      .el-dialog__footer {
        .el-button:first-child {
          border: 1px solid #FF6040;
          color: #FF6040;
        }
        .el-button:last-child {
          border: 1px solid #7BB2FE;
          color: #7BB2FE;
        }
      }
    }
  }

  // 安排学生弹出框
  .arrange-student {

    .el-dialog {
      width: 680px;  

      .el-dialog__body {
        padding:$width $width*2;

        .el-row {
          .el-col:last-child {
            text-align: right;
            .el-button{
              margin-top: -$width;
            }
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
      }

      .el-dialog__footer {
        .el-button:first-child{
          border: 1px solid #FF6040;
          color: #FF6040;
        }
      }
    }
  }

  // 添加学生弹出框
  .add-student {
    .el-dialog {
      width: 960px;

      .el-dialog__body {
        padding:$width*2;

        &>div {
          border: 1px solid #bbb;
          border-radius: 4px;
          display: flex;

          .el-row {
            height: 416px;
            overflow-x: hidden;

            .el-col {
              padding-left: $width*0.6;
              margin-top: $width;
              position: relative;

              

              .selected {
                position: absolute;
                right: $width*0.7;
                top: $width*1.1;
              }

              p {
                padding-left: $width*0.4;
              }
            }
          }

          .add-student-left {
            height: 458px;
            overflow-x: hidden;
            width: 160px;
            border-right: 1px solid #bbb;
            padding: $width;

            .el-tree {
              border: 0;
              margin-top: $width;
            }
          }

          .add-student-middle {
            width: 330px;
            border-right: 1px solid #bbb;
            img {
              cursor: pointer;
            }
            &>p {
              line-height: $width*2;
              padding-left: $width;
              background: #E5E5E5;
              border-bottom: 1px solid #bbb;
            }

          }

          .add-student-right {
            width: 346px;

            &>p {
              line-height: $width*2;
              padding-left: $width;
              background: #E5E5E5;
              border-bottom: 1px solid #bbb;
            }
          }

          .img {
            // width: 58px;
            // height: 44px;
          }
        }
      }

      .el-dialog__footer {
        .el-button:first-child {
          border: 1px solid #FF6040;
          color: #FF6040;
        }
        .el-button:last-child {
          border: 1px solid #7BB2FE;
          color: #7BB2FE;
        }
      }
    }
  }
}
</style>
