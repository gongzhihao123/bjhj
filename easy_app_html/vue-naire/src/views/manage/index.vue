<template>
  <div id="manage">
      <nav class="nav">
        <ul>
          <li v-for="(item, index) in genreList" :key="index" @click="genreClick(item, index)" :class="{'active': genreInd == index}" v-show="index != 2 ||user.companyType == 2">{{ item.name }}</li>
        </ul>
        <el-input
          v-if="genreInd == 1"
          placeholder="请输入关键字"
          icon="search"
          :maxlength="20"
          v-model="keyword"
          @keydown.enter.native="handleIconClick"
          :on-icon-click="handleIconClick">
        </el-input>
      </nav>
      <nav class="navs">
        <ul class="quest-genre">
          <li class="li" style="color: #999;">问卷类型：</li>
          <li v-for="(item, index) in questGenre" :key="index" :class="{'active': questInd == index}" @click="quertClick(item, index)">{{ item.name }}</li>
        </ul>
        <el-button class="see-one" v-show="seeOne" @click="see" v-if="genreInd == 0 && school == true">只查看自己</el-button>
        <el-button class="see-all" v-show="!seeOne" @click="see" v-if="genreInd == 0 && school == true">查看所有人</el-button>
      </nav>
      <!--公开问卷表格-->
      <table class="table" v-show="questionnaire.length != 0">
        <thead>
          <tr v-if="genreInd == 0">
            <td v-for="(item, i) in tableHead" :key="i">{{ item.name }}</td>
          </tr>
          <tr v-else>
            <td v-for="(item, i) in tableHeadIn" :key="i">{{ item.name }}</td>
          </tr>
        </thead>
        <tbody v-if="genreInd == 0">
          <tr v-for="(item, i) in questionnaire" :key="i">
            <td v-if="!item.title || item.title.length < 21" @click="nairePreview(item)">{{ item.title }}</td>
            <td v-else @click="nairePreview(item)">
              <el-tooltip class="item" effect="light" :content="item.title" placement="bottom">
                <span>{{ item.title | textLength }}</span>
              </el-tooltip>
            </td>
            <td>{{ item.createdTime }}</td>
            <td>{{ item.endTime }}</td>
            <td>{{ item.returnCount }}</td>
            <td>{{ item.categoryName }}</td>
            <td>{{ item.createdUserName }}</td>
            <td v-if="item.state == 4">
              <span>被驳回</span>
            </td>
            <td v-else-if="item.state == 3">
              <span>已下线</span>
            </td>
            <td v-else-if="item.overtimeFlag || item.overcountFlag">
              <span class="state-finish">已结束</span>
            </td>
            <td v-else>
              <span v-if="item.state == 0" class="state-under-way">未发布</span>
              <span v-else-if="item.state == 1" class="state-under-way">待审核</span>
              <span v-else-if="item.state == 2" class="state-unpublish">进行中</span>
              <span v-else>已下线</span>
            </td>
            <td class="select" @click="clickOne(item)">
              <aside>
                <i class="el-icon-more"></i>
              </aside>
              <el-select v-model="item.select" placeholder="请选择">
                <el-option
                  @click.native="changeOne(item, items)"
                  v-for="items in item.selectList"
                  :key="items.name"
                  :label="items.name"
                  :value="items.state">
                </el-option>
              </el-select>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(item, i) in questionnaire" :key="i">
            <td v-if="!item.title || item.title.length < 21" @click="nairePreview(item)">{{ item.title }}</td>
            <td v-else @click="nairePreview(item)">
              <el-tooltip class="item" effect="light" :content="item.title" placement="bottom">
                <span>{{ item.title | textLength }}</span>
              </el-tooltip>
            </td>
            <td>{{ item.createdTime }}</td>
            <td>{{ item.endTime }}</td>
            <td v-if="item.joinWay == 1">实名</td>
            <td v-else>匿名</td>
            <td>{{ item.categoryName }}</td>
            <!--<td>
              <span v-if="item.state == 0" class="state-under-way">未发布</span>
              <span v-else-if="item.state == 1 && item.overcountFlag == false && item.overtimeFlag == false" class="state-unpublish">进行中</span>
              <span v-else-if="item.state == 2 || item.state == 1 && item.overcountFlag == true || item.state == 1 &&item.overtimeFlag == true" class="state-finish">已结束</span>
              <span v-if="item.state == 3">已下线</span>
            </td>-->
            <td v-if="item.state == 4">
              <span>被驳回</span>
            </td>
            <td v-else-if="item.state == 3">
              <span>已下线</span>
            </td>
            <td v-else-if="item.overtimeFlag || item.overcountFlag">
              <span class="state-finish">已结束</span>
            </td>
            <td v-else>
              <span v-if="item.state == 0" class="state-under-way">未发布</span>
              <span v-else-if="item.state == 1" class="state-under-way">待审核</span>
              <span v-else-if="item.state == 2" class="state-unpublish">进行中</span>
              <span v-else>已下线</span>
            </td>
            <td class="select" @click="clickOne(item)">
              <aside>
                <i class="el-icon-more"></i>
              </aside>
              <el-select v-model="item.select" placeholder="请选择">
                <el-option
                  @click.native="changeOne(item, items)"
                  v-for="items in item.selectList"
                  :key="items.name"
                  :label="items.name"
                  :value="items.state">
                </el-option>
              </el-select>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="block" v-show="questionnaire.length != 0">
        <el-pagination
          layout="prev, pager, next"
          :page-size="12"
          :current-page="pageNo"
          @current-change="handleCurrentChange"
          :total="totalCount">
        </el-pagination>
      </div>
      <aside class="no-content" v-show="questionnaire.length == 0">暂无数据</aside>
      
      <!--弹框提醒-->
      <el-dialog
        title="延期"
        class="dialog-remind"
        top="15%"
        size="tiny"
        :visible.sync="remind">
        <p>
          <el-date-picker
            v-model="endDate"
            type="datetime"
            :editable="false"
            :picker-options="pickerOptions"
            placeholder="选择日期时间" class="input">
          </el-date-picker>
        </p>
        <div class="button-group">
          <el-button @click="remind = false">取消</el-button>
          <el-button type="success" @click="sureSave">保存</el-button>
        </div>
      </el-dialog>
      <!--<div class="aside">
        <answer :details="templatePre" v-if="printNaire"></answer>
      </div>-->
    <!--预览-->
    <el-dialog
      class="choose-template"
      top="10%"
      :visible.sync="printNaire">
      <answer :details="templatePre">
        <p slot="header" v-if="genreInd == 0" v-show="previewPublish">问卷链接：<span>{{url}}</span></p>
        <a slot="image" v-if="genreInd == 0" v-show="previewPublish" :href="drowImage" download="code.png">
          <img :src="drowImage" alt="二维码">
        </a>
      </answer>
    </el-dialog>
    <aside class="dialog-aside" v-if="printNaire && rejectState == 4">
      <section class="section">
        <el-button @click="printNaire = false">关闭</el-button>
        问卷状态：
        <span style="color: red;margin-right: 20px;">被驳回</span>
        驳回原因：
        <el-tooltip class="item" effect="light" :content="remark" placement="bottom" v-show="remark">
           <span>{{ remark | textLength }}</span> 
        </el-tooltip>
      </section>
    </aside>
      
  </div>
