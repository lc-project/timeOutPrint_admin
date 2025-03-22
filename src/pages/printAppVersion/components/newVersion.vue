<template>
  <div class="newVersion">
    <el-dialog v-model="show" :title="form.state" style="max-width: 600px">
      <div class="form">
        <el-form label-width="auto" :rules="rules" :model="form" ref="formRef">
          <el-form-item label="品牌名称" prop="name">
            <el-input v-model="form.name" placeholder="输入品牌名称" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="keep">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import brandManage from "../store.js";
const { form } = storeToRefs(brandManage());

const formRef = ref(null);

const brandShow = defineModel();
const rules = ref({
  name: [{ required: true, message: "输入品牌名称", trigger: "blur" }],
});

function keep() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const stop = $dialogLoading();
      if (!form.value.id) {
        $axios
          .post("/brand/saveBrand", {
            name: form.value.name,
          })
          .then(({ data }) => {
            stop();
            ElMessage.success(data);
            brandManage().getDataApi();
            brandShow.value = false;
          });
      } else {
        $axios
          .post("/brand/updateBrand", {
            id: form.value.id,
            name: form.value.name,
          })
          .then(({ data }) => {
            stop();
            ElMessage.success(data);
            brandManage().getDataApi();
            brandShow.value = false;
          });
      }
    }
  });
}
</script>

<style lang="scss" scoped></style>
