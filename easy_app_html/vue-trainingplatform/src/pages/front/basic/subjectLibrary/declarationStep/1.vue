<template>
  <div class="step-1">
    <p>课题内容</p>
    <p>
      <el-button size="small" type="primary" @click="submitForm('contentData')" :disabled="canSave">
        保存
      </el-button>
    </p>
    <el-form :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">

      <el-row>
        <el-col :span="4" class="text-right">课题名称：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="name"
            :rules="[
              { required: true, message: '课题名称不能为空'},
            ]"
          >
            <el-input type="name" :maxlength="50" v-model.trim="contentData.name"></el-input>
            
            <span class="message">
              <i>*</i>
              不超过40字 
            </span>

          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">关键词：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="keyword"
            :rules="[
              { required: true, message: '关键词不能为空'},
            ]"
          >
            <el-input type="keyword" v-model.trim="contentData.keyword" :maxlength="30"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">课题指南名称：</el-col>
        <el-col :span="20">
          <span class="border">
            {{ guideName }}
          </span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">课题级别：</el-col>
        <el-col :span="20">
          <span class="border">
            区级课题
          </span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">课题类别：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="subjectTypeValue"
            :rules="[
              { required: true, message: '课题类别不能为空'},
            ]"
          >
            <el-select v-model="contentData.subjectTypeValue" placeholder="请选择课题类别">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.typeName"
                :value="item.id">
              </el-option>
            </el-select>

            <span class="message">
              <i>*</i>
              跨学科的课题，请选为主的学科填写 
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">单位：</el-col>
        <el-col :span="20">
          <span class="border">
            {{ user ? user.companyName : ''}}
          </span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">预期研究成果：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="result"
            :rules="[
              { required: true, message: '预期研究成果不能为空'},
            ]"
          >
            <el-checkbox v-for="(item, index) in exceptResultList" :key="index" v-model="item.value">
              {{ item.name }}
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">预计完成时间：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="dateValue"
            :rules="[
              { required: true, message: '预计完成时间不能为空'},
            ]"
          >
            <el-date-picker
              v-model="contentData.dateValue"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
  </div>
</template>

