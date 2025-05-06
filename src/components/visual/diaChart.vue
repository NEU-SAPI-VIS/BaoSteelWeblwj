<template>
  <div class="dia-Single">
    <div class="single-chart" :id="singleChart" />
    <!-- <div class="t2-spe" :id="speChart" /> -->
    <div class="summary" :id="summaryChart" />
  </div>
</template>
<script>
// import HeatDat from './heatData'
import * as d3 from 'd3';
import { singleChart } from '@/components/visual/initChat/single';
import { TSPEChart } from './initChat/TSPEChart';
import { summaryChart } from './initChat/summaryChart'
import { mapGetters, mapMutations } from "vuex";
export default {
  name: 'diaChart',
  data() {
    return {
      singleChart: 'single-chart' + Math.random().toString(32).slice(-6),
      speChart: 'spe-chart' + Math.random().toString(32).slice(-6),
      summaryChart: 'summary' + Math.random().toString(32).slice(-6)
    }
  },
  computed: {
    ...mapGetters(['furProcessUpid'])
  },
  methods: {
    ...mapMutations(['changeProcessOption']),
    paintSingle(data) {
      const transition = d3.transition().duration(1000)
      // this.furData = fur_data
      d3.select(this.$el).select('#singleSVG').transition().remove()
      const ele = document.getElementById(`${this.singleChart}`)
      const svg = d3.select(ele)
        .append('svg')
        .attr('width', ele.clientWidth)
        .attr('height', ele.clientHeight)
        .attr('id', 'singleSVG')
      // this.paintTSpechart(data)
      new singleChart({ vn: this, width: ele.clientWidth, height: ele.clientHeight, data: data, ele: svg }).render()
    },
    paintTSpechart(data) {
      d3.select(this.$el).select('#speSvg').transition().remove()
      const ele = document.getElementById(`${this.speChart}`)
      const svg = d3.select(ele)
        .append('svg')
        .attr('width', ele.clientWidth)
        .attr('height', ele.clientHeight)
        .attr('id', 'speSvg')
      new TSPEChart({ vn: this, width: ele.clientWidth, height: ele.clientHeight, data: data, ele: svg }).render()
    },
    paintSummaryChart(data) {
      d3.select(this.$el).select('#summarySvg').transition().remove()
      const ele = document.getElementById(`${this.summaryChart}`)
      const svg = d3.select(ele)
        .append('svg')
        .attr('width', ele.clientWidth)
        .attr('height', ele.clientHeight)
        .attr('id', 'summarySvg')
      new summaryChart({ vn: this, width: ele.clientWidth, height: ele.clientHeight, data: data, ele: svg }).render()
    },
    paintAllChart(data) {
      this.paintSingle(data);
      // this.paintTSpechart(data)
      this.paintSummaryChart(data);
    }
  },
  mounted() {
  },
}
</script>
<style lang="scss" scoped>
.dia-Single {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  .single-chart {
    height: 100%;
    flex-basis: 25%;
  }
  // .t2-spe {
  //   height: 100%;
  //   flex-basis: 25%;
  //   border-left: 1px dashed #ccc;
  // }
  .summary {
    height: 100%;
    flex-basis: 75%;
    border-left: 1px dashed #ccc;
  }
}
</style>