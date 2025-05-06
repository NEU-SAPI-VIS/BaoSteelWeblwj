<template>
  <div class="heat-form">
    <!-- <el-row v-if="searchButtonShow"> -->
    <el-tooltip class="item" effect="dark" content="条件查找" placement="bottom">
      <el-button class="search-button" icon="el-icon-search" circle @click="changeFormSeen"></el-button>
    </el-tooltip>
    <!-- </el-row> -->
    <!-- 查找条件 -->
    <el-dialog title="冷却工序条件查找" :visible.sync="formSeen" width="30%" :before-close="handleClose">
      <form-search @clickSearch="searchDate"></form-search>
    </el-dialog>
    <el-row>
      <my-table v-if="tableShow" :tableData="tableData" :tableHead="tableHead" @show-detail="showDetail" />
    </el-row>
    <el-dialog title="变量趋势图" :visible.sync="dialogVis" width="80%" center>
      <div style="height: 600px; border: 1px grey" center>
        <!-- @change-chart="changeChart"  -->
        <cool-chart :buttonOption="coolOption" ref="coolScanner" @change-chart="changeCoolChart" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formSearch from "components/process/formsearch.vue";
import myTable from "components/process/myTable.vue";
import coolChart from "components/process/coolChart.vue";
import util from 'utils/util.js'
import * as processRequest from "services/process.js"
import * as d3 from "d3";
const colWidth = "65px",
  biggerWidth = '90px'
export default {
  components: {
    formSearch,
    myTable,
    coolChart
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
          en: "slabid",
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
          en: "tgtplatethickness2",
          ch: "目标厚度",
          // width: "100px",
          width: colWidth,
        },
        {
          en: "tgtwidth",
          ch: "目标宽度",
          width: colWidth,
        },
        {
          en: "tgtplatelength2",
          ch: "目标长度",
          width: colWidth,
        },
        {
          en: "cooling_mode",
          ch: "冷却模式",
          width: colWidth,
        },

        {
          en: "operate_mode",
          ch: "操作模式",
          width: colWidth,
        },
        {
          en: "start_time",
          ch: "冷却开始时间",
          width: '140px',
        },

        {
          en: "rolling_finish_temp",
          ch: "轧制结束温度",
          width: '80px',
        },
        {
          en: "avg_p1",
          ch: "精轧后温度测量值",
          width: biggerWidth,
        },
        {
          en: "cooling_start_temp",
          ch: "冷却开始温度",
          width: '80px',
        },
        {
          en: "avg_p2",
          ch: "预矫后温度测量值",
          width: biggerWidth,
        },
        {
          en: "cooling_stop_temp",
          ch: "冷却结束温度",
          width: '80px',
        },

        {
          en: "avg_p5",
          ch: "出口温度测量值",
          width: biggerWidth,
        },
        {
          en: "last_cooling_zone_length",
          ch: "冷却长度",
          width: colWidth,
        },
        {
          en: "avg_cr_act",
          ch: "冷却速率",
          width: colWidth,
        },
        {
          en: "speed_ratio",
          ch: "运行速率",
          width: colWidth,
        },
      ],
      tableData: [],
      coolOption: [
        {
          text: "Scanner",
          // focus: true
        },
        {
          text: "p1",
          // focus: true

        },
        {
          text: "p2",
          // focus: true
        },
        {
          text: "p3",
          // focus: true
        },
        {
          text: "p4",
          // focus: true
        },
        {
          text: "p6",
          // focus: true
        },
      ],
      coolData: {}
    }
  },
  methods: {
    changeFormSeen() {
      // console.log(122);
      // this.searchButtonShow = !this.searchButtonShow
      this.formSeen = !this.formSeen
    },
    handleClose() {
      this.changeFormSeen();
    },
    async searchDate(data) {
      this.changeFormSeen();
      this.searchForm = Object.assign(this.searchForm, data);
      this.ListQuery["start_time"] = util.timeFormatDump(data["time"][0])
      this.ListQuery["end_time"] = util.timeFormatDump(data["time"][1])
      this.ListQuery["catRule"] = data["catRule"]
      this.ListQuery["thickRule"] = data["thickRule"] == "0.3" ? 0.0003 : 0.0005
      // debugger
      let res = await processRequest.getCoolingTableData(this.ListQuery)
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
    async showDetail(row, index) {
      // row含有当前行的数据
      // index就是按钮的index（S,D）
      this.dialogVis = true
      this.requestParams = { "upid": row.upid };
      await processRequest.getCoolingDetails(this.requestParams).then((res) => {
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
    }

  },
  mounted() {

  },
}
</script>
<style lang="scss" scoped>
body {
  .heat-form .search-button {
    position: absolute;
    z-index: 10;
    // float: right;
    margin-left: 86.7vw;
    margin-top: 10px;
  }
}
</style>