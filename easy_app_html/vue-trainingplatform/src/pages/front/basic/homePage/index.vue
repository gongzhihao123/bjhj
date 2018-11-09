<template>
  <div class="home-page">
    <div class="content">
        <div class="content-left">
            <div class="title-head">
              <h2><img src="../../../../assets/images/policy.png">政策文件</h2>
              <el-button type="text" @click="$router.push('/governmentDocument/index')">更多>></el-button>
            </div>
            <ul class="list">
                <li v-for="(item, index) in groverment" :key="index">
                  <span>{{index + 1}}</span>
                  <p @click="look(item)">{{item.titleName}}</p>
                  <p>{{item.createdTime | dateFormat('yyyy-MM-dd')}}</p>
                </li>
            </ul>
          </div>
          <div class="content-right">
            <div class="title-head">
              <h2><img src="../../../../assets/images/sort.png">课题点击率排行</h2>
            </div>
            <ul class="list">
              <li v-for="(item, index) in clicks" :key="index">
                <span :class="{red: index === 0, orange: index === 1, yellow: index === 2}">{{index + 1}}</span>
                <p class="short-title" @click="lookIn(item)">{{item.name}}</p>
              </li>
            </ul>
          </div>
    </div>
    <div class="content">
        <div class="content-left">
            <div class="title-head">
                <h2><img src="../../../../assets/images/now.png">正在进行的课题</h2>
                <el-button type="text" @click="$router.push('/subjectLibrary/subjectList')">更多>></el-button>
              </div>
              <ul class="list">
                  <li v-for="(item, index) in marchTopic" :key="index">
                    <span>{{index + 1}}</span>
                    <p @click="lookIn(item)">{{item.name}}</p>
                    <p>{{item.createdTime | dateFormat('yyyy-MM-dd')}}</p>
                  </li>
              </ul>          
        </div>
        <div class="content-right">
          <div class="title-head">
              <h2><img src="../../../../assets/images/sort.png">推介交流点击率排行</h2>
            </div>
            <ul class="list">
              <li v-for="(item, index) in referralsList" :key="index">
                <span :class="{red: index === 0, orange: index === 1, yellow: index === 2}">{{index + 1}}</span>
                <p class="short-title" @click="lookIn(item)">{{item.name}}</p>
              </li>
            </ul>          
      </div>        
    </div>

    <el-row type="flex"  class="info">
        <el-col :span="4" v-for="(item, index) in experUserList" :key="index">
            <img :src="item.userFace ? item.userFace : face" alt="头像">
            <p class="name">{{item.name}}</p>
            <i class="line"></i>
            <ul class="intro">
              <li><img src="../../../../assets/images/number.png">职称数：<i>&nbsp;{{item.titleNum}}个</i></li>
              <li><img src="../../../../assets/images/company.png">单&nbsp;&nbsp;&nbsp;位： 
                <i v-if="item.companyName.length < 5">{{item.companyName}}</i>
                <el-popover
                ref="popover"
                placement="bottom"
                width="200"
                trigger="hover"
                :content="item.companyName">
                <span v-if="item.companyName.length >= 5" slot="reference">{{item.companyName.slice(0, 5) + '...'}}</span>
              </el-popover>
              </li>
            </ul>
        </el-col>     
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import face from '../../../../assets/images/mr.jpg'
import service from '../../../../utils/axios.js'
// import { notice } from '../../../../api/index.js'
export default {
  name: 'home-page',
  data () {
    return {
      face,
      groverment: [],
      clicks: [],
      experUserList: [],
      referralsList: [],
      marchTopic: []
    }
  },
  methods: {
    lookIn (item) {
      sessionStorage.id = item.id
      let bread = {}
      bread.name = '首页'
      bread.url = this.$route.path
      sessionStorage.bread = JSON.stringify(bread)
      sessionStorage.open = JSON.stringify(item.openState)
      this.$router.push('/subjectDetail/intro')
    },
    look (item) {
      sessionStorage.subFileIds = JSON.stringify(item.subFileIds)
      sessionStorage.grovermentId = JSON.stringify(item.id)
      this.$router.push(`/front/fileInfo`)
    },
    getData () {
      service.get(`frontIndexController/getIndex`)
      .then(res => {
        if (res.data.code !== 1) {
          // notice(this, res.data.message, 2000)
        } else {
          this.groverment = res.data.result.tpPolicyList
          this.clicks = res.data.result.clickList
          this.experUserList = res.data.result.experUserList
          this.referralsList = res.data.result.referralsList
          this.marchTopic = res.data.result.marchTopic
          this.experUserList = this.experUserList.map(item => ({...item, userFace: item.userFace ? (this.staticUrl + '?filepath=' + item.userFace) : ''}))
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
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.home-page{
  .red {
    background: #EF4646 !important;
  }
  .orange{
    background: #EB6100 !important;
  }
  .yellow {
    background: #F8B551 !important;
  }
  .content {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    

    .content-right {
      margin-left: 20px;
      width: 470px;
    }
    .content-left {
      flex: 1;
    }
    .content-right, .content-left {

      background: #fff;
      border: 1px solid #EDF1F4;
      
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
        .el-button {
          float: right;
          font-size: 14px;
          padding: 0px;
          color: #666;
          line-height: 25px;
        }
      }
      .list {
        clear: both;
        background: #fff;
        padding: 20px;
        min-height: 280px;

        li {
          font-size: 16px;
          line-height: 35px;

          &:after {
            @include clearfloat;
          }
          &>span {
            display: block;
            float: left;
            margin-right: 10px;
            width: 17px;
            height: 17px;
            background: #CCCCCC;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            color: #fff;
            line-height: 17px;
            margin-top: 9px;
            border-radius: 2px;
          }
          &>p {
            float: left;
            font-size: 14px;
            max-width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
              cursor: pointer;
            }

            &:last-child {
              float: right;
            }
          }
          .short-title {
            width: 93%;
            float: none !important;
            @include text-overflow;
          }
        }
      }
    }
  }
  .el-row {
    margin-top: 20px;
    margin-bottom: 20px;
    
    .el-col-4 {
      width: 24%;
    }
    .el-col {
      background: #fff;
      margin-right: 20px;
      border: 1px solid #EDF1F4;

      &:last-child {
        margin-right: 0px;
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
        .el-button {
          float: right;
          font-size: 14px;
          padding: 0px;
          color: #666;
          line-height: 25px;
        }
      }
      .list {
        clear: both;
        background: #fff;
        padding: 20px;

        li {
          font-size: 16px;
          line-height: 35px;

          &:after {
            @include clearfloat;
          }
          &>span {
            display: block;
            float: left;
            margin-right: 10px;
            width: 17px;
            height: 17px;
            background: #CCCCCC;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            color: #fff;
            line-height: 17px;
            margin-top: 9px;
            border-radius: 2px;
          }
          &>p {
            float: left;
            font-size: 14px;
            max-width: 650px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
              cursor: pointer;
            }

            &:last-child {
              float: right;
            }
          }
          .short-title {
            width: 93%;
            @include text-overflow;
          }
        }
      }

      img {
        width: 100px;
        height: 100px;
        display: block;
        border-radius: 100%;
        margin: 40px auto 20px;
      }
      .name {
        text-align: center;
        font-size: 16px;
        margin-bottom: 15px;
      }
      .line {
        width: 17px;
        height: 2px;
        display: block;
        background: #B3B3B3;
        margin: 0 auto;
      }
      .intro {
        text-align: center;
        padding: 25px 0px 38px 40px;


        li {
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 10px;
          text-align: left;
          color: #999;

          &>img {
            width: 20px;
            height: 20px;
            float: left;
            display: inline-block !important;
            margin: 0px 10px 0px 0px !important;
            border-radius: 0px !important;
          }

          &>i {
            color: #666;
            font-style: normal;
          }
        }
      }
    }
  }
  .info {
      .el-col {
        padding: 0px;
        margin: 0px;
        margin-right: 20px;
      }
  }
}
</style>
