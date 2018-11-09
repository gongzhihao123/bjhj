<template>
  <div class="tRecruit">
    <p v-if="noticeflag"><img src="../../assets/images/notice.png">提示：本次选课逻辑为先到先得，不用录取学生。</p>
    <!-- 头部 -->
    <header>
      <p>{{activeName}}</p>
      课程名称：
      <el-select v-model="value" placeholder="请选择" @change="getActivityStudentChoiceList(1)">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </header>  
    <!--具体信息-->
    <div class="content-box">
      <el-tabs v-model="activename" @tab-click="handleClick">
        <el-tab-pane label="全部学生" name="0">
          <p>按历史报名情况筛选学生:</p>
          <ul>
            <li>
              <span>选课活动:</span>
              <el-select v-model="activeId" placeholder="请选择" @change="getAllChoiceLessonByActuvity">
                <el-option
                  v-for="item in actives"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>              
            </li>
            <li>
              <span>课程名称:</span>
              <el-select v-model="semvalue" placeholder="请选择" @change="getActivityStudentChoiceList">
                <el-option
                  v-for="item in semoptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </li>
          </ul> 

          <div class="table-box">
            <p>已录取：<span v-if="countNum !== ''">{{countNum}}人</span></p>  
            <el-input
              placeholder="学生姓名"
              icon="search"
              v-model="name"
              :on-icon-click="handleIconClick"
              @keyup.enter.native="handleIconClick">
            </el-input>            
          </div>
            <!--表格-->
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              class="display-table"
              v-loading="loading">
              <el-table-column
                type="index"
                label="序号"
                width="10%">
              </el-table-column>
              <el-table-column
                prop="gradeName"
                label="年级"
                width="15%">
              </el-table-column>
              <el-table-column
                label="班级"
                prop="className"
                width="15%">
              </el-table-column>
              <el-table-column
                prop="userName"
                label="学生姓名"
                width="20%">
              </el-table-column> 
              <el-table-column
                prop="wishLevel"
                label="志愿顺序"
                width="20%">
              </el-table-column> 
              <el-table-column
                label="状态"
                width="10%">
                <template scope="scope">
                  <span v-if="scope.row.state === 3">未录取</span>
                  <span v-if="scope.row.state !== 3">已录取</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="10%">
                <template scope="scope">
                  <ul>
                    <li>
                      <div class="img-box" @mouseover="scope.row.flag = true" @mouseout="scope.row.flag = false">
                        <el-tooltip class="item" effect="dark" content="录取" placement="right" v-if="scope.row.state === 3">
                            <img src="../../assets/icons/takeuse.png" v-if="!scope.row.flag">
                            <img src="../../assets/icons/takeuse-active.png" v-if="scope.row.flag" @click="enrollStudent(scope.row)">
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="取消录取" placement="right" v-if="scope.row.state !== 3">
                            <img src="../../assets/icons/cancel.png" @click="cancelEnrollStudent(scope.row)">
                        </el-tooltip>
                      </div>                                            
                    </li>
                  </ul>
                </template>
              </el-table-column>        
            </el-table>                           
        </el-tab-pane>

        <el-tab-pane label="已录取学生" name="1">
          <p>按历史报名情况筛选学生:</p>
          <ul>
            <li>
              <span>选课活动:</span>
              <el-select v-model="activeId" placeholder="请选择" @change="getAllChoiceLessonByActuvity">
                <el-option
                  v-for="item in actives"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>              
            </li>
            <li>
              <span>课程名称:</span>
              <el-select v-model="semvalue" placeholder="请选择" @change="getActivityStudentChoiceList">
                <el-option
                  v-for="item in semoptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </li>
          </ul> 

          <div class="table-box">
            <p>已录取：<span v-if="countNum !== ''">{{countNum}}人</span></p>  
            <el-input
              placeholder="学生姓名"
              icon="search"
              v-model="name"
              :on-icon-click="handleIconClick">
            </el-input>            
          </div>
            <!--表格-->
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              class="display-table"
              v-loading="loading">
              <el-table-column
                type="index"
                label="序号"
                width="10%">
              </el-table-column>
              <el-table-column
                prop="gradeName"
                label="年级"
                width="15%">
              </el-table-column>
              <el-table-column
                label="班级"
                prop="className"
                width="15%">
              </el-table-column>
              <el-table-column
                prop="userName"
                label="学生姓名"
                width="20%">
              </el-table-column> 
              <el-table-column
                prop="wishLevel"
                label="志愿顺序"
                width="20%">
              </el-table-column> 
              <el-table-column
                label="状态"
                width="10%">
                <template scope="scope">
                  <span v-if="scope.row.state === 3">未录取</span>
                  <span v-if="scope.row.state !== 3">已录取</span>
                </template>
              </el-table-column>                                        
              <el-table-column
                label="操作"
                width="10%">
                <template scope="scope">
                  <ul>
                    <li><img src="../../assets/icons/takeuse.png" v-if="scope.row.state === 3"></li>
                  </ul>
                </template>
              </el-table-column>        
            </el-table>    
        </el-tab-pane>
      </el-tabs>      
    </div>      
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notice, success } from '../../api/index.js'
import service from '../../utils/axios'
export default {
  name: 'tRecruit',
  data () {
    return {
      options: [],
      semoptions: [],
      actives: [],
      value: '',
      countNum: '',
      isActive: true,
      semvalue: '',
      name: '',
      activeName: '',
      activeId: '',
      ActiveId: '',
      activename: '0',
      tableData: [],
      loading: false,
      semesterId: '',
      sectionId: '',
      types: 0,
      classIds: '',
      state: '',
      flag: false,
      flags: false,
      timeState: '',
      teacherPick: false,
      noticeflag: false
    }
  },
  methods: {
    // 获取当前激活的活动名称
    getActivityList () {
      service.get(`tLessonController/getAllActivity`)
      .then(res => {
        if (res.data.code === 1) {
          this.actives = res.data.result
          this.actives.forEach(item => {
            if (item.activityState === 1) {
              this.activeName = item.name
              this.timeState = item.timeState
              // 激活的活动id
              this.ActiveId = item.id
              this.teacherPick = item.teacherPick
              if (!this.teacherPick) {
                notice(this, '该活动下教师不能录取学生！', 3000)
                this.flag = true
              }
              if (item.logic === 1) {
                this.noticeflag = true
                this.flag = true
              }
            }
          })
          if (this.flag) {
            return
          }
          // 获取开设的课程列表
          this.getLessonByTeacherList()
          // 获取学生的历史课程
          // this.getAllChoiceLessonByActuvity()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },
    // 获取已选课程名称
    getLessonByTeacherList () {
      if (this.flag) {
        return
      }
      service.get(`tSituationController/getLessonByTeacherList?activityId=${this.ActiveId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.options = res.data.result || []
          // this.value = this.options[0].id
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },
    // 获取学生的历史课程
    getAllChoiceLessonByActuvity () {
      this.countNum = ''
      this.flags = true
      this.semvalue = ''
      if (this.flag) {
        return
      }
      service.get(`tLessonController/getAllChoiceLessonByActuvity?activityId=${this.activeId}&typeId=1`)
      .then(res => {
        if (res.data.code === 1) {
          this.semoptions = res.data.result.list
          this.getActivityStudentChoiceList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },
    // 搜索
    handleIconClick () {
      this.countNum = ''
      if (this.flag) {
        return
      }
      this.getActivityStudentChoiceList(this.name)
    },
    // tab标签切换事件
    handleClick () {
      this.name = ''
      this.countNum = ''
      if (this.value === '') {
        return
      } else {
        this.getActivityStudentChoiceList(this.activename)
      }
    },
    // 获取当前选课下的录取学生
    getActivityStudentChoiceList (a) {
      if (this.value === '') {
        return
      }
      if (a === 1) {
        this.activename = '0'
      }
      this.countNum = ''
      if (this.flag) {
        return
      }
      if (this.activeId === '' && this.semvalue === '' && this.value !== '') {
        this.flags = false
      }
      if (this.flags) {
        // 历史
        this.types = 1
      } else {
        // 当前
        this.types = 0
      }
      if (this.name.length === 0) {
        this.name = ''
      }
      this.loading = true
      setTimeout(() => {
        service.get(`tLessonController/getActivityStudentChoiceList?activityId=${this.ActiveId}&lessonId=${this.value}&activityIdnew=${this.activeId}&lessonIdnew=${this.semvalue}&typeId=${this.activename}&types=${this.types}&classIds=${this.classIds}&name=${this.name}`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = (res.data.result ? res.data.result : []).map(item => ({...item, flag: false}))
            if (this.tableData.length !== 0) {
              this.countNum = this.tableData[0].countNum
            }
            this.name = ''
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

    // 录取学生
    async enrollStudent (row) {
      if (this.timeState === 3 || this.timeState === 5) {
        if (this.user.userRole.includes('headerteacher')) {
          // 班主任
          this.state = 1
        } else if (this.user.userRole.includes('teacher')) {
          // 任课教师
          this.state = 2
        }
        const { data } = await service.post('/tLessonController/enrollStudent', {
          courseId: row.id,
          lessonId: this.value,
          state: this.state,
          studentId: row.studentId,
          activityId: this.ActiveId
        })
        if (data.code !== 1) {
          notice(this, data.message, 2000)
        } else {
          success(this, data.message, 3000)
          this.getActivityStudentChoiceList()
        }
      } else {
        notice(this, '请在选课结束之后进行该操作！', 3000)
        return
      }
    },
    // 取消录取
    async cancelEnrollStudent (row) {
      if (this.timeState === 3 || this.timeState === 5) {
        const { data } = await service.post('tLessonController/cancelEnrollStudent', {
          courseId: row.id,
          activityId: this.ActiveId,
          studentId: row.studentId
        })
        if (data.code !== 1) {
          notice(this, data.message, 2000)
        } else {
          success(this, data.message, 3000)
          this.getActivityStudentChoiceList()
        }
      } else {
        notice(this, '请在选课结束之后进行该操作！', 3000)
        return
      }
    }
  },
  created () {
    // 获取当前激活活动的名称
    this.getActivityList()
    this.classIds = (this.user.htClass ? this.user.htClass : []).map(n => n.id).join(',')
  },
  computed: {
    ...mapGetters([
      'user',
      'semesterList'
    ])
  },
  watch: {
    value () {
      // this.flags = false
      this.name = ''
      this.semvalue = ''
      this.activeId = ''
    }
    // activeId () {
    //   this.name = ''
    //   this.flags = true
    // },
    // semvalue () {
    //   this.flags = true
    //   this.name = ''
    // }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
.tRecruit {
  // 头部

  &>p {
    line-height: 40px;
    margin-bottom: 20px;
    height: 40px;
    color: #666;

    &>img {
      margin-right: 10px;
      vertical-align: middle;
    }
  }

  header{
    padding: $width*2;
    background: $white;
    border-radius: 4px;
    margin-bottom: 25px;

    &>p {
      margin-bottom: 20px;
    }

    &>.el-select{
      width: 360px;
      margin-left: $width;
    }
  }

  // 录取学生信息表
  .content-box {
    margin-top: 20px;
    background: $white;
    padding: $width $width*2;

    &>.el-tabs {
      &>.el-tabs__content {
        &>.el-tab-pane {
          &>p {
            margin-bottom: 20px;
          }

          &>ul {
            display: block;
            clear: both;
            overflow: hidden;

            li {
              float: left;
              list-style-type: none;
              margin-right: 60px;
              line-height: 40px;

              &>.el-select{
                width: 360px;
                margin-left: $width;
              }
            }
          }
          &>.table-box {
            display: block;
            clear: both;
            overflow: hidden;
            padding-top: 30px;

            &>p {
              float: left;
              line-height: 40px;
            }
            &>.el-input {
              float: right;
              width: 300px;
              height: 35px;
              &>.el-input__inner {

              }              
            }           
          }
          &>.el-table {
            margin-bottom: 10px; 
            margin-top: 20px;
            border: none;

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
                      }
                    }
                  }
                }
              }

            }
            &>.el-table__body-wrapper {
              &>table, &>.el-table__empty-block {
                width: 100% !important;
              }
              &>table {
                &>tr {
                  &>td {
                    &:last-child {
                      .cell {
                        ul {
                          li {
                            line-height: 40px;
                            &>.img-box {
                              width: 24px;
                              height: 24px;
                            }
                          }
                        }
                      }
                    }
                    .cell {
                      &:first-child {
                        text-align: center;
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
  }
}
</style>
