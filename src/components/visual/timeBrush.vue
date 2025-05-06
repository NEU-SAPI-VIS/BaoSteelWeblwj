<template>
  <div :id="id" style="height:100%;width:100%" />
</template>
<script>
import * as echarts from 'echarts';
import util from 'utils/util.js'
export default {
  data() {
    return {
      id: 'timeChart' + Math.random().toString(32),
      chart: undefined
    }
  },
  methods: {
    debounce(fn, wait) {
      let timeCal = null

      return function () {
        let self = this
        let args = arguments
        if (timeCal) {
          clearTimeout(timeCal)
        }
        timeCal = setTimeout(function () {
          fn.apply(self, args)
        }, wait)
      }
    },
    initChart(Data) {
      if (this.chart != null && this.chart != "" && this.chart != undefined) {
        this.chart.dispose();//销毁
      }
      this.chart = echarts.init(document.getElementById(this.id), null, { renderer: 'svg' });
      const chartData = { xAxis: Data.endTimeOutput }
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          appendToBody: true,
          position: 'bottom'
        },
        legend: {},
        grid: {
          left: '1%',
          right: '0%',
          bottom: '2%',
          top: '3%',
          containLabel: true
        },
        xAxis:
        {
          type: 'category',
          data: chartData.xAxis
        }
        ,
        yAxis: {
          type: 'value',
          splitLine: { show: false },
          splitArea: { show: false }
        },
        series: [
          {
            name: 'good_flag',
            type: 'bar',
            barWidth: 10,
            stack: 'steel category',
            emphasis: {
              focus: 'series'
            },
            data: Data.good_flag,
            barCategoryGap: '10%'
          },
          {
            name: 'bad_flag',
            type: 'bar',
            stack: 'steel category',
            emphasis: {
              focus: 'series'
            },
            data: Data.bad_flag,
            barCategoryGap: '10%'
          },
          {
            name: 'no_flag',
            type: 'bar',
            stack: 'steel category',
            emphasis: {
              focus: 'series'
            },
            data: Data.no_flag,
            barCategoryGap: '10%'
          }
        ],
        animationEasing: 'elasticOut',
        animationEasingUpdate: 'elasticOut',
        animationDelay(idx) {
          return idx * 5
        },
        animationDelayUpdate(idx) {
          return idx * 5
        },
        color: util.flagColor,
        brush: {  //brushSelected
          xAxisIndex: [0],
          toolbox: ['lineX', 'clear'],
          throttleType: 'debounce',
          throttleDelay: 50
        }
      };
      this.chart.setOption(option);
      const vm = this;
      function emitBrush(d) {
        if (d.areas[0]) {
          let coordRange = d.areas[0].coordRange;
          coordRange[0] && vm.$emit("timeBrushed", [Data.endTimeOutput[coordRange[0]], coordRange[1] ? Data.endTimeOutput[coordRange[1]] : Data.endTimeOutput[coordRange[0]]])
        }
      }
      this.chart.on("brush", this.debounce(emitBrush, 10));
    }
  },
}
</script>