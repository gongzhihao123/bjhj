<template>
  <div id="edit-assessment">
    <header>
      <span>基本信息</span>
      <span>创建测评方式</span>
      <span>参数设定</span>
    </header>
    <main>

      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        
        <!-- 测评名称 -->
        <el-row>
          <el-col :span="3">测评名称：</el-col>
          <el-col :span="21">
            <el-form-item prop="name">
              <span style="fontSize: 16px;">{{ruleForm.name}}</span>
              <!-- <el-input v-model="ruleForm.name" placeholder="请输入测评名称"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 测评时间 -->
        <el-row>
          <el-col :span="3">测评时间：</el-col>
          <el-col :span="21">

            <!-- <el-form-item prop="startTime">
              <el-date-picker
                type="datetime"
                v-model="ruleForm.startTime"
                placeholder="起始时间"
                @change="startTimeChange">
              </el-date-picker> 
            </el-form-item> -->
            <span>{{startTime | dateFormatT(('yyyy-MM-dd hh:mm'))}}</span>
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
            <el-radio disabled :label="1">本单位测评</el-radio>
            <el-radio disabled :label="2">跨单位测评</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 查看结果 -->
      <el-row>
        <el-col :span="3">查看结果：</el-col>
        <el-col :span="21">
          <span>{{lookResultValue}}</span>
          <!-- <el-select v-model="lookResultValue" placeholder="请选择"> -->
            <!-- <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option> -->
          <!-- </el-select> -->
          <el-checkbox disabled="" v-model="checked">部门领导可查看其部门所有人员</el-checkbox>
        </el-col>
      </el-row>

      <!-- 实名/匿名 -->
      <el-row>
        <el-col :span="3">实名/匿名：</el-col>
        <el-col :span="21">
          <el-radio-group v-model="realNameValue">
            <el-radio disabled :label="0">匿名</el-radio>
            <el-radio disabled :label="1">实名</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 测评说明 -->
      <el-row>
        <el-col :span="3">测评说明：</el-col>
        <el-col :span="21">
          <span>{{note}}</span>
          <!-- <el-input v-model="note" type="textarea" :rows="4"></el-input> -->
        </el-col>
      </el-row>

      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save('ruleForm')">保存</el-button>
      </div>
    </main>
  </div>
</template>

<script>
import querystring from 'querystring'
import { notice } from '../../../api/index'
import { dateFormatT } from '../../../filters/index.js'
export default {
  name: 'editAssessment',
  data () {
    return {
      ruleForm: {
        name: '',
        startTime: '',
        endTime: ''
      },
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
      startTime: '',
      note: '',
      realNameValue: 0,
      radio: 1,
      lookResultValue: 1,
      lookResultId: '',
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
        if (this.ruleForm.startTime) {
          if (this.ruleForm.startTime.getTime() > this.ruleForm.endTime.getTime()) {
            notice(this, '起始日期应早于结束日期', 2000)
            this.ruleForm.endTime = ''
          }
        }
      }
    },
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let endTime = dateFormatT(this.ruleForm.endTime.getTime(), 'yyyy-MM-dd hh:mm:ss')
          let path = ''
          if (this.$route.query.id) {
            path = '/eval/updateEndTime'
            this.$https.post(`${path}`, querystring.stringify({
              id: JSON.parse(this.$route.query.id),
              endtime: endTime
            }))
            .then(res => {
              if (res.data.code === 1) {
                this.$router.push('/assessmentManager/index')
                // this.$store.dispatch('active')
                // if (this.radio === 3) {
                //   this.$router.push({path: '/assessmentManager/assessmentWay', query: {id: JSON.stringify(JSON.parse(this.$route.query.id))}})
                // } else {
                //   this.$router.push({path: '/assessmentManager/parameterSetting', query: {id: JSON.stringify(JSON.parse(this.$route.query.id))}})
                // }
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
      this.$router.push('/assessmentManager/index')
    }
  },
  created () {
    if (this.$route.query.id) {
      this.$https.get(`/eval/getBaseInfo?id=${JSON.parse(this.$route.query.id)}`)
      .then(res => {
        if (res.data.code === 1) {
          this.ruleForm.startTime = new Date(res.data.result.starttime)
          this.startTime = res.data.result.starttime
          this.ruleForm.endTime = new Date(res.data.result.endtime)
          this.radio = res.data.result.evalType
          this.option.forEach((item, index) => {
            if (item.value === res.data.result.evalType) {
              this.lookResultValue = item.label
            }
          })
          this.lookResultId = res.data.result.evalType
          res.data.result.deptviewState === 1 ? this.checked = true : this.checked = false
          this.realNameValue = res.data.result.realState
          this.note = res.data.result.remark
          this.ruleForm.name = res.data.result.name
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
#edit-assessment{
  background: #fff;

  header{
    padding: $width / 2;
    height: 62px;
    box-sizing: border-box;
    border-bottom: 2px solid #DDDDDD;

    span{
      display: inline-block;
      width: 142px;
      height: 41px;
      font-size: 16px;
      line-height: 42px;
      text-align: center;

      &:first-child{
        color: #fff;
        width: 116px;
        background: url(../../../assets/images/left-tab-blue.png);
      }

      &:nth-child(2){
        color: #9A9A9A;
        margin-left: -6px;
        background: url(../../../assets/images/middle-tab.png);
      }

      &:last-child{
        color: #9A9A9A;
        width: 105px;
        margin-left: -6px;
        background: url(../../../assets/images/right-tab.png);
      }
    }
  }

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
