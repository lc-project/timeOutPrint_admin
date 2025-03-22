import { defineStore } from "pinia";
export default defineStore("printAppVersion", {
  state() {
    return {
      tableData: [], //数据
    };
  },
  actions: {
    async getDataApi() {
      const { data } = await $axios.get("/printApp/getVersionList");
      this.tableData = data;
    },
  },
  persist: false,
});
