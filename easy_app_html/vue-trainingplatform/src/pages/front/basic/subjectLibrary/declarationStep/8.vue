<template>
  <div class="step-8">
    <p>完成课题的条件和保证
      <br>
      <span>
        <i>*</i>
        说明：建议5000字以内
      </span> 
    </p>

    <p>
      <el-button type="primary" size="small" @click="submitForm('contentData')" :disabled="canSave">
        保存
      </el-button>
    </p>

    <el-form :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">

      <el-row>
        <el-col :span="24" class="text-right">
          课题负责人和主要成员完成本课题的研究能力；完成本课题的时间、资料、设备及研究手段等。
        </el-col>
        <el-col :span="24">
          <el-form-item
            prop="content"
            :rules="[
              { required: true, message: '请填写完成课题的条件和保证'},
            ]"
          >
            <el-input type="textarea" :rows="20" v-model="contentData.content" :maxlength="5000"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

  </div>
</template>

<script>
import server from '../../../../../utils/axios'
import { success, notice } from '../../../../../api/index'
export default {
  name: 'step-8',
  data () {
    return {
      canSave: false,
      contentData: {
        content: ''
      },
      editId: ''
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
      server.post('/frontTopicDeclareController/saveStepEight', {
        topicId: sessionStorage.SUBJECT_ID,
        content: this.contentData.content
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '保存成功', 1000)
          this.getStepEight()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 修改
    edit () {
      this.canSave = true
      server.post('/frontTopicDeclareController/editStepEight', {
        id: this.editId,
        topicId: sessionStorage.SUBJECT_ID,
        content: this.contentData.content
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
    getStepEight () {
      server.get(`/frontTopicDeclareController/getStepEight?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result) {
            this.contentData.content = res.data.result.content
            this.editId = res.data.result.id
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
      this.$confirm('您还没有创建完成课题的条件和保证，确定离开吗？', '提示', {
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
    this.getStepEight()
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-8{
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

  &>p:nth-child(2){
    text-align: right;
    padding: $width/2;
    font-size: 18px;
  }

  .el-form{
    .el-row{
      .el-col:last-child{
        padding-left: $width;
      }
    }
    .text-right{
      font-size: 15px;
      margin: 0 0 $width $width;
      color: #9D9D9D;
    }
    .el-form-item__content{
      margin-left: 0 !important;
      padding-right: 20px;
    }
  }
}
</style>
