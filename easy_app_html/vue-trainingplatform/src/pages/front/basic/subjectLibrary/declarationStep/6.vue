<template>
  <div class="step-6">
    <p>课题设计论证
      <br>
      <span>
        <i>*</i>
        说明：请按4部分分项填写，总字数限2500字以内
      </span>
    </p>

    <div>
      <p>
        <el-button size="small" type="primary" @click="submitForm('contentData')" :disabled="canSave">
          保存
        </el-button>
      </p>

      <el-form :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">

        <el-row>
          <el-col :span="6" class="text-right">本课题国内外研究现状述评：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="resultOne"
              :rules="[
                { required: true, message: '本课题国内外研究现状述评不能为空'},
              ]"
            >
              <el-input type="textarea" :rows="4" v-model="contentData.resultOne" :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">选题的目的、意义：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="resultTwo"
              :rules="[
                { required: true, message: '选题的目的、意义不能为空'},
              ]"
            >
              <el-input type="textarea" :rows="4" v-model="contentData.resultTwo" :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">本课题研究的主要内容（研究的切入点、重要观点等）：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="resultThree"
              :rules="[
                { required: true, message: '本课题研究的主要内容（研究的切入点、重要观点等）不能为空'},
              ]"
            >
              <el-input type="textarea" :rows="4" v-model="contentData.resultThree" :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" class="text-right">研究方法、手段、途径等：</el-col>
          <el-col :span="18">
            <el-form-item
              prop="resultFour"
              :rules="[
                { required: true, message: '研究方法、手段、途径等不能为空'},
              ]"
            >
              <el-input type="textarea" :rows="4" v-model="contentData.resultFour" :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    
  </div>
</template>

<script>
import server from '../../../../../utils/axios'
import { success, notice } from '../../../../../api/index'
export default {
  name: 'step-6',
  data () {
    return {
      canSave: false,
      editId: '',
      contentData: {
        resultOne: '',
        resultTwo: '',
        resultThree: '',
        resultFour: ''
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editId) {
            this.edit()
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
      server.post('/frontTopicDeclareController/saveStepSix', {
        topicId: sessionStorage.SUBJECT_ID,
        researchStatus: this.contentData.resultOne,
        researchPurpose: this.contentData.resultTwo,
        researchContents: this.contentData.resultThree,
        researchMethod: this.contentData.resultFour
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '保存成功', 1000)
          this.getStepSix()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 修改
    edit () {
      this.canSave = true
      server.post('/frontTopicDeclareController/editStepSix', {
        id: this.editId,
        topicId: sessionStorage.SUBJECT_ID,
        researchStatus: this.contentData.resultOne,
        researchPurpose: this.contentData.resultTwo,
        researchContents: this.contentData.resultThree,
        researchMethod: this.contentData.resultFour
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '修改成功', 1000)
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 获取论证-第六步
    getStepSix () {
      server.get(`/frontTopicDeclareController/getStepSix?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result) {
            let data = res.data.result
            this.editId = data.id
            this.contentData = {
              resultOne: data.researchStatus,
              resultTwo: data.researchPurpose,
              resultThree: data.researchContents,
              resultFour: data.researchMethod
            }
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.editId) {
      next()
    } else {
      this.$confirm('您还没有创建课题设计论证，确定离开吗？', '提示', {
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
    this.getStepSix()
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-6{
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
  }

  .el-form{
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
      line-height: $width*2;
      font-size: 15px;
    }
    .el-form-item__content{
      margin-left: 0 !important;
      // padding-right: 50px;
    }
  }
}
</style>
