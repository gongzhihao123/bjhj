<template>
  <div id="rules">
    <!--<el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in navList" :key="item.name" :label="item.label" :name="item.name" @click.native="route(item)">
        <router-link :to="item.path" active-class="active">{{item.name}}</router-link>
      </el-tab-pane>
    </el-tabs>-->

    <ul class="nav-list">
      <li v-for="(item, i) in navList" :key="i">
        <router-link :to="item.path" active-class="active">{{item.label}}</router-link>
      </li>
    </ul>
    

    <div class="views">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// import {cutImg} from '../../filters/index.js'
export default {
  name: 'rules',
  data () {
    return {
      activeName: 'one',
      value: '',
      options: [],
      navList: [
        { label: '学科教室', name: 'one', path: '/rules/classroom' },
        { label: '单双周排课', name: 'two', path: '/rules/singleOrDouble' },
        { label: '课节分配', name: 'three', path: '/rules/classAllot' },
        { label: '课程关系', name: 'four', path: '/rules/classRelation' },
        { label: '连堂课', name: 'five', path: '/rules/connectClass' },
        { label: '合班课', name: 'six', path: '/rules/combineClass' },
        { label: '班级不排课', name: 'seven', path: '/rules/classNoLesson' },
        { label: '教师不排课', name: 'eight', path: '/rules/teachNoLesson' },
        { label: '教师互斥', name: 'nine', path: '/rules/tectchMutualExclusion' },
        { label: '连上限制', name: 'ten', path: '/rules/connectRestrict' },
        { label: '其他设置', name: 'eleven', path: '/rules/otherSet' }
      ]
    }
  },
  methods: {
    route (item) {
      this.$router.push(item.path)
    }
  }
}
</script>

<style lang="scss">
$color: #2BCEA7;
#rules {
  .btn {
    background: #F9A85A;
    color: #fff;
    border-color: #F9A85A;
    float: right;
    margin-bottom: 18px;
  }
  table.subject-classroom {
    width: 100%;
    margin: 0 auto;
    .change {
      color: #F9A85A;
      margin-right: 50px;
    }
    .green {
      color: #26CEA9;
      margin-right: 50px;
    }
    th {
      height: 40px;
      background-color: #26CEA9;
      color: #fff;
    }
    td {
      line-height: 50px;
    }
    td:nth-child(2) {
      max-width: 400px;
      padding: 0 20px;
    }
    td,th {
      border:1px solid #ccc;
      text-align: center;
    }
    th{
      border-top: none;
    }
    .cutimg{
      width: 20px;
      height: 20px;
      position: relative;
      top:4px;
      margin-right: 10px;
      cursor: pointer;
    }
    .click {
      cursor: pointer;
    }
  }
  .nav-list {
    display: flex;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    li {
      a {
        display: block;
        padding: 10px 20px;
        color: #444;
        &.active {
          color: #2CCEA7;
          border-bottom: 3px solid #2CCEA7;
        }
      }
    }
  }
  .views {
    position: absolute;
    left: 20px;
    right: 10px;
    bottom: 0;
    top: 70px;
    overflow: hidden;
  }
}
.el-checkbox+.el-checkbox{
  margin-left: 0;
}
.el-tabs__item{
  color: #333;
  padding: 0 26px;
}
.el-tabs__item.is-active{
  color: #40BB8A;
}
.el-tabs__active-bar {
  background: #40BB8A;
}
.el-select {
  .el-input__inner {
    border-color: #2CCEA7;
    color: #333;
  }
  .el-input__icon {
    color: #2CCEA7;
  }
}
.el-scrollbar{
  .el-select-dropdown__wrap.el-scrollbar__wrap {
    .el-select-dropdown__item.selected{
      background-color:#2CCEA7;
    }
    .el-select-dropdown__item.selected.hover{
      background-color:#2CCEA7;
    }
  }
}
.set-all {
  .el-select .el-input__inner {
    background-color: #5CD189;
    color:#279853;
  }
  .el-input__icon {
    color: #fff;
  }
  
}

.el-dialog {
  .el-select {
    .el-input__inner {
      border-color: #2CCEA7;
      color: #333;
    }
    .el-input__icon {
      color: #2CCEA7;
    }
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #2CCEA7;
    border-color: #2CCEA7;
  }
  .el-checkbox__inner:hover {
    border-color: #2CCEA7;
  }
}
.el-radio__input.is-checked .el-radio__inner{
  border-color: #2CCEA7;
  background: #2CCEA7;
}
.el-radio__inner {
  border-color: #2CCEA7;
}
table.subject-classroom {
  tr{
    td:last-child {
      .el-radio__input{
        margin-right: 10px;
      }
    }
  }
  // tr:nth-child(2){
  //   td:first-child{
  //     font-weightfont-weight: bold;
  //   }
  // }
  td.set-all {
    .el-radio__input.is-checked .el-radio__inner{
      border-color: #F9A85A;
      background: #F9A85A;
    }
    .el-radio__inner {
      border-color: #F9A85A;
    }
  }
}
  .actionable {
    position: relative;
    max-width: 188px !important;
    ul {
      position: absolute;
      background: #fff;
      right: 10px;
      // top: 10px;
      z-index: 5;
      li {
        border: 1px solid #E0E0E0;
        border-bottom: 0;
        line-height: 28px;
        padding: 0 10px;
        cursor: pointer;
        &:last-child {
          border-bottom: 1px solid #E0E0E0;
        }
        &:hover {
          background: $color;
          color: #fff;
        }
      }
    }
  }
  div.left-nav {
    float: left;
    width: 14%;
    min-height:300px;
    // height: calc(100% - 20px) !important;
    padding-top:20px;
    // border-radius: 4px;
    background: linear-gradient(120deg, #93E1B1, #41CE9A, #2CCEA7);
    margin-right: 1.4%;
    overflow: auto;
    .el-tree {
      width: 100%;
      cursor: pointer;
      background: transparent;
      border: none;
      color: #fff;
      .el-tree-node__expand-icon {
        border-left-color:#fff;
      }
      .el-tree-node__expand-icon.is-leaf {
        border-color: transparent;
      }
      div.el-tree-node__content {
        background: transparent;
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
    }
  }
.el-tree-node{
  color: #fff;
}
.is-current{
  color: #2CCEA7;
}
.el-tree-node__expand-icon{
  border-left-color: #2CCEA7;
}
.no-content {
  text-align: center;
  color: #bbb;
  &.none {
    color: #bbb;
  }
}
</style>
