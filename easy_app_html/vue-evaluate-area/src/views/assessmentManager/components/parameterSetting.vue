<template>
  <div id="parameter-setting">
    <main>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <!-- 评价表选择 -->
        <el-row>
          <el-col :span="3">评价表选择：</el-col>
          <el-col :span="21">
            <el-form-item prop="value">
              <el-select v-model="ruleForm.value" placeholder="请选择">
                <el-option
                  v-for="item in option"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 评价范围 -->
      <el-row>
        <el-col :span="3">评价范围：</el-col>
        <el-col :span="21">
          <el-checkbox v-model="gradeCheckedAll" @change="selectAllGrade">全选</el-checkbox>
          <el-checkbox v-for="(item, index) in gradeList" @change="selectGrade(item)" :key="index" v-model="item.checked">{{item.name}}</el-checkbox>
        </el-col>
      </el-row>

      <!-- 科目 -->
      <el-row v-if="evalType === 1">
        <el-col :span="3">科目：</el-col>
        <el-col :span="21">
          <el-checkbox v-model="subjectCheckedAll" @change="selectAllSubject">全选</el-checkbox>
          <el-checkbox v-for="(item, index) in subjectList" @change="selectSubject(item)" :key="index" v-model="item.checked">{{item.curriculumName}}</el-checkbox>
        </el-col>
      </el-row>

      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="beforeStep">上一步</el-button>
        <el-button @click="save('ruleForm')">保存</el-button>
        <el-button type="primary" @click="submit('ruleForm')">提交审核</el-button>
      </div>
    </main>
  </div>
</template>

