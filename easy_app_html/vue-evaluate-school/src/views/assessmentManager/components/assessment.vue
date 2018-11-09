<template>
  <div id="assessment-state">
    <header>
      <span>测评人状态</span>
      <div>
        <el-button size="large" @click="educe">导出</el-button>
        <el-button size="large" @click="close">关闭</el-button>
      </div>
    </header>

    <main>
      <div class="main-header">
        <p>{{title}}
          <span>测评人数：</span><i>{{ total }}</i>
          <span>已完成：</span><i>{{ complete }}</i>
          <span>未完成：</span><i>{{ unComplete }}</i>
        </p>
      </div>

      <!-- 筛选 -->
      <el-row class="screening">
        <el-col :span="12">
          <div class="state">
            <i>测评状态：</i>
            <span v-for="(item, index) in stateList" :key="index" @click="stateSelected(item, index)" :class="{active: stateActive === index}">{{ item.name }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="keyword" @keyup.enter.native="search" :on-icon-click="search" placeholder="按照测评人姓名或单位查询" icon="search"></el-input>
        </el-col>
      </el-row>

      <el-row class="list-title">
        <el-col :span="3">
          序号
        </el-col>
        <el-col :span="7">
          测评人
        </el-col>
        <el-col :span="7">
          部门/职务
        </el-col>
        <el-col :span="7">
          是否完成测评
        </el-col>
      </el-row>

      <!-- 列表主体 -->
      <div class="list" v-if="total">
        <el-row v-for="(item, index) in list" :key="index">
          <el-col :span="3">
            {{ index + 1 }}
          </el-col>
          <el-col :span="7">
            {{ item.userName ? item.userName : '----' }}
          </el-col>
          <el-col :span="7">
            <span v-if="item.deptName">
              {{ item.deptName }}
            </span>
            <span v-else>
              {{ item.gradeName + item.className }}
            </span>
          </el-col>
          <el-col :span="7">
            <span v-if="item.state === 0">
              <img src="../../../assets/images/red-point.png">
              否
            </span>
            <span v-if="item.state === 1">
              <img src="../../../assets/images/green-point.png">
              是
            </span>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-row >
          <el-col :span="3">
            暂无数据
          </el-col>
        </el-row>
      </div>
      
    </main>
    
    <!--分页-->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import { notice, error } from '../../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'assessmentState',
  data () {
    return {
      total: 0,
      complete: 0,
      unComplete: 0,
      title: '',
      keyword: '',
      allpeople: [],
      everypeople: [],
      pageNo: 1,
      pageSize: 10,
      stateActive: 0,
      totalCount: 0,
      num: '',
      state: '',
      evalId: '',
      stateList: [
        {name: '全部'},
        {name: '已完成'},
        {name: '未完成'}
      ],
      list: [],
      newList: [],
      quitList: [],
      morepeople: []
    }
  },
  watch: {
    keyword () {
      if (!this.keyword) {
        var arr = []
        this.morepeople.forEach(item => {
          if (item.state === this.state) {
            arr.push(item)
          }
          if (this.state === '') {
            arr.push(item)
          }
        })
        this.everypeople = arr
        this.cycle()
      }
    }
  },
  methods: {
    // 搜索
    search () {
      var arr = []
      this.morepeople.forEach((item) => {
        var str = item.gradeName + item.className
        if (item.userName.indexOf(this.keyword) !== -1 && this.keyword !== '') {
          if (this.state !== '') {
            if (item.state === this.state) {
              arr.push(item)
            }
          } else {
            arr.push(item)
          }
        }
        if (item.deptName) {
          if (item.deptName.indexOf(this.keyword) !== -1 && this.keyword !== '') {
            if (this.state !== '') {
              if (item.state === this.state) {
                arr.push(item)
              }
            } else {
              arr.push(item)
            }
          }
        }
        if (str) {
          if (str.indexOf(this.keyword) !== -1 && this.keyword !== '') {
            if (this.state !== '') {
              if (item.state === this.state) {
                arr.push(item)
              }
            } else {
              arr.push(item)
            }
          }
        }
      })
      if (this.keyword) {
        this.everypeople = arr
      }
      this.cycle()
    },
    // 状态判断
    stateSelected (item, index) {
      var arr = []
      this.keyword = ''
      this.stateActive = index
      if (item.name === '已完成') {
        this.state = 1
        this.morepeople.forEach(elem => {
          console.log(elem)
          if (elem.state === 1) {
            console.log(elem)
            arr.push(elem)
          }
        })
        this.everypeople = arr
        this.cycle()
      } else if (item.name === '未完成') {
        this.state = 0
        this.list = this.quitList
        this.morepeople.forEach(elem => {
          console.log(elem)
          if (elem.state === 0) {
            arr.push(elem)
          }
        })
        this.everypeople = arr
        this.cycle()
      } else if (item.name === '全部') {
        this.state = ''
        this.everypeople = this.morepeople
        this.cycle()
      }
    },
    // 分页 点击的分页按钮
    handleCurrentChange (val) {
      this.quitList = this.list = this.newList[val - 1]
    },
    // 形成的分也
    handleSizeChange (val) {
      this.newList = []
      this.pageSize = val
      this.num = Math.ceil(this.everypeople.length / this.pageSize)
      for (var i = 0; i < this.num; i++) {
        this.newList[i] = []
      }
      for (var z = 0; z < this.everypeople.length; z++) {
        this.newList[parseInt(z / this.pageSize)][z % this.pageSize] = this.allpeople[z]
      }
      this.quitList = this.list = this.newList[0]
    },
    // 导出
    educe () {
      var path = document.querySelector('#contextPath').value
      this.evalId = this.$route.query.id
      if (this.title === '整体测评') {
        window.location.href = `${path}/eval/excelEvalState?evalId=${this.evalId}&state=${this.state}&keyword=${this.keyword}&Type=`
        console.log(`${path}/eval/excelEvalState?evalId=${this.evalId}&state=${this.state}&keyword=${this.keyword}&Type=''`)
      } else if (this.title === '教师测评完成情况') {
        window.location.href = `${path}/eval/excelEvalState?evalId=${this.evalId}&state=${this.state}&keyword=${this.keyword}&Type=1`
      } else if (this.title === '学生测评完成情况') {
        window.location.href = `${path}/eval/excelEvalState?evalId=${this.evalId}&state=${this.state}&keyword=${this.keyword}&Type=2`
      } else if (this.title === '家长测评完成情况') {
        window.location.href = `${path}/eval/excelEvalState?evalId=${this.evalId}&state=${this.state}&keyword=${this.keyword}&Type=3`
      }
    },
    // 关闭
    close () {
      this.$router.go(-1)
    },
    // 初始化调用分页函数
    cycle () {
      this.totalCount = this.everypeople.length
      this.total = this.everypeople.length
      this.num = Math.ceil(this.everypeople.length / this.pageSize)
      for (var s = 0; s < this.num; s++) {
        this.newList[s] = []
      }
      for (var c = 0; c < this.everypeople.length; c++) {
        this.newList[parseInt(c / this.pageSize)][c % this.pageSize] = this.everypeople[c]
      }
      this.quitList = this.list = this.newList[0]
    }
  },
  computed: {
    ...mapGetters([
      'people'
    ])
  },
  // 初始化刚进入页面的时候
  created () {
    this.title = this.$store.state.active.stateTitle
    this.allpeople = this.$store.state.active.localData
    if (this.title === '整体测评') {
      this.totalCount = this.allpeople.length
      this.morepeople = this.everypeople = this.allpeople
      this.allpeople.forEach(element => {
        if (element.state === 1) {
          this.complete++
        } else if (element.state === 0) {
          this.unComplete++
        }
      })
      this.cycle()
    } else if (this.title === '教师测评完成情况') {
      this.allpeople.forEach(element => {
        if (element.deptName) {
          this.everypeople.push(element)
          this.morepeople.push(element)
          if (element.state === 1) {
            this.complete++
          } else if (element.state === 0) {
            this.unComplete++
          }
        }
      })
      this.cycle()
    } else if (this.title === '学生测评完成情况') {
      this.allpeople.forEach(element => {
        if (!element.deptName && !element.childId) {
          this.everypeople.push(element)
          this.morepeople.push(element)
          if (element.state === 1) {
            this.complete++
          } else if (element.state === 0) {
            this.unComplete++
          }
        }
      })
      this.cycle()
    } else if (this.title === '家长测评完成情况') {
      this.allpeople.forEach(element => {
        if (!element.deptName && element.childId) {
          this.everypeople.push(element)
          this.morepeople.push(element)
          if (element.state === 1) {
            this.complete++
          } else if (element.state === 0) {
            this.unComplete++
          }
        }
      })
      this.cycle()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/main.scss';
#assessment-state{
  margin: $width;
  background: $white;
  border: 1px solid #ECECEC;
  border-radius: 4px;

  header{
    padding: $width / 2;
    height: 62px;
    box-sizing: border-box;
    border-bottom: 2px solid #DDDDDD;

    &>span{
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
    }

    div{
      float: right;
    }
  }

  // 主体
  main{
    padding: $width*1.5 $width;

    .main-header{
      font-size: 17px;

      span{
        margin-left: $width * 2;
        font-size: 15px;
        color: #999999;
      }

      i{
        font-style: normal;
        font-size: 15px;
      }
    }

    .screening{
      margin-top: $width*1.5;

      .el-col:first-child{
        border: 1px solid #ddd;
        padding: $width/1.2;
        // width: 500px;

        .state{

          i{
            font-style: normal;
            color: #989898;
            font-size: 15px;
          }

          span{
            font-size: 15px;
            margin: 0 $width;
            padding: 2px;
            color: #343434;
            cursor: pointer;
            border-bottom: 2px solid transparent;
          }

          .active{
            color:#35BFFF;
            border-bottom: 2px solid #1EB8FF;
          }
        }

        .grade{
          padding-bottom: $width/1.1;
          border-bottom: 1px dashed #ddd; 
        }
        
        .subject{
          margin-top: $width/1.5;
        }
      }
      .el-col:last-child{
        text-align: right;

        .el-input{
          margin-top: $width;
          width: 290px;
        }
      }
    }
    // 列表头部
    .list-title{
      text-align: center;
      margin-top: $width;
      border-bottom: 1px solid #E6E6E6;
      padding: $width/2 0;
      font-size: 15px;
    }

    // 列表主体
    .list{
      position: relative;

      .el-row{
        line-height: 48px;
        border-bottom: 1px solid #E6E6E6;
        font-size: 15px;
        text-align: center;

        &:hover{
          background: #F7F7F7;
        }
      }
    }
  }

  // 分页
  .page {
    text-align: right;
    margin-top: $width;
    margin-bottom: $width;

    .el-pagination {
      margin-right: 20px;
    }
  }
}
</style>
