<template>
  <div id="connect-class" class="clearfix">
    <div class="left-nav">
      <el-tree :data="subjectList" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true"></el-tree>
    </div>
    <div class="right-content">
      <!--<el-button class="btn" @click="addNewSet">新增设置</el-button>-->
      <table class="subject-classroom">
        <tr>
          <th>{{subjectName}} - 批量设置</th>
          <th>
            连堂课节数
            <el-input type="number" :step="1"  class="input" v-model="recyleNumAll"  @blur="subjectNumberChangeAll" :min="0"></el-input>
          </th>
          <th>
            连堂课次数
            <el-input type="number" :step="1" class="input" v-model="frequencyAll" @blur="subjectTimesChangeAll" :min="0"></el-input>
            <span style="margin-left:110px;"></span>
          </th>
        </tr>
        <tr v-for="item in gradeInfo" :key="item.gradeName">
          <td>{{item.gradeName}}</td>
          <td>
            连堂课节数
            <el-input type="number" :step="1" class="input" v-model="item.connectNumber" @blur="numberChange(item)" :min="0"></el-input>
          </td>
          <td>
            连堂课次数
            <el-input type="number" :step="1" class="input" v-model="item.connectTimes" @blur="timeChange(item)" :min="0"></el-input>
            <span class="change" @click="detailSet(item)">详细设置</span>
          </td>
        </tr>
        <tr v-if="gradeInfo.length == 0" class="no-content none"><td :colspan="5">暂无数据</td></tr>
      </table>
    </div>


     <!--连堂课-->
    <el-dialog :title="addOrChange" :visible.sync="addNewSetDialog" class="dialog">
      <table class="subject-classroom class-connect">
        <tr>
          <td>{{subjectName}}</td>
          <td>{{gradeName}}</td>
          <td></td>
          <td></td>
        </tr>
        <tr v-for="item in classList" :key="item.className">
          <td></td>
          <td>{{item.className}}</td>
          <td>
            连堂课节数
            <el-input type="number" :step="1" class="input" v-model="item.connectNumber"></el-input>
          </td>
          <td>
            连堂课次数
            <el-input type="number" :step="1" class="input" v-model="item.connectTimes" ></el-input>
          </td>
        </tr>
      </table>
      <footer class="dialog-footer">
        <el-button class="cancel" @click="addNewSetDialog = false">取消</el-button>
        <el-button class="sure" @click="classSave">保存</el-button>
      </footer>
    </el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { notice, success } from '../../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'connect-class',
  data () {
    return {
      subjectList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      recyleNumAll: null,
      frequencyAll: null,
      addOrChange: '',
      addNewSetDialog: false,
      subjectId: '',
      subjectName: '',
      gradeInfo: [],
      infoList: [],
      classList: [],
      gradeName: '',
      infoId: ''
    }
  },
  computed: {
    ...mapGetters([
      'semesterId',
      'section'
    ])
  },
  methods: {
    handleNodeClick (data) {
      if (data.name === '全部学科') {
        this.gradeInfo = ''
        return
      }
      this.recyleNumAll = null
      this.frequencyAll = null
      this.subjectId = data.id
      this.subjectName = data.name
      this.gradeInfo = data.gradeInfo.map(item => ({...item, connectNumber: item.connectNumber ? item.connectNumber : 0, connectTimes: item.connectTimes ? item.connectTimes : 0}))
      this.connectSetList()
      this.check()
    },
    // 遍历对比年级列表里面的设置是否一样
    check () {
      this.gradeInfo.forEach(item => {
        if (item.connectTimes !== this.recyleNumAll) {
          this.recyleNumAll = null
        } else {
          this.recyleNumAll = item.connectTimes
        }
        if (item.connectNumber !== this.frequencyAll) {
          this.frequencyAll = null
        } else {
          this.frequencyAll = item.connectTimes
        }
      })
    },
    // 详细设置
    async detailSet (item) {
      this.addOrChange = '详细设置'
      this.addNewSetDialog = true
      this.gradeId = item.gradeId
      this.gradeName = item.gradeName
      this.infoId = item.id
      await this.getClassList()
      this.getDetail()
    },
    // 获取班级列表
    async getClassList () {
      await this.$https.get(`common/selectClassSimplesBySubjectAndGrade?gradeId=${this.gradeId}&sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&subjectId=${this.subjectId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.classList = res.data.result.map(item => ({className: item.className, classId: item.classId, connectNumber: item.connectNumber ? item.connectNumber : 0, connectTimes: item.connectTimes ? item.connectTimes : 0}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学科信息
    selectSubject () {
      if (!this.semesterId.semesterId || !this.section.id) return
      this.$https.get(`common/selectSubject?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        if (res.data.code === 1) {
          let arr = res.data.result.map((item, i) => ({
            name: item.curriculumName,
            id: item.chooiceId,
            gradeInfo: item.gradeInfo
          }))
          this.subjectList = [
            {name: '全部学科', children: [...arr]}
          ]
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 根据学科获取连堂课设置信息列表
    connectSetList () {
      this.$https.get(`/setting/connectSetList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&subjectId=${this.subjectId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.infoList = res.data.result
          this.gradeInfo.forEach(item => {
            this.infoList.forEach(items => {
              if (item.gradeId === items.gradeId) {
                item.id = items.id
                item.connectNumber = items.connectNumber
                item.connectTimes = items.connectTimes
              }
            })
          })
        }
      })
    },
    // 批量更改连堂课节数
    subjectNumberChangeAll () {
      if (!this.subjectId) return
      // this.connectNumber = this.recyleNumAll
      this.subjectNumberChangeSave()
    },
    // 批量更改连堂课次数
    subjectTimesChangeAll () {
      if (!this.subjectId) return
      // this.connectTimes = this.frequencyAll
      this.subjectTimeChangeSave()
    },
    // 批量保存连堂课节数设置信息
    subjectNumberChangeSave () {
      // if (this.connectNumber < 0) {
      //   notice(this, `连堂课节数不能小于0`, 2000)
      //   return
      // }
      this.$https.post(`/setting/connectSetBatchSave`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        type: 1,
        connectNumber: this.recyleNumAll,
        connectTimes: this.frequencyAll,
        subjectId: this.subjectId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.gradeInfo.forEach(item => {
            item.connectNumber = this.recyleNumAll
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 批量保存连堂课次数设置信息
    subjectTimeChangeSave () {
      // if (this.connectTimes < 0) {
      //   notice(this, `连堂课次数不能小于0`, 2000)
      //   return
      // }
      this.$https.post(`/setting/connectSetBatchSave`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        type: 1,
        connectNumber: this.recyleNumAll,
        connectTimes: this.frequencyAll,
        subjectId: this.subjectId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.gradeInfo.forEach(item => {
            item.connectTimes = this.frequencyAll
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 年级连堂课节数切换保存
    numberChange (item) {
      this.gradeId = item.gradeId
      this.connectNumber = item.connectNumber
      this.numberChangeOne(item)
    },
    // 年级连堂课节数保存
    numberChangeOne (item) {
      // if (this.connectNumber < 0) {
      //   notice(this, `连堂课节数不能小于0`, 2000)
      //   return
      // }
      this.$https.post(`/setting/connectSetBatchSave`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        type: 2,
        gradeId: this.gradeId,
        connectNumber: item.connectNumber,
        connectTimes: item.connectTimes,
        subjectId: this.subjectId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getClassList()
          this.classList.forEach(item => {
            item.connectNumber = this.connectNumber
          })
          // this.getClassList()
          // this.classList.forEach(item => {
          //   item.recyleNum = this.connectNumber
          // })
          this.check()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 年级连堂课次数切换保存
    timeChange (item) {
      this.gradeId = item.gradeId
      // this.connectTimes = item.connectTimes
      this.timeChangeOne(item)
      this.getClassList()
    },
    // 年级连堂次数切换保存
    timeChangeOne (item) {
      // if (this.connectTimes < 0) {
      //   notice(this, `连堂课次数不能小于0`, 2000)
      //   return
      // }
      this.$https.post(`/setting/connectSetBatchSave`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        type: 2,
        gradeId: this.gradeId,
        connectNumber: item.connectNumber,
        connectTimes: item.connectTimes,
        subjectId: this.subjectId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.classList.forEach(item => {
            item.connectTimes = this.connectTimes
          })
          // this.classList.forEach(item => {
          //   item.frequency = this.connectTimes
          // })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取连堂课详细信息设置信息
    getDetail () {
      if (!this.infoId) {
        this.infoId = 0
      }
      this.$https.get(`/setting/connectSetDetail?connectId=${this.infoId}`)
      .then(async res => {
        if (res.data.code === 1) {
          await this.getClassList()
          this.classInfoList = res.data.result
          this.classList.forEach(item => {
            this.classInfoList.forEach(items => {
              if (item.classId === items.classId) {
                item.id = items.id
                item.connectNumber = items.connectNumber
                item.connectTimes = items.connectTimes
              }
            })
          })
        }
      })
    },
    // 连堂课信息保存
    classSave (item) {
      let classDetail = JSON.stringify(this.classList)
      this.$https.post(`/setting/connectSetDetailSave`, querystring.stringify({
        semesterId: this.semesterId.semesterId,
        sectionId: this.section.id,
        subjectId: this.subjectId,
        gradeId: this.gradeId,
        connectId: this.infoId,
        json: classDetail
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.addNewSetDialog = false
          this.connectSetList()
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    if (this.semesterId.semesterId && this.section.id) {
      this.selectSubject()
    }
  },
  filters: {
    lessonFilter (val) {
      if (val === 10) return '第十节'
      let lesson = {
        '0': '早读',
        '1': '第一节',
        '2': '第二节',
        '3': '第三节',
        '4': '第四节',
        '5': '第五节',
        '6': '第六节',
        '7': '第七节',
        '8': '第八节',
        '9': '第九节'
      }
      return lesson[val]
    }
  },
  watch: {
    semesterId () {
      this.selectSubject()
    },
    section () {
      this.selectSubject()
    }
  }
}
</script>



<style lang="scss">
#connect-class {
  padding-bottom: 20px;
  width: 100%;
  height: 100%;
  div.right-content {
    float: left;
    width: 84%;
    height: calc(100% - 20px);
    overflow: auto;
    // border-radius: 4px;
    tr{
      height: 50px;
      .el-input, .el-input__inner {
        width: 130px;
        background: transparent;
        display: inline-block;
        margin-left: 10px;
        margin-right: 40px;
        cursor: pointer;
      }
    }
    tr:first-child {
      .el-input, .el-input__inner {
        border-color: #fff;
      }
    }
  }
  .change {
    cursor: pointer;
  }
  .class-connect {
    .el-input {
      width: 100px;
    }
    tr {
      td {
        border: none;
        .el-input {
          margin-left: 10px;
        }
      }
    }
  }
  .left-nav {
    height: calc(100% - 20px);
    overflow: auto;
  }
}
</style>
