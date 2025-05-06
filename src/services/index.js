import axios from "axios";
import { from } from "element-ui";

const service = axios.create({
  timeout: 500 * 1000,
});

service.interceptors.response.use(
  function (response) {
    let res = response.data;
    return res;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

export default {
  get(api, params) {
    if (params) {
      return service.get(api, { params });
    } else {
      return service.get(api);
    }
  },
  post(api, params) {
    if (params) {
      return service.post(api, params);
    } else {
      console.log("必须带参数!");
    }
  },
};
