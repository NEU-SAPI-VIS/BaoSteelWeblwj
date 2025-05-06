let state = {
  processOption: null,
  furProcessUpid:null
};
let getters = {
  processOption: (state) => state.processOption,
  furProcessUpid:(state) => state.furProcessUpid
};
let mutations = {
  changeProcessOption(state, options) {
    state.processOption = options
  },
  changeFurProcessUpid(state, options) {
    state.furProcessUpid = options
  }
}
export default {
  state,
  getters,
  // actions,
  mutations
};
