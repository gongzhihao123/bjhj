<template>
  <div class="addApplay">
    <el-form :model="form" ref="form" label-width="150px" :rules="rule" label-position="left" v-loading="formLoading">

      <el-form-item 
        prop="name"
        :rules="[{ required: !flagList.nameFlag, message: '请输入课程名称', trigger: 'blur' }]"
        >
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课程名称：</span>
        <div ref="name">
          <el-input 
          v-model="form.name" 
          :maxlength="50" 
          placeholder="请输入课程名称" 
          style="width: 360px"
          :disabled="flagList.nameFlag"></el-input>
        </div>
      </el-form-item>

      <el-form-item prop="typeId">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课程类别：</span>
        <div ref="typeId">
            <el-select 
            v-model="form.typeId" 
            placeholder="请选择课程类别" 
            style="width: 360px"
            :disabled="flagList.typeFlag">
            <el-option 
              v-for="item in type"
              :value="item.id"
              :key="item.id"
              :label="item.name"></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item prop="startWeek"
                    :rules="[
                      { required: !flagList.startWeekFlag, type: 'number', message: '请选择开始上课时间', trigger: 'change' }
                    ]"
                    v-if="!flagList.startWeekDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>开始上课时间：</span>
          <el-input-number  v-model="form.startWeek" :min="1" :max="20" :disabled="flagList.startWeekFlag"></el-input-number>
          <span style="color: #bfcbd9">( 周 )</span>
      </el-form-item>

      <el-form-item prop="weekNum" v-if="!flagList.weekNumDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课时数：</span>
        <el-input-number  v-model="form.weekNum" :min="1" :max="20" :disabled="flagList.weekNumFlag"></el-input-number>
        <span style="color: #bfcbd9">( 周 )</span>
      </el-form-item>
  
      <el-form-item prop="selectRange"
                    :rules="[
                      { required: !flagList.objectFlag, type: 'array', message: '请选择活动对象', trigger: 'blur' }
                    ]">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>活动对象：</span>
        <div ref="selectRange">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkTotal" :disabled="flagList.objectFlag">全选</el-checkbox>
          <div class="line"></div>
          <div class="class-box">
            <div class="class-list" v-for="(item, index) in gradList" :key="index" v-if="item.classList">
              <el-checkbox 
                :indeterminate="item.isIndeterminate" 
                v-model="item.checkAll"
                @change="handleCheckAllChange($event, item)"
                :disabled="flagList.objectFlag">{{ item.gradeName }}</el-checkbox>
              <el-checkbox-group v-model="item.checkList" @change="handleCheckedListChange($event, item)">
                <el-checkbox v-for="child in item.classList" :label="child.id" :key="child.id" :disabled="flagList.objectFlag">{{ child.className }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item prop="sex">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>学生性别：</span>
        <div ref="sex">
          <el-radio-group v-model="form.sex" :disabled="flagList.sexFlag">
            <el-radio :label="0">所有学生</el-radio>
            <el-radio :label="1">男生</el-radio>
            <el-radio :label="2">女生</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item prop="limitNum">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>人数限制：</span>
        <el-input-number  v-model="form.limitNum" :min="0" :max="200" :disabled="flagList.limitFlag"></el-input-number>
      </el-form-item>
  
      <el-form-item 
                      prop="teacherIntro"
                          :rules="[
                      { required: !flagList.teacherIntroFlag, message: '请输入教师简介', trigger: 'change' }
                      ]"
                      v-if="!flagList.teacherIntroDeleteFlag">
        <div ref="teacherIntro">
          <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>教师简介：</span>
          <edit @ready="teacherReady" class="ueditor" ref="teacherEdit"></edit>
        </div>
      </el-form-item>

      <el-form-item 
            prop="lessonIntro"
            :rules="[{ required: !flagList.lessonIntroFlag, message: '请输入课程简介', trigger: 'change' }]"
            v-if="!flagList.lessonIntroDeleteFlag">
        <div ref="lessonIntro">
          <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课程简介：</span>
          <edit @ready="introReady" class="ueditor" ref="lessonEdit"></edit>
        </div>
      </el-form-item>

      <el-form-item 
                    prop="lessonTimeId">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>上课时间：</span>
        <div ref="lessonTimeId">
          <el-select 
          v-model="form.lessonTimeId" 
          placeholder="请选择上课时间" 
          style="width: 360px"
          :disabled="flagList.lessonTimeFlag">
          <el-option
            v-for="item in timeList"
            :value="item.id"
            :key="item.id"
            :label="item.name"></el-option>
        </el-select>
        </div>
      </el-form-item>

      <el-form-item 
                    prop="location"
                    :rules="[
                      { required: !flagList.locationFlag, type: 'object', message: '请选择上课地点', trigger: 'change' }
                    ]">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>上课地点：</span>
        <div ref="location">
           <el-select 
            v-model="form.location" 
            value-key="id" 
            placeholder="请选择上课地点" 
            style="width: 360px"
            :disabled="flagList.locationFlag">
            <el-option
              v-for="item in placeList"
              :value="item"
              :key="item.id"
              :label="item.name"></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item 
          v-for="(item, index) in form.customs" 
          :key="item.id"
          :prop="'customs.' + index + '.content'"
          :rules="[
            { required: !item.flag, message: '请输入内容', trigger: 'blur' }
          ]">
          <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>{{ item.name }}:</span>        
          <el-input 
            type="textarea" 
            v-model="item.content" 
            :maxlength="200" 
            style="width: 360px"
            :rows="3"
            :disabled="item.flag"></el-input>
      </el-form-item>

      <div class="btn">
        <el-button type="danger" @click="back">取消</el-button>
        <el-button type="success" @click="submit('form')">保存</el-button>
        <!-- <el-button>保存并编辑下一个</el-button> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import edit from '../../components/edit'
