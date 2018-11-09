<template>
  <div id="manager">
    <section class="top-nav">
        <div class="nav-content">
          <div class="nav-left">
            <el-button @click="addEval()" class="green" style="margin-right:20px;" icon="el-icon-plus">创建测评</el-button>
            <el-select v-model="stateValue" placeholder="请选择状态" @change="stateChange">
              <el-option
                v-for="item in stateOptions"
                :key="item.stateId"
                :label="item.stateName"
                :value="item.stateId">
              </el-option>
            </el-select>
            <el-input
              :maxlength="30"
              v-model="keyword"
              @keyup.enter.native="getList"
              placeholder="请输入内容">
            </el-input>
            <el-button class="green" @click="getList" icon="el-icon-search">搜索</el-button>
          </div>
          <div class="nav-right">
            <div class="nav-right-content"></div>
          </div>
        </div>
      </section>
      <article class="list">
        <el-row>
          <el-col :span="10">测评名称</el-col>
          <el-col :span="4">发布时间</el-col>
          <el-col :span="3">状态</el-col>
          <el-col :span="6">操作</el-col>
        </el-row>
        <div class="no-content" v-show="evalList.length == 0" >暂无数据</div>
        <el-row v-for="(item, i) in evalList" :key="i">
          <el-col :span="10">{{item.name}}</el-col>
          <el-col :span="4" class="time">{{item.createdTime | dateFormat}}</el-col>
          <el-col :span="3">
            <span v-if="item.state == 0 " class="zf">创建中</span>
            <span v-if="item.state == 1 " class="ing">发布中</span>
            <span v-if="item.state == 2 " class="end">已关闭</span>
          </el-col>
          <el-col :span="6" style="overflow: hidden; height: 60px;">
            <el-button v-if="item.state == 0" class="blue" @click="editorEval(item)" icon="el-icon-edit">编辑</el-button>
            <el-button v-if="item.state == 1||item.state == 2" class="blue"  @click="viewDval(item)" icon="el-icon-view">查看</el-button>
            <el-button v-if="item.state == 0" class="yellow" @click="publishEval(item)" icon="el-icon-circle-check-outline">发布</el-button>
            <el-button v-if="item.state == 1" class="yellow"  @click="closeEval(item)" icon="el-icon-close">关闭</el-button>
            <el-button v-if="item.state == 0||item.state == 2" class="red"  @click="deleteEval(item)" icon="el-icon-delete">删除</el-button>
          </el-col>
        </el-row>
      </article>
      <div class="block">
        <el-pagination
          v-show="evalList.length != 0"
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="pageNo"
          @current-change="handleCurrentChange"
          :total="totalCount">
        </el-pagination>
      </div>
  </div>
</template>
<script>
import service from '../api/index'
import { error, success, dateFormat } from '../utils/common'

