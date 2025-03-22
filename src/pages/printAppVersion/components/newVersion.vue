<template>
  <div class="newVersion">
    <el-dialog v-model="printAppVersionShow" title="版本管理" style="max-width: 600px">
      <div class="form">
        <el-form label-width="auto" :model="prop.form">
          <el-form-item label="更新日志" prop="log">
            <el-input v-model="prop.form.log" :rows="2" type="textarea" placeholder="输入更新日志" />
          </el-form-item>
          <el-form-item label="版本号" prop="version">
            <el-input v-model="prop.form.version" placeholder="输入版本号">
              <template #append>
                <el-button @click="open" :disabled="isButtonDisabled">上传文件</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import axios from "axios";
import printAppVersion from "../store.js";
import { useFileDialog } from "@vueuse/core";
const { files, open, reset, onChange } = useFileDialog();
onChange((files) => {
  if (files) readExcel(files[0]);
});
const isButtonDisabled = computed(() => {
  return !prop.form.version || !prop.form.log;
});
async function readExcel(file) {
  const loading = ElLoading.service({
    lock: true,
    text: "上传文件中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  $axios
    .post("/printApp/getOSSFileToken", {
      version: prop.form.version,
    })
    .then(({ data: OSSToken }) => {
      const { url, fileName } = OSSToken;
      const reader = new FileReader();
      reader.onload = function (file) {
        const arrayBuffer = file.target?.result;
        axios.put(url, arrayBuffer).then(async () => {
          await $axios.post("/printApp/uploadPrinApp", {
            path: fileName,
            log: prop.form.log,
            version: prop.form.version,
          });
          ElMessage.success("文件上传成功!");
          loading.close();
          printAppVersion().getDataApi();
          printAppVersionShow.value = false;
        });
      };
      reader.readAsArrayBuffer(file);
    });
}
const emit = defineEmits(["confirm"]);

const prop = defineProps({
  form: {
    type: Object,
  },
});

const printAppVersionShow = defineModel();
</script>

<style lang="scss" scoped></style>
