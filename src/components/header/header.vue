<template>
  <div class="header f jb nw">
    <Bread></Bread>
    <div class="f ac box frr nw">
      <div class="user c nw">
        <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            {{ userStore().userInfo.username }}
            <i-to-bottom-one theme="outline" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="resRouter">刷新菜单</el-dropdown-item>
              <el-dropdown-item command="exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="menu ac nw">
        <i-refresh theme="outline" size="16" fill="#333" @click="refresh" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Bread from "@/components/bread/bread.vue";
import userStore from "@/store/modules/userStore.js";
const router = useRouter();
const commandFunc = {
  resRouter: () => {
    userStore().menuList = [];
    userStore().tagList = [];
    userStore().routeData = null;
    userStore().hasRoutes = false;
    location.reload();
  },
  exit: () => {
    userStore().token = "";
    localStorage.removeItem("user");
    ElMessage({
      message: "退出成功",
      type: "success",
    });
    router.push("/login");
  },
};

const handleCommand = (type) => {
  commandFunc[type] && commandFunc[type](type);
};
const emit = defineEmits(["renew"]);
function refresh() {
  emit("renew");
}
</script>

<style lang="scss" scoped>
.header {
  .box {
    width: 30%;
    .menu {
      margin-right: 10px;
      & > * {
        cursor: pointer;
      }
    }
    .user {
      .el-dropdown-link {
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
}
</style>
