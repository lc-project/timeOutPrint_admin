<template>
  <div class="newShop">
    <el-dialog v-model="shopShow" :title="shopForm.state" style="max-width: 600px">
      <div class="data">
        <el-form label-width="auto" :rules="rules" :model="shopForm" ref="formRef">
          <el-form-item label="店铺账号" prop="username">
            <el-input v-model="shopForm.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="店铺密码" prop="password">
            <el-input v-model="shopForm.password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="shopForm.name" placeholder="请输入店铺名称" />
          </el-form-item>
          <el-form-item label="店铺编码" prop="code">
            <el-input v-model="shopForm.code" placeholder="请输入店铺编码" />
          </el-form-item>
          <el-form-item label="店铺品牌" prop="brandId" v-if="userInfo.identity == '超级管理员'">
            <el-input v-model="shopForm.brandName" placeholder="请选择品牌">
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
      <brandData v-model="brandShow" />
    </el-dialog>
  </div>
</template>

<script setup>
import userStore from "@/store/modules/userStore.js";
const { userInfo } = storeToRefs(userStore());
import brandData from "@/components/brandSelector/brandData.vue";
import shop from "../store.js";
const { shopForm } = storeToRefs(shop());

const brandShow = ref(false);

const shopShow = defineModel();
const formRef = ref(null);

const rules = ref({
  username: [
    { required: true, message: "请输入店铺账号", trigger: "blur" },
    { min: 5, max: 20, message: "账号长度为5-20", trigger: "blur" },
  ],
  name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入店铺编码", trigger: "blur" }],
  brandId: [{ required: true, message: "请选择品牌", trigger: "blur" }],
});

function keep() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const stop = $dialogLoading();
      if (!shopForm.value.id) {
        $axios
          .post("/shop/addShop", {
            code: shopForm.value.code,
            username: shopForm.value.username,
            password: shopForm.value.password,
            name: shopForm.value.name,
            brandId: shopForm.value.brandId,
          })
          .then(({ data }) => {
            stop();
            ElMessage.success(data);
            shop().getDataApi();
            shopShow.value = false;
          });
      } else {
        $axios
          .post("/shop/updateShop", {
            id: shopForm.value.id,
            code: shopForm.value.code,
            username: shopForm.value.username,
            password: shopForm.value.password,
            name: shopForm.value.name,
            brandId: shopForm.value.brandId,
          })
          .then(({ data }) => {
            stop();
            ElMessage.success(data);
            shop().getDataApi();
            shopShow.value = false;
          });
      }
    }
  });
}
</script>

<style lang="scss" scoped></style>
