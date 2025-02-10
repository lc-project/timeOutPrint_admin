export const defaultRoute = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/login.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    meta: {
      title: "404",
    },
    component: () => import("../views/error/404.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "403",
    component: () => import("../views/error/403.vue"),
    meta: {
      title: "403",
    },
  },
];

export const otherRoute = [];

export const authRoute = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/home/index.vue"),
    meta: {
      title: "物料信息",
      icon: "i-analysis",
    },
  },
  {
    path: "/record",
    name: "record",
    component: () => import("@/pages/record/index.vue"),
    meta: {
      title: "打印记录",
      icon: "i-history",
    },
  },
];
