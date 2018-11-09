<template>
  <div id="edit-parameter-setting">
    <main>
      <!-- 评价表选择 -->
      <el-row>
        <el-col :span="3">评价表选择：</el-col>
        <el-col :span="21">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <!-- 评价范围 -->
      <el-row>
        <el-col :span="3">评价范围：</el-col>
        <el-col :span="21">
          <el-checkbox v-model="scopeCheckedAll">全选</el-checkbox>
          <el-checkbox v-for="(item, index) in gradeList" :key="index" v-model="item.checked">{{ item.name }}</el-checkbox>
        </el-col>
      </el-row>

      <!-- 科目 -->
      <el-row>
        <el-col :span="3">科目：</el-col>
        <el-col :span="21">
          <el-checkbox v-model="scopeCheckedAll">全选</el-checkbox>
          <el-checkbox v-for="(item, index) in subjectList" :key="index" v-model="item.checked">{{ item.name }}</el-checkbox>
        </el-col>
      </el-row>

      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="beforeStep">上一步</el-button>
        <el-button @click="save">保存</el-button>
        <el-button type="primary" @click="submit">提交审核</el-button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'editParameterSetting',
  data () {
    return {
      value: '',
      scopeCheckedAll: false,
      gradeList: [
        {checked: false, name: '初中1年级'},
        {checked: false, name: '初中2年级'},
        {checked: false, name: '初中3年级'}
      ],
      subjectList: [
        {checked: false, name: '语文'},
        {checked: false, name: '数学'},
        {checked: false, name: '英语'},
        {checked: false, name: '体育'},
        {checked: false, name: '政治'},
        {checked: false, name: '思品'},
        {checked: false, name: '历史'}
      ],
      option: [
        {value: 1, label: '列表1'},
        {value: 2, label: '列表2'},
        {value: 3, label: '列表3'}
      ]
    }
  },
  methods: {
    beforeStep () {
      this.$store.dispatch('active')
      this.$router.push('/assessmentManager/editBasicInformation')
    },
    cancel () {
      this.$router.push('/assessmentManager/index')
    },
    save () {},
    submit () {}
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#edit-parameter-setting{
  main{
    margin: $width auto;
    width: 810px;
    padding-top: $width;

    .el-row{
      margin-top: $width;
      line-height: 40px;
      font-size: 15px;
      color: #484848;

      .el-col:first-child{
        text-align: right;
      }

      .el-col:last-child{
        padding-left: $width;
        .el-checkbox{
          margin-left: 0;
          margin-right: $width*4;
        }
      }

      &:first-child{
        .el-input{
          width: 700px;
          
          .el-input__inner{
            text-align: center;
          }
        }
      }
    }

    // 按钮组
    .button-group{
      padding: $width*2 $width*6;
      .el-button{
        padding: $width/2 $width*1.2;
      }
    }
  }
}
</style>
