<template>
  <div class="check-test">
    <!-- 查看试题 -->
    <section class="common-css">

      <section class="right-content">
        <p class="content-head">考试管理 > {{ examInfo.name }} > 编辑试题
        </p>

        <div class="exam-table" v-if="checkList.paperName">

          <!-- 试卷信息 -->
          <section class="test-head">
            <p class="check-title">试卷信息
              <el-button type="primary" @click="saveOne">保存修改</el-button>
              <el-button type="primary" @click="cancle">取消编辑</el-button>
            </p>

            <table>
              <tr>
                <td>考试科目：</td>
                <td>
                  <span>{{ checkList.courseName }}</span>
                  <!-- <el-select v-model="checkList.courseId" placeholder="选择科目" @change="handleChange(1, 2)">
                    <el-option
                      v-for="(item, i) in subjectList"
                      :key="i"
                      :label="item.courseName"
                      :value="item.courseId">
                    </el-option>
                  </el-select> -->
                </td>
              </tr>

              <tr>
                <td>试卷名称：</td>
                <td>
                  <el-input
                    v-model="checkList.paperName"></el-input>
                </td>
              </tr>
              <tr>
                <td>试卷总分：</td>
                <td>
                  <el-input
                    v-model="checkList.paperScore"
                    type="number"></el-input>
                </td>
              </tr>
              <tr>
                <td>试卷：</td>
                <td class="test-down">
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
                <td class="test-down">
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

            <!-- <p class="check-title">
              
            </p> -->
          </section>

          <!-- 试题 -->
          <section class="test-list">
            <p class="check-title">试题</p>
            <el-button type="primary" @click="dialogShow = true" style="margin-bottom: 20px;">新增</el-button>
            <table>
              <tr>
                <th v-for="item in tableHead" :key="item.name">{{ item.name }}</th>
              </tr>
              <tr v-for="(item, i) in checkList.listQuestionScore" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ item.questionNo }}</td>
                <td class="radios">
                  <span v-show="!item.isShow" @click="change(item)">
                    <span v-if="item.type == 1">客观</span>
                    <span v-else>主观</span>
                  </span>
                  <div v-show="item.isShow">
                    <el-radio class="radio" v-model="item.type" :label="1" @change.native="changeRadio(item)">客观</el-radio>
                    <el-radio class="radio" v-model="item.type" :label="2" @change.native="changeRadio(item)">主观</el-radio>
                  </div>
                  <!-- <el-input type="number" v-model="item.score" @blur="changeScore(item)"></el-input> -->
                </td>
                <td class="score">
                  <el-input type="number" v-model="item.score" @focus="oldScore(item)" @blur="changeScore(item, checkList)"></el-input>
                </td>
                <td>
                  <img src="../../../assets/icons/delete.png" alt="" @click="deleteResearch(item, i)">
                </td>
              </tr>
              <tr v-if="!checkList.listQuestionScore || checkList.listQuestionScore.length == 0">
                <td :colspan="5">暂无数据</td>
              </tr>
            </table>
          </section>

          <!-- 双向细目表 -->
          <section class="test-table">
            <p class="check-title">双向细目表</p>

            <!-- <span v-for="(item, i) in checkList.listQuestionScore"
              :class="{active: i == ind}"
              class="dis"
              :key="i">{{ item.questionNo }}</span> -->
            <section class="test-select" v-if="editKM">
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

            <section class="test-head test-heads">
              <div v-for="(item, i) in checkList.listQuestionScore"
                :key="i"
                :class="{active: testInd == i, visited: item.visited}"
                @click.stop="titleClick(i)">
                {{ item.questionNo }}
              </div>
            </section>
            <table>
              <thead>
                <tr>
                  <td :colspan="2">知识点</td>
                  <td v-for="item in tableTop" :key="item.gradeLevel">{{ item.gradeLevel }}</td>
                </tr>
              </thead>
              <tbody v-for="(item, indexs) in checkList.listKnowledgePointMastery" :key="indexs">
                <tr v-for="(items, i) in item.children" :key="i" v-if="items">
                  <td :rowspan="item.children.length" v-if="i == 0">{{ item.pointNo }}{{ item.pointName }}</td>
                  <td>{{ items.pointNo }}{{ items.pointName }}</td>
                  <td v-for="(level, ind) in items.children" :key="ind" @click.stop="saveQuestionKnow(level, items, indexs, i, ind)">
                    <span v-for="(question, index) in level.levelList" :key="index" class="ques">
                      <!-- {{ question.questionNo }} -->
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
              <tr v-show="checkList.listKnowledgePointMastery.length == 0">
                <td :colspan="tableTop.length + 2">暂无数据</td>
              </tr>
            </table>
          </section>
        </div>


      </section>

    </section>

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
import { notice, success } from '../../../api/index.js'
import querystring from 'querystring'
import { ContentTree } from '../../../api/tree.js'
import axios from 'axios'
export default {
  name: 'check-test',
  data () {
    return {
      isShow: false,
      examInfo: {
        name: '',
        id: '',
        scoreRuleId: '',
        companyId: '',
        sectionId: ''
      },
      treeMenu: [
        {
          name: '试题列表',
          children: [
            { name: '添加新试卷', path: '/exam/addTest' }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableHead: [
        { name: '序号' },
        { name: '题号' },
        { name: '结构' },
        { name: '分数' },
        { name: '操作' }
      ],
      testInfo: {
        subjectName: '',
        testName: '',
        total: 0,
        test: '',
        answer: '',
        testList: [],
        id: ''
      },
      detailTable: [
        {
          knowLedge: '1.0集合与常用逻辑用语',
          children: [
            { knowLedge: '1.0集合与常用逻辑用语', test: 'T8,T9' },
            { knowLedge: '1.0集合与常用逻辑用语', test: 'T8,T9' },
            { knowLedge: '1.0集合与常用逻辑用语', test: 'T8,T9' },
            { knowLedge: '1.0集合与常用逻辑用语', test: 'T8,T9' }
          ]
        },
        {
          knowLedge: '1.0集合与常用逻辑用语',
          children: [
            { knowLedge: '1.0集合与常用逻辑用语', test: 'T8,T9' },
            { knowLedge: '1.0集合与常用逻辑用语', test: 'T8,T9' },
            { knowLedge: '1.0集合与常用逻辑用语', test: 'T8,T9' },
            { knowLedge: '1.0集合与常用逻辑用语', test: 'T8,T9' }
          ]
        }
      ],
      tableTop: [],
      checkList: {
        courseId: '',
        courseName: '',
        listKnowledgePointMastery: [],
        listQuestionScore: [],
        paperAnswerPath: '',
        paperEnterFlag: '',
        paperId: '',
        paperName: '',
        paperPath: '',
        paperScore: ''
      },
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
      treeList: [],
      answerList: [],
      paperList: [],
      subjectList: [],
      dialogShow: false,
      addDialog: {
        bigTest: '',
        smallTest: '',
        structure: 1,
        score: '',
        answer: ''
      },
      testInd: -1,
      knowledgeList: [],
      knowledge: '',
      abilityList: [],
      ability: '',
      allScore: 0,
      editKM: false,
      oldScores: 0
    }
  },
  computed: {
    upload () {
      let path = document.querySelector('#contextPath').value
      return `${path}/examQuestionEnter/paperSave`
    }
  },
  async created () {
    let json = JSON.parse(sessionStorage.EXAMINFO)
    let obj = JSON.parse(this.$route.query.obj)
    this.examInfo.id = json.id
    this.examInfo.name = obj.name || json.name
    this.examInfo.companyId = obj.companyId || json.companyId
    this.examInfo.sectionId = obj.sectionId || json.sectionId
    this.examInfo.scoreRuleId = obj.scoreRuleId || json.scoreRuleId
    this.testInfo.id = obj.id
    this.examInfo.gradeId = json.gradeId
    // this.getSubjects()
    await this.getPaperDetail()
  },
  methods: {
    change (item) {
      item.isShow = true
    },
    oldScore (item) {
      console.log(item)
      this.oldScores = item.score
    },
    changeRadio (item) {
      this.$https.post('/examQuestionEnter/paperQuestionScoreSave', querystring.stringify({
        id: item.id,
        type: item.type,
        score: item.score
      }))
      .then(res => {
        if (res.data.code === 1) {
          item.isShow = false
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 单个保存试题分数信息
    changeScore (item, checkList) {
      item.isShow = false
      // this.allScore = 0
      // checkList.listQuestionScore.forEach(one => {
      //   this.allScore += Number(one.score)
      // })
      // if (this.allScore > this.checkList.paperScore) {
      //   item.score = this.oldScores
      //   notice(this, '题目分数超过总分', 2000)
      //   return
      // }
      this.$https.post('/examQuestionEnter/paperQuestionScoreSave', querystring.stringify({
        id: item.id,
        type: item.type,
        score: item.score
      }))
      .then(res => {
        if (res.data.code === 1) {
        } else {
          // item.score = this.oldScores
          notice(this, res.data.message, 2000)
        }
      })
    },
    getSubjects () {
      this.$https.get(`/common/courseList?examId=${this.examInfo.id}&scoreRuleId=${this.examInfo.scoreRuleId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subjectList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    route (data) {
      if (!data.path) {
        this.testInfo.id = data.id
        this.getPaperDetail()
      } else {
        let paper = ''
        if (data.parent !== 1) {
          paper = JSON.stringify({paperId: data.id, subject: data.courseId, name: data.name, score: data.score})
        }
        this.$router.push({ path: '/exam/addTest', query: { obj: this.$route.query.obj, paper } })
      }
    },
    async getPaperDetail () {
      if (!this.testInfo.id) return
      await this.$https.post(`/examQuestionEnter/paperAllDetail`, querystring.stringify({
        paperId: this.testInfo.id
      }))
      .then(async res => {
        if (res.data.code === 1) {
          if (!res.data.result) return
          let tree = [ ...res.data.result.listKnowledgePointMastery ]
          this.checkList = res.data.result
          await this.getList()
          this.paperList = [{name: `${this.checkList.courseName}试卷`, url: this.checkList.paperPath}]
          this.answerList = [{name: `${this.checkList.courseName}试卷答案`, url: this.checkList.paperAnswerPath}]
          let listKnowledgePointMastery = (this.treeList.knowlegePoint || []).map(item => ({...item, parentId: item.parentPointId}))
          this.checkList.listKnowledgePointMastery = new ContentTree([...listKnowledgePointMastery]).init(0) || []
          this.checkList.listKnowledgePointMastery.forEach(item => {
            if (!item.children) {
              item.children = []
              item.children = [{...item}]
            }
          })
          this.sortKnowledge(this.checkList.listKnowledgePointMastery)
          this.tableTop = [ ...this.treeList.knowlegeMastery ]
          if (this.tableTop.length > 0) {
            this.checkList.listKnowledgePointMastery.forEach(item => {
              if (item.children.length > 0) {
                item.children.forEach((items, i) => {
                  this.$set(item.children[i], 'children', this.tableTop.map(item => ({...item, name: items.gradeLevel, levelList: []})))
                })
              }
            })
          }
          if (this.checkList.listKnowledgePointMastery.length > 0) {
            this.editKM = false
            this.checkList.listKnowledgePointMastery.forEach(item => {
              (item.children || []).forEach((items, i) => {
                (items.children || []).forEach(child => {
                  (tree || []).forEach(result => {
                    if ((result.gradeLevel === child.gradeLevel) && (result.pointId === items.id)) {
                      child.levelList.push(result)
                    }
                  })
                })
              })
            })
          } else {
            this.editKM = true
            await this.getMasteryList()
            this.getKnowledgeList()
          }
          // 秦新增代码
          this.checkList.listQuestionScore = res.data.result.listQuestionScore.map((one) => ({
            ...one,
            isShow: false
          }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
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
    deleteResearch (item, i) {
      this.$https.post('/examQuestionEnter/paperScoreDelete', querystring.stringify({
        questionScoreId: item.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.checkList.listQuestionScore.splice(i, 1)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    getSubject () {
      this.$https.get(`/examQuestionEnter/paperList?examId=${this.examInfo.id}&scoreRuleId=${this.examInfo.scoreRuleId}`)
      .then(res => {
        if (res.data.code === 1) {
          let result = res.data.result || []
          if (result.length) {
            this.testInfo.id = result[0].id
            this.getPaperDetail()
          } else {
            this.$router.push({ path: '/exam/addTest', query: { obj: this.$route.query.obj } })
          }
          this.treeMenu[0].children = result.map(item => ({
            ...item
            // path: '/exam/addTest'
          }))
          this.treeMenu[0].children.push({ name: '添加新试卷', path: '/exam/addTest', id: '', subject: '', parent: 1 })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    download (s) {
      let path = document.querySelector('#contextPath').value
      if (s === 1) {
        window.location.href = `${path}/${this.checkList.paperPath}`
      } else {
        window.location.href = `${path}/${this.checkList.paperAnswerPath}`
      }
    },
    async getList () {
      await this.$https.get(`/examQuestionEnter/paperKnowledgeDetail?examId=${this.examInfo.id}&courseId=${this.checkList.courseId}&companyId=${this.examInfo.companyId}&sectionId=${this.examInfo.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.treeList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    downPaper (url, name) {
      let arr = url.split('.')
      let _ = arr[arr.length - 1]
      let path = document.querySelector('#contextPath').value
      window.location.href = `${path}/examQuestionEnter/paperDownload?filename=${this.checkList.paperName}${name}.${_}&filepath=${url}`
    },
    paperDelete () {
      this.$https.post('examQuestionEnter/paperDelete', querystring.stringify({
        id: this.testInfo.id
      }))
      .then(async res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.$router.push('/examQuestionEnter/paper')
          // await this.getSubject()
          // this.getPaperDetail()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    paperUpdate () {
      this.$router.push({ path: '/exam/addTest', query: {obj: this.$route.query.obj} })
    },
    paperCommit () {
      this.$https.post('/examQuestionEnter/questionKnowledgeCommit', querystring.stringify({
        paperId: this.testInfo.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message || '提交成功', 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    cancle () {
      this.$router.push({ path: '/exam/checkTest', query: {obj: this.$route.query.obj} })
    },
    handleSuccess (_) {
      if (!this.firstUpload) {
        this.getQuestionNumDetail()
        this.active++
      }
      if (_.code === 1) {
        this.firstUpload = false
        this.upData.id = _.result
        this.$refs.uploadAnswer.submit()
      } else {
        this.$refs.upload.clearFiles()
        this.$refs.uploadAnswer.clearFiles()
        notice(this, _.message, 2000)
      }
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
        paperId: this.checkList.paperId,
        parentQuestionNo: this.addDialog.bigTest,
        questionNo: this.addDialog.smallTest,
        type: this.addDialog.structure,
        score: this.addDialog.score
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.dialogShow = false
          success(this, '修改成功', 2000)
          this.addDialog = {
            bigTest: '',
            smallTest: '',
            structure: 1,
            score: '',
            answer: ''
          }
          this.getPaperDetail()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    saveOne () {
      this.allScore = 0
      this.checkList.listQuestionScore.forEach(one => {
        this.allScore += Number(one.score)
      })
      if (this.allScore > this.checkList.paperScore) {
        notice(this, '题目分数超过总分', 2000)
        return
      }
      const formData = new FormData()
      let data = {
        id: this.checkList.paperId,
        examId: this.examInfo.id,
        courseId: this.checkList.courseId,
        name: this.checkList.paperName,
        score: this.checkList.paperScore
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
          success(this, '修改成功', 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    titleClick (i) {
      this.testInd = i
    },
    // 新增单个双向细目表
    saveQuestionKnow (level, item, index, i, ind) {
      if (this.testInd < 0) return
      if (!this.checkList.listQuestionScore[this.testInd]) return
      for (let j = 0; j < this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList.length; j++) {
        if (this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList[j].questionNo === this.checkList.listQuestionScore[this.testInd].questionNo) {
          notice(this, '题目不可重复', 2000)
          return
        }
      }
      this.$https.post('/examQuestionEnter/questionKnowledgeSave', querystring.stringify({
        examId: this.examInfo.id,
        paperId: this.checkList.paperId,
        questionScoreId: this.checkList.listQuestionScore[this.testInd].id,
        knowledgePointId: item.id,
        knowledgeMasteryId: level.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          if (this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList && this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList.length > 0) {
            this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList.push({questionNo: this.checkList.listQuestionScore[this.testInd].questionNo, id: res.data.result})
          } else {
            this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList = [{questionNo: this.checkList.listQuestionScore[this.testInd].questionNo, id: res.data.result}]
          }
          this.$set(this.checkList.listKnowledgePointMastery[index].children[i].children[ind], 'levelList', this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取知识点文件夹下拉列表
    async getKnowledgeList () {
      await this.$https.get(`/examQuestionEnter/knowledgePointFolderList?gradeId=${this.examInfo.gradeId}` +
                      `&sectionId=${this.examInfo.sectionId}&courseId=${this.checkList.courseId}`)
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
          let dataList = (res.data.result || []).map(item => ({...item, parentId: item.parentPointId}))
          this.checkList.listKnowledgePointMastery = new ContentTree([...dataList]).init(0)
          this.checkList.listKnowledgePointMastery.forEach(item => {
            if (!item.children) {
              item.children = []
              item.children = [{...item}]
            }
          })
          this.checkList.listKnowledgePointMastery = this.sortKnowledge(this.checkList.listKnowledgePointMastery)
          if (this.tableTop.length > 0) {
            this.checkList.listKnowledgePointMastery.forEach(item => {
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
    // 获取能力等级
    async getMasteryList () {
      await this.$https.get(`/examQuestionEnter/knowledgeMasteryFolderList?gradeId=${this.examInfo.gradeId}` +
                      `&sectionId=${this.examInfo.sectionId}&courseId=${this.checkList.courseId}`)
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
          if (this.checkList.listKnowledgePointMastery.length > 0) {
            this.checkList.listKnowledgePointMastery.forEach(item => {
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
    getQuestionKnowLedgeList () {
      this.checkList.listKnowledgePointMastery.forEach(item => {
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
          this.checkList.listKnowledgePointMastery.forEach(item => {
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
          this.checkList.listQuestionScore = this.checkList.listQuestionScore.map(item => ({...item, visited: false}))
          resultList.forEach(item => {
            this.checkList.listQuestionScore.forEach(items => {
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
    deleteQuestionKnow (items, level, item, index, i, ind, indexs) { // 删除
      if (!items.knowledgeId && !items.id) return
      this.$https.post('/examQuestionEnter/questionKnowledgeDelete', querystring.stringify({
        id: items.knowledgeId || items.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          // this.getQuestionKnowLedgeList()
          this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList.splice(indexs, 1)
          this.$set(this.checkList.listKnowledgePointMastery[index].children[i].children[ind], 'levelList', this.checkList.listKnowledgePointMastery[index].children[i].children[ind].levelList)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    masteryChange (val) {
      this.ability = val
      this.getMasteryByFolderId()
    }
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
  .check-test {
    height: calc(100% - 20px);

    .el-tree {

      > .el-tree-node {

        .el-tree-node:last-child {
          padding-left: 30px;
          border-radius: 6px;
          background: url(../../../assets/icons/+.png) no-repeat 30px center;
          background-color: $white;
          color: $theme;
        }
      }
    }

    .right-content {
      padding: 0 40px 40px;
      height: calc(100% - 20px);

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

      .exam-table {
        background: $white;
        height: calc(100% - 66px);
        overflow: auto;

        > section {
          padding: 30px;
          border-bottom: 2px solid $border-color;

          &:last-child {
            bottom: none;
          }

          > .check-title {
            color: $theme;
            margin-bottom: 20px;

            .el-button {
              float: right;
              margin: 0 0 0 20px;
            }
          }

          &.test-head {
            table {
              td {
                height: 56px;

                &:first-child {
                  text-align: right;
                }

                &:nth-child(2) {
                  padding-left: 20px;
                }

                &.test-down {
                  color: #55acee;
                  text-decoration: underline;
                  cursor: pointer;
                }
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

          &.test-list > table {
            width: 680px;
            
            td, th {
              border: 1px solid $border-color;
              text-align: center;
              height: 36px;

              > img {
                cursor: pointer;
                vertical-align: middle;
              }

              .el-input {
                display: inline-block;
                // width: 100px;
                border: 0 !important;
                border-color: #fff;
              }
              .el-input__inner {
                border-color: #fff;
              }
            }

            th {
              background: #eef2f5;
              height: 30px;
            }

            .score {
              width: 100px;

              input {
                cursor: pointer;
                border: none;
                text-align: center;

                &:focus {
                  border: 1px solid $left-menu-bg;
                }
              }

              .isRed {
                input {
                  color: red;
                }
              }
            }

            .radios {
              width: 200px;

              > span {
                padding: 10px 80px;
                cursor: pointer;
              }
            }
          }

          &.test-table {
            overflow: auto;
          }

          &.test-table > table {
            width: 100%;
            // min-width: 800px;
            
            thead {
              background: #eef2f5;
            }

            td {
              border: 1px solid $border-color;
              text-align: center;
              height: 36px;
              min-width: 40px;
            }
          }
        }
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

    .test-heads {
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

    .test-select {
      margin-bottom: 10px;
    }

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
</style>
