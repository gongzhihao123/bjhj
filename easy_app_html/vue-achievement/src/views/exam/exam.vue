<template>
  <div class="exam">
    <!-- 考试管理列表 -->

    <section class="common-css">

      <!-- 左侧菜单 -->
      <!-- <section class="left-menu">
        <el-tree :data="treeMenu"
                :props="defaultProps">
        </el-tree>
      </section> -->


      <!-- 右侧内容 -->
      <section class="right-content">
        <p>考试管理 > 考试列表</p>

        <div class="exam-table">
          <header class="exam-head">
            <!-- <el-button type="success" class="add-exam" @click="route('/exam/textObj', '', 2)" v-if="(right.indexOf('admin1') > -1) || (right.indexOf('achievement') > -1)">新增考试</el-button> -->
            <el-button type="success" class="add-exam" @click="route('/exam/textObj', '', 2)" v-if="user.achievementManage == 1">新增考试</el-button>
            <span class="name">选择学期</span>
            <el-select v-model="semester" @change="getList">
              <el-option
                v-for="item in semesterList"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

            <span class="name">选择类型</span>
            <el-select v-model="category" @change="getList">
              <el-option
                v-for="item in categoryList"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

            <el-input
              class="searches"
              placeholder="搜索关键词"
              icon="search"
              @keydown.enter.native="getList"
              v-model="search"
              :on-icon-click="getList">
            </el-input>

          </header>


          <section class="table" v-loading="loading">
            <table>
              <tr>
                <th v-for="item in tableHead" :key="item.name">{{ item.name }}</th>
              </tr>
              <tr v-for="(item, i) in tableList" :key="item.name">
                <td @click="route('/examQuery/index', item, 1)" style="cursor: pointer;">{{ i + 1 }}</td>
                <td @click="route('/examQuery/index', item, 1)" style="cursor: pointer;" class="text-name">{{ item.name }}</td>
                <td @click="route('/examQuery/index', item, 1)" style="cursor: pointer;">{{ item.categoryName }}</td>
                <td @click="route('/examQuery/index', item, 1)" style="cursor: pointer;">{{ item.createdTime | dateFormat('yyyy-MM-dd') }}</td>
                <td @click="route('/examQuery/index', item, 1)" style="cursor: pointer;">{{ item.createdUname }}</td>
                <td>
                  <span v-if="item.state == 1">基础信息录入</span>
                  <span v-else-if="item.state == 2">成绩录入</span>
                  <span v-else-if="item.state == 3">成绩查询</span>
                  <span v-else-if="item.state == 4">成绩查询结束</span>
                  <!-- <el-button type="primary" @click="route('/exam/infoEnter', item)" :disabled="!item.scoreRuleId || ((right.indexOf('score') > -1) && (right.indexOf('admin1') == -1) && (right.indexOf('achievement') == -1)) || ((right.indexOf('student') > -1) && (right.indexOf('school_admin') == -1)) || ((right.indexOf('teach') > -1) && (right.indexOf('admin1') == -1) && (right.indexOf('achievement') == -1)) || item.finish == 2">学生信息录入</el-button>
                  <el-button type="primary" @click="route('/exam/checkTest', item)" :disabled="!item.scoreRuleId || ((right.indexOf('score') > -1) && (right.indexOf('admin1') == -1) && (right.indexOf('achievement') == -1)) || (right.indexOf('student') > -1) || (right.indexOf('school_admin') > -1) || item.finish == 2">试卷录入</el-button>
                  <el-button type="primary" @click="route('/exam/scoreEnter', item)" :disabled="!item.scoreRuleId || ((right.indexOf('student') > -1) && (right.indexOf('school_admin') == -1)) || ((right.indexOf('teach') > -1) && (right.indexOf('admin1') == -1) && (right.indexOf('achievement') == -1)) || ((right.indexOf('school_admin') > -1) && (right.indexOf('admin1') == -1) && (right.indexOf('achievement') == -1)) || item.finish == 2">成绩录入</el-button> -->
                </td>
                <!-- <td>
                  <el-button type="success" @click="route('/exam/entering', item)" :disabled="!item.scoreRuleId || item.finish == 2" v-if="(right.indexOf('admin1') > -1) || (right.indexOf('achievement') > -1)">录入情况</el-button>
                  <el-button type="success" @click="route('/achievement', item, 1)" :disabled="!item.scoreRuleId || ((right.indexOf('score') > -1) && (right.indexOf('admin1') == -1) && (right.indexOf('achievement') == -1)) || item.finish == 2">成绩分析</el-button>
                </td> -->
                <td class="info-manage"  v-if="item.achievementManage == 1">
                  <!-- <i @click="route('/exam/textObj', item)"></i> -->
                  <i @click="deleteTest(item)"></i>
                </td>
                <td class="info-manage" v-else></td>
              </tr>
              <tr v-if="tableList.length == 0">
                <td :colspan="7">暂无数据</td>
              </tr>
            </table>

          </section>
        </div>
      </section>

    </section>

    <el-dialog
      title="提示"
      :visible.sync="dialogShow"
      :show-close="false">
      <i class="el-icon-close close" @click="dialogShow = false"></i>
      <span>您确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="deleteList">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import querystring from 'querystring'
