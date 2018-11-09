<template>
  <div id="basic-information">
    <main>

      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        
        <!-- 测评名称 -->
        <el-row>
          <el-col :span="3">测评名称：</el-col>
          <el-col :span="21">
            <el-form-item prop="name">
              <el-input :maxlength="50" v-model="ruleForm.name" placeholder="请输入测评名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 测评时间 -->
        <el-row>
          <el-col :span="3">测评时间：</el-col>
          <el-col :span="21">

            <el-form-item prop="startTime">
              <el-date-picker
                type="datetime"
                v-model="ruleForm.startTime"
                placeholder="起始时间"
                @change="startTimeChange">
              </el-date-picker> 
            </el-form-item>

            <span class="zhi">至</span>

            <el-form-item prop="endTime">
              <el-date-picker
                type="datetime"
                v-model="ruleForm.endTime"
                placeholder="结束时间"
                @change="endTimeChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <!-- 测评类型 -->
      <el-row>
        <el-col :span="3">测评类型：</el-col>
        <el-col :span="21">
          <el-radio-group v-model="radio">
            <el-radio :disabled="isDisabled" :label="1">任课教师测评</el-radio>
            <el-radio :disabled="isDisabled" :label="2">班主任测评</el-radio>
            <el-radio :disabled="isDisabled" :label="3">其他测评</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 查看结果 -->
      <el-row>
        <el-col :span="3">查看结果：</el-col>
        <el-col :span="21">
          <el-select v-model="lookResultValue" placeholder="请选择">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-checkbox v-model="checked">部门领导可查看其部门所有人员</el-checkbox>
        </el-col>
      </el-row>

      <!-- 实名/匿名 -->
      <el-row>
        <el-col :span="3">实名/匿名：</el-col>
        <el-col :span="21">
          <el-radio-group v-model="realNameValue">
            <el-radio :label="0">匿名</el-radio>
            <el-radio :label="1">实名</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 测评说明 -->
      <el-row>
        <el-col :span="3">测评说明：</el-col>
        <el-col :span="21">
          <el-input v-model="note" type="textarea" :rows="4"></el-input>
        </el-col>
      </el-row>

      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="nextStep('ruleForm')">下一步</el-button>
      </div>
    </main>
  </div>
</template>

