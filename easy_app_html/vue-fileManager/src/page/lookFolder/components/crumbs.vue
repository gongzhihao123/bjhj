<template>
  <div class="crumbs">
    <span class="refund" v-if="crumbs.length > 1" @click.stop="back">返回上一级 /</span>
    <span v-for="(item, index) in crumbs" @click.stop="jumpContent(item)" :key="index"><i v-if="item.id !== 0"> > </i>{{ item.name }}</span>
  </div>
</template>
<script>
export default {
  name: 'crumbs',
  props: ['crumbsList'],
  data () {
    return {
      crumbs: [{id: 0, name: '文件空间'}]
    }
  },
  methods: {
    async back () {
      if (this.crumbs[this.crumbs.length - 2].name === '文件空间') {
        var allFold = this.$store.state.foldList.filter(item => item.parentId === 0)
        this.$store.dispatch('allFold', allFold)
      } else {
        await this.$store.dispatch('parentFold', this.crumbs[this.crumbs.length - 2].id)
        this.$store.dispatch('getFolder')
      }
    },
    async jumpContent (data) {
      if (data.name === '文件空间' && data.id === 0) {
        var allFold = this.$store.state.foldList.filter(item => item.parentId === 0)
        this.$store.dispatch('allFold', allFold)
      } else {
        await this.$store.dispatch('parentFold', data.id)
        this.$store.dispatch('getFolder')
      }
    }
  },
  watch: {
    crumbsList (item) {
      this.crumbs = [{id: 0, name: '文件空间'}, ...item]
    }
  }
}
</script>
<style lang='scss' scoped>
  .crumbs {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    .refund {
      color: #409EFF;
    }
  }
</style>
