<template>
  <div class="home">
    <div class="bg"></div>
    <swiper :options="swiperOption">
      <swiper-slide>
        <div class="page page-container-1">
          <div>
            <img src="../assets/images/page-1.png" alt="">
          </div>
          <div class="page-1">
            <h3 class="page-title">还在手动裁工资条</h3>
            <p class="page-sub">不需要！点击下鼠标轻松搞定～</p>
            <p class="page-des">
              自动拆分，单条发放，
              <br/>
              高效、灵活、无忧管理薪资数据
            </p>
            <router-link to="/addWages">立即使用</router-link>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="page page-container-2">
          <div class="page-2">
            <h3 class="page-title">上传您做好的 EXCEL 工资表</h3>
            <p class="page-sub">不断优化的算法驱动<br/>您不需要额外修改您的工资表直接上传即可自动解析</p>
          </div>
          <div>
            <img src="../assets/images/page-2.png" alt="">
            <router-link to="/addWages">
              <img src="../assets/images/upload.png" alt="">立即上传
            </router-link>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="page page-container-3">
          <div class="page-3">
            <h3 class="page-title"><img src="../assets/images/send.png" alt="">定时发送</h3>
            <p class="page-arrow">有事情请假不能按时发送？<img src="../assets/images/triangle.png" alt=""></p><br/>
            <p class="page-arrow">没关系 <img src="../assets/images/triangle.png" alt=""></p>
            <p class="page-des">定时发送能让您提前安排好<br/>每个月都能在同一时间收到工资信息，分秒不差</p>
          </div>
          <div>
            <img src="../assets/images/page-3.png" alt="">
            <router-link to="/addWages"><img src="../assets/images/upload.png" alt="">马上尝试</router-link>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="page  page-container-4">
          <div class="">
            <img src="../assets/images/page-4.png" alt="">
          </div>
          <div class="page-4">
            <h3 class="page-title">数据加密，随时撤回</h3>
            <p class="page-des">加密传输、云安全保护、个人信息交叉验证等<br/>为您的数据安全保驾护航</p>
            <p class="page-des">随时撤回、再次发送、永久删除、历史下载...<br/>满足各种工资发放管理情景</p>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination swiper-pagination-white" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'home',

  data () {
    return {
      swiperOption: {
        pagination: '.swiper-pagination',
        direction: 'vertical',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30,
        mousewheelControl: true,
        onInit: function (swiper) {
          let slide = swiper.slides.eq(0)
          slide.addClass('bounce')
        },
        onTransitionStart: function (swiper) {
          for (let i = 0; i < swiper.slides.length; i++) {
            let slide = swiper.slides.eq(i)
            slide.removeClass('bounce')
          }
        },
        onTransitionEnd: function (swiper) {
          let slide = swiper.slides.eq(swiper.activeIndex)
          slide.addClass('bounce')
        }
      }
    }
  },

  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/variable.scss";

.home {
  position: absolute;
  top: 50px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  background-image: url("../assets/images/bg.png");
  background-size: cover;

  > .bg {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-image: url("../assets/images/bg-icon.png");
    background-size: cover;
  }

  .swiper-container {
    height: 100%;

    .swiper-slide {
      display: flex;
      align-items: center;

      .page {
        display: flex;
        width: 960px;
        margin: -50px auto 0 auto;

        > div:nth-child(2) {
          margin-left: 60px;
        }

        .page-title {
          margin-top: 50px;
          font-size: 36px;
          color: $white;
        }

        .page-sub {
          font-size: 24px;
          color: #000000;
          margin-top: 20px;
        }

        .page-des {
          margin-top: 20px;
          font-size: 18px;
          color: rgba(255,255,255,0.82);
        }

        a {
          display: block;
          align-items: center;
          width: 140px;
          height: 44px;
          line-height: 44px;
          font-size: 24px;
          margin-top: 36px;
          color: #000000;
          border: 2px solid rgba(255,255,255,0.53);
          background-image: radial-gradient(59% 60%, #7ac943 41%, #66d99f 100%);
          border-radius: 8px;
          text-align: center;

          img {
            margin: 0 10px;
          }


          &:hover {
            border: 2px solid rgb(58, 147, 58);
          }
        }

        &.page-container-1 {
          justify-content: flex-start;
        }

        &.page-container-2 {
          justify-content: flex-end;

          >div:nth-child(2) {
            margin-left: 40px;

            >a {
              display: flex;
              align-items: center;
              margin: 16px auto;
              padding: 0 10px;
              width: 150px;
            }
          }

          .page-2 {
            text-align: right;

            .page-sub {
              font-size: 18px;
              line-height: 30px;
            }
          }
        }

        &.page-container-3 {
          .page-3 {
            text-align: right;

            .page-title {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              margin-top: 0;
              img {
                margin-right: 16px;
              }
            }

            .page-des {
              margin-top: 0;
              font-size: 18px;
              color: $white;
              line-height: 36px;
            }

            .page-arrow {
              position: relative;
              display: inline-block;
              width:250px;
              height:37px;
              margin: 10px 0;
              text-align: center;
              line-height: 36px;
              font-size: 18px;
              color: rgba(8,43,69,0.90);
              background:rgba(255,255,255,0.30);
              border:1px solid rgba(255,255,255,0.35);
              border-radius:5px;

              img {
                position: absolute;
                left: -13px;
                top: 13px;
                transform: rotate(4deg);
              }
            }

            .page-arrow:nth-child(4) {
              width: 74px;

              img {
                left: 73px;
                top: 13px;
                transform: rotate(174deg);
              }
            }
          }

          >div:nth-child(2) {
            margin-left: 40px;

            >a {
              display: flex;
              align-items: center;
              margin: 16px auto;
              padding: 0 10px;
              width: 170px;

              img {
                margin: 0 14px;
              }
            }
          }
        }

        &.page-container-4 {
          .page-title {
            margin: 0;
          }

          .page-des {
            color: $white;
            line-height: 30px;
          }

          .page-des:nth-child(2) {
            margin: 20px 0;
          }
        }
      }
    }
  }
}
</style>
