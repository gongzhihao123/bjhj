<template>
  <div class="enter_situation">
    <p class="top">
      <span class="to-list" @click="route('/exam')">返回考试列表</span>
      {{ detail.name }}>
      <!-- <span>{{ (type == 1 || type == 2) ? '学生信息 >' : '' }}</span> -->
      
      <span>{{ (type == 3 || type == 4 || type == 5) ? '录入情况' : (type == 2 || type == 1 || type == 6)  ? '录入情况' : '试卷录入' }}</span>

      <el-button v-if="type == 5 && menu.buttons && menu.buttons.scoreBatchSchoolCommit == 1" type="primary" @click="submit">提交</el-button>
    </p>

    <ul class="first">
      <li v-for="(item, i) in firstList" :key="i">
        <p>{{ item.name }}</p>
        <p>{{ item.num }}</p>
      </li>
    </ul>

    <ul class="switch">
      <li v-for="(item, i) in switchMenu"
          :key="i"
          :class="{active: ind == i}"
          @click="switchSub(item, i)"
          >{{ item.name }}</li>

      <!-- <div> -->
        <el-button type="primary" class="submit" v-if="type == 2 && menu.buttons && menu.buttons.studentSchoolCommit == 1" @click="submits">提交</el-button>
      <!-- </div> -->
    </ul>

    <table class="data">
      <tr>
        <th v-for="(item, i) in tableHead" :key="i">{{ item }}</th>
      </tr>

      <tr v-if="type == 1 || type == 2" v-for="(item, i) in tableList" :key="i">
        <td>{{ item.name }}</td>
        <td>{{ item.studentEnterFlag == 1 ? '已提交' : '未提交' }}</td>
        <td>{{ item.studentNum }}</td>
      </tr>

      <tr v-if="type == 3" v-for="(item, i) in tableList" :key="i">
        <td>{{ item.courseName }}</td>
        <td>{{ item.enterFlag == 1 ? '已提交' : '未提交' }}</td>
      </tr>

      <!-- 统一录入 -->
      <tr v-if="type > 5" v-for="(item, i) in tableList" :key="i" @click="classClick(item)" :class="{clicks: item.enterRight == 1}">
        <td>{{ item.courseName }}</td>
        <td>{{ item.enterFlag == 1 ? '已提交' : '未提交' }}</td>
        <td>{{ item.commitUname ? item.commitUname : '--' }}</td>
        <td>{{ item.commitTime | dateFormat('yyyy-MM-dd hh:mm') || '--' }}</td>
      </tr>

      <!-- 成绩录入 区级 -->
      <tr v-if="type == 4" v-for="(item, i) in tableList" :key="i" class="clicks" @click="quTosch(item)">
        <td>{{ item.name }}</td>
        <td>{{ item.enterFlag == 1 ? '已提交' : '未提交' }}</td>
      </tr>

      <!-- 成绩录入 校级 -->
      <tr v-if="type == 5" v-for="(item, i) in tableList" :key="i" @click="classClick(item)" :class="{clicks: item.enterFlag == 1}">
        <td>{{ item.className }}</td>
        <td>{{ item.totalNum }}</td>
        <td>{{ item.lackNum || 0 }}</td>
        <td>{{ item.updateTime | dateFormat('yyyy-MM-dd hh:mm') || '--' }}</td>
      </tr>

      <tr>
        <td :colspan="tableHead.length" v-if="tableList.length < 1">暂无数据</td>
      </tr>
    </table>

    <el-pagination
      v-if="(type == 1 || type == 4) && (totalCount > 0)"
      layout="prev, pager, next"
      :current-page="pageNo"
      @current-change="changePage"
      :total="totalCount">
    </el-pagination>

  </div>
</template>

<script>
import { notice, success } from '../api'
import querystring from 'querystring'
export default {
  name: 'enter_situation',
  data () {
    return {
      detail: {
        name: ''
      },
      ind: 0,
      pageNo: 1
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu
    },
    user () {
      return this.$store.state.user
    }
  },
  props: [
    'type', // 1: 区级学生录入情况； 2 校级学生录入情况； 3 试卷录入情况；4 区级成绩录入； 5 校级成绩录入
    'firstList',
    'switchMenu',
    'tableHead',
    'tableList',
    'totalCount'
  ],
  methods: {
    switchSub (item, i) {
      if (this.ind === i) return
      this.ind = i
      this.pageNo = 1
      this.$emit('switchType', item.id, 1)
    },
    route (path) {
      this.$router.push(path)
    },
    changePage (val) {
      this.pageNo = val
      this.$emit('changePage', val)
    },
    quTosch (item) {
      this.ind = 0
      this.$emit('changeTo', item.schoolId)
    },
    classClick (item) {
      if (this.type > 5) {
        if (Number(item.enterRight) !== 1) return
        this.$router.push({path: '/exam/bigScore', query: {courseId: item.courseId, classId: '', courseName: item.courseName, type: this.type}})
        return
      }
      if (Number(item.enterFlag) === 2) {
        notice('对不起，您没有该班级的录入权限')
        return
      } else {
        this.$router.push({path: '/exam/bigScore', query: {courseId: this.switchMenu[this.ind].courseId, classId: item.classId, courseName: this.switchMenu[this.ind].name}})
      }
    },
    submit () {
      this.$https.post(`/examScoreEnter/stateSchoolCommit`, querystring.stringify({
        examId: sessionStorage.PARAMS_EXAMID
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
        } else notice(this, res.data.message, 2000)
      })
    },
    submits () {
      this.$https.post('/examStudentEnter/studentCommit', querystring.stringify({
        examId: sessionStorage.PARAMS_EXAMID,
        schoolId: this.user.companyId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
        } else notice(this, res.data.message, 2000)
      })
    }
  },
  created () {
    this.detail.name = JSON.parse(sessionStorage.EXAMINFO || '{"name": ""}').name
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variable.scss';
.enter_situation {

  .top {
    .el-button {
      margin-top: 20px;
      float: right;
    }
  }

  .first {
    display: flex;
    border: 1px solid $border-color;

    > li {
      width: 120px;
      line-height: 30px;
      color: $theme;
      text-align: center;
      border-right: 1px solid $border-color;
    }
  }

  .switch {
    // display: flex;
    width: 100%;
    margin-top: 20px;
    line-height: 30px;
    min-height: 42px;

    li {
      display: inline-block;
      background: #D7D7D7;
      padding: 6px 20px;
      &.active {
        background: $theme;
        color: $white;

        &.active:hover {
          color: $white;
        }
      }
    }

    > li:hover {
      color: $theme;
      cursor: pointer;
    }
    .submit {
      float: right;
    }
  }

  .data {
    margin-top: 20px;
    width: 100%;
    line-height: 40px;
    text-align: center;

    th {
      background: #eef2f5;
      text-align: center;
    }

    th, td {
      border: 1px solid $border-color;
    }

    .clicks td {
      cursor: pointer;
    }
  }

  .el-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
