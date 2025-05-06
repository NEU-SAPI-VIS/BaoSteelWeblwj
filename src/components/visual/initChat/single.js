import * as d3 from "d3";
import { initMylTooltip, tooltipIns } from "@/utils/tooltip";
import util from "@/utils/util";
import en_ch from '@/utils/index.json'
export class singleChart {
  constructor({vn, width, height, data,ele }) {
    // 初始化数据
    this._width = width;
    this._height = height;
    this._rawData = data;
    this._container = ele;
    this._margin = { top: 5, bottom: 5, left: 5, right: 5 };
    let colorValue = [
      d3.min(this._rawData.outOfGau, (d) => d.value),
      0,
      d3.max(this._rawData.outOfGau, (d) => d.value),
    ];
    // 下限， 中间， 上限
    this._colorScale = d3.scaleLinear(colorValue, [util.flagColor[0], "white", util.flagColor[1]]);
    // this._colorScale = d3.scaleLinear(colorValue, [util.flagColor[0], "white", util.flagColor]);
    this._rollName = [ "pass","crownbody", "crownhead", "crowntail", "crowntotal", "devcrownbody", "devcrownhead","devcrowntail",
    "devcrowntotal", "devfinishtempbody", "devfinishtemphead", "devfinishtemptail","devfinishtemptotal", "wedgebody", "wedgehead",
    "wedgetotal", "devwedgebody", "devwedgehead", "devwedgetail", "devwedgetotal", "finishtempbody","finishtemphead", "finishtemptail","finishtemptotal"]
    // 分隔线
    // this._spliteG = this._container.append("g");

    // heatMap的数据

    this._buttonData = ["单维", "T2", "SPE"];
    this._spliteG = this._container
      .append("g")
      .attr("class", "singleG")
      .attr("transform", `translate(${this._width / 7}, ${this._margin.top})`);
    this._upperG = null;
    this._lowerG = null;

    this._vn = vn;
  }
  render() {
    // 产生line
    // this.#initLine();
    this.#initButton();
    this.#initHeatMap();
    this.#initShowTotal();
    this.#initTooltip();
  }
  #initLine() {
    const { _width, _height, _spliteG } = this;
    _spliteG
      .append("line")
      .attr("x1", 0)
      .attr("y1", _height / 2)
      .attr("x2", (_width / 7) * 6)
      .attr("y2", _height / 2)
      .attr("stroke", util.flagColor[2])
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5");
  }
  #initButton() {
    const { _width, _height, _margin, _rawData } = this;
    const buttonData = _rawData.CONTQ.length > 100 ? ["heat", "roll", "cool"] : ["heat", "roll", ];
    // const buttonColor = ["#fdc5a9", "#b4b4b4", "#28b2f7"];
    const buttonColor = [util.flagColor[1], util.flagColor[2], util.flagColor[0]];
    const buttonG = this._container
      .append("g")
      .attr("class", "buttonG")
      .attr("transform", `translate(${_margin.left}, ${_margin.top})`);
    buttonG
      .append("g")
      .attr("class", "singleButton")
      .call((g) => {
        g.append("rect")
          .attr("width", 40)
          .attr("height", 20)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("stroke", "#94a7b7")
          .attr("fill", "#94a7b7");
        g.append("text")
          .attr("fill", "#fff")
          .attr("font-size", 12)
          .text("单维")
          .attr("x", 8)
          .attr("y", 15);
      });
    buttonG
      .selectAll(".process")
      .data(buttonData)
      .join("g")
      .attr("class", "process")
      .attr("transform", (_, i) => `translate(0, ${50 + i * 50})`)
      .call((g) => {
        g.append("rect")
          .attr("width", 40)
          .attr("height", 20)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("stroke", (d, i) => buttonColor[i])
          .attr("fill", "none");
        g.append("text")
          .attr("fill", (d, i) => buttonColor[i])
          .attr("font-size", 12)
          .text((d) => d)
          .attr("x", 8)
          .attr("y", 15);
      })
      // 这里是点击的按钮
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        // console.log(d);
        // console.log(this._vn.changeProcessOption);
        this._vn && this._vn.changeProcessOption({
          'upid':this._rawData.upid,
          "process":d,
          'furUpid': this._vn.furProcessUpid
        })
      });
  }
  #initHeatMap() {
    const { _width, _height, _margin, _rawData, _colorScale } = this;

    const upperG = this._container
      .append("g")
      .attr("transform", `translate(${this._width / 7}, ${0})`)
      .attr("class", "upperG")
      .attr("fill", util.flagColor[1])
      .attr("font-size", "12px")
      .attr("font-style", "italic");

    const lowerG = this._container
      .append("g")
      .attr("transform", `translate(${this._width / 7}, ${this._height / 2})`)
      .attr("class", "lowerG")
      .attr("fill", util.flagColor[0])
      .attr("font-size", "12px")
      .attr("font-style", "italic");
    this._upperG = upperG;
    this._lowerG = lowerG;
    // 创建文字标题上限和下限
    lowerG.append("text").text("下限").attr("x", 2).attr("y", 18);
    upperG.append("text").text("上限").attr("x", 2).attr("y", 12);
    // 创建矩形
    const maxWidth = (_width / 7) * 6,
      maxHeight = _height / 2 - 20,
      xRectNum = Math.ceil(this._rawData.outOfGau.length / 5);
    // console.log(maxWidth, maxHeight);
    const width = Math.min(maxWidth / xRectNum, maxHeight / 5);
    // 上限的热力图
    upperG
      .append("g")
      .attr("class", "rectG")
      .attr("transform", `translate(${0},${20})`)
      .selectAll("g")
      .data(new Array(5))
      .join("g")
      .call((g) =>
        g
          .attr("transform", (d, i) => `translate(0, ${width * i})`)
          .selectAll("rect")
          .data((_, i) =>
            _rawData.outOfGau.slice(i * xRectNum, (i + 1) * xRectNum)
          )
          .join("rect")
          .attr("class", "upperRect")
          .attr("width", width)
          .attr("height", width)
          .attr("x", (_, i) => i * width)
          // .attr("stroke", (d, i) => {
          //   if(this._rollName.includes(d.name)) return d3.color(util.flagColor[0])
          //   else return "#FFFAF0"})
          .attr("fill", (d, i) => {
            if (d.value <= 0) return "white";
            else return _colorScale(d.value);
          })
      );
    //下限的热力图
    lowerG
      .append("g")
      .attr("class", "rectG")
      .attr("transform", `translate(${0},${20})`)
      .selectAll("g")
      .data(new Array(5))
      .join("g")
      .call((g) =>
        g
          .attr("transform", (d, i) => `translate(0, ${width * i})`)
          .selectAll("rect")
          .data((_, i) =>
            _rawData.outOfGau.slice(i * xRectNum, (i + 1) * xRectNum)
          )
          .join("rect")
          .attr("class", "lowerRect")
          .attr("width", width)
          .attr("height", width)
          .attr("x", (_, i) => i * width)
          // .attr("stroke", (d, i) => {
          //   if(this._rollName.includes(d.name)) return d3.color(util.flagColor[0])
          //   else return "#FFFAF0"})
          .attr("fill", (d, i) => {
            if (d.value >= 0) return "white";
            else return _colorScale(d.value);
          })
      );
  }
  #initShowTotal() {
    const { _upperG, _lowerG, _rawData } = this;
    _upperG
      .append("g")
      .attr("class", "upperTotal")
      .attr("transform", `translate(80, 0)`)
      .call((g) => {
        // 添加total
        g.append("text")
          .text(`Total:${this._rawData.upperTotal}`)
          .attr("y", 12)
          .attr("font-weight", 800);
        // 添加cicle
        g.selectAll("g")
          .data(_rawData.upperFive)
          .join("g")
          .attr("class", "upper-rank")
          .attr("transform", (d, i) => `translate(${60 + i * 20}, 0)`)
          // .attr("cursor", "pointer")
          .call((g) => {
            g.append("circle")
              .attr("cx", "8")
              .attr("cy", "8")
              .attr("r", "8")
              .attr("fill", "none")
              .attr("stroke", util.flagColor[1]);
            g.append("text")
              .text((d, i) => i + 1)
              .attr("text-anchor", "middle")
              .attr("x", 8)
              .attr("y", 12);
          });
      });
    _lowerG
      .append("g")
      .attr("class", "upperTotal")
      .attr("transform", `translate(80, 0)`)
      .call((g) => {
        // 添加total
        g.append("text")
          .text(`Total:${this._rawData.lowerTotal}`)
          .attr("x", 2)
          .attr("y", 18)
          .attr("font-weight", 800);
        // 添加cicle
        g.selectAll("g")
          .data(_rawData.lowerFive)
          .join("g")
          .attr("class", "lower-rank")
          .attr("transform", (d, i) => `translate(${60 + i * 20}, 2)`)
          // .attr("cursor", "pointer")
          .call(
            (g) => {
              g.append("circle")
                .attr("cx", "8")
                .attr("cy", "10")
                .attr("r", "8")
                .attr("fill", "none")
                .attr("stroke", util.flagColor[0]);
              g.append("text")
                .text((d, i) => i + 1)
                .attr("text-anchor", "middle")
                .attr("x", 8)
                .attr("y", 14);
            }
            // g.append('text')
            //   .attr()
          );
      });
  }
  #initTooltip() {
    const lowerRect = this._container.selectAll(".lowerRect"),
        upperRect = this._container.selectAll(".upperRect"),
        upperRand = this._container.selectAll('.upper-rank'),
        lowRank = this._container.selectAll('.lower-rank')
    // 下限矩形tooltip
    lowerRect.on("mouseover", (event, d) => {
      if (d.value < 0) {
       return tooltipIns && tooltipIns.showTooltip({
            direction: 'up',
            x: event.pageX,
            y: event.pageY,
            content: [en_ch[d.name], d.value.toString()],
            // stroke: '#1890fe',
            stroke: util.flagColor[0],
            // color:  '#1890fe'
          });
      }
    });
    lowerRect.on("mouseout", (event, d) => {
      tooltipIns && tooltipIns.removeTooltip();
    });
    // 上线矩形tooltip

    upperRect.on("mouseover", (event, d) => {
      if (d.value > 0) {
        // console.log(d);
       return tooltipIns && tooltipIns.showTooltip({
            direction: 'up',
            x: event.pageX,
            y: event.pageY,
            content: [en_ch[d.name] + ':', d.value.toString()],
            // stroke: '#e3ad92',
            stroke: util.flagColor[1],
            // color:  '#e3ad92'
          });
      }
    });
    upperRect.on("mouseout", (event, d) => {
      tooltipIns && tooltipIns.removeTooltip();
    });
    // upperRank
    upperRand.on("mouseover", (event, d) => {
      return tooltipIns && tooltipIns.showTooltip({
           direction: 'up',
           x: event.pageX,
           y: event.pageY,
           // content: [en_ch[d.name] + ':', d.value.toString()],
           content:[en_ch[d.name] + ':', `真实值为：${d.original_value}`,`上线真实值为：${d.original_u}`,`下限真实值为：${d.original_l}`],
           stroke: util.flagColor[1],
         });
   });
    upperRand.on("mouseout", (event, d) => {
      tooltipIns && tooltipIns.removeTooltip();
    });
    // LowerRank
    lowRank.on("mouseover", (event, d) => {
      return tooltipIns && tooltipIns.showTooltip({
           direction: 'up',
           x: event.pageX,
           y: event.pageY,
           // content: [en_ch[d.name] + ':', d.value.toString()],
           content:[en_ch[d.name] + ':', `上线真实值为：${d.original_u}`,`下限真实值为：${d.original_l}`,`真实值为：${d.original_value}`],
          //  stroke: '#1890fe',
            stroke: util.flagColor[0],
           // color:  '#e3ad92'
         });
   });
    lowRank.on("mouseout", (event, d) => {
      tooltipIns && tooltipIns.removeTooltip();
    });
  

  }
}
