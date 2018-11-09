<template>
    <div class="index" :class="{indexHeight: personInfo}">
      <!-- 首页顶部 -->
      <div class="index-top-middle">

        <el-row>

          <!-- 顶部左侧 -->
          <el-col :span="18">
            <el-row>
              <el-col :span="10">
                <div>
                  <p> <b>用户信息</b> </p>
                  <div>
                    <div>
                      <img v-if="user.userFace" :src="user.userFace" alt="">
                      <span v-else>{{ user ? user.name.substring(user.name.length-2, user.name.length) : '' }}</span>
                    </div>
                    <div>
                      <p>{{ user ? user.name : '' }}</p>
                      <p>{{ user ? (user.userRole === 1 ? '督导管理员' : user.userRole === 3 ? '督学联系员' : (user.userRole === 2 ? '责任督学' : '督导室人员')) : '' }}</p>
                    </div>
                  </div>
                  <p @click="information">查看详细信息 >></p>
                </div>
              </el-col>
              <el-col :span="14">
                <div>
                  <p>
                    <b>
                      工作总量统计
                    </b>
                  </p>
                  <highcharts :options="Options" style="height: 230px;"></highcharts>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div>
                  <img src="../assets/images/index-yellow.png" alt="">
                  <div>
                    <p>
                      {{ zrdxCount }}人
                    </p>
                    <p>
                      责任督学
                    </p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <img src="../assets/images/index-blue.png" alt="">
                  <div>
                    <p>
                       {{ ddjgCount }}所
                    </p>
                    <p>
                      督导机构
                    </p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <img src="../assets/images/index-red.png" alt="">
                  <div>
                    <p>
                       {{ zrqyCount }}块
                    </p>
                    <p>
                      责任区域
                    </p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>

          <!-- 顶部右侧 -->
          <el-col :span="6">
            <el-row>
              <div>
                <p>
                  <b>
                    督导动态
                  </b>
                </p>
                <div>
                  <p v-for="(item, index) in dynamicsList" :key="index">
                    {{ item.date | dateFormat('MM月dd日') }}，{{ item.userName }}上传了{{ item.objectName }}
                  </p>
                </div>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </div>
      
      <!-- 首页底部 -->
      <div class="index-bottom">
        <el-row>
          <el-col :span="12">
            <div>
              <p>
                <span v-if="user.userRole !== 1" @click="$router.push('/file/train')">更多></span>
                <b>最新培训文件</b>
              </p>
              <el-row v-for="(item, index) in trainingFileList" :key="index">
                <el-col :span="19" @click.native="route(item)">
                  {{ item.name }}
                </el-col>
                <el-col :span="5">
                  {{ item.createdDate | dateFormat('yyyy-MM-dd') }}
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <p>
                <span v-if="user.userRole !== 1" @click="$router.push('/file/law')">更多></span>
                <b>最新法律文件</b>
              </p>
              <el-row v-for="(item, index) in lawFileList" :key="index">
                <el-col :span="19" @click.native="route(item)">
                  {{ item.name }}
                </el-col>
                <el-col :span="5">
                  {{ item.createdDate | dateFormat('yyyy-MM-dd') }}
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 个人信息 -->
      <transition name="slide-left" mode="out-in">
        <div class="Info" v-if="personInfo" v-click-outside="hide">
            <div class="header">
              <i class="el-icon-close" @click="personInfo = false"></i>
              <p>个人信息</p>
            </div>
            <div class="info-content">
              <div class="info-head">
                <img v-if="user.userFace" :src="user ? user.userFace : ''">
                <span v-else>{{ user ? user.name.substring(user.name.length-2, user.name.length) : '' }}</span>
                <ul>
                  <li>{{perInfo.name}}</li>
                  <li><p>{{ perInfo.roleId === 1 ? '督导管理员' : perInfo.roleId === 3 ? '督学联系员' : (perInfo.roleId === 2 ? '责任督学' : '督导室人员') }}</p></li>
                </ul>
              </div>
              <table>
                <tr>
                  <th>所属区域：</th>
                  <th>{{perInfo.areaName}}</th>
                </tr>
                <tr>
                  <th>督导学校：</th>
                  <th class="schoolList">
                    <ul>
                      <li v-for="(item, index) in perInfo.schoolList" :key="index">
                        {{ item.name }}
                      </li>
                    </ul>
                  </th>
                </tr>
                <tr>
                  <th>性别：</th>
                  <th><span v-if="perInfo.sex === 1">男</span><span v-if="perInfo.sex === 2">女</span></th>
                </tr>
                <tr>
                  <th>手机号码：</th>
                  <th>{{perInfo.mobileNumber}}</th>
                </tr>
                <tr>
                  <th>通讯地址：</th>
                  <th>{{perInfo.address}}</th>
                </tr>
                <tr>
                  <th>民族：</th>
                  <th><span>{{perInfo.nation ? peoplesList.filter(item => item.value === perInfo.nation)[0].label : ''}}</span></th>
                </tr>
                <tr>
                  <th>出生年月：</th>
                  <th>{{perInfo.birthday | dateFormat('yyyy-MM-dd')}}</th>
                </tr>
                <tr>
                  <th>政治面貌：</th>
                  <th><span v-if="perInfo.politicalFace === 1">中共党员</span>
                    <span v-if="perInfo.politicalFace === 2">民主党派</span>
                    <span v-if="perInfo.politicalFace === 3">群众</span>
                  </th>
                </tr>
                <tr>
                  <th>人员类型：</th>
                  <th>
                    <span>{{ perInfo.roleId === 3 ? '督学联系员' : perInfo.schoolList.length ? '挂牌督学' : '责任督学' }}</span>
                  </th>
                </tr>
                <tr>
                  <th>是否在职：</th>
                  <th>
                    <span v-if="perInfo.jobState === 1">是</span>
                    <span v-if="perInfo.jobState === 2">否</span>
                  </th>
                </tr>
                <tr>
                  <th>从教年月：</th>
                  <th><span>{{perInfo.beginTeachingDate | dateFormat('yyyy-MM')}}</span></th>
                </tr>
                <tr>
                  <th>从教督导时间：</th>
                  <th><span>{{perInfo.beginTeachingDate | dateFormat('yyyy-MM')}}</span></th>
                </tr>
                <tr>
                  <th>督导类别：</th>
                  <th>
                    <span v-for="(item, index) in perInfo.userType.split(',')" :key="index">
                      {{ item === '1' ? '督政' : item === '2' ? '督学' : item === '3' ? '评估测评' : '---' }}
                      <template v-if="index !== perInfo.userType.split(',').length - 1">
                        /
                      </template>
                    </span>
                  </th>
                </tr>
                <tr>
                  <th>督导分类：</th>
                  <th>
                    <span v-if="perInfo.jobType === 1">专职</span>
                    <span v-if="perInfo.jobType === 2">兼职</span>
                  </th>
                </tr>                                                                                                                                                                                                            
              </table>
            </div>       
        </div>        
      </transition>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import server from '../utils/axios'