<script>
import { notice, success } from '../../../api/index'
import querystring from 'querystring'
export default {
  name: 'parameterSetting',
  data () {
    return {
      evalType: '',
      ruleForm: {
        value: ''
      },
      rules: {
        value: [
          {type: 'number', message: '请选择测评表 ', required: true, trigger: 'change'}
        ]
      },
      gradeCheckedAll: false,
      subjectCheckedAll: false,
      gradeList: [],
      subjectList: [],
      option: [],
      evalId: '',
      selectedGradeList: [],
      selectedSubjectList: []
    }
  },
  methods: {
    // 全选评价范围
    selectAllGrade () {
      if (this.gradeCheckedAll) {
        this.gradeList.forEach((item, index) => {
          item.checked = true
        })
      } else {
        this.gradeList.forEach((item, index) => {
          item.checked = false
        })
      }
    },
    // 单选评价范围
    selectGrade (child) {
      if (this.gradeList.filter(item => item.checked === true).length === this.gradeList.length) {
        this.gradeCheckedAll = true
      } else {
        this.gradeCheckedAll = false
      }
    },
    // 全选科目
    selectAllSubject () {
      if (this.subjectCheckedAll) {
        this.subjectList.forEach((item, index) => {
          item.checked = true
        })
      } else {
        this.subjectList.forEach((item, index) => {
          item.checked = false
        })
      }
    },
    // 单选科目
    selectSubject (child) {
      if (this.subjectList.filter(item => item.checked === true).length === this.subjectList.length) {
        this.subjectCheckedAll = true
      } else {
        this.subjectCheckedAll = false
      }
    },
    // 获取测评表列表
    getTableList () {
      this.$https.get(`/eval/getTableList`)
      .then(res => {
        if (res.data.code === 1) {
          this.option = res.data.result
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取单位下的年级和科目
    getGradeAndSubjectByCompanyId () {
      this.$https.get(`/common/getGradeAndSubjectByCompanyId`)
      .then(res => {
        if (res.data.code === 1) {
          for (var i = 0; i < res.data.result.sectionGrades.length; i++) {
            res.data.result.sectionGrades[i].gradeDtoList.forEach((item, index) => {
              this.gradeList.push({name: res.data.result.sectionGrades[i].name + item.name, id: item.id})
            })
          }
          this.gradeList = this.gradeList.map(item => ({...item, checked: false}))
          this.subjectList = res.data.result.curriculums.map(item => ({...item, checked: false}))
          if (this.gradeList.length === this.selectedGradeList.length) {
            this.gradeCheckedAll = true
          }
          if (this.subjectList.length === this.selectedSubjectList.length) {
            this.subjectCheckedAll = true
          }
          this.gradeList.forEach((item, index) => {
            this.selectedGradeList.forEach((child) => {
              if (item.id === child.gradeId) {
                item.checked = true
              }
            })
          })
          this.subjectList.forEach((item) => {
            this.selectedSubjectList.forEach((child) => {
              if (item.curriculumId === child.subjectId) {
                item.checked = true
              }
            })
          })
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    beforeStep () {
      this.$store.dispatch('active')
      this.$router.push({path: '/assessmentManager/basicInformation', query: {id: JSON.stringify(this.evalId)}})
    },
    // 取消
    cancel () {
      if (sessionStorage.isEdit === '2') {
        this.$https.post(`/eval/deleteEval`, querystring.stringify({
          id: this.evalId
        }))
        .then(res => {
        })
      }
      this.$router.push('/assessmentManager/index')
    },
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let hasSelectedGrade = []
          this.gradeList.forEach((item, index) => {
            if (item.checked === true) hasSelectedGrade.push({gradeId: item.id, gradeName: item.name})
          })
          let hasSelectedSubject = []
          this.subjectList.forEach((item, index) => {
            if (item.checked === true) hasSelectedSubject.push({subjectId: item.curriculumId, subjectName: item.curriculumName})
          })
          if (this.evalType !== 1) {
            hasSelectedSubject = ''
          }
          if (hasSelectedGrade.length !== 0) {
            if (this.evalType === 1) {
              if (hasSelectedSubject.length === 0) {
                notice(this, '请选择科目', 2000)
                return
              }
            }
            hasSelectedGrade = JSON.stringify(hasSelectedGrade)
            hasSelectedSubject = JSON.stringify(hasSelectedSubject)
            this.$https.post('/eval/setTeacherParam', querystring.stringify({
              evalId: this.evalId,
              tableId: this.ruleForm.value,
              gradeJson: hasSelectedGrade,
              subjectJson: hasSelectedSubject,
              isCheck: 0
            }))
            .then(res => {
              if (res.data.code === 1) {
                success(this, '保存成功', 1000)
                this.$router.push('/assessmentManager/index')
              } else {
                notice(this, res.data.message, 2000)
              }
            })
          } else {
            notice(this, '请选择评价范围', 2000)
          }
        }
      })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let hasSelectedGrade = []
          this.gradeList.forEach((item, index) => {
            if (item.checked === true) hasSelectedGrade.push({gradeId: item.id, gradeName: item.name})
          })
          let hasSelectedSubject = []
          this.subjectList.forEach((item, index) => {
            if (item.checked === true) hasSelectedSubject.push({subjectId: item.curriculumId, subjectName: item.curriculumName})
          })
          if (hasSelectedGrade.length !== 0) {
            hasSelectedGrade = JSON.stringify(hasSelectedGrade)
            hasSelectedSubject = JSON.stringify(hasSelectedSubject)
            this.$https.post('/eval/setTeacherParam', querystring.stringify({
              evalId: this.evalId,
              tableId: this.ruleForm.value,
              gradeJson: hasSelectedGrade,
              subjectJson: hasSelectedSubject,
              isCheck: 1
            }))
            .then(res => {
              if (res.data.code === 1) {
                success(this, '提交成功', 1000)
                this.$router.push('/assessmentManager/index')
              } else {
                notice(this, res.data.message, 2000)
              }
            })
          } else {
            notice(this, '请选择评价范围', 2000)
          }
        }
      })
    },
    getTeacherParam () {
      this.$https.get(`/eval/getTeacherParam?evalId=${this.evalId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.ruleForm.value = res.data.result.oldTableId
          this.selectedGradeList = res.data.result.grades
          this.selectedSubjectList = res.data.result.subjects
        } else {
          // notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.evalId = JSON.parse(this.$route.query.id)
    this.$https.get(`/eval/getBaseInfo?id=${JSON.parse(this.$route.query.id)}`)
    .then(res => {
      if (res.data.code === 1) {
        this.evalType = res.data.result.evalType
      } else {
        notice(this, res.data.message, 2000)
      }
    })
    this.getTeacherParam()
    setTimeout(() => {
      this.getTableList()
      this.getGradeAndSubjectByCompanyId()
    }, 400)
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#parameter-setting{
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
          margin-right: $width*1.5;
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
