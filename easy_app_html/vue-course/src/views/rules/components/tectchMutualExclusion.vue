<template>
  <div id="teacher-mutual">
    <el-button class="btn" @click="teacherMutualAddSet">新增设置</el-button>
    <span style="color: #4BD093;padding-top: 20px;display: inline-block;">提示: 教师互斥是指两个老师不能排在同一时段上课</span>
    <table class="subject-classroom">
      <tr>
        <th v-for="item in teacherMutualHeader" :key="item.name">{{item.name}}</th>
      </tr>
      <tr v-for="item in teacherMutualContent" :key="item.subject">
        <td>{{item.teacherOneName}}</td>
        <td>{{item.teacherTwoName}}</td>
        <td v-if="item.mutexType == 1">同天互斥</td>
        <td v-else>同一时段互斥</td>
        <td v-if="item.importance == 1">必须保证</td>
        <td v-else>一般</td>
        <td>
          <span class="green click" @click="teacherMutualChange(item)"><img src="../../../assets/images/green.png" class="cutimg" />修改</span>
          <span class="click" @click="teacherMutualDelete(item)"><img src="../../../assets/images/delete.png" class="cutimg" />删除</span>
        </td>
      </tr>
      <tr v-if="teacherMutualContent.length == 0">
        <td colspan="5" class="no-content">暂无数据</td>
      </tr>
    </table>

     <!--教师互斥-->
    <el-dialog :title="changeOrAdd" :visible.sync="teacherMutualDialog" class="dialog">
      <table class="dialog-table">
        <tr>
          <td>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期 :</td>
          <td>{{ this.semesterId.semesterName }}</td>
        </tr>
        <tr>
          <td>互斥类型 :</td>
          <td>
            <el-select v-model="genre" placeholder="请选择">
              <el-option
                v-for="item in genreList"
                :key="item.name"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>教&nbsp;&nbsp;师&nbsp;&nbsp;一 :</td>
          <td>
            <el-select v-model="teacherOne" placeholder="请选择">
              <el-option
                v-for="(item, i) in teacherList"
                :key="item.teacherName"
                :label="item.teacherName"
                :value="i">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>教&nbsp;&nbsp;师&nbsp;&nbsp;二 :</td>
          <td>
            <el-select v-model="teacherTwo" placeholder="请选择">
              <el-option
                v-for="(item, i) in teacherList"
                :key="item.teacherName"
                :label="item.teacherName"
                :value="i">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>重&nbsp;&nbsp;要&nbsp;&nbsp;性 :</td>
          <td>
            <el-radio class="radio" v-model="radio" :label="1">必须保证</el-radio>
            <el-radio class="radio" v-model="radio" :label="2">一般</el-radio>
          </td>
        </tr>
      </table>
      <footer class="dialog-footer">
        <el-button class="cancel" @click="teacherMutualDialog = false">取消</el-button>
        <el-button class="sure" @click="addSure">保存</el-button>
      </footer>
    </el-dialog>
    <!--删除教师互斥设置-->
    <el-dialog
      title="提示"
      :visible.sync="teacherMutualDeleteDialog"
      size="tiny">
      <span>确认删除当前教师的教师互斥设置吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="teacherMutualDeleteDialog = false" class="cancel">取 消</el-button>
        <el-button type="primary" @click="deleteInfo" class="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notice, success } from '../../../api/index.js'
