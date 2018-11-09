<template>
    <div class="workload">
        <p>统计分析</p>
        <div class="work" v-if="activeName === '2'">
          <el-select v-model="schoolYear" placeholder="请选择">
            <el-option
              v-for="item in selections"
              :key="item.schoolYear"
              :label="item.schoolYearName"
              :value="item.schoolYear">
            </el-option>
          </el-select>
          <el-input v-model="keyword" placeholder="请输入内容"></el-input>
          <el-button @click="workloadCount">搜索</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="人员分析" name="1">
            <div class="content">
              <ul>
                <li v-for="(item, index) in options" :key="index" @click="choose(item, index)" :class="{ active: activeNum === index}">{{item.name}}</li>
              </ul>
              <div class="chartInfo">
                <highcharts :options="Options"></highcharts>
                <table  width="797px;" style="margin: 20px auto; text-align: center;">
                  <tr>
                    <th>{{ typeName }}</th>
                    <th v-for="(item, index) in Options.series[0].data" :key="index">{{ item[0] }}</th>
                  </tr>
                  <tr>
                    <td>人数</td>
                    <th v-for="(item, index) in Options.series[0].data" :key="index">{{ item[1] }}</th>
                  </tr>
                </table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="工作量统计" name="2">
            <div class="table-content">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  show-overflow-tooltip
                  label="姓名"
                  width="300"
                  align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.userName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="schoolNum"
                  label="督导学校"
                  align="center">
                </el-table-column>
                <el-table-column
                  label="督导过程"
                  width="300"
                  sortable
                  align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.processNum }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="recordNum"
                  label="督导记录"
                  sortable
                  align="center">
                </el-table-column> 
                <el-table-column
                  prop="rectificationNum"
                  label="整改通知"
                  sortable
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="situationNum"
                  label="学校情况"
                  sortable
                  align="center">
                </el-table-column>                                              
              </el-table>
            </div>
          </el-tab-pane>
          <el-pagination
            v-if="activeName === '2' && totalCount !== 0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNo"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="totalCount">
          </el-pagination>           
        </el-tabs>       
    </div>
</template>
<script>
import server from '../../utils/axios'
import { notice } from '../../api/index'
export default {
  name: 'workload',
  data () {
    return {
      typeName: '性别',
      conditionId: 1,
      currentPage: 1,
      pageSize: 10,
      pageNo: 1,
      totalCount: 0,
      tableData: [],
      selections: [],
      sort: '',
      value: '',
      activeName: '1',
      keyword: '',
      schoolYear: '',
      activeNum: 0,
      options: [
        {name: '性别', id: 1},
        {name: '年龄', id: 2},
        {name: '政治面貌', id: 3},
        {name: '学历', id: 4},
        {name: '在职状况', id: 5},
        {name: '督导领域', id: 6},
        {name: '督导工作年限', id: 7}
      ],
      Options: {
        legend: {
          layout: 'horizontal',
          verticalAlign: 'top'
        },
        credits: {
          enabled: false // 禁用版权信息
        },
        chart: {
          backgroundColor: '#F5F5F5'
        },
        title: {
          text: ''
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '{point.name}: <b>{point.percentage:.1f}%'
        },
        plotOptions: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:.1f}%'
          },
          pie: {
            innerSize: '80',
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true
            },
            showInLegend: true,
            point: {
              events: {
                legendItemClick: function (e) {
                  return false
                }
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: '',
          data: []
        }
        ]
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.workloadCount()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.workloadCount()
    },
    choose (item, index) {
      this.activeNum = index
      this.conditionId = item.id
      this.typeName = item.name
      this.userAnalysis()
    },
    handleClick () {},
    // 人员分析
    userAnalysis () {
      server.get(`/tjfxController/userAnalysis?condition=${this.conditionId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.Options.series[0].data = []
          res.data.result.forEach((item) => {
            if (item.countNum !== 0) {
              this.Options.series[0].data.push([ item.name, item.countNum ])
            }
          })
        } else {
          notice(res.data.message)
        }
      })
    },
    workloadCount () {
      server.get(`/tjfxController/workloadCount?sort=${this.sort}&pageSize=${this.pageSize}&pageNo=${this.pageNo}&schoolYear=${this.schoolYear}&keyword=${this.keyword}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list
          this.totalCount = res.data.result.totalCount
        } else {
          notice(res.data.message)
        }
      })
    },
    // 获取学年
    getSchoolYearAndSemeter () {
      server.get(`/tjfxController/getSchoolYearAndSemeter`)
      .then(res => {
        if (res.data.code === 1) {
          this.selections = res.data.result.schoolYearSemesterList.filter(item => item.semester === 1).map(item => ({...item, schoolYearName: item.schoolYearName.slice(0, 11)}))
          this.schoolYear = res.data.result.schoolYearSemesterToWebDto.schoolYear
          this.workloadCount()
        } else {
          notice(res.data.message)
        }
      })
    }
  },
  created () {
    this.getSchoolYearAndSemeter()
    this.userAnalysis()
  }
}
</script>
<style lang="scss">
.workload {
  padding: 20px;
  margin: 20px;
  position: relative;
  background: #fff;
  max-height: 800px;

  &>p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #333333;
  }
  &>.work {
    position: absolute;
    right: 20px;
    top: 50px;
    z-index: 101;

    &>.el-input {
      width: 224px;
      height: 36px;
      margin: 0px 20px;
    }
  }
  &>.el-tabs {
    margin-top: 20px;
    
    .el-tabs__nav-wrap {
      /* width: 170.5px; */
      // margin-left: 20px;
    }
    .el-tabs__nav-scroll {
      /* width: 190.5px; */
    }
  }
  .content {
    margin: 20px auto 0px auto;
    width: 832px;

    &>ul {
      border: 1px solid #E2E2E2;
      opacity: 0.9;
      background: #F0F0F0;
      
      &:after {
        display: block;
        content: '';
        clear: both;
        overflow: hidden;
      }

      &>li {
        padding: 10px 26.5px;
        width: auto;
        float: left;
        &:hover {
          cursor: pointer;
        }
      }
      .active {
        background: #29ACF3;
        color: #fff;
      }
    }

    &>.chartInfo {
      margin-top: 20px;
      width: 832px;
      padding: 20px 0px;
      background: #F5F5F5;
      box-shadow: 0 0 4px 0 rgba(0,0,0,0.14);

      &>table {
        margin-top: 20px;
        background: #fff;
        tr {
          th, td {
            border: 1px solid #EAEAEA;
            text-align: center;
            color: #333;
            line-height: 40px;
          }
        }
      }      
    }
  }
  .tableInfo {

    .el-table thead {
      tr {
        background-color: #F5F5F5 !important;
      }
    }
  }
  .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
  .el-table th.is-leaf {
      padding: 0px !important;
      line-height: 40px; 
      background: #F5F5F5;     
  }
  .el-table th>.cell {
    font-weight: bold;
    color: #333;
    font-size: 16px;
  }
}
</style>

