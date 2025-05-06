import service from "./index.js";
import * as APIs from "./APIs.js";
import { setParams } from "@/utils/index.js";

// =====================furnace===========================
export function getFuranceTableData(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_FURNACE_TABLE_DATA + paramsPath);
}
export function getFuranceDetailData(params, postBody) {
  let paramsPath = setParams(params);
  return service.post(APIs.GET_FURNACE_DETAIL_DATA + paramsPath, postBody);
}

// =====================roll===========================
export function getMPassTableData(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_MPASS_TABLE_DATA + paramsPath);
}
export function getRollChart(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_ROLL_CHART + paramsPath);
}
export function getRollThicknessAndWidth(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_ROLL_THICKNESSANDWIDTH + paramsPath);
}
export function getRollWidth(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_ROLL_WIDTH + paramsPath);
}
export function getRollthickness(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_ROLL_THICKNESS + paramsPath);
}
// =====================cool===========================

export function getCoolingTableData(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_COOLING_TABLE_DATA + paramsPath);
}
export function getCoolingDetails(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_COOLING_DETAILS + paramsPath);
}

// =====================vis===========================
export function getTimeData(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_TIME_DATA + paramsPath);
}
export function getPlateSpeciesStatics(params) {
  let paramsPath = setParams(params);
  return service.get(APIs.GET_SPECIES_DATA + paramsPath);
}
// export function getSameSeries(params, postBody) {
//   let paramsPath = setParams(params)
//   return service.post(APIs.GET_SAME_SERIES + paramsPath, postBody)
// }
export function getDiaData(params, postBody) {
  let paramsPath = setParams(params)
  return service.post(APIs.GET_DIA_DATA + paramsPath, postBody)
}
export function getRecommendData(params, postBody) {
  let paramsPath = setParams(params)
  return service.post(APIs.GET_RECOMMEND_DATA + paramsPath, postBody)
}