import { mapGetters } from 'vuex'
import { success, notice } from '../../api/index.js'
export default {
  name: 'exam',
  data () {
    return {
      loading: false,
      treeMenu: [
        {
          name: '考试列表'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      search: '',
      semester: '',
      semesterList: [],
      category: '',
      categoryList: [],
      tableHead: [
        { name: '序号' },
        { name: '考试名称' },
        { name: '考试类型' },
        { name: '创建日期' },
        { name: '创建人' },
        { name: '状态' },
        { name: '操作' }
      ],
      tableList: [
      ],
      dialogShow: false,
      deleteId: '',
      shows: {
        created: false, // 新建考试
        student: true, // 学生信息
        text: true, // 试卷录入
        achieve: true, // 成绩录入
        info: true, // 录入情况
        achievement: true, // 成绩分析
        manage: true // 编辑，删除
      },
      right: ''
    }
  },

  computed: {
    ...mapGetters([
      'rights',
      'leftMenu',
      'user'
    ])
  },

  async mounted () {
    await this.getSemesterList()
    await this.getCategoryList()
    await this.getList()
    let rights = [ ...this.rights ]
    rights.forEach((item, i) => {
      if (item === 'admin') {
        rights[i] = 'admin1'
      }
    })
    this.right = rights.toString()
  },

  methods: {
    route (r, item, s) {
      if (s !== 1 && s !== 2) {
        let name = item.name
        if (!(!item.name || item.name.length < 16)) {
          name = item.name.slice(0, 16) + '...'
        }
        let obj = { id: item.id, name, gradeId: item.gradeId, sectionId: item.sectionId, scoreRuleId: item.scoreRuleId, semesterId: item.semesterId, companyId: item.companyId, paperId: item.paperId }
        this.$router.push({path: r, query: { obj: JSON.stringify(obj) }})
      } else if (s === 1) {
        item.examId = item.id
        sessionStorage.PARAMS_EXAMID = item.id
        sessionStorage.EXAMINFO = JSON.stringify(item)
        this.$router.push(r)
      } else {
        this.$router.push(r)
      }
    },

    async getList () {
      this.loading = true
      await this.$https.get(`/examQuery/examList?name=${this.search}&categoryId=${this.category}&semesterId=${this.semester}`)
      .then(res => {
        this.loading = false
        if (res.data.code === 1) {
          this.tableList = (res.data.result || [])
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },

    async getSemesterList () {
      await this.$https.get(`/common/semesterList`)
      .then(res => {
        if (res.data.code === 1) {
          this.semesterList = res.data.result
          this.semester = this.semesterList.filter(item => item.state === 1)[0].id
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    async getCategoryList () {
      await this.$https.get(`/examQuery/categoryList`)
      .then(res => {
        if (res.data.code === 1) {
          this.categoryList = res.data.result
        }
      })
    },
    deleteTest (item) {
      this.dialogShow = true
      this.deleteId = item.id
    },
    deleteList () {
      this.$https.post('/examManage/examDelete', querystring.stringify({
        id: this.deleteId
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '删除成功', 2000)
          this.getList()
          this.dialogShow = false
        }
      })
    }
  }

  // mounted () {
  //   console.log(this.rights)
  //   console.log(this.tableList)
  // }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
  .exam {
    height: calc(100% - 20px);
    color: #435a6c;

    .right-content {
      padding: 0 40px 40px;
      height: calc(100% - 20px);

      p {
        height: 66px;
        line-height: 70px;
        font-weight: bold;
      }

      .exam-table {
        background: $white;
        min-width: 1140px;
        padding: 30px;
        height: calc(100% - 126px);

        .upload-demo {
          display: inline-block;
          margin-right: 10px;
        }

        .exam-head {
          min-width: 1140px;
          margin-bottom: 20px;

          .add-exam {
            background: url(../../assets/icons/add-exam.png) no-repeat 4px center;
            background-color: $theme;
            padding-left: 34px;
            border: none;
            &:active {
              opacity: 0.8;
            }
          }

          .el-input {
            width: 260px;
          }

          .name {
            padding: 0 16px;
          }

          .searches {
            margin-left: 16px;
          }
        }

        .table {
          height: calc(100% - 30px);
          overflow: auto;

          table {
            width: 100%;
            // min-width: 1100px;

            .info-manage {

              i {
                display: inline-block;
                vertical-align: middle;
                width: 32px;
                height: 32px;
                cursor: pointer;
                // background: url(../../assets/icons/edit.png) no-repeat 4px center;
                  background: url(../../assets/icons/delete.png) no-repeat 4px center;

                // &:nth-child(2) {
                  // background: url(../../assets/icons/delete.png) no-repeat 4px center;
                // }
              }
            }

            tr {
              td, th {
                height: 40px;
                line-height: 40px;
                border: 1px solid $border-color;
                text-align: center;
              }

              th {
                background: #eef2f5;
              }
            }

            .text-name {
              max-width: 400px;
              word-wrap: break-word;
            }
          }
        }
      }
    }
    .el-tree-node__expand-icon {
      border: transparent;
    }
  }

</style>

