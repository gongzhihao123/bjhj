<template>
  <div class="communication">
    <div class="left-box">
      <p v-if="list.length === 0" style="text-align: center; padding: 100px; background: #fff;">暂无数据</p>
      <div v-for="item in list" :key="item.name" class="info" @click="lookIn(item)">
        <p>
          <img src="../../../../assets/images/tui-green.png" alt="">
          <span class="title" v-if="item.name.length < 19">{{item.name}}</span>
          <span class="title" v-else>{{item.name.slice(0, 18)}}...</span>
        </p>
        <p>课题编号：{{item.topicCode}}</p>
        <p>课题级别：{{item.topicLevel}}</p>
        <p>课题类别：{{item.typeName}}</p>
        <p>预期成果：
          <span v-if="item.wishResult.indexOf('1') !== -1">专著</span>
          <span v-if="item.wishResult.indexOf('2') !== -1">译著</span>
          <span v-if="item.wishResult.indexOf('3') !== -1">研究报告</span>
          <span v-if="item.wishResult.indexOf('4') !== -1">工具书</span>
          <span v-if="item.wishResult.indexOf('5') !== -1">电脑软件</span>
          <span v-if="item.wishResult.indexOf('6') !== -1">其他</span>
        </p>
        <p>立项单位：{{item.companyName}}</p>
        <p> &nbsp;&nbsp;&nbsp;负责人：{{item.leadUserName}}</p>
        <p>立项日期：{{item.createdTime | dateFormat('yyyy-MM-dd')}}</p>
      </div>

      <el-pagination
        v-if="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>

    </div>
    <aside class="right-box">
      <div>
        <h3 style="padding-top: 5px;">
          <img src="../../../../assets/images/tui-red.png" alt="">
          政策文件</h3>
        <div class="content">
          <p v-for="(item, index) in policyList" :key="item.title" @click="look(item)">
            <span class="gray-block">{{index + 1}}</span>
            <span class="title" v-if="item.titleName.length <= 21">{{item.titleName}}</span>
            <span class="title" v-else>{{item.titleName.slice(0, 20)}}...</span>
          </p>
        </div>
      </div>

      <div class="ranking">
        <h3 style="padding-top: 5px;">
          <img src="../../../../assets/images/tui-blue.png" alt="">
        课题点击排行榜</h3>
        <div class="content">
          <p v-for="(item, index) in subjectList" :key="item.name" @click="lookIn(item)">
            <span class="gray-block top-three">{{index + 1}}</span>
            <span class="title" v-if="item.name.length <= 18">{{item.name}}</span>
            <span class="title" v-else>{{item.name.slice(0, 17)}}...</span>         
          </p>
        </div>
      </div>
    </aside>
    
  </div>
</template>

<script>
import server from '../../../../utils/axios'
import { notice } from '../../../../api/index'
export default {
  name: 'communication',
  data () {
    return {
      pageNo: 1,
      pageSize: 4,
      totalCount: 0,
      policyList: [],
      subjectList: [],
      list: [],
      exceptResultList: [
        { name: '专著', value: false, id: 1 },
        { name: '译著', value: false, id: 2 },
        { name: '研究报告', value: false, id: 3 },
        { name: '工具书', value: false, id: 4 },
        { name: '电脑软件', value: false, id: 5 },
        { name: '其他', value: false, id: 6 }
      ]
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getRecommendList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getRecommendList()
    },
    // 政策文件详情
    look (item) {
      sessionStorage.grovermentId = JSON.stringify(item.id)
      sessionStorage.subFileIds = JSON.stringify(item.subFileIds)
      this.$router.push(`/front/fileInfo`)
    },
    // 课题详情
    lookIn (row) {
      sessionStorage.id = row.id
      let bread = {}
      bread.name = '推介交流'
      bread.url = this.$route.path
      sessionStorage.bread = JSON.stringify(bread)
      sessionStorage.open = JSON.stringify(row.openState)
      this.$router.push('/subjectDetail/intro')
    },
    getRecommendList () {
      server.get(`/frontRecommendController/getRecommendList?pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.list = res.data.result.list
          this.totalCount = res.data.result.totalCount
          // this.list.forEach((item) => {
          //   this.exceptResultList.forEach((child) => {
          //   if (item.wishResult.indexOf(item.id) !== -1) {
          //       item.value = true
          //     }
          //   })
          // })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取政策文件-课题点击排行榜
    getData () {
      server.get(`/frontIndexController/getIndex`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.policyList = res.data.result.tpPolicyList
          this.subjectList = res.data.result.clickList
        }
      })
    }
  },
  created () {
    this.getData()
    this.getRecommendList()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.communication{
  overflow: hidden;
  .left-box {
    float: left;
    width: calc(68% - 80px);
    background: #fff;
    padding: 20px;
    overflow: auto;
    margin-right: 20px;
    .info {
      cursor: pointer;
      width: 357px;
      height: 290px;
      background: #fff;
      float: left;
      border: 1px solid #E7E7E7;
      margin-right: 18px;
      margin-bottom: 20px;
      &:hover {
        box-shadow: 0 0 10px #D4E6FD; 
      }
      p:first-child{
        background: #F8F9FC;
        color: #333333;
        line-height: 60px;
        border-bottom: 1px solid #E7E7E7;
        margin-top: 0px;
        img {
          vertical-align: middle;
          margin-right: 5px;
        }
      }
      p{
        padding-left: 20px;
        margin-top: 10px;
        font-size: 15px;
        color: #999999;
      }
      &:nth-child(even){
        margin-right: 0;
      }
    }
    .el-pagination {
      clear: both;
      margin-top: 20px;
      text-align: center;
    }
  }
  .gray-block{
    display: inline-block;
    width: 18px;
    height: 18px;
    background: #CCCCCC;
    font-weight: bold;
    text-align: center;
    line-height: 18px;
    color: #fff;
  }
  

  .right-box {
    float: left;
    width: 33%;
    &>div {
      background: #fff;
      width: calc(102%);
      height: 337px;
      h3 {
        height: 48px;
        line-height: 48px;
        background: #F8F9FC;
        border-bottom: 1px solid #d9d9d9;
        padding: 0 20px;
        img {
          vertical-align: middle;
          margin-right: 5px;
        }
      }
      .content {
        padding: 0 20px;
        p {
          margin-top: 15px;
          .title {
            padding-left: 10px;
          }
        }
        p:first-child {
          .top-three {
            background: #EF4646;
          }
        }
        p:nth-child(2) {
          .top-three {
            background: #EB6100;
          }
        }
        p:nth-child(3) {
          .top-three {
            background: #F8B551;
          }
        }
      }
    }
    .ranking {
      margin-top: 20px;
    }  
  }
  .title {
    cursor: pointer;
  }
}
</style>
