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
    path: "/statistics",
    name: "statistics",
    component: () => import("@/pages/statistics/index.vue"),
    meta: {
      title: "统计",
      icon: "i-excel",
    },
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/home/index.vue"),
    meta: {
      title: "物料信息",
      icon: "i-message",
    },
  },
  {
    path: "/brandManage",
    name: "brandManage",
    component: () => import("@/pages/brandManage/index.vue"),
    meta: {
      title: "品牌管理",
      icon: "i-juice",
    },
  },
  {
    path: "/shop",
    name: "shop",
    component: () => import("@/pages/shop/index.vue"),
    meta: {
      title: "店铺管理",
      icon: "i-shop",
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
  {
    path: "/account",
    name: "account",
    meta: {
      title: "账号管理",
      icon: "i-avatar",
    },
    children: [
      {
        path: "/admin",
        name: "admin",
        component: () => import("@/pages/account/admin/index.vue"),
        meta: {
          title: "超级管理员",
          index: 1,
        },
      },
      {
        path: "/brand",
        name: "brand",
        component: () => import("@/pages/account/brand/index.vue"),
        meta: {
          title: "品牌管理员",
          index: 2,
        },
      },
    ],
  },
];
