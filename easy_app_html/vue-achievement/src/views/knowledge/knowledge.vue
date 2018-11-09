<template>
  <div class="knowledge">
    
    <section class="common-css">

      <!-- 左侧菜单 -->
      <section class="left-menu">
          <el-tree :data="treeMenu"
                   :props="defaultProps"
                   @node-click="route">
          </el-tree>
      </section>


      <!-- 右侧内容 -->
      <section class="right-content">
        <router-view></router-view>
      </section>

    </section>
    



  </div>
</template>

<script>
// import { notice } from '../../api/index.js'
export default {
  name: 'knowledge',
  data () {
    return {
      parentId: 1,
      treeMenu: [
        {
          name: '知识点管理',
          path: '/knowledge/list'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    route (data) {
      if (data.children) return
      this.$router.push(data.path)
    }
  }
}
</script>

<style lang="scss">
 
.knowledge {
  height: calc(100% - 20px);
  .right-content {
    background: #EEF2F5;
    height: 100%;
    width: 100%;;
    // padding: 0 40px;
    .common {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: calc(100% - 80px);
      height: calc(100%);
      // overflow: auto;
      margin: 0 40px;
      .section-crumbs {
        height: 66px !important;
        line-height: 70px;
        font-weight: bold;
        height: 64px;
        width: 100%;
        
        .crumbs {
          line-height: 64px;
          font-size: 14px;

          span {
            color: #555;
          }
        }
      }
      .section-content {
        height: calc(100% - 64px);
        width: 100%;
        // min-width: 1308px;
        background: #EEF2F5;
        // padding: 0 40px;
      }
    }
  }
  .common-css .left-menu .el-tree > .el-tree-node > .el-tree-node__content > .el-tree-node__expand-icon {
    border-left-color: transparent;
  }
}

</style>
