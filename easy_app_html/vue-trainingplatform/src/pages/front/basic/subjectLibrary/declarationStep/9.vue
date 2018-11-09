<template>
  <div class="step-9">
    <p>预期研究成果
      <br>
      <span>
        <i>*</i>
        说明：可添加多项，最终成果至少添加一项
      </span> 
    </p>

    <div>
      
      <p style="padding-top: 0;">主要阶段成果 <i>*</i> <span>限报8项</span>
        <el-button size="small" type="primary" @click="dialogVisible = true">添加项目</el-button>
      </p>
      <el-table
        :data="anticipationTableData"
        stripe
        style="width: 800px">
        <el-table-column
          prop="startTime"
          label="开始时间"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.startTime | dateFormatT('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="stopTime"
          label="结束时间"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.stopTime | dateFormatT('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="achievementName"
          label="阶段性成果名称"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="成果形式"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-for="(item, index) in options" :key="index" v-if="Number(scope.row.achievementShape) === item.value"> {{ item.label }} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="underwriter"
          label="承担人"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="操作"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="del(scope.row, scope.$index, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <p>最终阶段成果 <i>*</i> <span>限报2项</span> </p>
      <el-table
        :data="endTableData"
        stripe
        style="width: 800px">
        <el-table-column
          prop="startTime"
          label="开始时间"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.startTime | dateFormatT('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="stopTime"
          label="结束时间"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.stopTime | dateFormatT('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="achievementName"
          label="最终研究成果名称"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="成果形式"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-for="(item, index) in options" :key="index" v-if="Number(scope.row.achievementShape) === item.value"> {{ item.label }} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="underwriter"
          label="承担人"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="操作"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="del(scope.row, scope.$index, 2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="添加项目"
      :visible.sync="dialogVisible"
      width="483px">
      <el-form v-if="dialogVisible" :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">

        <el-row>
          <el-col :span="5" class="text-right">起止时间：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="time"
              :rules="[
                { required: true, message: '起止时间不能为空'},
              ]"
            >
              <el-date-picker
                v-model="contentData.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">成果名称：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="resultName"
              :rules="[
                { required: true, message: '成果名称不能为空'},
              ]"
            >
              <el-input v-model="contentData.resultName" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">成果形式：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="resultForm"
              :rules="[
                { required: true, message: '成果形式不能为空'},
              ]"
            >
              <el-select v-model="contentData.resultForm" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">承担人：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="underwriter"
              :rules="[
                { required: true, message: '承担人不能为空'},
              ]"
            >
              <el-input v-model="contentData.underwriter" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">成果类型：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="achievementType"
              :rules="[
                { required: true, message: '成果类型不能为空'},
              ]"
            >
              <el-select v-model="contentData.achievementType" placeholder="请选择">
                <el-option
                  v-for="item in resultOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm('contentData')" :disabled="canSave">
          保存
        </el-button>
        <el-button size="small" type="danger" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import server from '../../../../../utils/axios'
