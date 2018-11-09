<template>
  <div id="look-result">
    <header>
      <span>查看结果</span>
      <el-input v-if="evalType === '3'" v-model="keyword" @keyup.enter.native="search" :on-icon-click="search" placeholder="输入关键字查询" icon="search"></el-input>
      <div class="button-group">
        <el-button size="large" @click="daochu">导出</el-button>
        <el-button size="large" @click="close">关闭</el-button>
      </div>
    </header>

    <main v-if="evalType === '1' || evalType === '2'">
      <div class="main-header">
        <p>题目：{{ title }}</p>
      </div>

      <!-- 筛选 -->
      <el-row class="screening">
        <el-col :span="15">
          <el-row class="grade">
            <el-col :span="2">
              <i>年级：</i>
            </el-col>
            <el-col :span="22">
              <span v-for="(item, index) in gradeList" :key="index" @click="gradeSelected(item, index)" :class="{active: gradeActive === index}">{{ item.gradeName }}</span>
            </el-col>
            
          </el-row>
          <el-row class="subject" v-if="subjectList.length !== 1">
            <el-col :span="2">
              <i>学科：</i>
            </el-col>
            <el-col :span="22">
              <span v-for="(item, index) in subjectList" :key="index" @click="subjectSelected(item, index)" :class="{active: subjectActive === index}">{{ item.subjectName }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="9">
          <el-input v-model="keyword" @keyup.enter.native="search" :on-icon-click="search" placeholder="请输入内容" icon="search"></el-input>
        </el-col>
      </el-row>

      <el-row class="list-title">
        <el-col :span="2">
          序号
        </el-col>
        <el-col :span="3">
          年级
        </el-col>
        <el-col :span="3">
          <span v-if="evalType === 1">学科</span>
        </el-col>
        <el-col :span="3">
          被测评人
        </el-col>
        <el-col :span="3">
          提交测评人数
        </el-col>
        <el-col :span="3">
          平均分
        </el-col>
        <el-col :span="2">
          名次
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>

      <!-- 列表主体 -->
      <div class="list">
        <el-row v-for="(item, index) in list" :key="index">
          <el-col :span="2">
            {{ index + 1 }}
          </el-col>
          <el-col :span="3">
            {{ item.gradeName }}
          </el-col>
          <el-col :span="3">
            <span v-if="evalType === 1"> {{ item.subjectName }} </span>
          </el-col>
          <el-col :span="3" :class="{realState: realState === '1'}" @click.native="toAssessmentDetails(item)">
            {{ item.userName }}
          </el-col>
          <el-col :span="3">
            {{ item.number }}
          </el-col>
          <el-col :span="3" @click.native="lookSujective(item)">
            <span v-if="item.totalScore === 0">--</span>
            <span v-else>{{ item.totalScore }}</span>
          </el-col>
          <el-col :span="2">
            {{ item.rank }}
          </el-col>
        </el-row>

        <!-- 题目内容 -->
        <transition name="slide-left" mode="out-in">
          <div class="content" v-if="contentBoxShow">
          <span @click="contentBoxShow = false">x</span>
          <p><span>被测评人：</span>{{ name }}</p>
          <el-row class="content-list-header">
            <el-col :span="12">题目</el-col>
            <el-col :span="12">分数</el-col>
          </el-row>
          <el-row class="content-list-body" v-for="(item, index) in contentList" :key="index">
            <el-col :span="12">{{ item.number }}</el-col>
            <el-col :span="12">
              <span v-if="item.score === 0">--</span>
              <span v-else>{{ item.score }}</span>
            </el-col>
          </el-row>
          <el-row class="content-list-footer">
            <el-col :span="12">主观题</el-col>
            <el-col :span="12">
              <a @click="evaluationContent">评价内容></a>
            </el-col>
          </el-row>
        </div>
        </transition>
      </div>
      
    </main>

    <!-- 其他测评 -->
    <div class="other-main" v-if="evalType === '3'">
      <div class="list-title" :style="{width: (assessmentWayList.length + 6) * 160 + 800 + 'px'}">
        <span>
          序号
        </span>
        <span>
          被测评人
        </span>
        <span>
          部门/分组
        </span>
        <span>
          总分
        </span>
        <span>
          名次
        </span>
        <span v-for="(item, index) in assessmentWayList" :key="index">
          <el-popover
            placement="top"
            width="200"
            v-if="item.modeName.length > 4" 
            trigger="hover"
            :content="item.modeName">
            <i slot="reference" style="font-style: normal;">
              {{item.modeName.slice(0, 4) + '...'}}
            </i>
          </el-popover>
          <i style="font-style: normal;" v-if="item.modeName.length <= 4">
            {{item.modeName}}
          </i>
        </span>
        <span>
          主观题
        </span>
      </div>

      <div class="list" :style="{width: (assessmentWayList.length + 6) * 160 + 800 + 'px'}">
        <div v-for="(item, index) in list" :key="index">
          <span>
            {{index + 1}}
          </span>
          <span  @click="toAssessmentDetails(item)" :class="{realState: realState === '1'}">
            {{item.userName}}
          </span>
          <span>
            {{item.deptName}}
          </span>
          <span>
            <span v-if="item.totalScore">{{item.totalScore}}</span>
            <span v-else>--</span>
          </span>
          <span :span="3">
            {{item.rank}}
          </span>
          <span v-for="(child, i) in assessmentWayList" :key="i">
            <span>{{item.modes.filter(sco => sco.modeId === child.id)[0] ? item.modes.filter(sco => sco.modeId === child.id)[0].score : '--'}}</span>
          </span>
          <span>
            <a @click="otherDetails(item)">详细</a>
          </span>
        </div>
      </div>
    </div>
    
    <!--分页-->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>

    <el-dialog
      title="选择导出内容"
      v-model="dialogVisible"
      size="tiny">
      <el-row>
        <el-col :span="6" v-for="(item, index) in exportList" :key="index">
          <el-checkbox v-model="item.show" @change="change(item)">{{ item.name }}</el-checkbox>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportCancel">取 消</el-button>
        <el-button type="primary" @click="exportConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import querystring from 'querystring'
import { mapGetters } from 'vuex'
import { notice, error } from '../../../api/index'
export default {
  name: 'lookResult',
  data () {
    return {
      evalId: '',
      contentBoxShow: false,
      dialogVisible: false,
      gradeActive: 0,
      subjectActive: 0,
      gradeList: [],
      subjectList: [],
      excelTypes: '',
      evalType: '',
      list: [],
      contentList: [
        {title: 1, score: 9},
        {title: 1, score: 19},
        {title: 1, score: 29},
        {title: 1, score: 39},
        {title: 1, score: 49}
      ],
      exportList: [
        {id: 1, name: '总表', show: false},
        {id: 2, name: '按学科导出', show: false},
        {id: 3, name: '按年级导出', show: false},
        {id: 4, name: '按班级导出', show: false}
      ],
      gradeId: '',
      subjectId: '',
      keyword: '',
      title: '',
      realState: '',
      userValue: '',
      gradeValue: '',
      name: '',
      assessmentWayList: [],
      objectiveList: [],
      totalCount: 0,
      pageSize: 20,
      pageNo: 1
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.pageNo = val
      if (this.evalType === '1' || this.evalType === '2') {
        this.getTeacherReasultList()
      } else if (this.evalType === '3') {
        this.getOtherResultList()
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      if (this.evalType === '1' || this.evalType === '2') {
        this.getTeacherReasultList()
      } else if (this.evalType === '3') {
        this.getOtherResultList()
      }
    },
    lookSujective (item) {
      this.userValue = item.userId
      this.gradeValue = item.gradeId
      // this.contentBoxShow = true
      this.contentList = item.questions
      this.contentList.forEach((child, index) => {
        this.objectiveList.forEach((n) => {
          if (child.questionId === n.id) {
            child.number = n.number
            child.title = n.title
          }
        })
      })
      this.name = item.userName
      sessionStorage.item = JSON.stringify(item)
      sessionStorage.contentList = JSON.stringify(this.contentList)
      window.open(`#/assessmentManager/lookQuestion`)
    },
    // 导出
    daochu () {
      if (this.evalType === '1' || this.evalType === '2') {
        this.dialogVisible = true
        if (this.evalType === '2') {
          this.exportList = [
            {id: 1, name: '总表', show: false},
            {id: 3, name: '按年级导出', show: false}
          ]
        } else {
          this.exportList = [
            {id: 1, name: '总表', show: false},
            {id: 2, name: '按学科导出', show: false},
            {id: 3, name: '按年级导出', show: false},
            {id: 4, name: '按班级导出', show: false}
          ]
        }
      } else if (this.evalType === '3') {
        var path = document.querySelector('#contextPath').value
        window.location.href = `${path}/eval/excelOther?evalId=${this.evalId}&keyword=${this.keyword}`
      }
    },
    // 其他测评详细
    otherDetails (item) {
      let parameter = {}
      parameter = {
        evalId: this.evalId,
        userId: item.userId,
        evalType: this.evalType,
        name: item.userName
      }
      sessionStorage.subjectiveParameter = JSON.stringify(parameter)
      window.open(`#/assessmentManager/subjectActive`)
    },
    change (item) {
      let list = []
      this.exportList.forEach((item) => {
        if (item.show === true) {
          list.push(item.id)
        }
      })
      this.excelTypes = list.join(',')
    },
    // 导出取消
    exportCancel () {
      this.dialogVisible = false
    },
    // 导出确定
    exportConfirm () {
      if (this.excelTypes) {
        var path = document.querySelector('#contextPath').value
        window.location.href = `${path}/eval/excelTeacher?evalId=${this.evalId}&excelTypes=${this.excelTypes}`
        this.dialogVisible = false
      } else {
        notice(this, '请选择要出导出的方式', 2000)
      }
    },
    search () {
      if (this.evalType === '1' || this.evalType === '2') {
        this.getTeacherReasultList()
      } else if (this.evalType === '3') {
        this.getOtherResultList()
      }
    },
    // 跳转到测评详情
    toAssessmentDetails (item) {
      if (this.realState === '1') {
        let parameter = {}
        if (this.evalType === '3') {
          parameter = {
            evalId: this.evalId,
            userId: item.userId,
            evalType: this.evalType
          }
          this.$router.push({path: '/assessmentManager/assessmentDetails', query: {parameter: JSON.stringify(parameter)}})
        } else {
          let subjectId = item.subjectId
          if (!item.subjectId) {
            subjectId = ''
          }
          parameter = {
            evalId: this.evalId,
            userId: item.userId,
            gradeId: item.gradeId,
            subjectId: subjectId,
            evalType: this.evalType
          }
          this.$router.push({path: '/assessmentManager/assessmentDetails', query: {parameter: JSON.stringify(parameter)}})
        }
      }
    },
    // 评价内容
    evaluationContent () {
      // this.$store.dispatch('active')
      let parameter = {}
      parameter = {
        evalId: this.evalId,
        userId: this.userValue,
        gradeId: this.gradeValue,
        subjectId: this.subjectId,
        evalType: this.evalType,
        name: this.name
      }
      sessionStorage.subjectiveParameter = JSON.stringify(parameter)
      window.open('#/assessmentManager/subjectActive')
    },
    // 关闭
    close () {
      this.$router.push('/assessmentManager/index')
    },
    gradeSelected (item, index) {
      this.gradeActive = index
      this.gradeId = item.gradeId
      this.getTeacherReasultList()
    },
    subjectSelected (item, index) {
      this.subjectActive = index
      this.subjectId = item.subjectId
      this.getTeacherReasultList()
    },
    // 任课教师、班主任-查询测评结果列表
    getTeacherReasultList () {
      this.$https.get(`/eval/getTeacherResultList?evalId=${this.evalId}&gradeId=${this.gradeId}&subjectId=${this.subjectId}&keyword=${this.keyword}&pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result.users.list
          this.totalCount = res.data.result.users.totalCount
          this.objectiveList = res.data.result.questions
          this.contentBoxShow = false
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取任课老师、班主任参数设置信息
    getTeacherParam () {
      this.$https.get(`/eval/getTeacherParam?evalId=${this.evalId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.gradeList = res.data.result.grades
          this.gradeList.unshift({gradeId: '', gradeName: '全部'})
          this.subjectList = res.data.result.subjects
          this.subjectList.unshift({subjectId: '', subjectName: '全部'})
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 其他测评-查询测评结果列表
    getOtherResultList () {
      this.$https.get(`/eval/getOtherResultList?evalId=${this.evalId}&keyword=${this.keyword}&pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result.users.list
          this.totalCount = res.data.result.users.totalCount
          this.list.forEach((item) => {
            item.list = [...res.data.result.modes]
            item.list.forEach((child, i) => {
              item.modes.forEach((n, index) => {
                if (child.modeName === n.modeName) {
                  item.list[i] = n
                }
              })
            })
          })
          this.assessmentWayList = res.data.result.modes
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
  created () {
    if (this.people.id) {
      sessionStorage.title = this.people.name
      sessionStorage.evalId = this.people.id
      sessionStorage.evalType = this.people.evalType
      sessionStorage.realState = this.people.realState
    }
    this.title = sessionStorage.title
    this.evalType = sessionStorage.evalType
    this.evalId = sessionStorage.evalId
    this.realState = sessionStorage.realState
    if (this.evalType === '1' || this.evalType === '2') {
      this.getTeacherParam()
      this.getTeacherReasultList()
    } else if (this.evalType === '3') {
      this.getOtherResultList()
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#look-result{
  margin: $width;
  background: $white;
  border: 1px solid #ECECEC;
  border-radius: 4px;

  header{
    padding: $width / 2;
    height: 62px;
    box-sizing: border-box;
    border-bottom: 2px solid #DDDDDD;

    &>.el-input{
      width: 300px;
      margin-left: $width;
    }

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

    .button-group{
      float: right;
    }
  }

  // 主体
  main{
    padding: $width*1.5 $width;
    // min-height: 600px;

    .main-header{
      font-size: 17px;
    }

    .screening{
      margin-top: $width*1.5;

      &>.el-col:first-child{
        border: 1px solid #ddd;
        padding: $width/1.2;
        padding-bottom: 0;

        .grade,.subject{
          i{
            font-style: normal;
            color: #989898;
            font-size: 15px;
          }

          span{
            font-size: 15px;
            display: inline-block;
            margin:0 $width 10px;
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
          border-bottom: 1px dashed #ddd; 
        }

        .subject{
          margin-top: $width/1.5;
        }
      }

      &>.el-col:last-child{
        text-align: right;

        .el-input{
          margin-top: $width*5;
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

        .el-col:nth-child(6){
          color: #39A9FE;
          cursor: pointer;
        }

        .realState{
          cursor: pointer;
          color: #35BFFF;
        }
      }

      .content{
        box-sizing: border-box;
        margin-bottom: $width;
        position: absolute;
        z-index: 101;
        width: 340px;
        right: 0px;
        top: -$width * 3;
        box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
        border: 1px solid #E2E2E2;
        padding: $width/2 $width;

        &>span{
          float: right;
          font-size: 26px;
          color: #B2B2B2;
          cursor: pointer;
        }

        &>p{
          margin-top: $width*1.5;
          font-size: 15px;
          span{
            color: #999999;
          }
        }

        .content-list-header{
          margin-top: $width;
        }

        .content-list-body:hover{
          background: #F7F7F7;
        }

        .content-list-footer{
          .el-col:last-child{
            a{
              color: #39A9FE;
              text-decoration: none;
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .other-main{
    padding-bottom: $width*2;
    width: 100%;
    overflow-x: scroll;

    // 列表头部
    .list-title{
      // width: 130%;
      margin-top: $width;
      border-bottom: 1px solid #E6E6E6;
      padding: $width/2 0;
      font-size: 15px;

      &>span{
        display: inline-block;
        width: 80px;
        margin-left: $width*2;
        margin-right: $width*2;
      }
    }

    // 列表主体
    .list{
      // width: 130%;
      position: relative;

      div{
        line-height: 48px;
        border-bottom: 1px solid #E6E6E6;
        font-size: 15px;
        // text-align: center;

        &>span{
          display: inline-block;
          width: 80px;
          margin-left: $width*2;
          margin-right: $width*2;
        }
        &:hover{
          background: #F7F7F7;
        }

        &>span:last-child{
          a{
            color: #39A9FE;
            text-decoration: none;
            cursor: pointer;
          }
        }

        .realState{
          cursor: pointer;
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

  // 导出弹出框
  .el-dialog{
    width: 620px;

    .el-dialog__header{
      padding: $width;

      span{
        font-weight: normal;
      }
    }
    
    .el-dialog__body{
      padding: $width*4 $width*3;
      text-align: center;
    }
  }
}
</style>