// import querystring from 'querystring'
export default {
  name: 'teacher-mutual',
  data () {
    return {
      changeOrAdd: '',
      teacherMutualDialog: false,
      teacherMutualDeleteDialog: false,
      teacherMutualHeader: [
        {name: '教师1'},
        {name: '教师2'},
        {name: '互斥类型'},
        {name: '重要性'},
        {name: '操作'}
      ],
      teacherMutualContent: [],
      genre: '',
      teacherOne: '',
      teacherTwo: '',
      radio: 1,
      teacherList: [],
      genreList: [
        { name: '同天互斥', type: 1 },
        { name: '同一时段互斥', type: 2 }
      ],
      modInfo: {}
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
      this.getTable()
    }
  },
  methods: {
    // 新增设置
    teacherMutualAddSet () {
      if (!this.semesterId.semesterId) {
        notice(this, '请选择学期', 2000)
        return
      }
      if (!this.section.id) {
        notice(this, '请选择学段', 2000)
        return
      }
      this.changeOrAdd = '教师互斥新增设置'
      this.teacherMutualDialog = true
      this.teacherOne = ''
      this.teacherTwo = ''
      this.genre = ''
      if (!this.teacherList) return
      this.getTeacherList()
    },
    async getTeacherList () {
      if (!this.semesterId.semesterId || !this.section.id) return
      await this.$https.get(`/common/selectTeacher?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result.forEach(item => {
            if (item.teachers) {
              item.teachers.forEach(items => {
                this.teacherList.push(items)
              })
            }
          })
        }
      })
    },
    addSure () {
      if (!this.genre) {
        notice(this, '请选择互斥类型', 2000)
        return
      }
      if (!this.teacherOne && this.teacherOne !== 0) {
        notice(this, '请选择教师一', 2000)
        return
      }
      if (!this.teacherTwo && this.teacherTwo !== 0) {
        notice(this, '请选择教师二', 2000)
        return
      }
      if (this.teacherOne === this.teacherTwo) {
        notice(this, '请选择两名不同的教师', 2000)
        return
      }
      if (this.changeOrAdd === '教师互斥新增设置') {
        this.$https.get(`/setting/teacherMutexSetAdd?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&teacherOneId=${this.teacherList[this.teacherOne].teacherId}&TeacherOneName=${this.teacherList[this.teacherOne].teacherName}&TeacherTwoId=${this.teacherList[this.teacherTwo].teacherId}&TeacherTwoName=${this.teacherList[this.teacherTwo].teacherName}&MutexType=${this.genre}&Importance=${this.radio}`)
        .then(res => {
          if (res.data.code === 1) {
            this.teacherMutualDialog = false
            success(this, res.data.message, 2000)
            this.getTable()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      } else {
        this.$https.get(`/setting/teacherMutexSetUpdate?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}&teacherOneId=${this.teacherList[this.teacherOne].teacherId}&TeacherOneName=${this.teacherList[this.teacherOne].teacherName}&TeacherTwoId=${this.teacherList[this.teacherTwo].teacherId}&TeacherTwoName=${this.teacherList[this.teacherTwo].teacherName}&MutexType=${this.genre}&Importance=${this.radio}&id=${this.modInfo.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.teacherMutualDialog = false
            success(this, res.data.message, 2000)
            this.getTable()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 编辑
    async teacherMutualChange (item) {
      this.changeOrAdd = '教师互斥编辑'
      this.teacherMutualDialog = true
      this.modInfo = item
      if (!this.teacherList) return
      await this.getTeacherList()
      let arr = this.teacherList.map(items => items.teacherName)
      this.teacherOne = arr.indexOf(item.teacherOneName)
      this.teacherTwo = arr.indexOf(item.teacherTwoName)
      this.genre = item.mutexType
      this.radio = item.importance
    },
    // 删除
    teacherMutualDelete (item) {
      this.teacherMutualDeleteDialog = true
      this.deleteId = item.id
    },
    deleteInfo () {
      // this.$https.post(`/setting/teacherMutexSetDelete`, querystring.stringify({
      //   mutexId: this.deleteId
      // }))
      this.$https.get(`/setting/teacherMutexSetDelete?mutexId=${this.deleteId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.teacherMutualDeleteDialog = false
          this.getTable()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    getTable () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`/setting/teacherMutexSetList?semesterId=${this.semesterId.semesterId}&sectionId=${this.section.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.teacherMutualContent = res.data.result
        }
      })
    }
  },
  watch: {
    semesterId () {
      this.getTable()
    },
    section () {
      this.getTable()
    }
  }
}
</script>

<style lang="scss">
#teacher-mutual {
  height: 100%;
  overflow: auto;
  
  .no-content {
    color: #ccc;
    font-weight: normal;
  }
}
</style>
