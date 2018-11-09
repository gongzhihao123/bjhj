<template>
  <div class="research">
    <!-- 教研员设置 -->
    <ul class="right-nav">
      <li v-for="(item, i) in sectionList" :key="i" :class="{active: gradeInd == i}" @click="gradeClick(item, i)">{{ item.name }}</li>
    </ul>

    <el-button type="success" @click="add('新增')">新增</el-button>

    <section class="table">
      <table>
        <tr>
          <td v-for="item in tableHead" :key="item.name">{{ item.name }}</td>
        </tr>
        <tr v-for="(item, i) in tableList" :key="i">
          <td>{{ item.courseName }}</td>
          <td class="peoples">
            <section v-for="(items, index) in item.listRightTeach" :key="index">
              <img v-if="items.userFace" :src="items.userFace" alt="">
              <img src="../../../assets/images/avatar.png" alt="" ondragstart="return false;" v-else>
              {{ items.userName }}
            </section>
          </td>
          <td>
            <el-button @click="change(item)">
            </el-button>
            <el-button @click="researchDelete(item)"></el-button>
          </td>
        </tr>
        <tr v-if="tableList.length == 0" style="height: 40px;">
          <td :colspan="3">暂无数据</td>
        </tr>
      </table>
    </section>
    <!-- 新增 -->
    <el-dialog
      :title="addOrEdit"
      :visible.sync="dialogShow"
      :show-close="false">
      <i class="el-icon-close close" @click="dialogShow = false"></i>
      <table>
        <tr v-if="subjectLists && subjectLists.length > 0">
          <td>学科：</td>
          <td v-if="addOrEdit == '新增'">
            <el-select v-model="subject" placeholder="请选择">
              <el-option
                v-for="(item, i) in subjectLists"
                :key="item.id"
                :label="item.name"
                :disabled="item.disabled"
                :value="i">
              </el-option>
            </el-select>
          </td>
          <td v-else>{{ subjectLists[subject || 0].name }}</td>
        </tr>
        <tr>
          <td>教研员：</td>
          <td>
            <div class="people" @click="addTeacher">
              <span v-for="item in companylist" :key="item.userName" class="teachers">{{ item.userName }}</span>
            </div>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="getResearchSave">保 存</el-button>
      </span>
    </el-dialog>

    <!--选择用户弹出框-->
    <el-dialog title="指定用户"
      v-model="courseRenameSure"
      :show-close="false"
      class="education-teacher-setting">
      <i class="el-icon-close close" @click="courseRenameSure = false"></i>
      <div class="education-course-add-content-left">
        <el-input v-model="searchTeach" placeholder="输入关键词"></el-input>
        <section class="education-course-add-tree">
          <el-tree
            class="filter-tree"
            :data="deptList"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="deptListClick"
            ref="tree">
          </el-tree>
        </section>
      </div>
      <div class="education-course-add-content-right">
        <p>
          <span class="span">已选( {{ checkedCount }} )</span>
          <span class="span" @click="empty">清空</span>
        </p>
        <span v-for="(item,i) in deptUserList" @click="deptListDelete(i)" :key="item.name">
          {{ item.name }}
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
import { notice, success } from '../../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'research',
  data () {
    return {
      dialogShow: false,
      sectionList: [],
      gradeInd: 0,
      tableHead: [
        { name: '学科' },
        { name: '教研员' },
        { name: '设置' }
      ],
      tableList: [],
      checkedCount: 0,
      addOrEdit: '',
      subjectLists: [],
      subject: '',
      sectionId: '',
      courseId: '',
      courseName: '',
      deptUserList: [],
      courseRenameSure: false,
      searchTeach: '',
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      deptList: [],
      companylist: [],
      asideList: [],
      rightTeachId: ''
    }
  },
  created () {
    this.getCompanyPeople()
    this.getSection()
  },
  methods: {
    async gradeClick (item, i) {
      this.gradeInd = i
      this.sectionId = item.id
      await this.subjectList()
      this.getResearchList()
    },
    // 新增
    add () {
      this.subject = ''
      this.companylist = []
      this.deptUserList = []
      this.checkedCount = 0
      this.dialogShow = true
      this.addOrEdit = '新增'
    },
    change (item) {
      this.subjectLists.forEach((items, i) => {
        if (item.courseId === items.id) {
          this.subject = i
        }
      })
      this.deptUserList = item.listRightTeach.map(items => ({
        ...items,
        name: items.userName,
        id: items.userId
      }))
      this.checkedCount = this.deptUserList.length
      this.dialogShow = true
      // this.subject = ''
      this.companylist = item.listRightTeach
      this.addOrEdit = '编辑'
    },
    // 判断科目是否可选
    filterSubject () {
      this.subjectLists = this.subjectLists.map(item => ({
        ...item,
        disabled: false
      }))
      this.subjectLists.forEach(item => {
        this.tableList.forEach(items => {
          if (item.id === items.courseId) {
            this.$set(item, 'disabled', true)
          }
        })
      })
    },
    // 添加权限管理员
    deptListClick (data) {
      if (!data.userId) return
      let a = false
      this.deptUserList.forEach((item, i) => {
        if (item.name === data.name) {
          a = true
        }
      })
      if (a) {
        let i = this.asideList.indexOf(data.name)
        this.checkedCount--
        this.deptUserList.splice(i, 1)
        this.asideList.splice(i, 1)
      } else {
        this.checkedCount++
        this.deptUserList.push(data)
        this.asideList.push(data.name)
      }
    },
    getCompanyPeople () {
      this.$https.get(`/common/deptUserList`)
      .then(res => {
        if (res.data.code === 1) {
          this.deptList = this.resetTree(res.data.result[0].deptList || []).concat(res.data.result[0].userList || [])
          // this.deptList = (res.data.result || []).map(item => ({
          //   ...item,
          //   parent: 1,
          //   children: item.deptList.concat(item.userList).map(items => ({
          //     ...items,
          //     children: items.userList
          //   }))
          // }))
        }
      })
    },
    empty () {
      this.deptUserList = []
      this.checkedCount = 0
    },
    deptListDelete (i) {
      this.deptUserList.splice(i, 1)
      this.checkedCount--
    },
    // 保存权限管理员信息
    rightSave () {
      this.courseRenameSure = false
      this.searchTeach = ''
      this.companylist = this.copy(this.deptUserList)
      this.companylist = this.companylist.map(item => ({
        ...item,
        userName: item.name
      }))
    },
    cancle () {
      this.searchTeach = ''
      this.courseRenameSure = !this.courseRenameSure
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取学段
    getSection () {
      this.$https.get(`/common/sectionList`)
      .then(async res => {
        if (res.data.code === 1) {
          this.sectionList = (res.data.result || []).filter(item => item.name.indexOf('幼儿园') === -1)
          this.sectionId = this.sectionList[0].id
          await this.subjectList()
          this.getResearchList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 根据学段获取学科信息
    async subjectList () {
      this.subjectLists = []
      await this.$https.get(`/common/subjectList?sectionId=${this.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subjectLists = res.data.result || []
        } else {
          notice(this, res.data.message, 2000)
        }
      })
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
    // 添加教研员
    addTeacher () {
      this.courseRenameSure = true
    },
    // 保存教研员设置信息
    getResearchSave () {
      if (this.subject === '') {
        notice(this, '请选择学科', 2000)
        return
      }
      if (!this.companylist.length) {
        notice(this, '请设置教研员！', 2000)
        return
      }
      this.companylist = this.companylist.map(item => ({
        userId: item.userId,
        userName: item.name ? item.name : item.userName,
        userFace: item.userFace
      }))
      this.$https.post(`/right/researchSave`, querystring.stringify({
        courseId: this.subjectLists[this.subject].id,
        courseName: this.subjectLists[this.subject].name,
        sectionId: this.sectionId,
        users: JSON.stringify(this.companylist)
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.dialogShow = false
          success(this, res.data.message, 2000)
          this.getResearchList()
        }
      })
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
    // 获取教研员信息列表
    async getResearchList () {
      await this.$https.get(`/right/researchList?sectionId=${this.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = res.data.result
          this.filterSubject()
        }
      })
    },
    // 删除教研员信息设置
    researchDelete (item) {
      this.$https.post(`/right/researchDelete`, querystring.stringify({
        rightTeachId: item.rightTeachId
      }))
      .then(async res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          await this.getResearchList()
          this.filterSubject()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  watch: {
    searchTeach (val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
  .research {
    height: calc(100% - 10px);
    padding-top: 40px;
    overflow: auto;

    .right-nav {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 40px;
      background: #eef2f5;
      line-height: 40px;
      display: flex;
      cursor: pointer;

      li {
        padding: 0 40px;

        &.active {
          background: #fff;
          color: #23a4e6;
        }
      }
    }

    > .el-button {
      padding-left: 40px;
      background: url(../../../assets/icons/add-exam.png) no-repeat 6px center #13ce66;
    }

    .table {
      margin-top: 20px;

      table {
        width: 100%;
      }
      tr {
        &:first-child {
          background: #eef2f5;
          height: 40px;
        }

        td {
          text-align: center;
          border: 1px solid $border-color;
          min-height: 40px;

          &.peoples {
            min-height: 40px;
            max-width: 580px;
            > section {
              display: inline-block;
              height: 40px;
              line-height: 40px;
              padding: 0 20px;

              img {
                width: 24px;
                height: 24px;
                vertical-align: middle;
              }
            }
            
          }

          > .el-button {
            width: 32px;
            height: 32px;
            border: none;
            background: url(../../../assets/icons/edit.png) no-repeat center;

            &:nth-child(2) {
              background-image: url(../../../assets/icons/delete.png);
            }
          }
        }
      }
    }

    .el-dialog {
      max-height: 600px;
      overflow: scroll;
      table {
        width: 100%;

        td {
          height: 56px;

          &:first-child {
            width: 100px;
            text-align: right;
          }

          &:nth-child(2) {
            padding: 0 20px;

            > .el-select {
              width: 100%;
              height: 38px !important;

              > * {
                height: 38px !important;

                > * {
                  height: 38px !important;
                }
              }
            }

            > div.people {
              width: 100%;
              border-radius: 4px;
              min-height: 36px;
              // padding-bottom: 5px;
              border: 1px solid $border-color;
            }
          }
        }
      }
    }
    .teachers {
      display: inline-block;
      padding: 4px 10px;
      background:#23a4e6;
      color: #fff;
      text-align: center;
      margin-left: 10px;
      border-radius: 4px;
      margin-top: 5px;
      // line-height: 
    }
  }
</style>

