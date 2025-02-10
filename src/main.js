import { createApp } from "vue";
import App from "./App.vue";

import Router from "./router/index.js";
import pinia from "@/store/index.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";

//引入全局方法
import "./utils/global.js";

import "./style.scss";
import "./assets/style/normalize.css";

import "@icon-park/vue-next/styles/index.css";
import { install } from "@icon-park/vue-next/es/all";

// 完整导入 UI 组件库
import VxeUI from "vxe-pc-ui";
import "vxe-pc-ui/lib/style.css";
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";

// 完整导入exceljs和vxe导出excel插件
import VxeUIPluginExportXLSX from "@vxe-ui/plugin-export-xlsx";
import ExcelJS from "exceljs";
VxeUI.use(VxeUIPluginExportXLSX, {
  ExcelJS,
});
const app = createApp(App);
install(app, "i");
app.use(Router);
app.use(pinia);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(VxeUI).use(VxeUITable);

app.mount("#app");
