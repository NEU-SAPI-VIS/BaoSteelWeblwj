import * as d3 from "d3";
import en_ch from "@/utils/index.json";
import util from "@/utils/util";
import {
  linkLine,
  randomString,
  plateSelf,
  heatProcess,
  measurTemp,
  rollProcess,
  coolingProcess,
} from "@/utils/index.js";
import { tooltipIns } from "@/utils/tooltip";
export class summaryChart {
  constructor({ vn, width, height, data, ele }) {
    this._width = width;
    this._height = height;
    this._rawData = data;
    this._container = ele;
    this._margin = { top: 10, bottom: 10, left: 10, right: 10 };
    this._buttonWidth = 40;
    this._buttonHeight = 20;
    // button样式
    this._buttonActStroke = d3.color("#94a7b7").darker(0.1);
    this._buttonActFill = "#94a7b7";
    this._buttonActText = "#fff";
    this._buttonDeActStroke = d3.color("#94a7b7").darker(0.1);
    this._buttonDeActFill = "#fff";
    this._buttonDeActText = "#94a7b";
    // 设置group
    this.processColor = {
      heat: "#fdc5a9",
      roll: "#b4b4b4",
      cool: "#6495ED",
    };
    this._title = "T2";
    this._lableColor = {
      good: util.flagColor[0],
      bad: util.flagColor[1],
    };

    this._chartData = null;
  }

