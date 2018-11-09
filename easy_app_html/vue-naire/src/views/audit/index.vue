<template>
  <div id="audit">
    <nav class="nav">
      <ul>
        <li v-for="(item, index) in genreList" :key="index" @click="genreClick(item, index)" :class="{'active': genreInd == index}">{{ item.name }}</li>
      </ul>
      <el-input
        placeholder="请输入关键字"
        icon="search"
        v-model="keyword"
        :on-icon-click="handleIconClick">
      </el-input>
    </nav>
    <section class="list">
      <el-row>
        <el-col :span="12">问卷名称</el-col>
        <el-col :span="4">截止时间</el-col>
        <el-col :span="4">状态</el-col>
        <el-col :span="4">操作</el-col>
      </el-row>
      <el-row v-for="(item, index) in naireList" :key="index">
        <el-col :span="12">
          <span v-if="!item.title || item.title.length < 36"  @click="route('/answer', item)" style="cursor: pointer;">
            {{item.title}}　
          </span>
          <span v-else  @click="route('/answer', item)" style="cursor: pointer;">
            <el-popover placement="bottom" trigger="hover" :content="item.title">
              <span slot="reference" style="cursor:pointer;">
                {{item.title | textLength }}
                <span class="type" v-show="item.type === 3">外部问卷</span>
              </span>
            </el-popover>
          </span>
        </el-col>
        <el-col :span="4">{{item.endTime}}</el-col>
        <el-col :span="4">
          <span v-if="item.overTime" style="color: red;">已过期</span>
          <span v-else-if="item.state == 1" class="state-under-way">待审核</span>
          <span v-else-if="item.state == 2" class="state-unpublish">审核通过</span>
          <!-- <span v-else-if="item.state == 4" style="color: red;">被驳回</span> -->
          <span v-else-if="item.state == 4" style="color: red;">
            <el-popover placement="bottom" trigger="hover" :content="item.rejectReason">
              <span slot="reference" style="cursor:pointer;">
                <span>被驳回</span>
              </span>
            </el-popover>
          </span>

        </el-col>
        <el-col :span="4">
          <el-button v-if="item.overTime" class="state-look-button" @click="route('/answer', item)">查看</el-button>
          <el-button v-else-if="item.state == 1" class="state-unpublish-button" @click="route('/particulars', item)">审核</el-button>
          <el-button v-else class="state-look-button" @click="route('/answer', item)">查看</el-button>
        </el-col>
      </el-row>
    </section>
    <div class="block">
      <el-pagination
        v-show="naireList.length != 0"
        layout="prev, pager, next"
        :page-size="12"
        :current-page="page"
        @current-change="handleCurrentChange"
        :total="totalCount">
      </el-pagination>
    </div>
    <aside class="no-content" v-show="naireList.length == 0">暂无数据</aside>
  </div>
</template>
<script>
import { notice } from '../../api/index.js'
import { dateFormat } from '../../filters/index.js'
export default {
  name: 'audit',
  data () {
    return {
      adminFlag: true,
      totalCount: 100,
      page: 1,
      genreList: [
        { name: '全部', genre: '', state: '' },
        { name: '待审核', genre: '', state: 1 },
        { name: '审核通过', genre: '', state: 2 },
        { name: '审核驳回', genre: '', state: 4 }
      ],
      genreInd: 0,
      keyword: '',
      naireList: [],
      naireId: '',
      val: ''
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    genreClick (item, i) {
      this.genreInd = i
      this.val = item.state
      this.page = 1
      this.getList()
    },
    handleIconClick () {
      this.getList()
    },
    route (s, item) {
      this.$router.push({path: s, query: {naireId: item.naireId, page: this.page, path: '/audit', val: this.val, genreInd: this.genreInd}})
    },
    // 获取列表
    getList () {
      this.$https.get(`/check/nairePage?state=${this.val}&pageNo=${this.page}&pageSize=${12}&keyword=${this.keyword}`)
      .then(res => {
        if (res.data.code === 1) {
          let nowDate = Date.parse(new Date())
          res.data.result.list.forEach(item => {
            if (item.endTime < nowDate) {
              item.overTime = true
            }
          })
          this.naireList = res.data.result.list.map(item => ({...item, endTime: dateFormat(item.endTime, 'yyyy-MM-dd hh:mm'), naireId: item.id}))
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    if (this.$route.query.page) {
      this.page = Number(this.$route.query.page)
      this.genreInd = this.$route.query.genreInd
      this.val = this.$route.query.val
    }
    this.getList()
  },
  filters: {
    textLength (val) {
      if (val) {
        if (val.length > 36) {
          return val.substring(0, 36) + '...'
        } else {
          return val
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/main.scss';
  #audit {
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
    section.list {
      width: 1200px;
      .el-row:first-child {
        margin-top: 20px;
        border: none;
        background: transparent;
      }
      .el-row{
        height: 62px;
        border: 1px solid #e8e8e8;
        line-height: 62px;
        background: #fff;
      }
      .el-col:first-child {
        text-align: left;
        padding-left: 20px;
      }
      .el-col:last-child {
        padding-right: 20px;
      }
      .el-col {
        text-align: center;
      }
      .type {
        background: #19b955;
        color: #fff;
        margin-left: 38px;
        border-radius: 2px;
      }
      .state-unpublish {
        color: $theme;
      }
      .state-under-way {
        color: $yellow;
      }
      .state-finish {
        color: $darkRed;
      }
      .state-unpublish-button {
        background: #19b955;
        border-color: #19b955;
        color: #fff;
      }
      .state-look-button {
        background: #20a1ff;
        border-color: #20a1ff;
        color: #fff;
      }
    }
    .block {
      width: 1200px;
      text-align: center;
      height: 30px;
      margin: 20px auto;
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
  }
</style>
