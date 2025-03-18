<template>
  <div class="brandData">
    <el-dialog v-model="brandShow" title="品牌选择器" style="max-width: 800px" destroy-on-close>
      <div class="data">
        <brand @confirm="setBrand" :type="type" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import brand from "@/pages/brandManage/index.vue";
import account from "../store.js";
const { form } = storeToRefs(account());
const type = ref(true);

const brandShow = defineModel();

function setBrand(value) {
  form.value.brandId = value.id;
  form.value.brandName = value.name;
  brandShow.value = false;
}
</script>

<style lang="scss" scoped></style>
