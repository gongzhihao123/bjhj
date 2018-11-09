<template>
  <div class="asm common" v-loading="loading">
    <div class="box" @click="addNew">+</div>
    <div class="content-box" v-for="item in list" :key="item.title">
      <div class="content-box-head">{{ item.name }}</div>
      <div class="content-box-content">
        <p>学段: {{ item.sectionName }}</p>
      </div>
      <div class="content-box-foot">
        <span class="spans" @click="lookDetails(item)">
          <img :src="type.check" alt="">
          <img :src="type.checking" alt="">
          <span class="tooltip">查看</span>
        </span>
        
        <span class="spans" @click="lookChange(item)">
          <img :src="type.edit" alt="">
          <img :src="type.editing" alt="">
          <span class="tooltip">编辑</span>
        </span>

        <span class="spans" @click="deleteDetails(item)">
          <img :src="type.delete" alt="">
          <img :src="type.deleteing" alt="">
          <span class="tooltip">删除</span>
        </span>
      </div>
    </div>

    <!--结构新增弹框-->
    <el-dialog
      class="addNewDialog"
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :show-close="false">
      <i class="el-icon-close close" @click="dialogShow = false"></i>
      <div class="dialog-table-content">
        <div class="clearfix">
          <span class="leftName">名称:</span>
          <div class="rightContent">
            <el-input v-model="modInfo.name" placeholder="成绩结构名称最大长度不能超过20个字符" :maxlength="20" class="dialog-table-input"></el-input>
          </div>
        </div>
        <div class="clearfix">
          <span class="leftName">适用学段:</span>
          <div class="rightContent">
            <el-radio v-for="(item, i) in sectionList" :key="i" class="radio" v-model="modInfo.section" :label="i" @change.native="switchSection(item)">{{ item.name }}</el-radio>
          </div>
        </div>
        <div class="clearfix">
          <span class="leftName">学科成绩结构:</span>

          <div class="rightContent">
          </div>
        </div>
        <div v-for="(item, i) in subjectLists" :key="i"  class="oneSubject clearfix">
          <span class="leftName" style="margin-top: 16px;">{{ item.name }}:</span>
        
          <div class="rightContent">
            <p>
              <el-button @click="setTotal(item, i)">设置学科满分</el-button>
              <el-button @click="setStructure(item, i)">设置成绩结构</el-button>
              <el-button @click="isRecover(item, i)">恢复初始设置</el-button>
            </p>

            <table class="lists">
              <tr>
                <td>学科满分：</td>
                <td>{{ item.courseFullMarks }}</td>
              </tr>
              <tr>
                <td>成绩结构：</td>
                <td>
                  <p v-for="(oneDe, ind) in item.listDetail" :key="ind">
                    {{oneDe.partsName}}：
                    满分{{oneDe.partsFullMarks}},
                    权重：{{oneDe.partsWeight}}%
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="rightContent" v-if="subjectLists.length === 0" style="height: 300px;line-height: 300px;text-align: center;border: 1px solid #efefef;">
          <p style="color: #ccc;">该学段暂无学科信息</p>
        </div>
        
      </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogShow = false">取 消</el-button>
          <el-button type="primary" @click="saveExamno">保 存</el-button>
        </span>
    </el-dialog>

    <!--查看弹框-->
    <el-dialog
      class="look-detail"
      :title="detailsTitle"
      :visible.sync="lookDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="lookDialog = false"></i>
        <div class="dialog-table-content look-detail-content">
          <div class="clearfix">
            <span class="leftName">名称:</span>
            <div class="rightContent">
              {{modInfo.name}}
            </div>
          </div>
          <div class="clearfix">
            <span class="leftName">适用学段:</span>
            <div class="rightContent">{{modInfo.sectionName}}</div>
          </div>
          <div class="clearfix">
            <span class="leftName">学科成绩结构:</span>

            <div class="rightContent">
            </div>
          </div>
          <div v-for="(item, i) in subjectLists" :key="i"  class="oneSubject clearfix">
            <span class="leftName">{{ item.name }}:</span>
          
            <div class="rightContent">

              <table class="lists">
                <tr>
                  <td>学科满分：</td>
                  <td>{{ item.courseFullMarks }}</td>
                </tr>
                <tr>
                  <td>成绩结构：</td>
                  <td>
                    <p v-for="(oneDe, ind) in item.listDetail" :key="ind">
                      {{oneDe.partsName}}：
                      满分{{oneDe.partsFullMarks}},
                      权重：{{oneDe.partsWeight}}%
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="rightContent" v-if="subjectLists.length === 0" style="height: 300px;line-height: 300px;text-align: center;border: 1px solid #efefef;">
            <p style="color: #ccc;">该学段暂无学科信息</p>
          </div>
        
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookChange()" >编 辑</el-button>
      </span>
    </el-dialog>

    <!--删除-->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="deleteDialog = false"></i>
      <span>确定要删除当前规则设置吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteRule">确 定</el-button>
      </span>
    </el-dialog>

    <!--设置学科满分-->
    <el-dialog
      class="setTotal"
      title="设置学科满分"
      :visible.sync="setTotalDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="setTotalDialog = false"></i>
      <p class="oneP">
        <span class="oneS">学科: </span>
        {{oneSubjectName}}
      </p>
      <p class="oneP">
        <span class="oneS">满分: </span>
        <el-input type="text" v-model="subjectTotal"></el-input>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="setTotalDialog = false">取 消</el-button>
        <el-button type="primary" @click="setTotalSure">确 定</el-button>
      </span>
    </el-dialog>

    <!--设置成绩结构-->
    <el-dialog
      class="setStructure"
      title="设置成绩结构"
      :visible.sync="setStructureDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="setStructureDialog = false"></i>
      <p class="oneP">
        <span class="oneS">学科: </span>
        {{oneSubjectName}}
      </p>
      <div class="oneP" v-for="(item, i) in achievementStructure" :key="i">
        <span class="oneS">成绩结构: </span>
        <div class="oneExam">
          <span>名称</span>
          <el-input type="text" :disabled="i == 0" v-model="item.partsName"></el-input>
          <span>满分</span>
          <el-input type="number" v-model="item.partsFullMarks" required></el-input>
          <span>权重</span>
          <el-input type="number" v-model="item.partsWeight" required></el-input>
          <span>%</span>
        </div>
        <el-button v-if="i == 0" @click="addOne" style="padding: 10px 6px;">+增加</el-button>
        <el-button v-if="i != 0" @click="deleteOne(item, i)"><i class="el-icon-delete"></i>删除</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="setStructureDialog = false">取 消</el-button>
        <el-button type="primary" @click="setStructureSure">确 定</el-button>
      </span>
    </el-dialog>

    <!--恢复出厂设置-->
    <el-dialog
      class="recover"
      title="提示"
      :visible.sync="recoverDialog"
      :show-close="false">
      <i class="el-icon-close close" @click="recoverDialog = false"></i>
      <p class="oneP">
        确定恢复初始设置？
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="recoverDialog = false">取 消</el-button>
        <el-button type="primary" @click="recoverSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as type from '../../../assets/icons/index.js'
