<template>
  <div class="experts-library">
    <div class="left-box">
      <p v-if="expertList.length === 0" style="text-align: center; padding: 100px; background: #fff;">暂无专家</p>
      <div v-for="item in expertList" :key="item.name" class="people-info">
        <img :src="item.userFace ? item.userFace : face" alt="头像" class="image">
        <p style="font-weight: bold;" class="name">{{item.name}}</p>
        <p>职称数：{{item.titleNum}}个</p>
        <p>单位：{{item.companyName}}</p>
      </div>

      <el-pagination
        v-if="totalCount !== 0"
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
          <p v-for="(item, index) in subjectList" :key="item.title" @click="lookIn(item)">
            <span class="gray-block top-three">{{index + 1}}</span>
            <span class="title" v-if="item.name.length <= 21">{{item.name}}</span>
            <span class="title" v-else>{{item.name.slice(0, 20)}}...</span>
          </p>
        </div>
      </div>
    </aside>
    
    
  </div>
</template>

<script>
import face from '../../../../assets/images/mr(2).jpg'
import server from '../../../../utils/axios'
import { notice } from '../../../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'experts-library',
  data () {
    return {
      face,
      totalCount: 0,
      pageNo: 1,
      pageSize: 6,
      policyList: [],
      expertList: [],
      subjectList: []
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageNo = val
      this.getExpertList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getExpertList()
    },
    // 课题详情
    lookIn (row) {
      sessionStorage.id = row.id
      let bread = {}
      bread.name = '专家库'
      bread.url = this.$route.path
      sessionStorage.bread = JSON.stringify(bread)
      sessionStorage.open = JSON.stringify(row.openState)
      this.$router.push('/subjectDetail/intro')
    },
    // 政策文件详情
    look (item) {
      sessionStorage.grovermentId = JSON.stringify(item.id)
      sessionStorage.subFileIds = JSON.stringify(item.subFileIds)
      this.$router.push(`/front/fileInfo`)
    },
    // 获取专家列表信息
    getExpertList () {
      server.get(`/frontExpertController/getExpertList?pageNo=${this.pageNo}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.totalCount = res.data.result.totalCount
          this.expertList = res.data.result.list
          this.expertList = this.expertList.map(item => ({...item, userFace: item.userFace ? (this.staticUrl + '?filepath=' + item.userFace) : ''}))
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
  computed: {
    ...mapGetters([
      'staticUrl'
    ])
  },
  created () {
    this.getExpertList()
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.experts-library{
  overflow: hidden;
  height: 100%;
  width: 100%;
  .left-box {
    position: relative;
    float: left;
    width: calc(70% - 100px);
    max-height: 100%;
    background: #fff;
    padding: 20px;
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 54px;
    margin-right: 20px;
    .people-info {
      width: 226px;
      height:282px;
      background: #fff;
      float: left;
      margin-right: 18px;
      margin-top: 20px;
      border: 1px solid #E6E6E6;
      padding-top: 40px;
      .image {
        display: block;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 10px auto;
        background: #fff;
      }
      p {
        padding-left: 60px;
        line-height: 22px;
      }

      p:nth-child(2) {
        text-align: center;
        padding: 10px 0 20px;
        position: relative;
        margin-bottom: 20px;
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: calc(50% - 10px);
          width: 20px;
          height: 2px;
          background: #B3B3B3;
        }
      }
    }
    .people-info:hover {
      // border-color: #e5e5e5;
      box-shadow: 0 0 10px #CCE1FD; 
    }

    .el-pagination {
      position: absolute;
      bottom: 10px;
      left: 30%;
      clear: both;
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
    color: #fff;
    line-height: 18px;
  }
  .right-box {
    float: left;
    width: 35%;
    &>div {
      background: #fff;
      width: calc(100% - 40px);
      height: 360px;
      h3 {
        line-height: 50px;
        background: #F8F9FC;
        padding: 0 20px;
        border-bottom: 1px solid #d9d9d9;
        img {
          vertical-align: middle;
          margin-right: 5px;
        }
      }
      .content {
        padding: 0 20px;
        p {
          margin-top: 17px;
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
  .title  {
    cursor: pointer;
  }
}
</style>
