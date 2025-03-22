<template>
  <div class="printAppVersion">
    <vxe-toolbar custom ref="toolbarRef">
      <template #buttons>
        <el-button type="primary" @click="uploadVersion">
          <template #icon>
            <i-add-one theme="outline" size="24" fill="#fff" />
          </template>
          上传版本
        </el-button>
      </template>
    </vxe-toolbar>
    <vxe-table :column-config="{ resizable: true }" border ref="tableRef" :data="tableData">
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="version" title="版本号"></vxe-column>
      <vxe-column field="log" title="更新日志"></vxe-column>
      <vxe-column field="path" title="文件路径"></vxe-column>
      <vxe-column field="uploadTime" title="上传时间">
        <template #default="{ row }">
          {{ dayjs(Number(row.uploadTime)).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </vxe-column>
      <vxe-column field="state" title="状态">
        <template #default="{ row }">
          <el-tag type="info" v-if="row.state == 0">下线</el-tag>
          <el-tag type="success" v-if="row.state == 1">上线</el-tag>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="150" align="center">
        <template #default="{ row }">
          <vxe-button mode="text" v-if="row.state == 0" icon="vxe-icon-edit" style="color: #3883fa; font-weight: 900" @click="editEvent(row)">
            上线
          </vxe-button>
          <vxe-button mode="text" icon="vxe-icon-download" style="color: #3883fa; font-weight: 900" @click="download(row)">下载</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <newVersion v-model="printAppVersionShow" :form="form" />
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { ref } from "vue";
import newVersion from "./components/newVersion.vue";
import printAppVersion from "./store.js";
const { tableData } = storeToRefs(printAppVersion());
const printAppVersionShow = ref(false);

const form = ref({});

function uploadVersion() {
  form.value = {};
  printAppVersionShow.value = true;
}

function editEvent(row) {
  ElMessageBox.confirm("是否确定上线", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $axios
      .post("/printApp/goOnline", {
        id: row.id,
      })
      .then(() => {
        ElMessage({
          message: "上线成功",
          type: "success",
        });
        printAppVersion().getDataApi();
      });
  });
}

function download(row) {
  let file = row.version + ".apk.1";
  $axios
    .post("/printApp/download", {
      version: file,
    })
    .then((response) => {
      const url = response.data;
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = row.name; // 确保这里的文件名是正确的
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // 在点击后移除元素
      window.URL.revokeObjectURL(url);
    });
}

onMounted(() => {
  printAppVersion().getDataApi();
});
</script>

<style lang="scss" scoped></style>