<script>
import querystring from 'querystring'
import { notice, error } from '../../../api/index'
import { dateFormatT } from '../../../filters/index.js'
export default {
  name: 'basicInformation',
  data () {
    return {
      ruleForm: {
        name: '',
        startTime: '',
        endTime: ''
      },
      isDisabled: false,
      rules: {
        name: [
          {message: '请输入测评名称', required: true, trigger: 'blur'}
        ],
        startTime: [
          {type: 'date', message: '请选择起始时间', required: true, trigger: 'change'}
        ],
        endTime: [
          {type: 'date', message: '请选择结束时间', required: true, trigger: 'change'}
        ]
      },
      note: '',
      nowTime: '',
      realNameValue: 0,
      radio: 1,
      lookResultValue: 1,
      checked: false,
      option: [
        {value: 1, label: '可查看所有人'},
        {value: 2, label: '仅可查看自己'},
        {value: 3, label: '不可查看'}
      ]
    }
  },
  methods: {
    // 选择起始时间
    startTimeChange () {
      if (this.ruleForm.startTime) {
        if (this.ruleForm.endTime) {
          if (this.ruleForm.startTime.getTime() > this.ruleForm.endTime.getTime()) {
            notice(this, '起始日期应早于结束日期', 2000)
            this.ruleForm.startTime = ''
          }
        }
      }
    },
    // 选择结束时间
    endTimeChange () {
      if (this.ruleForm.endTime) {
        if (this.ruleForm.endTime.getTime() < this.nowTime) {
          notice(this, '结束日期应晚于当前日期', 2000)
          this.ruleForm.endTime = ''
          return
        }
        if (this.ruleForm.startTime) {
          if (this.ruleForm.startTime.getTime() > this.ruleForm.endTime.getTime()) {
            notice(this, '起始日期应早于结束日期', 2000)
            this.ruleForm.endTime = ''
          }
        }
      }
    },
    // 下一步
    nextStep (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let startTime = dateFormatT(this.ruleForm.startTime.getTime(), 'yyyy-MM-dd hh:mm:ss')
          let endTime = dateFormatT(this.ruleForm.endTime.getTime(), 'yyyy-MM-dd hh:mm:ss')
          let path = ''
          if (this.$route.query.id) {
            path = '/eval/updateBaseInfo'
            this.$https.post(`${path}`, querystring.stringify({
              id: JSON.parse(this.$route.query.id),
              name: this.ruleForm.name,
              starttime: startTime,
              endtime: endTime,
              viewState: this.lookResultValue,
              deptviewState: this.checked ? 1 : 0,
              realState: this.realNameValue,
              remark: this.note
            }))
            .then(res => {
              if (res.data.code === 1) {
                this.$store.dispatch('active')
                if (this.radio === 3) {
                  this.$router.push({path: '/assessmentManager/assessmentWay', query: {id: JSON.stringify(JSON.parse(this.$route.query.id))}})
                } else {
                  this.$router.push({path: '/assessmentManager/parameterSetting', query: {id: JSON.stringify(JSON.parse(this.$route.query.id))}})
                }
              } else if (res.data.code === -2) {
                notice(this, res.data.message, 2000)
              } else {
                notice(this, res.data.message, 2000)
              }
            })
          } else {
            path = '/eval/addBaseInfo'
            this.$https.post(`${path}`, querystring.stringify({
              name: this.ruleForm.name,
              starttime: startTime,
              endtime: endTime,
              evalType: this.radio,
              viewState: this.lookResultValue,
              deptviewState: this.checked ? 1 : 0,
              realState: this.realNameValue,
              remark: this.note
            }))
            .then(res => {
              if (res.data.code === 1) {
                this.$store.dispatch('active')
                if (this.radio === 3) {
                  let id = res.data.result
                  this.$router.push({path: '/assessmentManager/assessmentWay', query: {id: JSON.stringify(id)}})
                } else {
                  let id = res.data.result
                  this.$router.push({path: '/assessmentManager/parameterSetting', query: {id: JSON.stringify(id)}})
                }
              } else if (res.data.code === -2) {
                notice(this, res.data.message, 2000)
              } else {
                notice(this, res.data.message, 2000)
              }
            })
          }
        }
      })
    },
    // 取消
    cancel () {
      if (sessionStorage.isEdit === '2') {
        if (this.$route.query.id) {
          this.$https.post(`/eval/deleteEval`, querystring.stringify({
            id: this.$route.query.id
          }))
          .then(res => {
          })
        }
      }
      this.$router.push('/assessmentManager/index')
    }
  },
  created () {
    this.nowTime = new Date().getTime()
    if (this.$route.query.id) {
      this.isDisabled = true
      this.$https.get(`/eval/getBaseInfo?id=${JSON.parse(this.$route.query.id)}`)
      .then(res => {
        if (res.data.code === 1) {
          this.ruleForm.startTime = new Date(res.data.result.starttime)
          this.ruleForm.endTime = new Date(res.data.result.endtime)
          this.radio = res.data.result.evalType
          this.lookResultValue = res.data.result.viewState
          res.data.result.deptviewState === 1 ? this.checked = true : this.checked = false
          this.realNameValue = res.data.result.realState
          this.note = res.data.result.remark
          this.ruleForm.name = res.data.result.name
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#basic-information{

  // 主体信息
  main{
    margin: $width auto;
    width: 810px;
    padding-top: $width;

    &>.el-row:nth-child(2){
      margin-top: 0;
    }

    .el-row{
      margin-top: $width;
      line-height: 40px;
      font-size: 15px;
      color: #484848;

      .el-date-editor{
        width: 322px;
      }

      .zhi{
        margin: 0 $width;
      }

      .el-checkbox{
        margin-left: $width;

        .el-checkbox__inner{
          border-radius: 50%;
        }
      }

      .el-radio{
        margin-right: $width;
      }

      textarea{
        resize: none;
      }
    }
    .el-form{
      .el-form-item{
        display: inline-block;
      }

      .el-row:nth-child(1){
        .el-input{
          width: 710px;
        }
      }

      .el-row:nth-child(2){
        margin-top: 0;
      }
    }

    &>.button-group{
      padding:$width $width * 5;

      .el-button{
        padding: $width / 2 $width;
      }
    }
  }
}
</style>
