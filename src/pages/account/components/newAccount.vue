<template>
  <div class="account">
    <el-dialog v-model="accountShow" :title="form.state" style="max-width: 600px">
      <div class="form">
        <el-form label-width="auto" :rules="rules" :model="form" ref="formRef">
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="form.name" placeholder="输入名称" />
          </el-form-item>
          <el-form-item label="用户账号" prop="username">
            <el-input v-model="form.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="店铺名称" prop="storeName">
            <el-input v-model="form.storeName" placeholder="请输入店铺名称" />
          </el-form-item>
          <el-form-item label="店铺编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入店铺编码" />
          </el-form-item>
          <el-form-item label="店铺品牌" prop="brandId"></el-form-item>
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
import account from "../store.js";
const { form } = storeToRefs(account());

const formRef = ref(null);

const accountShow = defineModel();
const rules = ref({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 5, max: 20, message: "账号长度为5-20", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度为5-20", trigger: "blur" },
  ],
  storeName: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入店铺编码", trigger: "blur" }],
  brandId: [{ required: true, message: "请选择品牌", trigger: "blur" }],
});

function keep() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log("%c Line:59 🌶", "background:#7f2b82");
      accountShow.value = false;
    }
  });
}
</script>

<style lang="scss" scoped></style>
