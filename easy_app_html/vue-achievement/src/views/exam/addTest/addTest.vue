<template>
  <div class="add-test">
      <p class="content-head">考试管理 > {{ examInfo.name }} > 试卷录入 > 新增试卷
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
          <el-step title="试卷信息录入"></el-step>
          <el-step title="试题录入"></el-step>
          <el-step title="试题录入"></el-step>
          <el-step title="双向细目表录入"></el-step>
        </el-steps>

        <!-- 第一步 -->
        <section class="step-one" v-show="active == 0">
          <table>
            <tr>
              <td>考试科目：</td>
              <td>
                <el-select v-model="subject" placeholder="选择科目" @change="handleChange(1, 2)">
                  <el-option
                    v-for="(item, i) in subjectList"
                    :key="i"
                    :label="item.courseName"
                    :value="item.courseId">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>试卷名称：</td>
              <td>
                <el-input v-model="testName" placeholder="请输入" @change.native="handleChange(1)"></el-input>
              </td>
            </tr>
            <tr>
              <td>试卷总分：</td>
              <td>
                <el-input v-model="testTotal" placeholder="请输入" type="number" @change.native="handleChange(1)"></el-input>
              </td>
            </tr>
            <tr>
              <td>试卷：</td>
              <td class="upload-question">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="upload"
                  name="paperPath"
                  :data="upData"
                  :file-list="paperList"
                  :on-success="handleSuccess"
                  :auto-upload="false">
                  <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                </el-upload>
              </td>
            </tr>
            <tr>
              <td>试卷答案：</td>
              <td class="upload-answer">
                <el-upload
                  class="upload-demo"
                  ref="uploadAnswer"
                  :action="upload"
                  name="paperAnswer"
                  :data="upData"
                  :file-list="answerList"
                  :on-success="handleSuccess"
                  :auto-upload="false">
                  <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                </el-upload>
              </td>
            </tr>
          </table>
          <div class="button-group">
            <el-button type="danger" @click="$router.push('/examQuestionEnter/paper')">取消</el-button>
            <el-button type="primary" @click="next">下一步</el-button>
          </div>
        </section>

        <!-- 第二步 -->
        <section class="step-two" v-show="active == 1">
          <table class="first-table">
            <tr>
              <td>大题：</td>
              <td>
                <el-input v-model="testNum" type="number" @blur="blur(testNum)"></el-input>
              </td>
            </tr>
            <tr>
              <td class="text-top">其中：</td>
              <td>
                <section class="small-num" v-for="(test, i) in testNumList" :key="i">
                  <el-select v-model="test.testName" @change="testNumFilter">
                    <el-option
                      v-for="item in testList"
                      :key="item.name"
                      :label="item.name"
                      :disabled="item.disabled"
                      :value="item.name">
                    </el-option>
                  </el-select>
                  <span>大题，有</span>
                  <el-input v-model="test.testNum" type="number"></el-input>
                  <span>小题</span>
                  <i class="add-small" @click="addSmall(i, 0)"></i>
                  <i class="delete-small" @click="addSmall(i, 1)"></i>
                </section>
              </td>
            </tr>
          </table>
          <div class="button-group">
            <el-button type="success" @click="prop">上一步</el-button>
            <el-button type="primary" @click="next">下一步</el-button>
          </div>
        </section>

        <!-- 第三步 -->
        <section class="step-three" v-show="active == 2">

          <el-button type="primary" @click="dialogShow = true">新增</el-button>

          <table>
            <thead>
              <tr>
                <td v-for="item in tableHead" :key="item.name">{{ item.name }}</td>
              </tr>
            </thead>

            <tr v-for="(item, i) in tableList" :key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ item.questionNo }}</td>
              <td>
                <el-radio class="radio" v-model="item.radio" :label="1" @change.native="saveScore(item)">客观</el-radio>
                <el-radio class="radio" v-model="item.radio" :label="2" @change.native="saveScore(item)">主观</el-radio>
              </td>
              <td class="score">
                <el-input v-model="item.score" type="number" @blur="saveScore(item)"></el-input>
              </td>
              <td>
                <i @click="deletePaper(item)"></i>
              </td>
            </tr>

            <tr v-show="tableList.length == 0">
              <td :colspan="5">暂无数据</td>
            </tr>
          </table>

          <div class="button-group">
            <el-button type="success" @click="prop">上一步</el-button>
            <el-button type="primary" @click="next">下一步</el-button>
          </div>
        </section>

        <!-- 第四步 -->
        <section class="step-fore" v-show="active == 3">

          <section class="test-head">
            <div v-for="(item, i) in tableList" :key="item.questionNo" :class="{active: testInd == i, visited: item.visited}" @click.stop="titleClick(i)">{{ item.questionNo }}</div>
          </section>

          <section class="test-select">
            <span>知识点：</span>
            <el-select v-model="knowledge" @change="knowledgeChange">
              <el-option
                v-for="(item, i) in knowledgeList"
                :key="i"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span>能力等级：</span>
            <el-select v-model="ability" @change="masteryChange">
              <el-option
                v-for="(item, i) in abilityList"
                :key="i"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </section>

          <section class="test-table">
            <table>
              <thead>
                <tr>
                  <td :colspan="2">知识点</td>
                  <td v-for="item in tableTop" :key="item.gradeLevel">{{ item.gradeLevel }}</td>
                </tr>
              </thead>
              <tbody v-for="(item, indexs) in tableLeft" :key="indexs">
                <tr v-for="(items, i) in item.children" :key="i" v-if="items">
                  <td :rowspan="item.children.length" v-if="i == 0">{{ item.pointNo }}{{ item.pointName }}</td>
                  <td>{{ items.pointNo }}{{ items.pointName }}</td>
                  <td v-for="(level, ind) in items.children" :key="ind" @click.stop="saveQuestionKnow(level, items, indexs, i, ind)">
                    <span v-for="(question, index) in level.levelList" :key="index" class="ques">
                      <span>{{ question.questionNo }}</span>
                      <span class="span" @click.stop="deleteQuestionKnow(question, level, items, indexs, i, ind, index)">-</span>
                    </span>
                  </td>
                </tr>
                <tr v-else>
                  <td :colspan="2">{{ item.pointNo }}{{ item.pointName }}</td>
                  <td></td>
                </tr>
              </tbody>
              <tr v-show="tableLeft.length == 0">
                <td :colspan="tableTop.length + 2">暂无数据</td>
              </tr>
            </table>
          </section>
          
          <div class="button-group">
            <el-button type="success" @click="prop">上一步</el-button>
            <el-button type="primary" @click="commitQuestionKnow">提交</el-button>
          </div>
        </section>


        

      </div>

      <el-dialog
        title="新增试题"
        :visible.sync="dialogShow"
        :show-close="false">
        <i class="el-icon-close close" @click="dialogShow = false"></i>
        
        <table>
          <tr>
            <td class="td-must">大题题号 ：</td>
            <td>
              <el-input v-model="addDialog.bigTest" type="number"></el-input>
            </td>
          </tr>
          <tr>
            <td>小题题号 ：</td>
            <td>
              <el-input v-model="addDialog.smallTest" type="number"></el-input>
            </td>
          </tr>
          <tr>
            <td class="td-must">结构 ：</td>
            <td>
              <el-radio class="radio" v-model="addDialog.structure" :label="1">客观</el-radio>
              <el-radio class="radio" v-model="addDialog.structure" :label="2">主观</el-radio>
            </td>
          </tr>
          <tr>
            <td class="td-must">分数 ：</td>
            <td>
              <el-input v-model="addDialog.score" type="number"></el-input>
            </td>
          </tr>
          <!-- <tr>
            <td>答案 ：</td>
            <td>
              <el-input v-model="addDialog.bigTest"></el-input>
            </td>
          </tr> -->
        </table>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogShow = false">取 消</el-button>
          <el-button type="primary" @click="addScore">保 存</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { notice } from '../../../api/index.js'
