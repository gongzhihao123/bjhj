<template>
  <div class="my-subject">
    <p>当前位置： 我的课题</p>
    <div class="box">
      <p class="head">
        <img src="../../../../assets/images/courseManager/title-List.png">课题列表
        <span style="color: #1AB3F7;">（说明：刚立项的课题请先完善课题计划）</span>
      </p>
      <div class="contents">
        
        <div class="tab" v-loading="loading">
          <table>
            <tr>
              <th v-for="item in thList" :key="item.name">{{item.name}}</th>
            </tr>
            <tr v-for="item in tableList" :key="item.name" :class="{ybg: item.signFlag === 3, nbg: true}">
              <td>{{item.topicCode}}</td>
              <td @click="route(item)" style="cursor: pointer;">{{item.name}}</td>
              <td>{{item.classifyName}}</td>
              <td>{{item.leadUserName}}</td>
              <td>{{item.companyName}}</td>
              <td>{{item.checkedTime}}</td>
              <td :class="{black: item.phasesName.indexOf('开题') !== -1, 'blue': item.phasesName.indexOf('中期') !== -1, 'green': item.phasesName.indexOf('结题') !== -1}">{{ item.phasesSort === 5 && item.checkState === 1 ? '已结题' : item.phasesName }}<span v-if="item.overtime === 1">(已延期)</span></td>
              <td>
                <el-button v-if="item.openState === 1" type="primary" @click="open(item)" :disabled="item.userType == 2 || item.signFlag == 3">公开</el-button>
                <el-button v-else type="primary" @click="open(item)" :disabled="item.userType == 2 || item.signFlag == 3">不公开</el-button>
              </td>
              <td>
                <el-button type="primary" @click="changeOne(item)" :disabled="item.userType == 2 || item.phasesName == '结题阶段' && item.checkState == 1 || item.signFlag == 3">变更</el-button>
              </td>
            </tr>
            <tr v-if="!tableList.length">
              <td colspan="9" style="text-align: center;">暂无数据</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <el-pagination
      v-if="tableList.length > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>    
  </div>
</template>

<script>
import service from '../../../../utils/axios.js'
import { dateFormat } from '../../../../filters/index.js'
import {notice} from '../../../../api/index'
export default {
  name: 'my-subject',
  data () {
    return {
      loading: false,
      currentPage: 1,
      thList: [
        {name: '立项号'},
        {name: '课题名称'},
        {name: '课题分类'},
        {name: '课题负责人'},
        {name: '单位'},
        {name: '立项时间'},
        {name: '当前状态'},
        {name: '是否对外公开'},
        {name: '课题变更'}
      ],
      tableList: [],
      outTime: false,
      pageSize: 10,
      totalCount: 0
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    route (item) {
      this.$router.push({path: `/subjectManager/changeDetails`, query: {item: item.id, userType: item.userType, stage: item.phasesId, signFlag: item.signFlag, checkState: item.checkState}})
    },
    changeOne (item) {
      service.get(`/frontTopicManageController/selectStateOne?id=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          // console.log(111)
        }
      })
      sessionStorage.SUBJECT_ID = item.id
      sessionStorage.BACK_PATH = '/subjectManager/mySubject'
      sessionStorage.IS_CHANGE = '1'
      sessionStorage.ONESTEPCONTENT = ''
      sessionStorage.NINESTEPCONTENT = ''
      this.$router.push({path: `/declarationStep/index`, query: {id: item.guideId}})
    },
    getList () {
      let date = (new Date()).getTime() + 86399900
      this.loading = true
      service.get(`/frontTopicManageController/myTopicList?pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result.list || []).map(item => ({
            ...item,
            checkedTime: dateFormat(item.checkedTime, 'yyyy-MM-dd'),
            overtime: date > item.checkedTime ? 0 : 1
            // 0是未延期，1是已延期
          }))
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.messge || '获取失败', 2000)
        }
        this.loading = false
      })
      .catch(_ => {
        this.loading = false
      })
    },
    open (item) {
      let sta = item.openState === 1 ? 2 : 1
      service.post(`/frontTopicManageController/openState`, ({
        id: item.id,
        state: sta
      }))
      .then(res => {
        if (res.data.code === 1) {
          this.getList()
        }
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.my-subject {
  width: 100%;
  height: 700px;
  /* background: #fff; */

  .black {
    color: #000 !important;
  }
  .blue {
    color: #5295EB !important;
  }
  .green {
    color: #87D57C !important;
  }
  &>p {
    margin-bottom: 20px;
  }
  .box {
    background: #fff;
    border: 1 solid #EBEEF7;
    .head {
      padding: 20px;
      border-bottom: 1px solid #EBEEF7;
      line-height: 25px;

      &>img {
          width: 25px;
          height: 25px;
          float: left;
          margin: 0px 10px 0px 0px;
        }
    }
    .contents {
      max-height: 500px;
      .tab {
        padding: 20px;

        table {
          width: 100%;
          .ybg {
            background: #ccc;
          }
          .nbg {
            background: #fff;
          }
          tr {
            // height: 50px;
            cursor:　pointer;
            td {
                padding-top: 12px;
                padding-bottom: 12px;
                color: #999999;

                &>.el-button {
                  padding: 5px 15px;
                  &>span {
                    width: 38px;
                    display: inline-block;
                    text-align: center;
                  }
                }
            }

            &:hover {
              background: #F1F3F9;
              
              td {
                color: #5295EB;
                &:first-child {
                  border-top-left-radius: 8px;
                  border-bottom-left-radius: 8px;
                }
                &:nth-child(9){
                  border-top-right-radius: 8px;
                  border-bottom-right-radius: 8px;
                }
              }
            }
            &:nth-child(1) {
              background: #EBEEF7;
              border-radius: 4px;

              th {
                font-size: normal;
                padding-top: 12px;
                padding-bottom: 12px;

                &:first-child {
                  border-top-left-radius: 8px;
                  border-bottom-left-radius: 8px;
                }
                &:nth-child(9){
                  border-top-right-radius: 8px;
                  border-bottom-right-radius: 8px;
                }
              }
            }
            td,th {
              text-align: left;

              &:nth-child(1) {
                padding-left: 10px;
              }
            }
          }
        }
      }
    }
  }

  .el-pagination {
    margin: 20px 0;
    text-align: right;
  }
}
</style>
