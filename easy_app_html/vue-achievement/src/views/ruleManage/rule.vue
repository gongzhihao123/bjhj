<template>
  <div class="rule">
    
    <section class="common-css">

      <!-- 左侧菜单 -->
      <section class="left-menu">
          <el-tree :data="treeMenu"
                   :props="defaultProps"
                   :highlight-current="true"
                   @node-click="route"
                   node-key="name"
                  :default-expanded-keys="[$route.meta.name]"
                  :current-node-key="$route.name">
          </el-tree>
      </section>


      <!-- 右侧内容 -->
      <section class="right-content">
        <section>
          <section class="crumbs">
            <span>规则管理</span>
            <span> > {{ breadcrumb.parentName }}</span>
            <span> > {{ breadcrumb.childrenName }}</span>
          </section>
        </section>
        <router-view></router-view>
      </section>

    </section>
    



  </div>
</template>

<script>
// import { notice } from '../../api/index.js'
export default {
  name: 'rule',
  data () {
    return {
      parentId: 1,
      treeMenu: [
        {
          name: '等级规则',
          children: [
            { name: '单科等级', path: '/rule/single', parentName: '等级规则', parentPath: '/rule/single', firstName: '单科等级', type: 1 },
            { name: '总分等级', path: '/rule/total', parentName: '等级规则', parentPath: '/rule/single', firstName: '单科等级', type: 2 },
            { name: '优良等级', path: '/rule/choiceness', parentName: '等级规则', parentPath: '/rule/single', firstName: '单科等级', type: 3 },
            { name: '发布等级', path: '/rule/publicLevel', parentName: '等级规则', parentPath: '/rule/single', firstName: '单科等级', type: 4 }
          ]
        },
        {
          name: '总分计算规则',
          children: [
            { name: '总分相加', path: '/rule/totalSum', parentName: '总分计算规则', parentPath: '/rule/totalSum', firstName: '总分相加', type: 1 },
            { name: '系数折算', path: '/rule/coefficient', parentName: '总分计算规则', parentPath: '/rule/totalSum', firstName: '总分相加', type: 2 }
          ]
        },
        {
          name: '考号规则',
          children: [
            { name: '考号规则管理', path: '/rule/candidate', parentName: '考号规则', parentPath: '/rule/candidate', firstName: '考号规则管理' }
          ]
        },
        {
          name: '成绩规则',
          children: [
            { name: '成绩结构管理', path: '/rule/asm', parentName: '成绩规则', parentPath: '/rule/asm', firstName: '成绩结构管理' }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      breadcrumb: {
        parentName: '等级规则',
        childrenName: '单科等级',
        parentPath: ''
      }
    }
  },
  created () {
    const href = window.location.href
    let url = href.slice(href.indexOf('#') + 1)
    if (url.indexOf('/rule/single') !== -1) return
    this.treeMenu.forEach(item => {
      item.children.forEach(items => {
        if (url.indexOf(items.path) !== -1) {
          this.breadcrumb.childrenName = items.name
        }
      })
    })
  },
  methods: {
    route (data) {
      console.log()
      if (data.children) return
      this.breadcrumb.parentName = data.parentName
      this.breadcrumb.childrenName = data.name
      this.breadcrumb.parentPath = data.parentPath
      this.breadcrumb.firstName = data.firstName
      this.$router.push({path: data.path, query: {type: data.type, typeName: data.name}})
    },
    router () {
      this.breadcrumb.childrenName = this.breadcrumb.firstName
      this.$router.push(this.breadcrumb.parentPath)
    }
  }
}
</script>
<style lang="scss">
 
  .rule {
    height: calc(100% - 20px);
    .right-content {
      background: #EEF2F5;
      .crumbs {
        height: 66px;
        line-height: 70px;
        font-weight: bold;
        font-size: 14px;
        padding-left: 40px;
      }
      .common {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        height: calc(100% - 160px);
        width: calc(100% - 160px);
        background: #fff;
        margin-left: 40px;
        padding: 40px;
        overflow: auto;
        .box {
          display: inline-block;
          width: 220px;
          height: 260px;
          background: #e3f5e7;
          color: #a6e7ae;
          border: 1px dashed #a6e7ae;
          border-radius: 4px;
          line-height: 260px;
          font-size: 80px;
          text-align: center;
          margin-right: 60px;
          cursor: pointer;
        }
        .content-box {
          display: inline-block;
          width: 250px;
          height: 260px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-right: 60px;
          margin-bottom: 20px;
          &>.content-box-head {
            height: 48px;
            background: #7fce89;
            font-size: 14px;
            color: #fff;
            line-height: 48px;
            padding-left: 20px;
          }
          &>.content-box-content {
            height: 192px;
            font-size: 12px;
            color: #435a6c;
            line-height: 32px;
            padding-left: 20px;
            padding-top: 10px;
            padding-bottom: 30px;
            height: auto;
          }
          &>.content-box-foot {
            border-top: 1px solid #ccc;
            padding: 0 20px;
            line-height: 60px;
            .spans {
              position: relative;
              margin-right: 43px;
              cursor: pointer;
              img:nth-child(2) {
                display: none;
              }
              .tooltip {
                display: none;
              }
              &:hover {
                img:nth-child(1) {
                  display: none;
                }
                img:nth-child(2) {
                  display: inline-block;
                }
                .tooltip {
                  position: absolute;
                  left: 28px;
                  top: -20px;
                  display: inline-block;
                  width: 40px;
                  height: 20px;
                  line-height: 20px;
                  text-align: center;
                  background: #666;
                  font-size: 12px;
                  color: #fff;
                }
              }
            }
            .spans:last-child {
              margin-right: 0;
            }
          }
        }
        .dialog-table-content {
          tr {
            height: 56px;
            td:first-child {
              text-align: right;
              width: 80px;
            }
            td:last-child {
              padding-left: 20px;
              font-size: 12px;
            }
            .dialog-table-input {
              width: 350px;
            }
            .dialog-table-small-input {
              width: 240px;
            }
            .dialog-table-section {
              margin-top: 20px;
            }
            .dialog-table-section:last-child {
              margin-bottom: 20px;
            }
            .dialog-table-checkbox {
              width: 100%;
              .el-checkbox {
                margin-right: 10px;
                margin-top: 10px;
              }
            }
            .el-checkbox+.el-checkbox {
              margin-left: 0;
            }
          }
        }
        .look-details {
          // .el-dialog,.el-dialog--small {
          //   width: 320px !important;
          // }
          .look-details-table {
            tr {
              height: 30px;
              color: #435a6c;
              font-size: 14px;
              td:first-child {
                text-align: right;
              }
              td:last-child {
                padding-left: 20px;
              }
            }
          }
        }
      }
    }
  
  }

</style>

