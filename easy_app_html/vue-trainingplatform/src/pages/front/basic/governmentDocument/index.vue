<template>
  <div class="government-dovument">
    <div class="left-content">
      <div class="left">
          <div class="title-head">
            <h2><img src="../../../../assets/images/policy.png">政策文件</h2>
          </div>
          <ul>
            <li v-for="(item, index) in groverment" :key="index">
              <span class="text" v-if="item.policyType === 1">[文件发布]</span>
              <span class="text" v-if="item.policyType === 2">[资料提交]</span>
              <p @click="route(item)" class="title">{{item.titleName}}</p>
              <p class="line"></p>
              <p>{{item.createdTime | dateFormat('yyyy-MM-dd')}}</p>
            </li>
          </ul>
        <el-pagination
          v-if="groverment.length !== 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <div class="right-content">
      <div class="right-top">
        <div class="title-head">
            <h2><img src="../../../../assets/images/sort.png">课题点击率排行</h2>
          </div>
          <ul>
            <li v-for="(item, index) in clicks" :key="index">
              <span class="indexNum" :class="{red: index === 0, orange: index === 1, yellow: index === 2}">{{index + 1}}</span>
              <p class="short-title" @click="lookIn(item.id)">{{item.name}}</p>
            </li>
          </ul>        
      </div>

      <div class="right-bottom">
          <div class="title-head">
              <h2><img src="../../../../assets/images/sort.png">推介交流点击排行</h2>
            </div>
            <ul>
                <li v-for="(item, index) in refers">
                  <span class="indexNum" :class="{red: index === 0, orange: index === 1, yellow: index === 2}">{{index + 1}}</span>
                  <p class="short-title" @click="lookIn(item.id)">{{item.name}}</p>
                </li>
            </ul>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../../../../utils/axios.js'
