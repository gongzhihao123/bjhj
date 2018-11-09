<template>
  <div class="addPlan">
    <div class="table-box" v-loading="loading">
      <span v-show="$route.query.checkState == 3" style="display: inline-block;color: red;margin-left: 60px;padding-bottom: 10px;">提示：当前阶段报告状态为建议修改， 请重新建立课题计划</span>
      <table>
        <tr>
          <th v-for="item in tableNaV" :key="item.name">{{item.name}}</th>
        </tr>
        <tr v-for="(item, index) in tableList" :key="item.phasesName">
          <td>{{item.phasesName}}</td>
          <td>{{item.startTime | dateFormat('yyyy-MM-dd')}} 至 {{item.stopTime | dateFormat('yyyy-MM-dd')}}</td>
          <td>{{item.importantActivity}}</td>
          <td>
            <el-button @click="changeInfo(item, index)" type="primary" :disabled="$route.query.signFlag == 3 || !item.disabled || $route.query.checkState == 2">编辑</el-button>
          </td>
        </tr>
        <tr v-if="!tableList.length">
          <td colspan="4" style="text-align:center">暂无数据</td>
        </tr>
      </table>
    </div>

    <!-- 编辑 -->
    <el-dialog :title="dialogTitle" :visible.sync="addplanDialog">
      <div>
        <p class="dialogP">
          <span class="label-span">时间安排：</span>
          <el-date-picker
            disabled
            class="levelInputs"
            v-model="date[0]"
            type="date"
            placeholder="开始日期">
          </el-date-picker>至
          <el-date-picker
            :disabled="isLast == 1"
            class="levelInputs"
            v-model="date[1]"
            type="date"
            placeholder="结束日期">
          </el-date-picker>
        </p>
        <p class="dialogP"><span class="label-span">重要活动安排：</span><el-input class="levelInput" v-model="activeContent"></el-input></p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addplanDialog = false">取 消</el-button>
        <el-button type="primary" @click="addPlanSure" :disabled="canSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import service from '../../../../../../utils/axios.js'
