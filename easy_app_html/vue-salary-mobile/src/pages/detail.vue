<template>
  <div class="detail">
    <div v-if="!empty">
      <div class="head">
        下发时间：{{ createTime }}
      </div>
      <notice></notice>
      <wages-list></wages-list>
    </div>
    <div class="empty" v-else>
      <div>
        <p>此工资单已被撤回</p>
        <p>如有疑问请联系您的财务人员</p>
      </div>
    </div>
  </div>
</template>

<script>
import { setupWebViewJavascriptBridge } from './../utils/setupWeb.js'
import notice from '../components/notice'
import wagesList from '../components/wagesList'
import { format } from '../utils/timetTranslate'
export default {
  name: 'detail',

  data () {
    return {
    }
  },
  computed: {
    empty () {
      return this.$store.state.empty
    },
    createTime () {
      return format(this.$store.state.historyList[0].publishTime, 'yyyy-MM-dd hh:mm')
    }
  },
  created () {
    console.log(this.$route.query)
    var _this = this
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('iconHistory', {show: true, image: 'http://www.meetyuu.com/static/salaryMobile/img/green.png', methods: 'jumpHead'}, function (response) {
        console.log(response)
      })
      bridge.registerHandler('jumpHead', function (data, responseCallback) {
        _this.$router.push({path: '/history'})
      })
    })
    try {
      window.esMobile.showRightButton(false)
      window.esMobile.setCanManageBack(false)
    } catch (e) {
      console.log(e)
    }
    /* eslint-disable */ // 忽略代码检测
    window['showHistor'] = function () {
      _this.$router.push({path: '/history'})
    }
  },
  components: {
    notice,
    wagesList
  }
}
</script>

<style scoped lang="scss">

.detail {
  height: 100%;

  .head {
    padding: 1rem;
    font-size: 1rem;
    color: white;
    background: #3fa7f3;
  }

  >.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    font-size: 1.5rem;
    color: #b3b3b3;
    p {
      margin: .5rem 0;
    }
  }
}

</style>
