<template>
  <div class="restoreData">
    <el-dialog v-model="restoreShow" title="是否确认还原数据" style="max-width: 400px">
      <div class="ac">
        <i-attention theme="outline" size="20" fill="#e6a23c" />
        <span style="color: #e6a23c; margin-left: 5px">注意：数据还原后，之前的操作的数据一律不会保留</span>
      </div>
      <el-dialog v-model="innerVisible" style="max-width: 500px" title="再一次确认是否还原数据" append-to-body>
        <div class="ac">
          <i-attention theme="outline" size="20" fill="#e6a23c" />
          <span style="color: #e6a23c; margin-left: 5px">注意：数据还原后，之前的操作的数据一律不会保留</span>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="keep">确认</el-button>
          </div>
        </template>
      </el-dialog>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="innerVisible = true">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import home from "../store.js";
const restoreShow = defineModel();

const innerVisible = ref(false);

function keep() {
  ElMessageBox.confirm("是否确定还原数据", {
    confirmButtonText: "还原",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const { data } = await $axios.get("/printList/getPrintList");
    const stop = $dialogLoading();
    $axios
      .post("/printData/addPrintData", {
        data: data,
      })
      .then(({ data }) => {
        stop();
        ElMessage.success("还原成功");
        innerVisible.value = false;
        restoreShow.value = false;
        home().getPrintData();
      })
      .catch(() => stop());
  });
}
</script>

<style lang="scss" scoped></style>