import server from '../../utils/axios'
import { notice, success } from '../../api/index'
import { mapState } from 'vuex'
import { num } from '../../filters'
export default {
  name: 'addApplay',

  components: { edit },

  data () {
    const type = (rule, value, callback) => {
      if (!this.flagList.typeFlag) {
        if (value === '') {
          callback(new Error('请选择课程类别'))
        } else callback()
      } else callback()
    }

    const time = (rule, value, callback) => {
      if (!this.flagList.lessonTimeFlag) {
        if (value === '') {
          callback(new Error('请选择上课时间'))
        } else callback()
      } else callback()
    }

    return {
      id: '',
      state: '',
      checkAll: false,
      isIndeterminate: false,
      backState: false,
      loading: false,
      formLoading: false,
      form: {
        name: '',
        typeId: '', // 课程类别
        startWeek: '', // 开始上课时间
        weekNum: '', // 课时数
        sex: 0, // 性别
        selectRange: [], // 班级id
        limitNum: '', // 人数限制
        teacherIntro: '', // 教师简介
        lessonIntro: '', // 课程简介
        lessonTimeId: '', // 上课时间
        location: {}, // 上课地点
        customs: [],
        templateId: ''
        // locationId: '', // 课程地点
        // locationName: '' // 上课地点名称
      },
      type: [],
      gradList: [],
      timeList: [],
      placeList: [],
      teacherList: [],
      teacherAllList: [],
      flagList: [],
      rule: {
        typeId: [
          { validator: type, trigger: 'change' }
        ],
        lessonTimeId: [
          { validator: time, trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      // activityId: state => state.dManage.activityId
    }),

    nowSemester () {
      return this.$store.getters.semesterList.filter(item => item.state === 1)[0]
    },

    sectionList () {
      return this.$store.getters.sectionList
    }
  },

  methods: {
    getElementTop (element) {
      var actualTop = element.offsetTop
      var current = element.offsetParent
      while (current !== null) {
        actualTop += current.offsetTop
        current = current.offsetParent
      }
      return actualTop
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.teacherList = this.teacherAllList.filter(item => {
            return item.teacherName.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.teacherList = []
      }
    },

    checkTotal (e) {
      this.gradList.forEach(item => {
        if (e.target.checked) {
          item.checkAll = true
          this.handleCheckAllChange({ target: { checked: true } }, item)
        } else {
          item.checkAll = false
          this.handleCheckAllChange({ target: { checked: false } }, item)
        }
      })
      this.isIndeterminate = false
    },

    changeTotal () {
      let checkedCountTotal = this.gradList.filter(item => item.checkAll === true).length
      this.checkAll = checkedCountTotal === this.gradList.length
      this.isIndeterminate = checkedCountTotal > 0 && checkedCountTotal < this.gradList.length
      this.total()
    },

    handleCheckAllChange (e, item) {
      item.checkList = e.target.checked ? item.classList.map(item => item.id) : []
      item.isIndeterminate = false
      this.changeTotal(item)
    },

    handleCheckedListChange (e, item) {
      let checkedCount = e.length
      item.checkAll = checkedCount === item.classList.length
      item.isIndeterminate = checkedCount > 0 && checkedCount < item.classList.length

      let checkedCountTotal = this.gradList.filter(item => item.checkAll === true).length
      this.checkAll = checkedCountTotal === this.gradList.length
      this.isIndeterminate = checkedCountTotal >= 0 && checkedCountTotal < this.gradList.length
      this.total()
    },

    total () {
      this.form.selectRange = []
      for (let i = 0; i < this.gradList.length; i++) {
        let arr = this.gradList[i].classList
                  .filter(item => {
                    return this.gradList[i].checkList.indexOf(item.id) !== -1
                  })
                  .map(item => {
                    return {
                      gradeId: this.gradList[i].gradeId,
                      gradeName: this.gradList[i].gradeName,
                      className: item.className,
                      classId: item.id
                    }
                  })
        this.form.selectRange.push(...arr)
      }
    },
    submit (formName) {
      var arr = []
      this.$refs[formName].validateField('name', (valid) => {
        if (valid) {
          arr.push(this.getElementTop(this.$refs.name))
        }
      })
      this.$refs[formName].validateField('typeId', (valid) => {
        if (valid) {
          arr.push(this.getElementTop(this.$refs.typeId))
        }
      })
      this.$refs[formName].validateField('selectRange', (valid) => {
        if (valid) {
          arr.push(this.getElementTop(this.$refs.selectRange))
        }
      })
      this.$refs[formName].validateField('location', (valid) => {
        if (valid) {
          arr.push(this.getElementTop(this.$refs.location))
        }
      })
      this.$refs[formName].validateField('teacherIntro', (valid) => {
        if (valid) {
          arr.push(this.getElementTop(this.$refs.teacherIntro))
        }
      })
      this.$refs[formName].validateField('lessonTimeId', (valid) => {
        if (valid) {
          arr.push(this.getElementTop(this.$refs.lessonTimeId))
        }
      })
      this.$refs[formName].validateField('lessonIntro', (valid) => {
        if (valid) {
          arr.push(this.getElementTop(this.$refs.lessonIntro))
        }
      })
      if (arr.length !== 0) {
        document.querySelector('.content').scrollTop = arr[0] - 70
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let url
          let para = {
            activityId: this.history ? this.history : this.activityId,
            name: this.form.name,
            typeId: this.form.typeId,
            templateId: this.form.templateId,
            startWeek: this.form.startWeek,
            weekNum: this.form.weekNum,
            sex: this.form.sex,
            limitNum: this.form.limitNum,
            teacherIntro: this.form.teacherIntro,
            lessonIntro: this.form.lessonIntro,
            lessonTimeId: this.form.lessonTimeId,
            locationName: this.form.location.name,
            locationId: this.form.location.id,
            selectRange: JSON.stringify(this.form.selectRange),
            custom: JSON.stringify((this.form.customs || []).map(item => ({ customId: item.id, content: item.content })))
          }
          if (this.state === 'add' || this.state === 'copy') url = '/tLessonController/addLesson'
          else {
            url = '/tLessonController/updateLesson'
            para.lessonId = this.id
            delete para.activityId
          }
          const { data } = await server.post(url, para)
          if (data.code !== 1) notice(this, data.message, 2000)
          else {
            success(this, '操作成功', 2000)
            this.backState = true
            this.$router.push('/tApply/apply')
          }
        } else {
          return false
        }
      })
    },

    back () {
      this.$confirm('确定取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.backState = true
        this.$router.push('/tApply/apply')
      }).catch(() => {})
    },

    introReady (instance) {
      instance.setContent(this.form.lessonIntro)
      instance.addListener('contentChange', () => {
        this.form.lessonIntro = instance.getContent()
      })
    },

    teacherReady (instance) {
      instance.setContent(this.form.teacherIntro)
      instance.addListener('contentChange', () => {
        this.form.teacherIntro = instance.getContent()
      })
    },

    async init () {
      this.formLoading = true

      // 类型
      const { data } = await server.get(`/tLessonController/getLessonTypeList?activityId=${this.history ? this.history : this.activityId}`)
                            .catch(_ => { this.formLoading = false })
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.type = (data.result || []).map(item => ({ name: item.name, id: item.id }))
      }

      // 时间
      const time = await server.get(`/tLessonController/getLessonTimeList?activityId=${this.history ? this.history : this.activityId}`)
                                .finally(() => { this.formLoading = false })
      if (time.data.code === 1) {
        this.timeList = time.data.result.map(item => {
          return {
            name: `星期${num(item.week)}第${num(item.section)}节`,
            id: item.id
          }
        })
      }

      // 地点
      const place = await server.get('/common/selectClassRoomList')
                          .catch(_ => { this.formLoading = false })
      if (place.data.code === 1) this.placeList = place.data.result.map(item => ({ name: `${item.classroomNo}`, id: item.id }))

      // 获取模板
      const templateData = await server.get(`/tLessonController/getTemplate?templateId=${this.form.templateId}`)
                          .catch(_ => { this.formLoading = false })
      if (templateData.data.code === 1) {
        // 当增加时取模板id customs
        if (this.id === '') {
          this.form.templateId = templateData.data.result.id
          this.form.customs = templateData.data.result.customs.map(item => {
            return {
              id: item.id,
              name: item.name,
              flag: item.flag === 1,
              content: ''
            }
          })
        }
        this.flagList = { ...templateData.data.result }
      }
      // 如果id 存在，则是编辑或者复制
      if (this.id !== '') {
        // this.isIndeterminate = true
        const contentData = await server.get(`/tLessonController/getLessionAndCheckDetails?id=${this.id}` +
                            `&activityId=${this.activityId}`)
                            .finally(() => { this.formLoading = false })
        if (contentData.data.code === 1) {
          this.form = {
            ...contentData.data.result,
            location: {
              id: contentData.data.result.locationId,
              name: contentData.data.result.locationName
            },
            selectRange: contentData.data.result.classList,
            customs: [...(contentData.data.result.templateList || []).map(item => ({ name: item.templateName || '', content: item.content, id: item.id }))]
          }
          this.isIndeterminate = contentData.data.result.classList.length !== 0
          if (this.state === 'copy') {
            this.isIndeterminate = false
            this.form.startWeek = 0
            this.form.selectRange = []
            this.form.sex = 0
            this.form.typeId = this.type[0].id
            this.form.lessonTimeId = this.timeList[0].id
          }
        }
      }

      // 班级
      if (!this.nowSemester || !this.nowSemester.semesterId) return
      for (let i = 0; i < this.sectionList.length; i++) {
        const { data } = await server.get(`/common/selectGradeClassList?` +
                        `semesterId=${this.nowSemester.semesterId}&sectionId=${this.sectionList[i].id}`)
                        .catch(_ => { this.formLoading = false })
        const nGrad = await server.get(`/tLessonController/getActivityGradeList?activityId=${this.activityId}` +
                            `&sectionId=${this.sectionList[i].id}`)
                            .catch(_ => { this.formLoading = false })
        let nId
        if (nGrad.data.code === 1) {
          nId = nGrad.data.result.map(item => item.gradeId)
        }

        let arr = data.result.filter(item => {
          return nId.indexOf(item.id) !== -1
        })

        this.gradList.push(...arr.map(item => {
          let checkList = (this.form.selectRange || [])
                          .filter(n => n.gradeId === item.id)
                          .map(n => n.classId)
          return {
            gradeName: item.name,
            gradeId: item.id,
            classList: item.classList,
            isIndeterminate: checkList.length !== 0 && checkList.length < item.classList.length,
            checkAll: checkList.length === item.classList.length && item.classList.length !== 0,
            checkList
          }
        }))
        this.changeTotal()
      }

      this.introReady(this.$refs.lessonEdit.instance)
      this.teacherReady(this.$refs.teacherEdit.instance)
      if (this.flagList.teacherIntroFlag) this.$refs.teacherEdit.instance.setDisabled()
      if (this.flagList.lessonIntroFlag) this.$refs.lessonEdit.instance.setDisabled()
      this.formLoading = false
    }
  },

  created () {
    this.id = this.$route.params.id ? this.$route.params.id : ''
    this.activityId = this.$route.query.parameter
    this.history = this.$route.query.history
    this.state = this.$route.params.state ? this.$route.params.state : ''
    console.log(this.state)
    this.init()
  },

  beforeRouteLeave (to, from, next) {
    if (this.backState) {
      next()
      return
    }
    this.$confirm('系统将不会保存您的内容，确定离开吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch(() => {
      next(false)
    })
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.addApplay {
  .el-form {
    padding: $width;
    background: $white;
    border-radius: 4px;

    .form-label {
      color: $blue;
    }

    .line {
      margin: 4px 0;
      height: 1px;
      border-bottom: 1px dashed $border-color;
    }

    .el-checkbox-group {
      padding-left: 30px;

      .el-checkbox {
        margin: 0 8px;
      }
    }

    .quill-editor {
      line-height: 20px;

      .ql-container {
        height: 280px;
      }
    }

    >.btn {
      text-align: right;
    }
  }
}
</style>