import querystring from 'querystring'
import { ContentTree } from '../../../api/tree.js'
import axios from 'axios'
export default {
  name: 'add-test',
  data () {
    return {
      dialogShow: false,
      examInfo: {
        name: ''
      },
      active: 0,
      subject: '',
      subjectList: [],
      testName: '',
      testTotal: '',
      testNum: 0,
      testNumList: [
        { testName: '', testNum: 0 }
      ],
      testList: [],
      tableHead: [
        { name: '序号' },
        { name: '题号' },
        { name: '结构' },
        { name: '分数' },
        { name: '操作' }
      ],
      tableList: [],
      addDialog: {
        bigTest: '',
        smallTest: '',
        structure: 1,
        score: '',
        answer: ''
      },
      knowledgeList: [],
      knowledge: '',
      tableLeft: [],
      tableTop: [],
      abilityList: [],
      ability: '',
      upData: {
        id: '',
        examId: '',
        courseId: '',
        name: '',
        score: '',
        test: false,
        answer: false,
        md5Answer: 'ab546548190cde5486ab546548190cde5486ab546548190cde5486ab546548190cde5486ab546548190cde5486ab546548190cde5486',
        md5Paper: 'ab546548190cde5486ab546548190cde5486ab546548190cde5486ab5acbed48951245abce48190cde5486ab546548190cde5486'
      },
      testInd: '',
      firstUpload: false,
      oneChange: false,
      paperId: '',
      answerList: [],
      paperList: []
    }
  },
  computed: {
    upload () {
      let path = document.querySelector('#contextPath').value
      return `${path}/examQuestionEnter/paperSave`
    }
  },
  methods: {
    route (s) {
      this.$router.push(s)
    },
    handleChange (s, t) {
      if (this.oneChange === 2) return
      this.oneChange = s
      if (t === 2) {
        this.$refs.upload.clearFiles()
        this.$refs.uploadAnswer.clearFiles()
      }
    },
    chooseFile (s) {
      if (s === 1) {
        this.upData.test = true
      }
      if (s === 2) {
        this.upData.answer = true
      }
    },
    async next () {
      if (this.active === 0) {
        if (!this.subject) {
          notice(this, '请选择考试科目', 2000)
          return
        }
        if (!this.testName || this.testName.trim() === '') {
          notice(this, '请输入试卷名称', 2000)
          return
        }
        if (!this.testTotal) {
          notice(this, '请输入试卷总分', 2000)
          return
        }
        var arrs = document.getElementsByClassName('el-upload-list__item-name')
        if ((arrs.length < 2) && !this.upData.id) { // 新增，不够两个
          notice(this, '请选择试卷及试卷答案', 2000)
          return
        } else if (this.upData.id && !this.oneChange) { // 编辑，不操作
          this.active++
        } else if (this.upData.id && arrs.length > 0 && this.oneChange === 2) {
          // console.log(document.querySelector('.upload-question').getElementsByClassName('el-upload-list__item-name').length)
          if (document.querySelector('.upload-question').getElementsByClassName('el-upload-list__item-name').length) {
            this.$refs.upload.submit()
          }
          if (document.querySelector('.upload-answer').getElementsByClassName('el-upload-list__item-name').length) {
            this.$refs.uploadAnswer.submit()
          }
        } else if (!this.upData.id) { // 新增，试卷及答案
          this.firstUpload = true
          this.savePaper()
          this.$refs.upload.submit()
        } else { // 编辑，修改参数，不上传
          const formData = new FormData()
          let data = {
            id: this.upData.id,
            examId: this.upData.examId,
            courseId: this.subject,
            name: this.testName,
            score: this.testTotal
          }
          Object.keys(data).map(key => {
            formData.append(key, data[key])
          })
          axios({
            url: '/examQuestionEnter/paperSave',
            method: 'post',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then(res => {
            if (res.data.code === 1) {
              this.upData.id = res.data.result
              this.active++
              this.getQuestionNumDetail()
            } else {
              notice(this, res.data.message, 2000)
            }
          })
        }
      } else if (this.active === 1) {
        this.saveQuestionNum()
      } else if (this.active === 2) {
        let score = Number(0)
        this.tableList.forEach(item => {
          score = Number(score) + Number(item.score)
        })
        this.$https.post('examQuestionEnter/paperScoreCheck', querystring.stringify({
          paperId: this.upData.id,
          score
        }))
        .then(async res => {
          if (res.data.code === 1) {
            this.active++
            await this.getMasteryList()
            this.getKnowledgeList()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (this.active === 3) {
      }
    },
    prop () {
      this.active--
      this.oneChange = false
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
    handleSuccess (_) {
      this.oneChange = 2
      if (!this.firstUpload) {
        this.getQuestionNumDetail()
        this.active++
      }
      if (_.code === 1) {
        this.firstUpload = false
        this.upData.id = _.result
        this.$refs.uploadAnswer.submit()
      } else {
        // this.subject = ''
        // this.testName = ''
        // this.testTotal = ''
        this.$refs.upload.clearFiles()
        this.$refs.uploadAnswer.clearFiles()
        notice(this, _.message, 2000)
      }
    },
    addSmall (i, s) {
      if (s === 0 && this.testNumList.length >= this.testNum) return
      if (s === 1 && this.testNumList.length === 1) return
      if (s === 1) {
        this.testNumList.splice(i, s)
        this.testNumFilter()
      } else {
        this.testNumList.splice(i + 1, s, { testNum: '', testName: '' })
      }
    },
    blur (item) {
      if (item > 1000) {
        item = 1000
      } else if (item < 0) {
        item = 0
      }
      this.testList = []
      for (let i = 0; i < item; i++) {
        this.testList.push({ name: `T${i + 1}`, disabled: false })
      }
      this.testNumList = [{ testName: '', testNum: 0 }]
    },
    testNumFilter () {
      this.testList = (this.testList || []).map(item => ({
        ...item,
        disabled: false
      }))
      this.testList.forEach(item => {
        this.testNumList.forEach(items => {
          if (item.name === items.testName) {
            this.$set(item, 'disabled', true)
          }
        })
      })
    },
    getSubject () {
      this.$https.get(`/common/courseList?examId=${this.examInfo.id}&scoreRuleId=${this.examInfo.scoreRuleId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subjectList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存试卷信息录入情况 第一步
    savePaper () {
      // this.upData.id = 4
      this.upData.examId = this.examInfo.id
      this.upData.courseId = this.subject
      this.upData.name = this.testName
      this.upData.score = this.testTotal
    },
    // 获取试卷信息
    getPaperDetail (id) {
      this.$https.get(`/examQuestionEnter/paperDetail?id=${this.upData.id}`)
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存大题，包含小题个数
    async saveQuestionNum () {
      if (!this.testNum || this.testNum < 1) {
        notice(this, '大题个数不少于0', 2000)
        return
      }
      // console.log(this.testNumList)
      this.testNumList = this.testNumList.filter(item => item.testName)
      if (this.testNumList.length < this.testNum) {
        for (let i = 0; i < this.testNum; i++) {
          if (!this.testNumList.some(item => item.testName === `T${i + 1}`)) {
            this.testNumList.splice(i, 0, { testName: `T${i + 1}`, testNum: 0 })
          }
        }
      }
      let questionNumArray = JSON.stringify((this.testNumList || []).map(item => ({id: '', examId: this.examInfo.id, paperId: this.upData.id, questionNo: item.testName, num: item.testNum || 0})))
      await this.$https.post('/examQuestionEnter/paperQuestionNumSave', querystring.stringify({
        examId: this.examInfo.id,
        paperId: this.upData.id,
        questionNumArray
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result || []).map(item => ({ ...item, radio: item.type || 1, visited: false }))
          this.active++
          this.getScoreList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取大题包含小题个数信息
    getQuestionNumDetail (item) {
      this.$https.get(`/examQuestionEnter/paperQuestionNumDetail?examId=${this.examInfo.id}&paperId=${this.upData.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result || []).map(item => ({ ...item, radio: item.type || 1, visited: false }))
          this.getScoreList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 单个保存试题分数信息
    saveScore (item) {
      this.$https.post('/examQuestionEnter/paperQuestionScoreSave', querystring.stringify({
        id: item.id,
        type: item.radio,
        score: item.score
      }))
      .then(res => {
        if (res.data.code === 1) {
        } else {
          item.score = 0
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 新增试题
    addScore () {
      if (!this.addDialog.bigTest) {
        notice(this, '请输入大题题号', 2000)
        return
      }
      if (!this.addDialog.score) {
        notice(this, '请输入分数', 2000)
        return
      }
      this.$https.post('/examQuestionEnter/paperQuestionScoreAdd', querystring.stringify({
        examId: this.examInfo.id,
        paperId: this.upData.id,
        parentQuestionNo: this.addDialog.bigTest,
        questionNo: this.addDialog.smallTest,
        type: this.addDialog.structure,
        score: this.addDialog.score
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.dialogShow = false
          this.getQuestionNumDetail()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除题目
    deletePaper (item) {
      this.$https.post('/examQuestionEnter/paperQuestionScoreDelete', querystring.stringify({
        id: item.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result || []).map(item => ({ ...item, radio: item.type || 1, visited: false }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取试题分数信息
    getScoreList () {
      this.$https.get(`/examQuestionEnter/paperQuestionScoreList?examId=${this.examInfo.id}&paperId=${this.upData.id}`)
      .then(res => {
        if (res.data.code === 1) {
          // this.tableList.forEach(item => {
          //   res.data.result.forEach(items => {
          //     if (item.questionNo === items.questionNo) {
          //       this.$set(item, 'score', items.score)
          //     }
          //   })
          // })
          this.tableList = (res.data.result || []).map(item => ({ ...item, radio: item.type || 1, visited: false }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取知识点文件夹下拉列表
    async getKnowledgeList () {
      await this.$https.get(`/examQuestionEnter/knowledgePointFolderList?gradeId=${this.examInfo.gradeId}` +
                      `&sectionId=${this.examInfo.sectionId}&courseId=${this.subject}`)
      .then(async res => {
        if (res.data.code === 1) {
          this.knowledgeList = res.data.result
          this.knowledge = this.knowledgeList[0].id
          await this.getKnowledgeByFolderId()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取知识点文件夹下，知识点列表
    getKnowledgeByFolderId () {
      this.$https.get(`/examQuestionEnter/knowledgePointListByFolderId?folderId=${this.knowledge}`)
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
          let dataList = (res.data.result || []).map(item => ({...item, parentId: item.parentPointId}))
          this.tableLeft = new ContentTree([...dataList]).init(0)
          this.tableLeft.forEach(item => {
            if (!item.children) {
              item.children = []
              item.children = [{...item}]
            }
          })
          this.tableLeft = this.sortKnowledge(this.tableLeft)
          if (this.tableTop.length > 0) {
            this.tableLeft.forEach(item => {
              if (item.children.length > 0) {
                item.children.forEach((items, i) => {
                  this.$set(item.children[i], 'children', this.tableTop.map(item => ({...item, name: items.gradeLevel, levelList: []})))
                  // items.children = this.tableTop.map(item => ({...item, name: items.gradeLevel, id: items.folderId}))
                })
              }
            })
            this.getQuestionKnowLedgeList()
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 改变知识点
    knowledgeChange (val) {
      this.knowledge = val
      this.getKnowledgeByFolderId()
    },
    // 给知识点排序
    sortKnowledge (arr) {
      arr.forEach((item, i) => {
        item.pointNo = (i + 1).toFixed(1)
        if (item.children) {
          item.children.forEach((items, ind) => {
            items.pointNo = ((i + 1) + ((ind + 1) / 10)).toFixed(1)
          })
        }
      })
      return arr
    },
    // 获取能力等级
    async getMasteryList () {
      await this.$https.get(`/examQuestionEnter/knowledgeMasteryFolderList?gradeId=${this.examInfo.gradeId}` +
                      `&sectionId=${this.examInfo.sectionId}&courseId=${this.subject}`)
      .then(async res => {
        if (res.data.code === 1) {
          this.abilityList = res.data.result
          this.ability = this.abilityList[0].id
          await this.getMasteryByFolderId()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取能力等级列表
    getMasteryByFolderId () {
      this.$https.get(`/examQuestionEnter/knowledgeMasteryListByFolderId?folderId=${this.ability}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableTop = (res.data.result || [])
          if (this.tableLeft.length > 0) {
            this.tableLeft.forEach(item => {
              if (item.children.length > 0) {
                item.children.forEach((items, i) => {
                  this.$set(item.children[i], 'children', this.tableTop.map(item => ({...item, name: items.gradeLevel, levelList: []})))
                })
              }
            })
            this.getQuestionKnowLedgeList()
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    masteryChange (val) {
      this.ability = val
      this.getMasteryByFolderId()
    },
    titleClick (i) {
      this.testInd = i
    },
    // 新增单个双向细目表
    saveQuestionKnow (level, item, indexs, i, ind) {
      if (!this.tableList[this.testInd]) return
      for (let j = 0; j < this.tableLeft[indexs].children[i].children[ind].levelList.length; j++) {
        if (this.tableLeft[indexs].children[i].children[ind].levelList[j].questionNo === this.tableList[this.testInd].questionNo) {
          notice(this, '题目不可重复', 2000)
          return
        }
      }
      this.$https.post('/examQuestionEnter/questionKnowledgeSave', querystring.stringify({
        examId: this.examInfo.id,
        paperId: this.upData.id,
        questionScoreId: this.tableList[this.testInd].id,
        knowledgePointId: item.id,
        knowledgeMasteryId: level.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          console.log(this.tableLeft[indexs].children[i].children[ind])
          if (this.tableLeft[indexs].children[i].children[ind].levelList && this.tableLeft[indexs].children[i].children[ind].levelList.length > 0) {
            this.tableLeft[indexs].children[i].children[ind].levelList.push({questionNo: this.tableList[this.testInd].questionNo, id: res.data.result})
          } else {
            this.tableLeft[indexs].children[i].children[ind].levelList = [{questionNo: this.tableList[this.testInd].questionNo, id: res.data.result}]
          }
          this.$set(this.tableLeft[indexs].children[i].children[ind], 'levelList', this.tableLeft[indexs].children[i].children[ind].levelList)
          // this.getQuestionKnowLedgeList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // deleteQuestionKnow (question, level, items, indexs, i, ind, index) { // 未完，待续
    //   this.$https.post('/examQuestionEnter/questionKnowledgeDelete', querystring.stringify({
    //     id: item.id
    //   }))
    //   .then(res => {
    //     if (res.data.code === 1) {
    //       this.getQuestionKnowLedgeList()
    //     } else {
    //       notice(this, res.data.message, 2000)
    //     }
    //   })
    // },
    deleteQuestionKnow (items, level, item, index, i, ind, indexs) { // 删除
      console.log(items)
      if (!items.id) return
      this.$https.post('/examQuestionEnter/questionKnowledgeDelete', querystring.stringify({
        id: items.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          // this.getQuestionKnowLedgeList()
          this.tableLeft[index].children[i].children[ind].levelList.splice(indexs, 1)
          this.$set(this.tableLeft[index].children[i].children[ind], 'levelList', this.tableLeft[index].children[i].children[ind].levelList)
          // this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList.splice(indexs, 1)
          // this.$set(this.checkList.listKnowledgePointMastery[index].children[i].children[ind], 'levelList', this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    commitQuestionKnow () {
      this.$https.post('/examQuestionEnter/questionKnowledgeCommit', querystring.stringify({
        paperId: this.upData.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.$router.push('/examQuestionEnter/paper')
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    getQuestionKnowLedgeList () {
      this.tableLeft.forEach(item => {
        (item.children || []).forEach((items, i) => {
          (items.children || []).forEach(child => {
            child.levelList = []
          })
        })
      })
      this.$https.get(`/examQuestionEnter/questionKnowledgeList?examId=${this.examInfo.id}` +
                      `&paperId=${this.upData.id}` +
                      `&masteryFolderId=${this.ability}` +
                      `&pointFolderId=${this.knowledge}`)
      .then(res => {
        if (res.data.code === 1) {
          let resultList = [...res.data.result]
          this.tableLeft.forEach(item => {
            (item.children || []).forEach((items, i) => {
              (items.children || []).forEach(child => {
                resultList.forEach(result => {
                  if ((result.knowledgeMasteryId === child.id) && (result.knowledgePointId === items.id)) {
                    child.levelList.push(result)
                  }
                })
              })
            })
          })
          this.tableList = this.tableList.map(item => ({...item, visited: false}))
          resultList.forEach(item => {
            this.tableList.forEach(items => {
              if (item.questionScoreId === items.id) {
                this.$set(items, 'visited', true)
              }
            })
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async getDetail () {
      await this.$https.post(`/examQuestionEnter/paperAllDetail`, querystring.stringify({
        paperId: this.paperId
      }))
      .then(res => {
        if (res.data.code === 1) {
          let result = res.data.result
          this.subject = result.courseId
          this.testName = result.paperName
          this.testTotal = result.paperScore
          this.paperList = [{name: `${result.courseName}试卷`, url: result.paperPath}]
          this.answerList = [{name: `${result.courseName}试卷答案`, url: result.paperAnswerPath}]
          this.tableList = (result.listQuestionScore || []).map(item => ({...item, radio: item.type || 1, visited: false}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    getTestNum () {
      this.$https.get(`/examQuestionEnter/paperQuestionNumDetail?examId=${this.upData.examId}&paperId=${this.paperId}`)
      .then(res => {
        if (res.data.code === 1) {
          let result = (res.data.result || []).filter(item => String(item.paperId) === String(this.paperId))
          this.testNum = result.length
          this.blur(this.testNum)
          this.testNumList = result.map(item => ({testName: item.questionNo, testNum: item.num}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  async created () {
    let obj = JSON.parse(sessionStorage.EXAMINFO)
    this.examInfo = { ...obj }
    this.upData.examId = sessionStorage.PARAMS_EXAMID
    if (this.$route.query.paperId) {
      this.paperId = this.$route.query.paperId
      this.upData.id = this.$route.query.paperId
      await this.getDetail()
      this.getTestNum()
    }
    this.getSubject()
  },
  mounted () {
    document.onclick = () => {
      this.testInd = -1
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
  .add-test {
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
            width: 80px;
            text-align: right;
            height: 54px;
          }

          td:nth-child(2) {
            padding-left: 20px;

            .upload-demo {
              display: inline;

              .el-upload {
                float: right;
                margin-left: 20px;
                margin-top: 10px;
              }

              ul {
                float: right;
                width: 500px;
                min-height: 40px;
                border: 1px solid $border-color;
                border-radius: 6px;
                overflow: hidden;
              }
            }

            .el-select {
              width: 100%;
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

              .small-num {

                > * {
                  float: left;
                }

                .el-select {
                  width: 130px;
                  margin-right: 10px;
                }

                > .el-input {
                  display: inline-block;
                  width: 130px;
                  margin: 0 10px;
                }

                > i {
                  display: inline-block;
                  width: 30px;
                  margin-left: 30px;
                  cursor: pointer;
                  height: 56px;
                  background: url(../../../assets/icons/delete.png) no-repeat center;
                  background-size: contain;

                  &:first-of-type {
                    margin-left: 100px;
                    background-image: url(../../../assets/icons/add-small.png);

                  }
                }

                > .el-button {
                  float: right;
                  margin-top: 10px;
                }
              }

              
            }

            .text-top {
              vertical-align: top !important;
            }
          }
          
        }
      }

      .step-three {
        width: 700px;

        > table {
          width: 100%;
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

            &.score {
              width: 100px;

              input {
                border: none;
                text-align: center;

                &:focus {
                  border: 1px solid $left-menu-bg;
                }
              }
            }
          }
        }
      }

      .step-fore {
        width: 1000px;

        .test-head {
          display: flex;
          flex-wrap: wrap;

          > div {
            margin: 0 10px 10px 0;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 1px solid $border-color;
            text-align: center;
            line-height: 32px;
            cursor: pointer;

            &.active {
              background: $theme;
              color: $white;
              border: none;
            }

            &.has {
              background: #55acee;
              color: $white;
              border: none;
            }
          }
        }

        .test-table {
          margin: 20px 0;
          overflow: auto;

          table {
            width: 100%;

            thead td {
              background: $theme;
              color: #fff;
            }

            td {
              height: 40px;
              min-width: 80px;
              text-align: center;
              border: 1px solid $border-color;

              .ques {
                position: relative;
                padding: 8px;

                .span {
                  display: none;
                  position: absolute;
                  left: 8px;
                  background: #4db3ff;
                  color: #fff;
                  cursor: pointer;
                  width: 30px;
                  height: 30px;
                  top: 3px;
                  line-height: 24px;
                  border-radius: 5px;
                  font-size: 32px;
                }

                &:hover {
                  .span {
                    display: block;
                  }
                }
              }
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
      margin-left: 40px;
      
      .el-step__title {
        transform: translateY(-60px) translateX(-30px) !important;
      }
    }

    .el-dialog {
      table {
        width: 100%;

        td {
          position: relative;
          height: 46px;

          &:first-child {
            width: 80px;
            padding-right: 16px;
            text-align: right;
          }
        }

        .td-must::after {
          content: '*';
          color: red;
          position: absolute;
          right: 26px;
        }
      }
    }
  }
</style>

