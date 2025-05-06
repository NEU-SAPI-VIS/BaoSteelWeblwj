import TooltipClass from "@/components/Tooltip";
import util from '@/utils/util'
// import { randomString } from '@/utils';
import * as d3 from "d3";

let tooltipIns = null;
function initGlobalTooltip() {
  if (tooltipIns) return tooltipIns;

  const ele = document.body;
  const globalTooltipIns = new TooltipClass(
    { width: 0, height: 0 },
    ele,
    `globalTooltip`
  );
  return globalTooltipIns;
}
function initMylTooltip(data, x, y) {
  const ele = document.body;
  const HEIGHT = 60;
  let width = data.length * HEIGHT,
    height = HEIGHT,
    svg = d3
      .select(ele)
      .append("svg")
      .attr("class", "my-root-svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "tooltipId")
      .attr("pointer-events", "none") // 事件穿透
      .style("position", "absolute");
  // 添加svg
  svg
    .append("rect")
    .attr("class", "border")
    .attr("width", width)
    .attr("height", height)
    // .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", util.flagColor[2])
    .attr("fill", "white");
  // const animation = d3.transition().duration(50);
  svg.style("top", `${y + 20}px`).style("left", `${x - width / 2}px`).style("z-index", "99");
  class arcsPies {
    constructor({ width, height, data }, ele) {
      this._lableColor = {
        good: util.flagColor[0],
        bad: util.flagColor[1],
        no_flag: util.flagColor[2],
      };
      this._container = ele;
      this._margin = { top: 5, left: 5, bottom: 5, right: 5 };
      this._width = width;
      this._height = height;
      this._data = data;
    }
    render() {
      this._initArc();
      this._initCurrent();
    }
    _initArc() {
      const { _width, _height, _margin, _data, _lableColor } = this;
      let gWidth = _width / _data.length,
        gHeigth = _height;
      const middle = {
        centerX: (gWidth - _margin.left - _margin.right) / 2 + _margin.left,
        centerY: (gHeigth - _margin.top - _margin.bottom) / 2 + _margin.top,
      };
      const pieData = d3
        .pie()
        .value((d) => d.value)
        .sort((a, b) => a.paint_order - b.paint_order);
      const arc = d3
        .arc()
        .innerRadius((middle.centerX - _margin.left) / 2 + 3)
        .outerRadius(middle.centerX - _margin.left - 1)
        .padAngle(0.05);
      this._container
        .selectAll("g")
        .data(_data)
        .join("g")
        .attr("transform", (d, i) => {
          return `translate(${i * gWidth + middle.centerX}, ${middle.centerY})`;
        })
        .call((g) => {
          // console.log(g)
          g.selectAll("path")
            .data((d, i) => {
              return pieData(d)
            })
            .join("path")
            .attr("d", (d) => arc(d))
            .attr("fill", (d, i) => _lableColor[d.data.flag]);
        })
        .call((g) => {
          g.append("text")
            .attr("class", "platetype")
            .attr("text-anchor", "middle")
            .text((d, i) => `${(d[0].percent * 100).toFixed(0)}%`)
            .attr("font-size", 10)
            .attr("line-height", 10)
            .attr("font-weight", 900)
            .attr("y", 3)
            .attr("fill", (d) =>d[0].percent > 0.5 ? this._lableColor.good : this._lableColor.bad);
        });
    }
    _initCurrent() {
      const { _container, _data, _height, _margin } = this;
      let cur_index = null,
        gHeigth = _height - _margin.top - _margin.bottom;
      for (let i = 0; i < _data.length; i++) {
        if (_data[i][0].current_series) {
          cur_index = i;
          break;
        } else continue;
      }
      this._container
        .append("rect")
        .attr("class", "cur_rect")
        .attr("height", gHeigth)
        .attr("width", gHeigth)
        .attr("stroke", '#ED2F6A')
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("x", cur_index * _height + _margin.left)
        .attr("y", _margin.top);
    }
  }
  arcsPies = new arcsPies(
    { width: HEIGHT * data.length, height: HEIGHT, data: data },
    svg
  );
  arcsPies.render();
  return svg;
}
tooltipIns = initGlobalTooltip();
// export default tooltipIns;
export { initMylTooltip, tooltipIns };
