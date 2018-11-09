<template>
  <div id="look-details">
    <header>
      <span>{{ ruleForm.name }}</span>
    </header>
    <main>

      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        
        <!-- 测评名称 -->
        <!-- <el-row>
          <el-col :span="4">测评名称：</el-col>
          <el-col :span="20">
            <el-form-item prop="name">
              <span style="fontSize: 16px;">{{ruleForm.name}}</span>
            </el-form-item>
          </el-col>
        </el-row> -->

        <!-- 测评时间 -->
        <el-row>
          <el-col :span="4">测评时间：</el-col>
          <el-col :span="20">
            <span>{{ startTime | dateFormatT(('yyyy-MM-dd hh:mm')) }}</span>
            <span class="zhi">至</span>
            <span>{{ endTime | dateFormatT(('yyyy-MM-dd hh:mm')) }}</span>
          </el-col>
        </el-row>

      </el-form>

      <!-- 测评类型 -->
      <el-row>
        <el-col :span="4">测评类型：</el-col>
        <el-col :span="20">
          <el-radio-group v-model="radio">
            <el-radio disabled  :label="1">任课教师测评</el-radio>
            <el-radio disabled  :label="2">班主任测评</el-radio>
            <el-radio disabled  :label="3">其他测评</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 查看结果 -->
      <el-row>
        <el-col :span="4">查看结果：</el-col>
        <el-col :span="20">
          <span>{{ lookResultValue }}</span>
          <el-checkbox disabled="" v-model="checked">部门领导可查看其部门所有人员</el-checkbox>
        </el-col>
      </el-row>

      <!-- 实名/匿名 -->
      <el-row>
        <el-col :span="4">实名/匿名：</el-col>
        <el-col :span="20">
          <el-radio-group v-model="realNameValue">
            <el-radio disabled :label="0">匿名</el-radio>
            <el-radio disabled :label="1">实名</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 测评说明 -->
      <el-row>
        <el-col :span="4">测评说明：</el-col>
        <el-col :span="20">
          <span>{{ note }}</span>
        </el-col>
      </el-row>

      <!-- 评价表 -->
      <el-row v-if="radio !== 3">
        <el-col :span="4">&nbsp;&nbsp;&nbsp;&nbsp;评价表：</el-col>
        <el-col :span="20">
          <span>{{ tableName }}</span>
        </el-col>
      </el-row>

      <!-- 测评范围 -->
      <el-row v-if="radio !== 3">
        <el-col :span="4">测评范围：</el-col>
        <el-col :span="20">
          <span style="margin-right: 20px;" v-for="(item, index) in gradeList" :key="index">
            {{ item.gradeName }}
          </span>
        </el-col>
      </el-row>

      <!-- 科目 -->
      <el-row v-if="radio === 1">
        <el-col :span="4">
          <span  style="margin-left: 30px;">
            科目：
          </span>
        </el-col>
        <el-col :span="20">
          <span style="margin-right: 20px;" v-for="(item, index) in subjectList" :key="index">
            {{ item.subjectName }}
          </span>
        </el-col>
      </el-row>

    </main>
    <div v-if="radio === 3" class="assessment-group-list">
      <el-row>
        <el-col v-for="(item, index) in listTitle" :key="index" :span="item.num">{{ item.name }}</el-col>
      </el-row>
      <el-row v-for="(item, index) in list" :key="index">
        <el-col :span="4">
          {{ index + 1 }}
        </el-col>
        <el-col :span="4">
          <el-popover
            placement="top"
            width="200"
            v-if="item.usersContent.length >= 13" 
            trigger="hover"
            :content="item.usersContent">
            <span slot="reference">{{item.usersContent.slice(0, 13) + '...'}}</span>
          </el-popover>
          <span v-if="item.usersContent.length < 13">{{ item.usersContent }}</span>
        </el-col>
        <el-col :span="4">
          {{ item.modeName }}
        </el-col>
        <el-col :span="4">
          {{ item.weight }}
        </el-col>
        <el-col :span="4">
          <el-popover
            placement="top"
            width="200"
            trigger="hover"
            v-if="item.teachersContent.length >= 13"
            :content="item.teachersContent">
            <span slot="reference">{{item.teachersContent.slice(0, 13) + '...'}}</span>
          </el-popover>
          <span v-if="item.teachersContent.length < 13">{{ item.teachersContent }}</span>
        </el-col>
        <el-col :span="4">
          {{ item.tableName }}
        </el-col>
      </el-row>
      
    </div>
    <div class="button-group">
      <el-button @click="cancel" size="large">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'
