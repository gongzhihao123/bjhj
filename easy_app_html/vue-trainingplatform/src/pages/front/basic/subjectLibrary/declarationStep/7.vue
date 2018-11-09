<template>
  <div class="step-7">
    <p>前期工作参阅的主要文献
      <br>
      <span>
        <i>*</i>
        说明：可添加多项
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
          prop="titleName"
          label="题目"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="materialShape"
          label="资料形式"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="journalName"
          label="报刊名称"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="publishTime"
          label="发表（出版）日期"
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
          <el-col :span="6" class="text-right">题目：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="title"
              :rules="[
                { required: true, message: '题目不能为空'},
              ]"
            >
              <el-input v-model="contentData.title" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">作者：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="author"
              :rules="[
                { required: true, message: '作者不能为空'},
              ]"
            >
              <el-input v-model="contentData.author" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">资料形式：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="dataForm"
              :rules="[
                { required: true, message: '资料形式不能为空'},
              ]"
            >
              <el-input v-model="contentData.dataForm" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">报刊名称：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="NewspaperName"
              :rules="[
                { required: true, message: '报刊名称不能为空'},
              ]"
            >
              <el-input v-model="contentData.NewspaperName" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">发表出版日期：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="publishTime"
              :rules="[
                { required: true, message: '发表出版日期不能为空'},
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
  name: 'step-7',
  data () {
    return {
      dialogVisible: false,
      canSave: false,
      tableData: [],
      contentData: {
        title: '',
        author: '',
        dataForm: '',
        NewspaperName: ''
      }
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
      server.post('/frontTopicDeclareController/saveStepSeven', {
        topicId: sessionStorage.SUBJECT_ID,
        titleName: this.contentData.title,
        author: this.contentData.author,
        materialShape: this.contentData.dataForm,
        journalName: this.contentData.NewspaperName,
        publishTime: dateFormatT(this.contentData.publishTime.getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss')
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '保存成功', 1000)
          this.dialogVisible = false
          this.getStepSevenList()
          this.$refs['contentData'].resetFields()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 删除
    del (val) {
      server.post('/frontTopicDeclareController/deleteStepSeven', {
        stepSevenId: val.id
      })
      .then(res => {
        this.getStepSevenList()
      })
    },
    // 获取承担课题列表
    getStepSevenList () {
      server.get(`/frontTopicDeclareController/getStepSevenList?topicId=${sessionStorage.SUBJECT_ID}`)
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
      this.$confirm('您还没有创建前期工作参阅的主要文献，确定离开吗？', '提示', {
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
    this.getStepSevenList()
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-7{
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

      .el-input {
        width: 300px;
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
