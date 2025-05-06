<template>
  <div class="roll-form">
    <!-- <el-row v-if="searchButtonShow"> -->
    <el-tooltip class="item" effect="dark" content="条件查找" placement="bottom">
      <el-button class="search-button" icon="el-icon-search" circle @click="changeFormSeen"></el-button>
    </el-tooltip>
    <!-- </el-row> -->
    <!-- 查找条件 -->
    <el-dialog title="轧制工序条件查找" :visible.sync="formSeen" width="30%" :before-close="handleClose">
      <form-search @clickSearch="searchDate"></form-search>
    </el-dialog>
    <el-row>
      <my-table v-if="tableShow" :tableData="tableData" :tableHead="tableHead" @show-detail="showDetail" />
    </el-row>
    <el-dialog title="变量趋势图" :visible.sync="dialogVis" width="80%" center>
      <div style="height: 600px; border: 1px grey" center>
        <!-- @change-chart="changeChart"  -->
        <roll-chart :buttonOption="buttonOption" ref="Scanner" @change-chart="changeChart" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formSearch from "components/process/formsearch.vue";
import myTable from "components/process/myTable.vue";
import util from 'utils/util.js'
import rollChart from 'components/process/rollChart.vue'
import * as processRequest from "services/process.js"
import * as d3 from "d3";
const mincolWidth = "65px"
export default {
  components: {
    formSearch,
    myTable,
    rollChart
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
          en: "slabthickness",
          ch: "板坯厚度",
          width: mincolWidth,
        },
        {
          en: "slabwidth",
          ch: "板坯宽度",
          width: mincolWidth,
        },
        {
          en: "slablength",
          ch: "板坯长度",
          width: mincolWidth,
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
          width: mincolWidth,
        },
        {
          en: "tgtplatelength2",
          ch: "目标长度",
          width: mincolWidth,
        },
        {
          en: "tgtwidth",
          ch: "目标宽度",
          width: mincolWidth,
        },
        {
          en: "measuredweight",
          ch: "测量质量",
          width: mincolWidth,
        },
        {
          en: "tappingsteelgrade",
          ch: "功丝钢种",
          width: '82px',
        },
        {
          en: "timerollingstart",
          ch: "轧制开始时间",
          width: '120px',
        },
        {
          en: "timerollingfinish",
          ch: "轧制结束时间",
          width: '120px',
        },
        {
          en: "crcode",
          ch: "轧制编码",
          width: mincolWidth,
        },
        {
          en: "totalpassesrm",
          ch: "粗轧道次",
          width: mincolWidth,
        },
        {
          en: "totalpassesfm",
          ch: "精轧道次",
          width: mincolWidth,
        },
        {
          en: "topbrplatecountrm",
          ch: "粗轧换辊",
          width: mincolWidth,
        },
        {
          en: "topbrplatecountfm",
          ch: "精轧换辊",
          width: mincolWidth,
        },
        {
          en: "tgtdischargetemp",
          ch: "出钢温度",
          width: mincolWidth,
        },
      ],
      tableData: [],
      buttonOption: [
        {
          text: "精轧出口厚度测量值",
          // focus: true
        },
        {
          text: "宽度厚度随道次变化",
          // focus: true

        },
        {
          text: "轧制力统计",
          // focus: true
        },
      ],
      requestParams: {},
      rollChart: null,
      thicknessChart: null,
      rollForceChart: null
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
      let res = await processRequest.getMPassTableData(this.ListQuery)
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
        if (item.timerollingstart) {
          item.timerollingstart = util.timeFormatStr(item.timerollingstart)
          item.timerollingfinish = util.timeFormatStr(item.timerollingfinish)
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
      // console.log(this.requestParams);
      await processRequest.getRollChart(this.requestParams).then((res) => {
        let resObj = JSON.parse(res)[0];
        this.rollChart = resObj
        this.$refs.Scanner.paintRollChart(this.rollChart)
        // this.$refs.rollsvg.paintRoll(resObj);
        // this.rolldata=Object.assign({},this.rolldata,tempdata)
      });
      await processRequest.getRollWidth(this.requestParams).then((res) => {
        let resObj = JSON.parse(res);
        this.thicknessChart = resObj
        // console.log(resObj)
      })
      await processRequest.getRollthickness(this.requestParams).then((res) => {
        let resObj = JSON.parse(res);
        this.rollForceChart = resObj;
      });
    },
    changeChart(index) {
      if (index == 0) {
        this.$refs.Scanner.paintRollChart(this.rollChart)
      } else if (index == 1) {
        this.$refs.Scanner.paintThickness(this.thicknessChart);
      } else {
        this.$refs.Scanner.paintRollForce(this.rollForceChart);
        // 这里的逻辑就是第三个图
      }
    }

  },
  mounted() {

  },
}
</script>
<style lang="scss" scoped>
body {
  .roll-form .search-button {
    position: absolute;
    z-index: 10;
    // float: right;
    margin-left: 86.7vw;
    margin-top: 10px;
  }
}
</style>