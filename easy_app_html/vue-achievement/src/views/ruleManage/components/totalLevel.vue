<template>
  <div class="totalLevel common" v-loading="loading">
    <div class="box" @click="addNew">+</div>
    <div class="content-box" v-for="item in list" :key="item.title">
      <div class="content-box-head">{{ item.rankRule.name }}</div>
      <div class="content-box-content">
        <table class="box-content-table">
          <tr>
            <td>年级：</td>
            <td>
              <span v-for="(items, i) in item.rankRuleDetails" :key="items.sectionName" v-show="i < 3">{{ items.sectionName }}{{ items.gradeName }} </span>
              <span v-show="item.rankRuleDetails.length > 3" style="font-weight: bold;">...</span>
            </td>
          </tr>
          <tr class="table-row">
            <td>一档：</td>
            <td>
              <table class="table-small-table">
                <tr>
                  <th>分数</th>
                  <td>
                    满分的 {{ item.rankRule.gradeOne.toFixed(2) }}% 及以上
                  </td>
                </tr>
                <tr>
                  <th>临界区间</th>
                  <td>
                    上分数线{{ item.rankRule.upperScore }}；下分数线{{ item.rankRule.lowerScore }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="table-row">
            <td>二档：</td>
            <td>
              <table class="table-small-table">
                <tr>
                  <th>分数</th>
                  <td>
                    满分的 {{ item.rankRule.gradeTwo.toFixed(2) }}% 及以上
                  </td>
                </tr>
                <tr>
                  <th>临界区间</th>
                  <td>
                    上分数线{{ item.rankRule.upperScoreTwo }}；下分数线{{ item.rankRule.lowerScoreTwo }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="table-row">
            <td>三档：</td>
            <td>
              <table class="table-small-table">
                <tr>
                  <th>分数</th>
                  <td>
                    满分的 {{ item.rankRule.gradeThree.toFixed(2) }}% 及以上
                  </td>
                </tr>
                <tr>
                  <th>临界区间</th>
                  <td>
                    上分数线{{ item.rankRule.upperScoreThree }}；下分数线{{ item.rankRule.lowerScoreThree }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
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

    <!--新增总分等级弹框-->
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
            <el-input v-model="ruleName" placeholder="请输入" class="dialog-table-input" :maxlength="18"></el-input>
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
              <table class="small-table">
                <tr>
                  <th>分数</th>
                  <td>
                    满分的
                    <el-input v-model="oneLevel" placeholder="请输入" type="number" :min="0" class="table-small-input" @blur="inputBlur(1, oneLevel)"></el-input>
                    %及以上
                  </td>
                </tr>
                <tr>
                  <th>临界区间</th>
                  <td>
                    上分数线
                    <el-input v-model="oneLevelSupperNum" type="number" :min="0" placeholder="请输入" class="small-input" @blur="inputBlur(1.1, oneLevelSupperNum)"></el-input>；
                    下分数线
                    <el-input v-model="oneLevelLowerNum" type="number" :min="0" placeholder="请输入" class="small-input" @blur="inputBlur(1.2, oneLevelLowerNum)"></el-input>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>二档：</td>
            <td>
              <table class="small-table">
                <tr>
                  <th>分数</th>
                  <td>
                    满分的
                    <el-input v-model="twoLevel" placeholder="请输入" type="number" :min="0" class="table-small-input" @blur="inputBlur(2, twoLevel)"></el-input>
                    %及以上
                  </td>
                </tr>
                <tr>
                  <th>临界区间</th>
                  <td>
                    上分数线
                    <el-input v-model="twoLevelSupperNum" placeholder="请输入" type="number" :min="0" class="small-input" @blur="inputBlur(2.1, twoLevelSupperNum)"></el-input>；
                    下分数线
                    <el-input v-model="twoLevelLowerNum" placeholder="请输入" type="number" :min="0" class="small-input" @blur="inputBlur(2.2, twoLevelLowerNum)"></el-input>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>三档：</td>
            <td>
              <table class="small-table">
                <tr>
                  <th>分数</th>
                  <td>
                    满分的
                    <el-input v-model="threeLevel" placeholder="请输入" type="number" :min="0" class="table-small-input" @blur="inputBlur(3, threeLevel)"></el-input>
                    %及以上
                  </td>
                </tr>
                <tr>
                  <th>临界区间</th>
                  <td>
                    上分数线
                    <el-input v-model="threeLevelSupperNum" placeholder="请输入" type="number" :min="0" class="small-input" @blur="inputBlur(3.1, threeLevelSupperNum)"></el-input>；
                    下分数线
                    <el-input v-model="threeLevelLowerNum" placeholder="请输入" type="number" :min="0" class="small-input" @blur="inputBlur(3.2, threeLevelLowerNum)"></el-input>
                  </td>
                </tr>
              </table>
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
          <td><span v-for="items in details.rankRuleDetails" :key="items.sectionName" class="look-dialog-grade">{{ items.sectionName }}{{ items.gradeName }}   </span></td>
        </tr>
        <tr>
          <td>一档分数：</td>
          <td v-if="details.rankRule">满分的{{ details.rankRule.gradeOne }}%及以上</td>
        </tr>
        <tr>
          <td>一档临界区间：</td>
          <td v-if="details.rankRule">上分数线{{ details.rankRule.upperScore }}；下分数线{{ details.rankRule.lowerScore }}</td>
        </tr>
        <tr>
          <td>二档分数：</td>
          <td v-if="details.rankRule">满分的{{ details.rankRule.gradeTwo }}%及以上</td>
        </tr>
        <tr>
          <td>二档临界区间：</td>
          <td v-if="details.rankRule">上分数线{{ details.rankRule.upperScoreTwo }}；下分数线{{ details.rankRule.lowerScoreTwo }}</td>
        </tr>
        <tr>
          <td>三档分数：</td>
          <td v-if="details.rankRule">满分的{{ details.rankRule.gradeThree }}%及以上</td>
        </tr>
        <tr>
          <td>三档临界区间：</td>
          <td v-if="details.rankRule">上分数线{{ details.rankRule.upperScoreThree }}；下分数线{{ details.rankRule.lowerScoreThree }}</td>
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
  name: 'totalLevel',
  data () {
    return {
      loading: false,
      dialogShow: false,
      lookDialog: false,
      deleteDialog: false,
      list: [],
      smallIcons,
      type: '',
      value: '',
      input: '',
      dialogTitle: '',
      checkedAll: false,
      checkAll: false,
      upperValue: '',
      lowerValue: '',
      ruleType: 2,
      ruleTypeList: [],
      ruleName: '',
      sectionAddGradeList: [],
      levelLists: [
        { name: '单科等级', type: 1, disabled: true },
        { name: '总分等级', type: 2 },
        { name: '优良等级', type: 3, disabled: true }
      ],
      detailsTitle: '',
      details: {},
      oneLevel: '',
      twoLevel: '',
      threeLevel: '',
      oneLevelLowerNum: '',
      twoLevelLowerNum: '',
      threeLevelLowerNum: '',
      oneLevelSupperNum: '',
      twoLevelSupperNum: '',
      threeLevelSupperNum: ''
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
    async addNew () {
      await this.getSection()
      this.dialogTitle = '新增规则'
      this.ruleName = ''
      this.oneLevel = ''
      this.twoLevel = ''
      this.threeLevel = ''
      this.oneLevelSupperNum = ''
      this.oneLevelLowerNum = ''
      this.twoLevelSupperNum = ''
      this.twoLevelLowerNum = ''
      this.threeLevelSupperNum = ''
      this.threeLevelLowerNum = ''
      this.dialogShow = true
    },
    // 查看详情
    lookDetails (item) {
      this.detailsTitle = item.rankRule.name
      this.singleId = item.rankRule.id
      this.getDetails()
    },
    // 编辑详情
    changeDetails (item) {
      this.singleId = item.rankRule.id
      this.editDetail()
    },
    // 删除详情
    deleteDetails (item) {
      this.singleId = item.rankRule.id
      this.deleteDialog = true
    },
    // 获取总分规则列表
    getList () {
      this.loading = true
      this.$https.get(`rule/rankList?type=${this.type}`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.list = res.data.result || []
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
        notice(this, '一档分数请输入0-100之间的数字', 2000)
        return
      }
      if (this.oneLevelSupperNum <= 0 || this.oneLevelSupperNum > 1000) {
        notice(this, '一档上分数线分数请输入0-1000之间的数字', 2000)
        return
      }
      if (this.oneLevelLowerNum <= 0 || this.oneLevelLowerNum > 1000) {
        notice(this, '一档下分数线请输入0-1000之间的数字', 2000)
        return
      }
      if (this.twoLevel <= 0 || this.twoLevel > 100) {
        notice(this, '二档分数请输入0-100之间的数字', 2000)
        return
      }
      if (this.twoLevelSupperNum <= 0 || this.twoLevelSupperNum > 1000) {
        notice(this, '二档上分数线请输入0-1000之间的数字', 2000)
        return
      }
      if (this.twoLevelLowerNum <= 0 || this.twoLevelLowerNum > 1000) {
        notice(this, '二档下分数线请输入0-1000之间的数字', 2000)
        return
      }
      if (this.threeLevel <= 0 || this.threeLevel > 100) {
        notice(this, '三档分数请输入0-100之间的数字', 2000)
        return
      }
      if (this.threeLevelSupperNum <= 0 || this.threeLevelSupperNum > 1000) {
        notice(this, '三档上分数线请输入0-1000之间的数字', 2000)
        return
      }
      if (this.threeLevelLowerNum <= 0 || this.threeLevelLowerNum > 1000) {
        notice(this, '三档下分数线请输入0-1000之间的数字', 2000)
        return
      }
      if (this.dialogTitle === '新增规则') {
        obj.type = this.type
        obj.name = this.ruleName
        obj.gradeOne = Number(this.oneLevel)
        obj.gradeTwo = Number(this.twoLevel)
        obj.gradeThree = Number(this.threeLevel)
        obj.upperScore = Number(this.oneLevelSupperNum)
        obj.lowerScore = Number(this.oneLevelLowerNum)
        obj.upperScoreTwo = Number(this.twoLevelSupperNum)
        obj.lowerScoreTwo = Number(this.twoLevelLowerNum)
        obj.upperScoreThree = Number(this.threeLevelSupperNum)
        obj.lowerScoreThree = Number(this.threeLevelLowerNum)
        obj.rankRuleDetails = JSON.stringify(this.gradeCheckedList)
      } else if (this.dialogTitle === '编辑规则详情') {
        obj.id = this.singleId
        obj.type = this.type
        obj.name = this.ruleName
        obj.gradeOne = this.oneLevel
        obj.gradeTwo = this.twoLevel
        obj.gradeThree = this.threeLevel
        obj.upperScore = Number(this.oneLevelSupperNum)
        obj.lowerScore = Number(this.oneLevelLowerNum)
        obj.upperScoreTwo = Number(this.twoLevelSupperNum)
        obj.lowerScoreTwo = Number(this.twoLevelLowerNum)
        obj.upperScoreThree = Number(this.threeLevelSupperNum)
        obj.lowerScoreThree = Number(this.threeLevelLowerNum)
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
          this.oneLevelSupperNum = res.data.result.rankRule.upperScore
          this.oneLevelLowerNum = res.data.result.rankRule.lowerScore
          this.twoLevelSupperNum = res.data.result.rankRule.upperScoreTwo
          this.twoLevelLowerNum = res.data.result.rankRule.lowerScoreTwo
          this.threeLevelSupperNum = res.data.result.rankRule.upperScoreThree
          this.threeLevelLowerNum = res.data.result.rankRule.lowerScoreThree
          // this.getSection()
          // this.dialogShow = true
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
      } else if (i === 1.1) {
        this.oneLevelSupperNum = a
      } else if (i === 1.2) {
        this.oneLevelLowerNum = a
      } else if (i === 2) {
        this.twoLevel = a
      } else if (i === 2.1) {
        this.twoLevelSupperNum = a
      } else if (i === 2.2) {
        this.twoLevelLowerNum = a
      } else if (i === 3) {
        this.threeLevel = a
      } else if (i === 3.1) {
        this.threeLevelSupperNum = a
      } else if (i === 3.2) {
        this.threeLevelLowerNum = a
      }
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
  }
}
</script>

<style lang="scss">
 
.totalLevel {
  .small-table {
    margin-bottom: 20px;
    .el-input__inner {
      border: none;
      border-bottom: 1px solid #ccc;
      padding: 0;
      height: 24px;
      border-radius: 0;
    }
    tr {
      height: 40px !important;
      td {
        border: 1px solid #ccc;
        padding-left: 6px !important;
      }
      th {
        border: 1px solid #ccc;
        padding: 0 10px;
        background: #EEF2F5;
        text-align: center;
        width: 60px;
      }
      .table-small-input {
        width: 90px;
      }
      .small-input {
        width: 60px;
      }
    }
  }
  .content-box,.box {
    width: 310px !important;
    height: 340px !important;
  }
  .box {
    line-height: 330px !important;
  }
  .content-box {
    .content-box-content {
      line-height: 26px !important;
      padding-bottom: 10px !important;
      padding-top: 10px !important;
      padding-left: 0 !important;
    }
    .content-box-foot {
      line-height: 60px;
      .spans {
        margin-right: 78px !important;
      }
      .spans:last-child {
        margin-right: 0;
      }
    }
    
  }
  .box-content-table {
    width: 310px !important;
    height: 220px !important;
    tr {
      td:first-child {
        text-align: right;
        width:50px !important;
      }
      td:last-child {
        width: 270px !important;
        padding-bottom: 4px;
      }
      .table-small-table {
        width: 240px;
        tr {
          th {
            border: 1px solid #ccc;
            padding: 0 6px;
            background: #EEF2F5;
            text-align: center;
            width: 90px;
          }
          td {
            border: 1px solid #ccc;
            padding-left: 6px;
          }
        }
      }
    }
  }
  .look-details-table tr td:first-child {
    width: 110px;
  }
}

</style>

