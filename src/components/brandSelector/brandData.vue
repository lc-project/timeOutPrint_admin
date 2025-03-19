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
import account from "@/pages/account/store.js";
const { accountForm } = storeToRefs(account());
import shop from "@/pages/shop/store.js";
const { shopForm } = storeToRefs(shop());
const type = ref(true);

const brandShow = defineModel();

function setBrand(value) {
  accountForm.value.brandId = value.id;
  accountForm.value.brandName = value.name;
  shopForm.value.brandId = value.id;
  shopForm.value.brandName = value.name;
  brandShow.value = false;
}
</script>

<style lang="scss" scoped></style>
