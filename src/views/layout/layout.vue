<template>
  <div class="common-layout">
    <el-container class="common-layout-container">
      <el-aside class="common-layout-aside" width="200px">
        <div class="sysName c">
          <span style="margin-left: 5px">效期打印机后台管理</span>
        </div>
        <div class="menu">
          <Menu :menuList="userStore.routeData"></Menu>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <Header @renew="refresh"></Header>
        </el-header>
        <el-main id="main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" v-if="refreshShow" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Menu from "@/components/menu/menu.vue";
import Header from "@/components/header/header.vue";
import useStore from "@/store/modules/userStore.js";
const userStore = useStore();
const refreshShow = ref(true);
async function refresh() {
  refreshShow.value = false;
  await nextTick();
  refreshShow.value = true;
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 500px) {
  .common-layout-aside {
    width: 0;
  }
}
.common-layout,
.common-layout-container {
  width: 100%;
  height: 100%;

  .common-layout-aside {
    position: relative;
    background: #3883fa;

    .sysName {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 60px;
      text-align: center;
      color: #fff;
      .logo {
        width: 50px;
        height: 50px;
        filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.5));
      }
      span {
        margin-top: 5px;
        margin-left: 5px;
      }
    }

    .menu {
      height: 100%;
      padding-top: 60px;
    }
  }

  .el-header {
    border-bottom: 1px solid #dedede;
    height: 70px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
