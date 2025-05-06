import * as d3 from "d3";
export function setParams(obj) {
  let paramsPath = ''
  for (let item in obj) {
      paramsPath = paramsPath + '/' + encodeURIComponent(obj[item])
  }
  return paramsPath + '/'
}
/**
 * 绘制连接线
 * data: [
 *   { start: [x11, y11], end: [x12, y12], color: 'red', id: 'af421cd' },
 *   { start: [x21, y21], end: [x22, y22], color: 'blue', id: 'af421cd' },
 *   ......
 * ]
 * @param {*} g 
 * @param {*} data 
 * @param {*} param2 
 */
export function linkLine(g, data) {
  const linkPath = d => {
    // return d3.linkHorizontal()({
    return d3.linkVertical()({
      source: d.start,
      target: d.end
    })
  };

  // g.selectAll('*').remove();
  g.selectAll('link-line')
    .data(data)
    .join('path')
    .attr('fill', 'none')
    .attr('d', linkPath)
    .attr('class', d => `link-line ${d.class ?? ''}`)
    .attr('id', d => d.id ?? randomString())
    .attr('stroke', d => d.color ?? 'red')
    .attr('stroke-width', d => d.width ?? 2)
  
  return function updateLinkLine(data) {
    const t = d3.transition().duration(300);
    g.selectAll('.link-line')
      .data(data)
      .join(
        enter => enter,
        update => update//.transition(t)
          .attr('d', linkPath)
          .attr('stroke', d => d.color ?? 'red')
      )
  }
}

export function randomString() {
  return Math.random().toString(32).slice(2);
}
export let heatProcess = [
"ave_temp_1", "ave_temp_2", "ave_temp_dis", "ave_temp_pre", "ave_temp_soak", "ave_temp_entry_1",
"ave_temp_entry_2", "ave_temp_entry_pre",
"ave_temp_entry_soak", "center_temp_dis", "center_temp_entry_1", "center_temp_entry_2",
"center_temp_entry_pre", "center_temp_entry_soak",
"temp_uniformity_dis", "temp_uniformity_entry_1", "temp_uniformity_entry_2",
"temp_uniformity_entry_pre", "temp_uniformity_entry_soak",
"skid_temp_dis", "skid_temp_entry_1", "skid_temp_entry_2", "skid_temp_entry_pre",
"skid_temp_entry_soak", "staying_time_1", "staying_time_2",
"staying_time_pre", "staying_time_soak", "sur_temp_dis", "sur_temp_entry_1", "sur_temp_entry_2",
"sur_temp_entry_pre", "sur_temp_entry_soak"]
export let measurTemp = ["meas_temp_0", "meas_temp_1", "meas_temp_10", "meas_temp_11", "meas_temp_12", "meas_temp_13",
"meas_temp_14", "meas_temp_15", "meas_temp_16",
"meas_temp_17", "meas_temp_18", "meas_temp_19", "meas_temp_2", "meas_temp_3", "meas_temp_4",
"meas_temp_5", "meas_temp_6", "meas_temp_7",
"meas_temp_8", "meas_temp_9", "t_0", "t_1", "t_2", "t_3", "t_4", "t_5", "t_6"]
export let plateSelf = ["charging_temp_act", "tgtplatelength2", "tgtplatethickness2", "tgtwidth", "slab_length",
"slab_thickness", "slab_weight_act", "slab_width"]
export let rollProcess = ["pass","botbrplatecountrm", "botwrplatecountfm", "botwrplatecountrm",
"crownbody", "crownhead", "crowntail", "crowntotal", "devcrownbody", "devcrownhead",
"devcrowntail",
"devcrowntotal", "devfinishtempbody", "devfinishtemphead", "devfinishtemptail",
"devfinishtemptotal", "wedgebody", "wedgehead",
"wedgetotal", "devwedgebody", "devwedgehead", "devwedgetail", "devwedgetotal", "finishtempbody",
"finishtemphead", "finishtemptail",
"finishtemptotal"]
export let coolingProcess = [	'avg_fct', 'avg_p1', 'avg_p2', "avg_p5", "avg_sct", "max_fct", "max_p1", "max_p2", "max_p5", "max_sct",
"min_fct", "min_p1", "min_p2", "min_p5", "min_sct", "std_fct", "std_p1", "std_p2", "std_p5",
"std_sct"]