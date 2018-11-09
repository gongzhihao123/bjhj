<template>
  <div class="home-index">
    <header>
      <img src="../../../assets/images/homePage-icon.png" alt="">
      首页
    </header>

    <main>
      <el-row>
        <el-col :span="4" v-for="(item, index) in stepList" :key="index">
            <el-row :style="{background: item.color}">
              <el-col :span="12">
                <span>
                  {{ item.name }}
                </span>
              </el-col>
              <el-col :span="1">
                <span>
                  /
                </span>
              </el-col>
              <el-col :span="11">
                <span>
                  {{ item.num }}
                </span>
              </el-col>
            </el-row>
        </el-col>
      </el-row>

      <div class="home-chart">
        <el-row>
          <el-col :span="12">
            <p>五年内课题申报计划</p>
            <chart :options="lineChart" class="line-echart"></chart>
          </el-col>
          <el-col :span="11">
            <p>研究成果统计</p>
            <chart :options="breadChart" class="bread-echart"></chart>
          </el-col>
        </el-row>
      </div>
    </main>
  </div>
</template>

<script>
import server from '../../../utils/axios'
// import { notice } from '../../../api/index'
import { mapGetters } from 'vuex'
export default {
  name: 'home-index',
  data () {
    return {
      stepList: [
        { name: '立项申请阶段', num: 0, color: 'linear-gradient(90deg, #6B82FD, #26CFFC)' },
        { name: '开题阶段', num: 0, color: 'linear-gradient(90deg, #FF988B, #FF6E88)' },
        { name: '中期研究阶段', num: 0, color: 'linear-gradient(90deg, #09B3E4, #23F3AC)' },
        { name: '中期总结阶段', num: 0, color: 'linear-gradient(90deg, #7D7DFD, #E692F8)' },
        { name: '结题阶段', num: 0, color: 'linear-gradient(90deg, #0DA8FF, #1AE7E0)' },
        { name: '已结题', num: 0, color: 'linear-gradient(90deg, #4ED0E3, #5FF6D0)' }
      ],
      exceptResultList: [
        { name: '专著', value: false, id: 1 },
        { name: '译著', value: false, id: 2 },
        { name: '研究报告', value: false, id: 3 },
        { name: '工具书', value: false, id: 4 },
        { name: '电脑软件', value: false, id: 5 },
        { name: '其他', value: false, id: 6 }
      ],
      lineChart: {
        title: {
          // text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            itemStyle: {
              normal: {
                color: '#69C2EA'
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#69C2EA'
              }
            },
            areaStyle: {normal: {
              color: '#D6F3F9'
            }},
            data: []
          }
        ]
      },
      breadChart: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: 10,
          right: 20,
          data: []
        },
        series: [
          {
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['52%', '55%'],
            label: {
              normal: {
                formatter: '{d}%',
                backgroundColor: '#eee',
                borderColor: '#aaa'
              }
            },
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    getIndexBack () {
      server.get(`/backIndexController/getIndexBack`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result.countByPhasesSort.forEach((item, index) => {
            if (item.phasesSort === 1) {
              this.stepList[0].num = item.count
            }
            if (item.phasesSort === 2) {
              this.stepList[1].num = item.count
            }
            if (item.phasesSort === 3) {
              this.stepList[2].num = item.count
            }
            if (item.phasesSort === 4) {
              this.stepList[3].num = item.count
            }
            if (item.phasesSort === 5) {
              this.stepList[4].num = item.count
            }
          })
          let now = new Date().getFullYear()
          this.lineChart.xAxis[0].data = [now - 4, now - 3, now - 2, now - 1, now]
          this.lineChart.series[0].data = [res.data.result.fourCount || 0, res.data.result.threeCount || 0, res.data.result.twoCount || 0, res.data.result.oneCount || 0, res.data.result.nowCount || 0]
          let data = res.data.result.rateList.filter(item => item.count !== 0)
          data.forEach((item) => {
            item.value = item.count
            if (item.topicTypeId === 1) {
              item.name = '专著'
            }
            if (item.topicTypeId === 2) {
              item.name = '译著'
            }
            if (item.topicTypeId === 3) {
              item.name = '研究报告'
            }
            if (item.topicTypeId === 4) {
              item.name = '工具书'
            }
            if (item.topicTypeId === 5) {
              item.name = '电脑软件'
            }
            if (item.topicTypeId === 6) {
              item.name = '其他'
            }
          })
          this.breadChart.series[0].data = data
          this.breadChart.legend.data = data.map(item => item.name)
        } else {
          // notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'remind'
    ])
  },
  watch: {
    remind () {
    }
  },
  created () {
    this.getIndexBack()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.home-index{
  padding-bottom: $width;

  header{
    line-height: 56px;
    font-size: 16px;
    img {
      vertical-align: middle;
      margin-right: 10px;
    }
  }

  main{

    &>.el-row{
      &>.el-col{
        padding: 5px;
        &>.el-row{
          width: 100%;
          height: 100px;
          background: #fff;
          border-radius: 5px;
          text-align: center;
          box-sizing: border-box;
          .el-col {
            height: 100px;
            color: #fff;
            font-size: 20px;
            position: relative;
            span {
              position: absolute;
            }
          }
          .el-col:nth-child(1) {
            span {
              position: absolute;
              left: 10%;
              top: calc(50% - 18px);
            }
          }
          .el-col:nth-child(2),.el-col:nth-child(3) {
            span {
              position: absolute;
              left: 10%;
              top: calc(50% - 17px);
            }
          }
        }
      }
    }

    .home-chart{
      margin-top: 36px;
      .el-row{
        .el-col{
          background: #FFF;
          
          p{
            margin: 0;
            padding: 15px;
            background: #F8F9FD;
            font-size: 16px;
            border-bottom: 1px solid #EBEEF7;
            &:before {
              content: '';
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #5295EB;
              margin: 0 10px;
            }
          }
        }
        .el-col:first-child{
          margin-right: 3%;
        }
      }
      .line-echart{
        width: 100%;
      }
      .bread-echart{
        width: 100%;
      }
    }
  }
}
</style>
