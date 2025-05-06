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
import { pie } from "d3";
export class TSPEChart {
  constructor({ vn, width, height, data, ele }) {
    this._width = width;
    this._height = height;
    this._rawData = data;
    this._container = ele;
    this._margin = { top: 10, bottom: 10, left: 10, right: 10 };
    (this._buttonWidth = 40), (this._buttonHeight = 20);
    // button样式
    this._buttonActStroke = d3.color("#94a7b7").darker(0.1);
    this._buttonActFill = "#94a7b7";
    this._buttonActText = "#fff";
    this._buttonDeActStroke = d3.color("#94a7b7").darker(0.1);
    this._buttonDeActFill = "#fff";
    this._buttonDeActText = "#94a7b";
    // 设置group
    this._openG = null;
    this._detailG = null;
    this.processColor = {
      heat: "#fdc5a9",
      roll: "#b4b4b4",
      cool: "#6495ED",
    };
    this._sortButton = false;
    this._title = "T2";
    this._lableColor = {
      good: util.flagColor[0],
      bad: util.flagColor[1],
    };
    this._bubbleShow = false;
  }

  render() {
    this.#initRowData();
    // this.#initDetails();
    this.#initTSPEButton();
    this.#initArc();
    // 这里是绘制展开的图形
    // this.#initTreeChart("T2");
    // this.#initTooltip();
    // this.transition();
  }
  // CONTJ
  // CONTQ
  #initRowData() {
    for (let i = 0; i < 8; i++) {
      this._rawData.CONTJ[i].process = "plateSelf";
      this._rawData.CONTQ[i].process = "plateSelf";
    }
    for (let i = 8; i < 41; i++) {
      this._rawData.CONTJ[i].process = "heat";
      this._rawData.CONTQ[i].process = "heat";
    }
    for (let i = 41; i < 68; i++) {
      this._rawData.CONTJ[i].process = "measurFur";
      this._rawData.CONTQ[i].process = "measurFur";
    }
    for (let i = 68; i < 92; i++) {
      this._rawData.CONTJ[i].process = "roll";
      this._rawData.CONTQ[i].process = "roll";
    }
    if (this._rawData.CONTJ.length > 100) {
      for (let i = 92; i < this._rawData.CONTJ.length; i++) {
        this._rawData.CONTJ[i].process = "coll";
        this._rawData.CONTQ[i].process = "coll";
      }
    }
  }
  #initTSPEButton() {
    const that = this;
    const data = ["T2", "SPE"];
    this._container
      .append("g")
      .attr("class", "T2-SPE")
      .attr("transform", `translate(${this._margin.left}, ${this._margin.top})`)
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("class", "T2-SPE-Button")
      .attr("transform", (_, i) => `translate(0, ${40 * i})`)
      .attr("cursor", "pointer")
      .call((g) => {
        g.append("rect")
          .attr("width", this._buttonWidth)
          .attr("height", this._buttonHeight)
          .attr("rx", "5")
          .attr("ry", "5")
          .attr("stroke", (d) =>
            this._title == d ? this._buttonActStroke : this._buttonDeActStroke
          )
          .attr("fill", (d) =>
            this._title == d ? this._buttonActFill : this._buttonDeActFill
          );
        g.append("text")
          .attr("font-size", 12)
          .attr("fill", (d) =>
            this._title == d ? this._buttonActText : this._buttonDeActText
          )
          .text((d) => d)
          .attr("text-anchor", "middle")
          .attr("x", this._buttonWidth / 2)
          .attr("y", 15);
      })
      .on("click", function (event, d) {
        that._title = d;
        that._container
          .select(".T2-SPE")
          .transition(d3.transition().duration(500))
          .attr("transform", "translate(0, -100)")
          .remove();
        that._container
          .select(".openG")
          .transition(d3.transition().duration(500))
          .attr("transform", "translate(-200, -200)")
          // .attr('transform', 'translate(0, -100)')
          .remove();
        that.#initTSPEButton();
        that.#initArc();
      });
  }
  // 绘制arc和文字的
  #initArc() {
    let bubbleSvg = null;
    const { _margin, _width, _height, _buttonWidth } = this;
    let totalData = [];
    if (this._title == "T2") {
      totalData = [
        {
          value: this._rawData.CONTJ.filter((d) => d.value < 0.5).length,
          flag: "good",
          paint_order: 1,
        },
        {
          value: this._rawData.CONTJ.filter((d) => d.value > 0.5).length,
          flag: "bad",
          paint_order: 2,
        },
      ];
    } else {
      totalData = [
        {
          value: this._rawData.CONTQ.filter((d) => d.value < 0.5).length,
          flag: "good",
          paint_order: 1,
        },
        {
          value: this._rawData.CONTQ.filter((d) => d.value > 0.5).length,
          flag: "bad",
          paint_order: 2,
        },
      ];
    }
    this._openG = this._container.append("g").attr("class", "openG");
    // 绘制标题文字
    this._openG
      .append("g")
      .attr("class", "dia-text")
      .attr("transform", `translate(${this._margin.left}, ${'150'})`)
      .attr("font-size", 14)
      .attr('display', 'none')
      .attr("font-family", "sans-serif")
      .call((g) => {
        // g.append('rect')
        //   .attr('class', 'text-rect')
        //   .attr('width', 180)
        //   .attr('height', 120)
        //   .attr('fill', 'none')
        //   .attr('stroke', this._buttonDeActStroke)
        //   .attr('rx', 5)
        //   .attr('ry', 5)
        // 第一行
      
        let text1 = g.append("text").attr("y", -20)
        text1
          .append("tspan")
          .text(`${this._title}`)
          .style("font-weight", "bold")
          .attr("font-size", 14);
        text1.append("tspan").text(`诊断结果：`)
        // 第二行
        let text2 = g.append("text");
        text2.append("tspan").text(`针对`)
        text2
          .append("tspan")
          .text(`${this._rawData.CONTJ.length}`)
          .style("font-weight", "bold")
          .attr("font-size", 14);
        text2.append("tspan").text(`维过程数据诊断结果`)
        // 第三行
        let text3 = g.append("text").attr('y', 20)
        text3.append("tspan").text(`其中有`)
        text3
          .append("tspan")
          .text(`${totalData[1].value}`)
          .style("font-weight", "bold")
          .attr("font-size", 14);
        text3.append("tspan").text(`维过程数据贡献值大于`)
        text3
          .append("tspan")
          .text(`0.5`)
          .style("font-weight", "bold")
          .attr("font-size", 14);
        // g.append("text")
        //   .text(`其中有${totalData[1].value}维过程数据贡献值大于0.5;`)
        //   .attr("y", 20);
      });   
    const pieData = d3
      .pie()
      .value((d) => d.value)
      .sort((a, b) => a.paint_order - b.paint_order);
    // console.log(pieData(totalData));
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(_height / 2 - _margin.top - 20)
      .padAngle(0.03);
    this._openG
      .append("g")
      .attr("class", "dia-pie")
      .attr("transform", `translate(${_width / 2 + 50}, ${_height / 2})`)
      .call((g) => {
        g.selectAll("path")
          .data(pieData(totalData))
          .join("path")
          .attr("d", (d) => arc(d))
          .attr("fill", (d, i) => {
            // debugger
            return this._lableColor[d.data["flag"]];
          });
      })
      .on("click", (e, d) => {
        this._bubbleShow = !this._bubbleShow;
        if (this._bubbleShow) {
          this._container.select('.dia-text').attr('display', 'block')
          if (this._title == "T2") {
            bubbleSvg = initGlobalBablle(
              this._rawData.CONTJ,
              e.pageX,
              e.pageY,
              this._title
            );
          } else {
            bubbleSvg = initGlobalBablle(
              this._rawData.CONTQ,
              e.pageX,
              e.pageY,
              this._title
            );
          }
        } else {
          this._container.select('.dia-text').attr('display', 'none')
          bubbleSvg && bubbleSvg.attr("display", "none");
        }
      });
    
  }
}

