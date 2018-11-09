import Vue from 'vue'
import Router from 'vue-router'

const index = resolve => require(['@/views/index.vue'], resolve)
const noFind = resolve => require(['@/views/noFind.vue'], resolve)

// 规则管理
const rule = r => require.ensure([], () => r(require('@/views/ruleManage/rule')), 'group1')
const single = r => require.ensure([], () => r(require('@/views/ruleManage/components/singleLevel.vue')), 'group1')
const choiceness = r => require.ensure([], () => r(require('@/views/ruleManage/components/choicenessLevel.vue')), 'group1')
const total = r => require.ensure([], () => r(require('@/views/ruleManage/components/totalLevel.vue')), 'group1')
const totalSum = r => require.ensure([], () => r(require('@/views/ruleManage/components/totalSum.vue')), 'group1')
const coefficient = r => require.ensure([], () => r(require('@/views/ruleManage/components/coefficient.vue')), 'group1')
const candidate = r => require.ensure([], () => r(require('@/views/ruleManage/components/candidate.vue')), 'group1')
const publicLevel = r => require.ensure([], () => r(require('@/views/ruleManage/components/publicLevel.vue')), 'group1')
const asm = r => require.ensure([], () => r(require('@/views/ruleManage/components/asm.vue')), 'group1')

// 考试管理
const exam = r => require.ensure([], () => r(require('@/views/exam/exam')), 'group2')
const branch = r => require.ensure([], () => r(require('@/views/exam/branch')), 'group2')
const examInfo = r => require.ensure([], () => r(require('@/views/exam/examInfo')), 'group2')
const infoEnter = r => require.ensure([], () => r(require('@/views/exam/infoEnter')), 'group2')
const checkTest = r => require.ensure([], () => r(require('@/views/exam/testEnter/checkTest')), 'group2')
const enterTest = r => require.ensure([], () => r(require('@/views/exam/testEnter/testEnter')), 'group2')
const editTest = r => require.ensure([], () => r(require('@/views/exam/testEnter/editTest')), 'group2')
const scoreEnter = r => require.ensure([], () => r(require('@/views/exam/scoreEnter/scoreEnter')), 'group2')
const bigScore = r => require.ensure([], () => r(require('@/views/exam/scoreEnter/bigScore')), 'group2')
const smallScore = r => require.ensure([], () => r(require('@/views/exam/scoreEnter/smallScore')), 'group2')
const addTest = r => require.ensure([], () => r(require('@/views/exam/addTest/addTest')), 'group2')
const textObj = r => require.ensure([], () => r(require('@/views/exam/objectSet/textObj')), 'group2')
const entering = r => require.ensure([], () => r(require('@/views/exam/entering')), 'group2')

// 权限管理
const right = r => require.ensure([], () => r(require('@/views/right/right')), 'group3')
const manage = r => require.ensure([], () => r(require('@/views/right/components/manage')), 'group3')
const research = r => require.ensure([], () => r(require('@/views/right/components/research')), 'group3')

// 知识点管理
const knowledge = r => require.ensure([], () => r(require('@/views/knowledge/knowledge')), 'group4')
const list = r => require.ensure([], () => r(require('@/views/knowledge/components/list')), 'group4')
const subjectDetail = r => require.ensure([], () => r(require('@/views/knowledge/components/subjectDetail')), 'group4')
const capabilityLevel = r => require.ensure([], () => r(require('@/views/knowledge/components/capabilityLevel')), 'group4')

