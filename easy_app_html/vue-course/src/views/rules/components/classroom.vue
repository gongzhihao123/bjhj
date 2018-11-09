<template>
  <div class="clearfix rules-classroom">
    <el-button class="btn" @click="addSet">新增设置</el-button>
    <table class="subject-classroom">
      <tr>
        <th v-for="item in tableClassRoomHeader" :key="item.name">{{item.name}}</th>
      </tr>
      <tr v-for="item in tableClassRoomContent" :key="item.title">
        <td>{{item.subjectName}}</td>
        <td>{{item.gradeName}}</td>
        <td>{{item.classNames}}</td>
        <td>{{item.classroomCatagoryName}}</td>
        <td>
          <span class="change click" @click="changesure(item)"><img src="../../../assets/images/bianji.png" class="cutimg" />修改</span>
          <span class="click" @click="deletesure(item)"><img src="../../../assets/images/delete.png" class="cutimg" />删除</span>
        </td>
      </tr>
      <tr v-if="tableClassRoomContent.length == 0" class="no-content none"><td :colspan="5">暂无数据</td></tr>
    </table>

    <!--教室设置-->
    <el-dialog :title="addOrSet" :visible.sync="dialogTableVisible" class="dialog">
      <table class="dialog-table">
        <tr>
          <td>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期 :</td>
          <td>{{semesterId.semesterName}}</td>
        </tr>
        <tr>
          <td>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;科 :</td>
          <td>
            <el-select v-model="subjectValue" placeholder="请选择" @change="changeSubject">
              <el-option
                v-for="item in selectSubjects"
                :key="item.chooiceId"
                :label="item.curriculumName"
                :value="item.chooiceId">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>年级选择 :</td>
          <td>
            <el-select v-model="gradeValue" placeholder="请选择" @change="changeGrade">
              <el-option
                v-for="(item, i) in selectGrades"
                :key="item.id"
                :label="item.gradeName"
                :value="item.gradeId">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td style="vertical-align: top; padding-top: 6px;">班级选择 :</td>
          <td style="vertical-align: top;">
            <el-checkbox v-model="checkedAll" @change="handleCheckchangeAll()">全部</el-checkbox>
            <div>
              <el-checkbox v-model="item.checked" v-for="item in classList" :key="item.className" @change="handleClick(item)">{{item.className}}</el-checkbox>
            </div>
          </td>
        </tr>
        <tr>
          <td>教室类型 :</td>
          <td>
            <el-select v-model="value" placeholder="请选择" @change="changeClassRoom">
              <el-option
                v-for="(item, i) in selectClassRooms"
                :key="item.id"
                :label="item.categoryName"
                :value="i">
              </el-option>
            </el-select>
          </td>
        </tr>
      </table>
      <footer class="dialog-footer">
        <el-button class="cancel" @click="dialogTableVisible = false">取消</el-button>
        <el-button class="sure" @click="addNew()">保存</el-button>
      </footer>
    </el-dialog>
    <!--删除教室设置-->
    <el-dialog
      title="提示"
      :visible.sync="deleteSureDialogVisible"
      size="tiny">
      <span>确认删除当前学科教室设置吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteSureDialogVisible = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="deleteOne" class="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import querystring from 'querystring'
