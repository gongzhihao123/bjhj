<template>
  <div id="set">
      <nav class="nav">
        <ul v-if="user.companyType === 1">
          <li v-for="(item, index) in nav" :key="item.name" @click="genreClick(item, index)" :class="{'active': genreInd == index}">{{ item.name }}</li>

          <el-button type="success" v-if="genreInd == 0" @click="addType">新增问卷类型</el-button>
          <el-button type="success" v-if="genreInd == 1" @click="addRecPeople">新增对外接收人</el-button>
        </ul>
        <ul v-if="user.companyType === 2">
          <li v-for="(item, index) in navSchool" :key="item.name" @click="genreClick(item, index)" :class="{'active': genreInd == index}">{{ item.name }}</li>

          <el-button type="success" v-if="genreInd == 0" @click="addType">新增问卷类型</el-button>
          <el-button type="success" v-if="genreInd == 1" @click="addRecPeople">新增对外接收人</el-button>
        </ul>
      </nav>

      <!--问卷类型-->
      <table class="table" v-show="questionnaire.length != 0" v-if="genreInd == 0">
        <thead>
          <tr>
            <td v-for="(item, i) in tableHead" :key="i">{{ item.name }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in questionnaire" :key="item.name">
            <td v-if="!item.name || item.name.length < 15">
              {{item.name}}
            </td>
            <td v-else>
              <el-tooltip class="item" effect="light" :content="item.name" placement="bottom">
                <span>{{ item.name | textLength }}</span>
              </el-tooltip>
            </td>
            <td>
              <span v-if="item.openType == 1">公开</span>
              <span v-for="(items, i) in item.user" :key="i" v-else>
                <span v-if="items == 1">
                  <span v-if="user.companyType == 1">教师</span>
                  <span v-else>员工</span>
                </span> 
                <span v-if="items == 2">学生</span> 
                <span v-if="items == 3">家长</span> 
                <span v-if="items == 4">外部单位</span>
              </span>
            </td>

            <td>
              <span v-if="(item.publisher && item.publisher.length < 15) || !item.publisher">{{ item.publisher | textLength }}</span>
              <el-tooltip class="item" effect="light" :content="item.publisher" placement="bottom" v-else>
                <span style="cursor: pointer;">{{ item.publisher | textLength }}</span>
              </el-tooltip>
            </td>

            <td>
              <span v-if="!item.chceker || item.chceker.length < 1">―――</span>
              <span v-else-if="(item.chceker && item.chceker.length < 15) || !item.chceker">{{ item.chceker | textLength }}</span>
              <el-tooltip class="item" effect="light" :content="item.chceker" placement="bottom" v-else>
                <span style="cursor: pointer;">{{ item.chceker | textLength }}</span>
              </el-tooltip>
            </td>

            <td class="select">
              <el-button type="success" @click="modType(item, i)">编辑</el-button>
              <el-button type="danger" @click="deleteDialog(item)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- <aside class="no-content" v-if="genreInd == 0" @click="addType">新增问卷类型+</aside> -->

      <!--对外接收人-->
      <table class="table" v-show="questionnaire.length != 0" v-if="genreInd == 1">
        <thead>
          <tr>
            <td v-for="(item, i) in tableHeads" :key="i">{{ item.name }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in questionnaire" :key="item.companys">
            <td v-if="!item.companys || item.companys.length < 15">
              {{item.companys}}
            </td>
            <td v-else>
              <el-tooltip class="item" effect="light" :content="item.companys" placement="bottom">
                <span>{{ item.companys | textLength }}</span>
              </el-tooltip>
            </td>
            <td>{{ item.userName }}</td>
            <td class="select">
              <el-button type="success" @click="modRecPeople(item, i)">编辑</el-button>
              <el-button type="danger" @click="deleteDialog(item)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- <aside class="no-content"  v-if="genreInd == 1" @click="addRecPeople">新增对外接收人+</aside> -->


      <!--新增问卷-->
      <el-dialog
        :title="addName"
        class="add-naire"
        :visible.sync="addNaireType"
        size="tiny">
        <table class="dialog-table">
          <tr>
            <td>类型名称：</td>
            <td>
              <el-input v-model="addNaire.typeName" :maxlength="40" placeholder="输入最大长度为40个字符"></el-input>
            </td>
          </tr>
          <tr>
            <td>用户类型：</td>
            <td>
              <el-radio class="radio" v-model="addNaire.public" label="2">非公开</el-radio>
              <el-radio class="radio" v-model="addNaire.public" label="1">公开</el-radio>
            </td>
          </tr>
          <tr v-show="addNaire.public == 2">
            <td></td>
            <td v-if="user.companyType === 2">
              <el-checkbox v-model="addNaire.identityT">员工</el-checkbox>
              <el-checkbox v-model="addNaire.identityW">外部单位</el-checkbox>
            </td>
            <td v-else>
              <el-checkbox v-model="addNaire.identityT">教师</el-checkbox>
              <el-checkbox v-model="addNaire.identityS">学生</el-checkbox>
              <el-checkbox v-model="addNaire.identityF">家长</el-checkbox>
            </td>
          </tr>
          <tr>
            <td>是否需要审核：</td>
            <td>
              <el-radio class="radio" v-model="addNaire.audit" label="0" @change.native="clea">否</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-radio class="radio" v-model="addNaire.audit" label="1" @change.native="clea">是</el-radio>
            </td>
          </tr>
          <tr v-show="addNaire.audit == '1'">
            <td>审核人：</td>
            <td>
              <div class="div" @click="chooseAuditor">
                <span v-for="(item, i) in auditList" :key="item.label">{{item.name}}<span class="smallClose" @click.stop="deleteOneAudit(item, i)">x</span></span>
              </div>
            </td>
          </tr>
          <tr>
            <td>发布人：</td>
            <td>
              <div class="div" @click="choosePublisher">  
                <span v-for="(item, i) in publishList" :key="item.label">{{item.name}}<span class="smallClose" @click.stop="deleteOne(item, i)">x</span></span>
              </div>
            </td>
          </tr>
        </table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addNaireType = false">取 消</el-button>
          <el-button type="primary" @click="addNaireTypeSure">确 定</el-button>
        </span>
      </el-dialog>


      <!--新增对外接收人-->
      <el-dialog
        :title="addPeople"
        class="add-naire"
        :visible.sync="addRecipient"
        size="tiny">
        <table class="dialog-table">
          <tr v-if="addNew">
            <td>接收人：</td>
            <td>
              <div class="div" @click="chooseRecipient">
                <span v-for="(item, i) in acceptList" :key="i">{{item.name}}<span class="smallClose" @click.stop="deleteOneAccept(item, i)">x</span></span>
              </div>
            </td>
          </tr>
          <tr>
            <td>发布单位：</td>
            <td class="parents">
              <el-checkbox v-model="item.checked" class="radio" v-for="(item, i) in superiorList" :key="i">{{item.companyName}}</el-checkbox>
            </td>
          </tr>
        </table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRecipient = false">取 消</el-button>
          <el-button type="primary" @click="addRecipientSure">确 定</el-button>
        </span>
      </el-dialog>


      <!--选择用户弹出框-->
      <el-dialog title="指定用户" :show-close="false" v-model="courseRenameSure" class="education-teacher-setting">
        <div class="education-course-add-content-left">
          <el-input v-model="searchTeach" placeholder="输入关键词"></el-input>
          <section class="education-course-add-tree">
            <!-- <ul class="dialog-ul">
              <li v-for="(item, index) of deptList" :key="index">
                <el-checkbox v-model="item.checked" @change="deptListClick(item)">{{item.label}}</el-checkbox>
              </li>  
            </ul> -->
            <el-tree
              class="filter-tree"
              :data="deptList"
              show-checkbox
              :props="defaultProps"
              :filter-node-method="filterNode"
              node-key="name"
              @check-change="deptListClick"
              :default-checked-keys="asideList"
              ref="tree">
            </el-tree>
          </section>
        </div>
        <div class="education-course-add-content-right">
          <p>
            <span class="span">已选( {{checkedCount}} )</span>
            <span class="span" @click="empty">清空</span>
          </p>
          <span v-for="(item,i) in deptUserList" @click="deptListDelete(i)" :key="i">
            {{item.name}}
          </span>
        </div>
        <div class="education-course-add-content-button">
          <el-button @click="cancle">取消</el-button>
          <el-button @click="rightSave">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="提示"
        class="dialog-remind"
        top="15%"
        size="tiny"
        :visible.sync="remind">
        <p>您确定要删除吗？</p>
        <div class="button-group">
          <el-button @click="remind = false">取消</el-button>
          <el-button type="success" @click="deleteSure">确定</el-button>
        </div>
      </el-dialog>


  </div>
</template>

<script>
import querystring from 'querystring'
import { notice, error, success } from '../../api/index.js'
import { mapGetters } from 'vuex'
export default {
  name: 'set',
  data () {
    return {
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      remind: false,
      addName: '新增问卷类型',
      addPeople: '新增对外接收人',
      nav: [
        { name: '问卷类型' },
        { name: '对外接收人' }
      ],
      navSchool: [
        { name: '问卷类型' }
      ],
      tableHead: [
        { name: '类型名称' },
        { name: '用户类型' },
        { name: '发布人' },
        { name: '审核人' },
        { name: '操作' }
      ],
      tableHeads: [
        { name: '发布单位' },
        { name: '接收人' },
        { name: '操作' }
      ],
      questionnaire: [],
      genreInd: 0,
      addNaireType: false,
      addRecipient: false,
      addNaire: {
        typeName: '',
        public: '1',
        audit: '0',
        identityT: true,
        identityS: false,
        identityW: false,
        identityF: false
      },
      searchTeach: '',
      deptList: [],
      courseRenameSure: false,
      checkedCount: 0,
      deptUserList: [],
      checkedList: [],
      publishList: [],
      acceptList: [],
      auditList: [],
      auditOrPublish: false,
      accept: false,
      asideList: [],
      id: '',
      superiorList: [],
      addNew: false,
      acceptId: '',
      acceptUserId: '',
      acceptUserName: '',
      filterList: [],
      deleteInfo: {},
      defaultList: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    // 切换
    change (item, i) {
      this.companyName = item.name
    },
    genreClick (item, i) {
      this.genreInd = i
      if (i === 0) {
        this.getList()
      } else {
        this.getRecipient()
      }
    },
    clea () {
      this.auditList = []
    },
    // 删除接收
    deleteAccept (item) {
      this.$https.post(`setting/naireAccepterDelete`, querystring.stringify({
        id: item.id
      })).then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
        } else if (res.data.code === 0) {
          notice(this, res.data.message, 2000)
        } else if (res.data.code === -1) {
          notice(this, res.data.message, 2000)
        }
        this.remind = false
        this.getRecipient()
      })
    },
    // 删除弹框
    deleteDialog (item) {
      this.remind = true
      this.deleteInfo = item
    },
    deleteSure () {
      if (this.genreInd === 0) {
        this.naireCategoryDelete()
      } else {
        this.deleteAccept(this.deleteInfo)
      }
    },
    // 删除问卷类型
    naireCategoryDelete (item) {
      this.$https.post(`setting/naireCategoryDelete`, querystring.stringify({
        id: this.deleteInfo.id
      })).then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
        } else if (res.data.code === 0) {
          notice(this, res.data.message, 2000)
        } else if (res.data.code === -1) {
          notice(this, res.data.message, 2000)
        }
        this.remind = false
        this.getList()
      })
    },
    deptListDelete (i) {
      this.deptUserList.splice(i, 1)
      this.$refs.tree.setCheckedKeys(this.deptUserList.map(item => item.name))
      this.rightFilter()
    },
    // 添加权限管理员
    deptListClick (data, val) {
      this.deptUserList = this.$refs.tree.getCheckedNodes(true)
      this.checkedCount = this.deptUserList.length
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 新增问卷类型
    addType () {
      this.addNaire = {
        typeName: '',
        public: '1',
        audit: '0',
        identityT: true,
        identityS: false,
        identityW: false,
        identityF: false
      }
      this.auditList = []
      this.publishList = []
      this.addNaireType = true
      this.addName = '新增问卷类型'
    },
    // 编辑问卷类型
    modType (item, i) {
      this.$https.get(`setting/naireCategoryDetail?id=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let obj = res.data.result
          this.addNaire.typeName = obj.name
          this.addNaire.public = String(obj.openType)
          this.addNaire.audit = String(obj.checkState)
          this.addNaire.identityT = false
          this.addNaire.identityS = false
          this.addNaire.identityF = false
          this.addNaire.identityW = false
          this.id = item.id
          obj.userType.split(',').forEach(item => {
            if (item === '1') {
              this.addNaire.identityT = true
            } else if (item === '2') {
              this.addNaire.identityS = true
            } else if (item === '3') {
              this.addNaire.identityF = true
            } else if (item === '4') {
              this.addNaire.identityW = true
            }
          })
          this.auditList = obj.checkers.map(item => ({...item, label: item.userName, code: item.userId, name: item.userName}))
          this.publishList = obj.publishers.map(item => ({...item, label: item.userName, code: item.userId, name: item.userName}))
          this.addNaireType = true
          // this.rightFilter()
          this.addName = '编辑问卷类型'
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 编辑对外接收人
    modRecPeople (item, i) {
      this.superiorList = this.superiorList.map(item => ({
        ...item,
        checked: false
      }))
      this.$https.get(`setting/naireAccepterDetail?id=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.acceptId = res.data.result.id
          this.acceptUserId = res.data.result.userId
          this.acceptUserName = res.data.result.userName
          res.data.result.companys.forEach(items => {
            this.superiorList.forEach(item => {
              if (item.companyId === items.companyId) {
                item.checked = true
              }
            })
          })
        }
      })
      this.addNew = false
      this.addRecipient = true
      this.addPeople = '编辑'
    },
    // 获取问卷类型列表
    getList () {
      this.$https.get(`setting/naireCategoryList`)
      .then(res => {
        if (res.data.code === 1) {
          this.questionnaire = res.data.result.map(item => ({...item, user: item.userType.split(',')}))
        } else if (res.data.code === -2) {
          error(this)
        }
      })
    },
    // 获取对外接收人列表
    getRecipient () {
      this.$https.get(`setting/naireAccepterList`)
      .then(res => {
        if (res.data.code === 1) {
          this.questionnaire = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取上级单位
    parentCompanyList () {
      this.$https.get(`/common/parentCompanyList`)
      .then(res => {
        if (res.data.code === 1) {
          this.superiorList = res.data.result.map(item => ({checked: false, companyId: item.id, companyName: item.name}))
        }
      })
    },
    // 新增对外接收人
    addRecPeople () {
      this.addRecipient = true
      this.superiorList.forEach(item => {
        item.checked = false
      })
      this.addNew = true
      this.acceptList = []
      this.addPeople = '新增对外接收人'
    },
    // 新增对外接收人/bianji确定按钮
    addRecipientSure (item, i) {
      let superList = this.superiorList.filter(item => item.checked)
      if (superList.length === 0) {
        notice(this, '请选择发布单位', 2000)
        return
      }
      if (this.addPeople === '新增对外接收人') {
        if (this.acceptList.length === 0) {
          notice(this, '请选择接收人', 2000)
          return
        }
        this.naireAccepterAdd()
      } else if (this.addPeople === '编辑') {
        this.naireAccepterUpdate()
      }
      this.addRecipient = false
    },
    // 新增对外接收人信息保存接口
    naireAccepterAdd () {
      // console.log(this.acceptList)
      let users = JSON.stringify(this.acceptList.map(item => ({userId: item.userId || item.code, userName: item.name})))
      let companys = JSON.stringify(this.superiorList.filter(item => item.checked))
      this.$https.post(`/setting/naireAccepterAdd`, querystring.stringify({
        users,
        companys
      })).then(res => {
        if (res.data.code === 1) {
          this.getRecipient()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 修改对外接收人保存
    naireAccepterUpdate () {
      // let users = JSON.stringify(this.acceptList.map(item => ({userId: item.code, userName: item.label})))
      let companys = JSON.stringify(this.superiorList.filter(item => item.checked))
      this.$https.post(`setting/naireAccepterUpdate`, querystring.stringify({
        id: this.acceptId,
        userId: this.acceptUserId,
        userName: this.acceptUserName,
        companys
      })).then(res => {
        if (res.data.code === 1) {
          this.getRecipient()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 新增问卷类型保存
    async naireCategoryAdd () {
      let publisher = JSON.stringify(this.publishList.map(item => ({userId: item.userId || item.code, userName: item.name})))
      let chceker = JSON.stringify(this.auditList.map(item => ({userId: item.userId || item.code, userName: item.name})))
      let userType = []
      if (this.addNaire.public === '2') {
        if (this.addNaire.identityT) {
          userType.push(1)
        }
        if (this.addNaire.identityS) {
          userType.push(2)
        }
        if (this.addNaire.identityF) {
          userType.push(3)
        }
        if (this.addNaire.identityW) {
          userType.push(4)
        }
      }
      await this.$https.post(`setting/naireCategoryAdd`, querystring.stringify({
        name: this.addNaire.typeName,
        openType: this.addNaire.public,
        userType: userType.join(','),
        checkState: this.addNaire.audit,
        publisher,
        chceker
      })).then(res => {
        if (res.data.code === 1) {
          this.getList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => console.log(res))
    },
    // 新增问卷确定按钮
    async addNaireTypeSure () {
      if (!this.addNaire.typeName || this.addNaire.typeName.trim() === '') {
        notice(this, '请输入类型名称', 2000)
        return
      }
      let userType = []
      if (this.addNaire.public === '2') {
        if (this.addNaire.identityT) {
          userType.push(1)
        }
        if (this.addNaire.identityS) {
          userType.push(2)
        }
        if (this.addNaire.identityF) {
          userType.push(3)
        }
        if (this.addNaire.identityW) {
          userType.push(4)
        }
        if (!userType.length) {
          notice(this, '请选择用户类型', 2000)
          return
        }
      }
      if (this.addNaire.audit === '1' && this.auditList.length === 0) {
        notice(this, '请选择审核人', 2000)
        return
      }
      if (this.publishList.length === 0) {
        notice(this, '请选择发布人', 2000)
        return
      }
      if (this.addName === '新增问卷类型') {
        await this.naireCategoryAdd()
      } else if (this.addName === '编辑问卷类型') {
        await this.naireCategoryUpdate()
      }
      this.$store.dispatch('init')
      this.addNaireType = false
    },
    // 修改问卷类型保存
    async naireCategoryUpdate () {
      let publisher = JSON.stringify(this.publishList.map(item => ({userId: item.userId || item.code, userName: item.name})))
      let chceker = JSON.stringify(this.auditList.map(item => ({userId: item.userId || item.code, userName: item.name})))
      let userType = []
      if (this.addNaire.identityT) {
        userType.push(1)
      }
      if (this.addNaire.identityS) {
        userType.push(2)
      }
      if (this.addNaire.identityF) {
        userType.push(3)
      }
      if (this.addNaire.identityW) {
        userType.push(4)
      }
      await this.$https.post(`setting/naireCategoryUpdate`, querystring.stringify({
        id: this.id,
        name: this.addNaire.typeName,
        openType: this.addNaire.public,
        userType: userType.join(','),
        checkState: this.addNaire.audit,
        publisher,
        chceker
      })).then(res => {
        if (res.data.code === 1) {
          this.getList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => console.log(res))
    },
    rightFilter () {
      this.deptList.forEach(item => {
        item.checked = false
      })
      this.deptUserList.forEach(item => {
        this.deptList.map(items => {
          if (String(items.name) === String(item.name)) {
            items.checked = true
          }
        })
      })
      this.checkedCount = this.deptUserList.length
    },
    // 点击选择审核人
    chooseAuditor () {
      this.asideList = []
      this.auditOrPublish = false
      this.deptUserList = this.copy(this.auditList)
      this.deptUserList.forEach(item => {
        this.asideList.push(item.name)
      })
      this.defaultList = this.deptUserList.map(item => item.id)
      this.rightFilter()
      this.courseRenameSure = true
      this.getDeplist()
      // this.auditList = .
    },
    resetTree (arr) {
      return arr.map(item => {
        if (item.childDeptList && item.childDeptList.length) {
          return {
            ...item,
            userList: this.resetTree(item.childDeptList.concat((item.userList || []).map(items => ({...items, label: items.name, code: items.id}))))
          }
        } else return { ...item }
      })
    },
    // 获取发布人
    getDeplist () {
      this.$https.get(`/common/companyUserList?companyId=${this.user.companyId}`)
      .then(res => {
        if (res.data.code === 1) {
          let result = this.resetTree((res.data.result[0].deptList || []).map(item => ({...item, id: `d${item.id}`}))).concat(res.data.result[0].userList || [])
          this.deptList = result.map(item => ({...item, checked: false, label: item.name}))
          // this.deptList = res.data.result.map(item => ({...item, label: item.name}))
          this.filterList = this.copy(this.deptList)
          this.rightFilter()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 点击选择发布人
    choosePublisher () {
      this.asideList = []
      this.auditOrPublish = true
      this.deptUserList = this.copy(this.publishList)
      this.deptUserList.forEach(item => {
        this.asideList.push(item.name)
      })
      this.defaultList = this.deptUserList.map(item => item.id)
      this.courseRenameSure = true
      this.rightFilter()
      this.getDeplist()
    },
    // 点击选择接收人
    chooseRecipient () {
      this.asideList = []
      this.accept = true
      this.deptUserList = this.copy(this.acceptList)
      this.deptUserList.forEach(item => {
        this.asideList.push(item.name)
      })
      this.defaultList = this.deptUserList.map(item => item.id)
      this.courseRenameSure = true
      this.getDeplist()
    },
    cancle () {
      this.courseRenameSure = !this.courseRenameSure
      this.searchTeach = ''
    },
    // 清空
    empty () {
      this.deptUserList = []
      this.deptList.forEach(items => {
        items.checked = false
      })
      this.$refs.tree.setCheckedKeys(this.deptUserList)
      this.checkedCount = 0
    },
    // 深拷贝
    copy (arr) {
      let arrs = []
      if (arr === null) return arrs
      for (let i = 0; i < arr.length; i++) {
        arrs.push(arr[i])
      }
      return arrs
    },
    // 点击删除一个发布人
    deleteOne (item, i) {
      this.publishList.splice(i, 1)
    },
    // 点击删除一个审核人
    deleteOneAudit (item, i) {
      this.auditList.splice(i, 1)
    },
    deleteOneAccept (item, i) {
      this.acceptList.splice(i, 1)
    },
    // 保存权限管理员信息
    rightSave () {
      if (this.auditOrPublish) {
        this.publishList = this.deptUserList
      } else {
        this.auditList = this.deptUserList
      }
      if (this.accept) {
        this.acceptList = this.deptUserList
      }
      this.courseRenameSure = false
      this.searchTeach = ''
    }
  },
  created () {
    this.getList()
    // this.getRecipient()
    this.parentCompanyList()
  },
  filters: {
    textLength (val) {
      if (val) {
        if (val.length > 15) {
          return val.substring(0, 15) + '...'
        } else {
          return val
        }
      }
    }
  },
  watch: {
    searchTeach (val) {
      this.$refs.tree.filter(val)
      // this.deptList = this.copy(this.filterList.filter(item => item.label.indexOf(val) !== -1))
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/scss/main.scss';
  #set {
    .nav {
      margin-top: 14px;
      border-bottom: 1px solid $border;
      li {
        display: inline-block;
        width: 94px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        margin-right: $width;
        cursor: pointer;
        transition: all 0.6s;
        &.active {
          background: $theme;
          color: $white;
        }
      }

      .el-button {
        float: right;
      }
    }

    .table {
      width: 1200px;
      td {
        padding-left: 30px;
        height: 48px;
        &:last-child {
          text-align: center;
        }
      }
      tbody {
        border: 1px solid $border;
        td {
          background: $white;
          border-bottom: 1px dashed $border;
          .state-unpublish {
            color: $theme;
          }
          .state-under-way {
            color: $yellow;
          }
          .state-finish {
            color: $darkRed;
          }
          .item {
            clear: both;
            position: relative;
          }
          &.select {
            text-align: center;
            width: 200px;
            .el-button:nth-child(2) {
              margin-left: 24px;
            }
          }
        }
      }
    }
    .no-content {
      background: #fff;
      height: 50px;
      line-height: 50px;
      margin-top: 20px;
      cursor: pointer;
    }
    .add-naire {
      .el-dialog {
        width: 600px;
      }
      .div{
        line-height: 40px;
        overflow: hidden;
        &>span{
          display: inline-block;
          height: 30px;
          padding: 0px 10px;
          margin-left: 6px;
          line-height: 30px;
          border: 1px solid #19b599;
          color: #19b599;
          border-radius: 4px;
        }
        .smallClose {
          margin-left: 6px;
          color: #19b599;
          cursor: pointer;
        }
      }
      .parents{
        padding-left: 20px;
        margin-top: 10px;
        max-height: 300px;
        .radio{
          display: block;
          margin: 0;
        }
      }
    }

    .add-naire {
      .el-dialog {
        .el-dialog__header {
          padding: 20px;
        }
        .el-dialog__body {
          padding: 0 20px;
        }
        .dialog-footer {
          .el-button--primary {
            background: $theme;
            border: none;
            &:active {
              opacity: 0.8;
            }
          }
        }
        .dialog-table {
          width: 400px;
          margin: 20px auto;
          tr {
            transition: all 0.6;
          }
          td {
            height: 50px;
            &:first-child {
              text-align: right;
              padding-right: 20px;
              width: 120px;
            }
            .div {
              width: 100%;
              min-height: 40px;
              max-height: 120px;
              overflow: auto;
              border: 1px solid #8391a5;
              border-radius: 5px;
            }
          }
        }
      }
    }
    .dialog-ul {
      padding: 5px;
      li {
        height: 40px;
        line-height: 40px;
      }
    }
  }
</style>
