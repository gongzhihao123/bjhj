<template>
  <div class="tScore">
    <!-- 头部 -->
    <header>
      <ul>
        <li>
          选课活动：
          <el-select v-model="activeId" placeholder="请选择">
            <el-option
              v-for="item in actives"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>          
        </li>
        <li>
          课程名称：
          <el-select v-model="courseactive" placeholder="请选择">
            <el-option
              v-for="item in courses"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>          
        </li>
      </ul>
      <div class="button-group">
        <el-button type="primary" @click="All">全选</el-button>
        <el-button type="primary" @click="allSeting">批量设置成绩</el-button>
        <el-button type="primary" @click="downAchievementTemplate">下载成绩模板</el-button>
        <el-upload
          class="upload"
          :action="actionimport"
          name="uploadFile"
          :show-file-list="false"
          :data="{activityId: activeId, lessonId: courseactive}"
          :on-success="successimport"
          :before-upload="handlePreview">
          <el-button type="success" :disabled="courseactive === ''">
            导入学生成绩
          </el-button>
          <!--<div slot="" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>        
      </div>
    </header>   

    <div class="content">
    <!--表格-->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        stripe
        class="display-table">
        <el-table-column
          label="序号"
          width="10%">
          <template scope="scope">
            <el-checkbox v-model="scope.row.choose"></el-checkbox>
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gradeName"
          label="年级"
          width="20%">
        </el-table-column>
        <el-table-column
          label="班级"
          width="20%"
          prop="className">
        </el-table-column>
        <el-table-column
          label="学生姓名"
          width="30%">
          <template scope="scope">
            <span>{{scope.row.userName}}</span>
            <img :src="scope.row.userFace" v-if="scope.row.userFace !== null"/>
            <img src="../../assets/images/default-student-photo.png" v-if="scope.row.userFace === null"/>
          </template>
        </el-table-column>        
        <el-table-column
          label="学生成绩"
          width="20%">
          <template scope="scope">
            <el-input v-model="scope.row.score" :maxlength="3" @blur="submit(scope.row.id, scope.row.score, scope.row.flag)" :autofocus="scope.row.flag"></el-input>
          </template>    
        </el-table-column>        
      </el-table>
    </div>

    <!--批量设置对话框-->
    <el-dialog
      title="批量设置成绩"
      :visible.sync="dialogVisible">
        <el-form :model="ruleform" ref="ruleform" :rules="rules" v-if="dialogVisible" class="setscore">
         <el-form-item label="设置成绩:" prop="score">
            <el-input v-model="ruleform.score" placeholder="请输入成绩" :autofocus="true"></el-input>
        </el-form-item>
        </el-form>       
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="submit">保 存</el-button>
      </span>
    </el-dialog>    
  </div>
</template>

