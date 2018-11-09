<template>
  <div class="scoreEnter">
    <!-- 学生信息录入 -->

    <section class="common-css">

      <!-- 左侧菜单 -->
      <!-- <section class="left-menu">
        <el-tree :data="treeMenu"
                :highlight-current="true"
                @node-click="handleClick"
                :props="defaultProps">
        </el-tree>
      </section> -->


      <!-- 右侧内容 -->
      <section class="right-content"
        v-loading="loadingImport"
        element-loading-text="正在导入,请稍后..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <p class="content-head">考试管理 > {{ examInfo.name }} > 成绩录入
          <el-button type="primary" @click="route('/exam')">
            <i><</i>
            返回考试列表
          </el-button>
        </p>

        <div class="exam-table">
          <router-view ref="enter" @from-child-msg="uploadDialog"></router-view>
        </div>
        
        
      </section>

    </section>

    

  </div>
</template>

<script>
import { notice } from '../../../api/index.js'
export default {
  name: 'scoreEnter',
  data () {
    return {
      loadingImport: false,
      treeMenu: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      examInfo: {
        name: '',
        id: ''
      },
      searchStudent: '',
      semester: '',
      semesterList: [],
      genre: '',
      genreList: [],
      phase: {
        gradeId: '',
        sectionId: '',
        scoreRuleId: '',
        semesterId: '',
        companyId: '',
        schoolList: []
      }
    }
  },
  created () {
    let obj = JSON.parse(sessionStorage.EXAMINFO)
    console.log(obj)
    this.examInfo.id = obj.id
    this.examInfo.name = obj.name
    this.phase.gradeId = obj.gradeId
    this.phase.sectionId = obj.sectionId
    this.phase.scoreRuleId = obj.scoreRuleId
    this.phase.semesterId = obj.semesterId
    this.phase.companyId = obj.companyId
    // this.phase.paperId = obj.paperId
    this.getSubjectList()
  },
  methods: {
    // 根据考试获取科目
    getSubjectList () {
      this.$https.get(`/common/courseList?examId=${this.examInfo.id}&scoreRuleId=${this.phase.scoreRuleId}`)
      .then(async res => {
        if (res.data.code === 1) {
          this.treeMenu = (res.data.result || []).map(item => ({...item, name: item.courseName, id: item.courseId}))
          // await this.getCompanyList()
          // this.getClassList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 根据年级获取班级
    getClassList () {
      let schoolList = (this.phase.schoolList || []).map(item => item.schoolId)[0]
      this.$https.get(`/common/gradeClassList?semesterId=${this.phase.semesterId}` +
                      `&gradeId=${this.phase.gradeId}` +
                      `&schoolId=${schoolList}` +
                      `&sectionId=${this.phase.sectionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.treeMenu = this.treeMenu.map(item => ({
            ...item,
            children: (res.data.result || []).map(items => ({
              ...items,
              name: items.className,
              courseName: item.name,
              courseId: item.id,
              classId: items.id,
              paperId: this.phase.paperId,
              examId: this.examInfo.id
            }))
          }))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取考试学校列表
    async getCompanyList () {
      await this.$https.get(`/common/achievementSchoolList?examId=${this.examInfo.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.phase.schoolList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    handleClick (data) {
      // if (data.children) return
      data.gradeId = this.phase.gradeId
      data.paperId = this.phase.paperId
      console.log(data)
      this.$refs.enter.creat(data)
    },
    route (r) {
      this.$router.push(r)
    },
    uploadDialog (val) {
      this.loadingImport = val
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
  .scoreEnter {
    height: calc(100% - 20px);
    color: #435a6c;

    .right-content {
      padding: 0;
      // padding: 0 40px 40px;
      height: calc(100% - 20px);

      p.content-head {
        height: 66px;
        line-height: 70px;
        font-weight: bold;

        .el-button {
          float: right;
          margin-top: 10px;
          line-height: 20px;
          font-weight: normal;

          i {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid $white;
            transform: translateX(-2px) scale(1.1);
            text-align: center;
          }
        }
      }

      .exam-table {
        background: $white;
        padding: 30px;
        height: calc(100% - 126px);
        overflow: auto;

        .upload-demo {
          display: inline-block;
          margin-right: 10px;
        }

        .exam-head {
          margin-bottom: 20px;

          .more-upload, .more-download, .more-submit {
            background: url(../../../assets/icons/upload.png) no-repeat 4px center;
            background-color: $head-bg;
            padding-left: 34px;
            border: none;
            &:active {
              opacity: 0.8;
            }

            &.more-download {
              background-image: url(../../../assets/icons/download.png);
            }
            &.more-submit {
              background: url(../../../assets/icons/submit.png) no-repeat 4px center;
              background-color: $theme;
            }
          }

          .el-input {
            width: 280px;
          }

          .more-enter {
            float: right !important;
          }
        }

        .table {
          height: calc(100% - 30px);
          overflow: auto;

          table {
            // width: 100%;
            // min-width: 1100px;

            .info-manage {

              i {
                display: inline-block;
                vertical-align: middle;
                width: 32px;
                height: 32px;
                cursor: pointer;
                background: url(../../../assets/icons/edit.png) no-repeat 4px center;

                &:nth-child(2) {
                  background: url(../../../assets/icons/delete.png) no-repeat 4px center;
                }
              }
            }

            tr {
              td, th {
                height: 40px;
                line-height: 40px;
                border: 1px solid $border-color;
                text-align: center;

                &.test-input {
                  width: 100px;
                }
                .el-input {
                  
                  input {
                    border: none;
                    text-align: center;
                  }
                }
              }

              th {
                background: #eef2f5;
              }
            }
          }
        }
        .el-pagination {
          text-align: right;
          margin-top: 40px;
          .el-pager li.active {
            background-color: $theme;
            border-color: $theme;
          }
        }
      }
    }
    .el-dialog {
      .download {
        color: $theme;
        text-decoration: underline;
        cursor: pointer;
      }

      p {
        line-height: 34px;
      }
      
      section {
        margin-top: 20px;

        h3 {
          display: inline;
          float: left;
            height: 48px;
            line-height: 48px;
        }

        .upload-demo {
          display: inline;

          .el-upload {
            float: right;
            margin-left: 20px;
            margin-top: 10px;
          }

          ul {
            float: right;
            width: 240px;
            min-height: 40px;
            // transform: translateY(-9px);
            border: 1px solid $border-color;
            border-radius: 6px;
            overflow: hidden;
            // margin-right: 20px;
          }

          .el-upload-list__item-status-label, .el-icon-close {
            display: none;
          }
        }
      }
    }

    // .el-tree {
    //   .el-tree-node > .el-tree-node__content {
    //     background: transparent !important;
    //   }
    //   .is-current {
    //     .el-tree-node__content {
    //       background: #e2efe5 !important;
    //       color: $theme;
    //       font-weight: bold;
    //     }
    //   }
      
      .el-tree-node__expand-icon {
        opacity: 0;
      }
    // }

  }
</style>

