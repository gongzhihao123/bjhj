<template>
<div id="my">
  <!-- 筛选 -->
  <div class="choose">
    <span>年级:</span>
    <el-select v-model="value1" placeholder="请选择" @change="getMyList">
        <el-option
          v-for="item in arr"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span>学科:</span>
      <el-select v-model="value2" placeholder="请选择" @change="getMyList">
        <el-option
          v-for="item in subject"
          :key="item.curriculumId"
          :label="item.curriculumName"
          :value="item.curriculumId">
        </el-option>
      </el-select>

      <el-input placeholder="请输入微课名称" v-model="inputvalue">
        <el-button slot="append" icon="el-icon-search" @click="getMyList"></el-button>
      </el-input>
  </div>

  <!-- 表格 -->
  <div class="table-box">
    <el-button type="primary" @click="addCourse">上传微课</el-button>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        prop="microclassName"
        show-overflow-tooltip
        label="微课名称">
      </el-table-column>
      <el-table-column
        prop="gradeName"
        label="年级"
        width="150">
      </el-table-column>
      <el-table-column
        prop="courseName"
        label="学科"
        width="100">
      </el-table-column>
      <el-table-column
        label="发布状态"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.uploadState === 1">已发布</span>
          <span v-if="scope.row.uploadState === 0">未发布</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审批状态"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.checkState === 1 || scope.row.checkState === 3">已通过</span>
          <span v-if="scope.row.checkState === 2">未通过</span>
          <span v-if="scope.row.checkState === 0">未审批</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="450">
        <template slot-scope="scope">
          <el-button @click="look(scope.row)" type="primary">查看</el-button>
          <el-button @click="publish(scope.row)" type="primary" v-if="scope.row.uploadState === 0">发布</el-button>
          <el-button @click="cancalPublish(scope.row)" type="primary" v-if="scope.row.uploadState === 1">取消发布</el-button>
          <el-button @click="edit(scope.row)" type="success" v-if="scope.row.uploadState !== 1">编 辑</el-button>
          <el-button @click="deleteItem(scope.row)" type="danger" v-if="scope.row.uploadState === 0">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  <!--分页  -->
  <el-pagination
   v-if="totalCount !== 0"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 15, 20, 25]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalCount">
  </el-pagination>
  </div>
<!-- 上传微课 -->
<el-dialog :title="flag === 1 ? '微课上传' : '编辑'" :visible.sync="uploadDia">
  <el-form ref="form" :model="form" label-width="80px" :rules="rules" v-if="uploadDia">
      <el-form-item label="微课名称" prop="name">
        <el-input v-model="form.name" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="gradevalue">
          <el-select v-model="form.gradevalue" placeholder="请选择">
              <el-option
                v-for="item in arrList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="科目" prop="subjectvalue">
          <el-select v-model="form.subjectvalue" placeholder="请选择">
              <el-option
                v-for="item in subjectList"
                :key="item.curriculumId"
                :label="item.curriculumName"
                :value="item.curriculumId">
              </el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="微课" prop="file">
          <el-upload
          class="upload"
          :action="action"
          :limit="1"
          name="file"
          ref="upload"
          :show-file-list="true"
          :on-success="successimport"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :auto-upload="false"
          :file-list="fileList"
          :on-change="handlePreview">
          <el-button type="primary" class="up-button">上传微课</el-button>
          <span slot="" class="el-upload__tip">只能上传mp4格式文件，且不超过200M</span>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述" prop="textarea">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="form.textarea"
          :maxlength="200">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">保 存</el-button>
        <el-button @click="uploadDia = false" class="cancel">取 消</el-button>
    </div>
</el-dialog>

<!-- 发布 -->
<el-dialog title="发布微课" :visible.sync="publishDia">
  <el-form :model="pub" :ref="pub">
    <el-form-item label="微课名称" prop="title">
      <span>{{pub.microclassName}}</span>
    </el-form-item>
    <el-form-item label="审批人" v-if="checkSwitch === 1">
      <el-select v-model="checkUserId" placeholder="请选择审批人" prop="checkUserId"
      :rules="[
        { required: true, message: '审批人不能为空', trigger: 'change' }
      ]">
        <el-option
          v-for="item in numberList"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="savePublish">保 存</el-button>
    <el-button @click="publishDia = false" class="cancel">取 消</el-button>
  </div>
</el-dialog>

<!-- 删除 -->
<el-dialog
  title="删除微课"
  :visible.sync="deleteDia"
  class="dele"
  center>
  <span class="tip">确定要删除么？</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="deleteCourse">确 定</el-button>
    <el-button @click="deleteDia = false" class="cancel">取 消</el-button>
  </span>