import {notice} from '../../../../../../api/index'
import { dateFormat } from '../../../../../../filters/index.js'
export default {
  name: 'addPlan',
  data () {
    return {
      loading: false,
      activeContent: '',
      dialogTitle: '',
      addplanDialog: false,
      date: [
        '',
        ''
      ],
      tableNaV: [
        {name: '阶段'},
        {name: '时间安排'},
        {name: '重要活动安排'},
        {name: '操作'}
      ],
      tableList: [],
      checkedAll: false,
      canSave: false,
      infoId: '',
      isOne: false,
      isLast: false,
      modIndex: 0,
      modItem: {}
    }
  },
  methods: {
    changeInfo (item, index) {
      this.isOne = index === 0 ? 1 : 0
      this.isLast = index === 3 ? 1 : 0
      this.modIndex = index
      this.modItem = { ...item }
      this.infoId = item.id
      this.date[0] = item.startTime
      this.date[1] = item.stopTime
      this.activeContent = item.importantActivity
      this.dialogTitle = '编辑'
      this.addplanDialog = true
    },
    addPlanSure () {
      if (!this.date || !this.date.length || !this.date[0] || !this.date[1]) {
        notice(this, '请选择时间安排', 2000)
        return
      }
      if (typeof this.date[0] !== 'number') {
        this.date[0] = Date.parse(this.date[0])
      }
      if (typeof this.date[1] !== 'number') {
        this.date[1] = Date.parse(this.date[1])
      }
      if (this.date[0] >= this.date[1]) {
        notice(this, '结束时间应该大于开始时间', 2000)
        return
      }
      if (this.modIndex > 0) {
        if (Date.parse(this.tableList[this.modIndex - 1].stopTime) > this.date[0]) {
          notice(this, '该阶段的开始时间不能小于上个阶段的结束时间', 2000)
          return
        }
      }
      if (this.modIndex < this.tableList.length - 1) {
        if (Date.parse(this.tableList[this.modIndex + 1].stopTime) < this.date[1]) {
          notice(this, '该阶段的结束时间不能大于下个阶段的结束时间', 2000)
          return
        }
        if (Date.parse(this.tableList[this.tableList.length - 1].stopTime) < this.date[1]) {
          notice(this, '该阶段的结束时间不能大于结题阶段的结束时间', 2000)
          return
        }
      }
      this.canSave = true
      service.post(`/frontTopicManageController/updatePhases`, ({
        id: this.infoId,
        startTime: dateFormat(this.date[0], 'yyyy-MM-dd HH:mm:ss'),
        stopTime: dateFormat(this.date[1], 'yyyy-MM-dd HH:mm:ss'),
        importantActivity: this.activeContent
      }))
      .then(res => {
        this.canSave = false
        if (res.data.code === 1) {
          this.addplanDialog = false
          this.getList()
        }
      })
      this.addplanDialog = false
    },
    getList () {
      this.loading = true
      service.get(`/frontTopicManageController/selectPhasesList?tptopId=${this.$route.query.item}`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.tableList = (res.data.result || []).map(item => ({
            ...item,
            disabled: false,
            startTime: dateFormat(item.startTime, 'yyyy-MM-dd'),
            stopTime: dateFormat((item.createdTime && Number(item.checkState) === 1) ? item.createdTime : item.stopTime, 'yyyy-MM-dd')
          }))
          this.tableList.forEach((item, i) => {
            if (i > 0) {
              if (this.tableList[i - 1].startTime && this.tableList[i - 1].stopTime) {
                this.$set(this.tableList[i], 'disabled', true)
                this.$set(this.tableList[i], 'startTime', this.tableList[i - 1].stopTime)
              }
            } else {
              this.$set(this.tableList[i], 'disabled', true)
            }
            if (i < this.tableList.length - 1) {
              if (i > 0) {
                if (i === this.tableList.length - 1) {
                  if (!this.tableList[i - 1].stopTime) {
                    this.tableList[i].startTime = ''
                  }
                } else {
                  if (!this.tableList[i - 1].stopTime) {
                    this.tableList[i].startTime = ''
                    this.tableList[i].stopTime = ''
                  }
                }
              }
              if (Date.parse(this.tableList[i].stopTime) < Date.parse(this.tableList[i].startTime)) {
                this.tableList[i].stopTime = ''
              }
            }
          })
          this.tableList[0].startTime = dateFormat(this.tableList[0].lxTime, 'yyyy-MM-dd')
          this.tableList[this.tableList.length - 1].stopTime = dateFormat(this.tableList[0].jsTime, 'yyyy-MM-dd')
        } else {
          notice(this, res.data.message || '获取失败', 2000)
        }
        this.loading = false
      })
      .catch(_ => {
        this.loading = false
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss">
.addPlan {
  width: 100%;
  height: 100%;
  background: #fff;

  .table-box {
    margin-bottom: 30px;
    padding: 20px;

    table {
      width: 100%;
      margin: 0 auto;
      tr {
        cursor:　pointer;
        &:hover {
          background: #F1F3F9;
          
          td {
            color: #5295EB;
            &:first-child {
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
            &:nth-child(9){
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            }
          }
        }
        &:nth-child(1) {
          background: #EBEEF7;
          border-radius: 4px;

          th {
            font-size: normal;
            padding-top: 12px;
            padding-bottom: 12px;

            &:first-child {
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
            &:nth-child(4){
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            }
          }
        }        
        td {
            padding-top: 12px;
            padding-bottom: 12px;
            color: #999999;

            &>.el-button {
              padding: 6px 15px;
              &>span {
                width: 38px;
                display: inline-block;
                text-align: center;
              }
            }
        }
        td,th {
          text-align: left;

          &:nth-child(1) {
            padding-left: 10px;
          }
        }
        th {
          font-weight: normal;
        }
      }
    }
  }
  .add-btn {
    margin-top: 30px;
    margin-left: 60px;
  }
  .el-dialog {
    width: 550px;
    .dialogP {
      height: 50px;
      line-height: 50px;
    }
    .label-span {
      display: inline-block;
      width: 110px;
      text-align: right;
    }
    .levelInput {
      width: 350px;
      margin-left: 3px;
    }
    .levelInputs {
      width: 164px;
      // margin-left: 10px;
    }
    .datePicker {
      margin-left: 6px;
      width: 144px;
    }
  }
}
</style>
