<template>
  <div id="particulars" >
    <answers :details="detailsInfo">
      <el-button @click="route" slot="button">返回</el-button>
    </answers>
    <div class="sample">
      <p v-if="naireType == 3 && people == 1">说明：<span>{{ remark }}</span></p>
      <p v-if="naireType == 1">样本数量：<span>{{ returnCount }}件</span></p>
    </div>
    <div class="sample" v-if="naireType != 1">
      参与用户：
      <span v-for="(item, index) in acceptList" :key="index">{{ item.name }}</span>
    </div>
    <div class="mod">
      <el-button type="success" @click.native="changePeople" v-if="naireType != 1">修改参与用户</el-button>
    </div>
    <div class="buttons">
      <el-button type="success" @click="pass">通过</el-button>
      
      <el-button @click="reject = true" type="danger">驳回</el-button> 
    </div>
    
    <el-dialog title="指定用户" v-model="courseRenameSure" class="education-teacher-setting" :show-close="false">
      <div class="education-course-add-content-left">
        <el-input v-model="searchTeach" :placeholder="naireType == 3 ? '输入学校名称' : '输入关键词'"></el-input>
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
    
    <!--弹框提醒-->
    <el-dialog
      title="提示"
      class="dialog-remind"
      top="15%"
      size="tiny"
      :visible.sync="remind">
      <p>是否通过审核 ?</p >
      <div class="button-group">
        <el-button @click="remind = false" style="padding: 8px 22px">否</el-button>
        <el-button @click="naireCommit" type="success" style="padding: 8px 22px">是</el-button>
      </div>
    </el-dialog>
        <!--弹框提醒-->
    <el-dialog
      title="请输入驳回原因"
      class="dialog-remind"
      top="15%"
      size="tiny"
      :visible.sync="reject">
      <el-input
        type="textarea"
        :rows="3"
        :maxlength="500"
        v-model="rejectValue">
      </el-input>
      <div class="button-group">
        <el-button @click="reject = false" style="padding: 8px 22px">否</el-button>
        <el-button @click="rejectSure" type="success" style="padding: 8px 22px">是</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import answers from '../../components/details'
