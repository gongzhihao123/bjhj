<template>
  <div id="assessment-state">
    <header class="headers">
      <span>测评人状态</span>
      <div>
        <el-button size="large" @click="close">关闭</el-button>
      </div>
    </header>
    <headerinfo :teacher='title' complet='rgb(125, 206, 252)' failure='rgb(232, 238, 243)' :state='teach' ></headerinfo>
    <el-row class="border-b">
        <el-col :span="2"><div class="situationtitle"><span>整体情况</span><span style="font-size:10px;margin-left:5px;">/</span></div></el-col>
        <el-col :span="22">
            <div class="progress">
                <header>总人数 : <span>{{ morepeople }}</span>已完成<span>{{ complete }}</span>未完成<span>{{ unfinished }}</span></header>
                <div>
                    <div :style="{width:1140*(complete/morepeople) + 'px'}" style="backgroundColor:rgb(125, 206, 252)"></div>
                </div>
            </div>
        </el-col>
    </el-row>
    <headerinfo teacher='教师测评完成情况' complet='rgb(255, 153, 153)' failure='rgb(232, 238, 243)' v-show="teacher.length" :state='teach' ></headerinfo>
    <el-row class="border-b">
        <el-col v-for="(value, index) in teacher" key="index" :span="12" class="allHeight">
            <el-col :span="5">
                <span class="title">{{ value.title }}</span><span style="font-size:10px;margin-left:5px;">/</span>
            </el-col>
            <el-col :span="17">
                <div class="progres">
                    <div :style="{width:440*(value.complete/value.totalof) + 'px'}" style="backgroundColor:rgb(255, 153, 153)"></div>
                </div>
            </el-col>
            <el-col :span="2" class="proportion">
                <span style="color:rgb(255, 153, 153);">{{ value.complete }}</span>/<span>{{ value.totalof }}</span>
            </el-col>
        </el-col>
        <el-col :span="12"></el-col>
    </el-row>
    <headerinfo teacher='学生测评完成情况' complet='rgb(123, 206, 252)' failure='rgb(232, 238, 243)' v-show="child.length" :state='teach' ></headerinfo>
    <el-row class="border-b">
        <el-col v-for="(value, index) in child" key="index" :span="12" class="allHeight">
            <el-col :span="5">
                <span class="title">{{ value.title }}</span><span style="font-size:10px;margin-left:5px;">/</span>
            </el-col>
            <el-col :span="17">
                <div class="progres">
                    <div :style="{width:440*(value.complete/value.totalof) + 'px'}" style="backgroundColor:rgb(123, 206, 252)"></div>
                </div>
            </el-col>
            <el-col :span="2" class="proportion">
                <span style="color:rgb(255, 153, 153);">{{ value.complete }}</span>/<span>{{ value.totalof }}</span>
            </el-col>
        </el-col>
        <el-col :span="12"></el-col>
    </el-row>
    <headerinfo teacher='家长测评完成情况' complet='rgb(154, 223, 115)' failure='rgb(232, 238, 243)' v-show="parent.length" :state='teach'></headerinfo>
    <el-row class="border-b">
        <el-col v-for="(value, index) in parent" key="index" :span="12" class="allHeight">
            <el-col :span="5">
                <span class="title">{{ value.title }}</span><span style="font-size:10px;margin-left:5px;">/</span>
            </el-col>
            <el-col :span="17">
                <div class="progres">
                    <div :style="{width:440*(value.complete/value.totalof) + 'px'}" style="backgroundColor:rgb(154, 223, 115)"></div>
                </div>
            </el-col>
            <el-col :span="2" class="proportion">
                <span style="color:rgb(154, 223, 115);">{{ value.complete }}</span>/<span>{{ value.totalof }}</span>
            </el-col>
        </el-col>
        <el-col :span="12"></el-col>
    </el-row>
  </div>
