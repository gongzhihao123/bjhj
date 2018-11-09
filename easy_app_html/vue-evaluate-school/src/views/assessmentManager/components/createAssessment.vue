<template>
  <div id="create-assessment">
    <header>
      <span :class="{informationActive: isActive}">基本信息</span>
      <span :class="{parameterActive: isActive}">参数设定</span>
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
      isActive: false
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
          this.isActive = false
        } else {
          this.isActive = true
        }
      }, 200)
    }
  },
  created () {
    if (window.location.href.indexOf('/basicInformation') !== -1) {
      this.isActive = false
    } else {
      this.isActive = true
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
      width: 116px;
      height: 41px;
      font-size: 16px;
      line-height: 42px;
      text-align: center;

      &:first-child{
        color: #fff;
        background: url(../../../assets/images/left-tab-blue.png);
      }

      &:last-child{
        color: #9A9A9A;
        width: 105px;
        margin-left: -6px;
        background: url(../../../assets/images/right-tab.png);
      }
    }

    span.informationActive{
      color: #9A9A9A;
      background: url(../../../assets/images/left-tab.png);
    }
    
    span.parameterActive{
      color: #fff;
      background: url(../../../assets/images/right-tab-blue.png);
    }
  }
}
</style>
