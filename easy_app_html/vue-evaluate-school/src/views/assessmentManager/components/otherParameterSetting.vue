<template>
  <div id="other-parameter-setting">
    <p class="add-button">
      <el-button @click="add" type="primary" icon="el-icon-plus"><i class="el-icon-plus"></i>&nbsp;新增</el-button>
    </p>

    <!-- 测评方式列表 -->
    <!-- 头部 -->
    <el-row>
      <el-col v-for="(item, index) in listTitle" :key="index" :span="item.num">{{ item.name }}</el-col>
    </el-row>
    <!-- 主体 -->
    <draggable :list="listBody" element="div" :options="{'disabled': canMove, animation: 150}" @end="onMove">
      <transition-group name="slide-left" mode="out-in">
        <el-row class="list-body" v-for="(item, index) in listBody" :key="index">
        
          <el-col :span="1">{{index + 1}}</el-col>
          
          <!-- 被测评人 -->
          <el-col :span="4" class="by-assessment-people">
            <div class="by-assessment-people-one" v-if="item.show" @click="byAssessmentPeopleDialogVisible = true">
              <span v-for="(child, i) in hasSelectedByAssessment" :key="i">{{child.userName}}、</span>
            </div>
            <span v-else>
               <el-popover
                placement="top"
                width="200"
                v-if="item.usersContent.length >= 10" 
                trigger="hover"
                :content="item.usersContent">
                <span slot="reference">{{item.usersContent.slice(0, 10) + '...'}}</span>
              </el-popover>
              <span v-if="item.usersContent.length < 10">{{ item.usersContent }}</span>
            </span>
          </el-col>

          <!-- 测评方式 -->
          <el-col :span="4">
            <el-select v-if="item.show" v-model="assessmentWayValue" placeholder="请选择">
              <el-option
                v-for="item in assessmentWayOption"
                :key="item.id"
                :label="item.modeName"
                :value="item.id">
              </el-option>
            </el-select>
            <span v-else>
              <el-popover
                placement="top"
                width="200"
                v-if="item.modeName.length >= 14" 
                trigger="hover"
                :content="item.modeName">
                <span slot="reference">{{item.modeName.slice(0, 14) + '...'}}</span>
              </el-popover>
              <span v-if="item.modeName.length < 14" >{{ item.modeName }}</span>
            </span>
          </el-col>
          
          <!-- 权重 -->
          <el-col :span="2" class="percent">
            <el-input v-if="item.show" v-model="weight" :min="0" type="number"></el-input>
            <span v-else>{{ item.weight }}</span>
          </el-col>
          
          <!-- 测评人 -->
          <el-col :span="5" class="by-assessment-people">
            <div class="by-assessment-people-two" v-if="item.show" @click="chooseTypeDialogVisible = true">
              <span v-for="(child, i) in hasSelectedAssessment" :key="i">{{ child.userName }}、</span>
            </div>
            <span v-else>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                v-if="item.teachersContent.length >= 10"
                :content="item.teachersContent">
                <span slot="reference">{{item.teachersContent.slice(0, 10) + '...'}}</span>
              </el-popover>
              <span v-if="item.teachersContent.length < 10">{{ item.teachersContent }}</span>
            </span>
          </el-col>

          <!-- 测评表 -->
          <el-col :span="4">
            <el-select v-if="item.show" v-model="assessmentTableValue" placeholder="请选择">
              <el-option
                v-for="item in assessmentTableOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span v-else>
              <el-popover
                placement="top"
                width="200"
                v-if="item.tableName.length >= 13" 
                trigger="hover"
                :content="item.tableName">
                <span slot="reference">{{item.tableName.slice(0, 13) + '...'}}</span>
              </el-popover>
              <span v-if="item.tableName.length < 13" >{{ item.tableName }}</span>
            </span>
          </el-col>

          <el-col :span="4">
            <el-button v-if="!item.show" type="primary" icon="edit" @click="edit(item)">编辑</el-button>
            <el-button v-else type="success" @click="complete(item)"><i class="el-icon-check"></i>完成</el-button> 
            <el-button type="danger" @click="del(item, index)">删除</el-button>
            <img @mousedown="moveDown(item, index)" src="../../../assets/images/drag.png" style="cursor: move"  @mouseenter="canMove = false" @mouseleave="canMove = true">
          </el-col>
        </el-row>
      </transition-group>
    </draggable>

    <!-- 底部按钮组 -->
    <div class="button-group">
      <el-button size="large" @click="cancel">取消</el-button>
      <el-button size="large" @click="beforeStep">上一步</el-button>
      <el-button size="large" @click="save">保存</el-button>
      <el-button size="large" @click="submit"  type="primary">提交审核</el-button>
      <el-button size="large" @click="check" type="success">检查</el-button>
    </div>

    <!-- 设置被测评人 -->
    <el-dialog
      title="设置被测评人"
      class="by-assessment-people-dialogVisible"
      v-model="byAssessmentPeopleDialogVisible"
      size="tiny">
      <div>
        <div class="left">
          <p>选择人员</p>
          <el-input
            placeholder="请输入关键字"
            v-model="filterText">
          </el-input>

          <el-tree
            class="filter-tree"
            show-checkbox
            :data="byAssessmentList"
            :props="defaultProps"
            node-key="userId"
            default-expand-all
            :filter-node-method="filterNode"
            @check-change="selectByAssessment"
            ref="byAssessmentList">
          </el-tree>
        </div>
        <div class="middle">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="right">
          <p>已选择人员:{{hasSelectedByAssessment.length}}人<span @click="clearByAssessment">清空</span></p>
          <p class="right-list" v-for="(item, index) in hasSelectedByAssessment" :key="index">
            <span>{{ item.userName }}</span>
            <i @click="delHasSelectedByAssessment(item, index)">X</i>
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="byAssessmentPeopleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="byAssessmentPeopleDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置测评人 -->
    <el-dialog
      :title="assessmentTitle"
      class="by-assessment-people-dialogVisible"
      v-model="assessmentPeopleDialogVisible"
      size="tiny">
      <div>
        <div class="left">
          <p>{{ people }}</p>
          
          <div class="teachers" v-if="chooseTypeValue === 1">
            <el-input
              placeholder="请输入关键字"
              v-model="assessmentTeacherValue">
            </el-input>

            <el-tree
              v-if="chooseTypeValue === 1"
              class="filter-tree"
              show-checkbox
              :data="assessmentTeacherList"
              :props="defaultPropsOther"
              node-key="userId"
              default-expand-all
              :filter-node-method="filterNode"
              @check-change="selectAssessmentTeacher"
              ref="assessmentTeacherList">
            </el-tree>
          </div>

          <div class="parents-students" v-if="chooseTypeValue === 2 || chooseTypeValue === 3">
            <el-input
              placeholder="请输入关键字"
              v-model="assessmentStudentValue">
            </el-input>

            <el-tree
              v-if="chooseTypeValue === 2 || chooseTypeValue === 3"
              class="filter-tree"
              show-checkbox
              :data="assessmentStudentList"
              :props="defaultPropsOther"
              node-key="id"
              default-expand-all
              :filter-node-method="filterNode"
              @check-change="selectAssessmentStudent"
              ref="assessmentStudentList">
            </el-tree>
          </div>
        </div>
        <div class="middle">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="right">
          <p>已{{ people }}:{{hasSelectedAssessment.length}}<span @click="clearAssessment">清空</span></p>
          <p class="right-list" v-for="(item, index) in hasSelectedAssessment" :key="index">
            <span v-if="chooseTypeValue === 1">{{ item.userName }}</span>
            <span v-else>{{ item.userName }}</span>
            <i @click="delHasSelectedAssessment(item, index)">X</i>
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assessmentPeopleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assessmentPeopleDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 选择测评人类型 -->
    <el-dialog
      title="选择测评人类型"
      class="check-dialogVisible"
      v-model="chooseTypeDialogVisible"
      size="tiny">
      <el-radio-group v-model="chooseTypeValue" @change="typeValueChange">
        <el-radio :label="1">教师</el-radio>
        <el-radio :label="3">家长</el-radio>
        <el-radio :label="2">学生</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseTypeConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 检查弹出框 -->
    <el-dialog
      title="检查"
      class="choose-type-dialogVisible"
      v-model="checkDialogVisible"
      size="tiny">
      <el-row>
          <el-col :span="12">
            被测评人
          </el-col>
          <el-col :span="12">
            权重
          </el-col>
        </el-row>
      <div class="check-list">
        <el-row v-for="(item, index) in checkList" :key="index">
          <el-col :span="12">
            {{ item.userName }}
          </el-col>
          <el-col :span="12">
            {{ item.weight }}
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="large" @click="checkall">确 定</el-button>
      </span>
    </el-dialog>

  </div>
  
