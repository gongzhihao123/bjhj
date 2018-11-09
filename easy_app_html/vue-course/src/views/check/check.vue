<template>
  <div id="check">
    <!--课表查看-->
    <nav class="nav">
      <router-link v-for="item in navList" :key="item.name" :to="item.path" active-class="active">{{ item.name }}</router-link>
    </nav>

    <div class="router">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'check',
  data () {
    return {
      navList: [
        { name: '学校课表', path: '/check/school' },
        { name: '年级课表', path: '/check/grade' },
        { name: '班级课表', path: '/check/classes' },
        { name: '教师课表', path: '/check/teachers' },
        { name: '备课组课表', path: '/check/prepare' },
        { name: '教室课表', path: '/check/classroom' },
        { name: '学生课表', path: '/check/student' }
      ]
    }
  }
}
</script>
<style lang="scss">
$color: #26CEA9;
$border: #E0E0E0;
#check {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  // padding-bottom: 20px;
  color: #444;
  background: #fff;
  padding: 20px;
  .nav {
    margin-bottom: 20px;
    border-bottom: 1px solid #E0E0E0;
    a {
      display: inline-block;
      padding: 6px 0;
      width: 90px;
      text-align: center;
      color: #222;
      &.active {
        border-bottom: 3px solid $color;
        color: $color;
      }
    }
  }
  .router {
    position: relative;
    height: calc(100%);
  }
  .is-checked {
    .el-checkbox__inner {
      background-color: $color;
      border-color: $color;
    }
  }
  .header {
    height: 40px;
    .button-group {
      float: right;
    }
  }
  .check-table {
    margin-top: 10px;
    overflow: auto;
    tr {
      height: 40px;
      text-align: center;
      &:first-child {
        background: $color;
        color: #fff;
      }
      td {
        min-width: 80px;
        border: 2px solid $border;
      }
    }
    tbody, tfoot {
      tr:first-child {
        background: #fff;
        color: #444;
      }
    }
  }
  .grade-layout {
    display: flex;
    margin-top: 10px;
    height: calc(100% - 50px);
    .tree {
      width: 228px;
      height: 100%;
      overflow: auto;
      margin-right: 20px;
      background: linear-gradient(to right, #51D08F, #26CEA9);
      border-radius: 6px;
      color: #fff;
      .grade-list {
        padding: 10px 0;
        li {
          height: 36px;
          line-height: 36px;
          padding-left: 10px;
          margin-left: 4px;
          cursor: pointer;
          transition: all 0.6s;
          &.active {
            background: #fff;
            color:  #26CEA9;
          }
        }
      }
      .filter-tree {
        background: linear-gradient(to right, #51D08F, #26CEA9);
        .el-tree-node .is-current {
          color: $color;
        }
      }
    }
    .table-box {
      flex-grow: 1;
      border-radius: 6px;
      overflow: auto;
      table {
        margin: 0;
        width: 100%;
      }
    }
  }
  .no-content {
    text-align: center;
    color: #ccc;
    &.none {
      color: #fff;
    }
  }
  .el-tree-node__expand-icon {
    border-left-color:#fff;
  }
  .el-tree-node__expand-icon.is-leaf {
    border-color: transparent;
  }
  div.el-tree-node__content {
    // background: transparent;
  }
  div.el-tree-node__content:hover{
    background: #fff;
    color: #2CCEA7;
    .el-tree-node__expand-icon {
      border-left-color: #2CCEA7;
    }
    .el-tree-node__expand-icon.is-leaf {
      border-color: transparent;
    }
  }
  .el-tree-node, .is-current {
    // .el-tree-node__content {
    //   background: #2CCEA7;
    //   color: #fff;
    // }
  }
  .el-tree__empty-text {
    color: #fff;
  }
  .el-tree {
    border: none;
    margin: 20px 0;
  }
}
</style>
