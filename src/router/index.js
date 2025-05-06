import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
import routerView from "./routerView.vue";

const routerMap = [
  {
    path: "/visual",
    component: () => import("views/visual.vue"),
    name: "可视化",
    title: "交互式可视化",
    icon: "fa fa-pie-chart",
    // component: routerView,
    // redirect: '/visual',
  },
  {
    path: "/heat",
    component: () => import("views/furnace.vue"),
    name: "加热工序",
    title: "加热工序",
    icon: "fa fa-thermometer-full",
  },
  {
    path: "/roll",
    component: () => import("views/roll.vue"),
    name: "轧制工序",
    title: "轧制工序",
    icon: "fa fa-gavel",
  },
  {
    path: "/cool",
    component: () => import("views/cooling.vue"),
    name: "冷却工序",
    title: "冷却工序",
    icon: "fa fa-asterisk",
  },
  {
    path: "/record",
    component: () => import("views/record.vue"),
    name: "监控日志",
    title: "监控日志",
    icon: "fa fa-television",
  },
  {
    path: "/user",
    name: "用户管理",
    title: "用户管理",
    component: () => import("views/user.vue"),
    icon: "fa fa-user-circle-o",
  },
  {
    path: "/auth",
    name: "权限管理",
    title: "权限管理",
    component: () => import("views/auth.vue"),
    icon: "fa fa-linode fa-lg",
  },
  {
    path: "/role",
    title: "角色管理",
    name: "角色管理",
    component: () => import("views/role.vue"),
    icon: "fa fa-group fa-lg",
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: () => import("views/login.vue") },
    {
      path: "/home",
      component: () => import("@/components/layout/Layout.vue"),
      children:routerMap
      // component: () => import("views/login.vue"),
    },
  ],
});

export { routerMap, router }

