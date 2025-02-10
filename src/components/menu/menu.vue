<template>
  <el-scrollbar class="menu-scroll">
    <el-menu
      active-text-color="#98ff98"
      background-color="#3883fa"
      class="menu"
      :default-active="menuItemActive"
      text-color="#fff"
      :unique-opened="false">
      <MenuItem :menuList="menuList"></MenuItem>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import MenuItem from "./menuItem.vue";
import Router from "@/router/index.js";

const { menuList } = defineProps({
  menuList: {
    type: Array,
    default: [],
  },
});
const menuItemActive = ref("");

watch(
  () => Router.currentRoute.value.path,
  (n, o) => {
    menuItemActive.value = n;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.menu-scroll,
.menu {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
