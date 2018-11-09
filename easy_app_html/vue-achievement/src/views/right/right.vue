<template>
  <div class="right">
    <!-- 权限管理 -->

    <section class="common-css">

      <!-- 左侧菜单 -->
      <section class="left-menu">
          <el-tree :data="treeMenu"
                    class="trees"
                   :props="defaultProps"
                   node-key="name"
                   :current-node-key="rightName"
                   @node-click="route">
          </el-tree>
      </section>


      <!-- 右侧内容 -->
      <section class="right-content">
        <p class="content-head">权限管理 > {{ rightName }} </p>
        
        <div class="exam-table">
          <router-view></router-view>
        </div>
      </section>

    </section>

    <el-dialog
      title="提示"
      :visible.sync="dialogShow"
      :show-close="false">
      <i class="el-icon-close close" @click="dialogShow = false"></i>
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="dialogShow = false">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'right',
  data () {
    return {
      dialogShow: false,
      treeMenu: [
        {
          name: '教研员设置', path: '/right/research'
        }, {
          name: '管理员设置', path: '/right/manage'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rightName: '教研员设置'
    }
  },
  created () {
    this.rightName = this.$route.name
  },
  methods: {
    route (data) {
      this.rightName = data.name
      this.$router.push(data.path)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
  .right {
    height: calc(100% - 20px);

    .el-tree.trees {
      .el-tree-node > .el-tree-node__content {
        background: transparent !important;
      }
      .is-current {
        .el-tree-node__content {
          background: #e2efe5 !important;
          color: $theme;
          font-weight: bold;
        }
      }
      
      .el-tree-node__expand-icon {
        opacity: 0;
      }
    }

    .right-content {
      padding: 0 40px 40px;
      height: calc(100% - 20px);

      p.content-head {
        height: 66px;
        line-height: 70px;
        font-weight: bold;
      }

      .exam-table {
        position: relative;
        padding: 30px;
        background: #fff;
        height: calc(100% - 126px);
        overflow: auto;
      }
    }

    // 指定用户弹出框
    .education-teacher-setting {
      width: 550px;
      margin: 0 auto;
      box-sizing: border-box;
      color: #333;
      overflow: hidden;
      .education-course-add-content-left {
          height: 348px;
          width: 200px;
          float: left;
          .el-input__inner {
              display: inline-block;
              border: 1px solid #c3c3c3;
              color: #333;
          }
          .education-course-add-tree {
              border: 1px solid #c3c3c3;
              margin-top: 10px;
              height: 302px;
              border-radius: 6px;
              overflow: auto;
              .el-tree.filter-tree {
                  border: none;
              }
          }
      }
      .education-course-add-content-right {
        height: 348px;
        border: 1px solid #c3c3c3;
        width: 234px;
        float: right;
        overflow: auto;
        // padding: 5px;
        box-sizing: border-box;
        &>p {
            width: 100%;
            height: 38px;
            background: #e1e1e1;
            margin: 0;
            box-sizing: border-box;
            &>.span:first-child {
                float: left;
            }
            &>.span:last-child {
                float: right;
            }
        }
        span {
            // padding: 5px;
            display: inline-block;
            padding: 5px 10px;
            border: 1px solid #ddd;
            cursor: pointer;
            &:hover {
                border: 1px solid rgb(113, 195, 255);
                color: rgb(113, 195, 255);
            }
            &:active {
                border: 1px solid #ddd;
                color: #666;
            }
            &.span {
                &:hover {
                    color: #666;
                    border: 1px solid #e1e1e1;
                }
            }
            &:not(.span) {
                margin: 6px;
            }
        }
      }
      .education-course-add-content-button {
        height: 59px;
        clear: both;
        text-align: center;
        padding-top: 30px;
        box-sizing: border-box;
        &>.el-button:first-child {
            background: #fff;
            color: #333;
        }
        &>.el-button:last-child {
            border: 1px solid #19b955;
        }
        .el-button {
            width: 87px;
            height: 37px;
            border: none;
            border: 1px solid #c3c3c3;
            color: #fff;
            background: #19b955;
            &:active {
                opacity: 0.8;
            }
        }
      }
    }
  }
</style>

