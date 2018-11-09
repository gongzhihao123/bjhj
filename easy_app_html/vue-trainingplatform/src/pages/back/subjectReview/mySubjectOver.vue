<template>
  <div class="my-subject-over">
    <header>
      结题
    </header>

    <main>
      <div class="data-list">
        <el-button type="primary" @click="add">新增</el-button>
        <el-table
          :data="tableData"
          border
          stripe>
          <el-table-column
            prop="name"
            label="结题鉴定人"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="role"
            label="角色"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="company"
            label="所属单位"
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
              <el-button @click="edit(scope.row, scope.$index)"> 编辑 </el-button>
              <el-button @click="del(scope.row, scope.$index)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="signed-type signed-advice">
        <!-- 结题方式 -->
        <span>
          结题方式：
        </span>
        <el-select v-model="typeValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="signed-type signed-advice">
        <!-- 结题方式 -->
        <span>
          结题鉴定书：
        </span>
        <el-upload
          class="upload-demo"
          :action="action"
          :on-success="success"
          :show-file-list="false"
          :before-upload="beforeUpload">
          <el-button type="primary">浏览...</el-button>
          <span slot="tip" class="el-upload__tip" style="margin-left: 20px;font-size: 16px;">  {{ fileName ? fileName : '未选择文件' }}</span>
        </el-upload>
      </div>

      <div class="signed-advice">
        <!-- 结题申请 -->
        <span>
          是否同意结题：
        </span>
        <el-radio-group v-model="radioValue">
          <el-radio :label="1">同意</el-radio>
          <el-radio :label="2">不同意</el-radio>
          <el-radio :label="3">建议修改</el-radio>
        </el-radio-group>
      </div>

      <el-form :model="contentData" :rules="rules" ref="contentData" label-width="100px" class="demo-ruleForm signed-time">
        <el-row v-if="radioValue === 3">
          <span>再次提交期限：</span>
          <el-form-item
            prop="dateValue"
          >
            <el-date-picker
              v-model="contentData.dateValue"
              type="date"
              :picker-options="pickerOptions"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        
      </el-form>
      
      <div class="signed-advice">
        <!-- 结题申请 -->
        <span>
          鉴定意见：
        </span>
        <el-input type="textarea" :maxlength="30" v-model="opinion" :rows="3"></el-input>
      </div>

      <footer>
        <el-button type="primary" size="small" @click="submitForm('contentData')">提交</el-button>
        <el-button size="small" @click="$router.push('/subjectReview/backMySubject')">返回</el-button>
      </footer>
    </main>

    <!-- 弹出框 -->
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
      width="655px">
      
      <el-form :model="dialogData" ref="dialogData" label-width="100px" class="demo-ruleForm" v-if="dialogVisible">
        <el-row>
          <el-col :span="7" class="text-right">结题鉴定人：</el-col>
          <el-col :span="17">
            <el-form-item
              prop="name"
              :rules="[
                { required: true, message: '结题鉴定人不能为空'},
              ]"
            >
              <el-input v-model.trim="dialogData.name" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="7" class="text-right">角色：</el-col>
          <el-col :span="17">
            <el-form-item
              prop="role"
              :rules="[
                { required: true, message: '角色不能为空'},
              ]"
            >
              <el-input v-model.trim="dialogData.role" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7" class="text-right">所属单位：</el-col>
          <el-col :span="17">
            <el-form-item
              prop="company"
              :rules="[
                { required: true, message: '所属单位不能为空'},
              ]"
            >
              <el-input v-model.trim="dialogData.company" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFormDialog('dialogData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import server from '../../../utils/axios'
import { notice } from '../../../api/index'
import { mapActions } from 'vuex'
import { dateFormat } from '../../../filters/index.js'
export default {
  name: 'my-subject-over',
  data () {
    return {
      num: '',
      isEdit: false,
      fileId: '',
      action: '',
      opinion: '',
      detail: '',
      dialogVisible: false,
      typeValue: 1,
      fileList: [],
      radioValue: 1,
      rules: {dateValue: [{ required: true, message: '再次提交期限不能为空' }]},
      tableData: [],
      contentData: {
        dateValue: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      fileName: '',
      dialogData: {
        name: '',
        role: '',
        company: ''
      },
      options: [
        { label: '会议结题', value: 1 },
        { label: '通讯结题', value: 2 }
      ]
    }
  },
  methods: {
    ...mapActions([
      'remind'
    ]),
    submitForm (formName) {
      if (this.radioValue !== 3) {
        this.rules.dateValue[0].required = false
      } else {
        this.rules.dateValue[0].required = true
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.savePhasesSign()
          this.saveConclusion()
        } else {
          return false
        }
      })
    },
    submitFormDialog (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.tableData.splice(this.num, 1, { name: this.dialogData.name, role: this.dialogData.role, company: this.dialogData.company })
          } else {
            this.tableData.push({ name: this.dialogData.name, role: this.dialogData.role, company: this.dialogData.company })
          }
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    add () {
      this.dialogVisible = true
      this.isEdit = false
      this.dialogData = {
        name: '',
        role: '',
        company: ''
      }
    },
    edit (val, index) {
      this.num = index
      this.isEdit = true
      this.dialogVisible = true
      this.dialogData = {
        name: val.name,
        role: val.role,
        company: val.company
      }
    },
    del (val, index) {
      this.tableData.splice(index, 1)
    },
    // 审核签署意见
    savePhasesSign () {
      server.post(`/backPhaseCheckController/savePhasesSign`, {
        phasesId: this.detail.phasesId,
        checkId: this.detail.checkId,
        topicId: this.$route.query.id,
        checkState: this.radioValue,
        opinion: this.opinion,
        submitTime: this.contentData.dateValue ? dateFormat(this.contentData.dateValue + 86399000, 'yyyy-MM-dd HH:mm:ss') : ''
      })
      .then(res => {
        if (res.data.code === 1) {
          this.remind('1')
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存结题内容
    saveConclusion () {
      server.post(`/backPhaseCheckController/saveConclusion`, {
        topicId: this.$route.query.id,
        appraiser: JSON.stringify(this.tableData),
        conclusionType: this.typeValue,
        fileId: this.fileId
      })
      .then(res => {
        if (res.data.code === 1) {
          this.$router.push('/subjectReview/backMySubject')
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取详情
    getTopicScoreDetail () {
      server.get(`/backPhaseCheckController/getTopicScoreDetail?topicId=${this.$route.query.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.detail = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 上传之前的钩子
    beforeUpload (file) {
      if (file.name.indexOf('doc') === -1) {
        this.$message.error('请上传word文档')
        return false
      }
    },
    // 上传成功的钩子
    success (res, file) {
      this.fileId = res.result.fileId
      this.fileName = file.name
    }
  },
  mounted () {
    var path = document.getElementById('contextPath').value
    this.action = `${path}/frontTopicDeclareController/uploadImage`
  },
  created () {
    this.getTopicScoreDetail()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.my-subject-over{
  padding-bottom: $width;
  header{
    line-height: 56px;
    font-size: 18px;
  }

  main{
    background: #fff;
    padding: $width;

    // 列表
    .data-list{
      margin: 0 0 $width 0;
    }

    .signed-advice{
      margin-bottom: $width;
      &>span{
        display: inline-block;
        width: 150px;
        text-align: right;
      }
      .el-radio-group{
        margin-left: $width;
      }
      .el-textarea{
        width: 700px;
        margin-left: $width;
      }
    }

    .signed-type{
      .el-select{
        margin-left: $width;
      }
      .upload-demo{
        display: inline-block;
        margin-left: $width;
      }
    }

    .signed-time{
      .el-row{
        &>span{
          display: inline-block;
          width: 150px;
          text-align: right;
        }
        .el-form-item{
          display: inline-block;
          .el-form-item__content{
            margin-left: $width !important;
          }
        }
      }
    }

    footer{
      margin-top: $width;
    }
  }

  .el-dialog{
    .el-dialog__body{
      padding: $width*2 $width*5;
      padding-left: $width*2;
      .text-right{
        text-align: right;
        line-height: $width*2;
        font-size: 16px;
      }
      .el-form-item__content{
        margin-left: 20px !important;
      }
      .upload-demo{
        margin-left: $width;
        .el-button{
          margin-right: $width;
        }
      }
    }
  }
}
</style>
