<template>
  <div id="naire-type">
    <div class="establish">
      <!--公开问卷-->
      <div class="common" v-if="state == 1">
        <p class="create-title">编辑公开问卷</p>
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
            <el-input type="number" v-model="recyleNum" :min="0" :step="10" class="input" @blur="recylNum"></el-input>
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
            <el-button type="success" @click="route('/created/details', 1)" class="green">保存</el-button>
            <el-button @click="route('/manage')">返回</el-button>
          </div>
        </div>
      </div>
      <!--外部问卷-->
      <div class="common" v-if="state == 3">
        <p class="create-title">编辑外部问卷</p>
        <div>
          <p>
            <label>问卷类型 :</label>
            <el-select v-model="naireType" placeholder="请选择" class="input">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
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
            <el-radio class="radio" v-model="people" label="1" @change.native="radioClick">外部单位</el-radio>
            <el-radio class="radio" v-model="people" label="2" @change.native="radioClick">指定用户</el-radio><br>
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
            <el-button type="success" class="green save" @click="route('/created/details', 3)">保存</el-button>
            <el-button  @click="route('/manage')">返回</el-button>
          </div>
        </div>
      </div>
      <!--内部问卷-->
      <div class="common"  v-if="state == 2">
        <p class="create-title">编辑内部问卷</p>
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
              <span v-if="item == 1">教师</span>
              <span v-if="item == 2">学生</span>
              <span v-if="item == 3">家长</span>
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
            <!--<el-radio class="radio" v-model="people" label="1" @mouseup.native="radioClick">外部单位</el-radio>
            <el-radio class="radio" v-model="people" label="2" @mouseup.native="radioClick">指定用户</el-radio><br>-->
            <!--<span>
              <i :class="{'triangle-up': true, active: people == 2}">
                <span></span>
                <span></span>
              </i>-->
              <transition-group class="box" type="text" tag="span" name="fade" @click.native="radioClick">
                <span v-for="(item, i) in companylist" :key="i">{{item.name}}<span style="margin-left:10px;color:#19b955;" @click.stop="deleteList(item, i)">x</span></span>
              </transition-group>
            <!-- </span> -->
          </p>
          <div class="btn">
            <el-button type="success" class="green save" @click="route('/created/details', 2)">保存</el-button>
            <el-button @click="route('/manage')">返回</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--选择用户弹出框-->
    <el-dialog title="指定用户" v-model="courseRenameSure" class="education-teacher-setting" :show-close="false">
      <div class="education-course-add-content-left">
        <el-input v-model="searchTeach" :placeholder="state == 3 ? '输入学校名称' : '输入关键词'"></el-input>
        <section class="education-course-add-tree">
          <!-- <el-tree
            v-if="state == 3 && people == 2"
            class="filter-tree"
            :data="deptList"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="deptListClick"
            ref="tree">
          </el-tree>
          <ul class="dialog-ul" v-else>
            <li v-for="(item, index) of deptList" :key="index">
              <el-checkbox v-model="item.checked" @change="deptListClick(item)">{{item.name}}</el-checkbox>
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
// import { dateFormat } from '../../filters/index.js'
import querystring from 'querystring'
import { mapGetters } from 'vuex'
export default {
  name: 'naireType',
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
      naireId: '',
      count: 0,
      common: '1',
      typeList: [],
      defaultList: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    this.naireId = this.$route.query.naireId
    this.getDetails()
  },
  methods: {
    recylNum () {
      if (this.recyleNum < 1) {
        notice(this, '回收数量不小于等于0', 2000)
      }
      if (this.recyleNum > 99999) {
        notice(this, '回收数量不大于99999', 2000)
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    typeSwitch (item, i) {
      this.types = i
      this.companylist = []
      this.empty()
      this.idents = Number(item)
    },
    typeChange (i) {
      // console.log(this.options[i].userType.split(','))
      this.typeList = this.options[i].userType.split(',')
      this.idents = Number(this.typeList[0])
    },
    deleteList (item, i) {
      this.companylist.splice(i, 1)
    },
    route (r, t) {
      // if (t === 1 || t === 2) {
      //   if (!this.naireType) {
      //     notice(this, '请选择问卷类型', 2000)
      //     return
      //   }
      // }
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
      if (!this.endDate) {
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
      if (typeof this.endDate !== 'number') {
        this.endDate = Date.parse(this.endDate)
      }
      let companys, users
      if (this.state === 3 && this.people === '1') {
        companys = JSON.stringify(this.companylist.map(item => ({companyId: item.code, companyName: item.name})))
      } else if (this.state === 3 && this.people === '2') {
        users = JSON.stringify(this.companylist.map(item => ({userId: item.userId || item.code, userName: item.name, userType: 1, companyId: item.companyId})))
      } else {
        users = JSON.stringify(this.companylist.map(item => ({userId: item.userId || item.code, userName: item.name, userType: 1})))
      }
      // let s = dateFormat(this.endDate, 'yyyy-MM-dd hh:mm:ss')
      if (t) {
        this.$https.post('/manage/naireUpdate', querystring.stringify({
          id: this.naireId,
          type: this.state,
          categoryId: this.options[this.naireType].id,
          endDate: this.endDate,
          returnCount: this.recyleNum,
          showResult: this.lookResult ? 1 : 2,
          joinWay: this.partType !== 'null' ? this.partType : '1',
          questions: '',
          users,
          companys
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, res.data.message, 2000)
            // this.endDate = Date.parse(this.endDate)
            this.$router.push({path: '/naireDetail', query: {naireId: this.naireId, state: this.state, endTime: this.endDate, mod: 1}})
            // this.$router.push(r)
          } else {
            notice(this, res.data.message, 2000)
          }
        })
        .catch(res => console.log(res))
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
      this.checkedCount = this.deptUserList.length
      this.asideList = this.deptUserList.map(item => item.name)
      this.defaultList = this.deptUserList.map(item => item.id)
      if (Number(this.state) === 2) {
        if (Number(this.idents) === 1) {
          this.$https.get(`/common/companyUserList?companyId=${this.user.companyId}`)
          .then(res => {
            if (res.data.code === 1) {
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
        this.$https.get(`/common/childCompanyList?type=${this.people === '1' ? 1 : ''}`)
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
      this.$refs.tree.setCheckedKeys(this.deptUserList)
      this.filterRight()
    },
    // 获取问卷类型
    async getTypeList () {
      await this.$https.get(`/common/naireCategoryList?openType=${this.state}`)
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
          // let result = (res.data.result[0].deptList || []).concat(res.data.result[0].userList || [])
          let result = this.resetTree((res.data.result[0].deptList || []).map(item => ({...item, id: `d${item.id}`}))).concat(res.data.result[0].userList || [])
          data.userList = result.map(item => ({...item, companyId: data.id, companyName: data.name, userId: item.userId || item.id}))
          this.$set(data, 'userList', result.map(item => ({...item, companyId: data.id, companyName: data.name, userId: item.userId || item.id})))
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
        this.checkedCount = this.deptUserList.length
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
      this.count++
      return arrs
    },
    // 获取问卷详情
    getDetails () {
      this.$https.get(`/manage/naireDetail?naireId=${this.naireId}`)
      .then(async res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
          let obj = res.data.result.naireDto
          this.state = obj.type
          this.describe = obj.remark
          await this.getTypeList()
          // console.log(this.options)
          this.options.forEach((item, i) => {
            // console.log(item)
            if (obj.type === 1) {
              if (item.id === obj.categoryId) {
                this.naireType = i
                // this.naireType = item.id
              }
            } else {
              if (item.id === obj.categoryId) {
                this.naireType = i
              }
            }
          })
          // this.naireType = obj.categoryId
          this.recyleNum = obj.returnCount ? obj.returnCount : 0
          this.endDate = obj.endTime
          if (obj.showResult === 1) {
            this.lookResult = true
          } else {
            this.lookResult = false
          }
          this.partType = String(obj.joinWay)
          this.asideList.push(obj.createdUserName)
          if (res.data.result.accepters) {
            this.deptUserList = res.data.result.accepters.map(item => ({name: item.userName, code: item.userId}))
          }
          this.people = String(obj.joinUser)
          if (this.state === 3 && this.people === '1') {
            this.deptUserList = res.data.result.acceptersCompany.map(item => ({name: item.companyName, code: item.companyId, id: item.companyId}))
          } else if (this.state === 3 && this.people === '2') {
            this.deptUserList = res.data.result.accepters.map(item => ({name: item.userName, code: item.userId, id: item.userId, companyId: item.companyId, userType: item.userType}))
          }
          this.companylist = this.copy(this.deptUserList)
          this.checkedCount = this.companylist.length
        } else {
          notice(this, res.data.message, 2000)
        }
      })
      .catch(res => console.log(res))
    }
  },
  watch: {
    searchTeach (val) {
      if (Number(this.naireType) === 3 && Number(this.people) === 2) this.deptList = ([...this.filterList][0].userList || []).filter(item => item.name.indexOf(val) > -1)
      else this.$refs.tree.filter(val)
      // this.$refs.tree.filter(val)
    },
    people () {
      if (this.count === 1) return
      this.companylist = []
      this.deptUserList = []
      this.checkedCount = 0
    }
  }
}
</script>


<style lang="scss">
  #naire-type {
    .ident {
      margin-right: 20px;
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      cursor: pointer;

      &.active {
        background: #19b955;
        color: #fff;
        border-color: #19b955;
      }
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
    input,textarea {
    outline-color:#19b955;
    }
    .green {
      background: #19b955;
      border-color: #19b955;
      color: #fff;
    }
    .red {
      background: #ff494b;
      border-color: #ff494b;
      color: #fff;
    }
    .el-radio__input.is-checked .el-radio__inner{
      background: #19b955;
      border-color: #19b955;
    }
    .triangle-up {
      position: absolute;
      left: 120px;
      top: 12px;
      width: 0;
      height: 0;
      span {
        position: absolute;
        border: 10px solid transparent;
        border-bottom: 10px solid #e8e8e8;
        &:first-child {
          top: 2px;
          z-index: 2;
          border-bottom: 10px solid #fff;
        }
      }
      &.active {
        left: 220px !important;
      }
    }
    .box{
      display:inline-block;
      margin-left:80px;
      margin-top:10px;
      width:590px;
      overflow: hidden;
      min-height:40px;
      max-height: 80px;
      border-radius: 4px;
      border:1px solid #e8e8e8;
      &>span{
        display:inline-block;
        padding:5px 10px;
        border:1px solid #19b955;
        margin:4px;
        cursor:pointer;
        border-radius:4px;
      }
    }

    // 一级样式 
    .contents {
      display: -webkit-flex;
      display: flex;
      height: 342px;
      background: transparent;
      margin-top: 124px;
      padding: 0;
      .module{
        cursor: pointer;
        -webkit-flex: 1;
        flex: 1;
        text-align: center;
        &>img {
          margin-top: 60px;
          margin-bottom: 28px;
        }
        p.tit{
          font-size: 20px;
          margin-bottom: 10px;
        }
        p {
          color: #fff;
        }
      }
      .public {
        background: #42b0ff;
      }
      .inside {
        background: #05d3c7;
      }
      .without {
        background: #48d684;
      }
    }

    // 二级样式
    .establish {
      min-height: 530px;
      border: 1px solid #e8e8e8;
      margin-top: 20px;
      margin-bottom: 140px;
      background: #fff;
      padding: 20px;
      .common{
        &>div {
          margin:20px 10px;
          p {
            margin-top: 20px;
          }
        }
      }
      label{
        margin-right: 10px;
      }
      .sample.el-input{
        .el-input__inner{
          margin-top:10px;
          width:590px;
          height:40px;
        }
      }
      .el-input {
        border: 0;
        width: 270px;
        height: 40px;
      }
      .el-button:active {
        opacity: 0.8;
      }
      .el-button.is-active {
        border-color: #19b955;
        color: #19b955;
      }
      .el-input__inner{
        display: inline-block;
        width: 270px;
        height: 40px;
        border: 1px solid #e8e8e8;
        color: #333;
        .el-input__icon.el-icon-caret-top{
          border-color: #e8e8e8;
        }
      }
      .create-title {
        width: 100%;
        font-size: 16px;
        border-left: 3px solid #19b955;
        padding-left: 10px;
        font-weight: bold;
        color: #333;
      }
      .btn {
        margin-top: 64px;
        margin-left: 88px;
        .el-button {
          width: 102px;
          height: 36px;
        }
        .save:hover{
          opacity: 0.8;
          color: #fff;
        }
      }
    }
  }
</style>
