<template>
  <div class="manage">
    <!-- 管理员设置 -->

    

    <section class="table">

      <table>

        <tbody v-for="(item, i) in tableList" :key="i">
          <tr v-for="(items, index) in item.listResource" :key="index">
            <td :rowspan="item.listResource.length" v-show="index == 0">
              {{ item.rightName }}
            </td>
            <td>{{ items.name }}</td>
            <td :rowspan="item.listResource.length" v-show="index == 0" @click="addUsers(item)">
              <span v-for="(user, ind) in item.listAdmin" :key="ind" class="userOne">
                <img class="user-icon" :src="user.userFace" :alt="user.userName" v-if="user.userFace" @error="errors(user)"/>
                <img class="user-icon" :src="userIcon" :alt="user.userName" v-else />
                <span>{{ user.userName }}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>

    </section>

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
          <span class="span">已选( {{checkedCount}} )</span>
          <span class="span" @click="empty">清空</span>
        </p>
        <span v-for="(item,i) in deptUserList" @click="deptListDelete(i)" :key="item.name">
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
import { notice, success } from '../../../api/index.js'
import userIcon from '../../../assets/images/avatar.png'
import querystring from 'querystring'
export default {
  name: 'manage',
  data () {
    return {
      userIcon,
      tableList: [],
      state: 0,
      searchTeach: '',
      deptUserList: [],
      deptList: [],
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      checkedCount: 0,
      companylist: [],
      asideList: [],
      filterList: [],
      courseRenameSure: false,
      rightId: '',
      rightType: 0,
      sectionId: '',
      school: ''
    }
  },
  methods: {
    errors (item) {
      item.userFace = this.userIcon
    },
    // 添加权限管理员
    deptListClick (data) {
      // if (data.parent === 1) return
      if (data.school === 1) return
      else if (data.school === 2) {
        this.getUsers(data)
        return
      }
        // return
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
        data.sectionId = this.sectionId
        this.deptUserList.push(data)
        this.asideList.push(data.name)
      }
    },
    getUsers (data) {
      this.$https.get(`/common/deptUserList?companyId=${data.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let arr = (res.data.result || []).map(item => ({
            ...item,
            parent: 1,
            children: (item.deptList || []).concat(item.userList || []).map(items => ({
              ...items,
              children: (items.userList || []).map(user => ({
                ...user,
                companyId: item.id
              }))
            }))
          }))
          this.deptList[data.index].children = [...arr[0].children]
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
    getCompanyPeople () {
      if (this.rightType === 2) {
        this.$https.get(`/common/deptUserList`)
        .then(res => {
          if (res.data.code === 1) {
            this.deptList = this.resetTree(res.data.result[0].deptList || []).concat(res.data.result[0].userList || [])
            // this.deptList = (res.data.result || []).map(item => ({
            //   ...item,
            //   parent: 1,
            //   children: (item.deptList || []).concat(item.userList || []).map(items => ({
            //     ...items,
            //     children: (items.userList || []).map(user => ({
            //       ...user,
            //       companyId: item.id
            //     }))
            //   }))
            // }))
          }
        })
      } else if (this.rightType === 1) {
        this.$https.get(`/common/childCompanyList`)
        .then(res => {
          if (res.data.code === 1) {
            this.deptList = (res.data.result || []).map((item, i) => ({
              ...item,
              companyId: item.companyId,
              school: 2,
              index: i,
              children: [{name: '请稍后...', school: 1}]
            }))
          }
        })
      }
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
      this.searchTeach = ''
      this.companylist = this.copy(this.deptUserList)
      if (this.companylist.length === 0) {
        notice(this, '请设置用户', 2000)
        return
      }
      this.adminSave()
    },
    cancle () {
      this.searchTeach = ''
      this.courseRenameSure = !this.courseRenameSure
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
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
    // 保存管理员设置信息(支持新增和修改)
    adminSave () {
      this.companylist = this.companylist.map(item => ({
        userId: item.userId ? item.userId : item.id,
        userName: item.name ? item.name : item.userName,
        userFace: item.userFace,
        sectionId: this.sectionId,
        schoolId: this.school === 1 ? (item.schoolId ? item.schoolId : item.companyId) : '',
        companyId: this.school === 1 ? '' : item.companyId
      }))
      this.companylist = JSON.stringify(this.companylist)
      this.$https.post(`/right/adminSave`, querystring.stringify({
        rightId: this.rightId,
        // sectionId: this.sectionId,
        users: this.companylist
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getAdminList()
          this.courseRenameSure = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取权限信息
    getAdminList () {
      this.$https.get(`/right/adminList`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result || []).map(item => ({
            ...item,
            name: item.rightName,
            listAdmin: (item.listAdmin || []).filter(items => items.userId),
            listResource: item.listResource || []
          }))
          .filter(item => item.name.indexOf('幼儿园') === -1)
          this.tableList.forEach((item, i) => {
            if (item.name.indexOf('学校管理员') > -1) {
              this.$set(item, 'school', 5)
            }
          })
        }
      })
    },
    // 添加人
    addUsers (item) {
      if (!item.sectionId) {
        this.sectionId = ''
      } else {
        this.sectionId = item.sectionId
      }
      this.rightType = item.rightType
      this.getCompanyPeople()
      this.rightId = item.rightId
      // this.sectionId = item.rightSort
      if (!item.listAdmin) {
        this.deptUserList = []
      } else {
        this.deptUserList = item.listAdmin
        this.deptUserList = this.deptUserList.map(item => ({
          ...item,
          name: item.name ? item.name : item.userName,
          id: item.userId
        }))
        this.checkedCount = this.deptUserList.length
      }
      this.courseRenameSure = true
      this.school = item.school === 5 ? 1 : 0
    }
  },
  created () {
    // this.getCompanyPeople()
    this.getAdminList()
  },
  watch: {
    searchTeach (val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/variable.scss';
  .manage {
    .table {
      background: #fff;
      position: relative;
      padding: 30px;;
      height: calc(100%);
      table {
        width: 100%;
        background: #fff;
        td {
          text-align: center;
          border: 1px solid $border-color;
          height: 40px !important;
          overflow: auto;

          &:first-child {
            width: 30%;
            background: #eef2f5;
            font-weight: bold;
          }

          &:nth-child(2) {
            width: 30%;
            background: #f3f6f9 ;
          }

          &:last-child {
            cursor: pointer;
            // text-align: left;
            &:hover {
              background: #e2efe5;
              border: 1px solid #7fce89;
            }
            .user-icon {
              width: 28px;
              height: 28px;
            }

            .userOne {
              display: inline-block;
              padding: 4px 10px;
              
              img {
                vertical-align: middle;
              }
              // background: #ccc;
            }
          }
        }
      }
    }
  }
</style>

