<template>
  <div class="account">
    <el-dialog v-model="accountShow" :title="accountForm.state" style="max-width: 600px">
      <div class="form">
        <el-form label-width="auto" :rules="rules" :model="accountForm" ref="formRef">
          <el-form-item label="用户身份" prop="identity" >
            <el-input v-model="accountForm.identity" placeholder="输入身份"  disabled />
          </el-form-item>
          <el-form-item label="用户账号" prop="username">
            <el-input v-model="accountForm.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="accountForm.password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="店铺品牌" prop="brandId" v-if="identity !== '超级管理员'">
            <el-input v-model="accountForm.brandName" placeholder="请选择品牌">
              <template #append>
                <el-button @click="brandShow = true">选择品牌</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="keep">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <brandData v-model="brandShow" />
  </div>
</template>

<script setup>
import brandData from "@/components/brandSelector/brandData.vue";
import account from "../store.js";
const { accountForm, identity } = storeToRefs(account());

const formRef = ref(null);

const brandShow = ref(false);

const accountShow = defineModel();
const rules = ref({
  identity: [{ required: true, message: "请输入名称", trigger: "blur" }],
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 5, max: 20, message: "账号长度为5-20", trigger: "blur" },
  ],
  brandId: [{ required: true, message: "请选择品牌", trigger: "blur" }],
});

function keep() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const stop = $dialogLoading();
      if (!accountForm.value.id) {
        $axios
          .post("/account/saveAccount", {
            identity: accountForm.value.identity,
            username: accountForm.value.username,
            password: accountForm.value.password,
            authId: accountForm.value.authId,
            brandId: accountForm.value.brandId,
          })
          .then(({ data }) => {
            stop();
            ElMessage.success(data);
            account().getDataApi();
            accountShow.value = false;
          });
      } else {
        $axios
          .post("/account/updateAccount", {
            id: accountForm.value.id,
            identity: accountForm.value.identity,
            username: accountForm.value.username,
            authId: accountForm.value.authId,
            password: accountForm.value.password,
            brandId: accountForm.value.brandId,
          })
          .then(({ data }) => {
            stop();
            ElMessage.success(data);
            account().getDataApi();
            accountShow.value = false;
          });
      }
    }
  });
}
</script>

<style lang="scss" scoped></style>
