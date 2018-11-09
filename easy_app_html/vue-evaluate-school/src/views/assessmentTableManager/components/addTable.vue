<template>
  <div id="assessment-table-manager">
    <header>
      <el-row>
        <el-col :span="12">
          <i>选择题型：</i>
          <span @click="instruction">段落说明</span>
          <span @click="objective">主观题</span>
          <span @click="subjective">客观题</span>
        </el-col>
        <el-col :span="12">
          <span>
            <el-upload
              class="upload-demo"
              :action="action"
              :disabled="canUpload"
              name="file"
              :data="{'tableId': tableId}"
              :show-file-list="false"
              :on-success="success"
              :before-upload="handlePreview">
              <span @click="importQuertion">导入试题</span>
            </el-upload>
          </span>
          
          <span @click="downloadTemplete">下载导入模板</span>
          <span @click="educe">导出</span>
          <el-button size="large" type="primary" @click="complete">完成</el-button>
        </el-col>
      </el-row>
    </header>

    <div @click="tableTitleShow = false" style="cursor: pointer;" class="big-question">
      <a v-if="!tableTitleShow">请输入标题：</a>
      <el-input :maxlength="30" v-if="!tableTitleShow" v-focus="true" @blur="addTable" v-model.trim="tableTitle"></el-input>
      <i v-if="tableTitleShow">{{tableTitle}}</i>
      <span>总分：<i>{{totalCount}}</i></span>
    </div>
    <div class="body">
      <main>
        <div class="big-top"></div>
        <div v-for="(item, index) in allList" :key="index">
          
          <!-- 主观题 -->
          <div class="answer-question" v-if="item.questionType === 2">
            
            <div class="answer-question-look" v-if="!item.show">
              <p style="cursor: pointer;" @click="editShow(item)">{{ item.order + 1 }}.{{ item.title }}</p>
              <br>
              <el-input :rows="2" type="textarea" autosize></el-input>
            </div>
            <el-input v-model.trim="item.title" v-if="item.show" v-focus="true" type="textarea" autosize maxlength="200"></el-input>
            <p v-if="item.show">
              <el-button size="large" type="danger" :plain="true" @click="delQuestion(item)">删除</el-button>
              <el-button size="large" @click="updateObjectiveCancel(item)">取消</el-button>
              <el-button size="large" @click="updateObjectiveConfirm(item)" type="primary">确定</el-button>
            </p>

          </div>

          <!-- 段落说明 -->
          <div class="answer-question" v-if="item.questionType === 3">
            
            <div class="answer-question-look"  style="cursor: pointer;" v-if="!item.show" @click="editShow(item)">
              <p>{{ item.title }}</p>
            </div>
            <el-input v-model.trim="item.title" v-if="item.show"  v-focus="true" maxlength="200"></el-input>
            <p v-if="item.show">
              <el-button size="large" type="danger" :plain="true" @click="delQuestion(item)">删除</el-button>
              <el-button size="large" @click="updateObjectiveCancel(item)">取消</el-button>
              <el-button size="large" @click="updateObjectiveConfirm(item)" type="primary">确定</el-button>
            </p>

          </div>

          <!-- 客观题 -->
          <div class="choose-qusetion-look" style="cursor: pointer;" @click="editShow(item)" v-if="!item.show && item.questionType === 1">
            <span>{{ item.order + 1 }}.{{ item.title }}</span>
            <br>
            <p v-for="(child, i) in JSON.parse(item.content)" :key="i">
              <el-radio class="radio" v-model="item.radio"></el-radio>
              <span>
                <i style="font-style: normal;">{{ englishOption[i] }}.</i>
                {{ child.content }}
                <i style="font-style: normal;margin-left: 20px;">{{ child.score }}分</i>
              </span>
            </p>
          </div>
          <div class="choose-question" v-if="item.questionType === 1 && item.show">
            <p>
              <span>题目</span><el-input v-model.trim="item.title" v-focus="true" maxlength="150"></el-input>
            </p>
            <transition-group name="slide-left" mode="out-in"> 
              <div v-for="(child, i) in item.contentList" :key="i">
                <span>选项</span>
                <el-input v-model.trim="child.content" maxlength="100"></el-input>
                <i>分数</i>
                <el-input class="score" v-model="child.score" :min="0" type="number"></el-input>
                <sub>
                  <img src="../../../assets/images/jia.png" @click="addOptionOther(item, child, i)" alt="">
                  <img src="../../../assets/images/jian.png"  @click="delOptionOther(item, child, i)" alt="">
                  <img src="../../../assets/images/shang.png" @click="moveUpOther(item, child, i)" alt="">
                  <img src="../../../assets/images/xia.png" @click="moveDownOther(item, child, i)" alt="">
                </sub>
              </div>
            </transition-group>

            <p>
              <el-button type="danger" :plain="true" size="large" @click="delQuestion(item)">删除</el-button>
              <el-button size="large" @click="updateObjectiveCancel(item)">取消</el-button>
              <el-button size="large" type="primary" @click="updateSubjectiveConfirm(item)">确定</el-button>
            </p>
          </div>
          
        </div>
        <!-- /////////////////////////////////////////////// -->
        <!-- 主观题 -->
        <div class="answer-question" v-if="objectiveShow">
          <el-input v-model.trim="objectiveContent" v-focus="true" type="textarea" autosize maxlength="200"></el-input>
          <p>
            <el-button size="large" @click="objectiveCancel">取消</el-button>
            <el-button size="large" @click="objectiveConfirm" type="primary">确定</el-button>
          </p>
        </div>
        <!-- 客观题 -->
        <div class="choose-question" v-if="subjectiveShow">

          <p>
            <span>题目</span><el-input v-model.trim="subjectiveContent" v-focus="true"></el-input>
          </p>

          <transition-group name="slide-left" mode="out-in"> 
            <div v-for="(item, index) in options" :key="index">
              <span>选项</span>
              <el-input v-model.trim="item.optionContent" maxlength="150"></el-input>
              <i>分数</i>
              <el-input class="score" v-model.number="item.score" :min="0" type="number" maxlength="100"></el-input>
              <sub>
                <img src="../../../assets/images/jia.png" @click="addOption(item, index)" alt="">
                <img src="../../../assets/images/jian.png"  @click="delOption(item, index)" alt="">
                <img src="../../../assets/images/shang.png" @click="moveUp(item, index)" alt="">
                <img src="../../../assets/images/xia.png" @click="moveDown(item, index)" alt="">
              </sub>
            </div>
          </transition-group> 

          <p>
            <el-button size="large" @click="subjectiveCancel">取消</el-button>
            <el-button size="large" type="primary" @click="subjectiveConfirm">确定</el-button>
          </p>

        </div>
      </main>
    </div>
  </div>