<script>
import server from '../../../../../utils/axios'
import { success, notice } from '../../../../../api/index'
import { mapGetters } from 'vuex'
import { dateFormatT } from '../../../../../filters/index'
export default {
  name: 'step-1',
  data () {
    return {
      canSave: false,
      radioValue: 3,
      guideName: '',
      contentData: {
        name: '',
        keyword: '',
        subjectTypeValue: '',
        dateValue: '',
        result: ''
      },
      editId: '',
      changeObject: {},
      exceptResultList: [
        { name: '专著', value: false, id: 1 },
        { name: '译著', value: false, id: 2 },
        { name: '研究报告', value: false, id: 3 },
        { name: '工具书', value: false, id: 4 },
        { name: '电脑软件', value: false, id: 5 },
        { name: '其他', value: false, id: 6 }
      ],
      options: []
    }
  },
  methods: {
    submitForm (formName) {
      this.contentData.result = this.exceptResultList.filter(item => item.value === true).map(n => n.id).join(',')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (sessionStorage.IS_CHANGE === '1') {
            this.change()
          } else {
            if (this.editId) {
              this.editTopic()
            } else {
              this.saveTopic()
            }
          }
        } else {
          return false
        }
      })
    },
    // 获取课题类别
    getTopicTypeList () {
      server.get(`/frontTopicDeclareController/getTopicTypeList?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          this.options = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 变更
    change () {
      sessionStorage.ONESTEPCONTENT = JSON.stringify({
        name: this.contentData.name,
        guideId: this.$route.query.id,
        keyword: this.contentData.keyword,
        topicLevel: '区级课题',
        topicTypeId: this.contentData.subjectTypeValue,
        companyName: this.user.companyName,
        wishResult: this.contentData.result,
        wishFinishTime: String(this.contentData.dateValue).length === 13 ? dateFormatT(Number(this.contentData.dateValue), 'yyyy-MM-dd hh:mm:ss') : dateFormatT(this.contentData.dateValue, 'yyyy-MM-dd hh:mm:ss'),
        topicCode: this.changeObject.topicCode,
        clickNum: this.changeObject.clickNum,
        referralsState: this.changeObject.referralsState
      })
      success(this, '保存成功', 1000)
    },
    // 保存
    saveTopic () {
      this.canSave = true
      server.post('/frontTopicDeclareController/saveTopic', {
        name: this.contentData.name,
        guideId: this.$route.query.id,
        keyword: this.contentData.keyword,
        topicLevel: '区级课题',
        topicTypeId: this.contentData.subjectTypeValue,
        companyName: this.user.companyName,
        wishResult: this.contentData.result,
        wishFinishTime: dateFormatT(this.contentData.dateValue.getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss')
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '保存成功', 1000)
          this.getTopic()
          sessionStorage.SUBJECT_ID = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 修改
    editTopic () {
      this.canSave = true
      server.post('/frontTopicDeclareController/editTopic', {
        id: this.editId,
        name: this.contentData.name,
        guideId: this.$route.query.id,
        keyword: this.contentData.keyword,
        topicLevel: '区级课题',
        topicTypeId: this.contentData.subjectTypeValue,
        companyName: this.user.companyName,
        wishResult: this.contentData.result,
        wishFinishTime: String(this.contentData.dateValue).length === 13 ? dateFormatT(Number(this.contentData.dateValue), 'yyyy-MM-dd hh:mm:ss') : dateFormatT(this.contentData.dateValue.getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss')
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '修改成功', 1000)
          sessionStorage.SUBJECT_ID = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 获取课题内容-第一步
    getTopic () {
      server.get(`/frontTopicDeclareController/getTopic?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          this.changeObject = res.data.result
          this.editId = res.data.result.id
          let data = res.data.result
          this.contentData = {
            name: data.name,
            keyword: data.keyword,
            subjectTypeValue: data.topicTypeId,
            dateValue: data.wishFinishTime,
            result: data.wishResult
          }
          this.exceptResultList.forEach((item) => {
            if (data.wishResult.indexOf(item.id) !== -1) {
              item.value = true
            }
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 变更获取内容-第一步
    selectStateOne () {
      server.get(`/frontTopicManageController/selectStateOne?id=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          sessionStorage.changeId = JSON.stringify(res.data.result.changeId)
          this.changeObject = res.data.result.tpTopic
          this.editId = res.data.result.tpTopic.id
          let data = res.data.result.tpTopic
          this.contentData = {
            name: data.name,
            keyword: data.keyword,
            subjectTypeValue: data.topicTypeId,
            dateValue: data.wishFinishTime,
            result: data.wishResult
          }
          this.exceptResultList.forEach((item) => {
            if (data.wishResult.indexOf(item.id) !== -1) {
              item.value = true
            }
          })
          sessionStorage.ONESTEPCONTENT = JSON.stringify({
            name: this.contentData.name,
            guideId: this.$route.query.id,
            keyword: this.contentData.keyword,
            topicLevel: '区级课题',
            topicTypeId: this.contentData.subjectTypeValue,
            companyName: this.user.companyName,
            wishResult: this.contentData.result,
            wishFinishTime: this.contentData.dateValue,
            topicCode: this.changeObject.topicCode,
            clickNum: this.changeObject.clickNum,
            referralsState: this.changeObject.referralsState
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    if (sessionStorage.SUBJECT_ID) {
      if (sessionStorage.IS_CHANGE === '1') {
        if (sessionStorage.ONESTEPCONTENT) {
          let obj = JSON.parse(sessionStorage.ONESTEPCONTENT)
          this.changeObject = obj
          this.contentData = {
            name: obj.name,
            keyword: obj.keyword,
            subjectTypeValue: obj.topicTypeId,
            dateValue: obj.wishFinishTime,
            result: obj.wishResult
          }
          this.exceptResultList.forEach((item) => {
            if (obj.wishResult.indexOf(item.id) !== -1) {
              item.value = true
            }
          })
        } else {
          server.get(`/frontTopicManageController/selectStateThree?id=${sessionStorage.SUBJECT_ID}`)
          .then(res => {
            if (res.data.code === 1) {
              sessionStorage.NINESTEPCONTENT = JSON.stringify(res.data.result.stepNineList)
            } else {
              notice(this, res.data.message, 2000)
            }
          })
          this.selectStateOne()
        }
      } else {
        this.getTopic()
      }
    }
    this.getTopicTypeList()
    server.get(`/frontTopicDeclareController/getGuideList?pageNo=${1}&pageSize=${200}`)
    .then(res => {
      if (res.data.code === 1) {
        this.guideName = res.data.result.list.filter(item => item.id === Number(this.$route.query.id))[0].name
      }
    })
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-1{
  
  &>p:nth-child(2){
    text-align: right;
    padding: $width;
    font-size: 18px;
  }

  &>p:nth-child(1){
    text-align: center;
    padding: 17px;
    font-size: 20px;
    background: #F8F9FC;
    border-bottom: #EDF1F4; 
  }

  .el-form{
    padding-left: 20px;
    .el-row{
      .el-col:last-child{
        padding-left: $width;
        padding-bottom: 22px;
        line-height: 40px;

        .el-form-item{
          margin-bottom: 0;
          
          .message {
            margin-left: 30px;
            color: #B3B3B3;
            i {
              color: red;
            }
          }
        }
      }

      .el-input {
        width: 360px;
      }

      .border {
        display: inline-block;
        width: 360px;
        line-height: 38px;
        box-sizing: border-box;
        border: 1px solid #D8DCE5;
        border-radius: 4px;
        padding-left: 15px;
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
      // padding-right: 100px;
    }
  }
}
</style>
