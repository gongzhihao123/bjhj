<template>
  <div class="coefficient common" v-loading="loading">
    <div class="box" @click="addNew">+</div>
    <div class="content-box" v-for="item in list" :key="item.title">
      <div class="content-box-head" v-if="item.rule">
        <span v-show="item.rule.name.length < 16">{{ item.rule.name }}</span>
        <span v-show="item.rule.name.length > 16" style="font-weight: bold;">{{ item.rule.name.substring(0,17) }}...</span>
      </div>
      <div class="content-box-content" v-if="item.rule">
        <p>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级: 
          <span v-for="(items, i) in item.grades" :key="items.sectionName" v-show="i < 2">{{ items.sectionName }}{{ items.gradeName }} </span>
          <span v-show="item.grades.length > 2" style="font-weight: bold;">...</span>
        </p>
        <p>规则类型: {{ typeName }}</p>
        <p>
          考试科目: 
          <section>
            <p>
              <span class="blue span">必考科目</span>
              <span class="sublist">
                <span v-for="items in item.mustCourse" :key="items.courseName">{{ items.courseName }} </span>
              </span>
            </p>
            <p>
              <span class="green span">选考科目</span>
              <span class="sublist">
                <span v-for="items in item.chooseCourse" :key="items.courseName">{{ items.courseName }} </span>
              </span>
            </p>
          </section>
        </p>
      </div>
      <div class="content-box-foot">
        <span class="spans" @click="lookDetails(item)">
          <img :src="smallIcons.check" alt="">
          <img :src="smallIcons.checking" alt="">
          <span class="tooltip">查看</span>
        </span>
        
        <span class="spans" @click="changeDetails(item)">
          <img :src="smallIcons.edit" alt="">
          <img :src="smallIcons.editing" alt="">
          <span class="tooltip">编辑</span>
        </span>

        <span class="spans" @click="deleteDetails(item)">
          <img :src="smallIcons.delete" alt="">
          <img :src="smallIcons.deleteing" alt="">
          <span class="tooltip">删除</span>
        </span>
      </div>
    </div>

    <!--新增总分相加弹框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :show-close="false">
      <i class="el-icon-close close" @click="dialogShow = false"></i>
      <table class="dialog-table-content">
        <tr>
          <td>规则名称：</td>
          <td>
            <el-input v-model="ruleName" placeholder="请填写规则名称" class="dialog-table-input" :maxlength="20"></el-input>
          </td>
        </tr>
        <tr>
          <td>规则类型：</td>
          <td>
            <el-select v-model="ruleType" placeholder="请选择" class="dialog-table-input">
              <el-option
                v-for="item in ruleTypeList"
                :key="item.type"
                :label="item.name"
                :disabled="item.disabled"
                :value="item.type">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <div class="tooltip">
              <div>提示：</div>
              <div>
                <p>总分相加是将各科目总分直接相加</p>
                <p>系数折算是根据学生选科分数由高到低分别按照100%、80%、60%的系数折算成实际分数相加</p>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="position: relative;">
            <span style="position: absolute;top: 20px;right: 0px;">年级：</span>
          </td>
          <td>
            <section v-for="(item, index) in sectionAddGradeList" :key="item.name" class="dialog-table-section">
              <p>
                <el-radio v-model="checkedAll" @change="handleCheckchangeAll(item)" :label="index">{{ item.name }}</el-radio>
              </p>
              <p class="dialog-table-checkbox">
                <el-checkbox v-model="items.checked"
                              v-for="(items, i) in item.gradeList"
                              :key="items.name"
                              :disabled="checkedAll != index"
                              @change="getCheckState(items, item)">{{ items.gradeName }}
                </el-checkbox>
              </p>
            </section>
          </td>
        </tr>
        <tr>
          <td style="position: relative;">
            <span style="position: absolute;top: 0;right: 0px;">考试科目：</span>
          </td>
          <td>
            <table class="subject-list">
              <tr>
                <td>必考</td>
                <td>
                  <span v-for="(item, i) in mustList" :key="item.courseName" class="must-subject blue">{{ item.courseName }}<em class="small-close"  @click="deleteSubject(1, i)">x</em></span>
                  <span class="add-subject low-blue el-icon-plus" @click="addMustSubject"></span>
                </td>
              </tr>
            </table>
            <table class="subject-list">
              <tr>
                <td>选考</td>
                <td>
                  <span v-for="(item, i) in chooseList" :key="item.courseName" class="must-subject green">{{ item.courseName }}<em class="small-close" @click="deleteSubject(2, i)">x</em></span>
                  <span class="add-subject low-green el-icon-plus" @click="addChooseSubject"></span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="saveDetails">保 存</el-button>
      </span>
    </el-dialog>

    <!--查看弹框-->
    <el-dialog
      class="look-details"
      :title=detailsTitle
      :visible.sync="lookDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="lookDialog = false"></i>
      <table class="look-details-table">
        <tr>
          <td>规则类型：</td>
          <td>{{ typeName }}</td>
        </tr>
        <tr>
          <td style="position: relative;">
            <span style="position: absolute;top: 4px;right: 0px;">年级：</span>
          </td>
          <td><span v-for="items in details.grades" :key="items.sectionName" class="look-dialog-grade">{{ items.sectionName }}{{ items.gradeName }}   </span></td>
        </tr>
        <tr>
          <td>
            <span>必考科目：</span>
          </td>
          <td><span v-for="items in mustCourse" :key="items.courseName" class="look-dialog-grade">{{ items.courseName }} </span></td>
        </tr>
        <tr>
          <td>
            <span>选考科目：</span>
          </td>
          <td><span v-for="items in chooseCourse" :key="items.courseName" class="look-dialog-grade">{{ items.courseName }} </span></td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDetail">编 辑</el-button>
      </span>
    </el-dialog>

    <!--删除-->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="deleteDialog = false"></i>
      <span>确定要删除当前规则设置吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteOne(item)">确 定</el-button>
      </span>
    </el-dialog>

    <!--新增考试科目-->
    <el-dialog
      class="addNewSubject"
      :title=addSubjectName
      :visible.sync="addMustSubjectDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="addMustSubjectDialog = false"></i>
      <div>
        <span>学科：</span>
        <el-select v-model="subjectId" placeholder="请选择" class="dialog-table-input">
          <el-option
            v-for="(item, i) in subjectLists"
            :key="item.id"
            :label="item.name"
            :disabled="item.disabled"
            :value="i">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addMustSubjectDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSubject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { error, notice, success } from '../../../api/index.js'
