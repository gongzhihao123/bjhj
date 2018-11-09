<template>
  <div id="connect-restrict" class="clearfix">
    <el-input
      icon="search"
      v-model="searchTeacher"
      :on-icon-click="handleIconClick">
    </el-input>
    <span style="color: #4BD093;padding-top: 20px;display: inline-block;">提示: 教师连上限制是指教师上午最后一节和下午第一节不能连上</span>
    <table class="subject-classroom">
      <tr>
        <th rowspan="2">教师</th>
        <th>重要程度</th>
      </tr>
      <tr>
        <td class="set-all">
          <el-radio class="radio" v-model="radio" :label="1">必须保证<span style="padding-left:140px;"></span></el-radio>
          <el-radio class="radio" v-model="radio" :label="2">一般</el-radio>
        </td>
      </tr>
      <tr v-for="item in teacherList" :key="item.grade">
        <td>{{item.teacherName}}</td>
        <td>
          <el-radio class="radio" v-model="item.importance" :label="1" :name="item.teacherName" @change.native="editAll(item)">必须保证<span style="padding-left:140px;"></span></el-radio>
          <el-radio class="radio" v-model="item.importance" :label="2" :name="item.teacherName" @change.native="editAll(item)">一般</el-radio>
        </td>
      </tr>
    </table>
     <!--连上限制-->
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { notice } from '../../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'connect-restrict',
  data () {
    return {
      restrictHeader: [
        {name: '教师'},
        {name: '重要程度'}
      ],
      teacherList: [],
      radio: 1,
      searchTeacher: '',
      filterList: []
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
      this.getTeacher()
    }
  },
  methods: {
    getTeacher () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`/setting/connectTeacherSetList?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.teacherList = [ ...res.data.result ]
          this.filterList = [ ...this.teacherList ]
          let a = this.teacherList.every(item => item.importance === 2)
          if (a) {
            this.radio = 2
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    handleIconClick (ev) {
    },
    editAll (item) {
      let teacherId = ''
      let isAll = true
      let importance = this.radio
      if (item) {
        teacherId = item.teacherId
        isAll = false
        importance = item.importance
      }
      this.$https.post(`/setting/connectTeacherSetSave`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        importance,
        teacherId,
        isAll
      }))
      .then(res => {
        if (res.data.code === 1) {
          if (!item) {
            this.teacherList = this.teacherList.map(item => ({...item, importance: this.radio}))
          }
        }
      })
    }
  },
  watch: {
    semesterId () {
      this.getTeacher()
    },
    section () {
      this.getTeacher()
    },
    searchTeacher (val) {
      this.teacherList = this.filterList.filter(item => item.teacherName.indexOf(val) !== -1)
    },
    radio (val) {
      this.editAll()
    }
  }
}
</script>

<style lang="scss">
#connect-restrict {
  height: 100%;
  overflow: auto;
  
  .el-input {
    width: 200px;
    float: right;
    margin-bottom: 20px;
    .el-input__inner {
      border-color: #4DD091;
    }
    .el-input__icon.is-clickable:hover {
      cursor: pointer;
      color: #4DD091; 
    }
    .el-input__icon {
      color: #4DD091; 
    }
  }
  .set-all {
    background:#26CEA9;
    .el-radio {
      color: #fff;
    }
  }
}
</style>
