let state = {
  userInfo: {
    name: "liucheng613",
    pwd: "woshimima",
  },
};
let getters = {
  userInfo: (state) => state.userInfo,
};
let actions = {};

let mutations = {
  logOut(state) {
    state.userInfo.name = "";
    state.userInfo.pwd = "";
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