export default {
  name: 'lookDetails',
  data () {
    return {
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          {message: '请输入测评名称', required: true, trigger: 'blur'}
        ]
      },
      startTime: '',
      endTime: '',
      note: '',
      realNameValue: 0,
      radio: '',
      lookResultValue: 1,
      lookResultId: '',
      checked: false,
      option: [
        {value: 1, label: '可查看所有人'},
        {value: 2, label: '仅可查看自己'},
        {value: 3, label: '不可查看'}
      ],
      list: [],
      listTitle: [
        {name: '编号', num: 4},
        {name: '被测评人', num: 4},
        {name: '测评方式', num: 4},
        {name: '权重', num: 4},
        {name: '测评人', num: 4},
        {name: '测评表', num: 4}
      ],
      gradeList: [],
      subjectList: [],
      tableName: ''
    }
  },
  methods: {
    // 取消
    cancel () {
      let parameter = {
        pageNo: JSON.parse(this.$route.query.parameter).pageNo,
        pageSize: JSON.parse(this.$route.query.parameter).pageSize
      }
      this.$router.push({path: `/assessmentManager/index`, query: {parameter: JSON.stringify(parameter)}})
    },
    // 获取测评组列表
    getGroupList () {
      this.$https.get(`/eval/getGroupList?evalId=${JSON.parse(this.$route.query.parameter).id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result
          this.list.forEach((item, index) => {
            item.usersContent = []
            item.users.forEach((child) => {
              item.usersContent.push(child.userName)
            })
            item.usersContent = item.usersContent.join('、')
            item.teachersContent = []
            item.studentsList = []
            if (item.teachers.length !== 0) {
              item.teachers.forEach((child) => {
                item.teachersContent.push(child.userName)
              })
            } else {
              item.students.forEach((child) => {
                item.studentsList.push({gradeId: child.gradeId, gradeName: child.gradeName, id: child.classId, userName: child.gradeName + child.className})
                item.teachersContent.push(child.gradeName + child.className)
              })
            }
            item.teachersContent = item.teachersContent.join('、')
          })
        }
      })
    },
    // 获取基本信息
    getBaseInfo () {
      this.$https.get(`/eval/getBaseInfo?id=${JSON.parse(this.$route.query.parameter).id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.startTime = res.data.result.starttime
          this.endTime = res.data.result.endtime
          this.radio = res.data.result.evalType
          this.option.forEach((item, index) => {
            if (item.value === res.data.result.viewState) {
              this.lookResultValue = item.label
            }
          })
          this.lookResultId = res.data.result.evalType
          res.data.result.deptviewState === 1 ? this.checked = true : this.checked = false
          this.realNameValue = res.data.result.realState
          this.note = res.data.result.remark
          this.ruleForm.name = res.data.result.name
          if (this.radio === 3) {
            this.getGroupList()
          } else {
            this.getTeacherParam()
          }
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取任课老师、班主任-参数设置信息
    getTeacherParam () {
      this.$https.get(`/eval/getTeacherParam?evalId=${JSON.parse(this.$route.query.parameter).id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result.grades
          this.subjectList = res.data.result.subjects
          this.tableName = res.data.result.tableName
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    console.log(JSON.parse(this.$route.query.parameter).id)
    this.getBaseInfo()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#look-details{
  background: #fff;
  padding-bottom: 20px;

  header{
    padding: $width / 2;
    box-sizing: border-box;
    text-align: center;

    span{
      display: inline-block;
      font-size: 18px;
    }
  }
  // 主体信息
  main{
    margin: 0 auto;
    width: 610px;
    padding-top: $width;
    padding-bottom: $width;

    .el-row{
      margin-top: 0;
    }

    .el-row{
      // margin-top: $width;
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
         margin-bottom: 0;
      }
    }

    &>.button-group{
      text-align: center;
    }
  }

  // 测评组信息
  .assessment-group-list{
    border: 1px solid #E3E3E3;
    background: #F7F7F7;
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 40px;
    
    &>.el-row:first-child{
      border-bottom: 1px solid #ddd;
    }
  }

  .button-group{
    margin-top: 20px;
    text-align: center;
  }
}
</style>
