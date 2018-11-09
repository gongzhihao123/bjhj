<template>
  <div class="chart-5-2">
    <el-button type="primary" @click="exportButton('form')">导出</el-button>
    <div class="select">
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item 
          label="考试"
          prop="examId"
          :rules="[
            { required: true, type: 'number', message: '请选择考试', trigger: 'change' }
          ]">
          <el-select v-model="form.examId" placeholder="请选择考试" style="width: 160px;" @change="getSchool">
            <el-option
              v-for="item in examList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="学校"
          prop="schoolId"
          ref="school"
          :rules="[
            { required: true, type: 'number', message: '请选择学校', trigger: 'change' }
          ]">
          <el-select v-model="form.schoolId" placeholder="请选择学校" style="width: 160px;" @change="getClass">
            <el-option
              v-for="item in schoolList"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="班级"
          prop="classId"
          ref="classes"
          :rules="[
            { required: true, type: 'number', message: '请选择班级', trigger: 'change' }
          ]">
          <el-select v-model="form.classId" placeholder="请选择班级" style="width: 160px;" @change="getcourseList">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item 
          label="学科"
          ref="subject"
          prop="subjectId"
          :rules="[
            { required: true, type: 'string', message: '请选择学科', trigger: 'change' }
          ]">
          <el-select v-model="form.subjectId" placeholder="请选择学科" style="width: 160px;" @change="getStudent">
            <el-option
              v-for="item in courseList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId">
            </el-option>
          </el-select>
        </el-form-item> 

        <el-form-item 
          label="学生"
          prop="studentId"
          ref="student"
          :rules="[
            { required: true, type: 'number', message: '请选择学生', trigger: 'change' }
          ]">
          <el-select v-model="form.studentId" placeholder="请选择学生" style="width: 160px;" >
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.studentName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>        
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">查询</el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="content" v-loading="loading">
      <h3>{{courseName}}试题</h3>
        <el-table
          :data="itemlist"
          border>
          <el-table-column
            prop="questionNo"
            label="题号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="fullScore"
            label="满分"
            align="center">
          </el-table-column>
          <el-table-column
            prop="lessScore"
            label="年级最低分"
            align="center">
            <template scope="scope">
              {{ (scope.row.lessScore % 1 > 0) ? scope.row.lessScore.toFixed(1) : scope.row.lessScore }}
            </template>
          </el-table-column>
          <el-table-column
            prop="moreScore"
            label="年级最高分"
            align="center">
            <template scope="scope">
              {{ (scope.row.moreScore % 1 > 0) ? scope.row.moreScore.toFixed(1) : scope.row.moreScore }}
            </template>
          </el-table-column> 
          <el-table-column
            prop="questionScore"
            label="本人得分"
            align="center">
            <template scope="scope">
              {{ (scope.row.questionScore % 1 > 0) ? scope.row.questionScore.toFixed(1) : scope.row.questionScore }}
            </template>
          </el-table-column>  
          <el-table-column
            label="本人得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.averScore !== null">{{((scope.row.averScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.averScore === null">-</span>
            </template>
          </el-table-column> 
          <el-table-column
            label="班级得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.classScore !== null">{{((scope.row.classScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.classScore === null">-</span>              
            </template>
          </el-table-column>    
          <el-table-column
            label="年级得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeScore !== null">{{((scope.row.gradeScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeScore === null">-</span>               
            </template>            
          </el-table-column>   
          <el-table-column
            label="同等水平组得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.comScore !== null">{{((scope.row.comScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.comScore === null">-</span>               
            </template>            
          </el-table-column> 
          <el-table-column
            label="年级前30%平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.frontScore !== null">{{((scope.row.frontScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.frontScore === null">-</span>               
            </template>            
          </el-table-column>   
          <el-table-column
            label="一档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeOneScore !== null">{{((scope.row.gradeOneScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeOneScore === null">-</span>               
            </template>             
          </el-table-column> 
          <el-table-column
            label="二档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeTwoScore !== null">{{((scope.row.gradeTwoScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeTwoScore === null">-</span>                
            </template>             
          </el-table-column> 
          <el-table-column
            label="三档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeThreeScore !== null">{{((scope.row.gradeThreeScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeThreeScore === null">-</span>               
            </template>             
          </el-table-column> 
          <el-table-column
            prop="level"
            label="学业水平能级"
            align="center">
          </el-table-column> 
          <el-table-column
            label="百分位数"
            align="center">
            <template scope="scope">
              {{((scope.row.percentile || 0) * 100).toFixed(2) + '%'}}
            </template>            
          </el-table-column>                                                                                                             
        </el-table>
        <p style="color: #CBD1D8;">分析提示： 对学生某一学科的分析，从以上表中分别查看每个试题（最后一行是总分）的表现水平；<br/>
                                   公式：班级得分率=班级所有人得分和（总分和）/班级人数/小题（试卷）总分；年级得分率=全区年级得分和（总分和）/全区年级人数/小题（试卷）总分；<br/>
                                   同等水平组得分率=总分在该生（总分-5）和（总分+5）之间的人得分和（总分和）/该分数段间的人数和/小题（试卷）总分；年级前30%平均得分率=全区年级前30%人得分和（总分和）/全区年级前30%人数/小题（试卷）总分；<br/>
                                   各档平均得分率=全区各档人得分和（总分和）/全区各档人数/小题（试卷）总分；百分位=1-试卷总分高于该生的人数/全区总人数；<br/>
                                   学业水平能级=（学生得分-年级平均分）/年级标准差；年级标准差：[(学生1得分-年级平均分)²+（学生2得分-年级平均分）²+...+(学生n得分-年级平均分)²]/(n-1)对其开根号即得出年级标准差；<br/>
                                   以下表中各得分率公式同上。
        </p>
        <h3>{{courseName}}主客观题组块</h3>
        <el-table
          :data="subjectivelist"
          border>
          <el-table-column
            prop="questionNo"
            label="结构"
            align="center">
          </el-table-column>
          <el-table-column
            prop="fullScore"
            label="满分"
            align="center">
          </el-table-column>
          <el-table-column
            prop="lessScore"
            label="年级最低分"
            align="center">
            <template scope="scope">
              {{ (scope.row.lessScore % 1 > 0) ? scope.row.lessScore.toFixed(1) : scope.row.lessScore }}
            </template>
          </el-table-column>
          <el-table-column
            prop="moreScore"
            label="年级最高分"
            align="center">
            <template scope="scope">
              {{ (scope.row.moreScore % 1 > 0) ? scope.row.moreScore.toFixed(1) : scope.row.moreScore }}
            </template>
          </el-table-column> 
          <el-table-column
            prop="questionScore"
            label="本人得分"
            align="center">
            <template scope="scope">
              {{ (scope.row.questionScore % 1 > 0) ? scope.row.questionScore.toFixed(1) : scope.row.questionScore }}
            </template>
          </el-table-column>  
          <el-table-column
            label="本人得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.averScore !== null">{{((scope.row.averScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.averScore === null">-</span>
            </template>
          </el-table-column> 
          <el-table-column
            label="班级得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.classScore !== null">{{((scope.row.classScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.classScore === null">-</span>              
            </template>
          </el-table-column>    
          <el-table-column
            label="年级得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeScore !== null">{{((scope.row.gradeScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeScore === null">-</span>               
            </template>            
          </el-table-column>   
          <el-table-column
            label="同等水平组得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.comScore !== null">{{((scope.row.comScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.comScore === null">-</span>               
            </template>            
          </el-table-column> 
          <el-table-column
            label="年级前30%平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.frontScore !== null">{{((scope.row.frontScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.frontScore === null">-</span>               
            </template>            
          </el-table-column>   
          <el-table-column
            label="一档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeOneScore !== null">{{((scope.row.gradeOneScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeOneScore === null">-</span>               
            </template>             
          </el-table-column> 
          <el-table-column
            label="二档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeTwoScore !== null">{{((scope.row.gradeTwoScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeTwoScore === null">-</span>                
            </template>             
          </el-table-column> 
          <el-table-column
            label="三档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeThreeScore !== null">{{((scope.row.gradeThreeScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeThreeScore === null">-</span>               
            </template>             
          </el-table-column> 
          <el-table-column
            prop="level"
            label="学业水平能级"
            align="center">
          </el-table-column> 
          <el-table-column
            label="百分位数"
            align="center">
            <template scope="scope">
              {{((scope.row.percentile || 0) * 100).toFixed(2) + '%'}}
            </template>            
          </el-table-column>                                                                                                             
        </el-table>


        <h3>{{courseName}}知识结构</h3>
        <el-table
          :data="knowledgelist"
          border>
          <el-table-column
            prop="questionNo"
            label="结构"
            align="center">
          </el-table-column>
          <el-table-column
            prop="fullScore"
            label="满分"
            align="center">
          </el-table-column>
          <el-table-column
            prop="lessScore"
            label="年级最低分"
            align="center">
            <template scope="scope">
              {{ (scope.row.lessScore % 1 > 0) ? scope.row.lessScore.toFixed(1) : scope.row.lessScore }}
            </template>
          </el-table-column>
          <el-table-column
            prop="moreScore"
            label="年级最高分"
            align="center">
             <template scope="scope">
              {{ (scope.row.moreScore % 1 > 0) ? scope.row.moreScore.toFixed(1) : scope.row.moreScore }}
            </template>
          </el-table-column> 
          <el-table-column
            prop="questionScore"
            label="本人得分"
            align="center">
            <template scope="scope">
              {{ (scope.row.questionScore % 1 > 0) ? scope.row.questionScore.toFixed(1) : scope.row.questionScore }}
            </template>
          </el-table-column>  
          <el-table-column
            label="本人得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.averScore !== null">{{((scope.row.averScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.averScore === null">-</span>
            </template>
          </el-table-column> 
          <el-table-column
            label="班级得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.classScore !== null">{{((scope.row.classScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.classScore === null">-</span>              
            </template>
          </el-table-column>    
          <el-table-column
            label="年级得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeScore !== null">{{((scope.row.gradeScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeScore === null">-</span>               
            </template>            
          </el-table-column>   
          <el-table-column
            label="同等水平组得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.comScore !== null">{{((scope.row.comScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.comScore === null">-</span>               
            </template>            
          </el-table-column> 
          <el-table-column
            label="年级前30%平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.frontScore !== null">{{((scope.row.frontScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.frontScore === null">-</span>               
            </template>            
          </el-table-column>   
          <el-table-column
            label="一档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeOneScore !== null">{{((scope.row.gradeOneScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeOneScore === null">-</span>               
            </template>             
          </el-table-column> 
          <el-table-column
            label="二档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeTwoScore !== null">{{((scope.row.gradeTwoScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeTwoScore === null">-</span>                
            </template>             
          </el-table-column> 
          <el-table-column
            label="三档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeThreeScore !== null">{{((scope.row.gradeThreeScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeThreeScore === null">-</span>               
            </template>             
          </el-table-column> 
          <el-table-column
            prop="level"
            label="学业水平能级"
            align="center">
          </el-table-column> 
          <el-table-column
            label="百分位数"
            align="center">
            <template scope="scope">
              {{scope.row.percentile ? (Number(scope.row.percentile) * 100).toFixed(2) + '%' : '0%'}}
            </template>            
          </el-table-column>                                                                                                             
        </el-table>

        <h3>{{courseName}}认知结构</h3>
        <el-table
          :data="cognitionlist"
          border>
          <el-table-column
            prop="questionNo"
            label="结构"
            align="center">
          </el-table-column>
          <el-table-column
            prop="fullScore"
            label="满分"
            align="center">
          </el-table-column>
          <el-table-column
            prop="lessScore"
            label="年级最低分"
            align="center">
            <template scope="scope">
              {{ (scope.row.lessScore % 1 > 0) ? scope.row.lessScore.toFixed(1) : scope.row.lessScore }}
            </template>
          </el-table-column>
          <el-table-column
            prop="moreScore"
            label="年级最高分"
            align="center">
            <template scope="scope">
              {{ (scope.row.moreScore % 1 > 0) ? scope.row.moreScore.toFixed(1) : scope.row.moreScore }}
            </template>
          </el-table-column> 
          <el-table-column
            prop="questionScore"
            label="本人得分"
            align="center">
            <template scope="scope">
              {{ (scope.row.questionScore % 1 > 0) ? scope.row.questionScore.toFixed(1) : scope.row.questionScore }}
            </template>
          </el-table-column>  
          <el-table-column
            label="本人得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.averScore !== null">{{((scope.row.averScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.averScore === null">-</span>
            </template>
          </el-table-column> 
          <el-table-column
            label="班级得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.classScore !== null">{{((scope.row.classScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.classScore === null">-</span>              
            </template>
          </el-table-column>    
          <el-table-column
            label="年级得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeScore !== null">{{((scope.row.gradeScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeScore === null">-</span>               
            </template>            
          </el-table-column>   
          <el-table-column
            label="同等水平组得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.comScore !== null">{{((scope.row.comScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.comScore === null">-</span>               
            </template>            
          </el-table-column> 
          <el-table-column
            label="年级前30%平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.frontScore !== null">{{((scope.row.frontScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.frontScore === null">-</span>               
            </template>            
          </el-table-column>   
          <el-table-column
            label="一档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeOneScore !== null">{{((scope.row.gradeOneScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeOneScore === null">-</span>               
            </template>             
          </el-table-column> 
          <el-table-column
            label="二档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeTwoScore !== null">{{((scope.row.gradeTwoScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeTwoScore === null">-</span>                
            </template>             
          </el-table-column> 
          <el-table-column
            label="三档平均得分率"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gradeThreeScore !== null">{{((scope.row.gradeThreeScore || 0) * 100).toFixed(2) + '%'}}</span>
              <span v-if="scope.row.gradeThreeScore === null">-</span>               
            </template>             
          </el-table-column> 
          <el-table-column
            prop="level"
            label="学业水平能级"
            align="center">
          </el-table-column> 
          <el-table-column
            label="百分位数"
            align="center">
            <template scope="scope">
              {{((scope.row.percentile || 0) * 100).toFixed(2) + '%'}}
            </template>            
          </el-table-column>                                                                                                             
        </el-table>                       
    </div>
  </div>
</template>

<script>
import { notice, error } from '../../../api/index'

export default {
  data () {
    return {
      dialog: false,
      studentData: [],
      examList: [],
      schoolList: [],
      gradeList: [],
      classList: [],
      courseList: [],
      studentList: [],
      state: false,
      cognitionlist: [],
      itemlist: [],
      knowledgelist: [],
      subjectivelist: [],
      courseName: '',
      form: {
        examId: '',
        schoolId: '',
        classId: '',
        studentId: '',
        subjectId: ''
      },
      loading: false,
      table: []
    }
  },

  methods: {
    exportButton (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var path = document.querySelector('#contextPath').value
          const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
          window.location.href = `${path}/analysisStudent/subjectLevelInnerStructAnalysisExport?` +
                                      `examId=${this.form.examId}` +
                                      `&studentId=${this.form.studentId}` +
                                      `&classId=${this.form.classId}` +
                                      `&gradeId=${nowList.gradeId}` +
                                      `&examName=${this.examList.filter(item => item.id === this.form.examId)[0].name}` +
                                      `&schoolId=${this.form.schoolId}` +
                                      `&subjectId=${this.form.subjectId}` +
                                      `&subjectName=${this.courseList.filter(item => item.courseId === this.form.subjectId)[0].courseName}`
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    async getData () {
      this.loading = true
      this.courseList.forEach(item => {
        if (item.courseId === this.form.subjectId) {
          this.courseName = item.courseName
        }
      })
      const { data: subject } = await this.$https.get(`/analysisStudent/subjectLevelInnerStructAnalysisQuery` +
                                      `?examId=${this.form.examId}&schoolId=${this.form.schoolId}` +
                                      `&classId=${this.form.classId}&studentId=${this.form.studentId}&subjectId=${this.form.subjectId}`)
      if (subject.code !== 1) notice(this, subject.message, 2000)
      else {
        if (subject.result !== null && subject.result.cognitionlist !== null) {
        // 认知结构分析
          this.cognitionlist = subject.result ? [...subject.result.cognitionlist] : []
          this.cognitionlist = this.cognitionlist.map(item => ({
            ...item,
            gradeScore: item.gradeScore === 'NaN' ? 0 : item.gradeScore,
            level: item.level === 'NaN' ? 0 : item.level,
            percentile: item.percentile === 'NaN' ? 0 : item.percentile
          }))
        }
        if (subject.result !== null && subject.result.itemlist !== null) {
        // 小题分析
          this.itemlist = [...subject.result.itemlist]
        }
        if (subject.result !== null && subject.result.knowledgelist !== null) {
        // 知识结构分析
          this.knowledgelist = [...subject.result.knowledgelist]
        }
        if (subject.result != null && subject.result.subjectivelist !== null) {
        // 主客观题分析
          this.subjectivelist = [...subject.result.subjectivelist]
        }
      }
      this.loading = false
    },

    async getSchool () {
      if (!this.form.examId) return
      this.$refs.school.resetField()
      this.$refs.classes.resetField()
      this.$refs.subject.resetField()
      this.$refs.student.resetField()
      this.cognitionlist = []
      this.itemlist = []
      this.knowledgelist = []
      this.subjectivelist = []
      const { data } = await this.$https.get(`/common/achievementSchoolList?examId=${this.form.examId}`)
      if (data.code === 1) {
        this.schoolList = [...data.result]
        this.form.schoolId = this.schoolList.length === 0 ? '' : this.schoolList[0].schoolId
      }
    },

    async getClass (e) {
      if (!this.form.schoolId) return
      this.$refs.classes.resetField()
      this.$refs.subject.resetField()
      this.$refs.student.resetField()
      const nowList = this.examList.filter(item => item.id === this.form.examId)[0]
      const { data } = await this.$https.get(`/common/gradeClassList` +
                              `?semesterId=${nowList.semesterId}` +
                              `&sectionId=${nowList.sectionId}` +
                              `&gradeId=${nowList.gradeId}` +
                              `&schoolId=${this.form.schoolId}`)
      if (data.code === 1) {
        if (data.result) {
          this.classList = data.result.map(item => ({ name: `${item.gradeName}${item.className}`, id: item.id }))
          this.form.classId = this.classList.length === 0 ? '' : this.classList[0].id
        } else {
          this.classList = []
          this.form.classId = ''
        }
        this.getcourseList()
      }
    },

    async getcourseList () {
      // 学科
      if (!this.form.classId) return
      this.$refs.subject.resetField()
      this.$refs.student.resetField()
      const scoreRuleId = this.examList.filter(item => item.id === this.form.examId)[0].scoreRuleId
      const { data: courseList } = await this.$https.get(`/common/courseList?examId=${this.form.examId}&scoreRuleId=${scoreRuleId}`)
      if (courseList.code === 1) {
        this.courseList = [...courseList.result]
        this.form.subjectId = this.courseList.length === 0 ? '' : this.courseList[0].courseId
      }
    },
    async getStudent () {
      if (!this.form.subjectId) return
      this.$refs.student.resetField()
      // this.courseList.forEach(item => {
      //   if (item.courseId === this.form.subjectId) {
      //     this.courseName = item.courseName
      //   }
      // })
      const { data } = await this.$https.get(`/common/getstudentList` +
                              `?examId=${this.form.examId}` +
                              `&classId=${this.form.classId}` +
                              `&schoolId=${this.form.schoolId}` +
                              `&subjectId=${this.form.subjectId}`)
      if (data.code === 1) {
        this.studentList = data.result
        this.form.studentId = this.studentList.length === 0 ? '' : this.studentList[0].id
        // this.getData()
      } else {
        notice(this, data.message, 3000)
      }
    }
  },

  async created () {
    // 考试列表
    const { data: examList } = await this.$https.get('/common/examList')
    if (examList.code === 1) {
      this.examList = [...examList.result || []]
      if (sessionStorage.PARAMS_EXAMID > 0) this.form.examId = Number(sessionStorage.PARAMS_EXAMID)
      else this.form.examId = this.examList.length > 0 ? this.examList[0].id : ''
      await this.getSchool()
      await this.getClass()
      await this.getcourseList()
      await this.getStudent()
      this.getData()
    } else if (examList.code === -2) {
      error()
    } else {
      notice(this, examList.message, 2000)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/variable.scss';
.chart-5-2 {
  position: relative;
  >.el-button {
    position: absolute;
    right: 0;
    top: -66px;
  }
  
  >.select {

    >.el-select {
      margin-left: $width;
    }

    >.el-button {
      margin-left: $width;
    }
  }

  >.content {

    display: block;
    clear: both;
    overflow: hidden;

    >h3 {
      text-align: center;
      line-height: 30px;
    }
    >.el-table {
      margin: $width auto;
    }
  }

  .echarts {
    width: 100%;
  }
}
</style>
