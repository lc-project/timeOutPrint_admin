import { defineStore } from "pinia";
export default defineStore("home", {
  state() {
    return {
      tableData: [], //数据
      form: {}, //回显信息
      materialsFrom:{},//编辑回显数据啊
      //分页
    };
  },
  actions: {
    async getPrintData() {
      const { data } = await $axios.get("/printData/getPrintData");
      this.tableData = data;
    },
  },
  persist: false,
});
