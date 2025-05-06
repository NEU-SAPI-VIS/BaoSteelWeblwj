import util from "utils/util";

let nowDate = new Date();
const alarmDetalis = [
  "crowntotal超过上限",
  "ave_temp_dis低于下限",
  "skid_temp_dis低于下限",
  "crowntotal超过下限",
  "skid_temp_dis低于下限",
  "ave_temp_dis低于下限",
  "skid_temp_dis低于下限",
  "tgtplatethickness2超过上限",
  "tgtplatelength2低于下限",
  "ave_temp_dis低于下限",
  "ave_temp_dis低于下限",
  "tgtplatelength2低于下限",
  "设备故障",
];
// 路由信息
export let routerData = [
  "加热子表",
  "冷却子表",
  "轧制子表",
  "可视化分析",
  "用户管理",
  "角色管理",
  "",
];
// 用户数据
export let userData = [
  {
    name: "liucheng613",
    phoneNum: 15239311321,
    ascription: "厚板中央研究院",
    description: "",
    roles: "superadmin",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "test",
    phoneNum: "",
    ascription: "ag",
    description: "",
    roles: "admin",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "BaoStell",
    phoneNum: "",
    ascription: "厚板中央研究院",
    description: "",
    roles: "admin",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "licheng",
    phoneNum: "",
    ascription: "厚板中央研究院",
    description: "",
    roles: "admin",
    createTime: util.timeFormat(
      new Date(nowDate.getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
];
// 角色数据
export let roleData = [
  {
    name: "superadmin",
    description: "超级管理员",
    auth: [
      "加热工艺",
      "轧制工艺",
      "冷却工艺",
      "可视化",
      "加热子表",
      "轧制子表",
      "冷却子表",
      "用户管理",
      "角色管理",
      "监控日志",
      "权限管理",
    ],
    ascription: "",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "admin",
    description: "管理员",
    auth: [
      "加热工艺",
      "轧制工艺",
      "冷却工艺",
      "可视化",
      "加热子表",
      "轧制子表",
      "冷却子表",
    ],
    ascription: "",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
];
// 权限数据
export let authData = [
  {
    name: "加热工艺",
    type: "菜单",
    router: "/furnace",
    description: "“加热工艺”菜单的使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "轧制工艺",
    type: "菜单",
    router: "/rolling",
    description: "“轧制工艺”菜单的使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "冷却工艺",
    type: "菜单",
    router: "/cooling",
    description: "“冷却工序”菜单的使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "可视化分析",
    type: "菜单",
    router: "/visual",
    description: "“可视分析”菜单的使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "加热子表",
    type: "菜单",
    router: "/reportForm",
    description: "“加热子表”菜单的使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "冷却子表",
    type: "菜单",
    router: "/coolForm",
    description: "“冷却子表”菜单的使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "用户管理",
    type: "菜单",
    router: "/user",
    description: "“用户管理”菜单的使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "角色管理",
    type: "菜单",
    router: "/role",
    description: "“角色管理”菜单的使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "轧制子表",
    type: "菜单",
    router: "/rollForm",
    description: "“轧制子表”菜单的使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "权限管理",
    type: "菜单",
    router: "/auth",
    description: "“权限管理”菜单使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "指标监控",
    type: "菜单",
    router: "/monitor",
    description: "指标监控使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
  {
    name: "加热工序",
    type: "菜单",
    router: "/furnace",
    description: "“监控日志”使用权",
    createTime: util.timeFormat(
      new Date(new Date().getTime() - parseInt(Math.random() * 100) * 86400000)
    ),
  },
];
// 报警信息
export let alarmData = (function () {
  const recordArr = [];
  for (let i = 0; i < 163; i++) {
    recordArr[i] = {
      type: "error",
      details: alarmDetalis[parseInt(Math.random() * 13)],
      alarmTime: "",
      handleTime: util.timeFormat(
        new Date(
          new Date().getTime() - parseInt(Math.random() * 100) * 86400000
        )
      ),
      handleType: "",
      handlePerson: "liucheng613",
      phoneNum: "",
    };
  }
  return recordArr;
})();