// 成绩分析
const achievement = r => require.ensure([], () => r(require('@/views/achievement/achievement')), 'group5')
const a1 = r => require.ensure([], () => r(require('@/views/achievement/1/1')), 'group51')
const a2 = r => require.ensure([], () => r(require('@/views/achievement/1/2')), 'group51')
const a3 = r => require.ensure([], () => r(require('@/views/achievement/1/3')), 'group51')
const a4 = r => require.ensure([], () => r(require('@/views/achievement/1/4')), 'group51')
const a5 = r => require.ensure([], () => r(require('@/views/achievement/1/5')), 'group51')
const a6 = r => require.ensure([], () => r(require('@/views/achievement/1/6')), 'group51')
const a7 = r => require.ensure([], () => r(require('@/views/achievement/1/7')), 'group51')
const a8 = r => require.ensure([], () => r(require('@/views/achievement/1/8')), 'group51')
const a9 = r => require.ensure([], () => r(require('@/views/achievement/1/9')), 'group51')
const a10 = r => require.ensure([], () => r(require('@/views/achievement/1/10')), 'group51')
const a11 = r => require.ensure([], () => r(require('@/views/achievement/1/11')), 'group51')
const a12 = r => require.ensure([], () => r(require('@/views/achievement/1/12')), 'group51')
const a13 = r => require.ensure([], () => r(require('@/views/achievement/1/13')), 'group51')

const b1 = r => require.ensure([], () => r(require('@/views/achievement/2/1')), 'group52')
const b2 = r => require.ensure([], () => r(require('@/views/achievement/2/2')), 'group52')
const b3 = r => require.ensure([], () => r(require('@/views/achievement/2/3')), 'group52')
const b4 = r => require.ensure([], () => r(require('@/views/achievement/2/4')), 'group52')
const b5 = r => require.ensure([], () => r(require('@/views/achievement/2/5')), 'group52')
const b6 = r => require.ensure([], () => r(require('@/views/achievement/2/6')), 'group52')
const b7 = r => require.ensure([], () => r(require('@/views/achievement/2/7')), 'group52')
const b8 = r => require.ensure([], () => r(require('@/views/achievement/2/8')), 'group52')
const b9 = r => require.ensure([], () => r(require('@/views/achievement/2/9')), 'group52')
const b10 = r => require.ensure([], () => r(require('@/views/achievement/2/10')), 'group52')
const b11 = r => require.ensure([], () => r(require('@/views/achievement/2/11')), 'group52')
const b12 = r => require.ensure([], () => r(require('@/views/achievement/2/12')), 'group52')
const b13 = r => require.ensure([], () => r(require('@/views/achievement/2/13')), 'group52')
const b14 = r => require.ensure([], () => r(require('@/views/achievement/2/14')), 'group52')
const b15 = r => require.ensure([], () => r(require('@/views/achievement/2/15')), 'group52')

const c1 = r => require.ensure([], () => r(require('@/views/achievement/3/1')), 'group53')
const c2 = r => require.ensure([], () => r(require('@/views/achievement/3/2')), 'group53')
const c3 = r => require.ensure([], () => r(require('@/views/achievement/3/3')), 'group53')
const c4 = r => require.ensure([], () => r(require('@/views/achievement/3/4')), 'group53')
const c5 = r => require.ensure([], () => r(require('@/views/achievement/3/5')), 'group53')
const c6 = r => require.ensure([], () => r(require('@/views/achievement/3/6')), 'group53')
const c7 = r => require.ensure([], () => r(require('@/views/achievement/3/7')), 'group53')
const c8 = r => require.ensure([], () => r(require('@/views/achievement/3/8')), 'group53')
const c9 = r => require.ensure([], () => r(require('@/views/achievement/3/9')), 'group53')

const d1 = r => require.ensure([], () => r(require('@/views/achievement/4/1')), 'group54')
const d2 = r => require.ensure([], () => r(require('@/views/achievement/4/2')), 'group54')
const d3 = r => require.ensure([], () => r(require('@/views/achievement/4/3')), 'group54')
const d4 = r => require.ensure([], () => r(require('@/views/achievement/4/4')), 'group54')
const d5 = r => require.ensure([], () => r(require('@/views/achievement/4/5')), 'group54')
const d6 = r => require.ensure([], () => r(require('@/views/achievement/4/6')), 'group54')
const d7 = r => require.ensure([], () => r(require('@/views/achievement/4/7')), 'group54')

