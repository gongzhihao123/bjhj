<template>
<div id="manageCourse">
  <div class="choose">
    <span v-for="(item, index) in nav" :key="index" :class="{active: activeIndex === index}" @click="select(index)">{{item}}</span>
    <div class="selection">
    <span>年级:</span>
    <el-select v-model="value1" placeholder="请选择" @change="CourseList">
        <el-option
          v-for="item in arr"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span>学科:</span>
      <el-select v-model="value2" placeholder="请选择" @change="CourseList">
        <el-option
          v-for="item in subject"
          :key="item.curriculumId"
          :label="item.curriculumName"
          :value="item.curriculumId">
        </el-option>
      </el-select>

      <el-input placeholder="请输入微课名称" v-model="input">
        <el-button slot="append" icon="el-icon-search" @click="CourseList"></el-button>
      </el-input>
    </div>
  </div>

  <div class="table-box">
    <el-table
    v-loading="loading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        show-overflow-tooltip
        label="微课名称">
        <template slot-scope="scope">
          <span>{{scope.row.microclassName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gradeName"
        label="年级"
        width="100">
      </el-table-column>
      <el-table-column
        prop="courseName"
        label="学科"
        width="100">
      </el-table-column>
      <el-table-column
        label="上传人"
        prop="uploadUserName"
        width="100">
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="150">
        <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat('yyyy-MM-dd')}}</span>
          <!-- <span>-</span> -->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="400">
        <template slot-scope="scope">
          <el-button @click="look(scope.row)" type="primary">查看</el-button>
          <el-button @click="check(scope.row)" type="success" v-if="activeIndex === 0">审批</el-button>
          <el-button @click="deleteItem(scope.row)" type="danger">删除</el-button>
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

  <!-- 删除 -->
  <el-dialog
  title="删除微课"
  :visible.sync="deleteDia"
  class="dele"
  center>
  <span class="tip">确定要删除么？</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="deleteSubmit">确 定</el-button>
    <el-button @click="deleteDia = false" class="cancel">取 消</el-button>
  </span>
  </el-dialog>
</div>
</template>
<script>
import { success } from '../../utils/index'
export default {
  name: 'manageCourse',
  data () {
    return {
      deleteDia: false,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      tableData: [],
      nav: ['未审批', '已通过', '已驳回'],
      activeIndex: 0,
      value1: '',
      value2: '',
      input: '',
      arr: [],
      subject: [],
      row: {}
    }
  },
  methods: {
    async deleteSubmit () {
      const data = await this.$store.dispatch('DeleteCourse', {
        id: this.row.id
      })
      success(data)
      this.deleteDia = false
      this.CourseList()
    },
    select (index) {
      this.activeIndex = index
      this.CourseList()
      this.value1 = ''
      this.vale2 = ''
      this.input = ''
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
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.CourseList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.CourseList()
    },
    check (row) {
      this.$router.push('/check')
      sessionStorage.checkItem = JSON.stringify(row)
      let obj = {
        activeIndex: this.activeIndex,
        value1: this.value1,
        value2: this.value2,
        input: this.input,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      sessionStorage.chooseItem = JSON.stringify(obj)
    },
    look (row) {
      sessionStorage.path = '/manage'
      let bread = {
        routeName: '微课管理',
        path: '/manage',
        id: row.id,
        peroid: row.sectionName,
        grade: row.gradeName.replace(row.sectionName, ''),
        subject: row.courseName,
        title: row.microclassName,
        author: row.uploadUserName,
        uploadUser: row.uploadUser
      }
      sessionStorage.bread = JSON.stringify(bread)
      let obj = {
        activeIndex: this.activeIndex,
        value1: this.value1,
        value2: this.value2,
        input: this.input,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      sessionStorage.chooseItem = JSON.stringify(obj)
      this.$router.push('/course')
    },
    deleteItem (row) {
      this.deleteDia = true
      this.row = row
    },
    async CourseList () {
      this.loading = true
      const data = await this.$store.dispatch('CourseList', {
        courseId: this.subject.filter(item => item.curriculumId === this.value2)[0] ? this.subject.filter(item => item.curriculumId === this.value2)[0].curriculumId : '',
        gradeId: this.arr.filter(item => item.id === this.value1)[0] ? this.arr.filter(item => item.id === this.value1)[0].id : '',
        keyword: this.input,
        checkState: this.activeIndex,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      })
      this.loading = false
      this.tableData = data.list
      this.totalCount = data.totalCount
    }
  },
  async created () {
    await this.getPeroid()
    // 学段
    await this.getSection()
    await this.getSubject()
    if (sessionStorage.chooseItem) {
      this.activeIndex = JSON.parse(sessionStorage.chooseItem).activeIndex
      this.value1 = JSON.parse(sessionStorage.chooseItem).value1
      this.value2 = JSON.parse(sessionStorage.chooseItem).value2
      this.input = JSON.parse(sessionStorage.chooseItem).input
      this.currentPage = JSON.parse(sessionStorage.chooseItem).pageNo
      this.pageSize = JSON.parse(sessionStorage.chooseItem).pageSize
      sessionStorage.chooseItem = ''
    }
    setTimeout(async () => {
      await this.CourseList()
    }, 200)
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/index.scss';
#manageCourse {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;

  .el-pagination {
    text-align: right;
    margin: 30px 20px 0px 0px;
  }

  .dele {
    .el-dialog__body {
      padding: 30px;
    }
  }

  .choose {
    padding: 30px;
    @extend .clearfix;
    border-bottom: 1px solid #ccc;
    &>span {
      padding: 10px 20px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      border-left: 1px solid #ccc;
      cursor: pointer;
      margin-bottom: 20px;
      float: left;

      &:nth-child(3) {
        border-right: 1px solid #ccc;
        margin-right: 40px;
      }
    }
    .active {
      background: #2299EE;
      color: #fff;
      border-color:#2299EE !important;
    }

    .selection {
      float: left;
      /* margin-left: 50px; */
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
  }

  .table-box {
    margin: 30px auto;
    width: 95%;
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