</el-dialog>
</div>
</template>
<script>
import { success, notice } from '../../utils/index'
export default {
  name: 'my',
  data () {
    return {
      flag: '',
      loading: false,
      fileList: [],
      subjectvalue: '',
      gradevalue: '',
      file: {},
      checkUserId: '',
      arr: [],
      subjectList: [],
      arrList: [],
      semesterId: '',
      currentPage: 1,
      section: [],
      totalCount: 0,
      pageSize: 10,
      rules: {
        name: [
          { required: true, message: '请输入微课名称', trigger: 'blur' }
        ],
        gradevalue: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        subjectvalue: [
          { required: true, message: '请选择科目', trigger: 'change' }
        ],
        file: [
          { required: true, message: '请选择上传视频文件', trigger: 'change' }
        ]
      },
      uploadDia: false,
      publishDia: false,
      row: {},
      deleteDia: false,
      checkSwitch: '',
      textarea: '',
      Url: '',
      pub: {},
      value1: '',
      fileflag: false,
      numberList: [],
      imageUrl: '',
      value2: '',
      inputvalue: '',
      fileName: '',
      form: {
        gradevalue: '',
        subjectvalue: '',
        name: '',
        file: ''
      },
      grade: [],
      subject: [],
      tableData: [
        { name: '还包括与微视频配套的导读设计（非教学设计）以及与资', grade: '一年级', subject: '数学', state: 1, checkstate: 0 }
      ]
    }
  },
  methods: {
    handleRemove (fileList) {
      this.fileList = []
      this.fileflag = true
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    async savePublish () {
      if (this.checkSwitch === 1 && this.checkUserId === '') {
        notice('请选择审批人')
        return
      }
      const data = await this.$store.dispatch('publishCourse', {
        id: this.pub.id,
        uploadState: this.pub.uploadState === 0 ? 1 : 0,
        checkUser: this.checkSwitch === 1 ? this.checkUserId : ''
      })
      success(data)
      this.publishDia = false
      this.getMyList()
      this.checkUserId = ''
    },
    async deleteCourse () {
      const data = await this.$store.dispatch('deleteCourse', {
        id: this.row.id
      })
      success(data)
      this.deleteDia = false
      this.getMyList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getMyList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getMyList()
    },
    addCourse () {
      this.uploadDia = true
      this.flag = 1
      this.form = {}
      this.fileList = []
    },
    submitForm (formName) {
      if (this.fileList.length !== 0) {
        this.rules.file[0].required = false
      } else {
        this.rules.file[0].required = true
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.flag === 1 || (this.flag === 2 && this.fileflag)) {
            this.$refs.upload.submit()
          } else if (!this.fileflag) {
            const data = await this.$store.dispatch('editCourse', {
              id: this.row.id,
              sectionId: this.arrList.filter(item => item.id === this.form.gradevalue)[0].sectionId,
              sectionName: this.arrList.filter(item => item.id === this.form.gradevalue)[0].sectionName,
              gradeId: this.form.gradevalue,
              gradeName: this.arrList.filter(item => item.id === this.form.gradevalue)[0].name,
              courseId: this.form.subjectvalue,
              courseName: this.subjectList.filter(item => item.curriculumId === this.form.subjectvalue)[0].curriculumName,
              microclassName: this.form.name,
              microclassUrl: this.Url,
              microclassInfo: this.form.textarea,
              uploadState: this.row.uploadState,
              fileName: this.fileName,
              visitCount: this.row.visitCount,
              commentCount: this.row.commentCount,
              checkUser: this.checkSwitch === 1 ? this.row.checkUser : '',
              imageUrl: this.row.imageUrl
            })
            success(data)
            this.uploadDia = false
            this.getMyList()
            this.fileList = []
          }
        } else {
          return false
        }
      })
    },
    async successimport (res) {
      this.imageUrl = res.result.imageUrl
      this.Url = res.result.uploadResult.fileUrl
      if (this.flag === 1) {
        const data = await this.$store.dispatch('saveCourse', {
          sectionId: this.arrList.filter(item => item.id === this.form.gradevalue)[0] ? this.arrList.filter(item => item.id === this.form.gradevalue)[0].sectionId : '',
          sectionName: this.arrList.filter(item => item.id === this.form.gradevalue)[0] ? this.arrList.filter(item => item.id === this.form.gradevalue)[0].sectionName : '',
          gradeId: this.arrList.filter(item => item.id === this.form.gradevalue)[0] ? this.arrList.filter(item => item.id === this.form.gradevalue)[0].id : '',
          gradeName: this.arrList.filter(item => item.id === this.form.gradevalue)[0] ? this.arrList.filter(item => item.id === this.form.gradevalue)[0].name : '',
          courseId: this.subjectList.filter(item => item.curriculumId === this.form.subjectvalue)[0] ? this.subjectList.filter(item => item.curriculumId === this.form.subjectvalue)[0].curriculumId : '',
          courseName: this.subjectList.filter(item => item.curriculumId === this.form.subjectvalue)[0] ? this.subjectList.filter(item => item.curriculumId === this.form.subjectvalue)[0].curriculumName : '',
          microclassName: this.form.name,
          microclassUrl: this.Url,
          microclassInfo: this.form.textarea,
          uploadState: 0,
          fileName: this.fileName,
          imageUrl: this.imageUrl
        })
        success(data)
        this.uploadDia = false
        this.getMyList()
      } else if (this.flag === 2) {
        const data = await this.$store.dispatch('editCourse', {
          id: this.row.id,
          sectionId: this.arrList.filter(item => item.id === this.form.gradevalue)[0].id,
          sectionName: this.arrList.filter(item => item.id === this.form.gradevalue)[0].sectionName,
          gradeId: this.form.gradevalue,
          gradeName: this.arrList.filter(item => item.id === this.form.gradevalue)[0].name,
          courseId: this.form.subjectvalue,
          courseName: this.subjectList.filter(item => item.curriculumId === this.form.subjectvalue)[0].curriculumName,
          microclassName: this.form.name,
          microclassUrl: this.Url,
          microclassInfo: this.form.textarea,
          uploadState: this.row.uploadState,
          fileName: this.fileName,
          visitCount: this.row.visitCount,
          commentCount: this.row.commentCount,
          checkUser: this.checkSwitch === 1 ? this.row.checkUser : '',
          imageUrl: this.imageUrl
        })
        success(data)
        this.uploadDia = false
        this.getMyList()
        this.fileList = []
      }
    },
    handlePreview (file, fileList) {
      this.fileList = fileList
      this.file = file
      this.fileName = file.name
      const isMp4 = file.raw.type === 'video/mp4'
      const isLt200M = file.size / 1024 / 1024 < 200
      if (!isMp4) {
        this.$notify.error({
          title: '错误',
          message: '文件只能是mp4格式'
        })
      }

      if (!isLt200M) {
        this.$notify.error({
          title: '错误',
          message: '文件最大只能200M'
        })
      }
      return isMp4 && isLt200M
    },
    look (row) {
      sessionStorage.path = '/my'
      let bread = {
        routeName: '我的微课',
        path: '/my',
        id: row.id,
        peroid: row.sectionName,
        grade: row.gradeName.replace(row.sectionName, ''),
        subject: row.courseName,
        title: row.microclassName,
        author: row.uploadUserName,
        uploadUser: row.uploadUser
      }
      let obj = {
        activeIndex: this.activeIndex,
        value1: this.value1,
        value2: this.value2,
        inputvalue: this.inputvalue,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      sessionStorage.choose = JSON.stringify(obj)
      sessionStorage.bread = JSON.stringify(bread)
      this.$router.push('/course')
    },
    async publish (row) {
      this.pub = row
      this.checkUserId = ''
      if (this.checkSwitch === 1) {
        this.publishDia = true
      } else {
        const data = await this.$store.dispatch('publishCourse', {
          id: this.pub.id,
          uploadState: this.pub.uploadState === 0 ? 1 : 0,
          checkUser: this.checkSwitch === 1 ? this.checkUserId : ''
        })
        success(data)
        this.getMyList()
      }
    },
    async cancalPublish (row) {
      const data = await this.$store.dispatch('publishCourse', {
        id: row.id,
        uploadState: row.uploadState === 0 ? 1 : 0,
        checkUser: this.checkSwitch === 1 ? this.checkUserId : ''
      })
      success(data)
      this.getMyList()
    },
    async edit (row) {
      this.fileList = []
      this.uploadDia = true
      this.flag = 2
      this.row = row
      const data = await this.$store.dispatch('squareDetail', {
        id: row.id
      })
      this.form.name = data.microclassName
      this.form.gradevalue = data.gradeId
      this.form.subjectvalue = data.courseId
      this.form.textarea = data.microclassInfo
      let obj = {}
      obj.name = data.fileName
      obj.url = data.microclassUrl
      this.fileList.push(obj)
      this.Url = data.microclassUrl
    },
    deleteItem (row) {
      this.deleteDia = true
      this.row = row
    },
    // 学段
    async getSection () {
      this.section = await this.$store.dispatch('getSection')
      this.section.map(async item => {
        item.children = await this.$store.dispatch('getGrade', {
          sectionId: item.id,
          semesterId: this.semesterId
        })
      })
      setTimeout(() => {
        this.section.map(item => {
          item.children.map(m => {
            let obj = {}
            obj.name = item.name + m.name
            obj.id = m.id
            obj.sectionId = item.id
            obj.sectionName = item.name
            this.arr.push(obj)
          })
        })
        this.arrList = this.arr.slice(1, this.arr.length)
      }, 500)
      this.arr.unshift({name: '全部', id: ''})
    },
    // 学期
    async getPeroid () {
      const data = await this.$store.dispatch('getPeroid')
      this.semesterId = data[0].semesterId
    },
    // 科目
    async getSubject () {
      const data = await this.$store.dispatch('getSubject')
      let obj = {
        curriculumName: '全部',
        curriculumId: ''
      }
      data.unshift(obj)
      this.subject = data
      this.subjectList = this.subject.slice(1, this.subject.length)
    },
    async getMyList () {
      const data = await this.$store.dispatch('getMyList', {
        courseId: this.subject.filter(item => item.curriculumId === this.value2)[0] ? this.subject.filter(item => item.curriculumId === this.value2)[0].curriculumId : '',
        gradeId: this.arr.filter(item => item.id === this.value1)[0] ? this.arr.filter(item => item.id === this.value1)[0].id : '',
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.inputvalue
      })
      this.tableData = data.list
      this.totalCount = data.totalCount
      this.loading = false
    },
    async getCheckUser () {
      const data = await this.$store.dispatch('getCheckUser')
      this.numberList = data
    }
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/myMicrocourse/myMicrocourseUpload`
    }
  },
  async created () {
    this.loading = true
    if (sessionStorage.choose) {
      this.activeIndex = JSON.parse(sessionStorage.choose).activeIndex
      this.value1 = JSON.parse(sessionStorage.choose).value1
      this.value2 = JSON.parse(sessionStorage.choose).value2
      this.inputvalue = JSON.parse(sessionStorage.choose).inputvalue
      this.currentPage = JSON.parse(sessionStorage.choose).pageNo
      this.pageSize = JSON.parse(sessionStorage.choose).pageSize
      sessionStorage.choose = ''
    }
    setTimeout(() => {
      this.checkSwitch = this.$store.state.user.checkSwitch
    }, 300)
    // 学段
    await this.getSection()
    // 学期
    await this.getPeroid()
    await this.getSubject()
    // 获取评审人
    await this.getCheckUser()
    await this.getMyList()
  },
  watch: {}
}
</script>
<style lang="scss">
#my {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;

  .el-upload-list__item {
    .el-icon-close:before {
      color: #666 !important;
    }
  }
  .el-dialog .el-form-item {
    &:last-child {
      .el-form-item__label:before {
        display: none;
      }
    }
  }
  .el-pagination {
    text-align: right;
    margin: 30px 20px 0px 0px;
  }

  .dele {
    .el-dialog__body {
      padding: 30px;
    }
  }

  .up-button {
    float: left;
    margin-right: 10px;
  }

  .el-textarea__inner {
    resize: none;
  }
  .choose {
    padding: 30px;
    border-bottom: 1px solid #CFD6E0;
    margin-bottom: 20px;

    &>span {
      margin-right: 10px;
    }
    &>.el-select {
      margin-right: 20px;
    }
    &>.el-input {
      width: 300px;
    }
  }
  .table-box {
    margin: 30px auto;
    width: 95%;

    .el-table {
      margin-top: 30px;
    }
  }

  .el-dialog {
      .el-dialog__header {
      border-bottom: 1px solid #E4E9ED;
      padding: 20px;
  }
  .el-dialog__title {
    font-weight: normal;
  }
  .el-dialog__headerbtn {
    top: -55px;
    right: -55px;
  }
  .dialog-footer {
    text-align: center;
    &>.el-button {
      padding: 10px 28px;
      background: #5295EB;
      border: 1px solid #5295EB;
      &>span {
        color: #fff !important;
      }
    }
    .cancel {
      background: #FF6C60 !important;
      border: 1px solid #FF6C60 !important;
    }
  }
  .el-dialog__headerbtn .el-dialog__close {
    border: 2px solid #fff;
    border-radius: 100%;
    font-weight: bold;
    padding: 5px;

   &:hover{
    background: #FF6C60;
  }
  }
  .el-icon-close:before {
    color: #fff;
  }
  }
}
</style>
