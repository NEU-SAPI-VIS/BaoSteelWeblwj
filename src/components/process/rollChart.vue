<template>
  <div class="heat-details">
    <el-row class="button-row">
      <el-button v-for="(item, index) in buttonOption" :key="item.text" class="search-button" :autofocus="item.focus" @click="changeChart(index)">{{ item.text }}</el-button>
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
      chartId: 'diagnosis-heatmap',
      options: {
        // legend: {
        //     data: []
        // },
        legend: {
          data: [],
        },
        xAxis: [],
        yAxis: {
          show: true,
          type: "value",
          splitLine: {
            show: true,
          },
        },
        series: [],
        tooltip: {
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
          formatter: function (params) {
            let newParams = [];
            let tooltipString = [];
            newParams = [...params];
            newParams.sort((a, b) => {
              return b.value - a.value;
            });
            newParams.forEach((p) => {
              const cont =
                p.marker + " " + p.seriesName + ": " + p.value.toFixed(6) + "<br/>";
              tooltipString.push(cont);
            });
            return tooltipString.join("");
          },
        },
      },
      echartsInstance: undefined,
      color: ["#1ed66c", "#a80000"]
    }
  },
  methods: {
    // 绘制厚度尺寸图
    paintRollChart(data) {
      // this.options = JSON.parse(JSON.stringify(option));
      if (this.echartsInstance != null && this.echartsInstance != "" && this.echartsInstance != undefined) {
        this.echartsInstance.dispose();//销毁
      }
      let myChart = echarts.init(document.getElementById(this.chartId));
      this.echartsInstance = myChart
      this.options.yAxis = {
        show: true,
        type: "value",
        axisLabel: {
          formatter: function (value, index) {
            return value.toFixed(4);
          },
        },
      };
      this.options.xAxis = {
        name: "Legnth Position(m)",
        nameLocation: "center",
        nameTextStyle: {
          fontFamily: "Arial",
          fontWeight: "normal",
          lineHeight: 25,
          fontSize: 16,
        },
        show: true,
        type: "category",
        data: data["position"],
        boundaryGap: false,
        splitLine: { show: true },
        axisLabel: {
          fontSize: 10,
          formatter: function (value, index) {
            return String((+value).toFixed(4));
          },
        },
      };

      let alldata = [];
      let legend = ["rightthickness", "centerthickness", "leftthickness"],
        series = []
      this.options.legend.data = legend;
      for (let item of legend) {
        series.push({
          name: item,
          type: "line",
          data: data[item],
          markLine: {
            symbol: ["none", "none"],
            label: {
              position: "end", //标线位置，start，middle，end
            },
            precision: 6,
            data: [
              {
                label: {
                  formatter: "目标厚度",
                  fontSize: "12",
                },
                yAxis: data.tgtplatethickness2
              },
            ],
          },
        });

        alldata.push(...data[item]);
      }
      this.options.series = series
      this.options.legend.top = "6%";
      this.options.yAxis.min = Math.min(...alldata) * 0.98;
      this.options.yAxis.max = Math.max(...alldata) * 1.02;
      this.options.series = series;
      this.options.xAxis.show = true;
      myChart.setOption(this.options);
      window.onresize = myChart.resize;

    },
    // 绘制轧制宽度和厚度随道次变化图
    paintThickness(data) {
      // this.options = JSON.parse(JSON.stringify(option));
      if (this.echartsInstance != null && this.echartsInstance != "" && this.echartsInstance != undefined) {
        this.echartsInstance.dispose();//销毁
      }
      let myChart = echarts.init(document.getElementById(this.chartId));
      this.echartsInstance = myChart
      this.options.yAxis = [
        {
          show: true,
          type: "value",
          axisLabel: {
            fontSize: 10,
          },
          name: "width(m)",
          nameLocation: "center",
          nameTextStyle: {
            fontFamily: "Arial",
            fontWeight: "normal",
            lineHeight: 25,
            fontSize: 16,
          },
        },
        {
          show: true,
          type: "value",
          axisLabel: {
            fontSize: 10,
          },
          name: "thickness(mm)",
          nameLocation: "center",
          nameTextStyle: {
            fontFamily: "Arial",
            fontWeight: "normal",
            lineHeight: 25,
            fontSize: 16,
          },
        },
      ];
      this.options.xAxis = {
        show: true,
        type: "category",
        data: data["position"],
        boundaryGap: false,
        splitLine: { show: true },
        name: "Passes",
        nameLocation: "center",
        nameTextStyle: {
          fontFamily: "Arial",
          fontWeight: "normal",
          lineHeight: 25,
          fontSize: 16,
        },
        axisLabel: {
          fontSize: 10,
        },
      };
      this.options.legend.data = ["thickness", "width"];
      this.options.legend.top = "6%";
      this.options.series = [{
        yAxisIndex: 1,
        name: "thickness",
        type: "line",
        data: data["thickness"],
      }, {
        yAxisIndex: 0,
        name: "width",
        type: "line",
        data: data["width"],
      }
      ]
      this.options.legend.top = "6%";
      myChart.setOption(this.options);
      window.onresize = myChart.resize;
    },
    paintRollForce(data) {
      if (this.echartsInstance != null && this.echartsInstance != "" && this.echartsInstance != undefined) {
        this.echartsInstance.dispose();//销毁
      }
      let myChart = echarts.init(document.getElementById(this.chartId));
      this.echartsInstance = myChart
      this.options.yAxis = [
        {
          show: true,
          type: "value",
          axisLabel: {
            formatter: function (value, index) {
              return value / 1000000;
            },
            fontSize: 10,
          },
          name: "Forces(kt)\nTorque(MN.m)",
          nameLocation: "center",
          nameTextStyle: {
            fontFamily: "Arial",
            fontWeight: "normal",
            lineHeight: 25,
            fontSize: 16,
          },
        },
        {
          show: true,
          type: "value",
          axisLabel: {
            formatter: function (value, index) {
              return value * 100;
            },
            fontSize: 10,
          },
          name: "Epsilon(%)",
          nameLocation: "center",
          nameTextStyle: {
            fontFamily: "Arial",
            fontWeight: "normal",
            lineHeight: 25,
            fontSize: 16,
          },
        },
      ];
      this.options.xAxis = {
        show: true,
        type: "category",
        data: data["position"],
        boundaryGap: false,
        splitLine: { show: true },
        name: "Passes",
        nameLocation: "center",
        nameTextStyle: {
          fontFamily: "Arial",
          fontWeight: "normal",
          lineHeight: 25,
          fontSize: 16,
        },
        axisLabel: {
          fontSize: 10,
        },
      };
      let series = [],
        legend = ["ForceMeas", "ForcePost", "TorqueMeas", "TorquePost"]
      for (let item of legend) {
        series.push({
          yAxisIndex: 0,
          name: item,
          type: "line",
          data: data[item],
        });
        this.options.xAxis.show = true;
      }
      series.push({
        yAxisIndex: 1,
        name: "Epsilon",
        type: "line",
        data: data["Epsilon"],
        // markArea: {
        //   silent: true,
        //   data: [
        //     [
        //       {
        //         xAxis: data["passPhase"][0],
        //       },
        //       {
        //         xAxis: data["passPhase"][1],
        //       },
        //     ],
        //     [
        //       {
        //         xAxis: data["passPhase"][2],
        //       },
        //       {
        //         xAxis: data["passPhase"][3],
        //       },
        //     ],
        //   ],
        //   itemStyle: {
        //     color: "#90EE90",
        //     opacity: 0.4,
        //   },
        // },
      });
      legend.push("Epsilon");
      this.options.legend.data = legend
      this.options.legend.top = "6%";
      this.options.series = series;
      myChart.setOption(this.options);
      window.onresize = myChart.resize;
    },
    changeChart(index) {
      this.$emit('change-chart', index)
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