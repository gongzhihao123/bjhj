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
        <p>题目：{{title}}
          <span>测评人数：</span><i>{{peopleCount.total}}</i>
          <span>已完成：</span><i class="green">{{peopleCount.complete}}</i>
          <span>未完成：</span><i class="red">{{peopleCount.unComplete}}</i>
        </p>
      </div>

      <!-- 筛选 -->
      <el-row class="screening">
        <el-col :span="12">
          <div class="state">
            <i>测评状态：</i>
            <span v-for="(item, index) in stateList" :key="index" @click="stateSelected(item, index)" :class="{active: stateActive === index}">{{item.name}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="keyword" @keyup.enter.native="search" :on-icon-click="search" placeholder="按照测评人姓名或单位查询" icon="search"></el-input>
        </el-col>
      </el-row>

      <el-row class="list-title">
        <el-col :span="4">
          序号
        </el-col>
        <el-col :span="5">
          测评人
        </el-col>
        <el-col :span="5">
          单位
        </el-col>
        <el-col :span="5">
          部门/职务
        </el-col>
        <el-col :span="5">
          是否完成测评
        </el-col>
      </el-row>

      <!-- 列表主体 -->
      <div class="list">
        <el-row v-for="(item, index) in list" :key="index">
          <el-col :span="4">
            {{index + 1}}
          </el-col>
          <el-col :span="5">
            {{item.userName}}
          </el-col>
          <el-col :span="5">
            {{item.companyName}}
          </el-col>
          <el-col :span="5">
            <span v-if="item.deptName">
              {{item.deptName}}
            </span>
            <span v-else>
              {{item.gradeName + item.className}}
            </span>
          </el-col>
          <el-col :span="5">
            <img src="../../../assets/images/red-point.png" v-if="item.state === 0">
            <span v-if="item.state === 0">
              否
            </span>
            <img src="../../../assets/images/green-point.png" v-if="item.state === 1">
            <span v-if="item.state === 1">
              是
            </span>
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
import { notice } from '../../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'assessmentState',
  data () {
    return {
      peopleCount: {
        total: 0,
        complete: '',
        unComplete: ''
      },
      title: '',
      totalCount: 0,
      evalId: '',
      state: '',
      keyword: '',
      pageNo: 1,
      pageSize: 20,
      stateActive: 0,
      stateList: [
        {name: '全部'},
        {name: '已完成'},
        {name: '未完成'}
      ],
      list: [
      ]
    }
  },
  methods: {
    search () {
      this.getEvalStateList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getEvalStateList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getEvalStateList()
    },
    // 导出
    educe () {
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/eval/excelEvalState?evalId=${this.evalId}&state=${this.state}&keyword=${this.keyword}`
    },
    // 关闭
    close () {
      this.$router.push('/assessmentManager/index')
    },
    stateSelected (item, index) {
      this.stateActive = index
      if (index === 0) {
        this.state = ''
      } else if (index === 1) {
        this.state = 1
      } else if (index === 2) {
        this.state = 0
      }
      this.getEvalStateList()
    },
    // 获取测评人状态列表
    getEvalStateList () {
      this.$https.get(`/eval/getEvalStateList?evalId=${this.evalId}&state=${this.state}&keyword=${this.keyword}&pageNo=${this.pageNo}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result.evaluators
          this.totalCount = res.data.result.total
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取全部-已测评-为测评人数
    getNumber () {
      this.$https.get(`/eval/getEvalStateList?evalId=${this.evalId}&state=${''}&keyword=${''}&pageNo=${1}&pageSize=${2000}`)
      .then(res => {
        if (res.data.code === 1) {
          this.peopleCount = {
            total: res.data.result.total,
            complete: res.data.result.complete,
            unComplete: res.data.result.unComplete
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'people'
    ])
  },
  created () {
    this.evalId = JSON.parse(this.$route.query.id)
    if (this.people.id) {
      sessionStorage.title = this.people.name
    }
    this.title = sessionStorage.title
    this.getEvalStateList()
    this.getNumber()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#assessment-state{
  margin: $width;
  background: $white;
  border: 1px solid #ECECEC;
  border-radius: 4px;

  .green {
    color: #57DC92;
  }

  .red {
    color: #FF7E7E;
  }
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
            padding:2px;
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
