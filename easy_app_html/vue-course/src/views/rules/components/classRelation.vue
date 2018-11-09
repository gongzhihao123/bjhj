<template>
  <div id="class-relation" class="clearfix">
    <div class="left-nav">
      <el-tree :data="tree" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true" node-key="label" current-node-key="课程连排"></el-tree>
    </div>
    <div class="right-content">
      <el-button class="btn" @click="classRelationAddSet">新增设置</el-button>
      <span v-if="labelName === '课程互斥'" style="color: #4BD0AE;">提示:课程互斥是指多个课程两两不能排在同一天内。</span>
      <span v-if="labelName === '课程连排'" style="color: #4BD0AE;">提示：课程连排是指两个课程挨着排课。</span>
      <table class="subject-classroom" v-if="labelName === '课程连排'">
        <tr>
          <th v-for="item in relationPlatoonHeader" :key="item.name">{{item.name}}</th>
        </tr>
        <tr v-for="item in classRelationContent" :key="item.subject">
          <td>{{item.gradeName}}</td>
          <td>{{item.classNames}}</td>
          <td>{{item.subjectOneName}}</td>
          <td>{{item.subjectTwoName}}</td>
          <td>{{item.importance | importDeatail}}</td>
          <td>
            <span class="green click" @click="relationChange(item)"><img src="../../../assets/images/green.png" class="cutimg" />修改</span>
            <span class="click" @click="relationDelete(item)"><img src="../../../assets/images/delete.png" class="cutimg" />删除</span>
          </td>
        </tr>
        <tr v-if="classRelationContent.length == 0" class="no-content none"><td :colspan="8">暂无数据</td></tr>
      </table>

      <table class="subject-classroom" v-else>
        <tr>
          <th v-for="item in relationMutexHeader" :key="item.name">{{item.name}}</th>
        </tr>
        <tr v-for="item in relationMutexContent" :key="item.subject">
          <td>{{item.gradeName}}</td>
          <td>{{item.classNames}}</td>
          <td>{{item.subjectNames}}</td>
          <td>{{item.importance | importDeatail}}</td>
          <td>
            <span class="green click" @click="relationChange(item)"><img src="../../../assets/images/green.png" class="cutimg" />修改</span>
            <span class="click" @click="relationDelete(item)"><img src="../../../assets/images/delete.png" class="cutimg" />删除</span>
            </td>
        </tr>
        <tr v-if="relationMutexContent.length == 0" class="no-content none"><td :colspan="8">暂无数据</td></tr>
      </table>
    </div>


    <!--课程关系-->
    <el-dialog :title="changeOrAdd" :visible.sync="classRelationSet" class="dialog">
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
          <td>班级选择 :</td>
          <td>
            <el-checkbox v-model="checkedAll" @change="handleCheckchangeAll()">全部</el-checkbox>
            <div>
              <el-checkbox v-model="item.checked" v-for="item in classList" :key="item.className" @change="handleClick(item)">{{item.className}}</el-checkbox>
            </div>
          </td>
        </tr>
        <tr v-if="labelName === '课程互斥'">
          <td>学科选择 :</td>
          <td>
            <div>
              <el-checkbox v-model="item.checked" v-for="item in subjectList" :key="item.curriculumName" @change="subjectHandleClick(item)">{{item.curriculumName}}</el-checkbox>
            </div>
          </td>
        </tr>
        <tr v-if="labelName === '课程连排'">
          <td>课&nbsp;&nbsp;程&nbsp;&nbsp;一 :</td>
          <td>
            <el-select v-model="lessonOneId" placeholder="请选择" @change="singleChange">
              <el-option
                v-for="item in lessonOneList"
                :key="item.chooiceId"
                :label="item.curriculumName"
                :value="item.chooiceId">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr v-if="labelName === '课程连排'">
          <td>课&nbsp;&nbsp;程&nbsp;&nbsp;二 :</td>
          <td>
            <el-select v-model="lessonTwoId" placeholder="请选择" @change="doubleChange">
              <el-option
                v-for="item in lessonTwoList"
                :key="item.chooiceId"
                :label="item.curriculumName"
                :value="item.chooiceId">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>重&nbsp;&nbsp;要&nbsp;&nbsp;性 :</td>
          <td>
            <el-radio class="radio" v-model="radio" :label="1">必须保证</el-radio>
            <el-radio class="radio" v-model="radio" :label="2">一般</el-radio>
          </td>
        </tr>
      </table>
      <footer class="dialog-footer">
        <el-button class="cancel" @click="classRelationSet = false">取消</el-button>
        <el-button class="sure" @click="addSure">保存</el-button>
      </footer>
    </el-dialog>

    <!--课程关系删除-->
    <el-dialog
      title="提示"
      :visible.sync="relationDeleteSure"
      size="tiny">
      <span>{{deleteTitle}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relationDeleteSure = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="relationPlatoonDeleteSure()" class="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { notice, success } from '../../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'class-relation',
  data () {
    return {
      tree: [
        { label: '课程连排', children: [] },
        { label: '课程互斥', children: [] }
      ],
      key: [ '课程连排' ],
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      relationPlatoonHeader: [
        {name: '年级'},
        {name: '班级'},
        {name: '课程一'},
        {name: '课程二'},
        {name: '重要性'},
        {name: '操作'}
      ],
      relationMutexHeader: [
        {name: '年级'},
        {name: '班级'},
        {name: '课程'},
        {name: '重要性'},
        {name: '操作'}
      ],
      classRelationContent: [],
      relationMutexContent: [],
      className: [],
      radio: 2,
      classRelationSet: false,
      relationDeleteSure: false,
      changeOrAdd: '',
      labelName: '',
      gradeValue: '',
      checkedAll: false,
      gradeList: [],
      classList: [],
      lessonOneList: [],
      lessonTwoList: [],
      classCheckedList: [],
      subjectCheckedList: [],
      subjectList: [],
      lessonOneId: '',
      lessonOneName: '',
      lessonTwoId: '',
      lessonTwoName: '',
      id: '',
      deleteTitle: '',
      modReplace: false
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
    // 课程单选
    subjectHandleClick (item) {
      if (item.checked) {
        this.subjectCheckedList.push(item)
        if (this.subjectList.length === this.subjectCheckedList.length) {
          // this.checkedAll = true
        }
      } else {
        let index = this.subjectCheckedList.indexOf(item)
        this.subjectCheckedList.splice(index, 1)
        if (this.subjectList.length !== this.subjectCheckedList.length) {
          // this.checkedAll = false
        }
      }
    },
    // 全选
    handleCheckchangeAll () {
      if (this.checkedAll) {
        this.classCheckedList = []
        this.classList = this.classList.map(item => ({...item, checked: false}))
        this.classList.forEach((item, index) => {
          item.checked = true
          this.handleClick(item, index)
        })
      } else {
        this.classCheckedList = []
        this.classList = this.classList.map(item => ({...item, checked: false}))
        this.classList.forEach((item, index) => {
          item.checked = false
        })
      }
    },
    // 左侧树列表
    handleNodeClick (data) {
      if (data.label === '课程连排') {
        this.labelName = '课程连排'
        this.relationPlatoonSetList()
      } else if (data.label === '课程互斥') {
        this.labelName = '课程互斥'
        this.relationMutexSetList()
      }
    },
    // 公共改变年级
    async gradeChange (val) {
      if (val === '') return
      if (this.modReplace) {
        this.modReplace = false
        return
      }
      let index
      let arr = this.gradeList.map(item => item.id)
      index = arr.indexOf(val)
      this.gradeId = this.gradeList[index].id
      this.gradeName = this.gradeList[index].name
      this.classList = this.gradeList[index].classList.map(item => ({className: item.className, classId: item.id, checked: false}))
      this.classCheckedList = []
      // if (this.changeOrAdd !== '课程关系互斥编辑') {
      //   this.classList = this.gradeList[index].classList.map(item => ({checked: false, className: item.className, classId: item.id}))
      // }
      await this.selectCourseList()
      if (this.classCheckedList.length === this.classList.length) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
    },
    // 公共改变课程一
    singleChange (val) {
      if (val === '') return
      let arr = this.lessonOneList.map(item => item.chooiceId)
      let index = arr.indexOf(val)
      this.lessonOneId = this.lessonOneList[index].chooiceId
      this.lessonOneName = this.lessonOneList[index].curriculumName
    },
    // 公共改变课程二
    doubleChange (val) {
      if (val === '') return
      let arr = this.lessonTwoList.map(item => item.chooiceId)
      let index = arr.indexOf(val)
      this.lessonTwoId = this.lessonTwoList[index].chooiceId
      this.lessonTwoName = this.lessonTwoList[index].curriculumName
    },
    // 公共新增设置
    classRelationAddSet () {
      if (this.labelName === '课程连排') {
        this.changeOrAdd = '课程关系连排新增设置'
      } else if (this.labelName === '课程互斥') {
        this.changeOrAdd = '课程关系互斥新增设置'
        this.modReplace = false
      }
      this.classRelationSet = true
      this.classList = []
      this.classCheckedList = []
      this.subjectCheckedList = []
      this.subjectList = []
      this.gradeValue = ''
      this.checkedAll = false
      this.lessonOneId = ''
      this.lessonTwoId = ''
      this.selectGradeSimple()
    },
    // 公共编辑
    relationChange (item) {
      this.classCheckedList = []
      this.subjectCheckedList = []
      this.checkedAll = false
      if (this.labelName === '课程连排') {
        this.id = item.id
        this.changeOrAdd = '课程关系连排编辑'
        this.relationPlatoonDetail()
      } else if (this.labelName === '课程互斥') {
        this.id = item.id
        this.changeOrAdd = '课程关系互斥编辑'
        this.relationMutexDetail()
        this.modReplace = false
      }
      this.classRelationSet = true
    },
    // 公共新增/编辑按钮
    addSure () {
      let classCheckedList = this.classList.filter(item => item.checked)
      if (this.gradeValue === '') {
        notice(this, '请选择年级', 2000)
        return
      }
      if (classCheckedList.length === 0) {
        notice(this, '请选择班级', 2000)
        return
      }
      if (this.labelName === '课程连排' && this.lessonOneId === '') {
        notice(this, '请选择课程一', 2000)
        return
      }
      if (this.labelName === '课程连排' && this.lessonTwoId === '') {
        notice(this, '请选择课程二', 2000)
        return
      }
      if (this.labelName === '课程连排' && this.lessonOneId === this.lessonTwoId) {
        notice(this, '两个课程不能重复', 2000)
        return
      }
      if (this.labelName === '课程互斥' && this.subjectCheckedList.length < 2) {
        notice(this, '至少选择两门学科', 2000)
        return
      }
      if (this.changeOrAdd === '课程关系连排新增设置') {
        this.relationPlatoonAdd()
      } else if (this.changeOrAdd === '课程关系互斥新增设置') {
        this.relationMutexAdd()
      } else if (this.changeOrAdd === '课程关系连排编辑') {
        this.relationPlatoonUpdate()
      } else if (this.changeOrAdd === '课程关系互斥编辑') {
        this.relationMutexUpdate()
      }
      this.dialogTableVisible = false
    },
    // 公共获取年级信息
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
     // 公共获取课程列表
    async selectCourseList () {
      await this.$https.get(`/common/selectCourseList?gradeId=${this.gradeId}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&weekType=${1}`)
      .then(res => {
        this.lessonOneList = res.data.result
        this.lessonTwoList = res.data.result
        this.subjectList = res.data.result
      })
    },
    // 课程连排点击 删除按钮
    relationDelete (item) {
      this.relationDeleteSure = true
      this.id = item.id
      if (this.labelName === '课程连排') {
        this.deleteTitle = '确认删除该年级的课程连排设置吗？'
      } else if (this.labelName === '课程互斥') {
        this.deleteTitle = '确认删除该年级的课程互斥设置吗？'
      }
    },
    // 课程连排点击 删除判断
    relationPlatoonDeleteSure () {
      if (this.deleteTitle === '确认删除该年级的课程连排设置吗？') {
        this.relationPlatoonDelete()
      } else if (this.deleteTitle === '确认删除该年级的课程互斥设置吗？') {
        this.relationMutexDelete()
      }
    },
    // 连排设置 删除确定
    relationPlatoonDelete () {
      this.$https.post(`/setting/relationPlatoonSetDelete`, querystring.stringify({
        toonId: this.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.relationPlatoonSetList()
          this.relationDeleteSure = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 课程连排信息列表
    relationPlatoonSetList () {
      this.$https.get(`setting/relationPlatoonSetList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&pageNo=${1}&pageSize=${12}`)
      .then(res => {
        if (res.data.code === 1) {
          this.classRelationContent = res.data.result.list
        }
      })
    },
    // 新增课程连排信息
    relationPlatoonAdd () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      this.$https.post(`setting/relationPlatoonSetAdd`, querystring.stringify({
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList,
        subjectOneId: this.lessonOneId,
        subjectOneName: this.lessonOneName,
        subjectTwoId: this.lessonTwoId,
        subjectTwoName: this.lessonTwoName,
        importance: this.radio
      })).then(res => {
        if (res.data.code === 1) {
          this.relationPlatoonSetList()
          this.classRelationSet = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 课程连排 点击编辑获取详细信息
    relationPlatoonDetail () {
      this.$https.get(`common/selectGradeSimple?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        this.gradeList = res.data.result
        this.$https.get(`/setting/relationPlatoonSetDetail?toonId=${this.id}`)
        .then(async res => {
          if (res.data.code === 1) {
            let obj = res.data.result
            this.gradeValue = obj.gradeId
            await this.gradeChange(obj.gradeId)
            this.lessonOneId = obj.subjectOneId
            this.singleChange(this.lessonOneId)
            this.lessonTwoId = obj.subjectTwoId
            this.doubleChange(this.lessonTwoId)
            let classIds = obj.classIds.split(',')
            let classNames = obj.classNames.split(',')
            classIds.forEach((item, i) => {
              this.classCheckedList.push({checked: true, classId: item, className: classNames[i]})
            })
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
            this.radio = obj.importance
          }
        })
      })
    },
    // 课程连排 修改保存
    relationPlatoonUpdate () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      this.$https.post(`setting/relationPlatoonSetUpdate`, querystring.stringify({
        toonId: this.id,
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList,
        subjectOneId: this.lessonOneId,
        subjectOneName: this.lessonOneName,
        subjectTwoId: this.lessonTwoId,
        subjectTwoName: this.lessonTwoName,
        importance: this.radio
      })).then(res => {
        if (res.data.code === 1) {
          this.relationPlatoonSetList()
          this.classRelationSet = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取课互斥信息列表
    relationMutexSetList () {
      this.$https.get(`setting/relationMutexSetList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&pageNo=${1}&pageSize=${12}`)
      .then(res => {
        if (res.data.code === 1) {
          this.relationMutexContent = res.data.result.list
        }
      })
    },
    // 新增课程互斥信息
    relationMutexAdd () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      let subjectCheckedList = this.subjectList.filter(item => item.checked)
      let subjectIdList = subjectCheckedList.map(item => item.chooiceId)
      let subjectNameList = subjectCheckedList.map(item => item.curriculumName)
      this.$https.post(`setting/ relationMutexSetAdd`, querystring.stringify({
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList,
        subjectIds: subjectIdList,
        subjectNames: subjectNameList,
        importance: this.radio
      })).then(res => {
        if (res.data.code === 1) {
          this.relationMutexSetList()
          this.classRelationSet = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取课程互斥信息
    relationMutexDetail () {
      this.$https.get(`/common/selectGradeSimple?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        this.gradeList = res.data.result
        this.$https.get(`/setting/ relationMutexSetDetail?mutexId=${this.id}`)
        .then(async res => {
          if (res.data.code === 1) {
            let obj = res.data.result
            await this.gradeChange(obj.gradeId)
            this.modReplace = true
            this.gradeValue = obj.gradeId
            let classIds = obj.classIds.split(',')
            let classNames = obj.classNames.split(',')
            classIds.forEach((item, i) => {
              this.classCheckedList.push({checked: true, classId: item, className: classNames[i]})
            })
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
            let subjectIds = obj.subjectIds.split(',')
            let subjectNames = obj.subjectNames.split(',')
            subjectIds.forEach((item, i) => {
              this.subjectCheckedList.push({checked: true, subjectId: item, subjectName: subjectNames[i]})
            })
            if (!this.subjectCheckedList) return
            this.subjectList = this.subjectList.map(item => ({
              checked: false,
              ...item
            }))
            this.subjectCheckedList.forEach(item => {
              this.subjectList.forEach(items => {
                if (String(item.subjectId) === String(items.chooiceId)) {
                  this.$set(items, 'checked', true)
                }
              })
            })
            this.radio = obj.importance
          }
        })
      })
    },
    // 修改课程互斥
    relationMutexUpdate () {
      let classCheckedList = this.classList.filter(item => item.checked)
      let classIdList = classCheckedList.map(item => item.classId).join(',')
      let classNameList = classCheckedList.map(item => item.className).join(',')
      let subjectCheckedList = this.subjectList.filter(item => item.checked)
      let subjectIdList = subjectCheckedList.map(item => item.chooiceId)
      let subjectNameList = subjectCheckedList.map(item => item.curriculumName)
      this.$https.post(`/setting/ relationMutexSetUpdate`, querystring.stringify({
        mutexId: this.id,
        sectionId: this.section.id,
        semesterId: this.semesterId.semesterId,
        gradeId: this.gradeId,
        gradeName: this.gradeName,
        classIds: classIdList,
        classNames: classNameList,
        subjectIds: subjectIdList,
        subjectNames: subjectNameList,
        importance: this.radio
      })).then(res => {
        if (res.data.code === 1) {
          this.relationMutexSetList()
          this.classRelationSet = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 连排设置 删除确定
    relationMutexDelete () {
      this.$https.post(`/setting/relationMutexSetDelete`, querystring.stringify({
        mutexId: this.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.relationMutexSetList()
          this.relationDeleteSure = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    if (this.semesterId.semesterId && this.section.id) {
      this.labelName = '课程连排'
      this.relationPlatoonSetList()
    }
  },
  filters: {
    importDeatail (val) {
      let imports = {
        '1': '必须保证',
        '2': '一般'
      }
      return imports[val]
    }
  },
  watch: {
    semesterId () {
      this.relationPlatoonSetList()
    },
    section () {
      this.relationPlatoonSetList()
    }
  }
}
</script>



<style lang="scss">
#class-relation {
  padding-bottom: 20px;
  width: 100%;
  height: 100%;
  div.right-content {
    float: left;
    width: 84%;
    height: calc(100% - 20px);
    overflow: auto;
    // border-radius: 4px;
  }
}
</style>