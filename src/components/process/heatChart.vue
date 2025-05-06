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
      chartId: 'diagnosis-heatmap' + Math.random().toString(32),
      option: {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
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
            // console.log(params);
            let newParams = [];
            let tooltipString = [];
            newParams = [...params];
            newParams.sort((a, b) => {
              return b.value - a.value;
            });
            newParams.forEach((p) => {
              // console.log(typeof(p.value,p.value));
              const cont =
                p.marker + " " + p.seriesName + ": " + p.value.toFixed(2) + "<br/>";
              tooltipString.push(cont);
            });
            return tooltipString.join("");
          },
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: {
            formatter: function (value, index) {
              if (typeof (value) !== Number) {
                return (+(value)).toFixed(2);
              } else {
                return value.toFixed(2);
              }
            },
          },
        },
        yAxis: {
          type: 'value',
        },
        // 图例
        legend: {
          data: []
        },
        series: [
          {
            data: [],
            type: 'line',
            itemStyle: {
              normal: {
                color: '#1ed66c', //改变折线点的颜色
                lineStyle: {
                  color: '#1ed66c' //改变折线颜色
                }
              }
            },
          },
          {
            data: [],
            type: 'line',
            itemStyle: {
              normal: {
                color: '#1ed66c', //改变折线点的颜色
                lineStyle: {
                  color: '#1ed66c' //改变折线颜色
                }
              }
            },
          },
          {
            data: [],
            type: 'line',
            itemStyle: {
              normal: {
                color: '#a80000', //改变折线点的颜色
                lineStyle: {
                  color: '#a80000' //改变折线颜色
                }
              }
            },
          },
          {
            data: [],
            type: 'line',
            itemStyle: {
              normal: {
                color: '#1ed66c', //改变折线点的颜色
                lineStyle: {
                  color: '#1ed66c' //改变折线颜色
                }
              }
            },
          },
          {
            data: [],
            type: 'line',
            itemStyle: {
              normal: {
                color: '#1ed66c', //改变折线点的颜色
                lineStyle: {
                  color: '#1ed66c' //改变折线颜色
                }
              }
            },
          },
        ]
      },
      echartsInstance: undefined,
      color: ["#1ed66c", "#a80000"]
    }
  },
  methods: {
    // 需要传入的legend，xdata,5geYdata,title
    paint(legend, xData, yData, title, upidIndex) {
      // debugger
      this.option.title.text = title
      this.option.xAxis.data = xData
      this.option.legend.data = legend
      for (let i = 0; i < yData.length; i++) {
        this.option.series[i].data = yData[i];
        this.option.series[i].name = legend[i];
        if (i == upidIndex) {
          this.option.series[i].itemStyle.normal.color = this.color[1]
          this.option.series[i].itemStyle.normal.lineStyle.color = this.color[1]
        } else {
          this.option.series[i].itemStyle.normal.color = this.color[0]
          this.option.series[i].itemStyle.normal.lineStyle.color = this.color[0]
        }
      }
      if (this.echartsInstance != null && this.echartsInstance != "" && this.echartsInstance != undefined) {
        this.echartsInstance.dispose();//销毁
      }
      var myChart = echarts.init(document.getElementById(this.chartId))
      this.echartsInstance = myChart;
      myChart.setOption(this.option)
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