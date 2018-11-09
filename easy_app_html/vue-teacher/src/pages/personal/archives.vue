<template>
  <div class="planning">
    <div class="header">业务档案</div>
    <div class="plannContent">
      <div class="header">
        <div>
          <el-input  :maxlength="20" size="small" placeholder="请输入主题关键字" v-model="theme"></el-input>
          <el-select size="small" clearable v-model="archivesTips" placeholder="请选择类别">
            <el-option
              v-for="(item, index) in archivesType"
              :key="index"
              :label="item"
              :value="index + 1">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="scopeDate"
            size="small"
            type="daterange"
            unlink-panels
            format="yyyy年MM月dd日"
            value-format="yyyy年MM月dd日"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div>
          <el-button size="small" type="success" icon="el-icon-search" @click="search" >搜索</el-button>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addPlaning">新增</el-button>
        </div>
      </div>
      <div class="content" v-loading='loading'>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="basinessDate"
            label="时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="archivesType"
            label="档案类别"
            width="180">
            <template slot-scope="scope">
              <span v-for="(item, index) in archivesType" :key="index" v-if="scope.row.archivesType.indexOf((index + 1) + '') !== -1" >
                {{ item }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="theme"
            label="主题">
          </el-table-column>
          <el-table-column
            label="附件">
            <template slot-scope="scope">
              <div class="prove">
                {{ scope.row.archivesFileName }}
                <i class="iconfont">&#xe62c;</i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-button size="small" @click="down(scope.row)" type="primary">
                  <i class="iconfont">&#xe63b;</i>
                </el-button>
                <el-button size="small" @click="edit(scope.row)" type="success">
                  <i class="iconfont">&#xe62e;</i>
                </el-button>
                <el-button size="small" @click="delArchives(scope.row)" type="danger">
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
        <el-form :model="addArchives" ref="addArchives" label-width="100px" :rules="addPlanRules">
          <el-form-item label="时间范围" prop="basinessDate">
            <el-date-picker
              v-model="addArchives.basinessDate"
              size="small"
              type="date"
              placeholder="请选择时间"
              format="yyyy年MM月dd日"
              value-format="yyyy年MM月dd日">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="档案类别" prop="archivesType">
            <div class="textPlann">
              <el-select size="small" multiple v-model="addArchives.archivesType" placeholder="请选择类别">
              <el-option
                v-for="item in archivesType"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            </div>
          </el-form-item>
          <el-form-item label="主题" prop="theme">
            <div class="textPlann">
              <el-input  :maxlength="20"  type="textarea" v-model="addArchives.theme"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="档案附件">
            <div class="uploadPlann">
              <el-upload
                v-loading='loadUp'
                :before-upload="before"
                :on-success="success"
                :action="uploadPath"
                class="upload"
                multiple
                :show-file-list="false">
                <el-button size="small" type="primary">上传附件</el-button>
              </el-upload>
              {{ file }}
            </div>
          </el-form-item>
        </el-form>
        <div class="footer" slot="footer">
          <el-button type="primary" v-if="plannState" size="small" @click="addPlann('addArchives')">确定</el-button>
          <el-button type="primary" v-else size="small" @click="addPlann('addArchives')">确定</el-button>
          <el-button size="small" @click="cancel('addArchives')" >取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {error} from './../../utils/handle.js'
export default {
  name: 'addArchives',
  data () {
    return {
      scopeDate: '',
      tableData: [{
        basinessDate: '2016年05月02日',
        archivesType: '生活活动',
        theme: '关于加强语文教学的培训',
        archivesFile: '上海市普陀区金沙江路 1518 弄',
        archivesFileName: '上海市普陀区金沙江路 1518 弄'
      }],
      addArchives: {
        basinessDate: '',
        archivesType: '',
        theme: '',
        archivesFile: '',
        archivesFileName: ''
      },
      addPlanRules: {
        basinessDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        archivesType: [
          { required: true, message: '请选择档案类别', trigger: 'blur' }
        ],
        theme: [
          { required: true, message: '请输入主题', trigger: 'blur' }
        ]
      },
      archivesType: ['生活活动', '区域活动', '主题活动', '户外活动', '随笔', '大型活动', '自建活动'],
      archivesTips: '',
      theme: '',
      file: '',
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      plann: false,
      plannState: true,
      totalCount: 11,
      loading: false,
      loadUp: false
    }
  },
  computed: {
    uploadPath () {
      const routePath = document.querySelector('#contextPath').value
      return window.location.origin + routePath + '/common/teacherUpload'
    }
  },
  methods: {
    search () {
      if (this.scopeDate) {
        this.planList(10, this.currentPage, this.scopeDate[0], this.scopeDate[1], this.theme, this.archivesTips)
      } else {
        this.planList(10, this.currentPage, '', '', this.theme, this.archivesTips)
      }
    },
    down (item) {
      window.open(item.archivesFile)
    },
    delArchives (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('delArchives', {
          id: item.id
        })
        this.planList(10, this.tableData.length <= 1 ? this.totalPage - 1 || 1 : this.totalPage || 1)
      })
    },
    before (file) {
      const reg = new RegExp(/[.jpg.JPG.png.PNG]$/)
      this.loadUp = true
      if (!reg.test(file.name)) {
        error('请上传jpg 或 png 图片')
        this.loadUp = false
        return false
      }
    },
    success (data) {
      if (data.code === 1) {
        this.loadUp = false
        this.addArchives.archivesFile = data.result.fileUrl
        this.addArchives.archivesFileName = data.result.fileName
        this.file = data.result.fileName
      }
    },
    handleCurrentChange (item) {
      this.scopeDate = ''
      this.theme = ''
      this.archivesTips = ''
      this.planList(10, item)
    },
    addPlaning () {
      this.file = ''
      this.plann = true
      this.$nextTick(() => {
        this.addArchives = {
          basinessDate: '',
          archivesType: [],
          theme: '',
          archivesFile: '',
          archivesFileName: ''
        }
        this.$refs['addArchives'].resetFields()
      })
      this.plannState = true
    },
    edit (item) {
      this.file = item.planfile
      this.addArchives.basinessDate = item.basinessDate
      this.addArchives.theme = item.theme
      this.addArchives.archivesType = []
      this.archivesType.forEach((elem, index) => {
        if (item.archivesType.indexOf((index + 1) + '') !== -1) {
          this.addArchives.archivesType.push(elem)
        }
      })
      this.addArchives.archivesFile = item.archivesFile
      this.addArchives.archivesFileName = item.archivesFileName
      this.file = item.archivesFileName
      this.plann = true
      this.plannState = false
    },
    addPlann (item) {
      console.log(this.addArchives)
      this.$refs[item].validate(async (valid) => {
        if (valid) {
          if (this.addArchives.archivesFile) {
            let type = []
            this.archivesType.forEach((elem, index) => {
              if (this.addArchives.archivesType.join(',').indexOf(elem) !== -1) {
                type.push(index + 1)
              }
            })
            await this.$store.dispatch('saveArchives', {
              basinessDate: this.addArchives.basinessDate,
              archivesType: type.join(','),
              theme: this.addArchives.theme,
              archivesFile: this.addArchives.archivesFile,
              archivesFileName: this.addArchives.archivesFileName,
              id: this.addArchives.id
            })
            this.planList(10, this.tableData.length >= 10 ? this.totalPage + 1 : this.totalPage || 1)
            this.plann = false
            this.addArchives = {
              basinessDate: '',
              archivesType: '',
              theme: '',
              archivesFile: '',
              archivesFileName: ''
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '请上传业务档案附件'
            })
          }
          this.$refs[item].resetFields()
        } else {
          return false
        }
      })
    },
    cancel (item) {
      this.plann = false
      this.$refs[item].resetFields()
    },
    async planList (pageSize, pageNo, startDate, endDate, keyword, archivesType) {
      this.loading = true
      await this.$store.dispatch('getArchives', {
        pageSize: pageSize,
        pageNo: pageNo,
        startDate: startDate,
        endDate: endDate,
        keyword: keyword,
        archivesType: archivesType
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.archives.archivesList.totalCount
      this.tableData = this.$store.state.archives.archivesList.list
      this.totalPage = this.$store.state.archives.archivesList.totalPage
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
    height: calc(100vh - 135px);
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
      padding: 0 15px;
      color: #85a4ff;
      font-weight: bold;
      border-bottom: 1px solid #e5e5e5;
      div {
        &:nth-child(1) {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          div {
            width: 100%;
            margin-right: 10px;
            &:nth-child(1) {
              width: 150px;
            }
            &:nth-child(2) {
              width: 150px;
            }
            &:nth-child(3) {
              width: 360px;
            }
          }
        }
        &:nth-child(2) {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          width: 600px;
        }
      }
    }
    .content {
      width: 100%;
      padding: 10px;
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
