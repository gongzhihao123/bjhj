<template>
  <div id="other-set" class="clearfix">
    <div class="tootil">
      <span style="color: #4BD093;padding-bottom: 20px;display: inline-block;">
        提示: 教案平齐是张三老师教完1班教2班，而不是1班上了两节课后2班才上1节课。<br />
        <span style="padding-right:35px;"></span>周课时分布是指该学科课程的课时在一周内平均分布。
      </span>
    </div>
    <div class="left-nav">
      <el-tree
        :data="gradeList"
        :props="defaultProps"
        :highlight-current="true"
        @node-click="handleNodeClick">
      </el-tree>
    </div>
    <div class="right-content">
      <table class="subject-classroom">
        <tr>
          <th rowspan="2">学科</th>
          <th rowspan="2">年级</th>
          <th>教案平齐</th>
          <th>周课时分布</th>
        </tr>
        <tr>
          <td class="set-all">
            <el-radio class="radio" v-model="radio" :label="1" @change.native="lessonPlan(1)">必须保证<span style="padding-left:140px;"></span></el-radio>
            <el-radio class="radio" v-model="radio" :label="2" @change.native="lessonPlan(1)">一般</el-radio>
          </td>
          <td class="set-all">
            <el-radio class="radio" v-model="weekAll" :label="1" @change.native="lessonPlan(1)">必须保证<span style="padding-left:140px;"></span></el-radio>
            <el-radio class="radio" v-model="weekAll" :label="2" @change.native="lessonPlan(1)">一般</el-radio>
          </td>
        </tr>
        <tr v-for="item in subjectList" :key="item.subjectName">
        <td>{{ item.subjectName }}</td>
        <td>{{item.gradeName}}</td>
        <td>
          <el-radio class="radio" v-model="item.lessonPlan" :label="1" @change.native="lessonPlan(item)">必须保证<span style="padding-left:140px;"></span></el-radio>
          <el-radio class="radio" v-model="item.lessonPlan" :label="2" @change.native="lessonPlan(item)">一般</el-radio>
        </td>
        <td>
          <el-radio class="radio" v-model="item.classDistribution" :label="1" @change.native="lessonPlan(item)">必须保证<span style="padding-left:140px;"></span></el-radio>
          <el-radio class="radio" v-model="item.classDistribution" :label="2" @change.native="lessonPlan(item)">一般</el-radio>
        </td>
      </tr>
      </table>
    </div>

  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { notice } from '../../../api/index.js'
export default {
  name: 'other-set',
  data () {
    return {
      gradeList: [],
      defaultProps: {
        children: 'teachers',
        label: 'name'
      },
      // listHeader: [
      //   {name: '学科'},
      //   {name: '年级'},
      //   {name: '教案平齐'},
      //   {name: '周课时分布'}
      // ],
      radio: 1,
      weekAll: 1,
      subjectList: [],
      subject: '',
      activeSubject: ''
    }
  },
  computed: {
    ...mapGetters([
      'semesterId',
      'section'
    ])
  },
  created () {
    if (this.semesterId.semesterId && this.section.id) {
      this.getSubject()
    }
  },
  methods: {
    getSubject () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`/common/selectSubject?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let arr = res.data.result.map((item, i) => ({
            name: item.curriculumName,
            id: item.chooiceId,
            gradeIndex: i
            // teachers: item.gradeInfo.map(items => ({
            //   name: items.gradeName,
            //   id: items.gradeId,
            //   subjectId: item.chooiceId,
            //   gradeIndex: i,
            //   subjectName: item.curriculumName
            // }))
          }))
          this.gradeList = [
            { name: '全部学科', parent: 1, teachers: arr }
          ]
          this.getTable()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    handleNodeClick (data) {
      if (data.parent === 1) {
        this.activeSubject = ''
        this.getTable()
      } else {
        this.activeSubject = data
        this.getTable()
      }
    },
    getTable () {
      let subjectId = ''
      this.subjectList = []
      if (this.activeSubject.id) {
        subjectId = this.activeSubject.id
      }
      this.$https.get(`/setting/otherSetList?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&subjectId=${subjectId}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result.forEach(item => {
            item.list.forEach(items => {
              this.subjectList.push(items)
            })
          })
          let a = this.subjectList.every(item => item.lessonPlan === 2)
          if (a) {
            this.radio = 2
          }
          a = this.subjectList.every(item => item.classDistribution === 2)
          if (a) {
            this.weekAll = 2
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    lessonPlan (item) {
      let lessonPlan = ''
      let classDistribution = ''
      let gradeId = ''
      let gradeName = ''
      let subjectId = ''
      let subjectName = ''
      if (item === 1) {
        lessonPlan = this.radio
        classDistribution = this.weekAll
        if (this.activeSubject) {
          subjectId = this.activeSubject.id
          subjectName = this.activeSubject.name
        }
      } else {
        lessonPlan = item.lessonPlan
        classDistribution = item.classDistribution
        gradeId = item.gradeId
        gradeName = item.gradeName
        subjectId = item.subjectId
        subjectName = item.subjectName
      }
      this.$https.get(`setting/otherSetSave?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&lessonPlan=${lessonPlan}&classDistribution=${classDistribution}&gradeId=${gradeId}&gradeName=${gradeName}&subjectId=${subjectId}&subjectName=${subjectName}`)
      .then(res => {
        if (res.data.code === 1) {
          if (item === 1) {
            this.subjectList = this.subjectList.map(item => ({...item, lessonPlan: this.radio, classDistribution: this.weekAll}))
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  watch: {
    semesterId () {
      this.getSubject()
    },
    section () {
      this.getSubject()
    }
  }
}
</script>



<style lang="scss">
#other-set {
  padding-bottom: 20px;
  width: 100%;
  height: calc(100% - 20px);
  // overflow: auto;

  div.right-content {
    float: left;
    width: 84%;
    height: calc(100% - 60px);
    overflow: auto;
    // border-radius: 4px;
  }
  .set-all {
    background:#26CEA9;
    .el-radio {
      color: #fff;
    }
  }
  .left-nav {
    height: calc(100% - 80px);
    overflow: auto;
  }
}
</style>
