<template>
  <div class="custom-marey">
    <el-row class="my-row my-card" :gutter="15">
      <!-- <div class="my-card"> -->
      <el-col :span="4" class=" left-col">
        <!-- 第一个控制面板 -->
        <el-row class="my-card-light">
          <div class="panel-title my-card-title">Control Panel</div>
          <div class="select-outside">
            <div class="select-title">
              月份选择
            </div>
            <div class="select-input">
              <el-date-picker class="my-date-picker" v-model="monthPickDate" type="month" placeholder="Pick a month" size="mini">
              </el-date-picker>
            </div>
          </div>
          <!-- 统计间隔 -->
          <div class="select-outside">
            <div class="select-title">
              统计间隔
            </div>
            <div class="select-input">
              <el-select v-model="intervalHour" filterable placeholder="请选择" size="mini" class="my-date-picker ">
                <el-option v-for="item in selectInterval" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <!-- 精度选择 -->
          <div class="select-outside">
            <div class="select-title">
              精度选择
            </div>
            <div class="select-input">
              <el-select v-model="thickRule" filterable placeholder="请选择" size="mini" class="my-date-picker ">
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <!-- 查询按钮 -->
          <div class="select-outside">
            <el-button class="my-button" size="mini" @click="paintTimeChart">查询</el-button>
          </div>
        </el-row>
        <!-- 第二个控制面板 -->
        <el-row class="my-card-light " style="margin-top:10px">
          <div class="panel-title my-card-title">参数选择</div>
          <!-- 聚类规则选择 -->
          <div class="select-outside">
            <div class="select-title">
              聚类规则
            </div>
            <div class="select-input">
              <el-select v-model="ruleShow" filterable placeholder="请选择" size="mini" class="my-slider ">
                <el-option v-for="item in ruleOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <!-- 统计间隔 -->
          <div v-show="ruleShow">
            <div class="select-outside" v-for="(item,index) in reqArr" :key="item.name">
              <div class="select-title">{{item.name}}
              </div>
              <div class="select-input">
                <el-slider v-model="item.gap" :step="item.interval" style="width:70%;" :format-tooltip="formatTooltip[index]" :min="item.min" :max="item.max"></el-slider>
              </div>
            </div>
          </div>
          <!-- 精度选择 -->
          <!-- 诊断选择 -->
          <div class="select-outside">
            <el-button class="my-button" size="mini" @click="paintSeriesChart($event ,2)">聚类</el-button>
          </div>
        </el-row>
      </el-col>
      <el-col :span="16" class="right-col">
        <!-- 时间总览视图 -->
        <el-row class="my-card-light chart-div">
          <div class="my-card-title">
            <div class="title-right">厚度质量概览视图</div>
          </div>
          <!-- <time-brush ref="timeChart" className="echarts" @timeBrushed='getGanttData'></time-brush> -->
          <div class="time-chart">
            <time-brush ref="timeChart" className="echarts" @timeBrushed='getSpecData'></time-brush>
          </div>
        </el-row>
        <!-- 规格视图 -->
        <el-row class="type-option my-card-light chart-div">
          <div class="my-card-title">
            <el-select v-model="typeValue" size="mini" @change='paintSeriesChart'>
              <el-option v-for="item in typeSortOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-button @click="paintSeriesChart($event ,1)" size="mini" class="invert-change my-button">翻转</el-button>
            <div class="title-right">规格分析视图</div>
          </div>
          <div class="series-chart">
            <div v-for="(item,index) in speciesData" :key="index" :span="2" class="series-chart-item" id="series-item">
              <seriesChart ref="seriresChart" @disgnosisMethod="disgnosisMethod"> </seriesChart>
            </div>
          </div>
        </el-row>
        <!-- 故障诊断视图 -->
        <el-row class="my-card-light dia-div">
          <div class="my-card-title">
            <div class="title-right">厚度异常诊断视图</div>
          </div>
          <!-- <time-brush ref="timeChart" className="echarts" @timeBrushed='getGanttData'></time-brush> -->
          <div class="dia-chart">
            <div v-for="(item,index) in diaData" :key="index" class="div-chart-upid">
              <div class="upid-chart">
                <diaChart ref="diaChart"></diaChart>
              </div>
            </div>
          </div>
        </el-row>
      </el-col>
      <el-col :span="4" class="detail-col">
        <el-row class="my-card-light chart-div">
          <div class="my-card-title">
            <div class="title-right">Detail View</div>
          </div>
          <div class="detail-view">
            <p>这里是详细信息展示区。</p>
          </div>
        </el-row>
      </el-col>
      <!-- </div> -->
    </el-row>
    <div>

    </div>
    <!-- 推荐视图 -->
    <!-- @click="changeDiagnosisVisible" -->
    <div class="recommends_view my-card-light" :class="{activate: recommendsView == true}">
      <div class="my-card-title">
        <div class="title-right">推荐视图</div>
      </div>
      <div class="recommends-div">
        <recommendsChart ref="recommendsChart" />
      </div>
    </div>
    <el-button circle icon="el-icon-more" id="recommends_button" @click=paintRecommendsChart></el-button>
    <!-- 加热变量趋势图 -->
    <el-dialog title="变量趋势图" :visible.sync="heatVis" width="80%" center>
      <div style="height: 600px; border: 1px grey" id="heatmap" center>
        <heat-chart :buttonOption="heatOption" ref="heatScanner" @change-chart="changeHeatChart" />
      </div>
    </el-dialog>
    <!-- 轧制变量趋势图 -->
    <el-dialog title="变量趋势图" :visible.sync="rollVis" width="80%" center>
      <div style="height: 600px; border: 1px grey" center>
        <!-- @change-chart="changeChart"  -->
        <roll-chart :buttonOption="rollOption" ref="rollScanner" @change-chart="changeRollChart" />
      </div>
    </el-dialog>
    <el-dialog title="变量趋势图" :visible.sync="coollVis" width="80%" center>
      <div style="height: 600px; border: 1px grey" center>
        <!-- @change-chart="changeChart"  -->
        <cool-chart :buttonOption="coolOption" ref="coolScanner" @change-chart="changeCoolChart" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { speciesData } from '@/utils/util.js'
