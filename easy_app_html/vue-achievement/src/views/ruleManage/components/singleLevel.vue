<template>
  <div class="singleLevel common" v-loading="loading">
    <div class="box" @click="addNew">+</div>
    <div class="content-box" v-for="item in list" :key="item.title">
      <div class="content-box-head">{{ item.rankRule.name }}</div>
      <div class="content-box-content">
        <p>年级: <span v-for="(items, i) in item.rankRuleDetails" :key="items.sectionName" v-show="i < 2">{{ items.sectionName }}{{ items.gradeName }} </span>
          <span v-show="item.rankRuleDetails.length > 2" style="font-weight: bold;">...</span>
        </p>
        <p>一档: 满分的 {{ item.rankRule.gradeOne.toFixed(2) }}% 及以上</p>
        <p>二档: 满分的 {{ item.rankRule.gradeTwo.toFixed(2) }}% 及以上</p>
        <p>三档: 满分的 {{ item.rankRule.gradeThree.toFixed(2) }}% 及以上</p>
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

    <!--新增单科等级弹框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :show-close="false">
      <i class="el-icon-close close" @click="dialogShow = false"></i>
      <table class="dialog-table-content">
        <tr>
          <td>规则类型：</td>
          <td>
            <el-select v-model="ruleType" placeholder="请选择" class="dialog-table-input">
              <el-option
                v-for="item in levelLists"
                :key="item.type"
                :label="item.name"
                :disabled="item.disabled"
                :value="item.type">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>规则名称：</td>
          <td>
            <el-input v-model="ruleName" placeholder="请输入" class="dialog-table-input" :maxlength="13"></el-input>
          </td>
        </tr>
        <tr>
          <td style="position: relative;">
            <span style="position: absolute;top: 20px;right: 0px;">年级：</span>
          </td>
          <td>
            <section v-for="item in sectionAddGradeList" :key="item.name" class="dialog-table-section">
              <p>
                <el-checkbox v-model="item.checkedAll" @change="handleCheckchangeAll(item)">{{ item.name }}</el-checkbox>
              </p>
              <p class="dialog-table-checkbox">
                <el-checkbox v-model="items.checked" v-for="items in item.gradeList" :key="items.name" @change="getCheckState(items, item)">{{ items.gradeName }}</el-checkbox>
              </p>
            </section>
          </td>
        </tr>
        <tr>
          <td>一档：</td>
          <td>
            满分的
            <el-input v-model="oneLevel" placeholder="请输入" type="number" :min="0" class="dialog-table-small-input" @blur="inputBlur(1, oneLevel)"></el-input>
            %及以上
          </td>
        </tr>
        <tr>
          <td>二档：</td>
          <td>
            满分的
            <el-input v-model="twoLevel" placeholder="请输入" type="number" :min="0" class="dialog-table-small-input" @blur="inputBlur(2, twoLevel)"></el-input>
            %及以上
          </td>
        </tr>
        <tr>
          <td>三档：</td>
          <td>
            满分的
            <el-input v-model="threeLevel" placeholder="请输入" type="number" :min="0" class="dialog-table-small-input" @blur="inputBlur(3, threeLevel)"></el-input>
            %及以上
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="saveDetails()">保 存</el-button>
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
          <td><span v-for="items in sectionList" :key="items.sectionName" class="look-dialog-grade">{{ items.sectionName }}{{ items.gradeName }}   </span></td>
        </tr>
        <tr>
          <td>一档：</td>
          <td>满分的{{ oneLevel }}%及以上</td>
        </tr>
        <tr>
          <td>二档：</td>
          <td>满分的{{ twoLevel }}%及以上</td>
        </tr>
        <tr>
          <td>三档：</td>
          <td>满分的{{ threeLevel }}%及以上</td>
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
        <el-button type="primary" @click="deleteOne">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { notice, success, error } from '../../../api/index.js'
