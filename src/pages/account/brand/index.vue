<template>
  <div class="account">
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
    <vxe-table :column-config="{ resizable: true }" border ref="tableRef" :data="tableData">
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="username" title="账号"></vxe-column>
      <vxe-column field="identity" title="身份"></vxe-column>
      <vxe-column field="brandName" title="店铺品牌"></vxe-column>
      <vxe-column title="操作" width="150">
        <template #default="{ row }">
          <vxe-button mode="text" icon="vxe-icon-edit" style="color: #3883fa; font-weight: 900" @click="editEvent(row)">编辑</vxe-button>
          <vxe-button mode="text" icon="vxe-icon-delete" style="color: red; font-weight: 900" @click="removeEvent(row)">删除</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      @page-change="account().getDataApi()"
      background
      v-model:current-page="pageValue.page"
      v-model:page-size="pageValue.limit"
      :total="pageValue.total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"></vxe-pager>
    <newAccount v-model="accountShow" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import account from "../store.js";
import newAccount from "../components/newAccount.vue";
const { tableData, pageValue, identity, accountForm } = storeToRefs(account());

const accountShow = ref(false);

onMounted(() => {
  identity.value = "品牌管理员";
  account().getDataApi();
});
function add() {
  accountForm.value = {
    identity: "品牌管理员",
    authId: 2,
    state: "新增",
  };
  accountShow.value = true;
}
function editEvent(row) {
  accountForm.value = {
    state: "编辑",
    ...row,
    authId: 2,
    password: "",
  };
  accountShow.value = true;
}
function removeEvent(row) {
  const id = row.id;
  ElMessageBox.confirm("是否删除", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $axios
      .post("/account/delAccount", {
        id: id,
      })
      .then(() => {
        if (tableData.value.length === 1 && pageValue.value.page !== 1) {
          pageValue.value.page--;
        }
        ElMessage({
          message: "删除成功",
          type: "success",
        });
        account().getDataApi();
      });
  });
}
</script>

<style lang="scss" scoped></style>