import { notice } from '../../../../api/index.js'
export default {
  name: 'government-dovument',
  data () {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      groverment: [],
      clicks: [],
      refers: []
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    route (item) {
      sessionStorage.grovermentId = JSON.stringify(item.id)
      sessionStorage.subFileIds = JSON.stringify(item.subFileIds)
      this.$router.push(`/front/fileInfo`)
    },
    getData () {
      service.get(`frontPolicyFileController/getPolicyPage?pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.groverment = res.data.result.page.list
          this.totalCount = res.data.result.page.totalCount
          this.clicks = res.data.result.clickTpTopicList
          this.refers = res.data.result.referralsList
        }
      })
    },
    lookIn (id) {
      sessionStorage.id = id
      let bread = {}
      bread.name = '政策文件'
      bread.url = this.$route.path
      sessionStorage.bread = JSON.stringify(bread)
      this.$router.push('/subjectDetail/intro')
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.government-dovument{
    
    display: block;
    clear: both;
    overflow: hidden;


    .red {
      background: #EF4646 !important;
    }
    .orange{
      background: #EB6100 !important;
    }
    .yellow {
      background: #F8B551 !important;
    }

  .indexNum {
    display: block;
    float: left;
    margin-right: 3px;
    width: 17px;
    height: 17px;
    line-height: 17px;
    background: #CCCCCC;
    text-align: center;
    font-weight: bold;
    font-size: 14px; 
    margin-top: 9px;
    color: #fff;
    margin-right: 10px;
  }
  .left-content {
    width: 59.5%;   
    float: left;
    margin-right: 20px;
    position: relative;
    border: 1px solid #EDF1F4;

    .el-pagination {
        position: absolute;
        bottom: 10px;
        right: 0px;
        padding: 20px;

        &>ul {
          &>li {
            line-height: 30px;
            font-size: 14px;
          }
        }        
      }    

    .left {
      /* padding-right: 10px; */   
      background: #fff;
      min-height: 726px;
    
      &>ul {
        clear: both;
        background: #fff;
        padding: 20px;
        li {
          font-size: 16px;
          line-height: 30px;
          border-collapse: separate;
          display: table;
          position: relative;
          width: 100%;

          .line {
            border-bottom: 2px dotted #333;
            vertical-align: middle;
            line-height: 50px;
            position: absolute;
            top: 25px;
            z-index: -1;
            float: left;
            display: table-cell;
          }

          .title {
            float: left;
            display: table-cell;
            max-width: 72%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;            
          }
          &:after {
            @include clearfloat;
          }
          .text {
            color: #2B7FD6;
            width: auto;
            height: auto;
            float: left;
            margin-right: 5px;
            background: #fff;
            display: table-cell;
            font-weight: bold;
            font-size: 14px;
          }
          p {
            float: right;
            font-size: 14px;

            &:hover {
              cursor: pointer;
            }

            &:last-child {
              float: right;
            }
          }
          .short-title {
            width: 90%;
            @include text-overflow;
            /* max-width: 330px; */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;            
          }
        }
      }
    }
    .title-head {
        padding: 20px;
        border-bottom: 1px solid #EDF1F4;
        background: #F8F9FC;

        &:after {
          @include clearfloat;
        }
        h2 {
          float: left;
          font-size: 14px;
          line-height: 25px;

            &>img {
            width: 25px;
            height: 25px;
            float: left;
            margin: 0px 10px 0px 0px;
          }
        }
      }
      &>ul {
        clear: both;
        background: #fff;
        padding: 20px;
        li {
          font-size: 16px;
          line-height: 30px;
          border-collapse: separate;
          display: table;
          position: relative;
          width: 100%;

          .line {
            border-bottom: 2px dotted #333;
            vertical-align: middle;
            line-height: 50px;
            position: absolute;
            top: 25px;
            z-index: -1;
            float: left;
            display: table-cell;
          }

          .title {
            float: left;
            display: table-cell;            
          }
          &:after {
            @include clearfloat;
          }
          .text {
            color: #2B7FD6;
            width: auto;
            height: auto;
            float: left;
            margin-right: 5px;
            background: #fff;
            display: table-cell;
            font-weight: bold;
          }
          p {
            float: right;
            font-size: 14px;

            &:hover {
              cursor: pointer;
            }

            &:last-child {
              float: left;
            }
          }
          .short-title {
            /* width: 90%; */
            @include text-overflow;
            max-width: 390px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;            
          }
        }
      }    
  }
  .right-content {
    width: 38.5%;
    float: left;
    border: 1px solid #EDF1F4;

    .right-top {
      margin-bottom: 20px;
    }

    .right-top, .right-bottom{
      background: #fff;
      min-height: 353px;

      .title-head {
        padding: 20px;
        border-bottom: 1px solid #EDF1F4;
        background: #F8F9FC;

        &:after {
          @include clearfloat;
        }
        h2 {
          float: left;
          font-size: 14px;
          line-height: 25px;

            &>img {
            width: 25px;
            height: 25px;
            float: left;
            margin: 0px 10px 0px 0px;
          }
        }
      }
      ul {
        clear: both;
        background: #fff;
        padding: 20px;
        li {
          font-size: 16px;
          line-height: 30px;
          border-collapse: separate;
          display: table;
          position: relative;
          width: 100%;

          .line {
            border-bottom: 2px dotted #333;
            vertical-align: middle;
            line-height: 50px;
            position: absolute;
            top: 25px;
            z-index: -1;
            float: left;
            display: table-cell;
          }

          .title {
            float: left;
            display: table-cell;           
          }
          &:after {
            @include clearfloat;
          }
          .text {
            color: #2B7FD6;
            width: auto;
            height: auto;
            float: left;
            margin-right: 5px;
            background: #fff;
            display: table-cell;
          }
          p {
            float: right;
            font-size: 14px;

            &:hover {
              cursor: pointer;
            }

            &:last-child {
              float: left;
            }
          }
          .short-title {
            /* width: 90%; */
            @include text-overflow;
            max-width: 390px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;            
          }
        }
      }      
    }
  }
}
</style>
