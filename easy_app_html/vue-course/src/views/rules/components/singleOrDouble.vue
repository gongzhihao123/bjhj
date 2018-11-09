<template>
  <div id="class-roomSet" class="clearfix">
    <el-button class="btn" @click="singleOrDoubleAddSet">新增设置</el-button>
    <table class="subject-classroom">
      <tr>
        <th v-for="item in tableSingleOrDouble" :key="item.name">{{item.name}}</th>
      </tr>
      <tr v-for="item in tableSingleOrDoubleContent" :key="item.grade">
        <td>{{item.gradeName}}</td>
        <td>{{item.classNames}}</td>
        <td>{{item.oneWeekSubjectName}}</td>
        <td>{{item.doubleWeekSubjectName}}</td>
        <td>
          <span class="change click" @click="singleOrDoubleChange(item)"><img src="../../../assets/images/bianji.png" class="cutimg" />修改</span>
          <span class="click" @click="singleOrDoubleDelete(item)"><img src="../../../assets/images/delete.png" class="cutimg" />删除</span>
        </td>
      </tr>
      <tr v-if="tableSingleOrDoubleContent.length == 0" class="no-content none"><td :colspan="5">暂无数据</td></tr>
    </table>
     <!--单双周排课-->
    <el-dialog :title="changeOrAdd" :visible.sync="dialogSingleOrDoubleVisible" class="dialog">
      <table class="dialog-table">
        <tr>
          <td>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期 :</td>
          <td>{{semesterId.semesterName}}</td>
        </tr>
        <tr>
          <td>年级选择 :</td>
          <td>
            <el-select v-model="gradeValue" placeholder="请选择" @change="gradeChange">
              <el-option
                v-for="item in gradeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
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
          <td>单周课程 :</td>
          <td>
            <el-select v-model="singleValue" placeholder="请选择"  @change="singleChange">
              <el-option
                v-for="item in singleList"
                :key="item.chooiceId"
                :label="item.curriculumName"
                :value="item.chooiceId">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>双周课程 :</td>
          <td>
            <el-select v-model="doubleValue" placeholder="请选择"  @change="doubleChange">
              <el-option
                v-for="item in doubleList"
                :key="item.chooiceId"
                :label="item.curriculumName"
                :value="item.chooiceId">
              </el-option>
            </el-select>
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
      <span>确认删除当前年级的单双周排课设置吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="singleOrDoubleDeleteSure = false" class="cancel">取 消</el-button>
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
      tableSingleOrDouble: [
        {name: '年级'},
        {name: '班级'},
        {name: '单周课程'},
        {name: '双周课程'},
        {name: '操作'}
      ],
      tableSingleOrDoubleContent: [],
      classList: [],
      dialogSingleOrDoubleVisible: false,
      singleOrDoubleDeleteSure: false,
      changeOrAdd: '',
      id: '',
      gradeValue: '',
      gradeList: [],
      classCheckedList: [],
      checkedAll: false,
      gradeId: '',
      singleValue: '',
      singleList: [],
      doubleValue: '',
      doubleList: [],
      singleId: '',
      singleName: '',
      doubleId: '',
      doubleName: ''
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
    singleOrDoubleAddSet () {
      this.changeOrAdd = '单双周课程新增设置'
      this.classList = []
      this.classCheckedList = []
      this.singleValue = ''
      this.gradeValue = ''
      this.doubleValue = ''
      this.checkedAll = false
      this.selectGradeSimple()
      this.dialogSingleOrDoubleVisible = true
    },
    // 编辑
    singleOrDoubleChange (item) {
      this.changeOrAdd = '单双周课程新增编辑'
      this.id = item.id
      this.weekArrangeSetDetail()
      this.dialogSingleOrDoubleVisible = true
    },
    // 删除
    singleOrDoubleDelete (item) {
      this.singleOrDoubleDeleteSure = true
    },
    // 获取列表
    getList () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`setting/weekArrangeSetList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        this.tableSingleOrDoubleContent = res.data.result
        this.id = res.data.result.id
      })
    },
    // 新增单双周设置接口
    weekArrangeSetAdd () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      this.$https.post(`setting/weekArrangeSetAdd`, querystring.stringify({
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList,
        oneWeekSubjectId: this.singleId,
        oneWeekSubjectName: this.singleName,
        doubleWeekSubjectId: this.doubleId,
        doubleWeekSubjectName: this.doubleName
      })).then(res => {
        if (res.data.code === 1) {
          this.dialogSingleOrDoubleVisible = false
          this.getList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取年级信息
    selectGradeSimple () {
      this.$https.get(`common/selectGradeSimple?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 改变年级
    async gradeChange (val) {
      if (val === '') return
      let arr = this.gradeList.map(item => item.id)
      let index = arr.indexOf(val)
      this.checkedAll = false
      this.gradeId = this.gradeList[index].id
      this.gradeName = this.gradeList[index].name
      this.classList = this.gradeList[index].classList.map(item => ({checked: false, className: item.className, classId: item.id}))
      await this.selectCourseList()
    },
    // 改变单周课程列表
    singleChange (val) {
      if (val === '') return
      let arr = this.singleList.map(item => item.chooiceId)
      let index = arr.indexOf(val)
      this.singleId = this.singleList[index].chooiceId
      this.singleName = this.singleList[index].curriculumName
    },
    // 改变双周课程
    doubleChange (val) {
      if (val === '') return
      let arr = this.doubleList.map(item => item.chooiceId)
      let index = arr.indexOf(val)
      this.doubleId = this.doubleList[index].chooiceId
      this.doubleName = this.doubleList[index].curriculumName
    },
    // 删除单个
    deleteOne () {
      this.$https.post(`setting/weekArrangeSetDelete`, querystring.stringify({
        id: this.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getList()
          success(this, res.data.message, 2000)
        }
      })
      this.singleOrDoubleDeleteSure = false
    },
    // 获取单双周课程列表
    async selectCourseList () {
      await this.$https.get(`/common/selectCourseList?gradeId=${this.gradeId}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&weekType=${2}`)
      .then(res => {
        this.singleList = res.data.result
        this.doubleList = res.data.result
      })
    },
    // 获取单双周设置详情信息
    weekArrangeSetDetail () {
      this.$https.get(`common/selectGradeSimple?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        this.gradeList = res.data.result
        this.$https.get(`setting/weekArrangeSetDetail?id=${this.id}`)
        .then(async res => {
          if (res.data.code === 1) {
            let obj = res.data.result
            this.gradeValue = obj.gradeId
            await this.gradeChange(obj.gradeId)
            this.singleValue = obj.oneWeekSubjectId
            this.singleChange(this.singleValue)
            this.doubleValue = obj.doubleWeekSubjectId
            this.doubleChange(this.doubleValue)
            let classIds = obj.classIds.split(',')
            let classNames = obj.classNames.split(',')
            classIds.forEach((item, i) => {
              this.classCheckedList.push({checked: true, classId: item, className: classNames[i]})
            })
            if (!this.classCheckedList) return
            this.classCheckedList.forEach(item => {
              this.classList.forEach(items => {
                if (this.classCheckedList.length === this.classList.length) {
                  this.checkedAll = true
                }
                if (String(item.classId) === String(items.classId)) {
                  this.$set(items, 'checked', true)
                }
              })
            })
          }
        })
      })
    },
    // 新增/编辑确定按钮
    addNew () {
      let classCheckedList = this.classList.filter(item => item.checked)
      if (this.gradeValue === '') {
        notice(this, '请选择年级', 2000)
        return
      }
      if (classCheckedList.length === 0) {
        notice(this, '请选择班级', 2000)
        return
      }
      if (this.singleValue === '') {
        notice(this, '请选择单周课程', 2000)
        return
      }
      if (this.doubleValue === '') {
        notice(this, '请选择双周课程', 2000)
        return
      }
      if (this.singleValue === this.doubleValue) {
        notice(this, '单双周课程不能重复', 2000)
        return
      }
      if (this.changeOrAdd === '单双周课程新增编辑') {
        this.changeSure()
      } else {
        this.weekArrangeSetAdd()
      }
      this.dialogTableVisible = false
    },
    // 编辑保存接口
    changeSure () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      this.$https.post(`setting/weekArrangeSetUpdate`, querystring.stringify({
        id: this.id,
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList,
        oneWeekSubjectId: this.singleId,
        oneWeekSubjectName: this.singleName,
        doubleWeekSubjectId: this.doubleId,
        doubleWeekSubjectName: this.doubleName
      })).then(res => {
        if (res.data.code === 1) {
          this.dialogSingleOrDoubleVisible = false
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
  #class-roomSet {
    height: 100% !important;
    overflow: auto;
  }
</style>
