<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
    <div class="container"
    >
      <!-- 左侧Logo -->
      <router-link class="navbar-brand" to="/">
        <img src="../assets/img/logo.png" style="width: 35px"/>
      </router-link>

      <!-- 汉堡菜单按钮 -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-target="#navbarNav"
        data-bs-toggle="collapse"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 导航菜单 -->
      <div :class="isShow?'collapse navbar-collapse show':'collapse navbar-collapse'" id="navbarNav">
        <!-- 右侧导航菜单 - 使用ms-auto实现右对齐 -->
        <ul class="navbar-nav ms-auto">
          <template v-for="item in props.nav_items">
            <li class="nav-item" :key="item.path" v-if="item.type <= user.isAdmin">
              <router-link :to="item.path" :class="'nav-link ' + isActive(item.path)">
                <i :class="item.icon + ' me-2'"></i>
                {{ item.name }}
              </router-link>
            </li>
          </template>
          <li class="nav-item" v-if="!user.is_login">
            <router-link
              to="/login"
              class="nav-link not_login"
              style="border-radius: 10px"
            ><i class="fas fa-sign-in-alt me-2"></i>登录
            </router-link
            >
          </li>
          <li class="nav-item" v-if="user.is_login">
            <router-link
              to="/profile"
              class="nav-link login"
            ><i class="fas fa-sign-out-alt me-2"></i>{{ user.username }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useGlobalStore} from "@/config/global";
import {type RouteRecordName, useRoute} from 'vue-router'

const globalStore = useGlobalStore();
let isShow = ref(false);

const props = defineProps<{
  nav_items: Array<{
    name: RouteRecordName
    path: string
    icon: string
    type: number
  }>
}>()

const currentRoute = useRoute()

const isActive = (path: string) => {
  if (path === currentRoute.path) {
    return 'active'
  } else {
    return ''
  }
}

const user = globalStore.user;

const navbarNavShow = () => {
  isShow.value =!isShow.value
}

</script>

<style scoped>
.navbar {
  background: rgba(13, 17, 23, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.4s ease;
}
.navbar-brand {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.8rem;
  color: #4dabf7 !important;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  color: #74c0fc !important;
  transform: scale(1.03);
}

.logo-icon {
  font-size: 2rem;
  margin-right: 12px;
  color: #74c0fc;
}

.nav-link {
  font-weight: 500;
  padding: 8px 15px !important;
  margin: 0 5px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.85) !important;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(77, 171, 247, 0.15);
  color: #74c0fc !important;
}

.navbar-toggler {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.4);
}
.login,
.login:hover {
  background: rgba(255,0,0,.6);
  color: #fff !important;
}

.not_login,
.not_login:hover {
  background: rgba(14, 224, 113, 0.6);
  color: #fff !important;
}
</style>
