<template>
  <div class="printAppVersion">
    <vxe-toolbar custom ref="toolbarRef">
      <template #buttons>
        <el-button type="primary" @click="show = true">
          <template #icon>
            <i-add-one theme="outline" size="24" fill="#fff" />
          </template>
          上传版本
        </el-button>
      </template>
    </vxe-toolbar>
    <vxe-table :column-config="{ resizable: true }" border ref="tableRef" :data="versionList">
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
      <vxe-column title="操作" width="240">
        <template #default="{ row }">
          <vxe-button mode="text" v-if="row.state == 0" icon="vxe-icon-edit" style="color: #3883fa; font-weight: 900" @click="editEvent(row)">
            上线
          </vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <newVersion v-model="show" />
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { ref } from "vue";
import newVersion from "./components/newVersion.vue";

const versionList = ref([]);

onMounted(() => {
  $axios.get("/printApp/getVersionList").then(({ data }) => {
    versionList.value = data;
  });
});

const show = ref(false);
</script>

<style lang="scss" scoped></style>
