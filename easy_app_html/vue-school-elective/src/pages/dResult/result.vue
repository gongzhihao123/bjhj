<template>
  <div class="result">
    
    <!-- 头部 -->
    <header>
      选课活动：
      <el-select v-model="value" @change="activityChange" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </header>

    <!-- 主体部分 -->
    <main>
      <div class="course-result">
        
        <!-- 左侧树列表 -->
        <div class="course-result-left">
          <el-input
            placeholder="课程名称"
            v-model="filterText">
          </el-input>

          <el-tree
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
            :render-content="renderContent"
            :filter-node-method="filterNode"
            :highlight-current="true"
            ref="tree">
          </el-tree>
        </div>

        <!-- 右侧结果展示 -->
        <div class="course-result-right">

          <p class="elements" v-for="(item, index) in informationList" :key="index">
            <i>{{ item.name }}</i>
            <span>{{ item.result }}</span>
            <el-button v-if="index === 3" :disabled="canExport" @click="daochu" type="success">导出</el-button>
          </p>

          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              label="序号"
              min-width="95">
              <template scope="scope">
                <span>{{ scope && scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="gradeName"
              label="年级"
              min-width="95">
            </el-table-column>
            <el-table-column
              prop="className"
              label="班级"
              min-width="95">
            </el-table-column>
            <el-table-column
              prop="studentName"
              label="学生姓名"
              min-width="95">
            </el-table-column>
            <el-table-column
              prop="score"
              label="学生成绩">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import service from '../../utils/axios.js'
import { notice } from '../../api/index'
import { num } from '../../filters/index'
export default {
  name: 'result',
  data () {
    return {
      options: [],
      tableData: [],
      value: '',
      canExport: true,
      informationList: [
        { name: '任课老师', result: '' },
        { name: '上课地点', result: '' },
        { name: '上课时间', result: '' },
        { name: '学生人数', result: '' }
      ],
      filterText: '',
      data: [],
      defaultProps: {
        children: 'lessonList',
        label: 'name'
      },
      lessonId: ''
    }
  },
  methods: {
    renderContent (h, { node, data, store }) {
      const pop = (
        <el-popover
          placement="top"
          width="100"
          trigger="hover">
          <p tyle="color: #808080">{ data.name }</p>
          <span slot="reference">{ data.name.slice(0, 12) + '...' }</span>
        </el-popover>
      )
      return (
        <span>
          { data.name.length >= 12 ? pop : data.name }
        </span>
      )
    },
    // 导出
    daochu () {
      var path = document.querySelector('#contextPath').value
      window.location.href = `${path}/dResultController/downExcel?lessonId=${this.lessonId}`
    },
    // 点击树列表
    handleNodeClick (val) {
      if (val.companyId) {
        this.lessonId = val.id
        this.getStudentByLessonId()
      }
    },
    // 选课活动修改
    activityChange () {
      this.getTypeAndLessonByActivityId()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取选课活动数据
    getAllElectiveActivity () {
      service.get('/dResultController/getAllElectiveActivity')
      .then(res => {
        if (res.data.code === 1) {
          this.options = res.data.result
          this.value = res.data.result.filter(item => item.activityState === 1)[0].id
          this.getTypeAndLessonByActivityId()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取树列表
    getTypeAndLessonByActivityId () {
      service.get(`/dResultController/getTypeAndLessonByActivityId?activityId=${this.value}&keyword=${''}`)
      .then(res => {
        if (res.data.code === 1) {
          this.data = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取上课学生列表
    getStudentByLessonId () {
      service.get(`dResultController/getStudentByLessonId?lessonId=${this.lessonId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.canExport = false
          let data = res.data.result
          this.informationList = [
            { name: '任课老师', result: data.lessonDetailsDto.teacherName ? data.lessonDetailsDto.teacherName : '--' },
            { name: '上课地点', result: data.lessonDetailsDto.locationName ? data.lessonDetailsDto.locationName : '--' },
            { name: '上课时间', result: data.lessonDetailsDto.week ? `周${num(data.lessonDetailsDto.week)}第${num(data.lessonDetailsDto.section)}节课` : '--' },
            { name: '学生人数', result: data.studentCount }
          ]
          this.tableData = data.studentList
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getAllElectiveActivity()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';

.result {
  margin: $width;

  // 头部
  header {
    padding: $width*2;
    background: $white;
    border-radius: 4px;

    .el-select {
      width: 360px;
      margin-left: $width;
    }
  }

  // 主体部分
  main {
    margin-top: $width/2;
    background: $white;
    padding: $width*2;
    border-radius: 4px;

    .course-result {
      // height: calc(100vh - 355px);
      border: 1px solid #bbb;
      border-radius: 4px;
      display: flex;

      // 左侧树列表
      .course-result-left {
       
        width: 260px;
        box-sizing: border-box;
       
        padding: $width;
      

        .el-input__ {
          border-radius: 4px;
        }

        .el-tree {
          margin-top: $width;
          border: 0;
        }
      }

      // 右侧结果展示
      .course-result-right {
        padding: $width;
        flex: 1;
        border-left: 1px solid #bbb;
        // overflow-x: hidden;

        .elements {
          margin-bottom: $width * 1.5;
          
          i {
            border-left: 2px solid #7BB2FE;
            padding-left: $width/2;
            font-style: normal;
            font-weight: bold;
            color: #7BB2FE;
          }

          &>span {
            margin-left: $width * 5;
          }

          .el-button {
            vertical-align: middle;
            margin-top: -$width/3;
            float: right;
            padding: $width/3 $width*1.5;
          }
        }

        .el-table {
          border:1px solid #BBBBBB;

          th {
            background: #E5E5E5;
            border-right:1px solid #BBBBBB;
            border-bottom:1px solid #BBBBBB;

            .cell {
              background: #E5E5E5;
            }
          }

          td {
            border-right:1px solid #BBBBBB;
            border-bottom:1px solid #BBBBBB;
          }

          .cell {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