const e1 = r => require.ensure([], () => r(require('@/views/achievement/5/1')), 'group55')
const e2 = r => require.ensure([], () => r(require('@/views/achievement/5/2')), 'group55')
const e3 = r => require.ensure([], () => r(require('@/views/achievement/5/3')), 'group55')
const e4 = r => require.ensure([], () => r(require('@/views/achievement/5/4')), 'group55')

const student = r => require.ensure([], () => r(require('@/views/student/student.vue')), 'group56')

// 录入情况
const areaStudentEnter = r => require.ensure([], () => r(require('@/views/exam/areaStudentEnter.vue')), 'group6')
const testEnterState = r => require.ensure([], () => r(require('@/views/exam/testEnter/testEnterState.vue')), 'group6')
const examScoreEnter = r => require.ensure([], () => r(require('@/views/exam/scoreEnter/areaScoreEnter.vue')), 'group6')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/rule',
      name: 'index',
      component: index,
      redirect: '/rule',
      children: [
        {
          path: '/rule',
          name: '规则管理',
          component: rule,
          redirect: '/rule/single',
          children: [
            { path: '/rule/single', name: '单科等级', component: single, meta: { name: '等级规则' } },
            { path: '/rule/choiceness', name: '优良等级', component: choiceness, meta: { name: '等级规则' } },
            { path: '/rule/total', name: '总分等级', component: total, meta: { name: '等级规则' } },
            { path: '/rule/publicLevel', name: '发布等级', component: publicLevel, meta: { name: '等级规则' } },
            { path: '/rule/totalSum', name: '总分相加', component: totalSum, meta: { name: '总分计算规则' } },
            { path: '/rule/coefficient', name: '系数折算', component: coefficient, meta: { name: '总分计算规则' } },
            { path: '/rule/asm', name: '成绩结构管理', component: asm, meta: { name: '成绩规则' } },
            { path: '/rule/candidate', name: '考号规则管理', component: candidate, meta: { name: '考号规则' } }
          ]
        },
        // 考试管理
        { path: '/exam', name: '考试管理首页列表', component: exam },
        {
          path: '/exam/index',
          name: '左右结构详情页',
          component: branch,
          redirect: '/examQuery/index',
          children: [
            { path: '/exam/entering', name: '录入情况', component: entering, meta: { page: 3, name: '' } },
            { path: '/examQuery/index', component: examInfo, name: '基础信息考试信息', meta: { page: 3, name: '基础信息' } },
            { path: '/examQuestionEnter/paper', component: enterTest, name: '试卷信息试卷录入', meta: { page: 3, name: '试卷信息' } },
            { path: '/examQuestionEnter/state', component: testEnterState, name: '试卷信息录入情况', meta: { page: 3, name: '试卷信息' } },
            { path: '/exam/checkTest', name: '查看试题', component: checkTest, meta: { page: 3, name: '试卷信息' } },
            { path: '/examStudentEnter/state', component: areaStudentEnter, name: '学生信息录入情况', meta: { page: 3, name: '学生信息' } },
            { path: '/examStudentEnter/student', component: infoEnter, name: '学生信息学生录入', meta: { page: 3, name: '学生信息' } },
            { path: '/examScoreEnter/index', component: examScoreEnter, name: '成绩信息成绩录入', meta: { page: 3, name: '成绩信息' } },
            {
              path: '/exam/scoreEnter',
              name: '成绩录入',
              component: scoreEnter,
              redirect: '/exam/bigScore',
              children: [
                { path: '/exam/bigScore', name: '成绩信息成绩录入', component: bigScore, meta: { page: 3, name: '成绩信息' } },
                { path: '/exam/smallScore', name: '成绩信息成绩录入', component: smallScore, meta: { page: 3, name: '成绩信息' } }
              ]
            },
            { path: '/exam/editTest', component: editTest, name: '编辑试卷', meta: { page: 3, name: '试卷信息' } }
          ]
        },
        { path: '/exam/infoEnter', name: '学生信息录入', component: infoEnter },
        // {
        //   path: '/exam/scoreEnter',
        //   name: '成绩录入',
        //   component: scoreEnter,
        //   redirect: '/exam/bigScore',
        //   children: [
        //     { path: '/exam/bigScore', name: '成绩录入', component: bigScore },
        //     { path: '/exam/smallScore', name: '小题录入', component: smallScore }
        //   ]
        // },
        { path: '/exam/addTest', name: '新增试卷', component: addTest },
        { path: '/exam/textObj', name: '考试对象设置', component: textObj },
        // 知识点管理
        {
          path: '/knowledge',
          name: '知识点管理',
          component: knowledge,
          redirect: '/knowledge/list',
          children: [
            { path: '/knowledge/list', name: '知识点管理', component: list },
            { path: '/knowledge/subjectDetail', name: '知识点管理知识点详情', component: subjectDetail },
            { path: '/knowledge/capabilityLevel', name: '知识点管理能力等级', component: capabilityLevel }
          ]
        },
        {
          path: '/achievement',
          name: '成绩分析',
          component: achievement,
          // redirect: '/achievement/1/1',
          children: [
            { path: '/achievement/1/1', component: a1 },
            { path: '/achievement/1/2', component: a2 },
            { path: '/achievement/1/3', component: a3 },
            { path: '/achievement/1/4', component: a4 },
            { path: '/achievement/1/5', component: a5 },
            { path: '/achievement/1/6', component: a6 },
            { path: '/achievement/1/7', component: a7 },
            { path: '/achievement/1/8', component: a8 },
            { path: '/achievement/1/9', component: a9 },
            { path: '/achievement/1/10', component: a10 },
            { path: '/achievement/1/11', component: a11 },
            { path: '/achievement/1/12', component: a12 },
            { path: '/achievement/1/13', component: a13 },
            { path: '/achievement/2/1', component: b1 },
            { path: '/achievement/2/2', component: b2 },
            { path: '/achievement/2/3', component: b3 },
            { path: '/achievement/2/4', component: b4 },
            { path: '/achievement/2/5', component: b5 },
            { path: '/achievement/2/6', component: b6 },
            { path: '/achievement/2/7', component: b7 },
            { path: '/achievement/2/8', component: b8 },
            { path: '/achievement/2/9', component: b9 },
            { path: '/achievement/2/10', component: b10 },
            { path: '/achievement/2/11', component: b11 },
            { path: '/achievement/2/12', component: b12 },
            { path: '/achievement/2/13', component: b13 },
            { path: '/achievement/2/14', component: b14 },
            { path: '/achievement/2/15', component: b15 },
            { path: '/achievement/3/1', component: c1 },
            { path: '/achievement/3/2', component: c2 },
            { path: '/achievement/3/3', component: c3 },
            { path: '/achievement/3/4', component: c4 },
            { path: '/achievement/3/5', component: c5 },
            { path: '/achievement/3/6', component: c6 },
            { path: '/achievement/3/7', component: c7 },
            { path: '/achievement/3/8', component: c8 },
            { path: '/achievement/3/9', component: c9 },
            { path: '/achievement/4/1', component: d1 },
            { path: '/achievement/4/2', component: d2 },
            { path: '/achievement/4/3', component: d3 },
            { path: '/achievement/4/4', component: d4 },
            { path: '/achievement/4/5', component: d5 },
            { path: '/achievement/4/6', component: d6 },
            { path: '/achievement/4/7', component: d7 },
            { path: '/achievement/5/1', component: e1 },
            { path: '/achievement/5/2', component: e2 },
            { path: '/achievement/5/3', component: e3 },
            { path: '/achievement/5/4', component: e4 }
          ]
        },
        {
          path: '/right',
          name: '权限管理',
          component: right,
          redirect: '/right/research',
          children: [
            { path: '/right/research', name: '教研员设置', component: research },
            { path: '/right/manage', name: '管理员设置', component: manage }
          ]
        },
        // 学生成绩查询
        { path: '/student', name: '新增试卷', component: student }
      ]
    },
    {
      path: '*',
      state: false, // 不显示在导航中
      name: 'noFind',
      component: noFind
    },
    {
      path: '/',
      state: false, // 不显示在导航中
      name: 'noFind'
    }
  ]
})
