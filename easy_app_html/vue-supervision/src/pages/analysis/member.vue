<template>
    <div class="analysis-member">
        <p>工作分析</p>
        <div class="content">
          <ul>
            <li v-for="(item, index) in options" @click="choose(index)" :class="{ active: activeNum === index}">{{item.name}}</li>
          </ul>
          <div class="chartInfo">
            <highcharts :options="Options"></highcharts>
            <table  width="797px;" style="margin: 20px auto; text-align: center;">
              <tr>
                <th>年龄</th>
                <th>40岁以下</th>
                <th>40-50岁</th>
                <th>40-50岁</th>
                <th>50-60岁</th>
                <th>60-70岁</th>
                <th>70岁以上</th>
              </tr>
              <tr>
                <td>人数</td>
                <td>11</td>
                <td>22</td>
                <td>33</td>
                <td>44</td>
                <td>55</td>
                <td>66</td>
              </tr>
            </table>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'analysis-member',
  data () {
    return {
      activeNum: 0,
      options: [
        {name: '督导领域', id: 1},
        {name: '性别', id: 2},
        {name: '年龄', id: 3},
        {name: '政治面貌', id: 4},
        {name: '学历', id: 5},
        {name: '在职状况', id: 6},
        {name: '督导学校', id: 7},
        {name: '督导工作年限', id: 8}
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
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: ''
        },
        tooltip: {
          headerFormat: '{series.name}<br>',
          pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:.1f}%'
          },
          pie: {
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
          name: '浏览器访问量占比',
          data: [
            ['Firefox', 45.0],
            ['IE', 26.8],
            {
              name: 'Chrome',
              y: 12.8,
              sliced: true,
              selected: true
            },
            ['Safari', 8.5],
            ['Opera', 6.2],
            ['其他', 0.7]
          ]
        }
        ]
      }
    }
  },
  methods: {
    choose (index) {
      this.activeNum = index
    }
  },
  created () {

  }
}
</script>
<style lang="scss">
.analysis-member {
  padding: 20px;
  &>p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #333333;
  }
  &>.content {
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
      background: #FFFFFF;
      box-shadow: 0 0 4px 0 rgba(0,0,0,0.14);

      &>table {
        margin-top: 20px;

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
}
</style>

