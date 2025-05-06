<template>
  <div style="width: 100%; height:100%" :id="recommendId">
    <!-- gagh -->
  </div>
</template>
<script>
import * as d3 from 'd3';
import recommendData from './initChat/recommend.json'
import {recommendSvg} from '@/components/visual/initChat/recommenChart.js'
export default {
  data() {
    return {
      recommendId: 'recommend' + Math.random.toString(32).slice(-6)
    }
  },
  methods: {
    paintRecommendChart(data) {
      d3.select(this.$el).select('#recommendSvg') && d3.select(this.$el).select('#recommendSvg').remove();
      const ele = document.getElementById(`${this.recommendId}`)
      const svg = d3.select(ele)
        .append('svg')
        .attr('width', ele.clientWidth)
        .attr('height', ele.clientHeight)
        .attr('id', 'recommendSvg')
      new recommendSvg({width: ele.clientWidth, height: ele.clientHeight, data: data, ele: svg }).render()
    }
  },
  mounted() {
    // this.paintRecommendChart(recommendData)
  },
}
</script>