export default {
  name: 'manager',
  data () {
    return {
      stateOptions: [
        {stateId: '', stateName: '全部'},
        {stateId: 0, stateName: '创建中'},
        {stateId: 1, stateName: '已发布'},
        {stateId: 2, stateName: '已关闭'}
      ],
      evalList: [],
      totalCount: 0,
      pageNo: 1,
      pageSize: 10,
      stateValue: '',
      keyword: ''
    }
  },
  methods: {
    // 获取
    async getList () {
      let pageNo = this.pageNo
      let pageSize = this.pageSize
      let state = this.stateValue
      let keyword = this.keyword
      const res = await service.getAllEvalList(pageNo, pageSize, state, keyword)
      if (res && res.code === 1) {
        this.evalList = res.result.list
        this.totalCount = res.result.totalCount
      } else {
        error(res.message)
      }
    },
    stateChange () {
      this.getList()
    },
    addEval () {
      this.$router.push({path: '/addEvalStepOne'})
    },
    editorEval (item) {
      this.$router.push({path: '/addEvalStepTwo', query: {id: item.id}})
    },
    viewDval (item) {
      this.$router.push({path: '/addEvalStepTwo', query: {id: item.id}})
    },
    publishEval (item) {
      this.$alert(`<p style="color:red">您是否确定要发布该测评，发布后发布内容不能修改.</p>`, '系统提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.publishEvalAction(item)
      }).catch(() => {})
    },
    async publishEvalAction (item) {
      const ret = await service.publishEval(item.id)
      if (ret.code === 1) {
        success('发布成功')
      } else {
        error(ret.message || '发布失败')
      }
      this.getList()
    },
    closeEval (item) {
      this.$alert(`<p style="color:red">您是否确定要关闭该测评，关闭后则结束本次测评.</p>`, '系统提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.closeEvalAction(item)
      }).catch(() => {})
    },
    async closeEvalAction (item) {
      const ret = await service.closeEval(item.id)
      if (ret.code === 1) {
        success('关闭成功')
      } else {
        error(ret.message || '关闭失败')
      }
      this.getList()
    },
    deleteEval (item) {
      this.$alert(`<p style="color:red">您是否确定要删除该测评，删除后发布内容会被彻底删除.</p>`, '系统提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.deleteEvalAction(item)
      }).catch(() => {})
    },
    async deleteEvalAction (item) {
      const ret = await service.deleteEval(item.id)
      if (ret.code === 1) {
        success('删除成功')
      } else {
        error(ret.message || '删除失败')
      }
      this.getList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    }
  },
  created () {
    if (this.$route.query.pageNo) {
      this.pageNo = this.$route.query.pageNo
    }
    this.getList()
  },
  filters: {
    dateFormat: function (arg) {
      return dateFormat(arg, 'yyyy-MM-dd')
    }
  }
}
</script>
<style lang="scss">
@import '../assets/scss/variable.scss';
#manager {
  .no-content {
    text-align: center;
    background: #fff;
    padding: 20px;
    border-top: 1px solid #e4e4e4;
  }
  section.top-nav {
    position: absolute;
    top: 51px;
    left: 0;
    right: 0;
    height: 68px;
    background: #fff;
    border-bottom: 1px solid #e4e4e4;
    .nav-content {
      width: 1200px;
      margin: 0 auto;
      height: 100%;
      line-height: 68px;
      .nav-left {
        float: left;
        height: 68px;
        &>.el-input {
          width: 240px;
          height: 36px;
        }
      }
      .nav-right {
        overflow: hidden;
        float: right;
        height: 68px;
        .nav-right-content {
          // border-right:1px solid #e4e4e4;
          float:left;
          .el-button {
            // margin-right: 22px;
            width: 98px;
          }
        }
        .list {
          width: 60px;
          text-align: center;
          margin: 0 auto;
          &>img {
            width: 20px;
            height: 20px;
            cursor: pointer;
            vertical-align: middle;
          }
        }
      }
    }
  }
  article{
    margin-top: 80px;
    min-height: 400px;
    .el-button {
      width: 86px;
      padding:10px 0;
    }
  }
  article.list {
    width: 1200px;
    margin-bottom: 20px;
    .el-row:first-child {
      margin-top: 20px;
      border: none;
      background: #fff;
    }
    .el-row{
      height: 62px;
      border: 1px solid #e8e8e8;
      line-height: 62px;
      background: #fff;
    }
    .el-col:first-child {
      text-align: left;
      padding-left: 20px;
    }
    .el-col:last-child {
      text-align: left;
    }
    .el-col {
      text-align: center;
    }
    .type {
      background: #19b955;
      color: #fff;
      margin-left: 38px;
      border-radius: 2px;
    }
  }
  article.card {
    display: flex;
    padding: 0px 24px;
    padding-top: 20px;
    flex-wrap: wrap;
    justify-content: flex-start;
    .card-p {
      position: relative;
      z-index: 100;
      cursor: pointer;
    }
    &>div {
      float: left;
      margin-right: 10px;
      margin-left: 10px;
      width: 264px;
      height: 228px;
      border: 1px solid #e8e8e8;
      background: #fff;
      margin-bottom: 38px;
      position: relative;
      p:first-child {
        padding-top: 10px;
        height: 74px;
        color: #333;
      }
      &>p{
        padding: 0 20px;
      }
      p.time {
        height: 50px;
        color: #656565;
      }
      p.type {
        height: 30px;
        line-height: 30px;
        .type-left {
          float:left;
          .form{
            background: #19b955;
            color: #fff;
            padding: 2px 4px;
            border-radius: 4px;
          }
        }
        .type-right {
          float: right;
          color: #9a9a9a;
        }
      }
      p.state-and-count{
        border-top: 1px solid #e8e8e8;
        line-height: 54px;
        .state {
          float: left;
        }
        .count {
          float: right;
          color: #a0a0a0;
        }
      }
      .card-button{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: none;
        text-align: center;
        padding-top: 40%;
      }
    }
    div:hover {
      .card-button {
        display: block;
        background: rgba(255,255,255,0.5);
      }
    }
  }
  .block {
    width: 1200px;
    text-align: center;
    height: 30px;
    margin: 20px auto;
    padding-bottom: 26px;
    color: #333;
    .el-pager{
      li {
        width: 40px;
        height: 40px;
        border: none;
        line-height: 40px;
      }
      li:hover{
        color: #19b955;
      }
      li.active {
        border-color: #19b955;
        background-color: #19b955;
        color: #fff;
        cursor: default;
      }
    }
    .el-pagination button {
      width: 40px;
      height: 40px;
      border: none;
    }
    .el-pagination button:hover{
      color: #19b955;
    }
  }
  .green {
    background: #19b955;
    border-color: #19b955;
    color: #fff;
  }
  .blue {
    background: #1F9FFF;
    border-color: #1F9FFF;
    color: #fff;
  }
  .yellow {
    background: #f7ba2b;
    border-color: #f7ba2b;
    color: #fff;
  }
  .red {
    background: #f13f3f;
    border-color: #f13f3f;
    color: #fff;
  }
  .end {
    color: #f13f3f;
  }
  .ing {
    color: #19b957;
  }
  .zf {
    color: #f7ba2b;
  }
  .transpond {
    .el-dialog {
      width: 888px;
      top: 7% !important;
    }
    .el-dialog__header {
      padding: 20px;
    }
    .el-dialog__body {
      padding: 0 20px;
    }
    h3{
      width: 100%;
      text-align: center;
    }
    p {
      margin-top: 10px;
      padding-left: 10px;
    }
    .content {
      width: 844px;
      height: 160px;
      background: #eee;
      padding: 0;
      padding-top: 10px;
      p:last-child{
        text-align: center;
        color: #1F9FFF;
        cursor: pointer;
      }
    }
    .dialog-footer {
      .el-button--primary {
        background: $theme;
        border: none;
        &:active {
          opacity: 0.8;
        }
      }
    }
    .el-dialog__footer {
      margin-top: 20px;
      text-align: center;
    }
    .p {
      height: 42px;
      line-height: 42px;
      margin-top: 20px;
      margin-bottom: 10px;
      // overflow-y: auto;
      span:first-child {
        display: inline-block;
        float: left;
      }
    }
    .choose-people {
      display: inline-block;
      width: 760px;
      height: 36px;
      border: 1px solid #ccc;
      cursor: pointer;
      line-height: 36px;
      overflow: auto;
      span {
        display: inline-block;
        height: 30px;
        padding: 0px 10px;
        border: 1px solid #ccc;
        margin-left: 6px;
        margin-top: 2px;
        line-height: 30px;
      }
    }
  }
  .dialog-ul {
    padding: 5px;
    li {
      height: 40px;
      line-height: 40px;
    }
  }
  .close {
    position: absolute;
    right: 20px;
    top: 24px;
    cursor: pointer;
  }

  .ident {
    margin-right: 20px;
    padding: 5px 7px;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      color: #1F9FFF;
    }

    &.active {
      background: $blue;
      color: #fff;
    }
  }
}
</style>
