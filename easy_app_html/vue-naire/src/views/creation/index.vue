<template>
  <div id="create">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'create'
}
</script>

<style lang="scss">
#home {
  input,textarea {
    outline-color:#19b955;
  }
  .green {
    background: #19b955;
    border-color: #19b955;
    color: #fff;
  }
  .red {
    background: #ff494b;
    border-color: #ff494b;
    color: #fff;
  }
  .el-radio__input.is-checked .el-radio__inner{
    background: #19b955;
    border-color: #19b955;
  }
  .triangle-up {
    position: absolute;
    left: 120px;
    top: 12px;
    width: 0;
    height: 0;
    span {
      position: absolute;
      border: 10px solid transparent;
      border-bottom: 10px solid #e8e8e8;
      &:first-child {
        top: 2px;
        z-index: 2;
        border-bottom: 10px solid #fff;
      }
    }
    &.active {
      left: 220px !important;
    }
  }
  .box{
    display:inline-block;
    margin-left:80px;
    margin-top:10px;
    width:590px;
    overflow: hidden;
    min-height:40px;
    max-height: 80px;
    border-radius: 4px;
    border:1px solid #e8e8e8;
    &>span{
      display:inline-block;
      padding:5px 10px;
      border:1px solid #19b955;
      margin:4px;
      cursor:pointer;
      border-radius:4px;
    }
  }


  // 一级样式 
  .contents {
    display: -webkit-flex;
    display: flex;
    height: 342px;
    background: transparent;
    margin-top: 124px;
    padding: 0;
    .module{
      cursor: pointer;
      -webkit-flex: 1;
      flex: 1;
      text-align: center;
      &>img {
        margin-top: 60px;
        margin-bottom: 28px;
      }
      p.tit{
        font-size: 20px;
        margin-bottom: 10px;
      }
      p {
         color: #fff;
      }
    }
    .public {
      background: #42b0ff;
    }
    .inside {
      background: #05d3c7;
    }
    .without {
      background: #48d684;
    }
  }

  // 二级样式
  .establish {
    min-height: 530px;
    border: 1px solid #e8e8e8;
    margin-top: 20px;
    margin-bottom: 140px;
    background: #fff;
    padding: 20px;
    .common{
      &>div {
        margin:20px 10px;
        p {
          margin-top: 20px;
        }
        .ident {
          margin-right: 20px;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          cursor: pointer;

          &.active {
            background: #19b955;
            color: #fff;
            border-color: #19b955;
          }
        }
      }
    }
    label{
      margin-right: 10px;
    }
    .sample.el-input{
      .el-input__inner{
        margin-top:10px;
        width:590px;
        height:40px;
      }
    }
    .el-input {
      border: 0;
      width: 270px;
      height: 40px;
    }
    .el-button:active {
      opacity: 0.8;
    }
    .el-button.is-active {
      border-color: #19b955;
      color: #19b955;
    }
    .el-input__inner{
      display: inline-block;
      width: 270px;
      height: 40px;
      border: 1px solid #e8e8e8;
      color: #333;
      .el-input__icon.el-icon-caret-top{
        border-color: #e8e8e8;
      }
    }
    .create-title {
      width: 100%;
      font-size: 16px;
      border-left: 3px solid #19b955;
      padding-left: 10px;
      font-weight: bold;
      color: #333;
    }
    .btn {
      margin-top: 64px;
      margin-left: 88px;
      .el-button {
        width: 102px;
        height: 36px;
      }
      .save:hover{
        opacity: 0.8;
        color: #fff;
      }
    }
  }
}
</style>
