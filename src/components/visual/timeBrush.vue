<!-- <template>
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
</script> -->

<template>
  <div :id="id" style="height:100%; width:100%;">
    <!-- 加载动画 -->
    <!-- <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div> -->
  </div>
</template>

<script>
import * as d3 from 'd3';
import util from 'utils/util.js';

export default {
  name: 'TimeBrushD3',
  data() {
    return {
      id: 'timeChart-' + Math.random().toString(32).substr(2),
      svg: null,         // 持有 D3 SVG 实例
      margin: { top: 10, right: 5, bottom: 5, left: 5 },
      width: 0,
      height: 0,
      debounceTimer: null
      // isLoading: true
    };
  },
  methods: {
    /**
     * 简单防抖函数：在同一帧内多次触发 brush 时，只在一定延迟后真正调用 emitBrush
     */
    debounceBrush(fn, delay) {
      return (...args) => {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    },

    /**
     * 初始化并绘制堆叠柱状图 + 刷选功能
     * Data 结构示例：
     * {
     *   endTimeOutput: ['2021-01-01', '2021-01-02', ...],
     *   good_flag:   [10, 20, 30, ...],
     *   bad_flag:    [5,  2,  0,  ...],
     *   no_flag:     [3,  1,  4,  ...]
     * }
     */
    initChart(Data) {
      // 1. 首先清空旧的 SVG（如果存在）
      const container = d3.select(`#${this.id}`);
      container.selectAll('svg').remove();

      // 2. 计算宽高
      const bbox = document.getElementById(this.id).getBoundingClientRect();
      this.width = bbox.width - this.margin.left - this.margin.right;
      // this.width = bbox.width
      this.height = bbox.height - this.margin.top - this.margin.bottom;
      // this.height = bbox.height- this.margin.bottom
      if (this.width <= 0 || this.height <= 0) {
        // 若容器未真正渲染，延迟一点再试
        setTimeout(() => this.initChart(Data), 50);
        return;
      }

      // 3. 拼装原始数据为 D3 stack 所需格式
      const categories = Data.endTimeOutput.slice(); // X 轴类别（时间）
      const seriesNames = ['good_flag', 'bad_flag', 'no_flag'];
      const rawSeries = seriesNames.map(key => Data[key]);

      // 构造输入给 d3.stack 的二维数组：
      // [
      //   { category: '2021-01-01', good_flag:10, bad_flag:5,  no_flag:3 },
      //   { category: '2021-01-02', good_flag:20, bad_flag:2,  no_flag:1 },
      //   ...
      // ]
      const stackedInput = categories.map((cat, i) => {
        return {
          category: cat,
          good_flag: Data.good_flag[i]   || 0,
          bad_flag:  Data.bad_flag[i]    || 0,
          no_flag:   Data.no_flag[i]     || 0
        };
      });

      // 4. 使用 d3.stack 生成堆叠数据
      const stackGen = d3.stack().keys(seriesNames);
      const stackedSeries = stackGen(stackedInput);
      // stackedSeries 是一个数组，长度为 3（good_flag、bad_flag、no_flag），
      // 每个元素都是一个包含 N 段 [y0, y1] 的数组，对应每个 category。

      // 5. 生成比例尺 (Scales)
      // X 轴：band scale，domain 为 categories
      const xScale = d3.scaleBand()
        .domain(categories)
        .range([0, this.width])
        .paddingInner(0.1)
        // .padding(0.01);
        .paddingOuter(0.05);

      // Y 轴：linear scale，domain 从 0 到 所有堆叠之和的最大值
      const maxY = d3.max(stackedSeries[stackedSeries.length - 1], d => d[1]);
      const yScale = d3.scaleLinear()
        .domain([0, maxY])
        .nice()
        .range([this.height, 0]);

      const colorScale = d3.scaleOrdinal()
        .domain(seriesNames)
        .range(util.flagColor); 

      // 6. 创建 SVG
      this.svg = container
        .append('svg')
        .attr('width', '100%') // 填满容器
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
      
      const legend = this.svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(0, -10)`); // 向上移动，放在柱状图上方

      seriesNames.forEach((key, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(${i * 120}, 0)`); // 水平排列

        legendRow.append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', colorScale(key));

        legendRow.append('text')
          .attr('x', 24)
          .attr('y', 13)
          .text(key.replace('_flag', '')) // 如 good/bad/noflag
          .style('font-size', '12px')
          .style('fill', '#333');
      });

      const showAxis = false;

      if (showAxis) {
        const xAxis = d3.axisBottom(xScale);
        this.svg.append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0, ${this.height})`)
          .call(xAxis);

        const yAxis = d3.axisLeft(yScale);
        this.svg.append('g')
          .attr('class', 'y-axis')
          .call(yAxis);
      }


      // 8. 绘制堆叠矩形（bar segments）
      
        // 假设 util.flagColor = ['#XXXXXX', '#YYYYYY', '#ZZZZZZ']

      // 每个 series 都要画一个 <g>，然后在其中为每个 category 画一个 rect
      const seriesGroup = this.svg.selectAll('.series-group')
        .data(stackedSeries)
        .enter()
        .append('g')
        .attr('class', 'series-group')
        .attr('fill', d => colorScale(d.key));

      // 在每个 group 里，绘制每个堆叠层对应的 rect
      seriesGroup.selectAll('rect')
        .data(d => d) // d 是一个数组，代表当前 series 在每个 category 的 [y0, y1]
        .enter()
        .append('rect')
        .attr('x', (d, i) => xScale(categories[i]))
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .append('title') // 简单 tooltip
        .text((d, i, nodes) => {
          const seriesKey = d3.select(nodes[i].parentNode).datum().key;
          const value = stackedInput[i][seriesKey];
          return `${categories[i]} — ${seriesKey}: ${value}`;
        });

      // 9. 添加 Brush（只能在 X 轴范围内水平刷选）
      const brush = d3.brushX()
        .extent([[0, 0], [this.width, this.height]])
        .on('brush end', this.debounceBrush(this.emitBrush.bind(this, xScale, categories), 50));

      this.svg.append('g')
        .attr('class', 'x-brush')
        .call(brush);
    },

    /**
     * 处理 D3 Brush 回调
     * @param {d3.ScaleBand} xScale 
     * @param {Array<string>} categories 
     * @param {Object} event D3 事件对象
     */

    // emitBrush(xScale, categories, event) {
    //   const allRects = this.svg.selectAll('.series-group rect');

    //   if (!event.selection) {
    //     // 👉 没有刷选，恢复所有柱子的原始颜色和不透明度
    //     allRects
    //       .attr('fill-opacity', 1);
    //     this.$emit('timeBrushed', null);
    //     return;
    //   }

    //   const [x0, x1] = event.selection;
    //   const selectedCats = categories.filter(cat => {
    //     const xPos = xScale(cat);
    //     const bw = xScale.bandwidth();
    //     return (xPos + bw > x0 && xPos < x1);
    //   });

    //   if (selectedCats.length === 0) return;

    //   const startTime = selectedCats[0];
    //   const endTime = selectedCats[selectedCats.length - 1];

    //   // ✅ 只改变透明度，不改变颜色
    //   allRects
    //     .attr('fill-opacity', (d, i, nodes) => {
    //       const cat = categories[i];
    //       return selectedCats.includes(cat) ? 1 : 0.3; // 0.3 表示“变浅”
    //     });

    //   this.$emit('timeBrushed', [startTime, endTime]);
    // }
    emitBrush(xScale, categories, event) {
      const allRects = this.svg.selectAll('.series-group rect');
      const timePointCount = categories.length;

      if (!event.selection) {
        allRects.attr('fill-opacity', 1);
        this.$emit('timeBrushed', null);
        return;
      }

      const [x0, x1] = event.selection;
      const selectedSet = new Set(); // 使用Set提高性能
      
      categories.forEach(cat => {
        const xPos = xScale(cat);
        const bw = xScale.bandwidth();
        // 精确判断柱形中心是否在刷选范围内
        if (xPos + bw/2 >= x0 && xPos + bw/2 <= x1) {
          selectedSet.add(cat);
        }
      });

      // 使用模运算确保正确对应时间点
      allRects.attr('fill-opacity', (d, i) => {
        const timeIndex = i % timePointCount;
        return selectedSet.has(categories[timeIndex]) ? 1 : 0.3;
      });

      // 发射事件逻辑保持不变
      if (selectedSet.size > 0) {
        const sorted = [...selectedSet].sort();
        this.$emit('timeBrushed', [sorted[0], sorted[sorted.length-1]]);
      } else {
        this.$emit('timeBrushed', null);
      }
    }
  }
};
</script>

<style scoped>
/* 可根据需要微调坐标轴、文字、背景等样式 */
.x-axis path,
.x-axis line,
.y-axis path,
.y-axis line {
  stroke: #ccc;
}

.x-axis text {
  font-size: 12px;
  fill: #555;
}

.y-axis text {
  font-size: 12px;
  fill: #555;
}

.series-group rect {
  stroke: none;
}

.x-brush .selection {
  fill: rgba(150, 200, 255, 0.3);
  stroke: #96c8ff;
}

/* .loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
} */

</style>
