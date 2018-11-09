<template>
  <div id="set">
    <header>
      设置
    </header>
    <p class="add-button">
      <el-button @click="addButton" type="primary" icon="el-icon-plus"><i class="el-icon-plus"></i>&nbsp;新增</el-button>
    </p>

    <!-- 管理员列表 -->
    <div class="manager-list">
      <el-row>
        <el-col :span="Number(item.num)" v-for="(item, index) in listTitle" :key="index">{{ item.name }}</el-col>
      </el-row>

      <transition-group name="slide-left" mode="out-in">
        <el-row class="list-body" v-for="(item, index) in listBody" :key="index">
          <el-col :span="5">{{ item.manageName }}</el-col>
          <el-col :span="5">
            <span v-if="item.needCheck === 1">是</span>
            <span v-else>否</span>
          </el-col>
          <el-col :span="4" v-if="!item.checkName">--</el-col>
          <el-col :span="4" v-if="item.checkName">
            <el-popover
              v-if="item.checkName.length >= 7"
              placement="top"
              width="200"
              trigger="hover"
              :content="item.checkName">
              <span slot="reference">{{ item.checkName.slice(0, 7) + '...' }}</span>
            </el-popover>
            <span v-if="item.checkName.length < 7">{{ item.checkName }}</span>
          </el-col>
          <el-col :span="5" v-if="!item.remark">--</el-col>
          <el-col :span="5" v-if="item.remark">
            <el-popover
              v-if="item.remark.length >= 11"
              placement="top"
              width="200"
              trigger="hover"
              :content="item.remark">
              <span slot="reference">{{ item.remark.slice(0, 11) + '...' }}</span>
            </el-popover>
            <span v-if="item.remark.length < 11">
              {{ item.remark }}
            </span>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="edit(item)">编辑</el-button>
            <el-button type="danger" @click="del(item)">删除</el-button>
          </el-col>
        </el-row>
      </transition-group>
    </div>

    <!-- 新增弹出框 -->
    <el-dialog
      title="新增"
      class="dialog"
      v-model="dialogVisible"
      size="tiny">

      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" v-if="dialogVisible">
        <el-row class="choose-admin">
          <el-col :span="5">测评管理员：</el-col>
          <el-col :span="19">
            <el-form-item prop="selectedManager" class="has-selected-manager">
              <span @click="managerOpen" class="choose" v-if="!ruleForm.selectedManager">选择管理员</span>
              <span class="manager">{{ ruleForm.selectedManager }}<i v-if="ruleForm.selectedManager" @click="ruleForm.selectedManager = ''">x</i></span>
            </el-form-item>
            <el-button v-if="!deptListShow" @click="managerOpen">选择</el-button>
            <el-button v-if="deptListShow" @click="managerClose('ruleForm')">关闭</el-button>
            <transition name="slide-left" mode="out-in">
            <div v-if="deptListShow" class="manager-dept-list">
              <el-tree 
                :data="deptList" 
                :props="defaultProps" 
                @node-click="handleNodeClick">
              </el-tree>
              <!-- <p>
                <el-button>关闭</el-button>
              </p> -->
            </div>
            </transition> 
          </el-col>
        </el-row>

        <el-row class="need-checked">
          <el-col :span="5">需要审核：</el-col>
          <el-col :span="19">
            <el-switch
              v-model="needChecked"
              @change="canChooseOrNot('ruleForm')"
              on-text="是"
              off-text="否">
            </el-switch>
          </el-col>
        </el-row>

        <el-row class="checked-people">
          <el-col :span="5">审核人：</el-col>
          <el-col :span="19">
            <el-form-item prop="selectedCheckerList">
              <div>
                <i @click="checkerOpen" v-if="ruleForm.selectedCheckerList.length === 0" style="cursor: pointer; font-style: normal;margin-left: 10px; color: #C9C9C9;">请选择审核人</i>
                <span v-for="(item, index) in ruleForm.selectedCheckerList" :key="index">{{ item.name }}<i @click="delSelectedChecker(item, index)">x</i></span>
              </div>
            </el-form-item>
            <el-button v-if="!checkerListShow" @click="checkerOpen" :disabled="canChoose">选择</el-button>
            <el-button v-if="checkerListShow" @click="checkerClose('ruleForm')" :disabled="canChoose">关闭</el-button>
            <transition name="slide-left" mode="out-in">
              <div class="checker-dept-list" v-if="checkerListShow">
                <el-tree 
                :data="deptList" 
                :props="defaultProps" 
                @node-click="checkerHandleNodeClick">
            </el-tree>
              </div>
            </transition>
          </el-col>
        </el-row>

        <el-row class="note">
          <el-col :span="5">备注：</el-col>
          <el-col :span="19">
            <el-form-item prop="noteContent">
              <el-input type="textarea" :rows="3" :maxlength="120" v-model.trim="ruleForm.noteContent" placeholder="填写备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addManager('ruleForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import querystring from 'querystring'
