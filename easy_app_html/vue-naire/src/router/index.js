import Vue from 'vue'
import Router from 'vue-router'

// 首页
const home = r => require.ensure([], () => r(require('@/views/index.vue')), 'group1')
    // const noFind = resolve => require(['./views/noFind.vue'], resolve)
const noFind = r => require.ensure([], () => r(require('@/views/noFind.vue')), 'group1')
const index = r => require.ensure([], () => r(require('@/views/index/index.vue')), 'group1')
const answer = r => require.ensure([], () => r(require('@/views/index/answer.vue')), 'group1')
const answers = r => require.ensure([], () => r(require('@/views/index/answers.vue')), 'group1')
const finish = r => require.ensure([], () => r(require('@/views/index/finish.vue')), 'group1')
const answerCheck = r => require.ensure([], () => r(require('@/views/index/answerCheck.vue')), 'group1')
const homeDetails = r => require.ensure([], () => r(require('@/views/index/homeDetails.vue')), 'group1')

// 创建问卷
const created = r => require.ensure([], () => r(require('@/views/creation/index.vue')), 'group2')
const createdDefault = r => require.ensure([], () => r(require('@/views/creation/components/default.vue')))
const createdGenre = r => require.ensure([], () => r(require('@/views/creation/components/oldgenre.vue')))
const createdDetails = r => require.ensure([], () => r(require('@/views/creation/components/details.vue')))
const createdPublish = r => require.ensure([], () => r(require('@/views/creation/components/publish.vue')))

// 问卷审核
const audit = r => require.ensure([], () => r(require('@/views/audit/index.vue')), 'group3')
const auditDetails = r => require.ensure([], () => r(require('@/views/audit/particulars.vue')), 'group3')

// 问卷管理
const manage = r => require.ensure([], () => r(require('@/views/manage/index.vue')), 'group4')
const details = r => require.ensure([], () => r(require('@/views/manage/details.vue')), 'group4')
const naireType = r => require.ensure([], () => r(require('@/views/manage/naireType.vue')), 'group4')
const naireDetail = r => require.ensure([], () => r(require('@/views/manage/naireDetail.vue')), 'group4')
const answerNaire = r => require.ensure([], () => r(require('@/views/manage/answerNaire.vue')), 'group4')

// 问卷设置
const set = r => require.ensure([], () => r(require('@/views/set/index.vue')), 'group5')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      redirect: '/index',
      children: [
        { path: '/index', name: '首页', component: index, meta: { state: -1 } },
        { path: '/answer', name: '答题页', component: answer, meta: { state: 0 } },
        { path: '/answers', name: '答题页', component: answers, meta: { state: 0 } },
        { path: '/finish', name: '答题结束', component: finish, meta: { state: -1 } },
        { path: '/answerCheck', name: '查看', component: answerCheck, meta: { state: -1 } },
        { path: '/homeDetails', name: '统计结果', component: homeDetails, meta: { state: -1 } },
        {
          name: '创建问卷',
          path: '/created',
          component: created,
          redirect: '/created/default',
          meta: { state: 0 },
          children: [
            { path: '/created/default', name: '创建问卷默认', component: createdDefault, meta: { state: 0 } },
            { path: '/created/genre', name: '创建问卷分类', component: createdGenre, meta: { state: 0 } },
            { path: '/created/details', name: '创建问卷详情', component: createdDetails, meta: { state: 0 } },
            { path: '/created/publish', name: '发布成功', component: createdPublish, meta: { state: 0 } }
          ]
        },
        { path: '/audit', name: '问卷审核', component: audit, meta: { state: 3 } },
        { path: '/particulars', name: '审核详情', component: auditDetails, meta: { state: 3 } },
        { path: '/manage', name: '问卷管理', component: manage, meta: { state: 1 } },
        { path: '/answerNaire', name: '问卷管理查看具体答卷情况', component: answerNaire, meta: { state: 1 } },
        { path: '/naireType', name: '问卷管理编辑分类', component: naireType, meta: { state: -1 } },
        { path: '/naireDetail', name: '问卷管理编辑详情', component: naireDetail, meta: { state: -1 } },
        { path: '/details', name: '问卷管理详情页', component: details, meta: { state: 1 } },
        { path: '/set', name: '问卷设置', component: set, meta: { state: 2 } }
      ]
    },
    {
      path: '*',
      component: noFind
    }
  ]
})
