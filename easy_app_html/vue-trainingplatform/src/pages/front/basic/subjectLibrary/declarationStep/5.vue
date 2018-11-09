<template>
  <div class="step-5">
    <p>课题组成员“十二五”所承担课题
      <br>
      <span>
        <i>*</i>
        说明：可添加多项
      </span> 
    </p>

    <div>
      <p>
        <el-button size="small" type="primary" @click="dialogVisible = true">添加项目</el-button>
        <!-- <el-button type="primary" @click="submitForm('contentData')" :disabled="canSave">
          保存
        </el-button> -->
      </p>

       <el-table
        :data="tableData"
        stripe
        style="width: 800px">
        <el-table-column
          prop="underwriter"
          label="承担人"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="topicName"
          label="课题名称"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="课题类别"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="批准时间"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.ratifyTime | dateFormatT('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ratifyCompany"
          label="批准单位"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="是否已结题"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span :style="{color: scope.row.conclusionState === 1 ? '#AAE0A3' : '#7EB0F5'}">
              {{ scope.row.conclusionState === 1 ? '是' : '否' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="功能"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
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
          <el-col :span="6" class="text-right">承担人：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="name"
              :rules="[
                { required: true, message: '承担人不能为空'},
              ]"
            >
              <el-input v-model="contentData.name" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">课题名称：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="subjectName"
              :rules="[
                { required: true, message: '课题名称不能为空'},
              ]"
            >
              <el-input v-model="contentData.subjectName" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">课题类别：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="subjectType"
              :rules="[
                { required: true, message: '课题类别不能为空'},
              ]"
            >
              <el-select v-model="contentData.subjectType" placeholder="请选择课题类别">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">批准时间：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="approvalDate"
              :rules="[
                { required: true, message: '批准时间不能为空'},
              ]"
            >
              <el-date-picker
                v-model="contentData.approvalDate"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">批准单位：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="approvalCompany"
              :rules="[
                { required: true, message: '批准单位不能为空'},
              ]"
            >
              <el-input v-model="contentData.approvalCompany" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">是否已结题：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="isOver"
              :rules="[
                { required: true, message: '是否已结题不能为空'},
              ]"
            >
              <el-select v-model="contentData.isOver" placeholder="请选择">
                <el-option
                  v-for="item in overOption"
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
        <el-button size="small" type="primary" @click="submitForm('contentData')" :disabled="canSave">
          保存
        </el-button>
        <el-button size="small" type="danger" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import server from '../../../../../utils/axios'
import { dateFormatT } from '../../../../../filters/index'
import { success, notice } from '../../../../../api/index'
export default {
  name: 'step-5',
  data () {
    return {
      canSave: false,
      dialogVisible: false,
      contentData: {
        name: '',
        subjectName: '',
        subjectType: '',
        approvalDate: '',
        approvalCompany: '',
        isOver: ''
      },
      tableData: [],
      overOption: [
        { label: '是', value: 1 },
        { label: '否', value: 2 }
      ],
      options: []
    }
  },
  methods: {
    pickerOptions () {},
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    // 保存
    save () {
      this.canSave = true
      server.post('/frontTopicDeclareController/saveStepFive', {
        topicId: sessionStorage.SUBJECT_ID,
        topicTypeId: this.contentData.subjectType,
        underwriter: this.contentData.name,
        topicName: this.contentData.subjectName,
        ratifyTime: dateFormatT(this.contentData.approvalDate.getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
        ratifyCompany: this.contentData.approvalCompany,
        conclusionState: this.contentData.isOver
      })
      .then(res => {
        if (res.data.code === 1) {
          this.dialogVisible = false
          success(this, '保存成功', 1000)
          this.getStepFiveList()
          this.$refs['contentData'].resetFields()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 获取课题类别
    getTopicTypeList () {
      server.get('/frontTopicDeclareController/getTopicTypeList')
      .then(res => {
        if (res.data.code === 1) {
          this.options = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 删除
    del (val) {
      server.post('/frontTopicDeclareController/deleteStepFive', {
        stepFiveId: val.id
      })
      .then(res => {
        this.getStepFiveList()
      })
    },
    // 获取承担课题列表
    getStepFiveList () {
      server.get(`/frontTopicDeclareController/getStepFiveList?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.tableData.length !== 0) {
      next()
    } else {
      this.$confirm('您还没有创建课题组成员"十二五"所承担课题，确定离开吗？', '提示', {
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
    this.getTopicTypeList()
    this.getStepFiveList()
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-5{
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
    &>p:nth-child(1){
      text-align: right;
      padding: $width/2;
      font-size: 18px;
    }

    .el-table{
      margin: 0;
    }
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

    .el-input {
      width: 300px;
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
