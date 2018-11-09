import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

// 路由容器
const home = r => require.ensure([], () => r(require('./../pages/home.vue')), 'group1')

// 个人信息
const info = r => require.ensure([], () => r(require('./../pages/personal/info.vue')), 'group2')

// 个人发展规划
const planning = r => require.ensure([], () => r(require('./../pages/personal/planning.vue')), 'group3')

// 个人工作计划和总结
const plan = r => require.ensure([], () => r(require('./../pages/personal/plan.vue')), 'group4')

// 外出培训学习日志
const training = r => require.ensure([], () => r(require('./../pages/personal/training.vue')), 'group5')

// 业务档案
const archives = r => require.ensure([], () => r(require('./../pages/personal/archives.vue')), 'group6')

// 个人荣誉
const honor = r => require.ensure([], () => r(require('./../pages/personal/honor')), 'group7')

// 课题研究资料
const research = r => require.ensure([], () => r(require('./../pages/personal/research')), 'group8')

// 市级/区级/园级骨干教师申请报
const apply = r => require.ensure([], () => r(require('./../pages/personal/apply.vue')), 'group9')

// 帮带活动
const gangActivity = r => require.ensure([], () => r(require('./../pages/personal/gangActivity.vue')), 'group10')

// 教师挂职
const teachHang = r => require.ensure([], () => r(require('./../pages/personal/teachHang.vue')), 'group11')

// 年度考评
const appraisal = r => require.ensure([], () => r(require('./../pages/personal/appraisal.vue')), 'group12')

// 教师档案管理
const teachers = r => require.ensure([], () => r(require('./../pages/teachers/index.vue')), 'group13')

// 个人工作计划
const plans = r => require.ensure([], () => r(require('./../pages/personal/plan/plans.vue')), 'group14')

// 个人工作总结
const conclusion = r => require.ensure([], () => r(require('./../pages/personal/plan/conclusion.vue')), 'group15')

// 发表或获奖论文
const paper = r => require.ensure([], () => r(require('./../pages/personal/research/paper.vue')), 'group15')

// 课题研究及工作记录
const record = r => require.ensure([], () => r(require('./../pages/personal/research/record.vue')), 'group15')

// 课题培训
const train = r => require.ensure([], () => r(require('./../pages/personal/research/training.vue')), 'group15')

// 登录

const router = new Router({
  routes: [
    {path: '/', redirect: '/info'},
    {
      path: '/',
      component: home,
      name: '个人档案管理',
      children: [
        {path: '/info', component: info, name: '个人信息', meta: {page: 'info'}},
        {path: '/planning', component: planning, name: '个人发展规划', meta: {page: 'planning'}},
        {
          path: '/plan',
          component: plan,
          name: '个人工作计划和总结',
          meta: {page: 'plan'},
          children: [
            {path: '/plan/plans', component: plans, name: '个人工作计划', meta: {page: 'plans'}},
            {path: '/plan/conclusion', component: conclusion, name: '个人工作总结', meta: {page: 'conclusion'}}
          ]
        },
        {path: '/training', component: training, name: '外出培训学习日志', meta: {page: 'training'}},
        {path: '/archives', component: archives, name: '业务档案', meta: {page: 'archives'}},
        {path: '/honor', component: honor, name: '个人荣誉', meta: {page: 'honor'}},
        {path: '/apply', component: apply, name: '市级/区级/园级骨干教师申请报', meta: {page: 'apply'}},
        {path: '/gangActivity', component: gangActivity, name: '帮带活动', meta: {page: 'gangActivity'}},
        {path: '/teachHang', component: teachHang, name: '教师挂职', meta: {page: 'teachHang'}},
        {path: '/appraisal', component: appraisal, name: '年度考评', meta: {page: 'appraisal'}},
        {
          path: '/research',
          component: research,
          name: '教育研究',
          meta: {page: 'research'},
          children: [
            {path: '/research/paper', component: paper, name: '发表或获奖论文', meta: {page: 'paper'}},
            {path: '/research/record', component: record, name: '课题研究及工作记录', meta: {page: 'record'}},
            {path: '/research/train', component: train, name: '课题培训', meta: {page: 'train'}}
          ]
        }
      ]
    },
    {
      path: '/',
      component: home,
      name: '教师档案管理',
      children: [
        {path: '/teachers', component: teachers, name: 'archives', meta: {page: 'teachers'}}
      ]
    }
  ]
})

router.beforeEach((to, form, next) => {
  NProgress.start()
  next()
})

router.afterEach((to, form) => {
  NProgress.done()
})

export default router
