import * as d3 from "d3";
// import tooltipIns from '@/utils/tooltip';
import util from "@/utils/util";
import { initMylTooltip, tooltipIns } from "@/utils/tooltip";

export class seriesBar {
  constructor({ width, heigh, data, thickRule }, container) {
    this._container = container;
    this._margin = { top: 5, left: 20, bottom: 5, right: 5 };
    this._g = this._container
      .append("g")
      .attr("class", "seriesGroup")
      .attr(
        "transform",
        `translate(${this._margin.left}, ${this._margin.top})`
      );
    this._width = width;
    this._heigh = heigh;
    this._title = data.platetype;
    (this._thickRule = thickRule), (this._rawData = data);
    // 比例尺
    this._xScale = null;
    this._yScale = null;

    this._data = [
      { name: "W", value: data.width, max: data.widthMax },
      { name: "L", value: data.length, max: data.lengthMax },
      { name: "T", value: data.thickness, max: data.thicknessMax },
      { name: "P", value: data.proRhythm, max: data.proRhythmMax },
    ];
    this._seriesData = null;
  }

  render() {
    // console.log(dir);
    // this._initData();
    this._initScale();
    this._initLine();
    this._renderRect();
    this._initCircle();
    this._renderTooltip();
  }
  _initScale() {
    const _yMax = this._heigh - this._margin.top - this._margin.bottom,
      _xMax = this._width - this._margin.left - this._margin.right;
    this._xScale = d3.scaleLinear().range([0, _xMax]).domain([0, 1]);
    this._yScale = d3
      .scaleBand()
      .domain(this._data.map((d) => d.name))
      .range([20, _xMax])
      .padding(0.2);
  }
  _initLine() {
    const yAxis = d3.axisLeft(this._yScale);
    this._g
      .append("g")
      // .attr('transform', `translate(${0}, 0)`)
      .call(yAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick").select("line").remove())
      .call((g) =>
        g
          .append("line")
          .attr("x1", -2)
          .attr("y1", 0)
          .attr("x2", -2)
          .attr("y2", this._heigh - this._margin.top - this._margin.bottom)
          .attr("stroke", util.flagColor[2])
          .attr("stroke-width", 2)
      )
      // 标题
      .call((g) =>
        g
          .selectAll("text")
          .style("font-weight", "700")
          .attr("fill", util.flagColor[2])
      );
    // 创建钢种
    this._container
      .append("g")
      .attr("class", "textG")
      .style("font-weight", "800")
      .style("font-size", "12")
      .style("fill", d3.color(util.flagColor[0]).darker(0.3))
      .attr("text-anchor", "middle")
      .append("text")
      .attr("class", "platetype")
      .attr("x", this._width / 2)
      .attr("y", this._margin.top + 18)
      .text(this._title);
    // 创建诊断价值
    // console.log(this._rawData);
    this._container
      .append("g")
      .attr("class", "dia-weight")
      .attr(
        "transform",
        `translate(${this._width / 2}, ${this._heigh - this._margin.bottom})`
      )
      .style("font-size", "12")
      .style("fill", d3.color(util.flagColor[0]).darker(0.3))
      .attr("text-anchor", "middle")
      .append("text")
      // .attr("class", "platetype")
      .attr("x", 0)
      .attr("y", 0)
      .text(this._rawData.dia_weight);
  }
  _renderRect() {
    const { _data, _yScale, _margin, _width, _xScale } = this;
    const h = _yScale.bandwidth();
    const W = _width - _margin.left - _margin.right;

    // .attr('stroke', '#1890fe')
    // .attr('stroke-width', 1)
    // 生成矩形
    this._g
      .append("g")
      .selectAll("rect")
      .data(_data)
      .join("rect")
      .attr("class", "outsideRect")
      .attr("y", (d) => _yScale(d.name))
      .attr("height", h)
      .attr("width", W)
      .attr("fill", "none")
      .attr("rx", 1)
      // .attr('ry', 5)
      .attr("stroke", util.flagColor[2])
      .attr("stroke-width", 1);
      // 在柱状图（i）中阴影填充面积表示当前规格钢种某指标的大小，而柱状高度则显示选取时间段内同钢种此指标的最大值。
    this._g
      .append("g")
      .selectAll("rect")
      .data(_data)
      .join("rect")
      .attr("class", "innerRect")
      .attr("y", (d) => _yScale(d.name))
      .attr("height", h)
      .attr("width", (d) => _xScale(d.value / d.max))
      .attr("fill", util.flagColor[0]);
  }
  _renderTooltip() {
    const innerRect = this._g.selectAll(".innerRect");
    const circleG = this._container.select(".circleG");
    innerRect.on("mouseover", (event, d) => {
      tooltipIns &&
        tooltipIns.showTooltip({
          // direction: dir.down,
          x: event.pageX,
          y: event.pageY,
          content: creatTooltipContent(d),
        });
    });
    innerRect.on("mouseout", (event, d) => {
      tooltipIns && tooltipIns.removeTooltip();
    });

    let mytooltipIns = null;
    circleG.on("mouseenter", async (event, d) => {
      let data = this.#initSeriesData(this._rawData.same_series);
      mytooltipIns = initMylTooltip(data, event.pageX, event.pageY);
    });
    circleG.on("mouseleave", () => {
      mytooltipIns && mytooltipIns.attr("display", "none");
    });

    function creatTooltipContent(d) {
      if (d.name == "W")
        return [
          `当前类别宽度为：${d.value.toFixed(2)}m`,
          `所刷选同规格宽度的最大值${d.max.toFixed(2)}m`,
        ];
      else if (d.name == "L")
        return [
          `当前类别长度为：${d.value.toFixed(2)}m`,
          `所刷选同规格长度的最大值：${d.max.toFixed(2)}m`,
        ];
      else if (d.name == "T")
        return [
          `当前类别厚度为：${(d.value * 1000).toFixed(2)}mm`,
          `所刷选同规格厚度的最大值：${(d.max * 1000).toFixed(2)}mm`,
        ];
      else if (d.name == "P")
        return [
          `当前类别生产一块板用时：${d.value}min`,
          `所刷选同规格的生产用时最慢为：${d.max}min`,
        ];
    }
  }
  _initCircle() {
    const { _rawData, _lableColor } = this;
    const width = 20,
      heigh = 20;
    const circleG = this._container
      .append("g")
      .attr("class", "circleG")
      .attr(
        "transform",
        `translate(${this._width - width / 2}, ${this._heigh - heigh / 2})`
      );
    const arCData = [
      { value: _rawData.good_num, flag: "good", paint_order: 0 },
      { value: _rawData.bad_num, flag: "bad", paint_order: 1 },
      { value: _rawData.no_flag, flag: "no_flag", paint_order: 2 },
    ];
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(heigh / 2)
      .padAngle(0.05);
    const pieData = d3
      .pie()
      .value((d) => d.value)
      .sort((a, b) => a.paint_order - b.paint_order);
    circleG
      .selectAll("path")
      .data(pieData(arCData))
      .join("path")
      .attr("d", (d) => arc(d))
      .attr("fill", (d, i) => {
        return util.flagColor[i];
      });
  }
  #initSeriesData(data) {
    let res = [];
    for (let i of data) {
      res.push([
        {
          value: i.good_num,
          flag: "good",
          paint_order: 0,
          current_series: i.current_series,
          percent: i.percent,
        },
        {
          value: i.bad_num,
          flag: "bad",
          current_series: i.current_series,
          percent: i.percent,
        },
        {
          value: i.no_flag,
          flag: "no_flag",
          current_series: i.current_series,
          percent: i.percent,
        },
      ]);
    }
    return res;
  }
}
