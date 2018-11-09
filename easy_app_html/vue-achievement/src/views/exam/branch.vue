<template>

  <div class="branch">

    <section class="common-css">
    
      <!-- 左侧菜单 -->
      <section class="left-menu">
        <el-tree :data="menu.menus.childList"
                v-if="menu.menus"
                :props="defaultProps"
                @node-click="nodeClick"
                node-key="names"
                :default-expanded-keys="[$route.meta.name]"
                :current-node-key="$route.name">
        </el-tree>
      </section>

      <section class="right-content">
          <!-- <p>
            <span class="to-list" @click="route('/exam')">返回考试列表</span>
            考试管理 > 考试列表
          </p> -->
          <transition name="fade">
            <router-view ref="children"></router-view>
          </transition>
      </section>

    </section>
  </div>
</template>

<script>
// import { notice } from '../../api/index.js'
export default {
  name: 'branch',
  data () {
    return {
      treeMenu: [
        {
          name: '基础信息',
          children: [
            { name: '考试信息', path: '' }
          ]
        },
        {
          name: '学生信息',
          children: [
            { name: '录入情况', path: '' },
            { name: '学生录入', path: '' }
          ]
        },
        {
          name: '试卷信息',
          children: [
            { name: '录入情况', path: '' },
            { name: '试卷录入', path: '' }
          ]
        },
        {
          name: '成绩信息',
          children: [
            { name: '成绩录入', path: '' }
          ]
        }
      ],
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      defaultList: [ '基础信息' ]
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu
    }
  },
  methods: {
    route (path) {
      this.$router.push(path)
    },
    nodeClick (data) {
      if (data.childList && data.childList.length >= 1) return
      this.$router.push(data.urlPath)
      if (this.$refs.children.updata) {
        this.$refs.children.updata()
      }
    },
    getMenu (id) {
      this.$store.dispatch('getMenu', id)
    }
  },
  created () {
    this.getMenu(sessionStorage.PARAMS_EXAMID)
  },
  mounted () {
    // this.$nextTick(() => {
    //   let left = this.$store.state.leftMenu.find(item => item.urlPath === '/exam/index')
    //   if (left) {
    //     this.treeMenu = left.childList
    //   } else {
    //     // notice(this, '您没有考试管理权限', 2000)
    //     this.treeMenu = []
    //   }
    // })
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
.branch {
  height: calc(100% - 20px);
  color: #435a6c;

  .right-content {
    padding: 0 40px 40px;
    height: calc(100% - 20px);

    p.top {
      height: 66px;
      line-height: 70px;
      font-weight: bold;

      .to-list {
        padding-right: 10px;
        margin-right: 8px;
        color: $theme;
        border-right: 2px solid $theme;
        cursor: pointer;
      }
    }
  }
}
</style>