import { notice, success } from '../../../api/index.js'
export default {
  name: 'class-roomSet',
  data () {
    return {
      value: '',
      tableClassRoomHeader: [
        {name: '学科'},
        {name: '年级'},
        {name: '班级'},
        {name: '教室类型'},
        {name: '操作'}
      ],
      tableClassRoomContent: [],
      classList: [],
      dialogTableVisible: false,
      deleteSureDialogVisible: false,
      addOrSet: '',
      id: '',
      selectClassRooms: [],
      selectGrades: [],
      selectSubjects: [],
      classCheckedList: [],
      subjectValue: '',
      gradeValue: '',
      classId: '',
      chooiceId: '',
      curriculumName: '',
      categoryId: '',
      categoryName: '',
      gradeId: '',
      gradeName: '',
      checkedAll: false
    }
  },
  computed: {
    ...mapGetters([
      'semesterId',
      'section'
    ])
  },
  methods: {
    // 单选
    handleClick (item) {
      this.classCheckedList = this.classCheckedList.filter(item => item.classId)
      if (item.checked) {
        this.classCheckedList.push(item)
        if (this.classList.length === this.classCheckedList.length) {
          this.checkedAll = true
        }
      } else {
        let index = this.classCheckedList.indexOf(item)
        this.classCheckedList.splice(index, 1)
        if (this.classList.length !== this.classCheckedList.length) {
          this.checkedAll = false
        }
      }
    },
    // 全选
    handleCheckchangeAll () {
      if (this.checkedAll) {
        this.classCheckedList = []
        this.classList.forEach((item, index) => {
          item.checked = true
          this.handleClick(item, index)
        })
      } else {
        this.classCheckedList = []
        this.classList.forEach((item, index) => {
          item.checked = false
        })
      }
    },
    // 编辑
    changesure (item) {
      this.classCheckedList = []
      this.addOrSet = '学科教室编辑'
      this.id = item.id
      this.dialogTableVisible = true
      this.checkedAll = false
      this.classroomSetDetail()
      this.selectClassRoom()
    },
    // 删除
    deletesure (item) {
      this.id = item.id
      this.deleteSureDialogVisible = true
    },
    // 新增设置
    addSet () {
      this.addOrSet = '学科教室新增设置'
      this.classList = []
      this.classCheckedList = []
      this.subjectValue = ''
      this.gradeValue = ''
      this.value = ''
      this.checkedAll = false
      this.selectSubject()
      this.selectClassRoom()
      this.dialogTableVisible = true
    },
    // 获取列表
    getList () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`setting/classroomSetList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        this.tableClassRoomContent = res.data.result
        this.id = res.data.result.id
      })
    },
    // 获取教室类型
    selectClassRoom () {
      this.$https.get(`common/selectClassRoomCategoryList`)
      .then(res => {
        if (res.data.code === 1) {
          this.selectClassRooms = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学科信息
    selectSubject () {
      this.$https.get(`common/selectSubject?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.selectSubjects = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取班级列表
    getClassList () {
      this.$https.get(`common/selectClassSimplesBySubjectAndGrade?gradeId=${this.gradeId}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&subjectId=${this.chooiceId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.classList = res.data.result.map(item => ({checked: false, className: item.className, classId: item.classId}))
          if (!this.classCheckedList) return
          if (this.classCheckedList.length === this.classList.length) {
            this.checkedAll = true
          }
          this.classCheckedList.forEach(item => {
            this.classList.forEach(items => {
              if (String(item.classId) === String(items.classId)) {
                this.$set(items, 'checked', true)
              }
            })
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取教室设置详情信息
    classroomSetDetail () {
      this.$https.get(`common/selectSubject?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.selectSubjects = res.data.result
          this.$https.get(`setting/classroomSetDetail?id=${this.id}`)
          .then(res => {
            if (res.data.code === 1) {
              let obj = res.data.result
              this.subjectValue = obj.subjectId
              this.changeSubject(this.subjectValue)
              this.gradeValue = obj.gradeId
              let classIds = obj.classIds.split(',')
              let classNames = obj.classNames.split(',')
              classIds.forEach((item, i) => {
                this.classCheckedList.push({checked: true, classId: item, className: classNames[i]})
              })
              this.gradeId = obj.gradeId
              this.getClassList()
              let category = this.selectClassRooms.map(item => item.categoryName)
              if (category.indexOf(obj.classroomCatagoryName) !== -1) {
                this.value = category.indexOf(obj.classroomCatagoryName)
              } else {
                this.value = ''
              }
            }
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 改变年级
    changeGrade (val) {
      if (val === '') return
      let arr = this.selectGrades.map(item => item.gradeId)
      let index = arr.indexOf(val)
      this.gradeId = this.selectGrades[index].gradeId
      this.gradeName = this.selectGrades[index].gradeName
      this.checkedAll = false
      this.getClassList()
    },
    // 改变学科
    changeSubject (val) {
      if (val === '') return
      let index
      let arr = this.selectSubjects.map(item => item.chooiceId)
      index = arr.indexOf(val)
      this.selectGrades = this.selectSubjects[index].gradeInfo
      this.chooiceId = this.selectSubjects[index].chooiceId
      this.curriculumName = this.selectSubjects[index].curriculumName
      if (this.gradeId) {
        let arr = this.selectGrades.map(item => item.gradeId)
        let i = arr.indexOf(this.gradeId)
        if (i === -1) {
          this.gradeValue = ''
          this.classList = []
        } else {
          this.getClassList()
        }
      }
    },
    // 改变教室类型
    changeClassRoom (val) {
      if (val === '') return
      this.categoryId = this.selectClassRooms[val].id
      this.categoryName = this.selectClassRooms[val].categoryName
    },
    // 删除单个
    deleteOne () {
      this.$https.post(`setting/classroomSetDelete`, querystring.stringify({
        id: this.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getList()
          this.deleteSureDialogVisible = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 新增/bianji确定按钮
    addNew () {
      let classCheckedList = this.classList.filter(item => item.checked)
      if (!this.subjectValue) {
        notice(this, '请选择学科', 2000)
        return
      }
      if (!this.gradeId) {
        notice(this, '请选择年级', 2000)
        return
      }
      if (!classCheckedList.length) {
        notice(this, '请选择班级', 2000)
        return
      }
      if (!this.categoryId) {
        notice(this, '请选择教室类型', 2000)
        return
      }
      if (this.addOrSet === '学科教室编辑') {
        this.classroomSetUpdate()
      } else {
        this.addNewSure()
      }
      this.dialogTableVisible = false
    },
    // 新增保存接口
    addNewSure () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      this.$https.post(`setting/classroomSetAdd`, querystring.stringify({
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        subjectId: this.chooiceId,
        subjectName: this.curriculumName,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList,
        classroomCatagoryId: this.categoryId,
        classroomCatagoryName: this.categoryName
      })).then(res => {
        if (res.data.code === 1) {
          this.getList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 修改保存接口
    classroomSetUpdate () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      this.$https.post(`setting/classroomSetUpdate`, querystring.stringify({
        id: this.id,
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        subjectId: this.chooiceId,
        subjectName: this.curriculumName,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList,
        classroomCatagoryId: this.categoryId,
        classroomCatagoryName: this.categoryName
      })).then(res => {
        if (res.data.code === 1) {
          this.getList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    if (this.semesterId.semesterId && this.section.id) {
      this.getList()
    }
  },
  watch: {
    semesterId () {
      this.getList()
    },
    section () {
      this.getList()
    }
  }
}
</script>

<style lang="scss">
  .rules-classroom {
    height: 100%;
    overflow: auto;
  }
</style>

