<template>
  <div class="heat-details">
    <el-row class="button-row">
      <el-button v-for="(item, index) in buttonOption" :key="item.text" class="search-button" :autofocus="item.focus" @click="changeChart(index, item.text)">{{ item.text }}</el-button>
    </el-row>
    <el-row class="fur-line-chart">
      <div :id="chartId" style="height: 500px"></div>
      <!-- <line-chart ref="furlc" style="height: 400px"></line-chart> -->
    </el-row>
  </div>
</template>
<script>
import * as echarts from "echarts"
export default {
  props: {
    buttonOption: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      chartId: 'diagnosis-heatmap' + Math.random().toString(32),
      option: {
        tooltip: {},
        title: {},
        xAxis: {},
        yAxis: {},
        // 图例
        // legend: 
        series: []
      },
      echartsInstance: undefined,
      color: ["#1ed66c", "#a80000"]
    }
  },
  methods: {
    // 需要传入的legend，xdata,5geYdata,title
    paint(data, title) {
      // debugger
      if (this.echartsInstance != null && this.echartsInstance != "" && this.echartsInstance != undefined) {
        this.echartsInstance.dispose();//销毁
      }
      let myChart = echarts.init(document.getElementById(this.chartId))
      this.echartsInstance = myChart;
      this.option = this.$options.data().option
      this.option.title.text = title
      // this.option.title.textAlign = 'center'
      this.option.xAxis = {
        type: "category",
        data: data["position"],
        boundaryGap: false,
        // name:"钢板长度方向",
        axisLabel: {
          formatter: function (value, index) {
            if (typeof (value) !== Number) {
              return (+(value)).toFixed(2);
            } else {
              return value.toFixed(2);
            }
          },
        },
      }
      this.option.tooltip = {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          animation: false,
          label: {
            backgroundColor: "#ccc",
            borderColor: "#aaa",
            borderWidth: 1,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            textStyle: {
              color: "#222",
            },
          },
        },
        // formatter: function (params) {
        //   let newParams = [];
        //   let tooltipString = [];
        //   newParams = [...params];
        //   newParams.sort((a, b) => {
        //     return b.value - a.value;
        //   });
        //   newParams.forEach((p) => {
        //     const cont =
        //       p.marker + " " + p.seriesName + ": " + p.value.toFixed(6) + "<br/>";
        //     tooltipString.push(cont);
        //   });
        //   return tooltipString.join("");
        // },
      }
      this.option.yAxis = {
        show: true,
        type: "value",
        min: Math.min(...data['data']) * 0.98,
        max: Math.max(...data['data']) * 1.02,
        splitLine: {
          show: true,
        },
        axisTick: {
          show: true // 不显示坐标轴刻度线
        },
        axisLabel: {
          formatter: function (value) {
            if (typeof (value) !== Number) {
              return (+(value)).toFixed(2);
            } else {
              return value.toFixed(2);
            }
          },
        },
      }
      this.option.series = {
        data: data["data"],
        type: 'line',
        // smooth: true
      }
      myChart.setOption(this.option)
    },
    paintCoolChart(data, title) {
      // debugger
      if (this.echartsInstance != null && this.echartsInstance != "" && this.echartsInstance != undefined) {
        this.echartsInstance.dispose();//销毁
      }
      let myChart = echarts.init(document.getElementById(this.chartId))
      this.echartsInstance = myChart;
      this.option = this.$options.data().option
      this.option.title.text = title
      this.option.tooltip = {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          animation: false,
          label: {
            backgroundColor: "#ccc",
            borderColor: "#aaa",
            borderWidth: 1,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            textStyle: {
              color: "#222",
            },
          },
        },
      }
      this.option.xAxis = {
        type: "category",
        data: data['position'],
        axisLabel: {
          formatter: function (value, index) {
            if (typeof value !== Number) {
              return (+value).toFixed(2);
            } else {
              return value.toFixed(2);
            }
          },
        }
      }
      this.option.yAxis = {
        type: "category",
        data: [
          "Scanner00",
          "Scanner01",
          "Scanner02",
          "Scanner03",
          "Scanner04",
          "Scanner05",
          "Scanner06",
          "Scanner07",
          "Scanner08",
        ],
        // axisLabel: {
        //   fontWeight: "normal",
        //   fontSize: "5px",
        // },
      }
      this.option.visualMap = {
        min: data['min'],
        max: data.max,
        calculable: true,
        realtime: false,
        orient: "horizontal",
        right: "33%",
        bottom: "0%",
        inRange: {
          color: [
            "#313695",
            "#4575b4",
            "#74add1",
            "#abd9e9",
            "#e0f3f8",
            "#ffffbf",
            "#fee090",
            "#fdae61",
            "#f46d43",
            "#d73027",
            "#a50026",
          ],
        },
      }
      this.option.series = [
        {
          name: "Heat",
          type: "heatmap",
          data: data.data
        }
      ]
      myChart.setOption(this.option)
    },
    changeChart(index, text) {
      this.$emit('change-chart', index, text)
    }
  },
  mounted() {
    // this.paint();
  },
}
</script>

<style lang="scss" scoped>
.heat-details {
  .button-row {
    display: flex;
    justify-content: center;
    .search-button {
      margin: 0 30px;
    }
  }
}
</style>