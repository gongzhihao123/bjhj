<template>
  <div id="edit-basic-information">
    <main>
      <!-- 测评名称 -->
      <el-row>
        <el-col :span="3">测评名称：</el-col>
        <el-col :span="21">
          <el-input placeholder="请输入测评名称"></el-input>
        </el-col>
      </el-row>

      <!-- 测评时间 -->
      <el-row>
        <el-col :span="3">测评时间：</el-col>
        <el-col :span="21">
          <el-date-picker
            type="datetime"
            placeholder="起始时间">
          </el-date-picker>
          <span class="zhi">至</span>
          <el-date-picker
            type="datetime"
            placeholder="结束时间">
          </el-date-picker>
        </el-col>
      </el-row>

      <!-- 测评类型 -->
      <el-row>
        <el-col :span="3">测评类型：</el-col>
        <el-col :span="21">
          <el-radio-group v-model="radio">
            <el-radio :label="3">任课教师测评</el-radio>
            <el-radio :label="6">班主任测评</el-radio>
            <el-radio :label="9">其他测评</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 查看结果 -->
      <el-row>
        <el-col :span="3">查看结果：</el-col>
        <el-col :span="21">
          <el-select v-model="value" placeholder="请选择">
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
            <el-radio :label="3">匿名</el-radio>
            <el-radio :label="6">实名</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 测评说明 -->
      <el-row>
        <el-col :span="3">测评说明：</el-col>
        <el-col :span="21">
          <el-input type="textarea" :rows="4"></el-input>
        </el-col>
      </el-row>

      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'editBasicInformation',
  data () {
    return {
      realNameValue: '',
      radio: '',
      value: '',
      checked: false,
      option: [
        {value: 1, label: '不可查看'},
        {value: 2, label: '尽可查看自己'},
        {value: 3, label: '可查看所有人'}
      ]
    }
  },
  methods: {
    nextStep () {
      this.$store.dispatch('active')
      this.$router.push('/assessmentManager/editParameterSetting')
    },
    cancel () {
      this.$router.push('/assessmentManager/index')
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#edit-basic-information{

  // 主体信息
  main{
    margin: $width auto;
    width: 810px;
    padding-top: $width;

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

    &>.button-group{
      padding:$width $width * 5;
      
      .el-button{
        padding: $width / 2 $width;
      }
    }
  }
}
</style>
