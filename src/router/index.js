import { createRouter, createWebHistory } from "vue-router";
import { defaultRoute } from "./routes.js";
import useStore from "@/store/modules/userStore.js";
import { ElLoading } from "element-plus";
import NProgress from "@/utils/other/nprogress.js";

const Router = createRouter({
  history: createWebHistory(),
  routes: [...defaultRoute],
  base: "/",
});

function routerBeforeEach(Router) {
  return async function guard(to, from, next) {
    NProgress.start();
    if (to.path === "/login") return next();
    if (!useStore().token) {
      NProgress.done();
      next("/login");
      return;
    }
    const userStore = useStore();
    if (!userStore.hasRoutes) {
      //全屏加载
      const loading = ElLoading.service({ fullscreen: true });
      const ownRoutes = await userStore.getRouteData();
      const layout = {
        path: "/",
        name: "layout",
        redirect: ownRoutes[0].children && ownRoutes[0].children.length > 0 ? getRedirectPath(ownRoutes[0].children) : ownRoutes[0].path,
        component: () => import("@/views/layout/layout.vue"),
        meta: {
          title: "首页",
          icon: "",
          index: 1,
        },
        children: ownRoutes,
      };
      Router.addRoute(layout);
      userStore.hasRoutes = true;
      loading.close();
      next(to.fullPath);
    } else {
      next();
    }
    NProgress.done();
  };
}

Router.beforeEach(routerBeforeEach(Router));

export default Router;
