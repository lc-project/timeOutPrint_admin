import { defineStore } from "pinia";
import * as routes from "@/router/routes.js";
import _ from "lodash";

function findParentPathByValue(obj, targetValue, currentPath = "") {
  for (const key in obj) {
    const value = obj[key];
    const path = currentPath ? `${currentPath}.${key}` : key;
    if (_.isObject(value)) {
      const result = findParentPathByValue(value, targetValue, path);
      if (result) {
        return result;
      }
    } else if (value === targetValue) {
      return currentPath;
    }
  }
  return null;
}

async function componentList(menu) {
  const data = [];
  for (const item of menu) {
    if (item.children && item.children.length > 0) {
      await componentList(item.children);
    } else {
      if (!_.has(item, "component")) {
        const path = findParentPathByValue(routes, item.path);
        const routeInfo = _.get(routes, path);
        if (routeInfo) {
          item.component = routeInfo.component;
        }
      }
    }
    data.push(item);
  }
  return data;
}

function menuSort(arr) {
  let index = 0;
  arr = arr.sort((a, b) => {
    if (index === 0 && b.children && b.children.length > 0) {
      menuSort(b.children);
      index++;
    }
    if (a.children && a.children.length > 0) {
      menuSort(a.children);
    }
    return a.meta.index - b.meta.index;
  });
  return arr;
}

export default defineStore("user", {
  state() {
    return {
      token: "",
      userInfo: {},
      menuList: [],
      tagList: [],
      routeData: null,
      hasRoutes: false,
    };
  },
  actions: {
    //获取路由表
    async getRouteData() {
      if (import.meta.env.VITE_ALL_ROUTER == "true") {
        ElMessage({
          message: "全开路由",
          type: "warning",
        });
        this.routeData = [...routes.authRoute, ...routes.otherRoute];
      } else {
        if (!this.routeData) {
          const { data } = await $axios.get("/user/getRouteData");
          this.routeData = data;
        }
      }
      const routerList = await componentList(this.routeData);
      return menuSort(routerList);
    },
  },
  persist: true,
});