import timeBrush from 'components/visual/timeBrush.vue'
import seriesChart from 'components/visual/seriesChart.vue'
import diaChart from '@/components/visual/diaChart.vue'
import recommendsChart from '@/components/visual/recommendsChart.vue'
// import diaData from '@/components/visual/initChat/diaData.json'
import rollChart from '@/components/process/rollChart.vue'
import heatChart from '@/components/process/heatChart.vue'
import coolChart from "@/components/process/coolChart.vue";
import util from 'utils/util.js'
import * as processRequest from "@/services/process.js"
import { mapGetters, mapMutations } from "vuex"
import * as d3 from 'd3'
// import util from '@/utils/util.js'
export default {
  name: 'visual-component',
  components: { timeBrush, seriesChart, diaChart, rollChart, heatChart, coolChart, recommendsChart },
  data() {
    return {
      // 加热的option
      heatOption: [
        { text: "上部炉温均值" },
        { text: "下部炉温均值" },
        { text: "板坯温度" }
      ],
      heatVis: false,
      chartData: null,
      legend: null,
      xData: [],
      upidIndex: 0,
      // 轧制的option
      rollChart: null,
      thicknessChart: null,
      rollForceChart: null,
      rollOption: [
        { text: "精轧出口厚度测量值" },
        { text: "宽度厚度随道次变化" },
        { text: "轧制力统计" }],
      rollVis: false,
      // 冷却的option
      coollVis: false,
       coolOption: [
        { text: "Scanner",},
        {text: "p1", },
        {text: "p2",},
        {text: "p3"},
        {text: "p4"},
        {text: "p6"},
      ],
      coolData: {},
      // 其他数据
      // 推荐视图
      recommendsView: false,
      diaData: null,
      // speciesData: undefined,
      dataTest: ["1", "2", "3", 6, 7, 9],
      // dataTest: null,
      // speciesData: speciesData,
      speciesData: null,
      // 规格分析视图排序
      typeSortOptions: [{
        value: 'time',
        label: '生产时间'
      }, {
        value: 'rhyme',
        label: '生产节奏'
      }, {
        value: 'quality',
        label: '生产质量'
      },
      {
        value: 'diaWeight',
        label: '诊断价值'
      }],
      typeValue: 'time',
      // 月份选择
      monthPickDate: new Date(2021, 2),
      // 统计间隔
      selectInterval: [{
        value: 6,
        label: '6h'
      }, {
        value: 12,
        label: '12h'
      }, {
        value: 24,
        label: '24h'
      }
      ],
      intervalHour: 6,
      // 精度选择
      selectOptions: [{
        value: 0.001,
        label: '严格'
      },
      {
        value: 0.003,
        label: '宽松'
      }],
      thickRule: 0.003,
      // 聚类选择
      ruleShow: false,
      ruleOptions: [{
        value: true,
        label: '网格划分'
      }, {
        value: false,
        label: 'HDBSCAN自动聚类'
      }],
      // 网格划分参数
      reqArr: [{
        name: '板坯厚度 ',
        en: 'slabthickness',
        val: 0,
        gap: 100,
        min: 10,
        max: 200,
        interval: 10,
        unit: "mm",
        checked: false
      }, {
        name: '出炉温度 ',
        en: 'tgtdischargetemp',
        val: 0,
        gap: 10,
        min: 5,
        max: 100,
        interval: 5,
        unit: "°C",
      },
      {
        name: '目标厚度 ',
        en: 'tgtplatethickness',
        val: 0,
        gap: 2,
        min: 1,
        max: 10,
        interval: 0.5,
        unit: "mm",

      }, {
        name: '目标宽度 ',
        en: 'tgtwidth',
        val: 0,
        gap: 1000,
        min: 100,
        max: 2500,
        interval: 100,
        unit: "mm",

      }, {
        name: '目标长度 ',
        en: 'tgtplatelength2',
        val: 0,
        gap: 30,
        min: 1,
        max: 30,
        interval: 1,
        unit: "m",


      }, {
        name: '终轧温度 ',
        en: 'tgttmplatetemp',
        val: 0,
        gap: 10,
        min: 5,
        max: 100,
        interval: 5,
        unit: "°C",


      }],
      bidReq: {
        'startBid': null,
        'endBid': null,
        'thickRule': '',
        'smode': 'A'
      },
      // 翻转控制按钮
      invertValue: false,
      // 双击的规格的bid，cid
      bid_cid: null,
      // 双击的钢种
      plateType: null
    }
  },
  computed: {
    formatTooltip: function () {
      let markArr = []
      for (let item of this.reqArr) {
        markArr.push(d => d + item.unit)
      }
      return markArr
    },
    ...mapGetters(['processOption'])
  },
  watch: {
    processOption() {
      this.showProcessChart()
    },
  },
  methods: {
    ...mapMutations(['changeFurProcessUpid']),
    showProcessChart() {
      if (this.processOption.process == 'heat') {
        this.getHeatData()
      }
      if (this.processOption.process == 'roll') this.getRollData(this.processOption.upid)
      if (this.processOption.process == 'cool') this.getCoolData(this.processOption.upid)
    },
    // 绘制加热视图
    async getHeatData() {
      let upidAll = Object.assign([], this.processOption.furUpid)
      let upidIndex = upidAll.length
      upidAll.push(this.processOption.upid)
      this.heatVis = true
      let upids = {
        "upids": JSON.stringify(upidAll)
      }
      let res = await processRequest.getFuranceDetailData({ "upidIndex": upidIndex }, upids)
      this.chartData = res;
      this.legend = Object.keys(this.chartData)
      this.legend.pop();
      this.xData = this.chartData.position
      let yData = []

      for (let i of this.legend) {
        yData.push(this.chartData[i].seg_u)
      }
      this.$refs.heatScanner.paint(this.legend, this.xData, yData, '上部炉温均值', this.upidIndex)
    },
    // 改变加热视图
    changeHeatChart(index) {
      let yData = []
      if (index == 0) {
        for (let i of this.legend) {
          yData.push(this.chartData[i].seg_u)
        }
        this.$refs.heatScanner.paint(this.legend, this.xData, yData, '上部炉温均值', this.upidIndex)
      } else if (index == 1) {
        for (let i of this.legend) {
          yData.push(this.chartData[i].seg_d)
        }
        this.$refs.heatScanner.paint(this.legend, this.xData, yData, '下部炉温均值', this.upidIndex)
      } else {

        for (let i of this.legend) {
          yData.push(this.chartData[i].plate)
        }
        this.$refs.heatScanner.paint(this.legend, this.xData, yData, '板坯温度', this.upidIndex)
      }
    },
    // 控制轧制图改变的函数
    changeRollChart(index) {
      if (index == 0) {
        this.$refs.rollScanner.paintRollChart(this.rollChart)
      } else if (index == 1) {
        this.$refs.rollScanner.paintThickness(this.thicknessChart);
      } else {
        this.$refs.rollScanner.paintRollForce(this.rollForceChart);
        // 这里的逻辑就是第三个图
      }
    },
    // 轧制请求数据的函数
    async getRollData(upid) {
      // row含有当前行的数据
      // index就是按钮的index（S,D）
      this.rollVis = true
      let requestParams = { "upid": upid ? upid : "20702018000" };
      // console.log(this.requestParams);
      await processRequest.getRollChart(requestParams).then((res) => {
        let resObj = JSON.parse(res)[0];
        this.rollChart = resObj
        this.$refs.rollScanner.paintRollChart(this.rollChart)
        // this.$refs.rollsvg.paintRoll(resObj);
        // this.rolldata=Object.assign({},this.rolldata,tempdata)
      });
      await processRequest.getRollWidth(requestParams).then((res) => {
        let resObj = JSON.parse(res);
        this.thicknessChart = resObj
        // console.log(resObj)
      })
      await processRequest.getRollthickness(requestParams).then((res) => {
        let resObj = JSON.parse(res);
        this.rollForceChart = resObj;
      });
    },
    // 请求冷却的数据
    async getCoolData(upid) {
      this.coollVis = true
      let requestParams = { "upid": upid ? upid : "20702018000" };
         await processRequest.getCoolingDetails(requestParams).then((res) => {
        let resObj = JSON.parse(res)[0]
        for (let i of ['p1', 'p2', 'p3', 'p4', 'p6']) {
          this.coolData[i] = {
            position: JSON.parse(resObj[i + "position"]),
            data: JSON.parse(resObj[i + "data"])
          }
        }
        let scaPostion = JSON.parse(resObj['scapostion']);
        let scaData = JSON.parse(resObj['scadata']);
        let minArr = [],
          maxArr = [],
          data = [];
        for (let i = 0; i < scaData.length; i++) {
          minArr.push(Math.min(...scaData[i]));
          maxArr.push(Math.max(...scaData[i]));
          for (let j = 0; j < scaData[i].length; j++) {
            data.push([j, i, scaData[i][j]])
          }
        }
        let min = Math.min(...minArr),
          max = Math.max(...maxArr)
        this.coolData['Scanner'] = {
          data: data,
          position: scaPostion,
          min: min,
          max: max
        }
        this.$refs.coolScanner.paint(this.coolData['p1'], 'p1温度');
        // this.rollChart = resObj
        // this.$refs.Scanner.paintRollChart(this.rollChart)
        // this.$refs.rollsvg.paintRoll(resObj);
        // this.rolldata=Object.assign({},this.rolldata,tempdata)
      });
    
    },
    changeCoolChart(index, text) {
      if (text == 'Scanner') {
        this.$refs.coolScanner.paintCoolChart(this.coolData[text], text);
      } else {
        this.$refs.coolScanner.paint(this.coolData[text], text + '温度');
      }
    },
    // 绘制时间总览视图
    async paintTimeChart() {
      // this.changeProcessButton(Math.random())
      let midTime = util.deepClone(this.monthPickDate)
      let timeQuery = {
        timeDiff: this.intervalHour,
        thickRule: this.thickRule,
        startTime: util.timeFormat(this.monthPickDate),
        endTime: util.timeFormat(new Date(midTime.setMonth(midTime.getMonth() + 1)))
      }
      let res = await processRequest.getTimeData(timeQuery)
      this.$refs.timeChart.initChart(res);
    },
    async getSpecData([start, end]) {
      this.bidReq.startBid = util.timeFormatDump(start)
      this.bidReq.endBid = util.timeFormatDump(end)
      this.bidReq.thickRule = this.thickRule
    },
    async paintSeriesChart(el, num) {
      // 请求数据
      if (num == 2) {
        // document.getElementsByClassName("series-chart").innerHTML = '';
        // d3.selectAll('#series-item') && d3.selectAll('#series-item').remove();
        let res = await processRequest.getPlateSpeciesStatics(this.bidReq)
        this.speciesData = res
      }
      const fn = () => {
        if (num == 1) {
          this.invertValue = !this.invertValue;
          // this.$forceUpdate()
          // console.log(this.invertValue);
        }
        if (this.typeValue == 'time') {
          for (let i = 0; i < this.speciesData.length; i++) {
            this.speciesData.sort((a, b) => a.cat_index - b.cat_index)
            // this.$refs.seriresChart[i].paintChart(this.speciesData[i])
            if (this.invertValue) { this.$refs.seriresChart[i].changeChart(this.speciesData[i], this.thickRule) }
            else { this.$refs.seriresChart[i].paintChart(this.speciesData[i], this.thickRule) }
          }
        } else if (this.typeValue == 'rhyme') {
          this.speciesData.sort((a, b) => a.proRhythm - b.proRhythm)
          for (let i = 0; i < this.speciesData.length; i++) {
            this.speciesData.sort((a, b) => a.proRhythmMax - b.proRhythmMax)
            if (this.invertValue) { this.$refs.seriresChart[i].changeChart(this.speciesData[i], this.thickRule) }
            else { this.$refs.seriresChart[i].paintChart(this.speciesData[i], this.thickRule) }

          }
        }
        else if (this.typeValue == 'quality') {
          this.speciesData.sort((a, b) => a.quanlity - b.quanlity)
          for (let i = 0; i < this.speciesData.length; i++) {
            if (this.invertValue) { this.$refs.seriresChart[i].changeChart(this.speciesData[i], this.thickRule) }
            else { this.$refs.seriresChart[i].paintChart(this.speciesData[i], this.thickRule) }

          }
        }
        else if (this.typeValue == 'diaWeight') {
          this.speciesData.sort((a, b) => b.dia_weight - a.dia_weight)
          for (let i = 0; i < this.speciesData.length; i++) {
            if (this.invertValue) { this.$refs.seriresChart[i].changeChart(this.speciesData[i], this.thickRule) }
            else { this.$refs.seriresChart[i].paintChart(this.speciesData[i], this.thickRule) }

          }
        }
      }
      // if (this.$refs.seriresChart) fn();
      // else 
      this.$nextTick(() => fn());


    },
    async disgnosisMethod([upids, bad_upids, bid_cid, plateType]) {
      this.recommendsView = false;
      d3.select('#recommendSvg') && d3.select('#recommendSvg').remove();
      // 请求诊断数据
      let c = []
      for (let i of upids) {
        if (bad_upids.includes(i)) continue;
        else c.push(i)
      }
      // 改变
      this.changeFurProcessUpid(c);
      this.bid_cid = bid_cid;
      this.plateType = plateType;
      // 获取diaData的数据
      this.diaData = await processRequest.getDiaData({ 'thick_rule': this.thickRule }, { 'upids': JSON.stringify(bad_upids) })
      this.$nextTick(() => {
        for (let i = 0; i < this.diaData.length; i++) {
          this.$refs.diaChart[i].paintAllChart(this.diaData[i])
        }
      })
    },
    // 绘制推荐视图
    async paintRecommendsChart() {
      this.recommendsView = !this.recommendsView
      let requesParams = {
        smode: this.bid_cid.smode,
        bid: this.bid_cid.bid,
        cid: this.bid_cid.cid,
        thickRule: this.thickRule
      },
        postParams = { platetype: this.plateType }
      d3.select('#recommendSvg') && d3.select('#recommendSvg').remove();
     if (this.recommendsView) {
       let res = await processRequest.getRecommendData(requesParams, postParams)
        this.$refs.recommendsChart.paintRecommendChart(res)
     } 

    }
  },
  mounted() {
    // this.diaData = diaData;
    // this.$nextTick(() => {
    //   for (let i = 0; i < this.diaData.length; i++) {
    //     this.$refs.diaChart[i].paintAllChart(this.diaData[i])
    //   }
    // });

  },

}
</script>
<style lang="scss" >
$button-color: #6287a6;
.custom-marey {
  /*控制整个滚动条*/
  margin-left: -10px;
  // 每一部分的card
  .my-card-light {
    // box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  }
  .my-card-title {
    // text-indent:20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: futura;
    background-color: #f7f7f7;
    font-weight: bold;
    text-align: center;
    font-size: 14px;
    color: #6d7885;
    height: 30px;
    padding: 0px 5px;
    // padding-left: 20px;
    border-bottom: solid 0.25px #e0e0e0;
    text-align: right;
    vertical-align: middle;
  }
  // .left-col{
  //   padding-right: 20px;
  // }
  .my-row {
    // height: 214px;

    // padding-top: 5px;
    padding: 5px 0 0 5px;
    .panel-title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      vertical-align: middle;
      display: flex;
      justify-content: left;

      // margin: 0 auto;
    }

    .select-outside {
      padding: 10px;
      display: flex;
      justify-content: center;
      font-size: 12px;
      align-items: center;
      .select-title {
        width: 30%;
        font-weight: bold;
        text-align: right;
        margin-right: 20px;
      }
      .select-input {
        width: 70%;
        text-align: left;
        .my-date-picker {
          font-size: 14px;
          width: 80%;
        }
      }
      .my-button {
        // padding: 5px 20px;
        color: $button-color;
        // background-color: $button-color;
        // background-color: rgb(236, 245, 255);
        // background-color: #ec643e;
      }
    }
    .right-col {
      .title-right {
        margin-left: auto;
      }
      .chart-div {
        margin-bottom: 7px;
      }
      .time-chart {
        height: 18vh;
      }
      .type-option {
        font-size: 8px;
        .my-card-title {
          display: flex;
          align-items: center;
          .invert-change {
            margin-left: 1em;
            align-items: center;
          }
          .title-right {
            margin-left: auto;
          }
        }
      }
      .series-chart {
        display: flex;
        overflow: auto;
        flex-wrap: nowrap;
        height: 150px;
        .series-chart-item {
          flex-shrink: 0;
          margin: 0 3px;
          width: 150px;
          height: 100%;
        }
      }
      .dia-div {
        .upid-title {
          float: left;
          padding-left: 0.5em;
        }
        .dia-chart {
          height: 44.5vh;
          overflow: auto;
          .div-chart-upid {
            border: 1px solid #b9bbbd;
            border-radius: 10px;
            margin-bottom: 5px;
            margin-left: 2px;
            margin-right: 2px;
          }
        }
        .upid-chart {
          height: 20vh;
        }
      }
    }
  }
  .recommends_view {
    z-index: 1;
    position: absolute;
    //  right: 10vw;
    height: 90.49%;
    width: 20vw;
    top: 51px;
    right: -500px;
    background-color: white;
    transition: right 0.5s;
    .recommends-div {
      height: 96%;
      // border: 1px solid red;
    }
    // transform: translateY(10%);  //滚动前的位置
    // opacity: 0.5;   //滚动前设置透明隐藏
    // border: 1px solid red;
  }
  .recommends_view.activate {
    // border: 1px solid red;
    right: 1.1vw;
    transition: right 0.5s;
  }
  #recommends_button {
    // float: right;
    z-index: 66666;
    position: absolute;
    right: 48px;
    bottom: 40px;
  }
  .select-input {
    .el-slider__bar {
      background: $button-color;
    }
    .el-slider__button {
      //   background: white;
      border-color: $button-color;
      width: 12px;
      height: 12px;
    }
  }

  // .select-input>>>
}
</style>