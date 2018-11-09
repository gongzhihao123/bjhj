<template>
  <div class='asset-detail'>
    <header>
      <el-row>
        <el-col :span="12">
          <img src="../../assets/images/logo.png" alt="">
          易耗品管理
        </el-col>
        <el-col :span="12">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="userPath" v-if="userPath">
              <span v-else>
                {{ userName.substring(userName.length-2, userName.length) }}
              </span>
            </span>
            <el-dropdown-menu slot="dropdown" style="margin-top:0px;">
              <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </header>

    <div>
      <div>
        {{ assetName }}
      </div>
    </div>

    <main>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="物品详情" name="first">
          <el-row>
            <el-col :span="12">
              <span>
                物品名称：
              </span>
              <i> {{ detailData.name }} </i>
            </el-col>
            <el-col :span="12">
              <span>
                物品编号：
              </span>
              <i> {{ detailData.code }} </i>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>
                物品总数量：
              </span>
              <i> {{ detailData.totalCount }} </i>
            </el-col>
            <el-col :span="12">
              <span>
                库存数量：
              </span>
              <i> {{ detailData.restNum }} </i>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>
                物品类型：
              </span>
              <i> {{ detailData.typeName }} </i>
            </el-col>
            <el-col :span="12">
              <span>
                物品规格：
              </span>
              <i> {{ detailData.spec }} </i>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>
                物品单价：
              </span>
              <i> {{ detailData.price }} </i>
            </el-col>
            <el-col :span="12">
              <span>
                供应商：
              </span>
              <i> {{ detailData.supplier }} </i>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>
                入库人：
              </span>
              <i> {{ detailData.userName }} </i>
            </el-col>
            <el-col :span="12">
              <span>
                物品品牌：
              </span>
              <i> {{ detailData.brand }} </i>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <span>
                备注：
              </span>
            </el-col>
            <el-col :span="16">
              <el-input type="textarea" disabled v-model="detailData.remark" :rows="5"></el-input>
            </el-col>
          </el-row>

        </el-tab-pane>

        <el-tab-pane label="入库列表" name="second">
          <el-table
            :data="storageData"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="userName"
              label-class-name="head"
              label="入库人"
              width="220">
            </el-table-column>
            <el-table-column
              prop="number"
              label-class-name="head"
              label="入库数量">
            </el-table-column>
            <el-table-column
              label-class-name="head"
              label="入库时间">
              <template slot-scope="scope">
                {{ scope.row.date | dateFormat('yyyy-MM-dd HH:mm:ss') }}
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="领用详情" name="third">
          <el-table
            :data="receiveTableData"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="userName"
              label-class-name="head"
              label="领用人">
            </el-table-column>
            <el-table-column
              prop="userDeptName"
              label-class-name="head"
              label="领用部门">
            </el-table-column>
            <el-table-column
              prop="number"
              label-class-name="head"
              label="领用数量">
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="报废详情" name="fourth">
            <el-table
              :data="outStorageData"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                prop="userName"
                label-class-name="head"
                label="报废人">
              </el-table-column>
              <el-table-column
                prop="userDeptName"
                label-class-name="head"
                label="部门">
              </el-table-column>
              <el-table-column
                prop="number"
                label-class-name="head"
                label="数量">
              </el-table-column>
            </el-table>
        </el-tab-pane>

        <p>
          <el-button type="primary" @click="receiveButton" v-if="activeName === 'first'">领用</el-button>
        </p>
      </el-tabs>
    </main>

    <!-- 领用弹出框 -->
    <el-dialog
      title="领用"
      :visible.sync="receiveDialogVisible"
      width="650px">

      <el-form v-if="receiveDialogVisible" :model="receiveContentData" ref="receiveContentData" label-width="100px" class="demo-ruleForm">

        <el-row>
          <el-col :span="12" class="text-right">
            <span> 领用人：</span>
            <el-form-item
              prop="people"
              :rules="[
                { required: true, message: '领用人不能为空'},
              ]"
            >
              <el-select filterable @change="userChange" v-model="receiveContentData.people" placeholder="请选择领用人">
                <el-option
                  v-for="item in peopleOptions"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId">
                </el-option>
                <!-- <el-option-group
                  v-for="group in peopleOptions"
                  :key="group.userId"
                  :label="group.name">
                  <el-option
                    v-for="item in group.children"
                    :key="item.userId"
                    :label="item.name"
                    :value="item.userId">
                  </el-option>
                </el-option-group> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="text-right">
            <span> 领用部门：</span>
            <el-form-item
              prop="dept"
              :rules="[
                { required: true, message: '领用部门不能为空'},
              ]"
            >
            <el-input disabled placeholder="请输入领用部门" v-model="receiveContentData.dept"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="text-right">
            <span> 领用时间：</span>
            <el-form-item
              prop="receiveTime"
              :rules="[
                { required: true, message: '领用时间不能为空'},
              ]"
            >
              <el-date-picker
                style="width: 200px"
                v-model="receiveContentData.receiveTime"
                type="datetime"
                placeholder="选择领用时间">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12" class="text-right">
            <span> 领用数量：</span>
            <el-form-item
              prop="count"
              :rules="[
                { required: true, message: '领用数量不能为空'},
              ]"
            >
              <el-input-number style="width: 200px;" placeholder="请输入领用数量" :min="1" :max="detailData.restNum" v-model="receiveContentData.count"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" class="text-right">
            <span> 备注信息：</span>
            <el-form-item
              prop="note"
              :rules="[
                { required: false, message: ''},
              ]"
            >
              <el-input type="textarea" v-model="receiveContentData.note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="receiveDialogVisible = false">关闭</el-button>
        <el-button size="small" type="primary" @click="submitForm ('receiveContentData')">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormatT } from '@/filters/index'
