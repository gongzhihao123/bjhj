<template>
    <div class="supervision-record">
      <p>督导记录</p>
      <div class="content">
        <div class="top">
          <span>选择学年：</span>
          <el-select v-model="value" placeholder="请选择学年" @change="getDdjlPage">
              <el-option
                v-for="item in options"
                :key="item.schoolYear"
                :label="item.schoolYearName"
                :value="item.schoolYear">
              </el-option>
            </el-select>
            <el-input v-model="keyword" this. @keyup.enter.native="search" placeholder="请输入督导记录标题"></el-input>
            <el-button @click="search">搜索</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            show-overflow-tooltip
            label="标题"
            align="center">
            <template slot-scope="scope">
              <span @click="look(scope.row)">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="督导日期"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.ddDate | dateFormat('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="上传人"
            align="center">
          </el-table-column>
        </el-table>

        <transition name="slide-left" mode="out-in">
          <div class="right-box" v-click-outside="hide" v-if="boxShow">
            <p>
              <i class="el-icon-close" @click="hide"></i>
            </p>
            <h2>
              {{ title }}
            </h2>
            <div class="confirm">
                <el-row>
                  <el-col :span="5">学期</el-col>
                  <el-col :span="19">{{ Info.schoolYear + '-' + (Info.schoolYear - 1) + '年 第' + Info.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">责任督学</el-col>
                  <el-col :span="19">{{Info.userName}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导学校</el-col>
                  <el-col :span="19">{{Info.schoolName}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导时段</el-col>
                  <el-col :span="19">{{ Info.ddDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导过程</el-col>
                  <el-col :span="19">{{ Info.ddgxName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">同行人员</el-col>
                  <el-col :span="19">
                    <span v-for="(item, index) in Info.userList" :key="index">
                      {{item.peerUserName}}
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导方式</el-col>
                  <el-col :span="19">
                    <span v-for="(item, index) in Info.ddMes" :key="index">
                      {{item.name}}
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">标题</el-col>
                  <el-col :span="19">{{Info.title}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导主要内容</el-col>
                  <el-col :span="19">{{Info.ddContent}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">附件</el-col>
                  <el-col :span="19">
                    <p v-for="(item, index) in Info.fileList" :key="index">
                      {{item.name}}
                      <span class="cursor-pointer blue-color" @click="route(item)">预览</span>
                      <span class="cursor-pointer blue-color" @click="downloadFile(item)">下载</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
          </div>
        </transition>

        <el-pagination
          v-if="totalCount !== 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination> 
      </div>
    </div>
</template>
<script>
import server from '../../utils/axios'
import { mapGetters } from 'vuex'
import { notice } from '../../api/index'
export default {
  name: 'supervision-record',
  data () {
    return {
      ddMethodList: [
        { name: '随机听课', id: 1 },
        { name: '查阅资料', id: 2 },
        { name: '列席会议', id: 3 },
        { name: '座谈走访', id: 4 },
        { name: '问卷调查', id: 5 },
        { name: '校园巡视', id: 6 },
        { name: '访谈家长', id: 7 }
      ],
      boxShow: false,
      title: '',
      content: '',
      totalCount: 0,
      pageNo: 1,
      pageSize: 10,
      schoolYear: '',
      tableData: [],
      options: [],
      value: '',
      keyword: '',
      Info: {}
    }
  },
  methods: {

    route (val) {
      let url
      url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${val.id}`
      window.open(`#/file/fileInfo?id=${val.id}&url=${url}&size=${val.size}`)
    },
    // 下载
    downloadFile (val) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/zgyfkController/downloadFileById?fileId=${val.id}`
    },
    // 搜索
    search () {
      this.getDdjlPage()
    },
    hide () {
      this.boxShow = false
    },
    // 查看详情
    look (val) {
      server.get(`schoolDdjlController/getDdjlDetails?id=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.Info = res.data.result
          this.title = res.data.result.title
          this.content = res.data.result.ddContent
          let data = []
          this.Info.ddMethod.split(',').forEach(item => {
            data.push(this.ddMethodList[Number(item) - 1])
          })
          this.Info.ddMes = data
        } else {
          notice(res.data.message)
        }
      })
      this.boxShow = true
    },
    // 获取学年
    async getSchoolYearAndSemeter () {
      await server.get('/schoolDdjlController/getSchoolYearAndSemeter')
      .then(res => {
        if (res.data.code === 1) {
          this.options = res.data.result.schoolYearSemesterList
          this.value = res.data.result.schoolYearSemesterToWebDto.schoolYear
        } else {
          notice(res.data.message)
        }
      })
    },
    async getDdjlPage () {
      await server.get(`/schoolDdjlController/getDdjlPage?schoolYear=${this.value}&pageNo=${this.pageNo}&pageSize=${this.pageSize}&keyword=${this.keyword}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list
          this.totalCount = res.data.result.totalCount
        } else {
          notice(res.data.message)
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getDdjlPage()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getDdjlPage()
    }
  },
  computed: {
    ...mapGetters([
      'previewUrl',
      'rootUrl',
      'previewInterface'
    ])
  },
  async created () {
    await this.getSchoolYearAndSemeter()
    await this.getDdjlPage()
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';  
.supervision-record {
  padding: 20px;

  .blue-color {
    color: #3FADFF;
  }
  .cursor-pointer {
    cursor: pointer;
    margin-left: 10px;
  }
  .confirm {
    margin-top: $width;
    border: 1px solid #DADADA;
    border-bottom: 0;
    .el-row {
      border-bottom: 1px solid #DADADA;
    }
    .el-col {
      border-left: 1px solid #DADADA;
      padding: 8px 5px;
    }
    .el-col:nth-child(1) {
      text-align: center;
      border-left: 0;
    }
    .el-col:nth-child(2) {
    }
  }

  &>p {
    font-family: PingFang-SC-Regular;
    color: #333;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 20px;
  }
  &>.content {
    background: #fff;
    padding-bottom: 20px;
    // min-height: 800px;
    &>.top {
      min-width: 300px;
      float: right;
      padding: 20px;

      .el-input {
        width: 244px;
        height: 40px;
        margin-left: 15px;
        margin-right: 10px;
      }
    }
    .el-table thead {
      tr {
        background-color: #F5F5F5 !important;
        th {
          &>.cell {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #333333;
            font-weight: bold;
            line-height: 22px;
          }
        }
      }
    }
    .el-table__body td {
      &:nth-child(1){
        span{
          cursor: pointer;
        }
      }
      padding: 0px;
      height: 40px;
      line-height: 40px;
    }
    .el-table th.is-leaf {
      padding: 0px !important;
      line-height: 40px; 
      background: #F5F5F5;     
    }

    .right-box {
      position: fixed;
      z-index: 1;
      right: 0;
      top: 50px;
      width: 620px;
      height: calc(100vh - 50px);
      // height: 600px;
      padding: 20px;
      background: #fff;
      border: 1px solid #E6E6E6;
      box-shadow: 0px 0px 4px 0 rgba(0,0,0,0.28);
      overflow-x: hidden;

      &>p:nth-child(1) {
        text-align: right;
        i {
          cursor: pointer;
          font-weight: bold;
          font-size: 18px;
        }
      }

      h2 {
        margin-bottom: 20px;
      }
    } 
  }
  .el-pagination {
    margin: 20px;
    text-align: right;
  }
}
</style>

