<template>
  <div :id="chartId" style="width: 100%; height:100%" @click="changeState" @dblclick="diagnosis">
  </div>
</template>

<script>
import * as echarts from "echarts"
import * as d3 from 'd3';
import util from '@/utils/util.js'
// import { style } from 'd3';
import { seriesBar } from './initChat/seriesChart'
import { initMylTooltip } from "@/utils/tooltip";
let timer = null
export default {
  // props: {
  //   speciesData: Object,//接受父组件向子组件传递的数据是一个数组
  //   required: true
  // },

  data() {
    return {
      chartId: 'series-chart' + Math.random().toString(32).slice(-6),
      echartsInstance: undefined,
      speciesData: undefined,
      chartState: false,
      thickRule: null
    }
  },
  methods: {
    diagnosis() {
      clearTimeout(timer)
      this.$emit('disgnosisMethod', [this.speciesData.upids, this.speciesData.bad_upids, this.speciesData.bod_cid, this.speciesData.platetype])
    },
    changeState() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.chartState = !this.chartState;
        if (this.chartState) this.changeChart(this.speciesData)
        else this.paintChart(this.speciesData)
      }, 300);
    },
    changeChart(speciesData, thickRule) {
      if (speciesData) this.speciesData = speciesData
      if (thickRule) this.thickRule = thickRule
      else speciesData = this.speciesData
      d3.select(`#${this.chartId}`).selectAll('div').remove()
      d3.select(`#${this.chartId}`).selectAll('svg').remove()
      const ele = document.getElementById(this.chartId)
      const svg = d3.select(`#${this.chartId}`)
        .append('svg')
        .attr('width', ele.offsetWidth)
        .attr('height', ele.offsetHeight)
      new seriesBar({ width: ele.offsetWidth, heigh: ele.offsetHeight, data: speciesData, thickRule: this.thickRule}, svg).render()
    },
    paintChart(speciesData, thickRule) {
      // 这里是绘制的是规格分析视图的echats
      d3.selectAll('.my-root-svg').remove()
      if (speciesData) this.speciesData = speciesData
      if (thickRule) this.thickRule = thickRule
      else speciesData = this.speciesData
      // speciesData = this.speciesData
      if (this.echartsInstance != null && this.echartsInstance != "" && this.echartsInstance != undefined) {
        try {
          this.echartsInstance.dispose()
        } catch (error) {
        }
      }
      let option = {
        title: {
          left : 'center',
          top: 'center',
          textStyle: {
            color: '#1890fe',
            fontSize: 15
          },
          itemGap: 0,
          text: `${(speciesData.quanlity * 100).toFixed(0)}%`,
          subtext: `${speciesData.dia_weight}`,
          subtextStyle: {
            color: '#1890fe',
            fontSize: 12
          },
          // triggerEvent: true

        },
        tooltip: {
          trigger: 'item',
          confine: true,
          animation: true
        },
        visualMap: {
          show: false,
        },
        series: [
          {
            name: `钢种：${speciesData.platetype}`,
            type: 'pie',
            //环形显示饼状图，实际上显示的是50-80之间的部分
            //上限不建议设置为100，echarts自带动画效果，设置为100动画效果很丑
            radius: ['50%', '80%'],
            // center: ['50%', '50%'],
            data: [
              //itemSyle是单项的背景颜色设置。
              // good， bad ,no
              { value: speciesData.good_num, itemStyle: { color: util.flagColor[0] }, name: 'good' },
              { value: speciesData.bad_num, itemStyle: { color: util.flagColor[1] }, name: 'bad' },
              { value: speciesData.no_flag, itemStyle: { color: util.flagColor[2] }, name: 'no_flag' },

            ],
            label: {
              //将视觉引导图关闭
              show: false,
            },
            itemStyle: {
              borderWidth: 7,
              borderColor: '#fff'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
          }
        ]
      }
      // let mytooltipIns = null;
      // let seriesData = this.initSeriesData(speciesData.same_series)
      let myChart = echarts.init(document.getElementById(this.chartId))
      this.echartsInstance = myChart
      myChart.setOption(option)
      // myChart.on('mouseenter', (params ) => {
      //     console.log(params.event.offsetX, params.event.offsetX);
      //     console.log(params);

      //   mytooltipIns = initMylTooltip(seriesData, params.event.x, params.event.y)
      // })
      // myChart.on('mouseleave', (params ) => {
      //   // console.log(params.event.x, params.event.y);
      //   mytooltipIns && mytooltipIns.attr("display", "none");
      // })
    },
    initSeriesData(data) {
    let res = [];
    for (let i of data) {
      res.push([
        {
          value: i.good_num,
          flag: "good",
          paint_order: 0,
          current_series: i.current_series,
          percent: i.percent,
        },
        {
          value: i.bad_num,
          flag: "bad",
          current_series: i.current_series,
          percent: i.percent,
        },
        {
          value: i.no_flag,
          flag: "no_flag",
          current_series: i.current_series,
          percent: i.percent,
        },
      ]);
    }
    return res;
  }
  },
  mounted() {
    // this.paintChart()
  },
}
</script>