import querystring from 'querystring'
import { notice, success } from '../../../api/index.js'
export default {
  name: 'asm',
  data () {
    return {
      subjectLists: [],
      achievementStructure: [
        { partsName: '笔试', partsFullMarks: 100, partsWeight: 100, type: 1 }
      ],
      loading: false,
      dialogShow: false,
      lookDialog: false,
      deleteDialog: false,
      recoverDialog: false,
      list: [],
      type,
      value: '',
      input: '',
      dialogTitle: '',
      checkedAll: false,
      checkAll: false,
      ruleType: '',
      ruleTypeList: [],
      ruleName: '',
      detailsTitle: '查看成绩结构',
      schoolList: [],
      gradeList: [],
      radio: '1',
      modInfo: {
        id: '',
        sectionId: '',
        section: 0,
        sectionName: '',
        name: ''
      },
      sectionList: [],
      subjects: [],
      deleteId: '',
      setTotalDialog: false,
      setStructureDialog: false,
      indexOne: 0,
      indextwo: 0,
      isAddNew: false,
      subjectTotal: 100,
      structureRuleCourses: [],
      structureRuleDetails: [],
      oneInfoId: '',
      allWeight: 0,
      isOne: 0,
      courseId: '',
      oneSubjectName: ''
    }
  },
  created () {
    this.getExamnoList()
  },
  methods: {
    noRepeat (arr) {
      let name = arr.map(item => item.partsName)
      let item = new Set([...name])
      return name.length === item.size
    },
    addOne () {
      let one = { partsName: '', partsFullMarks: 0, partsWeight: 0, type: 2 }
      this.achievementStructure.push(one)
    },
    deleteOne (item, i) {
      this.achievementStructure.splice(i, 1)
    },
    isRecover (item, i) {
      this.isOne = i
      this.courseId = item.courseId
      this.recoverDialog = true
    },
    recoverSure () {
      this.subjectLists[this.isOne].courseFullMarks = 100
      this.subjectLists[this.isOne].courseId = this.courseId
      this.subjectLists[this.isOne].listDetail = []
      this.subjectLists[this.isOne].listDetail.push({courseId: this.courseId, partsName: '笔试', partsFullMarks: 100, partsWeight: 100, type: 1})
      this.recoverDialog = false
    },
    // 设置学科满分
    setTotalSure () {
      this.subjectLists[this.indexOne].courseFullMarks = this.subjectTotal
      this.setTotalDialog = false
    },
    // 设置成绩结构
    setStructureSure () {
      this.allWeight = 0
      for (var i = 0; i < this.achievementStructure.length; i++) {
        this.allWeight += Number(this.achievementStructure[i].partsWeight)
      }
      if (!this.noRepeat(this.achievementStructure)) {
        notice(this, '成绩结构名称不能重复', 2000)
        return
      }
      if (this.allWeight > 100) {
        notice(this, '权重相加不能超过100', 2000)
        return
      }
      if (this.allWeight < 100) {
        notice(this, '权重相加不能少于100', 2000)
        return
      }
      this.subjectLists[this.indextwo].listDetail = this.achievementStructure
      this.setStructureDialog = false
    },
    // 点击设置满分按钮
    setTotal (item, i) {
      this.indexOne = i
      this.subjectTotal = item.courseFullMarks || 100
      this.oneSubjectName = item.name
      let subjectId = this.subjectLists[this.indexOne].courseId
      if (!subjectId) {
        this.subjectLists[this.indexOne].courseId = item.id
      }
      this.setTotalDialog = true
    },
    // 设置成绩结构按钮
    setStructure (item, i) {
      console.log(item)
      this.indextwo = i
      this.oneSubjectName = item.name
      if (!item.listDetail || item.listDetail.length === 0) {
        item.listDetail.push({courseId: item.courseId, partsName: '笔试', partsFullMarks: 100, partsWeight: 100, type: 1})
      }
      this.achievementStructure = item.listDetail.map(one => ({
        ...one
      }))
      this.setStructureDialog = true
    },
    // 新增规则
    async addNew () {
      this.isAddNew = true
      this.dialogShow = true
      this.oneInfoId = ''
      await this.getSection()
      this.modInfo.section = 0
      this.modInfo.sectionId = this.sectionList[0].id
      this.modInfo.name = ''
      await this.getSubjects()
      this.dialogTitle = '新增成绩结构'
    },
    // 查看并编辑
    async lookDetails (item) {
      this.oneInfoId = item.id
      this.modInfo.name = item.name
      this.modInfo.sectionName = item.sectionName
      this.isAddNew = false
      this.lookDialog = true
      await this.$https.get(`/rule/structureDetail?StrRuleId=${item.id}`)
        .then(async res => {
          if (res.data.code === 1) {
            await this.getSection()
            this.sectionList.forEach((items, i) => {
              if (items.id === res.data.result.sectionId) {
                this.modInfo.section = i
                this.modInfo.sectionId = res.data.result.sectionId
              }
            })
            await this.getSubjects()
            this.subjectLists.forEach((oneS, i) => {
              res.data.result.listCourse.forEach((oneD, ind) => {
                if (oneS.id === oneD.courseId) {
                  this.$set(this.subjectLists, i, { ...oneS, ...oneD })
                }
              })
            })
            this.subjectLists = this.subjectLists.map(item => ({
              ...item,
              listDetail: []
            }))
            this.subjectLists.forEach((oneS, i) => {
              res.data.result.listDetail.forEach((oneD, ind) => {
                if (oneS.courseId === oneD.courseId) {
                  oneS.listDetail.push(oneD)
                }
              })
            })
          }
        })
    },
    // 删除详情
    deleteDetails (item) {
      this.isAddNew = false
      this.oneInfoId = item.id
      this.deleteDialog = true
    },
    // 删除
    deleteRule () {
      this.$https.post('/rule/structureDelete', querystring.stringify({
        state: 0,
        struRuleId: this.oneInfoId
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.deleteDialog = false
          this.getExamnoList()
          success(this, res.data.message, 2000)
        } else {
          this.deleteDialog = false
          notice(this, res.data.message || '删除失败', 2000)
        }
      })
    },
    // 查看
    async lookChange (item) {
      if (item) {
        this.oneInfoId = item.id
      }
      this.isAddNew = false
      this.dialogShow = true
      await this.$https.get(`/rule/structureDetail?StrRuleId=${this.oneInfoId}`)
      .then(async res => {
        if (res.data.code === 1) {
          this.modInfo.name = res.data.result.name
          await this.getSection()
          this.sectionList.forEach((items, i) => {
            if (items.id === res.data.result.sectionId) {
              this.modInfo.section = i
              this.modInfo.sectionId = res.data.result.sectionId
            }
          })
          await this.getSubjects()
          this.subjectLists.forEach((oneS, i) => {
            res.data.result.listCourse.forEach((oneD, ind) => {
              if (oneS.id === oneD.courseId) {
                this.$set(this.subjectLists, i, { ...oneS, ...oneD })
              }
            })
          })
          this.subjectLists = this.subjectLists.map(item => ({
            ...item,
            listDetail: []
          }))
          this.subjectLists.forEach((oneS, i) => {
            res.data.result.listDetail.forEach((oneD, ind) => {
              if (oneS.courseId === oneD.courseId) {
                oneS.listDetail.push(oneD)
              }
            })
          })
        }
      })
      this.lookDialog = false
      this.dialogTitle = '编辑成绩结构'
    },
    // 获取列表
    getExamnoList () {
      this.loading = true
      this.$https.get(`/rule/structureList`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.list = res.data.result || []
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存
    saveExamno () {
      if (!this.modInfo.name || this.modInfo.name.trim === '') {
        notice(this, '请输入成绩结构名称', 2000)
        return
      }
      if (!this.modInfo.section && this.modInfo.section !== 0) {
        notice(this, '请选择学段', 2000)
        return
      }
      this.structureRuleCourses = this.subjectLists.map(items => ({
        courseId: items.courseId,
        courseFullMarks: items.courseFullMarks
      }))
      this.structureRuleDetails = []
      this.subjectLists.forEach(items => {
        if (items.listDetail && items.listDetail.length > 0) {
          items.listDetail.forEach(xi => {
            this.structureRuleDetails.push({...xi, courseId: items.courseId})
          })
        }
      })
      this.modInfo.sectionId = this.sectionList[this.modInfo.section].id
      this.modInfo.sectionName = this.sectionList[this.modInfo.section].name
      this.$https.post('/rule/structureSave', querystring.stringify({
        id: this.oneInfoId,
        sectionId: this.modInfo.sectionId,
        structureName: this.modInfo.name,
        structureRuleCourses: JSON.stringify(this.structureRuleCourses),
        structureRuleDetails: JSON.stringify(this.structureRuleDetails)
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 2000)
          this.getExamnoList()
          this.dialogShow = false
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取学段
    async getSection () {
      await this.$https.get(`/common/sectionList`)
      .then(res => {
        if (res.data.code === 1) {
          this.sectionList = res.data.result || []
        }
      })
    },
    // 切换学段
    async switchSection () {
      this.isAddNew = true
      this.modInfo.sectionId = this.sectionList[this.modInfo.section].id
      this.modInfo.sectionName = this.sectionList[this.modInfo.section].name
      this.getSubjects()
    },
    // 根据学段获取学科信息
    async getSubjects () {
      await this.$https.get(`/common/subjectList?sectionId=${this.modInfo.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          if (this.isAddNew) {
            this.subjectLists = (res.data.result || []).map(item => ({
              ...item,
              courseId: item.id,
              courseFullMarks: 100,
              listDetail: [
                {
                  courseId: item.id,
                  partsName: '笔试',
                  partsFullMarks: 100,
                  partsWeight: 100,
                  type: 1
                }
              ]
            }))
          } else {
            this.subjectLists = res.data.result || []
          }
          console.log(this.subjectLists)
        }
      })
    }
  },
  filters: {
    textLength (val) {
      if (val.length > 8) {
        return val.substring(0, 8) + '...'
      } else {
        return val
      }
    }
  }
}
</script>

<style lang="scss">
  .asm {
    .addNewDialog {
      .el-dialog {
        width: 640px !important;
        height: 620px !important;
        .el-dialog__body {
          max-height: 500px !important;
        }
      }
    }
    .tool {
      padding-left: 10px;
      color: #bbb;
    }
    .box,.content-box {
      height: 180px !important;
    }
    .box {
      line-height: 180px !important;
    }
    .content-box {
      .content-box-content {
        line-height: 86px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    }
    .dialog-table-input {
      .el-input__inner {
        width: 400px !important;
      }
    }
    .dialog-table-content {
      > div {
        &:first-child, &:nth-child(2), &:nth-child(3) {
          height: 40px;
          line-height: 40px;
        }
        margin-bottom: 20px;
        &:first-child, &:nth-child(2), &:nth-child(3) {
          margin-bottom: 0;
        }
        > .leftName {
          float: left;
          width: 100px;
          text-align: right;
        }

        > .rightContent {
          float: right;
          width: calc(100% - 120px);
        }
      }
      .oneSubject {
        min-height: 128px;

        > .rightContent {
          p {
            margin-top: 10px;
            margin-bottom: 10px;
            .el-button {
              padding: 10px 24px;
            }
          }
          .lists {
            width: 100%;
            tr {
              height: 40px !important;
              td {
                height: 40px;
                border: 1px solid #ccc;
              }
            }
          }
        } 
      }
    }
    .look-detail {
      .el-dialog {
        width: 640px !important;
        height: 620px !important;
        .el-dialog__body {
          max-height: 500px !important;
        }
      }
      .el-dialog__body {
        max-height: 500px !important;
        .look-detail-content {

          .oneSubject {
            min-height: 95px;

            .lists {
              tr {
                td {
                  &:first-child {
                    background: #efefef;
                  }
                }
              }
            }
          }
        }
      }
    }

    .setTotal {
      .oneP {
        height: 50px;
        line-height: 50px;

        > .oneS {
          display: inline-block;
          width: 100px;
          text-align: right;
          margin-right: 20px;
        }

        > .el-input {
          width: 200px;
        }
      }
    }

    .setStructure {
      .el-dialog {
        width: 680px !important;
        max-height: 620px;
        .el-dialog__body {
          max-height: 500px !important;
        }
        .oneP {
          line-height: 36px;
          margin-bottom: 20px;

          .oneS {
            display: inline-block;
            width: 70px;
            text-align: right;
            margin-right: 20px;
          }

          // > .el-input {
          //   width: 200px;
          // }

          .oneExam {
            // float: right;
            .el-input.is-disabled .el-input__inner {
              color: #333;
            }
            display: inline-block;
            width: calc(100% - 160px);
            height: 36px;
            line-height: 36px;
            background: #ccc;

            span {
              padding: 0 4px;
            }

            > .el-input {
              width: 90px;
            }
          }

          .el-button {
            float: right;
            padding: 10px 4px;
          }
        }
      }
    }

    .el-dialog__footer {
      background: #fff;
    }
  }
</style>