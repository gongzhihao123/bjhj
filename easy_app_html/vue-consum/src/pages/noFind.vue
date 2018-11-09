<template>
  <div class='no-fond'>
    <div class="img">
      <img src="../assets/images/404.png" alt="">
      <br/>
      <a href="/">
        <span class="top-left"></span>
        <span class="bottom-right"></span>
        点击返回首页
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'no-fond'

}
</script>

<style scoped lang="scss">
@mixin common {
  background: white;
  transition: all .25s ease-in-out;
  content: '';
  position: absolute;
}
.no-fond {
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  justify-content: center;
  background: #E7F4FA;
  .img {
    padding-top: 10%;
    text-align: right;
    a {
      position: relative;
      padding: 12px 18px;
      text-decoration: none;
      color: #20A0FF;
      span {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .top-left {
        &:before {
          @include common;
          top: 0;
          left: 0;
          width: 0;
          height: 2px;
          transition-delay: .75s;
        }
        &:after {
          @include common;
          top: 0;
          right: 0;
          width: 2px;
          height: 0;
          transition-delay: .5s;
        }
      }
      .bottom-right {
        &:before {
          @include common;
          bottom: 0;
          right: 0;
          width: 0;
          height: 2px;
          transition-delay: .25s;
        }
        &:after {
          @include common;
          bottom: 0;
          left: 0;
          width: 2px;
          height: 0;
          transition-delay: 0s;
        }
      }
      &:hover {
        span {
          &::before{
            width: 100%;
          }
          &::after {
            height: 100%;
          }
        }
        .top-left {
          &:before {
            transition-delay: 0s;
          }
          &:after {
            transition-delay: .25s;
          }
        }
        .bottom-right {
          &:before {
            transition-delay: 0.5s;
          }
          &:after {
            transition-delay: .75s;
          }
        }
      }
    }
  }
}
</style>