</template>
<script>
import {dateFormat} from '../../filters/index.js'
import { notice, success, error } from '../../api/index.js'
import { mapGetters } from 'vuex'
import answer from '../../components/details'
export default {
  name: 'manage',
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      school: false,
      remind: false,
      endDate: '',
      genreList: [
        { name: '公开问卷', genre: '' },
        { name: '内部问卷', genre: '' },
        { name: '外部问卷', genre: '' }
      ],
      genreInd: 0,
      questGenre: [],
      keyword: '',
      questInd: 0,
      tableHead: [
        { name: '问卷名称' },
        { name: '开始时间' },
        { name: '截止时间' },
        { name: '回收量' },
        { name: '类型' },
        { name: '创建人' },
        { name: '状态' },
        { name: '操作' }
      ],
      tableHeadIn: [
        { name: '问卷名称' },
        { name: '创建时间' },
        { name: '截至时间' },
        { name: '是否匿名' },
        { name: '类型' },
        { name: '状态' },
        { name: '操作' }
      ],
      questionnaire: [],
      selectList: [
        { name: '发布', state: 1 },
        { name: '编辑', state: 0 },
        { name: '删除', state: 2 },
        { name: '下线', state: 4 },
        { name: '打印', state: 0 },
        { name: '统计结果', state: 0 }
      ],
      select: '',
      seeOne: true,
      totalCount: 0,
      naireId: '',
      categoryId: '',
      pageNo: 1,
      templatePre: {},
      printNaire: false,
      url: '',
      previewPublish: false,
      drowImage: '',
      rejectState: '',
      remark: ''
    }
  },
  components: {
    answer
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    genreClick (item, i) {
      this.pageNo = 1
      this.genreInd = i
      this.questInd = 0
      this.getType()
    },
    quertClick (item, i) {
      this.questInd = i
      this.pageNo = 1
      this.categoryId = item.id
      this.getList()
    },
    route (item) {
      let obj = JSON.stringify({
        naireId: item.id,
        genreInd: this.genreInd,
        categoryId: this.categoryId,
        keyword: this.keyword,
        pageNo: this.pageNo,
        questInd: this.questInd
      })
      this.$router.push({path: '/details', query: {obj}})
    },
    handleIconClick () {
      // console.log(this.keyword)
      this.getList()
    },
    see () {
      this.seeOne = !this.seeOne
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    // 获取问卷类型公共接口
    getType () {
      this.$https.get(`/common/naireCategoryList?openType=${this.genreInd + 1}`)
      .then(res => {
        if (res.data.code === 1) {
          this.questionnaire = []
          this.questGenre = res.data.result
          // if (!this.categoryId) {
          this.categoryId = res.data.result[0].id
          // }
          this.getList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取问卷列表
    getList (val) {
      this.$https.get(`/manage/nairePage?type=${this.genreInd + 1}&categoryId=${this.categoryId}&keyword=${this.keyword}&pageNo=${this.pageNo}&pageSize=${12}`)
      .then(res => {
        this.totalCount = res.data.result.totalCount
        this.questionnaire = res.data.result.list
        this.questionnaire.forEach(item => {
          item.createdTime = dateFormat(item.createdTime, 'yyyy-MM-dd hh:mm:ss')
          item.endTime = dateFormat(item.endTime, 'yyyy-MM-dd hh:mm:ss')
          item.select = ''
          if (item.state === 4) {
            item.selectList = [
              { name: '查看', state: 8 }
            ]
          } else if (item.state === 3) {
            item.selectList = [
              { name: '打印', state: 2 },
              { name: '统计结果', state: 3 }
            ]
          } else if (item.overtimeFlag || item.overcountFlag) {
            item.selectList = [
              { name: '下线', state: 1 },
              { name: '打印', state: 2 },
              { name: '统计结果', state: 3 }
            ]
          } else {
            if (item.state === 0) {
              item.selectList = [
                { name: '发布', state: 4 },
                { name: '编辑', state: 5 },
                { name: '删除', state: 6 },
                { name: '打印', state: 2 }
              ]
            } else if (item.state === 1) {
              item.selectList = [
                { name: '打印', state: 2 },
                { name: '统计结果', state: 3 }
              ]
            } else if (item.state === 2) {
              item.selectList = [
                { name: '延期', state: 0 },
                { name: '下线', state: 1 },
                { name: '打印', state: 2 },
                { name: '统计结果', state: 3 }
              ]
            } else if (item.state === 3) {
              item.selectList = [
                { name: '打印', state: 2 },
                { name: '统计结果', state: 3 }
              ]
            }
          }
        })
      })
    },
    sureSave () {
      let s = this.endDate.getTime()
      let a = Date.parse(new Date())
      if (a > s) {
        notice(this, '截止时间不小于当前时间', 2000)
        return
      }
      this.$https.get(`/manage/naireStateUpdate?naireId=${this.naireId}&type=3&endDate=${s}`)
      .then(res => {
        if (res.data.code === 1) {
          this.getList()
          this.remind = false
          success(this, res.data.message, 2000)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 比较器
    compare (propertyName) {
      return (obj1, obj2) => {
        let val1 = obj1[propertyName]
        let val2 = obj2[propertyName]
        if (val2 < val1) {
          return 1
        } else if (val2 > val1) {
          return -1
        } else {
          return 0
        }
      }
    },
    // 单击列表获取详情
    nairePreview (item) {
      this.printNaire = true
      this.previewPublish = true
      this.rejectState = item.state
      // console.log(item.state)
      this.remark = item.rejectReason
      this.drowImage = `/naire/common/naireQrcodeView?naireId=${this.naireId || item.id}&type=${1}`
      // if (!item.overtimeFlag && !item.overcountFlag) {
        // if (item.state === 2 || item.state === 1) {
          // this.previewPublish = true
          // this.drowImage = `/naire/common/naireQrcodeView?naireId=${this.naireId || item.id}&type=${1}`
          // this.$https.get(`/publish/naireRelease?naireId=${this.naireId}&type=${1}`)
          // .then(res => {
          //   this.url = res.data.split('result":"')[1].split('"}')[0]
          // })
        // }
      // }
      this.$https.get(`/index/naireDetail?naireId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res.data.result)
          this.templatePre = res.data.result
          this.url = this.templatePre.url
          this.templatePre.qNum = this.templatePre.questions.filter(item => item.questionType !== 4).length
          this.templatePre.questions = this.templatePre.questions.map(item => ({...item, checked: ''}))
          this.templatePre.questions.forEach(item => {
            if (item.questionType === 1) {
              item.options.sort(this.compare('radioboxSort'))
              item.checked = ''
            } else if (item.questionType === 2) {
              item.options.sort(this.compare('checkboxSort'))
              item.options = item.options.map(items => ({...items, checked: false}))
            } else if (item.questionType === 3) {
              item.answer = ''
            }
          })
          let i = 1
          this.templatePre.questions.forEach(item => {
            if (item.questionType !== 4) {
              item.sorts = i++
            }
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 修改列表接口
    changeOne (item, items) {
      this.naireId = item.id
      this.endDate = item.endTime
      let type, yOrN
      if (items.state === 0) {
        this.remind = true
      } else if (items.state === 1) {
        type = 4
        yOrN = true
      } else if (items.state === 2) {
        this.printNaire = true
        this.rejectState = 0
        this.$https.get(`/index/naireDetail?naireId=${item.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.templatePre = res.data.result
            this.rejectState = this.templatePre.state
            this.templatePre.qNum = this.templatePre.questions.filter(item => item.questionType !== 4).length
            this.templatePre.questions = this.templatePre.questions.map(item => ({...item, checked: ''}))
            this.templatePre.questions.forEach(item => {
              if (item.questionType === 1) {
                item.options.sort(this.compare('radioboxSort'))
                item.checked = ''
              } else if (item.questionType === 2) {
                item.options.sort(this.compare('checkboxSort'))
                item.options = item.options.map(items => ({...items, checked: false}))
              } else if (item.questionType === 3) {
                item.answer = ''
              }
            })
            let i = 1
            this.templatePre.questions.forEach(item => {
              if (item.questionType !== 4) {
                item.sorts = i++
              }
            })
            setTimeout(() => {
              const newWindow = window.open('打印窗口', '_blank')
              const doStr = document.querySelector('#commonDetails').innerHTML
              newWindow.document.write(doStr)
              const noprint = newWindow.document.querySelectorAll('.print')
              Array.from(noprint).forEach(item => {
                item.style.display = 'none'
              })
              const cell = newWindow.document.querySelectorAll('.cell')
              Array.from(cell).forEach(item => {
                item.style.lineHeight = '40px'
              })
              const ar = newWindow.document.querySelectorAll('tr')
              Array.from(ar).forEach(item => {
                item.style.border = '1px solid #dfe6ec'
              })
              newWindow.document.close()
              newWindow.print()
              newWindow.close()
            }, 1000)
          } else {
            notice(this, res.data.message, 2000)
          }
        })
        yOrN = false
      } else if (items.state === 3) {
        // 统计结果
        yOrN = false
        this.route(item)
      } else if (items.state === 4) {
        type = 1
        yOrN = true
      } else if (items.state === 5) {
        // bianji
        yOrN = false
        this.$router.push({path: 'naireType', query: {naireId: this.naireId}})
      } else if (items.state === 6) {
        type = 2
        yOrN = true
      } else if (items.state === 8) {
        this.nairePreview(item)
        yOrN = false
      }
      if (yOrN) {
        this.$https.get(`/manage/naireStateUpdate?naireId=${item.id}&type=${type}&endDate=${''}`)
        .then(res => {
          if (res.data.code === 1) {
            this.getList()
            success(this, res.data.message, 2000)
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }
    },
    // 获取问卷id
    clickOne (item) {
      // console.log(item)
      // this.naireId = item.id
    }
  },
  filters: {
    textLength (val) {
      if (val.length > 21) {
        return val.substring(0, 21) + '...'
      } else {
        return val
      }
    }
  },
  created () {
    if (typeof this.$route.query.obj === 'string') {
      let obj = JSON.parse(this.$route.query.obj)
      this.genreInd = obj.genreInd
      this.categoryId = obj.categoryId
      this.keyword = obj.keyword
      this.pageNo = obj.pageNo
      this.questInd = obj.questInd
      console.log(obj.categoryId)
    }
    this.getType()
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/main.scss';
  #manage {
    .nav {
      margin-top: 14px;
      border-bottom: 1px solid $border;
      li {
        display: inline-block;
        width: 94px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        margin-right: $width;
        cursor: pointer;
        transition: all 0.6s;
        &.active {
          background: $theme;
          color: $white;
        }
      }
      ul {
        display: inline-block;
      }
      .el-input {
        float: right;
        width: 274px;
        height: 36px;
      }
    }
    .navs {
      // color: #999;
      
      .el-button {
        float: right;
        padding-left: 28px;
        margin-top: 20px;
      }
      .see-one {
        background: url(../../assets/images/see-one.png) no-repeat 8px center;
      }
      .see-all {
        background: url(../../assets/images/see-all.png) no-repeat 8px center;
      }
    }
    .quest-genre {
      height: 24px;
      line-height: 24px;
      margin: 20px 0;
      display: inline-block;
      li {
        display: inline-block;
        margin: 0 14px;
        
        &.active {
          border-bottom: 2px solid $theme;
          color: $theme;
        }
        &:not(.li) {
          cursor: pointer;
        }
      }
    }
    .table {
      width: 1200px;
      td {
        padding-left: 30px;
        height: 48px;
        &:last-child {
          padding: 0;
          text-align: center;
        }
      }
      tbody {
        border: 1px solid $border;
        td {
          background: $white;
          border-bottom: 1px dashed $border;
          .state-unpublish {
            color: $theme;
          }
          .state-under-way {
            color: $yellow;
          }
          .state-finish {
            color: $darkRed;
          }
          .item {
            clear: both;
            position: relative;
          }
          &.select {
            position: relative;
            width: 97px;
            height: 48px;
            .el-input__inner, .el-input__icon {
              opacity: 0;
              height: 48px;
            }
            aside, .el-select {
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              text-align: center;
              .el-select-dropdown__item {
                text-align: center;
              }
            }
            aside {
              line-height: 48px;
            }
          }
          &:first-child {
            cursor: pointer;
          }
        }
      }
    }
    .block {
      max-width: 1200px;
      text-align: center;
      height: 30px;
      margin: 50px auto;
      padding-bottom: 26px;
      color: #333;
      .el-pager{
        li {
          width: 40px;
          height: 40px;
          border: none;
          line-height: 40px;
        }
        li:hover{
          color: #19b955;
        }
        li.active {
          border-color: #19b955;
          background-color: #19b955;
          color: #fff;
          cursor: default;
        }
      }
      .el-pagination button {
        width: 40px;
        height: 40px;
        border: none;
      }
      .el-pagination button:hover{
        color: #19b955;
      }
    }
    .dialog-remind {
      .el-date-editor {
        width: 300px;
      }
    }
    .aside {
      position: absolute;
      left: -10000px;
    }
    .choose-template {
      .el-dialog {
        width: 1200px;
      }
    }
    .details-header {
      position: relative;
      a {
        position: absolute;
        right: 2px;
        top: 2px;
        img {
          width: 140px;
          height: 140px;
        }
      }
    }
    .dialog-aside {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      height: 50px;
      background: #fff;
      z-index: 20000;
      box-shadow: 0 3px 3px #ccc;
      section {
        padding: 8px;
        width: 1200px;
        margin: 0 auto;
        line-height: 40px;
        .el-button {
          float: right;
        }
      }
    }
  }
  .el-tooltip__popper, .is-light {
    z-index: 3000;
    word-wrap: break-word;
    max-width: 800px;
    // left: 200px !important;
    // right: 200px;
  }
  .el-select-dropdown__item {
    text-align: center;
    &:hover {
      background: #e4e8f1;
    }
  }
</style>