import { notice, success, error } from '../../api/index.js'
import { mapGetters } from 'vuex'
import querystring from 'querystring'
export default {
  name: 'particulars',
  data () {
    return {
      acceptList: [],
      naireId: '',
      courseRenameSure: false,
      searchTeach: '',
      deptList: [],
      deptUserList: [],
      asideList: [],
      checkedCount: 0,
      idents: 1,
      filterList: [],
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      detailsInfo: {},
      remark: '',
      naireType: '',
      returnCount: '',
      remind: false,
      reject: false,
      rejectValue: '',
      defaultList: [],
      typeList: [],
      people: 1 // 外部单位1  指定用户2
    }
  },
  components: {
    answers
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    rejectSure () {
      if (!this.rejectValue || this.rejectValue.trim() === '') {
        notice(this, '请填写驳回原因', 2000)
        return
      }
      this.$https.post('/check/naireReject', querystring.stringify({
        naireId: this.naireId,
        rejectReason: this.rejectValue
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.route()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    deptListDelete (i) {
      this.deptUserList.splice(i, 1)
      this.$refs.tree.setCheckedKeys(this.deptUserList.map(item => item.code))
      this.filterRight()
    },
    // 添加权限管理员
    deptListClick (data, val) {
      if (data.parents === 1) return
      if (data[0] && data[0].parents === 1) {
        return
      }
      // if (data.userId) {
      if (this.naireType === 3 && Number(this.people) === 1) this.deptUserList = this.$refs.tree.getCheckedNodes(true)
      else if (Number(this.naireType) === 2 && (Number(this.idents) === 2 || Number(this.idents) === 3)) this.deptUserList = this.$refs.tree.getCheckedNodes(true).filter(item => !item.clazzName)
      else this.deptUserList = this.$refs.tree.getCheckedNodes(true).filter(item => item.userId && item.username)
      this.checkedCount = this.deptUserList.length
      // }
    },
    cancle () {
      this.searchTeach = ''
      this.courseRenameSure = !this.courseRenameSure
    },
    // 保存权限管理员信息
    rightSave () {
      if (!(this.deptUserList && this.deptUserList.length > 0)) {
        notice(this, '请选择参与用户', 2000)
        return
      }
      let companyJson = []
      let json = []
      if (this.naireType === 3 && Number(this.people) === 1) {
        companyJson = this.deptUserList.map(item => ({companyId: item.code || item.id, companyName: item.name}))
      } else if (this.naireType === 3 && Number(this.people) === 2) {
        json = this.deptUserList.map(item => ({userId: item.userId || item.code || item.id, userName: item.name, userType: 1, companyId: item.companyId}))
      } else {
        json = this.deptUserList.map(item => ({userId: item.userId || item.code || item.id, userName: item.name, userType: 3}))
      }
      this.$https.post('/check/naireReceiveUpdate', querystring.stringify({
        naireId: this.naireId,
        json: JSON.stringify(json),
        companyJson: JSON.stringify(companyJson)
      }))
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.courseRenameSure = false
          this.searchTeach = ''
          this.acceptList = this.copy(this.deptUserList)
        }
      })
    },
    // 清空
    empty () {
      this.deptUserList = []
      this.checkedCount = 0
      this.$refs.tree.setCheckedKeys(this.deptUserList)
      this.filterRight()
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
    },
    // 获取问卷详情
    naireDetail () {
      this.$https.get(`/check/naireDetail?naireId=${this.naireId}`)
      .then(res => {
        if (res.data.code === -2) {
          error(this)
          return
        }
        this.detailsInfo = res.data.result.naire
        this.detailsInfo.print = 1
        this.detailsInfo.qNum = this.detailsInfo.questions.filter(item => item.questionType !== 4).length
        this.detailsInfo.questions = this.detailsInfo.questions.map(item => ({...item, checked: ''}))
        this.detailsInfo.questions.forEach(item => {
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
        this.remark = this.detailsInfo.remark
        this.returnCount = this.detailsInfo.returnCount
        this.naireType = Number(this.detailsInfo.type)
        this.people = Number(this.detailsInfo.joinUser)
        this.idents = (res.data.result.accepters && res.data.result.accepters.length > 0) ? res.data.result.accepters[0].userType : ''
        // this.naireType = 3
        // this.people = 1
        this.changePeople()
        this.courseRenameSure = false
        let i = 1
        this.detailsInfo.questions.forEach(item => {
          if (item.questionType !== 4) {
            item.sorts = i++
          }
        })
        if (Number(this.naireType) === 3 && Number(this.people) === 1) {
          this.deptUserList = res.data.result.acceptersCompany.map(item => ({name: item.companyName, code: item.companyId}))
          this.acceptList = this.copy(this.deptUserList)
        } else if (this.naireType === 3 && Number(this.people) === 2) {
          if (res.data.result.accepters) {
            this.acceptList = res.data.result.accepters.map(item => ({name: item.userName, code: item.userId, companyId: item.companyId}))
          } else {
            this.acceptList = []
          }
        } else {
          if (res.data.result.accepters) {
            this.acceptList = res.data.result.accepters.map(item => ({name: item.userName, code: item.userId}))
          } else {
            this.acceptList = []
          }
          // this.acceptList = res.data.result.accepters.map(item => ({name: item.userName, code: item.userId}))
          // json = this.deptUserList.map(item => ({userId: item.code, userName: item.name, userType: 1}))
        }
      })
    },
    // 通过按钮
    pass () {
      this.remind = true
    },
    // 问卷审核提交
    naireCommit () {
      this.$https.get(`/check/naireCommit?naireId=${this.naireId}`)
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.$router.push('/audit')
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    route () {
      this.$router.push({path: '/audit', query: {page: this.$route.query.page, genreInd: this.$route.query.genreInd, val: this.$route.query.val}})
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
    nodeClick (data) {
      if (!(data.userList && data.userList[0] && data.userList[0].parents === 1)) return
      this.$https.get(`/common/companyUserList?companyId=${data.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let result = this.resetTree((res.data.result[0].deptList || []).map(item => ({...item, id: `d${item.id}`}))).concat(res.data.result[0].userList || [])
          data.userList = result.map(item => ({...item, companyId: data.id, companyName: data.name, userId: item.userId || item.id}))
          this.$set(data, 'userList', result.map(item => ({...item, companyId: data.id, companyName: data.name, userId: item.userId || item.id})))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 修改接收人
    changePeople () {
      this.courseRenameSure = true
      this.searchTeach = ''
      this.deptUserList = this.copy(this.acceptList).map(item => ({...item, userId: item.userId || item.code}))
      this.asideList = this.deptUserList.map(item => item.code)
      if (this.naireType === 3) {
        this.$https.get(`/common/childCompanyList?type=${Number(this.people) === 1 ? 1 : ''}`)
        .then(res => {
          if (res.data.code === 1) {
            let result = [
              {
                name: '外部单位',
                id: '',
                userList: Number(this.people) === 1 ? (res.data.result || []).map(item => ({...item, checked: false, code: item.id, name: item.fullName, parent: true, userId: item.userId || item.id, companyId: item.id}))
                                              : (res.data.result || []).map(item => ({...item, checked: false, code: item.id, name: item.fullName, parent: true, userList: [{name: '请稍后...', parents: 1}]}))
              }
            ]
            this.deptList = result
            // this.deptList = res.data.result.map(item => ({...item, checked: false, code: item.id, name: item.fullName, parent: true, children: [{name: '请稍后...', load: true}]}))
            this.filterList = [...this.deptList]
            this.filterRight()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
        .catch(res => console.log(res))
      } else {
        if (this.idents === 1) {
          this.$https.get(`/common/companyUserList?companyId=${this.user.companyId}`)
          .then(res => {
            if (res.data.code === 1) {
              // this.deptList = res.data.result.map(item => ({...item, checked: false, children: []}))
              let result = this.resetTree((res.data.result[0].deptList || []).map(item => ({...item, id: `d${item.id}`}))).concat(res.data.result[0].userList || [])
              this.deptList = result.map(item => ({...item, checked: false, userType: Number(this.idents), code: item.id}))
              this.filterList = this.copy(this.deptList)
              this.filterRight()
              // console.log(res.data.result)
            } else {
              notice(this, res.data.message, 2000)
            }
          })
          .catch(res => console.log(res))
        } else if (this.idents === 2) {
          this.$https.get(`/common/studentTree?companyId=${this.user.companyId}`)
          .then(res => {
            if (res.data.code === 1) {
              // console.log(res.data.result.students)
              this.deptList = res.data.result.map(item => ({...item, checked: false, name: item.clazzName, children: [], code: item.id, userType: Number(this.idents), label: item.clazzName, userList: (item.userList || []).map(items => ({...items, userId: items.id}))}))
              // this.deptList = res.data.result.students.map(item => ({...item, checked: false, name: item.studentName, children: [], code: item.id}))
              this.filterList = this.copy(this.deptList)
              this.filterRight()
              // console.log(res.data.result)
            } else {
              notice(this, res.data.message, 2000)
            }
          })
          .catch(res => console.log(res))
        } else if (this.idents === 3) {
          this.$https.get(`common/studentTree?companyId=${this.user.companyId}`)
          .then(res => {
            if (res.data.code === 1) {
              // this.deptList = res.data.result.students.map(item => ({...item, checked: false, name: item.studentName + '的家长', children: [], code: item.id}))
              // this.filterList = this.copy(this.deptList)
              this.deptList = res.data.result.map(item => ({...item, checked: false, name: item.clazzName, children: [], code: item.id, userType: Number(this.idents), label: item.clazzName, userList: (item.userList || []).map(items => ({...items, userId: items.id, name: items.name + '的家长', label: items.name + '的家长'}))}))
              this.filterList = this.copy(this.deptList)
              this.filterRight()
              // console.log(res.data.result)
            } else {
              notice(this, res.data.message, 2000)
            }
          })
          .catch(res => console.log(res))
        }
      }
    },
    filterRight () {
      this.checkedCount = this.deptUserList.length
    }
  },
  created () {
    this.naireId = this.$route.query.naireId
    this.naireDetail()
  },
  watch: {
    searchTeach (val) {
      if (Number(this.naireType) === 3 && Number(this.people) === 2) this.deptList = ([...this.filterList][0].userList || []).filter(item => item.name.indexOf(val) > -1)
      else this.$refs.tree.filter(val)
    }
  }
}
</script>
<style lang="scss">
  @import '../../assets/scss/main.scss';
  #particulars {
    background: $white;
    position: relative;
    padding: 15px;
    .sample {
      padding: 14px;
      line-height: 28px;
      background: $background;
      margin-bottom: 20px;
      color: #666;
      span {
        margin: 0 14px;
      }
    }
    .mod {
      text-align: right;
    }
    .buttons {
      text-align: center;
      margin-top: 20px;
    }
    .dialog-ul {
      padding: 6px;
      li {
        line-height: 32px;
      }
    }
    textarea {
      resize: none;
    }
  }
</style>
