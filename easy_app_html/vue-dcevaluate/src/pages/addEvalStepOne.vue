<template>
  <div id="addEvalStepOne">
    <div class="common">
        <p class="create-title" v-if="evalId == 0">创建民主测评</p>
        <p class="create-title" v-if="evalId != 0">编辑民主测评</p>
        <div>
          <p>
            <label>测评模板 :</label>
            <el-select v-model="tempId" placeholder="请选择测评模板" class="input">
              <el-option
                v-for="(item) in templates"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
          <p>
            <label>测评名称 :</label>
            <el-input type="text" v-model="name" class="input" placeholder="请输入测评名称"></el-input>
          </p>
          <div class="btn">
            <el-button type="success" @click="nextStep()" class="green">保存</el-button>
            <el-button @click="back()">返回</el-button>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import service from '../api/index'
import { error, warning } from '../utils/common'

export default {
  name: 'addEvalStepOne',
  data () {
    return {
      evalId: 0,
      tempId: '',
      name: '',
      templates: []
    }
  },
  methods: {
    // 初始化数据
    initData () {
      this.getTemplate()
      if (this.evalId && this.evalId > 0) {
        this.getEvalDetail()
      }
    },
    // 获取模板信息
    async getTemplate () {
      const res = await service.getTemplateList()
      if (res && res.code === 1) {
        this.templates = res.result
      }
    },
    // 获取测评内容
    async getEvalDetail () {
      const res = await service.getEvalStepOne(this.evalId)
      if (res && res.code === 1) {
        let _eval = res.result
        if (_eval) {
          this.tempId = _eval.tempId
          this.name = _eval.name
        }
      } else {
        error(res.message)
      }
    },
    back () {
      this.$router.push({path: '/manager'})
    },
    nextStep () {
      // 判断是否选择身份
      let id = this.evalId
      let name = this.name
      let tempId = this.tempId
      if (tempId && tempId > 0) {
      } else {
        warning('请选择测评模板')
        return
      }
      if (name && name.length > 0) {
      } else {
        warning('请输入测评名称')
        return
      }
      if (id && id > 0) {
      } else {
        id = null
      }
      this.addEvalStepOne(id, name, tempId)
    },
    async addEvalStepOne (id, name, tempId) {
      const res = await service.addEvalStepOne(id, name, tempId)
      if (res && res.code === 1) {
        this.evalId = res.result
        this.$router.push({path: '/addEvalStepTwo', query: {id: this.evalId}})
      }
    }
  },
  created () {
    this.evalId = this.$route.query.id || 0
    this.initData()
  }
}
</script>
<style lang="scss">
@import '../assets/scss/variable.scss';
#addEvalStepOne {
  * {
    user-select:none;
  }
  input,textarea {
    outline-color:#19b955;
  }
  .green {
    background: #19b955;
    border-color: #19b955;
    color: #fff;
  }
  .red {
    background: #ff494b;
    border-color: #ff494b;
    color: #fff;
  }
  .el-radio__input.is-checked .el-radio__inner{
    background: #19b955;
    border-color: #19b955;
  }
  .box {
    overflow: auto;
  }
  .create-title {
    width: 100%;
    font-size: 16px;
    border-left: 3px solid #19b955;
    padding-left: 10px;
    font-weight: bold;
    color: #333;
  }
  label{
    margin-right: 10px;
  }
  .sample.el-input{
    .el-input__inner{
      margin-top:10px;
      width:590px;
      height:40px;
    }
  }
  .el-input {
    border: 0;
    width: 270px;
    height: 40px;
  }
  .el-button:active {
    opacity: 0.8;
  }
  .el-button.is-active {
    border-color: #19b955;
    color: #19b955;
  }
  .el-input__inner{
    display: inline-block;
    width: 270px;
    height: 40px;
    border: 1px solid #e8e8e8;
    color: #333;
    .el-input__icon.el-icon-caret-top{
      border-color: #e8e8e8;
    }
  }
  .common {
    min-height: 530px;
    border: 1px solid #e8e8e8;
    margin-top: 20px;
    margin-bottom: 140px;
    background: #fff;
    padding: 20px;
    &>div {
        margin:20px 10px;
        p {
          margin-top: 20px;
        }
        .ident {
          margin-right: 20px;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          cursor: pointer;

          &.active {
            background: #19b955;
            color: #fff;
            border-color: #19b955;
          }
        }
      }
  }
  .btn {
    margin-top: 64px;
    margin-left: 88px;
    .el-button {
      width: 102px;
      height: 36px;
    }
    .save:hover{
      opacity: 0.8;
      color: #fff;
    }
  }
}
</style>
