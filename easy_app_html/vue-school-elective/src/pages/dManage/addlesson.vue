<template>
  <div class="addlesson">
    <el-form 
      :model="form" 
      ref="form" 
      label-width="150px" 
      label-position="left" 
      v-loading="formLoading">

      <el-form-item 
                    prop="name"
                    :rules="[
                      { required: true, message: '请输入课程名称', trigger: 'change' }
                    ]">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课程名称：</span>
        <el-input v-model="form.name" :maxlength="50" placeholder="请输入课程名称" style="width: 360px"></el-input>
      </el-form-item>

      <el-form-item prop="typeId"
                    :rules="[
                      { required: true, type: 'number', message: '请选择课程类别', trigger: 'change' }
                    ]">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课程类别：</span>
        <el-select v-model="form.typeId" placeholder="请选择课程类别" style="width: 360px">
          <el-option 
            v-for="item in type"
            :value="item.id"
            :key="item.id"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="teacher"
                    :rules="[
                      { required: true, type: 'object', message: '请选择授课教师', trigger: 'change' }
                    ]">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>授课教师：</span>
            <el-select
              v-model="form.teacher"
              filterable
              remote
              placeholder="请输入关键字"
              :remote-method="remoteMethod"
              :loading="loading"
              @visible-change="teaches"
              style="width: 360px"
              value-key="teacherId">
              <el-option
                v-for="item in teacherList"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item">
              </el-option>
            </el-select>
      </el-form-item>

      <el-form-item prop="startWeek" v-if="!flagList.startWeekDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>开始上课时间：</span>
          <el-input-number  v-model="form.startWeek" :min="1" :max="20" ></el-input-number>
          <span style="color: #bfcbd9">( 周 )</span>
      </el-form-item>

      <el-form-item prop="weekNum" v-if="!flagList.weekNumDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课时数：</span>
        <el-input-number  v-model="form.weekNum" :min="1" :max="20" ></el-input-number>
        <span style="color: #bfcbd9">( 周 )</span>
      </el-form-item>
  
      <el-form-item prop="selectRange"
                    :rules="[
                      { required: true, type: 'array', message: '请选择活动对象', trigger: 'blur' }
                    ]">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>活动对象：</span>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkTotal">全选</el-checkbox>
        <div class="line"></div>
        <div class="class-box">
          <div class="class-list" v-for="(item, index) in gradList" :key="index" v-if="item.classList">
            <el-checkbox 
              :indeterminate="item.isIndeterminate" 
              v-model="item.checkAll"
              @change="handleCheckAllChange($event, item)">{{ item.gradeName }}</el-checkbox>
            <el-checkbox-group v-model="item.checkList" @change="handleCheckedListChange($event, item)">
              <el-checkbox v-for="child in item.classList" :label="child.id" :key="child.id">{{ child.className }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>

      <el-form-item prop="sex">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>学生性别：</span>
        <el-radio-group v-model="form.sex">
          <el-radio :label="0">所有学生</el-radio>
          <el-radio :label="1">男生</el-radio>
          <el-radio :label="2">女生</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="limitNum">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>人数限制：</span>
        <el-input-number  v-model="form.limitNum" :min="0" :max="200" ></el-input-number>
      </el-form-item>
  
      <el-form-item prop="teacherIntro"
                    :rules="[
                      { required: true, message: '请输入教师简介', trigger: 'change' }
                    ]"
                    v-if="!flagList.teacherIntroDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>教师简介：</span>
        <edit @ready="teacherReady" class="ueditor" ref="teacherEdit"></edit>
      </el-form-item>

      <el-form-item prop="lessonIntro"
                    :rules="[
                      { required: true, message: '请输入课程简介', trigger: 'change' }
                    ]"
                    v-if="!flagList.lessonIntroDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课程简介：</span>
        <edit @ready="introReady" class="ueditor" ref="lessonEdit"></edit>
      </el-form-item>

      <el-form-item prop="lessonTimeId">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>上课时间：</span>
        <el-select v-model="form.lessonTimeId" placeholder="请选择上课时间" style="width: 360px" @change="getPlace">
          <el-option
            v-for="item in timeList"
            :value="item.id"
            :key="item.id"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="location"
                    :rules="[
                      { required: true, type: 'object', message: '请选择上课地点', trigger: 'change' }
                    ]">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>上课地点：</span>
        <el-select
          v-model="form.location" 
          value-key="id" 
          placeholder="请选择上课地点" 
          style="width: 360px"
          :disabled="!flagList.lessonTimeFlag && !flagList.locationFlag && !form.lessonTimeId">
          <el-option
            v-for="item in placeList"
            :value="item"
            :key="item.id"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
          v-for="(item, index) in form.customs" 
          :key="item.id"
          :prop="'customs.' + index + '.content'"
          :rules="[
            { required: true, message: '请输入内容', trigger: 'blur' }
          ]">
          <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>{{ item.name }}:</span>        
          <el-input 
            type="textarea" 
            v-model="item.content" 
            :maxlength="200"
            style="width: 360px"
            :rows="3"></el-input>
      </el-form-item>

      <div class="btn">
        <el-button type="danger" @click="back">取消</el-button>
        <el-button type="success" @click="submit('form')">保存</el-button>
        <el-button type="success" v-if="state === 'edit'" @click="submit('form', 'next')">保存并编辑下一个</el-button>
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
// import _ from 'lodash'
export default {
  name: 'addlesson',

  components: { edit },

  data () {
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
      change: false,
      checkAll: false,
      isIndeterminate: false,
      backState: false,
      loading: false,
      formLoading: false,
      form: {
        name: '',
        typeId: '', // 课程类别
        teacher: null, // 教师
        // teacherId: '', // 授课教师
        // teacherName: '', // 授课教师
        startWeek: '', // 开始上课时间
        weekNum: '', // 课时数
        sex: 0, // 性别
        selectRange: [], // 班级id
        limitNum: '', // 人数限制
        teacherIntro: '', // 教师简介
        lessonIntro: '', // 课程简介
        lessonTimeId: '', // 上课时间
        location: null, // 上课地点
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
      flagList: {},
      rule: {
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
    teaches (bool) {
      if (bool) {
        this.teacherList = this.teacherAllList
      }
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.teacherList = this.teacherAllList.filter(item => {
            return item.teacherName
              .indexOf(query) > -1
          })
        }, 200)
      } else {
        this.teacherList = this.teacherAllList
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

    submit (formName, state) {
      if (!this.form.name) {
        notice(this, '请输入课程名称', 1000)
        return
      }
      if (!this.form.typeId) {
        notice(this, '请选择课程类别', 1000)
        return
      }
      if (!this.form.teacher) {
        notice(this, '请选择授课老师', 1000)
        return
      }
      if (!this.form.startWeek) {
        notice(this, '请输入开始上课时间', 1000)
        return
      }
      if (!this.form.weekNum) {
        notice(this, '请输入课时数', 1000)
        return
      }
      if (this.form.selectRange.length === 0) {
        notice(this, '请选择活动对象', 1000)
        return
      }
      if (!this.form.teacherIntro) {
        notice(this, '请输入教师简介', 1000)
        return
      }
      if (!this.form.lessonIntro) {
        notice(this, '请输入课程简介', 1000)
        return
      }
      if (!this.form.lessonTimeId) {
        notice(this, '请选择上课时间', 1000)
        return
      }
      if (!this.form.location) {
        notice(this, '请选择上课地点', 1000)
        return
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.form.limitNum === 0) {
            this.$confirm('人数上限为0，是否需要保存?', '提示', {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning'
            }).then(async () => {
              if (this.state === 'copy') {
                this.form.checkState = 0
              }
              let url
              let para = {
                activityId: this.activityId,
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
                teacherName: this.form.teacher.teacherName,
                teacherId: this.form.teacher.teacherId,
                checkState: this.form.checkState,
                selectRange: JSON.stringify(this.form.selectRange),
                custom: JSON.stringify((this.form.customs || []).map(item => ({ customId: item.id, content: item.content })))
              }
              if (this.state === 'add' || this.state === 'copy') url = '/dLessonController/addLesson'
              else {
                url = '/dLessonController/updateLesson'
                para.lessonId = this.id
              }
              const { data } = await server.post(url, para)
              if (data.code !== 1) notice(this, data.message, 2000)
              else {
                success(this, '操作成功', 2000)
                this.backState = true
                if (this.state === 'edit' && state) {
                  if (!data.result) this.$router.push('/dManage/lesson')
                  else this.$router.push(`/dManage/dMaddlesson/edit/${data.result}`)
                  return
                }
                this.$router.push('/dManage/lesson')
              }
            }).catch(() => {
            //
            })
          } else {
            let url
            let para = {
              activityId: this.activityId,
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
              teacherName: this.form.teacher.teacherName,
              teacherId: this.form.teacher.teacherId,
              checkState: this.form.checkState,
              selectRange: JSON.stringify(this.form.selectRange),
              custom: JSON.stringify((this.form.customs || []).map(item => ({ customId: item.id, content: item.content })))
            }
            if (this.state === 'add' || this.state === 'copy') url = '/dLessonController/addLesson'
            else {
              url = '/dLessonController/updateLesson'
              para.lessonId = this.id
            }
            const { data } = await server.post(url, para)
            if (data.code !== 1) notice(this, data.message, 2000)
            else {
              success(this, '操作成功', 2000)
              this.backState = true
              if (this.state === 'edit' && state) {
                if (!data.result) this.$router.push('/dManage/lesson')
                else this.$router.push(`/dManage/dMaddlesson/edit/${data.result}`)
                return
              }
              this.$router.push('/dManage/lesson')
            }
          }
        } else {
          console.log('error submit!!')
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
        this.$router.push('/dManage/lesson')
      }).catch(() => {})
    },

    introReady (instance) {
      setTimeout(() => {
        instance.setContent(this.form.lessonIntro)
        instance.addListener('contentChange', () => {
          this.form.lessonIntro = instance.getContent()
        })
      }, 200)
    },

    teacherReady (instance) {
      setTimeout(() => {
        instance.setContent(this.form.teacherIntro)
        instance.addListener('contentChange', () => {
          this.form.teacherIntro = instance.getContent()
        })
      }, 200)
    },

    async getPlace (e) {
      this.placeList = []
      if (this.change) this.form.location = null
      // if (!this.flagList.lessonTimeFlag || !this.flagList.locationFlag) return
      // if (!this.form.lessonTimeId) return
      const { data } = await server.get(`/dLessonController/selectClassRoomList?lessonTimeId=${this.form.lessonTimeId}&lessonId=${this.id}&activityId=${this.activityId}`)
      if (data.code === 1) {
        this.placeList = data.result.map(item => ({ name: `${item.classroomNo}`, id: item.id }))
        this.change = true
      }
    },

    async init () {
      this.formLoading = true

      // 类型
      const { data } = await server.get(`/dLessonController/getLessonTypeList?activityId=${this.activityId}`)
                            .finally(() => { this.formLoading = false })
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.type = (data.result || []).map(item => ({ name: item.name, id: item.id }))
      }

      // 所有老师
      const teacher = await server.get('/common/selectLessonTeacherList')
                            .finally(() => { this.formLoading = false })
      if (data.code === 1) this.teacherAllList = [...teacher.data.result]
      if (this.id !== '') this.teacherList = this.teacherAllList

      // 时间
      const time = await server.get(`/dActivityLessontimeController/getLessonTimeList?activityId=${this.activityId}`)
                                .finally(() => { this.formLoading = false })
      if (time.data.code === 1) {
        this.timeList = time.data.result.map(item => {
          return {
            name: `星期${num(item.week)} 第${num(item.section)}节`,
            id: item.id
          }
        })
      }

      // 如果id 存在，则是编辑或者复制
      // 不需要获取模板
      if (this.id !== '') {
        const contentData = await server.get(`/dLessonController/getLessionAndCheckDetails?id=${this.id}` +
                          `&activityId=${this.activityId}`)
                          .finally(() => { this.formLoading = false })
        if (contentData.data.code === 1) {
          this.form = {
            ...contentData.data.result,
            location: {
              id: contentData.data.result.locationId,
              name: contentData.data.result.locationName
            },
            teacher: {
              teacherId: contentData.data.result.teacherId,
              teacherName: contentData.data.result.teacherName
            },
            selectRange: contentData.data.result.classList,
            customs: [...(contentData.data.result.templateList || []).map(item => ({ name: item.templateName, content: item.content, id: item.id }))]
          }
          // this.isIndeterminate = contentData.data.result.classList.length !== 0
          if (this.state === 'copy') {
            // this.isIndeterminate = false
            this.form.typeId = ''
            this.form.startWeek = 0
            this.form.selectRange = []
            this.form.sex = 0
          }
        }
      }

      // 获取模板
      const templateData = await server.get('/dLessonController/getTemplate')
                          .finally(() => { this.formLoading = false })
      if (templateData.data.code === 1) {
        if (this.id === '') {
          this.form.templateId = templateData.data.result.id
          this.form.customs = templateData.data.result.customs.map(item => {
            return {
              id: item.id,
              name: item.name,
              content: ''
            }
          })
        }
        this.flagList = { ...templateData.data.result }
      }

      // 地点
      // 只有上课时间或者上课地点不为统一填写的时候才请求数据
      if (!this.flagList.lessonTimeFlag || !this.flagList.locationFlag) {
        const place = await server.get('/common/selectClassRoomList')
                                  .finally(() => { this.formLoading = false })
        if (place.data.code === 1) this.placeList = place.data.result.map(item => ({ name: `${item.categoryName}${item.classroomNo}`, id: item.id }))
      }

      // 编辑状态需要获取地点列表
      if (this.state !== 'add' && !this.change) this.getPlace()

      // 班级
      if (!this.nowSemester || !this.nowSemester.semesterId) return
      for (let i = 0; i < this.sectionList.length; i++) {
        const { data } = await server.get(`/common/selectGradeClassList?` +
                        `semesterId=${this.nowSemester.semesterId}&sectionId=${this.sectionList[i].id}`)
                        .finally(() => { this.formLoading = false })
        const nGrad = await server.get(`/dAdjustController/getActivityGradeList?activityId=${this.activityId}` +
                            `&sectionId=${this.sectionList[i].id}`)
                            .finally(() => { this.formLoading = false })
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
      this.formLoading = false
    }
  },

  beforeRouteUpdate (to, from, next) {
    this.id = to.params.id ? to.params.id : ''
    this.state = to.params.state ? to.params.state : ''
    this.change = false
    this.form = {}
    this.type = []
    this.gradList = []
    this.timeList = []
    this.placeList = []
    this.teacherList = []
    this.teacherAllList = []
    this.flagList = []
    this.init()
    next()
  },

  created () {
    this.id = this.$route.params.id ? this.$route.params.id : ''
    this.activityId = this.$route.query.parameter
    this.state = this.$route.params.state ? this.$route.params.state : ''
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

.addlesson {
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
