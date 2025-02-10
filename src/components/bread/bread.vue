<template>
  <div class="bread">
    <div class="path">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in state.breadcrumb" :key="item.name">{{ item.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tags nw">
      <el-tag
        size="small"
        @click="Router.push(item.path)"
        :type="Router.currentRoute.value.path == item.path ? 'primary' : 'info'"
        closable
        v-for="(item, index) in tagList"
        :key="index"
        @close="tagList.splice(index, 1)">
        {{ item.title }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const Router = useRouter();
import userStore from "@/store/modules/userStore.js";
const { tagList } = storeToRefs(userStore());

const state = ref({
  breadcrumb: [],
});

watch(
  () => Router.currentRoute.value.path,
  (n, o) => {
    const data = Router.currentRoute.value;
    state.value.breadcrumb = data.matched;
    if (!tagList.value.map((i) => i.path).includes(data.path)) {
      tagList.value.push({
        path: data.path,
        title: data.meta.title,
      });
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.bread {
  padding: 10px;
  .path {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .tags {
    & > * {
      cursor: pointer;
      margin: 5px;
    }
  }
}
</style>
