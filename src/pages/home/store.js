import { defineStore } from "pinia";
export default defineStore("home", {
  state() {
    return {
      id: null,
      brandData: [],
      tableData: [], //数据
      form: {}, //回显信息
      materialsClass: {}, //大类名称
      materialsFrom: {}, //编辑回显数据啊
      classData: [], //编辑分类
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
      const { data } = await $axios.get("/printData/getPrintData", {
        params: {
          limit: this.pageValue.limit,
          page: this.pageValue.page,
          identity: this.identity,
        },
      });
      if (data.total || data.total == 0) {
        this.pageValue.total = data.total;
      }
      this.brandData = data.data;
      this.pageValue.loading = false;
    },
    async getPrintData() {
      const { data } = await $axios.get("/printData/getMaterials", {
        params: {
          id: this.id,
        },
      });
      this.tableData = data;
    },
  },
  persist: false,
});
