<template>
  <div id="loginPage" v-show="state.show">
    <div class="formBox fc c">
      <h1 class="formHeader c">LOGIN</h1>
      <el-form :model="state.user" :rules="state.rules" ref="ruleFormRef" @keydown.enter="handleLogin(ruleFormRef)">
        <el-form-item prop="username">
          <div class="c">
            <i-people theme="outline" class="icon" />
            <el-input v-model="state.user.username" style="width: 240px" placeholder="账号"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div class="c">
            <i-lock theme="outline" class="icon" />
            <el-input v-model="state.user.password" style="width: 240px" type="password" placeholder="密码"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="loginBtn" type="primary" size="large" :loading="state.loginLoading" @click="handleLogin(ruleFormRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import Router from "@/router/index.js";
import userStore from "@/store/modules/userStore.js";
const { token, userInfo } = storeToRefs(userStore());
const state = ref({
  show: true,
  loginLoading: false,
  user: {
    username: "",
    password: "",
  },
  rules: {
    username: [{ required: true, message: "请输入您的账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  },
});

const ruleFormRef = ref();

function handleLogin(form) {
  form.validate((valid) => {
    if (!valid) return;
    state.value.loginLoading = true;
    const obj = { ...state.value.user };
    $axios
      .post("/user/login", obj)
      .then(({ data }) => {
        token.value = data.token;
        userInfo.value = data;
        Router.replace("/");
        ElMessage({
          message: "登录成功",
          type: "success",
        });
        state.value.show = false;
        state.value.loginLoading = false;
      })
      .catch((err) => {
        state.value.show = true;
        state.value.loginLoading = false;
      });
  });
}
</script>

<style lang="scss" scoped>
#loginPage {
  width: 100%;
  height: 100%;
  position: relative;

  .formBox {
    width: 360px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);

    .formHeader {
      margin-bottom: 20px;
      letter-spacing: 10px;
    }

    .loginBtn {
      width: 100%;
    }
  }
}
.icon {
  margin-right: 10px;
}
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