import * as smallIcons from '../../../assets/icons/index.js'
import querystring from 'querystring'
export default {
  name: 'coefficient',
  data () {
    return {
      loading: false,
      dialogShow: false,
      lookDialog: false,
      deleteDialog: false,
      smallIcons,
      addMustSubjectDialog: false,
      addSubjectName: '',
      sectionAddGradeList: [],
      list: [],
      type: '',
      value: '',
      input: '',
      dialogTitle: '',
      checkedAll: 0,
      ruleType: 2,
      ruleName: '',
      detailsTitle: '',
      details: [],
      mustList: [],
      chooseList: [],
      mustCourse: [],
      chooseCourse: [],
      subjectLists: [],
      subjectId: '',
      typeName: '',
      ruleTypeList: [
        { name: '总分相加', type: 1, disabled: true },
        { name: '系数折算', type: 2 }
      ],
      examList: [],
      singleId: '',
      editState: false
    }
  },
  methods: {
     // 获取学段
    async getSection (s) {
      await this.$https.get(`/common/sectionGradeList`)
      .then(res => {
        if (res.data.code === 1) {
          let result = (res.data.result || []).filter(item => item).filter(item => item.gradeList.length)
          this.sectionAddGradeList = (result || []).map(item => ({
            ...item,
            value: '',
            gradeListLength: item.gradeList.length,
            gradeList: (item.gradeList || []).map(items => ({
              gradeId: items.id,
              gradeName: items.name,
              sectionId: item.id,
              sectionName: item.name
            }))
          }))
          if (s) {
            this.sectionAddGradeList.forEach((items, i) => {
              if (items.id === s) {
                this.checkedAll = i
              }
            })
          } else {
            this.sectionAddGradeList[this.checkedAll].gradeList.forEach(item => {
              this.$set(item, 'checked', true)
            })
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 根据学段获取学科信息
    async subjectList () {
      this.subjectLists = []
      await this.$https.get(`/common/subjectList?sectionId=${this.sectionAddGradeList[this.checkedAll].id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subjectLists = (res.data.result || []).map(item => ({...item, disabled: false, requireFlag: ''}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 添加必考和选考科目
    addSubject () {
      this.addMustSubjectDialog = false
      let item = this.subjectLists[this.subjectId]
      let oneCourse = {
        courseId: item.id,
        courseName: item.name,
        requireFlag: item.requireFlag,
        sectionId: item.sectionId,
        sectionName: item.sectionName
      }
      if (this.addSubjectName === '新增必考科目学科') {
        this.mustList.push(oneCourse)
      } else {
        this.chooseList.push(oneCourse)
      }
      this.filterSubject()
      this.subjectId = ''
    },
    // 选完学科之后   删除
    deleteSubject (state, i) {
      if (state === 1) {
        this.mustList.splice(i, 1)
      } else {
        this.chooseList.splice(i, 1)
      }
      this.filterSubject()
    },
    // 新增规则
    async addNew () {
      this.dialogTitle = '新增规则'
      this.ruleName = ''
      this.sectionAddGradeList = []
      this.mustList = []
      this.chooseList = []
      this.checkedAll = 0
      this.editState = false
      this.dialogShow = true
      await this.getSection()
      await this.subjectList()
      // this.dialogShow = true
    },
    // 查看详情
    lookDetails (item) {
      this.singleId = item.rule.id
      this.getDetails()
    },
    // 获取等级规则详情
    getDetails () {
      this.lookDialog = true
      this.$https.get(`rule/scoreDetail?id=${this.singleId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detailsTitle = res.data.result.rule.name
          this.mustCourse = res.data.result.courses.filter(items => items.requireFlag === 1)
          this.chooseCourse = res.data.result.courses.filter(items => items.requireFlag === 2)
          this.details = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 编辑详情
    async changeDetails (item) {
      this.singleId = item.rule.id
      let checkedAll = item.grades[0].sectionId
      this.sectionAddGradeList.forEach((items, i) => {
        if (items.id === checkedAll) {
          this.checkedAll = i
        }
      })
      await this.editDetail()
    },
    // 删除详情
    deleteDetails (item) {
      this.singleId = item.rule.id
      this.deleteDialog = true
    },
    // 新增必考科目
    addMustSubject () {
      this.addSubjectName = '新增必考科目学科'
      this.addMustSubjectDialog = true
    },
    // 新增选考科目
    addChooseSubject () {
      this.addSubjectName = '新增选考科目学科'
      this.addMustSubjectDialog = true
    },
    // 获取规则列表
    getList () {
      this.loading = true
      this.$https.get(`rule/scoreList?type=${this.type}`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.list = (res.data.result || []).map(item => ({
            ...item,
            mustCourse: item.courses.filter(items => items.requireFlag === 1),
            chooseCourse: item.courses.filter(items => items.requireFlag === 2)
          }))
        } else if (res.data.code === -2) {
          error()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存等级规则信息(支持新增和修改)
    saveDetails () {
      this.gradeCheckedList = []
      this.sectionAddGradeList.forEach(a => {
        this.gradeCheckedList = this.gradeCheckedList.concat(a.gradeList)
      })
      this.gradeCheckedList = this.gradeCheckedList.filter(item => item.checked)
      this.examList = this.mustList.concat(this.chooseList)
      let obj = {}
      if (!this.ruleName || this.ruleName.trim === '') {
        notice(this, '规则名称必填', 2000)
        return
      }
      if (this.gradeCheckedList.length === 0) {
        notice(this, '请选择年级', 2000)
        return
      }
      if (this.mustList.length === 0) {
        notice(this, '请选择必考科目', 2000)
        return
      }
      if (this.chooseList.length === 0) {
        notice(this, '请选择选考科目', 2000)
        return
      }
      if (this.dialogTitle === '新增规则') {
        obj.type = this.type
        obj.name = this.ruleName
        obj.grades = JSON.stringify(this.gradeCheckedList)
        obj.courses = JSON.stringify(this.examList)
      } else if (this.dialogTitle === '编辑规则详情') {
        obj.id = this.singleId
        obj.type = this.type
        obj.name = this.ruleName
        obj.grades = JSON.stringify(this.gradeCheckedList)
        obj.courses = JSON.stringify(this.examList)
      }
      this.$https.post(`rule/scoreSave`, querystring.stringify({
        ...obj
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.dialogShow = false
          success(this, res.data.message, 2000)
          this.getList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async editDetail () {
      this.lookDialog = false
      this.dialogTitle = '编辑规则详情'
      this.editState = true
      this.dialogShow = true
      await this.$https.get(`rule/scoreDetail?id=${this.singleId}`)
      .then(async res => {
        if (res.data.code === 1) {
          await this.getSection(res.data.result.grades[0].sectionId)
          this.sectionAddGradeList.forEach(item => {
            item.gradeList.forEach((items, i) => {
              res.data.result.grades.forEach(grade => {
                if (grade.gradeId === items.gradeId) {
                  this.$set(item.gradeList[i], 'checked', true)
                }
              })
            })
          })
          await this.subjectList()
          this.mustList = (res.data.result.courses || []).filter(item => item.requireFlag === 1)
          this.chooseList = (res.data.result.courses || []).filter(item => item.requireFlag === 2)
          this.subjectLists.forEach(item => {
            res.data.result.courses.forEach(items => {
              if (item.id === items.courseId) {
                this.$set(item, 'disabled', true)
              }
            })
          })
          this.getCheckState()
          this.ruleName = res.data.result.rule.name
          // this.dialogShow = true
          this.editState = false
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除规则
    deleteOne () {
      this.$https.post(`rule/scoreDelete`, querystring.stringify({
        id: this.singleId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.deleteDialog = false
          this.getList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 判断是否全选、 单选
    getCheckState () {
      this.sectionAddGradeList.forEach(item => {
        let length = item.gradeList.filter(items => items.checked).length
        if (length === item.gradeList.length) {
          this.$set(item, 'checkedAll', true)
        } else {
          this.$set(item, 'checkedAll', false)
        }
      })
    },
    filterSubject () {
      this.subjectLists = this.subjectLists.map(item => ({...item, disabled: false, requireFlag: ''}))
      this.subjectLists.forEach(item => {
        this.mustList.forEach(subs => {
          if (item.id === subs.courseId) {
            item.disabled = true
            item.requireFlag = 1
            this.$set(subs, 'requireFlag', 1)
            this.$set(item, 'disabled', true)
          }
        })
        this.chooseList.forEach(subs => {
          if (item.id === subs.courseId) {
            item.disabled = true
            item.requireFlag = 2
            this.$set(subs, 'requireFlag', 2)
            this.$set(item, 'disabled', true)
          }
        })
      })
    }
  },
  created () {
    if (!this.$route.query.type) {
      this.type = 2
    } else {
      this.type = this.$route.query.type
    }
    this.typeName = this.$route.query.typeName
    this.getList()
  },
  filters: {
    textLength (val) {
      if (val.length > 4) {
        return val.subString(0, 4) + '...'
      } else {
        return val
      }
    }
  },
  watch: {
    checkedAll (val) {
      if (this.editState) return
      this.mustList = []
      this.chooseList = []
      this.subjectList()
      this.subjectLists = this.subjectLists.map(item => ({...item, disabled: false}))
      this.sectionAddGradeList.forEach(item => {
        item.gradeList.forEach(items => {
          this.$set(items, 'checked', false)
        })
      })
      this.sectionAddGradeList[val].gradeList.forEach(items => {
        this.$set(items, 'checked', true)
      })
    }
  }
}
</script>

<style lang="scss">
.coefficient {
  .content-box-content {
    line-height: 26px !important;
  }
  .content-box,.box {
    width: 290px !important;
    .spans {
      margin-right: 78px !important;
    }
  }
  .span {
    display: inline-block;
    border-radius: 2px;
    height: 20px;
    line-height: 20px;
    text-align:center;
    padding:0 2px;
    color: #fff;
  }
  .sublist {
    display: inline-block;
    width: 200px;
    height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .blue {
    background: #55acee;
  }
  .green {
    background: #7fce89;
  }
  .tooltip {
    color: #ccc;
    font-size: 12px;
    // margin-top: 10px;
    height: 40px;
    div:first-child {
      width: 40px;
      float: left;
    }
    div:last-child {
      width: 320px;
      float: left;
    }
  }
  .subject-list {
    margin-bottom: 10px;
    tr {
      td,th {
        border: 1px solid #ccc;
        margin-bottom: 20px !important;
      }
      td:first-child {
        width: 24px !important;
        text-align: center !important;
        background: #EEF2F5;
      }
      td:last-child {
        width: 310px !important;
      }
    }
  }
  .must-subject {
    position: relative;
    display: inline-block;
    padding: 4px 10px;
    margin-right: 14px;
    margin-top: 4px;
    border-radius: 15px;
    color: #fff;
  }
  .small-close {
    position: absolute;
    top: -4px;
    right: -8px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background: #7F7F7F;
    text-align: center;
    border-radius: 50%;
    line-height: 20px;
    color: #fff;
    display: none;
    cursor: pointer;
  }
  .must-subject:hover .small-close {
    display: block;
  }
  .small-close:hover {
    background: #F86965;
  }
  .add-subject {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-top: 4px;
    text-align: center;
    line-height: 22px;
    border-radius: 50%;
    cursor: pointer;
  }
  .low-blue {
    color: #B3D7F3;
    background: #D6E9F7;
    border: 1px dashed #B3D7F3;
  }
  .low-green {
    color: #A6E7AE;
    background: #E3F5E7;
    border: 1px dashed #A6E7AE;
  }
  .addNewSubject {
    .el-dialog {
      width: 400px !important;
    }
  }
  .look-details-table tr td:first-child {
    width: 110px;
  }
}
</style>

