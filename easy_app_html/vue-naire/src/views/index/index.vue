<template>
  <div id="index">
      <section class="top-nav">
        <div class="nav-content">
          <div class="nav-left">
            <el-select v-if="userShow" v-model="childValue" placeholder="请选择孩子" @change="childChange">
              <el-option
                v-for="item in childOptions"
                :key="item.childId"
                :label="item.childName"
                :value="item.childId">
              </el-option>
            </el-select>
            <el-input
              :maxlength="30"
              v-model="keyword"
              @keyup.enter.native="getList"
              placeholder="请输入内容">
            </el-input>
            <el-button class="green" @click="getList">搜索</el-button>
          </div>
          <div class="nav-right">
            <div class="nav-right-content">
              <el-button @click="route" class="green" v-if="leftMenu.length != 0">管理</el-button>
            </div>
          </div>
        </div>
      </section>
      
    <article :class="{list: isList}" v-if="isList"  v-show="naireList.length != 0">
        <el-row>
          <el-col :span="10">问卷名称</el-col>
          <el-col :span="4">是否实名</el-col>
          <el-col :span="2">状态</el-col>
          <el-col :span="4">截止时间</el-col>
          <el-col :span="2">操作</el-col>
        </el-row>
        <el-row v-for="(item, i) in naireList" :key="i">
          <el-col :span="10"  v-if="!item.title || item.title.length < 16">
            {{item.title}}　
            <span class="type" v-show="item.type === 3">外部问卷</span>
          </el-col>
          <el-col :span="10" v-else>
            <el-popover placement="bottom" trigger="hover" :content="item.title">
              <span slot="reference">
                {{item.title | textLength}}
                <span class="type" v-show="item.type === 3">外部问卷</span>
              </span>
            </el-popover>
          </el-col>
          <el-col :span="4">
            <span v-if="item.joinWay == 1">是</span>
            <span v-if="item.joinWay == 2">否</span>
          </el-col>
          <el-col :span="2">
            <span v-if="item.naireState == 1 && item.type == 2" class="ing">进行中</span>
            <span v-if="item.naireState != 1 && item.type == 2" class="end">已结束</span>

            <span v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 0" class="ing">进行中</span>
            <span v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 1" class="ing">转发审核中</span>
            <span v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 2" class="zf">已转发</span>
            <span v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 3" class="end">已下线</span>
            <el-tooltip class="item" effect="dark" :content="item.forwardRejectReason" placement="bottom" v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 4">
              <span class="end">转发被驳回</span>
            </el-tooltip>

            <span v-if="item.overtimeFlag && item.joinUser == 2 && item.type == 3" class="end">已过期</span>
            <span v-if="!item.overtimeFlag && item.joinUser == 2 && item.type == 3" class="ing">进行中</span>

          </el-col>
          <el-col :span="4" class="time">{{item.endTime}}</el-col>
          <el-col :span="4" style="overflow: hidden; height: 60px;">

            <!--内部问卷-->
            <!--内部问卷未答-->
            <el-button v-if="item.type == 2 && item.answerState == 1 && item.naireState == 1" class="green" @click="respondence(item, 'answer')">作答</el-button>
            <el-button v-if="item.type == 2 && item.answerState == 1 && item.naireState == 2 && item.showResult == 1" class="blue"  @click="lookResults(item)">查看结果</el-button>
            <el-button v-if="item.type == 2 && item.answerState == 1 && item.naireState == 2 && item.showResult == 1" class="blue"  @click="lookSelf(item)">查看</el-button>
            <el-button v-if="item.type == 2 && item.answerState == 1 && item.naireState == 2 && item.showResult == 2" class="blue"  @click="lookSelf(item)">查看</el-button>
            <!--内部问卷已答-->
            <el-button v-if="item.type == 2 && item.answerState == 2 && item.showResult == 1" class="blue"  @click="lookResults(item)">查看结果</el-button>
            <el-button v-if="item.type == 2 && item.answerState == 2 && item.showResult == 1" class="blue"  @click="lookSelf(item)">查看</el-button>
            <el-button v-if="item.type == 2 && item.answerState == 2 && item.showResult == 2" class="blue"  @click="lookSelf(item)">查看</el-button>
            
            <!--外部问卷-->
            <el-button v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 0" class="yellow" @click="transpondSure(item)">转发</el-button>
            <el-button v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 1" class="blue" @click="otherCheck(item)">查看</el-button>
            <el-button v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 2" class="blue" @click="otherCheck(item)">查看</el-button>
            <el-button v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 3" class="blue" @click="otherCheck(item)">查看</el-button>
            <el-button v-if="item.joinUser == 1 && item.type == 3 && item.forwardCheckState == 4" class="yellow" @click="transpondSure(item)">转发</el-button>

            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 2 &&  item.showResult == 1" class="blue"  @click="lookResults(item)">查看结果</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 0 && item.forwardState == 1 && item.showResult == 1" class="blue" @click="otherCheck(item)">查看</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 0 && item.forwardState == 1 && item.showResult == 2" class="blue" @click="otherCheck(item)">查看</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 1 && item.forwardState == 1 && item.showResult == 1 && !item.overtimeFlag" class="blue" @click="otherCheck(item)">查看</el-button>

            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 0 && item.overtimeFlag && item.forwardState == 2" class="blue" @click="otherCheck(item)">查看</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 0 && !item.overtimeFlag && item.forwardState == 2" class="yellow" @click="transpondSure(item)">转发</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 0 && !item.overtimeFlag && item.forwardState == 1" class="yellow" @click="transpondSure(item)" :disabled="true">转发</el-button>
            <!--外部问卷发送给个人-->
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 1 && !item.overtimeFlag && item.forwardState == 0" class="green" @click="respondence(item, 'answer')">作答</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 1 && !item.overtimeFlag && item.forwardState == 1" class="green" @click="respondence(item, 'answer')">作答</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 1 && !item.overtimeFlag && item.forwardState == 2" class="yellow" @click="transpondSure(item)">转发</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 1 && item.overtimeFlag" class="blue" @click="otherCheck(item)">查看</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 2 &&  item.showResult == 2" class="blue" @click="otherCheck(item)">查看</el-button>
            <el-button v-if="item.joinUser == 2 && item.type == 3 && item.answerState == 2 &&  item.showResult == 1" class="blue" @click="otherCheck(item)">查看</el-button>
            
            

          </el-col>
        </el-row>
    </article>

    <div class="no-content" v-show="naireList.length == 0">暂无数据</div>
    <div class="block">
      <el-pagination
        v-show="naireList.length != 0"
        layout="prev, pager, next"
        :page-size="12"
        :current-page="page"
        @current-change="handleCurrentChange"
        :total="totalCount">
      </el-pagination>
    </div>

    <!--转发-->
    <el-dialog
      class="transpond"
      :visible.sync="transpond"
      size="tiny">
      <h3>{{title}}</h3>
      <p><span>说明：</span><span> {{remark}}</span></p>
      <p v-if="user.companyType == 1"
      ><span>接收人：</span>
        <el-checkbox v-for="(item, i) in types" :key="i" v-model="item.check" @change="changeTea">{{ item.name }}</el-checkbox>
      </p>
      <!-- <p><span>样本数据：</span><span> {{returnCount}}</span></p> -->
      <div class="content">
        <p><span>发布人：</span><span>{{createdUser}}</span></p>
        <p><span>截止时间：</span><span>{{endTime}}</span></p>
        <p><span>问卷题数：</span><span>{{qCount}}题</span></p>
        <p><span @click="lookDetails">查看问卷详情 ></span></p>
      </div>
      <p class="p">
        <span>审核人:　</span>
        <!--<el-input type="text" placeholder="点击选择审核人" @click.native="chooseAuditor"></el-input>-->
        <span value="点击选择接收人" @click="chooseAuditor" class="choose-people">
          <span v-for="(item, index) in auditList" :key="index">{{item.label}}</span>
        </span>
      </p>
      <p class="p" style="height: 82px;" v-if="user.companyType == 1" v-for="(item, i) in types" :key="i" v-show="item.check">
        <span>接收{{ item.name }}:</span>
        <span value="点击选择接收人" @click="chooseRecipients(item)" class="choose-people" style="height: 82px;">
          <span v-for="(item, index) in item.list" :key="index">{{item.name || item.userName}}</span>
        </span>
      </p>
      <p class="p" style="height: 82px;" v-else>
        <span>接收人:　</span>
        <span value="点击选择接收人" @click="chooseRecipient" class="choose-people" style="height: 82px;">
          <span v-for="(item, index) in acceptList" :key="index">{{item.name}}</span>
        </span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transpond = false">取 消</el-button>
        <el-button type="primary" @click="naireForward">提交</el-button>
      </span>
    </el-dialog>


      <!--选择用户弹出框-->
    <el-dialog title="指定用户" v-model="courseRenameSure" :show-close="false"  class="education-teacher-setting">
      <div class="education-course-add-content-left">
        <i class="el-icon-close close" @click="cancle"></i>
        <el-input v-model="searchTeach" placeholder="输入关键词"></el-input>
        <section class="education-course-add-tree">
          <el-tree
            class="filter-tree"
            :data="deptList"
            show-checkbox
            :props="defaultProps"
            :filter-node-method="filterNode"
            node-key="id"
            @check-change="deptListClick"
            @node-click="nodeClick"
            @node-expand="nodeClick"
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
  </div>