import { notice } from '../api/index'
export default {
  name: 'index',
  data () {
    return {
      user: '',
      zrdxCount: 0,
      ddjgCount: 0,
      zrqyCount: 0,
      personInfo: false,
      trainingFileList: [],
      lawFileList: [],
      dynamicsList: [],
      perInfo: {},
      peoplesList: [
        { label: '汉族', value: '01' },
        { label: '壮族', value: '02' },
        { label: '回族', value: '03' },
        { label: '满族', value: '04' },
        { label: '维吾尔族', value: '05' },
        { label: '苗族', value: '06' },
        { label: '彝族', value: '07' },
        { label: '土家族', value: '08' },
        { label: '藏族', value: '09' },
        { label: '蒙古族', value: '10' },
        { label: '侗族', value: '11' },
        { label: '布依族', value: '12' },
        { label: '瑶族', value: '13' },
        { label: '白族', value: '14' },
        { label: '朝鲜族', value: '15' },
        { label: '哈尼族', value: '16' },
        { label: '黎族', value: '17' },
        { label: '哈萨克族', value: '18' },
        { label: '傣族', value: '19' },
        { label: '畲族', value: '20' },
        { label: '傈僳族', value: '21' },
        { label: '东乡族', value: '22' },
        { label: '仡佬族', value: '23' },
        { label: '拉祜族', value: '24' },
        { label: '佤族', value: '25' },
        { label: '水族', value: '26' },
        { label: '纳西族', value: '27' },
        { label: '羌族', value: '28' },
        { label: '土族', value: '29' },
        { label: '仫佬族', value: '30' },
        { label: '锡伯族', value: '31' },
        { label: '柯尔克孜族', value: '32' },
        { label: '景颇族', value: '33' },
        { label: '达斡尔族', value: '34' },
        { label: '撒拉族', value: '35' },
        { label: '布朗族', value: '36' },
        { label: '毛南族', value: '37' },
        { label: '塔吉克族', value: '38' },
        { label: '普米族', value: '39' },
        { label: '阿昌族', value: '40' },
        { label: '怒族', value: '41' },
        { label: '鄂温克族', value: '42' },
        { label: '京族', value: '43' },
        { label: '基诺族', value: '44' },
        { label: '德昂族', value: '45' },
        { label: '保安族', value: '46' },
        { label: '俄罗斯族', value: '47' },
        { label: '裕固族', value: '48' },
        { label: '乌孜别克族', value: '49' },
        { label: '门巴族', value: '50' },
        { label: '鄂伦春族', value: '51' },
        { label: '独龙族', value: '55' },
        { label: '赫哲族', value: '53' },
        { label: '高山族', value: '54' },
        { label: '珞巴族', value: '55' },
        { label: '塔塔尔族', value: '56' }
      ],
      Options: {
        chart: {
          type: 'column'
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: [
            '督导过程',
            '督导记录',
            '整改通知',
            '整改反馈',
            '学校情况'
          ]
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="padding-left:20px"><span>{point.y}</span></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
        },
        series: [{
          showInLegend: false,
          color: '#82E1EA',
          data: []
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'previewUrl',
      'rootUrl',
      'previewInterface'
    ])
  },
  methods: {
    hide () {
      this.personInfo = false
    },
    route (val) {
      if (val.attachment) {
        let url
        url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${val.attachment.id}`
        this.$router.push({path: '/file/fileInfo', query: {id: val.attachment.id, url: url, size: val.attachment.size}})
      }
    },
    information () {
      this.getUserInfo()
    },
    logout () {
      const path = document.getElementById('contextPath').value
      window.location.href = `${path}/logout`
    },
    getIndexInfo () {
      server.get('/indexController/getIndexInfo')
      .then(res => {
        if (res.data.code === 1) {
          server.get(`/common/initPage`)
          .then(res => {
            this.user = res.data.result.loginUser
          })
          let data = res.data.result
          this.Options.series[0].data = [data.ddgcCount, data.ddjlCount, data.zgtzCount, data.zgfkCount, data.xxqkCount]
          this.zrdxCount = data.ddUserCount
          this.ddjgCount = data.ddSchoolCount
          this.zrqyCount = data.ddAreaCount
          this.dynamicsList = data.activity
          this.lawFileList = data.flwjList
          this.trainingFileList = data.pxwjList
        } else {
          notice(res.data.message)
        }
      })
    },
    // 查询个人信息详情
    getUserInfo () {
      server.get(`/indexController/getUserInfo?userId=${this.user.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.perInfo = res.data.result[0]
          console.log(this.perInfo)
          this.personInfo = true
        } else {
          notice(res.data.message)
        }
      })
    }
  },
  created () {
    this.getIndexInfo()
  }
}
</script>
<style lang="scss">
@import '../assets/scss/mixin.scss';
@import '../assets/scss/variable.scss';
.index {
  padding: $width $width*2;
  &.indexHeight {
    height: calc(100vh - 100px);
    overflow: hidden;
  }
  
  b{
    border-left: 3px solid #66C3FE;
    padding-left: 10px;
  }

  .index-top-middle {
    &>.el-row {
      &>.el-col:nth-child(1) {
        // 上
        .el-row:nth-child(1) {
          .el-col {
            &>div {
              height: 279px;
              box-sizing: border-box;
              border-radius: 4px;
              background: #fff;
              padding: $width;
            }
          }
          .el-col:nth-child(1) {
            &>div {
              background: #5ACBFD;
              border-radius: 10px;
              &>p:nth-child(1) {
                color: #fff;
              }
              &>div {
                margin-top: $width/2;
                padding-top: $width*2.5;
                height: 220px;
                box-sizing: border-box;
                text-align: center;
                background: url(../assets/images/user-background.png) no-repeat;
                background-size: 100% 100%; 
                div:nth-child(1) {
                  display: inline-block;
                  width: 126px;
                  height: 126px;
                  border-radius: 50%;
                  border: 1px solid #BDD0C9;
                  background: #71EAC2;
                  position: relative;
                  // margin-left: 10px;
                  img{
                    width: 126px;
                    height: 126px;
                    border-radius: 50%;
                  }
                  span {
                    position: absolute;
                    font-size: 30px;
                    color: #fff;
                    top: 42px;
                    left: 33px;
                  }
                }
                div:nth-child(2) {
                  // margin-left: 5%;
                  display: inline-block;
                  vertical-align: middle;
                  width: 126px;
                  height: 126px;
                  p {
                    margin-bottom: $width/2;
                  }
                  p:nth-child(1) {
                    margin-top: -$width;
                    font-weight: bold;
                  }
                }
              }
              &>p:nth-child(3) {
                margin-top: -$width*2;
                text-align: right;
                padding-right: $width;
                cursor: pointer;
                color: #5E9CE4;
              }
            }
          }
          .el-col:nth-child(2) {
            padding-left: $width;
            &>div {
              p {
                margin-bottom: $width/2;
              }
            }
          }
        }

        // 中
        .el-row:nth-child(2) {
          margin-top: $width;
          .el-col {
            padding-left: $width;
            &>div {
              background: #fff;
              height: 225px;
              box-sizing: border-box;
              border-radius: 4px;
              text-align: center;
              padding-top: 40px;
              img {
                vertical-align: middle;
                width: 150px;
                height: 150px;
              }
              &>div {
                margin-left: $width;
                display: inline-block;
                padding-top: 10px;
                vertical-align: middle;
                p {
                  margin-bottom: $width;
                  font-size: 16px;
                  font-weight: bold;
                }
              }
            }
          }
          .el-col:nth-child(1) {
            padding-left: 0;
          }
        }
      }

      &>.el-col:nth-child(2) {
        padding-left: $width;
        &>div {
          height: 524px;
          background: #fff;
          border-radius: 5px;
          padding: 20px;
          padding-bottom: 10px;
          &>div {
            height: 99%;
            overflow-x: hidden;
            p {
              margin-bottom: 6.6px;
            }
          }
          &>p {
            margin-bottom: 10px;
          }
        }
      }
    }
  }

  .index-bottom {
    margin-top: $width;
    .el-row {
      .el-col {
        padding-left: $width;
        &>div {
          background: #fff;
          height: 316px;
          padding: $width;
          box-sizing: border-box;
          border-radius: 4px;
          &>p {
            margin-bottom: $width;
            span:nth-child(1) {
              float: right;
              cursor: pointer;
              color: #50B4FF;
            }
          }
          .el-row {
            margin-bottom: 11px;
            .el-col:nth-child(1) {
              cursor: pointer;
            }
            .el-col:nth-child(2) {
              text-align: right;
            }
          }
        }
      }
      .el-col:nth-child(1) {
        padding-left: 0;
      }
    }
  }

  .Info {
    position: fixed;
    z-index: 1;
    right: 0;
    top: 50px;
    width: 720px;
    height: calc(100vh - 50px);
    overflow-x: hidden;
    background: #fff;
    width: 598px !important;
    .header {
      padding: 20px;
      i {
        float: right;
        font-size: 22px;
        cursor: pointer;
      }
      p {
        font-size: 16px;
      }
    }
    &>.info-content {
      padding: 20px;
      background: #fff;
      margin: 20px;

      .info-head {
        height: 217px;
        img {
          width: 177px;
          height: 177px;
          margin-right: 20px;
          float: left;
        }
        > span {
          background: #71EAC2;
          width: 177px;
          height: 177px;
          display: block;
          margin-right: 20px;
          float: left;
          border-radius: 50%;
          font-size: 30px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        ul {
          max-width: 337px;
          float: left;
          margin-top: 10%;

          li {
            line-height: 40px;
            &:first-child {
              font-family: PingFangSC-Medium;
              font-size: 18px;
              color: #333333;
              font-weight: bold;
            }
            &:last-child {
              span {
                font-family: PingFang-SC-Regular;
                font-size: 18px;
                color: #333333;
              }
            }
          }
        }
      }
      &>table {
        width: 518px;
        tr {
          th {
            border: 1px solid #eee;
            &:first-child {
              width: 130px;
              text-align: right;
              line-height: 40px;
            }
            &:last-child {
              padding-left: 20px;
            }
            &.schoolList {
              line-height: 2.3;
            }
          }
        }
      }
    }
  }
}
</style>