import * as smallIcons from '../../../assets/icons/index.js'
import querystring from 'querystring'
export default {
  name: 'singleLevel',
  data () {
    return {
      loading: false,
      dialogShow: false,
      lookDialog: false,
      deleteDialog: false,
      list: [],
      smallIcons,
      value: '',
      input: '',
      dialogTitle: '',
      checkedAll: false,
      ruleType: 1,
      ruleName: '',
      sectionAddGradeList: [],
      oneLevel: '',
      twoLevel: '',
      threeLevel: '',
      detailsTitle: '',
      details: [],
      type: '',
      typeName: '',
      singleId: '',
      levelLists: [
        { name: '单科等级', type: 1 },
        { name: '总分等级', type: 2, disabled: true },
        { name: '优良等级', type: 3, disabled: true }
      ],
      sectionList: [],
      sectionName: '',
      gradeName: '',
      gradeCheckedList: [],
      oneGradeCheckedLists: []
    }
  },
  methods: {
    // 全选
    handleCheckchangeAll (item) {
      if (item.checkedAll) {
        item.gradeList.forEach(a => {
          a.checked = true
        })
      } else {
        item.gradeList.forEach(a => {
          a.checked = false
        })
      }
    },
    // 获取学段
    async getSection () {
      await this.$https.get(`/common/sectionGradeList`)
      .then(res => {
        if (res.data.code === 1) {
          let result = (res.data.result || []).filter(item => item).filter(item => item.gradeList.length)
          this.sectionAddGradeList = (result || []).map(item => ({
            ...item,
            checkedAll: false,
            gradeListLength: item.gradeList.length,
            gradeList: (item.gradeList || []).map(items => ({
              // ...item,
              gradeId: items.id,
              gradeName: items.name,
              checked: false,
              sectionId: item.id,
              sectionName: item.name,
              type: this.ruleType
            }))
          }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 新增规则
    addNew () {
      this.dialogTitle = '新增规则'
      this.ruleName = ''
      this.oneLevel = ''
      this.twoLevel = ''
      this.threeLevel = ''
      // 缺少年级清空
      this.dialogShow = true
      this.getSection()
    },
    // 查看详情
    lookDetails (item) {
      this.singleId = item.rankRule.id
      this.getDetails()
    },
    // 编辑详情
    async changeDetails (item) {
      this.singleId = item.rankRule.id
      this.editDetail()
    },
    // 删除详情
    deleteDetails (item) {
      this.singleId = item.rankRule.id
      this.deleteDialog = true
    },
    // 获取单科规则列表
    getList () {
      this.loading = true
      this.$https.get(`rule/rankList?type=${this.type}`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.list = res.data.result || []
        } else if (res.data.code === -2) {
          error()
        } else if (res.data.code === -2) {
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
      let obj = {}
      if (!this.ruleName || this.ruleName.trim === '') {
        notice(this, '规则名称必填', 2000)
        return
      }
      if (this.gradeCheckedList.length === 0) {
        notice(this, '请选择学段或年级', 2000)
        return
      }
      if (this.oneLevel <= 0 || this.oneLevel > 100) {
        notice(this, '一档请输入0-100之间的数字', 2000)
        return
      }
      if (this.twoLevel <= 0 || this.twoLevel > 100) {
        notice(this, '二档请输入0-100之间的数字', 2000)
        return
      }
      if (this.threeLevel <= 0 || this.threeLevel > 100) {
        notice(this, '三档请输入0-100之间的数字', 2000)
        return
      }
      if (this.dialogTitle === '新增规则') {
        obj.type = this.type
        obj.name = this.ruleName
        obj.gradeOne = Number(this.oneLevel)
        obj.gradeTwo = Number(this.twoLevel)
        obj.gradeThree = Number(this.threeLevel)
        obj.rankRuleDetails = JSON.stringify(this.gradeCheckedList)
      } else if (this.dialogTitle === '编辑规则详情') {
        obj.id = this.singleId
        obj.type = this.type
        obj.name = this.ruleName
        obj.gradeOne = this.oneLevel
        obj.gradeTwo = this.twoLevel
        obj.gradeThree = this.threeLevel
        obj.rankRuleDetails = JSON.stringify(this.gradeCheckedList)
      }
      this.$https.post(`rule/rankSave`, querystring.stringify({
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
    editDetail () {
      this.lookDialog = false
      this.dialogShow = true
      this.dialogTitle = '编辑规则详情'
      this.$https.get(`rule/rankDetail?id=${this.singleId}`)
      .then(async res => {
        if (res.data.code === 1) {
          await this.getSection()
          this.sectionAddGradeList.forEach(item => {
            item.gradeList.forEach((items, i) => {
              res.data.result.rankRuleDetails.forEach(grade => {
                if (grade.gradeId === items.gradeId) {
                  this.$set(item.gradeList[i], 'checked', true)
                }
              })
            })
          })
          this.getCheckState()
          this.ruleName = res.data.result.rankRule.name
          this.oneLevel = res.data.result.rankRule.gradeOne.toFixed(2)
          this.twoLevel = res.data.result.rankRule.gradeTwo.toFixed(2)
          this.threeLevel = res.data.result.rankRule.gradeThree.toFixed(2)
          // this.getSection()
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
    // 获取等级规则详情
    getDetails () {
      this.lookDialog = true
      this.$https.get(`rule/rankDetail?id=${this.singleId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detailsTitle = res.data.result.rankRule.name
          this.oneLevel = res.data.result.rankRule.gradeOne.toFixed(2)
          this.twoLevel = res.data.result.rankRule.gradeTwo.toFixed(2)
          this.threeLevel = res.data.result.rankRule.gradeThree.toFixed(2)
          this.sectionList = res.data.result.rankRuleDetails
          this.singleId = res.data.result.rankRule.id
          this.details = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除规则
    deleteOne () {
      this.$https.post(`rule/rankDelete`, querystring.stringify({
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
    // 保留两位小数
    inputBlur (i, item) {
      let a = Math.round(item * 100) / 100
      if (i === 1) {
        this.oneLevel = a
      } else if (i === 2) {
        this.twoLevel = a
      } else if (i === 3) {
        this.threeLevel = a
      }
    }
  },
  created () {
    if (!this.$route.query.type) {
      this.type = 1
    } else {
      this.type = this.$route.query.type
    }
    this.typeName = this.$route.query.typeName
    this.getList()
  }
}
</script>

<style lang="scss">
.singleLevel {
  .look-details-table {
    tr {
      td:first-child {
        width: 80px !important;
      }
      td:last-child {
        width: 400px;
        .look-dialog-grade {
          display: inline-block;
          width: 120px;
        }
      }
    }
  }
}
</style>

