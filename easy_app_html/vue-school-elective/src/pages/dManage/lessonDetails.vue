<template>
  <div class="addlesson-detail">
    <el-form :model="form" ref="form" label-width="150px" label-position="left" v-loading="formLoading">

      <el-form-item >
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课程名称：</span>
        <div>{{ form.name }}</div>
      </el-form-item>

      <el-form-item >
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课程类别：</span>
        <div>{{ form.typeName }}</div>
      </el-form-item>

      <el-form-item >
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>授课教师：</span>
        <div>{{ form.teacherName }}</div>
      </el-form-item>

      <el-form-item v-if="!flagList.startWeekDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>开始上课时间：</span>
        <div>{{form.startWeek}} 周</div>
      </el-form-item>

      <el-form-item v-if="!flagList.weekNumDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课时数：</span>
        <div> {{form.weekNum}} 周</div>
      </el-form-item>
  
      <el-form-item 
                    :rules="[
                      { required: true, type: 'array', message: '请选择活动对象', trigger: 'blur' }
                    ]">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>活动对象：</span>
        <div>
          <span v-for="list in form.classList" :key="list.id" style="margin-right: 10px;"> 
            {{list.gradeName}}{{ list.className }}
          </span>
        </div>
      </el-form-item>

      <el-form-item>
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>学生性别：</span>
        <div>{{
           form.sex === 0
          ? '所有学生'
          : form.sex === 1
            ? '男'
            : '女'
        }}</div>
      </el-form-item>

      <el-form-item >
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>人数限制：</span>
        <div>{{ form.limitNum }}</div>
      </el-form-item>

      <el-form-item v-if="!flagList.teacherIntroDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>教师简介：</span>
        <div v-html="form.teacherIntro"></div>
      </el-form-item>

      <el-form-item v-if="!flagList.lessonIntroDeleteFlag">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>课程简介：</span>
        <div v-html="form.lessonIntro"></div>
      </el-form-item>

      <el-form-item>
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>上课时间：</span>
        <div class="" v-if="form.lessonTime">
          {{ form.lessonTime }}
        </div>
      </el-form-item>

      <el-form-item >
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>上课地点：</span>
        <div>{{ form.locationName }}</div>
      </el-form-item>

      <!-- 自定义字段 -->
      <el-form-item v-for="(list, index) in form.templateList" :key="index">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>{{list.templateName}}：</span>
        <div>{{list.content}}</div>
      </el-form-item>

      <el-form-item  v-if="state === 'check' && form.reasonList && form.reasonList.length !== 0">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>审核记录：</span>
        <div v-for="(list,index) in form.reasonList" :key="index" class="check-list">
          <span class="time">{{list.createdTime | dateFormat('yyyy-MM-dd')}}</span>
          <span class="name">{{list.createdUserName}}</span>
          <span class="state">{{ list.opinion === 1 ? '通过' : '不通过'}}</span>
          <span class="reason">审核意见：{{ list.reason ? list.reason : '无' }}</span>
        </div>
      </el-form-item>

      <el-form-item  v-if="state === 'check'">
        <span slot="label" class="form-label"><i class="iconfont" style="margin-right: 10px;">|</i>审核意见：</span>
        <el-radio-group v-model="form.checkState">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
        </el-radio-group>
        <el-input type="textarea" :rows="4" :maxlength="200" style="margin-top: 20px" v-model="form.reason"></el-input>
      </el-form-item>

      <div class="btn">
        <el-button type="danger" @click="$router.push('/dManage/lesson')">取消</el-button>
        <el-button type="success" @click="submit('form')" v-if="state === 'check'">保存</el-button>
        <!-- <el-button>保存并编辑下一个</el-button> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import server from '../../utils/axios'
import { notice, success } from '../../api/index'
import { mapState } from 'vuex'
import { num } from '../../filters'
export default {
  name: 'addlesson-detail',

  data () {
    return {
      id: '',
      formLoading: false,
      state: '',
      form: {
        typeId: '', // 课程类别
        teacherName: '', // 教师
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
        locationName: '', // 上课地点
        checkState: 1
        // locationId: '', // 课程地点
        // locationName: '' // 上课地点名称
      },
      flagList: {},
      type: [],
      timeList: []
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

    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data } = await server.post('/dLessonController/examineLesson', {
            lessonId: this.id,
            checkState: this.form.checkState,
            reason: this.form.reason
          })
          if (data.code !== 1) notice(this, data.message, 2000)
          else {
            success(this, '操作成功', 2000)
            this.$router.push('/dManage/lesson')
          }
        } else {
          return false
        }
      })
    },

    async init () {
      this.formLoading = true

      // 时间
      const time = await server.get(`/dActivityLessontimeController/getLessonTimeList?activityId=${this.activityId}`)
                                .finally(() => { this.formLoading = false })
      if (time.data.code === 1) {
        this.timeList = time.data.result.map(item => {
          return {
            name: `星期${num(item.week)}第${num(item.section)}节`,
            id: item.id
          }
        })
      }

      // 获取模板
      const templateData = await server.get('/dLessonController/getTemplate')
                          .finally(() => { this.formLoading = false })
      if (templateData.data.code === 1) {
        this.flagList = { ...templateData.data.result }
      }

      // 类型
      const type = await server.get(`/dLessonController/getLessonTypeList?activityId=${this.activityId}`)
                            .finally(() => { this.formLoading = false })
      if (type.data.code !== 1) notice(this, type.data.message, 2000)
      else {
        this.type = (type.data.result || []).map(item => ({ name: item.name, id: item.id }))
      }

      const { data } = await server.get(`/dLessonController/getLessionAndCheckDetails?id=${this.id}` +
                          `&activityId=${this.activityId}`)
                          .finally(() => { this.formLoading = false })
      if (data.code === 1) {
        this.form = {
          ...data.result,
          lessonTime: data.result.lessonTimeId ? this.timeList.filter(item => item.id === data.result.lessonTimeId)[0].name : '',
          typeName: data.result.typeId ? this.type.filter(item => item.id === data.result.typeId)[0].name : ''
        }
        this.form.checkState = 1
      }
      this.formLoading = false
    }
  },

  created () {
    this.id = this.$route.params.id ? this.$route.params.id : ''
    this.activityId = this.$route.query.parameter
    this.state = this.$route.params.state ? this.$route.params.state : ''
    this.init()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.addlesson-detail {
  .el-form {
    padding: $width;
    background: $white;
    border-radius: 4px;

    .form-label {
      color: $blue;
    }

    >.btn {
      text-align: right;
    }

    .check-list {
      span {
        margin-right: 18px;
      }
    }
  }
}
</style>
