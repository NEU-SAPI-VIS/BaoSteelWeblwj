import * as APIs from "./APIs.js";
import service from "./index.js";

export default function getUserList(params) {
  return service.get(APIs.GET_USER_LIST, params);
}

export function detailUser(params) {
  return service.get(APIs.DETAIL_USER, params);
}

export function login(params) {
  // console.log(service.post(APIs.GET_USER_LOGIN, params))
  console.log("i am at login");
  console.log(params);
  return service.post(APIs.GET_USER_LOGIN, params);
}

export function addUser(params) {
  return service.post(APIs.ADD_USER, params);
}

export function updateUser(params) {
  return service.post(APIs.UPDATE_USER, params);
}

export function deleteUser(params) {
  return service.post(APIs.DELETE_USER, params);
}