// import { TreeMenu } from '@/utils/tree'
import { notice } from '@/utils/index'
export default {
  name: 'asset-detail',
  data () {
    return {
      userName: '',
      userPath: '',
      peopleOptions: [],
      receiveDept: [],
      receiveUser: [],
      assetName: '',
      storageData: [],
      outStorageData: [],
      receiveInnerDialogVisible: false,
      activeName: 'first',
      receiveContentData: {
        scrap: '',
        people: '',
        dept: '',
        receiveTime: '',
        count: '',
        note: ''
      },
      receiveDialogVisible: false,
      receiveTableData: [],
      detailData: {}
    }
  },
  methods: {
    logout () {
      const path = document.getElementById('contextPath').value
      window.location.href = `${path}/logout`
    },
    async handleClick (val) {
      if (val.name === 'first') {
        await this.getDetail()
      } else if (val.name === 'second') {
        await this.getStorage()
      } else if (val.name === 'third') {
        await this.getReceiveList()
      } else if (val.name === 'fourth') {
        await this.getOutStorage()
      }
    },
    // 领用按钮
    receiveButton () {
      if (this.detailData.restNum === 0) {
        notice('当前物品库存为0')
        return
      }
      this.receiveDialogVisible = true
      this.receiveContentData = {
        scrap: '',
        people: '',
        dept: '',
        receiveTime: '',
        count: '',
        note: ''
      }
    },
    // 领用确认
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch('totalOperation', {
            consumId: sessionStorage.CONSUMID,
            number: this.receiveContentData.count,
            operation: 3,
            date: dateFormatT(this.receiveContentData.receiveTime.getTime(), 'yyyy-MM-dd hh:mm:ss'),
            reason: this.receiveContentData.note,
            userId: this.receiveContentData.people,
            userName: this.receiveUser.filter(item => item.userId === this.receiveContentData.people)[0].name,
            userDeptName: this.receiveContentData.dept
          })
          this.receiveDialogVisible = false
          this.$store.dispatch('watchStorage')
          await this.getDetail()
          await this.getStorage()
          await this.getReceiveList()
          await this.getOutStorage()
        } else {
          return false
        }
      })
    },
    // 获取详情
    async getDetail () {
      const data = await this.$store.dispatch('assetDetail', { consumId: sessionStorage.CONSUMID })
      this.detailData = {
        name: data.name,
        code: data.code,
        totalCount: data.totalNum,
        restNum: data.restNum,
        typeId: data.typeId,
        typeName: data.typeName,
        spec: data.spec,
        brand: data.brand,
        price: data.price,
        userName: data.userName,
        supplier: data.supplier,
        remark: data.remark
      }
    },
    // 获取入库列表
    async getStorage () {
      const data = await this.$store.dispatch('inStorage', { consumId: sessionStorage.CONSUMID })
      this.storageData = data
    },
    // 获取报废列表
    async getOutStorage () {
      const data = await this.$store.dispatch('outStorage', { consumId: sessionStorage.CONSUMID })
      this.outStorageData = data.map(item => ({...item, modelNum: 0, number: 0 - Number(item.number)}))
    },
    // 获取领用列表
    async getReceiveList () {
      let data = await this.$store.dispatch('returnList', { consumId: sessionStorage.CONSUMID })
      this.receiveTableData = data.map(item => ({...item, modelNum: 0, number: 0 - Number(item.number)}))
    },
    userChange (val) {
      let data = this.receiveUser.filter(item => item.userId === val)[0].deptId
      this.receiveContentData.dept = this.receiveDept.filter(item => item.id === data)[0].name
    },
    // 获取领用人
    async getUser () {
      let data = await this.$store.dispatch('deptUserList')
      this.receiveDept = [...data.depts]
      this.receiveUser = [...data.users].map(item => ({...item, parentId: item.deptId}))
      this.peopleOptions = this.receiveUser
    }
  },
  watch: {
  },
  async created () {
    this.assetName = sessionStorage.ASSETNAME
    await this.getDetail()
    await this.getUser()
    setTimeout(() => {
      this.userPath = this.$store.state.user.loginUser.userFace
      this.userName = this.$store.state.user.loginUser.name
    }, 400)
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.asset-detail {
  min-width: 1200px;
  background: #EFF1F2;
  height: 100vh;
  &>header {
    height: 80px;
    line-height: 80px;
    background: linear-gradient(90deg, #5C6DF9, #558CFB);
    color: #fff;

    .el-row {
      width: 1200px;
      margin: 0 auto;
      .el-col:nth-child(1) {
        font-size: 24px;
        img {
          vertical-align: middle;
          margin-right: 10px;
        }
      }

      .el-col:nth-child(2) {
        text-align: right;
        .el-dropdown-link{
          cursor: pointer;
          display: inline-block;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #96BBF8;
          color: #fff;
          text-align: center;
          line-height: 36px;
          vertical-align: middle;
          img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            vertical-align: middle;
            cursor: pointer;
          }
        }
      }
    }
  }

  &>div:nth-child(2) {
    height: 60px;
    background: #fff;

    &>div {
      line-height: 60px;
      width: 1200px;
      margin: 0 auto;
      font-size: 16px;
    }
  }

  main {
    background: #EFF1F2;
    padding-bottom: 20px;
    .el-tabs {
      background: #fff;
      width: 1200px;
      margin: 20px auto 0;
      border: 1px solid #ddd;
      box-sizing: border-box;
      border-radius: 5px;

      .el-tabs__nav-scroll {
        margin: 10px 30px 0;
        .el-tabs__item {
          margin-bottom: 10px;
        }
      }

      .el-tabs__content {
        padding:20px;

        #pane-first {
          .el-row {
            margin-bottom: 20px;
            span {
              display: inline-block;
              width: 150px;
              text-align: right;
              font-size: 16px;
            }
            i {
              color: #B7B7B7;
              font-style: normal;
            }
          }
        }

        p {
          text-align: center;
        }

        .el-table {
          margin-top: 0;
        }
      }
    }

    .el-table {
      th {
        &:nth-child(3){
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }

  .el-dialog {
    .el-dialog__body {
      .el-form{
        .el-row{
          .el-col{
            &>span{
              display: inline-block;
              width: 80px;
              text-align: left;
            }
            .el-form-item{
              width: 65%;
              display: inline-block;
              .el-form-item__content{
                margin-left: 0 !important;
              }
            }

            .el-input {
              width: 200px;
            }
            .el-textarea {
              width: 470px;
            }
          }
        }
      }
    }
  }
}
</style>