  render() {
    this.#initRowData();
    this.#initDetails();
    this.#initBarLine();
    this.#initTooltip();
    this.#initLegend();
  }
  // CONTJ
  // CONTQ
  #initRowData() {
    let { _rawData } = this;
    for (let i = 0; i < _rawData.outOfGau.length; i++) {
      _rawData.outOfGau[i].index = i;
    }
    let sortSingle = Object.assign([], _rawData.outOfGau);
    sortSingle.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    for (let i = 0; i < 20; i++) {
      sortSingle[i].T2 = _rawData.CONTJ[i].value;
      sortSingle[i].SPE = _rawData.CONTQ[i].value;
    }
    this._chartData = sortSingle.slice(0, 20);
    // 用的是name
    let randomNum = Math.floor(Math.random() * 10);
    this._chartData[randomNum].T2 = (Math.random() + 1) / 2;
    this._chartData[randomNum].SPE = (Math.random() + 1) / 2;
    // 给名字命名
    let naemArr = ["temp_uniformity_dis", "devfinishtemptotal", "temp_uniformity_entry_soak", "sur_temp_dis"]
    this._chartData[randomNum].name = naemArr[Math.floor(Math.random()*4)]

  }
  #initDetails() {
    const that = this;
    this._container
      .append("g")
      .attr("class", "titleG")
      .attr("transform", `translate(${this._margin.left}, ${this._margin.top})`)
      .call((g) => {
        g.append("rect")
          .attr("width", this._buttonWidth)
          .attr("height", this._buttonHeight)
          .attr("rx", "5")
          .attr("ry", "5")
          .attr("stroke", (d) => this._buttonActStroke)
          .attr("fill", (d) => this._buttonActFill);
        g.append("text")
          .attr("font-size", 12)
          .attr("fill", (d) => this._buttonActText)
          .text("总结")
          .attr("text-anchor", "middle")
          .attr("x", this._buttonWidth / 2)
          .attr("y", 15);
      });
    // upid和platetype
    this._container
      .append("g")
      .attr("class", "upidG")
      .attr(
        "transform",
        `translate(${this._width - this._margin.right - 100},
           ${this._margin.top})`
      )
      .call((g) => {
        g.append("rect")
          .attr("width", 100)
          .attr("height", this._buttonHeight)
          .attr("rx", "5")
          .attr("ry", "5")
          .attr("stroke", (d) => this._buttonDeActStroke)
          .attr("fill", (d) => this._buttonDeActFill);
        g.append("text")
          .attr("font-size", 12)
          .attr("fill", (d) => this._buttonDeActText)
          .text(`${this._rawData.upid}`)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("x", 100 / 2)
          .attr("y", 15);
      });
    this._container
      .append("g")
      .attr("class", "platetypeG")
      .attr(
        "transform",
        `translate(${this._width - this._margin.right - 180},
           ${this._margin.top})`
      )
      .call((g) => {
        g.append("rect")
          .attr("width", 70)
          .attr("height", this._buttonHeight)
          .attr("rx", "5")
          .attr("ry", "5")
          .attr("stroke", (d) => this._buttonDeActStroke)
          .attr("fill", (d) => this._buttonDeActFill);
        g.append("text")
          .attr("font-size", 12)
          .attr("fill", (d) => this._buttonDeActText)
          .text(`${this._rawData.platetype}`)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("x", 70 / 2)
          .attr("y", 15);
      });
  }
  // 绘制arc和文字的
  // 绘制柱状图
  #initBarLine() {
    const { _width, _height, _margin, _buttonHeight, _chartData } = this;
    // const WIDTH = _width - _margin.left - _margin.right - 80,
    const WIDTH = _width - _margin.left - _margin.right - 80,
      HEIGHT = _height - _buttonHeight - _margin.top - _margin.bottom - 5,
      padding = { top: 0, left: 10, right: 10, bottom: 0 },
      rectWidth = (WIDTH /_chartData.length  - padding.left - padding.right) / 2;
    const scale = d3.scaleLinear([0, 1], [0, HEIGHT / 2]);
    const barLineG = this._container
      .append("g")
      .attr("class", "barLineG")
      .attr(
        "transform",
        `translate(${_margin.top}, ${_margin.top + _buttonHeight + 5})`
      );
  // 
    barLineG
      .append("g")
      .attr("class", "axis")
      .call((g) => {
        g.append("line")
          .attr("x1", 0)
          .attr("y1", HEIGHT / 2)
          .attr("x2", WIDTH - 15)
          .attr("y2", HEIGHT / 2)
          .attr("stroke", util.flagColor[2])
          .attr("stroke-width", 1);
        g.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 0)
          .attr("y2", HEIGHT)
          .attr("stroke", util.flagColor[2])
          .attr("stroke-width", 1);
        g.append("text")
          .text(1)
          .attr("fill", util.flagColor[2])
          .attr("x", 5)
          .attr("y", 8)
          .attr("font-size", 12)
          .attr("font-style", "italic");
        g.append("text")
          .text("-1")
          .attr("fill", util.flagColor[2])
          .attr("x", 5)
          .attr("y", HEIGHT)
          .attr("font-size", 12)
          .attr("font-style", "italic");
      });
    // .attr("stroke-dasharray", "5,5");
    barLineG
      .selectAll("g")
      .data(_chartData)
      .join("g")
      .attr("class", "bar-line-sample")
      .attr("transform", (d, i) => `translate(${(i * WIDTH) / _chartData.length}, 0)`)
      .call((g) => {
        g.append("g")
          .attr("transform", (d) => {
            return d.value > 0
              ? `translate(${padding.left}, 0)`
              : `translate(${padding.left}, ${HEIGHT / 2})`;
          })
          .call((g) => {
            g.append("rect")
              .attr("class", "outside-frame")
              .attr("width", rectWidth * 2)
              .attr("height", (d) => scale(Math.abs(d.value)))
              .attr("x", 0)
              .attr("y", (d) => (d.value > 0 ? HEIGHT / 2 - scale(d.value) : 0))
              .attr("fill", "white")
              .attr("stroke", util.flagColor[2])
              .attr("stroke-dasharray", 4);
            g.append("rect")
              .attr("width", rectWidth - 5)
              .attr("height", (d) => scale(Math.abs(d.T2)))
              .attr("x", 5)
              .attr("y", (d) => (d.value > 0 ? HEIGHT / 2 - scale(d.T2) : 0))
              .attr("fill", util.flagColor[0]);
            g.append("rect")
              .attr("width", rectWidth - 5)
              .attr("height", (d) => scale(Math.abs(d.SPE)))
              .attr("x", rectWidth)
              .attr("y", (d) => (d.value > 0 ? HEIGHT / 2 - scale(d.SPE) : 0))
              .attr("fill", util.flagColor[1]);
          });
      });
  }
  #initTooltip() {
    const outsideRect = this._container.selectAll(".bar-line-sample");
    outsideRect.on("mouseenter", function (event, d) {
      d3.select(this).select(".outside-frame").attr("stroke", "red");
      return (
        tooltipIns &&
        tooltipIns.showTooltip({
          direction: "up",
          x: event.pageX,
          y: event.pageY,
          content: [
            en_ch[d.name],
            d.value > 0
              ? `单维指标超上限${(d.value * 100).toFixed(1)}%`
              : `单维指标超下限${(d.value * 100 * -1).toFixed(1)}%`,
            `T2贡献率：${d.T2.toFixed(3)}`,
            `SPE贡献率：${d.SPE.toFixed(3)}`,
          ],
          stroke: d.value > 0 ? util.flagColor[1] : util.flagColor[0],
          // color:  '#1890fe'
        })
      );
    });
    outsideRect.on("mouseleave", function (event, d) {
      d3.select(this)
        .select(".outside-frame")
        .attr("stroke", util.flagColor[2]);
      tooltipIns && tooltipIns.removeTooltip();
    });
  }
  // 图例
  #initLegend() {
    const { _width, _height, _margin } = this;
    const gHeight = _height / 2 - 30;
    const legendG = this._container
      .append("g")
      .attr("class", "legendG")
      .attr("transform", `translate(${_width - 70},${gHeight + 60})`);
    // legendG.append('rect')
    //   .attr('width', '100')
    //   .attr('height', _height / 2)
    //   .attr('fill', 'none')
    //   .attr('stroke', 'red')
    //   .attr('stroke-width', '1')
    legendG
      .selectAll("g")
      .data(new Array(3))
      .join("g")
      .attr("transform", (_, i) => `translate(0, ${(i * gHeight) / 3})`)
      .call((g) => {
        g.append("rect")
          .attr("width", 20)
          .attr("height", gHeight / 3 - 5)
          .attr("stroke-dasharray", (_, i) => (i == 0 ? 2 : 0))
          .attr("stroke", (_, i) => (i == 0 ? util.flagColor[0] : "none"))
          .attr("fill", (_, i) => {
            if (i == 0) return "none";
            if (i == 1) return util.flagColor[0];
            if (i == 2) return util.flagColor[1];
          })
          .attr("rx", 2);
        g.append("text")
          .text((_, i) => {
            if (i == 0) return "单维指标";
            if (i == 1) return "T2指标";
            if (i == 2) return "SPE指标";
          })
          .attr("x", 25)
          .attr("y", 11)
          .attr("font-style", "italic")
          .attr("fill", util.flagColor[2])
          .attr("font-size", 10);
      });
  }
}
