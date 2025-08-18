<template>
  <my-nav :nav_items="nav_items" />
  <router-view />
  <my-footer />
</template>

<script setup lang="ts">
import MyNav from '@/components/MyNav.vue'
import MyFooter from '@/components/MyFooter.vue'
const nav_items = [
  { name: '首页', path: '/', icon: 'fas fa-home' },
  { name: '关于我', path: '/about', icon: 'fas fa-info-circle' },
  { name: '联系我', path: '/t', icon: 'fas fa-phone' },
]
</script>

<style scoped>
body {
  min-height: 100vh;
}
</style>
