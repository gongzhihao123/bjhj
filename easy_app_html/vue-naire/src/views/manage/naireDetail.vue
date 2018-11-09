<template>
  <div id="created-details">
    <!--创建问卷详情-->
    <div class="create-details">
      <div class="nav">
        <el-button class="button" @click="prints">打印</el-button>
        <el-button class="button" @click="previewOpen(1)">预览</el-button>
        <el-button type="success" class="success" @click="publishNaire">发布</el-button>
        <el-button @click="returns">返回</el-button>
      </div>
      <div class="details-content">
        <div class="on-left">
          <div class="tit">
            <span class="is-active"><img src="../../assets/images/questionType.png"> 选择题型</span>
            <span @click="getTree"><img src="../../assets/images/questionBank.png"> 选择题库</span>
          </div>
          <div class="type">
            <p @click="addRadioT"><img src="../../assets/images/radio.png"><span>单选题</span><span class="add">+</span></p>
            <p @click="addCheckbox"><img src="../../assets/images/checkbox.png"><span>多选题</span><span class="add">+</span></p>
            <p @click="addAsk"><img src="../../assets/images/ask.png"><span>问答题</span><span class="add">+</span></p>
            <p @click="addText"><img src="../../assets/images/text.png"><span>文本框</span><span class="add">+</span></p>
          </div>
        </div>

        <!--新增问卷内容-->
        <div class="on-right">
          <!-- <p class="title"><input type="text" v-model="title" placeholder="请填写问卷标题" /></p> -->
           <p class="title">
            <input type="text" v-model="title" placeholder="请填写问卷标题" @blur="modTitle = false" :maxlength="100" />
          </p>
          <!-- <p class="title-p" v-else @dblclick="modTitle = true">{{title}}</p> -->
          <!--<p class="explain"><input type="text" placeholder="请填写问卷说明"/></p>-->
          <div v-for="(item, i) in questionList" :key="i" class="question-list">

            <!--单选-->
            <section v-if="item.questionType == 1" class="radios">
              <article v-show="!item.modState" class="radio-no-mod" @click="dblClick(item, i)">
                <p class="radio-title">{{item.number}}.{{item.name}}</p>
                <ul class="option-list">
                  <li v-for="(items, index) in item.options" :key="index">
                    <el-radio class="radio" v-model="item.checked" :label="index" disabled>{{items.radioboxName}}</el-radio>
                  </li>
                </ul>
              </article>
              <article v-show="item.modState" class="radio-mod">
                <div class="radio-title">{{ item.number }}.题目<el-input v-model="item.name" :maxlength="240" placeholder="最大长度输入240个字符"></el-input></div>
                <aside v-for="(items, index) in item.options" :key="index">
                  &nbsp; &nbsp;选项<el-input v-model="items.radioboxName" :maxlength="120"  placeholder="最大长度输入120个字符"></el-input>
                  <p class="icon">
                    <span @click="addOptions(items, i)"></span>
                    <span @click="deleteOptions(i, index)"></span>
                    <span @click="advance(item.options, index, 1, 'radioboxSort')"></span>
                    <span @click="advance(item.options, index, 2, 'radioboxSort')"></span>
                  </p>
                </aside>
                <div class="button-group">
                  <el-button type="success" @click="saveCreated(item)">完成</el-button>
                  <el-button @click="copyQues(item, i)">复制</el-button>
                  <el-button @click="advance(questionList, i, 1, 'number')">上移</el-button>
                  <el-button @click="advance(questionList, i, 2, 'number')">下移</el-button>
                  <el-button type="danger" @click="deleteQues(i, item)">删除</el-button>
                </div>
              </article>
            </section>

            <!--多选-->
            <section v-if="item.questionType == 2" class="checkbox">
              <article v-show="!item.modState" class="radio-no-mod" @click="dblClick(item, i)">
                <p class="radio-title">{{item.number}}.{{item.name}}</p>
                <ul>
                  <li v-for="(items, index) in item.options" :key="index">
                    <el-checkbox class="radio" v-model="items.checked" disabled>{{items.checkboxName}}</el-checkbox>
                  </li>
                </ul>
              </article>
              <article v-show="item.modState" class="radio-no-mod">
                <div class="radio-title">{{ item.number }}.题目<el-input v-model="item.name" :maxlength="240" placeholder="最大长度输入240个字符"></el-input></div>
                <aside v-for="(items, index) in item.options" :key="items">
                  &nbsp; &nbsp;选项<el-input v-model="items.checkboxName" :maxlength="120"  placeholder="最大长度输入120个字符"></el-input>
                  <p class="icon">
                    <span @click="addOptions(items, i)"></span>
                    <span @click="deleteOptions(i, index)"></span>
                    <span @click="advance(item.options, index, 1, 'checkboxSort')"></span>
                    <span @click="advance(item.options, index, 2, 'checkboxSort')"></span>
                  </p>
                </aside>
                <div class="button-group">
                  <el-button type="success" @click="saveCreated(item)">完成</el-button>
                  <el-button @click="copyQues(item, i)">复制</el-button>
                  <el-button @click="advance(questionList, i, 1, 'number')">上移</el-button>
                  <el-button @click="advance(questionList, i, 2, 'number')">下移</el-button>
                  <el-button type="danger" @click="deleteQues(i, item)">删除</el-button>
                </div>
              </article>
            </section>

            <!--问答题-->
            <section v-if="item.questionType == 3" class="answer">
              <article v-show="!item.modState" @click="dblClick(item, i)">
                <p class="radio-title">{{item.number}}.{{item.name}}</p>
              </article>
              <article v-show="item.modState">
                <div class="radio-title">{{ item.number }}.题目<el-input v-model="item.name" :maxlength="240" placeholder="最大长度输入240个字符"></el-input></div>
                <div class="button-group">
                  <el-button type="success" @click="saveCreated(item)">完成</el-button>
                  <el-button @click="copyQues(item, i)">复制</el-button>
                  <el-button @click="advance(questionList, i, 1, 'number')">上移</el-button>
                  <el-button @click="advance(questionList, i, 2, 'number')">下移</el-button>
                  <el-button type="danger" @click="deleteQues(i, item)">删除</el-button>
                </div>
              </article>
            </section>

            <!--文本框-->
            <section v-if="item.questionType == 4" class="answer">
              <article v-show="!item.modState" @click="dblClick(item, i)">
                <p class="radio-title">{{item.name}}</p>
              </article>
              <article v-show="item.modState">
                <div class="radio-title"><el-input type="textarea" :rows="4" v-model="item.name" :maxlength="500" placeholder="最大长度输入500个字符"></el-input></div>
                <div class="button-group">
                  <el-button type="success" @click="saveCreated(item)">完成</el-button>
                  <el-button @click="copyQues(item, i)">复制</el-button>
                  <el-button @click="advance(questionList, i, 1, 'number')">上移</el-button>
                  <el-button @click="advance(questionList, i, 2, 'number')">下移</el-button>
                  <el-button type="danger" @click="deleteQues(i, item)">删除</el-button>
                </div>
              </article>
            </section>



          </div>

          <el-button type="success" class="save-created" v-show="questionList.length != 0" @click="saveAll">完成</el-button>


        </div>
      </div>
    </div>

    <!--选择问卷模板-->
    <el-dialog
      title="选择问卷模板"
      class="choose-template"
      top="5%"
      :visible.sync="chooseModel">
      <div class="dialog-head">
        <el-input v-model="keywordTemplate" placeholder="请输入关键字"></el-input>
        <el-button type="success" @click="getTemplateList">搜索</el-button>
      </div>
      <div class="dialog-content">
        <!--左-->
        <section class="left section">
          <el-tree 
          :data="naireTypeList"
          :props="defaultProps"
          :highlight-current="true"
          @node-click="handleNodeClick">
          </el-tree>
        </section>

        <!--中-->
        <section class="center section">
          <ul>
            <li v-for="(item, index) in templateList" :key="index" @click="switchTem(item)">{{ item.title }}</li>
          </ul>
        </section>

        <!--右-->
        <section class="right section">
          <answer :details="templatePre"></answer>
        </section>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="copyTemplate">使用该模板</el-button>
        <el-button @click="chooseModel = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--预览-->
    <el-dialog
      class="choose-template"
      top="10%"
      :show-close="false"
      :visible.sync="preview">
      <answer class="preview" :details="previewData"></answer>
    </el-dialog>

    <aside class="dialog-aside" v-show="preview">
      <section class="section">
        <el-button type="success" @click="publishNaire">发布</el-button>
        <el-button @click="preview = false">关闭</el-button>
      </section>
    </aside>


    <!--遮罩-->
    <aside class="shade" v-show="shade">
      <img src="../../assets/images/logo.png" ondragstart="return false;" @click="route({path: '/index'})">
      <span class="title" @click="route({path: '/index'})">问卷调查</span>
    </aside>

    <!--内容遮罩-->
    <aside class="content-shade">
      
    </aside>

    
    <!--弹框提醒-->
    <!--<el-dialog
      title="提示"
      class="dialog-remind"
      top="15%"
      size="tiny"
      :visible.sync="remind">
      <p>有问题尚未保存，您确定要保存吗？</p>
      <div class="button-group">
        <el-button @click="cancleSave">取消</el-button>
        <el-button type="success" @click="sureSave">保存</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import { notice, success, error } from '../../api/index.js'
