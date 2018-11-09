<template>
  <div class="test-index">
      <p class="content-head">考试管理 > 考试列表 > 新增考试 > {{ name }}
        <el-button type="primary" @click="route('/exam')">
          <i><</i>
          返回考试列表
        </el-button>
      </p>

      <div class="add-content">
        <el-steps space="20%"
                  :active="active"
                  :center="true"
                  finish-status="success">
          <el-step title="考试信息设置"></el-step>
          <el-step title="考试规则设置"></el-step>
          <el-step title="考试对象设置"></el-step>
        </el-steps>

        <!-- 第一步 -->
        <section class="step-one" v-if="active == 0">
          <table>
            <tr>
              <td>学期：</td>
              <td>
                <el-select v-model="setInfo.semester" placeholder="选择学期" @change="modName">
                  <el-option
                    v-for="item in semesterList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>学段：</td>
              <td>
                <el-select v-model="setInfo.section" placeholder="选择学段" @change="getGradeList('a')">
                  <el-option
                    v-for="item in sectionList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr v-if="setInfo.section">
              <td>年级：</td>
              <td>
                <el-radio v-for="item in gradeList" :key="item.name" class="radio" v-model="setInfo.grade" :label="item.radio" @change.native="modName">{{ item.name }}</el-radio>
              </td>
            </tr>
            <tr>
              <td class="top">考试类型：</td>
              <td class="one-type">
                <span v-for="(item, i) in testTypeList" :key="item.name" :class="{active: gradeInd === i}" @click="testType(item, i)">{{ item.name }}</span>
                <el-button type="primary" @click="examType">管理考试类型</el-button>
              </td>
            </tr>
            <tr>
              <td>考试名称：</td>
              <td>
                <el-input v-model="setInfo.testName" placeholder="请输入考试名称"></el-input>
              </td>
            </tr>
            <tr>
              <td>是否需要排名：</td>
              <td>
                <el-radio class="radio" v-model="setInfo.needSort" :label="1">是</el-radio>
                <el-radio class="radio" v-model="setInfo.needSort" :label="0">否</el-radio>
              </td>
            </tr>
            <tr>
              <td>学生信息录入时间：</td>
              <td>
                <el-date-picker
                  v-model="setInfo.startTime"
                  type="date">
                </el-date-picker>  ---  
                <el-date-picker
                  v-model="setInfo.endTime"
                  type="date">
                </el-date-picker>
              </td>
            </tr>
            <tr>
              <td>成绩发布时间：</td>
              <td>
                <el-date-picker
                  v-model="setInfo.publishStartTime"
                  type="date">
                </el-date-picker>  ---  
                <el-date-picker
                  v-model="setInfo.publishEndTime"
                  type="date">
                </el-date-picker>
              </td>
            </tr>
            <tr>
              <td>成绩录入方式：</td>
              <td>
                <el-radio class="radio" v-model="setInfo.scoreEnterType" :label="1">统一录入</el-radio>
                <el-radio class="radio" v-model="setInfo.scoreEnterType" :label="2">任课教师录入</el-radio>
              </td>
            </tr>
          </table>
          <div class="button-group">
            <el-button type="danger" @click="route('/exam')">取消</el-button>
            <el-button type="primary" @click="next">下一步</el-button>
          </div>
        </section>

        <!-- 第二步 -->
        <section class="step-two" v-if="active == 1">
          <table class="first-table">
            <tr>
              <td>单科等级：</td>
              <td>
                <el-select v-model="test.single" placeholder="请选择考试规则" @visible-change="getRankList(1, $event)">
                  <el-option
                    v-for="(item, i) in rankList.alignList"
                    :key="i"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="primary" @click="router('/rule/single')">管理规则</el-button>
              </td>
            </tr>
            <tr>
              <td>总分等级：</td>
              <td>
                <el-select v-model="test.totalRule" placeholder="请选择考试规则" @visible-change="getRankList(2, $event)">
                  <el-option
                    v-for="(item, i) in rankList.totalList"
                    :key="i"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="primary" @click="router('/rule/total')">管理规则</el-button>
              </td>
            </tr>
            <tr>
              <td>优良等级：</td>
              <td>
                <el-select v-model="test.excellent" placeholder="请选择考试规则" @visible-change="getRankList(3, $event)">
                  <el-option
                    v-for="(item, i) in rankList.goodnessList"
                    :key="i"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="primary" @click="router('/rule/choiceness')">管理规则</el-button>
              </td>
            </tr>
            <tr>
              <td>总分计算：</td>
              <td>
                <el-select v-model="test.totalCalc" placeholder="请选择考试规则" @change="getScoreDetail" @visible-change="getScoreList($event)">
                  <el-option
                    v-for="item in rankList.totalCalcList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="primary" @click="router('/rule/totalSum')">管理规则</el-button>
              </td>
            </tr>
            <tr v-if="test.totalCalc">
              <td></td>
              <td>
                <div class="content-box">
                  <div class="content-box-head">
                    <span v-show="totalDetail.name.length < 16">{{ totalDetail.name }}</span>
                    <span v-show="totalDetail.name.length > 16" style="font-weight: bold;">{{ totalDetail.name.substring(0,17) }}...</span>
                  </div>
                  <div class="content-box-content">
                    <p>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级: 
                      <span v-for="(items, i) in totalDetail.gradeList" :key="items.sectionName" v-show="i < 2">{{ items.sectionName }}{{ items.gradeName }} </span>
                      <span v-show="totalDetail.gradeList.length > 2" style="font-weight: bold;">...</span>
                    </p>
                    <p>规则类型: {{ totalDetail.type }}</p>
                    <p>
                      考试科目: 
                      <section>
                        <p>
                          <span class="blue span">必考科目</span>
                          <span class="sublist">
                            <span v-for="items in totalDetail.mustList" :key="items.courseName">{{ items.courseName }} </span>
                          </span>
                        </p>
                        <p>
                          <span class="green span">选考科目</span>
                          <span class="sublist">
                            <span v-for="items in totalDetail.chooseList" :key="items.courseName">{{ items.courseName }} </span>
                          </span>
                        </p>
                      </section>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>考号规则：</td>
              <td>
                <el-select v-model="test.numRule" placeholder="请选择考试规则" @change="getExamnoList($event)">
                  <el-option
                    v-for="(item, i) in rankList.numRuleList"
                    :key="i"
                    :label="item.examnoRule.name"
                    :value="item.examnoRule.id">
                  </el-option>
                </el-select>
                <el-button type="primary" @click="router('/rule/candidate')">管理规则</el-button>
              </td>
            </tr>
            
            <tr>
              <td></td>
              <td>
                <el-checkbox v-model="test.needNum">是否需要考号？</el-checkbox>
              </td>
            </tr>
            <tr>
              <td>成绩规则：</td>
              <td>
                <el-select v-model="test.structureRuleId" placeholder="请选择成绩规则" @visible-change="getAsmList($event)">
                  <el-option
                    v-for="(item, i) in rankList.asmList"
                    :key="i"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="primary" @click="router('/rule/asm')">管理规则</el-button>
              </td>
            </tr>
            <tr>
              <td>发布等级：</td>
              <td>
                <el-select v-model="test.rankPublishRuleId" placeholder="请选择发布等级" @change="getLevelList($event)">
                  <el-option
                    v-for="(item, i) in rankList.levelList"
                    :key="i"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="primary" @click="router('/rule/publicLevel')">管理规则</el-button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <el-checkbox v-model="test.publishFlag">按等级发布成绩</el-checkbox>
              </td>
            </tr>
          </table>
          <div class="button-group">
            <el-button type="danger" @click="route('/exam')">取消</el-button>
            <el-button type="success" @click="prop">上一步</el-button>
            <el-button type="primary" @click="next">下一步</el-button>
          </div>
        </section>

        <!-- 第三步 -->
        <section class="step-three" v-if="active == 2">
          <section class="clearfix">
            <p>考试科目/对象：</p>
            <table>
              <thead>
                <tr>
                  <td>学科</td>
                  <td>{{ gradeName }}</td>
                </tr>
              </thead>

              <tr v-for="(item, i) in tableList" :key="i">
                <td>{{ item.courseName }}</td>
                <td>
                  <span v-show="item.checked" @click="subjectChange(item)"></span>
                  <span v-show="!item.checked" @click="subjectChange(item)"></span>
                </td>
              </tr>
            </table>
          </section>

          <section>
            <span>学生选科数：　　　 </span>
            <el-input-number v-model="check.number" :min="check.min" :max="check.max" :disabled="totalDetail.type == '系数折算'"></el-input-number>
          </section>

          <section class="clearfix">
            <p>参加考试学校：
              <el-checkbox v-model="checkedAll" @change.native="checkAll">全选</el-checkbox>
            </p>
            <div class="school-table">
              <el-checkbox v-model="item.checked" v-for="(item, i) in schoolList" :key="i" @change="handleChange">{{ item.schoolName }}</el-checkbox>
            </div>
          </section>

          <div class="button-group">
            <el-button type="danger" @click="route('/exam')">取消</el-button>
            <el-button type="success" @click="prop">上一步</el-button>
            <el-button type="primary" @click="next">保存</el-button>
          </div>
        </section>


        

      </div>

      <el-dialog
        title="管理考试类型"
        :visible.sync="dialogShow"
        :show-close="false">
        <i class="el-icon-close close" @click="dialogShow = false"></i>
        <el-button type="primary" @click="addCategory">新增考试类型</el-button>
        <table>
          <tr>
            <td>考试类型</td>
            <td>操作</td>
          </tr>
          <tr v-for="item in addDialog" :key="item.testName">
            <td>
              <el-input v-show="item.mod" v-model="item.name"></el-input>
              <div v-show="!item.mod" class="category">{{ item.name }}</div>
            </td>
            <td>
              <i v-show="item.mod" @click="modCategory(item)" class="sure"></i>
              <i v-show="!item.mod" @click="modCategory(item)"></i>
              <i @click="deleteCategory(item)"></i>
            </td>
          </tr>
        </table>
      </el-dialog>
  </div>