import { notice, success, error } from '../../api/index'
export default {
  name: 'set',
  data () {
    return {
      canChoose: false,
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      deptList: [],
      checkerListShow: false,
      deptListShow: false,
      needChecked: true,
      dialogVisible: false,
      ruleForm: {
        selectedManager: '',
        selectedCheckerList: [],
        noteContent: '',
        id: ''
      },
      rules: {
        selectedManager: [
          {message: '请选择管理员', required: true, trigger: 'change'}
        ],
        selectedCheckerList: [
          {type: 'array', message: '请选择审核人', required: true, trigger: 'change'}
        ],
        noteContent: [
          {message: '请填备注', trigger: 'change'}
        ]

      },
      listTitle: [
        {name: '测评管理员', num: '5'},
        {name: '是否需要审核', num: '5'},
        {name: '审核人', num: '4'},
        {name: '备注', num: '5'},
        {name: '操作', num: '5'}
      ],
      listBody: [],
      editId: '',
      addOrEdit: true,
      arrs: []
    }
  },
  methods: {
    managerClose (formName) {
      this.deptListShow = !this.deptListShow
      // this.$refs[formName].validate((valid) => {})
    },
    checkerClose (formName) {
      this.checkerListShow = !this.checkerListShow
      // this.$refs[formName].validate((valid) => {})
    },
    managerOpen () {
      this.deptListShow = true
      this.checkerListShow = false
    },
    checkerOpen () {
      if (!this.canChoose) {
        this.checkerListShow = true
        this.deptListShow = false
      }
    },
    // 是否需要审核
    canChooseOrNot (formName) {
      if (this.needChecked) {
        this.canChoose = true
        this.checkerListShow = false
        this.ruleForm.selectedCheckerList = []
      } else {
        this.canChoose = false
      }
      if (this.needChecked) {
        this.rules.selectedCheckerList[0].required = false
      } else {
        this.rules.selectedCheckerList[0].required = true
      }
      this.$refs[formName].validate((valid) => {})
    },
    // 新增按钮
    addButton () {
      this.deptListShow = false
      this.checkerListShow = false
      this.addOrEdit = true
      this.dialogVisible = true
      this.needChecked = true
      this.canChoose = false
      this.ruleForm = {
        selectedManager: '',
        selectedCheckerList: [],
        noteContent: ''
      }
    },
    // 编辑按钮
    edit (item) {
      this.deptListShow = false
      this.checkerListShow = false
      this.addOrEdit = false
      this.dialogVisible = true
      this.editId = item.id
      item.needCheck === 1 ? this.needChecked = true : this.needChecked = false
      this.ruleForm.selectedManager = item.manageName
      this.ruleForm.selectedCheckerList = []
      this.ruleForm.noteContent = item.remark
      if (this.needChecked) {
        this.canChoose = false
        item.checkName.split(',').forEach((child, index) => {
          this.ruleForm.selectedCheckerList.push({name: child})
          this.deptList.forEach((n) => {
            n.userList.forEach((m) => {
              if (m.name === child) {
                this.ruleForm.selectedCheckerList[index].userId = m.userId
              }
            })
          })
        })
      } else {
        this.canChoose = true
      }
    },
    // 删除
    del (item) {
      this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$https.post('/setting/settingDetele', querystring.stringify({
          id: item.id
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '删除成功', 1000)
            this.getSettingList()
          }
        })
      })
    },
    // 添加、编辑管理员确定按钮
    addManager (formName) {
      if (!this.needChecked) {
        this.rules.selectedCheckerList[0].required = false
      } else {
        this.rules.selectedCheckerList[0].required = true
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let userId = ''
          let checkIds = ''
          let checkNames = ''
          this.deptList.forEach((item, index) => {
            item.userList.forEach((child) => {
              if (this.ruleForm.selectedManager === child.name) {
                // userId = child.userId
              }
            })
          })
          checkIds = this.ruleForm.selectedCheckerList.map(n => n.userId).join(',')
          checkNames = this.ruleForm.selectedCheckerList.map(n => n.name).join(',')
          if (this.addOrEdit) {
            this.$https.post(`/setting/settingAdd`, querystring.stringify({
              manageId: this.ruleForm.id,
              manageName: this.ruleForm.selectedManager,
              needCheck: this.needChecked ? 1 : 0,
              remark: this.ruleForm.noteContent,
              checkIds: checkIds,
              checkNames: checkNames
            }))
            .then(res => {
              if (res.data.code === 1) {
                success(this, '添加成功', 1000)
                this.dialogVisible = false
                this.getSettingList()
              } else {
                notice(this, res.data.message, 1000)
              }
            })
          } else {
            this.$https.post(`/setting/settingUpdate`, querystring.stringify({
              id: this.editId,
              manageId: this.ruleForm.id,
              manageName: this.ruleForm.selectedManager,
              needCheck: this.needChecked ? 1 : 0,
              remark: this.ruleForm.noteContent,
              checkIds: checkIds,
              checkNames: checkNames
            }))
            .then(res => {
              if (res.data.code === 1) {
                success(this, '编辑成功', 1000)
                this.dialogVisible = false
                this.getSettingList()
              } else {
                notice(this, res.data.message, 1000)
              }
            })
          }
        } else {
        }
      })
    },
    // 删除审核人
    delSelectedChecker (item, index) {
      this.ruleForm.selectedCheckerList.splice(index, 1)
    },
    checkerHandleNodeClick (val) {
      if (val.deptId) {
        let a = false
        this.ruleForm.selectedCheckerList.forEach((item, index) => {
          if (item.userId === val.userId) a = true
        })
        if (!a) this.ruleForm.selectedCheckerList.push(val)
      }
    },
    handleNodeClick (val) {
      if (val.deptId) {
        this.ruleForm.selectedManager = val.name
        this.ruleForm.id = val.userId
      }
    },
    // 获取测评管理员列表
    getSettingList () {
      this.$https.get('/setting/getSettingList')
      .then(res => {
        if (res.data.code === 1) {
          this.listBody = res.data.result
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },

    sort (arr) {
      arr.forEach((item) => {
        if (item.userList) {
          if (item.childDeptList && item.childDeptList.length) {
            item.userList = item.userList.concat(item.childDeptList)
            this.sort(item.userList)
          }
        }
      })
      return arr
    },

    getDept () {
      this.$https.get('/common/getDeptAndUserByCompanyId')
      .then(res => {
        if (res.data.code === 1) {
          this.deptList = [...res.data.result]
          this.sort(this.deptList)
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.getSettingList()
    this.getDept()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';
#set{

  header{
    font-size: 14px;
    padding: 18px;
    padding-bottom: 13px;
    color: #484848;
    border-bottom: 2px solid #DDD;
  }

  &>.add-button{
    padding: $width;
    .el-button{
      font-size: 14px;
      span{
        margin-left: 0;
        i{
          margin-right: 10px;
        }
      }
    }
  }

  // 测评管理员列表
  .manager-list{
    padding-bottom: $width * 5;
    // text-align: center;

    .el-row{
      line-height: 48px;
      border-bottom: 1px solid #E6E6E6;
      color: #333333;
      font-size: 14px;

      .el-col{
        padding-left: 50px;
        &:last-child{
          text-align: center;
        }
      }
    }
    .list-body:hover{
      background: #F7F7F7;
    }

    .el-button{
      font-size: 14px;
    }
  }

  // 新增弹出框
  .dialog{
    .el-dialog{
      width: 592px;

      .el-dialog__header{
        padding:15px 13px 0;
        span{
          font-weight: normal;
        }
      }

      .el-dialog__body{
        padding: $width $width * 2;
        font-size: 14px;

        .el-row{
          // margin-top: $width;
          .el-col:nth-child(1){
            text-align: right;
          }
          .el-col:nth-child(2) {
            padding-left: $width;
          }
        }

        // 测评管理员
        .choose-admin{
          margin-top: $width;
          line-height: 34px;

          .el-col:nth-child(1){
            text-align: right;
          }
          .el-col:nth-child(2) {
            position: relative;
            padding-left: $width;

            .has-selected-manager{
              display: inline-block;
              width: 310px;

              .el-form-item__content{
                display: inline-block;
                width: 310px;
                border: 1px solid #B9B9B9;
                border-radius: 4px;

                .choose{
                  margin-left: $width/4;
                  color: #C9C9C9;
                  cursor: pointer;
                }
              
                .manager{
                  color: #42454A;
                  display: inline-block;
                  // width: 58px;
                  line-height: 28px;
                  box-sizing: border-box;
                  padding: 0 20px 0 10px;
                  border-radius: 4px;
                  background: #D0F0FF;
                  // cursor: pointer;
                  margin-left: $width/4;
                  position: relative;

                  i{
                    position: absolute;
                    cursor: pointer;
                    right:6px;
                    bottom: 1px;
                    color: #FF7B7E;
                    font-style: normal;
                  }
                }
              }
            }

            .el-button{
              vertical-align: middle;
              margin-top: -3px;
            }

            .manager-dept-list{
              position: absolute;
              top: $width*2;
              left: $width;
              width: 310px;
              height: 200px;
              overflow-x: hidden;
              border: 1px solid #B9B9B9;
              border-radius: 4px;
              z-index: 101;
              background: #fff;

              .el-tree{
                border: 0;
              }
            }
          }
        }

        // 需要审核
        .need-checked{
          font-size: 14px;
        }

        // 审核人
        .checked-people{
          margin-top: $width;
          line-height: 35px;

          .el-col:nth-child(2) {
            position: relative;

            &>.el-form-item{
              margin-left: 0px;

              .el-form-item__content{
                &>div:first-child{
                  border: 1px solid #B9B9B9;
                  border-radius: 4px;
                  width: 310px;
                  height: 36px;
                  overflow-x: hidden;

                  &>span{
                    position: relative;
                    display: inline-block;
                    background: #D0F0FF;
                    line-height: 16px;
                    padding: 6px 20px 6px 10px;
                    border-radius: 4px;
                    color: #42454A;
                    margin-left: $width/4;

                    i{
                      position: absolute;
                      cursor: pointer;
                      right:6px;
                      bottom: 7px;
                      color: #FF7B7E;
                      font-style: normal;
                    }
                  }
                }
              }
            }
            
            .el-button{
              position: absolute;
              right: 10px;
              top: -0px;
            }

            .checker-dept-list{
              position: absolute;
              top: $width*2;
              left: $width;
              width: 310px;
              height: 200px;
              overflow-x: hidden;
              border: 1px solid #B9B9B9;
              border-radius: 4px;
              z-index: 101;
              background: #fff;
              .el-tree{
                border: 0;
              }
            }
          }
        }

        // 备注
        .note{
          .el-col:nth-child(2){
            
            .el-form-item{
              margin-left: 0px;
            }

            textarea{
              resize: none;
              width: 375px;
            }
          }
        }
      }

      .el-dialog__footer{
        .el-button{
          padding: 10px 20px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
