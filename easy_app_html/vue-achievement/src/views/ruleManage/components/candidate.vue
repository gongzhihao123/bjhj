<template>
  <div class="candidate common" v-loading="loading">
    <div class="box" @click="addNew">+</div>
    <div class="content-box" v-for="item in list" :key="item.title">
      <div class="content-box-head">{{ item.examnoRule.name }}</div>
      <div class="content-box-content">
        <p>学段: {{ item.examnoRule.sectionName }}</p>
      </div>
      <div class="content-box-foot">
        <span class="spans" @click="lookDetails(item)">
          <img :src="type.check" alt="">
          <img :src="type.checking" alt="">
          <span class="tooltip">查看</span>
        </span>
        
        <span class="spans" @click="lookChange(item)">
          <img :src="type.edit" alt="">
          <img :src="type.editing" alt="">
          <span class="tooltip">编辑</span>
        </span>

        <span class="spans" @click="deleteDetails(item)">
          <img :src="type.delete" alt="">
          <img :src="type.deleteing" alt="">
          <span class="tooltip">删除</span>
        </span>
      </div>
    </div>

    <!--考号规则新增弹框-->
    <el-dialog
      class="addNewDialog"
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :show-close="false">
      <i class="el-icon-close close" @click="dialogShow = false"></i>
      <span class="tool">注： 考号为学校编号+年级编号+学生编号</span>
      <table class="dialog-table-content">
        <tr>
          <td>规则名称：</td>
          <td>
            <el-input v-model="modInfo.name" placeholder="请输入" class="dialog-table-input"></el-input>
          </td>
        </tr>
        <tr>
          <td>学段：</td>
          <td>
            <el-radio v-for="(item, i) in sectionList" :key="i" class="radio" v-model="modInfo.section" :label="i" @change.native="switchSection(item)">{{ item.name }}</el-radio>
          </td>
        </tr>
        <tr>
          <td style="position: relative;">
            <span style="position: absolute;top: 0;right: 0px;">学校编号：</span>
          </td>
          <td>
            <section class="schoolLists">
              <span v-for="item in schoolList" :key="item.id" class="schoolNum" :class="{length: schoolList.length <= 2}">
                {{ item.name | textLength }}
                <el-input v-model="item.schoolNo" placeholder="请输入" :min="0" type="number"></el-input>
              </span>
            </section>
          </td>
        </tr>
        <tr>
          <td style="position: relative; top: 10px;">
            <span style="position: absolute;top: 0;right: 0px;">年级：</span>
          </td>
          <td>
            <section class="gradeLists">
              <span v-for="item in gradeList" :key="item.name" class="gradeNum">
                {{ item.name }}
                <el-input v-model="item.gradeNo" placeholder="请输入" type="number" :min="0"></el-input>
              </span>
            </section>
          </td>
        </tr>
        <tr>
          <td>学生编号位数：</td>
          <td>
            <el-input v-model="modInfo.studentNoLen" placeholder="请输入" class="dialog-table-input" type="number" :min="0"></el-input>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="saveExamno">保 存</el-button>
      </span>
    </el-dialog>

    <!--查看弹框-->
    <el-dialog
      class="look-detail"
      :title="detailsTitle"
      :visible.sync="lookDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="lookDialog = false"></i>
      <table class="look-details-table">
        <tr>
          <td>规则名称：</td>
          <td>{{ lookInfo.examnoRule.name }}</td>
        </tr>
        <tr>
          <td>学段：</td>
          <td>{{ lookInfo.examnoRule.sectionName }}</td>
        </tr>
        <tr>
          <td style="position: relative;">
            <span style="position: absolute;top: 8px;right: 0px;">学校编号：</span>
          </td>
          <td>
            <div v-for="items in lookInfo.examnoRuleSchools" :key="items.id" class="dialog-box">
              <span>{{ items.schoolName }} {{ items.schoolNo }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="position: relative;">
            <span style="position: absolute;top: 8px;right: 0px;">年级：</span>
          </td>
          <td>
            <div v-for="items in lookInfo.examnoRuleGrades" :key="items.id" class="dialog-grade-box">
              <span>{{ items.gradeName }} {{ items.gradeNo }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>学生编号位数：</td>
          <td>{{ lookInfo.examnoRule.studentNoLen }}</td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookChange(lookInfo)" >编 辑</el-button>
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
        <el-button type="primary" @click="deleteRule">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as type from '../../../assets/icons/index.js'
import querystring from 'querystring'
import { notice, success } from '../../../api/index.js'
export default {
  name: 'candidate',
  data () {
    return {
      loading: false,
      dialogShow: false,
      lookDialog: false,
      deleteDialog: false,
      list: [],
      type,
      value: '',
      input: '',
      dialogTitle: '',
      checkedAll: false,
      checkAll: false,
      ruleType: '',
      ruleTypeList: [],
      ruleName: '',
      detailsTitle: '',
      lookInfo: {
        examnoRule: '',
        examnoRuleGrades: [],
        examnoRuleSchools: []
      },
      schoolList: [],
      gradeList: [],
      radio: '1',
      modInfo: {
        id: '',
        sectionId: '',
        section: 0,
        sectionName: '',
        studentNoLen: '',
        name: '',
        grades: [],
        schools: []
      },
      sectionList: [],
      deleteId: '',
      edit: false
    }
  },
  created () {
    this.getExamnoList()
  },
  methods: {
    handleNodeClick () {},
    // 新增规则
    async addNew () {
      this.dialogTitle = '新增规则'
      this.dialogShow = true
      await this.getSection()
      this.getCompanyList()
      this.modInfo.id = ''
      this.modInfo.section = 0
      this.modInfo.name = ''
      this.modInfo.studentNoLen = ''
    },
    // 查看详情
    lookDetails (item) {
      this.detailsTitle = item.examnoRule.name
      this.lookDialog = true
      this.lookInfo = item
    },
    // 编辑详情
    changeDetails () {
      this.dialogTitle = '编辑规则详情'
      this.dialogShow = true
    },
    // 删除详情
    deleteDetails (item) {
      this.deleteDialog = true
      this.deleteId = item.examnoRule.id
    },
    // 删除
    deleteRule () {
      this.$https.post('/rule/examnoDelete', querystring.stringify({
        id: this.deleteId
      }))
      .then(res => {
        this.deleteDialog = false
        this.getExamnoList()
        success(this, res.data.message, 2000)
      })
    },
    // 查看并编辑
    async lookChange (item) {
      if (item) {
        this.lookInfo = item
      }
      this.edit = true
      this.lookDialog = false
      this.dialogShow = true
      this.dialogTitle = '编辑规则详情'
      await this.getSection()
      this.modInfo.id = this.lookInfo.examnoRule.id
      this.modInfo.name = this.lookInfo.examnoRule.name
      this.modInfo.studentNoLen = this.lookInfo.examnoRule.studentNoLen
      this.sectionList.forEach((item, i) => {
        if (item.id === this.lookInfo.examnoRule.sectionId) {
          this.modInfo.section = i
          this.modInfo.sectionId = item.id
        }
      })
      await this.getGrade()
      this.gradeList.forEach(item => {
        this.lookInfo.examnoRuleGrades.forEach(items => {
          if (items.gradeId === item.id) {
            item.gradeNo = items.gradeNo
            this.$set(item, 'gradeNo', items.gradeNo)
          }
        })
      })
      await this.getCompanyList()
      this.edit = false
      this.schoolList.forEach(item => {
        this.lookInfo.examnoRuleSchools.forEach(items => {
          if (items.schoolId === item.id) {
            this.$set(item, 'schoolNo', items.schoolNo)
          }
        })
      })
      this.dialogShow = true
    },
    // 获取考号规则列表
    getExamnoList () {
      this.loading = true
      this.$https.get(`rule/examnoList`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.list = res.data.result || []
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存考号规则列表
    saveExamno () {
      if (!this.modInfo.name || this.modInfo.name.trim === '') {
        notice(this, '请输入规则名称', 2000)
        return
      }
      if (!this.modInfo.section && this.modInfo.section !== 0) {
        notice(this, '请选择学段', 2000)
        return
      }
      let schoolNum = this.schoolList.filter(item => item.schoolNo)
      let gradeNum = this.gradeList.filter(item => item.gradeNo)
      if (schoolNum.length === 0) {
        notice(this, '请填写学校编号', 2000)
        return
      }
      if (gradeNum.length === 0) {
        notice(this, `请填写年级编号`, 2000)
        return
      }
      if (this.modInfo.studentNoLen === '') {
        notice(this, '请输入学生编号位数', 2000)
        return
      }
      this.modInfo.sectionId = this.sectionList[this.modInfo.section].id
      this.modInfo.sectionName = this.sectionList[this.modInfo.section].name
      this.modInfo.grades = JSON.stringify(this.gradeList.filter(item => item.gradeNo).map(items => ({gradeId: items.id, gradeName: items.name, gradeNo: items.gradeNo})))
      this.modInfo.schools = JSON.stringify(this.schoolList.filter(item => item.schoolNo).map(items => ({schoolId: items.id, schoolName: items.name, schoolNo: items.schoolNo})))
      this.$https.post('rule/examnoSave', querystring.stringify({
        ...this.modInfo
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.getExamnoList()
          this.dialogShow = false
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学段
    async getSection () {
      await this.$https.get(`/common/sectionList`)
      .then(async res => {
        if (res.data.result) {
          this.sectionList = res.data.result || []
          if (!this.edit) {
            this.modInfo.sectionId = res.data.result[0].id
            this.modInfo.section = 0
            await this.getGrade()
          }
        }
      })
    },
    // 切换学段
    async switchSection (item) {
      this.modInfo.sectionId = this.sectionList[this.modInfo.section].id
      this.modInfo.sectionName = this.sectionList[this.modInfo.section].name
      this.getCompanyList()
      this.getGrade()
    },
    // 获取年级
    async getGrade () {
      await this.$https.get(`/common/gradeList?sectionId=${this.modInfo.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = (res.data.result || []).map(item => ({...item, gradeNo: ''}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取下属单位
    async getCompanyList () {
      await this.$https.get(`/common/childCompanyList?sectionId=${this.modInfo.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.schoolList = (res.data.result || []).map(item => ({...item, schoolNo: ''}))
        }
      })
    }
  },
  filters: {
    textLength (val) {
      if (val.length > 8) {
        return val.substring(0, 8) + '...'
      } else {
        return val
      }
    }
  }
}
</script>

<style lang="scss">
  .candidate {
    .addNewDialog {
      .el-dialog {
        width: 640px !important;
        height: 620px !important;
        .el-dialog__body {
          max-height: 500px !important;
        }
      }
    }
    .tool {
      padding-left: 10px;
      color: #bbb;
    }
    .box,.content-box {
      height: 180px !important;
    }
    .box {
      line-height: 180px !important;
    }
    .content-box {
      .content-box-content {
        line-height: 86px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    }
    .schoolLists {
      max-height: 150px;
      overflow: auto;
      margin-bottom: 20px;
    }
    .schoolNum {
      display: inline-block;
      width: 200px;
      margin-bottom: 10px;
      text-align: right;
      &>.el-input {
        width: 64px;
        .el-input__inner {
          height: 28px;
        }
      }

      &.length {
        text-align: left;
      }
    }
    .gradeNum {
      display: inline-block;
      width: 130px;
      margin-bottom: 10px;
      margin-right: 10px;
      &>.el-input {
        width: 64px;
        .el-input__inner {
          height: 28px;
        }
      }
    }
    .dialog-table-input {
      .el-input__inner {
        width: 400px !important;
      }
    }
    .dialog-table-content {
      tr {
        td:first-child {
          width: 110px !important;
        }
      }
    }
    .look-detail {
      .el-dialog--small {
        width: 600px !important;
        max-height: 600px;
        // overflow: auto;
      }
      .el-dialog__body {
        min-height: 200px;
      }
      .look-details-table {
        tr {
          height: 36px;
          td:first-child {
            width: 110px;
            text-align: right;
          }
          td:last-child {
            .dialog-box {
              min-width: 400px;
              >span {
                display: inline-block;
                width: 200px;
                float: left;
                height: 26px;
                line-height: 26px;
              }
            }
            .dialog-grade-box {
              min-width: 400px;
              >span {
                display: inline-block;
                width: 130px;
                float: left;
                height: 26px;
                line-height: 26px;
              }
            }
          }
        }
      }
    }
  }
</style>

