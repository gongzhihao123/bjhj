<template>
  <div id="set">
    <div class="switch">
        <span>审批开关</span>
        <el-switch
          v-model="value2"
          active-color="#409EFF"
          inactive-color="#ccc"
          @change="set">
        </el-switch>
        <a @click="chooseNumber" v-if="value2">选择审批人</a>
    </div>
    <div class="table-box" v-if="value2">
        <el-table
        :data="tableData"
        border
        style="width: 50%">
        <el-table-column
          prop="userName"
          label="审批人"
          align="center">
        </el-table-column>
      </el-table>
      <!-- 选择 -->
      <el-dialog title="选择审批人" :visible.sync="chooseDia" class="teacherselect" :close-on-click-modal="false">
          <div class="department-dialog">
          <el-input v-model="keyword"></el-input>
          <section class="dept-tree">
            <el-tree
              class="filter-tree"
              :data="deptList"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="deptListClick"
              ref="trees">
            </el-tree>
          </section>
          </div>
          <div class="department-content">
            <span v-for="(item, i) in deptUserList" @click="deptListDelete(i)" :key="i">{{item.name}}</span>
          </div>
          <div class="department-button">
            <el-button @click="save">确定</el-button>
            <el-button @click="cancel" class="cancel">取消</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>
<script>
import { notice } from '../../utils/index'
export default {
  name: 'set',
  data () {
    return {
      value2: false,
      chooseDia: false,
      keyword: '',
      deptList: [],
      deptUserList: [],
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    chooseNumber () {
      this.chooseDia = true
      this.deptUserList = []
      this.getDetail()
      this.getChecked()
    },
    async getChecked () {
      const data = await this.$store.dispatch('getChecked')
      data.map(item => {
        let obj = {}
        obj.name = item.userName
        obj.userId = item.userId
        obj.userType = item.userType
        obj.userFace = item.userFace
        this.deptUserList.push(obj)
      })
    },
    async set () {
      let jsonUser = []
      this.tableData.map(item => {
        let obj = {}
        obj.userId = item.userId
        obj.userName = item.userName
        obj.userFace = item.userFace ? item.userFace : ''
        obj.userType = item.userType
        jsonUser.push(obj)
      })
      await this.$store.dispatch('saveSet', {
        jsonUser: JSON.stringify(jsonUser),
        checkSwitch: !this.value2 ? 0 : 1
      })
      this.getNumber()
    },
    async save () {
      let jsonUser = []
      this.deptUserList.map(item => {
        let obj = {}
        obj.userId = item.id || item.userId
        obj.userName = item.name
        obj.userFace = item.userFace ? item.userFace : ''
        obj.userType = 1
        jsonUser.push(obj)
      })
      this.deptUserList = []
      if (jsonUser.length === 0) {
        notice('审批人不能为空')
        return
      }
      const data = await this.$store.dispatch('saveSet', {
        jsonUser: JSON.stringify(jsonUser),
        checkSwitch: !this.value2 ? 0 : 1
      })
      console.log(data)
      this.getNumber()
      this.chooseDia = false
    },
    deptListDelete (i) {
      this.deptUserList.splice(i, 1)
    },
    cancel () {
      this.chooseDia = false
    },
    deptListClick (data) {
      for (var i = 0; i < this.tableData.length; i++) {
        if (data.name === this.tableData[i].userName) {
          notice('该人员已经被选中，不能再选！')
          return
        }
      }
      if (data.id === undefined) return
      let userInfo = {
        userId: data.userId,
        name: data.name,
        userFace: data.userFace,
        userType: data.userType
      }
      this.count = 0
      try {
        this.deptUserList.forEach((item, index) => {
          if (item.id === userInfo.userId) this.count++
        })
      } catch (e) {
        this.deptUserList = []
      }
      // if (this.count === 0) {
      //   if (data.companyId !== null) {
      //     this.deptUserList.push(userInfo)
      //   }
      // } else {
      //   this.deptUserList.push(userInfo)
      // }
      if (data.companyId) {
        this.deptUserList.push(userInfo)
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    async getDetail () {
      const data = await this.$store.dispatch('getDetail')
      this.deptList = data[0].deptList
      this.deptList.map(item => {
        item.children = item.userList
      })
    },
    async getNumber () {
      const data = await this.$store.dispatch('getNumber')
      this.tableData = data.listSetUser
      this.$store.state.user.checkSwitch = data.checkSwitch
      if (data.checkSwitch === 1) {
        this.value2 = true
      } else {
        this.value2 = false
      }
    }
  },
  watch: {
    keyword (val) {
      this.$refs.trees.filter(val)
    }
  },
  async created () {
    await this.getNumber()
  }
}
</script>
<style lang="scss">
#set {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;

  .switch {
    padding: 30px;

    &>span {
      font-size: 16px;
      margin-right: 10px;
    }
    &>a {
      color: #408EE6;
      display: block;
      font-size: 16px;
      margin: 20px 0px;
      cursor: pointer;
    }
  }
  .table-box {
    width: 95%;
    margin: 0px auto;
  }
  .el-dialog__body {
    padding: 30px 30px 20px 30px;
  }
  .teacherselect {
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      .el-dialog--small {
        padding: 0px 26px;
        width: 487px;
        color: #666;
        .el-dialog__title {
          font-weight: normal;
          color: #666;
        }
      }
      .department-dialog {
        /* height: 348px; */
        width: 47%;
        float: left;
        .dept-tree {
          border: 1px solid #dadada;
          margin-top: 10px;
          height: 302px;
          border-radius: 6px;
          overflow: auto;
          .el-tree.filter-tree {
            border: none;
          }
        }
      }
      .department-content {
        height: 355px;
        border: 1px solid #dadada;
        width: 47%;
        float: right;
        border-radius: 6px;
        overflow: auto;
        padding: 5px;
        box-sizing: border-box;
        span {
          display: inline-block;
          padding: 5px 10px;
          border: 1px solid #ddd;
          margin: 5px;
          cursor: pointer;
          &:hover {
            border: 1px solid rgb(113, 195, 255);
            color: rgb(113, 195, 255);
          }
          &:active {
            border: 1px solid #ddd;
            color: #666;
          }
        }

      }
      .department-button {
        height: 59px;
        clear: both;
        text-align: center;
        padding-top: 15px;
        box-sizing: border-box;
      }
  }
  .el-dialog {
      .el-dialog__header {
      border-bottom: 1px solid #E4E9ED;
      padding: 20px;
  }
  .el-dialog__title {
    font-weight: normal;
  }
  .el-dialog__headerbtn {
    top: -55px;
    right: -55px;
  }
  .department-button {
    text-align: center;
    &>.el-button {
      padding: 10px 28px;
      background: #5295EB;
      border: 1px solid #5295EB;
      &>span {
        color: #fff !important;
      }
    }
    .cancel {
      background: #FF6C60 !important;
      border: 1px solid #FF6C60 !important;
    }
  }
  .el-dialog__headerbtn .el-dialog__close {
    border: 2px solid #fff;
    border-radius: 100%;
    font-weight: bold;
    padding: 5px;

   &:hover{
    background: #FF6C60;
  }
  }
  .el-icon-close:before {
    color: #fff;
  }
  }
}
</style>
