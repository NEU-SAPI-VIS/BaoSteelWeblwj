<template>
  <div class="heat-form">
    <!-- <el-row v-if="searchButtonShow" class="search-row"> -->
    <el-tooltip class="item" effect="dark" content="条件查找" placement="bottom">
      <el-button class="search-button" icon="el-icon-search" circle @click="changeFormSeen"></el-button>
    </el-tooltip>
    <!-- </el-row> -->
    <!-- 查找条件 -->
    <el-dialog title="加热工序条件查找" :visible.sync="formSeen" width="30%">
      <form-search @clickSearch="searchDate"></form-search>
    </el-dialog>
    <el-row>
      <my-table v-if="tableShow" :tableData="tableData" :tableHead="tableHead" @show-detail="showDetail" />
    </el-row>
    <!-- 详情页 -->
    <el-dialog title="变量趋势图" :visible.sync="dialogVis" width="80%" center>
      <div style="height: 600px; border: 1px grey" id="heatmap" center>
        <heat-chart :buttonOption="buttonOption" ref="Scanner" @change-chart="changeChart" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formSearch from "components/process/formsearch.vue";
import myTable from "components/process/myTable.vue";
import util from 'utils/util.js';
import heatChart from 'components/process/heatChart.vue'
import * as processRequest from "services/process.js"
import * as d3 from "d3";
const colWidth = "65px";
export default {
  components: {
    formSearch,
    myTable,
    heatChart
  },
  data() {
    return {
      formSeen: false,
      tableShow: false,
      dialogVis: false,
      searchForm: {
        time: ["2018-10-1 00:00:00", "2018-10-30 01:00:00"],
        radio: "",
        catRule: "",
      },
      ListQuery: {
        start_time: "",
        end_time: "",
        catRule: "",
        thickRule: ""
      },
      tableHead: [
        {
          en: "slab_no",
          ch: "板坯编号",
          // width: "100px",
          width: "100px",
        },
        {
          en: "upid",
          ch: "母版ID",
          width: "100px",
        },
        {
          en: "heating_pattern_code",
          ch: "加热模式",
          // width: "100px",
          width: colWidth,
        },
        {
          en: "slabwidth",
          ch: "板坯宽度",
          width: colWidth,
        },
        {
          en: "slabthickness",
          ch: "板坯厚度",
          width: colWidth,
        },
        {
          en: "preHeat",
          ch: "预热段",
          children: [
            {
              en: "ave_temp_entry_pre",
              ch: "EntT",
              width: colWidth,
            },
            {
              en: "ave_temp_pre",
              ch: "AveT",
              width: colWidth,
            },
            {
              en: "staying_time_pre",
              ch: "Time",
              width: colWidth,
            },
          ],
        },
        {
          en: "1stHeat",
          ch: "加热I段",
          children: [
            {
              en: "ave_temp_entry_1",
              ch: "EntT",
              width: colWidth,
            },
            {
              en: "ave_temp_1",
              ch: "AveT",
              width: colWidth,
            },
            {
              en: "staying_time_1",
              ch: "Time",
              width: colWidth,
            },
          ],
        },
        {
          en: "2ndHeat",
          ch: "加热2段",
          children: [
            {
              en: "ave_temp_entry_2",
              ch: "EntT",
              width: colWidth,
            },
            {
              en: "ave_temp_2",
              ch: "AveT",
              width: colWidth,
            },
            {
              en: "staying_time_2",
              ch: "Time",
              width: colWidth,
            },
          ],
        },
        {
          en: "soakHeat",
          ch: "均热段",
          children: [
            {
              en: "ave_temp_entry_soak",
              ch: "EntT",
              width: colWidth,
            },
            {
              en: "ave_temp_soak",
              ch: "AveT",
              width: colWidth,
            },
            {
              en: "staying_time_soak",
              ch: "Time",
              width: colWidth,
            },
          ],
        },
        {
          en: "outPutT",
          ch: "出炉段",
          children: [
            {
              en: "ave_temp_dis",
              ch: "AVET",
              width: colWidth,
            },
            {
              en: "temp_uniformity_dis",
              ch: "UNIT",
              width: colWidth,
            },
          ],
        },
        {
          en: "charging_time",
          ch: "在炉时间",
          width: colWidth,
        },
      ],
      tableData: [],
      buttonOption: [
        {
          text: "上部炉温均值",
          focus: true
        },
        {
          text: "下部炉温均值",
          focus: true

        },
        {
          text: "板坯温度",
          focus: true

        },
      ],
      options: {
        legend: {},
        tooltip: {},
        xAxis: { type: "category" },
        yAxis: {},
        series: [],
        dataset: [],
      },
      chartData: null,
      legend: null,
      xData: [],
      upidIndex: 0
    }
  },
  methods: {
    changeFormSeen() {
      this.formSeen = !this.formSeen
    },
    handleClose() {
      this.changeFormSeen();
    },
    // 搜索表格数据
    async searchDate(data) {
      this.changeFormSeen();
      this.searchForm = Object.assign(this.searchForm, data);
      this.ListQuery["start_time"] = util.timeFormatDump(data["time"][0])
      this.ListQuery["end_time"] = util.timeFormatDump(data["time"][1])
      this.ListQuery["catRule"] = data["catRule"]
      this.ListQuery["thickRule"] = data["thickRule"] == "0.3" ? 0.0003 : 0.0005
      // debugger
      let res = await processRequest.getFuranceTableData(this.ListQuery)
      this.tableData = JSON.parse(res);
      // debugger
      let catMaxIndex = this.tableData[this.tableData.length - 1]["cat_index"]
      const colorScale = d3.scaleOrdinal(d3.schemePaired).domain([0, catMaxIndex]);
      // const colorScale = d3.interpolateTurbo();
      for (let item of this.tableData) {
        item.steelSpec = {
          name: item.steelspec,
          color: colorScale(item.cat_index)
        }
      }
      this.tableShow = true;
      // this.changeTableLoading();
    },
    // 绘制加热视图
    async showDetail(row, index) {
      this.dialogVis = true
      let upids = util.getAllUpids(this.tableData, row.cat_index, row.upid)
      let upidIndex = { "upidIndex": upids.indexOf(row.upid) }
      this.upidIndex = upids.indexOf(row.upid);
      console.log(upids);
      upids = {
        "upids": JSON.stringify(upids)
      }
      console.log(upids);
      let res = await processRequest.getFuranceDetailData(upidIndex, upids)
      this.chartData = res;
      this.legend = Object.keys(this.chartData)
      this.legend.pop();
      this.xData = this.chartData.position
      let yData = []

      for (let i of this.legend) {
        yData.push(this.chartData[i].seg_u)
      }
      this.$refs.Scanner.paint(this.legend, this.xData, yData, '上部炉温均值',this.upidIndex)
      // console.log(this.$refs.Scanner);
      // 处理jsonData
    },
    // 改变加热视图
    changeChart(index) {
      let yData = []
      if (index == 0) {
        for (let i of this.legend) {
          yData.push(this.chartData[i].seg_u)
        }
        // this.$refs.Scanner.echartsInstance.clear()
        this.$refs.Scanner.paint(this.legend, this.xData, yData, '上部炉温均值',this.upidIndex)
      } else if (index == 1) {
        for (let i of this.legend) {
          yData.push(this.chartData[i].seg_d)
        }
        // this.$refs.Scanner.echartsInstance.clear()
        this.$refs.Scanner.paint(this.legend, this.xData, yData, '下部炉温均值',this.upidIndex)
      } else {

        for (let i of this.legend) {
          yData.push(this.chartData[i].plate)
        }
        // this.$refs.Scanner.echartsInstance.clear()
        this.$refs.Scanner.paint(this.legend, this.xData, yData, '板坯温度',this.upidIndex)
      }
    }

  },
  mounted() {

  },
}
</script>
<style lang="scss" scoped>
body {
  .heat-form {
    // .search-row {
    .search-button {
      position: absolute;
      z-index: 10;
      // float: right;
      margin-left: 86.7vw;
      margin-top: 10px;
    }
    // }
  }
}
</style>