</template>

<script>
import { notice, error, success } from '../../api/index.js'
import querystring from 'querystring'
import { dateFormat } from '../../filters/index.js'
import { mapGetters } from 'vuex'
import list from '../../assets/images/list.png'
import listSelected from '../../assets/images/list-selected.png'
export default {
  name: 'index',
  data () {
    return {
      userShow: false,
      icon: [
        { normal: listSelected, active: list, state: true }
        // { normal: card, active: cardSelected, state: false }
      ],
      keyword: '',
      naireList: [],
      adminFlag: true,
      isList: true,
      navList: [
        {name: '创建问卷'},
        {name: '问卷管理'},
        {name: '问卷设置'},
        {name: '问卷审核'}
      ],
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      transpond: false,
      courseRenameSure: false,
      searchTeach: '',
      deptList: [],
      checkedCount: 0,
      deptUserList: [],
      endTime: '',
      page: 1,
      title: '',
      returnCount: 0,
      remark: '',
      createdUser: '',
      naireId: '',
      count: 0,
      qCount: 0,
      acceptList: [],
      auditList: [],
      acceptOrAudit: false,
      asideList: [],
      totalCount: 0,
      filterList: [],
      childOptions: [],
      childValue: '',
      defaultList: [],
      types: [
        { name: '教师', type: 1, check: false, list: [] },
        { name: '学生', type: 2, check: false, list: [] },
        { name: '家长', type: 3, check: false, list: [] }
      ],
      identType: 1
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'leftMenu'
    ])
  },
  methods: {
    // 切换孩子
    childChange () {
      this.getList()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    route () {
      let path = this.leftMenu[0].path
      this.$router.push(`${path}`)
    },
    // 获取问卷列表接口
    getList () {
      this.$https.get(`/index/nairePage?title=${this.keyword}&pageNo=${this.page}&pageSize=${12}&childId=${this.childValue}`)
      .then(res => {
        if (res.data.code === 1) {
          this.naireList = res.data.result.list.map(item => ({...item, endTime: dateFormat(item.endTime, 'yyyy-MM-dd hh:mm')}))
          this.totalCount = res.data.result.totalCount
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    nodeClick (data) {
      if (!(data.userList && data.userList[0] && data.userList[0].parents === 1)) return
      this.$https.get(`/common/companyUserList?companyId=${data.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let result = (res.data.result[0].deptList || []).concat(res.data.result[0].userList || [])
          data.userList = result.map(item => ({...item, companyId: data.id, companyName: data.name, userId: item.id, id: item.id}))
          this.$set(data, 'userList', result.map(item => ({...item, companyId: data.id, companyName: data.name, userId: item.id, id: item.id})))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 添加权限管理员
    deptListClick (data, val) {
      if (data.parents === 1) return
      if (data[0] && data[0].parents === 1) {
        return
      }
      if (data.userId) {
        this.deptUserList = this.$refs.tree.getCheckedNodes(true).filter(item => !item.clazzName)
        this.checkedCount = this.deptUserList.length
      }
    },
    rightFilter () {
      this.deptList.forEach(item => {
        item.checked = false
      })
      this.deptUserList.forEach(item => {
        this.deptList.map(items => {
          if (items.label === item.label) {
            // items.checked = true
            this.$set(items, 'checked', true)
          }
        })
      })
      this.checkedCount = this.deptUserList.length
    },
    deptListDelete (i) {
      this.deptUserList.splice(i, 1)
      this.$refs.tree.setCheckedKeys(this.deptUserList.map(item => item.id))
      this.rightFilter()
    },
    // 保存权限管理员信息
    rightSave () {
      if (this.acceptOrAudit) {
        if (this.user.companyType === 1) {
          this.types[this.identType - 1].list = this.deptUserList.map(item => ({...item, userType: this.identType}))
        } else this.acceptList = this.deptUserList
      } else {
        this.auditList = this.deptUserList
      }
      this.courseRenameSure = false
      this.searchTeach = ''
    },
    cancle () {
      this.searchTeach = ''
      this.courseRenameSure = !this.courseRenameSure
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
    // 转发保存接口
    naireForward () {
      this.acceptList = []
      this.types.forEach(item => {
        this.acceptList = this.acceptList.concat(item.list)
      })
      let userjson = JSON.stringify(this.acceptList.map(item => ({userId: item.userId || item.code, userName: item.name || item.userName || item.label, userType: item.userType})))
      if (!this.acceptList.length) {
        notice(this, '请选择接收人', 2000)
        return
      }
      let checkuser
      if (this.auditList.length !== 0) {
        checkuser = this.auditList.map(item => item.userId).join(',')
      } else {
        checkuser = ''
      }
      // console.log(checkuser)
      this.$https.post(`/index/naireForward`, querystring.stringify({
        userjson,
        naireId: this.naireId,
        checkusers: checkuser
      })).then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.getList()
          this.transpond = false
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 转发按钮
    transpondSure (item) {
      this.transpond = true
      this.title = item.title
      this.returnCount = item.returnCount
      this.remark = item.remark
      this.createdUser = item.createdUserName
      this.endTime = dateFormat(item.endTime, 'yyyy-MM-dd hh:mm')
      this.naireId = item.id
      this.qCount = item.qCount
      this.acceptList = []
      this.auditList = []
      this.types = this.types.map(item => ({...item, check: false, list: []}))
    },
    // 获取审核人列表
    nairegetCheckerList () {
      this.$https.get(`/index/nairegetCheckerList`)
      .then(res => {
        if (res.data.code === 1) {
          let result = [
            {
              name: this.user.companyName,
              label: this.user.companyName,
              userList: (res.data.result || []).map(item => ({...item, label: item.userName, checked: false, name: item.userName}))
            }
          ]
          this.deptList = result
          // this.deptList = res.data.result.map(item => ({...item, label: item.userName, checked: false}))
          this.filterList = this.copy(this.deptList)
          this.rightFilter()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 点击选择审核人
    chooseAuditor () {
      this.asideList = []
      this.acceptOrAudit = false
      this.deptUserList = this.copy(this.auditList)
      this.deptUserList.forEach(item => {
        this.asideList.push(item.id)
      })
      this.courseRenameSure = true
      this.nairegetCheckerList()
      // this.auditList = .
    },
    resetTree (arr) {
      return arr.map(item => {
        if (item.childDeptList && item.childDeptList.length) {
          return {
            ...item,
            checked: false,
            code: item.id,
            label: item.name,
            userList: this.resetTree(item.childDeptList.concat((item.userList || []).map(items => ({...items, label: items.name, code: items.id}))))
          }
        } else return { ...item }
      })
    },
    // 获取接收人
    async getDeplist (s) {
      if (s === 1) {
        await this.$https.get(`/common/companyUserList?companyId=${this.user.companyId}`)
        .then(res => {
          if (res.data.code === 1) {
            let result = [
              {
                name: this.user.companyName,
                label: this.user.companyName,
                userList: this.resetTree((res.data.result[0].deptList || []).map(item => ({...item, id: `d${item.id}`}))).concat(res.data.result[0].userList || [])
              }
            ]
            this.deptList = result
            this.filterList = this.copy(this.deptList)
            this.rightFilter()
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (s === 2) {
        await this.$https.get(`/common/studentTree?companyId=${this.user.companyId}`)
        .then(res => {
          if (res.data.code === 1) {
            let result = [
              {
                name: this.user.companyName,
                label: this.user.companyName,
                userList: res.data.result.map(item => ({...item, checked: false, name: item.clazzName, children: [], code: item.id, label: item.clazzName, userList: (item.userList || []).map(items => ({...items, userId: items.id}))}))
              }
            ]
            this.deptList = result
            this.filterList = this.copy(this.deptList)
            // this.filterRight()
            // console.log(res.data.result)
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else if (s === 3) {
        this.$https.get(`common/studentTree?companyId=${this.user.companyId}`)
        .then(res => {
          if (res.data.code === 1) {
            let result = [
              {
                name: this.user.companyName,
                label: this.user.companyName,
                userList: res.data.result.map(item => ({...item, checked: false, name: item.clazzName, children: [], code: item.id, label: item.clazzName, userList: (item.userList || []).map(items => ({...items, userId: items.id, name: items.name + '的家长', label: items.name + '的家长'}))}))
              }
            ]
            this.deptList = result
            this.filterList = this.copy(this.deptList)
            // this.filterRight()
            // console.log(res.data.result)
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 点击选择接收人
    async chooseRecipient () {
      this.acceptOrAudit = true
      this.courseRenameSure = true
      this.deptUserList = this.copy(this.acceptList)
      this.asideList = this.deptUserList.map(item => item.id)
      await this.getDeplist(1)
    },
    chooseRecipients (item) {
      this.acceptOrAudit = true
      this.courseRenameSure = true
      this.deptUserList = this.copy(item.list)
      this.asideList = this.deptUserList.map(item => item.id)
      this.identType = item.type
      this.getDeplist(item.type)
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
    // 转发查看问卷详情
    lookDetails () {
      let val = this.naireId
      // window.open(`#/answer?naireId: ${val}`)
      this.$router.push({path: '/answer', query: {naireId: val, path: '/index', page: this.page}})
    },
    // 查看详情
    respondence (item, answer) {
      let answers = 0
      if (answer) {
        answers = 1
      }
      this.$router.push({path: '/answer', query: {naireId: item.id, answer: answers, childId: this.childValue || '', childName: this.childOptions.filter(item => item.childId === this.childValue)[0] ? this.childOptions.filter(item => item.childId === this.childValue)[0].childName : ''}})
    },
    lookSelf (item) {
      this.$router.push({path: '/answerCheck', query: {naireId: item.id, userId: this.user.id, childId: this.childValue || ''}})
    },
    // 外部查看
    otherCheck (item) {
      this.$router.push({path: '/answerCheck', query: {naireId: item.id, userId: this.user.id}})
    },
    // 查看结果
    lookResults (item) {
      this.$router.push({path: '/homeDetails', query: {naireId: item.id, childId: this.childValue || '', page: this.page}})
    },
    typeSwitch (i) {
      if (this.types === i) return
      this.types = i
      this.acceptList = []
    },
    changeTea (val) {
      this.types.forEach(item => {
        if (!item.check) item.list = []
      })
    }
  },
  watch: {
    searchTeach (val) {
      this.$refs.tree.filter(val)
      // this.deptList = this.copy(this.filterList.filter(item => item.label.indexOf(val) !== -1))
    }
  },
  created () {
    if (this.$route.query.page) {
      this.page = this.$route.query.page
    }
    setTimeout(() => {
      if (this.user.parentFlag) {
        this.userShow = true
        this.childOptions = this.user.childList
        this.childValue = this.user.childList[0].childId
      }
      this.getList()
    }, 400)
  },
  filters: {
    textLength (val) {
      if (val) {
        if (val.length > 16) {
          return val.substring(0, 16) + '...'
        } else {
          return val
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';
#index {
  section.top-nav {
    position: absolute;
    top: 51px;
    left: 0;
    right: 0;
    height: 68px;
    background: #fff;
    border-bottom: 1px solid #e4e4e4;
    .nav-content {
      width: 1200px;
      margin: 0 auto;
      height: 100%;
      line-height: 68px;
      .nav-left {
        float: left;
        height: 68px;
        &>.el-input {
          width: 240px;
          height: 36px;
        }
      }
      .nav-right {
        overflow: hidden;
        float: right;
        height: 68px;
        .nav-right-content {
          // border-right:1px solid #e4e4e4;
          float:left;
          .el-button {
            // margin-right: 22px;
            width: 98px;
          }
        }
        .list {
          width: 60px;
          text-align: center;
          margin: 0 auto;
          &>img {
            width: 20px;
            height: 20px;
            cursor: pointer;
            vertical-align: middle;
          }
        }
      }
    }
  }
  article{
    margin-top: 68px;
    min-height: 580px;
    .el-button {
      width: 86px;
      padding:10px 0;
    }
  }
  article.list {
    width: 1200px;
    // margin:0 auto;
    margin-bottom: 20px;
    .el-row:first-child {
      margin-top: 20px;
      border: none;
      background: transparent;
    }
    .el-row{
      height: 62px;
      border: 1px solid #e8e8e8;
      line-height: 62px;
      background: #fff;
    }
    .el-col:first-child {
      text-align: left;
      padding-left: 20px;
    }
    .el-col:last-child {
      text-align: left;
      // padding-right: 20px;
    }
    .el-col {
      text-align: center;
    }
    .type {
      background: #19b955;
      color: #fff;
      margin-left: 38px;
      border-radius: 2px;
    }
  }
  article.card {
    display: flex;
    padding: 0px 24px;
    padding-top: 20px;
    flex-wrap: wrap;
    justify-content: flex-start;
    .card-p {
      position: relative;
      z-index: 100;
      cursor: pointer;
    }
    &>div {
      float: left;
      margin-right: 10px;
      margin-left: 10px;
      width: 264px;
      height: 228px;
      border: 1px solid #e8e8e8;
      background: #fff;
      margin-bottom: 38px;
      position: relative;
      p:first-child {
        padding-top: 10px;
        height: 74px;
        color: #333;
      }
      &>p{
        padding: 0 20px;
      }
      p.time {
        height: 50px;
        color: #656565;
      }
      p.type {
        height: 30px;
        line-height: 30px;
        .type-left {
          float:left;
          .form{
            background: #19b955;
            color: #fff;
            padding: 2px 4px;
            border-radius: 4px;
          }
        }
        .type-right {
          float: right;
          color: #9a9a9a;
        }
      }
      p.state-and-count{
        border-top: 1px solid #e8e8e8;
        line-height: 54px;
        .state {
          float: left;
        }
        .count {
          float: right;
          color: #a0a0a0;
        }
      }
      .card-button{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: none;
        text-align: center;
        padding-top: 40%;
      }
    }
    div:hover {
      .card-button {
        display: block;
        background: rgba(255,255,255,0.5);
      }
    }
    
  }
  .block {
    width: 1200px;
    text-align: center;
    height: 30px;
    margin: 20px auto;
    padding-bottom: 26px;
    color: #333;
    .el-pager{
      li {
        width: 40px;
        height: 40px;
        border: none;
        line-height: 40px;
      }
      li:hover{
        color: #19b955;
      }
      li.active {
        border-color: #19b955;
        background-color: #19b955;
        color: #fff;
        cursor: default;
      }
    }
    .el-pagination button {
      width: 40px;
      height: 40px;
      border: none;
    }
    .el-pagination button:hover{
      color: #19b955;
    }
  }
  .green {
    background: #19b955;
    border-color: #19b955;
    color: #fff;
  }
  .blue {
    background: #1F9FFF;
    border-color: #1F9FFF;
    color: #fff;
  }
  .yellow {
    background: #f7ba2b;
    border-color: #f7ba2b;
    color: #fff;
  }
  .end {
    color: #f13f3f;
  }
  .ing {
    color: #19b957;
  }
  .zf {
    color: #f7ba2b;
  }
  .transpond {
    .el-dialog {
      width: 888px;
      top: 7% !important;
    }
    .el-dialog__header {
      padding: 20px;
    }
    .el-dialog__body {
      padding: 0 20px;
    }
    h3{
      width: 100%;
      text-align: center;
    }
    p {
      margin-top: 10px;
      padding-left: 10px;
    }
    .content {
      width: 844px;
      height: 160px;
      background: #eee;
      padding: 0;
      padding-top: 10px;
      p:last-child{
        text-align: center;
        color: #1F9FFF;
        cursor: pointer;
      }
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
    .el-dialog__footer {
      margin-top: 20px;
      text-align: center;
    }
    .p {
      height: 42px;
      line-height: 42px;
      margin-top: 20px;
      margin-bottom: 10px;
      // overflow-y: auto;
      span:first-child {
        display: inline-block;
        float: left;
      }
    }
    .choose-people {
      display: inline-block;
      width: 760px;
      height: 36px;
      border: 1px solid #ccc;
      cursor: pointer;
      line-height: 36px;
      overflow: auto;
      span {
        display: inline-block;
        height: 30px;
        padding: 0px 10px;
        border: 1px solid #ccc;
        margin-left: 6px;
        margin-top: 2px;
        line-height: 30px;
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
  .close {
    position: absolute;
    right: 20px;
    top: 24px;
    cursor: pointer;
  }

  .ident {
    margin-right: 20px;
    padding: 5px 7px;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      color: #1F9FFF;
    }

    &.active {
      background: $blue;
      color: #fff;
    }
  }
}
</style>
