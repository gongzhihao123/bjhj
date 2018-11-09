<template>
  <div id="lessonset">
    <div class="content-box">
      <div class="head">
        <span class="title">备课科目设置</span>
        <el-checkbox v-model="check" class="all" @change="checkedAll($event, setInfo)">全选</el-checkbox>
      </div>
      <div class="courseset">
      <div class="button-group">
          <el-button @click="timeSet" @mouseenter.native="borderOne = false" @mouseleave.native="borderOne = true">
            同步设置
            <img v-if="borderOne" src="../../../assets/images/border.png">
          </el-button>
          <el-button @click="saveSet" @mouseenter.native="borderTwo = false" @mouseleave.native="borderTwo = true">
            保存
            <img v-if="borderTwo" src="../../../assets/images/border.png">
          </el-button>
        </div>
        <ul v-loading="loading">
          <li v-for="(item, i) in setInfo" :key="item">
            <p>
              <span class="grade">{{item.setSectionName}}/
                <span>{{item.setGradeName}}</span>
              </span>
              <el-checkbox  v-model="item.checkAll"  v-if="item.courses.length !== 0" @change="handleCheckAllChange($event, item, i)" class="selectAll">全选</el-checkbox>
              <el-checkbox-group  v-model="item.checked"  @change="chooseCourses($event, item)">
              <el-checkbox v-for="subject in item.courses" :label="subject.curriculumName" :key="subject.id">{{subject.curriculumName}}</el-checkbox>
              </el-checkbox-group>
            </p>
          </li>
        </ul>
      </div>
     </div>
    <div class="line"></div>

    <div class="content-box">
      <div class="head">
        <span class="title">备课目录设置</span>
        <span class="status">状态</span>
        <span class="action">操作</span>
      </div>
      <ul class="set">
        <li>
          <span><i></i>按照课时设置</span>
          <!--<span class="nullInfo" v-if="seting.length === 0">暂无数据</span>-->
          <div class="estate" v-if="seting.courseSet === 1">已启用</div>
          <div class="button-group">
            <el-button v-if="seting.courseSet === 0" @click="takeuse" @mouseenter.native="borderThree = false" @mouseleave.native="borderThree = true">
              启用
              <img v-if="borderThree" src="../../../assets/images/border.png">
            </el-button>
            <!--<el-button  @click="open" v-if="seting.courseSet === 1">同步</el-button>-->
            <el-button @click="goLook" @mouseenter.native="borderFour = false" @mouseleave.native="borderFour = true">
              查看
              <img v-if="borderFour" src="../../../assets/images/green.png">
            </el-button>
          </div>
        </li>
        <li>
          <span><i></i>按照教材编目设置</span>
          <!--<span class="nullInfo" v-if="seting.length === 0">暂无数据</span>-->
          <div class="estates" v-if="seting.editionSet === 1">已启用</div>
          <div class="button-group">
            <el-button v-if="seting.editionSet === 0" @click="takeuse" @mouseenter.native="borderFive = false" @mouseleave.native="borderFive = true">
              启用
              <img v-if="borderFive" src="../../../assets/images/border.png">
              </el-button>
            <!--<el-button  @click="open" v-if="seting.editionSet === 1">同步</el-button>-->
            <el-button @click="goMeterical" @mouseenter.native="borderSix = false" @mouseleave.native="borderSix = true">
              设置/查看
              <img v-if="borderSix" src="../../../assets/images/green.png">
            </el-button>
          </div>
        </li>
      </ul>
    </div>

    <div class="line"></div>

    <div class="content-box">
      <div class="head">
        <span class="title">其他设置</span>
      </div>
      <div class="highscore">
        <span>优秀教案分数:</span>
        <ul class="scorenum">
          <li v-for="(num, index) in nums" :key="index" :class="{ 'active': activeInd === index}" @click="rate(num, index)">{{num}}</li>
        </ul>
      </div>
      <div class="comment">
        <!--检查评论-->
        <el-form :model="ruleform" ref="ruleform" label-width="60px" :rules="rulea" class="checkcomment">
         <el-form-item label="检查评价:" prop="numa">
            <el-input v-model="ruleform.numa" :maxlength="3" :max="100"></el-input>
            <i>%</i>
        </el-form-item>
       </el-form>
       <!--进度条-->
        <el-progress :text-inside="true" :stroke-width="18" :percentage="parseFloat(ruleform.numa)" :show-text="false"></el-progress>
        <!--教师评价-->
        <el-form :model="ruleform" ref="ruleform" label-width="60px" :rules="rulea" class="teachercomment">
         <el-form-item label="教师评价:" prop="numb">
            <el-input v-model.number="ruleform.numb" :maxlength="3"></el-input>
            <i>%</i>
        </el-form-item>
       </el-form>
      </div>
      <div class="button-box">
        <el-button @click="saveOther" @mouseenter.native="borderSeven = false" @mouseleave.native="borderSeven = true">
          保存
          <img v-if="borderSeven" src="../../../assets/images/border.png">
        </el-button>
        <el-button @mouseenter.native="borderEight = false" @mouseleave.native="borderEight = true" @click="cancelOther">
          取消
          <img v-if="borderEight" src="../../../assets/images/red.png">
        </el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close= "false">
      <span v-if="seting.courseSet === 1"><i></i>按照课时同步成功</span>
      <span v-if="seting.editionSet === 1"><i></i>按照教材编目同步成功</span>
    </el-dialog>
  </div>
