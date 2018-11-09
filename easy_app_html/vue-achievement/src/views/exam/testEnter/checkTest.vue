<template>
  <div class="check-test">
    <!-- 查看试题 -->
    <section class="common-css">

      <!-- 左侧菜单 -->
      <!-- <section class="left-menu">
          <el-tree :data="treeMenu"
                   :props="defaultProps"
                   @node-click="route">
          </el-tree>
      </section> -->


      <!-- 右侧内容 -->
      <section class="right-content">
        <p class="content-head">考试管理 > {{ examInfo.name }} > 查看试题
          <!-- <el-button type="primary">
            <i><</i>
            返回考试列表
          </el-button> -->
        </p>

        <div class="exam-table" v-if="checkList.paperName">

          <!-- 试卷信息 -->
          <section class="test-head">
            <p class="check-title">试卷信息
              <el-button type="primary" @click="paperCommit" v-if="menu.buttons && menu.buttons.paperCommit == 1">提交试卷</el-button>
              <el-button type="primary" @click="paperDelete" v-if="menu.buttons && menu.buttons.paperDelete == 1">删除该试卷</el-button>
              <el-button type="primary" @click="paperUpdate" v-if="menu.buttons && menu.buttons.paperEdit == 1">编辑试卷</el-button>
            </p>

            <table>
              <tr>
                <td>考试科目：</td>
                <td>{{ checkList.courseName }}</td>
              </tr>

              <tr>
                <td>试卷名称：</td>
                <td>{{ checkList.paperName }}</td>
              </tr>
              <tr>
                <td>试卷总分：</td>
                <td>{{ checkList.paperScore }}</td>
              </tr>
              <tr>
                <td>试卷：</td>
                <td class="test-down" @click="downPaper(checkList.paperPath, '')">{{ checkList.paperName }}</td>
              </tr>
              <tr>
                <td>试卷答案：</td>
                <td class="test-down" @click="downPaper(checkList.paperAnswerPath, '答案')">{{ checkList.paperName }}答案</td>
              </tr>
            </table>
          </section>

          <!-- 试题 -->
          <section class="test-list">
            <p class="check-title">试题</p>

            <table>
              <tr>
                <th v-for="item in tableHead" :key="item.name">{{ item.name }}</th>
              </tr>
              <tr v-for="(item, i) in checkList.listQuestionScore" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ item.questionNo }}</td>
                <td>
                  <span v-if="item.type == 1">客观</span>
                  <span v-else>主观</span>
                </td>
                <td>{{ item.score }}</td>
                <!-- <td>
                  <img src="../../../assets/icons/delete.png" alt="" @click="deleteResearch(item, i)">
                </td> -->
              </tr>
              <tr v-if="!checkList.listQuestionScore || checkList.listQuestionScore.length == 0">
                <td :colspan="5">暂无数据</td>
              </tr>
            </table>
          </section>

          <!-- 双向细目表 -->
          <section class="test-table">
            <p class="check-title">双向细目表</p>

            <table>
              <thead>
                <tr>
                  <td :colspan="2">知识点</td>
                  <td v-for="item in tableTop" :key="item.gradeLevel">{{ item.gradeLevel }}</td>
                </tr>
              </thead>
              <tbody v-for="item in checkList.listKnowledgePointMastery" :key="item.id">
                <tr v-for="(items, i) in item.children" :key="i" v-if="items">
                  <td :rowspan="item.children.length" v-if="i == 0">{{ item.pointNo }}{{ item.pointName }}</td>
                  <td>{{ items.pointNo }}{{ items.pointName }}</td>
                  <td v-for="(level, ind) in items.children" :key="ind" @click.stop="saveQuestionKnow(level, items)">
                    <span v-for="(question, index) in level.levelList" :key="index">{{ question.questionNo }} </span>
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


  </div>
</template>

<script>
import { notice, success } from '../../../api/index.js'
import querystring from 'querystring'
import { ContentTree } from '../../../api/tree.js'
export default {
  name: 'check-test',
  data () {
    return {
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
        { name: '分数' }
        // { name: '操作' }
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
      treeList: []
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu
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
    this.getPaperDetail()
  },
  methods: {
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
    getPaperDetail () {
      if (!this.testInfo.id) return
      this.$https.post(`/examQuestionEnter/paperAllDetail`, querystring.stringify({
        paperId: this.testInfo.id
      }))
      .then(async res => {
        if (res.data.code === 1) {
          if (!res.data.result) return
          let tree = [ ...res.data.result.listKnowledgePointMastery ]
          this.checkList = res.data.result
          await this.getList()
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
          // console.log(res.data.result)
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
      this.$router.push({ path: '/exam/editTest', query: {obj: this.$route.query.obj} })
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
            }

            th {
              background: #eef2f5;
              height: 30px;
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
  }
</style>