import { success, notice } from '../../../../../api/index'
import { dateFormatT } from '../../../../../filters/index'
export default {
  name: 'step-9',
  data () {
    return {
      dialogVisible: false,
      canSave: false,
      contentData: {
        time: '',
        resultName: '',
        resultForm: '',
        underwriter: '',
        achievementType: ''
      },
      options: [
        { label: '专著', value: 1 },
        { label: '译著', value: 2 },
        { label: '研究报告', value: 3 },
        { label: '工具书', value: 4 },
        { label: '电脑软件', value: 5 },
        { label: '其他', value: 6 }
      ],
      resultOptions: [
        { label: '主要阶段成果', value: 1 },
        { label: '最终阶段成果', value: 2 }
      ],
      anticipationTableData: [],
      endTableData: []
    }
  },
  methods: {
    pickerOptions () {},
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.contentData.achievementType === 1) {
            if (this.anticipationTableData.length >= 8) {
              notice(this, '主要阶段成果限报8项', 2000)
              return false
            }
          } else {
            if (this.endTableData.length >= 2) {
              notice(this, '最终阶段成果限报2项', 2000)
              return false
            }
          }
          if (sessionStorage.IS_CHANGE === '1') {
            this.saveStateThree()
          } else {
            this.save()
          }
        } else {
          return false
        }
      })
    },
    // 保存
    save () {
      this.canSave = true
      server.post('/frontTopicDeclareController/saveStepNine', {
        topicId: sessionStorage.SUBJECT_ID,
        startTime: dateFormatT(this.contentData.time[0].getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
        stopTime: dateFormatT(this.contentData.time[1].getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
        achievementName: this.contentData.resultName,
        achievementShape: this.contentData.resultForm,
        underwriter: this.contentData.underwriter,
        achievementType: this.contentData.achievementType
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '保存成功', 1000)
          this.getStepNineList()
          this.dialogVisible = false
          this.$refs['contentData'].resetFields()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 删除
    del (val, index, para) {
      if (sessionStorage.IS_CHANGE === '1') {
        if (para === 1) {
          this.anticipationTableData.splice(index, 1)
        } else {
          this.endTableData.splice(index, 1)
        }
        sessionStorage.NINESTEPCONTENT = JSON.stringify(this.anticipationTableData.concat(this.endTableData))
      } else {
        server.post('/frontTopicDeclareController/deleteStepNine', {
          stepNineId: val.id
        })
        .then(res => {
          this.getStepNineList()
        })
      }
    },
    // 变更
    saveStateThree () {
      this.canSave = true
      let arr = JSON.parse(sessionStorage.NINESTEPCONTENT)
      arr.push({
        id: null,
        topicId: sessionStorage.SUBJECT_ID,
        startTime: dateFormatT(this.contentData.time[0].getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
        stopTime: dateFormatT(this.contentData.time[1].getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
        achievementName: this.contentData.resultName,
        achievementShape: this.contentData.resultForm,
        underwriter: this.contentData.underwriter,
        achievementType: this.contentData.achievementType
      })
      this.anticipationTableData = arr.filter(item => item.achievementType === 1)
      this.endTableData = arr.filter(item => item.achievementType === 2)
      sessionStorage.NINESTEPCONTENT = JSON.stringify(arr)
      this.$refs['contentData'].resetFields()
      this.canSave = false
      this.dialogVisible = false
      // server.post('/frontTopicManageController/saveStateThree', {
      //   id: sessionStorage.SUBJECT_ID,
      //   startTime: dateFormatT(this.contentData.time[0].getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
      //   stopTime: dateFormatT(this.contentData.time[1].getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
      //   achievementName: this.contentData.resultName,
      //   achievementShape: this.contentData.resultForm,
      //   underwriter: this.contentData.underwriter,
      //   achievementType: this.contentData.achievementType
      // })
      // .then(res => {
      //   if (res.data.code === 1) {
      //     success(this, '保存成功', 1000)
      //     this.selectStateThree()
      //     this.$refs['contentData'].resetFields()
      //   } else {
      //     notice(this, res.data.message, 2000)
      //   }
      //   this.canSave = false
      // })
    },
    // 获取承担课题列表
    getStepNineList () {
      server.get(`/frontTopicDeclareController/getStepNineList?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          this.anticipationTableData = res.data.result.filter(item => item.achievementType === 1)
          this.endTableData = res.data.result.filter(item => item.achievementType === 2)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 变更获取列表
    selectStateThree () {
      server.get(`/frontTopicManageController/selectStateThree?id=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          sessionStorage.NINESTEPCONTENT = JSON.stringify(res.data.result.StepNineList)
          this.anticipationTableData = res.data.result.StepNineList.filter(item => item.achievementType === 1)
          this.endTableData = res.data.result.StepNineList.filter(item => item.achievementType === 2)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.anticipationTableData.length !== 0 && this.anticipationTableData.length !== 0) {
      next()
    } else {
      this.$confirm('您还没有创建预期研究成果，确定离开吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    }
  },
  created () {
    if (sessionStorage.IS_CHANGE === '1') {
      if (sessionStorage.NINESTEPCONTENT) {
        this.anticipationTableData = JSON.parse(sessionStorage.NINESTEPCONTENT).filter(item => item.achievementType === 1)
        this.endTableData = JSON.parse(sessionStorage.NINESTEPCONTENT).filter(item => item.achievementType === 2)
      } else {
        this.selectStateThree()
      }
    } else {
      this.getStepNineList()
    }
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-9{
  &>p:nth-child(1){
    text-align: center;
    padding: 17px;
    font-size: 20px;
    background: #F8F9FC;
    border-bottom: #EDF1F4;
    &>span {
      font-size: 14px;
      color: #B8B8B8;

      i {
        color: red;
      }
    }
  }

  &>div {
    padding: 0 20px 20px;
    &>p {
      margin: 20px 0;
      font-size: 16px;
      .el-button {
        float: right;
      }
      &>i {
        margin-left: 20px;
        color: red;
      }
      &>span{
        color: #BEBEBE;
        font-size: 14px;
      }
    }
    .el-table{
      margin: 0;
    }
  }
  .el-dialog__body {
    width: 375px;
  }

  .el-form{
    margin-top: $width;
    .el-row{
      .el-col:last-child{
        padding-left: $width;
        padding-bottom: 22px;
        line-height: 40px;

        .el-form-item{
          margin-bottom: 0;
        }
      }
      .el-input {
        width: 347px;
      }
    }
    .el-row:nth-child(3){
      .el-col:last-child{
        line-height: 40px;
      }
    }
    .text-right{
      text-align: right;
      line-height: $width*2;
      font-size: 15px;
    }
    .el-form-item__content{
      margin-left: 0 !important;
      padding-right: 100px;
    }
  }

  .el-dialog {
    .el-dialog__body {
      padding: 0 20px;
    }

    .el-dialog__footer {
      text-align: center;
    }

    .el-dialog__close {
      position: absolute;
      top: -60px;
      right: -60px;
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 50%;
      border: 2px solid #fff; 
      color: #fff;

      &:hover {
        background: #FF6C60;
      }
    }
  }
}
</style>
