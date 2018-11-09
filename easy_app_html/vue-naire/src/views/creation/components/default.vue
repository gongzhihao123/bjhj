<template>
  <div id="created-default">
    <div class="contents">
      <div class="module public" @click="handleClick(1)">
        <img src="../../../assets/images/public.png" ondragstart="return false;">
        <p class="tit">公开问卷</p>
        <p>接到问卷的所有人均可参与问卷</p>
      </div>
      <div class="module inside" @click="handleClick(2)">
        <img src="../../../assets/images/interior.png" ondragstart="return false;">
        <p class="tit">内部问卷</p>
        <p>指定内部人员参与问卷</p>
      </div>
      <!--判断是不是管理员显示-->
      <div class="module without" v-show="user.companyType == 2" @click="handleClick(3)">
        <img src="../../../assets/images/without.png" ondragstart="return false;">
        <p class="tit">外部问卷</p>
        <p>指定外部人员参与问卷</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'created-default',
  data () {
    return {
      username: '林晓彤',
      activeName: 'first',
      adminFlag: true
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    handleClick (i) {
      this.$router.push({path: '/created/genre', query: {state: i}})
    }
  }
}
</script>

<style lang="scss">
    #created-default {

    }
</style>
