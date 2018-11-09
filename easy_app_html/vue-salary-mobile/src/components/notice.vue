<template>
  <div class="notice" @click="jump">
      <span>公告</span>
      {{ notice }}
  </div>
</template>

<script>
export default {
  name: 'notice',
  data () {
    return {
    }
  },
  computed: {
    notice () {
      if (this.$store.state.historyList.length) {
        return this.$store.state.historyList[0].remark
      } else {
        return ''
      }
    }
  },
  methods: {
    jump () {
      this.$router.push({path: '/notice'})
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/mixin.scss';

.notice {
  padding: 1.2rem;
  width: 100%;
  color: #999999;
  font-size: 1rem;
  background: rgba(62,167,243,0.13);
  @include text-overflow();

  span {
    color: #444444;
    margin-right: .2rem;
    font-size: 1.2rem;
  }
}
</style>
