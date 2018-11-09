<template>
  <div id="created-genre">
    <div class="establish">
      <!--公开问卷-->
      <div class="common" v-if="state == 1">
        <p class="create-title">创建公开问卷</p>
        <div>
          <p>
            <label>问卷类型 :</label>
            <el-select v-model="naireType" placeholder="请选择" class="input">
              <el-option
                v-for="(item, i) in options"
                :key="item.id"
                :label="item.name"
                :value="i">
              </el-option>
            </el-select>
          </p>
          <p>
            <label>回收数量 :</label>
            <el-input type="number" v-model="recyleNum" :min="0" :step="10" class="input"></el-input>
          </p>
          <p>
            <label>截止时间 :</label>
            <el-date-picker
              v-model="endDate"
              type="datetime"
              :editable="false"
              :picker-options="pickerOptions"
              placeholder="选择日期时间" class="input">
            </el-date-picker>
          </p>
          <div class="btn">
            <el-button type="success" @click="route('/created/details', 1)" class="green">下一步</el-button>
            <el-button @click="route('/created/default')">返回</el-button>
          </div>
        </div>
      </div>
      <!--外部问卷-->
      <div class="common" v-if="state == 3">
        <p class="create-title">创建外部问卷</p>
        <div>
          <p>
            <label>问卷类型 :</label>
            <el-select v-model="naireType" placeholder="请选择" class="input">
              <el-option
                v-for="(item, i) in options"
                :key="item.id"
                :label="item.name"
                :value="i">
              </el-option>
            </el-select>
          </p>
          <p>
            <label>查看结果 :</label>
            <el-switch
              v-model="lookResult"
              on-color="#19b955"
              on-text="是"
              off-text="否"
              off-color="#ff4949">
            </el-switch>
          </p>
          <p>
            <label>参与方式 :</label>
            <el-radio class="radio" v-model="partType" label="1">实名</el-radio>
            <el-radio class="radio" v-model="partType" label="2">匿名</el-radio>
          </p>
          <p>
            <label>截止时间 :</label>
            <el-date-picker
              v-model="endDate"
              type="datetime"
              :editable="false"
              :picker-options="pickerOptions"
              placeholder="选择日期时间" class="input">
            </el-date-picker>
          </p>
          <p style="position:relative;">
            <label>参与用户 :</label>
            <el-radio class="radio" v-model="people" label="1" @mouseup.native="radioClick">外部单位</el-radio>
            <el-radio class="radio" v-model="people" label="2" @mouseup.native="radioClick">指定用户</el-radio><br>
            <span>
              <i :class="{'triangle-up': true, active: people == 2}"><span></span><span></span></i>
              <transition-group class="box" type="text" tag="span" name="fade" @click.native="radioClick">
                <span v-for="(item, i) in companylist" :key="i">{{item.name}}<span style="margin-left:10px;color:#19b955;" @click.stop="deleteList(item, i)">x</span></span>
              </transition-group>
            </span>
          </p>
          <p v-show="people == 1">
            <label>说明 :</label>
            <el-input type="text" class="sample" v-model="describe" placeholder="请填写说明"></el-input>
          </p>
          <div class="btn">
            <el-button type="success" class="green save" @click="route('/created/details', 3)">下一步</el-button>
            <el-button  @click="route('/created/default')">返回</el-button>
          </div>
        </div>
      </div>
      <!--内部问卷-->
      <div class="common"  v-if="state == 2">
        <p class="create-title">创建内部问卷</p>
        <div>
          <p>
            <label>问卷类型 :</label>
            <el-select v-model="naireType" placeholder="请选择" class="input" @change="typeChange">
              <el-option
                v-for="(item, i) in options"
                :key="item.id"
                :label="item.name"
                :value="i">
              </el-option>
            </el-select>
          </p>
          <p v-if="typeList.length != 0">
            <label style="color: transparent;">查看结果 :</label>
            <span v-for="(item, i) in typeList"
                  :key="i"
                  :class="{ident: true, active: i == types}"
                  @click="typeSwitch(item, i)">
              <span v-if="item == 1">
                <span v-show="user.companyType == 2">员工</span>
                <span v-show="user.companyType == 1">教师</span>
              </span>
              <span v-if="item == 2">学生</span>
              <span v-if="item == 3">家长</span>
              <span v-if="item == 4">外部单位</span>
            </span>
          </p>
          <p>
            <label>查看结果 :</label>
            <el-switch
              v-model="lookResult"
              on-color="#19b955"
              on-text="是"
              off-text="否"
              off-color="#ff4949">
            </el-switch>
          </p>
          <p>
            <label>参与方式 :</label>
            <el-radio class="radio" v-model="partType" label="1">实名</el-radio>
            <el-radio class="radio" v-model="partType" label="2">匿名</el-radio>
          </p>
          <p>
            <label>截止时间 :</label>
            <el-date-picker
              v-model="endDate"
              type="datetime"
              :editable="false"
              :picker-options="pickerOptions"
              placeholder="选择日期时间" class="input">
            </el-date-picker>
          </p>
          <p style="position:relative;" class="join-user">
            <label >参与用户 :</label>
              <transition-group class="box" type="text" tag="span" name="fade" @click.native="radioClick">
                <span v-for="(item, i) in companylist" :key="i">{{item.name}}<span style="margin-left:10px;color:#19b955;" @click.stop="deleteList(item, i)">x</span></span>
              </transition-group>
          </p>
          <div class="btn">
            <el-button type="success" class="green save" @click="route('/created/details', 2)">下一步</el-button>
            <el-button @click="route('/created/default')">返回</el-button>
          </div>
        </div>
      </div>
    </div>
     <!--选择用户弹出框-->
    <el-dialog :title="diaTitle" v-model="courseRenameSure" class="education-teacher-setting" :show-close="false">
      <div class="education-course-add-content-left">
        <el-input v-model="searchTeach" :placeholder="state == 3 ? '输入学校名称' : '输入关键词'"></el-input>
        <section class="education-course-add-tree">
          <el-tree
            v-if="(Number(this.state) === 3 && Number(this.people) === 2)"
            class="filter-tree"
            show-checkbox
            :props="defaultProps"
            :filter-node-method="filterNode"
            node-key="id"
            @check-change="deptListClick"
            :load="loadClick"
            lazy
            :default-checked-keys="defaultList"
            ref="tree">
          </el-tree>
          <el-tree
            v-else
            class="filter-tree"
            :data="deptList"
            show-checkbox
            :props="defaultProps"
            :filter-node-method="filterNode"
            node-key="id"
            @check-change="deptListClick"
            @node-click="nodeClick"
            @node-expand="nodeClick"
            :default-checked-keys="defaultList"
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
import { notice, error } from '../../../api/index.js'
import { dateFormat } from '../../../filters/index.js'
// import querystring from 'querystring'
import { mapGetters } from 'vuex'
export default {
  name: 'created-genre',
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      state: 0,
      types: 0,
      idents: 1,
      options: [],
      naireType: '',
      lookResult: true,
      radio: 1,
      partType: '1',
      recyleNum: 0,
      people: '1',
      endDate: '',
      courseRenameSure: false,
      deptUserList: [],
      searchTeach: '',
      deptList: [],
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      checkedCount: 0,
      companylist: [],
      i: 1,
      asideList: [],
      filterList: [],
      describe: '',
      typeList: [],
      defaultList: [],
      diaTitle: '指定用户'
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    this.state = this.$route.query.state
    this.getTypeList()
  },
  methods: {
    recylNum () {
      if (this.recyleNum < 1) {
        notice(this, '回收数量不小于等于0', 2000)
      }
      if (this.recyleNum > 99999) {
        notice(this, '回收数量不大于99999', 2000)
        return
      }
    },
    typeSwitch (item, i) {
      this.types = i
      this.companylist = []
      this.empty()
      this.idents = Number(item)
    },
    typeChange (i) {
      this.typeList = this.options[i].userType.split(',')
      this.idents = Number(this.typeList[0])
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    deleteList (item, i) {
      this.companylist.splice(i, 1)
    },
    route (r, t) {
      if (!t) {
        this.$router.push(r)
        return
      }
      sessionStorage.naireId = ''
      if (!this.naireType && this.naireType !== 0) {
        notice(this, '请选择问卷类型', 2000)
        return
      }
      if (t === 1 && this.recyleNum < 1) {
        notice(this, '回收数量不小于等于0', 2000)
        return
      }
      if (t === 1 && this.recyleNum > 99999) {
        notice(this, '回收数量不大于99999', 2000)
        return
      }
      if (t && !this.endDate) {
        notice(this, '请选择截止时间', 2000)
        return
      }
      let a = Date.parse(new Date())
      let b = Date.parse(this.endDate)
      if (a > b) {
        notice(this, '截止时间不小于当前时间', 2000)
        return
      }
      if (t === 3 || t === 2) {
        if (this.companylist.length === 0) {
          notice(this, '请选择参与用户', 2000)
          return
        }
      }
      let s = dateFormat(this.endDate, 'yyyy-MM-dd hh:mm:ss')
      let users, companys, joinUser
      if (Number(this.state) === 2) {
        users = JSON.stringify(this.companylist.map(item => ({userId: item.userId || item.code, userType: this.idents, userName: item.name})))
      } else if (Number(this.state) === 3 && Number(this.people) === 1) {
        users = ''
        joinUser = 1
        companys = JSON.stringify(this.companylist.map(item => ({companyId: item.code || item.companyId, companyName: item.name})))
      } else if (Number(this.state) === 3 && Number(this.people) === 2) {
        joinUser = 2
        users = JSON.stringify(this.companylist.map(item => ({userId: item.userId || item.code || item.id, userType: 1, userName: item.name, companyId: item.companyId})))
        companys = JSON.stringify(this.companylist.map(item => ({companyId: item.companyId, companyName: item.companyName})))
        // companys = JSON.stringify(this.companylist.map(item => ({companyId: item.code, companyName: item.name})))
      }
      if (t) {
        let naireJson = [
          {
            type: t,
            categoryId: this.options[this.naireType].id,
            returnCount: this.recyleNum,
            showResult: this.lookResult ? 1 : 2,
            joinWay: this.partType,
            endTime: s,
            describe: this.describe,
            users,
            joinUser,
            companys,
            checkState: this.options[this.naireType].checkState
          }
        ]
        naireJson = JSON.stringify(naireJson)
        sessionStorage.naireJson = naireJson
        this.endDate = Date.parse(this.endDate)
        this.$router.push({path: r, query: {state: this.state, endTime: this.endDate}})
      } else {
        this.$router.push(r)
      }
    },
    resetTree (arr) {
      return arr.map(item => {
        if (item.childDeptList && item.childDeptList.length) {
          return {
            ...item,
            userList: this.resetTree(item.childDeptList.concat(item.userList || []))
          }
        } else return { ...item }
      })
    },
    radioClick () {
      if (!this.naireType && this.naireType !== 0) {
        notice(this, '请选择问卷类型', 2000)
        return
      }
      this.courseRenameSure = true
      this.searchTeach = ''
      this.deptUserList = this.copy(this.companylist)
      this.defaultList = this.deptUserList.map(item => item.id)
      this.checkedCount = this.deptUserList.length
      if (Number(this.state) === 2) {
        if (Number(this.idents) === 1) {
          this.$https.get(`/common/companyUserList?companyId=${this.user.companyId}`)
          .then(res => {
            if (res.data.code === 1) {
              let result = this.resetTree((res.data.result[0].deptList || []).map(item => ({...item, id: `d${item.id}`}))).concat(res.data.result[0].userList || [])
              this.deptList = result.map(item => ({...item, checked: false, userType: Number(this.idents), code: item.id}))
              this.filterList = [...this.deptList]
              this.filterRight()
            } else {
              notice(this, res.data.message, 2000)
            }
          })
          .catch(res => console.log(res))
        } else if (Number(this.idents) === 2) {
          this.$https.get(`/common/studentTree?companyId=${this.user.companyId}`)
          .then(res => {
            if (res.data.code === 1) {
              // console.log(res.data.result.students)
              this.deptList = res.data.result.map(item => ({...item, checked: false, name: item.clazzName, children: [], code: item.id, userType: Number(this.idents), label: item.clazzName, userList: (item.userList || []).map(items => ({...items, userId: items.id}))}))
              this.filterList = this.copy(this.deptList)
              this.filterRight()
              // console.log(res.data.result)
            } else {
              notice(this, res.data.message, 2000)
            }
          })
          .catch(res => console.log(res))
        } else if (Number(this.idents) === 3) {
          this.$https.get(`common/studentTree?companyId=${this.user.companyId}`)
          .then(res => {
            if (res.data.code === 1) {
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
      } else if (Number(this.state) === 3) {
        this.$https.get(`/common/childCompanyList`)
        .then(res => {
          if (res.data.code === 1) {
            this.diaTitle = this.people === '1' ? '指定单位' : '指定用户'
            let result = [
              {
                name: '外部单位',
                id: '',
                userList: this.people === '1' ? (res.data.result || []).map(item => ({...item, checked: false, code: item.id, name: item.fullName, parent: true, userId: item.userId, companyId: item.id}))
                                              : (res.data.result || []).map(item => ({...item, checked: false, code: item.id, name: item.fullName, parent: true, userList: [{name: '请稍后...', parents: 1}]}))
              }
            ]
            this.deptList = result
            this.filterList = this.copy(this.deptList)
            this.filterRight()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
        .catch(res => console.log(res))
      }
    },
    empty () {
      this.deptUserList = []
      this.checkedCount = 0
      if (this.$refs.tree) this.$refs.tree.setCheckedKeys(this.deptUserList)
      this.filterRight()
    },
    // 获取问卷类型
    getTypeList () {
      this.$https.get(`/common/naireCategoryList?openType=${this.state}`)
      .then(res => {
        if (res.data.code === 1) {
          this.options = res.data.result
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => console.log(res))
    },
    // 获取部门列表信息接口
    getDeplist () {
    },
    // 根据部门获取里面的人员
    getDeptUserList (id, index, keyword = '') {
      this.$https.get(`/common/deptUserList?deptId=${id}&keyword=${keyword}`)
      .then(res => {
        // console.log(res)
        let deptUserList = res.data.result
        this.deptList[index].children = deptUserList
      })
    },
    nodeClick (data) {
      if (!(data.userList && data.userList[0] && data.userList[0].parents === 1)) return
      this.$https.get(`/common/companyUserList?companyId=${data.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let result = (res.data.result[0].deptList || []).concat(res.data.result[0].userList || [])
          data.userList = result.map(item => ({...item, companyId: data.id, companyName: data.name, userId: item.userId || item.id}))
          this.$set(data, 'userList', result.map(item => ({...item, companyId: data.id, companyName: data.name, userId: item.userId || item.id})))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    loadClick (node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: '外部单位' }])
      } else if (node.level === 1) {
        return resolve(this.deptList[0].userList)
      } else if (node.level > 2) {
        // console.log(node.data)
        resolve(node.data.userList || [])
      } else {
        this.$https.get(`/common/companyUserList?companyId=${node.data.id}`)
        .then(res => {
          if (res.data.code === 1) {
            let result = (res.data.result[0].deptList || []).concat(res.data.result[0].userList || [])
            resolve(result.map(item => ({...item, companyId: node.data.id, companyName: node.data.name, userId: item.userId || item.id})))
          } else {
            notice(this, res.data.message, 2000)
            resolve([])
          }
        })
      }
    },
    // 添加权限管理员
    deptListClick (data, val) {
      if (data.parents === 1) return
      if (data[0] && data[0].parents === 1) {
        return
      }
      // if (data.userId) {
      if (Number(this.state) === 3 && Number(this.people) === 1) this.deptUserList = this.$refs.tree.getCheckedNodes(true)
      else if (Number(this.state) === 2 && (Number(this.typeList[this.types]) === 2 || Number(this.typeList[this.types]) === 3)) this.deptUserList = this.$refs.tree.getCheckedNodes(true).filter(item => !item.clazzName)
      else this.deptUserList = this.$refs.tree.getCheckedNodes(true).filter(item => item.userId && item.username)
      this.checkedCount = this.deptUserList.length
      // }
    },
    filterRight () {
      if (Number(this.state) === 2 || (Number(this.state) === 3 && Number(this.people) === 1)) {
        this.deptList.forEach(item => {
          item.checked = false
        })
        this.deptUserList.forEach((item, index) => {
          this.deptList.forEach((items, i) => {
            if (item.name === items.name) {
              // items.checked = true
              this.$set(items, 'checked', true)
              // items.checked = true
            }
          })
        })
        // console.log(this.deptList)
      }
    },
    deptListDelete (i) {
      this.deptUserList.splice(i, 1)
      this.checkedCount--
      this.$refs.tree.setCheckedKeys(this.deptUserList.map(item => item.id))
      this.filterRight()
    },
    // 保存权限管理员信息
    rightSave () {
      this.courseRenameSure = false
      this.searchTeach = ''
      this.companylist = this.copy(this.deptUserList)
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
    }
  },
  watch: {
    searchTeach (val) {
      // if (Number(this.state) === 3 && Number(this.people) === 2) this.deptList = ([...this.filterList][0].userList || []).filter(item => item.name.indexOf(val) > -1)
      // else this.$refs.tree.filter(val)
      this.$refs.tree.filter(val)
    },
    people () {
      this.companylist = []
      this.deptUserList = []
      this.checkedCount = 0
    }
  }
}
</script>

<style lang="scss">
  #created-genre {
    * {
      user-select:none;
    }
      
    .join-user {
      min-height: 40px;
      label {
        float: left;
        line-height: 40px;
      }
      .box {
        float: left;
        margin: 0;
        cursor: pointer;
        overflow: auto;
        min-height: 40px;
      }
    }
    .box {
      overflow: auto;
    }
    .dialog-ul {
      padding: 6px;
      li {
        line-height: 32px;
      }
    }
  }
</style>
