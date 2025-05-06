import * as d3 from "d3";
import util from "@/utils/util";
import { initMylTooltip, tooltipIns } from "@/utils/tooltip";

export class recommendSvg {
  constructor({ width, heigh, data, ele }) {
    this._container = ele;
    this._margin = { top: 10, left: 5, bottom: 5, right: 5 };
    this._width = width;
    this._heigh = heigh;
    this._rawData = data;
    // button的样式
    this._buttonWidth = 70;
    this._buttonHeight = 20;
    this._buttonActStroke = d3.color("#94a7b7").darker(0.1);
    this._buttonActFill = "#94a7b7";
    this._buttonActText = "#fff";
    this._buttonDeActStroke = d3.color("#94a7b7").darker(0.1);
    this._buttonDeActFill = "#fff";
    this._buttonDeActText = "#94a7b";
    // 控制按钮
    this._controlFlag = { time: true, quality: false };
    this._buttonTextENCH = { time: "时间排序", quality: "质量排序" };
    // 每一个规格的group的宽和高
    this._W = 70;
    this._ringW = 8;
    this._ringPadding = 3;
    // 颜色指标（质量，厚度，宽度，冷却）
    this._lableColor = ["#6287a6", "#BF6A67", "#F2B3EB", "#93b7e3"];
    // seriesG的padding
    this._padding = { left: 10, top: 10 };
    this._sameSeries = false;
  }

