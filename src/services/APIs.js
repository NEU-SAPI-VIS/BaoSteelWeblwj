const baseUrl = '/myf'
const baseUrlP = '/pidasApi'
// =====================furnace===========================
// export const GET_FURNACE_LIST = baseUrl + '/l2FuOutputTempSize/FuOutputTempSizeByTgtThicknessUpDown'
// // export const GET_FURNACE_DETAIL_CHART = baseUrl + '/L2Fufladc51/selectFufladc51SamplingBeforeBySlabid'
// export const GET_FURANCE_FORM = baseUrlP + '/v1.0/pidas/selectFuFladcDetailDataSheetByUpidApi'
// export const GET_FURNACE_DETAIL_CHART = baseUrlP + '/v1.0/pidas/selectFuFladcDataFromExportDataSheetByUpidApi'
// export const GET_FURNACE_TABLE_NUM = baseUrlP + '/v1.0/pidas/selectAllFuDataNumForTableListApi'
export const GET_FURNACE_TABLE_DATA = baseUrlP + '/v1.0/pidas/selectFuDataForTableApi'
export const GET_FURNACE_DETAIL_DATA = baseUrlP + '/v1.0/pidas/selectFuDataDetailApi'


//Roll
export const GET_MPASS_TABLE_DATA = baseUrlP + '/v1.0/pidas/selctMDataForTableApi'
export const GET_ROLL_CHART = baseUrlP + '/v1.0/pidas/selectMPgDataByUpidApi'
export const GET_ROLL_WIDTH = baseUrlP + '/v1.0/pidas/selectMPassThickWidthDataByUpidApi'
export const GET_ROLL_THICKNESSANDWIDTH = baseUrlP + '/v1.0/pidas/selectMPassPhaseNumberDataByUpidApi'
export const GET_ROLL_THICKNESS = baseUrlP + '/v1.0/pidas/selectMPassForceTorqueDataByUpidApi'

// COOLING
export const GET_COOLING_TABLE_DATA = baseUrlP + '/v1.0/pidas/selectCDataForTableListApi'
export const GET_COOLING_DETAILS = baseUrlP + '/v1.0/pidas/selectCCDataForUpid'
// Vis
export const GET_TIME_DATA = baseUrlP + '/v1.0/visApi/plateYieldStaistics'
export const GET_SPECIES_DATA = baseUrlP + '/v1.0/visApi/plateSpeciesStatics'
export const GET_SAME_SERIES = baseUrlP + '/v1.0/visApi/plateSeriesSamplStatics'
export const GET_DIA_DATA = baseUrlP + '/v1.0/visApi/plateDiagnosisApi'
export const GET_RECOMMEND_DATA = baseUrlP + '/v1.0/visApi/proSequenceApi'




