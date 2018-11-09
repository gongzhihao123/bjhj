<template>
  <div class="knowledge-list common">
    <section class ="section-crumbs">
      <el-breadcrumb separator=">" class="crumbs">
        <el-breadcrumb-item :to="{ path: '/knowledge/list' }">知识点管理</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in treeMenu.children" :key="item.name">{{ item.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <section class="section-content">
      <section class="section-content-box">
        <div class="list-details" v-loading="loading">
          <div v-for="(item, i) in sectionAddGradeList" :key="item.gradeId" class="list-details-child">
            <div class="left-row">
              <span class="green">{{ item.gradeName }}</span>
              <div class="triangle-right"></div>
            </div>
            <div class="right-row">
              <span v-for="sub in item.subjectList" :key="sub.courseName">
                <span class="blue" @click="route(item, sub)">{{ sub.courseName }}</span>
              </span>
              <i class="add-subject el-icon-plus" @click="addMustSubject(item, i)"></i>
            </div>
          </div>
        </div>
      </section>
      
    </section>
    

    <!--新增考试科目-->
    <el-dialog
      class="addNewSubject"
      :title=addSubjectName
      :visible.sync="addSubjectDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="addSubjectDialog = false"></i>
      <div>
        <span>学科：</span>
        <el-select v-model="subjectId" placeholder="请选择" class="dialog-table-input">
          <el-option
            v-for="(item, i) in subjectLists"
            :key="item.id"
            :label="item.name"
            :disabled="item.disabled"
            :value="i">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addSubjectDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSubjectSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { success, notice } from '../../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'knowledge-list',
  data () {
    return {
      loading: false,
      addSubjectDialog: false,
      addSubjectName: '',
      subjectLists: [],
      subjectId: '',
      treeMenu: [
        {
          name: '语文',
          children: [
            { name: '知识点', path: '/knowledge/subjectDetail', parentName: '语文', parentPath: '/knowledge/list', firstName: '知识点', type: 1 }
          ]
        }
      ],
      sectionAddGradeList: [],
      sectionName: '',
      sectionId: '',
      gradeName: '',
      gradeId: '',
      courseId: '',
      courseName: '',
      asideIndex: ''
    }
  },
  methods: {
    // 获取学段
    async getSection () {
      await this.$https.get(`/common/sectionGradeList`)
      .then(res => {
        if (res.data.code === 1) {
          let result = (res.data.result || []).filter(item => item).filter(item => item.name.indexOf('幼儿园') === -1)
          this.sectionAddGradeList = (result || []).map(item => ({
            ...item,
            gradeList: (item.gradeList || []).map(items => ({
              gradeId: items.id,
              gradeName: items.name,
              sectionId: item.id,
              sectionName: item.name
            }))
          }))
          let juniorGrades = []
          this.sectionAddGradeList.forEach(subs => {
            juniorGrades = juniorGrades.concat(subs.gradeList)
          })
          this.sectionAddGradeList = [ ...juniorGrades ]
          this.sectionAddGradeList = this.sectionAddGradeList.map(item => ({
            ...item,
            subjectList: [],
            infoId: ''
          }))
        }
      })
    },
    // 根据学段获取学科信息
    async subjectList () {
      this.subjectLists = []
      await this.$https.get(`/common/subjectList?sectionId=${this.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subjectLists = res.data.result.map(item => ({...item, disabled: false, requireFlag: ''}))
        }
      })
    },
    route (item, subs) {
      this.$router.push({path: '/knowledge/subjectDetail', query: {infoId: subs.id, gradeName: item.gradeName, courseName: subs.courseName}})
    },
    // 新增科目
    async addMustSubject (items, index) {
      this.subjectId = ''
      this.asideIndex = index
      this.sectionName = items.sectionName
      this.sectionId = items.sectionId
      this.gradeName = items.gradeName
      this.gradeId = items.gradeId
      this.addSubjectName = '新增学科'
      await this.subjectList()
      this.filterSubject()
      this.addSubjectDialog = true
    },
    // 获取年级和学科关联信息列表
    getGradeAndSubjectList () {
      this.loading = true
      this.$https.get(`knowledge/gradeCourseList`)
      .then(res => {
        // console.log(res)
        this.loading = false
        if (res.data.code === 1) {
          let gradeAndSubjectList = res.data.result
          this.sectionAddGradeList.forEach(item => {
            gradeAndSubjectList.forEach(items => {
              if (item.gradeId === items.gradeId) {
                item.subjectList.push(items)
                item.infoId = items.id
              }
            })
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 新增学科弹框确定按钮
    addSubjectSure () {
      this.courseId = this.subjectLists[this.subjectId].id
      this.courseName = this.subjectLists[this.subjectId].name
      this.$https.post(`knowledge/gradeCourseAdd`, querystring.stringify({
        sectionId: this.sectionId,
        gradeId: this.gradeId,
        courseId: this.courseId,
        sectionName: this.sectionName,
        gradeName: this.gradeName,
        courseName: this.courseName
      }))
      .then(async res => {
        if (res.data.code === 1) {
          this.addSubjectDialog = false
          this.sectionAddGradeList = this.sectionAddGradeList.map(item => ({
            ...item,
            subjectList: []
          }))
          await this.getGradeAndSubjectList()
          this.filterSubject()
          success(this, res.data.message, 2000)
        }
      })
    },
    filterSubject () {
      this.subjectLists = this.subjectLists.map(item => ({...item, disabled: false}))
      this.subjectLists.forEach(item => {
        this.sectionAddGradeList[this.asideIndex].subjectList.forEach(subs => {
          if (item.id === subs.courseId) {
            item.disabled = true
            this.$set(item, 'disabled', true)
          }
        })
      })
    }
  },
  async created () {
    await this.getSection()
    this.getGradeAndSubjectList()
  }
}
</script>

<style lang="scss">
.knowledge-list {
   .section-content {
     background: #fff !important;
   }
   .section-content-box {
     width: calc(100% - 80px);
     height: calc(100%);
     padding: 0 40px;
     overflow: auto;
     .list-details {
      min-width: 100%;
      background: #fff;
      .list-details-child {
        display: grid;
        grid-template-columns: 150px auto;
        padding: 30px 0;
        // grid-template-rows: 100px; 
        line-height: 100px;
        border-bottom: 1px solid #ccc;
        div:first-child {
          display: inline-block;
          width: 150px;
          span {
            display: inline-block;
            width: 80px;
            height: 30px;
            text-align: center;
            border-radius: 4px;
            line-height: 30px;
            color: #fff;
          }
        }
        div:last-child {
          // display: inline-block;
          // display: table-cell;
          // vertical-align: inherit;
          span {
            display: inline-block;
            width: 60px;
            height: 30px;
            text-align: center;
            border-radius: 14px;
            line-height: 30px;
            color: #fff;
            margin-right: 20px;
            cursor: pointer;
          }
          .add-subject {
            position: relative;
            display: inline-block;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            line-height: 28px;
            text-align: center;
            margin-left: 20px;
            background: #D6E9F7;
            border: 1px dashed #B3D7F3;
            color: #B3D7F3;
            cursor: pointer;
          }
        }
      }
      .blue {
        background: #55ACEE;
      }
      .green {
        background: #7FCE89;
      }
      .triangle-right {
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: -6px;
        border-top: 5px solid transparent;
        border-left: 6px solid #7FCE89;
        border-bottom: 5px solid transparent;
      }
      .addNewSubject {
        .el-dialog,.el-dialog--small {
          width: 300px !important;
        }
      }
      .right-row {
        min-height: 100px !important;
        display: inline-table;
      }
    }
   }
}
  
</style>

