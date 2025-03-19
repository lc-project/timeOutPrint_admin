<template>
  <div class="shop">
    <vxe-toolbar custom ref="toolbarRef">
      <template #buttons>
        <el-button type="primary" @click="add">
          <template #icon>
            <i-add-one theme="outline" size="24" fill="#fff" />
          </template>
          新增
        </el-button>
      </template>
    </vxe-toolbar>
    <vxe-table :column-config="{ resizable: true }" border ref="tableRef" :data="tableData" style="margin-top: 10px">
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="username" title="店铺账号"></vxe-column>
      <vxe-column field="name" title="店铺名称"></vxe-column>
      <vxe-column field="code" title="店铺编码"></vxe-column>
      <vxe-column field="brandName" title="店铺品牌"></vxe-column>
      <vxe-column title="操作" width="200">
        <template #default="{ row }">
          <vxe-button mode="text" icon="vxe-icon-edit" style="color: #3883fa; font-weight: 900" @click="editEvent(row)">编辑</vxe-button>
          <vxe-button mode="text" icon="vxe-icon-delete" style="color: red; font-weight: 900" @click="removeEvent(row)">删除</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      @page-change="shop().getDataApi()"
      background
      v-model:current-page="pageValue.page"
      v-model:page-size="pageValue.limit"
      :total="pageValue.total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"></vxe-pager>
    <newShop v-model="shopShow" />
  </div>
</template>

<script setup>
import newShop from "./components/newShop.vue";
import shop from "./store.js";
const { tableData, shopForm, pageValue } = storeToRefs(shop());
onMounted(() => {
  shop().getDataApi();
});

const shopShow = ref(false);

function add() {
  shopForm.value = {
    state: "新增",
  };
  shopShow.value = true;
}

function editEvent(row) {
  shopForm.value = {
    state: "编辑",
    ...row,
  };
  shopShow.value = true;
}

function removeEvent(row) {}
</script>

<style lang="scss" scoped></style>