</template>

<script>
import querystring from 'querystring'
import { notice, error, success } from '../../../api/index.js'
export default {
  name: 'lessonset',
  data () {
    var checkcomment = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('检查评价不能为空'))
      }
      if (!(/^\d{1,3}$/).test(value)) {
        return callback(new Error('请输入1 - 3位数字'))
      }
      if (value > 100 || value < 0) {
        callback(new Error('请输入0-100之间的整数！'))
      } else {
        callback()
        this.ruleform.numb = 100 - value
        this.ruleform.numa = value
      }
    }
    var teachercomment = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('教师评价不能为空'))
      }
      if (!(/^\d{1,3}$/).test(value)) {
        return callback(new Error('请输入1 - 3位数字'))
      }
      if (value > 100 || value < 0) {
        callback(new Error('请输入0-100之间的整数！'))
      } else {
        callback()
        this.ruleform.numa = 100 - value
        this.ruleform.numb = value
      }
    }
    return {
      setInfo: [],
      setSectionId: '',
      setSectionName: '',
      courseflag: true,
      setGradeId: '',
      setGradeName: '',
      borderOne: true,
      borderTwo: true,
      borderThree: true,
      borderFour: true,
      borderFive: true,
      borderSix: true,
      borderSeven: true,
      borderEight: true,
      check: false,
      loading: false,
      seting: {},
      jsonStr: [],
      newStr: [],
      checkedInfo: [],
      setMes: [],
      peroid: [],
      grade: [],
      subject: [],
      savelist: [],
      state: 1,
      semesterId: '',
      cancelScore: '',
      cancelflag: true,
      numbera: '',
      numberb: '',
      states: [],
      list: [],
      sectionId: '',
      activeInd: 0,
      checkedCourses: [],
      checkedName: [],
      courses: [],
      subjectIds: '',
      blue: '',
      dialogVisible: false,
      nums: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      ruleform: {
        numa: 50,
        numb: 50
      },
      rulea: {
        numa: [
          { validator: checkcomment, trigger: 'blur' }
        ],
        numb: [
          { validator: teachercomment, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 全部全选
    checkedAll (event, setInfo) {
      this.setMes = this.setInfo.filter(item => item.courses.length)
      if (this.check) {
        this.setMes.forEach((item, index) => {
          item.checkAll = true
          this.handleCheckAllChange(event, item)
        })
      } else {
        this.setMes.forEach((item, index) => {
          item.checkAll = false
          this.handleCheckAllChange(event, item)
        })
      }
    },
    // 全选
    handleCheckAllChange (event, item) {
      item.checked = event.target.checked ? item.courses.map(subject => subject.curriculumName) : []
      item.isIndeterminate = false
      // 从全选=》全部清除.删除该对象
      if (!item.checkAll) {
        for (let i = 0; i < this.list.length; i++) {
          if (item.setSectionId === this.list[i].sectionId && item.setGradeId === this.list[i].gradeId) {
            this.list.splice(i, 1)
            this.getAll()
          }
        }
      } else {
        // 未全选=》全选
        if (item.checked.length === 0) {
          // 直接push
          this.addSubject(item)
          this.getAll()
        } else if (item.checked.length > 0) {
          // 先清除已选，之后再push
          for (let i = 0; i < this.list.length; i++) {
            if (item.setSectionId === this.list[i].sectionId && item.setGradeId === this.list[i].gradeId) {
              this.list.splice(i, 1)
            }
          }
          this.addSubject(item)
          this.getAll()
        }
      }
    },
    // // 选择
    chooseCourses (value, item) {
      // 选中学科的名称数组value
      let checkedCount = value.length
      item.checkAll = checkedCount === item.courses.length
      item.isIndeterminate = checkedCount > 0 && checkedCount < item.courses.length
      if (!this.list.length) {
        // 创建已选学科数组对象并push进已选数组中
        this.addSubject(item)
        this.getAll()
      } else {
        let arr = this.list.map(items => items.type)
        let adjust = arr.indexOf(item.type)
        // 如果当前选中的与已选学科数组的学段和年级相等，则删除该对象
        if (adjust !== -1) {
          this.list.splice(adjust, 1)
        }
        this.addSubject(item)
        this.getAll()
      }
    },
    addSubject (item) {
      let a = {}
      a.id = ''
      a.sectionId = item.setSectionId
      a.gradeId = item.setGradeId
      a.semesterId = this.semesterId
      a.type = item.type
      let arr = []
      // 获取已选学科的id数组
      for (var child = 0; child < item.checked.length; child++) {
        for (var n = 0; n < item.courses.length; n++) {
          if (item.checked[child] === item.courses[n].curriculumName) {
            arr.push(item.courses[n].id)
          }
        }
      }
      arr = arr.join(',')
      a.subjectIds = arr
      this.list.push(a)
    },
    rate (num, index) {
      if (this.activeInd === index) {
        this.activeInd = -1
      } else {
        this.activeInd = index
        this.seting.planScore = num
      }
    },
    goLook () {
      this.$router.push('/coursetime')
    },
    goMeterical () {
      this.$router.push('/metericalview')
    },
    takeuse () {
      if (this.seting.courseSet === 1) {
        this.seting.courseSet = 0
        this.seting.editionSet = 1
        this.getUse()
        return
      }
      if (this.seting.courseSet === 0) {
        this.seting.courseSet = 1
        this.seting.editionSet = 0
        this.getUse()
        return
      }
    },
    getUse () {
      this.$https.post(`/lessonSet/bookEnable`, querystring.stringify({courseSet: this.seting.courseSet, editionSet: this.seting.editionSet}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    timeSet () {
      this.setInfo = []
      this.getSelectSemesterList()
      this.check = false
      // setTimeout(() => {
      //   this.getCourse()
      // }, 200)
    },
    getCourse () {
      // 获取已选课程
      this.checkedName = []
      this.$https.get(`/lessonSet/getCourse?semesterId=${this.semesterId}`)
        .then(res => {
          if (res.data.code === 1) {
            this.checkedCourses = res.data.result.map(item => ({...item, type: String(item.sectionId) + String(item.gradeId)}))
            // 引用类型的赋值，对数据进行改变其他的值不受影响。
            this.list = [ ...this.checkedCourses ]
            this.list = this.list.filter(item => item.subjectIds)
            for (var m = 0; m < this.setInfo.length; m++) {
            // 遍历已选学科
            // 每个年级都有checkedName遍历时需要清空
              this.checkedName = []
              for (var i = 0; i < this.checkedCourses.length; i++) {
                if (this.checkedCourses[i].gradeId === this.setInfo[m].setGradeId && this.checkedCourses[i].sectionId === this.setInfo[m].setSectionId) {
                // 获取checkedCourses 中的 subjecs 然后遍历
                  for (var d = 0; d < this.checkedCourses[i].subjectIds.split(',').length; d++) {
                    for (var h = 0; h < this.setInfo[m].courses.length; h++) {
                      // 判断已选的学科id是否有与完整数组的学科id相等的。相等取出已选中的学科名称
                      if (this.checkedCourses[i].subjectIds.split(',')[d].toString() === this.setInfo[m].courses[h].id.toString()) {
                        this.checkedName.push(this.setInfo[m].courses[h].curriculumName)
                        this.setInfo[m].checked = this.checkedName
                        if (this.setInfo[m].checked.length === this.setInfo[m].courses.length) {
                          this.setInfo[m].checkAll = true
                          this.setInfo[m].isIndeterminate = false
                        }
                      }
                    }
                  }
                }
              }
            }
            // every 当item.checkAll.check赋值为true,反之为false
            // this.check 为true代表全部选择
            this.setMes = this.setInfo.filter(item => item.courses.length)
            this.check = this.setMes.every(item => item.checkAll === true)
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
    },
    getAll () {
      this.setMes = []
      this.setMes = this.setInfo.filter(item => item.courses.length)
      // this.list与setInfo的长度不相等。this.check值为false
      if (this.list.length !== this.setMes.length) {
        this.check = false
      } else {
        this.list.forEach(item => {
          this.setMes.forEach(items => {
            if (item.gradeId === items.setGradeId && item.sectionId === items.setSectionId) {
              // 把字符串转换成数组去长度
              if (item.subjectIds.split(',').length === items.courses.length) {
                items.isIndeterminate = false
                return
              }
            }
          })
        })
        this.check = this.setMes.every(item => !item.isIndeterminate)
      }
    },
    getSeting () {
      // 获取备课设置
      this.$https.get(`/lessonSet/getSeting`)
        .then(res => {
          if (res.data.code === 1) {
            if (!res.data.result) {
              this.seting.courseSet = 1
              this.seting.editionSet = 0
              return
            }
            this.seting = res.data.result
            this.cancelScore = this.seting.planScore
            this.ruleform.numa = this.seting.inspectEvaluate
            this.ruleform.numb = this.seting.teacherEvaluate
            this.numbera = this.ruleform.numa
            this.numberb = this.ruleform.numb
            this.nums.forEach((num, index) => {
              if (this.seting.planScore === num) {
                this.activeInd = index
                return
              }
            })
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
    },
    getSelectSemesterList () {
      // 获取学期信息列表
      this.$https.get(`/common/selectSemesterList`)
        .then(res => {
          if (res.data.code === 1) {
            this.options = res.data.result
            this.options.forEach((item, index) => {
              if (item.state === this.state) {
                this.semesterId = item.semesterId
                this.getSectionList()
              }
            })
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
    },
    getSectionList () {
      // 获取学段
      this.rightloading = true
      this.$https.get(`/common/sectionList`)
      .then(async res => {
        if (res.data.code === 1) {
          this.peroid = res.data.result
          for (let i = 0; i < this.peroid.length; i++) {
            await this.$https.get(`/common/selectGradeClassList?sectionId=${this.peroid[i].id}&semesterId=${this.semesterId}`)
              .then(async res => {
                if (res.data.code === 1) {
                  this.peroid[i].classes = res.data.result.map(item => ({...item, type: String(this.peroid[i].id) + item.id}))
                  for (let j = 0; j < this.peroid[i].classes.length; j++) {
                    await this.$https.get(`/common/selectCourseList?sectionId=${this.peroid[i].id}&gradeId=${this.peroid[i].classes[j].id}&semesterId=${this.semesterId}`)
                    .then(res => {
                      if (res.data.code === 1) {
                        this.peroid[i].classes[j].subjects = res.data.result.map(item => ({...item, type: String(this.peroid[i].id) + this.peroid[i].classes[j].id}))
                        this.courses = this.peroid[i].classes[j].subjects
                        for (var m = 0; m < this.courses.length; m++) {
                          this.courses[m].gradeId = this.peroid[i].classes[j].id
                        }
                        this.setSectionId = this.peroid[i].id
                        this.setSectionName = this.peroid[i].name
                        this.setGradeId = this.peroid[i].classes[j].id
                        this.setGradeName = this.peroid[i].classes[j].name
                        let type = this.peroid[i].classes[j].type
                        this.setInfo.push({ setSectionId: this.setSectionId, setSectionName: this.setSectionName, setGradeId: this.setGradeId, setGradeName: this.setGradeName, courses: this.courses, checkAll: false, isIndeterminate: true, checked: [], type })
                      } else if (res.data.code === -2) {
                        error(this)
                      } else {
                        notice(this, res.data.message, 3000)
                      }
                    })
                  }
                } else if (res.data.code === -2) {
                  error(this)
                } else {
                  notice(this, res.data.message, 3000)
                }
              })
              .catch(res => {
                notice(this, res.message, 2000)
              })
          }
          this.peroid.forEach(async (item, index) => {
            // 获取年级数据

          })
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
        this.rightloading = false
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    saveSet () {
      // 备课科目设置--保存
      // 过滤掉subjectIds值为空的数据，得到完整不为空数据
      this.list = this.list.filter(item => item.subjectIds)
      if (this.list.length === 0) {
        notice(this, '请选择备课科目！', 2000)
        return
      }
      this.$https.post(`/lessonSet/courseSave`, querystring.stringify({jsonstr: JSON.stringify(this.list)}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.setInfo = []
          this.getSectionList()
          setTimeout(() => {
            this.getCourse()
          }, 500)
          this.jsonStr = []
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
    },
    saveOther () {
      if (Number(this.ruleform.numa) + Number(this.ruleform.numb) !== 100) {
        // notice(this, '检查评价和教师评价之和必须等于100%', 3000)
        return
      }
      this.$https.post(`/lessonSet/setOthers`, querystring.stringify({planScore: this.nums[this.activeInd], inspectEvaluate: this.ruleform.numa, teacherEvaluate: this.ruleform.numb}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.cancelScore = this.seting.planScore
          this.cancelflag = false
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
    },
    cancelOther () {
      if (!this.cancelflag) return
      this.seting.planScore = this.cancelScore
      this.ruleform.numa = this.numbera
      this.ruleform.numb = this.numberb
      this.nums.forEach((num, index) => {
        if (this.seting.planScore === num) {
          this.activeInd = index
          return
        }
      })
    },
    scrollTop () {
      window.scrollTo(0, 0)
    }
  },
  created () {
    // 获取备课设置
    this.getSeting()
    // 获取学期
    this.getSelectSemesterList()
    // this.scrollBehavior()
    this.scrollTop()
    setTimeout(() => {
      this.getCourse()
    }, 1000)
  }
}
</script>

<style lang="scss">
#lessonset {
  .content-box {
    margin-top: 50px;
    padding-left: 70px;
    padding-right: 60px;
    position: relative;
    .head {
      /*width: 100%;*/
      height: 40px;
      background: #DDE6EF;
      border-radius: 8px;
      padding: 0px 40px 0px 22px;

      span {
        line-height: 40px;
        color: #636C7B;
        float: left;
      }

      .status {
        margin-left: 41%;
      }
      .action {
        float: right;
        margin-right: 5%;
      }
      .all {
        margin-left: 30px;
        .el-checkbox__inner {
          margin-top: 11px;
        }
        span {
          margin-left: 0px;
        &:nth-child(2) {
            color: #636C7B;
            padding: 0px;
            margin-left: 10px;
          }
        }
      }
    }

    .courseset {
      position: relative;
      ul {
        padding: 0px 20px 20px 20px;
        max-height: calc(100vh - 100px);
        overflow-x: hidden;
        margin-top: 0px;
        li {

          .el-checkbox-group {
            margin-left: 73px;
          }

          p {
            border-bottom: 1px dashed #DAE2ED;
            padding-bottom: 20px;
            height: 90px;
            &:last-child {
              border-bottom: none;
            }
          }
          &:last-child {
            border-bottom: none;
          }
          list-style-type: none;
          .grade {
            padding-top: 20px;
            padding-bottom: 28px;
            display: block;
            color: #408EE6;
            font-weight: bold;
            font-size: 14px;
          }
          .selectAll {
            float: left;
            padding-right: 18px;
            border-right: 1px solid #ACB1B9;
            color: #636C7B;
            margin-right: 2%;

            .el-checkbox__input {
              margin: 0px;
              
              .el-checkbox__inner {
                margin: 0px;
              }
            }
          }
          .el-checkbox {
            color: #636C7B;
            margin-right: 2%;

            span {
              margin-left: 2%;
            }
          }
        }
      }

      .button-group {
        text-align: right;
        margin-top: 10px;

        .el-button {
          border: 1px solid #408EE6;
          span {
            color: #408EE6;
            img {
              position: absolute;
              top: -10px;
              right: 10px;
            }
          }
          &:first-child {
            width: 100px;
            height: 30px;
            position: relative;
            padding: 0px;
            span {
              position: absolute;
              top: 8px;
              width: 100px;
              text-align: center;
              right: 0px;
            }
          }

          &:last-child {
            width: 75px;
            height: 30px;
            position: relative;
            padding: 0px;

            span {
              position: absolute;
              width: 75px;
              text-align: center;
              top: 8px;
              right: 0px;
            }
          }
        }

        .el-button:hover {
          background: #408EE6;
          span {
            color: #fff;
          }
        }
      }
    } 
    .set {
      width: 100%;
      margin: 0px;
      padding: 0px;

      li {
        list-style-type: none;
        padding: 40px 40px 40px 22px;
        border-bottom: 1px dashed #DAE2ED;
        line-height: 36px;
        position: relative;

        .nullInfo {
          position: absolute;
          top: 35%;
          left: 46%;
          color:#636C7B;
        }

        &:nth-child(2) {
          border-bottom: none;
          span {
            i {
              background: url(../../../assets/images/metercial-icon.png)no-repeat;
            }
          }

          .button-group {
            .el-button {
              background: #fff;
              &:first-child {
                border: 1px solid #408EE6;

                span {
                  color: #408EE6;
                  img {
                    position: absolute;
                    top: -10px;
                    right: 10px;
                  }
                }
              }
              &:first-child:hover {
                background: #408EE6;
                span {
                  color: #fff;
                }
              }
            }
          }

        }

        &:after {
          display: block;
          content: '';
          clear: both;          
        }
        span {
          color: #9FD35D;
          float: left;
          &:after {
            display: block;
            content: '';
            clear: both;
          }
          i {
              width: 24px;
              height: 24px;
              display: block;
              float: left;
              margin-right: 10px;
              margin-top: 6px;
              background: url(../../../assets/images/time-icon.png)no-repeat;
          }
        }

        .button-group {
          float: right;
          .el-button {
            width: 75px;
            height: 30px;
            position: relative;
            padding: 0px;
            border: 1px solid #9FD35D;

            &:hover {
              background: #9FD35D;
              span {
                color: #fff;
              }
            }

            &:first-child {
              border: 1px solid #408EE6;

              span {
                color: #408EE6;
                img {
                  position: absolute;
                  top: -10px;
                  right: 10px;
                }
              }
            }
            &:first-child:hover {
              background: #408EE6;
              span {
                color: #fff;
              }
            }

            span {
              width: 75px;
              position: absolute;
              top: 8px;
              text-align: center;
              right: 0px;
              img {
                position: absolute;
                top: -10px;
                right: 10px;
              }              
            }
          }
        }
        .estate {
          width: 80px;
          height: 24px;
          background: #408EE6;
          border-radius: 12px;
          color: #fff;
          float: left;
          text-align: center;
          line-height: 24px;
          margin-left: 37.5%;
          margin-top: 6px;
          &:hover {
            cursor: pointer;
          }
        }
        .estates {
          width: 80px;
          height: 24px;
          background: #408EE6;
          border-radius: 12px;
          color: #fff;
          float: left;
          text-align: center;
          line-height: 24px;
          margin-left: 35.5%;
          margin-top: 6px; 
          &:hover {
            cursor: pointer;
          }        
        }
      }
    } 
    .highscore {
      margin-top: 40px;
      span {
        color: #636C7B;
        float: left;
        line-height: 30px;
      }
      .scorenum {
        padding: 0px;
        margin: 0px;

        &:after {
          content: '';
          display: block;
          clear: both;
        }
        li {
          list-style-type: none;
          float: left;
          width: 28px;
          height: 28px;
          border: 1px solid #C8D5E6;
          border-radius: 4px;
          margin-right: 20px;
          color: #BCC1CB;
          text-align: center;
          line-height: 30px;

          &:first-child {
            margin-left: 20px;
          }
        }

        li:hover, .active {
          background: #FCB323;
          color: #fff;
          border: 1px solid #FCB323;
          cursor: pointer;
        }
      }
    }  
    .comment {
      margin-top: 38px;

      &:after {
        content: '';
        clear: both;
        display: block;
      }
      .checkcomment {
        float: left;
        .el-form-item {
          .el-form-item__label {
            padding: 0px;
            margin-top: 10px;
          }
          .el-form-item__content {
            .el-input {
              margin-left: 20px;
              width: 60px;
              height: 30px;
              border: none;
              outline: none;
              padding-left: 2em;
            }
            i {
              font-style: normal;
            }
            .el-form-item__error {
              left: -25px;
              width: 204px;
              text-align: center;
            }
          }
          
        }
      }
      /*.progress {
        width: 360px;
        height: 15px;
        float: left;
        margin: 10px 25px 0px 23px;
        border-radius: 4px;
        background: #9FD35D;
        position: relative;

        .blue {
          position: absolute;
          top: 0px;
          left: 0px;
          height: 15px;
        }
      }*/
      .el-progress {
        width: 360px;
        float: left;

        .el-progress-bar {
          .el-progress-bar__outer {
            margin: 9px 25px 0px 20px;
            background: #9FD35D;
          }
        }
      }
      .teachercomment {
        float: left;
        .el-form-item {
          .el-form-item__label {
            padding: 0px;
            margin-top: 10px;
          }
          .el-form-item__content {
            .el-input {
              margin-left: 20px;
              width: 60px;
              height: 30px;
              border: none;
              outline: none;
            }
            i {
              font-style: normal;
            }
            .el-form-item__error {
              left: -25px;
              width: 204px;
              text-align: center;
            }
          }
          
        }      
      }
    }
    .button-box {
      position: absolute;
      right: 99px;
      top: 80px;
      .el-button {
        width: 75px;
        height: 30px;
        position: relative;
        padding: 0px;
        border: 1px solid #FF6C60;

        &:hover {
          background: #FF6C60;
          span {
            color: #fff;
          }
        }

        &:first-child {
              border: 1px solid #408EE6;

              span {
                color: #408EE6;
                img {
                  position: absolute;
                  top: -10px;
                  right: 10px;
                }
              }
        }
        &:first-child:hover {
              background: #408EE6;
              span {
                color: #fff;
              }
        }

        span {
          width: 75px;
          position: absolute;
          top: 8px;
          text-align: center;
          right: 0px;
          color: #FF6C60;
          img {
            position: absolute;
            top: -10px;
            right: 10px;
          }
        }
      }
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background: #DAE2ED;
    margin-bottom: 40px;
  }

  .el-dialog__wrapper {

    /*background: #CCCCCC;
      filter: alpha(opacity=40);  
      -moz-opacity: 0.4;  
      -khtml-opacity: 0.4;  
      opacity: 0.4;  
      z-index: 10;*/

    .el-dialog {
      margin: 0px;
      width: auto;
      background: #7A7A7A;
      filter:alpha(opacity=100);  
      -moz-opacity: 1;  
      -khtml-opacity: 1;  
      opacity: 1;  
      z-index: 100 !important;

      .el-dialog__header {
        padding: 0px;
      }
      .el-dialog__body {
        padding: 10px 20px;
        width: 200px;
        span {
          width: 200px;
          color: #fff;
          i {
            width: 24px;
            height: 24px;
            display: block;
            background: url(../../../assets/images/success.png) no-repeat;
            float: left;
            margin-right: 15px;
          }
        }
      }
    }
  }
}

</style>
