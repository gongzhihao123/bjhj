<template>
  <div class="index">
    <div class="banner">
      <p class="title">实发金额</p>
      <p class="money">{{ money }}</p>
      <time>下发时间：{{time}}</time>
    </div>
    <notice></notice>
    <wages-list></wages-list>

  </div>
</template>
<script>
import dialogCom from '../components/dialog'
import notice from '../components/notice'
import wagesList from '../components/wagesList'
import { format } from '../utils/timetTranslate'
import { setupWebViewJavascriptBridge } from './../utils/setupWeb.js'
export default {
  name: 'index',

  data () {
    return {
      money: '',
      time: ''
    }
  },

  components: {
    dialogCom,
    notice,
    wagesList
  },

  async mounted () {
    await this.$store.dispatch('indexDetail')
    if (this.$store.state.historyList.length) {
      this.money = this.$store.state.historyList[0].totalMoney
      this.time = format(this.$store.state.historyList[0].publishTime, 'yyyy-MM-dd hh:mm')
    }
    let str = Number(this.$store.state.historyList[0].month.toString().substr(4, 2)) + '月工资单' + (Number(this.$store.state.historyList[0].month.toString().substr(6)) === 1 ? '' : '(' + Number(this.$store.state.historyList[0].month.toString().substr(6)) + ')')
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('historyPage', {'login': str + '明细'}, function (response) {
        console.log(response)
      })
    })
    try {
      window.esMobile.homePage(str + '明细')
      window.esMobile.setCanManageBack(false)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/mixin.scss';
.index {
  .banner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 170px;
    background: url('../assets/images/banner-bg.png') no-repeat center 60%;
    background-size: cover;
    color: white;

    >.title {
      font-size: 1.5rem;
    }

    >.money {
      font-size: 2.5rem;
      color: #f8e71c;
    }

    >time {
      font-size: 1rem;
      color: rgba(255, 255, 255, .75);
    }
  }
}
</style>
