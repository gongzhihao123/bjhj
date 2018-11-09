import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'  // 页面顶部进度条
import 'nprogress/nprogress.css'

const homePage = resolve => require(['../pages/homePage'], resolve)
const noFind = resolve => require(['../pages/noFind.vue'], resolve)
// 首页
const index = resolve => require(['../pages/index'], resolve)

// 挂牌督导
const common = resolve => require(['../pages/supervisor/common'], resolve)
const manage = resolve => require(['../pages/supervisor/manage'], resolve)
const organization = resolve => require(['../pages/supervisor/organization'], resolve)
const response = resolve => require(['../pages/supervisor/response'], resolve)
const school = resolve => require(['../pages/supervisor/school'], resolve)
const fileDetail = resolve => require(['../pages/supervisor/fileDetail'], resolve)
const viewDetail = resolve => require(['../pages/supervisor/viewDetail'], resolve)
const view = resolve => require(['../pages/supervisor/view'], resolve)

// 相关文件
const law = resolve => require(['../pages/file/law'], resolve)
const train = resolve => require(['../pages/file/train'], resolve)
const fileInfo = resolve => require(['../pages/file/fileInfo'], resolve)

// 统计分析
const member = resolve => require(['../pages/analysis/member'], resolve)
const workload = resolve => require(['../pages/analysis/workload'], resolve)

// 计划总结
const plan = resolve => require(['../pages/plan/index'], resolve)
const fileLook = resolve => require(['../pages/plan/fileLook'], resolve)

// 督导记录
const supervisionRecord = resolve => require(['../pages/record/supervisionRecord'], resolve)

// 整改通知
const noticeDetail = resolve => require(['../pages/notice/noticeDetail'], resolve)
const rectificationNotice = resolve => require(['../pages/notice/rectificationNotice'], resolve)

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: homePage,
    name: '初始页',
    children: [
      {
        path: '/index',
        component: index,
        name: '首页'
      },
      {
        path: '/supervisor/viewDetail',
        component: viewDetail,
        name: '预览信息'
      },
      {
        path: '/supervisor/view',
        component: view,
        name: '预览附件页面'
      },
      {
        path: '/supervisor/fileDetail',
        component: fileDetail,
        name: '详细信息'
      },
      {
        path: '/supervisor/common',
        component: common,
        name: '普通督导'
      },
      {
        path: '/supervisor/manage',
        component: manage,
        name: '学校管理'
      },
      {
        path: '/supervisor/organization',
        component: organization,
        name: '责任学校'
      },
      {
        path: '/supervisor/response',
        component: response,
        name: '督导责任区'
      },
      {
        path: '/supervisor/school',
        component: school,
        name: '负责学校'
      },
      {
        path: '/file/law',
        component: law,
        name: '法律文件'
      },
      {
        path: '/file/fileInfo',
        component: fileInfo,
        name: '文件预览'
      },
      {
        path: '/file/train',
        component: train,
        name: '培训文件'
      },
      {
        path: '/analysis/member',
        component: member,
        name: '人员统计'
      },
      {
        path: '/analysis/workload',
        component: workload,
        name: '工作量统计'
      },
      {
        path: '/plan/index',
        component: plan,
        name: '计划总结'
      },
      {
        path: '/plan/fileLook',
        component: fileLook,
        name: '详细信息'
      },
      {
        path: '/record/supervisionRecord',
        name: '督导记录',
        component: supervisionRecord
      },
      {
        path: '/notice/rectificationNotice',
        name: '整改通知',
        component: rectificationNotice,
        children: [
          {
            path: '/notice/noticeDetail',
            component: noticeDetail
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: noFind
  }
]

const router = new Router({
  mode: 'hash',
  base: __dirname,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next() // 确保一定要调用 next()
})

router.afterEach(transition => {
  NProgress.done()
})

export default router
