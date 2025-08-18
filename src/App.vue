<template>
  <my-nav :nav_items="nav_items" :Permissions="Permissions" />
  <router-view />
  <my-footer />
</template>

<script setup lang="ts">
import router from './router'
import MyNav from '@/components/MyNav.vue'
import MyFooter from '@/components/MyFooter.vue'
import type { RouteRecordName } from 'vue-router'

const nav_items: { name: RouteRecordName; path: string; icon: string; type: number }[] = []
const Permissions = 0 // 假设权限级别为1，实际应用中可以根据用户登录状态动态获取
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