import { mapGetters } from 'vuex'
import querystring from 'querystring'
import answer from '../../components/details'
import { dateFormat } from '../../filters/index.js'
export default {
  name: 'created-details',
  data () {
    return {
      naireId: '',
      states: 1,
      i: 1,
      title: '',
      remind: false,
      chooseModel: false,
      keywordTemplate: '',
      questionList: [],
      preview: false,
      state: '',
      naireTypeList: [
        {label: '公开问卷', state: 1, children: []},
        {label: '内部问卷', state: 2, children: []},
        {label: '外部问卷', state: 3, children: []}
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      categoryId: '',
      templateList: [],
      templatePre: {},
      addState: true,
      modActive: 0,
      addIndex: 1,
      drowImage: '',
      previewData: {},
      endTime: '',
      shade: false,
      dblItem: {},
      dblIndex: 0,
      copyState: false,
      operation: -1 // 1单选 2多选 3问答 4文本框 5双击其他问题 6选择题库 7完成 8发布 9预览 10打印
      // modTitle: false
    }
  },
  components: {
    answer
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    this.states = this.$route.query.state
    this.naireId = this.$route.query.naireId
    this.endTime = this.$route.query.endTime
    if (this.$route.query.mod) {
      this.shade = true
    }
    this.refresh()
  },
  methods: {
    route (s) {
      if (this.shade) {
        this.$router.push('/manage')
      } else {
        this.$router.push(s.path)
      }
    },
    returns () {
      if (!this.opinionLeave('returns')) return
      this.route({path: '/created/default'})
    },
    addRadioT () {
      this.operation = 1
      if (!this.opinionLeave('addRadioT')) return
      this.questionList.push({
        naireId: this.naireId,
        name: '',
        questionType: 1,
        sorts: this.questionList.length + 1,
        sort: this.questionList.length + 1,
        number: this.questionList.length + 1,
        audio: '1',
        checked: '',
        page: 1,
        modState: true,
        options: [
          {radioboxName: '', radioboxSort: 1}
        ]
      })
      this.addIndex++
      // this.rowIndex()
      this.numberFilter()
      this.modActive = this.questionList.length - 1
    },
    addCheckbox () {
      this.operation = 2
      if (!this.opinionLeave('addCheckbox')) return
      this.questionList.push({
        naireId: this.naireId,
        name: '',
        questionType: 2,
        sorts: this.questionList.length + 1,
        sort: this.questionList.length + 1,
        number: this.questionList.length + 1,
        page: 1,
        modState: true,
        options: [
          {checkboxName: '', checked: false, checkboxSort: 1}
        ]
      })
      this.addIndex++
      // this.rowIndex()
      this.numberFilter()
      this.modActive = this.questionList.length - 1
    },

    addAsk () {
      this.operation = 3
      if (!this.opinionLeave('addAsk')) return
      this.questionList.push({
        naireId: this.naireId,
        name: '',
        questionType: 3,
        sorts: this.questionList.length + 1,
        sort: this.questionList.length + 1,
        number: this.questionList.length + 1,
        page: 1,
        modState: true
      })
      this.addIndex++
      // this.rowIndex()
      this.numberFilter()
      this.modActive = this.questionList.length - 1
    },
    addText () {
      this.operation = 4
      if (!this.opinionLeave('addText')) return
      this.questionList.push({
        naireId: this.naireId,
        name: '',
        questionType: 4,
        sort: this.questionList.length + 1,
        // sorts: this.questionList.length + 1,
        number: this.questionList.length + 1,
        page: 1,
        modState: true
      })
      // this.rowIndex()
      this.numberFilter()
      this.modActive = this.questionList.length - 1
    },
    addOptions (item, i) {
      // 单选
      if (item.radioboxSort) {
        this.questionList[i].options.push({radioboxName: '', radioboxSort: this.questionList[i].options.length + 1})
      } else {
        // 多选
        this.questionList[i].options.push({checkboxName: '', checked: false, checkboxSort: this.questionList[i].options.length + 1})
      }
    },
    // 对问题的下标过滤
    rowIndex (i) {
      i = 1
      this.questionList.forEach(item => {
        if (item.questionType !== 4) {
          item.sorts = i++
        }
      })
    },
    numberFilter (i) {
      i = 1
      this.questionList.forEach(item => {
        if (item.questionType !== 4) {
          item.number = i++
        }
      })
    },
    deleteOptions (i, index) {
      if (this.questionList[i].options.length === 1) return
      this.questionList[i].options.splice(index, 1)
      this.questionList[i].options.forEach(item => {
        let i = 1
        if (item.radioboxSort) {
          item.radioboxSort = i++
        } else {
          item.checkboxSort = i++
        }
      })
    },
    deleteQues (i, item) {
      if (!item.id) {
        this.questionList.splice(i, 1)
      } else {
        this.$https.post('/publish/naireDelete', querystring.stringify({
          naireId: this.naireId,
          questionId: item.id,
          type: item.questionType
        }))
        .then(res => {
          if (res.data.code === 1) {
            this.refresh()
          }
        })
      }
    },
    // 上移下移事件
    advance (arr, i, state, option) {
      // state: 1上移， 2下移
      let prev = 0
      let next = 0
      if (state === 1) {
        if (i === 0) return
        if (arr[i - 1].questionType === 4 || arr[i].questionType === 4) {
          prev = arr[i][option]
          next = arr[i - 1][option]
        } else {
          prev = arr[i - 1][option]
          next = arr[i][option]
        }
        let item = arr[i - 1] // 0
        arr.splice(i - 1, 2, arr[i], item) // 1 => 0 | 0 => 1
        arr[i - 1][option] = prev
        arr[i][option] = next
        if (option !== 'number') return
        this.modActive--
      } else {
        if (arr.length - 1 === i) return
        if (arr[i + 1].questionType === 4 || arr[i].questionType === 4) {
          prev = arr[i + 1][option]
          next = arr[i][option]
        } else {
          prev = arr[i][option]
          next = arr[i + 1][option]
        }
        let item = arr[i + 1]
        arr.splice(i, 2, item, arr[i])
        arr[i][option] = prev
        arr[i + 1][option] = next
        if (option !== 'number') return
        this.modActive++
      }
    },
    // 复制
    async copyQues (item, i) {
      if (!item.name || item.name.trim() === '') {
        notice(this, '题目不为空', 2000)
        return
      }
      if (item.questionType === 1) {
        if (item.options.some(items => (!items.radioboxName || items.radioboxName.trim() === ''))) {
          notice(this, '选项不为空', 2000)
          return
        }
      } else if (item.questionType === 2) {
        if (item.options.some(items => (!items.checkboxName || items.checkboxName.trim() === ''))) {
          notice(this, '选项不为空', 2000)
          return
        }
      }
      let obj = {}
      for (let i in item) {
        if (i === 'options') {
          obj[i] = this.copy(item[i])
        } else if (i === 'id') {
          obj.id = ''
        } else {
          obj[i] = item[i]
        }
      }
      // obj.sorts = item.sorts + 1
      // item.modState = false
      // console.log(item)
      await this.saveCreated(item, 1)
      item.modState = false
      this.modActive = i + 1
      this.questionList.splice(i + 1, 0, obj)
      this.rowIndex()
      this.numberFilter()
      // this.questionList.forEach((items, index) => {
      //   if (index > (i + 1)) {
      //     items.sorts++
      //   }
      // })
    },
    copy (arr) {
      let arrs = []
      if (arr === null) return arrs
      for (let i = 0; i < arr.length; i++) {
        let obj = {}
        for (let j in arr[i]) {
          if (j === 'options') {
            obj[j] = this.copy(arr[i][j])
          } else {
            obj[j] = arr[i][j]
          }
        }
        arrs.push(obj)
      }
      return arrs
    },
    dialog (event) {
      this.$confirm('有问题尚未保存，您确定要保存吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveCreated(this.questionList[this.modActive])
        .then(_ => this[event]())
      }).catch(() => {
        // this.questionList.splice(this.modActive, 1)
        // this.remind = false
        // this.modActive--
        // this.addIndex--
        // this.questionList.forEach((items, index) => {
        //   if (index > this.modActive) {
        //     items.sorts--
        //   }
        // })
      })
    },
    // 跳出 判断
    opinionLeave (event) {
      this.addState = true
      this.questionList.forEach((item, i) => {
        if (item.modState) {
          this.addState = false
          this.modActive = i
        }
      })
      if (!this.addState) {
        this.dialog(event)
        // this.remind = true
        return false
      } else {
        return true
      }
    },
    saveCreated (item, s) {
      return new Promise(async (resolve, reject) => {
        if (!this.title || this.title.trim() === '') {
          notice(this, '问卷标题不为空', 2000)
          this.copyState = true
          return
        }
        if (!item.name || item.name.trim() === '') {
          notice(this, '题目不为空', 2000)
          this.copyState = true
          return
        }
        if (item.questionType === 1) {
          if (item.options.some(items => (!items.radioboxName || items.radioboxName.trim() === ''))) {
            notice(this, '选项不为空', 2000)
            this.copyState = true
            return
          }
        } else if (item.questionType === 2) {
          if (item.options.some(items => (!items.checkboxName || items.checkboxName.trim() === ''))) {
            notice(this, '选项不为空', 2000)
            this.copyState = true
            return
          }
        }
        item.modState = false
        this.copyState = false
        this.questionList = this.questionList.map(item => ({...item, sort: item.sorts}))
        let jsonstr = ''
        // if (this.questionList.every(item => item.id)) {
        jsonstr = JSON.stringify(this.questionList.map((item, i) => ({ questionId: item.id ? item.id : '', sort: i + 1 })))
          // console.log(jsonstr)
        // }
        // this.questionList[this.modActive].sort = this.questionList[this.modActive].sorts
        if (item.name) {
          item.naireId = this.naireId
          if (JSON.parse(jsonstr).filter(item => !item.questionId).length > 0) {
            item.sort = JSON.parse(jsonstr).filter(item => !item.questionId)[0].sort
          } else {
            item.sort = s + 1
          }
        } else {
          this.questionList[this.modActive].naireId = this.naireId
        }
        let questionJson = JSON.stringify([this.questionList[this.modActive]])
        this.questionList = this.questionList.map((item, ind) => ({...item, sort: ind + 1}))
        if (this.questionList.some(item => !item.id)) {
          // this.questionList[this.modActive].sort = this.questionList.filter(item => !item.id)[0].sort
          if (JSON.parse(jsonstr).filter(item => !item.questionId).length > 0) {
            this.questionList[this.modActive].sort = JSON.parse(jsonstr).filter(item => !item.questionId)[0].sort
          } else {
            this.questionList[this.modActive].sort = s + 1
          }
          // this.questionList[this.modActive].sort = JSON.parse(jsonstr).filter(item => !item.questionId)[0].sort
          // console.log(this.questionList[this.modActive].sort)
          questionJson = JSON.stringify([this.questionList[this.modActive]])
          // console.log(questionJson)
        } else {
          questionJson = JSON.stringify([this.questionList[this.modActive]])
        }
        if (this.questionList.some(item => !item.id)) {
          this.questionList[this.modActive].sort = this.questionList.filter(item => !item.id)[0].sort
          questionJson = JSON.stringify([this.questionList[this.modActive]])
        } else {
          questionJson = JSON.stringify([this.questionList[this.modActive]])
        }
        await this.$https.post('/publish/naireQuestionSave', querystring.stringify({
          naireId: this.naireId,
          title: this.title,
          questionJson: item.name ? JSON.stringify([item]) : questionJson,
          jsonstr
        }))
        .then(async res => {
          if (res.data.code === 1) {
            if (!s) {
              await this.refresh() // 调用，为了删除时有问题id,
              resolve()
            } else {
              await this.refresh() // 调用，为了删除时有问题id,
              resolve()
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
        .catch(res => console.log(res))
      })
    },
    dblClick (item, i) {
      this.operation = 5
      this.dblItem = item
      this.dblIndex = i
      if (!this.opinionLeave('dblClick')) return
      this.modActive = i
      this.$set(item, 'modState', true)
    },
    cancleSave () {
      this.questionList.splice(this.modActive, 1)
      this.remind = false
      this.modActive--
      this.addIndex--
      this.questionList.forEach((items, index) => {
        if (index > this.modActive) {
          items.sorts--
        }
      })
    },
    // sureSave () {
    //   if (this.questionList[this.modActive].name.trim() === '') {
    //     notice(this, '题目不为空', 2000)
    //     // this.remind = false
    //     return
    //   } else {
    //     // this.remind = false
    //     this.saveCreated(this.questionList[this.modActive])
    //   }
    // },
    saveAll () {
      this.operation = 7
      if (!this.opinionLeave('saveAll')) return
      if (!this.title || this.title.trim() === '') {
        notice(this, '问卷标题不为空', 2000)
        return
      }
      this.questionList.forEach(item => {
        item.sort = item.sorts
      })
      let questionJson = JSON.stringify(this.questionList)
      this.$https.post('/publish/naireQuestionSaveAll', querystring.stringify({
        naireId: this.naireId,
        title: this.title,
        questionJson
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => console.log(res))
    },

    getTree () {
      this.operation = 6
      if (!this.opinionLeave('getTree')) return
      this.chooseModel = true
      this.naireTypeList.forEach(item => {
        this.$https.get(`/common/naireCategoryList?openType=${item.state}`)
        .then(res => {
          if (res.data.code === 1) {
            item.children = res.data.result.map(items => ({id: items.id, label: items.name, state: item.state}))
            if (item.state === 1) {
              this.state = item.state
              this.categoryId = item.children[0].id
              this.getTemplateList()
            }
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      })
    },
    handleNodeClick (data) {
      if (!data.children) {
        this.state = data.state
        this.categoryId = data.id
        this.getTemplateList()
      }
    },
    getTemplateList () {
      this.$https.get(`/publish/nairePage?type=${this.state}&title=${this.keywordTemplate}&categoryId=${this.categoryId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.templateList = res.data.result ? res.data.result : []
          this.switchTem(res.data.result[0])
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    switchTem (item) {
      // console.log(item)
      this.$https.get(`/index/naireDetail?naireId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.templatePre = res.data.result
          // this.templatePre.print = 1
          this.templatePre.qNum = this.templatePre.questions.length
          this.templatePre.questions = this.templatePre.questions.map(item => ({...item, checked: ''}))
          this.templatePre.questions.forEach(item => {
            if (item.questionType === 1) {
              item.options.sort(this.compare('radioboxSort'))
              item.checked = ''
            } else if (item.questionType === 2) {
              item.options.sort(this.compare('checkboxSort'))
              item.options = item.options.map(items => ({...items, checked: false}))
            } else if (item.questionType === 3) {
              item.answer = ''
            }
          })
          // 对问题的下标过滤
          let i = 1
          this.templatePre.questions.forEach(item => {
            if (item.questionType !== 4) {
              item.sorts = i++
            }
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => console.log(res))
    },
    copyTemplate () {
      this.chooseModel = false
      this.templatePre.print = null
      if (!this.title) {
        this.title = this.templatePre.title
      }
      // let length = (this.questionList || []).length
      // this.questionList = this.templatePre.questions.map((item, i) => ({...item, modState: false, sorts: item.sort + length, audio: '1', naireId: this.naireId, id: '', sort: i + length}))
      this.addIndex = (this.questionList || []).length
      this.templatePre.questions.forEach(async (item, i) => {
        this.modActive = this.questionList.length + i
        item.id = ''
        await this.saveCreated(item, this.modActive)
        await this.refresh()
      })
      this.numberFilter()
      this.rowIndex()
    },
    // 公开问卷发布
    publishNaire () {
      this.operation = 8
      if (!this.opinionLeave('publishNaire')) return
      if (!this.title || this.title.trim() === '') {
        notice(this, '问卷标题不为空', 2000)
        return
      }
      let arr = this.questionList.filter(item => item.modState !== true)
      if (arr.length === 0) {
        notice(this, '问卷已保存题目不少于1', 2000)
        return
      }
      if (Number(this.states) === 2 || Number(this.states) === 3) {
        this.$https.post('/publish/nairePublish', querystring.stringify({
          naireId: this.naireId,
          title: this.title
        }))
        .then(res => {
          if (res.data.code === 1) {
            this.$router.push({path: '/created/publish', query: {naireId: this.naireId, state: this.states}})
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else {
        this.$router.push({path: '/created/publish', query: {naireId: this.naireId, state: this.states}})
      }
      // this.$router.push({path: '/created/publish', query: {naireId: this.naireId, state: this.states}})
      // this.drowImage = `/naire/publish/naireRelease?naireId=${this.naireId}&type=${1}`
    },
    previewOpen (s) {
      this.operation = 9
      if (!this.opinionLeave('previewOpen')) return
      this.preview = true
      this.previewData = {
        title: this.title,
        createdUserName: this.user.name,
        endTime: dateFormat(Number(this.endTime), 'yyyy-MM-dd hh:mm'),
        createdTime: dateFormat(Number(this.endTime), 'yyyy-MM-dd hh:mm'),
        questions: this.questionList,
        qNum: this.questionList.length
      }
      // 查看
      // if (s === 1) {
      //   this.previewData.print = 1
      // }
    },
    prints () {
      this.operation = 10
      if (!this.opinionLeave('prints')) return
      this.previewOpen()
      setTimeout(() => {
        const newWindow = window.open('打印窗口', '_blank')
        const doStr = document.querySelector('#commonDetails').innerHTML
        newWindow.document.write(doStr)
        const noprint = newWindow.document.querySelectorAll('.print')
        Array.from(noprint).forEach(item => {
          item.style.display = 'none'
        })
        const cell = newWindow.document.querySelectorAll('.cell')
        Array.from(cell).forEach(item => {
          item.style.lineHeight = '40px'
        })
        const ar = newWindow.document.querySelectorAll('tr')
        Array.from(ar).forEach(item => {
          item.style.border = '1px solid #dfe6ec'
        })
        newWindow.document.close()
        newWindow.print()
        newWindow.close()
        // document.querySelector('#commonDetails').innerHTML = null
        this.preview = false
      })
    },
    // 刷新列表
    async refresh () {
      await this.$https.get(`/index/naireDetail?naireId=${this.naireId}`)
      .then(res => {
        // console.log(new Date())
        if (res.data.code === 1) {
          let templatePre = res.data.result
          templatePre.print = 1
          templatePre.qNum = templatePre.questions.length
          templatePre.questions = templatePre.questions.map(item => ({...item, checked: ''}))
          templatePre.questions.forEach(item => {
            if (item.questionType === 1) {
              item.checked = ''
              item.options.sort(this.compare('radioboxSort'))
            } else if (item.questionType === 2) {
              item.options.sort(this.compare('checkboxSort'))
              item.options = item.options.map(items => ({...items, checked: false}))
            } else if (item.questionType === 3) {
              item.answer = ''
            }
          })
          this.questionList = templatePre.questions.map(item => ({...item, sorts: item.sort}))
          this.title = templatePre.title
          let aside = this.questionList.filter(item => item.questionType !== 4)
          this.addIndex = aside.length + 1
          this.rowIndex()
          this.numberFilter()
          // this.operationSave()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 比较器
    compare (propertyName) {
      return (obj1, obj2) => {
        let val1 = obj1[propertyName]
        let val2 = obj2[propertyName]
        if (val2 < val1) {
          return 1
        } else if (val2 > val1) {
          return -1
        } else {
          return 0
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';
#created-details {
      // 三级样式
  .create-details {
    margin-bottom: 40px;
    min-height: 300px;
    .nav {
      position: fixed;
      width: 1200px;
      height: 50px;
      background: #fff;
      top: 70px;
      line-height: 50px;
      border: 1px solid #e8e8e8;
      text-align: right;
      padding-right: 6px;
      box-sizing: border-box;
      z-index: 10;
      .button {
        border: none;
        padding-left: 26px;
        background: url(../../assets/images/print.png) no-repeat 0 center;
        &:nth-child(2) {
          background: url(../../assets/images/preview.png) no-repeat 0 center;
        }
      }
      .success {
        padding-left: 28px;
        padding-right: 10px;
        background: url(../../assets/images/issue.png) 8px center #19b955 no-repeat;
      }
    }
    .details-content {

      .on-left{
        position: fixed;
        width: 254px;
        // margin-top: 70px;
        height: 500px;
        background: #fff;
        float: left;
        border: 1px solid #e8e8e8;
        &>.tit {
          height: 46px;
          border-bottom: 1px solid #e8e8e8;
          span:first-child {
            border-right: 1px solid #e8e8e8;
          }
          span {
            cursor: pointer;
            text-align: center;
            width: 123px;
            display: inline-block;
            height: 46px;
            line-height: 46px;
          }
          span.is-active{
            background: #19b955;
            border-color: #19b955;
            color: #fff;
          }
        }
        &>.type {
          width: 252px;
          p {
           height: 44px;
           margin-top: 10px;
           line-height: 44px;
           color: #333;
           cursor: pointer;
           img {
             margin-left: 66px;
             margin-right: 16px;
           }
           .add {
             margin-left: 52px;
             font-size: 18px;
             cursor: pointer;
             display: none;
           }
          }
          p:hover {
            background: #ececec;
            .add {
              display: inline;
            }
          }
        }
      }
      .on-right{
        // position: fixed;
        width: 942px;
        overflow-y: auto;
        margin-left: 256px;
        margin-top: 70px;
        display: fixed;
        // height: 600px;
        border: 1px solid #e8e8e8;
        background: #fff;
        input{
          min-height: 48px;
          border: none;
          border: 1px solid #e8e8e8;
        }
        .title-p {
          min-height: 30px;
          line-height: 30px;
          width: 800px;
          margin: 0 auto;
          font-weight: bold;
          font-size: 16px;
          margin-top: 30px;
        }
        .title {
          margin-top: 24px;
          text-align: center;
          width: 100%;
          min-height: 50px;
          margin-bottom: 20px;
          line-height: 50px;
          input{
            min-height: 50px;
            line-height: 50px;
            text-align: center;
            width: 318px;
          }
        }
        .explain {
          margin-bottom: 20px;
          text-align: center;
          input{
            min-height: 50px;
            width: 682px;
            padding-left: 10px;
            border: none;
          }
          input:hover{
            min-height: 48px;
            border: 1px solid #e8e8e8;
          }
        }
        .question-list {
          padding: 0 60px 20px;
          .radios {
            // border-bottom: 1px solid $border;
          }
          article {
            padding-top: 10px;
          }
          .radio-title {
            min-height: 48px;
            line-height: 48px;
          }
          .el-input {
            display: inline-block;
            width: 650px;
            margin-left: 20px;
          }
          li {
            margin-top: 8px;
            padding-left: 16px;
          }
          aside {
            margin-top: 8px;
            min-height: 48px;
            overflow: hidden;
            .icon {
              float: right;
              // margin-right: 20px;
              width: 100px;
            }
            span {
              float: left;
              display: inline-block;
              width: 25px;
              min-height: 48px;
              cursor: pointer;
              background: url(../../assets/images/+.png) no-repeat center;
              &:nth-child(2) {
                background-image: url(../../assets/images/_.png);
              }
              &:nth-child(3) {
                background-image: url(../../assets/images/↑.png);
              }
              &:nth-child(4) {
                background-image: url(../../assets/images/↓.png);
              }
            }
          }
          .button-group {
            text-align: right;
            margin-top: 20px;
            padding-right: 110px;
            margin-bottom: 20px;
          }
          .checkbox {
            // border-bottom: 1px solid $border;
          }
          article:first-child:hover {
            background: #f9f9f9;
            cursor: pointer;
          }
        }
        .save-created {
          display: block;
          margin: 20px auto;
        }
      }
    }
  }

  .choose-template {
    .el-dialog {
      width: 1200px;
    }
    .dialog-head {
      .el-input {
        width: 350px;
      }
    }
    .dialog-content {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      .section {
        height: 516px;
        border: 1px solid #8391a5;
        border-radius: 6px;
        background: #f3fbfe;
      }
      .left {
        width: 160px;
        overflow: auto;
        .el-tree {
          background: #f3fbfe;
          border: 0;
          text-align: left;
        }
      }
      .center {
        width: 250px;
        overflow: auto;
        ul {
          padding: 6px;
          li {
            text-align: left;
            line-height: 40px;
            // height: 40px;
            overflow: hidden;
            &:hover {
              background: #DAF2FE;
            }
          }
        }
      }
      .right {
        width: 720px;
        overflow: auto;
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
    .preview {
      width: 900px;
      margin: 0 auto;
    }
  }
  .dialog-aside {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 50px;
    background: #fff;
    z-index: 20000;
    box-shadow: 0 3px 3px #ccc;
  }
  .section {
    padding: 8px;
    width: 1200px;
    margin: 0 auto;
    text-align: right;
  }
  .shade {
    width: 700px;
    height: 50px;
    line-height: 50px;
    background: #fff;
    position: fixed;
    top: 0;
    z-index: 10;
    &>img {
      float: left;
      margin-right: 10px;
      margin-top: 6px;
    }
    .title {
      font-family: 微软雅黑;
      color: #333;
      font-size: 22px;
      letter-spacing: 2px;
      // font-weight: bold;
    }
    * {
      cursor: pointer;
    }
  }
  .content-shade {
    width: 1200px;
    height: 126px;
    background-color: rgb(245, 245, 245);
    position: fixed;
    top: 0;
  }
  .el-checkbox__input.is-disabled+.el-checkbox__label {
    color: #333;
    cursor: pointer;
  }
  .el-radio__input.is-disabled+.el-radio__label {
    color: #333;
    cursor: pointer;
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #fff;
    border-color: #333;
    cursor: pointer;
  }
  .el-radio__input.is-disabled .el-radio__inner {
    background-color: #fff;
    border-color: #333;
    cursor: pointer;
  }
}
</style>
