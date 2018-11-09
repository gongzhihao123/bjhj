<template>
  <div id="class-allot" class="clearfix">
    <div class="left-nav">
      <el-tree :data="subjectList"
              :props="defaultProps"
              @node-click="handleNodeClick"
              node-key="name"
              :current-node-key="key"
              :highlight-current="true">
      </el-tree>
    </div>
    <div class="right-content">
      <table class="subject-classroom">
        <tr>
          <th v-for="(item, i) in classTableHeader" :key="i">{{item.name}}</th>
          <th v-for="(item, i) in gradeList" :key="i">{{item.name}}</th>
        </tr>
        <tr v-for="(item, i) in classTableContent" :key="i">
          <td>{{ subjectName }}</td>
          <td>{{item.lessones | lessonFilter}}</td>
          <td class="set-all">
              <el-select v-model="item.allMod" placeholder="请选择">
                <el-option
                 @click.native="lessonSetSave(1, item)"
                  v-for="(items, ind) in options"
                  :key="ind"
                  :label="items.name"
                  :value="items.principle">
                </el-option>
              </el-select>
          </td>
          <td v-for="(names, index) in item.detail" :key="index">
              <el-select v-model="names.principle">
                <el-option
                   @click.native="lessonSetSave(names, item)"
                  v-for="(items, ind) in options"
                  :key="ind"
                  :label="items.name"
                  :value="items.principle">
                </el-option>
              </el-select>
          </td>
        </tr>
        <tr v-if="classTableContent.length == 0" class="no-content none"><td :colspan="classTableContent.length + 3">暂无数据</td></tr>
      </table>
    </div>
  </div>