</template>
<script>
import headerinfo from './../../../components/HeaderInfo'
import { notice, error } from '../../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'assessmentState',
  data () {
    return {
      morepeople: 0,
      complete: 0,
      unfinished: 0,
      teach: [],
      teacher: [],
      child: [],
      parent: [],
      peopleCount: {
        total: 0,
        complete: '',
        unComplete: ''
      },
      title: '',
      evalId: '',
      state: '',
      keyword: '',
      pageNo: 1,
      pageSize: 20,
      stateActive: 0,
      totalCount: 0,
      stateList: [
        {name: '全部'},
        {name: '已完成'},
        {name: '未完成'}
      ],
      list: []
    }
  },
  components: {
    headerinfo
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
        } else if (res.data.code === -2) {
          error(this)
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
  async mounted () {
    this.evalId = JSON.parse(this.$route.query.id)
    if (this.people.id) {
      sessionStorage.title = this.people.name
    }
    await this.$https.get(`/eval/getEvalStateList?evalId=${this.evalId}&state=${''}&keyword=${''}&pageNo=${1}&pageSize=${2000}`)
    .then(res => {
      if (res.data.code === 1) {
        this.teach = res.data.result.evaluators
      } else if (res.data.code === -2) {
      } else {
        notice(this, res.data.message, 2000)
      }
    })
    this.title = sessionStorage.title
    this.morepeople = this.teach.length
    var teacher = []
    var parent = []
    var child = []
    this.teach.forEach((item, element) => {
      if (item.childId && !item.deptName) {
        parent.push(item.gradeName + item.className)
      } else if (!item.childId && !item.deptName) {
        child.push(item.gradeName + item.className)
      } else if (item.deptName) {
        teacher.push(item.deptName)
      }
      if (item.state) {
        this.complete++
      } else {
        this.unfinished++
      }
    })
    teacher = Array.from(new Set(teacher))
    parent = Array.from(new Set(parent))
    child = Array.from(new Set(child))
    for (var i = 0; i < teacher.length; i++) {
      this.teacher.push({title: teacher[i], totalof: 0, complete: 0, unfinished: 0})
    }
    for (var j = 0; j < parent.length; j++) {
      this.parent.push({title: parent[j], totalof: 0, complete: 0, unfinished: 0})
    }
    for (var z = 0; z < child.length; z++) {
      this.child.push({title: child[z], totalof: 0, complete: 0, unfinished: 0})
    }
    for (var s = 0; s < this.child.length; s++) {
      this.teach.forEach((item, element) => {
        if ((item.gradeName + item.className) === this.child[s].title && !item.childId && !item.deptName) {
          this.child[s].totalof++
          if (item.state) {
            this.child[s].complete++
          } else {
            this.child[s].unfinished++
          }
        }
      })
    }
    for (var a = 0; a < this.parent.length; a++) {
      this.teach.forEach((item, element) => {
        if ((item.gradeName + item.className) === this.parent[a].title && item.childId && !item.deptName) {
          this.parent[a].totalof++
          if (item.state) {
            this.parent[a].complete++
          } else {
            this.parent[a].unfinished++
          }
        }
      })
    }
    for (var r = 0; r < this.teacher.length; r++) {
      this.teach.forEach((item, element) => {
        if (item.deptName === this.teacher[r].title && item.deptName) {
          this.teacher[r].totalof++
          if (item.state) {
            this.teacher[r].complete++
          } else {
            this.teacher[r].unfinished++
          }
        }
      })
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

  > .headers {
    padding: $width / 2;
    height: 62px;
    box-sizing: border-box;
    border-bottom: 2px solid #DDDDDD;

    & > span {
      display: inline-block;
      width: 116px;
      height: 41px;
      font-size: 16px;
      line-height: 42px;
      text-align: center;

      &:first-child {
        color: #fff;
        background: url(../../../assets/images/left-tab-blue.png);
      }
    }

    div{
      float: right;
    }
  }
  > .teacher {
      height: 60px;
      background-color: #ffffff;
  }
  .situationtitle {
      width:100%;
      height: 84px;
      line-height: 84px;
      padding-left:20px;
      color: $darkgrey;
  }
  .border-b {
    border-bottom:11px solid #ECECEC;
  }
  .progress {
      width:97%;
      padding: 20px;
      header {
          color: rgb(181,181,181);
          margin-bottom: 9px;
          span {
              margin-left: 5px;
              margin-right: 15px;
          }
          span:nth-child(1),span:nth-child(3) {
              color: $blackgray;
          }
          span:nth-child(2) {
              color: $lightBlue;
          }
      }

     > div {
         width: 1140px;
         height: 15px;
         background:rgb(232, 238, 243);
         
         > div {
             width: 0;
             height: 100%;
             background: rgb(125, 206, 252);
         }
     }
  }
  .allHeight {
    height: 40px;
  }
   .title {
      width:100%;
      height: 40px;
      line-height: 40px;
      padding-left:20px;
      color: $darkgrey;
  }
  .progres {
    width: 440px;
    height: 15px;
    background:rgb(232, 238, 243);
    margin: 13px;
    div {
      height: 15px;
    }
  }
  .proportion {
    height: 40px;
    line-height: 40px;

    span {
      padding: 3px;
    }
  }
}
</style>