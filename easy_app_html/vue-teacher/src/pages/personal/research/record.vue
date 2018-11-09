<template>
  <div class="planning">
    <div class="plannContent">
      <div class="header">
        <div></div>
        <div>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addPlaning">新增</el-button>
        </div>
      </div>
      <div class="content" v-loading='loading'>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="topic"
            label="课题名称"
            width="180">
          </el-table-column>
          <el-table-column
            label="课题级别">
            <template slot-scope="scope">
              {{ scope.row.level === 1 ? '国家级课题' : scope.row.level === 2 ? '市级课题' : scope.row.level === 3 ? '区级课题' : scope.row.level === 4 ? '校级课题' : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="myrole"
            label="我的角色">
            <template slot-scope="scope">
              <div>
                {{ scope.row.myrole === 1 ? '负责人' : scope.row.myrole === 2 ? '参与人' : '' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-button @click="editor(scope.row)" size="small" type="success">
                  <i class="iconfont">&#xe62e;</i>
                </el-button>
                <el-button @click="delPlan(scope.row)" size="small" type="danger">
                  <i class="iconfont">&#xe61b;</i>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :title="plannState ? '新增' : '编辑'"
      :visible.sync="plann"
      width="500px">
      <div class="content">
        <el-form :model="workServe" ref="workServe" label-width="100px" :rules="addPlanRules">
          <el-form-item label="课题名称" prop="topic">
            <el-input  :maxlength="20" placeholder="请输入课题名称" v-model="workServe.topic"></el-input>
          </el-form-item>
          <el-form-item label="课题级别" prop="level">
            <div class="textPlann">
              <el-select size="small" v-model="workServe.level" placeholder="请选择类别">
                <el-option
                  v-for="(item, index) in level"
                  :key="item"
                  :label="item"
                  :value="index + 1">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="角色" prop="myrole">
            <el-radio-group v-model="workServe.myrole">
              <el-radio :label="1">负责人</el-radio>
              <el-radio :label="2">参与人</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="footer" slot="footer">
          <el-button v-if="plannState" type="primary" size="small" @click="addPlann('workServe')">确定</el-button>
          <el-button v-else type="primary" size="small" @click="addPlann('workServe')">确定</el-button>
          <el-button size="small" @click="cancel('workServe')" >取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'record',
  data () {
    return {
      scopeDate: '',
      tableData: [],
      workServe: {
        topic: '',
        level: '',
        myrole: ''
      },
      addPlanRules: {
        topic: [
          { required: true, message: '请输入课题名称', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择课题类型', trigger: 'blur' }
        ],
        myrole: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ]
      },
      level: ['国家级课题', '市级课题', '区级课题', '校级课题'],
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      plann: false,
      plannState: true,
      loading: false,
      totalCount: 11
    }
  },
  computed: {
    uploadPath () {
      const routePath = document.querySelector('#contextPath').value
      return window.location.origin + routePath + '/common/teacherUpload'
    }
  },
  methods: {
    handleCurrentChange (item) {
      this.planList(10, item)
    },
    addPlaning () {
      this.file = ''
      this.plann = true
      this.plannState = true
      this.$nextTick(() => {
        this.workServe = {
          topic: '',
          level: '',
          myrole: ''
        }
        this.$refs['workServe'].resetFields()
      })
    },
    addPlann (item) {
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          this.level.forEach((elem, index) => {
            if (this.workServe.level === elem) {
              this.workServe.level = index + 1
            }
          })
          await this.$store.dispatch('saveRecord', this.workServe)
          this.planList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
          this.plann = false
        } else {
          return false
        }
      })
    },
    delPlan (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('delRecord', {
          id: item.id
        })
        this.planList(10, this.tableData.length <= 1 ? this.totalPage - 1 || 1 : this.totalPage || 1)
      })
    },
    editor (item) {
      this.workServe.topic = item.topic
      this.level.forEach((elem, index) => {
        if (item.level === index + 1) {
          this.workServe.level = elem
        }
      })
      this.workServe.myrole = item.myrole
      this.workServe.id = item.id
      this.plann = true
      this.plannState = false
    },
    cancel (item) {
      this.plann = false
      this.$refs[item].resetFields()
    },
    async planList (pageSize, pageNo, startDate, endDate) {
      this.loading = true
      await this.$store.dispatch('getRecord', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.research.recordList.totalCount
      this.tableData = this.$store.state.research.recordList.list
      this.totalPage = this.$store.state.research.recordList.totalPage
      this.loading = false
    }
  },
  mounted () {
    this.planList(10, 1)
  }
}
</script>
<style lang='scss' scoped>
.planning {
  padding: 22px;
  padding-top: 0px;
  > .header {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    &::before {
      height: 15px;
      width: 3px;
      content: '';
      display: block;
      background: #4c73eb;
      margin-top: 2px;
      margin-right: 10px;
    }
  }
  .plannContent {
    width: 100%;
    height: calc(100vh - 187px);
    background: #fff;
    margin-top: 10px;
    border-radius: 5px;
    box-sizing: border-box;
    > .header {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #85a4ff;
      font-weight: bold;
      border-bottom: 1px solid #e5e5e5;
    }
    .content {
      width: 100%;
      height: calc(100% - 90px);
      overflow: auto;
    }
  }
  .operation {
    button {
      padding: 5px;
      width: 25px;
      height: 25px;
    }
  }
  .prove {
    color: #97acff;
  }
  .uploadPlann {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding-right: 10px;
    font-size: 16px;
    color: #97acff;
  }
  .textPlann {
    width: 350px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
