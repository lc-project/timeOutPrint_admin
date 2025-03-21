import { defineStore } from "pinia";
export default defineStore("validityPeriod", {
  state() {
    return {
      id: null,
      tableData: [], //数据
      pictureForm: [], //图片数据
      startTime: "",
      finishTime,
      //分页
      pageValue: {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
      },
    };
  },
  actions: {
    async getDataApi() {
      this.pageValue.loading = true;
      const { data } = await $axios.get("/validityPeriod/getValidityPeriod", {
        params: {
          limit: this.pageValue.limit,
          page: this.pageValue.page,
        },
      });
      if (data.total || data.total == 0) {
        this.pageValue.total = data.total;
      }
      this.tableData = data.data;
      this.pageValue.loading = false;
    },
    async getValidityPeriod() {
      const { data } = await $axios.get("/validityPeriod/getPicture", {
        params: {
          id: this.id,
          startTime: this.startTime,
          finishTime: this.finishTime,
        },
      });
      this.pictureForm = data;
    },
  },
  persist: false,
});
