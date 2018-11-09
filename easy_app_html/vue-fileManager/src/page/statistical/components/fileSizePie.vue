<template>
  <div class="fileSize">
    <div id="fileSizePie" style="width: 100%;height:100%;" ></div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'
export default {
  name: 'fileSizePie',
  props: ['fileNum'],
  data () {
    return {
      options: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: '文件大小'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (HighCharts.theme && HighCharts.theme.contrastTextColor) || 'black'
              }
            },
            showInLegend: true
          }
        },
        series: [{
          type: 'pie',
          name: '浏览器访问量占比',
          data: [
            ['Firefox', 45.0],
            ['IE', 26.8],
            ['Safari', 8.5],
            ['Opera', 6.2],
            ['其他', 0.7]
          ]
        }],
        credits: {
          enabled: false
        }
      }
    }
  },
  watch: {
    fileNum (item) {
      var arr = []
      item.forEach(items => {
        var str = []
        str.push(items.type === 1 ? '图片' : items.type === 2 ? '文档' : items.type === 3 ? '视频' : items.type === 4 ? '音乐' : items.type === 5 ? '其他' : '', items.size)
        arr.push(str)
      })
      this.options.series[0].data = arr
      HighCharts.chart('fileSizePie', this.options)
    }
  }
}
</script>
<style lang='scss' scoped>
.fileSize {
  width: 100%;
  height: 100%;
}
</style>
