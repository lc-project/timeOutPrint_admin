import { defineStore } from "pinia";
export default defineStore("account", {
  state() {
    return {
      tableData: [], //数据
      accountForm: {}, //回显信息
      identity:"",//身份
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
      const { data } = await $axios.get("/account/getAccount", {
        params: {
          limit: this.pageValue.limit,
          page: this.pageValue.page,
          identity:this.identity,
        },
      });
      if (data.total || data.total == 0) {
        this.pageValue.total = data.total;
      }
      this.tableData = data.data;
      this.pageValue.loading = false;
    },
  },
  persist: false,
});