</template>

      
<script>
import { mapGetters } from 'vuex'
import { notice, success } from '../../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'class-allot',
  data () {
    return {
      subjectList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      key: '',
      classTableHeader: [
        {name: '学科'},
        {name: '课节'},
        {name: '批量设置'}
      ],
      gradeList: [],
      options: [
        {name: '非常好', principle: 2},
        {name: '较好', principle: 3},
        {name: '一般', principle: 1},
        {name: '禁止排课', principle: 4}
      ],
      classTableContent: [],
      subjectId: '',
      subjectName: '',
      lessonNum: {
        haveMorningRead: false,
        maxMorning: 0,
        maxAfternoon: 0
      }
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
        this.subjectId = ''
        this.lessonSetList()
        return
      }
      this.subjectId = data.id
      this.subjectName = data.name
      // 改变年级
      this.gradeList = data.gradeInfo.map(item => ({
        id: item.gradeId,
        name: item.gradeName,
        principle: ''
      }))
      this.lessonSetList()
    },
    async getGrade () {
      if (!this.semesterId.semesterId || !this.section.id) return
      // await this.$https.get(`/common/selectGradeClassList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      // .then(res => {
      //   if (res.data.code === 1) {
      //     this.gradeList = res.data.result.map(item => ({
      //       id: item.id,
      //       name: item.name,
      //       principle: ''
      //     }))
      //   } else {
      //     notice(this, res.data.message, 2000)
      //   }
      // })
    },
    // 获取最大课节数
    async getMaxLesson () {
      if (!this.semesterId.semesterId || !this.section.id) return
      await this.$https.get(`/common/selectMaxLessonHour?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}`)
      .then(res => {
        this.lessonNum.haveMorningRead = res.data.result.haveMorningRead
        this.lessonNum.maxMorning = res.data.result.maxMorning
        this.lessonNum.maxAfternoon = res.data.result.maxAfternoon
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
          this.subjectList = [...arr]
          this.subjectId = arr[0].id
          this.key = arr[0].name
          this.subjectName = this.key
          this.gradeList = arr[0].gradeInfo.map(item => ({
            id: item.gradeId,
            name: item.gradeName,
            principle: ''
          }))
          this.lessonSetList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 根据学科获取课节分配信息列表
    lessonSetList () {
      this.$https.get(`setting/lessonSetList?sectionId=${this.section.id}&semesterId=${this.semesterId.semesterId}&subjectId=${this.subjectId}`)
      .then(res => {
        let classTableContent = res.data.result.map(item => ({
          lesson: item.settingLesson.lesson,
          lessonPart: item.settingLesson.lessonPart,
          id: item.settingLesson.id,
          detail: item.settingLessonDetails.map(items => ({
            ...items,
            infoId: item.settingLesson.id
          })),
          allMod: ''
        }))
        this.motion(classTableContent)
      })
    },
    // 自动补全
    motion (arr) {
      this.classTableContent = []
      if (this.lessonNum.haveMorningRead) {
        this.classTableContent.splice(0, 0, {
          lesson: 0,
          lessones: 0,
          lessonPart: 1,
          detail: this.gradeList.map(item => ({...item, lesson: 0, lessonPart: 1})),
          allMod: ''
        })
      }
      let morningList = []
      for (let i = 0; i < this.lessonNum.maxMorning; i++) {
        morningList.push({
          lesson: i + 1,
          lessones: i + 1,
          lessonPart: 1,
          detail: this.gradeList.map(item => ({...item, lesson: i + 1, lessonPart: 1})),
          allMod: ''
        })
      }
      let afternoonList = []
      for (let i = 0; i < this.lessonNum.maxAfternoon; i++) {
        afternoonList.push({
          lesson: i + 1,
          lessones: this.lessonNum.maxMorning + i + 1,
          lessonPart: 2,
          detail: this.gradeList.map(item => ({...item, lesson: i + 1, lessonPart: 2})),
          allMod: ''
        })
      }
      this.classTableContent = this.classTableContent.concat(morningList, afternoonList)
      this.classTableContent.forEach((item, index) => {
        for (let value of arr) {
          if (value.lesson === item.lesson && value.lessonPart === item.lessonPart) {
            this.$set(item, 'id', value.id)
            for (let v of value.detail) {
              item.detail.forEach((items, i) => {
                if (v.gradeId === items.id) {
                  this.$set(item.detail, i, v)
                }
              })
            }
            continue
          }
        }
      })
    },
    // 保存课节分配信息(支持新增和修改)
    lessonSetSave (name, item) {
      let lessonSet = []
      let obj = {}
      if (name === 1) {
        item.detail.forEach(items => {
          items.principle = item.allMod
          if (!items.gradeId) {
            items.gradeId = items.id
          }
          delete items.id
        })
        lessonSet = item.detail
        obj.lessonSet = lessonSet
        obj.lessonPart = item.lessonPart
        obj.id = item.id
        obj.subjectId = this.subjectId
        obj.subjectName = this.subjectName
        obj.lesson = item.lesson
      } else {
        // let box = {}
        // if (name.gradeId) {
        //   box.gradeId = name.gradeId
        // } else {
        //   box.gradeId = name.id
        // }
        // // box.id = name.id
        // box.lessonId = name.lessonId
        // box.principle = name.principle
        // lessonSet.push(box)
        lessonSet = item.detail.map(items => ({
          gradeId: items.gradeId ? items.gradeId : items.id,
          lesson: items.lesson,
          lessonPart: items.lessonPart,
          principle: items.principle,
          lessonId: items.lessonId
        }))
        obj.id = item.id
        obj.subjectId = this.subjectId
        obj.subjectName = this.subjectName
        obj.lesson = name.lesson
        obj.lessonPart = name.lessonPart
      }
      obj.sectionId = this.section.id
      obj.semesterId = this.semesterId.semesterId
      this.$https.post(`setting/lessonSetSave`, querystring.stringify({
        ...obj,
        lessonSet: JSON.stringify(lessonSet)
      })).then(async res => {
        if (res.data.code === 1) {
          await this.lessonSetList()
          success(this, res.data.message, 2000)
        }
      })
    }
  },
  async created () {
    if (this.semesterId.semesterId && this.section.id) {
      await this.getGrade()
      await this.getMaxLesson()
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
    async semesterId () {
      await this.getGrade()
      await this.getMaxLesson()
      this.selectSubject()
    },
    async section () {
      await this.getGrade()
      await this.getMaxLesson()
      this.selectSubject()
    }
  }
}
</script>



<style lang="scss">
#class-allot {
  padding-bottom: 20px;
  height: 100%;
  width: 100%;
  div.right-content {
    float: left;
    width: 84%;
    // height:600px;
    height: calc(100% - 20px);
    overflow: auto;
    // border-radius: 4px;
    .el-select {
      width: 100px;
      .el-input__inner {
        border-color: #2CCEA7;
        color: #333;
      }
      .el-input__icon {
        color: #2CCEA7;
      }
    }
    .set-all {
      .el-select .el-input__inner {
        background-color: #5CD189;
        color:#279853;
      }
      .el-input__icon {
        color: #fff;
      }
    }
  }
  .left-nav {
    height: calc(100% - 20px);
    overflow: auto;
  }
}
</style>