</template>

<script>
import querystring from 'querystring'
import { notice, success, error } from '../../../api/index'
export default {
  name: 'assessmentTableManager',
  data () {
    return {
      radio: -1,
      objectiveShow: false,
      subjectiveShow: false,
      canUpload: false,
      options: [
        {score: 0, optionContent: ''},
        {score: 0, optionContent: ''},
        {score: 0, optionContent: ''},
        {score: 0, optionContent: ''}
      ],
      englishOption: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      questionList: [],
      tableTitle: '',
      tableTitleShow: true,
      objectiveContent: '',
      subjectiveContent: '',
      paragraphOrObjective: '',
      allList: [],
      totalCount: 0,
      tableId: ''
    }
  },
  directives: {
    focus: {
      inserted: function (el, option) {
        var defClass = 'el-input'
        var defTag = 'input'
        var value = option.value || true
        if (typeof value === 'boolean') {
          value = { cls: defClass, tag: defTag, foc: value }
        } else {
          value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false }
        }
        if (el.classList.contains(value.cls) && value.foc) {
          el.getElementsByTagName(value.tag)[0].focus()
        }
      }
    }
  },
  methods: {
    handlePreview (file) {
      if (file.type.indexOf('application/vnd.ms-excel') === -1 && file.type.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') === -1) {
        this.$message.error('请导入excel表')
        return false
      }
    },
    success (res) {
      if (res.code === 1) {
        success(this, '导入成功', 1000)
        this.getDetail()
      } else {
        notice(this, '该表格不适用', 2000)
      }
    },
    editShow (item) {
      if (this.tableTitle) {
        for (let i = 0; i < this.allList.length; i++) {
          if (this.allList[i].show === true) {
            this.$alert('您还有未保存的题目', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
            return
          }
        }
        this.allList.forEach((child, index) => {
          if (child.id === item.id) {
            child.show = true
          } else {
            child.show = false
          }
        })
      }
    },
    delQuestion (item) {
      if (item.questionType === 1 || item.questionType === 2) {
        this.$https.post('/table/questionDelete', querystring.stringify({
          tableId: sessionStorage.tableId,
          id: item.id
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '删除成功', 1000)
            this.getDetail()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else {
        this.$https.post('/table/quTitleDelete', querystring.stringify({
          tableId: Number(sessionStorage.tableId),
          titleId: item.id
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '删除成功', 1000)
            this.getDetail()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 编辑主观题（确定）
    updateSubjectiveConfirm (item) {
      if (item.title) {
        for (let i = 0; i < item.contentList.length; i++) {
          if (item.contentList[i].content === '') {
            notice(this, '请添加选项内容', 2000)
            return
          }
          if (Number(item.contentList[i].score) !== 0) {
            if (!(/^[1-9][\d]*$/).test(item.contentList[i].score)) {
              notice(this, '分值需为正整数', 2000)
              return
            }
          }
        }
        for (let i = 0; i < item.contentList.length; i++) {
          for (let j = i + 1; j < item.contentList.length; j++) {
            if (Number(item.contentList[i].score) === Number(item.contentList[j].score)) {
              notice(this, '选项的分值，不可以相同', 2000)
              return
            }
            if (Number(item.contentList[i].content) === Number(item.contentList[j].content)) {
              notice(this, '选项的内容，不可以相同', 2000)
              return
            }
          }
        }
        let jsonOption = []
        item.contentList.forEach((child, index) => {
          jsonOption.push({content: child.content, score: Number(child.score)})
        })
        this.$https.post('/table/questionEdit', querystring.stringify({
          tableId: sessionStorage.tableId,
          id: item.id,
          questionType: 1,
          title: item.title,
          content: JSON.stringify(jsonOption)
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '修改成功', 1000)
            this.getDetail()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else {
        notice(this, '请输入主观题题目', 2000)
      }
    },
    // 编辑段落说明--客观题--主观题（取消）
    updateObjectiveCancel (item) {
      this.getDetail()
      // item.show = false
    },
    // 编辑段落说明--客观题（确定）
    updateObjectiveConfirm (item) {
      if (item.title === '') {
        notice(this, '请填写内容', 2000)
        return
      }
      if (item.questionType === 3) {
        this.$https.post('/table/quTitleEdit', querystring.stringify({
          tableId: sessionStorage.tableId,
          id: item.id,
          name: item.title
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '编辑成功', 1000)
            this.getDetail()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (item.questionType === 2) {
        this.$https.post('/table/questionEdit', querystring.stringify({
          tableId: sessionStorage.tableId,
          id: item.id,
          questionType: 2,
          title: item.title,
          content: ''
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '编辑成功', 1000)
            this.getDetail()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 上移
    moveUp (item, index) {
      if (index !== 0) {
        let list = [...this.options]
        this.options.splice(index, 1, list[index - 1])
        this.options.splice(index - 1, 1, list[index])
      }
    },
    // 下移
    moveDown (item, index) {
      if (index !== this.options.length - 1) {
        let list = [...this.options]
        this.options.splice(index, 1, list[index + 1])
        this.options.splice(index + 1, 1, list[index])
      }
    },
    // 删除单选选项
    delOption (item, index) {
      if (this.options.length === 2) {
        notice(this, '最少要有2个选项', 2000)
      } else {
        this.options.splice(index, 1)
      }
    },
    // 添加单选选项
    addOption (item, index) {
      if (this.options.length === 10) {
        notice(this, '最多可以有10个选项', 2000)
      } else {
        this.options.splice(index + 1, 0, {score: 0, optionContent: ''})
      }
    },
    // 上移(已经创建好的)
    moveUpOther (item, child, index) {
      if (index !== 0) {
        let list = [...item.contentList]
        item.contentList.splice(index, 1, list[index - 1])
        item.contentList.splice(index - 1, 1, list[index])
      }
    },
    // 下移(已经创建好的)
    moveDownOther (item, child, index) {
      if (index !== item.contentList.length - 1) {
        let list = [...item.contentList]
        item.contentList.splice(index, 1, list[index + 1])
        item.contentList.splice(index + 1, 1, list[index])
      }
    },
    // 删除单选选项(已经创建好的)
    delOptionOther (item, child, index) {
      if (item.contentList.length === 2) {
        notice(this, '最少要有2个选项', 2000)
      } else {
        item.contentList.splice(index, 1)
      }
    },
    // 添加单选选项(已经创建好的)
    addOptionOther (item, child, index) {
      if (item.contentList.length === 10) {
        notice(this, '最多可以有10个选项', 2000)
      } else {
        item.contentList.splice(index + 1, 0, {content: '', score: 0})
      }
    },
    // 客观题--段落说明（取消）
    objectiveCancel () {
      this.objectiveContent = ''
      this.objectiveShow = false
    },
    // 添加客观题--段落说明（确定）
    objectiveConfirm () {
      let num = 0
      this.allList.forEach((item, index) => {
        if (item.number > num) {
          num = item.number
        }
      })
      if (this.paragraphOrObjective === 1) {
        if (this.objectiveContent) {
          this.$https.post('/table/quTitleAdd', querystring.stringify({
            tableId: sessionStorage.tableId,
            number: num + 1,
            name: this.objectiveContent
          }))
          .then(res => {
            if (res.data.code === 1) {
              success(this, '添加段落说明成功', 1000)
              this.objectiveShow = false
              this.getDetail()
            } else {
              notice(this, res.data.message, 2000)
            }
          })
        } else {
          notice(this, '请输入主观题内容', 2000)
        }
      } else if (this.paragraphOrObjective === 2) {
        if (this.objectiveContent) {
          this.$https.post('/table/questionAdd', querystring.stringify({
            tableId: sessionStorage.tableId,
            titleId: '',
            number: num + 1,
            questionType: 2,
            title: this.objectiveContent,
            content: ''
          }))
          .then(res => {
            if (res.data.code === 1) {
              success(this, '添加客观题成功', 1000)
              this.objectiveShow = false
              this.objectiveContent = ''
              this.getDetail()
            } else {
              notice(this, res.data.message, 2000)
            }
          })
        } else {
          notice(this, '请输入主观题内容', 2000)
        }
      }
    },
    // 主观题取消
    subjectiveCancel () {
      this.subjectiveContent = ''
      this.options = [
        {score: 0, optionContent: ''},
        {score: 0, optionContent: ''},
        {score: 0, optionContent: ''},
        {score: 0, optionContent: ''}
      ]
      this.subjectiveShow = false
    },
    // 添加主观题确定
    subjectiveConfirm () {
      if (this.subjectiveContent) {
        for (var i = 0; i < this.options.length; i++) {
          if (this.options[i].optionContent === '') {
            notice(this, '请添加选项内容', 2000)
            return
          }
          if (this.options[i].score !== 0) {
            if (!(/^[1-9][\d]*$/).test(this.options[i].score)) {
              notice(this, '分值需为正整数', 2000)
              return
            }
          }
        }
        for (let i = 0; i < this.options.length; i++) {
          for (let j = i + 1; j < this.options.length; j++) {
            if (Number(this.options[i].score) === Number(this.options[j].score)) {
              notice(this, '选项的分值，不可以相同', 2000)
              return
            }
            if (Number(this.options[i].optionContent) === Number(this.options[j].optionContent)) {
              notice(this, '选项的内容，不可以相同', 2000)
              return
            }
          }
        }
        let num = 0
        this.allList.forEach((item, index) => {
          if (item.number > num) {
            num = item.number
          }
        })
        let jsonOption = []
        this.options.forEach((item, index) => {
          jsonOption.push({content: item.optionContent, score: item.score})
        })
        this.$https.post('/table/questionAdd', querystring.stringify({
          tableId: sessionStorage.tableId,
          titleId: '',
          number: num + 1,
          questionType: 1,
          title: this.subjectiveContent,
          content: JSON.stringify(jsonOption)
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '添加主观题成功', 1000)
            this.subjectiveShow = false
            this.subjectiveContent = ''
            this.options = [
              {score: 0, optionContent: ''},
              {score: 0, optionContent: ''},
              {score: 0, optionContent: ''},
              {score: 0, optionContent: ''}
            ]
            this.getDetail()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else {
        notice(this, '请输入主观题题目', 2000)
      }
    },
    // 完成按钮
    complete () {
      this.$router.push('/assessmentTableManager/index')
    },
    // 添加测评表
    addTable () {
      if (sessionStorage.tableId) {
        if (this.tableTitle === '') {
          notice(this, '请添加测评表名称', 2000)
        } else {
          this.$https.post('/table/edit', querystring.stringify({
            id: sessionStorage.tableId,
            tabelName: this.tableTitle,
            state: ''
          }))
          .then(res => {
            if (res.data.code === 1) {
              success(this, '修改成功', 1000)
              this.getDetail()
              this.tableTitleShow = true
            } else if (res.data.code === 0) {
              notice(this, '该测评表名称已经存在，请重新输入', 1000)
            } else {
              notice(this, res.data.message, 1000)
            }
          })
        }
      } else {
        if (this.tableTitle === '') {
          notice(this, '请添加测评表名称', 2000)
        } else {
          this.$https.post('/table/add', querystring.stringify({
            tabelName: this.tableTitle
          }))
          .then(res => {
            if (res.data.code === 1) {
              if (res.data.result === '0') {
                notice(this, '该测评表名称已经存在，请重新输入', 1000)
              } else {
                success(this, '创建成功', 1000)
                sessionStorage.tableId = Number(res.data.result)
                this.tableId = sessionStorage.tableId
                this.getDetail()
                this.tableTitleShow = true
              }
            }
          })
        }
      }
    },
    // 添加客观题
    objective () {
      if (this.tableTitle) {
        if (sessionStorage.tableId) {
          this.paragraphOrObjective = 2
          this.objectiveShow = true
          this.subjectiveShow = false
          this.objectiveContent = ''
        } else {
          // notice(this, '请先创建测评表', 2000)
        }
      }
    },
    // 添加主观题
    subjective () {
      if (this.tableTitle) {
        if (sessionStorage.tableId) {
          this.objectiveShow = false
          this.subjectiveShow = true
        } else {
          // notice(this, '请先创建测评表', 2000)
        }
      }
    },
    // 添加段落说明
    instruction () {
      if (this.tableTitle) {
        if (sessionStorage.tableId) {
          this.paragraphOrObjective = 1
          this.objectiveShow = true
          this.subjectiveShow = false
          this.objectiveContent = ''
        } else {
          // notice(this, '请先创建测评表', 2000)
        }
      }
    },
    // 导出
    educe () {
      if (sessionStorage.tableId) {
        if (this.allList.length !== 0) {
          var path = document.querySelector('#contextPath').value
          window.location.href = `${path}/table/export?tableId=${sessionStorage.tableId}`
        } else {
          notice(this, '请先添加主观题或客观题', 2000)
        }
      } else {
        // notice(this, '请先创建测评表', 2000)
      }
    },
    // 导入试题
    importQuertion () {
      if (sessionStorage.tableId) {
        // var path = document.querySelector('#contextPath').value
      } else {
        // notice(this, '请先创建测评表', 2000)
      }
    },
    // 下载导入模板
    downloadTemplete () {
      if (sessionStorage.tableId) {
        var path = document.querySelector('#contextPath').value
        window.location.href = `${path}/table/downTemplet`
      } else {
        // notice(this, '请先创建测评表', 2000)
      }
    },
    // 查询测评表详情
    getDetail () {
      this.$https.get(`/table/detail?id=${sessionStorage.tableId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.canUpload = false
          this.tableTitle = res.data.result.name
          this.allList = []
          let list = []
          if (!res.data.result.list) {
            res.data.result.list = []
          }
          if (!res.data.result.questionList) {
            res.data.result.questionList = []
          }
          res.data.result.questionList.forEach((item, index) => {
            if (item.questionType === 1) {
              item.contentList = JSON.parse(item.content)
            }
          })
          res.data.result.list = res.data.result.list.map(item => ({...item, questionType: 3}))
          list = res.data.result.list.concat(res.data.result.questionList)
          list.forEach((item, index) => {
            this.allList[item.number] = item
          })
          let arr = []
          for (var i = 0; i < this.allList.length; i++) {
            if (typeof (this.allList[i]) !== 'undefined') {
              arr.push(this.allList[i])
            }
          }
          this.allList = arr
          this.allList = this.allList.map(item => ({...item, show: false, radio: ''}))
          this.totalCount = 0
          this.allList.forEach((item, index) => {
            if (item.questionType === 1) {
              let max = Number(item.contentList[0].score)
              item.contentList.forEach((child, i) => {
                if (Number(child.score) > max) {
                  max = Number(child.score)
                }
              })
              this.totalCount += Number(max)
            }
          })
          this.allList.forEach((item, index) => {
            item.order = index
            if (item.questionType !== 3) {
              for (let i = 0; i < index; i++) {
                if (this.allList[i].questionType === 3) {
                  item.order--
                }
              }
            }
          })
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/table/import`
    }
  },
  created () {
    if (sessionStorage.tableId) {
      this.canUpload = false
      this.tableId = sessionStorage.tableId
      this.getDetail()
    } else {
      this.canUpload = true
      this.tableTitleShow = false
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#assessment-table-manager{
  body {
    overflow: hidden;
  }

  header{
    padding: $width/2 $width;
    border-bottom: 1px solid #DDDDDD;
    
    .el-row{
      // line-height: 76px;

      .el-col:first-child{

        i{
          font-style: normal;
        }

        span{
          margin-right: $width/2;
          vertical-align: middle;
          display: inline-block;
          width: 124px;
          height: 40px;
          line-height: 40px;
          border: 1px solid #DCDCDC;
          box-sizing: border-box;
          padding-left: $width*2.5;
          cursor: pointer;
          font-size: 15px;

          &:nth-child(2) {
            background: url(../../../assets/images/paragraph.png) no-repeat 13px 11px;
            &:hover{
              background: url(../../../assets/images/paragraph-blue.png) no-repeat 13px 11px;
              color: #0099FF;
              border-color: #0099FF;
            }
          }

          &:nth-child(3) {
            background: url(../../../assets/images/choose-question.png) no-repeat 14px 9px;
            &:hover{
              background: url(../../../assets/images/choose-question-blue.png) no-repeat 14px 9px;
              color: #0099FF;
              border-color: #0099FF;
            }
          }

          &:nth-child(4) {
            background: url(../../../assets/images/answer-question.png) no-repeat 13px 9px;
            &:hover{
              background: url(../../../assets/images/answer-question-blue.png) no-repeat 13px 9px;
              color: #0099FF;
              border-color: #0099FF;
            }
          }
        }
      }

      .el-col:last-child{
        text-align: right;

        &>span{
          margin-right: $width;
          vertical-align: middle;
          display: inline-block;
          line-height: 40px;
          padding-left: $width*2;
          cursor: pointer;
          font-size: 15px;

          &:nth-child(1) {
            background: url(../../../assets/images/import.png) no-repeat 13px 11px;
            &:hover{
              background: url(../../../assets/images/import-blue.png) no-repeat 13px 11px;
              color: #0099FF;
            }
          }

          &:nth-child(2) {
            background: url(../../../assets/images/download.png) no-repeat 14px 11px;
            &:hover{
              background: url(../../../assets/images/download-blue.png) no-repeat 14px 11px;
              color: #0099FF;
            }
          }

          &:nth-child(3) {
            background: url(../../../assets/images/export.png) no-repeat 13px 11px;
            &:hover{
              background: url(../../../assets/images/export-blue.png) no-repeat 13px 11px;
              color: #0099FF;
            }
          }
        }
      }
    }
  }

      .big-question {
        position: relative;
        padding: $width;
        background: #ffffff;
        text-align: center;

        .el-input{
          width:760px;
          .el-input__inner{
            text-align: center;
          }
        }

        &>i{
          font-style: normal;
          font-size: 18px;
          cursor: pointer;
        }

        span{
          position: absolute;
          top: $width*1.3;
          margin-left: $width;
          color: #7F7F7F;

          i{
            font-style: normal;
            color: #343434;
          }
        }
        &:hover{
          background: #F7F7F7;
        }
      }

  .body {
    max-height: calc(100vh - 300px);
    overflow-x: hidden;
    padding-bottom: $width;

    main {
      width: 1000px;
      margin: 0 auto;
      padding-bottom: $width;

      .answer-question{
        padding: $width;
        text-align: center;

        .answer-question-look{
          // cursor: pointer;
          text-align: left;
          &>p{
            margin-top: 0;
            font-size: 16px;
          }

          &>.el-textarea{
            margin-top: $width;
            textarea{
              resize: none;
            }
          }
        }

        .el-input{
          width:890px;
        }

        p{
          margin-top: $width;
        }

        &>span{
          margin-left: $width;
          color: #7F7F7F;
        }

        &:hover{
          background: #F7F7F7;
        }
      }

      .choose-question{
        padding: $width;
        text-align: center;

        p,div{
          margin-bottom: $width;
          height: 40px;
        }

        p{
          display: inline-block;
          position: relative;
          &>span{
            position: absolute;
            z-index: 1001;
            top: 8px;
            left: -40px;
            font-size: 15px;
            margin-right: $width;
          }
          .el-input{
            width:890px;
          }
        }

        div{
          display: inline-block;
          position: relative;

          &>span{
            position: absolute;
            z-index: 1001;
            top: 8px;
            left: -40px;
            font-size: 15px;
            margin-right: $width;
          }

          i{
            margin: 0 $width/2;
            font-style: normal;
          }

          .el-input{
            width:630px;
          }

          .score{
            width:$width*4;
          }

          sub{
            margin-left: $width;
            img{
              cursor: pointer;
              margin-right: $width/4;
            }
          }
        }

        p:last-child{
          display: block;
        }
        &:hover{
          background: #F7F7F7;
        }
      }

      .choose-qusetion-look{
        // cursor: pointer;
        text-align: left;
        padding: $width;

        &>span{
          font-size: 16px;
        }

        &>p{
          margin-top: $width/1.5;
          padding-left: $width;
        }
        
        &:hover{
          background: #F7F7F7;
        }
      }
    }
  }
}
</style>