</template>

<script>
import { notice, success, error } from '../../../api/index'
import draggable from 'vuedraggable'
import querystring from 'querystring'
export default {
  name: 'otherParameterSetting',
  components: {
    draggable
  },
  data () {
    return {
      checkDialogVisible: false,
      assessmentTitle: '',
      filterText: '',
      evalId: '',
      weight: '',
      canMove: true,
      chooseTypeValue: 1,
      assessmentWayValue: '',
      assessmentWayOption: [],
      assessmentTableValue: '',
      assessmentTableOption: [],
      chooseTypeDialogVisible: false,
      byAssessmentPeopleDialogVisible: false,
      assessmentPeopleDialogVisible: false,
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      defaultPropsOther: {
        children: 'classWithUser',
        label: 'className'
      },
      byAssessmentList: [],
      assessmentTeacherValue: '',
      assessmentStudentValue: '',
      assessmentTeacherList: [],
      hasSelectedByAssessment: [],
      hasSelectedAssessment: [],
      listTitle: [
        {name: '编号', num: 1},
        {name: '被测评人', num: 4},
        {name: '测评方式', num: 4},
        {name: '权重', num: 2},
        {name: '测评人', num: 5},
        {name: '测评表', num: 4},
        {name: '操作', num: 4}
      ],
      checkList: [],
      listBody: [],
      sort: '',
      moveId: '',
      toId: '',
      teachersJson: '',
      studentJson: '',
      hasSelectType: '',
      listBodyCount: '',
      arrs: [],
      arrsTwo: [],
      people: '选择班级',
      submitted: false
    }
  },
  methods: {
    typeValueChange () {
      if (this.chooseTypeDialogVisible) {
        this.hasSelectedAssessment = []
      }
    },
    moveDown (item, index) {
      this.moveId = item.id
    },
    // 保存
    save () {
      if (this.listBody.length === 1) {
        if (this.listBody[0].show) {
          notice(this, '请先点击完成', 2000)
          return
        }
      }
      if (this.listBodyCount === 0) {
        notice(this, '请先添加测评组', 2000)
        return
      }
      this.$https.get(`/eval/checkGroup?evalId=${this.evalId}`)
      .then(res => {
        if (res.data.code === 1) {
          for (let i = 0; i < res.data.result.length; i++) {
            if (res.data.result[i].weight > 100) {
              notice(this, '当前权重有超过100的被测评人', 2000)
              return
            }
          }
          this.$router.push('/assessmentManager/index')
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    checkall () {
      this.checkDialogVisible = false
      if (this.submitted) {
        this.$https.get(`/eval/checkGroup?evalId=${this.evalId}`)
        .then(res => {
          if (res.data.code === 1) {
            for (let i = 0; i < res.data.result.length; i++) {
              if (res.data.result[i].weight > 100) {
                notice(this, '当前权重有超过100的被测评人', 2000)
                return
              }
            }
            this.$https.post('/eval/comfirmCheck', querystring.stringify({
              id: this.evalId
            }))
            .then(res => {
            })
            this.$router.push('/assessmentManager/index')
          } else if (res.data.code === -2) {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 提交审核
    async submit () {
      if (this.listBody.length === 1) {
        if (this.listBody[0].show) {
          notice(this, '请先点击完成', 2000)
          return
        }
      }
      if (this.listBodyCount === 0) {
        notice(this, '请先添加测评组', 2000)
        return
      }
      await this.check()
      this.submitted = true
    },
    // 检查
    check () {
      this.checkDialogVisible = true
      this.$https.get(`/eval/checkGroup?evalId=${this.evalId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.checkList = res.data.result
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 取消
    cancel () {
      if (sessionStorage.isEdit === '2') {
        this.$https.post(`/eval/deleteEval`, querystring.stringify({
          id: this.evalId
        }))
        .then(res => {
        })
      }
      this.$router.push('/assessmentManager/index')
    },
    // 上一步
    beforeStep () {
      this.$router.push({path: '/assessmentManager/assessmentWay', query: {id: JSON.stringify(this.evalId)}})
      this.$store.dispatch('active')
    },
    // 移动
    onMove () {
      this.toId = this.listBody.map(item => item.id).join(',')
      this.sortGroup()
    },
    // 测评组排序
    sortGroup () {
      this.$https.post('/eval/sortGroup', querystring.stringify({
        ids: this.toId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '排序成功', 1000)
        } else {
          notice(this, res.data.message, 2000)
        }
        this.getGroupList()
      })
    },
    // 新增按钮
    add () {
      this.getGroupList()
      setTimeout(() => {
        this.listBody.unshift({id: -1, show: false, usersContent: '请选择', modeName: '请选择', weight: 0, teachersContent: '请选择', tableName: '请选择'})
      }, 400)
    },
    // 编辑
    edit (item) {
      for (var i = 0; i < this.listBody.length; i++) {
        if (this.listBody[i].show === true) {
          return
        }
      }
      item.show = true
      this.chooseTypeValue = item.evaluatorType
      this.hasSelectType = item.evaluatorType
      if (item.id === -1) {
        item.show = true
        this.hasSelectedByAssessment = []
        this.assessmentWayValue = ''
        this.weight = 0
        this.hasSelectedAssessment = []
        this.assessmentTableValue = ''
      } else {
        this.hasSelectedByAssessment = item.users
        this.assessmentWayValue = item.modeId
        this.weight = item.weight
        if (item.teachers.length !== 0) {
          this.hasSelectedAssessment = item.teachers
        } else {
          this.hasSelectedAssessment = item.studentsList
        }
        this.assessmentTableValue = item.oldTableId
      }
    },
    // 完成
    complete (item) {
      if (this.hasSelectedByAssessment.length === 0) {
        notice(this, '请选择被测评人', 2000)
        return
      }
      if (this.hasSelectedByAssessment.length === this.hasSelectedAssessment.length === 1 && this.hasSelectedByAssessment[0] === this.hasSelectedAssessment[0]) {
        notice(this, '自己不能只测评自己，请再选择测评人', 2000)
        return
      }
      if (this.assessmentWayValue === '') {
        notice(this, '请选择测评方式', 2000)
        return
      }
      if (!(/^(0|[1-9]\d?|100)$/).test(this.weight)) {
        notice(this, '请填写权重(0 - 100)', 2000)
        return
      }
      if (this.hasSelectedAssessment.length === 0) {
        notice(this, '请选择测评人', 2000)
        return
      }
      if (this.assessmentTableValue === '') {
        notice(this, '请选择测评表', 2000)
        return
      }
      if (this.chooseTypeValue === 1) {
        this.teachersJson = JSON.stringify(this.hasSelectedAssessment)
      } else {
        let list = []
        this.hasSelectedAssessment.forEach((item, index) => {
          list.push({gradeId: item.gradeId, gradeName: item.gradeName, classId: item.id, className: item.name})
        })
        this.studentJson = JSON.stringify(list)
      }
      if (item.id === -1) {
        this.sort = 1
        this.addGroup()
      } else {
        this.updateGroup(item)
      }
      item.show = false
    },
    filterNode (value, data) {
      if (this.chooseTypeValue === 1) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      } else {
        if (!value) return true
        return data.className.indexOf(value) !== -1
      }
    },
    // 单个删除被测评人
    delHasSelectedByAssessment (item, index) {
      this.hasSelectedByAssessment.splice(index, 1)
      this.$refs.byAssessmentList.setCheckedNodes(this.hasSelectedByAssessment)
    },
    // 单个删除测评人
    delHasSelectedAssessment (item, index) {
      this.hasSelectedAssessment.splice(index, 1)
      if (this.chooseTypeValue === 1) {
        this.$refs.assessmentTeacherList.setCheckedNodes(this.hasSelectedAssessment)
      } else {
        this.$refs.assessmentStudentList.setCheckedNodes(this.hasSelectedAssessment)
      }
    },
    // 清空被测评人
    clearByAssessment () {
      this.hasSelectedByAssessment = []
      this.$refs.byAssessmentList.setCheckedNodes(this.hasSelectedByAssessment)
    },
    // 清空测评人
    clearAssessment () {
      this.hasSelectedAssessment = []
      if (this.chooseTypeValue === 1) {
        this.$refs.assessmentTeacherList.setCheckedNodes(this.hasSelectedByAssessment)
      } else {
        this.$refs.assessmentStudentList.setCheckedNodes(this.hasSelectedByAssessment)
      }
    },
    // 选择被测评人
    selectByAssessment (a, b) {
      if (a.deptId) {
        if (b === true) {
          if ((this.hasSelectedByAssessment.filter(item => item.userId === a.userId)).length === 0) {
            this.hasSelectedByAssessment.push({deptName: a.deptName, userId: a.userId, userName: a.name})
          }
        } else {
          var list = []
          this.hasSelectedByAssessment.forEach((m, index) => {
            if (m.userId !== a.userId) {
              list.push({deptName: m.deptName, userId: m.userId, userName: m.userName})
            }
          })
          this.hasSelectedByAssessment = list
        }
      }
    },
    // 选择测评人(教师)
    selectAssessmentTeacher (a, b) {
      if (a.deptId) {
        if (b === true) {
          if ((this.hasSelectedAssessment.filter(item => item.userId === a.userId)).length === 0) {
            this.hasSelectedAssessment.push({deptName: a.deptName, userId: a.userId, userName: a.name})
          }
        } else {
          var list = []
          this.hasSelectedAssessment.forEach((m, index) => {
            if (m.userId !== a.userId) {
              list.push(m)
            }
          })
          this.hasSelectedAssessment = list
        }
      }
    },
    // 选择测评人(学生、家长)
    selectAssessmentStudent (a, b) {
      if (a.gradeYear) {
        let gradeName = ''
        let gradeId = ''
        let sectionName = ''
        this.assessmentStudentList.forEach((item, index) => {
          if (item.classWithUser) {
            item.classWithUser.forEach((child) => {
              if (child.classWithUser) {
                child.classWithUser.forEach((n) => {
                  if (n.id === a.id) {
                    gradeName = child.className
                    gradeId = child.id
                    sectionName = item.name
                  }
                })
              }
            })
          }
        })
        if (b === true) {
          if ((this.hasSelectedAssessment.filter(item => item.id === a.id)).length === 0) {
            this.hasSelectedAssessment.push({gradeId: gradeId, gradeName: sectionName + gradeName, id: a.id, userName: gradeName + a.className, name: a.className})
          }
        } else {
          var list = []
          this.hasSelectedAssessment.forEach((m, index) => {
            if (m.id !== a.id) {
              list.push(m)
            }
          })
          this.hasSelectedAssessment = list
        }
      }
    },
    // 选择测评人方式确定
    chooseTypeConfirm () {
      if (this.chooseTypeValue === 1) {
        this.assessmentTitle = '设置测评教师'
        this.chooseTypeDialogVisible = false
        this.assessmentPeopleDialogVisible = true
        this.people = '选择人员'
      } else if (this.chooseTypeValue === 3) {
        this.assessmentTitle = '设置测评家长'
        this.chooseTypeDialogVisible = false
        this.assessmentPeopleDialogVisible = true
        this.people = '选择班级'
      } else if (this.chooseTypeValue === 2) {
        this.assessmentTitle = '设置测评学生'
        this.chooseTypeDialogVisible = false
        this.assessmentPeopleDialogVisible = true
        this.people = '选择班级'
      } else {
        notice(this, '请选择测评人类型', 2000)
      }
    },
    // 删除
    del (item, index) {
      if (item.id === -1) {
        this.listBody.splice(index, 1)
      } else {
        this.$confirm('确定删除该测评组?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$https.post('/eval/deleteGroup', querystring.stringify({
            id: item.id
          }))
          .then(res => {
            if (res.data.code === 1) {
              success(this, '删除成功', 1000)
              this.getGroupList()
            } else {
              notice(this, res.data.message, 2000)
            }
          })
        }).catch(() => {
        })
      }
    },
    // 获取测评组列表
    getGroupList () {
      this.$https.get(`/eval/getGroupList?evalId=${this.evalId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listBodyCount = [...res.data.result].length
          this.listBody = res.data.result.map(item => ({...item, show: false}))
          this.listBody.forEach((item, index) => {
            item.usersContent = []
            item.users.forEach((child) => {
              item.usersContent.push(child.userName)
            })
            item.usersContent = item.usersContent.join('、')
            item.teachersContent = []
            item.studentsList = []
            if (item.teachers.length !== 0) {
              item.teachers.forEach((child) => {
                item.teachersContent.push(child.userName)
              })
            } else {
              item.students.forEach((child) => {
                item.studentsList.push({gradeId: child.gradeId, gradeName: child.gradeName, id: child.classId, userName: child.gradeName + child.className, name: child.className})
                item.teachersContent.push(child.gradeName + child.className)
              })
            }
            item.teachersContent = item.teachersContent.join('、')
          })
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取测评方式
    getModeList () {
      this.$https.get(`/eval/getModeList?evalId=${this.evalId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.assessmentWayOption = res.data.result
        } else if (res.data.code === -2) {
          //
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取测评表
    getTableList () {
      this.$https.get(`/eval/getTableList`)
      .then(res => {
        if (res.data.code === 1) {
          this.assessmentTableOption = res.data.result
        } else if (res.data.code === -2) {
          //
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 修改测评组
    updateGroup (item) {
      this.$https.post('/eval/updateGroup', querystring.stringify({
        id: item.id,
        usersJson: JSON.stringify(this.hasSelectedByAssessment),
        modeId: this.assessmentWayValue,
        weight: this.weight,
        evaluatorType: this.chooseTypeValue,
        teachersJson: this.teachersJson,
        studentsJson: this.studentJson,
        tableId: this.assessmentTableValue
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '修改成功', 1000)
          this.getGroupList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 创建测评组
    addGroup () {
      this.$https.post('/eval/addGroup', querystring.stringify({
        evalId: this.evalId,
        usersJson: JSON.stringify(this.hasSelectedByAssessment),
        modeId: this.assessmentWayValue,
        weight: this.weight,
        evaluatorType: this.chooseTypeValue,
        teachersJson: this.teachersJson,
        studentsJson: this.studentJson,
        tableId: this.assessmentTableValue,
        sort: this.sort
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '创建成功', 1000)
          this.getGroupList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    sortArr (arr) {
      arr.forEach((item) => {
        if (item.userList) {
          item.userList = item.userList.concat(item.childDeptList)
          this.sortArr(item.userList)
        }
      })
      this.arrs = arr
    },
    sortArrTwo (arr) {
      arr.forEach((item) => {
        if (item.userList) {
          item.classWithUser = item.userList
          item.className = item.name
          item.classWithUser.forEach((child) => {
            child.className = child.name
          })
          this.sortArrTwo(item.userList)
        }
      })
      this.arrsTwo = arr
    },
    // 获取单位下的部门及人员
    getDeptAndUserByCompanyId () {
      this.$https.get('/common/getDeptAndUserByCompanyId')
      .then(res => {
        this.sortArr(res.data.result)
        this.sortArrTwo(res.data.result)
        this.byAssessmentList = [...this.arrs]
        this.assessmentTeacherList = [...this.arrsTwo]
      })
    },
    // 获取单位下的年级及班级
    getGradeAndClassByCompanyId () {
      this.$https.get('/common/getGradeAndClassByCompanyId')
      .then(res => {
        res.data.result.forEach((item, index) => {
          item.classWithUser = item.gradeDtoList
          item.className = item.name
          item.classWithUser.forEach((child) => {
            child.className = child.name
          })
        })
        this.assessmentStudentList = res.data.result
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.byAssessmentList.filter(val)
    },
    assessmentTeacherValue (val) {
      this.$refs.assessmentTeacherList.filter(val)
    },
    assessmentStudentValue (val) {
      this.$refs.assessmentStudentList.filter(val)
    },
    byAssessmentPeopleDialogVisible () {
      if (this.byAssessmentPeopleDialogVisible) {
        setTimeout(() => {
          this.$refs.byAssessmentList.setCheckedNodes(this.hasSelectedByAssessment)
        }, 200)
      }
    },
    assessmentPeopleDialogVisible () {
      if (this.assessmentPeopleDialogVisible) {
        setTimeout(() => {
          if (this.chooseTypeValue === 1) {
            this.$refs.assessmentTeacherList.setCheckedNodes(this.hasSelectedAssessment)
          } else {
            this.$refs.assessmentStudentList.setCheckedNodes(this.hasSelectedAssessment)
          }
        }, 200)
      }
    }
  },
  created () {
    this.evalId = JSON.parse(this.$route.query.id)
    this.getGroupList()
    this.getModeList()
    this.getTableList()
    this.getDeptAndUserByCompanyId()
    this.getGradeAndClassByCompanyId()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#other-parameter-setting{
  padding-bottom: 50px;

  &>.add-button{
    padding: $width;
    .el-button{
      font-size: 15px;
      span{
        margin-left: 0;
        i{
          margin-right: 10px;
        }
      }
    }
  }

  // 测评方式列表
  .el-row{
    text-align: center;
    line-height: 50px;
    font-size: 15px;
    color: #343434;
    border-bottom: 1px solid #ddd;

    .el-col:last-child{
      .el-button{
        padding: $width/2 $width/4;

        i{
          margin-right: 2px;
        }

        &:nth-child(2){
          padding: $width/2 15px;
        }
      }

      img{
        vertical-align: middle;
        margin-top: -2px;
        margin-left: 8px;
        cursor: pointer;
      }
    }
    // 被测评人样式
    .by-assessment-people{

      div{
        display: inline-block;
        background: #fff;
        padding: 0 10px;
        cursor: pointer;
        line-height: 40px;
        border: 1px solid #DADADA;
        border-radius: 2px; 
      }

      .by-assessment-people-one{
        width: 100px;
        height: 40px;
        overflow-x: hidden;
        vertical-align: middle;
        margin-top: -2px;
      }

      .by-assessment-people-two{
        width: 240px;
        height: 40px;
        overflow-x: hidden;
        vertical-align: middle;
        margin-top: -2px;
      }
    }
    // 权重样式
    .percent{
      .el-input{
        width: $width*4;
      }
    }
  }

  .list-body:hover{
    background: #f7f7f7;
  }

  .button-group{
    margin: $width*2 auto;
    width: 480px;
  }

  // 被测评人弹出框
  .by-assessment-people-dialogVisible{
    .el-dialog{
      width: 620px;

      .el-dialog__header{
        padding: $width;

        span{
          font-weight: normal;
        }
      }
      .el-dialog__body{
        padding: 0;
        font-size: 15px;

        &>div{
          padding:0 40px;
          display: flex;

          .left{
            padding: $width $width/2;
            box-sizing: border-box;
            width: 260px;
            height: 440px;
            overflow-x: hidden;
            border: 1px solid #E5E5E5;

            .el-input{
              margin: $width / 2 0;
            }

            .el-tree{
              border: 0;
            }
          }

          .middle{
            line-height: 440px;
            i{
              font-size: 28px;
              color: #C8C8C8;
            }
          }

          .right{
            padding: $width $width/2;
            box-sizing: border-box;
            width: 260px;
            height: 440px;
            overflow-x: hidden;
            border: 1px solid #E5E5E5;

            p:first-child{
              border-bottom: 1px solid #DBDBDB;
              padding-bottom: $width/2;

              span{
                float: right;
                color: #FF5A5A;
                cursor: pointer;
              }
            }

            .right-list{
              padding-bottom: 0;
              line-height: $width*2;
              border-bottom: 1px solid #DBDBDB;

              span{
                margin-left: $width/2;
              }

              i{
                display: none;
                font-style: normal;
                color: red;
                cursor: pointer;
                margin-right: $width/2;
                float: right;
              }

              &:hover{
                background: #E7E7E7;
                i{
                  display: inline-block;
                }
              }
            }
          }
        }
      }

      .el-dialog__footer{
        margin-top: $width;
      }
    }
  }
  
  // 选择测评方式弹出框
  .check-dialogVisible{
    .el-dialog{
      width: 600px;

      .el-dialog__header{
        padding: $width;
        span{
          font-weight: normal;
        }
      }

      .el-dialog__body{
        text-align: center;
        padding: $width*4.5 0;

        .el-radio{
          margin:0 $width*2;
        }
      }
    }
  }

  .choose-type-dialogVisible{
    .el-dialog{
      width: 600px;

      .el-dialog__header{
        padding: $width;
        span{
          font-weight: normal;
        }
      }

      .el-dialog__body{
        text-align: center;
        padding: $width*2 0;

        .el-radio{
          margin:0 $width*2;
        }

        .check-list{
          height: 200px;
          overflow-x: hidden;
        }
      }
      
      .el-dialog__footer{
        text-align: center;
        .el-button{
          margin-left: $width*2;
        }
      }
    }
  }

  
}
</style>
