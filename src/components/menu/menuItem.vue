<template>
  <template v-for="item in menuList">
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 0" :disabled="item.meta && item.meta.disabled">
      <template #title>
        <component style="margin-right: 10px" :size="18" :is="item.meta && item.meta.icon" />
        <span>{{ item.meta && item.meta.title }}</span>
      </template>
      <menuItem :menuList="item.children"></menuItem>
    </el-sub-menu>
    <el-menu-item :index="item.path" @click="handleGoToPage(item)" v-else :disabled="item.meta.disabled">
      <component style="margin-right: 10px" :size="18" :is="item.meta && item.meta.icon" />
      <span>{{ item.meta && item.meta.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup>
import { useRouter } from "vue-router";
const Router = useRouter();
const { menuList } = defineProps({
  menuList: Array,
  default: [],
});
const handleGoToPage = (item) => {
  if (item.isChain) window.open(item.path, "_blank");
  else Router.push(item.path);
};
</script>

<style lang="scss" scoped></style>