</template>

<script>
import { notice, success } from '../../../api/index.js'
import querystring from 'querystring'
import { dateFormat } from '../../../filters/date.js'
export default {
  name: 'test-index',
  data () {
    return {
      dialogShow: false,
      name: '考试信息设置',
      gradeList: [
      ],
      gradeInd: '',
      testTypeList: [
      ],
      setInfo: {
        testName: '',
        grade: '',
        section: '',
        semester: '',
        needSort: 1,
        startTime: '',
        endTime: '',
        publishStartTime: '',
        publishEndTime: '',
        scoreEnterType: 1
      },
      sectionList: [],
      active: 0,
      semesterList: [],
      testTotal: '',
      testNum: 0,
      testNumList: [
        { testName: '', testNum: 0 }
      ],
      gradeName: '一年级',
      tableList: [],
      test: {
        single: '',
        totalRule: '',
        excellent: '',
        totalCalc: '',
        numRule: '',
        structureRuleId: '',
        rankPublishRuleId: '',
        needNum: false,
        publishFlag: false
      },
      addDialog: [
      ],
      testTitle: [
      ],
      knowledgeList: [],
      knowledge: '',
      abilityList: [],
      ability: '',
      testId: '',
      rankList: {
        alignList: [],
        totalList: [],
        goodnessList: [],
        numRuleList: [],
        totalCalcList: [],
        asmList: [],
        levelList: []
      },
      totalDetail: {
        name: '',
        gradeList: [],
        courseList: [],
        mustCourse: [],
        chooseCourse: []
      },
      schoolList: [],
      checkedAll: false,
      refer: true,
      check: {
        number: 3,
        max: 0,
        min: 0
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  async created () {
    await this.getSemesterList()
    await this.getSectionList()
    await this.getCategoryList()
    let obj = JSON.parse(this.$route.query.obj || '{}')
    if (obj.id) {
      this.setInfo.section = obj.sectionId
      this.testId = obj.id
      this.getExamDetails()
    }
  },
  methods: {
    async examType () {
      await this.getCategoryList()
      this.dialogShow = true
    },
    route (s) {
      this.$router.push(s)
    },
    router (s) {
      window.open(`#${s}`)
    },
    next () {
      if (this.active === 0) {
        if (!this.setInfo.grade && this.setInfo.grade !== 0) {
          notice(this, '请选择年级', 2000)
          return
        }
        if (!this.gradeInd && this.gradeInd !== 0) {
          notice(this, '请选择类型', 2000)
          return
        }
        if (!this.setInfo.testName || this.setInfo.testName.trim === '') {
          notice(this, '请输入考试名称', 2000)
          return
        }
        if (!this.setInfo.startTime || !this.setInfo.endTime) {
          notice(this, '请输入学生信息录入开始时间或截至时间', 2000)
          return
        }
        if (this.setInfo.startTime > this.setInfo.endTime) {
          notice(this, '学生信息录入开始时间不能晚于截至时间', 2000)
          return
        }
        // if (!this.setInfo.publishStartTime || !this.setInfo.publishEndTime) {
        //   notice(this, '请输入成绩发布开始时间或截至时间', 2000)
        //   return
        // }
        if (this.setInfo.publishStartTime > this.setInfo.publishEndTime) {
          notice(this, '成绩发布开始时间不能晚于截至时间', 2000)
          return
        }
        this.$https.post('/examManage/examSave', querystring.stringify({
          id: this.testId,
          semesterId: this.setInfo.semester,
          sectionId: this.setInfo.section,
          gradeId: this.setInfo.grade,
          categoryId: this.testTypeList[this.gradeInd].id,
          name: this.setInfo.testName,
          rankFlag: this.setInfo.needSort,
          scoreEnterType: this.setInfo.scoreEnterType,
          startTime: dateFormat(this.setInfo.startTime, 'yyyy-MM-dd'),
          endTime: dateFormat(this.setInfo.endTime, 'yyyy-MM-dd'),
          publishStartTime: dateFormat(this.setInfo.publishStartTime, 'yyyy-MM-dd'),
          publishEndTime: dateFormat(this.setInfo.publishEndTime, 'yyyy-MM-dd')
        }))
        .then(res => {
          if (res.data.code === 1) {
            this.refer = false
            success(this, res.data.message, 2000)
            this.testId = res.data.result
            if (this.active++ > 3) this.active = 0
            this.getRankList(1)
            this.getRankList(2)
            this.getRankList(3)
            this.getScoreList()
            this.getExamnoList()
            this.getAsmList()
            this.getLevelList()
            this.name = '考试规则设置'
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.active === 1) {
        if (!this.test.single) {
          notice(this, '请选择单科等级', 2000)
          return
        }
        if (!this.test.totalRule) {
          notice(this, '请选择总分等级', 2000)
          return
        }
        if (!this.test.excellent) {
          notice(this, '请选择优良等级', 2000)
          return
        }
        if (!this.test.totalCalc) {
          notice(this, '请选择总分计算', 2000)
          return
        }
        if (!this.test.numRule && this.test.needNum) {
          notice(this, '请选择考号规则', 2000)
          return
        }
        if (!this.test.structureRuleId) {
          notice(this, '请选择成绩规则', 2000)
          return
        }
        if (!this.test.rankPublishRuleId && this.test.publishFlag) {
          notice(this, '请选择考号规则', 2000)
          return
        }
        this.$https.post('/examManage/examSave', querystring.stringify({
          id: this.testId,
          scoreRuleId: this.test.totalCalc,
          rankCourseRuleId: this.test.single,
          rankScoreRuleId: this.test.totalRule,
          rankLevelRuleId: this.test.excellent,
          examnoRuleId: this.test.numRule,
          structureRuleId: this.test.structureRuleId,
          rankPublishRuleId: this.test.rankPublishRuleId,
          examnoFlag: this.test.needNum ? 1 : 0,
          publishFlag: this.test.publishFlag ? 1 : 0,
          createdUid: this.user.id,
          createdUname: this.user.name
        }))
        .then(async res => {
          if (res.data.code === 1) {
            success(this, res.data.message, 2000)
            if (this.active++ > 3) this.active = 0
            this.gradeList.forEach(item => {
              if (item.id === this.setInfo.grade) {
                this.gradeName = item.name
              }
            })
            this.name = '考试对象设置'
            await this.getObjectDetail()
            if (this.checkedAll) {
              this.checkAll()
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.active === 2) {
        this.saveObject()
      }
      // if (this.active++ > 3) this.active = 0
    },
    prop () {
      if (this.active-- < 1) return
      if (this.active === 0) {
        this.name = '考试信息设置'
        this.getCategoryList()
      } else if (this.active === 1) {
        this.name = '考试规则设置'
      } else if (this.active === 2) {
        this.name = '考试对象设置'
      }
    },
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'xls' || arr[arr.length - 1] === 'xlsx') {
          resolve()
        } else {
          notice(this, '请上传正确格式文件', 2000)
          reject()
        }
      })
    },
    handleSuccess () {},
    addSmall (i) {
      if (this.testNumList.length >= this.testNum) return
      this.testNumList.splice(i, 0, { testNum: '', testName: '' })
    },
    blur (item) {
      if (item > 1000) {
        item = 1000
      } else if (item < 0) {
        item = 0
      }
    },
    async getCategoryList () {
      await this.$https.get(`/examQuery/categoryList`)
      .then(res => {
        if (res.data.code === 1) {
          this.testTypeList = res.data.result
          this.addDialog = this.testTypeList.map(item => ({...item, testName: item.name, mod: false}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    modCategory (item) {
      if (!item.mod && this.addDialog.some(item => item.mod)) {
        notice(this, '请先保存正在修改项', 2000)
        return
      }
      if (item.mod) {
        if (!item.name || item.name.trim() === '') {
          notice(this, '考试类型名称不能为空', 2000)
          return
        }
        this.$set(item, 'mod', !item.mod)
      } else {
        this.$set(item, 'mod', !item.mod)
        return
      }
      this.$https.post('/examManage/categorySave', querystring.stringify({
        name: item.name,
        id: item.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.getCategoryList()
        } else {
          this.getCategoryList()
          notice(this, res.data.message, 2000)
        }
      })
    },
    addCategory () {
      if (this.addDialog.some(item => item.mod)) {
        notice(this, '请先保存正在修改项', 2000)
        return
      }
      this.addDialog.push({testName: '', mod: true})
    },
    deleteCategory (item) {
      this.$https.post('/examManage/categoryDelete', querystring.stringify({
        id: item.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getCategoryList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async getSemesterList () {
      await this.$https.get(`/common/semesterList`)
      .then(res => {
        if (res.data.code === 1) {
          this.semesterList = res.data.result
          this.setInfo.semester = this.semesterList.filter(item => item.state === 1)[0].id
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async getSectionList () {
      await this.$https.get(`/common/sectionList`)
      .then(res => {
        if (res.data.code === 1) {
          this.sectionList = res.data.result
          if (this.sectionList) {
            this.setInfo.section = this.sectionList[0].id
            this.getGradeList()
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async getGradeList (s) {
      await this.$https.get(`/common/gradeList?sectionId=${this.setInfo.section}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = (res.data.result || []).map(item => ({...item, radio: item.id}))
          if (this.gradeList) {
            this.setInfo.grade = this.gradeList[0].id
            // console.log(this.setInfo.grade)
            this.modName()
          }
          if (s && s !== 'a') {
            this.setInfo.grade = s
            this.modName()
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },

    testType (item, i) {
      this.gradeInd = i
      this.refer = false
      this.modName()
    },

    // 获取单科等级
    getRankList (type, bol) {
      if (bol === false) return
      this.$https.get(`/examManage/ruleRankList?type=${type}&sectionId=${this.setInfo.section}&gradeId=${this.setInfo.grade}`)
      .then(res => {
        if (res.data.code === 1) {
          if (type === 1) {
            this.rankList.alignList = res.data.result
          } else if (type === 2) {
            this.rankList.totalList = res.data.result
          } else if (type === 3) {
            this.rankList.goodnessList = res.data.result
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取总分计算规则
    getScoreList (bol) {
      if (bol === false) return
      this.$https.get(`/examManage/ruleScoreList?gradeId=${this.setInfo.grade}&sectionId=${this.setInfo.section}`)
      .then(res => {
        if (res.data.code === 1) {
          this.rankList.totalCalcList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },

    // 获取总分计算规则详情
    getScoreDetail (id) {
      this.$https.get(`/examManage/ruleScoreDetail?gradeId=${this.setInfo.grade}&id=${id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.totalDetail = res.data.result
          this.totalDetail.mustList = (res.data.result.courseList || []).filter(item => item.requireFlag === 1)
          this.totalDetail.chooseList = (res.data.result.courseList || []).filter(item => item.requireFlag === 2)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取考号规则
    getExamnoList (bol) {
      if (this.test.numRule) {
        this.test.needNum = true
      }
      if (bol === false) return
      this.$https.get(`rule/examnoList?sectionId=${this.setInfo.section}`)
      .then(res => {
        if (res.data.code === 1) {
          this.rankList.numRuleList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取成绩规则
    getAsmList (bol) {
      if (bol === false) return
      this.$https.get(`/examManage/ruleStructureList?sectionId=${this.setInfo.section}`)
      .then(res => {
        if (res.data.code === 1) {
          this.rankList.asmList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取发布等级规则
    getLevelList (bol) {
      if (this.test.rankPublishRuleId) {
        this.test.publishFlag = true
      }
      if (bol === false) return
      this.$https.get(`/examManage/ruleRankPublishList`)
      .then(res => {
        if (res.data.code === 1) {
          this.rankList.levelList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 编辑时获取考试详情
    getExamDetails () {
      this.$https.get(`/examManage/examDetail?id=${this.testId}`)
      .then(async res => {
        if (res.data.code === 1) {
          let obj = res.data.result
          // console.log(obj)
          this.setInfo.semester = Number(obj.semesterId)
          this.setInfo.section = obj.sectionId
          // this.setInfo.grade = obj.gradeId
          await this.getGradeList(obj.gradeId)
          // this.setInfo.grade = obj.gradeId
          // console.log(obj)
          this.testTypeList.forEach((item, i) => {
            if (item.id === obj.categoryId) {
              this.gradeInd = i
            }
          })
          this.setInfo.testName = obj.name
          this.setInfo.needSort = obj.rankFlag
          this.setInfo.scoreEnterType = obj.scoreEnterType
          this.setInfo.startTime = obj.startTime
          this.setInfo.endTime = obj.endTime
          this.setInfo.publishStartTime = obj.publishStartTime
          this.setInfo.publishEndTime = obj.publishEndTime
          this.test.totalCalc = obj.scoreRuleId
          this.test.single = obj.rankCourseRuleId
          this.test.totalRule = obj.rankScoreRuleId
          this.test.excellent = obj.rankLevelRuleId
          this.test.numRule = obj.examnoRuleId
          this.test.structureRuleId = obj.structureRuleId
          this.test.rankPublishRuleId = obj.rankPublishRuleId
          if (obj.examnoFlag) {
            this.test.needNum = true
          } else {
            this.test.needNum = false
          }
          this.test.publishFlag = obj.publishFlag ? Boolean(true) : Boolean(false)
          this.getScoreDetail(this.test.totalCalc)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取考试对象信息
    async getObjectDetail () {
      await this.$https.get(`/examManage/objectDetail?examId=${this.testId}&ruleId=${this.test.totalCalc}&sectionId=${this.setInfo.section}`)
      .then(res => {
        if (res.data.code === 1) {
          if (this.$route.query.obj) {
            this.tableList = (res.data.result.courseList || []).map(item => ({...item, checked: false}))
            this.tableList.forEach(item => {
              if (item.id) {
                item.checked = true
              }
            })
          } else {
            this.tableList = (res.data.result.courseList || []).map(item => ({...item, checked: true}))
          }
          this.check.max = this.tableList.filter(item => item.requireFlag === 2).filter(item => item.checked).length
          this.check.min = this.check.max > 0 ? 1 : 0
          if (this.totalDetail.type === '系数折算') {
            this.check.number = 3
          } else {
            this.check.number = (res.data.result.requireNum || res.data.result.requireNum === 0) ? res.data.result.requireNum : ((this.check.max > 0) ? (this.check.max >= 3 ? 3 : 1) : 0)
          }
          this.schoolList = res.data.result.schoolList.map(item => ({...item, checked: false}))
          this.schoolList.forEach(item => {
            if (item.id) {
              item.checked = true
            }
          })
          if (this.schoolList.every(item => item.checked)) {
            this.checkedAll = true
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    subjectChange (item) {
      item.checked = !item.checked
      this.check.max = this.tableList.filter(item => item.requireFlag === 2)
                                      .filter(item => item.checked).length
      this.check.min = this.check.max > 0 ? 1 : 0
      if (this.totalDetail.type === '系数折算') {
        this.check.number = 3
      } else {
        this.check.number = (this.check.number > this.check.max) ? this.check.max : this.check.number
      }
    },
    modName () {
      if (this.refer) {
        return
      }
      let semester = ''
      let section = ''
      let grade = ''
      let categoryName = ''
      this.test.totalCalc = ''
      this.test.single = ''
      this.test.totalRule = ''
      this.test.excellent = ''
      this.test.numRule = ''
      this.test.structureRuleId = ''
      this.test.rankPublishRuleId = ''
      this.semesterList.forEach(item => {
        if (item.id === this.setInfo.semester) {
          semester = item.name
        }
      })
      this.sectionList.forEach(item => {
        if (item.id === this.setInfo.section) {
          section = item.name
        }
      })
      this.gradeList.forEach(item => {
        if (item.id === this.setInfo.grade) {
          grade = item.name
        }
      })
      categoryName = this.testTypeList[this.gradeInd].name
      this.setInfo.testName = `${semester || ''}${section || ''}${grade || ''}${categoryName || ''}`
    },
    // 全选
    checkAll () {
      if (this.checkedAll) {
        this.schoolList = this.schoolList.map(item => ({...item, checked: true}))
      } else {
        this.schoolList = this.schoolList.map(item => ({...item, checked: false}))
      }
    },
    handleChange () {
      let arr = this.schoolList.filter(item => item.checked)
      if (arr.length === this.schoolList.length) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
    },
    // 保存考试对象信息
    saveObject () {
      if (this.tableList.filter(item => item.checked).length === 0) {
        notice(this, '请选择考试科目/对象', 2000)
        return
      }
      console.log(this.tableList.filter(item => item.requireFlag === 2).filter(item => item.checked).length)
      if (this.totalDetail.type === '系数折算' && this.tableList.filter(item => item.requireFlag === 2).filter(item => item.checked).length < 3) {
        notice(this, '考试选考科目/对象至少为3科', 2000)
        return
      }
      let i = this.tableList.filter(item => item.requireFlag === 2)
                                      .filter(item => item.checked).length
      if (i > 0 && this.check.number === 0) {
        notice(this, '学生选科数至少为1', 2000)
        return
      }
      if (this.schoolList.filter(item => item.checked).length === 0) {
        notice(this, '请选择参加考试学校', 2000)
        return
      }
      this.tableList = this.tableList.map(item => ({...item, examFlag: 1}))
      this.$https.post('/examManage/objectSave', querystring.stringify({
        examId: this.testId,
        ruleId: this.test.totalCalc,
        requireNum: this.check.number,
        courseArray: JSON.stringify(this.tableList.filter(item => item.checked)),
        schoolArray: JSON.stringify(this.schoolList.filter(item => item.checked))
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.route('/exam')
          success(this, '保存成功', 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
  .test-index {
    height: calc(100% - 40px);
    color: #435a6c;
    padding: 0 40px 40px;

    p.content-head {
      height: 66px;
      line-height: 70px;
      font-weight: bold;

      .el-button {
        float: right;
        margin-top: 10px;
        line-height: 20px;
        font-weight: normal;

        i {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid $white;
          transform: translateX(-2px) scale(1.1);
          text-align: center;
        }
      }
    }

    .add-content {
      height: calc(100% - 60px);
      background: $white;
      overflow: auto;

      > section {
        width: 700px;
        margin: 0 auto;
      }

      .step-one {
        table {
          width: 100%;
          margin: 80px 0;

          td:first-child {
            width: 140px;
            text-align: right;
            height: 54px;

            &.top {
              vertical-align: top;
              padding-top: 6px;
            }
          }

          td:nth-child(2) {
            padding-left: 20px;

            .el-select {
              width: 100%;
            }

            .el-date-editor {
              width: 46% !important;
            }

            &.one-type {

              > .el-button {
                float: right;
              }

              > span {
                display: inline-block;
                margin-bottom: 20px;
                height: 36px;
                line-height: 36px;
                padding: 0 16px;
                margin-right: 20px;
                border-radius: 18px;
                border: 1px solid $border-color;
                cursor: pointer;

                &.active {
                  background: $theme;
                  color: $white;
                  border: none;
                }
              }
            }
          }
        }
      }

      .step-two {
        width: 700px;
        
        table {
          width: 100%;
          margin-bottom: 40px;
          
          &.first-table {
            td {
              height: 56px;
              line-height: 56px;

              &:first-child {
                width: 80px;
              }

              .el-select {
                width: 500px;
              }
            }
          }
          
        }
      }

      .step-three {
        width: 700px;
        > section > p {
          display: inline-block;
          margin-top: 20px;
        }

        > section > table {
          width: 80%;
          float: right;
          margin: 20px 0 40px;

          thead {
            td {
              background: #eef2f5;
            }
          }

          td {
            text-align: center;
            border: 1px solid $border-color;
            height: 40px;

            > i {
              display: block;
              margin: 0 auto;
              width: 24px;
              height: 40px;
              background: url(../../../assets/icons/delete.png) no-repeat center;
              background-size: contain;
              cursor: pointer;
            }

            > span {
              display: inline-block;
              width: 28px;
              height: 28px;
              vertical-align: middle;
              cursor: pointer;
              background: url(../../../assets/icons/sure.png) no-repeat center;

              &:nth-child(2) {
                background: url(../../../assets/icons/unsure.png) no-repeat center;
              }
            }
          }
        }

        > section > .school-table {
          float: right;
          margin: 20px 0;
          width: 80%;

          > .el-checkbox {
            display: inline-block;
            width: 33%;
            margin-left: 0;
            line-height: 40px;
            padding-left: 6px;
            box-sizing: border-box;
            border-right: 1px solid $border-color;
            border-bottom: 1px solid $border-color;

            &:first-child, &:nth-child(2), &:nth-child(3) {
              border-top: 1px solid $border-color;
            }

            &:nth-child(3n + 1) {
              border-left: 1px solid $border-color;
            }
          }
        }
      }


      .button-group {
        text-align: center;
      }
    }

    .el-steps {
      margin-top: 40px;
      
      .el-step__title {
        transform: translateY(-60px) translateX(-30px) !important;
      }
    }

    .el-dialog {
      table {
        width: 100%;
        margin: 20px 0;

        td {
          height: 46px;
          border: 1px solid $border-color;
          text-align: center;
          font-size: 0;

          .el-input {
            border: 1px solid #d1d5da;
          }

          input {
            border: none;
            height: 46px;
            border-radius: 0;
            border: 1px solid $theme;

            // &:focus {
            //   border: 1px solid $theme;
            // }
          }

          > i {
            display: inline-block;
            width: 32px;
            height: 46px;
            margin: 0 26px;
            cursor: pointer;
            background: url(../../../assets/icons/edit.png) no-repeat center;

            &.sure {
              background-image: url(../../../assets/icons/sure.png);
            }

            &:last-child {
              background-image: url(../../../assets/icons/delete.png);
            }
          }

          .category {
            font-size: 14px;
            overflow: hidden;
          }

          &:first-child {
            width: 260px;
          }

        }
        tr:first-child {
          td {
            font-size: 14px;
            background: #EEF2F5;
          }
        }

      }
    }
    .content-box-content {
      line-height: 26px !important;
    }
    .content-box,.box {
      width: 290px !important;
      .spans {
        margin-right: 78px !important;
      }
    }
    .box {
      display: inline-block;
      width: 220px;
      height: 260px;
      background: #e3f5e7;
      color: #a6e7ae;
      border: 1px dashed #a6e7ae;
      border-radius: 4px;
      line-height: 260px;
      font-size: 80px;
      text-align: center;
      margin-right: 60px;
      cursor: pointer;
    }
    .content-box {
      display: inline-block;
      width: 220px;
      height: 260px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-right: 60px;
      margin-bottom: 20px;
      &>.content-box-head {
        height: 48px;
        background: #7fce89;
        font-size: 14px;
        color: #fff;
        line-height: 48px;
        padding-left: 20px;
      }
      &>.content-box-content {
        height: 192px;
        font-size: 12px;
        color: #435a6c;
        line-height: 32px;
        padding-left: 20px;
        padding-top: 10px;
        padding-bottom: 30px;
        height: auto;
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
      }
      &>.content-box-foot {
        border-top: 1px solid #ccc;
        padding: 0 20px;
        line-height: 60px;
        .spans {
          position: relative;
          margin-right: 43px;
          cursor: pointer;
          img:nth-child(2) {
            display: none;
          }
          .tooltip {
            display: none;
          }
          &:hover {
            img:nth-child(1) {
              display: none;
            }
            img:nth-child(2) {
              display: inline-block;
            }
            .tooltip {
              position: absolute;
              left: 28px;
              top: -20px;
              display: inline-block;
              width: 40px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              background: #666;
              font-size: 12px;
              color: #fff;
            }
          }
        }
        .spans:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>

