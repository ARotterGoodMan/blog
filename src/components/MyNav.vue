<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <img src="../assets/img/logo.png" style="width: 35px" alt=""/>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <template v-for="item in props.nav_items" :key="item.path">
            <li class="nav-item" v-if="item.type <= user.isAdmin">
              <router-link
                :to="item.path"
                class="nav-link"
                :class="{ active: isActive(item.path) }"
              >
                <i :class="item.icon + ' me-2'"></i>{{ item.name }}
              </router-link>
            </li>
          </template>

          <li class="nav-item" v-if="!user.is_login">
            <router-link to="/login" class="nav-link not_login">
              <i class="fas fa-sign-in-alt me-2"></i>登录
            </router-link>
          </li>

          <li class="nav-item dropdown" v-if="user.is_login">
            <a
              class="nav-link dropdown-toggle login"
              href="#"
              id="navbardrop"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fas fa-user me-2"></i>{{ user.username }}
            </a>
            <div class="dropdown-menu">
              <router-link class="dropdown-item" to="#" @click="toggleLogout">退出</router-link>
              <router-link class="dropdown-item" to="/profile">个人信息</router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import router from "@/router";
import {useGlobalStore} from "@/config/global";
import {Serverd} from "@/tools/Server.ts";
import {type RouteRecordName, useRoute} from 'vue-router'


const global = useGlobalStore();
const props = defineProps<{
  nav_items: Array<{
    name: RouteRecordName
    path: string
    icon: string
    type: number
  }>
}>()

const currentRoute = useRoute()
const user = global.user;

const isActive = (path: string) => path === currentRoute.path;


function toggleLogout() {
  sessionStorage.removeItem('user')
  Serverd.logout()
  global.setUser({
    username: '',
    email: '',
    avatar: '',
    isAdmin: 0,
    token: '',
    is_login: false
  })
  router.push('/')
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
  background: rgba(255, 0, 0, .6);
  color: #fff !important;
}

.not_login,
.not_login:hover {
  background: rgba(14, 224, 113, 0.6);
  color: #fff !important;
}


.dropdown-menu {
  background-color: rgba(30, 30, 40, 0.95);
  border-radius: 10px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.25s ease;
  visibility: hidden;
  display: block;
  position: absolute;
}

.dropdown-menu.show {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}


.dropdown-menu {
  display: none;
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
  transition: all 0.25s ease;
  transform-origin: top;
}

.dropdown-menu.show {
  display: block;
  opacity: 1;
  transform: translateY(0) scale(1);
}


.dropdown-menu .dropdown-item {
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.3s ease;
}

.dropdown-menu .dropdown-item:hover {
  background: rgba(77, 171, 247, 0.15);
  color: #74c0fc;
}
</style>
