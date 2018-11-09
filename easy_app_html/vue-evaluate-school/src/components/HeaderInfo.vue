<template>
    <div class='headerInfo'>
        <span class="headerfont">{{ teacher }}</span>
        <el-button type='primary' size='small' @click="details(state)">查看详情</el-button>
        <div class='situation'>
            <h2 :style='{backgroundColor:complet}'></h2>
            <span>已完成</span>
            <h2 :style='{backgroundColor:failure}'></h2>
            <span>未完成</span>
        </div>
    </div>
</template>
<script>
export default {
  name: 'HeaderInfo',
  props: ['teacher', 'complet', 'failure', 'state'],
  data () {
    return {
      evalId: '',
      title: ''
    }
  },
  methods: {
    async details (data) {
      this.evalId = this.$route.query.id
      if (this.teacher === this.title) {
        await this.$store.dispatch('details', {state: '整体测评', data: data})
        this.$router.push({path: '/assessmentManager/assessmentState/assessment', query: {id: this.evalId}})
      } else if (this.teacher === '教师测评完成情况') {
        await this.$store.dispatch('details', {state: '教师测评完成情况', data: data})
        this.$router.push({path: '/assessmentManager/assessmentState/assessment', query: {id: this.evalId}})
      } else if (this.teacher === '学生测评完成情况') {
        await this.$store.dispatch('details', {state: '学生测评完成情况', data: data})
        this.$router.push({path: '/assessmentManager/assessmentState/assessment', query: {id: this.evalId}})
      } else if (this.teacher === '家长测评完成情况') {
        await this.$store.dispatch('details', {state: '家长测评完成情况', data: data})
        this.$router.push({path: '/assessmentManager/assessmentState/assessment', query: {id: this.evalId}})
      }
    }
  },
  created () {
    this.title = sessionStorage.title
  }
}
</script>
<style lang="scss" scoped>
@import './../assets/scss/main.scss';
    .headerInfo{
        padding-left: $width / 4;
        padding-right: $width / 4;
        
        height:50px;
        margin: 0 auto;
        line-height: 50px;
        overflow: hidden;
        background: #ffffff;
        border-bottom: 1px solid #DDDDDD;

        > .headerfont {
            font-size: 15px;
            color: $darkgrey;
            margin-right:10px;
        }
        > .situation {
            width: 200px;
            float: right;
            line-height:50px;

            h2,span {
                display: inline-block;
                vertical-align: middle;
                margin-left:10px;
                margin-right: 10px;
            }

            h2 {
                margin: 0;
                width: 15px;
                height: 15px;
            }

            span {
                font-size: 13px;
            }
        }
    }
</style>