  render() {
    // console.log(dir);
    this.#initData();
    this.#initControlButton();
    this.#initContent();
    this.#initTooltip();
  }
  #initData() {
    const { _ringW, _ringPadding, _W } = this;
    const R = _W / 2;
    const handleData = util
      .deepClone(this._rawData)
      .sort((d) => d.quanlity_index);
    const PI = Math.PI;
    // 编数据
    handleData.sort((a, b) => a.quanlity_index - b.quanlity_index);
    for (let i = 0; i < handleData.length; i++) {
      if (i == 0) {
        handleData[i].sameSeries = Math.floor(Math.random() * 3) + 3;
        continue;
      }
      if (i == 2) {
        handleData[i].sameSeries = Math.floor(Math.random() * 2) + 2;
        continue;
      }
      if (handleData[i].cur_index) {
        handleData[i].sameSeries = 1;
        continue;
      }
      handleData[i].sameSeries = Math.floor(Math.random() * 4);
    }
    handleData.sort((a, b) => a.toc_index - b.toc_index);
    // 处理的是圆环的数据
    for (let i = 0; i < handleData.length; i++) {
      let detail = handleData[i].detail;
      // 处理钢板质量 质量比例尺是所有钢板质量从0 -1
      // let quanlity_arr = detail.map((d) => d.flag.quanlity);
      let quanlity_scale = d3.scaleLinear([0, 1], [0, PI * 2]);
      // 处理厚度 厚度比例尺起始点为 0 - 3/2PI（根据最小宽度来定义到最大宽度的）厚度范围都是PI/2是同一个序列中的
      let thickness_arr = detail.map((d) => d.tgtthickness[0]);
      let thickness_scale = d3.scaleLinear(d3.extent(thickness_arr), [
        0,
        PI * 1.5,
      ]);
      // 宽度比例尺度比例尺起始点为 0 - 3/2PI（根据最小宽度来定义到最大宽度的）宽度范围是0.5PI-PI/2是同一个序列中的（宽度范围）
      let width_arr = detail.map((d) => d.tgtwidth[0]);
      let width_gap = detail.map((d) => d.tgtwidth_gap);
      let widthBegin_scale = d3.scaleLinear(d3.extent(width_arr), [
        0,
        PI * 1.5,
      ]);
      let widthEnd_scale = d3.scaleLinear(d3.extent(width_gap), [PI * 0.5, PI]);
      for (let detail_i = 0; detail_i < 3; detail_i++) {
        // 质量检测
        detail[detail_i]["quanlity_arc"] = d3
          .arc()
          .innerRadius(R - _ringW)
          .outerRadius(R)
          .startAngle(0)
          .endAngle(quanlity_scale(detail[detail_i].flag.quanlity))
          .cornerRadius(5);
        detail[detail_i]["quanlity_arc_bg"] = d3
          .arc()
          .innerRadius(R - _ringW)
          .outerRadius(R)
          .startAngle(0)
          .endAngle(Math.PI * 2)
          .cornerRadius(5);
        // 厚度检测
        detail[detail_i]["thickness_arc"] = d3
          .arc()
          .innerRadius(R - (_ringW + _ringPadding) - _ringW)
          .outerRadius(R - (_ringW + _ringPadding))
          .startAngle(thickness_scale(detail[detail_i].tgtthickness[0]))
          .endAngle(thickness_scale(detail[detail_i].tgtthickness[0]) + PI)
          .cornerRadius(5);
        detail[detail_i]["thickness_arc_bg"] = d3
          .arc()
          .innerRadius(R - (_ringW + _ringPadding) - _ringW)
          .outerRadius(R - (_ringW + _ringPadding))
          .startAngle(0)
          .endAngle(Math.PI * 2)
          .cornerRadius(5);
        // 宽度检测
        detail[detail_i]["width_arc"] = d3
          .arc()
          .innerRadius(R - (_ringW + _ringPadding) * 2 - _ringW)
          .outerRadius(R - (_ringW + _ringPadding) * 2)
          .startAngle(widthBegin_scale(detail[detail_i].tgtwidth[0]))
          .endAngle(
            widthEnd_scale(detail[detail_i].tgtwidth_gap) +
              widthBegin_scale(detail[detail_i].tgtwidth[0])
          )
          .cornerRadius(5);
        detail[detail_i]["width_arc_bg"] = d3
          .arc()
          .innerRadius(R - (_ringW + _ringPadding) * 2 - _ringW)
          .outerRadius(R - (_ringW + _ringPadding) * 2)
          .startAngle(0)
          .endAngle(Math.PI * 2)
          .cornerRadius(5);
      }
    }
    this._handleData = handleData;
  }
  #initControlButton() {
    const { _width, _margin, _container, _controlFlag, _W, _padding } = this;
    const controlG = _container
      .append("g")
      .attr("class", "controlG")
      .attr(
        "transform",
        `translate(${_width / 2 - this._buttonWidth - 5}, ${_margin.top})`
      );
    // 添加button按钮
    controlG
      .selectAll("g")
      .data(Object.keys(_controlFlag))
      .join("g")
      .attr(
        "transform",
        (_, i) => `translate(${i * (this._buttonWidth + 10)}, 0)`
      )
      .attr("cursor", "pointer")
      .call((g) => {
        // 添加矩形
        g.append("rect")
          .attr("width", this._buttonWidth)
          .attr("height", this._buttonHeight)
          .attr("fill", (d) =>
            this._controlFlag[d] ? this._buttonActFill : this._buttonDeActFill
          )
          .attr("stroke", (d) =>
            this._controlFlag[d]
              ? this._buttonActStroke
              : this._buttonDeActStroke
          )
          .attr("rx", 5);
        // 添加文字
        g.append("text")
          .attr("font-size", 12)
          .attr("fill", (d) =>
            this._controlFlag[d] ? this._buttonActText : this._buttonDeActText
          )
          .text((d) => this._buttonTextENCH[d])
          .attr("text-anchor", "middle")
          .attr("x", this._buttonWidth / 2)
          .attr("y", 15);
      })
      // 顶端点击逻辑
      .on("click", (e, i) => {
        if (!this._controlFlag[i]) {
          for (let key of Object.keys(this._controlFlag)) {
            this._controlFlag[key] = !this._controlFlag[key];
          }
          _container
            .select(".controlG")
            .transition(d3.transition().duration(500))
            .attr("transform", "translate(0, -100)")
            .remove();
          this.#initControlButton();
        } else {
          return 1;
        }
        if (this._controlFlag.time) {
          _container
            .selectAll(".seriesG")
            .transition(d3.transition().duration(500))
            .attr(
              "transform",
              (d, i) => `translate(40, ${(_W + _padding.top) * d.toc_index})`
            );
        } else {
          _container
            .selectAll(".seriesG")
            .transition(d3.transition().duration(500))
            .attr(
              "transform",
              (d, i) =>
                `translate(40, ${(_W + _padding.top) * d.quanlity_index})`
            );
        }
      });
  }
  #initContent() {
    // debugger
    const {
      _width,
      _margin,
      _buttonHeight,
      //圆的直径
      _W,
      _handleData,
      _lableColor,
      _padding,
    } = this;
    // const padding = { left: 10, top: 10 };
    // const _handleData = this._rawData;
    const contentG = this._container
      .append("g")
      .attr("class", "contentG")
      .attr(
        "transform",
        `translate(${_margin.left}, ${_margin.top + _buttonHeight + 10})`
      );

    this._status = new Array(_handleData.length).fill(false);

    contentG
      .selectAll("g")
      .data(_handleData)
      // 添加8个group
      .join("g")
      .attr("class", "seriesG")
      // 这里控制三个圆的移动位置
      .attr("transform", (d, i) => `translate(40, ${(_W + _padding.top) * i})`)
      .attr("data-index", (_, i) => i)
      .call((g) => {
        // 外面的边框
        g.append("g")
          .attr("class", "other-info")
          .attr("transform", `translate(-40, -2)`)
          .call((g) => {
            // 外边框
            g.append("rect")
              .attr("width", _width - _margin.left - _margin.right)
              .attr("height", _W + _padding.top / 2)
              // .attr("x", -60)
              // .attr("y", -2)
              .attr("fill", "none")
              .attr("stroke", util.flagColor[1])
              .attr("stroke-dasharray", 4)
              .attr("display", (d) => (d.cur_index ? "block" : "none"));
            // 中间连接线
            // g.append("rect")
            //   .attr("x", 273)
            //   .attr("y", 2)
            //   .attr("width", 100)
            //   .attr("height", _W)
            //   .attr("fill", "none")
            //   .attr("stroke", util.flagColor[2])
            //   .attr("stroke-dasharray", 4);
            // 同序列的个数
            g.append("g")
              .attr("class", "same-series")
              .attr("transform", `translate(20, 20)`)
              .call((g) => {
                g.append("circle")
                  .attr("r", 12)
                  .attr("fill", "none")
                  .attr("stroke", util.flagColor[1]);
                g.append("text")
                  .attr("font-size", 16)
                  .attr("font-family", "sans-serif")
                  .style("font-style", "italic")
                  .attr("fill", util.flagColor[1])
                  .text((d) => d.sameSeries)
                  .attr("x", "-6")
                  .attr("y", 5);
              });
            // 钢种信息
            g.append("g")
              .attr("class", "platetype-info")
              .attr("transform", `translate(273, 2)`)
              .selectAll("g")
              .data((d) => d.detail.map((d) => d.platetype))
              .join("g")
              .attr("transform", (d, i) => {
                return `translate(5, ${i * 22 + 4})`;
              })
              .call((g) => {
                g.append("rect")
                  .attr("width", 90)
                  .attr("height", 18)
                  .attr("fill", "none")
                  .attr("stroke", (_, i) =>
                    i == 1 ? util.flagColor[1] : util.flagColor[2]
                  )
                  .attr("rx", 5);
                g.append("text")
                  .attr("font-size", 12)
                  .attr("fill", (_, i) =>
                    i == 1 ? util.flagColor[1] : util.flagColor[2]
                  )
                  .text((d) => d)
                  .attr("text-anchor", "middle")
                  .attr("x", 45)
                  .attr("y", 14);
              });
          });
        // 序列样本
        g.selectAll(".series-sample")
          .data((d) => d.detail)
          .join("g")
          .attr("class", "series-sample")
          .attr(
            "transform",
            (_, i) =>
              `translate(${_W / 2 + i * (_W + _padding.left)}, ${_W / 2})`
          )
          .call((g) => {
            // 最外层的边框
            // 添加的质量
            g.append("path")
              .attr("d", (d) => d.quanlity_arc_bg())
              .attr("fill", _lableColor[0])
              .attr("opacity", 0.3);
            g.append("path")
              .attr("d", (d) => d.quanlity_arc())
              .attr("fill", _lableColor[0]);
            //添加厚度
            g.append("path")
              .attr("d", (d) => d.thickness_arc_bg())
              .attr("fill", _lableColor[1])
              .attr("opacity", 0.3);
            g.append("path")
              .attr("d", (d) => d.thickness_arc())
              .attr("fill", _lableColor[1]);
            // 添加宽度
            g.append("path")
              .attr("d", (d) => d.width_arc_bg())
              .attr("fill", _lableColor[2])
              .attr("opacity", 0.3);
            g.append("path")
              .attr("d", (d) => d.width_arc())
              .attr("fill", _lableColor[2]);
            // 添加是否过冷却
            g.append("circle")
              .attr("r", 3)
              .attr("fill", _lableColor[3])
              .attr("display", (d) => (d.cooling == 0 ? "block" : "none"));
          });
      })
  }
  #initTooltip() {
    const {_W, _padding,_lableColor, _container } = this
    const seriesSample = this._container.selectAll(".series-sample");
    const sameSeries = this._container.selectAll(".same-series").attr("cursor", "pointer")
    const that = this;
    let sameSeriesSvg = null;
    sameSeries.on("click", function(event, d) {
      if(d.sameSeries == 0) return;
      that._sameSeries = !that._sameSeries;
      if (that._sameSeries) {
        _container.select('.contentG').transition(d3.transition().duration(500)).attr('opacity', 0.3)
        // console.log(d3.select(this).parents());
        d3.select(event.target.parentNode.parentNode).attr('opacity', 1)
        sameSeriesSvg = new sameSeriesObj(event, d,_W, _lableColor, _padding).render();
        // console.log(d);
      } else {
        _container.select('.contentG').transition(d3.transition().duration(500)).attr('opacity', 1)
        sameSeriesSvg && sameSeriesSvg.attr('display', 'none')
      }
    });

    seriesSample.on("mouseenter", (event, d) => {
      let content = [
        `钢种：${d.platetype}`,
        `钢板数量：${d.flag.len}`,
        `钢板质量质量：${(d.flag.quanlity * 100).toFixed(0)}%`,
        `厚度范围：${(d.tgtthickness[0] * 1000).toFixed(2)}mm - ${(
          d.tgtthickness[1] * 1000
        ).toFixed(2)}mm`,
        `宽度范围：${d.tgtwidth[0].toFixed(1)}m - ${d.tgtwidth[1].toFixed(2)}m`,
        `是否过冷却:${d.cooling == 0 ? "是" : "否"}`,
      ];
      tooltipIns &&
        tooltipIns.showTooltip({
          direction: "up",
          x: event.pageX,
          y: event.pageY,
          content: content,
          stroke: util.flagColor[2],
        });
    });
    seriesSample.on("mouseleave", (event, d) => {
      tooltipIns && tooltipIns.removeTooltip();
    });
  }
}
// 这里是展开相同序列的图
class sameSeriesObj {
  constructor(event, data, W, lableColor, padding){
    this._x = event.x;
    this._y = event.y;
    this._W = W;
    this._rawData = data;
    this._H = W + padding.top;
    this._lableColor = lableColor;
    this._padding = padding
    this._container = null;
    this._width = 300;
    this._heigh = null;
    this._handleData = null;
  }
  render() {
    this.#initContainer();
    this.#initData();
    this.#initContent();
    return this._container
  }
  #initContainer() {
    const ele = document.body;
    d3.select(".my-series-svg") && d3.select(".my-series-svg").remove();
    