<script>
import service from '../../utils/axios.js'
import { notice, success } from '../../api/index.js'
export default {
  name: 'tScore',
  data () {
    var setscore = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('成绩不能为空'))
      }
      if (!(/^\d{1,3}$/).test(value)) {
        return callback(new Error('请输入1 - 3位数字'))
      }
      if (value > 100 || value < 0) {
        callback(new Error('请输入0-100之间的整数！'))
      }
    }
    return {
      dialogVisible: false,
      loading: false,
      courseactive: '',
      actives: [],
      courses: [],
      activeId: '',
      tableData: [],
      score: '',
      studentIds: [],
      studentIdstr: '',
      flag: false,
      ruleform: {
        score: ''
      },
      rules: {
        score: [
         { validator: setscore, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取选课活动
    teacherActivityList () {
      service.get(`/tScoreController/teacherActivityList`)
      .then(res => {
        if (res.data.code === 1) {
          this.actives = res.data.result
          this.actives.length > 0 ? this.activeId = this.actives[0].id : this.activeId = ''
          // 获取课程名称
          this.teacherLessonList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },

    // 获取课程活动
    teacherLessonList () {
      this.courseactive = ''
      service.get(`/tScoreController/teacherLessonList?activityId=${this.activeId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.courses = res.data.result || []
          this.courses.length > 0 ? this.courseactive = this.courses[0].id : this.courseactive = ''
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },

    // 获取学生上课记录
    studentClassList () {
      if (this.courseactive === '') {
        return
      }
      this.loading = true
      setTimeout(() => {
        service.get(`/tScoreController/studentClassList?activityId=${this.activeId}&lessonId=${this.courseactive}`)
        .then(res => {
          if (res.data.code === 1) {
            if (res.data.result) {
              this.tableData = res.data.result.map(item => ({...item, choose: false, flag: false}))
            }
          } else {
            notice(this, res.data.message, 2000)
          }
          this.loading = false
        })
        .catch(res => {
          notice(this, res.data.message, 2000)
        })
        .finally(res => {
          this.loading = false
        })
      }, 500)
    },

    // 下载
    downAchievementTemplate () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/tScoreController/downAchievementTemplate?lessonId= ${this.courseactive}&activityId=${this.activeId}`
    },

    // 导入
    importAchievementTemplate () {
      const path = document.querySelector('#contextPath').value
      return `${path}/tScoreController/importAchievementTemplate`
    },

    // 导入成功
    successimport (res) {
      success(this, res.message, 3000)
      this.studentClassList()
    },

    // 导入前
    handlePreview (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'xls' || arr[arr.length - 1] === 'xlsx') {
          resolve()
        } else {
          notice(this, '请上传正确格式文件', 2000)
          reject()
        }
      })
    },

    // 批量设置
    allSeting () {
      this.ruleform.score = ''
      this.studentIds = []
      if (this.tableData.some(item => item.choose)) {
        this.tableData.forEach(item => {
          if (item.choose) {
            this.studentIds.push(item.id)
          }
        })
        this.studentIdstr = this.studentIds.join(',')
        this.dialogVisible = true
      } else {
        notice(this, '请选择学生', 3000)
      }
    },

    // 全选
    All () {
      if (this.tableData.some(item => !item.choose)) {
        this.tableData.map(item => {
          item.choose = true
        })
      } else {
        this.tableData.map(item => {
          item.choose = false
        })
      }
    },

    // 关闭
    handleClose () {},

    // 取消
    cancel () {
      this.dialogVisible = false
    },

    // 保存
    async submit (id, score, flag) {
      this.id = id
      this.score = score
      this.flag = flag
      // 没有已选学生
      if (!this.studentIdstr) {
        if (this.score === '') {
          notice(this, '分数不能为空！', 3000)
          this.flag = true
          return
        }
        if (!(/^\d{1,3}$/).test(this.score)) {
          notice(this, '请输入1 - 3位数字', 3000)
          this.flag = true
          return
        }
        if (this.score > 100 || this.score < 0) {
          notice(this, '请输入0-100之间的整数！', 3000)
          this.flag = true
          return
        }
        const { data } = await service.post('/tScoreController/batchSetAchievement', {
          studentIds: this.id,
          score: this.score
        })
        if (data.code !== 1) {
          notice(this, data.message, 2000)
        } else {
          success(this, data.message, 3000)
          this.studentClassList()
        }
      } else {
        // 存在已选学生
        if (this.ruleform.score === '') {
          return
        }``
        if (!(/^\d{1,3}$/).test(this.ruleform.score)) {
          return
        }
        if (this.ruleform.score > 100 || this.ruleform.score < 0) {
          return
        }
        const { data } = await service.post('/tScoreController/batchSetAchievement', {
          studentIds: this.studentIdstr,
          score: this.ruleform.score
        })
        if (data.code !== 1) {
          notice(this, data.message, 2000)
        } else {
          success(this, data.message, 3000)
          this.studentClassList()
        }
      }
      this.studentIdstr = ''
      this.studentIds = []
      this.dialogVisible = false
    }
  },
  created () {
    // 获取选课活动
    this.teacherActivityList()
  },
  computed: {
  // 导入
    actionimport () {
      const path = document.querySelector('#contextPath').value
      return `${path}/tScoreController/importAchievementTemplate`
    }
  },
  watch: {
    activeId () {
      this.teacherLessonList(this.activeId)
    },
    courseactive () {
      this.studentClassList(this.courseactive)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
.tScore {
  // 头部
  header{
    padding: $width*2;
    background: $white;
    border-radius: 4px;
    margin-bottom: 25px;

    &>ul {
      margin: 0px;
      padding: 0px;

      &>li {
        list-style-type: none;
        margin-bottom: 20px;

        &>.el-select{
          width: 360px;
          margin-left: $width;
        }
      }
    }
    &>.button-group {
      padding: 15px 0px;

      .el-button {
        float: left;
        span {
          color: $white;
        }
      }
      .el-button--primary {
        background: #6fa9fe;
        border: 1px solid #6fa9fe;
      }

      &>.upload {
        float: left;
        margin-left: 10px;
      }
    }
  }  

  // 内容区
  .content {
    margin-top: 20px;
    background: $white;
    padding: $width $width*2;    
    // 表格
    &>.el-table {
      margin-bottom: 10px;    
      border: none;
      .cell {
        text-align: center;
      }  
      &>.el-table__header-wrapper {

        &>table {
          width: 100% !important;

          &>thead {
            &>tr {
              &>th {
                background: #7bb2fe;
                &>.cell {
                  background: #7bb2fe;
                  color: #fff;
                  text-align: center;
                }
              }
            }
          }
        }

      }
      &>.el-table__body-wrapper {
        &>table, &>.el-table__empty-block {
          width: 100% !important;
          &>tbody {
            &>tr {
              &>td {
                &:first-child {
                  .cell {
                    span {
                      margin-left: 5%;
                    }
                  }
                }
                &:nth-child(4) {
                  .cell {
                    img {
                      width: 24px;
                      height: 24px;
                      display: block;
                      margin-left: 20px;
                      float: left;
                    }
                    span {
                      float: left;
                      margin-left: 36%;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }   
  }  

  .el-dialog__wrapper {
    .el-dialog {
      width: 480px;
      height: 260px;

      &>.el-dialog__body {
        padding-top: 15%;
        padding-left: 15%;
        &>.setscore {
          &>.el-form-item {
            &>.el-form-item__content {
              &>.el-input {
                width: 290px;
                height: 35px;

                i {
                  display: none;
                }
              }
              &>.el-form-item__error {
                margin-left: 20%;
              }
            }
          }
        }
      }

      &>.el-dialog__footer {
        position: absolute;
        bottom: 0px;
        right: 20%;
        &>.dialog-footer {
          &>.el-button {
            padding: 10px 35px;
            &:first-child {
              border: 1px solid #ff6040;
              color:#ff6040;
              &:hover {
                background: #ff6040;
                color: #fff;
              }
            }
            &:last-child {
              border: 1px solid #7bb2fe;
              color: #7bb2fe;
              &:hover {
                background: #7bb2fe;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }   
}

</style>
