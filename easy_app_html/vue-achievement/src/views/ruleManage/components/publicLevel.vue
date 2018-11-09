<template>
  <div class="publicLevel common" v-loading="loading">
    <div class="box" @click="addNew">+</div>
    <div class="content-box" v-for="item in list" :key="item.title">
      <div class="content-box-head">发布等级</div>
      <div class="content-box-content">
        <p v-if="item.name.length > 17">{{ item.name.substring(0, 16) + '...' }}</p>
        <p v-else>{{item.name}}</p>
      </div>
      <div class="content-box-foot">
        <span class="spans" @click="lookDetails(item)">
          <img :src="type.check" alt="">
          <img :src="type.checking" alt="">
          <span class="tooltip">查看</span>
        </span>
        
        <span class="spans" @click="lookChange(item)">
          <img :src="type.edit" alt="">
          <img :src="type.editing" alt="">
          <span class="tooltip">编辑</span>
        </span>

        <span class="spans" @click="deleteDetails(item)">
          <img :src="type.delete" alt="">
          <img :src="type.deleteing" alt="">
          <span class="tooltip">删除</span>
        </span>
      </div>
    </div>

    <!--等级规则新增弹框-->
    <el-dialog
      class="addNewDialog"
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :show-close="false">
      <i class="el-icon-close close" @click="dialogShow = false"></i>
      <div class="dialog-table-content">
          <div class="levelName">
            <span>等级名称：</span>
            <el-input type="text" v-model="levelName" placeholder="等级名称不得超过20个字符" :maxlength="20"></el-input>
          </div>
          <div style="position: relative;" class="firstD">
            <span style="position: absolute;top: 0;right: 0px;"> 等级：</span>
          </div>
          <div class="onelevelP" v-for="(item, i) in subjectLists" :key="i" >
            <div class="oneLevel">
              <span>名称</span>
              <el-input type="text" v-model="item.detailName" :maxlength="6" :disabled="!item.enableShow"></el-input>
              <span>满分的</span>
              <el-input type="text" v-model="item.percent" :disabled="!item.enableShow"></el-input>
              <span v-if="i < subjectLists.length - 1">%及以上</span>
              <span v-else>%以下</span>
            </div>
            <el-switch
              :width="40"
              v-model="item.enableShow">
            </el-switch>
            <span v-if="item.enableShow">启用</span>
            <span v-if="!item.enableShow">停用</span>
          </div>
        </div>
        
      
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogShow = false">取 消</el-button>
          <el-button type="primary" @click="saveExamno">保 存</el-button>
        </span>
    </el-dialog>

    <!--查看弹框-->
    <el-dialog
      class="look-detail"
      :title="detailsTitle"
      :visible.sync="lookDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="lookDialog = false"></i>
      <div class="lookBox">
        <div class="onePa">
          <span class="leftF">等级名称:</span>
          <span>{{lookInfo.name}}</span>
        </div>
        <div class="onePa">
          <span class="leftF">等级:</span>
          <table class="tab">
            <tr v-for="(one, i) in lookInfo.listDetail" :key="i">
              <th>名称</th>
              <td>
                <span>{{one.detailName}}</span>
              </td>
              <th>满分的</th>
              <td>
                {{one.percent}}
                <span v-if="i < lookInfo.listDetail.length - 1">%及以上</span>
                <span v-else>%及以下</span>
              </td>
              <td class="last">
                <span v-if="one.enable == 1">启用</span>
                <span v-if="one.enable == 2">停用</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookChange(lookInfo)" >编 辑</el-button>
      </span>
    </el-dialog>

    <!--删除-->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="deleteDialog = false"></i>
      <span>确定要删除当前的等级规则吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteRule()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as type from '../../../assets/icons/index.js'