    // let width = 240,
    let height = this._H * this._rawData.sameSeries;
    const svg = d3
      .select(ele)
      .append("svg")
      .attr("class", "my-series-svg")
      .attr("width", this._width)
      .attr("height", height)
      .attr("id", "tooltipId")
      // .attr("pointer-events", "none") // 事件穿透
      .style("position", "absolute")
      .style('z-index', 99)
    svg
      .append("rect")
      .attr("class", "border")
      .attr("width", this._width)
      .attr("height", height)
      .attr("stroke-width", 1)
      .attr("stroke", util.flagColor[1])
      .attr('stroke-width', 3)
      .attr("fill", "white");
    svg.style("top", `${this._y + 57}px`).style("left", `${this._x - 15}px`);
    this._container = svg
  }
  #initData() {
    const {_rawData} = this;
    // console.log(_rawData.detail);
    let handleData = [];
    const R = this._W / 2;
    const _ringW = 8;
    const PI = Math.PI;
    let quanlity_scale = d3.scaleLinear([0, 1], [0, PI * 2]);
    for(let i = 0; i < _rawData.sameSeries; i++) {
      let middleData = util.deepClone(_rawData.detail);
      // 这里是处理middledata的地方
      // debugger
      for (let detail_i = 0; detail_i < 3; detail_i++) {
        if(_rawData.quanlity_index == 0 || _rawData.quanlity_index == 1) {
          middleData[detail_i].quanlity_arc = d3
          .arc()
          .innerRadius(R - _ringW)
          .outerRadius(R)
          .startAngle(0)
          .endAngle(quanlity_scale(Math.random() * 0.2 +0.8))
        } else {
          middleData[detail_i].quanlity_arc = d3
            .arc()
            .innerRadius(R - _ringW)
            .outerRadius(R)
            .startAngle(0)
            .endAngle(quanlity_scale(Math.random() * 0.6))
        }
      }
      handleData.push(middleData)
    }
    this._handleData = handleData;
  }
  #initContent() {
    const {_handleData, _H, _W, _padding, _lableColor} = this;
    this._container.selectAll('g')
      .data(_handleData)
      .join("g")
      .attr("class", "seriesG")
      // 这里控制三个圆的移动位置
      .attr("transform", (d, i) => `translate(27, ${(_H) * i + 5})`)
      .call(g => {
        // g.append('rect').attr('width', 20).attr('height', 20).attr('fill', d => {
        //   console.log(d);
        // })
        g.selectAll(".series-sample")
          .data((d) => d)
          .join("g")
          .attr("class", "series-sample")
          .attr("transform", (_, i) => `translate(${_W / 2 + i * (_W + _padding.left) + 3}, ${_W / 2})`)
          .call(g => {
              // 最外层的边框
              // 添加的质量
              g.append("path")
                .attr("d", (d) => d.quanlity_arc_bg())
                .attr("fill", _lableColor[0])
                .attr("opacity", 0.3);
              g.append("path")
                .attr("d", (d) => d.quanlity_arc())
                .attr("fill", _lableColor[0]);
              //添加厚度
              g.append("path")
                .attr("d", (d) => d.thickness_arc_bg())
                .attr("fill", _lableColor[1])
                .attr("opacity", 0.3);
              g.append("path")
                .attr("d", (d) => d.thickness_arc())
                .attr("fill", _lableColor[1]);
              // 添加宽度
              g.append("path")
                .attr("d", (d) => d.width_arc_bg())
                .attr("fill", _lableColor[2])
                .attr("opacity", 0.3);
              g.append("path")
                .attr("d", (d) => d.width_arc())
                .attr("fill", _lableColor[2]);
              // 添加是否过冷却
              g.append("circle")
                .attr("r", 3)
                .attr("fill", _lableColor[3])
                .attr("display", (d) => (d.cooling == 0 ? "block" : "none"));
          });
      })
  }
}
// this._container.attr('height', this._container.node().getBBox().height + 20)
