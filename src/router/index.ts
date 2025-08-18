import { createRouter, createWebHistory } from 'vue-router'
import MyIndex from '@/views/MyIndex.vue'
import MyAbout from '@/views/MyAbout.vue'
import Login from '@/views/Auth/Login.vue'
import Register from '@/views/Auth/Register.vue'
import ForgotPassword from '@/views/Auth/ForgotPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: '首页',
      path: '/',
      component: MyIndex,
      meta: {
        icon: 'fas fa-home',
        type: 0b0000
      },
    },
    {
      name: '随笔记',
      path: '/essay',
      component: MyAbout,
      meta: {
        icon: 'fas fa-info-circle',
        type: 0b0000
      },
    },
    {
      name: '联系',
      path: '/contact',
      component: MyIndex,
      meta: {
        icon: 'fas fa-phone',
        type: 0b0000
      },
    },
    {
      name: '管理',
      path: '/admin',
      component: MyIndex,
      meta: {
        icon: 'fas fa-cog',
        type: 0b0001,
      },
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/forgot-password',
      component: ForgotPassword,
    },
  ],
})

export default router
