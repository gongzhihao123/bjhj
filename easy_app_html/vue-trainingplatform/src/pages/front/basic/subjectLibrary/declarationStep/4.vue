<template>
  <div class="step-4">
    <p>课题组成员相关研究成果
      <br>
      <span>
        <i>*</i>
        说明：可添加多人
      </span> 
    </p>

    <div>
      <p>
        <el-button size="small" type="primary" @click="dialogVisible = true">添加项目</el-button>
        <!-- <el-button size="small" type="primary" @click="submitForm('contentData')" :disabled="canSave">
          保存
        </el-button> -->
      </p>
      <el-table
        :data="tableData"
        stripe
        style="width: 800px">
        <el-table-column
          prop="achievementName"
          label="成果名称"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="createdUser"
          label="著作者"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="achievementShape"
          label="成果形式"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="成果类型"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-if="scope.row.achievementType === item.value" v-for="(item, index) in options" :key="index">
              {{ item.label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="publishCompany"
          label="出版单位"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="出版时间"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.publishTime | dateFormatT('yyyy-MM-dd') }}
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
          <el-col :span="5" class="text-right">成果名称：</el-col>
          <el-col :span="18">
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
          <el-col :span="5" class="text-right">著作者：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="author"
              :rules="[
                { required: true, message: '著作者不能为空'},
              ]"
            >
              <el-input v-model="contentData.author" :maxlength="20"></el-input>
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
              <el-input v-model="contentData.resultForm" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">成果类型：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="resultType"
              :rules="[
                { required: true, message: '成果类型不能为空'},
              ]"
            >
              <el-select v-model="contentData.resultType" placeholder="请选择">
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
          <el-col :span="5" class="text-right">出版单位：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="publishCompany"
              :rules="[
                { required: true, message: '出版单位不能为空'},
              ]"
            >
              <el-input v-model="contentData.publishCompany" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" class="text-right">出版时间：</el-col>
          <el-col :span="19">
            <el-form-item
              prop="publishTime"
              :rules="[
                { required: true, message: '出版时间不能为空'},
              ]"
            >
              <el-date-picker
                v-model="contentData.publishTime"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('contentData')" :disabled="canSave">
          保 存
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
  name: 'step-4',
  data () {
    return {
      dialogVisible: false,
      canSave: false,
      contentData: {
        resultName: '',
        author: '',
        resultForm: '',
        resultType: '',
        publishCompany: '',
        publishTime: ''
      },
      options: [
        { label: '专著', value: 1 },
        { label: '译著', value: 2 },
        { label: '研究报告', value: 3 },
        { label: '工具书', value: 4 },
        { label: '电脑软件', value: 5 },
        { label: '其他', value: 6 }
      ],
      tableData: []
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
      server.post('/frontTopicDeclareController/saveStepFour', {
        topicId: sessionStorage.SUBJECT_ID,
        achievementName: this.contentData.resultName,
        createdUser: this.contentData.author,
        achievementShape: this.contentData.resultForm,
        achievementType: this.contentData.resultType,
        publishCompany: this.contentData.publishCompany,
        publishTime: dateFormatT(this.contentData.publishTime.getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss')
      })
      .then(res => {
        if (res.data.code === 1) {
          this.dialogVisible = false
          this.getStepFourList()
          success(this, '保存成功', 1000)
          this.$refs['contentData'].resetFields()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 删除
    del (val) {
      server.post('/frontTopicDeclareController/deleteStepFour', {
        stepFourId: val.id
      })
      .then(res => {
        this.getStepFourList()
      })
    },
    // 获取研究成果列表
    getStepFourList () {
      server.get(`/frontTopicDeclareController/getStepFourList?topicId=${sessionStorage.SUBJECT_ID}`)
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
      this.$confirm('您还没有创建课题组成员相关研究成果，确定离开吗？', '提示', {
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
    this.getStepFourList()
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-4{

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
        width: 320px;
      }
    }
    .el-row:nth-child(3){
      .el-col:last-child{
        line-height: 40px;
      }
    }
    .text-right{
      text-align: left;
      line-height: $width*2;
      font-size: 15px;
    }
    .el-form-item__content{
      margin-left: 0 !important;
      padding-right: 100px;
    }
  }
}
</style>
