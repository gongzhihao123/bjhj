<template>
  <div class="wages-list">
    <ul class="list">
      <li v-for="(item,index) in wagesList" :key="index" class="item">
        <p class="name cursor" v-if="item.name.length >= 10">{{ item.name.slice(0, 20) + '...' }}</p>
        <p class="name" v-else>{{ item.name }}</p>
        <p class="num">{{ item.num }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import dialogCom from '../components/dialog'
export default {
  name: 'wages-list',

  data () {
    return {
      showDialog: false,
      historyList: {}
    }
  },

  components: {
    dialogCom
  },
  computed: {
    wagesList () {
      if (this.$store.state.historyList.length) {
        let arr = []
        var totalMoney = this.$store.state.historyList[0].totalMoney
        if (this.$router.history.current.name === 'detail') {
          arr.push({name: '实发金额', num: totalMoney, show: false})
        }
        this.historyList = JSON.parse(this.$store.state.historyList[0].payroll.replace(/'/g, '"'))
        for (var i in this.historyList) {
          if (i !== 'rowNo') {
            if (this.historyList[i] !== '') {
              arr.push({name: i, num: this.historyList[i], show: false})
            }
          }
        }
        return arr
      } else {
        return []
      }
    }
  },

  async mounted () {
    if (this.$store.state.salaryUserId) {
      await this.$store.dispatch('historyList', this.$store.state.salaryUserId)
    } else {
      await this.$store.dispatch('indexDetail')
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/mixin.scss';
.wages-list {
  .list {
    // position: absolute;
    width: 100%;
    bottom: 0;
    top: 277px;
    overflow: hidden;

    .item {
      display: flex;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      color: #444444;
      border-bottom: 1px solid #e8e8e8;

      >p.name {
        width: 80%;
        font-size: 1.1rem;
        @include text-overflow();
      }

      >p.num {
        color: #464646;
      }
    }
  }
}
</style>
