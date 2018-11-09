<template>
  <div id="create-assessment">
    <header>
      <span :class="{informationActive: leftActive}">基本信息</span>
      <span :class="{wayActive: middleActive}">创建测评方式</span>
      <span :class="{parameterActive: rightActive}">参数设定</span>
    </header>
    <transition name="fadeIn" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'createAssessment',
  data () {
    return {
      leftActive: true,
      middleActive: true,
      rightActive: true
    }
  },
  methods: {
  },
  computed: {
    ...mapGetters([
      'active'
    ])
  },
  watch: {
    active () {
      setTimeout(() => {
        if (window.location.href.indexOf('/basicInformation') !== -1) {
          this.leftActive = true
          this.middleActive = false
          this.rightActive = false
        } else if ((window.location.href.indexOf('/assessmentWay') !== -1)) {
          this.leftActive = false
          this.middleActive = true
          this.rightActive = false
        } else if ((window.location.href.indexOf('/otherParameterSetting') !== -1)) {
          this.leftActive = false
          this.middleActive = false
          this.rightActive = true
        }
      }, 200)
    }
  },
  created () {
    if (window.location.href.indexOf('/basicInformation') !== -1) {
      this.leftActive = true
      this.middleActive = false
      this.rightActive = false
    } else if ((window.location.href.indexOf('/assessmentWay') !== -1)) {
      this.leftActive = false
      this.middleActive = true
      this.rightActive = false
    } else if ((window.location.href.indexOf('/otherParameterSetting') !== -1)) {
      this.leftActive = false
      this.middleActive = false
      this.rightActive = true
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#create-assessment{
  margin: $width;
  background: $white;
  border: 1px solid #ECECEC;
  border-radius: 4px;

  header{
    padding: $width / 2;
    height: 62px;
    box-sizing: border-box;
    border-bottom: 2px solid #DDDDDD;

    span{
      display: inline-block;
      width: 142px;
      height: 41px;
      font-size: 16px;
      line-height: 42px;
      text-align: center;

      &:first-child{
        color: #9A9A9A;
        width: 116px;
        background: url(../../../assets/images/left-tab.png);
      }

      &:nth-child(2){
        color: #9A9A9A;
        // width: 105px;
        margin-left: -6px;
        background: url(../../../assets/images/middle-tab.png);
      }

      &:last-child{
        color: #9A9A9A;
        width: 105px;
        margin-left: -6px;
        background: url(../../../assets/images/right-tab.png);
      }
    }

    span.informationActive{
      color: #fff;
      background: url(../../../assets/images/left-tab-blue.png);
    }

    span.wayActive{
      color: #fff;
      background: url(../../../assets/images/middle-tab-blue.png);
    }
    
    span.parameterActive{
      color: #fff;
      background: url(../../../assets/images/right-tab-blue.png);
    }
  }
}
</style>
