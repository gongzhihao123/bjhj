<template>
  <div id="index">
      <article class="list">
        <el-row>
          <el-col :span="8">测评名称</el-col>
          <el-col :span="6">发布单位</el-col>
          <el-col :span="4">发布时间</el-col>
          <el-col :span="3">状态</el-col>
          <el-col :span="2">操作</el-col>
        </el-row>
        <div class="no-content" v-show="evalList.length == 0">暂无数据</div>
        <el-row v-for="(item, i) in evalList" :key="i">
          <el-col :span="8">{{item.name}}</el-col>
          <el-col :span="6">{{item.companyName}}</el-col>
          <el-col :span="4" class="time">{{item.createdTime | dateFormat}}</el-col>
          <el-col :span="3">
            <span v-if="item.answerState == 0 " class="ing">进行中</span>
            <span v-if="item.answerState == 1 " class="end">已完成</span>
          </el-col>
          <el-col :span="2" style="overflow: hidden; height: 60px;">
            <el-button v-if="item.answerState == 0" class="green" @click="answer(item)">开始测评</el-button>
            <el-button v-if="item.answerState == 1" class="blue"  @click="answer(item)">查看</el-button>
          </el-col>
        </el-row>
    </article>
  </div>
</template>
<script>
import service from '../api/index'
import { error, dateFormat } from '../utils/common'

export default {
  name: 'index',
  data () {
    return {
      evalList: []
    }
  },
  methods: {
    // 获取
    async getMyEvalList () {
      const res = await service.getMyEvalList()
      if (res && res.code === 1) {
        this.evalList = res.result
      } else {
        error(res.message)
      }
    },
    answer (item) {
      this.$router.push({path: '/answer', query: {id: item.id}})
    }
  },
  created () {
    this.getMyEvalList()
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
#index {
  .no-content {
    text-align: center;
    background: #fff;
    padding: 20px;
    border-top: 1px solid #e4e4e4;
  }
  article{
    margin-top: 0;
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