function initGlobalBablle(data, x, y, title) {
  const ele = document.body;
  d3.select(".my-root-svg") && d3.select(".my-root-svg").remove();
  let width = 500,
    height = 500,
    svg = d3
      .select(ele)
      .append("svg")
      .attr("class", "my-root-svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "tooltipId")
      // .attr("pointer-events", "none") // 事件穿透
      .style("position", "absolute");
  // 添加svg
  svg
    .append("rect")
    .attr("class", "border")
    .attr("width", width)
    .attr("height", height)
    // .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", "#ccc")
    .attr("fill", "white");
  // const animation = d3.transition().duration(50);
  svg.style("top", `${y - height - 80}px`).style("left", `${x - width / 2}px`);
  // 设置cirle的颜色
  let _lableColor = {
      plateSelf: "#8dd3c7",
      heat: "#fb8072",
      measurFur: "#bc80bd",
      roll: "#d9d9d9",
      coll: "#80b1d3",
    },
    _lableENCH = {
      plateSelf: "钢板自身",
      heat: "加热工序",
      measurFur: "测量数据",
      roll: "轧制工序",
      coll: "冷却工序",
    };
  let pack = (data) => {
    return d3.pack().size([width - 50, height - 50])(
      d3
        .hierarchy({ children: data })
        .sum((d) => {
          // console.log(d)
          return d.value;
        })
        .sort((a, b) => b.value - a.value)
    );
  };
  const root = pack(data);
  // console.log(root);
  const leaves = root.leaves().filter((d) => d.depth && d.value);
  // 添加circle
  svg
    .append("g")
    .attr("fill", "#ddd")
    .attr("transform", `translate(25,0)`)
    .selectAll("circle")
    .data(leaves)
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", (d) => {
      return _lableColor[d.data.process];
    })
    .on("click", selectOccupation);
  // 添加字体
  svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${(width / 10) * 8}, ${(height / 10) * 8})`)
    .selectAll("g")
    .data(Object.keys(_lableColor))
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`)
    .call((g) => {
      g.append("circle")
        .attr("cx", 8)
        .attr("cy", 8)
        .attr("r", 8)
        .attr("fill", (d) => _lableColor[d]);
      g.append("text")
        .text((d) => _lableENCH[d])
        .attr("font-size", 12)
        .attr("font-weight", 500)
        .attr("font-style", "italic")
        .attr("fill", (d) => _lableColor[d])
        .attr("x", 18)
        .attr("y", 13);
    });

  let format = d3.format(",d");
  let current_circle = undefined;

  function selectOccupation(_, d) {
    let pre_color = d3.select(this).style("fill");
    // cleanup previous selected circle
    if (current_circle !== undefined) {
      current_circle.attr("fill", pre_color);
      svg.selectAll("#details-popup").remove();
    }

    // select the circle
    current_circle = d3.select(this);
    // 高亮的circle的颜色
    current_circle.attr("fill", "#e41a1c");

    let textblock = svg
      .selectAll("#details-popup")
      .data([d])
      .join("g")
      .attr("id", "details-popup")
      .attr("font-size", 14)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "start")
      .attr("transform", (d) => `translate(10, 460)`);

    textblock
      .append("text")
      .text(`${title}：诊断结果`)
      .attr("font-weight", "bold");
    textblock
      .append("text")
      .text((d) => en_ch[d.data.name] + "权重：" + d.value)
      .attr("y", "16");
  }
  return svg;
}
