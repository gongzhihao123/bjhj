<template>
  <div class="lists">
    <el-select v-model="semester" placeholder="">
      <el-option
        v-for="(item, i) in semesterList"
        :key="i"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <div class="content">
      <h3 v-if="examList.length > 0">最新考试成绩</h3>
      <section v-for="(item, i) in examList" :key="i" v-if="i < 1" class="list">
        <p>{{ item.name }}</p>
        <table>
          <tr v-for="(sub, ind) in item.listSubjectScore" :key="ind">
            <td class="first">{{ sub.courseName }}</td>
            <td v-if="item.publishFlag == 1">
              <span>{{ sub.detailName }}</span>
            </td>
            <td v-else>
              {{ sub.comprehensiveScore }}
              <span class="gury">分</span>
            </td>
            <td v-if="item.publishFlag != 1">
              <span class="gury">满分：{{ sub.courseFullMarks }}</span>
            </td>
          </tr>
          <tr v-if="item.publishFlag != 1">
            <td class="zf">总分</td>
            <td>
              <span class="zf">{{ item.comprehensiveScore }}</span>
              <span class="gury">分</span>
            </td>
            <td>
              <span class="gury">满分：{{ item.total }}</span>
            </td>
          </tr>
        </table>
        <div v-if="item.publishFlag != 1 && item.rankFlag == 1">
          <span>班排名</span>
          <span>{{ item.classSort }}</span>
          <span>总人数：{{ item.classCount }}</span>
        </div>
        <div v-if="item.publishFlag != 1 && item.rankFlag == 1">
          <span>校排名</span>
          <span>{{ item.schoolSort }}</span>
          <span>总人数：{{ item.schoolCount }}</span>
        </div>
        <div v-if="item.publishFlag != 1 && item.rankFlag == 1">
          <span>区排名</span>
          <span>{{ item.areaSort }}</span>
          <span>总人数：{{ item.areaCount }}</span>
        </div>
      </section>

      <h3 v-if="examList.length > 1">历次考试成绩</h3>
      <section v-for="(item, i) in examList" :key="i" v-if="i > 0" class="list">
        <p @click.stop="more(item, i)" style="display: flex;justify-content: space-between;">{{ item.name }}
          <img style="height: 16px;margin-top: 0.35rem;" src="../assets/images/next.png" alt="" :class="{active: item.active}">
        </p>
        <table v-show="item.active">
          <tr v-for="(sub, ind) in item.listSubjectScore" :key="ind">
            <td class="first">{{ sub.courseName }}</td>
            <td v-if="item.publishFlag == 1">
              <span>{{ sub.detailName }}</span>
            </td>
            <td v-else>
              {{ sub.comprehensiveScore }}
              <span class="gury">分</span>
            </td>
            <td v-if="item.publishFlag != 1">
              <span class="gury">满分：{{ sub.courseFullMarks }}</span>
            </td>
          </tr>
          <tr v-if="item.publishFlag != 1">
            <td class="zf">总分</td>
            <td>
              <span class="zf">{{ item.comprehensiveScore }}</span>
              <span class="gury">分</span>
            </td>
            <td>
              <span class="gury">满分：{{ item.total }}</span>
            </td>
          </tr>
        </table>
        <div v-if="item.publishFlag != 1 && item.rankFlag == 1" v-show="item.active">
          <span>班排名</span>
          <span>{{ item.classSort }}</span>
          <span>总人数：{{ item.classCount }}</span>
        </div>
        <div v-if="item.publishFlag != 1 && item.rankFlag == 1" v-show="item.active">
          <span>校排名</span>
          <span>{{ item.schoolSort }}</span>
          <span>总人数：{{ item.schoolCount }}</span>
        </div>
        <div v-if="item.publishFlag != 1 && item.rankFlag == 1" v-show="item.active">
          <span>区排名</span>
          <span>{{ item.areaSort }}</span>
          <span>总人数：{{ item.areaCount }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lists',
  data () {
    return {
      semester: '',
      semesterList: [],
      examList: [],
      index: 0
    }
  },
  methods: {
    async getSemester () {
      await this.$store.dispatch('init')
      this.semesterList = await this.$store.dispatch('getSemester')
      if (this.semesterList.length > 0) {
        this.semester = this.semesterList.filter(item => item.state === 1)[0].id
      } else {
        this.semester = ''
      }
    },
    async getExam () {
      if (!this.semester) return
      this.examList = await this.$store.dispatch('getExam', {
        semesterId: this.semester
      })
      this.examList = this.examList.map(item => ({
        ...item,
        active: false
      }))
    },
    async getScore (examId = this.examList.length > 0 ? this.examList[0].id : '') {
      if (!examId) return
      let res = await this.$store.dispatch('getScore', {
        examId
      })
      if (!res || res.length < 1) return
      let total = 0
      let arr = (res.listSubjectScore || []).map(item => item.courseFullMarks)
      for (let i = 0; i < arr.length; i++) {
        total += arr[i]
      }
      this.$set(this.examList, this.index, { ...this.examList[this.index], ...res, active: false, total, has: true })
    },
    async changeSemester (val) {
      await this.getExam()
      this.index = 0
      this.getScore()
    },
    async more (item, i) {
      this.index = i
      if (!item.has) {
        await this.getScore(item.id)
      }
      // await this.getScore()
      this.$set(this.examList[i], 'active', !item.active)
    }
  },
  async created () {
    await this.getSemester()
  },
  watch: {
    semester (val) {
      this.changeSemester(val)
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/variable.scss';
  .lists {
    .el-select {
      width: 100%;

      .el-input__inner {
        text-align: center;
      }
    }
    .content {
      width: 100%;
      height: calc(100vh - 90px);
      overflow-y: auto;
      overflow-x: hidden;
      h3 {
        margin: 10px 0 10px 10px;
        font-size: 0.4rem;
        color: $main;
      }

      .list {
        margin-bottom: 20px;
        > p {
          padding: 0 10px;
          background: $main;
          line-height: 1rem;
          color: $white;

          img {
            vertical-align: middle;

            &.active {
              transform: rotate(90deg);
            }
          }
        }

        .gury {
          color: #999;
        }

        table {
          width: 100%;
          line-height: 0.8rem;
        }

        td {
          padding: 0 10px;
          min-width: 80px;

          &:first-of-type {
            padding-left: 30px;
            min-width: 40%;
          }

        }

        tr {
          border-bottom: 1px solid $border-color;
        }

        > div {
          padding-left: 20px;
          width: 100%;
          line-height: 0.8rem;

          > span {
            padding: 0 10px;
          }
        }
      }
      .zf {
        color: #1ABC9C;
      }
    }
  }
  .el-scrollbar {
    text-align: center;
  }
  ::-webkit-scrollbar {
    display: none;
  }
</style>
