import Vue from 'vue'
import Router from 'vue-router'

// 首页
const index = r => require.ensure([], () => r(require('@/views/index.vue')), 'group')
const noFind = resolve => require(['@/views/noFind.vue'], resolve)
// 基础信息
const basicInfo = r => require.ensure([], () => r(require('@/views/basicInfo/basicInfo.vue')), 'group1')

// 排课规则
const rules = r => require.ensure([], () => r(require('@/views/rules/rules.vue')), 'group2')
const classroom = r => require.ensure([], () => r(require('@/views/rules/components/classroom.vue')), 'group2')
const singleOrDouble = r => require.ensure([], () => r(require('@/views/rules/components/singleOrDouble.vue')), 'group2')
const classAllot = r => require.ensure([], () => r(require('@/views/rules/components/classAllot.vue')), 'group2')
const classRelation = r => require.ensure([], () => r(require('@/views/rules/components/classRelation.vue')), 'group2')
const classNoLesson = r => require.ensure([], () => r(require('@/views/rules/components/classNoLesson.vue')), 'group2')
const combineClass = r => require.ensure([], () => r(require('@/views/rules/components/combineClass.vue')), 'group2')
const connectClass = r => require.ensure([], () => r(require('@/views/rules/components/connectClass.vue')), 'group2')
const connectRestrict = r => require.ensure([], () => r(require('@/views/rules/components/connectRestrict.vue')), 'group2')
const otherSet = r => require.ensure([], () => r(require('@/views/rules/components/otherSet.vue')), 'group2')
const teachNoLesson = r => require.ensure([], () => r(require('@/views/rules/components/teachNoLesson.vue')), 'group2')
const tectchMutualExclusion = r => require.ensure([], () => r(require('@/views/rules/components/tectchMutualExclusion.vue')), 'group2')

// 走班排课
const brainpower = r => require.ensure([], () => r(require('@/views/brainpower/brainpower.vue')), 'group3')

// 课表查看
const check = r => require.ensure([], () => r(require('@/views/check/check.vue')), 'group4')
const classes = r => require.ensure([], () => r(require('@/views/check/components/classes.vue')), 'group4')
const grade = r => require.ensure([], () => r(require('@/views/check/components/grade.vue')), 'group4')
const school = r => require.ensure([], () => r(require('@/views/check/components/school.vue')), 'group4')
const teachers = r => require.ensure([], () => r(require('@/views/check/components/teachers.vue')), 'group4')
const prepare = r => require.ensure([], () => r(require('@/views/check/components/prepare.vue')), 'group4')
const classrooms = r => require.ensure([], () => r(require('@/views/check/components/classroom.vue')), 'group4')
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: index,
    redirect: '/rules',
    children: [
      { path: '/basicInfo', name: '基础信息', component: basicInfo, meta: { page: 0 } },
      {
        path: '/rules',
        name: '排课规则',
        component: rules,
        redirect: '/rules/classroom',
        children: [
          { path: '/rules/classroom', name: '教室设置', component: classroom, meta: { page: 1 } },
          { path: '/rules/singleOrDouble', name: '单双周排课', component: singleOrDouble, meta: { page: 1 } },
          { path: '/rules/classAllot', name: '节课分配', component: classAllot, meta: { page: 1 } },
          { path: '/rules/classRelation', name: '课程关系', component: classRelation, meta: { page: 1 } },
          { path: '/rules/classNoLesson', name: '班级不排课', component: classNoLesson, meta: { page: 1 } },
          { path: '/rules/combineClass', name: '合班课', component: combineClass, meta: { page: 1 } },
          { path: '/rules/connectClass', name: '连堂课', component: connectClass, meta: { page: 1 } },
          { path: '/rules/connectRestrict', name: '连上限制', component: connectRestrict, meta: { page: 1 } },
          { path: '/rules/otherSet', name: '其他设置', component: otherSet, meta: { page: 1 } },
          { path: '/rules/teachNoLesson', name: '教师不排课', component: teachNoLesson, meta: { page: 1 } },
          { path: '/rules/tectchMutualExclusion', name: '教师互斥', component: tectchMutualExclusion, meta: { page: 1 } }
        ]
      },
      { path: '/brainpower', name: '走班排课', component: brainpower, meta: { page: 2 } },
      {
        path: '/check',
        name: '课表查看共用样式',
        component: check,
        redirect: '/check/school',
        children: [
          // 学生课表 可删
          { path: '/check/grade', name: '年级课表', component: grade, meta: { page: 3 } },
          { path: '/check/school', name: '学校课表', component: school, meta: { page: 3 } },
          { path: '/check/classes', name: '班级课表', component: classes, meta: { page: 3 } },
          { path: '/check/prepare', name: '备课组课表', component: prepare, meta: { page: 3 } },
          { path: '/check/classroom', name: '教室课表', component: classrooms, meta: { page: 3 } },
          { path: '/check/teachers', name: '教师课表', component: teachers, meta: { page: 3 } },
          { path: '/check/student', name: '学生课表', component: classes, meta: { page: 3 } }
        ]
      }
    ]
  },
  {
    path: '*',
    component: noFind
  }]
})
