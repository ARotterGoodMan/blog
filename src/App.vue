<template>
  <my-nav :nav_items="nav_items" />
  <router-view />
  <my-footer />
</template>

<script setup lang="ts">
import router from './router'
import MyNav from '@/components/MyNav.vue'
import MyFooter from '@/components/MyFooter.vue'
import type { RouteRecordName } from 'vue-router'
import {useGlobalStore} from "@/config/global.ts";

if (JSON.parse(<string>sessionStorage.getItem("user"))) {
  console.log(JSON.parse(<string>sessionStorage.getItem("user")))
  const data = JSON.parse(<string>sessionStorage.getItem("user"));
  useGlobalStore().setUser({
    username: data.username,
    email: data.email,
    phone: data.phone,
    token: data.token,
    avatar: data.avatar,
    isAdmin: data.isAdmin,
    is_login: data.is_login
  });
}

const nav_items: { name: RouteRecordName; path: string; icon: string; type: number }[] = []
for (const route of router.getRoutes()) {
  if (route.meta.icon) {
    const nav_item = {
      name: route.name,
      path: route.path,
      icon: route.meta.icon.toString(),
      type: route.meta.type as number,
    }
    nav_items.push(nav_item)
  }
}
</script>

<style scoped></style>
