<template>
  <div id="combine-class" class="clearfix">
    <el-button class="btn" @click="addNewSet">新增设置</el-button>
    <table class="subject-classroom">
      <tr>
        <th v-for="item in combineClassHeader" :key="item.name">{{item.name}}</th>
      </tr>
      <tr v-for="item in tableSingleOrDoubleContent" :key="item.grade">
        <td>{{item.subjectName}}</td>
        <td>{{item.gradeName}}</td>
        <td>{{item.classNames}}</td>
        <td>
          <span class="green click" @click="singleOrDoubleChange(item)"><img src="../../../assets/images/green.png" class="cutimg" />修改</span>
          <span class="click" @click="singleOrDoubleDelete(item)"><img src="../../../assets/images/delete.png" class="cutimg" />删除</span>
        </td>
      </tr>
    </table>
     <!--合班课新增设置-->
    <el-dialog :title="changeOrAdd" :visible.sync="dialogSingleOrDoubleVisible" class="dialog">
      <table class="dialog-table">
        <tr>
          <td>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期 :</td>
          <td>{{this.semesterId.semesterName}}</td>
        </tr>
        <tr>
          <td>学科选择 :</td>
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
      </table>
      <footer class="dialog-footer">
        <el-button class="cancel" @click="dialogSingleOrDoubleVisible = false">取消</el-button>
        <el-button class="sure" @click="addNew">保存</el-button>
      </footer>
    </el-dialog>
    <!--删除单双周设置-->
    <el-dialog
      title="提示"
      :visible.sync="singleOrDoubleDeleteSure"
      size="tiny">
      <span>确认删除当前学科的合班课安排吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="singleOrDoubleDeleteSure = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="deleteOne" class="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { notice, success } from '../../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'combine-class',
  data () {
    return {
      value: '',
      combineClassHeader: [
        {name: '学科'},
        {name: '年级'},
        {name: '合班班级'},
        {name: '操作'}
      ],
      tableSingleOrDoubleContent: [],
      dialogSingleOrDoubleVisible: false,
      singleOrDoubleDeleteSure: false,
      changeOrAdd: '',
      classList: [],
      classCheckedList: [],
      selectSubjects: [],
      selectGrades: [],
      subjectValue: '',
      gradeValue: '',
      checkedAll: '',
      mod: false
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
    // 增加设置
    addNewSet () {
      this.changeOrAdd = '合班课新增设置'
      this.dialogSingleOrDoubleVisible = true
      this.classList = []
      this.classCheckedList = []
      this.subjectValue = ''
      this.gradeValue = ''
      this.checkedAll = false
      this.selectSubject()
    },
    // 编辑
    singleOrDoubleChange (item) {
      this.changeOrAdd = '合班课编辑'
      this.dialogSingleOrDoubleVisible = true
      this.classCheckedList = []
      this.id = item.id
      this.setDetail()
    },
    // 删除
    singleOrDoubleDelete (item) {
      this.id = item.id
      this.singleOrDoubleDeleteSure = true
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
    async getClassList () {
      await this.$https.get(`common/selectClassSimplesBySubjectAndGrade?gradeId=${this.gradeId}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&subjectId=${this.chooiceId}`)
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
                // items.checked = true
                this.$set(items, 'checked', true)
              }
            })
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取列表
    getList () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`/setting/combineSetList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&pageNo=${1}&pageSize=${12}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableSingleOrDoubleContent = res.data.result.list
        }
      })
    },
    // 获取详情信息
    setDetail () {
      this.$https.get(`common/selectSubject?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.selectSubjects = res.data.result
          this.mod = true
          this.$https.get(`/setting/combineSetDetail?bineId=${this.id}`)
          .then(res => {
            if (res.data.code === 1) {
              let obj = res.data.result
              this.subjectValue = obj.subjectId
              this.changeSubject(this.subjectValue)
              this.gradeValue = obj.gradeId
              let classIds = obj.classIds.split(',')
              let classNames = obj.classNames.split(',')
              // classIds.forEach((item, i) => {
              //   this.classCheckedList.push({checked: true, classId: item, className: classNames[i]})
              // })
              this.classCheckedList = classIds.map((item, i) => ({checked: true, classId: item, className: classNames[i]}))
              classIds.forEach(item => {
                this.classList.forEach(items => {
                  if (String(item) === String(items.classId)) {
                    this.$set(items, 'checked', true)
                  }
                })
              })
              this.gradeId = obj.gradeId
              this.getClassList()
            }
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 改变年级
    async changeGrade (val) {
      if (val === '') return
      this.checkedAll = false
      let arr = this.selectGrades.map(item => item.gradeId)
      let index = arr.indexOf(val)
      this.gradeId = this.selectGrades[index].gradeId
      this.gradeName = this.selectGrades[index].gradeName
      await this.getClassList()
      this.classCheckedList = []
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
    // 新增/bianji确定按钮
    addNew () {
      let classCheckedList = this.classList.filter(item => item.checked)
      if (this.chooiceId === '') {
        notice(this, '请选择学科', 2000)
        return
      }
      if (this.gradeId === '') {
        notice(this, '请选择年级', 2000)
        return
      }
      if (classCheckedList.length === 0) {
        notice(this, '请选择班级', 2000)
        return
      }
      if (this.changeOrAdd === '合班课编辑') {
        this.changeSure()
      } else {
        this.addNewSure()
      }
      this.dialogSingleOrDoubleVisible = false
    },
    // 新增保存接口
    addNewSure () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      this.$https.post(`setting/combineSetAdd`, querystring.stringify({
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        subjectId: this.chooiceId,
        subjectName: this.curriculumName,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList
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
    changeSure () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      this.$https.post(`/setting/combineSetUpdate`, querystring.stringify({
        bineId: this.id,
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        subjectId: this.chooiceId,
        subjectName: this.curriculumName,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList
      })).then(res => {
        if (res.data.code === 1) {
          this.getList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除单个
    deleteOne () {
      this.$https.post(`/setting/combineSetDelete`, querystring.stringify({
        bineId: this.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getList()
          this.singleOrDoubleDeleteSure = false
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

<style>
  #combine-class {
    height: 100%;
    overflow: auto;
  }
</style>

