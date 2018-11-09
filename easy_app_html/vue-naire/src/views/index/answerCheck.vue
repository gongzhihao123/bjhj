<template>
  <div id="answerNaire">
    <answer :details="templatePre" :able="able"></answer>
  </div>
</template>

<script>
import answer from '../../components/details'
import { notice, error } from '../../api/index.js'
export default {
  name: 'answerNaire',
  data () {
    return {
      naireId: '',
      userId: '',
      templatePre: {},
      able: 1
    }
  },
  components: {
    answer
  },
  created () {
    this.naireId = this.$route.query.naireId
    this.userId = this.$route.query.userId
    this.$https.get(`/index/naireUserResult?naireId=${this.naireId}&userId=${this.userId}&childId=${this.$route.query.childId || ''}`)
    .then(res => {
      if (res.data.code === 1) {
        this.templatePre = res.data.result
        this.templatePre.print = 1
        this.templatePre.qNum = this.templatePre.questions.filter(item => item.questionType !== 4).length
        this.templatePre.questions = this.templatePre.questions.map(item => ({...item, checked: ''}))
        this.templatePre.questions.forEach(item => {
          if (item.questionType === 1) {
            item.options.sort(this.compare('radioboxSort'))
            item.options.forEach((items, i) => {
              if (items.radioboxFlag) {
                item.checked = i
              }
            })
          } else if (item.questionType === 2) {
            item.options.sort(this.compare('checkboxSort'))
            item.options.forEach(items => {
              if (items.checkboxFlag) {
                items.checked = true
              }
            })
          } else if (item.questionType === 3) {
            if (item.options[0].commonAnswer.length) {
              item.answer = item.options[0].commonAnswer[0].aswer
            }
          }
        })
        let i = 1
        this.templatePre.questions.forEach(item => {
          if (item.questionType !== 4) {
            item.sorts = i++
          }
        })
      } else if (res.data.code === -2) {
        error(this)
      } else {
        notice(this, res.data.message, 2000)
      }
    })
  },
  methods: {
    // 比较器
    compare (propertyName) {
      return (obj1, obj2) => {
        let val1 = obj1[propertyName]
        let val2 = obj2[propertyName]
        if (val2 < val1) {
          return 1
        } else if (val2 > val1) {
          return -1
        } else {
          return 0
        }
      }
    }
  }
}
</script>

<style lang="scss">

</style>

