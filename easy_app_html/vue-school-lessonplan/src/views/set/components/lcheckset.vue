<template>
  <div id="lcheckset">
    <el-tabs v-model="activeName">
        <el-tab-pane label="评价项目设置">
          <p>已设定分值之和：{{sum}}分</p>
          <!--表格-->
          <el-table
            v-loading="loading"
            :data="tableData"
            border
            style="width: 100%">
            <transition
            <el-table-column
              prop="title"
              label="评价项目"
              width="25%">
            </el-table-column>
            <el-table-column
              prop="checkpoint"
              label="评价细则"
              width="25%">
            </el-table-column>
            <el-table-column
              prop="score"
              label="分值"
              width="20%">
            </el-table-column>
            <el-table-column
              label="操作"
              width="30%">
              <template scope="scope">
                <span @click="handleDelete(scope.$index, scope.row)" class="delete"><i></i>删除</span>
                <span @click="handleEdit(scope.$index, scope.row)" class="edit"><i></i>编辑</span>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="addproject" @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true">
            新增
            <img v-if="borderOne" src="../../../assets/images/border.png">
          </el-button>
          <el-button class="save" @click="savePoint">保存</el-button>
          <p class="illustrate">
            <span>说明：</span>
            <ul>
              <li>点击【新增】,可自定义增加评价项目及对应的分值</li>
              <li>所有评价项目对应的分值之和为5分，当小于或大于5分时，将不能完成操作。</li>
            </ul>
          </p>
        </el-tab-pane>        
        <el-tab-pane label="备课检查权限设置">
          <div class="courseplan">
            <el-tabs v-model="activename" type="card"> 
                <el-tab-pane v-for="(item, index) in tableDataa" :key="index" :label="item.name" :value="index">                 
                  <el-table
                  v-loading="checkloading"
                    v-if="index === 0"
                    :data="checkList"
                    style="width: 100%"
                    class="checktable">
                    <el-table-column
                      prop="teacherName"
                      label="教师"
                      width="50%">
                    </el-table-column>
                    <el-table-column
                      label="权限组"
                      width="50%">
                    <template scope="scope">
                      <span class="info">{{scope.row.sectionName}}</span>
                      <span class="info">{{scope.row.gradeName}}</span>
                      <span class="info">{{scope.row.groupNames}}</span>
                    </template>
                    </el-table-column>
                  </el-table>
                  <!--特殊设置-->
                    <el-table
                      :data="specialInfo"
                      style="width: 100%"
                      v-if="index === 1"
                      @selection-change="handleSelectionChange"
                      class="specialtable">
                      <el-table-column
                        type="selection"
                        width="10%">
                      </el-table-column>
                      <el-table-column
                        prop="teacherName"
                        label="教师名称"
                        width="20%">
                      </el-table-column>
                      <el-table-column
                        label="拥有权限"
                        width="30%">
                        <template scope="scope">
                          <span v-for="item in scope.row.options">{{item.sectionName}}{{item.gradeName}}&nbsp;{{item.subjectNames}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="40%">
                        <template scope="scope">
                          <span @click="setRights(scope.$index, scope.row)"><i></i>设置权限</span>
                          <span @click="Delete(scope.$index, scope.row)"><i></i>删除</span>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <el-button @click="special = true" class="set" v-show="activename == 0" @mouseenter.native="borderTwo = false" @mouseleave.native="borderTwo = true">
              设置
              <img v-if="borderTwo" src="../../../assets/images/border.png">
            </el-button>
            <div class="button-group" v-show="activename == 1">
              <el-button @click="addspecial" @mouseenter.native="borderThree = false" @mouseleave.native="borderThree = true" class="addbutton">
                新增
                <img v-if="borderThree" src="../../../assets/images/border.png">
              </el-button>
              <el-button @click="deleteAll" @mouseenter.native="borderFour = false" @mouseleave.native="borderFour = true" class="deleteall">
                批量删除
                <img v-if="borderFour" src="../../../assets/images/border.png">
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </transition>
    </el-tabs>

    <!--新增-->
    <el-dialog
      title="新增备课检查评价项目"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="评价项目:" prop="name">
          <el-input v-model="form.name" placeholder="请输入" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="评价细则:" prop="textarea">
          <el-input v-model="form.textarea" placeholder="请输入" type="textarea" :maxlength="1000"></el-input>
        </el-form-item>        
        <el-form-item label="分值:">
          <el-select v-model="value" placeholder="请选择" prop="select">
            <el-option v-for="(item, index) in options" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="submit">确 定</el-button>
        <el-button @click="canceladd">取 消</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog
      title="编辑备课检查评价项目"
      :visible.sync="editVisible"
      :close-on-click-modal="false">
      <el-form ref="formedit" :model="formedit" label-width="80px" :rules="rules" >
        <el-form-item label="评价项目:" prop="name">
          <el-input v-model="formedit.name" placeholder="请输入" max-length="30"></el-input>
        </el-form-item>
        <el-form-item label="评价细则:" prop="textarea">
          <el-input v-model="formedit.textarea" placeholder="请输入" type="textarea" max-length="1000"></el-input>
        </el-form-item>        
        <el-form-item label="分值:">
          <el-select v-model="formedit.value" placeholder="请选择" prop="select" @change="changeValue()">
            <el-option v-for="(item, index) in options" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSubmit()">确 定</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--备课检查权限-->
    <el-dialog
      title="请选择拥有备课检查权限人员"
      :visible.sync="special"
      size="tiny"
      class="setdialog"
      :close-on-click-modal="false">
      <el-checkbox-group 
        v-model="checkedCities1"
        @change="handleChoose"
        :min="0"
        :max="3">
        <el-checkbox v-for="city in cities" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkSubmit" class="setsubmit">确 定</el-button>
        <el-button @click="checkcancel" class="setcancel">取 消</el-button>
      </span>
    </el-dialog> 

    <!--新增特殊设置-->
    <el-dialog title="选择教师" :visible.sync="teacherselect" class="teacherselect":close-on-click-modal="false">
      <div class="department-dialog">
      <el-input v-model="keyword"></el-input>
      <section class="dept-tree">
        <el-tree
          class="filter-tree"
          :data="deptList"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="deptListClick"
          ref="trees">
        </el-tree>        
      </section>
      </div>
      <div class="department-content">
        <span v-for="(item, i) in deptUserList" @click="deptListDelete(i)">{{item.teacherName}}</span>
      </div>
      <div class="department-button">
        <el-button @click="save">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

    <!--权限设置-->
    <el-dialog
      title="权限设置"
      :visible.sync="setright"
      size="tiny"
      class="setright"
      v-loading="rightloading"
      :close-on-click-modal="false">
      <ul>
        <li v-for="item in setInfo" :key="item">
          <p>
            <span class="grade">{{item.setSectionName}}/
              <span>{{item.setGradeName}}</span>
            </span>
            <el-checkbox  v-model="item.checkAll" @change="handleCheckAllChange($event, item)" class="selectAll" v-if="item.courses.length !== 0">全选</el-checkbox>
            <el-checkbox-group v-model="item.checked" @change="chooseCourses($event, item)">
            <el-checkbox v-for="subject in item.courses" :label="subject.curriculumName" :key="subject.curriculumName">{{subject.curriculumName}}</el-checkbox>
            </el-checkbox-group>
          </p>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveSet">保存</el-button>
      </span>
    </el-dialog>

    <!--删除框-->
    <el-dialog
      title="删除提示"
      :visible.sync="deletebox"
      size="tiny"
      class="deletebox">
      <img src="../../../assets/images/delete-warning.png"><span>您确定要删除这
        <span v-if="deleteGroup === 1">1</span>
        <span v-if="deleteGroup === 2">{{selected.length}}</span>
        项？</span>
      <p>删除后将无法还原</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletesubmit">确 定</el-button>
        <el-button @click="deletebox = false">取 消</el-button>
      </span>
    </el-dialog>
      <!--正在删除弹出框-->
      <el-dialog
        class="deleting"
        v-model="deletingDialogVisible"
        :show-close="false"
        size="tiny">
        <span>
          <vue-loading v-if="!deleteSuccess" type="spiningDubbles" color="#ffffff" :size="{ width: '20px', height: '20px' }"></vue-loading>
          <img v-if="deleteSuccess" style="margin-top: 2px;" src="../../../assets/images/success.png">  
          <span v-if="!deleteSuccess">正在删除</span>
          <span v-if="deleteSuccess" class="delete-success">删除成功</span>
        </span>
      </el-dialog>  
  </div>
</template>

<script>
import querystring from 'querystring'
import { notice, error, success } from '../../../api/index.js'
import { TreeMenu } from './../../../api/tree.js'
const cityOptions = [{id: '1', name: '年级组长'}, {id: '3', name: '学科组长'}, {id: '2', name: '备课组长'}]
export default {
  name: 'lcheckset',
  data () {
    return {
      activeName: 0,
      activename: 0,
      department: 0,
      checkloading: false,
      rightloading: false,
      borderOne: true,
      borderTwo: true,
      borderThree: true,
      borderFour: true,
      tableNew: [],
      checkList: [],
      saveList: [],
      groupIds: '',
      deleteGroup: '',
      deleteIdList: '',
      deletedId: '',
      special: false,
      dialogVisible: false,
      editVisible: false,
      setright: false,
      deletebox: false,
      teacherselect: false,
      deleteSuccess: false,
      deletingDialogVisible: false,
      keyword: '',
      loading: false,
      setId: '',
      groupid: [],
      specialInfo: [],
      jsonStr: [],
      index: '',
      state: 1,
      semesterId: '',
      row: '',
      checkedCourses: [],
      peroid: [],
      grade: [],
      subject: [],
      deptList: [],
      setInfo: [],
      setSectionId: '',
      setSectionName: '',
      setGradeId: '',
      sum: 0,
      setGradeName: '',
      checkedCities1: [],
      checkedCities: [],
      newStr: [],
      dele: false,
      list: [],
      cities: cityOptions,
      courses: [],
      checkAll: false,
      deptUserList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableDataa: [
        {name: '备课检查人员'},
        {name: '特殊设置'}
      ],
      tableData: [],
      semester: [],
      form: {
        name: '',
        textarea: ''
      },
      formedit: {
        name: '',
        textarea: '',
        value: ''
      },
      editvalue: '',
      value: '',
      options: [{
        value: '选项一',
        label: '0.5'
      },
      {
        value: '选项二',
        label: '1'
      },
      {
        value: '选项三',
        label: '1.5'
      },
      {
        value: '选项四',
        label: '2'
      },
      {
        value: '选项五',
        label: '2.5'
      },
      {
        value: '选项六',
        label: '3'
      },
      {
        value: '选项七',
        label: '3.5'
      },
      {
        value: '选项八',
        label: '4'
      },
      {
        value: '选项九',
        label: '4.5'
      },
      {
        value: '选项十',
        label: '5'
      }],
      checkmember: [],
      checkedName: [],
      para: [],
      groupType: 0,
      rules: {
        name: [
          { required: true, message: '请输入评价项目', trigger: 'blur' }
        ],
        textarea: [
          { required: true, message: '请输入评价细则', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    addproject () {
      if (this.sum > 5) {
        notice(this, '所有评价项目对应的分值之和已经大于5分,不能再新增了。', 2000)
      } else if (this.sum === 5) {
        notice(this, '所有评价项目对应的分值之和等于5分,不能再新增了。', 2000)
      } else {
        this.dialogVisible = true
      }
    },
    handleSelectionChange (val) {
      this.selected = val
      if (this.selected.length === 0) {
        this.dele = true
      } else {
        this.dele = false
      }
    },
    deleteAll () {
      if (this.selected === undefined || this.dele === true) {
        notice(this, '您还没有选中要删除的对象', 2000)
        return
      } else {
        this.deletebox = true
        this.deleteGroup = 2
      }
    },
    async getDeptList () {
      await this.$https.get(`/common/selectDeptList?semesterId=${this.semesterId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.deptList = [...res.data.result]
          var arr = [...res.data.result]
          this.deptList.forEach((item, index) => {
            this.$https.get(`/common/selectDeptUserList?deptId=${item.id}&keyword=`)
            .then(res => {
              if (res.data.code === 1) {
                res.data.result.forEach(element => {
                  element.parentId = element.deptId
                  arr.push(element)
                })
                if (index === this.deptList.length - 1) {
                  setTimeout(() => {
                    this.deptList = new TreeMenu(arr).init(0)
                  }, 20)
                }
              } else if (res.data.code === -2) {
                error(this)
              } else {
                notice(this, res.data.message, 3000)
              }
            }).catch(res => {
              notice(this, res.message, 2000)
            })
          })
          console.log(TreeMenu)
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    setRights (index, row) {
      this.setright = true
      this.setId = row.id
      this.para = row.options.map(item => ({...item, type: String(item.sectionId) + String(item.gradeId)}))
      this.getspecialList()
    },
    saveSet () {
      this.list = this.list.filter(item => item.subjectIds)
      if (this.list.length === 0) {
        notice(this, '请选择备课科目！', 2000)
        return
      }
      this.$https.post(`/lessonCheck/specialSetSave`, querystring.stringify({jsonstr: JSON.stringify(this.list), specialId: this.setId}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.getspecialList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      this.setright = false
      this.list = []
      this.checkedName = []
    },
    deptListClick (data) {
      for (var i = 0; i < this.specialInfo.length; i++) {
        if (data.name === this.specialInfo[i].teacherName) {
          notice(this, '该教师已被选中过，不得再选！', 2000)
          return
        }
      }
      if (data.deptId === undefined) return
      let userInfo = {
        teacherId: data.userId,
        teacherName: data.name
      }
      this.count = 0
      try {
        this.deptUserList.forEach((item, index) => {
          if (item.teacherId === userInfo.teacherId) this.count++
        })
      } catch (e) {
        this.deptUserList = []
      }
      if (this.count === 0) {
        this.deptUserList.push(userInfo)
      }
    },
    deptListDelete (i) {
      this.deptUserList.splice(i, 1)
    },
    handleClick () {},
    handleDelete (index, row) {
      this.tableData.splice(index, 1)
      this.sum = this.sum - row.score
    },
    Delete (index, row) {
      this.deletedId = row.id
      this.deletebox = true
      this.deleteGroup = 1
    },
    deletesubmit () {
      if (this.deleteGroup === 1) {
        this.$https.post(`/lessonCheck/specialDelete`, querystring.stringify({id: this.deletedId}))
        .then(res => {
          if (res.data.code === 1) {
            this.deletebox = false
            this.deletingDialogVisible = true
            this.getspecialList()
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      } else if (this.deleteGroup === 2) {
        this.deleteIdList = this.selected.map(n => n.id).join(',')
        this.$https.post(`/lessonCheck/specialDeleteBatch`, querystring.stringify({ids: this.deleteIdList}))
          .then(res => {
            if (res.data.code === 1) {
              this.deletebox = false
              this.deletingDialogVisible = true
              setTimeout(() => {
                this.getspecialList()
              }, 1000)
            } else if (res.data.code === -2) {
              error(this)
            } else {
              notice(this, res.data.message, 3000)
            }
          })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      }
    },
    handleEdit (index, row) {
      this.editvalue = this.tableData[index].score
      this.editVisible = true
      this.formedit.name = this.tableData[index].title
      this.formedit.textarea = this.tableData[index].checkpoint
      this.formedit.value = this.tableData[index].score
      this.index = index
    },
    editSubmit () {
      this.sum = Number(this.sum) - Number(this.tableData[this.index].score) + Number(this.editvalue)
      this.tableData[this.index].title = this.formedit.name
      this.tableData[this.index].checkpoint = this.formedit.textarea
      this.tableData[this.index].score = this.editvalue
      this.editVisible = false
    },
    changeValue () {
      let obj = {}
      obj = this.options.find((item) => {
        return item.value === this.formedit.value
      })
      this.editvalue = obj.label
    },
    canceladd () {
      this.dialogVisible = false
      this.form.name = ''
      this.form.textarea = ''
      this.value = ''
    },
    submit () {
      if (!this.form.name || !this.form.textarea || !this.value) {
        notice(this, '请您完整填写项目评价信息！', 3000)
        return
      }
      this.dialogVisible = false
      let obj = {}
      obj = this.options.find((item) => {
        return item.value === this.value
      })
      this.value = obj.label
      this.loading = true
      this.sum = Number(this.sum) + Number(this.value)
      setTimeout(() => {
        const obj = { title: this.form.name, checkpoint: this.form.textarea, score: this.value }
        this.tableData.push(obj)
        this.loading = false
        this.form.name = ''
        this.form.textarea = ''
        this.value = ''
      }, 300)
    },
    savePoint () {
    // 备课检查项目保存
      this.tableNew = []
      this.tableData.forEach((item, index) => {
        let str = {}
        str.id = item.id
        str.companyId = item.companyId
        str.title = item.title
        str.checkpoint = item.checkpoint
        str.score = item.score
        this.tableNew.push(str)
      })
      this.$https.post(`/lessonCheck/checkPointSave`, querystring.stringify({jsonstr: JSON.stringify(this.tableNew)}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.getCheckList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    // 全选
    handleCheckAllChange (event, item) {
      item.checked = event.target.checked ? item.courses.map(subject => subject.curriculumName) : []
      // 全选 =》 清除
      if (!item.checkAll) {
        for (let i = 0; i < this.list.length; i++) {
          if (item.setSectionId === this.list[i].sectionId && item.setGradeId === this.list[i].gradeId) {
            this.list.splice(i, 1)
          }
        }
      } else {
        if (item.checked.length === 0) {
          this.addSubject(item)
        } else if (item.checked.length > 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (item.setSectionId === this.list[i].sectionId && item.setGradeId === this.list[i].gradeId) {
              this.list.splice(i, 1)
            }
          }
          this.addSubject(item)
        }
      }
    },
    chooseCourses (value, item) {
      // 选中学科的名称数组value
      let checkedCount = value.length
      item.checkAll = checkedCount === item.courses.length
      if (!this.list.length) {
        // 创建已选学科数组对象并push进已选数组中
        this.addSubject(item)
      } else {
        let arr = this.list.map(items => items.type)
        let adjust = arr.indexOf(item.type)
        // 如果当前选中的与已选学科数组的学段和年级相等，则删除该对象
        if (adjust !== -1) {
          this.list.splice(adjust, 1)
        }
        this.addSubject(item)
      }
    },
    addSubject (item) {
      let a = {}
      a.id = ''
      a.sectionId = item.setSectionId
      a.gradeId = item.setGradeId
      a.semesterId = this.semesterId
      a.gradeName = item.setGradeName
      a.sectionName = item.setSectionName
      a.subjectNames = item.checked.join(',')
      a.type = item.type
      let arr = []
      // 获取已选学科的id数组
      for (var child = 0; child < item.checked.length; child++) {
        for (var n = 0; n < item.courses.length; n++) {
          if (item.checked[child] === item.courses[n].curriculumName) {
            arr.push(item.courses[n].id)
          }
        }
      }
      arr = arr.join(',')
      a.subjectIds = arr
      this.list.push(a)
    },
    addspecial () {
      this.teacherselect = true
      this.getDeptList()
    },
    handleIconClick () {},
    save () {
      if (!this.deptUserList) {
        notice(this, '请选择您要添加的教师！', 2000)
        return
      }
      this.teacherselect = false
      this.$https.post(`/lessonCheck/specialSave`, querystring.stringify({json: JSON.stringify(this.deptUserList)}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.getspecialList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
      this.deptUserList = []
    },
    cancel () {
      this.teacherselect = false
      this.deptUserList = []
    },
    getCheckList () {
      this.sum = 0
      this.loading = true
      setTimeout(() => {
        this.$https.get(`/lessonCheck/checkPointList`)
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.result
            this.tableData.forEach(item => {
              this.sum = this.sum + item.score
            })
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
          this.loading = false
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      }, 0)
    },
    getspecialList () {
      this.checkedName = []
      this.$https.get(`/lessonCheck/specialList`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result.length === 0) {
            this.specialInfo = []
            return
          }
          this.specialInfo = res.data.result
          // this.para应用给this.list
          this.list = [...this.para]
          this.list = this.list.filter(item => item.subjectIds)
          for (var m = 0; m < this.setInfo.length; m++) {
          // 遍历已选学科
            this.checkedName = []
            for (var n = 0; n < this.para.length; n++) {
              if (this.para[n].gradeId === this.setInfo[m].setGradeId && this.para[n].sectionId === this.setInfo[m].setSectionId) {
              // 获取specialInfo.options 中的 subjecs 然后遍历
                this.checkedName = []
                for (var d = 0; d < this.para[n].subjectIds.split(',').length; d++) {
                  for (var h = 0; h < this.setInfo[m].courses.length; h++) {
                    // 判断已选的学科id是否有与完整数组的学科id相等的。相等取出已选中的学科名称
                    if (this.para[n].subjectIds.split(',')[d].toString() === this.setInfo[m].courses[h].id.toString()) {
                      this.checkedName.push(this.setInfo[m].courses[h].curriculumName)
                      this.setInfo[m].checked = this.checkedName
                      if (this.setInfo[m].checked.length === this.setInfo[m].courses.length) {
                        this.setInfo[m].checkAll = true
                      }
                    }
                  }
                }
              }
            }
          }
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
        this.loading = false
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    getSelectSemesterList () {
      // 获取学期信息列表
      this.$https.get(`/common/selectSemesterList`)
        .then(res => {
          if (res.data.code === 1) {
            this.semester = res.data.result
            this.semester.forEach((item, index) => {
              if (item.state === this.state) {
                this.semesterId = item.semesterId
                this.getSectionList()
              }
            })
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
    },
    getSectionList () {
      // 获取学段
      this.rightloading = true
      this.$https.get(`/common/sectionList`)
      .then(async res => {
        if (res.data.code === 1) {
          this.peroid = res.data.result
          for (let i = 0; i < this.peroid.length; i++) {
            await this.$https.get(`/common/selectGradeClassList?sectionId=${this.peroid[i].id}&semesterId=${this.semesterId}`)
              .then(async res => {
                if (res.data.code === 1) {
                  this.peroid[i].classes = res.data.result.map(item => ({...item, type: String(this.peroid[i].id) + item.id}))
                  for (let j = 0; j < this.peroid[i].classes.length; j++) {
                    await this.$https.get(`/common/selectCourseList?sectionId=${this.peroid[i].id}&gradeId=${this.peroid[i].classes[j].id}&semesterId=${this.semesterId}`)
                    .then(res => {
                      if (res.data.code === 1) {
                        this.peroid[i].classes[j].subjects = res.data.result.map(item => ({...item, type: String(this.peroid[i].id) + this.peroid[i].classes[j].id}))
                        this.courses = this.peroid[i].classes[j].subjects
                        for (var m = 0; m < this.courses.length; m++) {
                          this.courses[m].gradeId = this.peroid[i].classes[j].id
                        }
                        this.setSectionId = this.peroid[i].id
                        this.setSectionName = this.peroid[i].name
                        this.setGradeId = this.peroid[i].classes[j].id
                        this.setGradeName = this.peroid[i].classes[j].name
                        let type = this.peroid[i].classes[j].type
                        this.setInfo.push({ setSectionId: this.setSectionId, setSectionName: this.setSectionName, setGradeId: this.setGradeId, setGradeName: this.setGradeName, courses: this.courses, checkAll: false, checked: [], type })
                      } else if (res.data.code === -2) {
                        error(this)
                      } else {
                        notice(this, res.data.message, 3000)
                      }
                    })
                  }
                } else if (res.data.code === -2) {
                  error(this)
                } else {
                  notice(this, res.data.message, 3000)
                }
              })
              .catch(res => {
                notice(this, res.message, 2000)
              })
          }
          this.peroid.forEach(async (item, index) => {
            // 获取年级数据

          })
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
        this.rightloading = false
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    handleChoose () {
      this.groupIds = this.checkedCities1.map(n => n).join(',')
    },
    getCheckUserList () {
      this.checkedCities1 = []
      this.$https.get(`/lessonCheck/checkUserList`)
        .then(res => {
          if (res.data.code === 1) {
            this.checkList = res.data.result
            for (let i = 0; i < this.checkList.length; i++) {
              if (this.checkedCities1.indexOf(String(this.checkList[i].groupType)) < 0) {
                this.checkedCities1.push(String(this.checkList[i].groupType))
              }
            }
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
    },
    checkSubmit () {
      if (this.groupIds.length === 0) {
        notice(this, '您还没有选择备课检查权限人员！', 3000)
        return
      }
      this.special = false
      this.checkloading = true
      this.checkList = []
      this.saveList = []
      this.$https.get(`/common/selectUserByGroup?groupIds=${this.groupIds}&semesterId=${this.semesterId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.checkmember = res.data.result
          this.checkmember.forEach((item, index) => {
            this.groupType = item.groupType
            if (!item.teacherLeaderDTO) {
              return
            }
            item.teacherLeaderDTO.forEach((leader, index) => {
              let leaderInfo = {}
              let para = {}
              let a = true
              leaderInfo.courseName = leader.courseName
              leaderInfo.sectionName = leader.sectionName
              if (leader.gradeLeader) {
                leaderInfo.teacherName = leader.gradeLeader.gradeTeacher
                para.teacherId = leader.gradeLeader.teacherId
                para.teacherName = leader.gradeLeader.gradeTeacher
                para.semesterId = leader.gradeLeader.semesterId
                para.courseId = 0
                para.groupType = this.groupType
              } else if (leader.lessonLeader) {
                leaderInfo.teacherName = leader.lessonLeader.teacherName
                para.teacherId = leader.lessonLeader.teacherId
                para.teacherName = leader.lessonLeader.teacherName
                para.semesterId = leader.lessonLeader.semesterId
                para.courseId = leader.courseId
                para.groupType = this.groupType
              } else if (leader.subjectLeader) {
                leaderInfo.teacherName = leader.subjectLeader.teacherName
                para.teacherId = leader.subjectLeader.teacherId
                para.teacherName = leader.subjectLeader.teacherName
                para.semesterId = leader.subjectLeader.semesterId
                para.courseId = leader.courseId
                para.groupType = this.groupType
              }
              para.sectionId = leader.sectionId
              para.gradeId = leader.gradeId
              para.sectionName = leader.sectionName
              para.courseName = leader.courseName
              para.gradeName = leader.gradeName
              if (para.teacherId === null) {
                a = false
              }
              if (a) {
                this.saveList.push(para)
              }
              this.checkList.push(leaderInfo)
            })
          })
          if (this.saveList.length === 0) {
            success(this, '暂无数据，无法保存！', 2000)
            this.checkloading = false
            this.checkedCities1 = []
            return
          }
          this.$https.post(`/lessonCheck/checkUserAdd`, querystring.stringify({json: JSON.stringify(this.saveList)}))
        .then(res => {
          if (res.data.code === 1) {
            success(this, res.data.message, 2000)
            this.getCheckUserList()
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
        this.checkloading = false
        this.checkedCities1 = []
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    checkcancel () {
      this.special = false
      this.checkedCities1 = []
    }
  },
  created () {
    this.getCheckList()
    this.getSelectSemesterList()
    this.getspecialList()
    this.getCheckUserList()
  },
  watch: {
    deletingDialogVisible () {
      if (this.deletingDialogVisible === true) {
        setTimeout(() => {
          this.deleteSuccess = true
        }, 1000)
      } else {
        this.deleteSuccess = false
      }
    },
    deleteSuccess () {
      if (this.deleteSuccess === true) {
        setTimeout(() => {
          this.deletingDialogVisible = false
        }, 300)
      }
    },
    keyword (val) {
      this.$refs.trees.filter(val)
    },
    setright () {
      for (var s = 0; s < this.setInfo.length; s++) {
        this.setInfo[s].checked = []
        this.setInfo[s].checkAll = false
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#lcheckset {
  .el-tabs {
    margin-top: 40px;
    .el-tabs__header {
      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            margin-left: 70px;
          }
        }
      }
    }

    .el-tabs__content {
      width: inherit;
      height: inherit;
      padding: 30px 70px 0px 60px;
      position: relative;
      /*第一级tab*/
      .el-tab-pane {
          /*评价项目设置*/
          &:nth-child(1) {
            p {
              color: #408EE6;
              font-weight: bold;
              margin-bottom: 24px;
            }
            .el-table {
              .el-table__header-wrapper {
                .el-table__header {
                    width: 100% !important;
                    tr {
                      th {
                        text-align: center;
                        .cell {
                          color: #636C7B;
                        }  
                      }
                    }
                }
              }
              .el-table__body-wrapper {

              .el-table__body {

                width: 100% !important;
                tr {
                  td {
                    text-align: center;
                    .cell {
                      color: #636C7B;
                    }

                    &:last-child {
                      .cell {
                        padding: 0px 50px 0px 60px;
                        display: flex;
                        justify-content: center;
                        span {
                          display: block;
                          float: left;
                          &:hover {
                            cursor: pointer;
                          }
                          i {
                            width: 24px;
                            height: 24px;
                            display: block;
                            float: left;
                            margin-right: 10px;
                          }
                          margin-right: 5%;
                        }
                    .edit {
                        i {
                        background: url(../../../assets/images/edit-icon.png) no-repeat;
                        }
                    }
                    .edit:hover {
                        cursor: pointer;
                        i {
                        background: url(../../../assets/images/edit-icon-active.png) no-repeat;
                        }
                        color: #408EE6;
                    }
                   .delete {
                     i {
                       background: url(../../../assets/images/delete-icon.png) no-repeat;
                     }
                   }
                  .delete:hover {
                      cursor: pointer;
                      i {
                      background: url(../../../assets/images/delete-icon-active.png) no-repeat;
                      }
                      color: #FF6C60;
                  }                        
                      }
                    }                   
                  }
                }
              }
              .el-table__empty-block {
                  width: 100% !important;
                }
              }
            }

            .el-button {
              position: absolute;
              top: 26px;
              right: 60px;
              width: 100px;
              height:　30px;
              border: 1px solid #408EE6;

              span {
                color: #408EE6;
                img {
                  position: absolute;
                  top: -2px;
                  right: 10px;
                }
              }
              &:hover {
                background: #408EE6;

                span {
                  color: #fff;
                }
              }
            }
            .save {
              position: static;
              margin-top: 148px;
              margin-left: 45%;
            }
            .illustrate {
              position: absolute;
              font-weight: normal;
              bottom: 50px;
              &>span {
                color: #FF6C60;
              }
              &>ul {
                li {
                  list-style-type: decimal;
                  color: #B7C2D0;
                }
              }
            }
      }

          /*备课检查权限设置*/
          &:nth-child(2) {
                
            .courseplan {
              position: relative;
              /*.cell {
                color: #636C7B;
              }*/
              .el-tabs {
                  height: auto;
                  padding: 5px 30px 0px 37px;
                  margin-bottom: 40px;
                  min-height: 800px;
                  position: relative;
                  margin-top: 0px;
                  
                  .el-tabs__header {
                      margin: 0px;
                      z-index: 20;
                      border: none;
                      width: 56%;

                      .el-tabs__nav-wrap {
                          .el-tabs__nav-scroll {
                              .el-tabs__nav {

                                  .el-tabs__item {
                                      border-left: 1px solid #ccc;
                                      border-right: 1px solid #ccc;
                                      border-top: 1px solid #ccc;
                                      background: #DDE6EF;
                                      width: 129px;
                                      height: 40px;
                                      border-top-left-radius: 8px;
                                      border-top-right-radius: 8px;
                                      box-shadow: 0px 0px 5px #E1E5EB;        
                                      text-align: center;                                                           
                                  }
                                  .is-active {
                                      background: #fff;
                                  }
                              }
                          }
                      }
                  }
                  .el-tabs__content {
                      position: absolute;
                      left: -24px;
                      width: 100%;
                      height: 767px;
                      padding-left: 20px;
                      padding-right: 20px;
                      border: 1px solid #ccc;
                      z-index:　10;
                      border-radius: 4px;

                      .el-tab-pane {

                        /*备课检查人员*/
                        &:first-child {
                          width: inherit;
                          height: inherit;

                          .el-table {
                            .el-table__header-wrapper {
                              .el-table__header {
                                width: 100% !important;
                                thead {
                                  tr {
                                    th {
                                      color: #636C7B;
                                      font-weight: normal;
                                    }
                                  }
                                }
                              }
                            }
                            .el-table__body-wrapper {
                              .el-table__body {
                                tr {
                                  td {
                                    &:last-child {
                                      &:hover {
                                        cursor: auto;
                                        .cell {
                                          span {
                                            color: #636C7B;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                                .cell {
                                  color: #636C7B;
                                }
                              }
                              .el-table__empty-block {
                                width: 100% !important;
                              }
                            }

                          }
                        }
                        /*特殊设置*/
                        &:last-child {
                          width: inherit;
                          height: inherit;
                          position: relative; 

                          .el-table {
                            .el-table__header-wrapper {
                              .el-table__header {
                                width: 100% !important;
                                thead {
                                  tr {
                                    th {
                                      text-align: left;
                                      .cell {
                                        color: #636C7B;
                                      }
                                      font-weight: normal;

                                      &:nth-child(4), &:nth-child(3) {
                                        text-align: center;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            .el-table__body-wrapper {
                              .el-table__body {
                                width: 100% !important;
                                tbody {
                                  tr {
                                    td {
                                      .cell {
                                        color: #636C7B;
                                        overflow: hidden;
                                        white-space:nowrap;
                                        -ms-text-overflow:ellipsis;
                                        -o-text-overflow:ellipsis;
                                        text-overflow:ellipsis;                                       
                                      }
                                      &:nth-child(2) {
                                        text-align: left;
                                      }
                                      &:nth-child(3) {
                                        width:321px;
                                        overflow: hidden;
                                        white-space:nowrap;
                                        -ms-text-overflow:ellipsis;
                                        -o-text-overflow:ellipsis;
                                        text-overflow:ellipsis;
                                        text-align: center;
                                        span {
                                          margin-right: 10px;
                                        }
                                      }
                                      &:nth-child(4) {
                                        .cell {
                                          text-align: center;
                                          color: #636C7B;
                                          padding-left: 30%;
                                          span {
                                            display: block;
                                            float: left;
                                            margin-right: 10%;

                                            i {
                                              width: 24px;
                                              height: 24px;
                                              display: block;
                                              float: left;
                                              margin-right: 8px;
                                            }
                                           &:hover {
                                                cursor: pointer;
                                              }
                                              &:first-child {
                                                i {
                                                background: url(../../../assets/images/rights.png) no-repeat;
                                                }
                                                &:hover {
                                                  color: #408EE6;

                                                  i {
                                                    background: url(../../../assets/images/rights-active.png) no-repeat;
                                                  }
                                                }
                                              }
                                              &:last-child {
                                                i {
                                                background: url(../../../assets/images/delete-icon.png) no-repeat;
                                              }
                                                &:hover {
                                                color: #FF6C60;
                                                  i {
                                                    background: url(../../../assets/images/delete-icon-active.png) no-repeat;
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
                              .el-table__empty-block {
                                width: 100% !important;
                              }
                            }
                          }
                        }
                          
                      }
                  }
              }
              .set {
                position: absolute;
                top: 0px;
                right: 12px;
                width: 100px;
                height:　30px;
                border: 1px solid #408EE6;

                span {
                  color: #408EE6;
                    img {
                      position: absolute;
                      top: -2px;
                      right: 10px;
                    }
                }
                &:hover {
                  background: #408EE6;

                  span {
                    color: #fff;
                  }
                }
              }
              .button-group {
                position: absolute;
                top: 0px;
                right: 12px;
                .addbutton {
                  span {
                    img {
                      position: absolute;
                      top: -1px;
                      right: 145px;
                    }
                  }
                }
                .deleteall {
                  span {
                    img {
                      position: absolute;
                      top: -1px;
                      right: 10px;
                    }
                  }
                }
                .el-button {
                  border: 1px solid #408EE6;
                  span {
                    padding: 10px 15px;
                    color: #408EE6;
                  }
                  &:hover {
                    background: #408EE6;
                    cursor: pointer;
                    span {
                      color: #fff;
                    }
                  }
                }
              }
            }
            }
          }
    }
  }
  /*弹出框*/
  .el-dialog__wrapper {
    .el-dialog {
      padding: 0px 56px;
      position: relative;
      width: 485px;
      background: url(../../../assets/images/top-border.png)no-repeat;
      background-color: #fff;
      border-radius: 14px;
      box-shadow: 0 0 5px #ccc;
      top: 15%;

      .el-dialog__header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #DAE2ED;
      
        .el-dialog__title {
         color: #408EE6;
        }
        .el-dialog__headerbtn {
          width: 22px;
          height: 22px;
          position: absolute;
          top: 20px;
          right: 30px;
          background: url(../../../assets/images/dialog-close.png) no-repeat;

          &:hover {
            background: url(../../../assets/images/dialog-close-hover.png) no-repeat;
          }
           i {
            /*font-size: 12px;
            color: #DAE2ED;
            padding: 5px;*/
            display: none;
           }
         }
      }
      .el-dialog__body {
        padding: 40px 0px 0px 0px;
        form {
          .el-form-item {
            margin-right: 0px;
            margin-bottom: 18px;
            margin-left: 0px;
            width: 100%;
            .el-form-item__label {
              text-align: center;
              &:before {
                content: '';
              }
            }
            .el-form-item__content {
              .el-input 
              {
                width: 290px;
                height: 30px;
              }
            }
            &:nth-child(2) {
              .el-form-item__content {
                .el-textarea {
                 .el-textarea__inner {
                    resize: none;
                    height: 80px;
                 }

                }

              }
            }
            
            &:last-child {
              .el-form-item__label {
                text-align: center;
                letter-spacing: 10px;
                padding-left: 2px;
              }
            }
          }
        }
      }
      .el-dialog__footer {
        text-align: center;
        margin-top: 50px;
        padding-bottom: 30px;
        
        .el-button {
          padding: 0px;
          width: 90px;
          height: 30px;
          &:nth-child(2) {
            border: 1px solid #FF6C60;
            span {
              color: #FF6C60;
            }
            &:hover {
              background: #FF6C60;

              span {
                color: #fff;
              }
            }
          }
          &:nth-child(1) {
            margin-left: 20px;
            border: 1px solid #408EE6;
            span {
              color: #408EE6;
            }
            &:hover {
              background: #408EE6;

              span {
                color: #fff;
              }
            }            
          }
        }
      }
    }
  }
  .setdialog {
    .el-dialog {
      .el-dialog__body {
        position: relative;
        height: 364px;
        .el-checkbox-group {
         margin-top: 38%;
         text-align: center;
        }

        .setsubmit {
          width: 90px;
          height:　30px;
          border: 1px solid #408EE6;
          position: absolute;
          bottom: 20px;
          left: 20%;

          span {
            color: #408EE6;
          }
          &:hover {
            background: #408EE6;

            span {
              color: #fff;
            }
          }
        }
        .setcancel {
          width: 90px;
          /*height: 30px;*/
          border: 1px solid #FF6C60;
          position: absolute;
          bottom: 20px;
          right: 20%;

          span {
            color: #FF6C60;
          }
          &:hover {
            background: #FF6C60;

            span {
              color: #fff;
            }
          }
          
        }
        
      }
    }
  }

  .setright {
    .el-checkbox-group {
      margin-left: 70px;
    }
    .el-dialog {
      width: 800px;
      background: url(../../../assets/images/setright.png) no-repeat;
      background-color: #fff;
      .el-dialog__body {
        height: 450px;
        overflow: auto;
        ul {
          li {
            list-style-type: none;
            padding-bottom: 28px;
            border-bottom: 1px dashed #DAE2ED;

            &:last-child {
              border-bottom: none;
            }
           
           .grade {
             padding-top: 20px;
             padding-bottom: 28px;
             display: block;
             color: #408EE6;
             font-weight: bold;
             font-size: 14px;             
           }
          .selectAll {
            float: left;
            padding-right: 18px;
            border-right: 1px solid #ACB1B9;
            color: #636C7B;
            margin-right: 2%;

            .el-checkbox__input {
              margin: 0px;
              
              .el-checkbox__inner {
                margin: 0px;
              }
            }
          }
          div {
            /* margin: 0px !important; */
          }
          .el-checkbox {
            color: #636C7B;
            margin-right: 2%;

            span {
              margin-left: 2%;
            }
          }
          }
        }
      }
      .el-dialog__footer {
        text-align: center;
        .el-button {
          padding: 0px;
          width: 90px;
          height: 30px;
          border: 1px solid #FF6C60;

          span {
            color: #FF6C60;
          }
          &:hover {
            background: #FF6C60;

            span {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .deletebox {
    .el-dialog {
      .el-dialog__body{
        border-top: 1px solid #ddd;
        text-align: center;
        padding: 46px 0;
        margin: 0 46px;
        img{
          vertical-align: middle;
          margin-right: 10px;
        }
        &>span{
          font-size: 15px;
          color: #636C7B;
        }
        p{
          font-size: 12px;
          color: #BCC6D3;
          margin-top: 10px;
        }
        &>sup{
          position: absolute;
          top: 0;
          left: 20px;
          width: 35px;
          height: 5px;
          background: #9FD35D;
        }
        &>i{
          cursor: pointer;
          width: 22px;
          height: 22px;
          position: absolute;
          background: url(../../../assets/images/dialog-close.png) no-repeat;
          top: 15px;
          right: 10px;
          &:hover{
            background: url(../../../assets/images/dialog-close-hover.png) no-repeat;
          }
        }
      }
      .el-dialog__footer {
        text-align: center;
        /*.dialog-footer {*/
          .el-button {
            width: 90px;
            height: 30px;
            position: relative;
            padding: 0px;

            &:hover {
              pointer: cursor;
            }
            span {
              position: absolute;
              width: 90px;
              height: 30px;
              top: 0px;
              left: 0px;
              display: block;
              text-align: center;
              line-height: 30px;
            }
            &:first-child {
              border: 1px solid #408EE6;
              span {
                color: #408EE6;
              }
              &:hover {
                background: #408EE6;
                span {
                  color: #fff;
                }
              }
            }
            &:last-child {
              border: 1px solid #FF6C60;
              span {
                color: #FF6C60;
              }
              &:hover {
                background: #FF6C60;

                span {
                  color: #fff;
                }
              }
            }
          }
        /*}*/
      }
    }
  }
      // 正在删除弹出框
  .deleting {
    background: rgba(204,204,204,0.2);
    .el-dialog{
      width: 140px;
      height: 30px;
      background: #7A7A7A;
      .el-dialog__header{
        display: none;
      }
      .el-dialog__body{
        padding: 0;
        color: #fff;
        &>span{
          position: absolute;
          top: 0;
          left: 20px;
          line-height: 45px;
          img{
            position: absolute;
            top: 4px;
            right:-20px;
          }
          span{
            position: absolute;
            width:130px;
            top: -5px;
            right:-150px;
          }
          .packaging{
            background: #7A7A7A;
            position: absolute;
            width:130px;
            line-height: 32px;
            top:0;
            right:-150px;
          }
          .delete-success{
            position: absolute;
            width:130px;
            top: -5px;
            right:-170px;
          }
        }
      }
    }
  }
    .teacherselect {
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      .el-dialog--small {
        padding: 0px 26px;
        width: 487px;
        color: #666;
        .el-dialog__title {
          font-weight: normal;
          color: #666;
        }
      }
      .department-dialog {
        height: 348px;
        width: 187px;
        float: left;        
        .dept-tree {
          border: 1px solid #dadada;
          margin-top: 10px;
          height: 302px;
          border-radius: 6px;
          overflow: auto;
          .el-tree.filter-tree {
            border: none;
          }
        }
      }
      .department-content {
        height: 348px;
        border: 1px solid #dadada;
        width: 234px;
        float: right;
        border-radius: 6px;
        overflow: auto;
        padding: 5px;
        box-sizing: border-box;
        span {
          display: inline-block;
          padding: 5px 10px;
          border: 1px solid #ddd;
          margin: 5px;
          cursor: pointer;
          &:hover {
            border: 1px solid rgb(113, 195, 255);
            color: rgb(113, 195, 255);
          }
          &:active {
            border: 1px solid #ddd;
            color: #666;
          }
        }

      }
      .department-button {
        height: 59px;
        clear: both;
        text-align: center;
        padding-top: 10px;
        box-sizing: border-box;
        
        .el-button {
          width: 87px;
          height: 37px;
          border: none;
          background: #fff;
          &:nth-child(1) {
            border: 1px solid #408EE6;
            span {
              color: #408EE6;
                img {
                position: absolute;
                top: -5px;
                right: 10px;
              }
            }
            &:hover {
              background: #408EE6;

              span {
                color: #fff;
              }
            }
          }
          &:nth-child(2) {
          border: 1px solid #FF6C60;            
          span {
            color: #FF6C60;
              img {
              position: absolute;
              top: -5px;
              right: 10px;
            }
          }
          &:hover {
            background: #FF6C60;

            span {
              color: #fff;
            }
          }            
          }
        }
      }
    }
}

</style>