import querystring from 'querystring'
import { notice, success } from '../../../api/index.js'
export default {
  name: 'publicLevel',
  data () {
    return {
      levelName: '',
      open: true,
      subjectLists: [
        { type: 1, detailName: '优秀', percent: 0, enable: 1, enableShow: true },
        { type: 2, detailName: '良好', percent: 0, enable: 1, enableShow: true },
        { type: 3, detailName: '合格', percent: 0, enable: 1, enableShow: true },
        { type: 4, detailName: '待达标', percent: 0, enable: 1, enableShow: true }
      ],
      loading: false,
      dialogShow: false,
      lookDialog: false,
      deleteDialog: false,
      list: [],
      type,
      input: '',
      dialogTitle: '',
      detailsTitle: '查看等级规则',
      lookInfo: {
        name: '',
        detailList: []
      },
      modInfo: {
      },
      deleteId: '',
      publishId: '',
      edit: false
    }
  },
  created () {
    this.getExamnoList()
  },
  methods: {
    // 新增等级规则
    async addNew () {
      this.levelName = ''
      this.subjectLists = this.subjectLists.map(item => ({
        ...item,
        percent: 0,
        enable: 1,
        enableShow: true
      }))
      this.dialogTitle = '新增等级'
      this.dialogShow = true
    },
    // 查看详情
    lookDetails (item) {
      this.$https.get(`/rule/publishDetail?publishId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.lookInfo = res.data.result
        }
      })
      this.lookDialog = true
      this.lookInfo = item
    },
    // 编辑详情
    changeDetails () {
      this.dialogTitle = '编辑等级规则详情'
      this.dialogShow = true
    },
    // 删除详情
    deleteDetails (item) {
      this.deleteId = item.id
      this.deleteDialog = true
    },
    // 删除
    deleteRule () {
      this.$https.post('/rule/publishDelete', querystring.stringify({
        state: 0,
        publishId: this.deleteId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message || '删除成功', 2000)
        } else {
          notice(this, res.data.message || '删除失败', 2000)
        }
        this.deleteDialog = false
        this.getExamnoList()
      })
    },
    // 查看并编辑
    async lookChange (item) {
      if (item) {
        this.publishId = item.id
      }
      this.$https.get(`/rule/publishDetail?publishId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.levelName = item.name
          this.subjectLists = (res.data.result.listDetail || []).map(items => ({
            ...items,
            enableShow: items.enable === 1 ? Boolean(true) : Boolean(false)
          }))
        }
      })
      this.dialogTitle = '编辑等级规则详情'
      this.dialogShow = true
    },
    // 获取等级规则列表（新）
    getExamnoList () {
      this.loading = true
      this.$https.get(`/rule/publishList`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.list = res.data.result || []
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存等级规则
    saveExamno () {
      this.subjectLists = this.subjectLists.map(items => ({
        ...items,
        enable: items.enableShow ? 1 : 2
      }))
      if (this.levelName === '') {
        notice(this, '请填写等级名称', 2000)
        return
      }
      if (this.dialogTitle === '新增等级') {
        this.publishId = ''
      }
      this.$https.post(`/rule/publishSave`, querystring.stringify({
        publishId: this.publishId,
        name: this.levelName,
        rankPublishDetails: JSON.stringify(this.subjectLists)
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message || '保存成功', 2000)
          this.dialogShow = false
          this.lookDialog = false
          this.getExamnoList()
        } else {
          notice(this, res.data.message || '保存失败', 2000)
          return
        }
      })
    }
  },
  filters: {
    textLength (val) {
      if (val.length > 8) {
        return val.substring(0, 8) + '...'
      } else {
        return val
      }
    }
  }
}
</script>

<style lang="scss">
  .publicLevel {
    .addNewDialog {
      .el-dialog {
        width: 700px !important;
        max-height: 620px !important;
        .el-dialog__body {
          max-height: 500px !important;
        }
      }
    }
    .tool {
      padding-left: 10px;
      color: #bbb;
    }
    .box,.content-box {
      height: 180px !important;
    }
    .box {
      line-height: 180px !important;
    }
    .content-box {
      .content-box-content {
        line-height: 86px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    }
    // .schoolLists {
    //   max-height: 150px;
    //   overflow: auto;
    //   margin-bottom: 20px;
    // }
    .schoolNum {
      display: inline-block;
      width: 200px;
      margin-bottom: 10px;
      text-align: right;
      &>.el-input {
        width: 64px;
        .el-input__inner {
          height: 28px;
        }
      }
    }
    .gradeNum {
      display: inline-block;
      width: 130px;
      margin-bottom: 10px;
      margin-right: 10px;
      &>.el-input {
        width: 64px;
        .el-input__inner {
          height: 28px;
        }
      }
    }
    .dialog-table-input {
      .el-input__inner {
        width: 400px !important;
      }
    }
    .dialog-table-content {
      min-height: 200px;
      .firstD {
        display: inline-block;
        width: 73px;
        margin-bottom: 20px;
      }
      > .onelevelP {
        // display: inline-block;
        float: right;
        width: calc(100% - 77px);
        margin-bottom: 20px;
        line-height: 36px;

        > .oneLevel {
          display: inline-block;
          width: calc(100% - 100px);
          // height: 36px;
          background: #ccc;

          > .el-input {
            width: 90px;
            color: #333;
          }
          .el-input.is-disabled .el-input__inner {
            color: #333 !important;
          }

          > span {
            padding: 0 10px;
          }

          > span:last-child {
            padding: 0;
          }
        }

        > .el-switch {
          display: inline-block;
        }
        > span {
          float: right;
          vertical-align: middle;
        }

        .el-switch__label,.el-switch__label--left {
          display: none;
        }
      }

      > .levelName {
        height: 50px;
        line-height: 50px;
        margin-bottom: 20px;

        > .el-input {
          width: calc(100% - 170px);
        }
      }
    }
    .look-detail {
      .el-dialog--small {
        width: 600px !important;
        max-height: 600px;
        overflow: auto;
      }
      .el-dialog__body {
        min-height: 200px;
      }
      .lookBox {
        .onePa {
          width: 100%;
          margin-bottom: 20px;

          > .leftF {
            float: left;
            width: 80px;
            text-align: right;
            margin-right: 10px;
          }

          > .tab {
            float: right;
            width: calc(100% - 90px);

            td,th {
              border: 1px solid #ccc;
              height: 40px;
              text-align: center;
            }

            th {
              background: #efefef;
            }

            .last {
              // color: #20a0ff
            }
          }
        }
      }
    }

    .setTotal {
      .oneP {
        height: 50px;
        line-height: 50px;

        > .oneS {
          display: inline-block;
          width: 100px;
          text-align: right;
          margin-right: 20px;
        }

        > .el-input {
          width: 200px;
        }
      }
    }

    .el-dialog__footer {
      background: #fff;
    }
  }
</style>


